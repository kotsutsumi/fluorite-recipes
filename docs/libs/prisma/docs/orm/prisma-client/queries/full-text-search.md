# フルテキスト検索

Prisma Clientは、PostgreSQL（v2.30.0以降）とMySQL（v3.8.0以降）でフルテキスト検索をサポートしています。データベースカラム内のテキストを検索できます。

**注意**: PostgreSQLではプレビュー機能です。

## PostgreSQLのセットアップ

1. スキーマにプレビュー機能を追加:

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearchPostgres"]
}
```

2. Prisma Clientを生成
3. 文字列フィールドで`search`フィールドを使用

## PostgreSQLクエリ例

```typescript
// 'cat'を含む投稿を検索
const result = await prisma.posts.findMany({
  where: {
    body: {
      search: 'cat',
    },
  },
})

// 'and' (&)と'or' (|)演算子を使用
const result = await prisma.posts.findMany({
  where: {
    body: {
      search: 'cat & dog',
    },
  },
})
```

## MySQLクエリ例

```typescript
// 'cat'または'dog'を含む投稿を検索
const result = await prisma.posts.findMany({
  where: {
    body: {
      search: 'cat dog',
    },
  },
})

// '+'(and)と'-'(not)演算子を使用
const result = await prisma.posts.findMany({
  where: {
    body: {
      search: '+cat -dog',
    },
  },
})
```

## 関連性でソート

```typescript
const posts = await prisma.post.findMany({
  orderBy: {
    _relevance: {
      fields: ['title'],
      search: 'database',
      sort: 'asc'
    },
  },
})
```

## MySQLのインデックス作成

```prisma
model Blog {
  content String
  title   String
  @@fulltext([content])
  @@fulltext([content, title])
}
```

## パフォーマンスのためのRaw SQLの代替案

- **PostgreSQL**: `to_tsvector`と`to_tsquery`を使用
- **MySQL**: `MATCH() AGAINST()`を使用

Raw SQLは、複雑な検索やパフォーマンスが重要な場合に推奨されます。
