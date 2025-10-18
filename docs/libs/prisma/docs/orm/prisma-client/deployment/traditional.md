# 従来型サーバー

アプリケーションがPlatform-as-a-Service (PaaS)プロバイダー経由でデプロイされる場合（コンテナ化されているかどうかに関わらず）、それは従来型のデプロイメントです。

## 従来型（PaaS）デプロイメントガイド

以下のプラットフォームへのデプロイメントガイドを提供しています:

### [Heroku](/docs/orm/prisma-client/deployment/traditional/deploy-to-heroku)
PostgreSQLを使用したPrisma ORMのNode.jsサーバーをHerokuにセットアップしてデプロイします。

### [Render](/docs/orm/prisma-client/deployment/traditional/deploy-to-render)
Prisma ORMとPostgreSQLを使用するNode.jsサーバーをRenderにデプロイします。

### [Koyeb](/docs/orm/prisma-client/deployment/traditional/deploy-to-koyeb)
PostgreSQLを使用したPrisma ORMのNode.jsサーバーをKoyebにセットアップしてデプロイします。

### [Sevalla](/docs/orm/prisma-client/deployment/traditional/deploy-to-sevalla)
Prisma ORMとPostgreSQLを使用するNode.jsサーバーをSevallaにデプロイします。

### [Fly.io](/docs/orm/prisma-client/deployment/traditional/deploy-to-flyio)
Prisma ORMとPostgreSQLを使用するNode.jsサーバーをFly.ioにデプロイします。

### [Railway](/docs/orm/prisma-client/deployment/traditional/deploy-to-railway)
Prisma ORMとPrisma PostgreSQLを使用するアプリをRailwayにデプロイします。

## 従来型サーバーの特徴

- **長期実行プロセス**: サーバーは継続的に実行され、複数のリクエストを処理
- **接続プーリング**: データベース接続を効率的に再利用
- **状態管理**: メモリ内状態を保持可能
- **柔軟性**: さまざまなNode.jsフレームワークと互換性

## ベストプラクティス

1. **環境変数**: `DATABASE_URL`などの設定は環境変数で管理
2. **マイグレーション**: デプロイ時に`prisma migrate deploy`を実行
3. **接続プーリング**: Prisma Clientの接続プール設定を最適化
4. **ヘルスチェック**: アプリケーションとデータベースのヘルスチェックを実装
5. **ログ**: 適切なログレベルと構造化ログを設定
