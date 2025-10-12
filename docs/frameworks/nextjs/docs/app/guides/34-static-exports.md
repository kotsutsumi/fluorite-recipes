# Static Exports（静的エクスポート）

Next.jsを使用すると、静的サイトまたはシングルページアプリケーション（SPA）として起動し、その後オプションでサーバーを必要とする機能を使用するようにアップグレードできます。

`next build`を実行すると、Next.jsはルートごとにHTMLファイルを生成します。厳密なSPAを個別のHTMLファイルに分割することで、Next.jsはクライアント側で不要なJavaScriptコードの読み込みを回避でき、バンドルサイズを削減してページの読み込みを高速化できます。

Next.jsはこの静的エクスポートをサポートしているため、HTMLとCSSとJavaScriptの静的アセットを提供できる任意のWebサーバーにデプロイしてホスティングできます。

## 設定

静的エクスポートを有効にするには、`next.config.js`で出力モードを変更します：

```javascript filename="next.config.js"
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',

  // オプション: リンクを `/me` -> `/me/` に変更し、`/me.html` -> `/me/index.html` を出力
  // trailingSlash: true,

  // オプション: 自動的な `/me` -> `/me/` の防止、代わりに `href` を保持
  // skipTrailingSlashRedirect: true,

  // オプション: 出力ディレクトリを `out` -> `dist` に変更
  // distDir: 'dist',
}

module.exports = nextConfig
```

`next build`を実行すると、Next.jsは`out`フォルダを生成し、アプリケーション用のHTMLとCSSとJavaScriptのアセットを含みます。

## サポートされている機能

Next.jsのコア機能の大部分が静的エクスポートをサポートしています：

### Server Components（サーバーコンポーネント）

静的エクスポートを生成するために`next build`を実行すると、`app`ディレクトリ内で使用されているServer Componentsは、従来の静的サイト生成と同様に、ビルド中に実行されます。

結果のコンポーネントは、初期ページ読み込み用の静的HTMLと、ルート間のクライアントナビゲーション用の静的ペイロードにレンダリングされます。静的エクスポートを使用する場合、[動的サーバー関数](#サポートされていない機能)を使用しない限り、Server Componentsに変更は必要ありません。

```tsx filename="app/page.tsx" switcher
export default async function Page() {
  // このfetchはサーバー側で `next build` 中に実行されます
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return <main>...</main>
}
```

```jsx filename="app/page.js" switcher
export default async function Page() {
  // このfetchはサーバー側で `next build` 中に実行されます
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()

  return <main>...</main>
}
```

### Client Components（クライアントコンポーネント）

クライアント側でデータフェッチを実行したい場合は、[SWR](https://github.com/vercel/swr)を使用してリクエストをメモ化するクライアントコンポーネントを使用できます。

```tsx filename="app/other/page.tsx" switcher
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, error } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/1`,
    fetcher
  )
  if (error) return 'Failed to load'
  if (!data) return 'Loading...'

  return data.title
}
```

```jsx filename="app/other/page.js" switcher
'use client'

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Page() {
  const { data, error } = useSWR(
    `https://jsonplaceholder.typicode.com/posts/1`,
    fetcher
  )
  if (error) return 'Failed to load'
  if (!data) return 'Loading...'

  return data.title
}
```

ルート遷移はクライアント側で行われるため、これは従来のSPAのように動作します。例えば、次のインデックスルートでは、クライアント上で異なる投稿に移動できます：

```tsx filename="app/page.tsx" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <h1>Index Page</h1>
      <hr />
      <ul>
        <li>
          <Link href="/post/1">Post 1</Link>
        </li>
        <li>
          <Link href="/post/2">Post 2</Link>
        </li>
      </ul>
    </>
  )
}
```

```jsx filename="app/page.js" switcher
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <h1>Index Page</h1>
      <hr />
      <ul>
        <li>
          <Link href="/post/1">Post 1</Link>
        </li>
        <li>
          <Link href="/post/2">Post 2</Link>
        </li>
      </ul>
    </>
  )
}
```

### Image Optimization（画像最適化）

`next/image`による[画像最適化](https://nextjs.org/docs/app/building-your-application/optimizing/images)は、`next.config.js`でカスタム画像ローダーを定義することで、静的エクスポートで使用できます。例えば、Cloudinaryなどのサービスで画像を最適化できます：

```javascript filename="next.config.js"
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  images: {
    loader: 'custom',
    loaderFile: './my-loader.ts',
  },
}

module.exports = nextConfig
```

このカスタムローダーは、リモートソースから画像を取得する方法を定義します。例えば、以下のローダーはCloudinaryのURLを構築します：

```typescript filename="my-loader.ts" switcher
export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${src}`
}
```

```javascript filename="my-loader.js" switcher
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${src}`
}
```

その後、アプリケーションで`next/image`を使用でき、Cloudinaryで画像への相対パスを定義できます：

```tsx filename="app/page.tsx" switcher
import Image from 'next/image'

export default function Page() {
  return <Image alt="turtle" src="/turtle.jpg" width={300} height={300} />
}
```

```jsx filename="app/page.js" switcher
import Image from 'next/image'

export default function Page() {
  return <Image alt="turtle" src="/turtle.jpg" width={300} height={300} />
}
```

### Route Handlers（ルートハンドラー）

Route Handlersは、`next build`を実行するときに静的レスポンスをレンダリングします。`GET` HTTPメソッドのみがサポートされています。これは、キャッシュまたはキャッシュされていないデータから静的なHTMLファイル、JSONファイル、TXTファイル、またはその他のファイルを生成するために使用できます。例：

```ts filename="app/data.json/route.ts" switcher
export async function GET() {
  return Response.json({ name: 'Lee' })
}
```

```js filename="app/data.json/route.js" switcher
export async function GET() {
  return Response.json({ name: 'Lee' })
}
```

上記のファイル`app/data.json/route.ts`は、`next build`中に静的ファイルにレンダリングされ、`{ name: 'Lee' }`を含む`data.json`を生成します。

受信リクエストから動的な値を読み取る必要がある場合は、静的エクスポートを使用できません。

### Browser APIs（ブラウザAPI）

クライアントコンポーネントは、`next build`中にHTMLにプリレンダリングされます。`window`、`localStorage`、`navigator`などの[Web API](https://developer.mozilla.org/docs/Web/API)はサーバー上では利用できないため、ブラウザで実行されているときにのみ、これらのAPIに安全にアクセスする必要があります。例：

```jsx
'use client'

import { useEffect } from 'react'

export default function ClientComponent() {
  useEffect(() => {
    // これで `window` にアクセスできます
    console.log(window.innerHeight)
  }, [])

  return <div>...</div>
}
```

## サポートされていない機能

Node.jsサーバーを必要とする機能、またはビルドプロセス中に計算できない動的ロジックは**サポートされていません**：

- `dynamicParams: true`を使用した[動的ルート](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- `generateStaticParams()`を使用しない[動的ルート](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- リクエストに依存する[Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [Rewrites](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)
- [Redirects](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)
- [Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Incremental Static Regeneration](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- デフォルトの`loader`を使用した[Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Draft Mode](https://nextjs.org/docs/app/building-your-application/configuring/draft-mode)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

これらの機能のいずれかを`next dev`で使用しようとすると、ルートレイアウトで[`dynamic`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic)オプションを`error`に設定するのと同様に、エラーが発生します。

```javascript
export const dynamic = 'error'
```

## デプロイ

静的エクスポートを使用すると、Next.jsはHTMLとCSSとJavaScriptの静的アセットを提供できる任意のWebサーバーにデプロイしてホスティングできます。

`next build`を実行すると、Next.jsは静的エクスポートを`out`フォルダに生成します。例えば、次のルートがあるとします：

- `/`
- `/blog/[id]`

`next build`を実行すると、Next.jsは次のファイルを生成します：

- `/out/index.html`
- `/out/404.html`
- `/out/blog/post-1.html`
- `/out/blog/post-2.html`

Nginxなどの静的ホストを使用している場合、受信リクエストから正しいファイルへのリライトを設定できます：

```nginx filename="nginx.conf"
server {
  listen 80;
  server_name acme.com;

  root /var/www/out;

  location / {
      try_files $uri $uri.html $uri/ =404;
  }

  # `trailingSlash: false` の場合に必要
  # `trailingSlash: true` の場合は省略可能
  location /blog/ {
      rewrite ^/blog/(.*)$ /blog/$1.html break;
  }

  error_page 404 /404.html;
  location = /404.html {
      internal;
  }
}
```

## バージョン履歴

| バージョン | 変更内容 |
| --------- | -------- |
| `v14.0.0` | `next export`が削除され、`output: 'export'`に置き換えられました |
| `v13.4.0` | App Router（安定版）が静的エクスポートのサポートを追加しました（Server ComponentsとRoute Handlersを含む） |
| `v13.3.0` | `next export`は非推奨となり、`output: 'export'`に置き換えられました |

## 例

### 静的エクスポートの完全な例

以下は、静的エクスポートを使用したNext.jsアプリケーションの完全な例です：

```typescript filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './image-loader.ts',
  },
}

export default nextConfig
```

```javascript filename="next.config.js" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
}

module.exports = nextConfig
```

```typescript filename="image-loader.ts" switcher
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

```javascript filename="image-loader.js" switcher
export default function imageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

```tsx filename="app/page.tsx" switcher
import Image from 'next/image'

export default function Page() {
  return (
    <main>
      <h1>My Homepage</h1>
      <Image
        src="/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </main>
  )
}
```

```jsx filename="app/page.js" switcher
import Image from 'next/image'

export default function Page() {
  return (
    <main>
      <h1>My Homepage</h1>
      <Image
        src="/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </main>
  )
}
```

```tsx filename="app/blog/[id]/page.tsx" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return posts.map((post: { id: string }) => ({
    id: post.id,
  }))
}

export default async function Post({ params }: { params: { id: string } }) {
  const { id } = await params
  const post = await fetch(`https://api.example.com/posts/${id}`).then((res) =>
    res.json()
  )

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

```jsx filename="app/blog/[id]/page.js" switcher
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return posts.map((post) => ({
    id: post.id,
  }))
}

export default async function Post({ params }) {
  const { id } = await params
  const post = await fetch(`https://api.example.com/posts/${id}`).then((res) =>
    res.json()
  )

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

## まとめ

Next.jsの静的エクスポート機能を使用すると、静的サイトやSPAを簡単に生成できます。自動コード分割、画像最適化、ルートプリフェッチングなどの最適化機能を活用しながら、任意の静的ホスティングサービスにデプロイできます。必要に応じて、後からサーバー機能を段階的に追加することも可能です。
