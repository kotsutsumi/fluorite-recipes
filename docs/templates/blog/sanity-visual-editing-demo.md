# Visual Editing with Sanity

## 概要

Vercelでビジュアル編集を展示するSanity駆動のパーソナルウェブサイトです。

**デモ**:
- ウェブサイト: https://sanity-template-vercel-visual-editing-git-preview.sanity.build
- Studio: https://sanity-template-vercel-visual-editing-git-preview.sanity.build/studio

**GitHub**: https://github.com/sanity-io/sanity-template-vercel-visual-editing

## 主な機能

- 静的生成されたパーソナルウェブサイト
- リアルタイムコラボレーションを備えたネイティブSanity Studio
- インスタントサイドバイサイドコンテンツプレビュー
- 直感的なコンテンツ編集
- ホストされたコンテンツAPI
- TypeScriptとTailwind.css統合

## 技術スタック

- **フレームワーク**: Next.js
- **CMS**: Sanity CMS
- **スタイリング**: Tailwind CSS

## 独自の特徴

ビジュアル編集機能により、コンテンツの直接的な変更が可能:

- ページ上で直接編集
- リアルタイムプレビュー
- クリックして編集
- インラインコンテンツ更新

## はじめに

### プロジェクトのデプロイ

#### Vercelでデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sanity-io/sanity-template-vercel-visual-editing)

デプロイ時に:
1. Sanityプロジェクトが自動的に作成されます
2. 環境変数が設定されます
3. サンプルデータがインポートされます

#### ローカルでのセットアップ

```bash
git clone https://github.com/sanity-io/sanity-template-vercel-visual-editing.git
cd sanity-template-vercel-visual-editing
npm install
```

### 環境変数の設定

`.env.local`ファイルを作成:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Visual Editing
NEXT_PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true
SANITY_PREVIEW_SECRET=your_preview_secret
```

### 開発サーバーの起動

```bash
npm run dev
```

- ウェブサイト: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

## ビジュアル編集の使用

### ビジュアル編集の有効化

1. Sanity Studioにログイン
2. プレビューモードを有効化
3. ウェブサイト上で編集可能な要素をクリック
4. Studioで編集
5. リアルタイムで変更が反映される

### 編集可能な要素の設定

```typescript
// components/EditableText.tsx
'use client'

import { useLiveQuery } from 'next-sanity/preview'

export function EditableText({
  query,
  params,
  initial
}: {
  query: string
  params: any
  initial: any
}) {
  const [data] = useLiveQuery(initial, query, params)

  return <div>{data.text}</div>
}
```

### ビジュアル編集の統合

```typescript
// app/page.tsx
import { client } from '@/lib/sanity.client'
import { previewClient } from '@/lib/sanity.preview'
import { EditableText } from '@/components/EditableText'
import { draftMode } from 'next/headers'

const query = `*[_type == "home"][0]`

export default async function HomePage() {
  const { isEnabled } = draftMode()
  const data = await (isEnabled ? previewClient : client).fetch(query)

  if (isEnabled) {
    return <EditableText query={query} params={{}} initial={data} />
  }

  return <div>{data.text}</div>
}
```

## Sanityスキーマ

### ホームページスキーマ

```typescript
// sanity/schemas/home.ts
export default {
  name: 'home',
  title: 'Home Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    },
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
        },
        {
          name: 'tagline',
          title: 'Tagline',
          type: 'text',
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    },
    {
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        { type: 'textSection' },
        { type: 'imageSection' },
        { type: 'ctaSection' },
      ],
    },
  ],
}
```

### セクションスキーマ

```typescript
// sanity/schemas/sections.ts
export const textSection = {
  name: 'textSection',
  title: 'Text Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
  ],
}

export const imageSection = {
  name: 'imageSection',
  title: 'Image Section',
  type: 'object',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
    },
  ],
}
```

## プレビュークライアントの設定

### プレビュークライアント

```typescript
// lib/sanity.preview.ts
import { createClient } from 'next-sanity'

export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
})
```

### ライブクエリフック

```typescript
// lib/sanity.hooks.ts
import { useLiveQuery } from 'next-sanity/preview'

export function usePreview(
  query: string,
  params: Record<string, any>,
  initialData: any
) {
  const [data, loading] = useLiveQuery(initialData, query, params)

  return { data, loading }
}
```

## ブロックコンテンツのレンダリング

### Portable Textコンポーネント

```typescript
// components/PortableText.tsx
import { PortableText as SanityPortableText } from '@portabletext/react'

const components = {
  types: {
    image: ({ value }) => (
      <img src={value.url} alt={value.alt || ''} />
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
}

export function PortableText({ value }) {
  return <SanityPortableText value={value} components={components} />
}
```

## SEO対応

### メタデータの設定

```typescript
// app/page.tsx
export async function generateMetadata() {
  const data = await client.fetch(`*[_type == "home"][0]`)

  return {
    title: data.title,
    description: data.subtitle,
    openGraph: {
      title: data.title,
      description: data.subtitle,
      images: data.hero.image ? [data.hero.image.url] : [],
    },
  }
}
```

## Sanityの特徴

### 無料のSanityプロジェクト

- 無制限の管理者ユーザー
- 3つの非管理者ユーザー
- 2つのデータセット
- 無制限のドキュメント
- 無制限のAPI リクエスト

### 従量課金APIモデル

- 最初の1GBの帯域幅は無料
- 最初の100万APIリクエストは無料

## デプロイ

### Vercelへのデプロイ

自動的にビジュアル編集機能が統合されたサイトをデプロイできます。

## 使用例

- パーソナルウェブサイト
- ポートフォリオサイト
- ランディングページ
- 企業サイト

## リソース

- [Sanity Visual Editing Documentation](https://www.sanity.io/docs/visual-editing)
- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)

## ライセンス

MITライセンス
