# VercelへのPrisma ORMのデプロイ

## 主要なデプロイ手順

### 1. package.jsonの設定

`postinstall`スクリプトに`prisma generate`を追加:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### 2. 依存関係の設定

Prismaを標準の依存関係として含める（devDependenciesだけでなく）:

```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0"
  }
}
```

### 3. モノレポの場合

モノレポを使用している場合は、以下のプラグインを検討:

```bash
npm install @prisma/nextjs-monorepo-workaround-plugin
```

```javascript
// next.config.js
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  },
}
```

## 推奨されるビルド設定

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## 重要な考慮事項

### プレビューデプロイメント用の別データベース

プレビューデプロイメントには、本番データベースとは別のデータベースを使用します。

### 接続プーリング

以下のいずれかを実装:
- Prisma Accelerate
- Prisma Postgres
- Vercel Fluid with `attachDatabasePool`とドライバーアダプター

### パフォーマンス最適化（オプション）

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

この設定により、Rustバイナリ依存関係を削除してデプロイメントを簡素化できます。

## Vercel Fluidの使用

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'
import { attachDatabasePool } from '@vercel/postgres'

const neon = new Pool({ connectionString: process.env.DATABASE_URL })
attachDatabasePool(neon)

const adapter = new PrismaNeon(neon)
const prisma = new PrismaClient({ adapter })
```

## ベストプラクティス

- `postinstall`スクリプトでPrisma Clientを生成
- プレビューデプロイメント用に別のデータベースを使用
- 接続プーリングを実装
- 環境変数で`DATABASE_URL`を管理

## さらに学ぶ

- [Vercelドキュメント](https://vercel.com/docs)
- [Next.jsとPrisma](https://www.prisma.io/nextjs)
