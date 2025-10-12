# Incremental Static Regeneration (ISR)

Incremental Static Regeneration (ISR) は、サイト全体を再ビルドせずに静的コンテンツを更新できる機能です。事前レンダリングされたページを提供することでサーバーの負荷を軽減し、適切な cache-control ヘッダーを自動的に追加します。

## 概要

ISR の動作：

1. **ビルド時**: `next build` 中に、既知のページが静的に生成されます
2. **初回リクエスト**: 後続のリクエストはキャッシュから即座に提供されます
3. **再検証**: 指定された時間の後、次のリクエストがバックグラウンドで再生成をトリガーします

## 基本的な実装

### 時間ベースの再検証

ページレベルで `revalidate` を設定して、自動的にページを更新します。

```typescript
// app/posts/[id]/page.tsx
export const revalidate = 60 // 60秒ごとにページを再生成

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`).then(
    (res) => res.json()
  )

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

### fetch レベルの再検証

個別の fetch リクエストに対して再検証時間を設定します。

```typescript
// app/page.tsx
export default async function Page() {
  // この fetch は60秒ごとに再検証される
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 },
  }).then((res) => res.json())

  // この fetch は常に最新のデータを取得
  const user = await fetch('https://api.example.com/user', {
    cache: 'no-store',
  }).then((res) => res.json())

  return (
    <main>
      <h1>Posts</h1>
      {posts.map((post: any) => (
        <article key={post.id}>{post.title}</article>
      ))}
    </main>
  )
}
```

## 再検証戦略

### 1. 時間ベースの再検証

指定した秒数後に自動的にキャッシュを無効化します。

```typescript
// 30秒ごとに再検証
export const revalidate = 30

// 1時間ごとに再検証
export const revalidate = 3600

// 1日ごとに再検証
export const revalidate = 86400
```

### 2. オンデマンド再検証

手動でキャッシュを無効化します。

#### revalidatePath を使用

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')

  if (!path) {
    return Response.json({ message: 'Missing path param' }, { status: 400 })
  }

  // パスを再検証
  revalidatePath(path)

  return Response.json({ revalidated: true, now: Date.now() })
}
```

使用例：

```bash
curl -X POST "http://localhost:3000/api/revalidate?path=/posts/1"
```

#### revalidateTag を使用

より細かい制御のために、タグベースの再検証を使用します。

```typescript
// app/posts/[id]/page.tsx
export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`, {
    next: { tags: ['post', `post-${params.id}`] },
  }).then((res) => res.json())

  return <main>{post.title}</main>
}
```

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const tag = request.nextUrl.searchParams.get('tag')

  if (!tag) {
    return Response.json({ message: 'Missing tag param' }, { status: 400 })
  }

  // 特定のタグを再検証
  revalidateTag(tag)

  return Response.json({ revalidated: true, now: Date.now() })
}
```

特定の投稿を再検証：

```bash
curl -X POST "http://localhost:3000/api/revalidate?tag=post-1"
```

すべての投稿を再検証：

```bash
curl -X POST "http://localhost:3000/api/revalidate?tag=post"
```

## 高度な使用例

### CMS Webhook との統合

ヘッドレス CMS から Webhook を受け取って、コンテンツが更新されたときに自動的に再検証します。

```typescript
// app/api/webhook/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Webhook のシークレットを検証
  const secret = request.headers.get('x-webhook-secret')

  if (secret !== process.env.WEBHOOK_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const body = await request.json()
  const { type, slug } = body

  // コンテンツタイプに応じて再検証
  switch (type) {
    case 'post':
      revalidatePath(`/posts/${slug}`)
      revalidateTag('posts')
      break
    case 'page':
      revalidatePath(`/${slug}`)
      break
    default:
      return Response.json({ message: 'Unknown type' }, { status: 400 })
  }

  return Response.json({ revalidated: true, now: Date.now() })
}
```

### 動的ルートの生成

`generateStaticParams` を使用して、ビルド時に動的ルートを生成します。

```typescript
// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

export const revalidate = 60

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await fetch(
    `https://api.example.com/posts/${params.slug}`
  ).then((res) => res.json())

  return <main>{post.title}</main>
}
```

### 条件付き再検証

特定の条件に基づいて再検証時間を変更します。

```typescript
// app/posts/[id]/page.tsx
async function getPost(id: string) {
  const post = await fetch(`https://api.example.com/posts/${id}`).then((res) =>
    res.json()
  )
  return post
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)
  return { title: post.title }
}

export default async function PostPage({
  params,
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id)

  // 公開済みの投稿は1時間ごとに再検証
  // 下書きの投稿は常に最新のデータを取得
  const revalidate = post.status === 'published' ? 3600 : 0

  return <main>{post.title}</main>
}

// ページレベルの再検証を設定
export const revalidate = 3600
```

## ベストプラクティス

### 1. 適切な再検証時間を設定

コンテンツの更新頻度に応じて、適切な再検証時間を設定します。

```typescript
// 頻繁に更新されるコンテンツ: 短い間隔
export const revalidate = 60 // 1分

// 定期的に更新されるコンテンツ: 中程度の間隔
export const revalidate = 3600 // 1時間

// 稀に更新されるコンテンツ: 長い間隔
export const revalidate = 86400 // 1日
```

### 2. タグを使用した細かい制御

関連するコンテンツをグループ化して、効率的に再検証します。

```typescript
// すべての投稿に 'posts' タグを付ける
const posts = await fetch('https://api.example.com/posts', {
  next: { tags: ['posts'] },
})

// 特定のカテゴリに 'category-tech' タグを付ける
const techPosts = await fetch('https://api.example.com/posts?category=tech', {
  next: { tags: ['posts', 'category-tech'] },
})

// 特定の投稿に個別のタグを付ける
const post = await fetch('https://api.example.com/posts/1', {
  next: { tags: ['posts', 'post-1'] },
})
```

### 3. エラーハンドリング

再検証エラーを適切に処理します。

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  try {
    const { path } = await request.json()

    if (!path) {
      return Response.json(
        { message: 'Path is required' },
        { status: 400 }
      )
    }

    revalidatePath(path)

    return Response.json({
      revalidated: true,
      now: Date.now(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return Response.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}
```

### 4. セキュリティ

再検証エンドポイントを保護します。

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  // トークン検証
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (token !== process.env.REVALIDATE_TOKEN) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { path } = await request.json()
  revalidatePath(path)

  return Response.json({ revalidated: true })
}
```

## 重要な注意事項

### 1. Node.js ランタイムのみサポート

ISR は Node.js ランタイムでのみサポートされています。

```typescript
// app/posts/[id]/page.tsx
export const runtime = 'nodejs' // デフォルト

export const revalidate = 60

export default async function PostPage() {
  // ...
}
```

### 2. 静的エクスポートと非互換

`output: 'export'` を使用する場合、ISR は使用できません。

```javascript
// next.config.js
module.exports = {
  // ISR を使用する場合は、この設定を削除
  // output: 'export',
}
```

### 3. 最小の再検証時間が優先

複数の `fetch` リクエストがある場合、最も短い再検証時間が使用されます。

```typescript
export default async function Page() {
  // 60秒で再検証
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 },
  })

  // 30秒で再検証
  const featured = await fetch('https://api.example.com/featured', {
    next: { revalidate: 30 },
  })

  // このページは30秒ごとに再検証される（最小値）
}
```

## プラットフォームサポート

### サポートされている環境

- Node.js サーバー
- Docker コンテナ
- セルフホスティング

### サポートされていない環境

- 静的エクスポート（`output: 'export'`）
- Edge ランタイム（一部の機能のみ）

## まとめ

ISR は、以下の場合に最適です：

1. **動的コンテンツ**: 定期的に更新されるコンテンツ
2. **高トラフィック**: 静的ページのパフォーマンス利点を維持
3. **CMS 統合**: ヘッドレス CMS と連携

主な利点：

- **パフォーマンス**: 静的ページの速度を維持
- **スケーラビリティ**: サーバー負荷の軽減
- **柔軟性**: 時間ベースとオンデマンドの両方をサポート
- **最新性**: 定期的にコンテンツを更新

ISR を適切に実装することで、静的生成のパフォーマンスと動的コンテンツの柔軟性を両立できます。
