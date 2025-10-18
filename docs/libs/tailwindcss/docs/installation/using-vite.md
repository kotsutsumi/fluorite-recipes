# ViteでのTailwind CSSの使用

## 概要

Tailwind CSSは「すべてのHTMLファイル、JavaScriptコンポーネント、およびその他のテンプレートをスキャンしてクラス名を検出し、対応するスタイルを生成して静的CSSファイルに書き出す」ことで動作します。高速で柔軟性があり、信頼性が高く、ランタイムがゼロであることが特徴です。

## インストール手順

### 1. プロジェクトの作成

Create Viteを使用して新しいプロジェクトをセットアップします。

```bash
npm create vite@latest my-project
cd my-project
```

### 2. Tailwind CSSのインストール

```bash
npm install tailwindcss @tailwindcss/vite
```

### 3. Viteプラグインの設定

`vite.config.js`ファイルを以下のように設定します：

```javascript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

### 4. Tailwind CSSのインポート

CSSファイルにTailwindをインポートします：

```css
@import "tailwindcss";
```

### 5. ビルドプロセスの開始

開発サーバーを起動します：

```bash
npm run dev
```

### 6. HTMLでTailwindを使用

```html
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/src/style.css" rel="stylesheet">
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```

## 追加情報

- この方法は、Laravel、SvelteKit、React Router、Nuxt、SolidJSなどのフレームワークに推奨されます
- セットアップで問題が発生した場合は、フレームワーク固有のガイドを確認することをお勧めします
