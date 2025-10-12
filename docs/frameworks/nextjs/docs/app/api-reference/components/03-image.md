# Image

`<Image>`コンポーネントは、HTMLの`<img>`要素を拡張し、自動画像最適化を提供します:

- **サイズ最適化**: 各デバイスに適したサイズの画像を自動的に提供
- **視覚的安定性**: 画像読み込み時のレイアウトシフトを自動的に防止
- **高速なページ読み込み**: ネイティブブラウザの遅延読み込みを使用し、オプションでぼかしプレースホルダー付き
- **アセットの柔軟性**: リモートサーバー上の画像でもオンデマンドで画像サイズ変更

## インポート

```typescript
import Image from 'next/image'
```

## 基本的な使い方

### ローカル画像

ローカル画像ファイルをインポートして使用:

```typescript
import Image from 'next/image'
import profilePic from './me.png'

export default function Page() {
  return (
    <Image
      src={profilePic}
      alt="著者の写真"
    />
  )
}
```

静的インポートを使用すると、Next.jsが自動的に画像の`width`と`height`を判断します。

### リモート画像

リモート画像を使用する場合は、`src`にURL文字列を指定し、`width`と`height`を明示的に指定する必要があります:

```typescript
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="https://example.com/profile.png"
      alt="著者の写真"
      width={500}
      height={500}
    />
  )
}
```

## Props

### 必須Props

#### `src`

画像のソースを指定します。以下のいずれかの形式:

1. **静的インポート**: ローカル画像ファイル
2. **パス文字列**: 絶対外部URLまたは内部パス

```typescript
// 静的インポート
import profilePic from './profile.png'
<Image src={profilePic} alt="プロフィール" />

// 外部URL
<Image
  src="https://example.com/image.png"
  alt="画像"
  width={500}
  height={500}
/>

// 内部パス
<Image
  src="/images/profile.png"
  alt="画像"
  width={500}
  height={500}
/>
```

#### `alt`

画像の代替テキスト。アクセシビリティとSEOに重要です。

```typescript
<Image
  src="/profile.png"
  alt="ジョン・スミスのプロフィール写真"
  width={500}
  height={500}
/>
```

画像が装飾的である場合や、周囲のテキストで説明されている場合は、空文字列にできます:

```typescript
<Image
  src="/decorative.png"
  alt=""
  width={500}
  height={500}
/>
```

### オプションProps

#### `width` と `height`

画像の幅と高さをピクセル単位で指定します。

```typescript
<Image
  src="/profile.png"
  alt="プロフィール"
  width={500}
  height={500}
/>
```

**注意**:
- 静的インポートの場合は自動的に推論されるため不要
- `fill`プロパティを使用する場合は不要
- アスペクト比を維持するために重要

#### `fill`

親要素いっぱいに画像を拡張します。`width`と`height`の代わりに使用します。

```typescript
<div style={{ position: 'relative', width: '300px', height: '200px' }}>
  <Image
    src="/profile.png"
    alt="プロフィール"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>
```

**注意**:
- 親要素は`position: relative`、`position: fixed`、または`position: absolute`である必要があります
- デフォルトで`position: absolute`が適用されます

#### `quality`

画像の品質を1〜100で指定します (100が最高品質)。

```typescript
<Image
  src="/profile.png"
  alt="プロフィール"
  width={500}
  height={500}
  quality={75} // デフォルト: 75
/>
```

#### `priority`

`true`の場合、画像はプリロードされ、遅延読み込みが無効になります。LCP (Largest Contentful Paint) 要素となる画像に使用します。

```typescript
<Image
  src="/hero.png"
  alt="ヒーロー画像"
  width={1200}
  height={600}
  priority
/>
```

#### `placeholder`

画像読み込み中のプレースホルダー。`blur`、`empty`、または`data:image/...`のいずれか。

```typescript
// ぼかしプレースホルダー
<Image
  src="/profile.png"
  alt="プロフィール"
  width={500}
  height={500}
  placeholder="blur"
  blurDataURL="data:image/png;base64,..."
/>

// 空のプレースホルダー (デフォルト)
<Image
  src="/profile.png"
  alt="プロフィール"
  width={500}
  height={500}
  placeholder="empty"
/>
```

#### `blurDataURL`

`placeholder="blur"`の場合に使用されるData URLです。Base64エンコードされた画像である必要があります。

```typescript
<Image
  src="/profile.png"
  alt="プロフィール"
  width={500}
  height={500}
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
/>
```

静的インポートの場合は自動的に生成されます。

#### `sizes`

異なるブレークポイントでの画像サイズを指定します。レスポンシブ画像に重要です。

```typescript
<Image
  src="/profile.png"
  alt="プロフィール"
  width={500}
  height={500}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

#### `style`

画像要素にCSSスタイルを適用します。

```typescript
<Image
  src="/profile.png"
  alt="プロフィール"
  width={500}
  height={500}
  style={{
    borderRadius: '50%',
    border: '2px solid white',
  }}
/>
```

#### `loading`

画像の読み込み動作。`lazy` (遅延読み込み) または`eager` (即座に読み込み)。

```typescript
<Image
  src="/profile.png"
  alt="プロフィール"
  width={500}
  height={500}
  loading="lazy" // デフォルト: 'lazy' (priorityがfalseの場合)
/>
```

#### その他のProps

- `className`: CSSクラス名
- `onLoad`: 画像読み込み完了時のコールバック
- `onError`: 画像読み込みエラー時のコールバック
- `unoptimized`: `true`の場合、画像最適化を無効化

## 設定オプション

`next.config.js`で画像最適化の設定をカスタマイズできます。

### remotePatterns

リモート画像のホスト名とパターンを許可します:

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
}
```

### deviceSizes

デバイスサイズのブレークポイントを定義します:

```javascript
// next.config.js
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### imageSizes

画像サイズのブレークポイントを定義します:

```javascript
// next.config.js
module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### formats

サポートする画像フォーマットを指定します:

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}
```

### minimumCacheTTL

最適化された画像のキャッシュ時間 (秒) を指定します:

```javascript
// next.config.js
module.exports = {
  images: {
    minimumCacheTTL: 60, // デフォルト: 60秒
  },
}
```

## 使用例

### レスポンシブ画像

```typescript
<Image
  src="/hero.png"
  alt="ヒーロー画像"
  width={1200}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{
    width: '100%',
    height: 'auto',
  }}
/>
```

### 背景画像

```typescript
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="/background.png"
    alt="背景"
    fill
    style={{
      objectFit: 'cover',
      objectPosition: 'center',
    }}
  />
  <div style={{ position: 'relative', zIndex: 1 }}>
    <h1>コンテンツ</h1>
  </div>
</div>
```

### 円形プロフィール画像

```typescript
<Image
  src="/profile.png"
  alt="プロフィール"
  width={200}
  height={200}
  style={{
    borderRadius: '50%',
  }}
/>
```

### サムネイルグリッド

```typescript
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '1rem',
}}>
  {images.map((image) => (
    <div key={image.id} style={{ position: 'relative', aspectRatio: '1' }}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  ))}
</div>
```

### 遅延読み込みとプレースホルダー

```typescript
<Image
  src="/large-image.png"
  alt="大きな画像"
  width={1200}
  height={800}
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgo..."
  loading="lazy"
/>
```

### アートディレクション (picture要素の代替)

異なるアスペクト比の画像を使用:

```typescript
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function ResponsiveImage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Image
      src={isMobile ? '/mobile-image.png' : '/desktop-image.png'}
      alt="レスポンシブ画像"
      width={isMobile ? 400 : 1200}
      height={isMobile ? 600 : 600}
    />
  )
}
```

### テーマ対応画像

```typescript
'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function ThemedImage() {
  const { theme } = useTheme()

  return (
    <Image
      src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
      alt="ロゴ"
      width={200}
      height={50}
    />
  )
}
```

## パフォーマンスの最適化

### 1. 適切なサイズの使用

画像の表示サイズに合わせた`width`と`height`を指定:

```typescript
// 良い例: 表示サイズに合わせる
<Image src="/image.png" width={400} height={300} alt="..." />

// 悪い例: 不必要に大きい
<Image src="/image.png" width={4000} height={3000} alt="..." />
```

### 2. sizesプロパティの活用

レスポンシブ画像には`sizes`を指定:

```typescript
<Image
  src="/image.png"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="..."
/>
```

### 3. priorityの適切な使用

LCP要素のみに`priority`を使用:

```typescript
// ヒーロー画像などの最初に表示される重要な画像
<Image src="/hero.png" priority alt="..." width={1200} height={600} />
```

### 4. 最新の画像フォーマット

WebPやAVIFフォーマットを有効化:

```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

## トラブルシューティング

### 画像が表示されない

1. **リモート画像**: `next.config.js`の`remotePatterns`を確認
2. **パス**: 画像ファイルのパスが正しいか確認
3. **サイズ**: `width`と`height`が指定されているか確認 (静的インポート以外)

### レイアウトシフトが発生する

1. **アスペクト比**: `width`と`height`を正確に指定
2. **fillプロパティ**: 使用する場合は親要素に明確なサイズを指定

### 最適化が機能しない

1. **設定**: `next.config.js`の画像設定を確認
2. **unoptimized**: `unoptimized`プロパティが`true`になっていないか確認
3. **開発環境**: 本番ビルドで確認 (`npm run build && npm start`)

## ベストプラクティス

1. **alt属性を常に指定**: アクセシビリティのために必須
2. **適切なサイズを使用**: 表示サイズに合わせた画像を使用
3. **sizesを指定**: レスポンシブ画像には必ず指定
4. **priorityは慎重に**: LCP要素のみに使用
5. **placeholderを活用**: ユーザーエクスペリエンス向上のために使用
6. **最新フォーマット**: WebP/AVIFを有効化
7. **remotePatterns**: リモート画像は明示的に許可

## まとめ

`<Image>`コンポーネントは、Next.jsアプリケーションで画像を最適化するための強力なツールです。自動的な画像最適化、遅延読み込み、レスポンシブ画像のサポートにより、パフォーマンスとユーザーエクスペリエンスが大幅に向上します。適切な設定とプロパティを使用して、最高のパフォーマンスを実現してください。
