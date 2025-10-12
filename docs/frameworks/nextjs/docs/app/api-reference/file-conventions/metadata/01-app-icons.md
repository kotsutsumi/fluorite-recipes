# app-icons

アプリアイコンは、Webアプリケーションのアイコンを設定するためのNext.jsのファイル規約です。

## ファイルベースのアイコン設定

Next.jsでは、画像ファイルを使用してアプリアイコンを設定できます。

### サポートされているファイルタイプと配置場所

#### favicon.ico
- **配置場所**: ルートの `/app` ディレクトリのみ
- **サポートされるファイルタイプ**: `.ico`

#### icon
- **配置場所**: 任意の `app/**/*` ディレクトリ
- **サポートされるファイルタイプ**: `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg`

#### apple-icon
- **配置場所**: 任意の `app/**/*` ディレクトリ
- **サポートされるファイルタイプ**: `.jpg`, `.jpeg`, `.png`

### 基本的な使い方

```
app/
├── favicon.ico        # ファビコン(ルートのみ)
├── icon.png          # 汎用アイコン
└── apple-icon.png    # Apple固有のアイコン
```

### 複数のアイコン

番号付きサフィックスを使用して、複数のアイコンを追加できます:

```
app/
├── icon1.png    # 32x32
├── icon2.png    # 64x64
└── icon3.png    # 128x128
```

### 自動生成されるHTMLタグ

Next.jsは自動的に適切な `<link>` タグを生成します:

```html
<link rel="icon" href="/icon.png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
```

## プログラマティックなアイコン生成

コードを使用して動的にアイコンを生成できます。

### 基本的な使い方

`icon.js`、`icon.ts`、または `icon.tsx` ファイルを作成し、デフォルトエクスポート関数を定義します:

```typescript
// app/icon.tsx
import { ImageResponse } from 'next/og'

// アイコンのサイズを設定
export const size = {
  width: 32,
  height: 32,
}

// コンテンツタイプを設定
export const contentType = 'image/png'

// アイコンを生成
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

### 設定オプション

#### size

アイコンのサイズを指定します:

```typescript
export const size = { width: 32, height: 32 }
```

#### contentType

画像のMIMEタイプを指定します:

```typescript
export const contentType = 'image/png'
```

サポートされる値:
- `'image/png'` (デフォルト)
- `'image/jpeg'`
- `'image/gif'`
- `'image/svg+xml'`

### 動的ルートパラメータの使用

動的ルートセグメントからパラメータを受け取ることができます:

```typescript
// app/blog/[slug]/icon.tsx
export default function Icon({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'blue',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 24,
        }}
      >
        {params.slug}
      </div>
    )
  )
}
```

### 外部データの使用

外部データを取得してアイコンを生成できます:

```typescript
// app/icon.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default async function Icon() {
  // 外部データを取得
  const data = await fetch('https://api.example.com/data').then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          background: data.color,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {data.name}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

## Apple固有のアイコン

Apple Touch Iconを生成する場合は、`apple-icon` を使用します:

```typescript
// app/apple-icon.tsx
import { ImageResponse } from 'next/og'

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
          background: 'linear-gradient(to bottom right, #1e3a8a, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 88,
          fontWeight: 'bold',
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

## ベストプラクティス

### 1. 適切なファイルタイプの選択

- **favicon.ico**: 従来のブラウザサポートのため
- **PNG**: 透明度が必要な場合
- **SVG**: スケーラブルなベクターグラフィックス
- **JPG**: 写真ベースのアイコン

### 2. 複数のサイズの提供

さまざまなデバイスとコンテキストに対応するため、複数のサイズを提供します:

```
app/
├── icon1.png    # 32x32  - ファビコン
├── icon2.png    # 128x128 - Androidホーム画面
├── icon3.png    # 192x192 - PWA
└── icon4.png    # 512x512 - スプラッシュ画面
```

### 3. プログラマティック生成の活用

動的または複雑なアイコンには、コード生成を使用します:

- ブランドカラーの動的適用
- ユーザー固有のアイコン
- 多言語対応のテキストアイコン

### 4. パフォーマンスの考慮

- 静的アイコンはビルド時に最適化されます
- 動的アイコンはキャッシュされます
- 適切なサイズを使用して不要なスケーリングを避けます

## ルートセグメント設定

`icon` と `apple-icon` は、ルートセグメント設定オプションを使用して動作をカスタマイズできます:

```typescript
// app/icon.tsx
export const runtime = 'edge' // エッジランタイムを使用

export default function Icon() {
  // ...
}
```

## バージョン履歴

- **v13.3.0**: `icon` と `apple-icon` が導入されました

## 関連項目

- [メタデータAPI](/docs/frameworks/nextjs/docs/app/building-your-application/optimizing/metadata)
- [ImageResponse](/docs/frameworks/nextjs/docs/app/api-reference/functions/image-response)
