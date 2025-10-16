# バッチAPI

Drizzle ORMのBatch APIの概要です。

## 概要

Batch APIにより、LibSQL、Neon、Cloudflare D1などのさまざまなデータベースプロバイダー全体で、単一のトランザクションで複数のSQL文を実行できます。

## バッチトランザクションの動作

- 文は暗黙的なトランザクションで順次実行される
- すべての文が成功すると、トランザクションがコミットされる
- いずれかの文が失敗すると、トランザクション全体がロールバックされる

## 使用例

```typescript
const batchResponse: BatchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
  db.select({ id: usersTable.id, invitedBy: usersTable.invitedBy }).from(usersTable),
]);
```

## サポートされているバッチ操作

- `db.all()`
- `db.get()`
- `db.values()`
- `db.run()`
- `db.execute()`
- `db.query` メソッド
- `db.select()`
- `db.update()`
- `db.delete()`
- `db.insert()`

## レスポンスタイプ

レスポンスタイプはデータベースプロバイダーによってわずかに異なりますが、一般的に実行された順序で各文の結果を含みます。

Batch APIは、複数のデータベース操作を効率的に実行し、トランザクションの整合性を確保するための便利な方法を提供します。
