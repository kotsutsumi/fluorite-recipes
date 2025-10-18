# インデックスと制約

Drizzle ORMにおけるインデックスと制約の包括的なガイドです。

## 制約の概要

制約は、データベーステーブルのカラムに適用されるルールで、データの正確性と信頼性を確保します。Drizzle ORMは、さまざまなデータベースシステムで複数の主要な制約をサポートしています。

### 1. DEFAULT 制約

値が提供されない場合に、カラムのデフォルト値を指定します。

```typescript
const table = pgTable('table', {
  integer1: integer('integer1').default(42),
  float1: real('float1').default(4.2),
  boolean1: boolean('boolean1').default(true)
});
```

定数、式、またはランダム生成など、さまざまなタイプのデフォルト値を使用できます。

### 2. NOT NULL 制約

カラムがNULL値を受け入れないようにします。フィールドが常に値を含むことを保証します。

```typescript
const table = pgTable('table', {
  integer: integer('integer').notNull(),
  name: text('name').notNull()
});
```

### 3. UNIQUE 制約

カラム内のすべての値が異なることを保証します。単一または複数のカラムに適用できます。

```typescript
// 単一カラムのUNIQUE
const table = pgTable('table', {
  id: integer('id').unique(),
  email: text('email').unique()
});

// 複合UNIQUE制約
const table = pgTable('table', {
  id: integer('id'),
  name: text('name')
}, (t) => [
  unique().on(t.id, t.name)
]);
```

カスタムの命名とnull処理をサポートしています。

### 4. CHECK 制約

カラムに配置できる値の範囲を制限します。カラムの値に基づいて条件を定義できます。

```typescript
import { sql } from 'drizzle-orm';

const table = pgTable('table', {
  age: integer('age')
}, (t) => [
  check('age_check', sql`${t.age} > 21`)
]);
```

### 5. PRIMARY KEY 制約

テーブル内の各レコードを一意に識別します。一意でnull以外の値を含む必要があります。

```typescript
// 単一カラムのプライマリキー
const table = pgTable('table', {
  id: serial('id').primaryKey()
});

// 複合プライマリキー
const table = pgTable('table', {
  userId: integer('user_id'),
  roleId: integer('role_id')
}, (t) => [
  primaryKey({ columns: [t.userId, t.roleId] })
]);
```

### 6. FOREIGN KEY 制約

プライマリキーを参照することで、テーブル間のリンクを作成します。

```typescript
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name')
});

const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id').references(() => users.id),
  content: text('content')
});
```

単一および複数カラムの外部キーをサポートしています。

```typescript
// 複合外部キー
const table = pgTable('table', {
  userId: integer('user_id'),
  roleId: integer('role_id')
}, (t) => [
  foreignKey({
    columns: [t.userId, t.roleId],
    foreignColumns: [users.id, roles.id]
  })
]);
```

## インデックス

Drizzle ORMは、さまざまなオプションを持つ柔軟なインデックス作成を提供します。

### 標準インデックス

```typescript
const table = pgTable('table', {
  name: text('name'),
  email: text('email')
}, (t) => [
  index('name_idx').on(t.name)
]);
```

### ユニークインデックス

```typescript
const table = pgTable('table', {
  email: text('email')
}, (t) => [
  uniqueIndex('email_idx').on(t.email)
]);
```

### 複合インデックス

```typescript
const table = pgTable('table', {
  firstName: text('first_name'),
  lastName: text('last_name')
}, (t) => [
  index('full_name_idx').on(t.firstName, t.lastName)
]);
```

### 高度なインデックスオプション

```typescript
const table = pgTable('table', {
  name: text('name'),
  createdAt: timestamp('created_at')
}, (t) => [
  index('name_idx')
    .on(t.name)
    .desc()
    .nullsLast()
]);
```

インデックスの命名、順序付け、および高度な設定をサポートしています。

## まとめ

Drizzle ORMは、以下の包括的なサポートを提供します：

- すべての標準SQL制約
- 柔軟なインデックス作成
- 型安全な制約定義
- 複数のデータベースシステム全体での一貫した構文
- カスタマイズ可能な命名と設定

これらの機能により、データの整合性とクエリのパフォーマンスを確保できます。
