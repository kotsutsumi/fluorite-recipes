# drizzle-typebox

drizzle-typeboxは、データベーススキーマからTypeboxスキーマを生成するDrizzle ORMプラグインです。

## インストール

```bash
npm i drizzle-typebox
```

## 主な機能

### 1. Selectスキーマ

データベースデータのクエリ用スキーマを生成し、APIレスポンスを検証します。

```typescript
import { createSelectSchema } from 'drizzle-typebox';

const userSelectSchema = createSelectSchema(users);
const parsed = Value.Parse(userSelectSchema, rows[0]);
```

### 2. Insertスキーマ

データベース挿入のデータ構造を定義し、APIリクエストペイロードを検証します。

```typescript
const userInsertSchema = createInsertSchema(users);
```

### 3. Updateスキーマ

データベース更新のデータ構造を定義し、変更リクエストペイロードを検証します。

```typescript
const userUpdateSchema = createUpdateSchema(users);
```

## 高度な機能

### リファインメント

フィールドスキーマを拡張または変更：

```typescript
const userSchema = createSelectSchema(users, {
  name: Type.String({ minLength: 3, maxLength: 50 }),
  age: Type.Number({ minimum: 18 })
});
```

### ファクトリー関数

カスタムTypeboxインスタンス用のファクトリー関数をサポート：

```typescript
import { Type } from '@sinclair/typebox';

const customUserSchema = createSelectSchema(users, {
  preferences: Type.Object({ theme: Type.String() })
});
```

## データ型マッピング

プラグインは、データベース固有の型をTypeboxスキーマに自動変換します：

- Numeric型
- String型
- Date型
- JSON型
- Array型
- Geometry型

## 主な利点

- 型安全なデータベースインタラクション
- 自動スキーマ生成
- クロスデータベース互換性
- 柔軟なスキーマカスタマイズ

drizzle-typeboxは、PostgreSQL、MySQL、SQLite全体で包括的なサポートを提供し、各スキーマ作成メソッドとデータ型変換の詳細な例とリファレンスを提供します。
