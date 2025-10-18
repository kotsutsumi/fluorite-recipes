# AWS LambdaへのPrisma ORMのデプロイ

## AWS Lambda デプロイメントの主要な考慮事項

### 1. バイナリターゲットの設定

Node.jsバージョンに応じて適切なバイナリターゲットを設定:

```prisma
// Node.js 16/18の場合
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}

// Node.js 20+の場合
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

// ARM64アーキテクチャの場合
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x", "linux-arm64-openssl-1.0.x"]
}
```

### 2. 接続プーリング

サーバーレス関数では接続管理が重要です。推奨ソリューション:

- **Prisma Accelerate**: グローバル接続プーリングとキャッシング
- **Prisma Postgres**: 組み込みの接続プーリング
- **カスタム接続管理**: 接続再利用戦略の実装

### 3. デプロイメントフレームワーク

以下のフレームワークをサポート:

- AWS Serverless Application Model (SAM)
- Serverless Framework
- SST (Serverless Stack)

## AWS SAMを使用したデプロイ

### 1. template.yamlの設定

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  PrismaFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: ./
      Handler: index.handler
      Runtime: nodejs20.x
      Environment:
        Variables:
          DATABASE_URL: !Ref DatabaseUrl
```

### 2. 関数コードの作成

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const handler = async (event) => {
  const users = await prisma.user.findMany()
  return {
    statusCode: 200,
    body: JSON.stringify(users),
  }
}
```

### 3. デプロイ

```bash
sam build
sam deploy --guided
```

## Serverless Frameworkを使用したデプロイ

### serverless.ymlの設定

```yaml
service: prisma-lambda

provider:
  name: aws
  runtime: nodejs20.x
  environment:
    DATABASE_URL: ${env:DATABASE_URL}

functions:
  api:
    handler: handler.main
    events:
      - httpApi:
          path: /users
          method: get

plugins:
  - serverless-plugin-typescript
```

## 環境変数の管理

各フレームワークには独自の環境変数読み込み方法があります:

- **AWS SAM**: `template.yaml`の`Environment`セクション
- **Serverless Framework**: `serverless.yml`の`environment`セクション
- **SST**: `.env`ファイルまたはSST Secrets

## パッケージングの考慮事項

- デプロイメントパッケージサイズを最小限に抑える
- 必要なPrismaエンジンファイルのみを含める
- `schema.prisma`が正しくバンドルされていることを確認

## Rustバイナリなしでの軽量デプロイ

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

この設定により、デプロイメントサイズを大幅に削減できます。

## ベストプラクティス

- 適切なバイナリターゲットを設定
- 接続プーリングを実装
- 環境変数で機密情報を管理
- Lambda関数のタイムアウトを適切に設定
- デプロイメントサイズを最小化

## さらに学ぶ

- [AWS Lambdaドキュメント](https://docs.aws.amazon.com/lambda/)
- [Prisma Accelerate](https://www.prisma.io/accelerate)
