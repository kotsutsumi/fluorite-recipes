# App Router への移行

Next.js の Pages Router から新しい App Router への移行ガイドです。段階的な移行方法と、新機能の活用方法を説明します。

## 概要

App Router は Next.js 13 で導入された新しいルーティングシステムで、以下の機能を提供します：

- **Server Components**: デフォルトでサーバーレンダリング
- **レイアウトシステム**: 共有 UI と状態管理の改善
- **並行レンダリング**: React 18 の新機能を活用
- **ストリーミング**: Suspense によるインクリメンタルレンダリング
- **データフェッチング**: 統合された新しいパターン

## 前提条件

### Node.js のバージョン

App Router を使用するには、Node.js 18.17 以降が必要です。

```bash
node --version
# v18.17.0 以上であることを確認
```

### 依存関係の更新

最新バージョンに更新します。

```bash
npm install next@latest react@latest react-dom@latest
```

または：

```bash
pnpm update next react react-dom --latest
```

### ESLint の更新

```bash
npm install eslint-config-next@latest --save-dev
```

## 移行戦略

### 段階的な移行

Pages Router と App Router は同時に使用できます。段階的に移行することをお勧めします。

```
my-app/
├── app/              # 新しい App Router
│   ├── layout.tsx
│   └── page.tsx
├── pages/            # 既存の Pages Router
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
└── public/
```

## ステップ 1: app ディレクトリの作成

### 1.1 ルートレイアウトの作成

`app/layout.tsx` を作成します。これは `_app.tsx` と `_document.tsx` を置き換えます。

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
```

### 1.2 _app.tsx の機能を移行

グローバル状態やプロバイダーをレイアウトに移行します。

#### Before (Pages Router)

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
```

#### After (App Router)

```typescript
// app/layout.tsx
import { ThemeProvider } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

```typescript
// app/providers.tsx
'use client'

import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { theme } from './theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}
```

### 1.3 _document.tsx の機能を移行

#### Before (Pages Router)

```typescript
// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

#### After (App Router)

```typescript
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
```

## ステップ 2: ページの移行

### 2.1 基本的なページの移行

#### Before (Pages Router)

```typescript
// pages/index.tsx
export default function HomePage() {
  return <h1>ホームページ</h1>
}
```

#### After (App Router)

```typescript
// app/page.tsx
export default function HomePage() {
  return <h1>ホームページ</h1>
}
```

### 2.2 動的ルートの移行

#### Before (Pages Router)

```typescript
// pages/posts/[id].tsx
import { useRouter } from 'next/router'

export default function PostPage() {
  const router = useRouter()
  const { id } = router.query

  return <h1>投稿 ID: {id}</h1>
}
```

#### After (App Router)

```typescript
// app/posts/[id]/page.tsx
export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  return <h1>投稿 ID: {params.id}</h1>
}
```

## ステップ 3: データフェッチングの移行

### 3.1 getServerSideProps の移行

#### Before (Pages Router)

```typescript
// pages/posts/[id].tsx
export async function getServerSideProps({ params }: { params: { id: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`).then(
    (res) => res.json()
  )

  return {
    props: { post },
  }
}

export default function PostPage({ post }: { post: Post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

#### After (App Router)

```typescript
// app/posts/[id]/page.tsx
async function getPost(id: string) {
  const post = await fetch(`https://api.example.com/posts/${id}`, {
    cache: 'no-store', // getServerSideProps と同等
  }).then((res) => res.json())

  return post
}

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

### 3.2 getStaticProps の移行

#### Before (Pages Router)

```typescript
// pages/posts/[id].tsx
export async function getStaticProps({ params }: { params: { id: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`).then(
    (res) => res.json()
  )

  return {
    props: { post },
    revalidate: 60, // ISR
  }
}

export default function PostPage({ post }: { post: Post }) {
  return <div>{post.title}</div>
}
```

#### After (App Router)

```typescript
// app/posts/[id]/page.tsx
export const revalidate = 60 // ISR

async function getPost(id: string) {
  const post = await fetch(`https://api.example.com/posts/${id}`, {
    next: { revalidate: 60 }, // または、ページレベルの revalidate を使用
  }).then((res) => res.json())

  return post
}

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)
  return <div>{post.title}</div>
}
```

### 3.3 getStaticPaths の移行

#### Before (Pages Router)

```typescript
// pages/posts/[id].tsx
export async function getStaticPaths() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return {
    paths: posts.map((post: Post) => ({
      params: { id: post.id },
    })),
    fallback: 'blocking',
  }
}
```

#### After (App Router)

```typescript
// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return posts.map((post: Post) => ({
    id: post.id,
  }))
}

export const dynamicParams = true // fallback: 'blocking' と同等
```

## ステップ 4: ルーティングとナビゲーションの更新

### 4.1 useRouter の移行

#### Before (Pages Router)

```typescript
'use client'

import { useRouter } from 'next/router'

export function NavigationComponent() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/dashboard')}>
      ダッシュボードへ
    </button>
  )
}
```

#### After (App Router)

```typescript
'use client'

import { useRouter } from 'next/navigation'

export function NavigationComponent() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/dashboard')}>
      ダッシュボードへ
    </button>
  )
}
```

### 4.2 usePathname と useSearchParams

#### Before (Pages Router)

```typescript
'use client'

import { useRouter } from 'next/router'

export function Component() {
  const router = useRouter()
  const pathname = router.pathname
  const searchParams = router.query

  return <div>パス: {pathname}</div>
}
```

#### After (App Router)

```typescript
'use client'

import { usePathname, useSearchParams } from 'next/navigation'

export function Component() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return <div>パス: {pathname}</div>
}
```

## ステップ 5: スタイリングの更新

### 5.1 グローバルスタイル

App Router では、任意のレイアウトやコンポーネントでグローバルスタイルをインポートできます。

```typescript
// app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

### 5.2 CSS Modules

CSS Modules は引き続き同じように動作します。

```typescript
// app/components/Button.tsx
import styles from './Button.module.css'

export function Button() {
  return <button className={styles.button}>クリック</button>
}
```

## ステップ 6: コンポーネントの更新

### 6.1 Image コンポーネント

Image コンポーネントの使用方法は同じです。

```typescript
import Image from 'next/image'

export function Component() {
  return <Image src="/image.jpg" alt="説明" width={500} height={300} />
}
```

### 6.2 Link コンポーネント

App Router では、`<Link>` に `<a>` タグを含める必要がありません。

#### Before (Pages Router)

```typescript
import Link from 'next/link'

export function Navigation() {
  return (
    <Link href="/about">
      <a>About</a>
    </Link>
  )
}
```

#### After (App Router)

```typescript
import Link from 'next/link'

export function Navigation() {
  return <Link href="/about">About</Link>
}
```

### 6.3 Font Optimization

`next/font` を使用してフォントを最適化します。

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

## ステップ 7: API Routes の移行

### Before (Pages Router)

```typescript
// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const posts = await getPosts()
    res.status(200).json(posts)
  }
}
```

### After (App Router)

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await getPosts()
  return NextResponse.json(posts)
}
```

## Server Components と Client Components

### Server Components（デフォルト）

```typescript
// app/posts/page.tsx
// デフォルトで Server Component
async function getPosts() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )
  return posts
}

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Client Components

```typescript
// app/components/Counter.tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>増やす</button>
    </div>
  )
}
```

## ベストプラクティス

### 1. Server Components を優先

可能な限り Server Components を使用し、必要な場合のみ Client Components を使用します。

### 2. レイアウトの活用

共有 UI やロジックはレイアウトに配置します。

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>{/* ナビゲーション */}</nav>
      <main>{children}</main>
    </div>
  )
}
```

### 3. ローディング状態

`loading.tsx` を使用してローディング状態を表示します。

```typescript
// app/posts/loading.tsx
export default function Loading() {
  return <div>読み込み中...</div>
}
```

### 4. エラーハンドリング

`error.tsx` を使用してエラーを処理します。

```typescript
// app/posts/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  )
}
```

## まとめ

App Router への移行は段階的に行うことができます。主なポイント：

1. **依存関係を更新**: Next.js 14+、React 18+
2. **app ディレクトリを作成**: ルートレイアウトから開始
3. **ページを移行**: Server Components をデフォルトで使用
4. **データフェッチングを更新**: 新しいパターンを採用
5. **ルーティングを更新**: `next/navigation` を使用
6. **API Routes を移行**: Route Handlers に変換

App Router は、パフォーマンス、開発者体験、ユーザー体験の向上をもたらします。
