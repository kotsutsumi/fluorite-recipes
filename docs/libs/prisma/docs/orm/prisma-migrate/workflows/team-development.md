# チーム開発

> このガイドは[ガイドセクション](/docs/guides/implementing-schema-changes)に移動されました。ガイドはそこで見つけることができます。

## 概要

チーム開発でのスキーマ変更の実装に関する詳細なガイドは、新しい場所に移動されました。以下のトピックがカバーされています：

- チーム環境でのスキーマ変更の実装方法
- マイグレーション履歴の管理
- ブランチ戦略とマイグレーション
- 競合の解決
- ベストプラクティス

## アクセス方法

完全なガイドにアクセスするには、以下のリンクを参照してください：

[スキーマ変更の実装ガイド](/docs/guides/implementing-schema-changes)

## 関連トピック

チーム開発に関連する他のトピック：

- [Prisma Migrate の概要](/docs/orm/prisma-migrate/understanding-prisma-migrate/overview)
- [開発環境と本番環境](/docs/orm/prisma-migrate/workflows/development-and-production)
- [マイグレーション履歴について](/docs/orm/prisma-migrate/understanding-prisma-migrate/migration-histories)
- [トラブルシューティング](/docs/orm/prisma-migrate/workflows/troubleshooting)

## クイックリファレンス

チーム開発での一般的なシナリオ：

### 他のチームメンバーのマイグレーションを適用する

```bash
# 最新のコードをプル
git pull

# 新しいマイグレーションを適用
npx prisma migrate dev
```

### 新しいマイグレーションを作成してプッシュする

```bash
# スキーマを変更

# マイグレーションを作成
npx prisma migrate dev --name your_migration_name

# マイグレーションファイルをコミット
git add prisma/migrations
git commit -m "Add migration: your_migration_name"

# プッシュ
git push
```

### マイグレーション競合の解決

競合が発生した場合：

1. マイグレーション履歴を確認する
2. データベースをリセットする（開発環境のみ）
3. すべてのマイグレーションを再適用する

```bash
# 開発データベースをリセット
npx prisma migrate reset

# すべてのマイグレーションを適用
npx prisma migrate dev
```

詳細については、新しいガイドセクションを参照してください。
