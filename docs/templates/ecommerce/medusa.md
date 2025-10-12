# Medusa Next.js Ecommerce Store Starter

## 概要

Next.js App Router、Medusa、TailwindCSSで構築されたEコマースストアテンプレートです。Algolia検索とStripeチェックアウトなどの機能を備えています。

**デモ**: https://next.medusajs.com/
**GitHub**: https://github.com/medusajs/nextjs-starter-medusa

## 技術スタック

- **フレームワーク**: Next.js
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript
- **バックエンド**: Medusa

## 主な機能

### Eコマース機能

- 商品詳細ページ
- 商品一覧ページ
- 商品コレクション
- カート機能
- Stripeチェックアウト
- ユーザーアカウント
- 注文詳細

### Next.js 15サポート

- App Router
- Next.jsフェッチ/キャッシング
- Server Components
- Server Actions
- ストリーミング
- 静的事前レンダリング

### 決済統合

- Stripe(設定可能)

## はじめに

### 前提条件

- Medusaサーバーがローカルのポート9000で稼働していること

### Medusaサーバーのセットアップ

Medusaサーバーをまだセットアップしていない場合は、まずセットアップする必要があります:

```bash
npx create-medusa-app@latest
```

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
REVALIDATE_SECRET=supersecret
```

### 依存関係のインストール

```bash
yarn install
```

### 開発サーバーの起動

```bash
yarn dev
```

ブラウザで [http://localhost:8000](http://localhost:8000) を開いてサイトにアクセスしてください。

## ディレクトリ構造

```
.
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
├── lib/             # ユーティリティとヘルパー
├── modules/         # 機能モジュール
└── public/          # 静的アセット
```

## 機能の詳細

### 商品管理

Medusaの商品APIを使用して商品を管理:

- 商品の追加/編集/削除
- バリアント管理
- 在庫管理
- 画像管理

### カート機能

- カートに商品を追加
- 数量の更新
- 商品の削除
- カート内容の保存

### チェックアウトフロー

Stripeを使用した安全なチェックアウト:

1. カート確認
2. 配送情報入力
3. 支払い情報入力
4. 注文確定

### ユーザーアカウント

- アカウント作成
- ログイン/ログアウト
- 注文履歴
- アカウント情報の編集

## カスタマイズ

### テーマのカスタマイズ

Tailwind CSSを使用してテーマをカスタマイズできます:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

### 支払いプロバイダーの追加

Medusaは複数の支払いプロバイダーをサポートしています。追加の支払いオプションを設定できます。

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

### 環境変数の設定

本番環境では、適切な環境変数を設定してください:

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com
REVALIDATE_SECRET=your_secret
```

## 使用例

- オンラインストア
- D2Cブランド
- マーケットプレイス
- サブスクリプションサービス

## リソース

- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ライセンス

MITライセンス
