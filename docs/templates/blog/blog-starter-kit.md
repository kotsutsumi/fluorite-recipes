# Blog Starter Kit

## 概要

Next.jsとMarkdownを使用した静的生成ブログの例です。

**デモ**: https://next-blog-starter.vercel.app/
**GitHub**: https://github.com/vercel/next.js/tree/canary/examples/blog-starter

## 主な機能

- 静的生成ブログ
- Next.jsとTypeScriptを使用
- Markdownベースのコンテンツ管理
- `/_posts`ディレクトリにブログポストを保存
- remarkを使用してMarkdownをHTMLに変換
- gray-matterでメタデータを処理

## 技術スタック

- **フレームワーク**: Next.js
- **言語**: TypeScript
- **コンテンツ**: Markdown
- **スタイリング**: Tailwind CSS

## はじめに

### プロジェクトの作成

#### create-next-appを使用

```bash
npx create-next-app --example blog-starter my-blog
cd my-blog
```

#### リポジトリをクローン

```bash
git clone https://github.com/vercel/next.js.git
cd next.js/examples/blog-starter
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
├── _posts/            # Markdownブログポスト
├── app/
│   ├── page.tsx       # ホームページ
│   └── posts/
│       └── [slug]/    # 個別ブログポスト
├── components/        # Reactコンポーネント
├── lib/              # ユーティリティ関数
└── public/           # 静的アセット
```

## ブログポストの作成

### Markdownファイルの作成

`_posts`ディレクトリに新しいMarkdownファイルを作成:

```markdown
---
title: "私の最初のブログポスト"
excerpt: "これは私の最初のブログポストです"
date: "2024-01-01"
author:
  name: "あなたの名前"
  picture: "/assets/authors/your-picture.jpg"
coverImage: "/assets/blog/post-cover.jpg"
ogImage:
  url: "/assets/blog/post-cover.jpg"
---

# 私の最初のブログポスト

これはブログポストの内容です。Markdownで書かれています。

## セクション1

内容をここに書きます。

## セクション2

さらに内容を追加できます。

### サブセクション

より詳細な内容。
```

### Front Matterメタデータ

各Markdownファイルには以下のFront Matterが必要です:

- `title`: ポストのタイトル
- `excerpt`: ポストの要約
- `date`: 公開日(YYYY-MM-DD形式)
- `author`: 著者情報
  - `name`: 著者名
  - `picture`: 著者の写真
- `coverImage`: カバー画像のパス
- `ogImage`: OG(Open Graph)画像

## Markdownの処理

### remarkを使用したHTML変換

```typescript
// lib/markdown.ts
import { remark } from 'remark'
import html from 'remark-html'

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}
```

### gray-matterでのメタデータ抽出

```typescript
// lib/posts.ts
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), '_posts')

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return { ...data, slug: realSlug, content }
}

export function getAllPosts() {
  const slugs = fs.readdirSync(postsDirectory)
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))

  return posts
}
```

## 静的生成

### ブログポスト一覧の生成

```typescript
// app/page.tsx
import { getAllPosts } from '@/lib/posts'

export default async function HomePage() {
  const posts = getAllPosts()

  return (
    <div>
      {posts.map((post) => (
        <article key={post.slug}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <a href={`/posts/${post.slug}`}>続きを読む</a>
        </article>
      ))}
    </div>
  )
}
```

### 個別ブログポストの生成

```typescript
// app/posts/[slug]/page.tsx
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { markdownToHtml } from '@/lib/markdown'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  const content = await markdownToHtml(post.content)

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  )
}
```

## カスタマイズ

### スタイリング

Tailwind CSSを使用してデザインをカスタマイズ:

```typescript
// app/posts/[slug]/page.tsx
<article className="prose prose-lg max-w-4xl mx-auto">
  <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
  <div dangerouslySetInnerHTML={{ __html: content }} />
</article>
```

### 画像の最適化

Next.js Imageコンポーネントを使用:

```typescript
import Image from 'next/image'

<Image
  src={post.coverImage}
  alt={post.title}
  width={1200}
  height={630}
  className="rounded-lg"
/>
```

## SEO対応

### メタデータの追加

```typescript
// app/posts/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.ogImage.url],
    },
  }
}
```

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

静的サイト生成により、高速なページロードと優れたSEOパフォーマンスを実現します。

## 使用例

- 個人ブログ
- 技術ブログ
- チュートリアルサイト
- ドキュメントサイト

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [remark Documentation](https://remark.js.org/)
- [gray-matter Documentation](https://github.com/jonschlinkert/gray-matter)

## ライセンス

MITライセンス
