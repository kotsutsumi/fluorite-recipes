# Drizzle ORM: 少なくとも1つの関連子行を持つ親行を選択

このガイドでは、Drizzle ORMを使用して少なくとも1つの関連子行を持つ親行を選択する方法を説明します。主要な方法は以下の通りです:

## スキーマ例
```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id').notNull().references(() => users.id),
});
```

## 方法1: `.innerJoin()`を使用

```typescript
await db
  .select({
    user: users,
    post: posts,
  })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.userId))
  .orderBy(users.id);
```

## 方法2: `exists()`関数を使用

```typescript
const sq = db
  .select({ id: sql`1` })
  .from(posts)
  .where(eq(posts.userId, users.id));

await db.select().from(users).where(exists(sq));
```

主なポイント:
- `.innerJoin()`は親行と子行の両方を取得
- `exists()`は関連する子行を持つ親行のみを選択
- どちらの方法も投稿のないユーザーを除外
- PostgreSQL、MySQL、SQLiteデータベースで関連データを操作するための実用的な例を提供
