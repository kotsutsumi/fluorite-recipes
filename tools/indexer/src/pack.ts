import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import type { DocumentChunk, EmbeddingVector } from "./schema.js";
import type { ResolvedBuildConfig } from "./config.js";

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function toFloat32Buffer(vector: number[]): Buffer {
  const buffer = Buffer.allocUnsafe(vector.length * 4);
  for (let index = 0; index < vector.length; index += 1) {
    buffer.writeFloatLE(vector[index]!, index * 4);
  }
  return buffer;
}

interface PackWriterOptions {
  config: ResolvedBuildConfig;
  chunks: DocumentChunk[];
  embeddings: EmbeddingVector[];
  packPath: string;
}

export interface PackWriterResult {
  packPath: string;
  embeddingDimension?: number;
}

export function writePack({
  config,
  chunks,
  embeddings,
  packPath,
}: PackWriterOptions): PackWriterResult {
  ensureDir(path.dirname(packPath));

  const db = new Database(packPath);
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = OFF");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS chunks (
      id TEXT PRIMARY KEY,
      document_id TEXT NOT NULL,
      ordinal INTEGER NOT NULL,
      text TEXT NOT NULL,
      token_count INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS metadata (
      id TEXT PRIMARY KEY,
      file TEXT NOT NULL,
      source_url TEXT,
      heading TEXT,
      heading_level INTEGER,
      anchors TEXT,
      primary_anchor TEXT,
      product TEXT,
      area TEXT,
      version TEXT,
      lang TEXT,
      front_matter TEXT
    );
    CREATE VIRTUAL TABLE IF NOT EXISTS bm25 USING fts5(
      id UNINDEXED,
      text,
      content='chunks',
      content_rowid='rowid'
    );
    CREATE TABLE IF NOT EXISTS embeddings (
      id TEXT PRIMARY KEY,
      vector BLOB NOT NULL,
      dimension INTEGER NOT NULL
    );
  `);

  const insertChunk = db.prepare(
    "INSERT OR REPLACE INTO chunks (id, document_id, ordinal, text, token_count) VALUES (@id, @documentId, @ordinal, @text, @tokenCount)",
  );
  const insertMeta = db.prepare(
    "INSERT OR REPLACE INTO metadata (id, file, source_url, heading, heading_level, anchors, primary_anchor, product, area, version, lang, front_matter) VALUES (@id, @file, @sourceUrl, @heading, @headingLevel, @anchors, @primaryAnchor, @product, @area, @version, @lang, @frontMatter)",
  );
  const insertBm25 = db.prepare(
    "INSERT INTO bm25 (rowid, id, text) VALUES ((SELECT rowid FROM chunks WHERE id = @id), @id, @text)",
  );
  const insertEmbedding = db.prepare(
    "INSERT OR REPLACE INTO embeddings (id, vector, dimension) VALUES (@id, @vector, @dimension)",
  );

  const runInsert = db.transaction((docs: DocumentChunk[]) => {
    docs.forEach((entry) => {
      insertChunk.run({
        id: entry.chunk.id,
        documentId: entry.chunk.documentId,
        ordinal: entry.chunk.ordinal,
        text: entry.chunk.text,
        tokenCount: entry.chunk.tokenCount,
      });
      insertMeta.run({
        id: entry.meta.id,
        file: entry.meta.file,
        sourceUrl: entry.meta.sourceUrl ?? null,
        heading: entry.meta.heading ?? null,
        headingLevel: entry.meta.headingLevel ?? null,
        anchors: JSON.stringify(entry.meta.anchors ?? []),
        primaryAnchor: entry.meta.primaryAnchor ?? null,
        product: entry.meta.product ?? null,
        area: entry.meta.area ?? null,
        version: entry.meta.version ?? null,
        lang: entry.meta.lang ?? null,
        frontMatter: entry.meta.frontMatter
          ? JSON.stringify(entry.meta.frontMatter)
          : null,
      });
      insertBm25.run({
        id: entry.chunk.id,
        text: entry.chunk.text,
      });
    });
  });

  runInsert(chunks);

  const embeddingDimension =
    config.embed?.dimension ?? embeddings[0]?.vector.length;
  if (embeddings.length > 0) {
    if (!embeddingDimension) {
      throw new Error(
        "Embedding dimension could not be inferred; set --embedding-dim",
      );
    }
    const embedTx = db.transaction((vectors: EmbeddingVector[]) => {
      vectors.forEach((item) => {
        insertEmbedding.run({
          id: item.id,
          vector: toFloat32Buffer(item.vector),
          dimension: embeddingDimension,
        });
      });
    });
    embedTx(embeddings);
  }

  db.close();

  return { packPath, embeddingDimension };
}
