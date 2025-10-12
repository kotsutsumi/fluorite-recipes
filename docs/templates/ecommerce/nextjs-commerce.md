# Next.js Commerce

## 概要

Shopifyとの高性能コマースのためのスターターキットです。

**デモ**: https://demo.vercel.store/
**GitHub**: https://github.com/vercel/commerce

## 主な機能

- 高性能、サーバーレンダリングのNext.js App Router eコマースアプリケーション
- React Server Components、Server Actions、Suspense、useOptimisticを使用
- 主にShopify統合に焦点
- 複数のコマースプロバイダーをサポート

## 技術スタック

- **フレームワーク**: Next.js
- **UIライブラリ**: React
- **スタイリング**: Tailwind CSS
- **コマースプラットフォーム**: Shopify(主要)

## サポートされるプロバイダー

- Shopify(主要)
- BigCommerce
- Ecwid
- Medusa
- Saleor
- その他複数のコマースプラットフォーム

## はじめに

### 前提条件

- Shopifyストア(または他のサポートされるコマースプラットフォーム)
- Shopify Storefront APIのアクセストークン

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_api_token
```

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## 機能

### サーバーサイドレンダリング

Next.js App Routerを使用した高速なサーバーサイドレンダリング。

### React Server Components

最新のReact技術を活用:

- React Server Components
- Server Actions
- Suspense
- useOptimistic

### ショッピング機能

- 商品一覧
- 商品詳細ページ
- ショッピングカート
- チェックアウト
- 注文管理

### 検索とフィルター

高度な商品検索とフィルタリング機能。

## カスタマイズ

### コマースプロバイダーの変更

`lib/shopify`ディレクトリを編集して、他のコマースプロバイダーに切り替えることができます。

### スタイルのカスタマイズ

Tailwind CSSを使用してデザインをカスタマイズできます。

## デプロイ

### Vercelへのワンクリックデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. デプロイ

### Shopifyの設定

1. Shopify管理画面でカスタムアプリを作成
2. Storefront API スコープを有効化
3. アクセストークンを取得

## 独自の特徴

- サーバーサイドレンダリング
- モダンなReact技術
- 柔軟なコマースプラットフォームサポート
- パフォーマンス最適化

## 使用例

- オンラインストア
- マーケットプレイス
- D2Cブランドサイト
- サブスクリプションサービス

## リソース

- [Next.js Commerce Documentation](https://vercel.com/templates/next.js/nextjs-commerce)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)
- [Next.js Documentation](https://nextjs.org/docs)

## パフォーマンス最適化

- 画像の最適化
- コード分割
- キャッシング戦略
- Edge Functions

## ライセンス

MITライセンス
