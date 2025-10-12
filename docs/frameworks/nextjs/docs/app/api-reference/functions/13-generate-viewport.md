# generateViewport

Web ページの初期ビューポートをカスタマイズするための機能です。

> **注意**:
> - `viewport` オブジェクトと `generateViewport` 関数は**サーバーコンポーネントでのみサポート**されています。
> - 同じルートセグメントで `viewport` オブジェクトと `generateViewport` 関数の両方をエクスポートすることはできません。

## ビューポートオブジェクト

`layout.jsx` または `page.jsx` ファイルからビューポートオプションを定義するには、`viewport` オブジェクトをエクスポートします。

```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}

export default function Page() {}
```

## `generateViewport` 関数

`generateViewport` は、1つ以上のビューポートフィールドを含む [`Viewport`](#ビューポートフィールド) オブジェクトを返す必要があります。

```typescript
export function generateViewport({ params }) {
  return {
    themeColor: '...',
  }
}
```

## ビューポートフィールド

### `themeColor`

テーマカラーを設定します。

**シンプルなテーマカラー**:

```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: 'black',
}
```

```html
<meta name="theme-color" content="black" />
```

**メディア属性付きのテーマカラー**:

```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
```

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="cyan" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="black" />
```

### `width`、`initialScale`、および `maximumScale`

```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}
```

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1"
/>
```

### `userScalable`

```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  userScalable: false,
}
```

```html
<meta name="viewport" content="user-scalable=no" />
```

### `colorScheme`

```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  colorScheme: 'dark',
}
```

```html
<meta name="color-scheme" content="dark" />
```

### `interactive-widget`

```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  interactiveWidget: 'resizes-visual',
}
```

```html
<meta name="viewport" content="interactive-widget=resizes-visual" />
```

## 動的ビューポートの生成

```typescript
import type { Viewport } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const { id } = await params
  const theme = await getTheme(id)

  return {
    themeColor: theme.color,
    colorScheme: theme.scheme,
  }
}

export default async function Page({ params }: Props) {
  // ...
}
```

## バージョン履歴

| バージョン | 変更点 |
|-----------|--------|
| `v14.0.0` | `viewport` と `generateViewport` が導入されました |
