# JSON-LD

JSON-LD は、検索エンジンや AI がページのコンテンツをテキスト以上に理解するのに役立つ構造化データの形式です。人物、イベント、組織、商品など、さまざまなエンティティを記述できます。

## 概要

JSON-LD（JavaScript Object Notation for Linked Data）を使用すると、検索エンジンにページの内容を理解させ、リッチスニペットや強化された検索結果を表示できます。

## 推奨される実装方法

現在の推奨事項は、`layout.js` または `page.js` コンポーネントで構造化データを `<script>` タグとしてレンダリングすることです。

### 基本的な実装

```typescript
// app/products/[id]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
  }

  return (
    <section>
      {/* JSON-LD を script タグとして埋め込む */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
    </section>
  )
}
```

## 重要なセキュリティ注意事項

`JSON.stringify()` を使用する際、XSS 脆弱性の可能性があります。以下の対策を推奨します：

1. **HTML タグをペイロードから削除する**
2. **`<` を `\u003c` に置き換える**
3. **コミュニティメンテナンスの代替手段を検討する**（例：`serialize-javascript`）

### 安全な実装例

```typescript
export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'John Doe',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // < を \u003c にエスケープ
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

## よく使用される Schema.org タイプ

### 1. 商品（Product）

```typescript
export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://example.com/products/${params.id}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* コンテンツ */}
    </section>
  )
}
```

### 2. ブログ記事（Article）

```typescript
export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.image,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Site',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png',
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* コンテンツ */}
    </article>
  )
}
```

### 3. イベント（Event）

```typescript
export default async function EventPage({
  params,
}: {
  params: { id: string }
}) {
  const event = await getEvent(params.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      '@type': 'Place',
      name: event.venueName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.street,
        addressLocality: event.city,
        addressRegion: event.state,
        postalCode: event.zipCode,
        addressCountry: event.country,
      },
    },
    offers: {
      '@type': 'Offer',
      url: `https://example.com/events/${params.id}`,
      price: event.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* コンテンツ */}
    </section>
  )
}
```

### 4. パンくずリスト（BreadcrumbList）

```typescript
export default function ProductPage({
  params,
}: {
  params: { category: string; id: string }
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: params.category,
        item: `https://example.com/${params.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Product',
        item: `https://example.com/${params.category}/${params.id}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

## TypeScript サポート

`schema-dts` などのコミュニティパッケージを使用して、型定義を追加できます。

### インストール

```bash
npm install schema-dts
```

### 使用例

```typescript
import { Product, WithContext } from 'schema-dts'

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  const jsonLd: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
    },
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* コンテンツ */}
    </section>
  )
}
```

## 検証ツール

### Google Rich Results Test

Google の検索結果でリッチスニペットが表示されるかテストします。

- URL: https://search.google.com/test/rich-results
- 使い方: URL またはコードスニペットを入力

### Schema Markup Validator

一般的な構造化データの検証を行います。

- URL: https://validator.schema.org/
- 使い方: JSON-LD コードを貼り付けて検証

## ベストプラクティス

### 1. ヘルパー関数の作成

再利用可能なヘルパー関数を作成します。

```typescript
// lib/json-ld.ts
export function createProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
    },
  }
}

export function sanitizeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
```

```typescript
// app/products/[id]/page.tsx
import { createProductJsonLd, sanitizeJsonLd } from '@/lib/json-ld'

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)
  const jsonLd = createProductJsonLd(product)

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(jsonLd) }}
      />
      {/* コンテンツ */}
    </section>
  )
}
```

### 2. 複数の JSON-LD ブロック

ページに複数の構造化データを含めることができます。

```typescript
export default function Page() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Your Company',
    url: 'https://example.com',
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Your Site',
    url: 'https://example.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://example.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </>
  )
}
```

### 3. Layout での使用

サイト全体の構造化データは Layout に配置します。

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Your Site',
    url: 'https://example.com',
  }

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

## まとめ

JSON-LD を使用することで、以下のメリットがあります：

1. **SEO の向上**: 検索エンジンがコンテンツを理解しやすくなる
2. **リッチスニペット**: 検索結果で強化された表示
3. **音声検索対応**: AI アシスタントがコンテンツを理解しやすくなる
4. **構造化データ**: データの意味を明確に伝達

適切な JSON-LD の実装により、検索エンジンでの可視性とユーザーエクスペリエンスが向上します。
