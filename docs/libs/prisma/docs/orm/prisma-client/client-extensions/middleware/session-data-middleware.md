# ミドルウェアサンプル: セッションデータ

⚠️ **警告: ミドルウェアはv6.14.0で削除され、v4.16.0以降非推奨です。代わりに[Prisma Client extensions](/docs/orm/prisma-client/client-extensions/query)を使用してください。**

次の例は、各`Post`の`language`フィールドをコンテキスト言語（例: セッション状態から取得）に設定します:

```typescript
const prisma = new PrismaClient()
const contextLanguage = 'en-us' // セッション状態

prisma.$use(async (params, next) => {
  if (params.model == 'Post' && params.action == 'create') {
    params.args.data.language = contextLanguage
  }
  return next(params)
})

const create = await prisma.post.create({
  data: {
    title: 'My post in English',
  },
})
```

## スキーマ例

この例は、以下のサンプルスキーマに基づいています:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Post {
  authorId  Int?
  content   String?
  id        Int     @id @default(autoincrement())
  published Boolean @default(false)
  title     String
  user      User?   @relation(fields: [authorId], references: [id])
  language  String?

  @@index([authorId], name: "authorId")
}

model User {
  email           String  @unique
  id              Int     @id @default(autoincrement())
  name            String?
  posts           Post[]
  extendedProfile Json?
  role            Role    @default(USER)
}

enum Role {
  ADMIN
  USER
  MODERATOR
}
```

## より詳細な例

### リクエストコンテキストからの情報追加

Express.jsなどのWebフレームワークでリクエストコンテキストから情報を追加する例:

```typescript
import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

// ミドルウェアを使用してセッションデータを追加
function createPrismaWithContext(userId: string, language: string) {
  const prismaWithMiddleware = new PrismaClient()

  prismaWithMiddleware.$use(async (params, next) => {
    // Postの作成時に言語とユーザーIDを自動設定
    if (params.model === 'Post' && params.action === 'create') {
      params.args.data.language = language
      params.args.data.authorId = userId
    }
    return next(params)
  })

  return prismaWithMiddleware
}

app.post('/posts', async (req, res) => {
  const userId = req.session.userId
  const language = req.session.language || 'en-us'

  const prismaWithContext = createPrismaWithContext(userId, language)

  const post = await prismaWithContext.post.create({
    data: {
      title: req.body.title,
      content: req.body.content
    }
  })

  res.json(post)
})
```

### タイムスタンプの自動設定

作成時刻と更新時刻を自動的に設定する例:

```typescript
prisma.$use(async (params, next) => {
  const now = new Date()

  // 作成時に createdAt と updatedAt を設定
  if (params.action === 'create') {
    params.args.data.createdAt = now
    params.args.data.updatedAt = now
  }

  // 更新時に updatedAt を設定
  if (params.action === 'update' || params.action === 'updateMany') {
    if (!params.args.data) {
      params.args.data = {}
    }
    params.args.data.updatedAt = now
  }

  return next(params)
})
```

### マルチテナンシー

テナントIDを自動的に追加する例:

```typescript
function createTenantAwarePrisma(tenantId: string) {
  const prisma = new PrismaClient()

  prisma.$use(async (params, next) => {
    // 作成時にテナントIDを追加
    if (params.action === 'create') {
      params.args.data.tenantId = tenantId
    }

    // 読み取りと更新クエリでテナントIDでフィルタリング
    if (params.action === 'findMany' || params.action === 'findFirst' ||
        params.action === 'findUnique' || params.action === 'update' ||
        params.action === 'updateMany' || params.action === 'delete' ||
        params.action === 'deleteMany') {
      if (!params.args.where) {
        params.args.where = {}
      }
      params.args.where.tenantId = tenantId
    }

    return next(params)
  })

  return prisma
}

// 使用例
const tenantPrisma = createTenantAwarePrisma('tenant-123')
const posts = await tenantPrisma.post.findMany()
// 自動的に WHERE tenantId = 'tenant-123' が追加される
```

## Client Extensionsへの移行

新しいコードでは、Client Extensionsを使用することを推奨します:

```typescript
const createPrismaWithContext = (userId: string, language: string) => {
  return new PrismaClient().$extends({
    query: {
      post: {
        async create({ args, query }) {
          args.data.language = language
          args.data.authorId = userId
          return query(args)
        }
      }
    }
  })
}
```

## ベストプラクティス

1. **リクエストごとに新しいインスタンスを作成しない**: パフォーマンス上の理由から、グローバルなPrismaインスタンスを使用し、コンテキストデータを引数として渡すことを検討してください

2. **明示的な設定を優先**: 可能な限り、暗黙的な設定よりも明示的な設定を優先します

3. **ドキュメント化**: セッションデータが自動的に設定される場合は、明確にドキュメント化します

4. **テスト**: セッションデータの自動設定が正しく機能することをテストで確認します
