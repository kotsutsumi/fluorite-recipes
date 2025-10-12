# MDX

MDX は、Markdown ファイル内で React コンポーネントを直接使用できる Markdown のスーパーセットです。Next.js アプリケーションで動的なインタラクティビティとリッチなコンテンツを作成できます。

## 概要

MDX を使用すると、以下のことが可能になります：

- **Markdown + JSX**: Markdown ファイル内で React コンポーネントを使用
- **動的コンテンツ**: インタラクティブな要素を含む記事
- **カスタムコンポーネント**: Markdown 要素をカスタムコンポーネントで置き換え
- **型安全性**: TypeScript サポート

## セットアップ

### 1. 依存関係のインストール

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
```

### 2. Next.js の設定

`next.config.mjs` を作成または更新：

```javascript
// next.config.mjs
import createMDX from '@next/mdx'

const nextConfig = {
  // MDX ファイルを含めるために pageExtensions を設定
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // オプションの Markdown プラグインをここに追加
})

export default withMDX(nextConfig)
```

### 3. mdx-components.tsx の作成

プロジェクトルートに `mdx-components.tsx` を作成：

```typescript
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

## MDX のレンダリング

### ファイルベースルーティング

`/app` ディレクトリ内に `.mdx` ファイルを作成します。

```
app/
├── blog/
│   ├── [slug]/
│   │   └── page.tsx
│   └── hello-world.mdx
└── page.tsx
```

MDX ファイルの例：

```mdx
# Hello World

これは MDX ファイルです。Markdown と JSX を組み合わせることができます。

export const metadata = {
  title: 'Hello World',
  description: '私の最初のブログ記事',
}

## はじめに

**太字のテキスト**と*イタリック体のテキスト*を使用できます。

- リスト項目 1
- リスト項目 2
- リスト項目 3

```javascript
const hello = 'world'
console.log(hello)
```

<CustomComponent />
```

### MDX ファイルのインポート

ページに直接 MDX ファイルをインポートできます。

```typescript
// app/page.tsx
import HelloWorld from './blog/hello-world.mdx'

export default function Page() {
  return <HelloWorld />
}
```

## カスタムコンポーネント

### グローバルコンポーネント

すべての MDX ファイルで使用できるコンポーネントを定義します。

```typescript
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // デフォルトの Markdown 要素をカスタマイズ
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold my-3">{children}</h2>
    ),
    p: ({ children }) => <p className="my-2 leading-7">{children}</p>,
    a: ({ href, children }) => (
      <a href={href} className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
    // カスタムコンポーネント
    Image,
    ...components,
  }
}
```

### ローカルコンポーネント

特定の MDX ファイルでのみ使用するコンポーネント：

```mdx
# ブログ記事

import { CustomButton } from '@/components/CustomButton'

これは通常のテキストです。

<CustomButton>クリック</CustomButton>

さらにテキストが続きます。
```

## Tailwind Typography の使用

MDX コンテンツのスタイリングに Tailwind Typography プラグインを使用します。

### インストール

```bash
npm install @tailwindcss/typography
```

### 設定

```javascript
// tailwind.config.js
module.exports = {
  plugins: [require('@tailwindcss/typography')],
}
```

### 使用

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ children }: { children: React.ReactNode }) {
  return <article className="prose lg:prose-xl">{children}</article>
}
```

## Remark と Rehype プラグイン

Markdown の変換をカスタマイズするプラグインを追加できます。

### インストール

```bash
npm install remark-gfm rehype-highlight
```

### 設定

```javascript
// next.config.mjs
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
}

export default withMDX(nextConfig)
```

## メタデータのエクスポート

MDX ファイルからメタデータをエクスポートできます。

```mdx
export const metadata = {
  title: 'ブログ記事のタイトル',
  description: '記事の説明',
  author: '著者名',
  date: '2024-01-01',
}

# {metadata.title}

著者: {metadata.author}

{/* コンテンツ */}
```

ページでメタデータを使用：

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next'
import Post from './post.mdx'

export const metadata: Metadata = Post.metadata

export default function Page() {
  return <Post />
}
```

## リモート MDX の取得

リモートソースから MDX コンテンツを取得して表示します。

### next-mdx-remote の使用

```bash
npm install next-mdx-remote
```

```typescript
// app/blog/[slug]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'

async function getPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  const { content } = await res.json()
  return content
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const content = await getPost(params.slug)

  return (
    <article>
      <MDXRemote source={content} />
    </article>
  )
}
```

### カスタムコンポーネントの追加

```typescript
import { MDXRemote } from 'next-mdx-remote/rsc'
import { CustomButton } from '@/components/CustomButton'

const components = {
  CustomButton,
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const content = await getPost(params.slug)

  return (
    <article>
      <MDXRemote source={content} components={components} />
    </article>
  )
}
```

## Server Components との互換性

MDX は Server Components と完全に互換性があります。

```typescript
// app/blog/[slug]/page.tsx
export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  // サーバーサイドでデータを取得
  const post = await getPost(params.slug)

  return (
    <article>
      <h1>{post.title}</h1>
      <MDXContent content={post.content} />
    </article>
  )
}
```

## 実験的な Rust ベース MDX コンパイラ

パフォーマンスを向上させる実験的な Rust ベースコンパイラを有効にできます。

```javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}
```

## 実用的な例

### ブログシステム

```
app/
├── blog/
│   ├── [slug]/
│   │   └── page.tsx
│   ├── getting-started.mdx
│   ├── advanced-features.mdx
│   └── page.tsx
└── mdx-components.tsx
```

```mdx
<!-- app/blog/getting-started.mdx -->
export const metadata = {
  title: 'はじめに',
  date: '2024-01-01',
  author: 'John Doe',
}

# {metadata.title}

**著者**: {metadata.author} | **日付**: {metadata.date}

## イントロダクション

Next.js と MDX を使い始めましょう。

<Callout type="info">
  これは重要な情報です！
</Callout>

## コード例

```javascript
function hello() {
  console.log('Hello, World!')
}
```

## まとめ

MDX を使用すると、リッチなコンテンツを簡単に作成できます。
```

### ドキュメントサイト

```typescript
// mdx-components.tsx
import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/Callout'
import { CodeBlock } from '@/components/CodeBlock'
import { Tabs } from '@/components/Tabs'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // カスタムコンポーネント
    Callout,
    CodeBlock,
    Tabs,
    // Markdown 要素のカスタマイズ
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded">{children}</code>
    ),
    ...components,
  }
}
```

### インタラクティブなチュートリアル

```mdx
# インタラクティブチュートリアル

import { Counter } from '@/components/Counter'
import { Quiz } from '@/components/Quiz'

## ステップ 1: カウンターを試す

<Counter initialValue={0} />

## ステップ 2: クイズに挑戦

<Quiz
  question="Next.js は何ですか？"
  options={['React フレームワーク', 'CSS フレームワーク', 'データベース']}
  correctAnswer={0}
/>
```

## ベストプラクティス

### 1. 型安全性の確保

```typescript
// types/mdx.ts
export interface PostMetadata {
  title: string
  description: string
  author: string
  date: string
  tags: string[]
}
```

### 2. コンポーネントの再利用

共通のコンポーネントを作成して MDX 全体で再利用します。

```typescript
// components/mdx/Callout.tsx
export function Callout({
  type = 'info',
  children,
}: {
  type?: 'info' | 'warning' | 'error'
  children: React.ReactNode
}) {
  const styles = {
    info: 'bg-blue-100 border-blue-500',
    warning: 'bg-yellow-100 border-yellow-500',
    error: 'bg-red-100 border-red-500',
  }

  return (
    <div className={`border-l-4 p-4 ${styles[type]}`}>{children}</div>
  )
}
```

### 3. パフォーマンスの最適化

大きな MDX ファイルは動的にインポートします。

```typescript
import dynamic from 'next/dynamic'

const LargePost = dynamic(() => import('./large-post.mdx'))

export default function Page() {
  return <LargePost />
}
```

## まとめ

MDX を使用することで、以下のメリットがあります：

1. **リッチなコンテンツ**: Markdown とReact コンポーネントを組み合わせ
2. **インタラクティビティ**: 動的な要素を含む記事
3. **再利用性**: コンポーネントを複数の記事で共有
4. **型安全性**: TypeScript サポート
5. **拡張性**: プラグインでカスタマイズ可能

MDX は、ブログ、ドキュメント、チュートリアルなど、コンテンツリッチなサイトに最適です。
