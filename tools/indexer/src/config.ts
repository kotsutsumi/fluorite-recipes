import path from "node:path";

import { z } from "zod";

import type { BuildConfig, EmbeddingConfig } from "./schema.js";

export const buildConfigSchema = z.object({
  root: z.string().default(process.cwd()),
  include: z.array(z.string()).default([
    "README.md",
    "AGENTS.md",
    "docs/**/*.md",
    "apps/**/*.md",
  ]),
  exclude: z.array(z.string()).default([
    "**/node_modules/**",
    "**/.next/**",
    "**/.expo/**",
    "**/.turbo/**",
    "**/dist/**",
    "packs/**",
  ]),
  outDir: z.string().default(path.resolve(process.cwd(), "packs")),
  packName: z.string(),
  sourceBase: z.string().optional(),
  commit: z.string().optional(),
  skipEmbeddings: z.boolean().default(false),
  embed: z
    .object({
      endpoint: z.string(),
      model: z.string().optional(),
      dimension: z.number().optional(),
      apiKey: z.string().optional(),
      batchSize: z.number().int().positive().optional(),
      timeoutMs: z.number().int().positive().optional(),
    })
    .optional(),
  dryRun: z.boolean().default(false),
});

export type ResolvedBuildConfig = z.infer<typeof buildConfigSchema>;

export const DEFAULT_EMBED_BATCH = 32;

export function coerceBuildConfig(input: BuildConfig): ResolvedBuildConfig {
  return buildConfigSchema.parse({
    ...input,
    root: input.root ?? process.cwd(),
    outDir: input.outDir ?? path.resolve(process.cwd(), "packs"),
  });
}

export function normalizeEmbeddingConfig(
  config?: EmbeddingConfig,
): EmbeddingConfig | undefined {
  if (!config) return undefined;
  return {
    batchSize: config.batchSize ?? DEFAULT_EMBED_BATCH,
    timeoutMs: config.timeoutMs ?? 60_000,
    ...config,
  };
}
