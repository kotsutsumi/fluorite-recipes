# generateStaticParams

`generateStaticParams`関数は、[動的ルートセグメント](/docs/app/api-reference/file-conventions/dynamic-routes)と組み合わせて、リクエスト時ではなくビルド時に**静的にルートを生成**するために使用できます。

## 使用例

```typescript
// パラメータのリストを返して、[slug]動的セグメントを生成
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// generateStaticParamsが返すパラメータに基づいて、
// 複数のページバージョンを静的に生成
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

## 主な特徴

> **注意点:**
>
> - `dynamicParams`セグメント設定オプションで、生成されていない動的セグメントの挙動を制御できます。
> - 実行時にパスを再検証するには、空の配列を返すか`export const dynamic = 'force-static'`を使用する必要があります。
> - `next dev`中は、ルートに移動すると`generateStaticParams`が呼び出されます。
> - `next build`中は、対応するレイアウトやページが生成される前に実行されます。
> - ISR（増分静的再生成）中は、`generateStaticParams`は再度呼び出されません。

## パラメータの生成方法

### 単一の動的セグメント

```typescript
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

// /product/1、/product/2、/product/3 が生成されます
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // ...
}
```

### 複数の動的セグメント

```typescript
export function generateStaticParams() {
  return [
    { category: 'electronics', product: 'phone' },
    { category: 'electronics', product: 'laptop' },
    { category: 'clothing', product: 'shirt' },
  ]
}

// /shop/electronics/phone、/shop/electronics/laptop、/shop/clothing/shirt が生成されます
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { category, product } = await params
  // ...
}
```

### ネストされた動的セグメント

```typescript
// app/products/[category]/[product]/page.tsx
export async function generateStaticParams() {
  const products = await fetch('https://.../products').then((res) =>
    res.json()
  )

  return products.map((product) => ({
    category: product.category,
    product: product.id,
  }))
}
```

### キャッチオールセグメント

```typescript
// app/blog/[...slug]/page.tsx
export async function generateStaticParams() {
  return [
    { slug: ['a'] },
    { slug: ['a', 'b'] },
    { slug: ['a', 'b', 'c'] },
  ]
}

// /blog/a、/blog/a/b、/blog/a/b/c が生成されます
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  // ...
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v13.0.0` | `generateStaticParams` が導入されました |
