# トラブルシューティング

## マイグレーション履歴の競合の処理

### マイグレーション履歴競合の原因

- 既に適用されたマイグレーションが後で修正された
- 既に適用されたマイグレーションがファイルシステムから欠落している
- フィーチャーブランチ間の切り替えが競合を引き起こす可能性がある

> **注意**: 既に適用されたマイグレーションを意図的に削除または編集しないでください。

### マイグレーション履歴競合の修正

`prisma migrate dev` の実行時に Prisma Migrate が競合を検出した場合、CLI はデータベースをリセットしてマイグレーション履歴を再適用するよう求めます。

#### 例

```bash
npx prisma migrate dev
```

競合が検出された場合、以下のようなプロンプトが表示されます：

```
? We need to reset the database to apply this migration. All data will be lost. Do you want to continue? (Y/n)
```

データベースをリセットして続行するか、キャンセルして手動で問題を解決できます。

## スキーマドリフト

### スキーマドリフトの原因

スキーマドリフトは、データベーススキーマがマイグレーション履歴と同期していない場合に発生します。通常、以下が原因です：

- マイグレーションを使用せずにデータベーススキーマを変更
- `prisma db push` を使用
- データベーススキーマを手動で変更

### スキーマドリフトの修正

#### オプション1: 手動の変更を保持しない場合

1. **データベースをリセット：**

```bash
npx prisma migrate reset
```

これにより、データベースが削除され、すべてのマイグレーションが再適用されます。

2. **Prisma スキーマで変更を複製し、新しいマイグレーションを生成：**

```bash
npx prisma migrate dev
```

#### オプション2: 手動の変更を保持する場合

1. **データベースをイントロスペクト：**

```bash
npx prisma db pull
```

これにより、Prisma スキーマがデータベースの現在の状態に更新されます。

2. **新しいマイグレーションを生成：**

```bash
npx prisma migrate dev --name introspected_change
```

これにより、手動の変更を含む新しいマイグレーションが作成されます。

#### 詳細な例

**シナリオ：** 手動で `email` カラムを `User` テーブルに追加した場合

```sql
-- 手動で実行した SQL
ALTER TABLE "User" ADD COLUMN "email" TEXT;
```

**ステップ1: イントロスペクト**

```bash
npx prisma db pull
```

Prisma スキーマが自動的に更新されます：

```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String? // 自動的に追加される
}
```

**ステップ2: マイグレーションを作成**

```bash
npx prisma migrate dev --name add_email_column
```

## 失敗したマイグレーション

### 失敗したマイグレーションの原因

- 修正されたマイグレーションの構文エラー
- 既存のデータを持つテーブルに必須カラムを追加
- マイグレーションプロセスの中断
- マイグレーション中のデータベースシャットダウン

### 失敗したマイグレーションの修正

推奨されるアプローチは、根本原因に対処してデータベースをリセットすることです：

#### ケース1: SQL 構文エラーの場合

1. **`migration.sql` ファイルを更新：**

エラーのある SQL を修正します。

2. **データベースをリセット：**

```bash
npx prisma migrate reset
```

3. **マイグレーションを再適用：**

```bash
npx prisma migrate dev
```

#### ケース2: スキーマ変更が既存データと互換性がない場合

1. **スキーマを修正：**

既存データと互換性のある形に変更します（例：必須フィールドをオプショナルにする）。

2. **マイグレーションを作成：**

```bash
npx prisma migrate dev
```

#### ケース3: 本番環境で失敗したマイグレーション

本番環境では、`prisma migrate resolve` を使用して失敗したマイグレーションを処理します。

**オプション1: マイグレーションをロールバック済みとしてマーク**

```bash
npx prisma migrate resolve --rolled-back "20230101000000_failed_migration"
```

その後、問題を修正して再デプロイします。

**オプション2: マイグレーションを適用済みとしてマーク**

手動で修正した場合：

```bash
# 手動で SQL を実行して問題を修正

# マイグレーションを適用済みとしてマーク
npx prisma migrate resolve --applied "20230101000000_failed_migration"
```

### 例

**失敗したマイグレーション：**

```
Error: Migration failed to apply
Details: column "email" of relation "User" already exists
```

**解決方法：**

```bash
# 開発環境
npx prisma migrate reset

# 本番環境（手動で修正済み）
npx prisma migrate resolve --applied "20230101000000_add_email"
```

## Prisma Migrate と PgBouncer

PgBouncer を使用している場合、以下のエラーが発生する可能性があります：

```
Error: Database error: ERROR: prepared statement "s0" already exists
```

### 回避策

1. **PgBouncer をトランザクションモードからセッションモードに変更**

PgBouncer の設定を変更：

```ini
pool_mode = session
```

2. **マイグレーション用に直接データベース接続を使用**

PgBouncer をバイパスして、直接データベースに接続します：

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
DIRECT_DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

Prisma スキーマで設定：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

## 非対話的環境での Prisma Migrate

Prisma ORM は非対話的環境（Docker、スクリプト、bash シェル）を検出し、`migrate dev` がサポートされていないと警告します。

### 解決方法

Docker イメージをインタラクティブモードで実行：

```bash
docker run --interactive --tty <image name>
# または
docker run -it <image name>
```

Dockerfile での例：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 開発環境ではインタラクティブモードが必要
# 本番環境では migrate deploy を使用
CMD ["npm", "run", "dev"]
```

本番環境では `migrate deploy` を使用：

```dockerfile
CMD npx prisma migrate deploy && npm start
```

## 一般的なエラーと解決策

### エラー: "Migration ... cannot be rolled back"

**原因**: マイグレーションが適用されていないか、既に成功している

**解決策**:

```bash
# マイグレーションの状態を確認
npx prisma migrate status

# 必要に応じて適用済みとしてマーク
npx prisma migrate resolve --applied "migration_name"
```

### エラー: "The database is not empty"

**原因**: 既存のデータベースに初回マイグレーションを適用しようとしている

**解決策**: ベースライン化を使用

```bash
# 既存のデータベースをベースライン化
npx prisma migrate resolve --applied "0_init"
```

### エラー: "Schema drift detected"

**原因**: データベーススキーマとマイグレーション履歴が一致しない

**解決策**:

```bash
# オプション1: リセット（開発環境のみ）
npx prisma migrate reset

# オプション2: ドリフトを含むマイグレーションを作成
npx prisma db pull
npx prisma migrate dev --name fix_drift
```

## ベストプラクティス

1. **バックアップ**: 本番環境で問題を修正する前に必ずバックアップ
2. **ステージングでテスト**: 本番前にステージング環境でテスト
3. **バージョン管理**: すべてのマイグレーションをバージョン管理にコミット
4. **ドキュメント**: 問題と解決策を文書化
5. **モニタリング**: 本番マイグレーションを監視

## トラブルシューティングフローチャート

```
マイグレーションが失敗した
    ↓
開発環境？
    ├─ Yes → migrate reset → 問題を修正 → migrate dev
    └─ No → 本番環境
            ↓
    手動で修正可能？
        ├─ Yes → SQL を実行 → migrate resolve --applied
        └─ No → migrate resolve --rolled-back → 修正して再デプロイ
```

## まとめ

Prisma Migrate のトラブルシューティングは、環境に応じた適切なアプローチが重要です：

- **開発環境**: `migrate reset` で簡単にリセット
- **本番環境**: `migrate resolve` で慎重に処理
- **チーム開発**: コミュニケーションとバージョン管理が鍵

問題が発生した場合は、まず状態を確認し、適切な解決策を選択してください。
