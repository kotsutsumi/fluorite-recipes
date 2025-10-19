# Remix + Turso 統合ガイド

Remix アプリケーションで Turso データベースを使用する方法を説明します。

## 📚 目次

- [概要](#概要)
- [前提条件](#前提条件)
- [セットアップ手順](#セットアップ手順)
- [Loader でのデータ取得](#loader-でのデータ取得)
- [Action でのデータ更新](#action-でのデータ更新)
- [サンプルプロジェクト](#サンプルプロジェクト)
- [ベストプラクティス](#ベストプラクティス)

## 概要

Remix は Web 標準に基づいたフルスタックフレームワークで、Turso と組み合わせることで高速なデータベース駆動のアプリケーションを構築できます。

## 前提条件

```typescript
interface Prerequisites {
  turso: {
    cli: "インストール済み";
    account: "作成済み";
    database: "作成済み";
  };
  remix: {
    version: "1.0+";
    application: "既存または新規プロジェクト";
  };
}
```

### Turso のセットアップ

```bash
# Turso CLI のインストール
curl -sSfL https://get.tur.so/install.sh | bash

# ログイン
turso auth login

# データベースを作成
turso db create my-remix-db

# 接続情報を取得
turso db show --url my-remix-db
turso db tokens create my-remix-db
```

## セットアップ手順

### 1. libSQL SDK のインストール

```bash
npm install @libsql/client
```

### 2. 環境変数の設定

`.env` ファイルを作成：

```env
TURSO_DATABASE_URL="libsql://[DATABASE-NAME]-[ORG].turso.io"
TURSO_AUTH_TOKEN="your-auth-token-here"
```

### 3. libSQL クライアントの設定

`app/lib/turso.server.ts` を作成：

```typescript
import { createClient } from "@libsql/client";

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
}

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

**重要**: `.server.ts` サフィックスを使用することで、このコードがサーバーサイドのみで実行されることを保証します。

## Loader でのデータ取得

### 基本的な Loader

```typescript
// app/routes/items.tsx
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { turso } from "~/lib/turso.server";

interface Item {
  id: number;
  name: string;
  description: string;
}

export const loader: LoaderFunction = async () => {
  const { rows } = await turso.execute("SELECT * FROM items");
  return { items: rows };
};

export default function ItemsPage() {
  const { items } = useLoaderData<{ items: Item[] }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">アイテム一覧</h1>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="p-4 border rounded">
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-gray-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### パラメータを使用した Loader

```typescript
// app/routes/items/$id.tsx
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { turso } from "~/lib/turso.server";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

export const loader: LoaderFunction = async ({ params }) => {
  const { rows } = await turso.execute({
    sql: "SELECT * FROM items WHERE id = ?",
    args: [params.id!],
  });

  if (rows.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ item: rows[0] as Item });
};

export default function ItemDetailPage() {
  const { item } = useLoaderData<{ item: Item }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
      <p className="text-gray-600 mb-4">{item.description}</p>
      <p className="text-xl font-semibold">¥{item.price.toLocaleString()}</p>
    </div>
  );
}
```

### 複数のクエリを実行する Loader

```typescript
// app/routes/dashboard.tsx
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { turso } from "~/lib/turso.server";

export const loader: LoaderFunction = async () => {
  // 複数のクエリを並行実行
  const [usersResult, ordersResult, statsResult] = await Promise.all([
    turso.execute("SELECT COUNT(*) as count FROM users"),
    turso.execute("SELECT COUNT(*) as count FROM orders"),
    turso.execute("SELECT SUM(total) as revenue FROM orders"),
  ]);

  return {
    userCount: usersResult.rows[0].count,
    orderCount: ordersResult.rows[0].count,
    revenue: statsResult.rows[0].revenue,
  };
};

export default function DashboardPage() {
  const { userCount, orderCount, revenue } = useLoaderData();

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="p-6 bg-blue-100 rounded">
        <h2 className="text-lg font-semibold">ユーザー数</h2>
        <p className="text-3xl">{userCount}</p>
      </div>
      <div className="p-6 bg-green-100 rounded">
        <h2 className="text-lg font-semibold">注文数</h2>
        <p className="text-3xl">{orderCount}</p>
      </div>
      <div className="p-6 bg-purple-100 rounded">
        <h2 className="text-lg font-semibold">売上</h2>
        <p className="text-3xl">¥{revenue.toLocaleString()}</p>
      </div>
    </div>
  );
}
```

## Action でのデータ更新

### 基本的な Action

```typescript
// app/routes/items/new.tsx
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData, redirect } from "@remix-run/react";
import { turso } from "~/lib/turso.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || !description) {
    return { error: "すべてのフィールドを入力してください" };
  }

  try {
    const result = await turso.execute({
      sql: "INSERT INTO items (name, description) VALUES (?, ?)",
      args: [name, description],
    });

    return redirect(`/items/${result.lastInsertRowid}`);
  } catch (error) {
    return { error: "アイテムの作成に失敗しました" };
  }
};

export default function NewItemPage() {
  const actionData = useActionData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新規アイテム</h1>

      {actionData?.error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            名前
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            説明
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          作成
        </button>
      </Form>
    </div>
  );
}
```

### 更新と削除の Action

```typescript
// app/routes/items/$id/edit.tsx
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useActionData, redirect } from "@remix-run/react";
import { turso } from "~/lib/turso.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { rows } = await turso.execute({
    sql: "SELECT * FROM items WHERE id = ?",
    args: [params.id!],
  });

  if (rows.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  return { item: rows[0] };
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await turso.execute({
      sql: "DELETE FROM items WHERE id = ?",
      args: [params.id!],
    });
    return redirect("/items");
  }

  // 更新処理
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || !description) {
    return { error: "すべてのフィールドを入力してください" };
  }

  try {
    await turso.execute({
      sql: "UPDATE items SET name = ?, description = ? WHERE id = ?",
      args: [name, description, params.id!],
    });

    return redirect(`/items/${params.id}`);
  } catch (error) {
    return { error: "更新に失敗しました" };
  }
};

export default function EditItemPage() {
  const { item } = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">アイテムを編集</h1>

      {actionData?.error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            名前
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={item.name}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            説明
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={item.description}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            更新
          </button>
          <button
            type="submit"
            name="intent"
            value="delete"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            削除
          </button>
        </div>
      </Form>
    </div>
  );
}
```

### トランザクションを使用した Action

```typescript
// app/routes/orders/checkout.tsx
import type { ActionFunction } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { turso } from "~/lib/turso.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const items = JSON.parse(formData.get("items") as string);

  const tx = await turso.transaction("write");

  try {
    // 注文を作成
    const orderResult = await tx.execute({
      sql: "INSERT INTO orders (user_id, total) VALUES (?, ?)",
      args: [userId, calculateTotal(items)],
    });

    const orderId = orderResult.lastInsertRowid;

    // 注文アイテムを挿入
    for (const item of items) {
      await tx.execute({
        sql: "INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)",
        args: [orderId, item.id, item.quantity],
      });

      // 在庫を更新
      await tx.execute({
        sql: "UPDATE items SET stock = stock - ? WHERE id = ?",
        args: [item.quantity, item.id],
      });
    }

    await tx.commit();
    return redirect(`/orders/${orderId}`);
  } catch (error) {
    await tx.rollback();
    return { error: "注文の処理に失敗しました" };
  }
};

function calculateTotal(items: any[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export default function CheckoutPage() {
  // チェックアウトフォーム
  return (
    <Form method="post">
      {/* フォームの内容 */}
    </Form>
  );
}
```

## サンプルプロジェクト

### Eコマースストア

機能：
- 商品一覧と詳細
- ショッピングカート
- 注文管理
- ユーザー認証

### CRM アプリケーション

機能：
- 顧客管理
- タスク追跡
- レポート生成
- ダッシュボード

**GitHub**: [turso-extended/app-turso-crm](https://github.com/turso-extended/app-turso-crm)

## ベストプラクティス

### 1. エラーハンドリング

```typescript
// app/lib/db.server.ts
import { turso } from "~/lib/turso.server";

export async function getItems() {
  try {
    const { rows } = await turso.execute("SELECT * FROM items");
    return { success: true, data: rows };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to fetch items" };
  }
}

// ルートでの使用
export const loader: LoaderFunction = async () => {
  const result = await getItems();

  if (!result.success) {
    throw new Response(result.error, { status: 500 });
  }

  return { items: result.data };
};
```

### 2. 型安全性の向上

```typescript
// app/lib/db.server.ts
import { turso } from "~/lib/turso.server";

export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
}

export async function getItems(): Promise<Item[]> {
  const { rows } = await turso.execute("SELECT * FROM items");
  return rows as Item[];
}

export async function getItemById(id: string): Promise<Item | null> {
  const { rows } = await turso.execute({
    sql: "SELECT * FROM items WHERE id = ?",
    args: [id],
  });

  return rows.length > 0 ? (rows[0] as Item) : null;
}
```

### 3. データベース関数の分離

```typescript
// app/models/item.server.ts
import { turso } from "~/lib/turso.server";

export const ItemModel = {
  async findAll() {
    const { rows } = await turso.execute("SELECT * FROM items");
    return rows;
  },

  async findById(id: string) {
    const { rows } = await turso.execute({
      sql: "SELECT * FROM items WHERE id = ?",
      args: [id],
    });
    return rows[0] || null;
  },

  async create(data: { name: string; description: string }) {
    const result = await turso.execute({
      sql: "INSERT INTO items (name, description) VALUES (?, ?)",
      args: [data.name, data.description],
    });
    return result.lastInsertRowid;
  },

  async update(id: string, data: { name: string; description: string }) {
    await turso.execute({
      sql: "UPDATE items SET name = ?, description = ? WHERE id = ?",
      args: [data.name, data.description, id],
    });
  },

  async delete(id: string) {
    await turso.execute({
      sql: "DELETE FROM items WHERE id = ?",
      args: [id],
    });
  },
};
```

### 4. 楽観的 UI の実装

```typescript
// app/routes/items.tsx
import { useFetcher } from "@remix-run/react";

export default function ItemsPage() {
  const fetcher = useFetcher();

  const handleDelete = (id: number) => {
    if (confirm("本当に削除しますか？")) {
      fetcher.submit(
        { intent: "delete" },
        { method: "post", action: `/items/${id}` }
      );
    }
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          {item.name}
          <button
            onClick={() => handleDelete(item.id)}
            disabled={fetcher.state !== "idle"}
          >
            {fetcher.state !== "idle" ? "削除中..." : "削除"}
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Next.js との統合](./nextjs.md)
- [Drizzle ORM との統合](../orm/drizzle.md)
- [公式 Remix ドキュメント](https://remix.run/docs)
- [Turso 公式ドキュメント](https://docs.turso.tech)
