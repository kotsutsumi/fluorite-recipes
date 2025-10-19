# Turso TypeScript SDK - クイックスタート

Turso TypeScript SDKを使用してアプリケーションからデータベースに接続する方法を説明します。

## インストール

```bash
# npm
npm install @libsql/client

# yarn
yarn add @libsql/client

# pnpm
pnpm add @libsql/client

# bun
bun add @libsql/client
```

## 基本的な使い方

### クライアントの作成

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
```

### 環境変数の設定

```bash
# .env
TURSO_DATABASE_URL=libsql://my-db-[org].turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

## クエリの実行

### SELECT

```typescript
// 単純なSELECT
const result = await client.execute("SELECT * FROM users");
console.log(result.rows);

// パラメータ付きクエリ
const result = await client.execute({
  sql: "SELECT * FROM users WHERE id = ?",
  args: [1],
});

console.log(result.rows[0]);
```

### INSERT

```typescript
const result = await client.execute({
  sql: "INSERT INTO users (name, email) VALUES (?, ?)",
  args: ["Alice", "alice@example.com"],
});

console.log("Inserted row ID:", result.lastInsertRowid);
console.log("Affected rows:", result.rowsAffected);
```

### UPDATE

```typescript
const result = await client.execute({
  sql: "UPDATE users SET email = ? WHERE id = ?",
  args: ["newemail@example.com", 1],
});

console.log("Updated rows:", result.rowsAffected);
```

### DELETE

```typescript
const result = await client.execute({
  sql: "DELETE FROM users WHERE id = ?",
  args: [1],
});

console.log("Deleted rows:", result.rowsAffected);
```

## トランザクション

### 基本的なトランザクション

```typescript
const tx = await client.transaction();

try {
  await tx.execute({
    sql: "INSERT INTO users (name, email) VALUES (?, ?)",
    args: ["Bob", "bob@example.com"],
  });

  await tx.execute({
    sql: "INSERT INTO profiles (user_id, bio) VALUES (last_insert_rowid(), ?)",
    args: ["Software Developer"],
  });

  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
}
```

### トランザクションモード

```typescript
// 読み取り専用トランザクション
const tx = await client.transaction("read");

// 読み書きトランザクション（デフォルト）
const tx = await client.transaction("write");

// 即座トランザクション
const tx = await client.transaction("deferred");
```

## バッチ実行

### 複数のクエリを一度に実行

```typescript
const results = await client.batch([
  "SELECT * FROM users WHERE id = 1",
  "SELECT * FROM posts WHERE user_id = 1",
  "SELECT COUNT(*) as count FROM comments WHERE user_id = 1",
]);

console.log("User:", results[0].rows[0]);
console.log("Posts:", results[1].rows);
console.log("Comment count:", results[2].rows[0].count);
```

### パラメータ付きバッチ

```typescript
const results = await client.batch([
  {
    sql: "SELECT * FROM users WHERE id = ?",
    args: [1],
  },
  {
    sql: "SELECT * FROM posts WHERE user_id = ?",
    args: [1],
  },
]);
```

## 接続方法

### リモート接続（HTTP）

```typescript
const client = createClient({
  url: "libsql://my-db-[org].turso.io",
  authToken: "your-auth-token",
});
```

**最適な用途:**
- サーバーレス関数
- エッジコンピューティング
- 短命な接続

### リモート接続（WebSocket）

```typescript
const client = createClient({
  url: "wss://my-db-[org].turso.io",
  authToken: "your-auth-token",
});
```

**最適な用途:**
- 長期接続
- トランザクション
- 高頻度のクエリ

### ローカル接続

```typescript
const client = createClient({
  url: "file:local.db",
});
```

**最適な用途:**
- ローカル開発
- テスト
- オフライン機能

### Embedded Replicas

```typescript
const client = createClient({
  url: "file:local.db",
  syncUrl: "libsql://my-db-[org].turso.io",
  authToken: "your-auth-token",
});

// 初回同期
await client.sync();

// 定期的な同期
setInterval(async () => {
  await client.sync();
}, 60000); // 1分ごと
```

**最適な用途:**
- 超低レイテンシが必要な場合
- オフライン機能
- エッジデプロイメント

## 型安全なクエリ

### 型定義の作成

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
}
```

### 型付きクエリ

```typescript
async function getUser(id: number): Promise<User | null> {
  const result = await client.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });

  return (result.rows[0] as User) || null;
}

async function getUsers(): Promise<User[]> {
  const result = await client.execute("SELECT * FROM users");
  return result.rows as User[];
}

async function createUser(name: string, email: string): Promise<number> {
  const result = await client.execute({
    sql: "INSERT INTO users (name, email) VALUES (?, ?) RETURNING id",
    args: [name, email],
  });

  return (result.rows[0] as any).id;
}
```

## 実践例

### Next.js API Route

```typescript
// lib/db.ts
import { createClient } from "@libsql/client";

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const result = await db.execute("SELECT * FROM users");
    res.status(200).json(result.rows);
  } else if (req.method === "POST") {
    const { name, email } = req.body;

    const result = await db.execute({
      sql: "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
      args: [name, email],
    });

    res.status(201).json(result.rows[0]);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
```

### Express アプリケーション

```typescript
import express from "express";
import { createClient } from "@libsql/client";

const app = express();
app.use(express.json());

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

app.get("/api/users", async (req, res) => {
  try {
    const result = await db.execute("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await db.execute({
      sql: "INSERT INTO users (name, email) VALUES (?, ?) RETURNING *",
      args: [name, email],
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### React Server Components (Next.js App Router)

```typescript
// app/users/page.tsx
import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface User {
  id: number;
  name: string;
  email: string;
}

export default async function UsersPage() {
  const result = await db.execute("SELECT * FROM users");
  const users = result.rows as User[];

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Server Actions (Next.js)

```typescript
// app/actions.ts
"use server";

import { createClient } from "@libsql/client";
import { revalidatePath } from "next/cache";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  await db.execute({
    sql: "INSERT INTO users (name, email) VALUES (?, ?)",
    args: [name, email],
  });

  revalidatePath("/users");
}

export async function deleteUser(id: number) {
  await db.execute({
    sql: "DELETE FROM users WHERE id = ?",
    args: [id],
  });

  revalidatePath("/users");
}
```

## エラーハンドリング

### 基本的なエラーハンドリング

```typescript
try {
  const result = await client.execute("SELECT * FROM users");
  console.log(result.rows);
} catch (error: any) {
  if (error.code === "SQLITE_ERROR") {
    console.error("SQL syntax error");
  } else if (error.code === "SQLITE_CONSTRAINT") {
    console.error("Constraint violation");
  } else {
    console.error("Database error:", error);
  }
}
```

### カスタムエラーハンドラー

```typescript
class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public sql?: string
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

async function safeExecute(sql: string, args?: any[]) {
  try {
    return await client.execute({ sql, args });
  } catch (error: any) {
    throw new DatabaseError(
      error.message || "Database operation failed",
      error.code,
      sql
    );
  }
}
```

## パフォーマンス最適化

### プリペアドステートメント

```typescript
// 同じクエリを複数回実行する場合
const users = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
  { name: "Charlie", email: "charlie@example.com" },
];

const tx = await client.transaction();

try {
  for (const user of users) {
    await tx.execute({
      sql: "INSERT INTO users (name, email) VALUES (?, ?)",
      args: [user.name, user.email],
    });
  }

  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
}
```

### バッチ処理

```typescript
// 非効率
const user1 = await client.execute("SELECT * FROM users WHERE id = 1");
const user2 = await client.execute("SELECT * FROM users WHERE id = 2");
const user3 = await client.execute("SELECT * FROM users WHERE id = 3");

// 効率的
const results = await client.batch([
  { sql: "SELECT * FROM users WHERE id = ?", args: [1] },
  { sql: "SELECT * FROM users WHERE id = ?", args: [2] },
  { sql: "SELECT * FROM users WHERE id = ?", args: [3] },
]);
```

### 接続の再利用

```typescript
// lib/db.ts - シングルトンパターン
import { createClient, type Client } from "@libsql/client";

let clientInstance: Client | null = null;

export function getClient(): Client {
  if (!clientInstance) {
    clientInstance = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }

  return clientInstance;
}

// 使用
const db = getClient();
const result = await db.execute("SELECT * FROM users");
```

## ベストプラクティス

### 1. 環境変数の使用

```typescript
// ❌ 悪い例
const client = createClient({
  url: "libsql://my-db.turso.io",
  authToken: "eyJhbGci...",
});

// ✅ 良い例
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
```

### 2. パラメータ化クエリ

```typescript
// ❌ 悪い例 - SQLインジェクションのリスク
const userId = req.params.id;
await client.execute(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ 良い例
const userId = req.params.id;
await client.execute({
  sql: "SELECT * FROM users WHERE id = ?",
  args: [userId],
});
```

### 3. トランザクションの使用

```typescript
// ❌ 悪い例 - 部分的な失敗の可能性
await client.execute("INSERT INTO users (name) VALUES ('Alice')");
await client.execute("INSERT INTO profiles (user_id) VALUES (last_insert_rowid())");

// ✅ 良い例
const tx = await client.transaction();
try {
  await tx.execute("INSERT INTO users (name) VALUES ('Alice')");
  await tx.execute("INSERT INTO profiles (user_id) VALUES (last_insert_rowid())");
  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
}
```

### 4. 適切なエラーハンドリング

```typescript
// ✅ 良い例
try {
  const result = await client.execute({
    sql: "INSERT INTO users (email) VALUES (?)",
    args: [email],
  });
} catch (error: any) {
  if (error.code === "SQLITE_CONSTRAINT") {
    console.error("Email already exists");
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## 次のステップ

- [TypeScript SDK Reference](/docs/services/turso/docs/sdk/ts/reference) - 詳細なAPIリファレンス
- [Embedded Replicas](/docs/services/turso/docs/features/embedded-replicas/introduction) - ローカルレプリカの使用
- [Authentication](/docs/services/turso/docs/sdk/authentication) - 認証の詳細

## 関連リンク

- [Turso公式サイト](https://turso.tech/)
- [@libsql/client GitHub](https://github.com/tursodatabase/libsql-client-ts)
- [SDK Introduction](/docs/services/turso/docs/sdk/introduction)
- [Turso Examples](https://github.com/tursodatabase/examples)
