# Next.js Metadata File Conventions API リファレンス

Next.js App Router で使用されるメタデータファイル規約の包括的なAPIリファレンスです。これらのファイル規約を使用することで、SEO、ソーシャルメディア共有、PWA機能を効率的に実装できます。

## メタデータファイル一覧

### 1. [App Icons](./metadata/01-app-icons.md)

**対象**: アプリケーションのアイコン設定

Webアプリケーションのアイコン（ファビコン、アプリアイコン、Apple Touch Icon）を設定するためのファイル規約です。

**主な機能**:

- **ファイルベースのアイコン設定**: 静的画像ファイルによる設定
- **プログラマティック生成**: コードによる動的アイコン生成
- **複数サイズ対応**: 異なるデバイス・解像度への対応
- **自動HTMLタグ生成**: 適切な`<link>`タグの自動挿入

**サポートファイルタイプ**:

- **favicon.ico**: ルートの`/app`ディレクトリのみ（`.ico`）
- **icon**: 任意の`app/**/*`ディレクトリ（`.ico`, `.jpg`, `.jpeg`, `.png`, `.svg`）
- **apple-icon**: 任意の`app/**/*`ディレクトリ（`.jpg`, `.jpeg`, `.png`）

**基本的な使用例**:

#### ファイルベースの設定

```
app/
├── favicon.ico        # ファビコン(ルートのみ)
├── icon.png          # 汎用アイコン
└── apple-icon.png    # Apple固有のアイコン
```

#### 複数サイズのアイコン

```
app/
├── icon1.png    # 32x32
├── icon2.png    # 64x64
└── icon3.png    # 128x128
```

#### プログラマティック生成

```typescript
// app/icon.tsx
import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    { ...size }
  )
}
```

**自動生成されるHTMLタグ**:

```html
<link rel="icon" href="/icon.png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
```

---

### 2. [Manifest](./metadata/02-manifest.md)

**対象**: PWA（Progressive Web App）のマニフェスト

Web Manifest仕様に従って、Webアプリケーションの情報をブラウザに提供し、PWA機能を有効化します。

**主な機能**:

- **静的マニフェスト**: JSONファイルによる設定
- **動的マニフェスト**: コードによる動的生成
- **PWA対応**: アプリのようなユーザー体験の提供
- **インストール対応**: ホーム画面への追加機能

**基本的な使用例**:

#### 静的マニフェスト

```json
// app/manifest.json
{
  "name": "My Next.js Application",
  "short_name": "Next.js App",
  "description": "An application built with Next.js",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### 動的マニフェスト

```typescript
// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next.js App",
    short_name: "Next.js App",
    description: "Next.js App",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
```

**主要な設定オプション**:

- `name`: アプリケーションの正式名称
- `short_name`: 短縮名（ホーム画面など）
- `display`: 表示モード（'standalone', 'fullscreen', 'minimal-ui', 'browser'）
- `background_color`: 背景色
- `theme_color`: テーマカラー
- `icons`: アプリアイコンの配列

---

### 3. [OpenGraph Image & Twitter Image](./metadata/03-opengraph-image.md)

**対象**: ソーシャルメディア共有画像

ソーシャルネットワークやメッセージングアプリでのリンク共有時に表示される画像を設定します。

**主な機能**:

- **Open Graph対応**: Facebook、LinkedIn等での共有最適化
- **Twitter Card対応**: Twitter での共有最適化
- **静的画像**: ファイルベースの設定
- **動的画像生成**: コードによるプログラマティック生成
- **Alt Text対応**: アクセシビリティの向上

**サポートファイル形式**:

- `.jpg`, `.jpeg`, `.png`, `.gif`

**基本的な使用例**:

#### ファイルベースの設定

```
app/
├── opengraph-image.png          # Open Graph画像
├── opengraph-image.alt.txt      # Alt text(オプション)
├── twitter-image.png            # Twitter画像
└── twitter-image.alt.txt        # Alt text(オプション)
```

#### Alt Textの設定

```txt
// app/opengraph-image.alt.txt
About Acme Corporation
```

#### プログラマティック生成

```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    { ...size }
  )
}
```

**自動生成されるメタタグ**:

```html
<!-- Open Graph -->
<meta property="og:image" content="<generated>" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter -->
<meta name="twitter:image" content="<generated>" />
<meta name="twitter:image:type" content="image/png" />
<meta name="twitter:image:width" content="1200" />
<meta name="twitter:image:height" content="630" />
```

---

### 4. [Robots.txt](./metadata/04-robots.md)

**対象**: 検索エンジンクローラーの制御

検索エンジンクローラーにサイトのどのURLにアクセスできるかを指示するファイルです。

**主な機能**:

- **静的robots.txt**: ファイルベースの設定
- **動的生成**: コードによる動的生成
- **クローラー制御**: アクセス許可・禁止の詳細設定
- **サイトマップ連携**: サイトマップURLの指定

**基本的な使用例**:

#### 静的robots.txt

```txt
# app/robots.txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

#### 動的生成

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: "https://acme.com/sitemap.xml",
  };
}
```

#### 複数のルール設定

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: "/private/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/private/", "/admin/"],
      },
    ],
    sitemap: "https://acme.com/sitemap.xml",
  };
}
```

**設定オプション**:

- `userAgent`: 対象とするクローラー
- `allow`: アクセスを許可するパス
- `disallow`: アクセスを禁止するパス
- `crawlDelay`: クロール間隔（秒）
- `sitemap`: サイトマップのURL
- `host`: 優先ホスト名

---

### 5. [Sitemap.xml](./metadata/05-sitemap.md)

**対象**: サイトマップの生成

検索エンジンクローラーがサイトをより効率的にインデックスできるようにするサイトマップファイルです。

**主な機能**:

- **静的サイトマップ**: XMLファイルベースの設定
- **動的生成**: コードによる動的生成
- **多言語対応**: 国際化サイトのサポート
- **優先度設定**: ページの重要度設定

**基本的な使用例**:

#### 静的sitemap.xml

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
</urlset>
```

#### 動的生成

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://acme.com",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://acme.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://acme.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
```

#### 動的コンテンツからの生成

```typescript
// app/sitemap.ts
export default async function sitemap(): MetadataRoute.Sitemap {
  // 静的ページ
  const staticPages = [
    {
      url: "https://acme.com",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 1,
    },
    {
      url: "https://acme.com/about",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // 動的ページ（ブログ投稿など）
  const posts = await fetchAllPosts();
  const dynamicPages = posts.map((post) => ({
    url: `https://acme.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...dynamicPages];
}
```

**設定オプション**:

- `url`: ページの完全なURL（必須）
- `lastModified`: 最終更新日時
- `changeFrequency`: 更新頻度（'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'）
- `priority`: 優先度（0.0-1.0）
- `alternates`: 多言語対応

## メタデータファイルの統合戦略

### プロジェクト構造例

```
app/
├── favicon.ico                    # ファビコン
├── icon.png                      # アプリアイコン
├── apple-icon.png                # Apple Touch Icon
├── opengraph-image.png           # OG画像
├── twitter-image.png             # Twitter画像
├── manifest.json                 # PWAマニフェスト
├── robots.txt                    # robots.txt
├── sitemap.xml                   # サイトマップ
└── layout.tsx                    # メタデータAPI設定
```

### 動的生成ファイルの統合

```
app/
├── icon.tsx                      # 動的アイコン生成
├── manifest.ts                   # 動的マニフェスト
├── opengraph-image.tsx           # 動的OG画像
├── robots.ts                     # 動的robots.txt
├── sitemap.ts                    # 動的サイトマップ
└── layout.tsx                    # 統合メタデータ
```

## 使用場面別の推奨設定

### 1. 企業サイト・ポートフォリオ

```typescript
// 静的コンテンツ重視
// 推奨ファイル:
// - favicon.ico
// - icon.png
// - manifest.json
// - robots.txt
// - sitemap.xml

// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://company.com/sitemap.xml",
  };
}

// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: "https://company.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://company.com/about",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: "https://company.com/services",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
```

### 2. ブログ・メディアサイト

```typescript
// 動的コンテンツ重視
// 推奨ファイル:
// - icon.tsx (ブランドロゴから生成)
// - opengraph-image.tsx (記事タイトルから生成)
// - robots.ts (カテゴリ別制御)
// - sitemap.ts (記事一覧から動的生成)

// app/blog/[slug]/opengraph-image.tsx
export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    (
      <div style={{ /* スタイル */ }}>
        <h1>{post.title}</h1>
        <p>By {post.author}</p>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

// app/sitemap.ts
export default async function sitemap() {
  const posts = await getAllPosts()

  return [
    {
      url: 'https://blog.com',
      lastModified: new Date(),
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `https://blog.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
```

### 3. Eコマースサイト

```typescript
// 商品重視 + PWA対応
// 推奨ファイル:
// - manifest.ts (PWA対応)
// - opengraph-image.tsx (商品画像)
// - robots.ts (商品カテゴリ制御)
// - sitemap.ts (商品・カテゴリ一覧)

// app/manifest.ts
export default function manifest() {
  return {
    name: 'Online Store',
    short_name: 'Store',
    description: 'Your favorite online store',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

// app/products/[id]/opengraph-image.tsx
export default async function Image({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  return new ImageResponse(
    (
      <div style={{ /* 商品情報表示 */ }}>
        <img src={product.image} alt={product.name} />
        <h1>{product.name}</h1>
        <p>${product.price}</p>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

### 4. SaaSアプリケーション

```typescript
// アプリ重視 + セキュリティ
// 推奨ファイル:
// - icon.tsx (ブランドアイコン)
// - manifest.ts (アプリライク体験)
// - robots.ts (プライベートエリア制御)

// app/robots.ts
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/admin/", "/api/"],
      },
    ],
    sitemap: "https://saas.com/sitemap.xml",
  };
}

// app/manifest.ts
export default function manifest() {
  return {
    name: "SaaS Application",
    short_name: "SaaS",
    description: "Professional SaaS application",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#3b82f6",
    categories: ["productivity", "business"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
```

## パフォーマンス最適化

### 1. 画像最適化

```typescript
// 効率的な画像生成
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          // CSS-in-JS最適化
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#1e293b',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* シンプルなデザインでパフォーマンス向上 */}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // 画質設定
      fonts: [],
    }
  )
}
```

### 2. キャッシュ戦略

```typescript
// 適切なキャッシュ設定
export default async function sitemap() {
  // キャッシュ可能なデータの活用
  const pages = await getCachedPages();

  return pages.map((page) => ({
    url: `https://example.com${page.path}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: page.type === "static" ? "yearly" : "weekly",
    priority: page.priority,
  }));
}
```

## SEO最適化のベストプラクティス

### 1. サイトマップの最適化

```typescript
// 階層的なサイトマップ構造
export default async function sitemap() {
  const baseUrl = "https://example.com";

  // 高優先度ページ
  const mainPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "monthly" },
    { url: `${baseUrl}/about`, priority: 0.9, changeFrequency: "yearly" },
    { url: `${baseUrl}/services`, priority: 0.9, changeFrequency: "monthly" },
  ];

  // 中優先度ページ
  const blogPosts = await getBlogPosts();
  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    priority: 0.7,
    changeFrequency: "weekly",
  }));

  // 低優先度ページ
  const tagPages = await getTags();
  const tagPageUrls = tagPages.map((tag) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    priority: 0.5,
    changeFrequency: "monthly",
  }));

  return [...mainPages, ...blogPages, ...tagPageUrls];
}
```

### 2. Robots.txtの戦略的設定

```typescript
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/tmp/",
          "/*.json$",
          "/*?utm_*", // UTMパラメータ付きURL
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "GPTBot",
        disallow: "/", // AI学習を制限
      },
    ],
    sitemap: "https://example.com/sitemap.xml",
    host: "https://example.com", // 優先ドメイン指定
  };
}
```

## 追加リソース

### 公式ドキュメント

- [Next.js Metadata Files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- [Next.js ImageResponse](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Web Manifest Specification](https://developer.mozilla.org/docs/Web/Manifest)

### SEO・PWA関連

- [Google Search Console](https://search.google.com/search-console)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Open Graph Protocol](https://ogp.me/)

### 実装例とツール

- [Next.js Metadata Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [OG Image Playground](https://og-playground.vercel.app/)
- [Manifest Generator](https://www.simicart.com/manifest-generator.html/)

---

各メタデータファイルには詳細な設定オプション、実装例、およびベストプラクティスが含まれています。プロジェクトの性質と要件に応じて、適切なメタデータ戦略を選択してください。
