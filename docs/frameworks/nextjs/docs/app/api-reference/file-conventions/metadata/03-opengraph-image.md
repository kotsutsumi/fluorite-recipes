# opengraph-image と twitter-image

`opengraph-image` と `twitter-image` ファイル規約を使用して、ルートセグメントのソーシャルメディア共有画像を設定できます。

これらは、ユーザーがサイトへのリンクを共有したときにソーシャルネットワークやメッセージングアプリに表示される画像を設定するのに役立ちます。

## 画像ファイルの使用 (.jpg, .jpeg, .png, .gif)

ルートセグメントに画像ファイルを配置することで、共有画像を設定できます。

### ファイル規約

```
app/
├── opengraph-image.jpg          # Open Graph画像
├── opengraph-image.alt.txt      # Alt text(オプション)
├── twitter-image.jpg            # Twitter画像
└── twitter-image.alt.txt        # Alt text(オプション)
```

### サポートされているファイル形式

- `.jpg`
- `.jpeg`
- `.png`
- `.gif`

### 基本的な使い方

```
app/
├── opengraph-image.png
└── twitter-image.png
```

Next.jsは自動的に以下のメタタグを生成します:

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

### Alt Textの追加

画像と同じディレクトリに `.alt.txt` ファイルを作成します:

```txt
// app/opengraph-image.alt.txt
About Acme Corporation
```

生成されるHTML:

```html
<meta property="og:image:alt" content="About Acme Corporation" />
```

## コードを使用した画像生成 (.js, .ts, .tsx)

画像ファイルを直接使用するだけでなく、コードを使用してプログラマティックに画像を生成できます。

### 基本的な使い方

```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

// 画像のメタデータ
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// 画像生成
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

### 設定オプション

#### alt

画像のalt textを設定します:

```typescript
export const alt = 'About Acme'
```

#### size

画像のサイズを設定します:

```typescript
export const size = {
  width: 1200,
  height: 630,
}

// または単一の値
export const size = { width: 1200, height: 1200 }
```

推奨サイズ:
- **Open Graph**: 1200 x 630 pixels
- **Twitter**: 1200 x 628 pixels (最小 600 x 314)

#### contentType

画像のMIMEタイプを設定します:

```typescript
export const contentType = 'image/png'
```

サポートされる値:
- `'image/png'` (デフォルト)
- `'image/jpeg'`
- `'image/gif'`

## 実践例

### カスタムスタイルの画像

```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const alt = 'Acme - Building the future'
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #0066cc, #00ccff)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '60px',
          }}
        >
          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: '#000',
              margin: '0',
            }}
          >
            Acme Corporation
          </h1>
          <p
            style={{
              fontSize: '32px',
              color: '#666',
              margin: '20px 0 0 0',
            }}
          >
            Building the future
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
```

### 動的データの使用

ルートパラメータや外部データを使用できます:

```typescript
// app/posts/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const alt = 'Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  // 投稿データを取得
  const post = await fetch(`https://api.example.com/posts/${params.slug}`).then(
    (res) => res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <h1 style={{ fontSize: '72px', margin: '0' }}>{post.title}</h1>
        <p style={{ fontSize: '32px', margin: '20px 0', color: '#666' }}>
          {post.excerpt}
        </p>
        <div style={{ fontSize: '24px', color: '#999' }}>
          By {post.author} • {post.date}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
```

### カスタムフォントの使用

```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // フォントデータを読み込む
  const interSemiBold = await fetch(
    new URL('./Inter-SemiBold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

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
          fontFamily: 'Inter',
        }}
      >
        About Acme
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  )
}
```

### 画像の組み込み

Base64エンコードされた画像を使用できます:

```typescript
// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  // 画像を読み込む
  const imageData = await fetch(
    new URL('./logo.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={`data:image/png;base64,${Buffer.from(imageData).toString('base64')}`}
          alt="Logo"
          width="400"
          height="400"
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
```

## Twitter専用画像

Twitter用に異なる画像を使用する場合:

```typescript
// app/twitter-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 628 }
export const alt = 'Acme on Twitter'
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#1DA1F2', // Twitter blue
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        @acme
      </div>
    ),
    {
      ...size,
    }
  )
}
```

## 複数の画像

番号付きサフィックスを使用して複数の画像を追加できます:

```
app/
├── opengraph-image.png
├── opengraph-image1.png
└── opengraph-image2.png
```

## ルート階層

画像はルート階層に従って解決されます:

```
app/
├── opengraph-image.png              # すべてのルートに適用
├── about/
│   └── opengraph-image.png         # /about に適用
└── blog/
    ├── opengraph-image.png          # /blog/* に適用
    └── [slug]/
        └── opengraph-image.png      # /blog/[slug] に適用
```

## ルートセグメント設定

`opengraph-image` と `twitter-image` は、ページと同じルートセグメント設定オプションを使用できます:

```typescript
// app/opengraph-image.tsx
export const runtime = 'edge'

export default async function Image() {
  // ...
}
```

## 生成される出力

### Open Graph

```html
<meta property="og:image" content="<generated>" />
<meta property="og:image:alt" content="<generated>" />
<meta property="og:image:type" content="<generated>" />
<meta property="og:image:width" content="<generated>" />
<meta property="og:image:height" content="<generated>" />
```

### Twitter

```html
<meta name="twitter:image" content="<generated>" />
<meta name="twitter:image:alt" content="<generated>" />
<meta name="twitter:image:type" content="<generated>" />
<meta name="twitter:image:width" content="<generated>" />
<meta name="twitter:image:height" content="<generated>" />
```

## ベストプラクティス

### 1. 適切なサイズの使用

各プラットフォームの推奨サイズを使用します:

- **Open Graph**: 1200 x 630 pixels
- **Twitter**: 1200 x 628 pixels
- **最小サイズ**: 600 x 314 pixels

### 2. Alt Textの提供

アクセシビリティのため、常にalt textを提供します:

```typescript
export const alt = '明確で説明的なalt text'
```

### 3. ファイルサイズの最適化

- PNG: 透明度が必要な場合
- JPEG: 写真や複雑な画像
- GIF: アニメーション(控えめに使用)

### 4. テキストの可読性

背景とのコントラストを確保します:

```typescript
<div
  style={{
    background: 'black',
    color: 'white', // 高いコントラスト
    // ...
  }}
>
  Your Content
</div>
```

### 5. ブランディングの一貫性

すべての共有画像で一貫したブランディングを維持します:

```typescript
const brandColors = {
  primary: '#0066cc',
  secondary: '#00ccff',
  background: 'white',
}
```

## パフォーマンス

- 静的画像はビルド時に最適化されます
- 動的に生成された画像はキャッシュされます
- エッジランタイムを使用して高速な生成を実現できます

```typescript
export const runtime = 'edge'
```

## バージョン履歴

- **v13.3.0**: `opengraph-image` と `twitter-image` が導入されました

## 関連項目

- [メタデータAPI](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/metadata)
- [ImageResponse](/docs/frameworks/nextjs/docs/app/api-reference/functions/image-response)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
