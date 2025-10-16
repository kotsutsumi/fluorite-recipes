# Deno DeployへのPrismaアプリのデプロイ

## 前提条件

- Deno v1.29.4以降
- GitHubアカウント
- Deno Deployアカウント
- Node.js & npm

## 主要な手順

### 1. プロジェクトのセットアップ

```bash
npx prisma@latest init --db postgres
```

`schema.prisma`を設定:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Log {
  id        Int      @id @default(autoincrement())
  level     Level
  message   String
  meta      Json
  createdAt DateTime @default(now())
}

enum Level {
  Info
  Warn
  Error
}
```

### 2. Prisma Clientと拡張のインストール

```bash
npm install @prisma/client @prisma/adapter-pg
npm install pg
```

### 3. データベーススキーマの作成

```bash
deno run -A npm:prisma migrate dev --name init
```

### 4. アプリケーションの作成

`index.ts`を作成:

```typescript
import { PrismaClient } from '@prisma/client/edge'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: Deno.env.get('DATABASE_URL') })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

Deno.serve(async (request) => {
  const { pathname } = new URL(request.url)

  if (pathname === '/') {
    const log = await prisma.log.create({
      data: {
        level: 'Info',
        message: `${request.method} ${pathname}`,
        meta: {
          headers: JSON.stringify(request.headers),
        },
      },
    })

    const body = JSON.stringify(log, null, 2)

    return new Response(body, {
      headers: { 'content-type': 'application/json; charset=utf-8' },
    })
  }

  return new Response('Not Found', { status: 404 })
})
```

### 5. ローカルテスト

```bash
npx dotenv -- deno run -A ./index.ts
```

### 6. GitHubへのデプロイ

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 7. Deno Deployの設定

1. GitHubリポジトリを接続
2. 環境変数を設定:
   - `DATABASE_URL`: PostgreSQL接続文字列
3. ビルドステップを設定:
   ```bash
   npm install && npx prisma generate
   ```
4. エントリーポイント: `index.ts`
5. デプロイ

## ベストプラクティス

- 環境変数で`DATABASE_URL`を管理
- Deno互換のパッケージを使用
- エッジ対応データベースドライバーを使用
- 適切なエラーハンドリングを実装

## さらに学ぶ

- [Deno Deployドキュメント](https://deno.com/deploy/docs)
- [Prisma with Deno](https://www.prisma.io/docs/orm/overview/databases/deno)
