# Fluorite Indexer (Tika Edition)

TypeScript-based CLI that extracts rich documents through Apache Tika, normalises and chunks the text, and writes a hybrid BM25 + vector pack into a single SQLite file under `packs/`. The implementation follows the workflow described in `fluorite_indexer_tika_prompt.md` and `fluorite-indexer-tika.md`.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Java 11+ (Apache Tika Server 3.2.3 推奨)
- `better-sqlite3` native build permissions (`pnpm approve-builds better-sqlite3` when prompted)

Install dependencies once:

```bash
cd tools/indexer
pnpm install
```

Launch Tika separately, for example:

```bash
java -jar tika-server-standard-3.2.3.jar -p 9998
```

## Index a file

```bash
pnpm tsx tools/indexer/index.ts ./fixtures/sample.pdf
```

Key flags:

- `--tika-url <url>` – override the base URL (default `http://localhost:9998`).
- `--pack-path <file>` – absolute or relative path for the output SQLite pack (`packs/fluorite-pack.sqlite3` by default).
- `--pack-dir <dir>` / `--pack-name <name>` – alternative way to point to the pack destination.
- `--root <dir>` – project root used to compute `docs.repo_path` (defaults to `process.cwd()`).
- `--chunk-target <tokens>` and `--chunk-overlap <tokens>` – chunk length & overlap (defaults 800 / 120).
- `--embed-dim <dim>` – embedding vector size written into `chunk_embeddings` (default 384; placeholder zero vectors for now).
- `--source-base <url>` – optional prefix to create `docs.source_url`.
- `--skip-ping` – skip the Tika `/version` health check at startup.

Any option can also be provided via environment variables:

| Variable | Description |
| --- | --- |
| `FLUORITE_TIKA_URL` | Default Tika endpoint. |
| `FLUORITE_TIKA_TIMEOUT` | Timeout in milliseconds (default 60000). |
| `FLUORITE_PACK_PATH` / `FLUORITE_PACK_DIR` / `FLUORITE_PACK_NAME` | Pack destination overrides. |
| `FLUORITE_ROOT_DIR` | Root used for relative repo paths. |
| `FLUORITE_CHUNK_TOKENS` / `FLUORITE_CHUNK_OVERLAP` | Chunk sizing hints. |
| `FLUORITE_EMBED_DIM` | Embedding vector dimension. |

## Batch build (docs + userdata)

`docs/` 配下を全スキャンし、`userdata/` 以下の PDF / Office / 画像をまとめて取り込むバッチ処理も用意しています。

```bash
# 予め Apache Tika Server 3.2.3 を起動しておく
tools/indexer/scripts/build-pack.sh
```

- 既存の `packs/fluorite-pack.sqlite3` は初期化され、すべての成果が単一ファイルにまとまります。
- Tika JAR が存在しなければ `archive.apache.org` から `tika-server-standard-3.2.3.jar` を自動ダウンロードします。任意のパスを使いたい場合は `FLUORITE_TIKA_JAR`、バージョンや配布 URL を変えたい場合は `FLUORITE_TIKA_VERSION` / `FLUORITE_TIKA_JAR_URL` を設定してください（`tools/indexer/tika-server*.jar` が存在すればそれも検出します）。
- 実行前にポートが塞がっていても `lsof -ti:<port> | xargs kill` で解放してから Tika を起動するため、手動操作は要りません。
- `FLUORITE_TIKA_URL` / `FLUORITE_PACK_NAME` / `FLUORITE_PACK_DIR` といった環境変数で接続先やファイル名を上書きできます。
- さらに細かい制御が必要になったら `pnpm tsx tools/indexer/batch.ts --help` で CLI オプションを確認し、シェルスクリプトに追加の引数を渡してください。

## SQLite schema

`tools/indexer` initialises one SQLite database containing:

- `docs(id INTEGER PRIMARY KEY, source_url TEXT, repo_path TEXT, title TEXT, lang TEXT, mime TEXT, version TEXT, docset TEXT, published_at TEXT, fetched_at TEXT NOT NULL, hash TEXT NOT NULL UNIQUE)`
- `chunks(id INTEGER PRIMARY KEY, doc_id INTEGER NOT NULL REFERENCES docs(id) ON DELETE CASCADE, ord INTEGER NOT NULL, text TEXT NOT NULL, code TEXT, heading_path TEXT, page_no INTEGER, tokens INTEGER, UNIQUE(doc_id, ord))`
- `chunks_fts` (FTS5 virtual table linked to `chunks.id` for BM25 ranking)
- `chunk_embeddings(rowid INTEGER PRIMARY KEY, embedding BLOB)` storing little-endian Float32 vectors

Each run is idempotent per document hash: existing chunk rows are replaced, embeddings refreshed, and FTS kept in sync.

## Module overview

- `src/config.ts` – resolves CLI/environment configuration.
- `src/tika-client.ts` – minimal REST client with timeout handling and health check.
- `src/normalize.ts` – whitespace & control-character cleanup of Tika output.
- `src/chunker.ts` – token-approximate chunking with 10–15% overlap.
- `src/embedder.ts` – placeholder zero-vector generator (swap in a real model later).
- `src/sqlite-writer.ts` – schema initialisation and transactional upsert for docs/chunks/embeddings.
- `src/indexer.ts` – orchestration pipeline for a single file。
- `src/batch.ts` – `docs/` と `userdata/` を走査して順次インデックスするバッチ実装。
- `index.ts` – 単一ファイルを取り込む CLI エントリポイント。
- `batch.ts` – バッチ処理用 CLI エントリポイント。
- `scripts/build-pack.sh` – 1 コマンドでバッチを実行するためのヘルパースクリプト。

## Development

Type-check the project:

```bash
pnpm typecheck
```

Future work items are tracked in the integration guides; notably real embedding backends, differential updates across directories, and E2E tests once Vitest is introduced.
