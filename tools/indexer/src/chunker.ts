import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { v4 as uuid } from "uuid";
import crypto from "node:crypto";

import type { Chunk, ChunkMetadata, DocumentChunk } from "./schema.js";

interface ChunkMarkdownOptions {
  filePath: string;
  content: string;
  documentId?: string;
  frontMatter: Record<string, unknown>;
  minHeadingDepth?: number;
  maxHeadingDepth?: number;
}

interface HeadingInfo {
  offset: number;
  depth: number;
  text: string;
  slug: string;
}

const DEFAULT_MIN_HEADING_DEPTH = 2;
const DEFAULT_MAX_HEADING_DEPTH = 3;

const parser = unified().use(remarkParse);

function estimateTokens(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words * 1.3));
}

function computeDocumentId(filePath: string): string {
  return crypto.createHash("sha256").update(filePath).digest("hex");
}

export function chunkMarkdown({
  filePath,
  content,
  documentId,
  frontMatter,
  minHeadingDepth = DEFAULT_MIN_HEADING_DEPTH,
  maxHeadingDepth = DEFAULT_MAX_HEADING_DEPTH,
}: ChunkMarkdownOptions): DocumentChunk[] {
  const docId = documentId ?? computeDocumentId(filePath);
  const tree = parser.parse(content);
  const slugger = new GithubSlugger();

  const headings: HeadingInfo[] = [];

  visit(tree, "heading", (node) => {
    if (!node.position) return;
    if (node.depth == null) return;
    if (node.depth < minHeadingDepth || node.depth > maxHeadingDepth) return;
    const offset = node.position.start?.offset;
    if (typeof offset !== "number") return;
    const text = toString(node).trim();
    const slug = slugger.slug(text);
    headings.push({ offset, depth: node.depth, text, slug });
  });

  const chunks: DocumentChunk[] = [];
  const introOffset = headings[0]?.offset ?? content.length;
  if (introOffset > 0) {
    const introText = content.slice(0, introOffset).trim();
    if (introText) {
      const id = uuid();
      const chunk: Chunk = {
        id,
        text: introText,
        tokenCount: estimateTokens(introText),
        documentId: docId,
        ordinal: 0,
      };
      const meta: ChunkMetadata = {
        id,
        file: filePath,
        heading: "__intro__",
        headingLevel: 0,
        anchors: [],
        frontMatter,
      };
      chunks.push({ chunk, meta });
    }
  }

  headings.forEach((heading, index) => {
    const start = heading.offset;
    const end = headings[index + 1]?.offset ?? content.length;
    const slice = content.slice(start, end).trim();
    if (!slice) return;
    const id = uuid();
    const chunk: Chunk = {
      id,
      text: slice,
      tokenCount: estimateTokens(slice),
      documentId: docId,
      ordinal: chunks.length,
    };

    const anchorsInRange = headings
      .filter((h) => h.offset >= start && h.offset < end)
      .map((h) => h.slug);

    const meta: ChunkMetadata = {
      id,
      file: filePath,
      heading: heading.text,
      headingLevel: heading.depth,
      anchors: anchorsInRange,
      frontMatter,
    };
    if (anchorsInRange[0]) {
      meta.primaryAnchor = anchorsInRange[0];
    }

    chunks.push({ chunk, meta });
  });

  // If we produced more than one chunk, ensure ordinals are consistent.
  chunks.forEach((entry, index) => {
    entry.chunk.ordinal = index;
  });

  return chunks;
}
