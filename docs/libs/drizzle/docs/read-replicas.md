# リードレプリカ

Drizzle ORMにおけるリードレプリカ機能のガイドです。

## 概要

`withReplicas()`関数により、開発者はプライマリとリードレプリカインスタンス全体でデータベース接続を管理でき、柔軟なクエリルーティングと負荷分散を提供します。

## 主要な機能

- SELECTクエリを自動的にリードレプリカにルーティング
- プライマリインスタンスで作成、更新、削除操作を実行
- 複数のデータベースタイプ（PostgreSQL、MySQL、SQLite、SingleStore）をサポート

## 基本実装例

```typescript
const primaryDb = drizzle("postgres://user:password@host:port/primary_db");
const read1 = drizzle("postgres://user:password@host:port/read_replica_1");
const read2 = drizzle("postgres://user:password@host:port/read_replica_2");

const db = withReplicas(primaryDb, [read1, read2]);
```

## クエリルーティングモード

### 1. デフォルトモード

SELECTクエリ用にリードレプリカを自動選択：

```typescript
// 自動的にリードレプリカを使用
await db.select().from(usersTable)

// プライマリデータベースの使用を強制
await db.$primary.select().from(usersTable)
```

### 2. カスタムレプリカ選択

重み付けまたはカスタム選択ロジックを実装：

```typescript
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
  const weight = [0.7, 0.3];
  // カスタム重み付きランダム選択ロジック
  // 定義された確率に基づいて選択されたレプリカを返す
});
```

## サポートされているデータベースタイプ

- PostgreSQL
- MySQL
- SQLite
- SingleStore

各実装は、プライマリとレプリカデータベース接続を作成し、次に`withReplicas()`を使用してクエリルーティングを管理する類似のパターンに従います。

## 使用例

```typescript
// 読み取り操作（リードレプリカを使用）
const users = await db.select().from(usersTable);

// 書き込み操作（プライマリを使用）
await db.insert(usersTable).values({ name: 'John' });

// プライマリを明示的に使用
const criticalData = await db.$primary.select().from(usersTable);
```

ドキュメントは、異なるデータベースシステム全体でリードレプリカを設定し、利用する方法を示す、言語固有の包括的な例を提供しています。
