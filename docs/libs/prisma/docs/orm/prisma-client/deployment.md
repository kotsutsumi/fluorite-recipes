# デプロイメント

このセクションでは、Prisma Clientを使用するNode.jsアプリケーションのさまざまなデプロイメント戦略について説明します。

## デプロイメントオプション

Prisma ORMは以下のデプロイメント環境をサポートしています:

- **従来型サーバー**: Heroku、Render、Koyebなどの継続的に実行されるNode.jsプロセス
- **サーバーレス関数**: AWS Lambda、Azure Functions、Netlifyなどのオンデマンド実行環境
- **エッジ関数**: Cloudflare Workers、Vercel Edge Functions、Deno Deployなどの分散実行環境
- **モジュールバンドラー**: Webpack、Parcelなどのバンドルツールでの使用

## Rustバイナリなしでの設定

デプロイメントに課題がある環境では、Rustバイナリなしでprisma ORMを使用するように設定できます:

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

### Rustバイナリなし設定の利点

- サーバーレス関数でのデプロイメントを簡素化
- エッジランタイムでの互換性向上
- 読み取り専用ファイルシステム環境での動作
- 厳しいサイズ制限があるCI/CDパイプラインでの使用

この設定を使用する場合:
- ドライバーアダプターの使用が必要
- Rustクエリエンジンバイナリはダウンロードされない
- データベース接続プールはネイティブJSドライバーによって管理される

## デプロイメントパラダイム

### 従来型サーバー

従来型サーバーは、継続的に実行されるNode.jsプロセスで、複数のリクエストを同時に処理します。

特徴:
- PaaS（Heroku、Render、Koyebなど）にデプロイ可能
- Dockerコンテナまたは仮想マシンとしてデプロイ可能
- 長期実行プロセスに適している
- データベース接続プーリングが効率的

詳細については、[従来型サーバー](/docs/orm/prisma-client/deployment/traditional)を参照してください。

### サーバーレス関数

サーバーレス関数は、リクエストごとにオンデマンドで起動するNode.jsプロセスです。

特徴:
- AWS Lambda、Azure Functions、Netlifyなどのサービスにデプロイ
- 各関数は一度に1つのリクエストを処理
- 「ウォームスタート」により、後続の関数呼び出しが高速化
- 接続プーリング戦略が重要

詳細については、[サーバーレス](/docs/orm/prisma-client/deployment/serverless)を参照してください。

### エッジ関数

エッジ関数は、複数のリージョンに分散されたサーバーレス関数で、エンドユーザーに近い場所で実行されます。

特徴:
- Cloudflare Workers、Vercel Edge Functions、Deno Deployなどでデプロイ
- 低レイテンシー
- 従来の環境とは異なるランタイム制限
- 特殊なデータベースドライバーが必要な場合がある

詳細については、[エッジ](/docs/orm/prisma-client/deployment/edge)を参照してください。

## デプロイメントガイド

### 従来型サーバー

- [Heroku](/docs/orm/prisma-client/deployment/traditional/deploy-to-heroku)
- [Render](/docs/orm/prisma-client/deployment/traditional/deploy-to-render)
- [Koyeb](/docs/orm/prisma-client/deployment/traditional/deploy-to-koyeb)
- [Sevalla](/docs/orm/prisma-client/deployment/traditional/deploy-to-sevalla)
- [Fly.io](/docs/orm/prisma-client/deployment/traditional/deploy-to-flyio)
- [Railway](/docs/orm/prisma-client/deployment/traditional/deploy-to-railway)

### サーバーレス

- [Azure Functions](/docs/orm/prisma-client/deployment/serverless/deploy-to-azure-functions)
- [Vercel](/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel)
- [AWS Lambda](/docs/orm/prisma-client/deployment/serverless/deploy-to-aws-lambda)
- [Netlify](/docs/orm/prisma-client/deployment/serverless/deploy-to-netlify)

### エッジ

- [Cloudflare](/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare)
- [Vercel Edge Functions](/docs/orm/prisma-client/deployment/edge/deploy-to-vercel)
- [Deno Deploy](/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy)

## デプロイメントのベストプラクティス

1. **適切なデプロイメント戦略の選択**: アプリケーションのトラフィックパターン、パフォーマンス要件、スケーラビリティ要件に基づいて選択

2. **接続プーリング**: サーバーレス環境では、Prisma AccelerateまたはPrisma Postgresを使用した接続プーリングを検討

3. **環境変数の管理**: `DATABASE_URL`などの機密情報は環境変数として安全に管理

4. **マイグレーションの自動化**: CI/CDパイプラインに`prisma migrate deploy`を統合

5. **バイナリターゲットの設定**: デプロイメント環境に応じて適切な`binaryTargets`を設定

6. **監視とログ**: デプロイメント後のアプリケーションの監視とログ記録を実装

## さらに学ぶ

- [モジュールバンドラー](/docs/orm/prisma-client/deployment/module-bundlers): バンドラーでのPrisma Clientの使用
- [Prisma Migrateでのデプロイ](/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate): データベース変更のデプロイメント
- [接続管理](/docs/orm/prisma-client/setup-and-configuration/databases-connections): データベース接続の最適化
