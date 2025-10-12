import path from "node:path";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

import { globby } from "globby";
import matter from "gray-matter";

import { chunkMarkdown } from "./chunker.js";
import type { ResolvedBuildConfig } from "./config.js";
import type { DocumentChunk, ManifestFileEntry } from "./schema.js";

function posixPath(input: string): string {
  return input.split(path.sep).join(path.posix.sep);
}

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export interface IngestResult {
  chunks: DocumentChunk[];
  files: ManifestFileEntry[];
}

export async function ingestMarkdown(
  config: ResolvedBuildConfig,
): Promise<IngestResult> {
  const patterns = config.include;
  const ignore = config.exclude;
  const files = await globby(patterns, {
    cwd: config.root,
    ignore,
    absolute: false,
  });

  const seenFiles = new Set<string>();
  const chunks: DocumentChunk[] = [];
  const fileEntries: ManifestFileEntry[] = [];

  for (const relativeFile of files.sort()) {
    const normalized = posixPath(relativeFile);
    if (seenFiles.has(normalized)) continue;
    seenFiles.add(normalized);

    const fullPath = path.join(config.root, relativeFile);
    const raw = await readFile(fullPath, "utf8");
    const { content, data } = matter(raw);
    const sha = hashContent(raw);

    const frontMatter = data as Record<string, unknown>;
    const chunkEntries = chunkMarkdown({
      filePath: normalized,
      content,
      frontMatter,
    });

    const chunkCount = chunkEntries.length;

    chunkEntries.forEach((entry) => {
      const anchor = entry.meta.primaryAnchor;
      if (config.sourceBase) {
        const commit = config.commit ?? "main";
        const baseWithCommit = config.sourceBase
          .replaceAll("{commit}", commit)
          .replaceAll("{ref}", commit);
        const normalizedBase = baseWithCommit.endsWith("/")
          ? baseWithCommit
          : `${baseWithCommit}/`;
        entry.meta.sourceUrl = `${normalizedBase}${normalized}${
          anchor ? `#${anchor}` : ""
        }`;
      }
      if (typeof frontMatter.product === "string") {
        entry.meta.product = frontMatter.product;
      }
      if (typeof frontMatter.area === "string") {
        entry.meta.area = frontMatter.area;
      }
      if (typeof frontMatter.version === "string") {
        entry.meta.version = frontMatter.version;
      }
      if (typeof frontMatter.lang === "string") {
        entry.meta.lang = frontMatter.lang;
      }
      entry.meta.frontMatter = frontMatter;
    });

    chunks.push(...chunkEntries);

    fileEntries.push({
      path: normalized,
      chunkCount,
      sha256: sha,
    });
  }

  return { chunks, files: fileEntries };
}
