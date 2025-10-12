# robots.txt

`robots.txt` ファイルは、検索エンジンクローラーにサイトのどのURLにアクセスできるかを指示します。

## 静的 robots.txt

`app` ディレクトリのルートに静的な `robots.txt` ファイルを作成できます。

### 基本的な使い方

```txt
# app/robots.txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

### ファイル配置

```
app/
└── robots.txt
```

## 動的 robots.txt 生成

`robots.js` または `robots.ts` ファイルを使用して、プログラマティックに robots.txt を生成できます。

### 基本的な使い方

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

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

生成される出力:

```txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

## Robotsオブジェクトの型定義

```typescript
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
      }>
  sitemap?: string | string[]
  host?: string
}
```

## 設定オプション

### rules

クローラーのルールを定義します。

#### 単一のルール

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
  }
}
```

#### 複数のルール

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/private/',
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
    ],
  }
}
```

生成される出力:

```txt
User-Agent: Googlebot
Allow: /
Disallow: /private/

User-Agent: Applebot
Disallow: /

User-Agent: Bingbot
Disallow: /
```

### userAgent

クローラーの名前を指定します:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: 'Googlebot',
      // ...
    },
  }
}
```

複数のユーザーエージェント:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: ['Googlebot', 'Bingbot', 'Slurp'],
      // ...
    },
  }
}
```

すべてのクローラー:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // ...
    },
  }
}
```

### allow

許可するパスを指定します:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
  }
}
```

複数のパス:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/public/', '/blog/'],
    },
  }
}
```

### disallow

禁止するパスを指定します:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/private/',
    },
  }
}
```

複数のパス:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/private/', '/admin/', '/api/'],
    },
  }
}
```

### crawlDelay

クローラーのリクエスト間隔を秒単位で指定します:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      crawlDelay: 10, // 10秒間隔
    },
  }
}
```

### sitemap

サイトマップのURLを指定します:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

複数のサイトマップ:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://acme.com/sitemap.xml',
      'https://acme.com/sitemap-blog.xml',
      'https://acme.com/sitemap-products.xml',
    ],
  }
}
```

### host

ホスト名を指定します(主にマルチドメインサイト用):

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    host: 'https://acme.com',
    rules: {
      userAgent: '*',
      allow: '/',
    },
  }
}
```

## 実践例

### 基本的なサイト

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

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

### 複数のクローラールール

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/private/', '/admin/'],
        crawlDelay: 2,
      },
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/private/', '/admin/'],
        crawlDelay: 2,
      },
      {
        userAgent: ['Applebot', 'Yandex'],
        allow: ['/'],
        disallow: ['/private/'],
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

### ブログサイト

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/blog/', '/about/', '/contact/'],
      disallow: ['/admin/', '/api/', '/draft/'],
    },
    sitemap: [
      'https://blog.acme.com/sitemap.xml',
      'https://blog.acme.com/sitemap-blog.xml',
    ],
  }
}
```

### ECサイト

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/', '/products/', '/categories/'],
        disallow: [
          '/checkout/',
          '/cart/',
          '/account/',
          '/admin/',
          '/api/',
          '/search?*',
          '/*?page=',
          '/*?sort=',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: '*',
        allow: ['/', '/products/', '/categories/'],
        disallow: ['/checkout/', '/cart/', '/account/', '/admin/'],
      },
    ],
    sitemap: [
      'https://shop.acme.com/sitemap.xml',
      'https://shop.acme.com/sitemap-products.xml',
    ],
  }
}
```

### 環境に基づいた設定

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://acme.com'
  const isProduction = process.env.NODE_ENV === 'production'

  return {
    rules: {
      userAgent: '*',
      allow: isProduction ? '/' : undefined,
      disallow: isProduction ? ['/private/', '/admin/'] : '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
```

### 動的データの使用

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default async function robots(): Promise<MetadataRoute.Robots> {
  // 設定を取得
  const config = await fetch('https://api.acme.com/seo-config').then((res) =>
    res.json()
  )

  return {
    rules: config.robotsRules,
    sitemap: config.sitemapUrls,
    host: config.canonicalDomain,
  }
}
```

## 一般的なパターン

### すべてを許可

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

### すべてをブロック(開発中)

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
```

### 特定のパスをブロック

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/private/',
        '/*.json$',
        '/*?*', // クエリパラメータ
      ],
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

### 特定のクローラーのみ許可

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  }
}
```

## ワイルドカードパターン

robots.txtはワイルドカードをサポートします:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/*',        // /admin/配下すべて
        '/*.pdf$',         // すべてのPDFファイル
        '/private/*.html', // /private/配下のHTMLファイル
        '/*?sort=',        // sortパラメータを含むURL
      ],
    },
  }
}
```

## ベストプラクティス

### 1. 重要なコンテンツは常に許可

クローラーが重要なページにアクセスできるようにします:

```typescript
allow: ['/', '/products/', '/blog/', '/about/']
```

### 2. プライベートエリアをブロック

管理画面やAPIエンドポイントをブロックします:

```typescript
disallow: ['/admin/', '/api/', '/private/']
```

### 3. サイトマップを含める

常にサイトマップのURLを提供します:

```typescript
sitemap: 'https://acme.com/sitemap.xml'
```

### 4. crawlDelayを適切に設定

サーバーに過負荷をかけないようにします:

```typescript
crawlDelay: 10 // 10秒
```

### 5. 環境に基づいた設定

開発環境ではすべてをブロックします:

```typescript
const isProduction = process.env.NODE_ENV === 'production'

return {
  rules: {
    userAgent: '*',
    allow: isProduction ? '/' : undefined,
    disallow: isProduction ? '/private/' : '/',
  },
}
```

## テストとデバッグ

### ローカルでの確認

```bash
curl http://localhost:3000/robots.txt
```

### Google Search Consoleでのテスト

1. Google Search Consoleにアクセス
2. 「robots.txt テスター」ツールを使用
3. URLをテストして正しくブロック/許可されているか確認

## 注意事項

- `robots.txt` は推奨事項であり、強制力はありません
- セキュリティ対策として robots.txt に依存しないでください
- 機密情報を含むパスは他の方法で保護してください
- すべてのクローラーが robots.txt を尊重するわけではありません

## バージョン履歴

- **v13.3.0**: `robots.js` と `robots.ts` が導入されました

## 関連項目

- [sitemap.xml](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/metadata/05-sitemap)
- [メタデータAPI](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/metadata)
- [robots.txt仕様](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
