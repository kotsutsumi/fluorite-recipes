# ドラフトモード

ドラフトモード（Draft Mode）は、ヘッドレス CMS から下書きコンテンツを Next.js アプリケーションでプレビューできる機能です。静的生成から動的レンダリングに切り替えることで、サイト全体を再ビルドせずに下書きの変更を確認できます。

## 概要

ドラフトモードを使用すると、以下のことが可能になります：

- **下書きコンテンツのプレビュー**: 公開前のコンテンツを確認
- **動的レンダリング**: ドラフトモード中は動的にページを生成
- **セキュアなアクセス**: 認証されたユーザーのみが下書きを閲覧

## 実装手順

### 1. ルートハンドラーの作成

ドラフトモードを有効にするルートハンドラーを作成します。

```typescript
// app/api/draft/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  // URL からパラメータを取得
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // シークレットとスラッグを検証
  if (secret !== process.env.DRAFT_MODE_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // スラッグが存在するか確認（オプション）
  // const post = await getPostBySlug(slug)
  // if (!post) {
  //   return new Response('Invalid slug', { status: 401 })
  // }

  // ドラフトモードを有効化
  const draft = await draftMode()
  draft.enable()

  // プレビューするページにリダイレクト
  redirect(slug || '/')
}
```

### 2. ドラフトルートのセキュア化

#### シークレットトークンの生成

アプリケーションと CMS だけが知っているシークレットトークンを生成します。

```bash
# .env.local
DRAFT_MODE_SECRET=your-secret-token-here
```

#### CMS での設定

CMS のプレビュー URL を設定します：

```
https://your-site.com/api/draft?secret=your-secret-token-here&slug=/posts/example-post
```

### 3. ドラフトコンテンツへのアクセス

ページコンポーネントで `draftMode().isEnabled` をチェックして、ドラフトモードの状態に基づいてデータを取得します。

```typescript
// app/posts/[slug]/page.tsx
import { draftMode } from 'next/headers'

async function getPost(slug: string) {
  const { isEnabled } = await draftMode()

  // ドラフトモードの状態に応じて URL を切り替え
  const url = isEnabled
    ? `https://draft.example.com/posts/${slug}`
    : `https://api.example.com/posts/${slug}`

  const res = await fetch(url, {
    // ドラフトモード中はキャッシュを無効化
    cache: isEnabled ? 'no-store' : 'force-cache',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch post')
  }

  return res.json()
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  const { isEnabled } = await draftMode()

  return (
    <main>
      {isEnabled && (
        <div className="draft-banner">
          ドラフトモードで閲覧中
        </div>
      )}
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </main>
  )
}
```

### 4. ドラフトモードの無効化

ドラフトモードを終了するためのルートハンドラーを作成します。

```typescript
// app/api/disable-draft/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()

  redirect('/')
}
```

## 高度な使用例

### CMS との統合

#### Contentful との統合例

```typescript
// lib/api.ts
import { draftMode } from 'next/headers'

export async function getContentfulData(slug: string) {
  const { isEnabled } = await draftMode()

  const res = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/entries`,
    {
      headers: {
        Authorization: `Bearer ${
          isEnabled
            ? process.env.CONTENTFUL_PREVIEW_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      cache: isEnabled ? 'no-store' : 'force-cache',
    }
  )

  return res.json()
}
```

#### Sanity との統合例

```typescript
// lib/sanity.ts
import { draftMode } from 'next/headers'
import { client } from './sanityClient'

export async function getSanityData(query: string) {
  const { isEnabled } = await draftMode()

  // ドラフトモード中は Sanity の preview モードを使用
  return client.fetch(query, {}, { perspective: isEnabled ? 'previewDrafts' : 'published' })
}
```

### ドラフトモードインジケーターの表示

```typescript
// app/components/DraftModeIndicator.tsx
import { draftMode } from 'next/headers'

export async function DraftModeIndicator() {
  const { isEnabled } = await draftMode()

  if (!isEnabled) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center z-50">
      <p className="font-bold">
        ドラフトモードで閲覧中
        <a
          href="/api/disable-draft"
          className="ml-4 underline"
        >
          終了する
        </a>
      </p>
    </div>
  )
}
```

レイアウトに追加：

```typescript
// app/layout.tsx
import { DraftModeIndicator } from './components/DraftModeIndicator'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <DraftModeIndicator />
        {children}
      </body>
    </html>
  )
}
```

### 認証の追加

より強固なセキュリティのために、認証を追加します。

```typescript
// app/api/draft/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const token = searchParams.get('token')

  // シークレットを検証
  if (secret !== process.env.DRAFT_MODE_SECRET) {
    return new Response('Invalid secret', { status: 401 })
  }

  // JWT トークンを検証（オプション）
  try {
    await verifyAuth(token)
  } catch (error) {
    return new Response('Unauthorized', { status: 401 })
  }

  // ドラフトモードを有効化
  const draft = await draftMode()
  draft.enable()

  redirect(slug || '/')
}
```

## ベストプラクティス

### 1. シークレットの管理

環境変数を使用してシークレットを安全に管理します。

```bash
# .env.local
DRAFT_MODE_SECRET=<ランダムで長い文字列>
```

シークレットを生成するには：

```bash
openssl rand -base64 32
```

### 2. キャッシュの無効化

ドラフトモード中は、必ずキャッシュを無効化してください。

```typescript
const res = await fetch(url, {
  cache: isEnabled ? 'no-store' : 'force-cache',
})
```

### 3. エラーハンドリング

適切なエラーハンドリングを実装します。

```typescript
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const slug = searchParams.get('slug')

    if (!secret || !slug) {
      return new Response('Missing parameters', { status: 400 })
    }

    if (secret !== process.env.DRAFT_MODE_SECRET) {
      return new Response('Invalid token', { status: 401 })
    }

    // スラッグの検証
    const post = await getPostBySlug(slug)
    if (!post) {
      return new Response('Post not found', { status: 404 })
    }

    const draft = await draftMode()
    draft.enable()

    redirect(slug)
  } catch (error) {
    console.error('Draft mode error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
```

### 4. プレビュー URL の自動生成

CMS でプレビュー URL を自動生成するヘルパー関数を作成します。

```typescript
// lib/preview-url.ts
export function generatePreviewUrl(slug: string): string {
  const secret = process.env.DRAFT_MODE_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  return `${baseUrl}/api/draft?secret=${secret}&slug=${slug}`
}
```

## トラブルシューティング

### ドラフトモードが有効にならない

1. Cookie が正しく設定されているか確認
2. ブラウザの Cookie が有効になっているか確認
3. HTTPS 環境で `secure` Cookie が設定されているか確認

### キャッシュが無効化されない

1. `cache: 'no-store'` が設定されているか確認
2. `revalidate: 0` を fetch オプションに追加
3. `dynamic = 'force-dynamic'` をページに追加

```typescript
export const dynamic = 'force-dynamic'
```

## まとめ

ドラフトモードは、以下の場合に最適です：

1. **ヘッドレス CMS との統合**: Contentful、Sanity、Strapi などとの統合
2. **コンテンツプレビュー**: 編集者が公開前にコンテンツをプレビュー
3. **クライアントレビュー**: クライアントが下書きコンテンツを確認

主な利点：

- **高速なプレビュー**: サイト全体を再ビルドせずにプレビュー
- **セキュア**: シークレットトークンによる保護
- **柔軟性**: 任意のヘッドレス CMS と統合可能

ドラフトモードを適切に実装することで、コンテンツ編集者にスムーズなプレビュー体験を提供しながら、本番環境のパフォーマンスを維持できます。
