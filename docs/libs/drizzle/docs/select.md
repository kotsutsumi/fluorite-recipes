# SELECT操作

Drizzle ORMにおけるSQL SELECT操作の包括的なガイドです。

## 概要

Drizzleは、型安全でSQL-likeなアプローチでデータベースをクエリする強力で柔軟な選択機能を提供します。

## 基本的なSELECT

テーブルからすべての行を選択：

```typescript
const result = await db.select().from(users);
```

## 部分SELECT

特定のカラムを選択：

```typescript
const result = await db.select({
  field1: users.id,
  field2: users.name,
}).from(users);
```

## フィルタリング

比較演算子を使用して結果をフィルタリング：

```typescript
import { eq, lt, gte, ne } from 'drizzle-orm';

await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(lt(users.id, 42));
```

## 高度なフィルタリング

`and()`と`or()`でフィルターを組み合わせ：

```typescript
import { and, or } from 'drizzle-orm';

await db.select().from(users).where(
  and(
    eq(users.id, 42),
    eq(users.name, 'Dan')
  )
);
```

## ページネーション

`limit()`と`offset()`でページネーションを実装：

```typescript
await db.select().from(users).limit(10);
await db.select().from(users).limit(10).offset(10);
```

## 順序付け

`orderBy()`を使用して結果をソート：

```typescript
import { asc, desc } from 'drizzle-orm';

await db.select().from(users).orderBy(users.name);
await db.select().from(users).orderBy(desc(users.name));
```

## 集計

ビルトイン関数で集計を実行：

```typescript
import { count, sum, avg, min, max } from 'drizzle-orm';

await db.select({ value: count() }).from(users);
await db.select({ value: sum(users.id) }).from(users);
await db.select({ value: avg(users.age) }).from(users);
```

## 特殊機能

### サブクエリ

```typescript
const sq = db.select({ count: count() }).from(users).as('sq');
const result = await db.select({ count: sq.count }).from(sq);
```

### WITH句

```typescript
const sq = db.$with('sq').as(db.select().from(users));
const result = await db.with(sq).select().from(sq);
```

### DISTINCT選択

```typescript
await db.selectDistinct().from(users);
```

### 大規模な結果セット用のイテレータ

```typescript
for await (const row of db.select().from(users)) {
  console.log(row);
}
```

Drizzle ORMは、型安全性を維持しながら、SQLの完全な力を提供します。
