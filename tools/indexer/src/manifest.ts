import fs from "node:fs/promises";
import path from "node:path";

import type { ResolvedBuildConfig } from "./config.js";
import type { DocumentChunk, EmbeddingVector, PackManifest } from "./schema.js";

interface ManifestOptions {
  config: ResolvedBuildConfig;
  packPath: string;
  files: PackManifest["files"];
  chunks: DocumentChunk[];
  embeddings: EmbeddingVector[];
  embeddingDimension?: number;
}

export function createManifest({
  config,
  packPath,
  files,
  chunks,
  embeddings,
  embeddingDimension,
}: ManifestOptions): PackManifest {
  const tokens = chunks.reduce((acc, entry) => acc + entry.chunk.tokenCount, 0);

  const source: PackManifest["source"] = {
    root: config.root,
    include: config.include,
    exclude: config.exclude,
  };
  if (config.commit) {
    source.commit = config.commit;
  }

  let embeddingInfo: PackManifest["embedding"] | undefined;
  if (embeddings.length > 0) {
    embeddingInfo = {
      endpoint: config.embed?.endpoint ?? "manual",
      count: embeddings.length,
    };
    if (config.embed?.model) {
      embeddingInfo.model = config.embed.model;
    }
    const dimension =
      embeddingDimension ?? config.embed?.dimension ?? undefined;
    if (dimension != null) {
      embeddingInfo.dimension = dimension;
    }
  }

  return {
    pack: path.basename(packPath),
    createdAt: new Date().toISOString(),
    source,
    stats: {
      documents: files.length,
      chunks: chunks.length,
      tokensEstimated: tokens,
    },
    ...(embeddingInfo ? { embedding: embeddingInfo } : {}),
    files,
  };
}

export async function writeManifest(
  manifest: PackManifest,
  manifestPath: string,
) {
  const dir = path.dirname(manifestPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}
