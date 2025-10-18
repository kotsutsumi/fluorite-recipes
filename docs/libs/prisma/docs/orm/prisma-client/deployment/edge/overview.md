# エッジでのPrisma ORMのデプロイ

## 主要なポイント

エッジ関数は、制限されたランタイム環境のため、いくつかの制限があります。

### データベースドライバーの互換性

すべてのデータベースドライバーがエッジ関数で動作するわけではありません。推奨ソリューション:

1. **Prisma Postgres**: 完全なエッジ対応
2. **Prisma Accelerate**: グローバル接続プーリングとキャッシング

### エッジ対応データベースドライバー

- **Neon Serverless** (HTTPベース)
- **PlanetScale Serverless** (HTTPベース)
- **@libsql/client** (Tursoデータベース用)
- **Prisma Postgres**

## デプロイメントの考慮事項

プロバイダーによって、特定のドライバー要件があります:

- Cloudflare WorkersとVercel Edge Functionsは、HTTPベースの接続方法が必要な場合があります
- データベースドライバーの「エッジ互換性」は、接続方法（HTTP vs TCP）に依存します

## 推奨設定

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

このアプローチにより、Rustエンジンバイナリを削除してサーバーレスおよびエッジ環境でのデプロイメントを簡素化します。

## サポートされるエッジプロバイダー（プレビュー）

- Vercel Edge Functions
- Cloudflare Workers
- Cloudflare Pages
- Deno Deploy（部分的）

詳細なプロバイダー固有のデプロイメントガイドは、ドキュメントで利用できます。

## 接続方法の比較

| データベース | HTTP | TCP | エッジ対応 |
|------------|------|-----|-----------|
| Neon | ✓ | ✓ | ✓ |
| PlanetScale | ✓ | ✓ | ✓ |
| Turso | ✓ | - | ✓ |
| Prisma Postgres | ✓ | ✓ | ✓ |
| PostgreSQL (pg) | - | ✓ | ✗ |

## ベストプラクティス

- エッジ対応データベースドライバーを使用
- `engineType = "client"`設定を使用
- Prisma AccelerateまたはPrisma Postgresを使用して接続プーリングを実装
- プラットフォーム固有の制限を理解する

## さらに学ぶ

- [Cloudflareへのデプロイ](/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare)
- [Vercelへのデプロイ](/docs/orm/prisma-client/deployment/edge/deploy-to-vercel)
- [Deno Deployへのデプロイ](/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy)
