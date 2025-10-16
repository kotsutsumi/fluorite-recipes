# UPDATE操作

Drizzle ORMにおけるSQL UPDATE操作の包括的なガイドです。

## 基本的なUPDATE構文

```typescript
await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'));
```

## 主要な機能

- `.set()`を使用して更新値を指定
- `undefined`を持つカラムは無視される
- `null`を使用してカラムを明示的にnullに設定
- 値としてSQL式を使用可能

## 特殊なUPDATE機能

### 1. LIMIT句

```typescript
await db.update(usersTable).set({ verified: true }).limit(2);
```

### 2. ORDER BY

```typescript
await db.update(usersTable)
  .set({ verified: true })
  .orderBy(usersTable.name);
```

### 3. 返値付きのUPDATE

```typescript
const updatedUserId = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .returning({ updatedId: users.id });
```

### 4. WITH句（共通テーブル式）

```typescript
const averagePrice = db.$with('average_price').as(
  db.select({ value: sql`avg(${products.price})`.as('value') })
    .from(products)
);

const result = await db.with(averagePrice)
  .update(products)
  .set({ cheap: true })
  .where(lt(products.price, sql`(select * from ${averagePrice})`))
  .returning({ id: products.id });
```

### 5. UPDATE FROM

PostgreSQL、MySQL、SQLite、SingleStoreでサポート：

```typescript
await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .where(and(
    eq(cities.name, 'Seattle'),
    eq(users.name, 'John')
  ));
```

ドキュメントは、異なるデータベースシステムの包括的な例を提供し、Drizzle ORMの柔軟性と型安全性を示しています。
