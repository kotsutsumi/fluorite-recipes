#!/usr/bin/env node
import { Command } from "commander";

import { resolveConfig, type IndexerConfigOptions } from "./src/config.js";
import { indexFile, type IndexFileOptions } from "./src/index.js";
import { pingTika } from "./src/tika-client.js";

function parseInteger(value: unknown, label: string): number | undefined {
  if (value == null) return undefined;
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be an integer`);
  }
  return parsed;
}

async function main(argv: string[]) {
  const program = new Command();
  program
    .name("fluorite-indexer")
    .description("Index a document via Apache Tika and store it in a SQLite pack")
    .argument("<file>", "Document path to ingest")
    .option("--tika-url <url>", "Apache Tika server URL")
    .option("--tika-timeout <ms>", "Tika request timeout in milliseconds")
    .option("--pack-path <file>", "Destination pack path (overrides dir/name)")
    .option("--pack-dir <dir>", "Directory for generated packs")
    .option("--pack-name <name>", "Logical pack filename")
    .option("--root <dir>", "Repository root for relative paths")
    .option("--chunk-target <tokens>", "Target chunk size in tokens")
    .option("--chunk-overlap <tokens>", "Chunk overlap in tokens")
    .option("--embed-dim <dim>", "Embedding vector dimension")
    .option("--source-base <url>", "Base URL used to populate docs.source_url")
    .option("--skip-ping", "Skip Tika health check");

  program.action(async (file: string, options: Record<string, unknown>) => {
    const configInput: IndexerConfigOptions = {};
    const tikaUrl = options.tikaUrl as string | undefined;
    if (tikaUrl) {
      configInput.tikaUrl = tikaUrl;
    }
    const tikaTimeout = parseInteger(options.tikaTimeout, "tika-timeout");
    if (tikaTimeout != null) {
      configInput.tikaTimeoutMs = tikaTimeout;
    }
    const packPath = options.packPath as string | undefined;
    if (packPath) {
      configInput.packPath = packPath;
    }
    const packDir = options.packDir as string | undefined;
    if (packDir) {
      configInput.packDir = packDir;
    }
    const packName = options.packName as string | undefined;
    if (packName) {
      configInput.packName = packName;
    }
    const rootDir = options.root as string | undefined;
    if (rootDir) {
      configInput.rootDir = rootDir;
    }
    const chunkTarget = parseInteger(options.chunkTarget, "chunk-target");
    if (chunkTarget != null) {
      configInput.chunkTargetTokens = chunkTarget;
    }
    const chunkOverlap = parseInteger(options.chunkOverlap, "chunk-overlap");
    if (chunkOverlap != null) {
      configInput.chunkOverlapTokens = chunkOverlap;
    }
    const embedDim = parseInteger(options.embedDim, "embed-dim");
    if (embedDim != null) {
      configInput.embeddingDimension = embedDim;
    }
    const indexOptions: IndexFileOptions = { ...configInput };
    const sourceBase = options.sourceBase as string | undefined;
    if (sourceBase) {
      indexOptions.sourceBase = sourceBase;
    }

    const resolved = resolveConfig(configInput);
    console.log(`🔧 Tika endpoint: ${resolved.tikaUrl}`);
    console.log(`📦 Pack path: ${resolved.packPath}`);

    if (!options.skipPing) {
      const healthy = await pingTika({
        endpoint: resolved.tikaUrl,
        timeoutMs: resolved.tikaTimeoutMs,
      });
      if (!healthy) {
        console.warn(
          `⚠️  Could not reach ${resolved.tikaUrl}/version; continuing anyway`,
        );
      }
    }

    const result = await indexFile(file, indexOptions);
    console.log(`✅ Indexed ${file}`);
    console.log(
      `   doc id=${result.docId}, chunks=${result.chunkCount}, tokens≈${result.tokens}`,
    );
    console.log(`   pack: ${result.packPath}`);
  });

  await program.parseAsync(argv);
}

main(process.argv).catch((error) => {
  console.error("❌ Indexing failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
