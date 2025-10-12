# プログレッシブウェブアプリ（PWA）

Next.jsでプログレッシブウェブアプリ（PWA）を構築する方法について説明します。

## 概要

プログレッシブウェブアプリ（PWA）は、以下の特徴を持つウェブアプリケーションです：

- **ウェブの利点**: 到達範囲とアクセシビリティ
- **ネイティブアプリの利点**: 機能性とユーザーエクスペリエンス
- **即座の更新**: アプリストアの承認なしで更新可能
- **クロスプラットフォーム**: シングルコードベースで動作

## 主要な実装手順

### 1. ウェブアプリマニフェストの作成

`app/manifest.ts`または`app/manifest.json`にマニフェストを作成します。

#### TypeScriptの場合

```typescript
// app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js PWA',
    short_name: 'NextPWA',
    description: 'A Progressive Web App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
```

#### JSONの場合

```json
// app/manifest.json
{
  "name": "Next.js PWA",
  "short_name": "NextPWA",
  "description": "A Progressive Web App built with Next.js",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. アイコンの準備

PWAには以下のサイズのアイコンが必要です：

- 192x192 px（必須）
- 512x512 px（必須）
- その他のサイズ（推奨）

アイコンは`public`ディレクトリに配置します：

```
public/
├── icon-192x192.png
├── icon-512x512.png
├── apple-touch-icon.png
└── favicon.ico
```

### 3. ウェブプッシュ通知の実装

#### ブラウザサポート

- iOS 16.4+
- Safari 16+
- Chromiumベースのブラウザ
- Firefox

#### 通知の購読

```typescript
// app/components/NotificationSubscribe.tsx
'use client'

import { useState } from 'react'

export default function NotificationSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  async function subscribe() {
    if (!('serviceWorker' in navigator)) {
      alert('Service Workerがサポートされていません')
      return
    }

    if (!('PushManager' in window)) {
      alert('プッシュ通知がサポートされていません')
      return
    }

    // 通知の許可を要求
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      alert('通知が許可されませんでした')
      return
    }

    // Service Workerの登録
    const registration = await navigator.serviceWorker.register('/sw.js')

    // プッシュ購読
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    // サーバーに購読情報を送信
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    setIsSubscribed(true)
  }

  return (
    <button onClick={subscribe} disabled={isSubscribed}>
      {isSubscribed ? '購読済み' : '通知を購読'}
    </button>
  )
}
```

#### サーバーサイドの実装

```typescript
// app/actions.ts
'use server'

import webpush from 'web-push'

// VAPID keysの設定
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendNotification(
  subscription: any,
  payload: string
) {
  try {
    await webpush.sendNotification(subscription, payload)
    return { success: true }
  } catch (error) {
    console.error('通知の送信に失敗:', error)
    return { success: false, error }
  }
}
```

### 4. Service Workerの実装

```javascript
// public/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker: インストール中...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker: アクティブ化中...')
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', (event) => {
  // キャッシュ戦略を実装
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})
```

### 5. オフライン対応

```javascript
// public/sw.js
const CACHE_NAME = 'my-pwa-cache-v1'
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/offline.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return caches.match('/offline.html')
        })
      )
    })
  )
})
```

## 推奨パッケージ

### next-pwa

PWAの実装を簡素化するパッケージ：

```bash
npm install next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // Next.jsの設定
})
```

## テスト

### Chrome DevTools

1. DevToolsを開く（F12）
2. Applicationタブを選択
3. Service Workersセクションを確認
4. Manifestセクションを確認

### Lighthouse監査

```bash
# Chrome DevToolsでLighthouseを実行
# PWAスコアを確認
```

### モバイルデバイスでのテスト

1. HTTPSでアプリをホスト
2. モバイルブラウザでアクセス
3. 「ホーム画面に追加」を確認

## ベストプラクティス

### 1. HTTPSを使用

PWA機能にはHTTPSが必須です。

### 2. レスポンシブデザイン

すべてのデバイスで適切に表示されるようにします。

### 3. パフォーマンス最適化

- 画像の最適化
- コード分割
- 遅延読み込み

### 4. オフライン戦略

適切なキャッシュ戦略を実装します。

## 次のステップ

- [メタデータ](/docs/app/building-your-application/optimizing/metadata)
- [静的アセット](/docs/app/building-your-application/optimizing/static-assets)
- [パフォーマンス](/docs/app/building-your-application/optimizing)
