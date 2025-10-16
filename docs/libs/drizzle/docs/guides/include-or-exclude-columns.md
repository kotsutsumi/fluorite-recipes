# Drizzle ORM: クエリでのカラムの包含・除外

## 概要
このガイドでは、PostgreSQL、MySQL、SQLiteデータベースでDrizzle ORMのクエリにおいてカラムを包含・除外する様々な方法を説明します。

## 基本的なカラム選択

### すべてのカラムを含める
```typescript
await db.select().from(posts);
```

### 特定のカラムを含める
```typescript
await db.select({ title: posts.title }).from(posts);
```

### すべてのカラムと追加カラムを含める
```typescript
await db
  .select({
    ...getTableColumns(posts),
    titleLength: sql<number>`length(${posts.title})`,
  })
  .from(posts);
```

### カラムを除外
```typescript
const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
```

## JOINとカラム選択
```typescript
await db
  .select({
    postId: posts.id,
    comment: { ...rest },
    user: users,
  })
  .from(posts)
  .leftJoin(comments, eq(posts.id, comments.postId))
  .leftJoin(users, eq(users.id, posts.userId));
```

## リレーショナルクエリでのカラム選択

### すべてのカラムを含める
```typescript
await db.query.posts.findMany();
```

### 特定のカラムを含める
```typescript
await db.query.posts.findMany({
  columns: {
    title: true,
  },
});
```

### カラムを除外
```typescript
await db.query.posts.findMany({
  columns: {
    content: false,
  },
});
```

### 条件付きカラム選択
```typescript
const searchPosts = async (withTitle = false) => {
  await db
    .select({
      id: posts.id,
      ...(withTitle && { title: posts.title }),
    })
    .from(posts);
};
```

## 主なユーティリティ
- `getTableColumns()`: テーブルカラムを抽出
- `sql`: カスタムSQL式を作成
- リレーショナルクエリAPIの`columns`と`extras`オプション
