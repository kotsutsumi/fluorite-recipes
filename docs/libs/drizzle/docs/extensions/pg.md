# PostgreSQL 拡張機能

Drizzle ORMにおけるPostgreSQLの拡張機能の包括的なガイドです。

## pg_vector 拡張機能

pg_vectorは、PostgreSQLのオープンソースベクトル類似性検索拡張機能です。

### 主要な機能

- 他のデータと一緒にベクトルを保存
- 正確および近似最近傍検索
- さまざまなベクトル型と距離のサポート

### カラム型: vector

```typescript
import { pgTable, vector, serial, text } from 'drizzle-orm/pg-core';

const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name'),
  embedding: vector('embedding', { dimensions: 3 })
});
```

### 距離計算関数

pg_vectorは、さまざまな距離メトリックをサポートしています：

#### L2距離（ユークリッド距離）

```typescript
import { l2Distance } from 'drizzle-orm';

const results = await db
  .select()
  .from(items)
  .orderBy(l2Distance(items.embedding, [3, 1, 2]))
  .limit(5);
```

#### L1距離（マンハッタン距離）

```typescript
import { l1Distance } from 'drizzle-orm';

const results = await db
  .select()
  .from(items)
  .orderBy(l1Distance(items.embedding, [3, 1, 2]))
  .limit(5);
```

#### 内積

```typescript
import { innerProduct } from 'drizzle-orm';

const results = await db
  .select()
  .from(items)
  .orderBy(innerProduct(items.embedding, [3, 1, 2]))
  .limit(5);
```

#### コサイン距離

```typescript
import { cosineDistance } from 'drizzle-orm';

const results = await db
  .select()
  .from(items)
  .orderBy(cosineDistance(items.embedding, [3, 1, 2]))
  .limit(5);
```

#### ハミング距離

```typescript
import { hammingDistance } from 'drizzle-orm';

const results = await db
  .select()
  .from(items)
  .orderBy(hammingDistance(items.embedding, [1, 0, 1]))
  .limit(5);
```

#### ジャッカード距離

```typescript
import { jaccardDistance } from 'drizzle-orm';

const results = await db
  .select()
  .from(items)
  .orderBy(jaccardDistance(items.embedding, [1, 0, 1]))
  .limit(5);
```

### インデックス

異なる距離メトリックのためのインデックスを作成：

```typescript
import { index } from 'drizzle-orm/pg-core';

const items = pgTable('items', {
  id: serial('id').primaryKey(),
  embedding: vector('embedding', { dimensions: 3 })
}, (table) => [
  index('embeddingIndex').using('hnsw', table.embedding.op('vector_l2_ops'))
]);
```

## PostGIS 拡張機能

PostGISは、PostgreSQLを地理空間データをサポートするように拡張します。

### 主要な機能

- 地理空間情報の保存
- 地理データのインデックス作成
- 空間関係のクエリ

### カラム型: geometry

```typescript
import { pgTable, geometry, serial, text } from 'drizzle-orm/pg-core';

const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  name: text('name'),
  location: geometry('location', { type: 'point' })
});
```

### ジオメトリタイプ

PostGISは、さまざまなジオメトリタイプをサポートしています：

- `point`: 点
- `linestring`: 線
- `polygon`: 多角形
- `multipoint`: 複数点
- `multilinestring`: 複数線
- `multipolygon`: 複数多角形
- `geometrycollection`: ジオメトリコレクション

### ジオメトリモード

#### タプルモード

座標を`[x, y]`として表現：

```typescript
const items = pgTable('items', {
  id: serial('id').primaryKey(),
  geo: geometry('geo', { type: 'point', mode: 'tuple' })
});

// 使用例
await db.insert(items).values({
  geo: [1.23, 4.56]
});
```

#### XYモード

座標を`{ x, y }`として表現：

```typescript
const items = pgTable('items', {
  id: serial('id').primaryKey(),
  geoObj: geometry('geo_obj', { type: 'point', mode: 'xy' })
});

// 使用例
await db.insert(items).values({
  geoObj: { x: 1.23, y: 4.56 }
});
```

### インデックスの作成

PostGISカラムにインデックスを作成：

```typescript
import { index } from 'drizzle-orm/pg-core';

const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  geo: geometry('geo', { type: 'point' })
}, (table) => [
  index('geoIndex').using('gist', table.geo)
]);
```

### 空間クエリ

```typescript
import { sql } from 'drizzle-orm';

// 特定の距離内のポイントを見つける
const nearbyLocations = await db
  .select()
  .from(locations)
  .where(
    sql`ST_DWithin(${locations.geo}, ST_MakePoint(1.0, 2.0), 1000)`
  );

// ポイント間の距離を計算
const distances = await db
  .select({
    id: locations.id,
    name: locations.name,
    distance: sql<number>`ST_Distance(${locations.geo}, ST_MakePoint(1.0, 2.0))`
  })
  .from(locations);
```

## 拡張機能の有効化

PostgreSQLデータベースで拡張機能を有効にする必要があります：

### pg_vector

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### PostGIS

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

## 実践例

### ベクトル類似性検索

```typescript
const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name'),
  description: text('description'),
  embedding: vector('embedding', { dimensions: 1536 }) // OpenAI embeddings
});

// 類似製品を見つける
const searchEmbedding = [/* ... 1536次元のベクトル ... */];

const similarProducts = await db
  .select({
    id: products.id,
    name: products.name,
    similarity: sql<number>`1 - ${cosineDistance(products.embedding, searchEmbedding)}`
  })
  .from(products)
  .orderBy(cosineDistance(products.embedding, searchEmbedding))
  .limit(10);
```

### 地理空間クエリ

```typescript
const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name'),
  location: geometry('location', { type: 'point', mode: 'xy' })
});

// ユーザーの場所に最も近い店舗を見つける
const userLocation = { x: -122.4194, y: 37.7749 }; // サンフランシスコ

const nearestStores = await db
  .select({
    id: stores.id,
    name: stores.name,
    distance: sql<number>`ST_Distance(
      ${stores.location}::geography,
      ST_SetSRID(ST_MakePoint(${userLocation.x}, ${userLocation.y}), 4326)::geography
    )`
  })
  .from(stores)
  .orderBy(
    sql`ST_Distance(
      ${stores.location}::geography,
      ST_SetSRID(ST_MakePoint(${userLocation.x}, ${userLocation.y}), 4326)::geography
    )`
  )
  .limit(5);
```

## まとめ

Drizzle ORMは、pg_vectorとPostGISの両方に対して優れたサポートを提供し、ベクトル類似性検索と地理空間クエリ機能を有効にします。これらの拡張機能は、AI駆動のアプリケーションや位置ベースのサービスに不可欠です。
