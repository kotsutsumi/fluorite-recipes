# リレーション

Drizzle ORMにおけるリレーションの包括的なガイドです。

## 概要

Drizzle ORMは、`relations`演算子を使用して、データベースのリレーションシップを定義し、作業するための柔軟で直感的な方法を提供します。主な目標は、シンプルで簡潔なリレーショナルデータのクエリを可能にすることです。

## リレーションシップの種類

1. One-to-One（1対1）リレーション
2. One-to-Many（1対多）リレーション
3. Many-to-Many（多対多）リレーション

## One-to-One リレーション

自己参照ユーザー招待の例：

```typescript
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  invitedBy: integer('invited_by'),
});

export const usersRelations = relations(users, ({ one }) => ({
  invitee: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
}));
```

## One-to-Many リレーション

ユーザーと投稿の例：

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id').notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

### クエリの実行

```typescript
const usersWithPosts = await db.query.users.findMany({
  with: {
    posts: true,
  },
});
```

## Many-to-Many リレーション

ユーザーとグループをジャンクションテーブルで結ぶ例：

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const usersToGroups = pgTable('users_to_groups', {
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  groupId: integer('group_id')
    .notNull()
    .references(() => groups.id),
}, (t) => [
  primaryKey({ columns: [t.userId, t.groupId] }),
]);

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
}));
```

### クエリの実行

```typescript
const usersWithGroups = await db.query.users.findMany({
  with: {
    usersToGroups: {
      with: {
        group: true,
      },
    },
  },
});
```

## 外部キーなしのリレーション

Drizzleは、外部キー制約なしでもリレーションを定義できます：

```typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id'), // 外部キーなし
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

## 曖昧なリレーション

複数のリレーションがある場合は、`relationName`を使用して明確化：

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id'),
  reviewerId: integer('reviewer_id'),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  reviewer: one(users, {
    fields: [posts.reviewerId],
    references: [users.id],
    relationName: 'reviewer',
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  authoredPosts: many(posts, { relationName: 'author' }),
  reviewedPosts: many(posts, { relationName: 'reviewer' }),
}));
```

## リレーショナルクエリ

リレーションを定義したら、ネストされたクエリを実行できます：

```typescript
// ユーザーと投稿を取得
const result = await db.query.users.findMany({
  with: {
    posts: true,
  },
});

// フィルタリング付き
const result = await db.query.users.findMany({
  with: {
    posts: {
      where: (posts, { eq }) => eq(posts.published, true),
      limit: 10,
    },
  },
});

// ネストされたリレーション
const result = await db.query.users.findMany({
  with: {
    posts: {
      with: {
        comments: true,
      },
    },
  },
});
```

## ベストプラクティス

1. **明確な命名**: リレーションに説明的な名前を使用
2. **外部キー**: 可能な限り外部キー制約を使用してデータの整合性を確保
3. **インデックス**: リレーションシップカラムにインデックスを作成してパフォーマンスを向上
4. **曖昧さの回避**: 複数のリレーションには`relationName`を使用

## まとめ

Drizzle ORMのリレーション機能は、型安全でパフォーマンスの高いリレーショナルクエリを可能にします。柔軟な定義と直感的なクエリ構文により、複雑なデータ構造を簡単に操作できます。
