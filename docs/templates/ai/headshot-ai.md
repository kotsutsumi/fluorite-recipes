# AI Headshot Generator

## 概要

Next.js、Leap AI、Vercelを活用したプロフェッショナルAIヘッドショットジェネレーターのスターターキットです。

**デモ**: https://www.getheadshots.ai/
**GitHub**: https://github.com/leap-ai/headshots-starter

## 主な機能

- プロフェッショナルなAIヘッドショットの生成
- AIモデルのトレーニングと推論を使用
- モデルトレーニング用のクレジットベースシステム
- オプションのStripe課金統合
- Supabase経由のユーザー認証をサポート

## 技術スタック

- **フレームワーク**: Next.js
- **AI**: Astria AI
- **データベース&認証**: Supabase
- **スタイリング**: Tailwind CSS
- **デプロイ**: Vercel
- **オプション**: Resend(メール)、Stripe(決済)

## はじめに

### 前提条件

- Astria AIアカウントとAPIキー
- Supabaseプロジェクト
- オプション: Stripeアカウント(課金機能が必要な場合)

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# Astria AI
ASTRIA_API_KEY=your_astria_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe (オプション)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Resend (オプション、メール通知用)
RESEND_API_KEY=your_resend_api_key
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

Supabaseプロジェクトでデータベーススキーマを設定します。`schema.sql`を実行してください。

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

## 機能

### AIヘッドショット生成

1. ユーザーが複数の写真をアップロード
2. AIモデルがユーザーの特徴を学習
3. プロフェッショナルなヘッドショットを生成

### クレジットシステム

- ユーザーはクレジットを購入してモデルをトレーニング
- Stripe統合による課金処理
- トレーニング済みモデルでヘッドショットを生成

### ユーザー認証

Supabaseを使用した安全な認証システム:

- メール/パスワード認証
- ソーシャルログイン(オプション)
- セッション管理

## カスタマイズ

### AIユースケースの変更

このスターターキットは、ヘッドショット以外にも以下のユースケースに対応できます:

- アバター生成
- ポートレート作成
- イラスト生成
- キャラクターアート

## デプロイ

### Vercelへのワンクリックデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. デプロイ

### Stripe Webhookの設定

本番環境では、StripeのWebhook URLを設定する必要があります:

```
https://yourdomain.com/api/stripe/webhook
```

## 独自の特徴

- オープンソーススターターキット
- 簡単にカスタマイズ可能
- 複数のAIユースケースをサポート
- 詳細なセットアップガイドと環境設定の説明

## 使用例

- プロフェッショナルヘッドショットサービス
- アバター生成プラットフォーム
- ポートレート作成アプリ
- キャラクター生成ツール

## リソース

- [Astria AI Documentation](https://astria.ai/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)

## ライセンス

MITライセンス
