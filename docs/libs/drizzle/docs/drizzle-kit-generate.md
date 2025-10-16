# drizzle-kit generate

`drizzle-kit generate`コマンドは、Drizzleスキーマの変更に基づいてSQLマイグレーションを生成します。

## 動作の仕組み

1. スキーマファイルを読み取り
2. スキーマのJSONスナップショットを作成
3. 現在のスナップショットを以前のマイグレーションと比較
4. それに応じてSQLマイグレーションを生成

## スキーマファイルパス

複数のアプローチでスキーマファイルを指定できます：

```typescript
// 単一ファイル
schema: "./src/schema.ts"

// 複数ファイル
schema: "./src/**/schema.ts"
schema: ["./src/user/schema.ts", "./src/posts/schema.ts"]
```

## カスタムマイグレーションオプション

### カスタムマイグレーションファイル名

```bash
npx drizzle-kit generate --name=init
```

### 空のカスタムマイグレーション

```bash
drizzle-kit generate --custom --name=seed-users
```

## 設定方法

### 設定ファイル経由（推奨）

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

### CLIオプション経由

```bash
npx drizzle-kit generate --dialect=postgresql --schema=./src/schema.ts
```

## CLIオプション

必須オプション：
- `dialect`: データベースタイプ（postgresql、mysql、sqlite）
- `schema`: スキーマファイルへのパス

オプション：
- `out`: マイグレーション出力フォルダ
- `config`: 設定ファイルパス
- `breakpoints`: SQL文のブレークポイント

## ワークフロー例

1. スキーマを定義
2. `npx drizzle-kit generate`を実行
3. 生成されたマイグレーションを確認
4. マイグレーションを適用
