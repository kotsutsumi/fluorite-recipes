# drizzle-zod

drizzle-zodは、データベーススキーマからZodスキーマを生成するDrizzle ORMプラグインです。

## インストール

```bash
npm i drizzle-zod
```

## 主な機能

### 1. Selectスキーマ

データベースからクエリされたデータの形状を定義し、APIレスポンスを検証します。

```typescript
import { createSelectSchema } from 'drizzle-zod';

const users = pgTable('users', {
  id: integer().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
```

### 2. Insertスキーマ

データベース挿入のデータ形状を定義し、APIリクエストデータを検証します。

```typescript
const userInsertSchema = createInsertSchema(users);
```

### 3. Updateスキーマ

データベース更新のデータ形状を定義し、変更リクエストを検証します。

```typescript
const userUpdateSchema = createUpdateSchema(users);
```

## 高度な機能

### リファインメント

フィールドスキーマを拡張または変更：

```typescript
const userSchema = createSelectSchema(users, {
  name: (schema) => schema.min(3).max(50),
  age: (schema) => schema.min(18)
});
```

### ファクトリー関数

カスタムZodインスタンスのためのファクトリー関数をサポート：

```typescript
import { z } from 'zod';

const customUserSchema = createSelectSchema(users, {
  preferences: z.object({ theme: z.string() })
});
```

## 型強制

Zodの型強制機能をサポートし、自動型変換を可能にします。

## データ型マッピング

PostgreSQL、MySQL、SQLiteにわたる包括的なデータ型マッピングを提供します。

### 例

- Boolean型 → `z.boolean()`
- Date型 → `z.date()`
- String型 → `z.string()`
- Numeric型 → `z.number()`
- JSON型 → `z.any()`（または型指定可能）
- Array型 → `z.array()`

drizzle-zodは、Drizzle ORMスキーマ定義から直接、型安全な検証スキーマを作成する便利な方法を提供します。
