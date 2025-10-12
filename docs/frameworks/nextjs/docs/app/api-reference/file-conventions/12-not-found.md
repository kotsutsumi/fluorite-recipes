# not-found.js

**not-found**ファイルは、ルートセグメント内で[`notFound()`](/docs/app/api-reference/functions/not-found)関数がスローされたときにUIをレンダリングするために使用されます。

## 説明

`not-found.js`ファイルを使用すると、ルートセグメント内でカスタムUIを提供できます。これは、`notFound()`関数がスローされたとき、またはURLがどのルートセグメントにも一致しない場合に表示されます。

```tsx title="app/not-found.tsx"
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>見つかりません</h2>
      <p>リクエストされたリソースが見つかりませんでした</p>
      <Link href="/">ホームに戻る</Link>
    </div>
  )
}
```

## Props

`not-found.js`コンポーネントは、propsを受け取りません。

## データフェッチ

デフォルトでは、`not-found`はサーバーコンポーネントです。これを`async`としてマークして、データをフェッチして表示できます。

```tsx title="app/not-found.tsx"
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  const headersList = await headers()
  const domain = headersList.get('host')
  return (
    <div>
      <h2>見つかりません: {domain}</h2>
      <Link href="/">ホームに戻る</Link>
    </div>
  )
}
```

## 知っておくべきこと

### ストリーミング中の`not-found`

`not-found`コンポーネントがストリーミング中にスローされた場合、コンポーネントは`200` HTTPステータスコードを返します。ストリーミングされていない場合は、`404` HTTPステータスコードを返します。

## グローバル not-found

プロジェクトのルート`app`ディレクトリに`app/not-found.js`ファイルを追加することで、アプリケーション全体のグローバルな404ページを定義できます。

```tsx title="app/not-found.tsx"
import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <h2>見つかりません</h2>
        <p>リクエストされたページが見つかりませんでした</p>
        <Link href="/">ホームに戻る</Link>
      </body>
    </html>
  )
}
```

## global-not-found（実験的）

アプリケーション全体のルートに一致しないURLに対して、`app/global-not-found.js`ファイルを使用してカスタム404ページを定義できます。

### 設定

この機能を有効にするには、`next.config.ts`で実験的な`missingSuspenseWithCSRBailout`フラグを有効にします。

```ts title="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

export default nextConfig
```

### 使用方法

```tsx title="app/global-not-found.tsx"
import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <html>
      <body>
        <h2>見つかりません</h2>
        <p>リクエストされたページが見つかりませんでした</p>
        <Link href="/">ホームに戻る</Link>
      </body>
    </html>
  )
}
```

## 知っておくべきこと

### `global-not-found`について

- `global-not-found`は通常のレンダリングプロセスをバイパスします。つまり、ルートレイアウトやテンプレートは使用されません
- `global-not-found`は完全なHTMLドキュメントを返す必要があります（`<html>`、`<body>`タグを含む）
- `global-not-found`は、一致しないURLに対してのみトリガーされます。`notFound()`関数を呼び出しても、`global-not-found`はトリガーされません

## not-foundとglobal-not-foundの違い

| 特徴              | `not-found.js`                                   | `global-not-found.js`（実験的）                  |
| ----------------- | ------------------------------------------------ | ------------------------------------------------ |
| トリガー          | `notFound()`関数が呼び出されたとき               | URLがどのルートにも一致しない場合                |
| スコープ          | 特定のルートセグメント                           | アプリケーション全体                             |
| レンダリング      | ルートレイアウト内でレンダリング                 | 独立してレンダリング（レイアウトをバイパス）     |
| HTMLドキュメント  | 不要（レイアウトから継承）                       | 必須（`<html>`と`<body>`を含める必要があります） |
| HTTPステータス    | ストリーミング中は200、それ以外は404             | 常に404                                          |

## 例

### 基本的なnot-foundページ

```tsx title="app/blog/not-found.tsx"
import Link from 'next/link'

export default function BlogNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">ブログ記事が見つかりません</h2>
      <p className="mt-4">お探しのブログ記事は存在しないようです</p>
      <Link href="/blog" className="mt-6 text-blue-500 hover:underline">
        ブログ一覧に戻る
      </Link>
    </div>
  )
}
```

### データフェッチを使用したnot-foundページ

```tsx title="app/products/not-found.tsx"
import Link from 'next/link'

async function getSimilarProducts() {
  // 類似商品をフェッチする
  const res = await fetch('https://api.example.com/products/popular')
  return res.json()
}

export default async function ProductNotFound() {
  const similarProducts = await getSimilarProducts()

  return (
    <div>
      <h2>商品が見つかりません</h2>
      <p>お探しの商品は見つかりませんでした</p>

      <h3>おすすめの商品</h3>
      <ul>
        {similarProducts.map((product: any) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>

      <Link href="/">ホームに戻る</Link>
    </div>
  )
}
```

### notFound()関数の使用

```tsx title="app/products/[id]/page.tsx"
import { notFound } from 'next/navigation'

async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`)
  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}
```

## バージョン履歴

| バージョン | 変更内容                            |
| ---------- | ----------------------------------- |
| `v13.3.0`  | ルート`app/not-found`がグローバル一致しない URLを処理するようになりました |
| `v13.0.0`  | `not-found`が導入されました         |
