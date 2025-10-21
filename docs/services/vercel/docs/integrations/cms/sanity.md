# Vercel Sanityインテグレーション

Sanityは、リアルタイムのコラボレーションと構造化されたコンテンツ管理を提供するヘッドレスコンテンツ管理システムです。高度にカスタマイズ可能なコンテンツスタジオと強力なAPIを提供し、開発者はさまざまなプラットフォームやデバイス間でコンテンツを統合および管理できます。

## はじめに

Sanityを使い始めるには、以下のテンプレートをデプロイしてください：

[Stablo – ミニマルブログテンプレート](https://vercel.com/templates/next.js/stablo-blog)

Next.js、TailwindCSS、Sanity CMSで構築されたミニマルなブログウェブサイトテンプレート

[Sanityとビジュアル編集](https://vercel.com/templates/next.js/sanity-visual-editing)

ビジュアル編集機能を備えたSanityテンプレート

## Sanity プロジェクトのセットアップ

### 1. Sanity CLI のインストール

```bash
pnpm add -g @sanity/cli
```

### 2. 新しい Sanity プロジェクトの作成

```bash
sanity init
```

プロンプトに従って：
- プロジェクト名を入力
- データセット名を入力（通常は `production`）
- スキーマテンプレートを選択（または空のプロジェクトから開始）

### 3. Sanity Studio の起動

```bash
cd sanity-studio
sanity start
```

ブラウザで `http://localhost:3333` を開いて Sanity Studio にアクセスします。

## Next.js との統合

### 1. Sanity クライアントのインストール

```bash
pnpm add @sanity/client @sanity/image-url next-sanity
```

### 2. Sanity クライアントの設定

```typescript
// lib/sanity.ts
import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

### 3. コンテンツの取得

```typescript
// lib/queries.ts
import { groq } from 'next-sanity';
import { client } from './sanity';

// すべての投稿を取得
export async function getPosts() {
  return client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      author->{name, image}
    }`
  );
}

// スラッグで投稿を取得
export async function getPostBySlug(slug: string) {
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage,
      body,
      author->{name, image}
    }`,
    { slug }
  );
}
```

### 4. ページでの使用

```typescript
// app/blog/page.tsx
import { getPosts } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">ブログ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/blog/${post.slug.current}`}>
            <article className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              {post.mainImage && (
                <Image
                  src={urlFor(post.mainImage).width(600).height(400).url()}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## スキーマの定義

Sanity Studio でコンテンツモデルを定義：

```typescript
// schemas/post.ts
import { defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: '投稿',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: '著者',
      type: 'reference',
      to: [{ type: 'author' }],
    },
    {
      name: 'mainImage',
      title: 'メイン画像',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'publishedAt',
      title: '公開日',
      type: 'datetime',
    },
    {
      name: 'excerpt',
      title: '抜粋',
      type: 'text',
      rows: 4,
    },
    {
      name: 'body',
      title: '本文',
      type: 'blockContent',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
```

## リアルタイムプレビュー

### 1. プレビューモードの実装

```typescript
// app/api/draft/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  if (!slug) {
    return new Response('Slug not provided', { status: 400 });
  }

  draftMode().enable();
  redirect(`/blog/${slug}`);
}
```

### 2. ビジュアル編集の設定

```typescript
// lib/sanity.ts
import { defineQuery } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published', // または 'previewDrafts'
});
```

### 3. ライブプレビューコンポーネント

```typescript
'use client';

import { useLiveQuery } from '@sanity/preview-kit';

export function LivePreviewPost({ post, query }: { post: any; query: string }) {
  const [data] = useLiveQuery(post, query);

  return (
    <article>
      <h1>{data.title}</h1>
      {/* 他のコンテンツ */}
    </article>
  );
}
```

## Portable Text のレンダリング

```typescript
// components/PortableText.tsx
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

const components = {
  types: {
    image: ({ value }: any) => (
      <Image
        src={urlFor(value).width(800).url()}
        alt={value.alt || '画像'}
        width={800}
        height={600}
        className="my-8 rounded-lg"
      />
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

export function PortableTextRenderer({ content }: { content: any }) {
  return <PortableText value={content} components={components} />;
}
```

## Webhook の設定

### 1. Deploy Hook の作成

Vercel で Deploy Hook を作成し、URL をコピー

### 2. Sanity で Webhook を設定

```bash
sanity hook create
```

プロンプトに従って：
- フック名を入力
- Deploy Hook URL を入力
- トリガーするイベントを選択

または、Sanity Studio で設定：
1. API → Webhooks
2. Create webhook
3. URL と設定を入力

## ISR（インクリメンタル静的再生成）

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 60; // 60秒ごとに再検証

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <PortableTextRenderer content={post.body} />
    </article>
  );
}
```

## 環境変数

`.env.local` ファイルに以下を追加：

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
SANITY_PREVIEW_SECRET=your_preview_secret
```

## ベストプラクティス

### パフォーマンス

- **GROQ クエリの最適化**: 必要なフィールドのみを取得
- **画像最適化**: Sanity の画像 URL ビルダーを使用
- **CDN の活用**: 本番環境では CDN を使用

### セキュリティ

- **API トークンの保護**: 環境変数として安全に保存
- **CORS 設定**: 適切な CORS 設定を実装
- **Webhook 検証**: Webhook リクエストを検証

## トラブルシューティング

### コンテンツが表示されない

1. プロジェクト ID とデータセット名が正しいか確認
2. コンテンツが公開されているか確認
3. GROQ クエリが正しいか確認

### プレビューモードが動作しない

1. プレビューシークレットが設定されているか確認
2. API トークンに読み取り権限があるか確認
3. ドラフトモードが有効化されているか確認

## 関連リソース

- [Sanity 公式ドキュメント](https://www.sanity.io/docs)
- [GROQ クエリ言語](https://www.sanity.io/docs/groq)
- [Sanity テンプレート](https://www.sanity.io/templates)
- [Vercel Sanity 統合](https://vercel.com/integrations/sanity)
