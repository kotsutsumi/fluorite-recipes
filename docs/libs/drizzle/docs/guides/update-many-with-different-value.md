# Drizzle ORM: 各行に異なる値で複数行を更新

このガイドでは、Drizzle ORMを使用して、1回のデータベースリクエストで複数の行を異なる値で更新する方法を説明します。アプローチの内訳は以下の通りです:

## 主なステップ

1. 更新の詳細を含む入力配列を準備
2. `case`文と`sql`演算子を使用
3. 動的SQLクエリを構築
4. `.update().set()`メソッドで更新を実行

## コード例

```typescript
import { SQL, inArray, sql } from 'drizzle-orm';
import { users } from './schema';

const db = drizzle(...);

const inputs = [
  { id: 1, city: 'New York' },
  { id: 2, city: 'Los Angeles' },
  { id: 3, city: 'Chicago' },
];

// 入力配列が空でないことを確認
if (inputs.length === 0) {
  return;
}

const sqlChunks: SQL[] = [];
const ids: number[] = [];

sqlChunks.push(sql`(case`);

for (const input of inputs) {
  sqlChunks.push(sql`when ${users.id} = ${input.id} then ${input.city}`);
  ids.push(input.id);
}

sqlChunks.push(sql`end)`);

const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));

await db.update(users)
  .set({ city: finalSql })
  .where(inArray(users.id, ids));
```

## 生成されるSQL

```sql
update users set "city" =
  (case when id = 1 then 'New York'
        when id = 2 then 'Los Angeles'
        when id = 3 then 'Chicago' end)
where id in (1, 2, 3)
```

このアプローチにより、1回のデータベースリクエストで複数の行を異なる値で更新でき、パフォーマンスと効率が向上します。
