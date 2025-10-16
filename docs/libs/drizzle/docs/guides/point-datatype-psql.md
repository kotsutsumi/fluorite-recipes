# Drizzle ORMを使用したPostgreSQLのPointデータ型

## 概要
PostgreSQLは2次元座標を表すための`point`データ型を提供しており、通常は地理的位置の保存に使用されます。Drizzle ORMはこのデータ型とのシームレスな統合を提供します。

## Pointデータ型を持つテーブルの作成

```typescript
import { pgTable, point, serial, text } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: point('location', { mode: 'xy' }).notNull(),
});
```

## Pointデータの挿入

複数の方法でpointデータを挿入できます:

```typescript
// Mode: 'xy'
await db.insert(stores).values({
  name: 'Test',
  location: { x: -90.9, y: 18.7 },
});

// Mode: 'tuple'
await db.insert(stores).values({
  name: 'Test',
  location: [-90.9, 18.7],
});

// SQL raw
await db.insert(stores).values({
  name: 'Test',
  location: sql`point(-90.9, 18.7)`,
});
```

## 距離の計算

`<->`演算子を使用してpoint間の距離を計算:

```typescript
const point = {
  x: -73.935_242,
  y: 40.730_61,
};

const sqlDistance = sql`location <-> point(${point.x}, ${point.y})`;

await db
  .select({
    ...getTableColumns(stores),
    distance: sql`round((${sqlDistance})::numeric, 2)`,
  })
  .from(stores)
  .orderBy(sqlDistance)
  .limit(1);
```

## 矩形境界によるフィルタリング

`<@`演算子を使用して、特定の矩形エリア内のpointをフィルタリング:

```typescript
const point = {
  x1: -88,
  x2: -73,
  y1: 40,
  y2: 43,
};

await db
  .select()
  .from(stores)
  .where(sql`${stores.location} <@ box(point(${point.x1}, ${point.y1}), point(${point.x2}, ${point.y2}))`);
```

## 主なポイント
- PostgreSQLのネイティブなpointデータ型をサポート
- 複数の挿入形式(xy、tuple、raw SQL)
- 距離計算のための演算子
- 境界ボックスクエリのサポート
- 位置情報ベースのアプリケーションに最適
