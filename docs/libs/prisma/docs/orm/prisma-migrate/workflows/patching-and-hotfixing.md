# パッチングとホットフィックス

## 概要

データベースのパッチングまたはホットフィックスは、遅いクエリを解決するためにインデックスを追加するなど、本番環境で時間的に重要な変更を直接行うことを含みます。これにより「スキーマドリフト」が発生し、データベーススキーマがマイグレーション履歴と同期しなくなる可能性があります。

## マイグレーション履歴の調整

パッチまたはホットフィックスを調整するには：

### ステップ1: スキーマで変更を複製する

Prisma スキーマでホットフィックスと同じ変更を行います。

### ステップ2: 新しいマイグレーションを生成する

```bash
npx prisma migrate dev --name retroactively-add-index
```

### ステップ3: 本番環境でマイグレーションを適用済みとしてマークする

```bash
npx prisma migrate resolve --applied "20201127134938-retroactively-add-index"
```

### ステップ4: 他のデータベースにマイグレーションを伝播する

開発環境やステージング環境では、通常通りマイグレーションを適用します：

```bash
npx prisma migrate dev
# または
npx prisma migrate deploy
```

## 詳細な例

### シナリオ: 本番環境でインデックスを追加

**問題**: `User` テーブルの `email` カラムに対するクエリが遅い

**ステップ1: 本番環境で直接インデックスを追加**

```sql
-- 本番データベースで直接実行
CREATE INDEX idx_user_email ON "User"(email);
```

**ステップ2: Prisma スキーマを更新**

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String

  @@index([email]) // インデックスを追加
}
```

**ステップ3: マイグレーションを作成**

```bash
npx prisma migrate dev --name retroactively-add-email-index
```

**ステップ4: 本番環境でマイグレーションを適用済みとしてマーク**

```bash
npx prisma migrate resolve --applied "20230101120000_retroactively_add_email_index"
```

これにより、本番環境の `_prisma_migrations` テーブルにマイグレーションが記録されますが、SQL は実行されません（既に適用済みのため）。

**ステップ5: 他の環境にマイグレーションを展開**

開発環境とステージング環境では、通常通りマイグレーションを適用：

```bash
# 開発環境
npx prisma migrate dev

# ステージング環境（CI/CD経由）
npx prisma migrate deploy
```

## 失敗したマイグレーションの処理

失敗したマイグレーションを処理するには、主に2つのアプローチがあります：

### オプション1: ロールバックして再デプロイ

**ステップ1: マイグレーションをロールバック済みとしてマーク**

```bash
npx prisma migrate resolve --rolled-back "20230101000000_failed_migration"
```

**ステップ2: 根本原因を修正**

マイグレーションファイルまたはスキーマを修正します。

**ステップ3: マイグレーションを再デプロイ**

```bash
npx prisma migrate deploy
```

#### 例

```bash
# 失敗したマイグレーションをロールバック
npx prisma migrate resolve --rolled-back "20230115103000_add_user_profile"

# migration.sql を修正して構文エラーを修正

# 再デプロイ
npx prisma migrate deploy
```

### オプション2: マイグレーションを手動で完了

**ステップ1: マイグレーションステップを手動で完了**

データベースで直接 SQL を実行して問題を修正します。

**ステップ2: マイグレーションを適用済みとして解決**

```bash
npx prisma migrate resolve --applied "20230101000000_fixed_migration"
```

#### 例

```bash
# 手動で SQL を実行して問題を修正
psql -U user -d mydb -c "ALTER TABLE User ADD COLUMN email TEXT;"

# マイグレーションを適用済みとしてマーク
npx prisma migrate resolve --applied "20230115103000_add_user_email"
```

## `migrate diff` と `db execute` を使用した高度な修正

これらのコマンドは、失敗したマイグレーションを修正するのに役立ちます：

### `migrate diff`

スキーマを比較してマイグレーションスクリプトを作成します：

```bash
# 現在のデータベースとスキーマの差分を生成
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > fix.sql
```

### `db execute`

マイグレーションテーブルに触れずに SQL スクリプトを適用します：

```bash
# SQL スクリプトを実行
npx prisma db execute --file fix.sql --schema prisma/schema.prisma
```

### 完全な例

**シナリオ**: マイグレーションが途中で失敗し、部分的に適用されている

**ステップ1: 現在の状態を確認**

```bash
npx prisma migrate status
```

**ステップ2: 必要な修正を含む差分を生成**

```bash
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > fix.sql
```

**ステップ3: 修正スクリプトを適用**

```bash
npx prisma db execute --file fix.sql --schema prisma/schema.prisma
```

**ステップ4: マイグレーションを適用済みとしてマーク**

```bash
npx prisma migrate resolve --applied "20230101000000_partially_failed"
```

## 互換性に関する注意事項

- **MongoDB には適用されません**: これらのワークフローは MongoDB では使用できません
- **バージョン要件**:
  - バージョン 3.9.0+ ではプレビュー機能として利用可能
  - バージョン 3.13.0+ で完全に利用可能

### プレビュー機能の有効化（3.9.0 - 3.12.x）

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["migrateResolve", "migrateDiff"]
}
```

## PgBouncer 互換性の警告

PgBouncer を使用しているユーザーは、接続プーリングエラーに遭遇する可能性があります：

```
Error: prepared statement "s0" already exists
```

### 回避策

`directUrl` を使用して PgBouncer をバイパス：

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

```env
DATABASE_URL="postgresql://user:pass@pgbouncer:6432/mydb"
DIRECT_DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
```

## ベストプラクティス

1. **ドキュメント化**: すべてのホットフィックスを文書化
2. **速やかに調整**: ホットフィックス後、できるだけ早くマイグレーション履歴を調整
3. **チームへの通知**: ホットフィックスを適用したことをチームに通知
4. **ステージングでテスト**: 可能であれば、まずステージング環境でテスト
5. **バックアップ**: 変更前に必ずバックアップ

## ワークフロー図

```
本番環境でホットフィックスを適用
    ↓
スキーマで変更を複製
    ↓
ローカルでマイグレーションを生成
    ↓
本番環境でマイグレーションを適用済みとしてマーク
    ↓
他の環境に通常のマイグレーションとして展開
```

## トラブルシューティング

### エラー: "Migration not found"

マイグレーション名が正しいことを確認：

```bash
# マイグレーション履歴を確認
ls prisma/migrations

# 正しい名前でマイグレーションを解決
npx prisma migrate resolve --applied "correct_migration_name"
```

### エラー: "Database is ahead of migrations"

スキーマドリフトが検出されました。`db pull` を使用して現在の状態を取得：

```bash
npx prisma db pull
npx prisma migrate dev --name sync_with_database
```

## まとめ

パッチングとホットフィックスは、本番環境で時間的に重要な変更を行う強力な方法ですが：

- 慎重に使用する
- 常にマイグレーション履歴を調整する
- チームとコミュニケーションを取る
- すべての変更を文書化する

適切に管理すれば、本番環境の問題を迅速に解決しながら、マイグレーション履歴の整合性を維持できます。
