# Tailwind CSS v3

Next.jsでTailwind CSS v3を使用する方法を学びます。

## Tailwind CSSとは

Tailwind CSSは、ユーティリティファーストのCSSフレームワークで、カスタムデザインを素早く構築できます。Next.jsとシームレスに統合され、モダンなWebアプリケーションのスタイリングに最適です。

## インストール

Tailwind CSSと必要な依存関係をインストールします:

```bash
pnpm add -D tailwindcss@^3 postcss autoprefixer
```

次に、Tailwind CSSの設定ファイルを初期化します:

```bash
npx tailwindcss init -p
```

このコマンドは `tailwind.config.js` と `postcss.config.js` ファイルを作成します。

## 設定

### テンプレートパスの設定

`tailwind.config.js` ファイルを更新して、すべてのテンプレートファイルのパスを含めます:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

> **注意**: Pages Routerを使用している場合は、`./pages` パスも含める必要があります。

### Tailwindディレクティブの追加

グローバルCSSファイル（例: `app/globals.css`）にTailwindのディレクティブを追加します:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

これらのディレクティブは、Tailwindのベーススタイル、コンポーネント、ユーティリティクラスを注入します。

### CSSのインポート

ルートレイアウト（`app/layout.tsx`）でグローバルCSSをインポートします:

```typescript
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
```

## 使用方法

Tailwind CSSの設定が完了したら、コンポーネントでTailwindのユーティリティクラスを使用できます:

```typescript
export default function Page() {
  return <h1 className="text-3xl font-bold underline">Hello, Next.js!</h1>
}
```

## Turbopackとの互換性

Next.js 13.1以降、Tailwind CSSとPostCSSはTurbopackでサポートされています。開発環境でTurbopackを使用する場合でも、Tailwind CSSは正常に動作します。

```bash
pnpm dev --turbopack
```

## カスタマイズ

Tailwind CSSは高度にカスタマイズ可能です。`tailwind.config.js` ファイルでテーマを拡張できます:

```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
      },
    },
  },
  plugins: [],
}
```

## ダークモード

Tailwind CSS v3はダークモードをサポートしています。`tailwind.config.js` で戦略を設定できます:

```javascript
module.exports = {
  darkMode: 'class', // または 'media'
  // ...その他の設定
}
```

`class` 戦略を使用すると、HTML要素に `dark` クラスを追加することでダークモードを切り替えられます:

```typescript
<html className="dark">
  {/* ダークモードのスタイルが適用されます */}
</html>
```

## プラグイン

Tailwind CSSは、追加機能を提供する多くの公式プラグインをサポートしています:

```bash
pnpm add -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

設定ファイルでプラグインを有効にします:

```javascript
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

## 本番環境の最適化

Tailwind CSSは本番ビルド時に未使用のCSSを自動的に削除します。これにより、最終的なCSSファイルサイズが大幅に削減されます。

追加の設定は不要で、`next build` を実行すると自動的に最適化されます。

## リソース

- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Tailwind CSS Playground](https://play.tailwindcss.com/)
- [Tailwind UI](https://tailwindui.com/)
- [Next.js + Tailwind CSSの例](https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss)
