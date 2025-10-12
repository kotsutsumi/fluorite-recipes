# Metadata Files（メタデータファイル）

このセクションでは、Next.jsアプリケーションでメタデータを定義するために使用できる、すべてのファイルベースのメタデータ規約について説明します。

## 概要

メタデータファイルAPIリファレンスを使用すると、特別なファイル規約を使用してルートセグメントのメタデータを定義できます。メタデータは、静的に（例：`opengraph-image.jpg`）または動的に（例：`opengraph-image.js`）定義できます。

Next.jsは、本番環境のキャッシングを使用してこれらのファイルを自動的に提供し、関連するheadタグを更新します。

## メタデータファイルの種類

Next.jsは以下のメタデータファイル規約をサポートしています：

### アイコンファイル

- **favicon** - ブラウザタブに表示されるファビコン
- **icon** - アプリケーションアイコン
- **apple-icon** - Apple デバイス用のアイコン

### Open GraphとTwitter画像

- **opengraph-image** - Open Graph画像
- **twitter-image** - Twitter カード画像

### SEOファイル

- **robots** - robots.txtファイル
- **sitemap** - サイトマップXMLファイル

### マニフェストファイル

- **manifest** - Web App Manifestファイル

## ファイル規約

### 静的メタデータファイル

静的アセットを使用してメタデータを定義できます：

```
app/
├── favicon.ico
├── icon.png
├── apple-icon.png
├── opengraph-image.png
├── twitter-image.png
├── robots.txt
├── sitemap.xml
└── manifest.json
```

### 動的メタデータファイル

コードを使用してメタデータを生成できます：

```
app/
├── icon.tsx
├── apple-icon.tsx
├── opengraph-image.tsx
├── twitter-image.tsx
├── robots.ts
├── sitemap.ts
└── manifest.ts
```

## favicon

ブラウザのタブに表示されるシンプルなファビコンを追加します。

### サポートされるファイル形式

- `.ico`
- `.jpg`、`.jpeg`
- `.png`
- `.svg`

### 使用例

```
app/
└── favicon.ico
```

これにより、以下のheadタグが生成されます：

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
```

## icon

アプリケーションアイコンを追加します。

### サポートされるファイル形式

- `.ico`
- `.jpg`、`.jpeg`
- `.png`
- `.svg`

### 静的アイコン

```
app/
├── icon.png        # /icon.png
└── icon.jpg        # /icon.jpg
```

### 動的アイコン生成

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
    {
      ...size,
    }
  )
}
```

これにより、以下のheadタグが生成されます：

```html
<link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
```

### 複数のアイコン

```
app/
├── icon1.png       # /icon1.png
└── icon2.png       # /icon2.png
```

または、配列をエクスポート：

```tsx
// app/icon.tsx
import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export default function Icon() {
  return [
    {
      id: 'small',
      url: '/icon-small.png',
      type: 'image/png',
      sizes: '16x16',
    },
    {
      id: 'medium',
      url: '/icon-medium.png',
      type: 'image/png',
      sizes: '32x32',
    },
  ]
}
```

## apple-icon

Apple デバイス専用のアイコンを追加します。

### サポートされるファイル形式

- `.jpg`、`.jpeg`
- `.png`

### 静的Appleアイコン

```
app/
└── apple-icon.png
```

### 動的Appleアイコン生成

```tsx
// app/apple-icon.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '20%',
        }}
      >
        App
      </div>
    ),
    {
      ...size,
    }
  )
}
```

これにより、以下のheadタグが生成されます：

```html
<link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" />
```

## opengraph-image

Open Graph画像を追加して、ソーシャルメディアでの共有を改善します。

### サポートされるファイル形式

- `.jpg`、`.jpeg`
- `.png`
- `.gif`

### 静的Open Graph画像

```
app/
└── opengraph-image.png
```

### 動的Open Graph画像生成

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
    {
      ...size,
    }
  )
}
```

これにより、以下のheadタグが生成されます：

```html
<meta property="og:image" content="<generated>" />
<meta property="og:image:alt" content="About Acme" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### ルートセグメント別の画像

```
app/
├── opengraph-image.png           # グローバル
└── blog/
    ├── opengraph-image.png       # ブログ用
    └── [slug]/
        └── opengraph-image.tsx   # 記事別の動的画像
```

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(
    (res) => res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1>{post.title}</h1>
        <p>{post.description}</p>
      </div>
    )
  )
}
```

## twitter-image

Twitter カード用の画像を追加します。

### サポートされるファイル形式

- `.jpg`、`.jpeg`
- `.png`
- `.gif`

### 静的Twitter画像

```
app/
└── twitter-image.png
```

### 動的Twitter画像生成

```tsx
// app/twitter-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

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
    {
      ...size,
    }
  )
}
```

これにより、以下のheadタグが生成されます：

```html
<meta name="twitter:image" content="<generated>" />
<meta name="twitter:image:alt" content="About Acme" />
<meta name="twitter:card" content="summary_large_image" />
```

## robots

検索エンジンクローラーの動作を制御するrobots.txtファイルを追加します。

### 静的robots.txt

```txt
# app/robots.txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

### 動的robots.ts

```ts
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

これにより、以下の`/robots.txt`が生成されます：

```txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

### 複数のルール

```ts
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/private/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/private/', '/admin/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

## sitemap

検索エンジンがサイトをクロールするのに役立つサイトマップを追加します。

### 静的sitemap.xml

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

### 動的sitemap.ts

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

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

### 動的コンテンツのサイトマップ

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
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

### 複数のサイトマップ

大規模なサイトの場合、複数のサイトマップに分割できます：

```ts
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com/sitemap-posts.xml',
    },
    {
      url: 'https://acme.com/sitemap-products.xml',
    },
  ]
}
```

```ts
// app/sitemap-posts.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetch('https://api.example.com/posts').then((res) =>
    res.json()
  )

  return posts.map((post) => ({
    url: `https://acme.com/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
  }))
}
```

## manifest

Progressive Web App（PWA）のためのWeb App Manifestを追加します。

### 静的manifest.json

```json
{
  "name": "My Next.js App",
  "short_name": "Next.js App",
  "description": "An app built with Next.js",
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

### 動的manifest.ts

```ts
// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Next.js App',
    short_name: 'Next.js App',
    description: 'An app built with Next.js',
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
```

### 高度なマニフェスト

```ts
// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Progressive Web App',
    short_name: 'My PWA',
    description: 'A progressive web application built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshot1.png',
        sizes: '540x720',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        description: 'View your dashboard',
      },
      {
        name: 'Profile',
        url: '/profile',
        description: 'View your profile',
      },
    ],
  }
}
```

これにより、以下のheadタグが生成されます：

```html
<link rel="manifest" href="/manifest.json" />
```

## Middlewareでの除外

メタデータファイルがミドルウェアによって処理されないようにする必要がある場合、matcherを設定します。

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 以下で始まるパスを除外:
     * - api (APIルート)
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化ファイル)
     * - favicon.ico, sitemap.xml, robots.txt (メタデータファイル)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

## キャッシング

デフォルトでは、メタデータファイルは本番環境でキャッシュされます。

### 動的メタデータのキャッシュ制御

動的メタデータファイルで再検証時間を設定できます：

```tsx
// app/opengraph-image.tsx
export const revalidate = 3600 // 1時間ごとに再検証

export default async function Image() {
  const data = await fetch('https://api.example.com/og-data').then((res) =>
    res.json()
  )

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
        {data.title}
      </div>
    )
  )
}
```

## Good to Know

- メタデータファイルは、特別なRoute Handlersです
- デフォルトでは本番環境でキャッシュされます
- ミドルウェアを使用する場合、matcherを設定してメタデータファイルを除外してください
- 動的メタデータファイルは、`edge`または`nodejs`ランタイムを使用できます
- 画像生成には`ImageResponse`と`next/og`を使用します

## バージョン履歴

| バージョン | 変更内容 |
| --- | --- |
| `v13.3.0` | `manifest`、`robots`、`sitemap` が導入 |
| `v13.0.0` | `favicon`、`icon`、`apple-icon`、`opengraph-image`、`twitter-image` が導入 |
