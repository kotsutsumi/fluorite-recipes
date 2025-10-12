# Salesforce Commerce Cloud Starter

## 概要

Next.jsとVercelをSalesforce Commerce Cloudと統合するテンプレートです。

**デモ**: https://salesforce-cloud-commerce.vercel.app/
**GitHub**: https://github.com/vercel/next.js/tree/canary/examples/with-sfcc

## 主な機能

- ヘッドレスEコマースアプリケーション
- Next.jsで構築
- Salesforce Commerce Cloud SDKを統合
- Tailwind CSSによるスタイリング

## 技術スタック

- **フレームワーク**: Next.js
- **SDK**: Salesforce Commerce Cloud SDK
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript

## はじめに

### 前提条件

- Salesforce Commerce Cloudアカウント
- SFCC APIクレデンシャル

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# Salesforce Commerce Cloud
SFCC_CLIENT_ID=your_client_id
SFCC_CLIENT_SECRET=your_client_secret
SFCC_ORGANIZATION_ID=your_org_id
SFCC_SHORT_CODE=your_short_code
SFCC_SITE_ID=your_site_id
```

### プロジェクトの初期化

create-next-appを使用してプロジェクトを初期化できます:

```bash
npx create-next-app --example with-sfcc my-commerce-app
cd my-commerce-app
```

### 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## 機能

### 商品カタログ

Salesforce Commerce CloudのAPIを使用して商品カタログを表示:

- 商品一覧
- 商品検索
- 商品フィルタリング
- カテゴリーナビゲーション

### ショッピングカート

- カートへの商品追加
- 数量の更新
- 商品の削除

### チェックアウト

Salesforce Commerce Cloudのチェックアウト機能を統合:

- ゲストチェックアウト
- 登録済みユーザーチェックアウト
- 配送オプション
- 支払い処理

### ユーザー管理

- アカウント作成
- ログイン/ログアウト
- プロフィール管理
- 注文履歴

## Salesforce Commerce Cloud SDK

このテンプレートは[Salesforce Commerce Cloud SDK](https://github.com/SalesforceCommerceCloud/commerce-sdk)を使用しています。

### SDKの使用例

```typescript
import { ShopperProducts } from 'commerce-sdk'

const client = new ShopperProducts({
  parameters: {
    clientId: process.env.SFCC_CLIENT_ID,
    organizationId: process.env.SFCC_ORGANIZATION_ID,
    shortCode: process.env.SFCC_SHORT_CODE,
    siteId: process.env.SFCC_SITE_ID,
  },
})

const products = await client.getProducts({
  parameters: { ids: 'product-id' },
})
```

## カスタマイズ

### スタイルのカスタマイズ

Tailwind CSSを使用してデザインをカスタマイズできます:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#your-brand-color',
      },
    },
  },
}
```

## デプロイ

### Vercelへのワンクリックデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. デプロイ

## 使用例

- Eコマースプラットフォーム
- ヘッドレスコマースソリューション
- 迅速なアプリケーション開発

## リソース

- [Salesforce Commerce Cloud Documentation](https://developer.salesforce.com/docs/commerce/commerce-api/overview)
- [Commerce SDK](https://github.com/SalesforceCommerceCloud/commerce-sdk)
- [Next.js Documentation](https://nextjs.org/docs)

## ライセンス

MITライセンス
