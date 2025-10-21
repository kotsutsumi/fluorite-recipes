# Prisma + Turso 統合ガイド

Prisma ORM を使用して Turso データベースを操作する方法を説明します。

## 📚 目次

- [概要](#概要)
- [前提条件](#前提条件)
- [セットアップ手順](#セットアップ手順)
- [スキーマ定義](#スキーマ定義)
- [マイグレーション](#マイグレーション)
- [クエリの実行](#クエリの実行)
- [制限事項](#制限事項)

## 概要

Prisma は Next-generation ORM で、Turso アダプターを使用することで Turso データベースと統合できます。

## 前提条件

- Prisma バージョン 5.4.2 以降
- Turso CLI
- Turso アカウント

## セットアップ手順

### 1. パッケージのインストール

```bash
npm install @prisma/client @libsql/client @prisma/adapter-libsql
npm install -D prisma
```

### 2. Prisma の初期化

```bash
npx prisma init
```

### 3. Prisma スキーマの設定

`prisma/schema.prisma` を編集：

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 4. 環境変数の設定

`.env` ファイルを作成：

```env
TURSO_DATABASE_URL=libsql://[DATABASE-NAME]-[ORG].turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

### 5. Prisma Client の初期化

`src/db.ts` を作成：

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
```

## スキーマ定義

### 基本的なモデル

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### リレーションの定義

```prisma
model Category {
  id    Int                @id @default(autoincrement())
  name  String             @unique
  posts CategoriesOnPosts[]
}

model CategoriesOnPosts {
  post       Post     @relation(fields: [postId], references: [id])
  postId     Int
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int
  assignedAt DateTime @default(now())

  @@id([postId, categoryId])
}

model Post {
  id         Int                @id @default(autoincrement())
  title      String
  categories CategoriesOnPosts[]
}
```

## マイグレーション

### ローカルでマイグレーションを生成

```bash
# ローカルの SQLite データベースを使用してマイグレーションを生成
npx prisma migrate dev --name init
```

### Turso へマイグレーションを適用

Prisma Migrate は Turso で直接サポートされていないため、手動で適用します：

```bash
# マイグレーション SQL ファイルを Turso に適用
turso db shell [DATABASE-NAME] < ./prisma/migrations/[MIGRATION-FOLDER]/migration.sql
```

### マイグレーションスクリプト

`scripts/migrate-turso.sh` を作成：

```bash
#!/bin/bash

# 最新のマイグレーションフォルダを取得
MIGRATION_DIR=$(ls -t prisma/migrations | head -1)

if [ -z "$MIGRATION_DIR" ]; then
    echo "No migrations found"
    exit 1
fi

echo "Applying migration: $MIGRATION_DIR"

# Turso にマイグレーションを適用
turso db shell $TURSO_DATABASE_NAME < "prisma/migrations/$MIGRATION_DIR/migration.sql"

echo "Migration applied successfully"
```

## クエリの実行

### Prisma Client の生成

```bash
npx prisma generate
```

### CRUD 操作

```typescript
import { prisma } from "./db";

// CREATE
const newUser = await prisma.user.create({
  data: {
    email: "alice@example.com",
    name: "Alice",
  },
});

// READ
const allUsers = await prisma.user.findMany();

const user = await prisma.user.findUnique({
  where: { email: "alice@example.com" },
});

// READ with relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});

// UPDATE
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Alice Updated" },
});

// DELETE
await prisma.user.delete({
  where: { id: 1 },
});
```

### 高度なクエリ

```typescript
// フィルタリング
const publishedPosts = await prisma.post.findMany({
  where: {
    published: true,
    author: {
      email: { contains: "@example.com" },
    },
  },
});

// 並び替えとページネーション
const posts = await prisma.post.findMany({
  orderBy: { createdAt: "desc" },
  skip: 0,
  take: 10,
});

// 集計
const userCount = await prisma.user.count();

const avgPostCount = await prisma.post.aggregate({
  _avg: { authorId: true },
});
```

### トランザクション

```typescript
// インタラクティブトランザクション
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
    },
  });

  const post = await tx.post.create({
    data: {
      title: "First Post",
      content: "Hello World",
      authorId: user.id,
    },
  });

  return { user, post };
});

// バッチトランザクション
await prisma.$transaction([
  prisma.user.create({
    data: { email: "user1@example.com", name: "User 1" },
  }),
  prisma.user.create({
    data: { email: "user2@example.com", name: "User 2" },
  }),
]);
```

## 制限事項

### 現在サポートされていない機能

```typescript
interface Limitations {
  migrate: {
    status: "非サポート";
    alternative: "ローカルで生成し、Turso CLI で手動適用";
  };
  introspection: {
    status: "非サポート";
    alternative: "スキーマを手動で定義";
  };
}
```

### 回避策

1. **マイグレーション**:
   - ローカルの SQLite で Prisma Migrate を使用
   - 生成された SQL を Turso に手動で適用

2. **イントロスペクション**:
   - 既存のデータベースから Prisma スキーマを手動で作成

## ベストプラクティス

### 1. 接続管理

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### 2. エラーハンドリング

```typescript
import { Prisma } from "@prisma/client";

try {
  await prisma.user.create({
    data: { email: "duplicate@example.com", name: "User" },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      console.log("一意制約違反: このメールアドレスは既に使用されています");
    }
  }
  throw error;
}
```

### 3. 型安全性

```typescript
import { Prisma } from "@prisma/client";

// 型定義を抽出
type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

async function getUserWithPosts(id: number): Promise<UserWithPosts | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });
}
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Drizzle ORM との統合](./drizzle.md)
- [Prisma 公式ドキュメント](https://www.prisma.io/docs)
- [Turso 公式ドキュメント](https://docs.turso.tech)
