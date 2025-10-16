# Fly.ioへのPrismaアプリのデプロイ

Prisma ORMとPostgreSQLを使用するNode.jsサーバーをFly.ioにデプロイします。

## 前提条件

- Fly.ioアカウント

## デプロイ手順

### 1. サンプルコードのダウンロード

```bash
git clone https://github.com/prisma/prisma-examples
cd prisma-examples/deployment-platforms/flyio
npm install
```

### 2. デプロイ

```bash
fly launch
```

デフォルトの設定を受け入れます。

## Fly.ioの特徴

- 35のグローバルリージョンでNode.jsアプリケーションをデプロイ
- 受信リクエストに基づいて自動停止/自動起動
- 最小限の設定で簡単にデプロイ

## サンプルアプリケーション

サンプルには以下が含まれます:
- データモデルを定義するPrismaスキーマ
- データベースセットアップのためのマイグレーションファイル
- 初期データ用のシードスクリプト

## ベストプラクティス

- `fly.toml`で適切なリージョンを設定
- 環境変数で`DATABASE_URL`を管理
- アプリケーションのヘルスチェックを設定

## さらに学ぶ

- [Fly.ioドキュメント](https://fly.io/docs/)
- [Prisma Migrate](/docs/orm/prisma-migrate)
