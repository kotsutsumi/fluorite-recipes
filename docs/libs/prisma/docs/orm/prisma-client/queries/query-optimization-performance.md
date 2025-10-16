# クエリ最適化とパフォーマンス

Prisma Clientのパフォーマンスを最適化するための主要な戦略です。

## 1. パフォーマンス問題のデバッグ

一般的なパフォーマンス問題:
- データの過剰フェッチ
- 欠落しているインデックス
- 繰り返しクエリのキャッシュ不足
- フルテーブルスキャンの実行

## 2. バルククエリの使用

推奨されるバルククエリメソッド:
- `createMany()`
- `createManyAndReturn()`
- `deleteMany()`
- `updateMany()`
- `updateManyAndReturn()`
- `findMany()`

## 3. PrismaClientインスタンス管理

複数の`PrismaClient`インスタンスを作成することを避けて、データベース接続プールの枯渇を防ぎます。

```typescript
// db.ts
export const prisma = new PrismaClient()

// query.ts
import { prisma } from "db.ts"
async function getPosts() {
  await prisma.post.findMany()
}
```

## 4. N+1クエリ問題の解決

複数の解決策があります:

### a. Dataloaderを使用したFluent API

`findUnique()`クエリを自動的にバッチ処理します。GraphQLコンテキストで有用です。

### b. ネストされた読み取りに`include`を使用

```typescript
const usersWithPosts = await prisma.user.findMany({
  include: {
    posts: true,
  },
})
```

### c. `in`フィルタを使用

```typescript
const users = await prisma.user.findMany({})
const userIds = users.map((x) => x.id)
const posts = await prisma.post.findMany({
  where: {
    authorId: {
      in: userIds,
    },
  },
})
```

### d. `relationLoadStrategy: "join"`を使用

```typescript
const posts = await prisma.post.findMany({
  relationLoadStrategy: "join",
  where: {
    authorId: {
      in: userIds,
    },
  },
})
```

## 5. 追加のパフォーマンスヒント

- ロギングミドルウェアを使用してクエリ期間を監視
- 詳細なパフォーマンス推奨事項にはPrisma Optimizeを検討
- 適切なデータベースインデックスを確保
- 接続プーリングを使用

## ベストプラクティス

- 単一の再利用可能なPrismaClientインスタンスを作成
- 適切な場合はバルク操作を使用
- リレーションを読み込む際にN+1問題を回避
- クエリパフォーマンスを監視および測定
