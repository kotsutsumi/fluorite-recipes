# 動的ルート（Dynamic Routes）

動的ルートセグメントを使用すると、動的にプログラムで生成されたセグメントを持つルートを作成できます。

## 規約

動的セグメントは、フォルダ名を角括弧で囲むことで作成されます。例：`[slug]`、`[id]`など。

動的セグメントは、`page`、`layout`、`route`、`generateMetadata`関数の`params`プロップとして渡されます。

## 基本的な動的セグメント

### 例

```typescript
// app/blog/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

| ルート | URL例 | `params` |
|--------|--------|----------|
| `app/blog/[slug]/page.js` | `/blog/a` | `Promise<{ slug: 'a' }>` |
| `app/blog/[slug]/page.js` | `/blog/b` | `Promise<{ slug: 'b' }>` |
| `app/blog/[slug]/page.js` | `/blog/c` | `Promise<{ slug: 'c' }>` |

## キャッチオールセグメント

動的セグメントは、括弧内に省略記号`[...folderName]`を追加することで、後続のすべてのセグメントをキャッチするように拡張できます。

例えば、`app/shop/[...slug]/page.js`は`/shop/clothes`にマッチしますが、`/shop/clothes/tops`、`/shop/clothes/tops/t-shirts`などにもマッチします。

### 例

```typescript
// app/shop/[...slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  return <div>Shop: {slug.join('/')}</div>
}
```

| ルート | URL例 | `params` |
|--------|--------|----------|
| `app/shop/[...slug]/page.js` | `/shop/a` | `Promise<{ slug: ['a'] }>` |
| `app/shop/[...slug]/page.js` | `/shop/a/b` | `Promise<{ slug: ['a', 'b'] }>` |
| `app/shop/[...slug]/page.js` | `/shop/a/b/c` | `Promise<{ slug: ['a', 'b', 'c'] }>` |

## オプショナルキャッチオールセグメント

キャッチオールセグメントは、パラメータを二重角括弧`[[...folderName]]`で囲むことでオプショナルにできます。

例えば、`app/shop/[[...slug]]/page.js`は、`/shop/clothes/tops/t-shirts`に加えて`/shop`にもマッチします。

キャッチオールセグメントとオプショナルキャッチオールセグメントの違いは、オプショナルの場合、パラメータなしのルート（上記の例では`/shop`）もマッチすることです。

### 例

```typescript
// app/shop/[[...slug]]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  return <div>Shop: {slug ? slug.join('/') : 'Home'}</div>
}
```

| ルート | URL例 | `params` |
|--------|--------|----------|
| `app/shop/[[...slug]]/page.js` | `/shop` | `Promise<{}>` |
| `app/shop/[[...slug]]/page.js` | `/shop/a` | `Promise<{ slug: ['a'] }>` |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b` | `Promise<{ slug: ['a', 'b'] }>` |
| `app/shop/[[...slug]]/page.js` | `/shop/a/b/c` | `Promise<{ slug: ['a', 'b', 'c'] }>` |

## TypeScriptのサポート

TypeScriptを使用する場合、設定されたルートセグメントに応じて`params`の型を追加できます。

```typescript
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <h1>My Page</h1>
}
```

| ルート | `params`の型定義 |
|--------|------------------|
| `app/blog/[slug]/page.js` | `{ slug: string }` |
| `app/shop/[...slug]/page.js` | `{ slug: string[] }` |
| `app/shop/[[...slug]]/page.js` | `{ slug?: string[] }` |
| `app/[categoryId]/[itemId]/page.js` | `{ categoryId: string, itemId: string }` |

## 静的パラメータの生成

`generateStaticParams`関数を使用して、リクエスト時にオンデマンドで生成するのではなく、ビルド時に静的に[ルートを生成](/docs/frameworks/nextjs/docs/app/building-your-application/rendering/static-and-dynamic#static-rendering-default)できます。

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

`generateStaticParams`関数の主な利点は、データのスマートな取得です。`generateStaticParams`関数内で`fetch`リクエストを使用してコンテンツが取得される場合、リクエストは自動的に[メモ化](/docs/frameworks/nextjs/docs/app/building-your-application/caching#request-memoization)されます。つまり、複数の`generateStaticParams`、レイアウト、ページにわたって同じ引数を持つ`fetch`リクエストは1回だけ実行され、ビルド時間が短縮されます。

## バージョン履歴

| バージョン | 変更内容 |
|-----------|----------|
| `v15.0.0` | `params`がPromiseになりました |
| `v13.0.0` | `generateStaticParams`が導入されました |

## ベストプラクティス

1. **パラメータの検証**: 実行時の検証を追加して、特定のパラメータ制約を処理します
2. **静的生成**: 可能な限り`generateStaticParams`を使用してパフォーマンスを向上させます
3. **型安全性**: TypeScriptを使用してパラメータの型安全性を確保します
4. **SEO対策**: 動的ルートでも適切なメタデータを設定します

## 関連機能

- [generateStaticParams](/docs/frameworks/nextjs/docs/app/api-reference/functions/generate-static-params)
- [ルーティング基礎](/docs/frameworks/nextjs/docs/app/building-your-application/routing)
- [リンクとナビゲーション](/docs/frameworks/nextjs/docs/app/building-your-application/routing/linking-and-navigating)
