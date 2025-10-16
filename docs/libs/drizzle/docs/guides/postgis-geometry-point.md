# Drizzle ORM - PostGIS Geometry Pointガイド

## 主なハイライト

このガイドでは、PostGISとDrizzle ORMを使用したPostgreSQLの地理空間データの操作について説明します:
- PostGIS拡張機能の作成
- ジオメトリテーブルの定義
- 地理空間データの挿入
- 空間情報のクエリ

## セットアップ手順

### 1. PostGIS拡張機能を作成

以下の内容でマイグレーションファイルを作成:
```sql
CREATE EXTENSION postgis;
```

### 2. Geometryを持つスキーマを定義

```typescript
export const stores = pgTable(
  'stores',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    location: geometry('location', {
      type: 'point',
      mode: 'xy',
      srid: 4326
    }).notNull(),
  },
  (t) => [
    index('spatial_index').using('gist', t.location),
  ]
);
```

### 3. Geometryデータの挿入

複数の挿入方法:
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
  location: sql`ST_SetSRID(ST_MakePoint(-90.9, 18.7), 4326)`,
});
```

### 4. 空間クエリ

#### 距離計算
```typescript
const point = {
  x: -73.935242,
  y: 40.73061,
};

const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)`;

const nearestStore = await db
  .select({
    ...getTableColumns(stores),
    distance: sql`ST_Distance(${stores.location}, ${sqlPoint})`,
  })
  .from(stores)
  .orderBy(sql`ST_Distance(${stores.location}, ${sqlPoint})`)
  .limit(1);
```

#### 半径内の検索
```typescript
const storesWithinRadius = await db
  .select()
  .from(stores)
  .where(sql`ST_DWithin(${stores.location}, ${sqlPoint}, 1000)`);
```

## 主なポイント
- PostGISは高度な地理空間機能を提供
- SRID 4326はWGS 84座標系(GPS)
- GISTインデックスは空間クエリのパフォーマンスを向上
- `ST_Distance`で距離を計算
- `ST_DWithin`で半径検索を実行
- 位置情報ベースのサービスに最適
