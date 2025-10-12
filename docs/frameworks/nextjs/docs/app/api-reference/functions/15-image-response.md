# ImageResponse

`ImageResponse` コンストラクターは、JSXとCSSを使用して動的な画像を生成できます。ソーシャルメディア画像、Open Graph画像、Twitterカードなどの作成に便利です。

## リファレンス

### パラメーター

`ImageResponse` では、以下のパラメーターが利用可能です：

```typescript
import { ImageResponse } from 'next/og'

new ImageResponse(
  element: ReactElement,
  options: {
    width?: number = 1200
    height?: number = 630
    emoji?: 'twemoji' | 'blobmoji' | 'noto' | 'openmoji' = 'twemoji',
    fonts?: {
      name: string,
      data: ArrayBuffer,
      weight: number,
      style: 'normal' | 'italic'
    }[]
    debug?: boolean = false

    // HTTPレスポンスに渡されるオプション
    status?: number = 200
    statusText?: string
    headers?: Record<string, string>
  },
)
```

### サポートされているHTML・CSS機能

`ImageResponse` は、フレックスボックス、絶対配置、カスタムフォント、テキストの折り返し、センタリング、ネストされた画像などの一般的なCSSプロパティをサポートしています。

#### サポートされているHTMLエレメント

- `<div>`、`<span>`
- `<p>`
- `<img>`（外部URLの画像）

#### サポートされているCSSプロパティ

- フレックスボックス（`display: flex`、`flex-direction`、`justify-content`、`align-items` など）
- 絶対配置（`position: absolute`、`top`、`left`、`right`、`bottom`）
- カラー（`color`、`background-color`、`background-image`）
- フォント（`font-family`、`font-size`、`font-weight`、`font-style`）
- テキスト（`text-align`、`text-decoration`、`line-height`、`letter-spacing`）
- パディング（`padding`、`padding-top` など）
- マージン（`margin`、`margin-top` など）
- ボーダー（`border`、`border-radius`）
- トランスフォーム（`transform`、`translate`、`rotate`、`scale`）

## 動作

- `@vercel/og`、[Satori](https://github.com/vercel/satori)、Resvgを使用してHTMLとCSSをPNGに変換
- フレックスボックスと一部のCSSプロパティのみサポート
- 最大バンドルサイズは`500KB`
- サポートされるフォント形式は`ttf`、`otf`、`woff`

## 例

### ルートハンドラーでの基本的な使用

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET() {
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
        Hello world!
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

### Open Graph 画像の生成

```typescript
// app/about/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'About'
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
          fontSize: 48,
          background: 'linear-gradient(to bottom, #dbf4ff, #fff)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About our company
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
import { ImageResponse } from 'next/og'

export async function GET() {
  const fontData = await fetch(
    new URL('./fonts/Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          fontFamily: 'Inter',
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Hello world with custom font!
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}
```

### 動的データからの画像生成

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Default Title'

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
        <h1>{title}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v14.0.0` | `ImageResponse` が `next/og` から利用可能になりました |
| `v13.3.0` | `ImageResponse` が `@vercel/og` からインポート可能になりました |
| `v13.0.0` | `ImageResponse` が `@vercel/og` パッケージとして導入されました |
