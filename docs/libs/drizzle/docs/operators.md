# フィルターと条件演算子

Drizzle ORMで利用可能なフィルターと条件演算子の包括的な概要です。

## 概要

これらの演算子は`drizzle-orm`からインポートでき、PostgreSQL、MySQL、SQLite、SingleStoreを含む複数のデータベース方言で動作します。

## 主要な演算子

### 1. 比較演算子

```typescript
import { eq, ne, gt, gte, lt, lte } from 'drizzle-orm';

// 等しい
db.select().from(table).where(eq(table.column, 5))

// 等しくない
db.select().from(table).where(ne(table.column, 5))

// より大きい
db.select().from(table).where(gt(table.column, 5))

// 以上
db.select().from(table).where(gte(table.column, 5))

// より小さい
db.select().from(table).where(lt(table.column, 5))

// 以下
db.select().from(table).where(lte(table.column, 5))
```

### 2. 存在演算子

```typescript
import { exists, notExists, isNull, isNotNull } from 'drizzle-orm';

db.select().from(table).where(exists(subquery))
db.select().from(table).where(isNull(table.column))
db.select().from(table).where(isNotNull(table.column))
```

### 3. 配列演算子

```typescript
import { inArray, notInArray, between, notBetween } from 'drizzle-orm';

db.select().from(table).where(inArray(table.column, [1, 2, 3]))
db.select().from(table).where(between(table.column, 1, 10))
```

### 4. パターンマッチング

```typescript
import { like, ilike, notIlike } from 'drizzle-orm';

// 大文字小文字を区別
db.select().from(table).where(like(table.column, '%pattern%'))

// 大文字小文字を区別しない
db.select().from(table).where(ilike(table.column, '%pattern%'))
```

### 5. 論理演算子

```typescript
import { not, and, or } from 'drizzle-orm';

// 条件を否定
db.select().from(table).where(not(eq(table.column, 5)))

// すべてが真でなければならない条件を組み合わせ
db.select().from(table).where(and(
  eq(table.column1, 5),
  eq(table.column2, 'value')
))

// 少なくとも1つが真でなければならない条件を組み合わせ
db.select().from(table).where(or(
  eq(table.column1, 5),
  eq(table.column2, 'value')
))
```

### 6. 配列固有の演算子

```typescript
import { arrayContains, arrayContained, arrayOverlaps } from 'drizzle-orm';

// 配列にすべての指定要素が含まれているか確認
db.select().from(table).where(arrayContains(table.tags, ['tag1', 'tag2']))

// 配列が別の配列に含まれているか確認
db.select().from(table).where(arrayContained(table.tags, ['tag1', 'tag2', 'tag3']))

// 配列に重複する要素があるか確認
db.select().from(table).where(arrayOverlaps(table.tags, ['tag1', 'tag2']))
```

各演算子は、直接値の比較とサブクエリベースの比較の両方をサポートし、異なるデータベースシステム全体で柔軟なクエリ機能を提供します。
