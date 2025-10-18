import fs from "node:fs";
import { URL } from "node:url";

interface TikaClientOptions {
  endpoint: string;
  timeoutMs: number;
}

export interface TikaExtractionResult {
  text: string;
  mime?: string;
}

function buildUrl(endpoint: string, path: string): string {
  const target = new URL(path, endpoint);
  return target.toString();
}

export async function pingTika(options: TikaClientOptions): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    const response = await fetch(buildUrl(options.endpoint, "/version"), {
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function extractWithTika(
  filePath: string,
  options: TikaClientOptions,
): Promise<TikaExtractionResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  try {
    const stream = fs.createReadStream(filePath);
    const response = await fetch(
      buildUrl(options.endpoint, "/tika"),
      {
        method: "PUT",
        headers: {
          Accept: "text/plain",
        },
        body: stream as unknown as globalThis.BodyInit,
        signal: controller.signal,
        duplex: "half",
      } as unknown as RequestInit,
    );
    const body = await response.text();
    if (!response.ok) {
      const snippet = body.slice(0, 512);
      throw new Error(
        `Tika extraction failed with status ${response.status}: ${snippet}`,
      );
    }
    if (!body.trim()) {
      throw new Error(
        `Tika returned empty text for ${filePath}; ensure the file is supported`,
      );
    }
    const mimeHeader =
      response.headers.get("X-Parsed-Content-Type") ??
      response.headers.get("Content-Type") ??
      undefined;
    const result: TikaExtractionResult = { text: body };
    if (mimeHeader && mimeHeader.trim().length > 0) {
      result.mime = mimeHeader;
    }
    return result;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Timed out while contacting Tika at ${options.endpoint}; consider increasing FLUORITE_TIKA_TIMEOUT`,
      );
    }
    throw new Error(
      `Failed to extract text via Tika: ${
        error instanceof Error ? error.message : String(error)
      }. Ensure the server is running at ${options.endpoint}`,
    );
  } finally {
    clearTimeout(timer);
  }
}
