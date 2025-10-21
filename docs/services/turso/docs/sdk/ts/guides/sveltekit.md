# SvelteKit + Turso 統合ガイド

SvelteKit アプリケーションで Turso データベースを使用する方法を説明します。

## 📚 目次

- [概要](#概要)
- [セットアップ手順](#セットアップ手順)
- [実装例](#実装例)
- [サンプルプロジェクト](#サンプルプロジェクト)

## 概要

SvelteKit は Svelte のフルスタックフレームワークで、Turso と組み合わせることで高速なアプリケーションを構築できます。

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

Node.js ランタイムの場合：

```typescript
// src/lib/turso.ts
import { createClient } from "@libsql/client";
import {
  TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN,
} from "$env/static/private";

export const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});
```

Edge ランタイムの場合：

```typescript
// src/lib/turso.ts
import { createClient } from "@libsql/client/web";
import {
  TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN,
} from "$env/static/private";

export const turso = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});
```

## 実装例

### Load 関数でのデータ取得

```typescript
// src/routes/posts/+page.server.ts
import { turso } from "$lib/turso";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const { rows } = await turso.execute("SELECT * FROM posts");

  return {
    posts: rows,
  };
};
```

```svelte
<!-- src/routes/posts/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>記事一覧</h1>

<ul>
  {#each data.posts as post}
    <li>
      <a href="/posts/{post.id}">
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
      </a>
    </li>
  {/each}
</ul>
```

### Form Actions でのデータ更新

```typescript
// src/routes/posts/new/+page.server.ts
import { turso } from "$lib/turso";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title || !content) {
      return fail(400, { error: "すべてのフィールドを入力してください" });
    }

    try {
      const result = await turso.execute({
        sql: "INSERT INTO posts (title, content) VALUES (?, ?)",
        args: [title, content],
      });

      throw redirect(303, `/posts/${result.lastInsertRowid}`);
    } catch (error) {
      return fail(500, { error: "記事の作成に失敗しました" });
    }
  },
};
```

```svelte
<!-- src/routes/posts/new/+page.svelte -->
<script lang="ts">
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<h1>新規記事</h1>

{#if form?.error}
  <div class="error">{form.error}</div>
{/if}

<form method="POST">
  <div>
    <label for="title">タイトル</label>
    <input type="text" id="title" name="title" required />
  </div>

  <div>
    <label for="content">内容</label>
    <textarea id="content" name="content" required rows="10"></textarea>
  </div>

  <button type="submit">作成</button>
</form>
```

### API Routes

```typescript
// src/routes/api/posts/+server.ts
import { turso } from "$lib/turso";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  try {
    const { rows } = await turso.execute("SELECT * FROM posts");
    return json({ posts: rows });
  } catch (error) {
    return json({ error: "Failed to fetch posts" }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { title, content } = await request.json();

    const result = await turso.execute({
      sql: "INSERT INTO posts (title, content) VALUES (?, ?)",
      args: [title, content],
    });

    return json({
      id: result.lastInsertRowid,
      message: "Post created successfully",
    });
  } catch (error) {
    return json({ error: "Failed to create post" }, { status: 500 });
  }
};
```

### 動的ルート

```typescript
// src/routes/posts/[id]/+page.server.ts
import { turso } from "$lib/turso";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { rows } = await turso.execute({
    sql: "SELECT * FROM posts WHERE id = ?",
    args: [params.id],
  });

  if (rows.length === 0) {
    throw error(404, "記事が見つかりません");
  }

  return {
    post: rows[0],
  };
};
```

## サンプルプロジェクト

GitHub にブログアプリケーションの例があります：

**リポジトリ**: [turso-extended/app-turso-sveltekit-blog](https://github.com/turso-extended/app-turso-sveltekit-blog)

## ベストプラクティス

### 1. エラーハンドリング

```typescript
// src/lib/db.ts
import { turso } from "$lib/turso";

export async function getPosts() {
  try {
    const { rows } = await turso.execute("SELECT * FROM posts");
    return { success: true, data: rows };
  } catch (err) {
    console.error("Database error:", err);
    return { success: false, error: "Failed to fetch posts" };
  }
}
```

### 2. トランザクションの使用

```typescript
// src/routes/transfer/+page.server.ts
import { turso } from "$lib/turso";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const fromId = formData.get("fromId") as string;
    const toId = formData.get("toId") as string;
    const amount = parseFloat(formData.get("amount") as string);

    const tx = await turso.transaction("write");

    try {
      await tx.execute({
        sql: "UPDATE accounts SET balance = balance - ? WHERE id = ?",
        args: [amount, fromId],
      });

      await tx.execute({
        sql: "UPDATE accounts SET balance = balance + ? WHERE id = ?",
        args: [amount, toId],
      });

      await tx.commit();
      throw redirect(303, "/transfer/success");
    } catch (error) {
      await tx.rollback();
      return fail(500, { error: "送金に失敗しました" });
    }
  },
};
```

### 3. 型安全性の向上

```typescript
// src/lib/types.ts
export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

// src/routes/posts/+page.server.ts
import type { Post } from "$lib/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const { rows } = await turso.execute("SELECT * FROM posts");

  return {
    posts: rows as Post[],
  };
};
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [SvelteKit 公式ドキュメント](https://kit.svelte.dev/docs)
- [Turso 公式ドキュメント](https://docs.turso.tech)
