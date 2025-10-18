import fs from "node:fs/promises";
import path from "node:path";

import { globby } from "globby";

import type { IndexFileOptions } from "./indexer.js";
import { indexFile } from "./indexer.js";
import { resolveConfig } from "./config.js";

const DEFAULT_DOC_PATTERNS = ["docs/**/*.md"];
const DEFAULT_USER_PATTERNS = [
  "userdata/**/*.{pdf,PDF}",
  "userdata/**/*.{doc,docx,DOC,DOCX}",
  "userdata/**/*.{xls,xlsx,XLS,XLSX}",
  "userdata/**/*.{ppt,pptx,PPT,PPTX}",
  "userdata/**/*.{txt,TXT,md,MD}",
  "userdata/**/*.{html,htm,HTML,HTM}",
  "userdata/**/*.{jpg,jpeg,JPG,JPEG}",
  "userdata/**/*.{png,PNG,gif,GIF,bmp,BMP,webp,WEBP}",
];

const DEFAULT_IGNORE = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.next/**",
  "**/.expo/**",
  "**/.turbo/**",
  "**/dist/**",
  "packs/**",
  "tools/indexer/packs/**",
];

export interface BatchRunOptions extends IndexFileOptions {
  docsGlobs?: string[];
  userGlobs?: string[];
  ignoreGlobs?: string[];
  resetPack?: boolean;
}

async function expandGlobs(
  patterns: string[],
  cwd: string,
  ignore: string[],
): Promise<string[]> {
  if (patterns.length === 0) return [];
  return globby(patterns, {
    cwd,
    ignore,
    absolute: true,
    onlyFiles: true,
    followSymbolicLinks: true,
  });
}

export interface BatchRunResult {
  packPath: string;
  total: number;
  succeeded: number;
  failed: Array<{ file: string; error: string }>;
}

export async function runBatch(
  rawOptions: BatchRunOptions,
): Promise<BatchRunResult> {
  const {
    docsGlobs = DEFAULT_DOC_PATTERNS,
    userGlobs = DEFAULT_USER_PATTERNS,
    ignoreGlobs = DEFAULT_IGNORE,
    resetPack = true,
    ...rest
  } = rawOptions;

  if (!rest.rootDir) {
    throw new Error("rootDir is required for batch indexing");
  }
  const rootDir = path.resolve(rest.rootDir);
  const indexOptions: IndexFileOptions = {
    ...rest,
    rootDir,
  };

  const resolvedConfig = resolveConfig(indexOptions);
  if (resetPack) {
    await fs.rm(resolvedConfig.packPath, { force: true });
  }

  const docFiles = await expandGlobs(docsGlobs, rootDir, ignoreGlobs);
  const userFiles = await expandGlobs(userGlobs, rootDir, ignoreGlobs);
  const uniqueFiles = Array.from(new Set([...docFiles, ...userFiles])).sort();

  let succeeded = 0;
  const failed: Array<{ file: string; error: string }> = [];

  for (const absPath of uniqueFiles) {
    try {
      await indexFile(absPath, indexOptions);
      succeeded += 1;
    } catch (error) {
      failed.push({
        file: absPath,
        error:
          error instanceof Error ? error.message : JSON.stringify(error),
      });
    }
  }

  return {
    packPath: resolvedConfig.packPath,
    total: uniqueFiles.length,
    succeeded,
    failed,
  };
}
