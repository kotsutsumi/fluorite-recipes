# drizzle-kit migrate

`drizzle-kit migrate`コマンドは、生成されたSQLマイグレーションをデータベースに適用します。

## 動作の仕組み

1. マイグレーションフォルダからマイグレーションファイルを読み取り
2. データベースに接続
3. 既存のマイグレーションエントリーを取得
4. 実行する新しいマイグレーションを決定
5. SQLマイグレーションを適用
6. 適用されたマイグレーションをデータベースにログ

## データベース設定

```typescript
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

## マイグレーションログテーブル

マイグレーションは`__drizzle_migrations`テーブルにログされます：

```typescript
migrations: {
  table: 'my-migrations-table', // デフォルト: __drizzle_migrations
  schema: 'public', // PostgreSQLのみ、デフォルト: drizzle
}
```

## 複数設定のサポート

```bash
npx drizzle-kit migrate --config=drizzle-dev.config.ts
npx drizzle-kit migrate --config=drizzle-prod.config.ts
```

## ワークフロー例

1. スキーマを定義
2. マイグレーションを生成: `npx drizzle-kit generate --name=init`
3. マイグレーションを適用: `npx drizzle-kit migrate`
