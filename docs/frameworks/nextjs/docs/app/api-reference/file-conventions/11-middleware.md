# middleware.js

**middleware**ファイルは、リクエストが完了する前にコードを実行するために使用されます。その後、受信したリクエストに基づいて、書き換え、リダイレクト、リクエストまたはレスポンスヘッダーの変更、または直接レスポンスすることで、レスポンスを変更できます。

Middlewareは、ルートがレンダリングされる前に実行されます。これは、カスタムサーバー側のロジックを実装するのに特に役立ちます（認証、ログ、リダイレクトの処理など）。

## 規約

プロジェクトのルートに`middleware.ts`（または`.js`）ファイルを使用して、Middlewareを定義します。たとえば、`app`または`pages`と同じレベル、または該当する場合は`src`内に配置します。

## 例

```ts title="middleware.ts"
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

## マッチング パス

Middlewareは、プロジェクト内の**すべてのルート**に対して呼び出されます。実行順序は次のとおりです。

1. `next.config.js`の`headers`
2. `next.config.js`の`redirects`
3. Middleware（`rewrites`、`redirects`など）
4. `next.config.js`の`beforeFiles`（`rewrites`）
5. ファイルシステムルート（`public/`、`_next/static/`、`pages/`、`app/`など）
6. `next.config.js`の`afterFiles`（`rewrites`）
7. 動的ルート（`/blog/[slug]`）
8. `next.config.js`の`fallback`（`rewrites`）

Middlewareが実行されるパスを定義するには、次の2つの方法があります。

1. [カスタムマッチャー設定](#matcher)
2. [条件文](#条件文)

### matcher

`matcher`を使用すると、Middlewareを特定のパスで実行するようにフィルタリングできます。

```js title="middleware.js"
export const config = {
  matcher: '/about/:path*',
}
```

配列構文を使用して、単一のパスまたは複数のパスをマッチングできます。

```js title="middleware.js"
export const config = {
  matcher: ['/about/:path*', '/dashboard/:path*'],
}
```

`matcher`設定は、完全な正規表現を許可するため、否定的な先読みや文字マッチングなどのマッチングがサポートされています。特定のパスを除くすべてのパスをマッチさせるための否定的な先読みの例をここで見ることができます。

```js title="middleware.js"
export const config = {
  matcher: [
    /*
     * 次のものを除くすべてのリクエストパスをマッチング:
     * - api（APIルート）
     * - _next/static（静的ファイル）
     * - _next/image（画像最適化ファイル）
     * - favicon.ico、sitemap.xml、robots.txt（メタデータファイル）
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

また、`missing`または`has`配列、またはその両方の組み合わせを使用して、特定のリクエストに対してMiddlewareをバイパスすることもできます。

```js title="middleware.js"
export const config = {
  matcher: [
    /*
     * 次のものを除くすべてのリクエストパスをマッチング:
     * - api（APIルート）
     * - _next/static（静的ファイル）
     * - _next/image（画像最適化ファイル）
     * - favicon.ico、sitemap.xml、robots.txt（メタデータファイル）
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

> **知っておくべきこと**: `matcher`の値は、ビルド時に静的に分析できるように定数である必要があります。変数などの動的な値は無視されます。

設定されたmatcher:

1. `/`で始まる必要があります
2. 名前付きパラメータを含めることができます: `/about/:path`は`/about/a`と`/about/b`にマッチしますが、`/about/a/c`にはマッチしません
3. 名前付きパラメータ（`:`で始まる）に修飾子を付けることができます: `/about/:path*`は、`*`が0個以上であるため、`/about/a/b/c`にマッチします。`?`は0または1、`+`は1以上です
4. 括弧で囲まれた正規表現を使用できます: `/about/(.*)`は`/about/:path*`と同じです

詳細については、[path-to-regexp](https://github.com/pillarjs/path-to-regexp#path-to-regexp-1)のドキュメントを参照してください。

> **知っておくべきこと**: 下位互換性のため、Next.jsは常に`/public`を`/public/index`として扱います。したがって、`/public/:path`のmatcherはマッチします。

### 条件文

```ts title="middleware.ts"
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.rewrite(new URL('/dashboard/user', request.url))
  }
}
```

## NextResponse

`NextResponse` APIを使用すると、次のことができます。

- 受信リクエストを別のURLに`redirect`する
- 特定のURLを表示することでレスポンスを`rewrite`する
- APIルート、`getServerSideProps`、および`rewrite`の宛先のリクエストヘッダーを設定する
- レスポンスCookieを設定する
- レスポンスヘッダーを設定する

Middlewareからレスポンスを生成するには、次のことができます。

1. レスポンスを生成するルート（[Page](/docs/app/api-reference/file-conventions/page)または[Route Handler](/docs/app/building-your-application/routing/route-handlers)）に`rewrite`する
2. `NextResponse`を直接返す。[レスポンスの生成](#レスポンスの生成)を参照してください

## Cookieの使用

Cookieは通常のヘッダーです。`Request`では、`Cookie`ヘッダーに格納されます。`Response`では、`Set-Cookie`ヘッダーに格納されます。Next.jsは、`NextRequest`と`NextResponse`の`cookies`拡張機能を介してこれらのCookieにアクセスして操作する便利な方法を提供します。

1. 受信リクエストの場合、`cookies`には次のメソッドがあります: `get`、`getAll`、`set`、および`delete` cookies。`has`でCookieの存在を確認したり、`clear`ですべてのCookieを削除したりできます。
2. 送信レスポンスの場合、`cookies`には次のメソッドがあります: `get`、`getAll`、`set`、および`delete`。

```ts title="middleware.ts"
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 受信リクエストに "Cookie:nextjs=fast" ヘッダーがあると仮定します
  // `RequestCookies` APIを使用してリクエストからCookieを取得します
  let cookie = request.cookies.get('nextjs')
  console.log(cookie) // => { name: 'nextjs', value: 'fast', Path: '/' }
  const allCookies = request.cookies.getAll()
  console.log(allCookies) // => [{ name: 'nextjs', value: 'fast' }]

  request.cookies.has('nextjs') // => true
  request.cookies.delete('nextjs')
  request.cookies.has('nextjs') // => false

  // `ResponseCookies` APIを使用してレスポンスにCookieを設定します
  const response = NextResponse.next()
  response.cookies.set('vercel', 'fast')
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  })
  cookie = response.cookies.get('vercel')
  console.log(cookie) // => { name: 'vercel', value: 'fast', Path: '/' }
  // 送信レスポンスには `Set-Cookie:vercel=fast;path=/` ヘッダーがあります。

  return response
}
```

## ヘッダーの設定

`NextResponse` APIを使用して、リクエストヘッダーとレスポンスヘッダーを設定できます（リクエストヘッダーの設定は、Next.js v13.0.0以降で使用できます）。

```ts title="middleware.ts"
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // リクエストヘッダーをクローンし、新しいヘッダー `x-hello-from-middleware1`を設定します
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-hello-from-middleware1', 'hello')

  // NextResponse.rewriteでリクエストヘッダーを設定することもできます
  const response = NextResponse.next({
    request: {
      // 新しいリクエストヘッダー
      headers: requestHeaders,
    },
  })

  // 新しいレスポンスヘッダー `x-hello-from-middleware2`を設定します
  response.headers.set('x-hello-from-middleware2', 'hello')
  return response
}
```

> **知っておくべきこと**: バックエンドWebサーバーの設定によっては、[大きなヘッダーを設定すると431 Request Header Fields Too Largeエラーが発生する](https://vercel.com/docs/concepts/limits/overview#response-headers-size-limit)可能性があるため、避けてください。

## レスポンスの生成

Middlewareから直接`Response`または`NextResponse`インスタンスを返すことで、レスポンスできます。（これは、[Next.js v13.1.0](https://nextjs.org/blog/next-13-1#nextjs-advanced-middleware)以降で使用できます）

```ts title="middleware.ts"
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@lib/auth'

// Middlewareを`/api/`で始まるパスに制限します
export const config = {
  matcher: '/api/:function*',
}

export function middleware(request: NextRequest) {
  // リクエストをチェックするための認証関数を呼び出します
  if (!isAuthenticated(request)) {
    // エラーメッセージを示すJSONで応答します
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

### `waitUntil`と`NextFetchEvent`

`NextFetchEvent`オブジェクトは、ネイティブの[`FetchEvent`](https://developer.mozilla.org/docs/Web/API/FetchEvent)オブジェクトを拡張し、[`waitUntil()`](https://developer.mozilla.org/docs/Web/API/ExtendableEvent/waitUntil)メソッドを含みます。

`waitUntil()`メソッドは、Promiseを引数として受け取り、Promiseが解決されるまでMiddlewareの存続期間を延長します。これは、バックグラウンドで作業を実行するのに役立ちます。

```ts title="middleware.ts"
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'

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

## 高度なMiddlewareフラグ

Next.js `v13.1`では、高度なユースケースを処理するために、Middlewareに2つの追加フラグ、`skipMiddlewareUrlNormalize`と`skipTrailingSlashRedirect`が導入されました。

`skipTrailingSlashRedirect`は、末尾のスラッシュを追加または削除するためのNext.jsのデフォルトのリダイレクトを無効にし、Middleware内でカスタム処理を可能にし、一部のパスでは末尾のスラッシュを維持し、他のパスでは維持しないことを可能にします。これにより、段階的な移行を容易にすることができます。

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

  // 末尾のスラッシュ処理を適用します
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

`skipMiddlewareUrlNormalize`は、Next.jsが直接訪問とクライアント遷移を同じに扱うために行うURL正規化を無効にすることを可能にします。元のURLを使用した完全な制御が必要な高度なケースがいくつかあります。

```js title="next.config.js"
module.exports = {
  skipMiddlewareUrlNormalize: true,
}
```

```js title="middleware.js"
export default async function middleware(req) {
  const { pathname } = req.nextUrl

  // GETリクエスト
  console.log(pathname)
  // with /about が渡される場合、`pathname`は `/about`になります
  // without the flag は `/about`に正規化されます
}
```

## ランタイム

Middlewareは現在、[Edgeランタイム](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)のみをサポートしています。Node.jsランタイムは使用できません。

## バージョン履歴

| バージョン | 変更内容                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `v13.1.0`  | 高度なMiddlewareフラグが追加されました                                                             |
| `v13.0.0`  | Middlewareはリクエストヘッダー、レスポンスヘッダーを変更し、レスポンスを送信できます             |
| `v12.2.0`  | Middlewareが安定しました。[アップグレードガイド](/docs/messages/middleware-upgrade-guide)を参照してください |
| `v12.0.9`  | EdgeランタイムでAbsolute URLが強制されます（[PR](https://github.com/vercel/next.js/pull/33410)）  |
| `v12.0.0`  | Middleware（ベータ）が追加されました                                                               |
