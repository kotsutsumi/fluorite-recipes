# SQLタイムスタンプのデフォルト値ガイド

このガイドでは、Drizzle ORMを使用してPostgreSQL、MySQL、SQLiteのタイムスタンプのデフォルト値を設定する方法を説明します。

## PostgreSQL

### 現在のタイムスタンプ

```typescript
import { sql } from 'drizzle-orm';
import { timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
});
```

### Unixタイムスタンプ

```typescript
import { sql } from 'drizzle-orm';
import { integer, pgTable, serial } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp: integer('timestamp')
    .notNull()
    .default(sql`extract(epoch from now())`),
});
```

## MySQL

### 現在のタイムスタンプ

```typescript
import { sql } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
  timestamp3: timestamp('timestamp3', { fsp: 3 })
    .notNull()
    .default(sql`now(3)`),
});
```

### Unixタイムスタンプ

```typescript
import { sql } from 'drizzle-orm';
import { mysqlTable, serial, int } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp: int('timestamp')
    .notNull()
    .default(sql`unix_timestamp()`),
});
```

## SQLite

### 現在のタイムスタンプ

```typescript
import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp1: integer('timestamp1', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  timestamp2: text('timestamp2')
    .notNull()
    .default(sql`(current_timestamp)`),
});
```

## 主なポイント
- 各データベースには独自のタイムスタンプ関数がある
- `defaultNow()`は便利なヘルパーメソッド
- カスタムSQL式には`sql`テンプレートを使用
- タイムスタンプのモード(date、string、number)を選択可能
- MySQLは小数秒精度(fsp)をサポート
