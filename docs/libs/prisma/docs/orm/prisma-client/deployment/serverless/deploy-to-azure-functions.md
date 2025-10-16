# Azure FunctionsへのPrisma ORMのデプロイ

## 主要な推奨事項

### 1. バイナリターゲットの定義

Prismaスキーマで複数のバイナリターゲットを定義します:

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-1.1.x"]
}
```

Azure Functionsはローカル開発環境とは異なるOSで実行されるため、適切なバイナリターゲットを指定する必要があります。

### 2. 接続プーリング戦略

サーバーレス環境では、各関数呼び出しが新しいデータベース接続を作成する可能性があります。以下を検討してください:

- **Prisma Accelerate**: グローバル接続プーリングとキャッシング
- **カスタム接続管理**: 接続再利用戦略の実装

## Rustバイナリなしでの使用

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

この設定により:
- Rustバイナリがダウンロードされない
- デプロイメントサイズが削減される
- ドライバーアダプターの使用が必要

## 前提条件

- Prisma ORMを含む既存の関数アプリプロジェクト
- Azure Functions Core Tools
- Azure CLI

## デプロイ手順

### 1. 依存関係のインストール

```bash
npm install @prisma/client
npm install -D prisma
```

### 2. Prismaスキーマの設定

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-1.1.x"]
}
```

### 3. マイグレーションの実行

```bash
npx prisma migrate deploy
```

### 4. 関数コードの作成

```typescript
import { PrismaClient } from '@prisma/client'
import { AzureFunction, Context, HttpRequest } from '@azure/functions'

const prisma = new PrismaClient()

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const users = await prisma.user.findMany()
  context.res = {
    body: users,
  }
}

export default httpTrigger
```

### 5. デプロイ

```bash
func azure functionapp publish <APP_NAME>
```

## ベストプラクティス

- 適切なバイナリターゲットを設定
- 接続プーリングを実装
- 環境変数で`DATABASE_URL`を管理
- 関数のタイムアウトを適切に設定

## さらに学ぶ

- [Prisma Client APIリファレンス](https://www.prisma.io/docs/orm/reference/prisma-client-reference)
- [Azure Functions](https://docs.microsoft.com/azure/azure-functions/)
