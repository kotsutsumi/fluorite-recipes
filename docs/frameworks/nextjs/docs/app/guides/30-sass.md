# Sass

Next.jsでSassを使用する方法について説明します。

## 概要

Next.jsは、Sassパッケージをインストール後、`.scss`と`.sass`の両方の拡張子でSassのサポートを組み込みで提供しています。

## インストール

Sassを使用するには、まず以下のコマンドでパッケージをインストールします：

```bash
npm install --save-dev sass
# または
yarn add --dev sass
# または
pnpm add --save-dev sass
```

## 重要なポイント

- `.scss`拡張子は標準のCSS互換の構文を使用
- `.sass`拡張子はインデント形式の構文を使用
- 初心者は`.scss`拡張子から始めることを推奨

## コンポーネントレベルのSass

Next.jsでは、CSS Modulesを使用してコンポーネントレベルでSassをインポートできます。

```scss
// app/components/Button.module.scss
.error {
  color: white;
  background-color: red;
}
```

```tsx
// app/components/Button.tsx
import styles from './Button.module.scss'

export function Button() {
  return (
    <button
      type="button"
      // "error" クラスが <button> 要素にアクセス可能
      className={styles.error}
    >
      Destroy
    </button>
  )
}
```

## グローバルスタイルシート

```scss
// app/globals.scss
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```tsx
// app/layout.tsx
import './globals.scss'

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

## Sassオプションのカスタマイズ

### 基本的な設定

`next.config.js`で`sassOptions`を使用してSassの設定をカスタマイズできます：

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `$var: red;`,
  },
}

export default nextConfig
```

#### additionalData

すべてのSassファイルに自動的に追加されるコードを指定します。変数やミックスインをグローバルに利用可能にする場合に便利です。

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  sassOptions: {
    additionalData: `
      @import "@/styles/variables";
      @import "@/styles/mixins";
    `,
  },
}
```

#### includePaths

Sassファイルを検索する追加のパスを指定します：

```typescript
// next.config.ts
import path from 'path'

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
```

### Sass実装の指定

デフォルトでは`sass`パッケージを使用しますが、別の実装を指定することも可能：

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  sassOptions: {
    implementation: 'sass-embedded',
  },
}
```

## Sass変数のエクスポート

CSS Moduleファイルから変数をJavaScriptにエクスポートできます：

```scss
// styles/variables.module.scss
$primary-color: #64ff00;
$secondary-color: #0070f3;

:export {
  primaryColor: $primary-color;
  secondaryColor: $secondary-color;
}
```

```tsx
// app/page.tsx
import variables from '@/styles/variables.module.scss'

export default function Page() {
  return (
    <div>
      <h1 style={{ color: variables.primaryColor }}>
        Hello, Next.js!
      </h1>
      <p style={{ color: variables.secondaryColor }}>
        Sassの変数を使用しています
      </p>
    </div>
  )
}
```

## Sass変数とミックスイン

### 変数の使用

```scss
// styles/_variables.scss
$primary-color: #333;
$padding-default: 16px;
$border-radius: 4px;
```

```scss
// app/components/Card.module.scss
@import '@/styles/variables';

.card {
  padding: $padding-default;
  border-radius: $border-radius;
  background-color: white;

  .title {
    color: $primary-color;
  }
}
```

### ミックスインの使用

```scss
// styles/_mixins.scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin responsive($breakpoint) {
  @if $breakpoint == mobile {
    @media (max-width: 767px) { @content; }
  }
  @if $breakpoint == tablet {
    @media (min-width: 768px) and (max-width: 1023px) { @content; }
  }
  @if $breakpoint == desktop {
    @media (min-width: 1024px) { @content; }
  }
}
```

```scss
// app/components/Hero.module.scss
@import '@/styles/mixins';

.hero {
  @include flex-center;
  height: 100vh;

  @include responsive(mobile) {
    height: 50vh;
  }

  @include responsive(desktop) {
    height: 100vh;
  }
}
```

## ネスト

Sassの強力な機能の一つは、セレクタをネストできることです：

```scss
// app/components/Navigation.module.scss
.nav {
  background-color: #333;

  ul {
    list-style: none;
    padding: 0;

    li {
      display: inline-block;
      margin-right: 20px;

      a {
        color: white;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
```

## パーシャルとインポート

Sassファイルを小さなコンポーネントに分割し、他のファイルでインポートできます：

```scss
// styles/_typography.scss
@mixin heading {
  font-family: 'Arial', sans-serif;
  font-weight: bold;
}

.h1 {
  @include heading;
  font-size: 2rem;
}
```

```scss
// app/page.module.scss
@import '@/styles/typography';

.page {
  @extend .h1;
  color: #333;
}
```

## ベストプラクティス

### 1. パーシャルファイルには_プレフィックスを使用

```
styles/
├── _variables.scss
├── _mixins.scss
├── _typography.scss
└── globals.scss
```

### 2. 変数は一箇所で管理

```scss
// styles/_variables.scss
// カラーパレット
$color-primary: #0070f3;
$color-secondary: #7928ca;
$color-error: #ff0000;

// スペーシング
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;

// ブレークポイント
$breakpoint-mobile: 768px;
$breakpoint-tablet: 1024px;
```

### 3. ミックスインで再利用性を高める

```scss
// styles/_mixins.scss
@mixin button-base {
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}
```

### 4. @use と @forward を使用（モダンな方法）

```scss
// styles/_config.scss
$primary-color: #0070f3;
```

```scss
// styles/index.scss
@forward 'config';
```

```scss
// app/component.module.scss
@use '@/styles' as *;

.button {
  background-color: $primary-color;
}
```

## 注意点

### パフォーマンス

- 不必要なネストを避ける（最大3レベル）
- グローバルスタイルは最小限に
- 使用していないスタイルは削除

### CSS Modulesとの併用

```scss
// ローカルスコープ
.button {
  background-color: blue;
}

// グローバルスコープ
:global(.highlight) {
  background-color: yellow;
}
```

## 次のステップ

- [CSS Modules](/docs/app/building-your-application/styling/css-modules)
- [Tailwind CSS](/docs/app/building-your-application/styling/tailwind-css)
- [CSS-in-JS](/docs/app/building-your-application/styling/css-in-js)
