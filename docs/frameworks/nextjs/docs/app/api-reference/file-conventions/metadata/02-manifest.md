# manifest

マニフェストファイルは、[Web Manifest仕様](https://developer.mozilla.org/docs/Web/Manifest)に従って、Webアプリケーションの情報をブラウザに提供します。

## 静的マニフェストファイル

`app` ディレクトリのルートに `manifest.json` または `manifest.webmanifest` ファイルを作成できます。

### 基本的な使い方

```json
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

### ファイル配置

```
app/
├── manifest.json          # 静的マニフェストファイル
└── manifest.webmanifest  # または.webmanifest拡張子
```

## 動的マニフェスト生成

`manifest.js` または `manifest.ts` ファイルを使用して、プログラマティックにマニフェストを生成できます。

### 基本的な使い方

```typescript
// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

## Manifestオブジェクトの型定義

```typescript
type Manifest = {
  name: string
  short_name?: string
  description?: string
  start_url: string
  display?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser'
  background_color?: string
  theme_color?: string
  icons?: Array<{
    src: string
    sizes?: string
    type?: string
    purpose?: 'any' | 'maskable' | 'monochrome'
  }>
  orientation?:
    | 'any'
    | 'natural'
    | 'landscape'
    | 'portrait'
    | 'portrait-primary'
    | 'portrait-secondary'
    | 'landscape-primary'
    | 'landscape-secondary'
  categories?: string[]
  screenshots?: Array<{
    src: string
    sizes?: string
    type?: string
  }>
  shortcuts?: Array<{
    name: string
    short_name?: string
    description?: string
    url: string
    icons?: Array<{
      src: string
      sizes?: string
      type?: string
    }>
  }>
  related_applications?: Array<{
    platform: string
    url?: string
    id?: string
  }>
  prefer_related_applications?: boolean
  scope?: string
  lang?: string
  dir?: 'ltr' | 'rtl' | 'auto'
}
```

## 主要なプロパティ

### name (必須)

アプリケーションの完全な名前:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Next.js Application',
    // ...
  }
}
```

### short_name

アプリケーションの短縮名(スペースが限られている場合に使用):

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My Next.js Application',
    short_name: 'Next.js App',
    // ...
  }
}
```

### start_url (必須)

アプリケーションの起動URL:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    start_url: '/',
    // または特定のパス
    start_url: '/dashboard',
    // ...
  }
}
```

### display

アプリケーションの表示モード:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    display: 'standalone', // アプリのように表示
    // または
    // display: 'fullscreen',  // 全画面
    // display: 'minimal-ui',  // 最小限のUI
    // display: 'browser',     // 通常のブラウザ
    // ...
  }
}
```

### icons

アプリケーションのアイコン:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
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
      {
        src: '/icon-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable', // Android adaptive icons用
      },
    ],
    // ...
  }
}
```

### theme_color と background_color

アプリケーションのテーマカラーと背景色:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: '#000000',      // ブラウザのUIカラー
    background_color: '#ffffff', // スプラッシュ画面の背景色
    // ...
  }
}
```

## 高度な機能

### ショートカット

アプリケーションのショートカットメニュー:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    shortcuts: [
      {
        name: 'ホームページ',
        short_name: 'ホーム',
        description: 'ホームページを開く',
        url: '/',
        icons: [{ src: '/home-icon.png', sizes: '192x192' }],
      },
      {
        name: 'ダッシュボード',
        url: '/dashboard',
      },
    ],
    // ...
  }
}
```

### スクリーンショット

アプリストアでの表示用スクリーンショット:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    screenshots: [
      {
        src: '/screenshot1.png',
        sizes: '1280x720',
        type: 'image/png',
      },
      {
        src: '/screenshot2.png',
        sizes: '1280x720',
        type: 'image/png',
      },
    ],
    // ...
  }
}
```

### 関連アプリケーション

ネイティブアプリケーションへの参照:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    related_applications: [
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=com.example.app',
        id: 'com.example.app',
      },
      {
        platform: 'itunes',
        url: 'https://apps.apple.com/app/example/id123456789',
      },
    ],
    prefer_related_applications: false,
    // ...
  }
}
```

## 動的データの使用

環境変数やデータベースから情報を取得できます:

```typescript
// app/manifest.ts
import type { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // 設定を取得
  const config = await fetch('https://api.example.com/config').then((res) =>
    res.json()
  )

  return {
    name: config.appName,
    short_name: config.appShortName,
    description: config.appDescription,
    start_url: '/',
    display: 'standalone',
    background_color: config.brandColor,
    theme_color: config.brandColor,
    icons: config.icons,
  }
}
```

## 環境変数の使用

```typescript
// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Next.js App',
    short_name: process.env.NEXT_PUBLIC_APP_SHORT_NAME || 'App',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: process.env.NEXT_PUBLIC_BRAND_COLOR || '#ffffff',
    theme_color: process.env.NEXT_PUBLIC_BRAND_COLOR || '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

## キャッシング

- 静的マニフェストファイルはデフォルトでキャッシュされます
- 動的マニフェストは、動的関数を使用しない限りキャッシュされます
- `dynamic = 'force-dynamic'` を使用してキャッシュを無効化できます

```typescript
// app/manifest.ts
export const dynamic = 'force-dynamic'

export default function manifest() {
  // 常に最新のマニフェストを生成
}
```

## ベストプラクティス

### 1. 必須フィールドの提供

最低限、`name` と `start_url` を設定します:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My App',
    start_url: '/',
    // ...他のフィールド
  }
}
```

### 2. 適切なアイコンサイズ

複数のサイズを提供して、さまざまなデバイスに対応します:

- 192x192: 最小サイズ
- 512x512: 推奨サイズ
- maskable: Android adaptive icons用

### 3. PWA対応

Progressive Web Appとして機能させるための設定:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My PWA',
    short_name: 'PWA',
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

### 4. 多言語対応

言語設定を含めます:

```typescript
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My App',
    short_name: 'App',
    start_url: '/',
    lang: 'ja-JP',
    dir: 'ltr', // または 'rtl'
    // ...
  }
}
```

## バージョン履歴

- **v13.3.0**: `manifest.js` と `manifest.ts` が導入されました

## 関連項目

- [Web Manifest仕様](https://developer.mozilla.org/docs/Web/Manifest)
- [PWAガイド](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/metadata)
- [アプリアイコン](/docs/frameworks/nextjs/docs/app/api-reference/file-conventions/metadata/01-app-icons)
