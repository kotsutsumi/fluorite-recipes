# サーバーレス

Prisma ORMは、AWS Lambda、Vercel、Azure Functions、NetlifyなどのサーバーレスFaaSプロバイダーへのデプロイをサポートしています。

## Rustバイナリなしでの設定

サーバーレス環境でのデプロイを簡素化するために、Rustバイナリなしでprisma ORMを設定できます:

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

この設定の利点:
- Rustクエリエンジンバイナリがダウンロードされない
- データベース接続プールはネイティブJSドライバーによって管理される
- サーバーレス関数でのデプロイメントを簡素化
- エッジランタイムに対応
- 読み取り専用ファイルシステム環境で動作
- サイズ制限のあるCI/CDパイプラインに適している

注意: この設定を使用する場合は、ドライバーアダプターの使用が推奨されます。

## デプロイメントガイド

### [Azure Functions](/docs/orm/prisma-client/deployment/serverless/deploy-to-azure-functions)
Prisma ORMをAzure Functionsにデプロイします。

### [Vercel](/docs/orm/prisma-client/deployment/serverless/deploy-to-vercel)
Prisma ORMをVercelにデプロイします。

### [AWS Lambda](/docs/orm/prisma-client/deployment/serverless/deploy-to-aws-lambda)
Prisma ORMをAWS Lambdaにデプロイします。

### [Netlify](/docs/orm/prisma-client/deployment/serverless/deploy-to-netlify)
Prisma ORMをNetlifyにデプロイします。

## サーバーレス環境での考慮事項

### 接続プーリング

サーバーレス関数では、各呼び出しが新しいデータベース接続を作成する可能性があります。以下の解決策を検討してください:

- **Prisma Accelerate**: グローバル接続プーリングとキャッシング
- **Prisma Postgres**: 組み込みの接続プーリング
- **カスタム接続管理**: 接続再利用戦略の実装

### コールドスタート

サーバーレス関数のコールドスタートを最小化するために:

- デプロイメントサイズを最小限に抑える
- `engineType = "client"`を使用してバイナリサイズを削減
- ウォームアップ戦略を実装

### 環境変数

- `DATABASE_URL`などの機密情報は環境変数として安全に管理
- プラットフォーム固有のシークレット管理機能を使用

## ベストプラクティス

1. **接続プーリング**: 必ずPrisma AccelerateまたはPrisma Postgresを使用
2. **環境変数**: 機密情報は環境変数で管理
3. **バイナリターゲット**: デプロイメント環境に応じて設定
4. **タイムアウト**: 関数のタイムアウト設定を適切に設定
5. **監視**: デプロイメント後の監視とログ記録を実装

## さらに学ぶ

- [接続管理](/docs/orm/prisma-client/setup-and-configuration/databases-connections): データベース接続の最適化
- [Prisma Accelerate](https://www.prisma.io/accelerate): グローバル接続プーリング
