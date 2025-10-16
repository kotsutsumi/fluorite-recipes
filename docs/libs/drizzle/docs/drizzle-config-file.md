# Drizzle 設定ファイル

Drizzle Kit設定ファイル（`drizzle.config.ts`）の包括的なガイドです。

## 概要

Drizzle Kit設定ファイルにより、データベースマイグレーションとスキーマ管理の設定オプションをTypeScriptまたはJavaScriptで宣言できます。

## 基本設定構造

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

## 主要な設定オプション

### 1. Dialect

データベースタイプを指定します。

```typescript
dialect: "postgresql" // または "mysql", "sqlite", "turso", "singlestore"
```

### 2. Schema

スキーマファイルへのパスを定義します。

```typescript
schema: "./src/schema.ts"
// または
schema: "./src/schema/*"
// または
schema: ["./src/user/schema.ts", "./src/posts/schema.ts"]
```

### 3. 出力ディレクトリ

SQLマイグレーションファイルのフォルダを指定します。

```typescript
out: "./drizzle" // デフォルト
```

### 4. データベース認証情報

異なるデータベースタイプの接続詳細です。

```typescript
dbCredentials: {
  url: "postgres://user:password@host:port/db"
}
```

### 5. マイグレーション設定

マイグレーション追跡テーブルとスキーマをカスタマイズします。

```typescript
migrations: {
  table: 'my-migrations-table',
  schema: 'public'
}
```

### 6. 高度なオプション

- `tablesFilter`: 特定のテーブルをフィルター
- `schemaFilter`: 管理するスキーマを指定
- `extensionsFilters`: 特定のデータベース拡張機能を無視
- `strict`: SQL文の確認プロンプト
- `verbose`: 操作中にSQL文を出力
- `breakpoints`: マイグレーションファイルの文ブレークポイントを制御

## 複数の設定ファイル

環境ごとに異なる設定ファイルをサポートします：

```bash
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```

## イントロスペクション

カラムキーのケーシングを設定します。

```typescript
introspect: {
  casing: 'preserve' // または 'camel' (デフォルト)
}
```

## エンティティ管理

テーブル、ビュー、スキーマなどの管理を設定します。

この柔軟な設定システムにより、さまざまな開発環境とデータベースセットアップに適応できます。
