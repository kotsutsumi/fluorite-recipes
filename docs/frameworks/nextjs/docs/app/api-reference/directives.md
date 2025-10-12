# Next.js Directives API リファレンス

Next.js App Router で使用されるディレクティブの包括的なAPIリファレンスです。これらのディレクティブは、サーバーとクライアント間の実行境界、キャッシュ動作を明確に制御するために使用されます。

## ディレクティブ一覧

### 1. [use cache](./directives/01-use-cache.md)

**対象**: サーバー側でのデータキャッシュ（実験的機能）

ルート、Reactコンポーネント、または関数をキャッシュ可能としてマークし、パフォーマンスを向上させます。

**主な機能**:

- **関数レベルキャッシュ**: 関数の結果をキャッシュ
- **コンポーネントレベルキャッシュ**: Reactコンポーネントの出力をキャッシュ
- **ルートレベルキャッシュ**: ルート全体をキャッシュ
- **自動キャッシュキー生成**: ビルドID、関数ID、引数から自動生成

**使用前の設定**:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
};

export default nextConfig;
```

**基本的な使用例**:

#### 関数レベルのキャッシュ

```typescript
"use cache";

export async function getData() {
  const data = await fetch("/api/data");
  return data;
}
```

#### コンポーネントレベルのキャッシュ

```typescript
'use cache'

export default async function UserProfile({ userId }: { userId: string }) {
  const user = await fetchUser(userId)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

#### ルートレベルのキャッシュ

```typescript
'use cache'

export default async function Page() {
  const posts = await fetchPosts()

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}
```

**キャッシュキーの仕組み**:

- ビルドID + 関数ID + シリアライズ可能な引数
- 引数の変更により自動的にキャッシュが無効化

---

### 2. [use client](./directives/02-use-client.md)

**対象**: クライアントサイドレンダリング

クライアント側でレンダリングされるコンポーネントのエントリーポイントを宣言し、インタラクティブなユーザーインターフェースを作成します。

**主な機能**:

- **状態管理**: React Hooksの使用（useState, useEffect等）
- **イベントハンドリング**: クライアント側のイベント処理
- **ブラウザAPI**: window、document等へのアクセス
- **インタラクティブUI**: ユーザーインタラクションの実装

**使用が必要なケース**:

- React Hooksの使用
- イベントリスナー（onClick, onChange等）
- ブラウザ専用API（window, document, localStorage等）
- 状態管理ライブラリ（Redux, Zustand等）

**基本的な使用例**:

#### 状態管理

```typescript
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>増加</button>
    </div>
  )
}
```

#### イベントハンドリング

```typescript
'use client'

export default function InteractiveButton() {
  const handleClick = () => {
    alert('ボタンがクリックされました!')
  }

  return (
    <button onClick={handleClick}>
      クリックしてください
    </button>
  )
}
```

#### ブラウザAPI

```typescript
'use client'

import { useEffect, useState } from 'react'

export default function WindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div>
      <p>ウィンドウの幅: {size.width}px</p>
      <p>ウィンドウの高さ: {size.height}px</p>
    </div>
  )
}
```

**コンポーネント間の組み合わせ**:

```typescript
// サーバーコンポーネント内でクライアントコンポーネントを使用
// app/page.tsx (サーバーコンポーネント)
import ClientCounter from '@/components/ClientCounter'

export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(res => res.json())

  return (
    <div>
      <h1>サーバーレンダリングされたページ</h1>
      <p>データ: {data.value}</p>
      <ClientCounter />
    </div>
  )
}
```

---

### 3. [use server](./directives/03-use-server.md)

**対象**: サーバーサイド関数の実行

関数またはファイルをサーバー側で実行されるように指定し、クライアントからサーバー関数を安全に呼び出します。

**主な機能**:

- **Server Actions**: フォーム送信とデータ変更の処理
- **セキュリティ**: サーバー専用ロジックの分離
- **データベースアクセス**: 安全なデータ操作
- **キャッシュ再検証**: データ変更後のキャッシュ更新

**使用レベル**:

1. **ファイルレベル**: ファイル全体の関数をサーバー関数化
2. **関数レベル（インライン）**: 特定の関数のみをサーバー関数化

**基本的な使用例**:

#### ファイルレベルでの使用

```typescript
// lib/actions.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createUser(data: { name: string; email: string }) {
  const user = await db.user.create({ data });
  return user;
}

export async function deleteUser(userId: string) {
  await db.user.delete({ where: { id: userId } });
  revalidatePath("/users");
}
```

#### インライン（関数レベル）での使用

```typescript
// app/post/[id]/page.tsx
import { revalidatePath } from 'next/cache'

export default function Post({ params }: { params: { id: string } }) {
  async function updatePost(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    await savePost(params.id, { title, content })
    revalidatePath(`/posts/${params.id}`)
  }

  return (
    <form action={updatePost}>
      <input name="title" type="text" />
      <textarea name="content" />
      <button type="submit">更新</button>
    </form>
  )
}
```

#### フォーム送信の処理

```typescript
// app/create-post/page.tsx
import { redirect } from 'next/navigation'

async function createPost(formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const post = await db.post.create({
    data: { title, content }
  })

  redirect(`/posts/${post.id}`)
}

export default function CreatePost() {
  return (
    <form action={createPost}>
      <input name="title" type="text" placeholder="タイトル" required />
      <textarea name="content" placeholder="内容" required />
      <button type="submit">投稿を作成</button>
    </form>
  )
}
```

**クライアントコンポーネントでの使用**:

```typescript
// lib/actions.ts
'use server'

export async function addToCart(productId: string) {
  const cart = await db.cart.create({
    data: { productId }
  })
  return cart
}

// components/AddToCartButton.tsx
'use client'

import { addToCart } from '@/lib/actions'
import { useState } from 'react'

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await addToCart(productId)
      alert('カートに追加されました!')
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? '追加中...' : 'カートに追加'}
    </button>
  )
}
```

## ディレクティブの選択指針

### 実行環境による分類

| ディレクティブ | 実行環境 | 主な用途                      | 使用場面                    |
| -------------- | -------- | ----------------------------- | --------------------------- |
| `use server`   | サーバー | データ操作、認証、API呼び出し | フォーム送信、CRUD操作      |
| `use client`   | ブラウザ | インタラクション、状態管理    | ボタン、フォーム入力        |
| `use cache`    | サーバー | パフォーマンス最適化          | 高コストな計算、API呼び出し |

### 機能要件による選択

#### インタラクティブな機能が必要な場合

```typescript
"use client";

// React Hooks、イベントハンドラー、ブラウザAPIが必要
```

#### データ操作・セキュリティが重要な場合

```typescript
"use server";

// データベースアクセス、認証、機密情報の処理
```

#### パフォーマンス最適化が必要な場合

```typescript
"use cache";

// 重い計算、頻繁にアクセスされるデータの取得
```

## アーキテクチャパターン

### 1. コンポーネント分離パターン

```typescript
// app/dashboard/page.tsx (サーバーコンポーネント)
import UserStats from './UserStats'       // サーバーコンポーネント
import InteractiveChart from './Chart'    // クライアントコンポーネント

export default async function Dashboard() {
  const userData = await fetchUserData()   // サーバーサイドデータ取得

  return (
    <div>
      <UserStats data={userData} />
      <InteractiveChart initialData={userData} />
    </div>
  )
}
```

### 2. Server Actions + Client Components パターン

```typescript
// lib/actions.ts
'use server'

export async function updateSettings(formData: FormData) {
  // サーバー側での設定更新
  const settings = await db.settings.update({
    where: { userId: getCurrentUserId() },
    data: Object.fromEntries(formData)
  })
  revalidatePath('/settings')
  return settings
}

// components/SettingsForm.tsx
'use client'

import { updateSettings } from '@/lib/actions'
import { useState } from 'react'

export default function SettingsForm({ initialSettings }) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    await updateSettings(formData)
    setIsLoading(false)
  }

  return (
    <form action={handleSubmit}>
      {/* フォーム要素 */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? '更新中...' : '設定を更新'}
      </button>
    </form>
  )
}
```

### 3. キャッシュ最適化パターン

```typescript
// lib/data.ts
'use cache'

export async function getExpensiveData(userId: string) {
  // 重い計算やAPI呼び出し
  const data = await performExpensiveOperation(userId)
  return data
}

// app/profile/[userId]/page.tsx
import { getExpensiveData } from '@/lib/data'

export default async function ProfilePage({ params }) {
  const data = await getExpensiveData(params.userId) // キャッシュされる

  return <ProfileDisplay data={data} />
}
```

## セキュリティのベストプラクティス

### 1. 認証・認可の実装

```typescript
// lib/actions.ts
"use server";

import { auth } from "@/lib/auth";

export async function deletePost(postId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("認証が必要です");
  }

  const post = await db.post.findUnique({
    where: { id: postId },
  });

  if (post.authorId !== session.user.id) {
    throw new Error("権限がありません");
  }

  await db.post.delete({ where: { id: postId } });
  revalidatePath("/posts");
}
```

### 2. 入力値の検証

```typescript
// lib/actions.ts
"use server";

import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
});

export async function createPost(formData: FormData) {
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    throw new Error("入力値が無効です");
  }

  const post = await db.post.create({
    data: result.data,
  });

  revalidatePath("/posts");
  return post;
}
```

### 3. 機密情報の保護

```typescript
// lib/actions.ts
"use server";

export async function processPayment(amount: number) {
  // 機密情報（APIキー等）はサーバー側でのみ使用
  const payment = await stripeAPI.charges.create(
    {
      amount: amount * 100,
      currency: "jpy",
      source: "tok_visa", // 実際にはフォームから取得
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY, // クライアントに送信されない
    }
  );

  return { success: true, paymentId: payment.id };
}
```

## パフォーマンス最適化

### 1. 適切なコンポーネント分割

```typescript
// 重い計算を含むサーバーコンポーネント
'use cache'

export async function ExpensiveServerComponent({ userId }) {
  const data = await performHeavyCalculation(userId)
  return <DataDisplay data={data} />
}

// 軽量なクライアントコンポーネント
'use client'

export function LightweightClientComponent() {
  const [isOpen, setIsOpen] = useState(false)
  return <Modal isOpen={isOpen} onToggle={setIsOpen} />
}
```

### 2. キャッシュ戦略

```typescript
// 長期間キャッシュする静的データ
"use cache";

export async function getStaticConfiguration() {
  return await fetchConfiguration();
}

// ユーザー固有だが頻繁にアクセスされるデータ
("use cache");

export async function getUserPreferences(userId: string) {
  return await db.preferences.findUnique({
    where: { userId },
  });
}
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. Hydration エラー

```typescript
// 問題: サーバーとクライアントで異なる値
'use client'

export function TimeDisplay() {
  const [time, setTime] = useState('')

  useEffect(() => {
    setTime(new Date().toISOString()) // クライアント側でのみ実行
  }, [])

  return <div>{time || '読み込み中...'}</div>
}
```

#### 2. Server Actions の型エラー

```typescript
// 解決: 適切な型定義
export async function updateUser(
  formData: FormData
): Promise<{ success: boolean }> {
  "use server";

  // 実装
  return { success: true };
}
```

#### 3. キャッシュが効かない問題

```typescript
// 問題: 非シリアライズ可能な引数
"use cache";
export async function getData(callback: Function) {
  // NG
  // ...
}

// 解決: シリアライズ可能な引数のみ使用
("use cache");
export async function getData(userId: string, options: { limit: number }) {
  // OK
  // ...
}
```

## 追加リソース

### 公式ドキュメント

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### React ドキュメント

- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [React use server](https://react.dev/reference/rsc/use-server)
- [React use client](https://react.dev/reference/rsc/use-client)

### 実装例とベストプラクティス

- [Next.js App Router Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Server Actions Examples](https://github.com/vercel/next.js/tree/canary/examples/next-forms)

---

各ディレクティブには詳細な使用方法、セキュリティ考慮事項、およびパフォーマンス最適化のガイドラインが含まれています。プロジェクトの要件に応じて、適切なディレクティブと実装パターンを選択してください。
