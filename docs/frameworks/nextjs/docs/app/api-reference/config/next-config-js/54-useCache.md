# useCache

> **注意**: この機能は現在canaryチャンネルで利用可能です。変更される可能性がある実験的な機能です。

`useCache`は、`cacheComponents`とは独立して`use cache`ディレクティブを有効にします。

## 設定

`next.config.ts`の`experimental`セクションに追加します：

```typescript filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
}

export default nextConfig
```

## 有効化される機能

`useCache`を有効にすると、以下が使用できるようになります：

- `use cache`ディレクティブ
- `use cache`と共に使用する`cacheLife`関数
- `cacheTag`関数

## `use cache`ディレクティブ

`use cache`ディレクティブは、関数やコンポーネントの出力をキャッシュします：

```typescript
import { unstable_cacheLife as cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('minutes')

  const data = await fetchData()
  return <div>{data}</div>
}
```

## `cacheLife`関数

キャッシュの有効期間を設定します：

```typescript
import { unstable_cacheLife as cacheLife } from 'next/cache'

async function fetchData() {
  'use cache'
  cacheLife('hours')

  const response = await fetch('https://api.example.com/data')
  return response.json()
}
```

### 事前定義されたキャッシュライフ

- `'seconds'`: 数秒間キャッシュ
- `'minutes'`: 数分間キャッシュ
- `'hours'`: 数時間キャッシュ
- `'days'`: 数日間キャッシュ
- `'weeks'`: 数週間キャッシュ
- `'max'`: 可能な限り長くキャッシュ

### カスタムキャッシュライフ

```typescript
import { unstable_cacheLife as cacheLife } from 'next/cache'

async function fetchData() {
  'use cache'
  cacheLife({
    stale: 3600,      // 1時間は「古い」とみなされる
    revalidate: 7200, // 2時間後に再検証
    expire: 86400,    // 1日後に期限切れ
  })

  const response = await fetch('https://api.example.com/data')
  return response.json()
}
```

## `cacheTag`関数

キャッシュをタグ付けして、後で無効化できるようにします：

```typescript
import { unstable_cacheTag as cacheTag } from 'next/cache'

async function fetchData() {
  'use cache'
  cacheTag('data-tag')

  const response = await fetch('https://api.example.com/data')
  return response.json()
}
```

### タグによるキャッシュの無効化

```typescript
import { revalidateTag } from 'next/cache'

export async function POST() {
  // 'data-tag'でタグ付けされたすべてのキャッシュを無効化
  revalidateTag('data-tag')

  return Response.json({ revalidated: true })
}
```

## 使用例

### 基本的な使用

```typescript
import { unstable_cacheLife as cacheLife } from 'next/cache'

async function getUser(id: string) {
  'use cache'
  cacheLife('minutes')

  const user = await db.user.findUnique({ where: { id } })
  return user
}

export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  return <div>こんにちは、{user.name}さん</div>
}
```

### タグを使用した高度なキャッシュ

```typescript
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag
} from 'next/cache'

async function getProducts() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  const products = await db.product.findMany()
  return products
}

// 別のファイルで
import { revalidateTag } from 'next/cache'

export async function createProduct(data: ProductData) {
  const product = await db.product.create({ data })

  // 製品キャッシュを無効化
  revalidateTag('products')

  return product
}
```

## 重要な注意事項

- `useCache`は実験的な機能です
- canaryバージョンのNext.jsへのアップグレードが必要です
- この機能を試して、[GitHub](https://github.com/vercel/next.js/issues)でフィードバックを共有することをお勧めします

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v15.0.0-canary` | `experimental.useCache`が導入されました |

## 関連項目

- [キャッシング](/docs/app/building-your-application/caching)
- [Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
