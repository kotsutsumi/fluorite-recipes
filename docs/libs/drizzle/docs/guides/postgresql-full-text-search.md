# Drizzle ORMを使用したPostgreSQL全文検索

## 主要概念

PostgreSQLの全文検索では、`to_tsvector`と`to_tsquery`のような特殊な関数を使用してドキュメント内のテキストを検索できます。Drizzle ORMは`sql`演算子を通じてこれらの操作をサポートしています。

## 主な関数

1. `to_tsvector`: テキストをトークンと語彙素に解析
2. `to_tsquery`: キーワードを正規化されたトークンに変換
3. `@@`演算子: 直接マッチングに使用

## 基本的な実装

### スキーマセットアップ

```typescript
import { index, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
  },
  (table) => [
    index('title_search_index').using('gin', sql`to_tsvector('english', ${table.title})`),
  ]
);
```

### 検索クエリ例

```typescript
import { sql } from 'drizzle-orm';

const title = 'trip';

await db
  .select()
  .from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);
```

## 高度な検索テクニック

- `|`演算子で複数のキーワードをマッチング
- 複数キーワードのマッチングには`plainto_tsquery`を使用
- 完全一致フレーズには`phraseto_tsquery`
- ウェブライクな検索構文には`websearch_to_tsquery`

## 複数カラム検索

`setweight`を使用して複数のカラムにインデックスを作成し、検索できます:

```typescript
export const posts = pgTable(
  'posts',
  {
    title: text('title').notNull(),
    description: text('description').notNull(),
  },
  (table) => [
    index('search_index').using(
      'gin',
      sql`(
          setweight(to_tsvector('english', ${table.title}), 'A') ||
          setweight(to_tsvector('english', ${table.description}), 'B')
      )`
    ),
  ]
);
```

## 主なポイント
- GINインデックスは全文検索のパフォーマンスを向上
- `setweight`で検索結果にランキングを追加
- 異なる言語設定をサポート
- 複数の検索関数で柔軟性を提供
- 複雑な検索クエリを構築可能
