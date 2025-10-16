# マイグレーションのスカッシュ

## マイグレーションのスカッシュについて

マイグレーションのスカッシュは、複数のマイグレーションファイルを1つのマイグレーションに統合することです。主に2つのシナリオがあります：

1. **開発環境からのクリーンなマイグレーション**
   - ブランチベースのワークフローで有用
   - 不必要な中間マイグレーションステップを削減
   - 本番環境での破壊的なマイグレーションステップを防止

2. **本番環境でのクリーンな履歴作成**
   - マイグレーション履歴を簡素化
   - 新しい環境でマイグレーションを再生するのに必要な時間を短縮

## マイグレーションをスカッシュする際の考慮事項

> **警告**: マイグレーションファイルで手動で変更または追加された SQL は保持されません。

スカッシュする前に：

- カスタム SQL がある場合は、別途バックアップを取る
- 本番環境で既に適用されたマイグレーションは慎重に扱う
- チームメンバーと調整する

## マイグレーションをスカッシュする方法

### 開発環境からのクリーンなマイグレーション

**前提条件：**
- マイグレーションがまだ本番データベースに適用されていない
- 本番マイグレーションがローカルマイグレーション履歴の一部である
- 新しいマイグレーションファイルにカスタム SQL がない

**手順：**

1. **`./prisma/migrations` を `main` ブランチに合わせてリセット**

```bash
# main ブランチに切り替え
git checkout main

# 最新の状態にプル
git pull

# 機能ブランチに戻る
git checkout feature-branch

# migrations フォルダを main ブランチの状態にリセット
git checkout main -- prisma/migrations
```

2. **新しいマイグレーションを作成**

```bash
npx prisma migrate dev --name squashed_migrations
```

このコマンドは、feature ブランチでのすべての変更を含む単一のマイグレーションを生成します。

#### 例

**シナリオ：** feature ブランチで以下の3つのマイグレーションを作成した場合：

- `20230101000000_add_user_table`
- `20230102000000_add_profile_table`
- `20230103000000_add_posts_table`

これらを1つのマイグレーションにスカッシュ：

```bash
# main ブランチの migrations をチェックアウト
git checkout main -- prisma/migrations

# スカッシュされたマイグレーションを作成
npx prisma migrate dev --name add_user_system
```

結果：単一のマイグレーションファイル `[timestamp]_add_user_system/migration.sql` が作成され、すべての変更が含まれます。

### 本番環境でのクリーンな履歴作成

**前提条件：**
- すべてのマイグレーションが本番環境に適用されている
- データモデルがマイグレーション履歴と一致している
- データモデルとマイグレーション履歴が同期している

**手順：**

1. **`./prisma/migrations` の内容を削除**

```bash
# Linux/macOS
rm -rf prisma/migrations/*

# Windows (PowerShell)
Remove-Item -Path prisma/migrations/* -Recurse -Force
```

または、バックアップとして別の場所に移動：

```bash
mv prisma/migrations prisma/migrations_backup
mkdir prisma/migrations
```

2. **新しい空のマイグレーションディレクトリを作成**

```bash
mkdir -p prisma/migrations/0_init
```

3. **マイグレーションスクリプトを生成**

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script > ./prisma/migrations/0_init/migration.sql
```

このコマンドは、現在のスキーマを完全に再現する単一の SQL スクリプトを生成します。

4. **マイグレーションを適用済みとしてマーク**

```bash
npx prisma migrate resolve --applied 0_init
```

これにより、Prisma は `0_init` マイグレーションが既に適用されていると認識します。

#### 完全な例

```bash
# 1. 古いマイグレーションをバックアップ
mv prisma/migrations prisma/migrations_backup

# 2. 新しいマイグレーションディレクトリを作成
mkdir -p prisma/migrations/0_init

# 3. スカッシュされたマイグレーションを生成
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script > ./prisma/migrations/0_init/migration.sql

# 4. マイグレーションを適用済みとしてマーク
npx prisma migrate resolve --applied 0_init

# 5. バージョン管理にコミット
git add prisma/migrations
git commit -m "Squash all migrations into init"
```

## 新しい環境への展開

スカッシュされたマイグレーション履歴を使用して新しい環境を設定する場合：

```bash
# マイグレーションを適用
npx prisma migrate deploy
```

`prisma migrate deploy` は：
- `_prisma_migrations` テーブルを確認
- 未適用のマイグレーションのみを適用

## バージョン管理

スカッシュ後：

1. **変更をコミット**

```bash
git add prisma/migrations
git commit -m "Squash migrations"
```

2. **チームに通知**

チームメンバーに以下を通知：
- マイグレーション履歴がスカッシュされた
- ローカルデータベースのリセットが必要な場合がある

```bash
# チームメンバーが実行するコマンド
git pull
npx prisma migrate reset
```

## トラブルシューティング

### マイグレーションが適用されない

`prisma migrate deploy` でエラーが発生する場合：

1. `_prisma_migrations` テーブルを確認
2. データベーススキーマとスキーマファイルが一致することを確認
3. 必要に応じて `prisma migrate resolve` を使用

### データが失われた

誤ってデータを失った場合：

1. バックアップから復元
2. マイグレーションを再適用

## ベストプラクティス

1. **定期的にスカッシュ**: 長期プロジェクトでは定期的にマイグレーションをスカッシュ
2. **本番前にスカッシュ**: 機能完了後、本番環境へのマージ前にスカッシュ
3. **バックアップを取る**: スカッシュ前に必ずバックアップ
4. **チームと調整**: スカッシュはチーム全体に影響するため、事前に調整
5. **カスタム SQL を文書化**: スカッシュ前にカスタム SQL を別途保存

## まとめ

マイグレーションのスカッシュは、以下の場合に有用です：

- マイグレーション履歴を整理
- 新しい環境のセットアップを高速化
- 不要な中間ステップを削減

ただし、本番環境で既に適用されたマイグレーションをスカッシュする場合は、慎重に計画し、実行してください。
