# クエリユーティリティ

Drizzleの`$count()`クエリユーティリティの概要です。

## `$count()`メソッド

`$count()`は、Drizzle ORMでレコードをカウントするための柔軟なユーティリティメソッドです。

## 基本的な使用法

```typescript
// すべてのレコードの簡単なカウント
const count = await db.$count(users);

// フィルター付きのカウント
const count = await db.$count(users, eq(users.name, "Dan"));
```

## サブクエリの例

各ユーザーの関連投稿をカウント：

```typescript
const users = await db.select({
  ...users,
  postsCount: db.$count(posts, eq(posts.authorId, users.id)),
}).from(users);
```

## リレーショナルクエリの例

```typescript
const users = await db.query.users.findMany({
  extras: {
    postsCount: db.$count(posts, eq(posts.authorId, users.id)),
  },
});
```

## 主要な機能

- SQLの`count(*)`機能をラップ
- フィルター付きまたはフィルターなしで使用可能
- サブクエリとリレーショナルクエリをサポート
- マッチングレコードの合計数を返す

このメソッドは、さまざまなクエリコンテキストでレコードカウントを取得するのに特に便利です。
