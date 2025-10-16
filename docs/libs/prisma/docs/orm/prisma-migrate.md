# Prisma Migrate

Prisma Migrateは、データベーススキーマの変更を管理するための宣言的なデータモデリングとマイグレーションシステムです。

## 主要な機能

- **宣言的データモデリング**: Prismaスキーマでデータモデルを定義
- **自動マイグレーション生成**: スキーマ変更からSQLマイグレーションを自動生成
- **マイグレーション履歴**: すべてのスキーマ変更の履歴を保持
- **チーム開発**: 複数の開発者間でマイグレーションを共有

## 基本的な使用方法

### 1. マイグレーションの作成

```bash
npx prisma migrate dev --name add_user_table
```

### 2. マイグレーションの適用

```bash
npx prisma migrate deploy
```

### 3. マイグレーションの状態確認

```bash
npx prisma migrate status
```

## ドキュメント

- [はじめに](/docs/orm/prisma-migrate/getting-started)
- [Prisma Migrateの理解](/docs/orm/prisma-migrate/understanding-prisma-migrate)
- [ワークフロー](/docs/orm/prisma-migrate/workflows)

## ベストプラクティス

- 本番環境では`migrate deploy`を使用
- マイグレーションをバージョン管理に含める
- チーム開発では適切なマイグレーションワークフローを確立
