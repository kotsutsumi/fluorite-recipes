# Prisma Migrateでのデータベース変更のデプロイ

`npx prisma migrate deploy`を使用して、ステージング/テスト/本番環境で保留中のマイグレーションを適用します。このコマンドは、CI/CDパイプラインの一部であるべきです。

> **注意**: MongoDBには適用されません（代わりに`db push`を使用）。

## GitHub Actionsの例

```yaml
name: Deploy
on:
  push:
    paths:
      - prisma/migrations/**
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## 重要な考慮事項

### 環境変数

`DATABASE_URL`をシークレットとして設定していることを確認してください:

```bash
# GitHub
gh secret set DATABASE_URL --body="postgresql://..."

# GitLab
# Settings > CI/CD > Variables で設定

# CircleCI
# Project Settings > Environment Variables で設定
```

### デプロイメントのタイミング

マイグレーションは通常、デプロイメントのリリースフェーズで実行されます:

- **Heroku**: `heroku-postbuild`スクリプト
- **Render**: Pre-Deploy Command
- **Vercel**: `vercel-build`スクリプト

### ローカルでの本番マイグレーション

本番データベースに対してローカルでマイグレーションを実行することは推奨されません。代わりに、CI/CDパイプラインを使用してください。

## プラットフォーム固有の設定

### Heroku

`package.json`:

```json
{
  "scripts": {
    "build": "prisma generate",
    "heroku-postbuild": "prisma migrate deploy"
  }
}
```

### Render

Build Command: `npm install --production=false`
Pre-Deploy Command: `npx prisma migrate deploy`

### Vercel

`package.json`:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### AWS Lambda / Serverless

デプロイメントパッケージにPrismaを含める:

```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0"
  }
}
```

一部のプラットフォームでは、Prismaを本番依存関係に移動する必要がある場合があります。

## マイグレーション戦略

### 1. 通常のマイグレーション

```bash
npx prisma migrate deploy
```

### 2. ベースライニング

既存のデータベースを使用している場合:

```bash
npx prisma migrate resolve --applied "migration_name"
```

### 3. ロールバック

マイグレーションをロールバックするには、以前の状態にスキーマを変更し、新しいマイグレーションを作成します。

## ベストプラクティス

1. **CI/CDでの自動化**: マイグレーションをCI/CDパイプラインに統合
2. **環境変数の使用**: `DATABASE_URL`をシークレットとして管理
3. **マイグレーションのテスト**: 本番環境にデプロイする前にステージング環境でテスト
4. **ダウンタイムの計画**: 大規模なマイグレーションには適切なメンテナンスウィンドウを設定
5. **バックアップ**: マイグレーション前にデータベースをバックアップ

## トラブルシューティング

### マイグレーションが失敗した場合

1. エラーメッセージを確認
2. `_prisma_migrations`テーブルを確認
3. 必要に応じて`prisma migrate resolve`を使用

### マイグレーションがスキップされる

`_prisma_migrations`テーブルを確認して、マイグレーションが既に適用されているか確認します。

## さらに学ぶ

- [Prisma Migrate](/docs/orm/prisma-migrate): マイグレーションシステムの詳細
- [デプロイメント](/docs/orm/prisma-client/deployment): デプロイメント戦略
- [CI/CDの統合](/docs/orm/prisma-migrate/workflows/development-and-production): 開発と本番環境の統合
