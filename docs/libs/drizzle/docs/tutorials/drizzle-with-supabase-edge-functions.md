# Supabase Edge FunctionsでDrizzleを使用するチュートリアル

## 前提条件
- 最新の[Supabase CLI](https://supabase.com/docs/guides/cli/getting-started#installing-the-supabase-cli)
- Drizzle ORMとDrizzle Kitがインストールされていること
- Docker Desktop

## 主要なステップ

### 1. スキーマを作成
テーブル定義を含む`schema.ts`を作成:

```typescript
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull()
})
```

### 2. Drizzleを設定
`drizzle.config.ts`を作成:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
});
```

### 3. Supabaseプロジェクトを初期化
```bash
supabase init
```

### 4. マイグレーションを生成して適用
```bash
npx drizzle-kit generate
supabase start
supabase migration up
```

### 5. Edge Functionを作成
```bash
supabase functions new drizzle-tutorial
```

### 6. Drizzle ORMをデータベースに接続
`index.ts`を更新:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

Deno.serve(async () => {
  const connectionString = Deno.env.get("DATABASE_URL")!;
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({ client });

  await db.insert(usersTable).values({
    name: "Alice",
    age: 25
  })
  const data = await db.select().from(usersTable);

  return new Response(JSON.stringify(data))
})
```

### 7. Functionをデプロイ
```bash
supabase functions deploy drizzle-tutorial
```

## 主なポイント
- Supabase CLIを使用してローカル開発環境をセットアップ
- Drizzle Kitでマイグレーションを管理
- Deno環境でDrizzle ORMを使用
- Supabase Edge Functionsでサーバーレスアプリケーションを構築
