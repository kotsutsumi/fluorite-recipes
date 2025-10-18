# ミドルウェアサンプル: ログ記録

⚠️ **警告: ミドルウェアはv6.14.0で削除され、v4.16.0以降非推奨です。代わりに[Prisma Client extensions](/docs/orm/prisma-client/client-extensions/query)を使用してください。**

次の例は、Prisma Clientクエリの実行にかかった時間をログに記録します:

```typescript
const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)

  return result
})

const create = await prisma.post.create({
  data: {
    title: 'Welcome to Prisma Day 2020',
  },
})

const createAgain = await prisma.post.create({
  data: {
    title: 'All about database collation',
  },
})
```

出力例:
```
Query Post.create took 92ms
Query Post.create took 15ms
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

## より詳細なログ記録

クエリの詳細情報を含むログ記録の例:

```typescript
prisma.$use(async (params, next) => {
  const before = Date.now()

  console.log(`Executing: ${params.model}.${params.action}`)
  console.log('Arguments:', JSON.stringify(params.args, null, 2))

  const result = await next(params)

  const after = Date.now()
  const duration = after - before

  console.log(`Completed: ${params.model}.${params.action} in ${duration}ms`)
  console.log('---')

  return result
})
```

## パフォーマンス警告

遅いクエリに警告を出す例:

```typescript
const SLOW_QUERY_THRESHOLD = 100 // ミリ秒

prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  const duration = after - before

  if (duration > SLOW_QUERY_THRESHOLD) {
    console.warn(`⚠️  Slow query detected: ${params.model}.${params.action} took ${duration}ms`)
    console.warn('Arguments:', params.args)
  }

  return result
})
```

## 構造化ログ

本番環境向けの構造化ログの例:

```typescript
import pino from 'pino'

const logger = pino()

prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  const duration = after - before

  logger.info({
    model: params.model,
    action: params.action,
    duration,
    timestamp: new Date().toISOString()
  })

  return result
})
```

## エラーログ

クエリのエラーをログに記録する例:

```typescript
prisma.$use(async (params, next) => {
  const before = Date.now()

  try {
    const result = await next(params)
    const after = Date.now()

    console.log(`✓ ${params.model}.${params.action} succeeded in ${after - before}ms`)

    return result
  } catch (error) {
    const after = Date.now()

    console.error(`✗ ${params.model}.${params.action} failed in ${after - before}ms`)
    console.error('Error:', error)
    console.error('Arguments:', params.args)

    throw error
  }
})
```

## さらに学ぶ

[Prisma Client extensions](/docs/orm/prisma-client/client-extensions)を使用してクエリの実行時間をログに記録することもできます。実用的な例は[このGitHubリポジトリ](https://github.com/prisma/prisma-client-extensions)にあります。

### Client Extensionsを使用したログ記録

```typescript
const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ operation, model, args, query }) {
        const before = Date.now()
        const result = await query(args)
        const after = Date.now()

        console.log(`Query ${model}.${operation} took ${after - before}ms`)

        return result
      }
    }
  }
})
```

Client Extensionsを使用する利点:
- より型安全
- より柔軟な実装
- ミドルウェアより推奨される方法
