# generateMetadata

## メタデータオブジェクト

静的メタデータを定義するには、`layout.js` または `page.js` ファイルから [`Metadata` オブジェクト](#metadata-fields)をエクスポートします。

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

## `generateMetadata` 関数

動的メタデータは、現在のルートパラメータ、外部データ、または親セグメントの `metadata` などの**動的情報**に依存します。[`Metadata` オブジェクト](#metadata-fields)を返す `generateMetadata` 関数をエクスポートすることで設定できます。

```typescript
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // ルートパラメータを読み取る
  const { id } = await params

  // データをフェッチ
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // 親メタデータにアクセスして拡張
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }: Props) {}
```

## 重要な注意点

- メタデータは `layout.js` と `page.js` セグメントでのみ利用可能です。
- `metadata` オブジェクトと `generateMetadata` 関数の両方は**サーバーコンポーネントでのみサポート**されています。
- 同じルートセグメントで `metadata` オブジェクトと `generateMetadata` 関数の両方をエクスポートすることはできません。
- HTTP リクエストを行う際は、fetch メモ化を使用してデータを一度だけ取得できます。

## メタデータフィールド

### `title`

`title` 属性は、ドキュメントのタイトルを設定するために使用されます。文字列または`template`オブジェクトとして定義できます。

```typescript
export const metadata: Metadata = {
  title: 'Next.js',
}
```

### `description`

```typescript
export const metadata: Metadata = {
  description: 'The React Framework for the Web',
}
```

### `keywords`

```typescript
export const metadata: Metadata = {
  keywords: ['Next.js', 'React', 'JavaScript'],
}
```

### `openGraph`

```typescript
export const metadata: Metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

### `robots`

```typescript
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
}
```

### `icons`

```typescript
export const metadata: Metadata = {
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
  },
}
```

### `twitter`

```typescript
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    creator: '@nextjs',
    images: ['https://nextjs.org/og.png'],
  },
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v13.2.0` | `metadata` と `generateMetadata` が導入されました |
