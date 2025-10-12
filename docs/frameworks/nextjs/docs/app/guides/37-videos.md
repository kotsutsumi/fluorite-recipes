# 動画の使用と最適化

このガイドでは、Next.js アプリケーションで動画を使用および最適化する方法について説明します。

## 動画埋め込み方法

### `<video>` タグの使用

セルフホスティングまたは直接配信される動画コンテンツの場合、HTML の `<video>` タグを使用します。これにより、再生と外観を完全に制御できます。

**基本的な使用例:**

```jsx
export function Video() {
  return (
    <video width="320" height="240" controls preload="none">
      <source src="/path/to/video.mp4" type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="ja"
        label="日本語"
      />
      お使いのブラウザは video タグをサポートしていません。
    </video>
  )
}
```

#### `<video>` タグの主な属性

| 属性 | 説明 | 例 |
|------|------|-----|
| `src` | 動画ファイルのソース | `src="/video.mp4"` |
| `width` | 動画の幅 | `width="320"` |
| `height` | 動画の高さ | `height="240"` |
| `controls` | 再生コントロールを表示 | `controls` |
| `autoplay` | 自動再生 | `autoplay` |
| `loop` | ループ再生 | `loop` |
| `muted` | ミュート | `muted` |
| `preload` | プリロード動作 | `preload="none"` |
| `playsInline` | インライン再生 (iOS) | `playsInline` |

#### preload 属性

`preload` 属性は、ブラウザが動画をどのようにプリロードするかを指定します:

- `none`: 動画をプリロードしない
- `metadata`: メタデータのみをプリロードする
- `auto`: 動画全体をプリロードする (デフォルト)

**推奨:**

```jsx
<video preload="none" controls>
  <source src="/video.mp4" type="video/mp4" />
</video>
```

#### 複数のソースの使用

ブラウザの互換性のため、複数の動画形式を提供できます:

```jsx
<video controls>
  <source src="/video.webm" type="video/webm" />
  <source src="/video.mp4" type="video/mp4" />
  お使いのブラウザは video タグをサポートしていません。
</video>
```

### `<iframe>` タグの使用

YouTube や Vimeo などの外部プラットフォームから動画を埋め込む場合、`<iframe>` タグを使用します。

**YouTube の例:**

```jsx
export function YouTubeEmbed() {
  return (
    <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/VIDEO_ID"
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
```

**Vimeo の例:**

```jsx
export function VimeoEmbed() {
  return (
    <iframe
      src="https://player.vimeo.com/video/VIDEO_ID"
      width="640"
      height="360"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  )
}
```

### `@next/third-parties` を使用した YouTube 埋め込み

Next.js の `@next/third-parties` パッケージを使用すると、最適化された YouTube 埋め込みを実装できます:

```bash
npm install @next/third-parties@latest
```

```jsx
import { YouTubeEmbed } from '@next/third-parties/google'

export function Page() {
  return <YouTubeEmbed videoid="ogfYd705cRs" height={400} params="controls=0" />
}
```

## 動画のベストプラクティス

### 1. フォールバックコンテンツの提供

ブラウザが `<video>` タグをサポートしていない場合のために、フォールバックコンテンツを提供します:

```jsx
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <p>
    お使いのブラウザは動画をサポートしていません。
    <a href="/video.mp4">動画をダウンロード</a>してください。
  </p>
</video>
```

### 2. 字幕とキャプションの追加

アクセシビリティのため、字幕やキャプションを追加します:

```jsx
<video controls>
  <source src="/video.mp4" type="video/mp4" />
  <track
    src="/captions-ja.vtt"
    kind="subtitles"
    srcLang="ja"
    label="日本語"
  />
  <track
    src="/captions-en.vtt"
    kind="subtitles"
    srcLang="en"
    label="English"
  />
</video>
```

### 3. アクセシブルなコントロールの使用

動画コントロールがキーボードでアクセス可能であることを確認します:

```jsx
<video
  controls
  aria-label="製品デモ動画"
  tabIndex={0}
>
  <source src="/demo.mp4" type="video/mp4" />
</video>
```

### 4. モバイルデバイスへの対応

モバイルデバイスでは `playsInline` 属性を使用して、全画面表示を避けます:

```jsx
<video
  controls
  playsInline
  muted
  preload="none"
>
  <source src="/video.mp4" type="video/mp4" />
</video>
```

## 動画ホスティングオプション

### 1. セルフホスティング

**メリット:**
- 完全なコントロール
- カスタマイズの自由度

**デメリット:**
- 帯域幅コスト
- 最適化の責任

**実装例:**

```jsx
// public/videos/demo.mp4 を配置
export function SelfHostedVideo() {
  return (
    <video controls preload="none">
      <source src="/videos/demo.mp4" type="video/mp4" />
    </video>
  )
}
```

### 2. Vercel Blob

Vercel Blob を使用すると、動画を簡単にアップロードして配信できます:

```bash
npm install @vercel/blob
```

```javascript
import { put } from '@vercel/blob'

const blob = await put('video.mp4', file, {
  access: 'public',
  contentType: 'video/mp4',
})

console.log(blob.url) // 動画の URL
```

**使用例:**

```jsx
export function BlobVideo({ url }) {
  return (
    <video controls preload="none">
      <source src={url} type="video/mp4" />
    </video>
  )
}
```

### 3. 外部プラットフォーム

#### YouTube

**メリット:**
- 無料
- 自動最適化
- グローバル CDN

**デメリット:**
- 広告が表示される可能性
- カスタマイズの制限

#### Vimeo

**メリット:**
- プロフェッショナル品質
- 広告なし
- 高度なカスタマイズ

**デメリット:**
- 有料プランが必要な場合がある

### 4. 動画ホスティングサービス

#### Cloudinary

```bash
npm install cloudinary
```

```jsx
import { Cloudinary } from '@cloudinary/url-gen'

const cld = new Cloudinary({
  cloud: {
    cloudName: 'your-cloud-name'
  }
})

export function CloudinaryVideo() {
  return (
    <video controls>
      <source
        src={cld.video('sample').toURL()}
        type="video/mp4"
      />
    </video>
  )
}
```

#### Mux

Mux は動画ストリーミングに特化したプラットフォームです:

```bash
npm install @mux/mux-node
```

```javascript
import Mux from '@mux/mux-node'

const mux = new Mux({
  tokenId: 'YOUR_TOKEN_ID',
  tokenSecret: 'YOUR_TOKEN_SECRET'
})

const asset = await mux.video.assets.create({
  input: 'https://example.com/video.mp4',
  playback_policy: ['public']
})
```

## 動画の最適化

### 1. 適切なフォーマットとコーデックの選択

**推奨フォーマット:**
- **WebM**: 優れた圧縮率、Chrome/Firefox でサポート
- **MP4 (H.264)**: 広範なブラウザサポート
- **MP4 (H.265/HEVC)**: 高効率、新しいブラウザでサポート

**例:**

```jsx
<video controls>
  <source src="/video.webm" type="video/webm" />
  <source src="/video.mp4" type="video/mp4" />
</video>
```

### 2. 圧縮

動画ファイルを圧縮してファイルサイズを削減します:

**FFmpeg を使用した圧縮:**

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4
```

- `crf`: 品質 (18-28、低いほど高品質)
- `b:a`: オーディオビットレート

### 3. 解像度とビットレートの調整

**レスポンシブ動画:**

```jsx
export function ResponsiveVideo() {
  return (
    <video controls width="100%" height="auto">
      <source
        src="/video-1080p.mp4"
        type="video/mp4"
        media="(min-width: 1920px)"
      />
      <source
        src="/video-720p.mp4"
        type="video/mp4"
        media="(min-width: 1280px)"
      />
      <source
        src="/video-480p.mp4"
        type="video/mp4"
      />
    </video>
  )
}
```

### 4. Content Delivery Network (CDN) の使用

CDN を使用すると、動画の配信が高速化され、サーバーの負荷が軽減されます。

**Vercel での自動 CDN:**

Vercel にデプロイすると、静的ファイルは自動的に CDN から配信されます。

### 5. 遅延読み込み (Lazy Loading)

動画を遅延読み込みして初期ページ読み込みを高速化します:

```jsx
'use client'

import { useEffect, useRef, useState } from 'react'

export function LazyVideo({ src }) {
  const videoRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={videoRef}
      controls
      preload="none"
    >
      {isVisible && <source src={src} type="video/mp4" />}
    </video>
  )
}
```

## オープンソースとライブラリ

### next-video

`next-video` は Next.js 用の包括的な動画コンポーネントです:

```bash
npm install next-video
```

```jsx
import Video from 'next-video'
import myVideo from '/videos/my-video.mp4'

export default function Page() {
  return <Video src={myVideo} />
}
```

### React Player

さまざまな動画プラットフォームをサポートする React コンポーネント:

```bash
npm install react-player
```

```jsx
import ReactPlayer from 'react-player'

export function VideoPlayer() {
  return (
    <ReactPlayer
      url='https://www.youtube.com/watch?v=VIDEO_ID'
      controls
      width="100%"
      height="auto"
    />
  )
}
```

## まとめ

Next.js で動画を使用する際は、以下の点を考慮してください:

1. **適切な埋め込み方法の選択**: `<video>` タグ (セルフホスティング) または `<iframe>` (外部プラットフォーム)
2. **アクセシビリティ**: 字幕、キャプション、アクセシブルなコントロール
3. **最適化**: 圧縮、適切なフォーマット、レスポンシブ対応
4. **ホスティング**: セルフホスティング、Vercel Blob、または専門的な動画ホスティングサービス
5. **パフォーマンス**: 遅延読み込み、CDN の使用、適切な `preload` 設定

これらのベストプラクティスに従うことで、高品質でパフォーマンスの高い動画体験を提供できます。
