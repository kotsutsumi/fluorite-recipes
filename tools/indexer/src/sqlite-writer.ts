import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import type { Database as DatabaseInstance, Statement } from "better-sqlite3";

import type { ChunkRecord } from "./chunker.js";

export interface DocRecord {
  sourceUrl?: string;
  repoPath?: string;
  title?: string;
  lang?: string;
  mime?: string;
  version?: string;
  docset?: string;
  publishedAt?: string;
  fetchedAt: string;
  hash: string;
}

export interface PersistDocumentOptions {
  doc: DocRecord;
  chunks: ChunkRecord[];
  embeddings: Buffer[];
  embeddingDimension: number;
}

function ensureDirectory(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function applyPragmas(db: DatabaseInstance) {
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
  db.pragma("foreign_keys = ON");
}

function initializeSchema(db: DatabaseInstance) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS docs (
      id INTEGER PRIMARY KEY,
      source_url TEXT,
      repo_path TEXT,
      title TEXT,
      lang TEXT,
      mime TEXT,
      version TEXT,
      docset TEXT,
      published_at TEXT,
      fetched_at TEXT NOT NULL,
      hash TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS chunks (
      id INTEGER PRIMARY KEY,
      doc_id INTEGER NOT NULL REFERENCES docs(id) ON DELETE CASCADE,
      ord INTEGER NOT NULL,
      text TEXT NOT NULL,
      code TEXT,
      heading_path TEXT,
      page_no INTEGER,
      tokens INTEGER,
      UNIQUE (doc_id, ord)
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
      text,
      content='chunks',
      content_rowid='id'
    );

    CREATE TABLE IF NOT EXISTS chunk_embeddings (
      rowid INTEGER PRIMARY KEY,
      embedding BLOB
    );
  `);
}

export class PackDatabase {
  private readonly db: DatabaseInstance;
  private readonly selectDocByHash: Statement;
  private readonly insertDoc: Statement;
  private readonly updateDoc: Statement;
  private readonly deleteChunkEmbeddings: Statement;
  private readonly deleteChunkFts: Statement;
  private readonly deleteChunks: Statement;
  private readonly insertChunk: Statement;
  private readonly insertChunkFts: Statement;
  private readonly insertEmbedding: Statement;

  constructor(packPath: string) {
    ensureDirectory(packPath);
    this.db = new Database(packPath);
    applyPragmas(this.db);
    initializeSchema(this.db);

    this.selectDocByHash = this.db.prepare(
      "SELECT id FROM docs WHERE hash = ?",
    );
    this.insertDoc = this.db.prepare(`
    INSERT INTO docs (
      source_url, repo_path, title, lang, mime, version, docset, published_at, fetched_at, hash
    ) VALUES (@sourceUrl, @repoPath, @title, @lang, @mime, @version, @docset, @publishedAt, @fetchedAt, @hash)
  `);
    this.updateDoc = this.db.prepare(`
    UPDATE docs SET
      source_url = @sourceUrl,
      repo_path = @repoPath,
      title = @title,
      lang = @lang,
      mime = @mime,
      version = @version,
      docset = @docset,
      published_at = @publishedAt,
      fetched_at = @fetchedAt
    WHERE id = @id
  `);
    this.deleteChunkEmbeddings = this.db.prepare(
      "DELETE FROM chunk_embeddings WHERE rowid IN (SELECT id FROM chunks WHERE doc_id = ?)",
    );
    this.deleteChunkFts = this.db.prepare(
      "DELETE FROM chunks_fts WHERE rowid IN (SELECT id FROM chunks WHERE doc_id = ?)",
    );
    this.deleteChunks = this.db.prepare(
      "DELETE FROM chunks WHERE doc_id = ?",
    );
    this.insertChunk = this.db.prepare(`
    INSERT INTO chunks (doc_id, ord, text, code, heading_path, page_no, tokens)
    VALUES (@docId, @ord, @text, @code, @headingPath, @pageNo, @tokens)
  `);
    this.insertChunkFts = this.db.prepare(`
    INSERT INTO chunks_fts (rowid, text) VALUES (@rowid, @text)
  `);
    this.insertEmbedding = this.db.prepare(`
    INSERT INTO chunk_embeddings (rowid, embedding) VALUES (@rowid, @embedding)
  `);
  }

  private buildInsertParams(doc: DocRecord) {
    return {
      sourceUrl: doc.sourceUrl ?? null,
      repoPath: doc.repoPath ?? null,
      title: doc.title ?? null,
      lang: doc.lang ?? null,
      mime: doc.mime ?? null,
      version: doc.version ?? null,
      docset: doc.docset ?? null,
      publishedAt: doc.publishedAt ?? null,
      fetchedAt: doc.fetchedAt,
      hash: doc.hash,
    };
  }

  private buildUpdateParams(doc: DocRecord, id: number) {
    const { hash: _omit, ...rest } = this.buildInsertParams(doc);
    return {
      ...rest,
      id,
    };
  }

  private upsertDoc(doc: DocRecord): number {
    const existing = this.selectDocByHash.get(doc.hash) as
      | { id: number }
      | undefined;
    if (existing) {
      this.updateDoc.run(this.buildUpdateParams(doc, Number(existing.id)));
      return Number(existing.id);
    }
    const result = this.insertDoc.run(this.buildInsertParams(doc));
    return Number(result.lastInsertRowid);
  }

  persistDocument({
    doc,
    chunks,
    embeddings,
    embeddingDimension,
  }: PersistDocumentOptions): { docId: number; chunkCount: number } {
    if (embeddings.length !== chunks.length) {
      throw new Error(
        `Embedding count (${embeddings.length}) does not match chunk count (${chunks.length})`,
      );
    }
    if (embeddingDimension > 0) {
      const expectedBytes = embeddingDimension * 4;
      embeddings.forEach((buffer, index) => {
        if (buffer.length !== expectedBytes) {
          throw new Error(
            `Embedding at index ${index} has ${buffer.length} bytes but expected ${expectedBytes}`,
          );
        }
      });
    }
    const docId = this.upsertDoc(doc);
    const tx = this.db.transaction(() => {
      this.deleteChunkEmbeddings.run(docId);
      this.deleteChunkFts.run(docId);
      this.deleteChunks.run(docId);

      chunks.forEach((chunk, index) => {
        const info = this.insertChunk.run({
          docId,
          ord: chunk.ord,
          text: chunk.text,
          code: chunk.code ?? null,
          headingPath: chunk.headingPath ?? null,
          pageNo: chunk.pageNo ?? null,
          tokens: chunk.tokens,
        });
        const rowid = Number(info.lastInsertRowid);
        this.insertChunkFts.run({
          rowid,
          text: chunk.text,
        });
        if (embeddingDimension > 0) {
          this.insertEmbedding.run({
            rowid,
            embedding: embeddings[index]!,
          });
        }
      });
    });
    tx();
    return { docId, chunkCount: chunks.length };
  }

  close() {
    this.db.close();
  }
}
