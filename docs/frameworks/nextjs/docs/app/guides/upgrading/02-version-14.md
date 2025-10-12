# Next.js Version 14 へのアップグレード

このガイドは、Next.js アプリケーションをバージョン 14 にアップグレードする方法を説明します。

## アップグレードコマンド

Next.js バージョン 14 に更新するには、以下のいずれかのコマンドを実行します:

```bash
npm i next@14 react@latest react-dom@latest
npm i eslint-config-next@14 -D
```

**または:**

```bash
yarn add next@14 react@latest react-dom@latest
yarn add eslint-config-next@14 -D
```

**または:**

```bash
pnpm i next@14 react@latest react-dom@latest
pnpm i eslint-config-next@14 -D
```

> **注意:** TypeScript を使用している場合は、`@types/react` および `@types/react-dom` も最新バージョンにアップグレードしてください。

## バージョン 14 の主な変更点

### 1. Node.js バージョン要件

- **最小バージョン**: 18.17 以上
- **以前の要件**: 16.14
- **理由**: Node.js 16 はサポート終了 (EOL) に達しました

```json
{
  "engines": {
    "node": ">=18.17"
  }
}
```

### 2. 非推奨機能の削除

#### `next export` コマンドの削除

`next export` コマンドは削除され、`output: 'export'` 設定に置き換えられました。

**変更前:**

```bash
next build && next export
```

**変更後:**

`next.config.js` に以下を追加:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
}

module.exports = nextConfig
```

そして、以下を実行:

```bash
next build
```

### 3. インポートの変更

#### `ImageResponse` のインポート

`next/server` から `next/og` にインポートが移動しました。

**変更前:**

```javascript
import { ImageResponse } from 'next/server'
```

**変更後:**

```javascript
import { ImageResponse } from 'next/og'
```

**自動移行:**

```bash
npx @next/codemod@latest next-og-import .
```

### 4. フォントパッケージの変更

#### `@next/font` パッケージの削除

`@next/font` パッケージは完全に削除され、組み込みの `next/font` に統合されました。

**変更前:**

```javascript
import { Inter } from '@next/font/google'
```

**変更後:**

```javascript
import { Inter } from 'next/font/google'
```

**自動移行:**

```bash
npx @next/codemod@latest built-in-next-font .
```

### 5. WASM ターゲットの削除

`next-swc` の WASM ターゲットが削除されました。これは主に内部的な変更であり、ほとんどのユーザーには影響しません。

## アップグレード手順

### ステップ 1: 依存関係の更新

```bash
npm i next@14 react@latest react-dom@latest
npm i eslint-config-next@14 -D
```

### ステップ 2: TypeScript 型定義の更新 (該当する場合)

```bash
npm i @types/react@latest @types/react-dom@latest -D
```

### ステップ 3: Codemod の実行

```bash
# ImageResponse インポートの移行
npx @next/codemod@latest next-og-import .

# フォントインポートの移行
npx @next/codemod@latest built-in-next-font .
```

### ステップ 4: 設定ファイルの更新

`next export` を使用していた場合は、`next.config.js` を更新します:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // next export の代替
}

module.exports = nextConfig
```

### ステップ 5: アプリケーションのテスト

```bash
npm run dev
```

開発サーバーを起動し、アプリケーションが正しく動作することを確認します。

### ステップ 6: 本番ビルドの確認

```bash
npm run build
```

本番ビルドが正常に完了することを確認します。

## 既知の問題と対処法

### Node.js バージョンエラー

Node.js 18.17 未満を使用している場合、以下のエラーが表示される可能性があります:

```
Error: Next.js requires Node.js 18.17 or later
```

**対処法:**
Node.js 18.17 以上にアップグレードしてください。

### `next export` エラー

`next export` コマンドを使用している場合、以下のエラーが表示されます:

```
Error: The "next export" command has been removed
```

**対処法:**
`next.config.js` に `output: 'export'` を追加し、`next build` のみを使用してください。

## 追加のリソース

- [Next.js 14 リリースブログ](https://nextjs.org/blog/next-14)
- [Next.js ドキュメント](https://nextjs.org/docs)
- [Next.js GitHub リポジトリ](https://github.com/vercel/next.js)

## まとめ

Next.js 14 へのアップグレードは比較的簡単です。主な変更点は:

- Node.js 18.17 以上が必須
- `next export` から `output: 'export'` への移行
- `ImageResponse` のインポート先の変更
- `@next/font` から `next/font` への移行

Codemod を使用することで、多くの変更を自動化でき、手動での修正を最小限に抑えることができます。
