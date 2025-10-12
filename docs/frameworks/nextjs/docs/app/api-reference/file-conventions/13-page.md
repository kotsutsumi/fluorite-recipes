# page.js

**page**ファイルは、ルート固有のUIです。

## 説明

`page.js`ファイルを追加することで、ルートを公開アクセス可能にできます。

```tsx title="app/blog/[slug]/page.tsx"
export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return <h1>私のページ</h1>
}
```

## Props

### `params`（オプション）

ルートセグメントからそのページまでの[動的ルートパラメータ](/docs/app/building-your-application/routing/dynamic-routes)を含むオブジェクトを解決するPromise。

```tsx title="app/shop/[slug]/page.tsx"
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  return <h1>商品: {slug}</h1>
}
```

| 例                                  | URL         | `params`                           |
| ----------------------------------- | ----------- | ---------------------------------- |
| `app/shop/[slug]/page.js`           | `/shop/1`   | `Promise<{ slug: '1' }>`           |
| `app/shop/[category]/[item]/page.js`| `/shop/1/2` | `Promise<{ category: '1', item: '2' }>` |
| `app/shop/[...slug]/page.js`        | `/shop/1/2` | `Promise<{ slug: ['1', '2'] }>`    |

- `params` propはPromiseであるため、値にアクセスするには`async/await`または[`use`](https://react.dev/reference/react/use) Reactフックを使用する必要があります。
  - バージョン14以前では、`params`は同期propでした。下位互換性を維持するために、Next.js 15でも引き続き同期的にアクセスできますが、この動作は将来廃止される予定です。

### `searchParams`（オプション）

現在のURLの[検索パラメータ](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters)を含むオブジェクトを解決するPromise。例:

```tsx title="app/shop/page.tsx"
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
  return <h1>検索フィルター: {filters}</h1>
}
```

| URL              | `searchParams`                      |
| ---------------- | ----------------------------------- |
| `/shop?a=1`      | `Promise<{ a: '1' }>`               |
| `/shop?a=1&b=2`  | `Promise<{ a: '1', b: '2' }>`       |
| `/shop?a=1&a=2`  | `Promise<{ a: ['1', '2'] }>`        |

- `searchParams` propはPromiseであるため、値にアクセスするには`async/await`または[`use`](https://react.dev/reference/react/use) Reactフックを使用する必要があります。
  - バージョン14以前では、`searchParams`は同期propでした。下位互換性を維持するために、Next.js 15でも引き続き同期的にアクセスできますが、この動作は将来廃止される予定です。
- `searchParams`は、事前に値を知ることができない**動的API**です。これを使用すると、ページはリクエスト時に**動的レンダリング**にオプトインされます。
- `searchParams`は、プレーンなJavaScriptオブジェクトを返します。`URLSearchParams`インスタンスではありません。

## 知っておくべきこと

- `.js`、`.jsx`、または`.tsx`ファイル拡張子を`page`に使用できます
- ページは常にルートサブツリーの[リーフ](/docs/app/building-your-application/routing#terminology)です
- ルートセグメントを公開アクセス可能にするには、`page.js`ファイルが必要です
- ページはデフォルトで[サーバーコンポーネント](/docs/app/building-your-application/rendering/server-components)ですが、[クライアントコンポーネント](/docs/app/building-your-application/rendering/client-components)に設定できます
- ページはデータをフェッチできます。詳細については、[データフェッチ](/docs/app/building-your-application/data-fetching)セクションを参照してください
- 親レイアウトからページにデータを渡すことはできません。ただし、同じデータを複数回フェッチしても、Reactがパフォーマンスに影響を与えずにリクエストを自動的に重複排除するため、同じデータをルート内で複数回フェッチできます

## 例

### 基本的なページ

```tsx title="app/page.tsx"
export default function HomePage() {
  return <h1>ホームページへようこそ</h1>
}
```

### 動的ルートを使用したページ

```tsx title="app/blog/[slug]/page.tsx"
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>ブログ記事: {slug}</h1>
}
```

### SearchParamsを使用したページ

```tsx title="app/products/page.tsx"
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>
}) {
  const { category, sort } = await searchParams

  return (
    <div>
      <h1>商品一覧</h1>
      {category && <p>カテゴリー: {category}</p>}
      {sort && <p>並び順: {sort}</p>}
    </div>
  )
}
```

### データフェッチを使用したページ

```tsx title="app/posts/[id]/page.tsx"
async function getPost(id: string) {
  const res = await fetch(`https://api.example.com/posts/${id}`)
  if (!res.ok) throw new Error('投稿の取得に失敗しました')
  return res.json()
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
```

### クライアントコンポーネントページ

```tsx title="app/counter/page.tsx"
'use client'

import { useState } from 'react'

export default function CounterPage() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>カウンター: {count}</h1>
      <button onClick={() => setCount(count + 1)}>増やす</button>
    </div>
  )
}
```

### 複数の動的セグメントを使用したページ

```tsx title="app/shop/[category]/[product]/page.tsx"
export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { category, product } = await params

  return (
    <div>
      <h1>カテゴリー: {category}</h1>
      <h2>商品: {product}</h2>
    </div>
  )
}
```

### Catch-allセグメントを使用したページ

```tsx title="app/docs/[...slug]/page.tsx"
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const path = slug.join('/')

  return <h1>ドキュメント: {path}</h1>
}
```

## バージョン履歴

| バージョン | 変更内容                                                     |
| ---------- | ------------------------------------------------------------ |
| `v13.0.0`  | `page`が導入されました                                        |
| `v15.0.0`  | `params`と`searchParams`がPromiseになりました。[コードモッド](/docs/app/building-your-application/upgrading/codemods#150)が利用可能です |
