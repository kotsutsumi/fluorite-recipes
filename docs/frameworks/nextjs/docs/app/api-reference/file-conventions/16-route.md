# route.js

`route.js` ファイル規約を使用すると、特定のルートに対してカスタムリクエストハンドラーを作成できます。

## 概要

Route Handlers（ルートハンドラー）は、Web標準の [Request](https://developer.mozilla.org/docs/Web/API/Request) と [Response](https://developer.mozilla.org/docs/Web/API/Response) API を使用して、指定されたルートに対するカスタムリクエストハンドラーを作成できます。

## サポートされるHTTPメソッド

以下のHTTPメソッドがサポートされています：

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `HEAD`
- `OPTIONS`

サポートされていないメソッドが呼び出された場合、Next.jsは `405 Method Not Allowed` レスポンスを返します。

## 基本的な使用例

```typescript
// app/api/route.ts
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

```javascript
// app/api/route.js
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

## パラメータ

### `request`（オプション）

`request` パラメータは [NextRequest](https://nextjs.org/docs/app/api-reference/functions/next-request) オブジェクトで、Web Request APIの拡張版です。

```typescript
// app/api/route.ts
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  return Response.json({ query })
}
```

### `context`（オプション）

`context` パラメータには、ルートパラメータを含むオブジェクトが含まれます。

```typescript
// app/api/posts/[slug]/route.ts
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  return Response.json({ slug })
}
```

## 動的ルートセグメント

Route Handlersは、動的ルートセグメントをサポートしています。

```typescript
// app/items/[slug]/route.ts
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params

  return Response.json({ slug })
}
```

## リクエストの処理

### URLクエリパラメータの読み取り

```typescript
// app/api/search/route.ts
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  return Response.json({ results: `Results for: ${query}` })
}
```

### Cookieの読み取り

```typescript
// app/api/route.ts
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return Response.json({ token })
}
```

### Headerの読み取り

```typescript
// app/api/route.ts
import { headers } from 'next/headers'

export async function GET() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')

  return Response.json({ userAgent })
}
```

### リクエストボディの読み取り

```typescript
// app/api/route.ts
export async function POST(request: NextRequest) {
  const data = await request.json()

  return Response.json({ data })
}
```

### FormDataの処理

```typescript
// app/api/route.ts
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')

  return Response.json({ name, email })
}
```

## レスポンスの返却

### JSONレスポンス

```typescript
// app/api/route.ts
export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

### ステータスコード付きレスポンス

```typescript
// app/api/route.ts
export async function POST() {
  return Response.json(
    { message: 'Created' },
    { status: 201 }
  )
}
```

### Headerの設定

```typescript
// app/api/route.ts
export async function GET() {
  return new Response('Hello World', {
    headers: {
      'Content-Type': 'text/plain',
      'X-Custom-Header': 'custom-value',
    },
  })
}
```

### Cookieの設定

```typescript
// app/api/route.ts
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()

  cookieStore.set('token', 'abc123', {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 1週間
  })

  return Response.json({ message: 'Cookie set' })
}
```

### リダイレクト

```typescript
// app/api/route.ts
import { redirect } from 'next/navigation'

export async function GET() {
  redirect('/new-location')
}
```

### ストリーミングレスポンス

```typescript
// app/api/route.ts
export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('Hello '))
      controller.enqueue(encoder.encode('World'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
```

## ルートセグメント設定

Route Handlersは、ページやレイアウトと同じ[ルートセグメント設定](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/18-route-segment-config.md)オプションを使用できます。

```typescript
// app/api/route.ts
export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function GET() {
  return Response.json({ message: 'Hello World' })
}
```

## CORSの設定

標準のWeb Response APIを使用してCORSヘッダーを設定できます。

```typescript
// app/api/route.ts
export async function GET() {
  return new Response('Hello World', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

## Webhookの処理

Route Handlersを使用して、サードパーティサービスからのWebhookを処理できます。

```typescript
// app/api/webhook/route.ts
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  const headersList = await headers()
  const signature = headersList.get('x-webhook-signature')

  // 署名を検証
  // ...

  const payload = await request.json()

  // Webhookイベントを処理
  // ...

  return Response.json({ received: true })
}
```

## 非UIコンテンツの生成

Route Handlersを使用して、非UIコンテンツ（RSS、サイトマップなど）を生成できます。

```typescript
// app/rss.xml/route.ts
export async function GET() {
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>My Blog</title>
        <link>https://example.com</link>
        <description>My blog description</description>
      </channel>
    </rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
```

## エッジランタイムとNode.jsランタイム

Route Handlersは、ストリーミングを含むエッジランタイムとNode.jsランタイムの両方をサポートしています。

```typescript
// app/api/route.ts
export const runtime = 'edge' // デフォルトは 'nodejs'

export async function GET() {
  return Response.json({ message: 'Hello from Edge' })
}
```

## バージョン履歴

| バージョン | 変更内容 |
| --- | --- |
| `v15.0.0-RC` | `GET` ハンドラーのデフォルトキャッシュが `force-static` から `force-dynamic` に変更 |
| `v13.2.0` | Route Handlers が導入 |
