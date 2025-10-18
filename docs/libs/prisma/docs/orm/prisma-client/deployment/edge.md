# エッジ関数

エッジ関数は、Cloudflare Workers、Vercel Edge Functions、Deno Deployなどの分散サーバーレスプラットフォームです。

## エッジ対応の設定

Prisma ORMは、Rustバイナリなしでエッジデプロイメント用に設定できます:

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

この設定により:
- Rustクエリエンジンバイナリがダウンロードされない
- データベース接続プールはネイティブJSデータベースドライバーによって管理される
- サーバーレス/エッジランタイムでのデプロイメントを簡素化
- ドライバーアダプターの使用が必要

## サポートされるエッジプラットフォーム

- **Cloudflare Workers/Pages**: グローバルに分散されたエッジコンピューティングプラットフォーム
- **Vercel Edge Functions/Middleware**: Vercelのエッジランタイム
- **Deno Deploy**: Denoのグローバルエッジネットワーク

各プラットフォームの詳細なガイドについては、以下を参照してください:

- [Cloudflareへのデプロイ](/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare)
- [Vercel Edge Functionsへのデプロイ](/docs/orm/prisma-client/deployment/edge/deploy-to-vercel)
- [Deno Deployへのデプロイ](/docs/orm/prisma-client/deployment/edge/deploy-to-deno-deploy)

## デプロイメントの考慮事項

### データベースドライバーの互換性

すべてのデータベースドライバーがエッジ関数で動作するわけではありません。推奨ソリューション:

1. **Prisma Postgres**: 完全なエッジ対応
2. **Prisma Accelerate**: グローバル接続プーリングとキャッシング
3. **Neon Serverless**: HTTPベースの接続
4. **PlanetScale Serverless**: HTTPベースの接続
5. **Turso**: `@libsql/client`を使用

### ランタイム制限

エッジ関数には、従来の環境とは異なる制限があります:

- ファイルシステムアクセスの制限
- ネットワークプロトコルの制限
- 実行時間の制限
- メモリの制限

## さらに学ぶ

- [エッジでのPrisma ORM](/docs/orm/prisma-client/deployment/edge/overview): エッジ環境での詳細なガイド
- [データベース接続](/docs/orm/prisma-client/setup-and-configuration/databases-connections): 接続の最適化
