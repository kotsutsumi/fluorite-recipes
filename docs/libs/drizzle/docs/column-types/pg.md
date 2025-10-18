# PostgreSQL カラム型

Drizzle ORMにおけるPostgreSQLのカラム型の包括的なガイドです。

## 主要なカラム型

### 1. 数値型

#### integer
4バイト符号付き整数

```typescript
const table = pgTable('table', {
  id: integer('id')
});
```

#### smallint
2バイト符号付き整数

```typescript
const table = pgTable('table', {
  count: smallint('count')
});
```

#### bigint
8バイト符号付き整数

```typescript
const table = pgTable('table', {
  largeNumber: bigint('large_number', { mode: 'number' })
});
```

#### serial
自動インクリメントする4バイト整数

```typescript
const table = pgTable('table', {
  id: serial('id').primaryKey()
});
```

#### smallserial
自動インクリメントする2バイト整数

```typescript
const table = pgTable('table', {
  id: smallserial('id').primaryKey()
});
```

#### bigserial
自動インクリメントする8バイト整数

```typescript
const table = pgTable('table', {
  id: bigserial('id').primaryKey()
});
```

### 2. テキスト型

#### text
可変長文字列

```typescript
const table = pgTable('table', {
  description: text('description')
});
```

#### varchar
オプションの長さ指定付き可変長文字列

```typescript
const table = pgTable('table', {
  name: varchar('name', { length: 255 })
});
```

#### char
固定長文字列

```typescript
const table = pgTable('table', {
  code: char('code', { length: 10 })
});
```

### 3. 数値精度型

#### numeric
設定可能な精度を持つ正確な数値

```typescript
const table = pgTable('table', {
  price: numeric('price', { precision: 10, scale: 2 })
});
```

#### real
単精度浮動小数点数

```typescript
const table = pgTable('table', {
  value: real('value')
});
```

#### double precision
倍精度浮動小数点数

```typescript
const table = pgTable('table', {
  precise: doublePrecision('precise')
});
```

### 4. 日付と時刻型

#### time
時刻

```typescript
const table = pgTable('table', {
  scheduledTime: time('scheduled_time')
});
```

#### timestamp
日付と時刻

```typescript
const table = pgTable('table', {
  createdAt: timestamp('created_at').defaultNow()
});
```

#### date
カレンダー日付

```typescript
const table = pgTable('table', {
  birthDate: date('birth_date')
});
```

#### interval
時間間隔

```typescript
const table = pgTable('table', {
  duration: interval('duration')
});
```

### 5. 特殊型

#### json
テキスト形式のJSONデータ

```typescript
const table = pgTable('table', {
  metadata: json('metadata')
});
```

#### jsonb
バイナリJSONデータ

```typescript
const table = pgTable('table', {
  data: jsonb('data')
});
```

#### point
幾何学的な点

```typescript
const table = pgTable('table', {
  location: point('location')
});
```

#### line
幾何学的な線

```typescript
const table = pgTable('table', {
  path: line('path')
});
```

#### enum
列挙型

```typescript
const statusEnum = pgEnum('status', ['active', 'inactive', 'pending']);

const table = pgTable('table', {
  status: statusEnum('status')
});
```

## 主要な機能

### デフォルト値のサポート

```typescript
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow()
});
```

### NOT NULL制約

```typescript
const table = pgTable('table', {
  name: text('name').notNull()
});
```

### プライマリキー定義

```typescript
const table = pgTable('table', {
  id: serial('id').primaryKey()
});
```

### 型のカスタマイズ `.$type()`

```typescript
const table = pgTable('table', {
  data: jsonb('data').$type<CustomType>()
});
```

### Identity カラムの生成

```typescript
const table = pgTable('table', {
  id: integer('id').generatedAlwaysAsIdentity()
});
```

### ランタイムのデフォルトと更新関数

```typescript
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date())
});
```

## スキーマの例

```typescript
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age'),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
```

このライブラリは、ランタイムとコンパイル時の両方で型安全性を持つ広範な型サポートを提供します。
