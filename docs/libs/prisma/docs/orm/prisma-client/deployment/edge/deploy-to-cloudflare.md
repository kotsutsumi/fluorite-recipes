# Cloudflare Workers & Pagesへのデプロイ

## 主要な考慮事項

- エッジ対応データベースドライバーを使用
- `DATABASE_URL`を環境変数として設定
- 無料のCloudflareアカウントには3MBのWorkerサイズ制限があります

## サポートされるデータベースアプローチ

### 1. PostgreSQL（従来型）

`@prisma/adapter-pg`が必要:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

`wrangler.toml`に以下を追加:

```toml
node_compat = true
```

### 2. PlanetScale

`@prisma/adapter-planetscale`を使用:

```bash
npm install @prisma/client @prisma/adapter-planetscale
npm install -D wrangler
```

競合する`cache`フィールドを削除する必要があります。

### 3. Neon

`@prisma/adapter-neon`を使用:

```bash
npm install @prisma/client @prisma/adapter-neon
npm install @neondatabase/serverless
```

## 一般的なデプロイ手順

### 1. Prismaスキーマの設定

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

### 2. 必要な依存関係のインストール

```bash
npm install @prisma/client
npm install @prisma/adapter-neon @neondatabase/serverless
npm install -D wrangler
```

### 3. データベーススキーマのマイグレート

```bash
npx prisma migrate dev --name init
```

### 4. Worker用のPrisma Clientの設定

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

export interface Env {
  DATABASE_URL: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const pool = new Pool({ connectionString: env.DATABASE_URL })
    const adapter = new PrismaNeon(pool)
    const prisma = new PrismaClient({ adapter })

    const users = await prisma.user.findMany()
    return Response.json(users)
  },
}
```

### 5. 環境変数の設定

ローカル開発用に`.dev.vars`を作成:

```
DATABASE_URL="postgresql://..."
```

### 6. デプロイ

```bash
wrangler deploy
```

本番環境の環境変数を設定:

```bash
wrangler secret put DATABASE_URL
```

## 重要な注意事項

- ローカル開発には`.dev.vars`を使用
- サーバーレス/エッジ環境では、Rustバイナリなしでprismaを使用することを検討
- より広い互換性のために、Prisma PostgresまたはPrisma Accelerateの使用を推奨

## ベストプラクティス

- エッジ対応データベースを使用
- `engineType = "client"`を設定
- 環境変数で機密情報を管理
- Workerサイズ制限に注意

## さらに学ぶ

- [Cloudflare Workersドキュメント](https://developers.cloudflare.com/workers/)
- [Prisma Accelerate](https://www.prisma.io/accelerate)
