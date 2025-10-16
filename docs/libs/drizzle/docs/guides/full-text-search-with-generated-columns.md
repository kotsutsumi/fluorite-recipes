# Drizzle ORMを使用したPostgreSQLの生成カラムによる全文検索

このガイドでは、Drizzle ORMでPostgreSQLの生成カラムを使用した全文検索の実装方法を説明します。主要な概念は以下の通りです:

## 基本的な実装

### スキーマ定義
```typescript
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    bodySearch: tsvector('body_search')
      .notNull()
      .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${posts.body})`)
  },
  (t) => [
    index('idx_body_search').using('gin', t.bodySearch)
  ]
);
```

### データの挿入
行を挿入すると、生成カラム`bodySearch`は自動的に計算されます:

```typescript
await db.insert(posts).values({
  body: "Golden leaves cover the quiet streets...",
  title: "The Beauty of Autumn"
}).returning();
```

### 検索
全文検索には`@@`演算子を使用:

```typescript
const searchParam = "bring";
await db
  .select()
  .from(posts)
  .where(sql`${posts.bodySearch} @@ to_tsquery('english', ${searchParam})`);
```

## 重み付け検索を使用した高度な実装

### 拡張スキーマ
```typescript
export const posts = pgTable(
  'posts',
  {
    title: text('title').notNull(),
    body: text('body').notNull(),
    search: tsvector('search')
      .notNull()
      .generatedAlwaysAs(
        (): SQL => sql`
          setweight(to_tsvector('english', ${posts.title}), 'A') ||
          setweight(to_tsvector('english', ${posts.body}), 'B')
        `
      )
  },
  (t) => [
    index('idx_search').using('gin', t.search)
  ]
);
```

### 高度な検索
```typescript
const searchParam = "bring";
await db
  .select()
  .from(posts)
  .where(sql`${posts.search} @@ to_tsquery('english', ${searchParam})`)
  .orderBy(sql`ts_rank(${posts.search}, to_tsquery('english', ${searchParam})) DESC`);
```

## 主なポイント
- 生成カラムは自動的に計算され保存される
- GINインデックスは検索パフォーマンスを向上
- `setweight`で異なるカラムに異なる重みを付ける
- `ts_rank`で検索結果を関連性でランク付け
- 挿入時に検索カラムを手動で管理する必要がない
- 複数カラムの全文検索をサポート
