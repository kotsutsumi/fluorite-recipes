# Blog with Native Content Editing

## 概要

ネイティブコンテンツ編集とインスタントプレビューを備えたSanity駆動のブログです。

**デモ**:
- ブログ: https://nextjs-blog.sanity.build
- Studio: https://nextjs-blog.sanity.build/studio

**GitHub**: https://github.com/sanity-io/nextjs-blog-cms-sanity-v3

## 主な機能

- Next.jsとSanityを使用した静的生成ブログ
- リアルタイムコラボレーションを備えたネイティブSanity Studio
- サイドバイサイドのインスタントコンテンツプレビュー
- Webhookトリガーによる増分静的再生成
- ブロックコンテンツとカスタムフィールドのサポート
- TypeScriptとTailwind.css統合

## 技術スタック

- **フレームワーク**: Next.js
- **CMS**: Sanity CMS
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript

## はじめに

### 前提条件

- Sanityアカウント

### プロジェクトのデプロイ

#### 1. Vercelでデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sanity-io/nextjs-blog-cms-sanity-v3)

デプロイ時に:
1. Sanityプロジェクトが自動的に作成されます
2. 必要な環境変数が設定されます
3. サンプルデータがインポートされます

#### 2. ローカルで実行

```bash
git clone https://github.com/sanity-io/nextjs-blog-cms-sanity-v3.git
cd nextjs-blog-cms-sanity-v3
npm install
```

### 環境変数の設定

`.env.local`ファイルを作成:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# プレビュー
SANITY_PREVIEW_SECRET=your_preview_secret
```

### 開発サーバーの起動

```bash
npm run dev
```

- ブログ: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

## Sanity Studioの使用

### コンテンツの編集

1. `/studio`にアクセス
2. Sanityアカウントでログイン
3. 投稿を作成または編集

### リアルタイムプレビュー

編集中にリアルタイムでプレビューが更新されます:

1. Studioで投稿を開く
2. 編集を開始
3. 右側のプレビューペインで即座に変更を確認

## Sanityスキーマの設定

### スキーマの定義

```typescript
// sanity/schemas/post.ts
export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
    },
    {
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
  ],
}
```

### ブロックコンテンツの定義

```typescript
// sanity/schemas/blockContent.ts
export default {
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      options: { hotspot: true },
    },
  ],
}
```

## データの取得

### Sanity Clientの設定

```typescript
// lib/sanity.client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false,
})
```

### クエリの作成

```typescript
// lib/sanity.queries.ts
import { groq } from 'next-sanity'

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    author->{
      name,
      image
    },
    mainImage,
    publishedAt,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..255], "") + "..."
  }
`

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    author->{
      name,
      image
    },
    mainImage,
    publishedAt,
    body
  }
`
```

### ページでのデータ取得

```typescript
// app/blog/page.tsx
import { client } from '@/lib/sanity.client'
import { postsQuery } from '@/lib/sanity.queries'

export default async function BlogPage() {
  const posts = await client.fetch(postsQuery)

  return (
    <div>
      {posts.map((post) => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <a href={`/blog/${post.slug.current}`}>続きを読む</a>
        </article>
      ))}
    </div>
  )
}
```

## プレビューモードの実装

### プレビューAPIルート

```typescript
// app/api/preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  draftMode().enable()
  redirect(`/blog/${slug}`)
}
```

### プレビューデータの取得

```typescript
// app/blog/[slug]/page.tsx
import { draftMode } from 'next/headers'
import { client } from '@/lib/sanity.client'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { isEnabled } = draftMode()

  const post = await client.fetch(
    postQuery,
    { slug: params.slug },
    {
      perspective: isEnabled ? 'previewDrafts' : 'published',
    }
  )

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{/* レンダリング */}</div>
    </article>
  )
}
```

## Webhook設定

### Next.js再検証エンドポイント

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (body._type === 'post') {
    revalidatePath(`/blog/${body.slug.current}`)
    revalidatePath('/blog')
  }

  return Response.json({ revalidated: true, now: Date.now() })
}
```

### Sanity Webhookの設定

Sanityダッシュボードで:
1. Settings → Webhooks
2. 新しいWebhookを作成
3. URL: `https://your-site.com/api/revalidate`
4. トリガー: `On create`, `On update`, `On delete`

## 独自の特徴

- ネイティブコンテンツ編集体験
- リアルタイムコラボレーション
- 柔軟なコンテンツモデリング
- サイト全体でのインスタントプレビュー

## デプロイ

Vercelでのワンクリックデプロイが可能で、Sanity統合も自動的に設定されます。

## 使用例

- 企業ブログ
- ニュースサイト
- マガジン
- コンテンツポータル

## リソース

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)

## ライセンス

MITライセンス
