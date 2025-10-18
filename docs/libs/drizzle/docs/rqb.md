# リレーショナルクエリ

Drizzle ORMのリレーショナルクエリの包括的な概要です。

## 概要

リレーショナルクエリは、ネストされたリレーショナルデータをクエリするためのSQL上の型付きレイヤーです。優れた開発者体験とパフォーマンスを提供するように設計されています。

## 主要な機能

### 1. クエリモード
- 異なるデータベースドライバーをサポート
- PlanetScaleなどのデータベース用の特定のモード設定

### 2. クエリメソッド
- `findMany()`: 複数のレコードを取得
- `findFirst()`: 最初のマッチングレコードを取得
- `with`パラメータでネストされたリレーションクエリをサポート

### 3. クエリ機能
- 部分フィールド選択
- ネストされたリレーションフィルタリング
- リミットとオフセットのサポート
- カスタムフィールドの含有
- プリペアドステートメント

## スキーマとクエリの例

### スキーマ定義

```typescript
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}));
```

### リレーショナルクエリ

```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  }
});
```

## ユニークな側面

- 単一のSQL文生成
- 型安全なネストされたクエリ
- 柔軟なフィルタリングと順序付け
- パフォーマンス最適化されたプリペアドステートメント

Drizzle ORMは、TypeScriptとSQLデータベース用の開発者フレンドリーでパフォーマンスの高いORMを提供することを目指しています。
