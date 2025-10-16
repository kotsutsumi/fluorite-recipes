# ビュー

Drizzle ORMにおけるビューの包括的なガイドです。

## ビューの概要

Drizzle ORMは、異なるデータベースタイプ（PostgreSQL、MySQL、SQLite）でビューを宣言することをサポートしています。複数のアプローチがあります。

## ビューを宣言する方法

1. インラインクエリビルダー構文
2. スタンドアロンクエリビルダー
3. 生のSQL
4. 既存のビュー
5. マテリアライズドビュー（PostgreSQL専用）

### 基本的なビュー宣言

PostgreSQLの例：

```typescript
import { pgTable, pgView, serial, text } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email')
});

export const userView = pgView("user_view").as((qb) => qb.select().from(users));
```

### 特定のカラムの選択

カラムのサブセットを選択できます：

```typescript
export const customersView = pgView("customers_view").as((qb) => {
  return qb
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users);
});
```

### 生のSQLビュー

クエリビルダーでサポートされていない複雑なクエリの場合：

```typescript
import { sql, eq } from 'drizzle-orm';

const newYorkers = pgView('new_yorkers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  cityId: integer('city_id').notNull(),
}).as(sql`select * from ${users} where ${eq(users.cityId, 1)}`);
```

### 既存のビュー

既存のデータベースビューへの読み取り専用アクセスの場合：

```typescript
export const trimmedUser = pgView("trimmed_user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
}).existing();
```

### マテリアライズドビュー（PostgreSQL）

クエリ結果を永続化するPostgreSQL専用のビュー：

```typescript
import { pgMaterializedView } from 'drizzle-orm/pg-core';

const newYorkers = pgMaterializedView('new_yorkers')
  .as((qb) => qb.select().from(users).where(eq(users.cityId, 1)));

// ビューのリフレッシュ
await db.refreshMaterializedView(newYorkers);
```

### 同時リフレッシュ

```typescript
await db.refreshMaterializedView(newYorkers).concurrently();
```

### データなしでリフレッシュ

```typescript
await db.refreshMaterializedView(newYorkers).withNoData();
```

## 高度な設定

### チェックオプション付きビュー

```typescript
const usersView = pgView('users_view', {
  id: serial('id'),
  name: text('name'),
  email: text('email')
})
  .as((qb) => qb.select().from(users))
  .withCheckOption();
```

### セキュリティ設定

```typescript
const secureView = pgView('secure_view', {
  id: serial('id'),
  name: text('name')
})
  .as((qb) => qb.select().from(users))
  .securityInvoker();
```

## ビューのクエリ

ビューは通常のテーブルと同様にクエリできます：

```typescript
// すべての行を選択
const allUsers = await db.select().from(userView);

// フィルタリング付き
const filteredUsers = await db
  .select()
  .from(userView)
  .where(eq(userView.id, 1));
```

## MySQLでのビュー

```typescript
import { mysqlTable, mysqlView, int, text } from 'drizzle-orm/mysql-core';

const users = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: text('name')
});

const userView = mysqlView('user_view').as((qb) => qb.select().from(users));
```

## SQLiteでのビュー

```typescript
import { sqliteTable, sqliteView, integer, text } from 'drizzle-orm/sqlite-core';

const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name')
});

const userView = sqliteView('user_view').as((qb) => qb.select().from(users));
```

## ベストプラクティス

1. **パフォーマンス**: 複雑なクエリにはマテリアライズドビューを使用
2. **セキュリティ**: 機密データにはセキュリティ設定を適用
3. **メンテナンス**: マテリアライズドビューを定期的にリフレッシュ
4. **命名**: ビューに明確で説明的な名前を使用

## まとめ

Drizzle ORMは、複数のデータベースシステムにわたって、柔軟で強力なビューサポートを提供します。基本的なビューから高度なマテリアライズドビューまで、さまざまなユースケースに対応できます。
