# Vercel Edge Functionsへのデプロイ

## 主要な考慮事項

- エッジ対応データベースドライバーを使用（Neon、PlanetScale、Turso）
- データベース接続URLを環境変数として設定
- `postinstall`スクリプトを追加してPrisma Clientを生成
- 無料のVercelアカウントには1MBのサイズ制限があります

## データベース固有のセットアップ手順

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

### 2. データベースアダプターのインストール

```bash
npm install @prisma/client @prisma/adapter-neon
npm install @neondatabase/serverless
```

### 3. 環境変数の設定

`.env`ファイルを作成:

```
DATABASE_URL="postgresql://..."
```

### 4. データベーススキーマのマイグレート

```bash
npx prisma migrate dev --name init
```

### 5. Edge Functionの作成

```typescript
// app/api/users/route.ts
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

export const runtime = 'edge'

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaNeon(pool)
  const prisma = new PrismaClient({ adapter })

  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

### 6. Vercelにデプロイ

```bash
vercel deploy
```

環境変数を設定:
1. Vercelダッシュボードに移動
2. プロジェクトを選択
3. Settings > Environment Variablesに移動
4. `DATABASE_URL`を追加

## 推奨データベース

- **Prisma Postgres**: 完全なエッジ対応
- **Neon**: エッジ対応の PostgreSQL
- **PlanetScale**: エッジ対応のMySQL
- **Vercel Postgres**: Vercelの組み込みデータベース

## Edge Functionコードの例

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

export const runtime = 'edge'

export async function GET() {
  const adapter = new PrismaNeon(
    new Pool({ connectionString: process.env.DATABASE_URL })
  )
  const prisma = new PrismaClient({ adapter })

  const users = await prisma.user.findMany()
  return Response.json(users)
}
```

## 注意事項

従来の`node-postgres` (pg)は、Vercel Edge Functionsではサポートされていません。

## ベストプラクティス

- エッジ対応データベースドライバーを使用
- 環境変数で`DATABASE_URL`を管理
- `engineType = "client"`を使用してデプロイメントサイズを削減
- Edge Functionのサイズ制限に注意

## さらに学ぶ

- [Vercel Edge Functionsドキュメント](https://vercel.com/docs/functions/edge-functions)
- [Prisma Postgres](https://www.prisma.io/postgres)
