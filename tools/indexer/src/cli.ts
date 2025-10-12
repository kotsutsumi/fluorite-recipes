#!/usr/bin/env node
import path from "node:path";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";

import { Command } from "commander";

import { coerceBuildConfig, normalizeEmbeddingConfig } from "./config.js";
import { embedChunks } from "./embed.js";
import { ingestMarkdown } from "./ingest.js";
import { createManifest, writeManifest } from "./manifest.js";
import type { BuildConfig, EmbeddingConfig } from "./schema.js";

const VERSION = "0.1.0";

function collect(value: string, previous: string[] = []) {
  previous.push(value);
  return previous;
}

async function detectGitCommit(cwd: string): Promise<string | undefined> {
  if (!existsSync(path.join(cwd, ".git"))) return undefined;
  return new Promise((resolve) => {
    execFile("git", ["rev-parse", "HEAD"], { cwd }, (error, stdout) => {
      if (error) {
        resolve(undefined);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

async function runBuild(options: {
  pack: string;
  tag?: string;
  root: string;
  include: string[];
  exclude: string[];
  outDir: string;
  sourceBase?: string;
  commit?: string;
  manifest?: string;
  embeddingEndpoint?: string;
  embeddingModel?: string;
  embeddingDim?: number;
  embeddingBatch?: number;
  embeddingKey?: string;
  skipEmbeddings?: boolean;
  dryRun?: boolean;
}) {
  const resolvedRoot = path.resolve(options.root);
  const commit = options.commit ?? (await detectGitCommit(resolvedRoot));

  const includePatterns = options.include ?? [];
  const excludePatterns = options.exclude ?? [];

  const resolvedOutDir = path.isAbsolute(options.outDir)
    ? options.outDir
    : path.resolve(resolvedRoot, options.outDir);

  const buildConfigInput: BuildConfig = {
    packName: options.pack,
    root: resolvedRoot,
    outDir: resolvedOutDir,
    skipEmbeddings: options.skipEmbeddings ?? false,
    dryRun: options.dryRun ?? false,
  };

  if (includePatterns.length > 0) {
    buildConfigInput.include = includePatterns;
  }
  if (excludePatterns.length > 0) {
    buildConfigInput.exclude = excludePatterns;
  }
  const sourceBase =
    options.sourceBase ?? process.env.FLUORITE_SOURCE_BASE ?? undefined;
  if (sourceBase) buildConfigInput.sourceBase = sourceBase;
  if (commit) buildConfigInput.commit = commit;

  if (!options.skipEmbeddings) {
    const endpoint =
      options.embeddingEndpoint ??
      process.env.FLUORITE_EMBEDDING_ENDPOINT ??
      undefined;
    if (endpoint) {
      const embedConfig: EmbeddingConfig = { endpoint };
      if (options.embeddingModel ?? process.env.FLUORITE_EMBEDDING_MODEL) {
        embedConfig.model =
          options.embeddingModel ?? process.env.FLUORITE_EMBEDDING_MODEL!;
      }
      const dim =
        options.embeddingDim ??
        (process.env.FLUORITE_EMBEDDING_DIM
          ? Number.parseInt(process.env.FLUORITE_EMBEDDING_DIM, 10)
          : undefined);
      if (dim != null && Number.isFinite(dim)) {
        embedConfig.dimension = dim;
      }
      if (options.embeddingKey ?? process.env.FLUORITE_EMBEDDING_KEY) {
        embedConfig.apiKey =
          options.embeddingKey ?? process.env.FLUORITE_EMBEDDING_KEY!;
      }
      if (options.embeddingBatch != null) {
        embedConfig.batchSize = options.embeddingBatch;
      }
      const normalizedEmbed = normalizeEmbeddingConfig(embedConfig);
      if (normalizedEmbed) {
        buildConfigInput.embed = normalizedEmbed;
      }
    }
  }

  const buildConfig = coerceBuildConfig(buildConfigInput as BuildConfig);

  const tag = options.tag ?? new Date().toISOString().slice(0, 10);
  const packFile = `${buildConfig.packName}@${tag}.sqlite`;
  const packPath = path.join(buildConfig.outDir, packFile);
  const manifestPath = options.manifest
    ? path.resolve(options.manifest)
    : path.join(buildConfig.outDir, `${packFile}.manifest.json`);

  console.log(`📦 Building pack ${packFile}`);
  console.log(`   root: ${buildConfig.root}`);
  console.log(`   output: ${packPath}`);
  if (buildConfig.sourceBase) {
    console.log(`   source: ${buildConfig.sourceBase} (commit=${commit ?? "n/a"})`);
  }

  const ingestResult = await ingestMarkdown(buildConfig);
  if (ingestResult.chunks.length === 0) {
    console.warn("No Markdown files matched include globs; aborting");
    return;
  }

  console.log(
    `   documents: ${ingestResult.files.length}, chunks: ${ingestResult.chunks.length}`,
  );

  if (buildConfig.dryRun) {
    console.log("Dry run enabled; not writing pack or manifest");
    return;
  }

  const { writePack } = await import("./pack.js");
  let embeddings: { id: string; vector: number[] }[] = [];
  if (!buildConfig.skipEmbeddings && buildConfig.embed) {
    const embedConfig = buildConfig.embed as EmbeddingConfig;
    console.log(
      `→ Requesting embeddings from ${embedConfig.endpoint} (batch=${embedConfig.batchSize})`,
    );
    embeddings = await embedChunks(
      ingestResult.chunks.map((entry) => entry.chunk),
      embedConfig,
    );
    console.log(`   received ${embeddings.length} vectors`);
  } else {
    console.log("→ Embeddings skipped");
  }

  const { embeddingDimension } = writePack({
    config: buildConfig,
    chunks: ingestResult.chunks,
    embeddings,
    packPath,
  });

  const manifest = createManifest({
    config: buildConfig,
    packPath,
    files: ingestResult.files,
    chunks: ingestResult.chunks,
    embeddings,
    ...(embeddingDimension != null ? { embeddingDimension } : {}),
  });

  await writeManifest(manifest, manifestPath);
  console.log(`✅ Pack written to ${packPath}`);
  console.log(`📄 Manifest written to ${manifestPath}`);
}

export async function main(argv: string[]) {
  const program = new Command();
  program.name("fluorite-indexer").description("Build retrieval packs").version(VERSION);

  program
    .command("build")
    .description("Ingest Markdown and build a hybrid search pack")
    .requiredOption("--pack <name>", "Logical pack name")
    .option("--tag <tag>", "Tag appended to the pack filename (default: YYYY-MM-DD)")
    .option("--root <dir>", "Project root", process.cwd())
    .option("--include <pattern>", "Glob to include (repeatable)", collect, [])
    .option("--exclude <pattern>", "Glob to exclude (repeatable)", collect, [])
    .option("--out <dir>", "Output directory", "packs")
    .option("--source-base <url>", "Base URL for source links (supports {commit}/{ref} placeholders)")
    .option("--commit <sha>", "Commit hash for source URLs")
    .option("--manifest <file>", "Manifest output path")
    .option("--embedding-endpoint <url>", "Embedding service endpoint")
    .option("--embedding-model <name>", "Embedding model identifier")
    .option("--embedding-dim <number>", "Expected embedding dimension", (value) => Number.parseInt(value, 10))
    .option("--embedding-batch <number>", "Embedding batch size", (value) => Number.parseInt(value, 10))
    .option("--embedding-key <token>", "API key for embedding service")
    .option("--skip-embeddings", "Skip embedding requests")
    .option("--dry-run", "Show matching files and exit")
    .action(async (cmdOptions) => {
      try {
        await runBuild({
          pack: cmdOptions.pack,
          tag: cmdOptions.tag,
          root: cmdOptions.root,
          include: cmdOptions.include ?? [],
          exclude: cmdOptions.exclude ?? [],
          outDir: cmdOptions.out,
          sourceBase: cmdOptions.sourceBase,
          commit: cmdOptions.commit,
          manifest: cmdOptions.manifest,
          embeddingEndpoint:
            cmdOptions.embeddingEndpoint ??
            process.env.FLUORITE_EMBEDDING_ENDPOINT,
          embeddingModel: cmdOptions.embeddingModel,
          embeddingDim: cmdOptions.embeddingDim,
          embeddingBatch: cmdOptions.embeddingBatch,
          embeddingKey: cmdOptions.embeddingKey,
          skipEmbeddings: cmdOptions.skipEmbeddings ?? false,
          dryRun: cmdOptions.dryRun ?? false,
        });
      } catch (error) {
        console.error("❌ Build failed:", error);
        process.exitCode = 1;
      }
    });

  await program.parseAsync(argv);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main(process.argv).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
