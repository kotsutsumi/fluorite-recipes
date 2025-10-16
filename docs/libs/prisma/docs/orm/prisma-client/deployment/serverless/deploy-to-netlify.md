# NetlifyへのPrisma ORMのデプロイ

## Netlifyデプロイメントの主要手順

### 1. バイナリターゲットの設定

Node.jsバージョンに基づいて`schema.prisma`に適切なバイナリターゲットを追加:

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
```

### 2. 環境変数の設定

#### Netlify CLIを使用

```bash
netlify env:import .env
```

#### Netlify管理UIを使用

1. サイトの"Site settings"に移動
2. "Environment variables"セクションに`DATABASE_URL`を追加

### 3. 接続プーリング

サーバーレス環境では接続プーリングが推奨されます:

- **Prisma Accelerate**: グローバル接続プーリングとキャッシング
- **Prisma Postgres**: 組み込みの接続プーリング

## オプション設定: Rustバイナリなし

Rustバイナリなしでprismaを使用する場合:

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

この設定には、ドライバーアダプターの使用が必要です。

## 推奨される前提条件

- Netlifyの[Get started](https://docs.netlify.com/get-started/)ドキュメントを確認
- [Deploy functions](https://docs.netlify.com/functions/deploy/)ドキュメントを確認
- `.env`ファイルを`.gitignore`に追加

## 関数コードの例

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

exports.handler = async (event, context) => {
  const users = await prisma.user.findMany()
  return {
    statusCode: 200,
    body: JSON.stringify(users),
  }
}
```

## netlify.tomlの設定

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

## ベストプラクティス

- 適切なバイナリターゲットを設定
- 環境変数で`DATABASE_URL`を管理
- 接続プーリングを実装
- `.env`ファイルを`.gitignore`に含める
- サーバーレスコンテキストでのデータベース接続管理に注意

## さらに学ぶ

- [Netlifyドキュメント](https://docs.netlify.com/)
- [Prisma Accelerate](https://www.prisma.io/accelerate)
