# drizzle-valibot

drizzle-valibotは、データベーススキーマからValibotスキーマを生成するDrizzle ORMプラグインです。

## インストール

```bash
npm i drizzle-valibot
```

## 主な機能

### 1. Selectスキーマ

データベースからクエリされたデータを検証します。

```typescript
import { createSelectSchema } from 'drizzle-valibot';

const userSelectSchema = createSelectSchema(users);
```

### 2. Insertスキーマ

データベースに挿入する前にデータを検証します。

```typescript
const userInsertSchema = createInsertSchema(users);
```

### 3. Updateスキーマ

データベース更新用のデータを検証し、生成カラムの更新を防止します。

```typescript
const userUpdateSchema = createUpdateSchema(users);
```

## 高度な機能

### リファインメント

フィールドスキーマを拡張または変更：

```typescript
import { pipe, maxLength } from 'valibot';

const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)),
  preferences: object({ theme: string() })
});
```

スキーマを拡張したり、完全に上書きしたりできます。

## データ型マッピング

プラグインは、さまざまなデータベースカラム型をValibotスキーマに自動的にマッピングします：

- Boolean
- Date
- String
- Numeric型
- JSON
- Arrays
- Geometry型

## 使用例

```typescript
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)),
  preferences: object({ theme: string() })
});

const result = parse(userSelectSchema, userData);
```

## 互換性

- Drizzle ORM v0.36.0+
- Valibot v1.0.0-beta.7+

ドキュメントは、Drizzle ORMと連携する際の互換性とバージョン要件を強調しています。
