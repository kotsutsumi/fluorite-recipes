# Drizzle ORM: SQL値のインクリメント

## 前提条件
このガイドは以下の知識を前提としています:
- PostgreSQL、MySQL、SQLiteの開始方法
- Update文
- フィルターとSQL演算子

## 基本的なインクリメント方法

### シンプルなインクリメント
```typescript
import { eq, sql } from 'drizzle-orm';

const db = drizzle(...)

await db
  .update(table)
  .set({
    counter: sql`${table.counter} + 1`,
  })
  .where(eq(table.id, 1));

// 生成されるSQL:
// update "table" set "counter" = "counter" + 1 where "id" = 1
```

## カスタムインクリメント関数

```typescript
import { AnyColumn } from 'drizzle-orm';

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

await db
  .update(table)
  .set({
    counter1: increment(table.counter1),
    counter2: increment(table.counter2, 10),
  })
  .where(eq(table.id, 1));
```

## 主なポイント
- Drizzle ORMの柔軟なAPIを使用
- カスタムインクリメント値をサポート
- PostgreSQL、MySQL、SQLiteで動作
- シンプルで型安全な実装
