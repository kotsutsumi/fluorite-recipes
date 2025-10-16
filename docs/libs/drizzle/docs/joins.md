# JOIN操作

Drizzle ORMにおけるJOINの包括的なガイドです。

## JOINの種類

Drizzle ORMは、複数のJOINタイプをサポートしています：

- Left Join
- Left Join Lateral
- Right Join
- Inner Join
- Inner Join Lateral
- Full Join
- Cross Join
- Cross Join Lateral

## 主要な機能

- SQL-like構文
- 型安全なJOIN操作
- 部分選択をサポート
- テーブルエイリアスと自己結合を処理
- 柔軟な結果集約

## スキーマ例

```typescript
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

const pets = pgTable('pets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: integer('owner_id').references(() => users.id),
});
```

## 基本的なLeft Joinの例

```typescript
const result = await db
  .select()
  .from(users)
  .leftJoin(pets, eq(users.id, pets.ownerId));
```

## 部分選択

型推論で特定のフィールドを選択：

```typescript
await db.select({
  userId: users.id,
  petId: pets.id,
}).from(users).leftJoin(pets, eq(users.id, pets.ownerId));
```

## ネストされたSELECT

複雑なネストされたオブジェクト選択をサポート：

```typescript
await db.select({
  userId: users.id,
  pet: {
    id: pets.id,
    name: pets.name
  }
}).from(users).fullJoin(pets, eq(users.id, pets.ownerId));
```

## 高度なユースケース

- テーブルエイリアスを使用した自己結合
- Many-to-one関係
- ジョインテーブルを使用したMany-to-many関係

ドキュメントは、各JOINタイプの包括的な例を提供し、データベースリレーションシップの処理におけるDrizzle ORMの柔軟性と型安全性を示しています。
