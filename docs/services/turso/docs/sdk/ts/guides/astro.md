# Astro + Turso 統合ガイド

Astro アプリケーションで Turso データベースを使用する方法を説明します。

## 📚 目次

- [概要](#概要)
- [前提条件](#前提条件)
- [セットアップ手順](#セットアップ手順)
- [データの取得](#データの取得)
- [API エンドポイント](#api-エンドポイント)
- [サンプルプロジェクト](#サンプルプロジェクト)
- [ベストプラクティス](#ベストプラクティス)

## 概要

Astro は高速な静的サイトジェネレーターで、Turso と組み合わせることでデータベース駆動のコンテンツサイトを構築できます。

## 前提条件

- Turso CLI のインストール
- Turso アカウントの作成
- Astro プロジェクトの準備

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
import { createClient } from "@libsql/client/web";

export const turso = createClient({
  url: import.meta.env.TURSO_DATABASE_URL!,
  authToken: import.meta.env.TURSO_AUTH_TOKEN,
});
```

## データの取得

### Astro コンポーネントでのクエリ

```astro
---
// src/pages/posts.astro
import { turso } from '../lib/turso';

const { rows } = await turso.execute('SELECT * FROM posts ORDER BY created_at DESC');
const posts = rows;
---

<html>
  <head>
    <title>ブログ記事</title>
  </head>
  <body>
    <h1>ブログ記事一覧</h1>
    <ul>
      {posts.map((post) => (
        <li>
          <a href={`/posts/${post.id}`}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </a>
        </li>
      ))}
    </ul>
  </body>
</html>
```

### 動的ルート

```astro
---
// src/pages/posts/[id].astro
import { turso } from '../../lib/turso';

const { id } = Astro.params;

const { rows } = await turso.execute({
  sql: 'SELECT * FROM posts WHERE id = ?',
  args: [id]
});

const post = rows[0];

if (!post) {
  return Astro.redirect('/404');
}
---

<html>
  <head>
    <title>{post.title}</title>
  </head>
  <body>
    <article>
      <h1>{post.title}</h1>
      <div set:html={post.content} />
    </article>
  </body>
</html>
```

## API エンドポイント

### GET エンドポイント

```typescript
// src/pages/api/posts.ts
import type { APIRoute } from "astro";
import { turso } from "../../lib/turso";

export const GET: APIRoute = async () => {
  try {
    const { rows } = await turso.execute("SELECT * FROM posts");
    return new Response(JSON.stringify({ posts: rows }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch posts" }), {
      status: 500,
    });
  }
};
```

### POST エンドポイント

```typescript
// src/pages/api/posts.ts
import type { APIRoute } from "astro";
import { turso } from "../../lib/turso";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { title, content } = await request.json();

    const result = await turso.execute({
      sql: "INSERT INTO posts (title, content) VALUES (?, ?)",
      args: [title, content],
    });

    return new Response(
      JSON.stringify({
        id: result.lastInsertRowid,
        message: "Post created successfully",
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create post" }), {
      status: 500,
    });
  }
};
```

## サンプルプロジェクト

GitHub に完全なブログアプリケーションの例があります：

**リポジトリ**: [turso-extended/app-at-the-polls](https://github.com/turso-extended/app-at-the-polls)

## ベストプラクティス

### 1. 環境変数の検証

```typescript
// src/lib/turso.ts
if (
  !import.meta.env.TURSO_DATABASE_URL ||
  !import.meta.env.TURSO_AUTH_TOKEN
) {
  throw new Error("Turso environment variables are not set");
}
```

### 2. エラーハンドリング

```astro
---
import { turso } from '../lib/turso';

let posts = [];
let error = null;

try {
  const { rows } = await turso.execute('SELECT * FROM posts');
  posts = rows;
} catch (e) {
  error = 'Failed to load posts';
  console.error(e);
}
---

{error ? (
  <div class="error">{error}</div>
) : (
  <ul>
    {posts.map(post => <li>{post.title}</li>)}
  </ul>
)}
```

### 3. SSR モードでの使用

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server", // SSR を有効化
});
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Astro 公式ドキュメント](https://docs.astro.build)
- [Turso 公式ドキュメント](https://docs.turso.tech)
