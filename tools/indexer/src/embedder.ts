export interface EmbeddingVector {
  dimension: number;
  buffer: Buffer;
}

/** Placeholder embedder that returns zero-filled vectors for each chunk. */
export async function generatePlaceholderEmbeddings(
  count: number,
  dimension: number,
): Promise<EmbeddingVector[]> {
  const vectors: EmbeddingVector[] = [];
  for (let index = 0; index < count; index += 1) {
    vectors.push({
      dimension,
      buffer: Buffer.alloc(dimension * 4),
    });
  }
  return vectors;
}
