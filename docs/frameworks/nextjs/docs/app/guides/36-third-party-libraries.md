# サードパーティライブラリの最適化

`@next/third-parties` ライブラリは、人気のあるサードパーティサービスをNext.jsアプリケーションに統合するための最適化されたコンポーネントとユーティリティを提供します。

## 主な機能

### インストール

```bash
npm install @next/third-parties@latest next@latest
```

### Google サードパーティ統合

#### Google Tag Manager

Google Tag Manager (GTM) を使用すると、アプリケーション全体または特定のルートにタグ管理を追加できます。

**使用例:**

```typescript
import { GoogleTagManager } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-XYZ" />
      <body>{children}</body>
    </html>
  )
}
```

#### イベントの送信

`sendGTMEvent()` 関数を使用して、ユーザーインタラクションを追跡できます。

```javascript
'use client'
import { sendGTMEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <button
      onClick={() => sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })}
    >
      イベントを送信
    </button>
  )
}
```

#### Google Analytics

Google Analytics 4 を簡単なコンポーネントで統合できます。

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  )
}
```

**イベント送信:**

```javascript
'use client'
import { sendGAEvent } from '@next/third-parties/google'

export function EventButton() {
  return (
    <button
      onClick={() => sendGAEvent('event', 'buttonClicked', { value: 'xyz' })}
    >
      イベントを送信
    </button>
  )
}
```

#### Google Maps Embed

Google Maps を埋め込むには、`GoogleMapsEmbed` コンポーネントを使用します。

```typescript
import { GoogleMapsEmbed } from '@next/third-parties/google'

export default function Page() {
  return (
    <GoogleMapsEmbed
      apiKey="YOUR_API_KEY"
      height={200}
      width="100%"
      mode="place"
      q="Brooklyn+Bridge,New+York,NY"
    />
  )
}
```

#### YouTube Embed

YouTube 動画を埋め込むには、`YouTubeEmbed` コンポーネントを使用します。

```typescript
import { YouTubeEmbed } from '@next/third-parties/google'

export default function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

## 重要な注意事項

- 現在、このライブラリは実験的なものです
- latest または canary フラグを使用してインストールすることを推奨します
- パフォーマンスが最適化されたサードパーティ統合を提供します

## 追加の統合オプション

`@next/third-parties` ライブラリは、以下のような人気のあるサービスとの統合をサポートしています:

- Google Tag Manager (GTM)
- Google Analytics (GA)
- Google Maps Embed
- YouTube Embed

## オプションとカスタマイズ

各コンポーネントは、さまざまなオプションとカスタマイズをサポートしています。詳細については、各コンポーネントの API リファレンスを参照してください。

## パフォーマンスの最適化

`@next/third-parties` は以下のような最適化を提供します:

- スクリプトの遅延読み込み
- リソースの優先順位付け
- 効率的なバンドルサイズ

これにより、サードパーティサービスがアプリケーションのパフォーマンスに与える影響を最小限に抑えることができます。
