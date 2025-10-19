# SvelteKit on Vercel

## はじめに

SvelteKitは、サーバーサイドレンダリング、自動コード分割、高度なルーティングなどの最新技術を可能にするフロントエンドフレームワークです。

Vercelでは、ゼロ設定でSvelteKitプロジェクトをデプロイでき、以下の機能を利用できます：

- プレビューデプロイメント
- Web Analytics
- Vercelファンクション

## SvelteKitをVercelで始める

### インストール方法

1. 既存のSvelteKitプロジェクトがある場合:
   - Vercel CLIをインストール
   - プロジェクトのルートディレクトリで`vercel`コマンドを実行

2. テンプレートからデプロイ:
   - Vercelのテンプレートマーケットプレイスから選択
   - GitプロバイダーにクローンしてVercelでデプロイ

## Vercelアダプターの設定

### パッケージのインストール

```bash
pnpm i @sveltejs/adapter-vercel
```

### Svelte設定ファイルの更新

`svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-vercel';

export default {
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x',
    }),
  },
};
```

## 主な機能

### ストリーミング
- サーバー側でデータを非同期に読み込み
- UIの一部を早期にレンダリング

### サーバーサイドレンダリング (SSR)
- ページを動的にサーバーでレンダリング
- トラフィックに応じて自動スケーリング
