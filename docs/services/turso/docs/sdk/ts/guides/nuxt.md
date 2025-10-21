# Nuxt + Turso 統合ガイド

Nuxt アプリケーションで Turso データベースを使用する方法を説明します。

## 📚 目次

- [概要](#概要)
- [前提条件](#前提条件)
- [セットアップ手順](#セットアップ手順)
- [サーバー API の実装](#サーバー-api-の実装)
- [サンプルプロジェクト](#サンプルプロジェクト)
- [ベストプラクティス](#ベストプラクティス)

## 概要

Nuxt 3 は Vue.js ベースのフルスタックフレームワークで、Turso と組み合わせることで高速なユニバーサルアプリケーションを構築できます。

## 前提条件

- Turso CLI のインストール
- Turso アカウントの作成
- Nuxt 3 プロジェクトの準備

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

### 3. Nuxt 設定

`nuxt.config.ts` でランタイム設定を追加：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    turso: {
      databaseUrl: "",
      authToken: "",
    },
  },
});
```

### 4. libSQL クライアントユーティリティ

`server/utils/turso.ts` を作成：

```typescript
import { createClient } from "@libsql/client";

export function useTurso() {
  const config = useRuntimeConfig();

  return createClient({
    url: config.turso.databaseUrl,
    authToken: config.turso.authToken,
  });
}
```

## サーバー API の実装

### GET エンドポイント

```typescript
// server/api/items.get.ts
export default defineEventHandler(async (event) => {
  const client = useTurso();

  try {
    const { rows } = await client.execute("SELECT * FROM items");
    return {
      data: { items: rows },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch items",
    });
  }
});
```

### POST エンドポイント

```typescript
// server/api/items.post.ts
export default defineEventHandler(async (event) => {
  const client = useTurso();
  const body = await readBody(event);

  try {
    const result = await client.execute({
      sql: "INSERT INTO items (name, description) VALUES (?, ?)",
      args: [body.name, body.description],
    });

    return {
      data: {
        id: result.lastInsertRowid,
        message: "Item created successfully",
      },
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to create item",
    });
  }
});
```

### 動的ルート

```typescript
// server/api/items/[id].get.ts
export default defineEventHandler(async (event) => {
  const client = useTurso();
  const id = getRouterParam(event, "id");

  try {
    const { rows } = await client.execute({
      sql: "SELECT * FROM items WHERE id = ?",
      args: [id],
    });

    if (rows.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Item not found",
      });
    }

    return { data: { item: rows[0] } };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to fetch item",
    });
  }
});
```

### UPDATE と DELETE

```typescript
// server/api/items/[id].put.ts
export default defineEventHandler(async (event) => {
  const client = useTurso();
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  try {
    await client.execute({
      sql: "UPDATE items SET name = ?, description = ? WHERE id = ?",
      args: [body.name, body.description, id],
    });

    return { data: { message: "Item updated successfully" } };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to update item",
    });
  }
});

// server/api/items/[id].delete.ts
export default defineEventHandler(async (event) => {
  const client = useTurso();
  const id = getRouterParam(event, "id");

  try {
    await client.execute({
      sql: "DELETE FROM items WHERE id = ?",
      args: [id],
    });

    return { data: { message: "Item deleted successfully" } };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to delete item",
    });
  }
});
```

## クライアントサイドでの使用

### Composable の作成

```typescript
// composables/useItems.ts
export const useItems = () => {
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchItems = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await $fetch("/api/items");
      items.value = data.items;
    } catch (e) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const createItem = async (itemData) => {
    try {
      await $fetch("/api/items", {
        method: "POST",
        body: itemData,
      });
      await fetchItems();
    } catch (e) {
      error.value = e.message;
    }
  };

  const deleteItem = async (id) => {
    try {
      await $fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      await fetchItems();
    } catch (e) {
      error.value = e.message;
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    deleteItem,
  };
};
```

### Vue コンポーネントでの使用

```vue
<template>
  <div>
    <h1>アイテム一覧</h1>

    <div v-if="loading">読み込み中...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <ul v-if="!loading && !error">
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
        <button @click="deleteItem(item.id)">削除</button>
      </li>
    </ul>

    <form @submit.prevent="handleSubmit">
      <input v-model="newItem.name" placeholder="名前" required />
      <input v-model="newItem.description" placeholder="説明" required />
      <button type="submit">追加</button>
    </form>
  </div>
</template>

<script setup lang="ts">
const { items, loading, error, fetchItems, createItem, deleteItem } =
  useItems();

const newItem = ref({
  name: "",
  description: "",
});

const handleSubmit = async () => {
  await createItem(newItem.value);
  newItem.value = { name: "", description: "" };
};

onMounted(() => {
  fetchItems();
});
</script>
```

## サンプルプロジェクト

GitHub に完全な例があります：

**リポジトリ**: [turso-extended/app-turso-nuxt](https://github.com/turso-extended/app-turso-nuxt)

## ベストプラクティス

### 1. エラーハンドリング

```typescript
// server/utils/db.ts
export async function withDB<T>(
  callback: (client: ReturnType<typeof useTurso>) => Promise<T>
): Promise<T> {
  const client = useTurso();

  try {
    return await callback(client);
  } catch (error) {
    console.error("Database error:", error);
    throw createError({
      statusCode: 500,
      message: "Database operation failed",
    });
  }
}

// 使用例
export default defineEventHandler(async (event) => {
  return withDB(async (client) => {
    const { rows } = await client.execute("SELECT * FROM items");
    return { data: { items: rows } };
  });
});
```

### 2. トランザクションの使用

```typescript
// server/api/orders/checkout.post.ts
export default defineEventHandler(async (event) => {
  const client = useTurso();
  const body = await readBody(event);

  const tx = await client.transaction("write");

  try {
    const orderResult = await tx.execute({
      sql: "INSERT INTO orders (user_id, total) VALUES (?, ?)",
      args: [body.userId, body.total],
    });

    for (const item of body.items) {
      await tx.execute({
        sql: "INSERT INTO order_items (order_id, item_id, quantity) VALUES (?, ?, ?)",
        args: [orderResult.lastInsertRowid, item.id, item.quantity],
      });
    }

    await tx.commit();

    return {
      data: {
        orderId: orderResult.lastInsertRowid,
        message: "Order created successfully",
      },
    };
  } catch (error) {
    await tx.rollback();
    throw createError({
      statusCode: 500,
      message: "Failed to create order",
    });
  }
});
```

### 3. キャッシュの活用

```typescript
// server/api/items.get.ts
export default defineCachedEventHandler(
  async (event) => {
    const client = useTurso();
    const { rows } = await client.execute("SELECT * FROM items");
    return { data: { items: rows } };
  },
  {
    maxAge: 60, // 60秒間キャッシュ
  }
);
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Nuxt 公式ドキュメント](https://nuxt.com/docs)
- [Turso 公式ドキュメント](https://docs.turso.tech)
