# Drizzle ORM + Turso 統合ガイド

Drizzle ORM を使用して Turso データベースを操作する方法を説明します。

## 📚 目次

- [概要](#概要)
- [セットアップ手順](#セットアップ手順)
- [スキーマ定義](#スキーマ定義)
- [クエリの実行](#クエリの実行)
- [マイグレーション](#マイグレーション)
- [ベクトル埋め込み](#ベクトル埋め込み)
- [ベストプラクティス](#ベストプラクティス)

## 概要

Drizzle ORM は TypeScript ファーストの軽量 ORM で、Turso との統合により型安全なデータベース操作を実現します。

## セットアップ手順

### 1. パッケージのインストール

```bash
npm install drizzle-orm @libsql/client dotenv
npm install -D drizzle-kit
```

### 2. 環境変数の設定

`.env` ファイルを作成：

```env
TURSO_DATABASE_URL=libsql://[DATABASE-NAME]-[ORG].turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

### 3. Drizzle 設定

`drizzle.config.ts` を作成：

```typescript
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
```

### 4. データベース接続

`src/db/index.ts` を作成：

```typescript
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso);
```

## スキーマ定義

### 基本的なテーブル定義

```typescript
// src/db/schema.ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  published: integer("published", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
```

### リレーションの定義

```typescript
import { relations } from "drizzle-orm";

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
```

### 複雑なスキーマ例

```typescript
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const postCategories = sqliteTable("post_categories", {
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
});
```

## クエリの実行

### SELECT クエリ

```typescript
import { db } from "./db";
import { users, posts } from "./db/schema";
import { eq } from "drizzle-orm";

// すべてのユーザーを取得
const allUsers = await db.select().from(users);

// 特定の条件でフィルタ
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.email, "user@example.com"));

// リレーションを含むクエリ
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true,
  },
});
```

### INSERT クエリ

```typescript
// 単一レコードの挿入
const newUser = await db
  .insert(users)
  .values({
    name: "Alice",
    email: "alice@example.com",
  })
  .returning();

// 複数レコードの挿入
const newUsers = await db
  .insert(users)
  .values([
    { name: "Bob", email: "bob@example.com" },
    { name: "Charlie", email: "charlie@example.com" },
  ])
  .returning();
```

### UPDATE クエリ

```typescript
// 特定のレコードを更新
await db
  .update(users)
  .set({ name: "Alice Updated" })
  .where(eq(users.id, 1));

// 条件付き更新
await db
  .update(posts)
  .set({ published: true })
  .where(eq(posts.userId, 1));
```

### DELETE クエリ

```typescript
// 特定のレコードを削除
await db.delete(users).where(eq(users.id, 1));

// 複数条件での削除
import { and } from "drizzle-orm";

await db
  .delete(posts)
  .where(and(eq(posts.published, false), eq(posts.userId, 1)));
```

### 高度なクエリ

```typescript
import { desc, count, avg } from "drizzle-orm";

// 並び替えと制限
const recentPosts = await db
  .select()
  .from(posts)
  .orderBy(desc(posts.createdAt))
  .limit(10);

// 集計
const postCount = await db
  .select({ count: count() })
  .from(posts)
  .where(eq(posts.userId, 1));

// JOIN
const postsWithAuthors = await db
  .select({
    postTitle: posts.title,
    authorName: users.name,
  })
  .from(posts)
  .innerJoin(users, eq(posts.userId, users.id));
```

## マイグレーション

### マイグレーションの生成

```bash
# スキーマからマイグレーションを生成
npm run db:generate
# または
npx drizzle-kit generate:sqlite
```

`package.json` にスクリプトを追加：

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:sqlite",
    "db:migrate": "tsx src/db/migrate.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

### マイグレーションの実行

`src/db/migrate.ts` を作成：

```typescript
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";

async function main() {
  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Migrations completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
```

実行：

```bash
npm run db:migrate
```

## ベクトル埋め込み

### カスタムベクトル型の定義

```typescript
import { customType } from "drizzle-orm/sqlite-core";

const float32Array = customType<{
  data: number[];
  driverData: Buffer;
}>({
  dataType() {
    return "F32_BLOB(3)"; // 3次元ベクトル
  },
  toDriver(value: number[]): Buffer {
    const buffer = Buffer.allocUnsafe(value.length * 4);
    value.forEach((v, i) => buffer.writeFloatLE(v, i * 4));
    return buffer;
  },
  fromDriver(value: Buffer): number[] {
    const result: number[] = [];
    for (let i = 0; i < value.length; i += 4) {
      result.push(value.readFloatLE(i));
    }
    return result;
  },
});
```

### ベクトルテーブルの作成

```typescript
export const embeddings = sqliteTable("embeddings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vector: float32Array("vector").notNull(),
  text: text("text").notNull(),
});
```

### ベクトル検索

```typescript
// ベクトルインデックスの作成
await db.run(sql`
  CREATE INDEX IF NOT EXISTS embeddings_vector_idx
  ON embeddings(libsql_vector_idx(vector))
`);

// 類似度検索
const searchVector = [0.1, 0.2, 0.3];

const results = await db
  .select({
    id: embeddings.id,
    text: embeddings.text,
    distance: sql<number>`vector_distance_cos(vector, vector(${searchVector.toString()}))`,
  })
  .from(embeddings)
  .orderBy(sql`vector_distance_cos(vector, vector(${searchVector.toString()}))`)
  .limit(5);
```

## ベストプラクティス

### 1. トランザクションの使用

```typescript
await db.transaction(async (tx) => {
  const user = await tx
    .insert(users)
    .values({ name: "Alice", email: "alice@example.com" })
    .returning();

  await tx.insert(posts).values({
    title: "First Post",
    content: "Hello World",
    userId: user[0].id,
  });
});
```

### 2. 型安全なクエリビルダー

```typescript
// 型推論を活用
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;

async function createUser(data: NewUser): Promise<User> {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}
```

### 3. Prepared Statements

```typescript
import { placeholder } from "drizzle-orm";

const preparedQuery = db
  .select()
  .from(users)
  .where(eq(users.email, placeholder("email")))
  .prepare();

// 再利用可能
const user1 = await preparedQuery.execute({ email: "alice@example.com" });
const user2 = await preparedQuery.execute({ email: "bob@example.com" });
```

### 4. Drizzle Studio の使用

```bash
npm run db:studio
```

ブラウザで `https://local.drizzle.studio` を開くと、データベースを視覚的に管理できます。

### 5. Edge Runtime での使用

```typescript
// Edge Runtime 用の設定
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(turso);
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Prisma との統合](./prisma.md)
- [Drizzle ORM 公式ドキュメント](https://orm.drizzle.team)
- [Turso 公式ドキュメント](https://docs.turso.tech)
