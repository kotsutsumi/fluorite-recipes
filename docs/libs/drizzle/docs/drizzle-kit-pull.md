# drizzle-kit pull

`drizzle-kit pull`コマンドは、既存のデータベーススキーマをイントロスペクトし、Drizzle ORM `schema.ts`ファイルを自動生成します。

## 目的

既存のデータベースから自動的にTypeScriptスキーマファイルを生成します。

## 動作の仕組み

1. データベーススキーマ（DDL）をプル
2. `out`フォルダにTypeScriptスキーマファイルを生成

## 設定ファイル経由

```typescript
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  }
});
```

## CLIオプション経由

```bash
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```

## スキーマフィルタリングオプション

- `tablesFilter`: 特定のテーブルをフィルター
- `schemaFilter`: 特定のデータベーススキーマを選択
- `extensionsFilters`: データベース拡張機能を管理

## サポートされているデータベース

- PostgreSQL
- MySQL
- SQLite
- Turso
- SingleStore

## イントロスペクション戦略

- 元のケーシングを保持
- キャメルケース変換

## ベストプラクティス

- データベースファーストアプローチに推奨
- TypeScriptプロジェクト外でスキーマを管理する場合に有用
- 既存のデータベースをイントロスペクトするのに最適
