# Elysia + Turso 統合ガイド

Elysia フレームワークで Turso データベースを使用する方法を説明します。

## セットアップ手順

### 1. libSQL SDK のインストール

```bash
bun add @libsql/client
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
import { Elysia } from "elysia";
import { turso } from "./lib/turso";

const app = new Elysia()
  .get("/items", async () => {
    const { rows } = await turso.execute("SELECT * FROM items");
    return { items: rows };
  })
  .get("/items/:id", async ({ params }) => {
    const { rows } = await turso.execute({
      sql: "SELECT * FROM items WHERE id = ?",
      args: [params.id],
    });

    if (rows.length === 0) {
      return { error: "Item not found" };
    }

    return { item: rows[0] };
  })
  .post("/items", async ({ body }) => {
    const result = await turso.execute({
      sql: "INSERT INTO items (name, description) VALUES (?, ?)",
      args: [body.name, body.description],
    });

    return {
      id: result.lastInsertRowid,
      message: "Item created successfully",
    };
  })
  .put("/items/:id", async ({ params, body }) => {
    await turso.execute({
      sql: "UPDATE items SET name = ?, description = ? WHERE id = ?",
      args: [body.name, body.description, params.id],
    });

    return { message: "Item updated successfully" };
  })
  .delete("/items/:id", async ({ params }) => {
    await turso.execute({
      sql: "DELETE FROM items WHERE id = ?",
      args: [params.id],
    });

    return { message: "Item deleted successfully" };
  })
  .listen(3000);

console.log(
  `Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

### エラーハンドリング

```typescript
import { Elysia } from "elysia";
import { turso } from "./lib/turso";

const app = new Elysia()
  .get("/items", async ({ set }) => {
    try {
      const { rows } = await turso.execute("SELECT * FROM items");
      return { items: rows };
    } catch (error) {
      set.status = 500;
      return { error: "Failed to fetch items" };
    }
  })
  .listen(3000);
```

### バリデーション付き

```typescript
import { Elysia, t } from "elysia";
import { turso } from "./lib/turso";

const app = new Elysia()
  .post(
    "/items",
    async ({ body }) => {
      const result = await turso.execute({
        sql: "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
        args: [body.name, body.description, body.price],
      });

      return {
        id: result.lastInsertRowid,
        message: "Item created successfully",
      };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.String({ minLength: 1 }),
        price: t.Number({ minimum: 0 }),
      }),
    }
  )
  .listen(3000);
```

## サンプルプロジェクト

**Expenses tracker app**: GitHub で完全な例を確認できます。

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Elysia 公式ドキュメント](https://elysiajs.com)
