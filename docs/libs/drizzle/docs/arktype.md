# drizzle-arktype

drizzle-arktypeは、Drizzle ORMスキーマからArktypeスキーマを生成するDrizzle ORMプラグインです。

## インストール

```bash
npm i drizzle-arktype
```

## 主な機能

### 1. Selectスキーマ

クエリされたデータベース結果のデータ形状を定義し、APIレスポンスを検証します。

```typescript
import { createSelectSchema } from 'drizzle-arktype';

const userSelectSchema = createSelectSchema(users);
```

### 2. Insertスキーマ

データベース挿入のデータ形状を定義し、APIリクエストデータを検証し、データベース挿入の型安全性を確保します。

```typescript
const userInsertSchema = createInsertSchema(users);
```

### 3. Updateスキーマ

データベース更新のデータ形状を定義し、更新用のAPIリクエストデータを検証し、生成カラムの更新を防止します。

```typescript
const userUpdateSchema = createUpdateSchema(users);
```

## 高度な機能

### リファインメント

フィールドスキーマを拡張または変更します：

```typescript
import { pipe, maxLength } from 'arktype';

const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)),
  preferences: object({ theme: string() })
});
```

既存のスキーマを拡張したり、完全に上書きしたりできます。

## データ型マッピング

プラグインは、さまざまなデータベースカラム型の包括的な型マッピングを提供します：

- Booleans
- Dates
- Strings
- Numeric型
- JSON
- Geometry型
- Arrays
- その他

## 使用例

```typescript
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)),
  preferences: object({ theme: string() })
});
```

このプラグインは、Arktypeの強力なスキーマ生成機能を活用することで、Drizzle ORMと連携する際の型安全性と検証を強化します。
