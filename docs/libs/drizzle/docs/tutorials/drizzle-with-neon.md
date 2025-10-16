# Neon PostgreSQLでDrizzleを使用するチュートリアル

## 概要
このチュートリアルでは、Neon PostgresデータベースでDrizzle ORMを使用する方法を説明します。前提条件には以下が含まれます:
- Drizzle ORMとDrizzle Kitのインストール
- Neon serverlessドライバーのインストール
- `dotenv`パッケージのインストール

## セットアップステップ

### 1. Neonプロジェクトを作成
- Neon Consoleにログイン
- 新しいプロジェクトを作成するか、既存の`neondb`を使用

### 2. 接続設定
- Neonプロジェクトからデータベース接続文字列を取得
- `.env`ファイルに`DATABASE_URL`を追加

### 3. データベース接続(db.ts)
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

### 4. スキーマ定義(schema.ts)
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
```

### 5. Drizzle設定(drizzle.config.ts)
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 6. マイグレーションを作成して適用
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 7. データベースをシードしてクエリ
```typescript
import { db } from './db/db';
import { usersTable, postsTable } from './db/schema';

async function main() {
  // ユーザーを作成
  const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: '[email protected]',
  };

  await db.insert(usersTable).values(user);

  // ユーザーをクエリ
  const users = await db.select().from(usersTable);
  console.log('Getting all users from the database: ', users);
}

main();
```

## 主なポイント
- Neon serverlessドライバーはエッジ環境に最適化
- Drizzle Kitでスキーママイグレーションを管理
- 型安全なクエリビルダー
- リレーショナルクエリをサポート
- サーバーレスとエッジランタイムと互換性
