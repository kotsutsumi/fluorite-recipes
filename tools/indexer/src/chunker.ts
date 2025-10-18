export interface ChunkerOptions {
  targetTokens: number;
  overlapTokens: number;
}

export interface ChunkRecord {
  ord: number;
  text: string;
  code?: string | null;
  headingPath?: string | null;
  pageNo?: number | null;
  tokens: number;
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function chooseChunkBoundary(
  text: string,
  start: number,
  proposedEnd: number,
  fallbackEnd: number,
): number {
  if (proposedEnd >= text.length) {
    return text.length;
  }
  const windowStart = Math.max(start + Math.floor((proposedEnd - start) * 0.5), start);
  const doubleBreak = text.lastIndexOf("\n\n", proposedEnd);
  if (doubleBreak >= windowStart) {
    return doubleBreak + 2;
  }
  const singleBreak = text.lastIndexOf("\n", proposedEnd);
  if (singleBreak >= windowStart) {
    return singleBreak + 1;
  }
  return fallbackEnd;
}

export function chunkText(
  content: string,
  { targetTokens, overlapTokens }: ChunkerOptions,
): ChunkRecord[] {
  if (!content.trim()) {
    return [];
  }
  const targetChars = Math.max(1, Math.round(targetTokens * 4));
  const overlapChars = Math.max(0, Math.round(overlapTokens * 4));

  const chunks: ChunkRecord[] = [];
  let start = 0;

  while (start < content.length) {
    const fallbackEnd = Math.min(content.length, start + targetChars);
    const end = chooseChunkBoundary(content, start, fallbackEnd, fallbackEnd);
    const slice = content.slice(start, end).trim();
    if (slice.length === 0) {
      start = end;
      continue;
    }
    chunks.push({
      ord: chunks.length,
      text: slice,
      tokens: estimateTokens(slice),
    });
    if (end >= content.length) {
      break;
    }
    const candidateStart = Math.max(0, end - overlapChars);
    start = candidateStart <= start ? end : candidateStart;
  }

  return chunks;
}
