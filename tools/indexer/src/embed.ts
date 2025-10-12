import { setTimeout as delay } from "node:timers/promises";

import type { Chunk, EmbeddingConfig, EmbeddingVector } from "./schema.js";

interface EmbeddingApiResponse {
  data?: Array<{ embedding?: number[]; vector?: number[]; index?: number }>;
  embeddings?: number[][];
  model?: string;
}

function resolveVectors(response: EmbeddingApiResponse): number[][] {
  if (Array.isArray(response.embeddings)) {
    return response.embeddings;
  }
  if (Array.isArray(response.data)) {
    return response.data.map((item, index) => {
      if (Array.isArray(item.embedding)) return item.embedding;
      if (Array.isArray(item.vector)) return item.vector;
      throw new Error(
        `Embedding response item ${index} missing 'embedding' vector array`,
      );
    });
  }
  throw new Error(
    `Embedding service response missing 'embeddings' or 'data' field (received keys: ${Object.keys(
      response,
    ).join(", ")})`,
  );
}

export async function embedChunks(
  chunks: Chunk[],
  config: EmbeddingConfig,
): Promise<EmbeddingVector[]> {
  const batchSize = config.batchSize ?? 32;
  const timeoutMs = config.timeoutMs ?? 60_000;
  const endpoint = config.endpoint;

  if (!endpoint) {
    throw new Error("Embedding endpoint is required when embeddings are enabled");
  }

  const results: EmbeddingVector[] = [];

  for (let start = 0; start < chunks.length; start += batchSize) {
    const batch = chunks.slice(start, start + batchSize);
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(config.apiKey ? { authorization: `Bearer ${config.apiKey}` } : {}),
        },
        body: JSON.stringify({
          input: batch.map((chunk) => chunk.text),
          model: config.model,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Embedding request failed with ${response.status} ${response.statusText}: ${text}`,
        );
      }

      const payload = (await response.json()) as EmbeddingApiResponse;
      const vectors = resolveVectors(payload);
      if (vectors.length !== batch.length) {
        throw new Error(
          `Embedding service returned ${vectors.length} vectors for batch of ${batch.length} chunks`,
        );
      }

      vectors.forEach((vector, index) => {
        results.push({ id: batch[index]!.id, vector });
      });
    } finally {
      clearTimeout(timeoutHandle);
    }

    // Friendly pacing to avoid hammering local services.
    if (start + batchSize < chunks.length) {
      await delay(10);
    }
  }

  if (config.dimension != null && results.length > 0) {
    const mismatched = results.find(
      (item) => item.vector.length !== config.dimension,
    );
    if (mismatched) {
      throw new Error(
        `Embedding dimension mismatch; expected ${config.dimension}, received ${mismatched.vector.length}`,
      );
    }
  }

  return results;
}
