# Next.js Contentlayer Blog Starter

## 概要

Next.js 13 App Router、Contentlayer、Tailwind CSS、ダークモードを備えたブログテンプレートです。

**デモ**: https://next-contentlayer.vercel.app/
**GitHub**: https://github.com/shadcn/next-contentlayer

## 主な機能

- Next.js 13 App Router
- Contentlayer統合
- Tailwind CSS
- ダークモードサポート

## 技術スタック

- **フレームワーク**: Next.js
- **コンテンツ管理**: Contentlayer
- **スタイリング**: Tailwind CSS
- **UIライブラリ**: React

## はじめに

### プロジェクトのクローン

```bash
git clone https://github.com/shadcn/next-contentlayer.git
cd next-contentlayer
```

### 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## プロジェクト構造

```
.
├── app/               # Next.js App Router
├── content/
│   └── posts/         # Markdownブログポスト
├── components/        # Reactコンポーネント
├── lib/              # ユーティリティ
├── contentlayer.config.ts # Contentlayer設定
└── public/           # 静的アセット
```

## Contentlayerの設定

### contentlayer.config.ts

```typescript
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'date',
      required: true,
    },
    published: {
      type: 'boolean',
      default: true,
    },
    image: {
      type: 'string',
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.split('/').slice(1).join('/'),
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Post],
})
```

## ブログポストの作成

### MDXファイルの作成

`content/posts`ディレクトリに新しいMDXファイルを作成:

```mdx
---
title: "私の最初のポスト"
description: "これは私の最初のブログポストです"
date: 2024-01-01
published: true
image: "/images/post-cover.jpg"
---

# 私の最初のポスト

これはMDXで書かれたブログポストです。

## コードブロック

```typescript
function hello() {
  console.log('Hello, World!')
}
```

## カスタムコンポーネント

import { Callout } from '@/components/callout'

<Callout>
  これはカスタムコールアウトコンポーネントです。
</Callout>
```

## Contentlayerの使用

### ブログポストの取得

```typescript
// app/blog/page.tsx
import { allPosts } from 'contentlayer/generated'

export default async function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div>
      {posts.map((post) => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          <a href={post.slug}>続きを読む</a>
        </article>
      ))}
    </div>
  )
}
```

### 個別ポストの表示

```typescript
// app/blog/[...slug]/page.tsx
import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { Mdx } from '@/components/mdx-components'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split('/'),
  }))
}

export default async function PostPage({ params }: { params: { slug: string[] } }) {
  const slug = params?.slug?.join('/')
  const post = allPosts.find((post) => post.slugAsParams === slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.date}</time>
      <Mdx code={post.body.code} />
    </article>
  )
}
```

## MDXカスタムコンポーネント

### カスタムコンポーネントの定義

```typescript
// components/mdx-components.tsx
import { useMDXComponent } from 'next-contentlayer/hooks'

const components = {
  h1: ({ ...props }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
  ),
  h2: ({ ...props }) => (
    <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
  ),
  p: ({ ...props }) => (
    <p className="text-lg leading-7 mb-4" {...props} />
  ),
  pre: ({ ...props }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto" {...props} />
  ),
  // カスタムコンポーネント
  Callout: ({ children, ...props }) => (
    <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4" {...props}>
      {children}
    </div>
  ),
}

export function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component components={components} />
}
```

## ダークモード

### テーマの切り替え

```typescript
// components/theme-toggle.tsx
'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg p-2"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

### テーマプロバイダーの設定

```typescript
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## SEO対応

### メタデータの生成

```typescript
// app/blog/[...slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const slug = params?.slug?.join('/')
  const post = allPosts.find((post) => post.slugAsParams === slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [post.image] : [],
    },
  }
}
```

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

Contentlayerが自動的にコンテンツをビルド時に処理し、最適化されたデータを生成します。

## 使用例

- 個人ブログ
- 技術ブログ
- ドキュメントサイト
- ポートフォリオブログ

## リソース

- [Contentlayer Documentation](https://contentlayer.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ライセンス

MITライセンス
