# Drizzle ORM: 一意で大文字小文字を区別しないメール処理

このガイドでは、PostgreSQL、MySQL、SQLiteの3つのデータベースシステムで、大文字小文字を区別しないメールの一意性を実装する方法を説明します。

## 主なアプローチ

コア戦略は、小文字化されたメールカラムに一意のインデックスを作成し、大文字小文字に関係なくメールが一意であることを保証することです。

### PostgreSQL実装

```typescript
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);

// カスタムlower関数
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
```

### MySQL実装

```typescript
export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);
```

### SQLite実装

```typescript
export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);
```

### クエリ例

```typescript
const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

## 主な違い

- PostgreSQLとSQLiteは標準の`lower()`関数を使用
- MySQLは`lower()`関数の周りに括弧が必要(バージョン8.0.13以降)
- すべてのデータベースで一意のインデックスを使用して大文字小文字を区別しない一意性を強制
- クエリ時には両側を小文字化する必要がある

## 主なポイント
- 大文字小文字を区別しない一意性に一意のインデックスを使用
- データベース間でわずかな構文の違いがある
- クエリ時には小文字化を適用
- パフォーマンスと整合性を保証
