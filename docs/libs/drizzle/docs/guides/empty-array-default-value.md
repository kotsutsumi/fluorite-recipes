# Drizzle ORM: デフォルト値としての空配列

このガイドでは、異なるデータベースタイプで空配列をデフォルト値として設定する方法を説明します:

## PostgreSQL
```typescript
export const users = pgTable('users', {
  tags1: text('tags1')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  tags2: text('tags2')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
});
```

## MySQL
```typescript
export const users = mysqlTable('users', {
  tags1: json('tags1').$type<string[]>().notNull().default([]),
  tags2: json('tags2')
    .$type<string[]>()
    .notNull()
    .default(sql`('[]')`),
  tags3: json('tags3')
    .$type<string[]>()
    .notNull()
    .default(sql`(JSON_ARRAY())`),
});
```

## SQLite
```typescript
export const users = sqliteTable('users', {
  tags1: text('tags1', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default(sql`(json_array())`),
  tags2: text('tags2', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default(sql`'[]'`),
});
```

主なポイント:
- 各データベースタイプは空配列を異なる方法で扱う
- PostgreSQLは`'{}'`または`ARRAY[]`を使用
- MySQLはJSON配列メソッドを使用
- SQLiteはJSONモードでテキストを使用
- `.$type<string[]>()`はコンパイル時の型推論を提供
