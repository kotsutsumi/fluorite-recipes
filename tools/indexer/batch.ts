#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Command } from "commander";

import { runBatch, type BatchRunOptions } from "./src/batch.js";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(MODULE_DIR, "..", "..");

async function main(argv: string[]) {
  const program = new Command();
  program
    .name("fluorite-indexer-batch")
    .description("Batch index docs/ and userdata/ into a single SQLite pack")
    .option("--root <dir>", "Project root directory", DEFAULT_ROOT)
    .option("--pack-name <name>", "Logical pack filename", "fluorite-pack")
    .option("--pack-dir <dir>", "Directory for generated packs", "packs")
    .option("--pack-path <file>", "Absolute path for the pack (overrides dir/name)")
    .option("--tika-url <url>", "Apache Tika endpoint")
    .option("--tika-timeout <ms>", "Tika request timeout in milliseconds")
    .option("--chunk-target <tokens>", "Target chunk size in tokens")
    .option("--chunk-overlap <tokens>", "Chunk overlap in tokens")
    .option("--embed-dim <dim>", "Embedding vector dimension")
    .option("--source-base <url>", "Base URL for source links")
    .option("--docs-glob <pattern...>", "Override glob patterns for docs/")
    .option("--userdata-glob <pattern...>", "Override glob patterns for userdata/")
    .option("--ignore-glob <pattern...>", "Additional ignore globs")
    .option("--keep-pack", "Do not delete existing pack before writing")
    .option("--skip-ping", "Ignored for batch runs (kept for CLI parity)")
    .action(async (options: Record<string, unknown>) => {
      const batchOptions: BatchRunOptions = {
        rootDir: (options.root as string | undefined) ?? DEFAULT_ROOT,
        resetPack: options.keepPack ? false : true,
      };

      const maybeAssignString = (
        value: unknown,
        assign: (val: string) => void,
      ) => {
        if (typeof value === "string" && value.length > 0) {
          assign(value);
        }
      };

      maybeAssignString(options.packName, (value) => {
        batchOptions.packName = value;
      });
      maybeAssignString(options.packDir, (value) => {
        batchOptions.packDir = value;
      });
      maybeAssignString(options.packPath, (value) => {
        batchOptions.packPath = value;
      });
      maybeAssignString(options.tikaUrl, (value) => {
        batchOptions.tikaUrl = value;
      });
      maybeAssignString(options.sourceBase, (value) => {
        batchOptions.sourceBase = value;
      });

      if (options.tikaTimeout != null) {
        const parsed = Number.parseInt(String(options.tikaTimeout), 10);
        if (Number.isFinite(parsed)) {
          batchOptions.tikaTimeoutMs = parsed;
        }
      }
      if (options.chunkTarget != null) {
        const parsed = Number.parseInt(String(options.chunkTarget), 10);
        if (Number.isFinite(parsed)) {
          batchOptions.chunkTargetTokens = parsed;
        }
      }
      if (options.chunkOverlap != null) {
        const parsed = Number.parseInt(String(options.chunkOverlap), 10);
        if (Number.isFinite(parsed)) {
          batchOptions.chunkOverlapTokens = parsed;
        }
      }
      if (options.embedDim != null) {
        const parsed = Number.parseInt(String(options.embedDim), 10);
        if (Number.isFinite(parsed)) {
          batchOptions.embeddingDimension = parsed;
        }
      }

      if (Array.isArray(options.docsGlob)) {
        batchOptions.docsGlobs = options.docsGlob.filter((entry) => typeof entry === "string") as string[];
      }
      if (Array.isArray(options.userdataGlob)) {
        batchOptions.userGlobs = options.userdataGlob.filter((entry) => typeof entry === "string") as string[];
      }
      if (Array.isArray(options.ignoreGlob)) {
        batchOptions.ignoreGlobs = options.ignoreGlob.filter((entry) => typeof entry === "string") as string[];
      }

      const result = await runBatch(batchOptions);
      console.log(`📦 Pack path: ${result.packPath}`);
      console.log(
        `   processed=${result.total}, succeeded=${result.succeeded}, failed=${result.failed.length}`,
      );
      if (result.failed.length > 0) {
        console.error("❌ Failures:");
        for (const failure of result.failed) {
          console.error(`   ${failure.file}: ${failure.error}`);
        }
        process.exitCode = 1;
      } else {
        console.log("✅ Batch indexing completed without errors");
      }
    });

  await program.parseAsync(argv);
}

main(process.argv).catch((error) => {
  console.error(
    "❌ Batch indexing failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
