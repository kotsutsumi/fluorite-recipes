# Platforms Starter Kit

## 概要

App RouterとRedisを使用したマルチテナントアプリケーション構築のためのNext.jsテンプレートです。スケーラブルなマルチテナントWebアプリケーションの作成を支援するよう設計されています。

**デモ**: https://vercel.pub/
**GitHub**: https://github.com/vercel/platforms

## 主な機能

- ✅ Next.jsミドルウェアによるカスタムサブドメインルーティング
- ✅ テナント固有のコンテンツとページ
- ✅ テナント間で共有されるコンポーネントとレイアウト
- ✅ テナントデータストレージ用のRedis
- ✅ テナント管理のための管理インターフェース
- ✅ テナントブランディング用の絵文字サポート
- ✅ サブドメインを使用したローカル開発のサポート
- ✅ Vercelプレビューデプロイメントとの互換性

## 技術スタック

- **フレームワーク**: Next.js 15
- **UIライブラリ**: React 19
- **データベース**: Upstash Redis
- **スタイリング**: Tailwind 4
- **UIコンポーネント**: shadcn/ui

## はじめに

### 前提条件

- Node.js 18.17.0以降
- pnpm(推奨)
- Upstash Redisアカウント

### 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください:

```bash
# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# 開発環境用
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
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

## ローカル開発でのサブドメイン

ローカル開発でサブドメインをテストするには、`/etc/hosts`ファイルを編集します:

```
127.0.0.1 app.localhost
127.0.0.1 tenant1.localhost
127.0.0.1 tenant2.localhost
```

その後、以下のURLにアクセスできます:
- `http://app.localhost:3000` - メインアプリケーション
- `http://tenant1.localhost:3000` - テナント1
- `http://tenant2.localhost:3000` - テナント2

## 機能の詳細

### マルチテナントアーキテクチャ

各テナントは独自のサブドメインを持ち、独立したコンテンツとページを管理できます:

```
tenant1.yourdomain.com
tenant2.yourdomain.com
```

### ミドルウェアルーティング

Next.jsミドルウェアを使用して、サブドメインに基づいてリクエストをルーティング:

```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host')
  const subdomain = hostname?.split('.')[0]

  // サブドメインに基づいてルーティング
  if (subdomain) {
    return NextResponse.rewrite(
      new URL(`/${subdomain}${req.nextUrl.pathname}`, req.url)
    )
  }
}
```

### テナント管理

管理インターフェースでテナントを管理:

- テナントの作成
- テナント情報の編集
- テナントの削除
- テナント設定のカスタマイズ

### Redisデータストレージ

Upstash Redisを使用してテナントデータを保存:

```typescript
import { redis } from '@/lib/redis'

// テナントデータの取得
const tenant = await redis.get(`tenant:${subdomain}`)

// テナントデータの保存
await redis.set(`tenant:${subdomain}`, tenantData)
```

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリをVercelにインポート
2. 環境変数を設定
3. カスタムドメインを追加
4. ワイルドカードドメイン(`*.yourdomain.com`)を設定

### 本番環境の環境変数

```bash
# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# ルートドメイン
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com
```

## 使用例

### マルチテナントSaaSアプリケーション

- ブログプラットフォーム(各ユーザーが独自のブログを持つ)
- Eコマースマーケットプレイス(各店舗が独自のサブドメインを持つ)
- 教育プラットフォーム(各学校が独自のサイトを持つ)

### カスタムサブドメインサポートのプラットフォーム

- ポートフォリオホスティングサービス
- ウェブサイトビルダー
- コミュニティプラットフォーム

## カスタマイズ

### テーマのカスタマイズ

Tailwind CSSを使用してテナントごとのテーマをカスタマイズできます。

### 機能の追加

shadcn/uiコンポーネントを使用して、新しい機能を簡単に追加できます。

## リソース

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Upstash Redis Documentation](https://upstash.com/docs/redis/overall/getstarted)
- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/domains)

## ライセンス

MITライセンス
