# セット操作

Drizzle ORMにおけるセット操作の包括的なガイドです。

## 概要

セット操作により、異なる動作を持つ複数のテーブルからのクエリ結果を組み合わせることができます。

## セット操作の種類

### 1. UNION

2つのクエリブロックからの結果を組み合わせ、重複エントリを削除します。

```typescript
const result = await db.select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers));
```

### 2. UNION ALL

2つのクエリブロックからのすべての結果を組み合わせ、重複エントリを保持します。

```typescript
const result = await db.select({ name: users.name })
  .from(users)
  .unionAll(db.select({ name: customers.name }).from(customers));
```

### 3. INTERSECT

両方のクエリブロックに共通する行のみを返し、重複エントリを削除します。

```typescript
const result = await db.select({ course: dept1.course })
  .from(dept1)
  .intersect(db.select({ course: dept2.course }).from(dept2));
```

### 4. INTERSECT ALL

両方のクエリブロックに共通する行を返し、重複エントリを保持します。

### 5. EXCEPT

2番目のブロックに存在しない最初のクエリブロックからの行を返し、重複エントリを削除します。

```typescript
const result = await db.select({ project: dept1.project })
  .from(dept1)
  .except(db.select({ project: dept2.project }).from(dept2));
```

### 6. EXCEPT ALL

2番目のブロックにない最初のブロックからの行を返し、重複エントリを保持します。

## サポートされているデータベース

各操作は、異なるデータベースタイプ（PostgreSQL、MySQL、SQLite、SingleStore）でサポートされており、構文にわずかな違いがあります。

ドキュメントは、Drizzle ORMを使用してこれらのセット操作を実装するための詳細なコード例を提供しています。
