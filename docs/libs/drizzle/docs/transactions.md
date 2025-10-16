# トランザクション

Drizzle ORMにおけるトランザクションの包括的なガイドです。

## 概要

トランザクションは、データベースとやり取りするSQL文のグループであり、単一の論理ユニットとしてコミットまたはロールバックできます。

## 主要なトランザクション機能

### 1. 基本的なトランザクション例

```typescript
await db.transaction(async (tx) => {
  await tx.update(accounts)
    .set({ balance: sql`${accounts.balance} - 100.00` })
    .where(eq(users.name, 'Dan'));
  await tx.update(accounts)
    .set({ balance: sql`${accounts.balance} + 100.00` })
    .where(eq(users.name, 'Andrew'));
});
```

### 2. ネストされたトランザクション（セーブポイント）

```typescript
await db.transaction(async (tx) => {
  // 外側のトランザクション
  await tx.transaction(async (tx2) => {
    // ネストされたトランザクション
    await tx2.update(users)
      .set({ name: "Mr. Dan" })
      .where(eq(users.name, "Dan"));
  });
});
```

### 3. 条件付きロールバック

```typescript
await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(users.name, 'Dan'));
  if (account.balance < 100) {
    tx.rollback()
  }
});
```

### 4. トランザクションからの値の返却

```typescript
const newBalance: number = await db.transaction(async (tx) => {
  // トランザクション操作
  const [account] = await tx.select({ balance: accounts.balance })
    .from(accounts)
    .where(eq(users.name, 'Dan'));
  return account.balance;
});
```

## 方言固有のトランザクション設定

### PostgreSQL
- 分離レベル
- アクセスモード
- 遅延可能オプション

### MySQL
- 分離レベル
- 一貫性のあるスナップショット

### SQLite
- トランザクション動作オプション

### SingleStore
- MySQL設定と類似

## サポートされている操作

- 標準的なデータベースの更新とクエリ
- トランザクション内のリレーショナルクエリ
- ネストされたトランザクションのサポート
- 条件付きロジックとロールバック

ドキュメントは、Drizzle ORMがさまざまなデータベースシステム全体で包括的なトランザクションサポートを提供することを強調しています。
