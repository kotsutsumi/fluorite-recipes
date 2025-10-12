# Fluorite Indexer

`tools/indexer` はフルオライト・レシピの Markdown ドキュメントを取り込み、ローカル LLM で利用できるハイブリッド検索用パック（SQLite + FTS + ベクター）を生成するための TypeScript 製ユーティリティです。生成されたパックは `packs/` ディレクトリに保存され、別プロジェクト（例: Rust 製の対話エージェント）から読み込んで検索に利用できます。

## セットアップ

```bash
cd tools/indexer
pnpm install
# better-sqlite3 のビルドを許可する場合
pnpm approve-builds better-sqlite3
```

> **Note:** `pnpm` v10 以降ではネイティブ依存のビルドがデフォルトで無効化されています。パック生成を行う際は `pnpm approve-builds better-sqlite3` でビルドを許可してください。

## 使い方

### パックの生成

```bash
pnpm run index build \
  --pack nextjs.core \
  --root ../.. \
  --source-base "https://github.com/kotsutsumi/fluorite-recipes/blob/{commit}/" \
  --commit $(git rev-parse HEAD)
```

主なオプション:

- `--pack <name>`: 論理パック名（必須）。ファイル名は `<pack>@<tag>.sqlite` になります。
- `--tag <tag>`: ファイル名につくタグ。デフォルトは実行日の `YYYY-MM-DD`。
- `--root <dir>`: 取り込み対象のプロジェクトルート。
- `--include <pattern>` / `--exclude <pattern>`: Markdown の include / exclude グロブ（複数指定可）。
- `--out <dir>`: 出力ディレクトリ（ルート相対）。既定は `packs/`。
- `--source-base <url>`: 出典 URL のベース。`{commit}`/`{ref}` プレースホルダーが利用できます。
- `--commit <sha>`: 出典用のコミットハッシュ。指定しない場合は `git rev-parse HEAD` を試行します。
- `--embedding-endpoint <url>`: ベクター埋め込みサービスの HTTP エンドポイント。省略時は環境変数 `FLUORITE_EMBEDDING_ENDPOINT` を参照します。
- `--skip-embeddings`: ベクター埋め込みをスキップ（SQLite には BM25 のみ格納）。
- `--dry-run`: 対象ファイルとチャンク数を表示し、ファイルを書き出しません。

### 環境変数

| 変数 | 説明 |
| --- | --- |
| `FLUORITE_SOURCE_BASE` | `--source-base` のデフォルト。`{commit}`/`{ref}` プレースホルダー可。 |
| `FLUORITE_EMBEDDING_ENDPOINT` | 埋め込み API の URL。 |
| `FLUORITE_EMBEDDING_MODEL` | API に渡す model 名。 |
| `FLUORITE_EMBEDDING_KEY` | API 認証トークン（Bearer）。 |
| `FLUORITE_EMBEDDING_DIM` | 期待するベクトル次元。 |
| `FLUORITE_EMBEDDING_BATCH` | バッチサイズ（数値）。 |

### 出力アーティファクト

`packs/<pack>@<tag>.sqlite`
: 以下のテーブルを含む SQLite データベース。

- `chunks(id TEXT PRIMARY KEY, document_id TEXT, ordinal INTEGER, text TEXT, token_count INTEGER)`
- `metadata(id TEXT PRIMARY KEY, file TEXT, source_url TEXT, heading TEXT, heading_level INTEGER, anchors TEXT, primary_anchor TEXT, product TEXT, area TEXT, version TEXT, lang TEXT, front_matter TEXT)`
- `bm25` (FTS5 仮想テーブル)。`text` カラムで全文検索可能。
- `embeddings(id TEXT PRIMARY KEY, vector BLOB, dimension INTEGER)` — `vector` は little-endian Float32 配列。

Rust 側では `chunks` を JOIN して本文、`metadata` でソース情報、`embeddings` をデシリアライズしてベクター検索に利用できます。

`packs/<pack>@<tag>.sqlite.manifest.json`
: 生成メタデータ。対象ファイル、チャンク数、トークン推定値、埋め込み情報などが含まれます。

### CLI のサンプルワークフロー

1. Markdown の差分を確認しつつパックを再生成
   ```bash
   pnpm run index build --pack nextjs.core --root ../.. --commit $(git rev-parse HEAD)
   ```
2. 生成物を別リポジトリ／Rust プロジェクトへコピー
   ```bash
   cp ../../packs/nextjs.core@2025-10-12.sqlite /path/to/rust-project/data/
   cp ../../packs/nextjs.core@2025-10-12.sqlite.manifest.json /path/to/rust-project/data/
   ```
3. Rust 側で SQLite を読み込み、BM25 とベクター（annoy/hnsw/quantization等）を再インデックス、あるいは直接 SQLite-VSS 拡張を利用。

## コード構成

- `src/chunker.ts`: Markdown を h2/h3 単位でチャンク化。
- `src/ingest.ts`: ファイル探索とフロントマター処理。
- `src/embed.ts`: HTTP 経由で埋め込みをバッチ取得（OpenAI 互換レスポンス対応）。
- `src/pack.ts`: SQLite にチャンク/メタ/ベクトル/FTS を書き込み。
- `src/manifest.ts`: 生成メタデータを JSON 化。
- `src/cli.ts`: Commander ベースの CLI エントリポイント。

## Lint / Type Check

```bash
pnpm typecheck
```

## Rust プロジェクトでの利用例

```rust
use rusqlite::{Connection, params};

let conn = Connection::open("data/nextjs.core@2025-10-12.sqlite")?;
let mut stmt = conn.prepare("SELECT c.text, m.source_url FROM chunks c JOIN metadata m ON c.id = m.id WHERE m.file = ?1")?;
let rows = stmt.query_map(params!["docs/indexing.md"], |row| {
    Ok((row.get::<_, String>(0)?, row.get::<_, Option<String>>(1)?))
})?;
```

ベクター列は `BLOB` に格納されているため、`bytemuck` や `byteorder` で `Vec<f32>` に復元してローカル ANN 検索器へ渡せます。

---

同梱されていない機能（例: 差分ビルド、マニフェスト署名、追加ストレージ転送など）はニーズに応じて拡張してください。
