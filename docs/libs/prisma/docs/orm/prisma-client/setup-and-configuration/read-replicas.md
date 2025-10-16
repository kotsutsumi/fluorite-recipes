# 読み取りレプリカ

読み取りレプリカは、高トラフィックのワークロードでデータベースレプリカ間に作業を分散させることを可能にします。

## セットアップ

### 拡張機能のインストール

```bash
npm install @prisma/extension-read-replicas
```

### 基本的な設定

```typescript
import { PrismaClient } from '@prisma/client'
import { readReplicas } from '@prisma/extension-read-replicas'

const prisma = new PrismaClient().$extends(
  readReplicas({
    url: process.env.DATABASE_URL_REPLICA,
  })
)

// クエリはレプリカデータベースに対して実行される
await prisma.post.findMany()

// クエリはプライマリデータベースに対して実行される
await prisma.post.create({
  data: { /* */ },
})
```

## 複数のレプリカ

```typescript
const prisma = new PrismaClient().$extends(
  readReplicas({
    url: [
      process.env.DATABASE_URL_REPLICA_1,
      process.env.DATABASE_URL_REPLICA_2,
      process.env.DATABASE_URL_REPLICA_3,
    ],
  })
)
```

## プライマリデータベースへの読み取り

場合によっては、読み取り操作をプライマリデータベースに対して実行する必要があります。

```typescript
// プライマリデータベースから読み取る
const result = await prisma.$primary().post.findMany()
```

## ロードバランシング

複数のレプリカが設定されている場合、拡張機能は自動的に読み取りクエリをレプリカ間で分散します。

## ユースケース

- 高トラフィックのアプリケーション
- 読み取り重視のワークロード
- データベース負荷の分散
- パフォーマンスの最適化

## ベストプラクティス

1. 書き込み操作は常にプライマリに送信される
2. 読み取り操作はデフォルトでレプリカに送信される
3. 最新のデータが必要な場合は`$primary()`を使用
4. レプリケーションラグを考慮する
