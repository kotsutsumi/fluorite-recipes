# generateSitemaps

`generateSitemaps` 関数を使用して、アプリケーション用に複数のサイトマップを生成できます。

## 戻り値

`generateSitemaps` は、`id` プロパティを持つオブジェクトの配列を返します。

## URL

生成されたサイトマップは、`/.../sitemap/[id].xml` で利用可能です。例えば、`/product/sitemap/1.xml` のようになります。

## 例

サイトマップを分割するには、サイトマップ `id` を持つオブジェクトの配列を返します。その後、`id` を使用して一意のサイトマップを生成します。

```typescript
// app/product/sitemap.ts
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // 製品の総数を取得し、必要なサイトマップの数を計算
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  // Googleの制限は1サイトマップあたり50,000 URL
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

### データベースからの動的生成

```typescript
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // データベースから製品の総数を取得
  const totalProducts = await getTotalProductCount()
  const sitemapsNeeded = Math.ceil(totalProducts / 50000)

  return Array.from({ length: sitemapsNeeded }, (_, i) => ({
    id: i,
  }))
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(start, end)

  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))
}
```

## リファレンス

### パラメーター

`generateSitemaps` 関数は、以下のパラメーターを受け取ります：

- パラメーターなし

### 戻り値

`generateSitemaps` は、次のプロパティを持つオブジェクトの配列を返す必要があります：

- `id` (string | number): サイトマップの一意の識別子

## 注意点

- `generateSitemaps` は、サイトマップファイル（`sitemap.ts`、`sitemap.xml`）と同じディレクトリに配置する必要があります。
- 各サイトマップには最大50,000個のURLを含めることができます。
- `generateSitemaps` は、ビルド時とリクエスト時の両方で実行されます。

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v15.0.0` | `generateSitemaps` が開発環境と本番環境の両方で動作するようになりました |
| `v13.4.5` | `generateSitemaps` が導入されました |
