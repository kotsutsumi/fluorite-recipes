# 関数とディレクティブ

## ディレクティブ

ディレクティブは、特別な機能を持つTailwind固有のカスタムat-ルールです。

### @import

CSSファイルをインラインでインポートするために使用します。

```css
@import "tailwindcss";
```

### @theme

フォント、カラー、ブレークポイントなどのカスタムデザイントークンを定義します。

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  /* その他のテーマ変数 */
}
```

### @source

コンテンツ検出のためのソースファイルを明示的に指定します。

```css
@source "../node_modules/@my-company/ui-lib";
```

### @utility

バリアントと連携するカスタムユーティリティを追加します。

```css
@utility tab-4 {
  tab-size: 4;
}
```

### @variant

TailwindバリアントをCSSスタイルに適用します。

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
```

### @custom-variant

カスタムバリアントを作成します。

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

### @apply

既存のユーティリティクラスをカスタムCSSにインライン化します。

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
```

### @reference

CSSを重複させずにテーマ変数をインポートします。

```css
@reference "../../app.css";
```

## 関数

### --alpha()

カラーの不透明度を調整します。

```css
color: --alpha(var(--color-lime-300) / 50%);
```

### --spacing()

テーマからスペーシング値を生成します。

```css
margin: --spacing(4);
```

## 互換性ディレクティブ

### @config

レガシーJavaScript設定を読み込みます。

```css
@config "../../tailwind.config.js";
```

### @plugin

レガシーJavaScriptプラグインを読み込みます。

このドキュメントは、Tailwind CSSで利用可能なすべてのディレクティブと関数について包括的な概要を提供し、フレームワークのカスタマイズと拡張の方法を示しています。
