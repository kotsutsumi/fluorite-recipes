# Route HandlersとMiddleware

Next.jsでは、APIエンドポイントの作成やリクエストのインターセプトのための2つの強力な機能を提供しています：Route HandlersとMiddleware。

このページでは、これらの機能の使用方法について学びます。

## Route Handlers

Route Handlersを使用すると、Web [Request](https://developer.mozilla.org/docs/Web/API/Request)および[Response](https://developer.mozilla.org/docs/Web/API/Response) APIを使用して、特定のルートのカスタムリクエストハンドラを作成できます。

Route Handlersは、`app`ディレクトリ内でのみ使用できます。これらは、`pages`ディレクトリ内の[API Routes](/docs/pages/building-your-application/routing/api-routes)と同等であり、API RoutesとRoute Handlersを**一緒に**使用する必要は**ありません**。

### 規約

Route Handlersは、`app`ディレクトリ内の[`route.js|ts`ファイル](/docs/app/api-reference/file-conventions/route)で定義されます：

```ts title="app/api/route.ts"
export async function GET(request: Request) {
  return Response.json({ message: 'Hello from Route Handler' })
}
```

Route Handlersは、`page.js`や`layout.js`と同様に、`app`ディレクトリ内の任意の場所にネストできます。ただし、`page.js`と同じルートセグメントレベルに`route.js`ファイルを配置することは**できません**。

### サポートされているHTTPメソッド

次の[HTTPメソッド](https://developer.mozilla.org/docs/Web/HTTP/Methods)がサポートされています：`GET`、`POST`、`PUT`、`PATCH`、`DELETE`、`HEAD`、および`OPTIONS`。サポートされていないメソッドが呼び出された場合、Next.jsは`405 Method Not Allowed`レスポンスを返します。

### 拡張された`NextRequest`と`NextResponse` API

ネイティブの[Request](https://developer.mozilla.org/docs/Web/API/Request)および[Response](https://developer.mozilla.org/docs/Web/API/Response) APIをサポートすることに加えて、Next.jsは[`NextRequest`](/docs/app/api-reference/functions/next-request)および[`NextResponse`](/docs/app/api-reference/functions/next-response)で拡張し、高度なユースケースのための便利なヘルパーを提供します。

## Route Handlerの例

### リクエストボディの読み取り

標準のWeb APIメソッドを使用して`Request`ボディを読み取ることができます：

```ts title="app/api/route.ts"
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ message: 'Success', data: res })
}
```

### FormDataの処理

`request.formData()`関数を使用して`FormData`を読み取ることができます：

```ts title="app/api/route.ts"
export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  return Response.json({ name, email })
}
```

### リクエストヘッダーの読み取り

[`headers`](/docs/app/api-reference/functions/headers)関数を使用してヘッダーを読み取ることができます：

```ts title="app/api/route.ts"
import { headers } from 'next/headers'

export async function GET(request: Request) {
  const headersList = await headers()
  const referer = headersList.get('referer')

  return Response.json({ referer })
}
```

### Cookieの読み取り

[`cookies`](/docs/app/api-reference/functions/cookies)関数を使用してCookieを読み取ることができます：

```ts title="app/api/route.ts"
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  return Response.json({ token })
}
```

### リダイレクト

```ts title="app/api/route.ts"
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

### 動的ルートセグメント

Route Handlersは、動的セグメントを使用して動的データからリクエストハンドラを作成できます。

```ts title="app/api/posts/[slug]/route.ts"
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  return Response.json({ slug })
}
```

### ストリーミング

ストリーミングは、AIが生成したコンテンツのためにOpenAIなどのLarge Language Models (LLMs)と併用されることが一般的です。[AI SDK](https://sdk.vercel.ai/docs/introduction)について詳しく学びましょう。

```ts title="app/api/chat/route.ts"
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  })

  return result.toDataStreamResponse()
}
```

これらの抽象化は、Web APIを使用してストリームを作成します。基礎となるWeb APIを直接使用することもできます。

```ts title="app/api/route.ts"
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode('<p>One</p>')
  await sleep(200)
  yield encoder.encode('<p>Two</p>')
  await sleep(200)
  yield encoder.encode('<p>Three</p>')
}

export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)

  return new Response(stream)
}
```

### CORSの設定

標準のWeb APIメソッドを使用して、特定のRoute Handlerに`CORS`ヘッダーを設定できます：

```ts title="app/api/route.ts"
export async function GET(request: Request) {
  return new Response('Hello, Next.js!', {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

### Webhooks

Route Handlerを使用して、サードパーティサービスからのWebhookを受信できます：

```ts title="app/api/webhook/route.ts"
export async function POST(request: Request) {
  const payload = await request.json()
  // Webhookペイロードを処理
  return Response.json({ received: true })
}
```

### Edge and Node.js Runtimes

Route Handlersには、ストリーミングのサポートを含む、Edge and Node.js runtimesの両方をシームレスにサポートする同型Web APIがあります。Route Handlersはpagesとlayoutsと同じ[route segment configuration](/docs/app/api-reference/file-conventions/route-segment-config)を使用するため、一般的な目的の[statically regenerated](/docs/app/building-your-application/data-fetching/incremental-static-regeneration) Route Handlersなどの待望の機能をサポートします。

`runtime`セグメント設定オプションを使用して、ランタイムを指定できます：

```ts title="app/api/route.ts"
export const runtime = 'edge' // 'nodejs' がデフォルト
```

### 非UIレスポンス

Route Handlersを使用して、非UIコンテンツを返すことができます。[`sitemap.xml`](/docs/app/api-reference/file-conventions/metadata/sitemap)、[`robots.txt`](/docs/app/api-reference/file-conventions/metadata/robots)、[`app icons`](/docs/app/api-reference/file-conventions/metadata/app-icons)、および[open graph images](/docs/app/api-reference/file-conventions/metadata/opengraph-image)は、すべて組み込みサポートを持っていることに注意してください。

```ts title="app/rss.xml/route.ts"
export async function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Next.js Documentation</title>
    <link>https://nextjs.org/docs</link>
    <description>The React Framework for the Web</description>
  </channel>
</rss>`,
    {
      headers: {
        'Content-Type': 'text/xml',
      },
    }
  )
}
```

### セグメント設定オプション

Route Handlersは、pagesやlayoutsと同じ[route segment configuration](/docs/app/api-reference/file-conventions/route-segment-config)を使用します。

```ts title="app/api/route.ts"
export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'
```

詳細については、[APIリファレンス](/docs/app/api-reference/file-conventions/route-segment-config)を参照してください。

---

## Middleware

Middlewareを使用すると、リクエストが完了する前にコードを実行できます。その後、受信したリクエストに基づいて、書き換え、リダイレクト、リクエストまたはレスポンスヘッダーの変更、または直接レスポンスすることで、レスポンスを変更できます。

Middlewareは、認証、ロギング、リダイレクトの処理などの、カスタムサーバー側のロジックを実装するのに便利です。

### 規約

プロジェクトのルートに`middleware.ts`（または`.js`）ファイルを使用してMiddlewareを定義します。例えば、`pages`または`app`と同じレベル、または該当する場合は`src`内に配置します。

> **注意**: プロジェクトごとに1つの`middleware.ts`ファイルのみがサポートされていますが、Middlewareロジックをモジュール化して整理することができます。Middleware機能を別々の`.ts`または`.js`ファイルに分割し、メインの`middleware.ts`ファイルにインポートします。これにより、ルート固有のMiddlewareのクリーナー管理が可能になり、`middleware.ts`で集中制御できます。

### 例

```ts title="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// この関数は内部で`await`を使用する場合、`async`としてマークできます
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// "matcher"の詳細は以下を参照してください
export const config = {
  matcher: '/about/:path*',
}
```

### パスのマッチング

Middlewareは、**プロジェクト内のすべてのルート**で呼び出されます。実行順序は次のとおりです：

1. `next.config.js`からの`headers`
2. `next.config.js`からの`redirects`
3. Middleware（`rewrites`、`redirects`など）
4. `next.config.js`からの`beforeFiles`（`rewrites`）
5. ファイルシステムルート（`public/`、`_next/static/`、`pages/`、`app/`など）
6. `next.config.js`からの`afterFiles`（`rewrites`）
7. 動的ルート（`/blog/[slug]`）
8. `next.config.js`からの`fallback`（`rewrites`）

Middlewareが実行されるパスを定義するには、2つの方法があります：

1. カスタムマッチャー設定
2. 条件文

#### Matcher

`matcher`を使用すると、特定のパスでMiddlewareを実行するようにフィルタリングできます。

```ts title="middleware.ts"
export const config = {
  matcher: '/about/:path*',
}
```

配列構文を使用して、単一のパスまたは複数のパスをマッチングできます：

```ts title="middleware.ts"
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

`matcher`設定は完全な正規表現をサポートしているため、negative lookaheadsやcharacter matchingなどのマッチングがサポートされています：

```ts title="middleware.ts"
export const config = {
  matcher: [
    /*
     * 次で始まるパス以外のすべてのリクエストパスをマッチング：
     * - api（APIルート）
     * - _next/static（静的ファイル）
     * - _next/image（画像最適化ファイル）
     * - favicon.ico、sitemap.xml、robots.txt（メタデータファイル）
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

> **知っておくと良いこと**: `matcher`値は、ビルド時に静的に分析できるように定数である必要があります。変数などの動的な値は無視されます。

設定されたマッチャー：

1. `/`で始まる必要があります
2. 名前付きパラメータを含めることができます：`/about/:path`は`/about/a`と`/about/b`にマッチしますが、`/about/a/c`にはマッチしません
3. 名前付きパラメータ（`:`で始まる）に修飾子を持つことができます：`/about/:path*`は`/about/a/b/c`にマッチします。なぜなら`*`は*zero or more*だからです。`?`は*zero or one*で、`+`は*one or more*です
4. 括弧で囲まれた正規表現を使用できます：`/about/(.*)`は`/about/:path*`と同じです

詳細については、[path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1)のドキュメントを参照してください。

> **知っておくと良いこと**: 後方互換性のため、Next.jsは常に`/public`を`/public/index`と見なします。したがって、`/public/:path`のマッチャーはマッチします。

#### 条件文

```ts title="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

### NextResponse

`NextResponse` APIを使用すると、次のことができます：

- 受信リクエストを別のURLに`redirect`する
- 指定されたURLを表示してレスポンスを`rewrite`する
- API Routes、`getServerSideProps`、および`rewrite`先のリクエストヘッダーを設定する
- レスポンスCookieを設定する
- レスポンスヘッダーを設定する

Middlewareからレスポンスを生成するには、次のことができます：

1. レスポンスを生成するルート（[Page](/docs/app/building-your-application/routing/layouts-and-pages)または[Route Handler](/docs/app/building-your-application/routing/route-handlers)）に`rewrite`する
2. `NextResponse`を直接返す。[Producing a Response](#producing-a-response)を参照してください

### Cookieの使用

Cookieは通常のヘッダーです。`Request`では、`Cookie`ヘッダーに保存されます。`Response`では、`Set-Cookie`ヘッダーに含まれます。Next.jsは、`NextRequest`と`NextResponse`の`cookies`拡張を通じて、これらのCookieにアクセスして操作する便利な方法を提供します。

1. 受信リクエストの場合、`cookies`には次のメソッドがあります：`get`、`getAll`、`set`、`delete` cookies。`has`を使用してCookieの存在を確認したり、`clear`を使用してすべてのCookieを削除したりできます。
2. 送信レスポンスの場合、`cookies`には次のメソッドがあります：`get`、`getAll`、`set`、`delete`。

```ts title="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 受信リクエストに"Cookie:nextjs=fast"ヘッダーが存在すると仮定
  // `RequestCookies` APIを使用してリクエストからCookieを取得
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // `ResponseCookies` APIを使用してレスポンスにCookieを設定
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // 送信レスポンスには`Set-Cookie:vercel=fast;path=/`ヘッダーがあります。

  return response
}
```

### ヘッダーの設定

`NextResponse` APIを使用してリクエストとレスポンスヘッダーを設定できます（リクエストヘッダーの設定はNext.js v13.0.0以降で利用可能です）。

```ts title="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // リクエストヘッダーをクローンし、新しいヘッダー`x-hello-from-middleware1`を設定
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')

  // NextResponse.nextでリクエストヘッダーを設定することもできます
  const response = NextResponse.next({
    request: {
      // 新しいリクエストヘッダー
      headers: requestHeaders,
    },
  })

  // 新しいレスポンスヘッダー`x-hello-from-middleware2`を設定
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
```

> **知っておくと良いこと**: バックエンドのウェブサーバー設定によっては、大きなヘッダーを設定すると[431 Request Header Fields Too Large](https://developer.mozilla.org/docs/Web/HTTP/Status/431)エラーが発生する可能性があるため、避けてください。

### レスポンスの生成

Middlewareから`Response`または`NextResponse`インスタンスを返すことで、直接レスポンスできます。（これは[Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-middleware)以降で利用可能です）

```ts title="middleware.ts"
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@lib/auth'

// Middlewareを`/api/`で始まるパスに制限
export const config = {
  matcher: '/api/:function*',
}

export function middleware(request: NextRequest) {
  // リクエストを確認するために認証関数を呼び出す
  if (!isAuthenticated(request)) {
    // エラーメッセージを示すJSONでレスポンス
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

#### `waitUntil`と`NextFetchEvent`

`NextFetchEvent`オブジェクトは、ネイティブの[`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent)オブジェクトを拡張し、[`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil)メソッドを含みます。

`waitUntil()`メソッドは、promiseを引数として取り、promiseが解決されるまでMiddlewareの寿命を延ばします。これは、バックグラウンドで作業を実行するのに役立ちます。

```ts title="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'

export function middleware(req: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://my-analytics-platform.com', {
      method: 'POST',
      body: JSON.stringify({ pathname: req.nextUrl.pathname }),
    })
  )

  return NextResponse.next()
}
```

### 高度なMiddleware機能

Next.js v13.1では、Middlewareに2つの追加機能が導入されました：`skipTrailingSlashRedirect`と`skipMiddlewareUrlNormalize`は、高度なユースケースを処理するためです。

`skipTrailingSlashRedirect`は、Next.jsのデフォルトのリダイレクト for adding or removing trailing slashesを無効にします。これにより、Middleware内でカスタム処理が可能になり、一部のパスでは末尾のスラッシュを維持し、他のパスでは維持しないようにすることができます。これは、インクリメンタルマイグレーションを容易にします。

```js title="next.config.js"
module.exports = {
  skipTrailingSlashRedirect: true,
}
```

```js title="middleware.js"
const legacyPrefixes = ['/docs', '/blog']

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  if (legacyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // 末尾のスラッシュ処理を適用
  if (
    !pathname.endsWith('/') &&
    !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
  ) {
    return NextResponse.redirect(
      new URL(`${req.nextUrl.pathname}/`, req.url)
    )
  }
}
```

`skipMiddlewareUrlNormalize`は、Next.jsが行うURL正規化を無効にして、直接訪問とクライアント遷移の処理を同じにすることができます。元の特殊なケースでは、元のURLを使用して完全な制御が必要な場合があります。

```js title="next.config.js"
module.exports = {
  skipMiddlewareUrlNormalize: true,
}
```

```js title="middleware.js"
export default async function middleware(req) {
  const { pathname } = req.nextUrl

  // GET /_next/data/build-id/hello.json

  console.log(pathname)
  // フラグを使用すると、これは /_next/data/build-id/hello.json になります
  // フラグを使用しない場合、これは /hello として正規化されます
}
```

### Runtime

Middlewareは現在、[Edge runtime](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)のみをサポートしています。Node.js runtimeは使用できません。

### バージョン履歴

| バージョン | 変更内容 |
| --------- | -------- |
| `v13.1.0` | 高度なMiddleware機能が追加されました |
| `v13.0.0` | Middlewareはリクエストヘッダー、レスポンスヘッダーを変更し、レスポンスを送信できます |
| `v12.2.0` | Middlewareは安定版です |
| `v12.0.9` | Edge Runtimeでの絶対URLの強制（[PR](https://github.com/vercel/next.js/pull/33410)） |
| `v12.0.0` | Middleware（ベータ版）が追加されました |

## 次のステップ

これで、Next.jsでRoute HandlersとMiddlewareを使用する方法を理解できました。次のステップでは、さらに高度なトピックについて学びます：

- **[Route Handlers API Reference](/docs/app/api-reference/file-conventions/route)**: すべてのRoute Handlersオプションの完全なリファレンスを参照してください。
- **[Middleware API Reference](/docs/app/api-reference/functions/next-request)**: NextRequestとNextResponseの完全なAPIリファレンスを参照してください。
