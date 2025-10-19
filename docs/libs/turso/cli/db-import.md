# turso db import - SQLiteデータベースのインポート

Turso CLIの`turso db import`コマンドは、ローカルのSQLiteデータベースファイルをTursoにインポートします。既存のSQLiteアプリケーションをTursoに移行する際に使用します。

## 📚 目次

- [基本構文](#基本構文)
- [前提条件](#前提条件)
- [オプション](#オプション)
- [使用例](#使用例)
- [ベストプラクティス](#ベストプラクティス)
- [トラブルシューティング](#トラブルシューティング)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db import <SQLiteファイルパス> [オプション]
```

### パラメータ

- `SQLiteファイルパス` (必須): インポートするSQLiteデータベースファイルのパス
  - 絶対パスまたは相対パスを指定可能
  - ファイルは有効なSQLite3形式である必要があります

## 前提条件

### WALジャーナルモードの有効化

インポートするSQLiteデータベースは、**WAL（Write-Ahead Logging）ジャーナルモード**が有効化されている必要があります。

#### WALモードの確認

```bash
sqlite3 your-database.db "PRAGMA journal_mode;"
```

**期待される出力**:
```
wal
```

#### WALモードの有効化

WALモードが有効でない場合、以下のコマンドで有効化できます:

```bash
sqlite3 your-database.db "PRAGMA journal_mode=WAL;"
```

### ファイル要件

```typescript
interface ImportRequirements {
  fileFormat: {
    type: "SQLite3";
    journalMode: "WAL";        // 必須
    version: "3.x";
  };
  fileConstraints: {
    maxSize?: string;          // プランによる
    encoding: "UTF-8";
    compatibility: "SQLite 3.x+";
  };
}
```

## オプション

### `--group <グループ名>`

データベースをインポートする先のグループを指定します。

```bash
turso db import ~/path/to/database.db --group production
```

**注意**: 複数のグループが存在する場合、このフラグは必須です。

### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db import --help
```

## 使用例

### 基本的なインポート

#### デフォルトグループへのインポート

```bash
turso db import ~/databases/myapp.db
```

グループが1つしかない場合、自動的にそのグループにインポートされます。

#### 特定グループへのインポート

```bash
turso db import ~/databases/myapp.db --group production
```

`production`グループにデータベースをインポートします。

### 完全な移行ワークフロー

#### ステップ1: ローカルデータベースの準備

```bash
# WALモードを確認
sqlite3 ~/myapp/data.db "PRAGMA journal_mode;"

# WALモードでない場合は有効化
sqlite3 ~/myapp/data.db "PRAGMA journal_mode=WAL;"

# データベースの整合性をチェック
sqlite3 ~/myapp/data.db "PRAGMA integrity_check;"
```

#### ステップ2: Tursoへのインポート

```bash
# データベースをインポート
turso db import ~/myapp/data.db --group production
```

#### ステップ3: インポート確認

```bash
# インポートされたデータベースを確認
turso db list --group production

# データベースの詳細を表示
turso db show myapp
```

### プロジェクト構造での使用

```bash
# プロジェクトルートから
turso db import ./data/sqlite/app.db --group development

# 絶対パスでの指定
turso db import /home/user/projects/myapp/database.db --group staging
```

### バックアップからのインポート

```bash
# バックアップファイルをインポート
turso db import ~/backups/backup-20241019.db --group backups

# 日付付きバックアップのインポート
turso db import ~/backups/production-$(date +%Y%m%d).db --group production
```

## 実践的なワークフロー

### 開発から本番への移行

```bash
#!/bin/bash

# 環境変数
LOCAL_DB="./dev-database.db"
GROUP="production"

# ステップ1: ローカルDBの準備
echo "Preparing local database..."
sqlite3 $LOCAL_DB "PRAGMA journal_mode=WAL;"
sqlite3 $LOCAL_DB "PRAGMA integrity_check;"

# ステップ2: バックアップ作成
echo "Creating backup..."
cp $LOCAL_DB "${LOCAL_DB}.backup"

# ステップ3: Tursoにインポート
echo "Importing to Turso..."
turso db import $LOCAL_DB --group $GROUP

# ステップ4: 確認
echo "Verifying import..."
turso db list --group $GROUP
```

### 複数データベースのバッチインポート

```bash
#!/bin/bash

# データベースディレクトリ
DB_DIR="./databases"
GROUP="imported"

# すべての.dbファイルをインポート
for db_file in $DB_DIR/*.db; do
  echo "Importing $db_file..."

  # WALモードを確認・設定
  sqlite3 "$db_file" "PRAGMA journal_mode=WAL;"

  # インポート実行
  turso db import "$db_file" --group $GROUP

  echo "Completed: $db_file"
done

echo "All databases imported successfully!"
```

### マイグレーションスクリプト

```bash
#!/bin/bash

# 設定
OLD_DB="legacy-app.db"
NEW_GROUP="production"

# 1. 元のデータベースを準備
echo "Step 1: Preparing database..."
sqlite3 $OLD_DB <<EOF
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;
ANALYZE;
VACUUM;
EOF

# 2. スキーマ検証
echo "Step 2: Validating schema..."
sqlite3 $OLD_DB ".schema" > schema-backup.sql

# 3. データ検証
echo "Step 3: Validating data..."
row_count=$(sqlite3 $OLD_DB "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
echo "Tables found: $row_count"

# 4. インポート実行
echo "Step 4: Importing to Turso..."
turso db import $OLD_DB --group $NEW_GROUP

# 5. 検証
echo "Step 5: Verifying import..."
turso db show legacy-app
turso db shell legacy-app "SELECT COUNT(*) FROM sqlite_master WHERE type='table';"

echo "Migration completed!"
```

## データベース名の扱い

インポート時のデータベース名は、ファイル名（拡張子を除く）から自動的に決定されます:

```bash
# ファイル: myapp.db → データベース名: myapp
turso db import ~/databases/myapp.db

# ファイル: customer-data.db → データベース名: customer-data
turso db import ~/databases/customer-data.db

# ファイル: production.db → データベース名: production
turso db import ~/backups/production.db --group production
```

## ベストプラクティス

### 1. インポート前の検証

インポート前に必ずデータベースの整合性をチェック:

```bash
# 整合性チェック
sqlite3 your-database.db "PRAGMA integrity_check;"

# 外部キー制約のチェック
sqlite3 your-database.db "PRAGMA foreign_key_check;"

# テーブル一覧の確認
sqlite3 your-database.db ".tables"
```

### 2. バックアップの作成

インポート前に必ずバックアップを作成:

```bash
# シンプルなコピー
cp original.db original.db.backup

# タイムスタンプ付きバックアップ
cp original.db "original-$(date +%Y%m%d-%H%M%S).db"

# バックアップディレクトリに保存
cp original.db ~/backups/original-$(date +%Y%m%d).db
```

### 3. WALモードの事前設定

インポート前にWALモードを設定:

```bash
# WALモードを設定してチェックポイントを実行
sqlite3 your-database.db <<EOF
PRAGMA journal_mode=WAL;
PRAGMA wal_checkpoint(FULL);
EOF
```

### 4. グループの適切な選択

環境に応じてグループを使い分け:

```bash
# 開発環境
turso db import dev.db --group development

# ステージング環境
turso db import staging.db --group staging

# 本番環境
turso db import prod.db --group production
```

### 5. インポート後の検証

インポート後は必ずデータを検証:

```bash
# データベース情報の確認
turso db show imported-db

# テーブル数の確認
turso db shell imported-db "SELECT COUNT(*) FROM sqlite_master WHERE type='table';"

# サンプルデータの確認
turso db shell imported-db "SELECT * FROM users LIMIT 5;"
```

## トラブルシューティング

### エラー: "WAL mode required"

**原因**: データベースがWALモードで作成されていない

**解決方法**:

```bash
# WALモードを有効化
sqlite3 your-database.db "PRAGMA journal_mode=WAL;"

# 確認
sqlite3 your-database.db "PRAGMA journal_mode;"

# 再度インポート
turso db import your-database.db --group default
```

### エラー: "group is required"

**原因**: 複数のグループが存在するが、グループが指定されていない

**解決方法**:

```bash
# グループ一覧を確認
turso group list

# グループを指定してインポート
turso db import your-database.db --group <グループ名>
```

### エラー: "file not found"

**原因**: 指定されたファイルパスが正しくない

**解決方法**:

```bash
# ファイルの存在確認
ls -l ~/path/to/database.db

# 絶対パスを使用
turso db import /absolute/path/to/database.db

# カレントディレクトリからの相対パス
turso db import ./database.db
```

### エラー: "invalid SQLite file"

**原因**: ファイルが有効なSQLite3形式ではない

**解決方法**:

```bash
# SQLiteバージョンを確認
sqlite3 your-database.db "SELECT sqlite_version();"

# ファイル形式を確認
file your-database.db

# 必要に応じてSQLite3形式に変換
sqlite3 new-database.db < old-dump.sql
```

### エラー: "database already exists"

**原因**: 同名のデータベースが既に存在する

**解決方法**:

```bash
# 既存のデータベースを確認
turso db list

# 別の名前でインポート（ファイル名を変更）
cp original.db new-name.db
turso db import new-name.db

# または既存のデータベースを削除
turso db destroy existing-db --yes
turso db import original.db
```

## パフォーマンス考慮事項

### インポート時間

```typescript
interface ImportPerformance {
  factors: {
    fileSize: "大きいほど時間がかかる";
    tableCount: "テーブル数に比例";
    indexCount: "インデックス数に影響";
    dataComplexity: "外部キー・トリガーなど";
  };
  optimization: {
    walMode: "必須、パフォーマンス向上";
    vacuum: "事前にVACUUMを実行";
    analyze: "統計情報を更新";
  };
}
```

### 最適化のヒント

```bash
# インポート前の最適化
sqlite3 your-database.db <<EOF
PRAGMA journal_mode=WAL;
VACUUM;
ANALYZE;
PRAGMA wal_checkpoint(FULL);
EOF

# インポート実行
turso db import your-database.db --group production
```

## セキュリティ考慮事項

### 機密データの確認

インポート前に機密データを確認:

```bash
# テーブル構造の確認
sqlite3 your-database.db ".schema"

# サンプルデータの確認
sqlite3 your-database.db "SELECT * FROM users LIMIT 3;"
```

### データのサニタイズ

必要に応じてデータをサニタイズ:

```bash
# サニタイズ用のコピーを作成
cp production.db sanitized.db

# 機密データを削除・マスク
sqlite3 sanitized.db <<EOF
UPDATE users SET email = 'user' || id || '@example.com';
UPDATE users SET password = 'hashed_password';
DELETE FROM sensitive_logs;
EOF

# サニタイズ版をインポート
turso db import sanitized.db --group development
```

## 代替方法との比較

### `turso db import` vs `turso db create --from-file`

```typescript
interface CommandComparison {
  "turso db import": {
    用途: "既存SQLiteファイルをそのまま移行";
    命名: "ファイル名から自動決定";
    制約: "WALモード必須";
  };
  "turso db create --from-file": {
    用途: "新しいデータベースとして作成";
    命名: "明示的に名前を指定可能";
    制約: "2GBまで";
  };
}
```

**使い分け**:

```bash
# シンプルな移行: import を使用
turso db import legacy-app.db

# カスタム名で作成: create を使用
turso db create new-name --from-file legacy-app.db
```

## 関連コマンド

- [`turso db create`](./db-create.md) - 新しいデータベースを作成
- [`turso db export`](./db-export.md) - データベースをエクスポート
- [`turso db show`](./db-show.md) - データベース情報を表示
- [`turso db list`](./db-list.md) - データベース一覧を表示
- [`turso group list`](./group-list.md) - グループ一覧を表示

## 参考リンク

- [Turso データベース管理](https://docs.turso.tech/concepts/databases)
- [SQLite WALモード](https://www.sqlite.org/wal.html)
- [SQLiteからの移行ガイド](https://docs.turso.tech/guides/migrate-from-sqlite)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
