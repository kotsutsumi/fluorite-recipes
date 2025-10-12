export { chunkMarkdown } from "./chunker.js";
export { embedChunks } from "./embed.js";
export { ingestMarkdown } from "./ingest.js";
export { createManifest, writeManifest } from "./manifest.js";
export { writePack } from "./pack.js";
export { main as runCli } from "./cli.js";
export type {
  Chunk,
  ChunkMetadata,
  DocumentChunk,
  EmbeddingConfig,
  EmbeddingVector,
  PackManifest,
} from "./schema.js";
