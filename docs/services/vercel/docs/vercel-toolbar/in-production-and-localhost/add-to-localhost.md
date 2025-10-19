# ローカル環境へのVercel Toolbarの追加

## 概要

このドキュメントでは、`@vercel/toolbar`パッケージを使用して、ローカル開発環境でVercel Toolbarを有効にする方法を説明します。

## ツールバーを追加する手順

### 1. パッケージのインストール

パッケージマネージャーを使用してツールバーパッケージをインストール：

```bash
pnpm i @vercel/toolbar
```

### 2. プロジェクトのリンク

Vercel CLIを使用してローカルプロジェクトをVercelプロジェクトにリンク：

```bash
vercel link [path-to-directory]
```

### 3. Next.jsプロジェクトの設定

#### Next.js設定

`next.config.js`で、`withVercelToolbar`を定義してエクスポート：

```javascript
const createWithVercelToolbar = require('@vercel/toolbar/plugins/next');
const nextConfig = {
  // ここに設定オプション
};

const withVercelToolbar = createWithVercelToolbar();
module.exports = withVercelToolbar(nextConfig);
```

#### レイアウト設定

`layout.tsx`または`layout.jsx`で、ツールバーを追加：

```javascript
import { VercelToolbar } from '@vercel/toolbar/next';

export default function RootLayout({ children }) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
  return (
    <html lang="en">
      <body>
        {children}
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
```

このドキュメントは、Vercel Toolbarをローカル開発のNext.js環境に統合するための簡潔なガイドを提供します。
