# スキーマ

Drizzle ORMにおけるスキーマ宣言の包括的なガイドです。

## 概要

Drizzle ORMは、異なるデータベース方言に対してスキーマ宣言APIを提供します。

## PostgreSQLスキーマ

### 基本的なスキーマ宣言

```typescript
import { serial, text, pgSchema } from "drizzle-orm/pg-core";

export const mySchema = pgSchema("my_schema");

export const colors = mySchema.enum('colors', ['red', 'green', 'blue']);

export const mySchemaUsers = mySchema.table('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  color: colors('color').default('red'),
});
```

### 主要な機能

- カスタムスキーマの作成
- 列挙型の定義
- 特定のスキーマ内でのテーブル作成
- クエリでのスキーマ名の自動付加

### 複数のスキーマ

```typescript
import { pgSchema } from "drizzle-orm/pg-core";

const publicSchema = pgSchema("public");
const privateSchema = pgSchema("private");

const publicUsers = publicSchema.table('users', {
  id: serial('id').primaryKey(),
  name: text('name')
});

const privateData = privateSchema.table('data', {
  id: serial('id').primaryKey(),
  content: text('content')
});
```

## MySQLスキーマ

### 基本的なスキーマ宣言

```typescript
import { int, text, mysqlSchema } from "drizzle-orm/mysql-core";

export const mySchema = mysqlSchema("my_schema");

export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```

### 主要な機能

- カスタムスキーマの作成
- スキーマ内でのテーブル定義
- 自動インクリメントのサポート
- デフォルト値の設定

## SingleStoreスキーマ

SingleStoreはMySQLと同様のスキーマ作成をサポートします：

```typescript
import { int, text, singlestoreSchema } from "drizzle-orm/singlestore-core";

export const mySchema = singlestoreSchema("my_schema");

export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```

## SQLiteに関する注意

SQLiteはスキーマをサポートしていません。SQLiteでは、すべてのテーブルはメインデータベース内に作成されます。

```typescript
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

// SQLiteではスキーマは不要
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
});
```

## スキーマの使用

### テーブルのクエリ

```typescript
import { db } from './db';
import { mySchemaUsers } from './schema';

// スキーマ名は自動的に含まれます
const users = await db.select().from(mySchemaUsers);
```

### 挿入

```typescript
await db.insert(mySchemaUsers).values({
  name: 'John Doe'
});
```

### 更新

```typescript
import { eq } from 'drizzle-orm';

await db
  .update(mySchemaUsers)
  .set({ name: 'Jane Doe' })
  .where(eq(mySchemaUsers.id, 1));
```

## 高度な機能

### スキーマ間のリレーション

```typescript
const schema1 = pgSchema("schema1");
const schema2 = pgSchema("schema2");

const users = schema1.table('users', {
  id: serial('id').primaryKey(),
  name: text('name')
});

const posts = schema2.table('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  content: text('content')
});
```

### 列挙型の共有

```typescript
const mySchema = pgSchema("my_schema");

const status = mySchema.enum('status', ['active', 'inactive', 'pending']);

const users = mySchema.table('users', {
  id: serial('id').primaryKey(),
  status: status('status')
});

const orders = mySchema.table('orders', {
  id: serial('id').primaryKey(),
  status: status('status')
});
```

## ベストプラクティス

1. **命名規則**: スキーマとテーブルに明確で一貫した命名規則を使用
2. **組織化**: 関連するテーブルを同じスキーマにグループ化
3. **セキュリティ**: スキーマを使用してアクセス制御を実装
4. **マイグレーション**: スキーマ変更を適切に管理

## データベース方言固有の注意事項

- **PostgreSQLとMySQL**: スキーマを完全にサポート
- **SQLite**: スキーマをサポートしません
- **SingleStore**: MySQLと同様のスキーマ作成をサポート

## まとめ

Drizzle ORMのスキーマ機能により、データベース構造を効果的に整理し、保守できます。適切なスキーマ設計により、アプリケーションのスケーラビリティとメンテナンス性が向上します。
