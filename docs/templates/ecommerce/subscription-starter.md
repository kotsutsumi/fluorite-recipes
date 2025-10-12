# Stripe Subscription Starter

## 概要

Stripe、Supabase、Vercelを活用した高性能SaaSアプリケーション向けのオールインワンサブスクリプションスターターキットです。

**デモ**: https://subscription-payments.vercel.app/
**GitHub**: https://github.com/vercel/nextjs-subscription-payments

## 重要なお知らせ

このテンプレートは終了し、新しいテンプレートに置き換えられました: https://github.com/nextjs/saas-starter

## 主な機能

- Supabaseによる安全なユーザー管理と認証
- PostgreSQLによる強力なデータアクセスと管理
- Stripe CheckoutとカスタマーポータルWeb統合
- Stripeウェブフックによる価格プランとサブスクリプションステータスの自動同期

## 技術スタック

- **フレームワーク**: Next.js
- **データベース&認証**: Supabase
- **決済処理**: Stripe
- **データベース**: PostgreSQL

## はじめに

### 前提条件

- Supabaseアカウント
- Stripeアカウント

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### データベースのセットアップ

Supabaseプロジェクトでデータベーススキーマを設定します:

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres -f schema.sql
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

## 機能

### ユーザー認証

Supabaseを使用した安全な認証:

- メール/パスワード認証
- ソーシャルログイン
- マジックリンク

### サブスクリプション管理

Stripe統合による包括的なサブスクリプション管理:

- 複数の価格プラン
- 月次/年次請求
- 無料トライアル
- サブスクリプションのアップグレード/ダウングレード

### Stripe Checkout

シームレスなチェックアウト体験:

- カスタマイズ可能なチェックアウトページ
- 複数の支払い方法
- 自動請求書発行

### カスタマーポータル

顧客が自分でサブスクリプションを管理できるポータル:

- サブスクリプションのキャンセル
- 支払い方法の更新
- 請求履歴の確認

### Webhook統合

Stripeウェブフックによる自動同期:

- サブスクリプションステータスの更新
- 支払い成功/失敗の処理
- 顧客情報の同期

## デプロイ

### Vercelへのワンクリックデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. デプロイ

### Stripeウェブフックの設定

本番環境では、StripeのWebhook URLを設定する必要があります:

```
https://yourdomain.com/api/webhooks
```

必要なイベント:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `checkout.session.completed`

## ターゲットユーザー

- SaaS開発者
- サブスクリプションベースサービスを構築するスタートアップ
- 支払いとユーザー管理のクイックスタートが必要な開発者

## 移行について

このテンプレートは終了しています。新しいプロジェクトには、改良された新しいSaaS Starterテンプレートの使用をお勧めします: https://github.com/nextjs/saas-starter

## リソース

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## ライセンス

MITライセンス
