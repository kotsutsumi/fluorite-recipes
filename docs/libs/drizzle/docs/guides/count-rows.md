# Drizzle ORM: 行数のカウント

このガイドでは、異なるデータベース(PostgreSQL、MySQL、SQLite)でDrizzle ORMを使用して行数をカウントする様々な方法を説明します。

## 基本的な行数カウント

### `count()`関数の使用

```typescript
// すべての行をカウント
await db.select({ count: count() }).from(products);

// 特定のカラムでNULL以外の値を持つ行をカウント
await db.select({ count: count(products.discount) }).from(products);
```

### SQL演算子の使用

```typescript
// 代替カウント方法
await db.select({ count: sql`count(*)`.mapWith(Number) }).from(products);
```

## 条件付きカウント

```typescript
// 特定の条件に一致する行をカウント
await db
  .select({ count: count() })
  .from(products)
  .where(gt(products.price, 100));
```

## JOINと集計を使った高度なカウント

```typescript
// 各国の都市数をカウント
await db
  .select({
    country: countries.name,
    citiesCount: count(cities.id),
  })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id)
  .orderBy(countries.name);
```

## データベース固有の考慮事項

### PostgreSQLとMySQL
- `count()`はbigintを返す(文字列として解釈される)
- 整数へのキャストが必要な場合がある

### SQLite
- `count()`は直接整数を返す

### カスタムカウント関数

```typescript
const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};
```

## 主なポイント
- 行数カウントには`count()`関数を使用
- `.where()`で条件を適用可能
- JOINと集計と併用可能
- データベースタイプ間でわずかな違いがある
- 型変換に`.mapWith()`を使用可能
