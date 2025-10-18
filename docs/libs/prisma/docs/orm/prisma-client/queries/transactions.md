# トランザクション

Prismaは、データの一貫性と整合性を保証するために、複数のトランザクション方法を提供します。

## トランザクションの種類

### 1. ネストされた書き込み

関連するレコードを1回の操作で作成・更新します。

```typescript
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa',
    posts: {
      create: [
        { title: 'My first post' },
        { title: 'My second post' }
      ]
    }
  }
})
```

### 2. バルク操作

同じタイプの複数レコードを一括で処理します。

```typescript
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
  ]
})
```

### 3. $transaction配列API

異なるタイプのレコードを含む独立した書き込み操作をトランザクションでラップします。

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({
    data: {
      email: 'elsa@prisma.io',
      name: 'Elsa'
    }
  }),
  prisma.post.create({
    data: {
      title: 'My first post'
    }
  })
])
```

全ての操作が成功するか、全て失敗します。

### 4. インタラクティブトランザクション

カスタムロジックを含むトランザクションです。

```typescript
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: {
      email: 'elsa@prisma.io',
      name: 'Elsa'
    }
  })

  // カスタムロジック
  if (user.email.endsWith('@prisma.io')) {
    await tx.post.create({
      data: {
        title: 'Welcome to Prisma',
        authorId: user.id
      }
    })
  }

  // エラーが発生した場合、すべてロールバック
})
```

## トランザクションオプション

### タイムアウト

```typescript
await prisma.$transaction(
  async (tx) => {
    // トランザクション処理
  },
  {
    maxWait: 5000, // 待機時間（ミリ秒）
    timeout: 10000, // タイムアウト（ミリ秒）
  }
)
```

### 分離レベル

```typescript
await prisma.$transaction(
  async (tx) => {
    // トランザクション処理
  },
  {
    isolationLevel: 'Serializable' // 'ReadCommitted' | 'RepeatableRead' | 'Serializable'
  }
)
```

## 実用的な例

### 銀行送金

```typescript
async function transfer(fromAccountId: number, toAccountId: number, amount: number) {
  await prisma.$transaction(async (tx) => {
    // 送金元の残高を確認
    const fromAccount = await tx.account.findUnique({
      where: { id: fromAccountId }
    })

    if (!fromAccount || fromAccount.balance < amount) {
      throw new Error('Insufficient funds')
    }

    // 送金元から引き落とし
    await tx.account.update({
      where: { id: fromAccountId },
      data: { balance: { decrement: amount } }
    })

    // 送金先に入金
    await tx.account.update({
      where: { id: toAccountId },
      data: { balance: { increment: amount } }
    })
  })
}
```

### 在庫管理

```typescript
async function purchaseItem(userId: number, itemId: number, quantity: number) {
  await prisma.$transaction(async (tx) => {
    // 在庫を確認
    const item = await tx.item.findUnique({
      where: { id: itemId }
    })

    if (!item || item.stock < quantity) {
      throw new Error('Out of stock')
    }

    // 在庫を減らす
    await tx.item.update({
      where: { id: itemId },
      data: { stock: { decrement: quantity } }
    })

    // 注文を作成
    await tx.order.create({
      data: {
        userId,
        itemId,
        quantity,
        totalPrice: item.price * quantity
      }
    })
  })
}
```

## エラーハンドリング

```typescript
try {
  await prisma.$transaction(async (tx) => {
    // トランザクション処理
    throw new Error('Something went wrong')
  })
} catch (error) {
  console.error('Transaction failed:', error)
  // エラーが発生すると、すべての変更が自動的にロールバックされます
}
```

## ベストプラクティス

- 複数の関連する書き込み操作には必ずトランザクションを使用
- トランザクション内の処理は短く保つ
- デッドロックを避けるため、常に同じ順序でリソースにアクセス
- エラーハンドリングを適切に実装
- トランザクションのタイムアウトを設定
- 読み取り専用の操作にはトランザクションを使用しない
