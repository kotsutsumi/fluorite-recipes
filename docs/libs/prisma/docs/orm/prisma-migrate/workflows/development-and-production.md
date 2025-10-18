# 開発環境と本番環境

## 開発環境

開発環境では、`migrate dev` コマンドを使用してマイグレーションを生成し、適用します：

```bash
npx prisma migrate dev
```

### マイグレーションの作成と適用

⚠️ **警告**: `migrate dev` は開発環境専用であり、本番環境では絶対に使用しないでください。

このコマンドは以下を実行します：

1. シャドウデータベースでスキーマドリフトをチェック
2. 保留中のマイグレーションを適用
3. Prisma スキーマに変更がある場合、新しいマイグレーションを生成
4. `_prisma_migrations` テーブルを更新
5. Prisma Client の生成をトリガー

#### 例

スキーマに新しいモデルを追加した場合：

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

マイグレーションを作成して適用：

```bash
npx prisma migrate dev --name add_post_model
```

このコマンドは：
- `prisma/migrations/[timestamp]_add_post_model/` ディレクトリを作成
- `migration.sql` ファイルを生成
- データベースに変更を適用
- Prisma Client を再生成

### 開発データベースのリセット

開発中にデータベースをリセット：

```bash
npx prisma migrate reset
```

⚠️ **警告**: これは開発環境専用のコマンドです。

このコマンドは以下を実行します：

- データベース/スキーマを削除して再作成
- すべてのマイグレーションを適用
- シードスクリプトを実行

#### 使用例

```bash
# データベースをリセットしてクリーンな状態に
npx prisma migrate reset

# シードをスキップしてリセット
npx prisma migrate reset --skip-seed
```

### マイグレーションのカスタマイズ

適用せずにマイグレーションを作成するには：

```bash
npx prisma migrate dev --create-only
```

これにより、マイグレーションファイルが生成されますが、データベースには適用されません。生成されたファイルを編集してから、通常の `migrate dev` で適用できます。

#### ワークフロー例

```bash
# 1. ドラフトマイグレーションを作成
npx prisma migrate dev --create-only --name add_custom_index

# 2. migration.sql を編集してカスタム SQL を追加
# prisma/migrations/[timestamp]_add_custom_index/migration.sql

# 3. 編集したマイグレーションを適用
npx prisma migrate dev
```

## 本番環境とテスト環境

本番環境では、`migrate deploy` コマンドを使用します：

```bash
npx prisma migrate deploy
```

このコマンドは以下を実行します：

- 適用されたマイグレーションとマイグレーション履歴を比較
- 変更されたマイグレーションについて警告
- 保留中のマイグレーションを適用

### 特徴

- **非対話的**: ユーザー入力を必要としません
- **安全**: スキーマドリフトを検出しません（意図的な設計）
- **冪等性**: 同じコマンドを複数回実行しても安全
- **ロールバックなし**: マイグレーションは前進のみ

### CI/CD での使用例

#### GitHub Actions

```yaml
name: Deploy Database Migrations

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npx prisma migrate deploy
```

#### Docker での使用

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

# マイグレーションを実行してからアプリを起動
CMD npx prisma migrate deploy && npm start
```

### アドバイザリロッキング

Prisma Migrate は、同時マイグレーションコマンドを防ぐためにアドバイザリロッキングを使用します：

- **タイムアウト**: 10秒
- **サポート**: PostgreSQL、MySQL、Microsoft SQL Server
- **無効化**: `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK` 環境変数で無効化可能

#### ロックの仕組み

1. `migrate deploy` がロックを取得しようとする
2. 別のプロセスが既にロックを保持している場合、10秒待機
3. タイムアウト後もロックが取得できない場合はエラー

#### ロックの無効化

```bash
# アドバイザリロックを無効化（非推奨）
PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1 npx prisma migrate deploy
```

> **注意**: ロックを無効化すると、同時マイグレーション実行のリスクがあります。

### ステージング環境

ステージング環境でも `migrate deploy` を使用します：

```bash
# ステージング環境にマイグレーションを適用
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

ステージング環境は本番環境の前段階として、マイグレーションをテストするのに適しています。

## ベストプラクティス

### 開発環境

1. **`migrate dev` を使用**: スキーマの変更とマイグレーション生成を自動化
2. **意味のある名前**: マイグレーションには説明的な名前を付ける
3. **小さな変更**: 大きな変更は複数の小さなマイグレーションに分割
4. **ドラフトで確認**: `--create-only` で SQL を確認してから適用
5. **定期的にリセット**: 開発データベースを定期的にリセットして整合性を保つ

### 本番環境

1. **CI/CD に統合**: `migrate deploy` を CI/CD パイプラインに組み込む
2. **ステージングでテスト**: 本番前にステージング環境でテスト
3. **バックアップ**: マイグレーション前に必ずバックアップ
4. **モニタリング**: マイグレーションの実行を監視
5. **ロールバック計画**: 問題が発生した場合のロールバック戦略を用意

## ワークフロー例

### 開発からデプロイまでの完全なフロー

**ステップ1: ローカル開発**

```bash
# スキーマを変更
# model User { ... }

# マイグレーションを作成して適用
npx prisma migrate dev --name add_user_model
```

**ステップ2: バージョン管理**

```bash
# 変更をコミット
git add prisma/
git commit -m "Add User model migration"
git push
```

**ステップ3: CI/CD (自動)**

```yaml
# .github/workflows/deploy.yml
- name: Deploy migrations
  run: npx prisma migrate deploy
```

**ステップ4: 本番環境（CI/CD経由）**

CI/CD パイプラインが自動的に：
- リポジトリをクローン
- 依存関係をインストール
- マイグレーションを適用
- アプリケーションをデプロイ

## トラブルシューティング

### マイグレーションが失敗する

開発環境：

```bash
# データベースをリセット
npx prisma migrate reset

# 問題を修正してから再試行
npx prisma migrate dev
```

本番環境：

```bash
# 失敗したマイグレーションを確認
# _prisma_migrations テーブルをチェック

# 手動で修正が必要な場合
npx prisma migrate resolve --rolled-back [migration_name]

# または適用済みとしてマーク
npx prisma migrate resolve --applied [migration_name]
```

### スキーマドリフト

開発環境でのみ検出されます：

```bash
# オプション1: リセットして再適用
npx prisma migrate reset

# オプション2: 手動の変更を保持
npx prisma db pull
npx prisma migrate dev --name capture_manual_changes
```

### 同時マイグレーション実行

アドバイザリロックがタイムアウトする場合：

1. 他のマイグレーションプロセスが実行中か確認
2. 必要に応じてプロセスを終了
3. マイグレーションを再試行

## まとめ

### 開発環境では

- `migrate dev` を使用
- スキーマを自由に実験
- 必要に応じてリセット

### 本番環境では

- `migrate deploy` を使用
- CI/CD パイプラインに統合
- 事前にステージングでテスト
- バックアップとロールバック計画を用意

適切なコマンドを適切な環境で使用することで、安全で効率的なデータベース管理が可能になります。
