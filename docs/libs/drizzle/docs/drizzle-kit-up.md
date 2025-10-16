# drizzle-kit up

`drizzle-kit up`コマンドは、Drizzleスキーマスナップショットを新しいバージョンにアップグレードします。

## 目的

JSONスナップショットや内部バージョンに破壊的変更が導入された際に使用します。

## 設定ファイル経由

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```

## CLIオプション経由

```bash
npx drizzle-kit up --dialect=postgresql
```

## 複数設定のサポート

```bash
npx drizzle-kit up --config=drizzle-dev.config.ts
npx drizzle-kit up --config=drizzle-prod.config.ts
```

## CLI設定オプション

- `dialect`: 必須、データベースタイプ（postgresql、mysql、sqlite）
- `out`: マイグレーションフォルダ（デフォルト: ./drizzle）
- `config`: 設定ファイルパス（デフォルト: drizzle.config.ts）
