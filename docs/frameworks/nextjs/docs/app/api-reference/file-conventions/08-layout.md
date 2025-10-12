# layout.js

**layout**ファイルは、複数のルート間で共有されるUIを定義するために使用されます。

## 説明

レイアウトは、ルートセグメント全体をラップし、子ページやその他のレイアウトをラップします。レイアウトコンポーネントは、`children` propを受け取り、それをレンダリングする必要があります。

### ルートレイアウト

`app`ディレクトリのルートには、**ルートレイアウト**が必要です。これは、アプリケーション全体に適用されるレイアウトで、`<html>`タグと`<body>`タグを定義する必要があります。

```tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
```

### ネストされたレイアウト

フォルダー内で定義されたレイアウト（例: `app/dashboard/layout.js`）は、特定のルートセグメント（例: `acme.com/dashboard`）に適用され、それらのセグメントがアクティブなときにレンダリングされます。

デフォルトでは、ファイル階層内のレイアウトは**ネスト**されており、子レイアウトを`children` propでラップします。

```tsx title="app/dashboard/layout.tsx"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

## Props

### `children`（必須）

レイアウトコンポーネントは、`children` propを受け取り、使用する必要があります。レンダリング中、`children`には、レイアウトがラップしているルートセグメントが入力されます。これらは主に子レイアウト（存在する場合）またはページのコンポーネントになりますが、該当する場合は`loading`や`error`などの他の特殊ファイルである可能性もあります。

### `params`（オプション）

ルートセグメントから、そのレイアウトまでの動的ルートパラメータを含むオブジェクト。

```tsx title="app/dashboard/[team]/layout.tsx"
export default async function Layout({
  params,
}: {
  params: Promise<{ team: string }>
}) {
  const team = (await params).team
  return <h1>チーム: {team}</h1>
}
```

| 例                                   | URL                | `params`                        |
| ------------------------------------ | ------------------ | ------------------------------- |
| `app/dashboard/[team]/layout.js`     | `/dashboard/1`     | `Promise<{ team: '1' }>`        |
| `app/shop/[tag]/[item]/layout.js`    | `/shop/1/2`        | `Promise<{ tag: '1', item: '2' }>` |
| `app/blog/[...slug]/layout.js`       | `/blog/1/2`        | `Promise<{ slug: ['1', '2'] }>` |

例:

```tsx title="app/shop/[tag]/[item]/layout.tsx"
export default async function ShopLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ tag: string; item: string }>
}) {
  const { tag, item } = await params
  // URLは `/shop/shoes/nike-air-max-97`
  // `params`は `Promise<{ tag: 'shoes', item: 'nike-air-max-97' }>`
  return (
    <section>
      {children}
      <p>タグ: {tag}</p>
      <p>商品: {item}</p>
    </section>
  )
}
```

## 知っておくべきこと

### レイアウトはリクエストオブジェクトにアクセスできません

レイアウトはサーバーコンポーネントですが、受信するリクエストオブジェクトにアクセスできません。動的に`headers`や`cookies`のような値にアクセスする必要がある場合は、ページまたはサーバーアクションで行う必要があります。

レイアウトで、パス名やsearchParamsのようなリクエストベースの情報にアクセスする必要がある場合は、クライアントコンポーネントに変換し、`usePathname()`や`useSearchParams()`のようなクライアント側のフックを使用できます。

### ルートレイアウトについて

- `app`ディレクトリには、ルートレイアウトが含まれている**必要があります**
- ルートレイアウトは、Next.jsが自動的に作成しないため、`<html>`タグと`<body>`タグを定義する**必要があります**
- ルートレイアウトは、`<head>` HTML要素（例: `<title>`要素）を手動で管理することはできません。代わりに、ストリーミングや重複した`<head>`要素の排除などの高度な要件を自動的に処理する[Metadata API](/docs/app/api-reference/functions/generate-metadata)を使用する必要があります
- [ルートグループ](/docs/app/building-your-application/routing/route-groups)を使用して、複数のルートレイアウトを作成できます
  - **複数のルートレイアウト間を移動**すると、**完全なページ読み込み**が発生します（クライアント側のナビゲーションとは対照的に）。たとえば、`app/(shop)/layout.js`を使用する`/cart`から、`app/(marketing)/layout.js`を使用する`/blog`に移動すると、完全なページ読み込みが発生します。これは、複数のルートレイアウトに**のみ**適用されます

### レイアウトは再レンダリングされません

ナビゲーション中、レイアウトは状態を保持し、インタラクティブな状態を維持し、再レンダリングしません。これは、React コンポーネントツリーの一部のみが更新されることを意味します。

ルートセグメント間を移動すると（例: 以下の`/dashboard/settings`から`/dashboard/analytics`へ）、下のページコンポーネントはサーバーでフェッチおよびレンダリングされ、両方のルートで共有されるレイアウトコンポーネントの状態は保持されます。

```tsx title="app/dashboard/layout.tsx"
'use client'

import { useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>カウント: {count}</button>
      {children}
    </div>
  )
}
```

`/dashboard/settings`から`/dashboard/analytics`に移動しても、`DashboardLayout`の`count`状態は保持されます。

## バージョン履歴

| バージョン | 変更内容           |
| ---------- | ------------------ |
| `v13.0.0`  | `layout`が導入されました |
