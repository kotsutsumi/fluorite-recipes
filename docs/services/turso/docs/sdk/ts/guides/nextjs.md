# Next.js + Turso 統合ガイド

Next.js アプリケーションで Turso データベースを使用する方法を説明します。

## 📚 目次

- [概要](#概要)
- [前提条件](#前提条件)
- [セットアップ手順](#セットアップ手順)
- [App Router での実装](#app-router-での実装)
- [Pages Directory での実装](#pages-directory-での実装)
- [環境変数の設定](#環境変数の設定)
- [サンプルプロジェクト](#サンプルプロジェクト)
- [ベストプラクティス](#ベストプラクティス)

## 概要

Turso は軽量で高速な SQLite ベースのデータベースで、Next.js のサーバーサイドレンダリングと完璧に統合できます。このガイドでは、Next.js の両方のアプローチ（App Router と Pages Directory）での実装方法を紹介します。

## 前提条件

```typescript
interface Prerequisites {
  turso: {
    cli: "インストール済み";
    account: "作成済み";
    database: "作成済み";
  };
  nextjs: {
    version: "13.0+（App Router）または 12.0+（Pages）";
    application: "既存または新規プロジェクト";
  };
}
```

### Turso CLI のインストール

```bash
# macOS / Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm get.tur.so/install.ps1 | iex
```

### データベースの作成

```bash
# Turso にサインアップ/ログイン
turso auth signup
# または
turso auth login

# データベースを作成
turso db create my-nextjs-db

# データベース URL を取得
turso db show --url my-nextjs-db

# 認証トークンを作成
turso db tokens create my-nextjs-db
```

## セットアップ手順

### 1. libSQL SDK のインストール

```bash
npm install @libsql/client
# または
pnpm add @libsql/client
# または
yarn add @libsql/client
```

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成します：

```env
TURSO_DATABASE_URL="libsql://[DATABASE-NAME]-[ORG].turso.io"
TURSO_AUTH_TOKEN="your-auth-token-here"
```

**.gitignore に追加**:
```gitignore
.env.local
```

### 3. libSQL クライアントの設定

`lib/turso.ts` を作成します：

```typescript
import { createClient } from "@libsql/client";

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

## App Router での実装

Next.js 13+ の App Router を使用する場合の実装方法です。

### Server Component でのデータ取得

```typescript
// app/users/page.tsx
import { turso } from "@/lib/turso";

export default async function UsersPage() {
  const { rows } = await turso.execute("SELECT * FROM users");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザー一覧</h1>
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="p-2 border rounded">
            <p className="font-semibold">{row.name}</p>
            <p className="text-sm text-gray-600">{row.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Server Actions での書き込み操作

```typescript
// app/users/actions.ts
"use server";

import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  await turso.execute({
    sql: "INSERT INTO users (name, email) VALUES (?, ?)",
    args: [name, email],
  });

  revalidatePath("/users");
}

export async function deleteUser(userId: number) {
  await turso.execute({
    sql: "DELETE FROM users WHERE id = ?",
    args: [userId],
  });

  revalidatePath("/users");
}
```

### フォームコンポーネント

```typescript
// app/users/new-user-form.tsx
import { createUser } from "./actions";

export function NewUserForm() {
  return (
    <form action={createUser} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          名前
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        ユーザーを作成
      </button>
    </form>
  );
}
```

### Route Handler での API エンドポイント

```typescript
// app/api/users/route.ts
import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { rows } = await turso.execute("SELECT * FROM users");
    return NextResponse.json({ users: rows });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    const result = await turso.execute({
      sql: "INSERT INTO users (name, email) VALUES (?, ?)",
      args: [name, email],
    });

    return NextResponse.json({
      id: result.lastInsertRowid,
      message: "User created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
```

## Pages Directory での実装

Next.js 12 以前または Pages Router を使用する場合の実装方法です。

### getServerSideProps でのデータ取得

```typescript
// pages/users.tsx
import { turso } from "@/lib/turso";
import { GetServerSideProps } from "next";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  users: User[];
}

export default function UsersPage({ users }: Props) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザー一覧</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="p-2 border rounded">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { rows } = await turso.execute("SELECT * FROM users");

  return {
    props: {
      users: rows as User[],
    },
  };
};
```

### getStaticProps での静的生成

```typescript
// pages/posts/[id].tsx
import { turso } from "@/lib/turso";
import { GetStaticPaths, GetStaticProps } from "next";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface Props {
  post: Post;
}

export default function PostPage({ post }: Props) {
  return (
    <article className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="prose">{post.content}</div>
    </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { rows } = await turso.execute("SELECT id FROM posts");

  const paths = rows.map((row) => ({
    params: { id: row.id.toString() },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const { rows } = await turso.execute({
    sql: "SELECT * FROM posts WHERE id = ?",
    args: [params?.id as string],
  });

  if (rows.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post: rows[0] as Post,
    },
    revalidate: 60, // 60秒ごとに再生成
  };
};
```

### API Routes での実装

```typescript
// pages/api/users.ts
import { turso } from "@/lib/turso";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { rows } = await turso.execute("SELECT * FROM users");
      res.status(200).json({ users: rows });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email } = req.body;

      const result = await turso.execute({
        sql: "INSERT INTO users (name, email) VALUES (?, ?)",
        args: [name, email],
      });

      res.status(201).json({
        id: result.lastInsertRowid,
        message: "User created successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
```

## 環境変数の設定

### TypeScript 型定義

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    TURSO_DATABASE_URL: string;
    TURSO_AUTH_TOKEN: string;
  }
}
```

### 環境変数の検証

```typescript
// lib/env.ts
function validateEnv() {
  const required = ["TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}

validateEnv();
```

## サンプルプロジェクト

### フルスタックアプリケーション例

Turso の GitHub リポジトリに、Next.js + Turso + Drizzle ORM を使用した完全なサンプルアプリケーションがあります。

**特徴**:
- App Router を使用
- Server Actions による CRUD 操作
- Drizzle ORM による型安全なクエリ
- 認証とセッション管理

**リポジトリ**: [turso-extended/app-the-meerkat-center](https://github.com/turso-extended/app-the-meerkat-center)

## ベストプラクティス

### 1. クライアントの再利用

```typescript
// ✅ 推奨: 単一のクライアントインスタンスを作成
// lib/turso.ts
export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ❌ 非推奨: リクエストごとに新しいクライアントを作成
export function getTurso() {
  return createClient({ /* ... */ });
}
```

### 2. エラーハンドリング

```typescript
// app/api/users/route.ts
import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { rows } = await turso.execute("SELECT * FROM users");
    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
```

### 3. トランザクションの使用

```typescript
// app/actions/transfer.ts
"use server";

import { turso } from "@/lib/turso";

export async function transferFunds(
  fromAccountId: number,
  toAccountId: number,
  amount: number
) {
  const tx = await turso.transaction("write");

  try {
    // 送金元から減額
    await tx.execute({
      sql: "UPDATE accounts SET balance = balance - ? WHERE id = ?",
      args: [amount, fromAccountId],
    });

    // 送金先に加算
    await tx.execute({
      sql: "UPDATE accounts SET balance = balance + ? WHERE id = ?",
      args: [amount, toAccountId],
    });

    await tx.commit();
    return { success: true };
  } catch (error) {
    await tx.rollback();
    return { success: false, error: "Transfer failed" };
  }
}
```

### 4. 環境ごとの設定

```typescript
// lib/turso.ts
import { createClient } from "@libsql/client";

const config =
  process.env.NODE_ENV === "development"
    ? {
        // 開発環境: ローカルファイル
        url: "file:local.db",
      }
    : {
        // 本番環境: Turso クラウド
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      };

export const turso = createClient(config);
```

### 5. パフォーマンス最適化

```typescript
// キャッシュの使用（App Router）
import { turso } from "@/lib/turso";
import { cache } from "react";

export const getUsers = cache(async () => {
  const { rows } = await turso.execute("SELECT * FROM users");
  return rows;
});

// ページでの使用
export default async function UsersPage() {
  const users = await getUsers();
  // ...
}
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. 環境変数が読み込まれない

```typescript
// ❌ クライアントコンポーネントでは動作しません
"use client";
const url = process.env.TURSO_DATABASE_URL; // undefined

// ✅ Server Component または API Route で使用
const url = process.env.TURSO_DATABASE_URL; // 正常に動作
```

#### 2. TypeScript エラー

```typescript
// エラー: process.env.TURSO_DATABASE_URL は string | undefined
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL, // Type error
});

// 解決方法 1: Non-null assertion
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
});

// 解決方法 2: デフォルト値
const turso = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "",
});

// 解決方法 3: 検証
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is required");
}
```

#### 3. Edge Runtime での使用

```typescript
// app/api/users/route.ts
import { turso } from "@/lib/turso";

// Edge Runtime を指定
export const runtime = "edge";

export async function GET() {
  // Edge Runtime で Turso を使用可能
  const { rows } = await turso.execute("SELECT * FROM users");
  return Response.json({ users: rows });
}
```

## 関連リンク

- [TypeScript SDK リファレンス](../reference.md)
- [Drizzle ORM との統合](../orm/drizzle.md)
- [Prisma との統合](../orm/prisma.md)
- [公式 Next.js ドキュメント](https://nextjs.org/docs)
- [Turso 公式ドキュメント](https://docs.turso.tech)
