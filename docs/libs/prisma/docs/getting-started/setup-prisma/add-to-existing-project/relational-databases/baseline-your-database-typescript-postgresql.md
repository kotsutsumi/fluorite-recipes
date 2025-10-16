# Prisma ORM、TypeScript、PostgreSQLを使用したデータベースのベースライン化

## データベースをベースライン化するための主要なステップ

### 1. マイグレーションディレクトリの作成
```bash
mkdir -p prisma/migrations/0_init
```

### 2. マイグレーションファイルの生成
```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
```

### 3. 生成されたマイグレーションSQLのレビュー
- マイグレーションスクリプトには以下のSQLコマンドが含まれます:
  - テーブルの作成（Post、Profile、User）
  - インデックスの作成
  - 外部キー制約の追加

### 4. マイグレーションを適用済みとしてマークする
```bash
npx prisma migrate resolve --applied 0_init
```

## ベースライン化の目的
- 既存のデータを持つデータベースのマイグレーション履歴を初期化します
- マイグレーションが既に適用されていることをPrisma Migrateに通知します
- `prisma migrate dev`を使用した将来のスキーマ変更に備えます

## 主要な概念
- ベースライン化は「リセットできない」データベースに使用されます
- 既存のデータベースのスキーママイグレーションの管理を支援します
- Prismaがデータベーススキーマの進化を追跡および管理できるようにします

## 関連する技術
- TypeScript
- PostgreSQL
- Prisma ORM
- Prisma Migrate

このドキュメントは、開発者が既存のデータベーススキーマをPrismaでベースライン化し、スムーズなスキーマ管理とマイグレーションを可能にするためのステップバイステップのガイドを提供します。
