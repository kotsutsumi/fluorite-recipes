# Drizzle ORM: SQL Limit/Offsetページネーションガイド

## 概要
このガイドでは、PostgreSQL、MySQL、SQLiteデータベースでDrizzle ORMを使用したlimit/offsetページネーションの実装方法を説明します。

## 基本的なページネーション例

```typescript
const getUsers = async (page = 1, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .orderBy(asc(users.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
};
```

## 主要な概念

### ページネーションの仕組み
- `limit`: 返す行数(ページサイズ)
- `offset`: スキップする行数 `((ページ番号 - 1) * ページサイズ)`

### ベストプラクティス
- ページネーションでは常に`orderBy`を使用
- 一意でないカラムの場合、順序付けに一意のカラムを追加
- 複数の順序付けカラムの例:

```typescript
const getUsers = async (page = 1, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .orderBy(asc(users.firstName), asc(users.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

## 代替ページネーション方法

### リレーショナルクエリAPI
```typescript
const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};
```

### カスタムページネーション関数
```typescript
function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 1,
  pageSize = 3,
) {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

## パフォーマンスの最適化

- 大規模なデータセットではlimit/offsetページネーションがパフォーマンス上の問題を引き起こす可能性がある
- 高いoffset値は多くの行をスキャンする必要がある
- 大規模なデータセットにはカーソルベースのページネーションを検討
