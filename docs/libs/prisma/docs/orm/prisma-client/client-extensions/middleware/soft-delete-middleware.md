# ミドルウェアサンプル: ソフトデリート

⚠️ **警告: ミドルウェアはv6.14.0で削除され、v4.16.0以降非推奨です。代わりに[Prisma Client extensions](/docs/orm/prisma-client/client-extensions/query)を使用してください。**

ソフトデリートは、レコードを物理的に削除するのではなく、削除済みとしてマークする手法です。この例では、Prismaミドルウェアを使用してソフトデリート機能を実装します。

## スキーマの準備

まず、モデルに`deleted`フィールドを追加します:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  deleted   Boolean  @default(false)  // ソフトデリート用フィールド
  authorId  Int?
  user      User?    @relation(fields: [authorId], references: [id])
}
```

## ソフトデリートミドルウェアの実装

### 基本的な実装

```typescript
const prisma = new PrismaClient()

prisma.$use(async (params, next) => {
  // deleteをupdateに変換して、deletedフラグをtrueに設定
  if (params.model === 'Post') {
    if (params.action === 'delete') {
      // deleteをupdateに変更
      params.action = 'update'
      params.args['data'] = { deleted: true }
    }
    if (params.action === 'deleteMany') {
      // deleteManyをupdateManyに変更
      params.action = 'updateMany'
      if (params.args.data !== undefined) {
        params.args.data['deleted'] = true
      } else {
        params.args['data'] = { deleted: true }
      }
    }
  }
  return next(params)
})

// 使用例
await prisma.post.delete({
  where: { id: 1 }
})
// 実際には: UPDATE Post SET deleted = true WHERE id = 1
```

## 削除済みレコードの除外

### アプローチ1: 読み取りクエリのインターセプト

削除済みレコードを読み取りクエリから除外する:

```typescript
prisma.$use(async (params, next) => {
  if (params.model === 'Post') {
    // 削除クエリをupdateに変換
    if (params.action === 'delete') {
      params.action = 'update'
      params.args['data'] = { deleted: true }
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany'
      if (params.args.data !== undefined) {
        params.args.data['deleted'] = true
      } else {
        params.args['data'] = { deleted: true }
      }
    }

    // 読み取りクエリで削除済みレコードを除外
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst'
      params.args.where['deleted'] = false
    }
    if (params.action === 'findMany') {
      if (params.args.where) {
        if (params.args.where.deleted === undefined) {
          params.args.where['deleted'] = false
        }
      } else {
        params.args['where'] = { deleted: false }
      }
    }
  }
  return next(params)
})
```

### アプローチ2: 更新と削除クエリのインターセプト

削除済みレコードの更新と削除を防ぐ:

```typescript
prisma.$use(async (params, next) => {
  if (params.model === 'Post') {
    // 削除クエリをupdateに変換
    if (params.action === 'delete') {
      params.action = 'update'
      params.args['data'] = { deleted: true }
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany'
      if (params.args.data !== undefined) {
        params.args.data['deleted'] = true
      } else {
        params.args['data'] = { deleted: true }
      }
    }

    // 更新クエリで削除済みレコードを除外
    if (params.action === 'update') {
      params.args.where['deleted'] = false
    }
    if (params.action === 'updateMany') {
      if (params.args.where !== undefined) {
        params.args.where['deleted'] = false
      } else {
        params.args['where'] = { deleted: false }
      }
    }
  }
  return next(params)
})
```

## 完全な実装例

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ソフトデリートミドルウェア
prisma.$use(async (params, next) => {
  if (params.model === 'Post') {
    // 削除を更新に変換
    if (params.action === 'delete') {
      params.action = 'update'
      params.args['data'] = { deleted: true }
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany'
      if (params.args.data !== undefined) {
        params.args.data['deleted'] = true
      } else {
        params.args['data'] = { deleted: true }
      }
    }

    // すべての読み取りと更新クエリで削除済みレコードを除外
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst'
      params.args.where['deleted'] = false
    }
    if (params.action === 'findMany') {
      if (params.args.where) {
        if (params.args.where.deleted === undefined) {
          params.args.where['deleted'] = false
        }
      } else {
        params.args['where'] = { deleted: false }
      }
    }
    if (params.action === 'update') {
      params.args.where['deleted'] = false
    }
    if (params.action === 'updateMany') {
      if (params.args.where !== undefined) {
        params.args.where['deleted'] = false
      } else {
        params.args['where'] = { deleted: false }
      }
    }
  }
  return next(params)
})

// テスト
async function main() {
  // レコードを作成
  const post = await prisma.post.create({
    data: {
      title: 'Test Post',
      content: 'This is a test post'
    }
  })
  console.log('Created:', post)

  // ソフトデリート
  await prisma.post.delete({
    where: { id: post.id }
  })
  console.log('Soft deleted')

  // 削除済みレコードは取得されない
  const found = await prisma.post.findFirst({
    where: { id: post.id }
  })
  console.log('Found after delete:', found) // null
}

main()
```

## 長所と短所

### アプローチ1の長所と短所

**長所:**
- 削除済みレコードが読み取りクエリで返されない
- アプリケーションコードの変更が不要

**短所:**
- リレーションを通じて削除済みレコードにアクセスできる可能性がある

### アプローチ2の長所と短所

**長所:**
- 削除済みレコードの意図しない変更を防ぐ
- より厳密な制御

**短所:**
- 削除済みレコードが読み取りクエリで返される可能性がある

## ベストプラクティス

1. **明示的なフィルタリング**: 削除済みレコードを表示する必要がある場合は、明示的に`where: { deleted: true }`を指定する

2. **監査ログ**: 削除時刻やユーザーを記録するための追加フィールドを検討する:
   ```prisma
   model Post {
     deleted    Boolean   @default(false)
     deletedAt  DateTime?
     deletedBy  Int?
   }
   ```

3. **パフォーマンス**: 大量の削除済みレコードがある場合は、インデックスの追加を検討する:
   ```prisma
   model Post {
     deleted Boolean @default(false)
     @@index([deleted])
   }
   ```

4. **Client Extensionsへの移行**: 新しいコードでは、ミドルウェアの代わりにClient Extensionsを使用することを強く推奨します。
