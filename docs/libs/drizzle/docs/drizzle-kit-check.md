# drizzle-kit check

`drizzle-kit check`コマンドは、SQLマイグレーション履歴の一貫性を確認します。

## 主な機能

- マイグレーション履歴の一貫性をチェック
- 複数の設定ファイルをサポート
- 異なるデータベース方言（PostgreSQL、MySQL、SQLite）で動作

## 設定ファイル経由

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```

## CLIオプション経由

```bash
npx drizzle-kit check --dialect=postgresql
```

## 複数設定のサポート

```bash
npx drizzle-kit check --config=drizzle-dev.config.ts
npx drizzle-kit check --config=drizzle-prod.config.ts
```

## CLI設定オプション

- `dialect`: 必須、データベースタイプを指定
- `out`: マイグレーションフォルダ（デフォルト: `./drizzle`）
- `config`: 設定ファイルパス（デフォルト: `drizzle.config.ts`）

チーム開発環境でマイグレーション履歴の一貫性を確保するためのコマンドです。
