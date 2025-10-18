# drizzle-kit export

`drizzle-kit export`コマンドは、DrizzleスキーマのSQL表現をコンソールにエクスポートします。

## 動作の仕組み

1. Drizzleスキーマファイルを読み取り
2. スキーマのJSONスナップショットを作成
3. SQL DDL文を生成
4. SQL DDL文をコンソールに出力

## 基本設定

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

## CLIコマンド

```bash
# 設定ファイルを使用
npx drizzle-kit export

# CLIオプションを使用
npx drizzle-kit export --dialect=postgresql --schema=./src/schema.ts
```

## 複数の設定ファイル

```bash
npx drizzle-kit export --config=drizzle-dev.config.ts
npx drizzle-kit export --config=drizzle-prod.config.ts
```

## 必須パラメータ

- `dialect`: データベース方言（postgresql、mysql、sqlite等）
- `schema`: スキーマファイルへのパス
