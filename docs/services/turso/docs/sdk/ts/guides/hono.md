# Hono + Turso 統合ガイド

Hono フレームワークで Turso データベースを使用する方法を説明します。

## セットアップ手順

### 1. libSQL SDK のインストール

```bash
npm install @libsql/client
```

### 2. 環境変数の設定

`.env` ファイルを作成：

```env
TURSO_DATABASE_URL=libsql://[DATABASE-NAME]-[ORG].turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
```

### 3. libSQL クライアントの設定

`src/lib/turso.ts` を作成：

```typescript
import { createClient } from "@libsql/client";

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

## 実装例

### 基本的なルート

```typescript
import { Hono } from "hono";
import { turso } from "./lib/turso";

const app = new Hono();

app.get("/items", async (c) => {
  const { rows } = await turso.execute("SELECT * FROM items");
  return c.json({ items: rows });
});

app.get("/items/:id", async (c) => {
  const id = c.req.param("id");
  const { rows } = await turso.execute({
    sql: "SELECT * FROM items WHERE id = ?",
    args: [id],
  });

  if (rows.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }

  return c.json({ item: rows[0] });
});

app.post("/items", async (c) => {
  const body = await c.req.json();

  const result = await turso.execute({
    sql: "INSERT INTO items (name, description) VALUES (?, ?)",
    args: [body.name, body.description],
  });

  return c.json({
    id: result.lastInsertRowid,
    message: "Item created successfully",
  });
});

app.put("/items/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  await turso.execute({
    sql: "UPDATE items SET name = ?, description = ? WHERE id = ?",
    args: [body.name, body.description, id],
  });

  return c.json({ message: "Item updated successfully" });
});

app.delete("/items/:id", async (c) => {
  const id = c.req.param("id");

  await turso.execute({
    sql: "DELETE FROM items WHERE id = ?",
    args: [id],
  });

  return c.json({ message: "Item deleted successfully" });
});

export default app;
```

### エラーハンドリング

```typescript
import { Hono } from "hono";
import { turso } from "./lib/turso";

const app = new Hono();

app.get("/items", async (c) => {
  try {
    const { rows } = await turso.execute("SELECT * FROM items");
    return c.json({ items: rows });
  } catch (error) {
    console.error("Database error:", error);
    return c.json({ error: "Failed to fetch items" }, 500);
  }
});

export default app;
```

### ミドルウェアでのデータベース接続

```typescript
import { Hono } from "hono";
import { createClient } from "@libsql/client";

const app = new Hono();

// データベースをコンテキストに追加
app.use("*", async (c, next) => {
  c.set("db", createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }));
  await next();
});

app.get("/items", async (c) => {
  const db = c.get("db");
  const { rows } = await db.execute("SELECT * FROM items");
  return c.json({ items: rows });
});

export default app;
```

### Cloudflare Workers での使用

```typescript
import { Hono } from "hono";
import { createClient } from "@libsql/client/web";

const app = new Hono();

app.get("/items", async (c) => {
  const db = createClient({
    url: c.env.TURSO_DATABASE_URL,
    authToken: c.env.TURSO_AUTH_TOKEN,
  });

  const { rows } = await db.execute("SELECT * FROM items");
  return c.json({ items: rows });
});

export default app;
```

## サンプルプロジェクト

**Expenses tracker app**: GitHub で完全な例を確認できます。

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Hono 公式ドキュメント](https://hono.dev)
