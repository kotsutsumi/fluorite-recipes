# Qwik + Turso 統合ガイド

Qwik アプリケーションで Turso データベースを使用する方法を説明します。

## 📚 目次

- [概要](#概要)
- [セットアップ手順](#セットアップ手順)
- [実装例](#実装例)
- [サンプルプロジェクト](#サンプルプロジェクト)

## 概要

Qwik は再開可能なフレームワークで、Turso と組み合わせることで高速なアプリケーションを構築できます。

## セットアップ手順

### 1. Turso 統合の追加

```bash
npm run qwik add turso
# または
pnpm qwik add turso
# または
yarn qwik add turso
```

### 2. 環境変数の設定

`.env.local` ファイルを作成：

```env
PRIVATE_TURSO_DATABASE_URL=libsql://[DATABASE-NAME]-[ORG].turso.io
PRIVATE_TURSO_AUTH_TOKEN=your-auth-token-here
```

### 3. データベース接続

統合により `src/utils/turso.ts` が自動生成されます：

```typescript
import { createClient } from "@libsql/client/web";

export const tursoClient = (env: Record<string, string>) => {
  return createClient({
    url: env["PRIVATE_TURSO_DATABASE_URL"],
    authToken: env["PRIVATE_TURSO_AUTH_TOKEN"],
  });
};
```

## 実装例

### routeLoader$ での データ取得

```typescript
import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { RequestEventBase } from "@builder.io/qwik-city";
import { tursoClient } from "~/utils/turso";

export const useItems = routeLoader$(async (requestEvent: RequestEventBase) => {
  const db = tursoClient(requestEvent["env"]);
  const { rows } = await db.execute("SELECT * FROM items");

  return {
    items: rows,
  };
});

export default component$(() => {
  const items = useItems();

  return (
    <div>
      <h1>アイテム一覧</h1>
      <ul>
        {items.value.items.map((item: any) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
});
```

### routeAction$ でのデータ更新

```typescript
import { component$ } from "@builder.io/qwik";
import { routeAction$, Form, zod$, z } from "@builder.io/qwik-city";
import type { RequestEventBase } from "@builder.io/qwik-city";
import { tursoClient } from "~/utils/turso";

export const useCreateItem = routeAction$(
  async (data, requestEvent: RequestEventBase) => {
    const db = tursoClient(requestEvent["env"]);

    const result = await db.execute({
      sql: "INSERT INTO items (name, description) VALUES (?, ?)",
      args: [data.name, data.description],
    });

    return {
      success: true,
      id: result.lastInsertRowid,
    };
  },
  zod$({
    name: z.string().min(1),
    description: z.string().min(1),
  })
);

export default component$(() => {
  const createAction = useCreateItem();

  return (
    <div>
      <h1>新規アイテム</h1>
      <Form action={createAction}>
        <input name="name" placeholder="名前" required />
        <input name="description" placeholder="説明" required />
        <button type="submit">作成</button>
      </Form>

      {createAction.value?.success && (
        <p>アイテムが作成されました (ID: {createAction.value.id})</p>
      )}
    </div>
  );
});
```

## サンプルプロジェクト

### Social Website

ソーシャル機能を持つWebサイトの例

### Shopping Cart

ショッピングカート機能の実装例

**GitHub**: Turso examples リポジトリを参照

## ベストプラクティス

### エラーハンドリング

```typescript
export const useItems = routeLoader$(async (requestEvent: RequestEventBase) => {
  try {
    const db = tursoClient(requestEvent["env"]);
    const { rows } = await db.execute("SELECT * FROM items");
    return { items: rows, error: null };
  } catch (error) {
    console.error("Database error:", error);
    return { items: [], error: "Failed to fetch items" };
  }
});
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Qwik 公式ドキュメント](https://qwik.builder.io/docs)
- [Turso 公式ドキュメント](https://docs.turso.tech)
