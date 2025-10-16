# Drizzle ORMでのSQL値のデクリメント

このガイドでは、異なるSQLデータベース(PostgreSQL、MySQL、SQLite)でDrizzle ORMを使用してカラムの値をデクリメントする方法を説明します。

## 基本的なデクリメント方法

```typescript
import { eq, sql } from 'drizzle-orm';

const db = drizzle(...)

await db
  .update(table)
  .set({
    counter: sql`${table.counter} - 1`,
  })
  .where(eq(table.id, 1));
```

これは以下のSQLを生成します: `update "table" set "counter" = "counter" - 1 where "id" = 1`

## カスタムデクリメント関数

```typescript
import { AnyColumn } from 'drizzle-orm';

const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};

await db
  .update(table)
  .set({
    counter1: decrement(table.counter1),
    counter2: decrement(table.counter2, 10),
  })
  .where(eq(table.id, 1));
```

カスタム`decrement()`関数により以下が可能になります:
- デフォルトで1をデクリメント
- 柔軟なデクリメント値
- 1回の更新で複数カラムのデクリメント

## 前提条件

このガイドは以下の知識を前提としています:
- PostgreSQL、MySQL、SQLiteのデータベース設定
- Drizzle ORMのupdate文
- SQLフィルターと演算子
