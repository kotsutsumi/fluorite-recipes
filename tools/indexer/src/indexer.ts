import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

import { chunkText } from "./chunker.js";
import { resolveConfig, type IndexerConfigOptions } from "./config.js";
import { generatePlaceholderEmbeddings } from "./embedder.js";
import { normalizeText } from "./normalize.js";
import { extractWithTika } from "./tika-client.js";
import { PackDatabase, type DocRecord } from "./sqlite-writer.js";

export interface IndexFileOptions extends IndexerConfigOptions {
  sourceBase?: string;
}

export interface IndexFileResult {
  packPath: string;
  docId: number;
  chunkCount: number;
  tokens: number;
}

async function computeFileHash(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  const handle = await fs.open(filePath, "r");
  try {
    const stream = handle.createReadStream();
    await new Promise<void>((resolve, reject) => {
      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve());
    });
  } finally {
    await handle.close();
  }
  return hash.digest("hex");
}

function deriveTitle(text: string, fallbackName: string): string {
  const lines = text.split("\n").map((line) => line.trim());
  const meaningful = lines.find((line) => line.length > 0);
  if (meaningful) {
    return meaningful.slice(0, 140);
  }
  return fallbackName;
}

function toRepoPath(absPath: string, root: string): string | undefined {
  const relative = path.relative(root, absPath);
  if (relative.startsWith("..")) {
    return undefined;
  }
  return relative.split(path.sep).join("/");
}

const TEXTUAL_EXTENSIONS = new Set([
  ".md",
  ".mdx",
  ".txt",
  ".html",
  ".htm",
]);

function buildSourceUrl(
  repoPath: string | undefined,
  sourceBase?: string,
): string | undefined {
  if (!repoPath || !sourceBase) return undefined;
  if (!sourceBase.endsWith("/")) {
    return `${sourceBase}/${repoPath}`;
  }
  return `${sourceBase}${repoPath}`;
}

export async function indexFile(
  filePath: string,
  options: IndexFileOptions = {},
): Promise<IndexFileResult> {
  const absolutePath = path.resolve(filePath);
  const stats = await fs.stat(absolutePath);
  if (!stats.isFile()) {
    throw new Error(`${filePath} is not a regular file`);
  }

  const config = resolveConfig(options);

  const ext = path.extname(absolutePath).toLowerCase();
  let text: string;
  let mime: string | undefined;
  try {
    const tikaResult = await extractWithTika(absolutePath, {
      endpoint: config.tikaUrl,
      timeoutMs: config.tikaTimeoutMs,
    });
    text = tikaResult.text;
    mime = tikaResult.mime;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("empty text") &&
      TEXTUAL_EXTENSIONS.has(ext)
    ) {
      text = await fs.readFile(absolutePath, "utf8");
      mime = "text/plain";
    } else {
      throw error;
    }
  }

  if (!text.trim() && TEXTUAL_EXTENSIONS.has(ext)) {
    text = await fs.readFile(absolutePath, "utf8");
    mime = "text/plain";
  }

  const normalized = normalizeText(text);
  if (!normalized) {
    throw new Error(
      `No text extracted from ${filePath}; check if the document requires a different extractor`,
    );
  }

  const chunks = chunkText(normalized, {
    targetTokens: config.chunkTargetTokens,
    overlapTokens: config.chunkOverlapTokens,
  });
  if (chunks.length === 0) {
    throw new Error(`Chunker produced no chunks for ${filePath}`);
  }

  const embeddings = await generatePlaceholderEmbeddings(
    chunks.length,
    config.embeddingDimension,
  );
  const chunkBuffers = embeddings.map((entry) => entry.buffer);

  const docHash = await computeFileHash(absolutePath);
  const repoPath = toRepoPath(absolutePath, config.rootDir);
  const docTitle = deriveTitle(chunks[0]?.text ?? "", path.basename(filePath));
  const fetchedAt = new Date().toISOString();

  const database = new PackDatabase(config.packPath);
  try {
    const docRecord: DocRecord = {
      title: docTitle,
      fetchedAt,
      hash: docHash,
    };
    if (repoPath) {
      docRecord.repoPath = repoPath;
    }
    const sourceUrl = buildSourceUrl(repoPath, options.sourceBase);
    if (sourceUrl) {
      docRecord.sourceUrl = sourceUrl;
    }
    if (mime) {
      docRecord.mime = mime;
    }

    const { docId, chunkCount } = database.persistDocument({
      doc: docRecord,
      chunks,
      embeddings: chunkBuffers,
      embeddingDimension: config.embeddingDimension,
    });

    const totalTokens = chunks.reduce((sum, chunk) => sum + chunk.tokens, 0);
    return {
      packPath: config.packPath,
      docId,
      chunkCount,
      tokens: totalTokens,
    };
  } finally {
    database.close();
  }
}
