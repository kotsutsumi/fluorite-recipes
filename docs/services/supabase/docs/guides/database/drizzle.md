# Drizzle

## Drizzleとの接続

Drizzle ORMは、最大限の型安全性を備えて設計されたSQLデータベース用のTypeScript ORMです。

### 重要な注意事項

Supabase Data API（PostgREST）の代わりにDrizzleのみを使用する予定の場合は、API設定でPostgRESTを無効にできます。

### インストール手順

#### 1. 依存関係のインストール

```bash
npm i drizzle-orm postgres
npm i -D drizzle-kit
```

#### 2. モデルの作成

`schema.ts`ファイルを作成し、データベースモデルを定義:

```typescript
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});
```

#### 3. データベースへの接続

プロジェクトの「接続」パネルから接続プーラーを使用:

```typescript
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL

// "Transaction"プールモード用のプリフェッチを無効化
export const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client);
```

このドキュメントは、TypeScriptとPostgreSQLデータベースのインタラクションに焦点を当て、SupabaseとDrizzle ORMを統合するための包括的なガイドを提供します。
