# Font

フォントモジュール (`next/font`) を使用すると、Webフォントを最適化できます。このモジュールは、プライバシーとパフォーマンスを向上させるために、外部ネットワークリクエストを削除し、フォントファイルを自動的にセルフホスティングします。

## 概要

`next/font` は以下の機能を提供します:

- **自動最適化**: フォントファイルを自動的に最適化し、セルフホスティングします
- **プライバシー保護**: 外部ネットワークリクエストを削除し、Googleなどにリクエストを送信しません
- **パフォーマンス向上**: カスタムフォントロジックでレイアウトシフトを防止します
- **Google Fontsサポート**: すべてのGoogle Fontsに対応
- **ローカルフォント対応**: カスタムフォントファイルの使用が可能

## Google Fontsの使用

### 基本的な使い方

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 可変フォントの使用

可変フォント (Variable Fonts) を使用することを推奨します。可変フォントは、1つのフォントファイルで複数のウェイトとスタイルを含むことができます。

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})
```

### 複数のウェイトとスタイル

可変フォントでない場合は、ウェイトとスタイルを明示的に指定する必要があります:

```typescript
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})
```

## 設定オプション

### Google Fontsのオプション

| オプション | 型 | 説明 | 必須 |
|-----------|-----|------|------|
| `weight` | `string \| string[]` | フォントウェイト (可変フォント以外は必須) | 条件付き |
| `style` | `string \| string[]` | フォントスタイル ('normal', 'italic') | いいえ |
| `subsets` | `string[]` | フォントサブセット (例: ['latin', 'latin-ext']) | はい |
| `display` | `string` | フォント表示戦略 ('auto', 'block', 'swap', 'fallback', 'optional') | いいえ |
| `preload` | `boolean` | フォントをプリロードするかどうか (デフォルト: true) | いいえ |
| `variable` | `string` | CSS変数名 | いいえ |
| `adjustFontFallback` | `boolean` | フォールバックフォントの調整 (デフォルト: true) | いいえ |

### displayオプション

`display`オプションは、フォントの読み込み中にテキストをどのように表示するかを制御します:

- `auto`: ブラウザのデフォルト動作
- `block`: フォントが読み込まれるまでテキストを非表示
- `swap`: フォールバックフォントでテキストを即座に表示し、読み込み後に切り替え
- `fallback`: `swap`と似ているが、短いブロック期間がある
- `optional`: フォールバックフォントでテキストを表示し、フォントが利用可能な場合のみ使用

## ローカルフォントの使用

カスタムフォントファイルを使用する場合は、`next/font/local`をインポートします:

```typescript
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

### 複数のフォントファイル

複数のウェイトやスタイルを持つフォントを使用する場合:

```typescript
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    {
      path: './my-font-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './my-font-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './my-font-italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  display: 'swap',
})
```

### ローカルフォントのオプション

| オプション | 型 | 説明 | 必須 |
|-----------|-----|------|------|
| `src` | `string \| Array<{path: string, weight?: string, style?: string}>` | フォントファイルのパス | はい |
| `weight` | `string` | フォントウェイト | いいえ |
| `style` | `string` | フォントスタイル | いいえ |
| `display` | `string` | フォント表示戦略 | いいえ |
| `preload` | `boolean` | プリロードするかどうか | いいえ |
| `variable` | `string` | CSS変数名 | いいえ |
| `adjustFontFallback` | `boolean` | フォールバックフォントの調整 | いいえ |

## 適用方法

### classNameによる適用

最も一般的な方法は、`className`プロパティを使用することです:

```typescript
export default function Page() {
  return (
    <div className={inter.className}>
      <h1>Hello World</h1>
    </div>
  )
}
```

### styleプロパティによる適用

インラインスタイルを使用してフォントを適用することもできます:

```typescript
export default function Page() {
  return (
    <div style={inter.style}>
      <h1>Hello World</h1>
    </div>
  )
}
```

### CSS変数による適用

CSS変数を使用すると、Tailwind CSSなどのユーティリティクラスと組み合わせることができます:

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

CSS内で変数を使用:

```css
.my-class {
  font-family: var(--font-inter);
}
```

Tailwind CSSの設定:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
}
```

## 複数のフォントを使用

アプリケーション内で複数のフォントを使用できます:

```typescript
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

## パフォーマンスの最適化

### 可変フォントを優先

可変フォントは、複数のウェイトとスタイルを1つのファイルで提供するため、パフォーマンスが向上します。

### フォントサブセットの指定

必要な文字セットのみを読み込むことで、フォントファイルのサイズを削減できます:

```typescript
const inter = Inter({
  subsets: ['latin'], // 必要なサブセットのみを指定
})
```

### preloadの最適化

重要なフォントのみをプリロードし、その他はレイジーロードすることを検討してください:

```typescript
const inter = Inter({
  subsets: ['latin'],
  preload: true, // 重要なフォント
})

const secondaryFont = Roboto({
  subsets: ['latin'],
  preload: false, // 重要度の低いフォント
})
```

## ベストプラクティス

1. **可変フォントを使用**: 可能な限り可変フォントを使用して、ファイルサイズとリクエスト数を削減
2. **サブセットを指定**: 必要な文字セットのみを読み込む
3. **display: 'swap'を使用**: フォント読み込み中もテキストを表示して、ユーザーエクスペリエンスを向上
4. **ルートレイアウトで定義**: 共通フォントはルートレイアウトで定義してアプリ全体で再利用
5. **CSS変数を活用**: Tailwind CSSなどのユーティリティフレームワークと統合しやすくする

## トラブルシューティング

### フォントが表示されない

- `subsets`が正しく指定されているか確認
- フォント名のスペルが正しいか確認
- Google Fontsの場合、フォントが利用可能か確認

### レイアウトシフトが発生する

- `adjustFontFallback`が有効になっているか確認 (デフォルトで有効)
- `display: 'swap'`を使用しているか確認

### ビルドエラー

- フォントファイルのパスが正しいか確認 (ローカルフォントの場合)
- TypeScriptの型定義が正しいか確認

## まとめ

`next/font`は、Next.jsアプリケーションでフォントを最適化するための強力なツールです。Google Fontsとローカルフォントの両方をサポートし、自動的にセルフホスティングとプリロードを処理します。可変フォントとサブセットの指定を活用して、最高のパフォーマンスを実現してください。
