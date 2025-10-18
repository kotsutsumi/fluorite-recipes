import path from "node:path";

export interface IndexerConfigOptions {
  tikaUrl?: string;
  tikaTimeoutMs?: number;
  rootDir?: string;
  packPath?: string;
  packDir?: string;
  packName?: string;
  chunkTargetTokens?: number;
  chunkOverlapTokens?: number;
  embeddingDimension?: number;
}

export interface IndexerConfig {
  tikaUrl: string;
  tikaTimeoutMs: number;
  rootDir: string;
  packPath: string;
  chunkTargetTokens: number;
  chunkOverlapTokens: number;
  embeddingDimension: number;
}

const DEFAULT_PACK_NAME = "fluorite-pack.sqlite3";

function resolvePackPath(options: IndexerConfigOptions): string {
  if (options.packPath) {
    return path.resolve(options.packPath);
  }
  const envPackPath = process.env.FLUORITE_PACK_PATH;
  if (envPackPath) {
    return path.resolve(envPackPath);
  }
  const rootDir = path.resolve(
    options.rootDir ?? process.env.FLUORITE_ROOT_DIR ?? process.cwd(),
  );
  const packDir = options.packDir ?? process.env.FLUORITE_PACK_DIR;
  const resolvedPackDir = path.isAbsolute(packDir ?? "")
    ? packDir!
    : path.resolve(rootDir, packDir ?? "packs");
  const packName =
    options.packName ??
    process.env.FLUORITE_PACK_NAME ??
    DEFAULT_PACK_NAME;
  const packFile =
    packName.endsWith(".sqlite") || packName.endsWith(".sqlite3")
      ? packName
      : `${packName}.sqlite3`;
  if (path.isAbsolute(packFile)) {
    return packFile;
  }
  return path.join(resolvedPackDir, packFile);
}

export function resolveConfig(
  options: IndexerConfigOptions = {},
): IndexerConfig {
  const tikaUrl =
    options.tikaUrl ?? process.env.FLUORITE_TIKA_URL ?? "http://localhost:9998";

  const parsedTimeout =
    options.tikaTimeoutMs ??
    (process.env.FLUORITE_TIKA_TIMEOUT
      ? Number.parseInt(process.env.FLUORITE_TIKA_TIMEOUT, 10)
      : undefined);
  const tikaTimeoutMs = Number.isFinite(parsedTimeout)
    ? Number(parsedTimeout)
    : 60_000;
  if (!Number.isFinite(tikaTimeoutMs) || tikaTimeoutMs <= 0) {
    throw new Error("Invalid Tika timeout; provide a positive integer");
  }

  const rootDir = path.resolve(
    options.rootDir ?? process.env.FLUORITE_ROOT_DIR ?? process.cwd(),
  );

  const parsedChunkTokens =
    options.chunkTargetTokens ??
    (process.env.FLUORITE_CHUNK_TOKENS
      ? Number.parseInt(process.env.FLUORITE_CHUNK_TOKENS, 10)
      : undefined);
  const chunkTargetTokens = Number.isFinite(parsedChunkTokens)
    ? Number(parsedChunkTokens)
    : 800;
  if (!Number.isFinite(chunkTargetTokens) || chunkTargetTokens <= 0) {
    throw new Error("Chunk target tokens must be a positive integer");
  }

  const parsedOverlapTokens =
    options.chunkOverlapTokens ??
    (process.env.FLUORITE_CHUNK_OVERLAP
      ? Number.parseInt(process.env.FLUORITE_CHUNK_OVERLAP, 10)
      : undefined);
  const chunkOverlapTokens = Number.isFinite(parsedOverlapTokens)
    ? Number(parsedOverlapTokens)
    : 120;
  if (!Number.isFinite(chunkOverlapTokens) || chunkOverlapTokens < 0) {
    throw new Error("Chunk overlap tokens must be a non-negative integer");
  }

  const parsedEmbeddingDim =
    options.embeddingDimension ??
    (process.env.FLUORITE_EMBED_DIM
      ? Number.parseInt(process.env.FLUORITE_EMBED_DIM, 10)
      : undefined);
  const embeddingDimension = Number.isFinite(parsedEmbeddingDim)
    ? Number(parsedEmbeddingDim)
    : 384;
  if (!Number.isFinite(embeddingDimension) || embeddingDimension <= 0) {
    throw new Error("Embedding dimension must be a positive integer");
  }

  const packPath = resolvePackPath({ ...options, rootDir });

  return {
    tikaUrl,
    tikaTimeoutMs,
    rootDir,
    packPath,
    chunkTargetTokens,
    chunkOverlapTokens,
    embeddingDimension,
  };
}
