export interface Chunk {
  id: string;
  /** Markdown text for the chunk */
  text: string;
  /** Estimated token count (simple heuristic) */
  tokenCount: number;
  /** ID of the document (=input file) the chunk belongs to */
  documentId: string;
  /** Zero-based order of this chunk within the document */
  ordinal: number;
}

export interface ChunkMetadata {
  id: string;
  file: string;
  /** Optional canonical URL pointing to the source (e.g. GitHub blob). */
  sourceUrl?: string;
  heading?: string;
  headingLevel?: number;
  anchors: string[];
  primaryAnchor?: string;
  product?: string;
  area?: string;
  version?: string;
  lang?: string;
  frontMatter?: Record<string, unknown>;
}

export interface DocumentChunk {
  chunk: Chunk;
  meta: ChunkMetadata;
}

export interface EmbeddingVector {
  id: string;
  /** Numeric vector in row-major order. */
  vector: number[];
}

export interface EmbeddingConfig {
  endpoint: string;
  model?: string;
  dimension?: number;
  apiKey?: string;
  batchSize?: number;
  timeoutMs?: number;
}

export interface BuildConfig {
  root?: string;
  include?: string[];
  exclude?: string[];
  outDir?: string;
  packName: string;
  sourceBase?: string;
  commit?: string;
  skipEmbeddings?: boolean;
  embed?: EmbeddingConfig;
  dryRun?: boolean;
}

export interface ManifestFileEntry {
  path: string;
  sha256: string;
  chunkCount: number;
}

export interface PackManifest {
  pack: string;
  createdAt: string;
  source: {
    root: string;
    commit?: string;
    include: string[];
    exclude: string[];
  };
  stats: {
    documents: number;
    chunks: number;
    tokensEstimated: number;
  };
  embedding?: {
    endpoint: string;
    model?: string;
    dimension?: number;
    count: number;
  };
  files: ManifestFileEntry[];
}
