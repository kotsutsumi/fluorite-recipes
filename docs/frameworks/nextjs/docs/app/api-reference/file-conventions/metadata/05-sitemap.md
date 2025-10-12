# sitemap.xml

`sitemap.xml` は、検索エンジンクローラーがサイトをより効率的にインデックスできるようにする特別なファイルです。[Sitemaps XML形式](https://www.sitemaps.org/protocol.html)に従います。

## 静的 sitemap.xml

`app` ディレクトリのルートに静的な `sitemap.xml` ファイルを作成できます。

### 基本的な使い方

```xml
<!-- app/sitemap.xml -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

## 動的 sitemap.xml 生成

`sitemap.js` または `sitemap.ts` ファイルを使用して、プログラマティックにサイトマップを生成できます。

### 基本的な使い方

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

## Sitemapの型定義

```typescript
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
  alternates?: {
    languages?: Record<string, string>
  }
}>
```

## 設定オプション

### url (必須)

ページの完全なURLです:

```typescript
{
  url: 'https://acme.com/about',
}
```

### lastModified

ページが最後に変更された日時:

```typescript
{
  url: 'https://acme.com/about',
  lastModified: new Date(),
}
```

または文字列形式:

```typescript
{
  url: 'https://acme.com/about',
  lastModified: '2023-04-06T15:02:24.021Z',
}
```

### changeFrequency

ページが変更される頻度のヒント:

```typescript
{
  url: 'https://acme.com/about',
  changeFrequency: 'monthly',
}
```

可能な値:
- `'always'`: 常に変更される
- `'hourly'`: 毎時変更される
- `'daily'`: 毎日変更される
- `'weekly'`: 毎週変更される
- `'monthly'`: 毎月変更される
- `'yearly'`: 毎年変更される
- `'never'`: 変更されない(アーカイブURL用)

### priority

このURLの相対的な優先度(0.0〜1.0):

```typescript
{
  url: 'https://acme.com',
  priority: 1, // 最高優先度
}
```

```typescript
{
  url: 'https://acme.com/blog',
  priority: 0.5, // 中程度の優先度
}
```

### alternates

多言語ページの代替バージョン:

```typescript
{
  url: 'https://acme.com',
  alternates: {
    languages: {
      es: 'https://acme.com/es',
      de: 'https://acme.com/de',
    },
  },
}
```

## 実践例

### 静的ページ

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
```

### 動的ページ

データベースやAPIから動的にURLを生成:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 投稿を取得
  const posts = await fetch('https://api.acme.com/posts').then((res) =>
    res.json()
  )

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://acme.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...postEntries,
  ]
}
```

### ブログサイト

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

interface Post {
  slug: string
  updatedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.acme.com'

  // ブログ投稿を取得
  const posts: Post[] = await fetch('https://api.acme.com/posts').then((res) =>
    res.json()
  )

  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogPosts,
  ]
}
```

### ECサイト

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

interface Product {
  id: string
  slug: string
  updatedAt: string
}

interface Category {
  slug: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://shop.acme.com'

  // 商品を取得
  const products: Product[] = await fetch(
    'https://api.acme.com/products'
  ).then((res) => res.json())

  // カテゴリーを取得
  const categories: Category[] = await fetch(
    'https://api.acme.com/categories'
  ).then((res) => res.json())

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productEntries,
    ...categoryEntries,
  ]
}
```

### 多言語サイト

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es',
          de: 'https://acme.com/de',
          fr: 'https://acme.com/fr',
        },
      },
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/about',
          de: 'https://acme.com/de/about',
          fr: 'https://acme.com/fr/about',
        },
      },
    },
  ]
}
```

### 環境に基づいた設定

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://acme.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
```

## 複数のサイトマップ生成

大規模なサイトでは、複数のサイトマップを生成できます。

### generateSitemaps の使用

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  // サイトマップの総数を取得
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  // 各サイトマップのURLを生成
  const start = id * 50000
  const end = start + 50000
  const products = await fetch(
    `https://api.acme.com/products?start=${start}&end=${end}`
  ).then((res) => res.json())

  return products.map((product) => ({
    url: `https://acme.com/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
  }))
}
```

これにより以下のURLが生成されます:
- `/sitemap/0.xml`
- `/sitemap/1.xml`
- `/sitemap/2.xml`
- `/sitemap/3.xml`

### サイトマップインデックス

複数のサイトマップがある場合、Next.jsは自動的にサイトマップインデックスを生成します:

```xml
<!-- app/sitemap.xml -->
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://acme.com/sitemap/0.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://acme.com/sitemap/1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://acme.com/sitemap/2.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://acme.com/sitemap/3.xml</loc>
  </sitemap>
</sitemapindex>
```

## 画像サイトマップ

画像をサイトマップに含めることができます:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com/blog/post-1',
      lastModified: new Date(),
      images: ['https://acme.com/images/post-1-hero.jpg'],
    },
  ]
}
```

注: 画像サイトマップは現在実験的な機能です。

## ビデオサイトマップ

ビデオをサイトマップに含めることができます:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com/videos/video-1',
      lastModified: new Date(),
      videos: [
        {
          title: 'Video Title',
          description: 'Video Description',
          thumbnail_loc: 'https://acme.com/thumbnails/video-1.jpg',
          content_loc: 'https://acme.com/videos/video-1.mp4',
        },
      ],
    },
  ]
}
```

注: ビデオサイトマップは現在実験的な機能です。

## キャッシング

- 静的サイトマップはビルド時に生成されます
- 動的サイトマップはリクエスト時に生成され、キャッシュされます
- `dynamic = 'force-dynamic'` を使用してキャッシュを無効化できます

```typescript
// app/sitemap.ts
export const dynamic = 'force-dynamic'

export default function sitemap() {
  // 常に最新のサイトマップを生成
}
```

## ベストプラクティス

### 1. サイトマップサイズの制限

- 最大50,000 URL/サイトマップ
- 最大50MB/サイトマップ(非圧縮時)
- 大規模サイトでは複数のサイトマップに分割

### 2. 重要なページを含める

すべての重要なページをサイトマップに含めます:

```typescript
const importantPages = [
  '/',
  '/about',
  '/contact',
  '/products',
  '/blog',
]
```

### 3. 最新情報を保つ

`lastModified` を正確に設定します:

```typescript
{
  url: 'https://acme.com/blog/post',
  lastModified: new Date(post.updatedAt),
}
```

### 4. 適切な優先度を設定

ページの重要性に基づいて優先度を設定:

- ホームページ: 1.0
- 主要セクション: 0.8-0.9
- 個別ページ: 0.5-0.7
- アーカイブ: 0.3-0.4

### 5. robots.txt と連携

`robots.txt` にサイトマップのURLを含めます:

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

## 生成される出力

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
</urlset>
```

多言語サイトの場合:

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://acme.com</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://acme.com/es"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://acme.com/de"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
</urlset>
```

## テストとデバッグ

### ローカルでの確認

```bash
curl http://localhost:3000/sitemap.xml
```

### Google Search Consoleでの送信

1. Google Search Consoleにアクセス
2. 「サイトマップ」セクションを開く
3. サイトマップURLを入力: `https://acme.com/sitemap.xml`
4. 送信して処理状況を監視

### 検証ツール

- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- Google Search Console
- Bing Webmaster Tools

## バージョン履歴

- **v13.3.0**: `sitemap.js` と `sitemap.ts` が導入されました
- **v13.4.5**: `changeFrequency` と `priority` 属性が追加されました
- **v13.4.14**: `alternates` サポートが追加されました

## 関連項目

- [robots.txt](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/metadata/04-robots)
- [メタデータAPI](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/metadata)
- [Sitemaps XMLプロトコル](https://www.sitemaps.org/protocol.html)
