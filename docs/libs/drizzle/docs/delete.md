# DELETE操作

Drizzle ORMにおけるSQL DELETE操作の包括的なガイドです。

## 基本的なDELETEメソッド

```typescript
// テーブル全体を削除
await db.delete(users);

// 条件付き削除
await db.delete(users).where(eq(users.name, 'Dan'));
```

## 高度なDELETE機能

### LIMIT

削除する行数を制限：

```typescript
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
```

### ORDER BY

削除前に行をソート：

```typescript
// 単一フィールドの順序付け
await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .orderBy(users.name);

// asc/descを使用した複数フィールドの順序付け
await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .orderBy(asc(users.name), desc(users.name2));
```

### 返値付きのDELETE

PostgreSQL/SQLiteで削除された行を取得：

```typescript
// 完全な行を返す
const deletedUser = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning();

// 特定のフィールドを返す
const deletedUserIds = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning({ deletedId: users.id });
```

### WITH句

複雑な削除操作に共通テーブル式を使用：

```typescript
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql`avg(${orders.amount})`.as('value') })
    .from(orders)
);

const result = await db
  .with(averageAmount)
  .delete(orders)
  .where(gt(orders.amount, sql`(select * from ${averageAmount})`))
  .returning({ id: orders.id });
```

このドキュメントは、Drizzle ORMを使用したさまざまな削除戦略を網羅し、異なるデータベース操作とクエリの複雑さをサポートしています。
