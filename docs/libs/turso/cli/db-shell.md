# turso db shell - データベースシェル

Turso CLIの`turso db shell`コマンドは、データベースに対してインタラクティブなSQLシェルセッションを開始したり、SQLコマンドを直接実行したりします。SQLiteシェルの機能をサポートしています。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [使用例](#使用例)
- [SQLiteコマンド](#sqliteコマンド)
- [実践的なワークフロー](#実践的なワークフロー)
- [ベストプラクティス](#ベストプラクティス)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
# インタラクティブシェル
turso db shell <データベース名>

# SQLコマンドの直接実行
turso db shell <データベース名> "<SQL文>"

# ローカルlibSQLサーバー
turso db shell <URL>
```

### パラメータ

- `データベース名` (必須): 接続するデータベースの名前
- `SQL文` (オプション): 実行するSQLコマンド
- `URL` (オプション): ローカルlibSQLサーバーのURL

## オプション

### `--instance <インスタンス>`

特定のデータベースインスタンスに接続します。

```bash
turso db shell my-database --instance primary
```

### `--location <ロケーションコード>`

指定したロケーションのデータベースに接続します。

```bash
turso db shell my-database --location nrt
```

### `--proxy <URL>`

プロキシ経由でデータベースに接続します。

```bash
turso db shell my-database --proxy http://proxy.example.com:8080
```

### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db shell --help
```

## 使用例

### インタラクティブシェル

#### 基本的なシェル起動

```bash
turso db shell my-database
```

**シェルが起動:**

```sql
Connected to my-database
libSQL version 0.24.1

Enter ".help" for usage hints.

my-database>
```

シェル内でSQLコマンドを実行できます:

```sql
my-database> SELECT * FROM users LIMIT 5;
my-database> .tables
my-database> .schema users
my-database> .exit
```

### 直接SQLコマンドの実行

#### 単一クエリの実行

```bash
turso db shell my-database "SELECT * FROM users LIMIT 5"
```

**出力例:**

```
id  name          email                created_at
1   John Doe      john@example.com     2024-01-15 10:30:00
2   Jane Smith    jane@example.com     2024-01-16 14:20:00
3   Bob Johnson   bob@example.com      2024-01-17 09:15:00
4   Alice Brown   alice@example.com    2024-01-18 16:45:00
5   Charlie Davis charlie@example.com  2024-01-19 11:00:00
```

#### データの挿入

```bash
turso db shell my-database "INSERT INTO users (name, email) VALUES ('New User', 'new@example.com')"
```

#### データの更新

```bash
turso db shell my-database "UPDATE users SET status = 'active' WHERE id = 1"
```

#### データの削除

```bash
turso db shell my-database "DELETE FROM users WHERE status = 'inactive'"
```

### データベースのダンプ

#### 完全なダンプをファイルに出力

```bash
turso db shell my-database .dump > dump.sql
```

これにより、データベースの完全なSQLダンプが`dump.sql`ファイルに保存されます。

**ダンプの内容:**

```sql
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users VALUES(1,'John Doe','john@example.com','2024-01-15 10:30:00');
INSERT INTO users VALUES(2,'Jane Smith','jane@example.com','2024-01-16 14:20:00');
-- ... more inserts ...
COMMIT;
```

**重要な注意事項**: `.dump`コマンドはlibSQLやSQLiteの内部テーブルを除外してデータベースを再構築できます。

### ダンプからの復元

#### ダンプファイルからデータをロード

```bash
turso db shell my-database < dump.sql
```

または:

```bash
cat dump.sql | turso db shell my-database
```

これにより、`dump.sql`の内容が実行され、データベースにデータが復元されます。

### ローカルlibSQLサーバーへの接続

#### ローカルサーバーのシェル

```bash
turso db shell http://127.0.0.1:8080
```

ローカルで実行されているlibSQLサーバーに接続できます。

## SQLiteコマンド

turso db shellは、SQLiteの特殊コマンド（ドットコマンド）をサポートしています。

### テーブル関連

#### `.tables` - テーブル一覧を表示

```bash
turso db shell my-database .tables
```

**出力:**

```
users  orders  products  customers
```

#### `.schema` - スキーマを表示

```bash
# すべてのテーブルのスキーマ
turso db shell my-database .schema

# 特定のテーブルのスキーマ
turso db shell my-database ".schema users"
```

**出力:**

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);
```

### データ表示

#### `.headers on/off` - ヘッダー表示の切り替え

```bash
turso db shell my-database <<EOF
.headers on
SELECT * FROM users LIMIT 3;
EOF
```

#### `.mode` - 出力モードの変更

```bash
# CSVモード
turso db shell my-database <<EOF
.mode csv
SELECT * FROM users;
EOF

# JSONモード
turso db shell my-database <<EOF
.mode json
SELECT * FROM users;
EOF

# Markdownテーブルモード
turso db shell my-database <<EOF
.mode markdown
SELECT * FROM users;
EOF
```

#### `.output` - 出力先の変更

```bash
turso db shell my-database <<EOF
.output users.csv
.mode csv
SELECT * FROM users;
.output stdout
EOF
```

### データベース情報

#### `.dbinfo` - データベース情報を表示

```bash
turso db shell my-database .dbinfo
```

#### `.databases` - 接続中のデータベース一覧

```bash
turso db shell my-database .databases
```

### その他

#### `.help` - ヘルプを表示

```bash
turso db shell my-database .help
```

#### `.exit` または `.quit` - シェルを終了

インタラクティブモードでの終了:

```sql
my-database> .exit
```

## 実践的なワークフロー

### データのバックアップと復元

#### 完全バックアップ

```bash
#!/bin/bash

DB_NAME="production-db"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}-${DATE}.sql"

mkdir -p "$BACKUP_DIR"

echo "Creating backup of $DB_NAME..."
turso db shell "$DB_NAME" .dump > "$BACKUP_FILE"

# 検証
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
  echo "Backup created successfully: $BACKUP_FILE"
else
  echo "Error: Backup failed"
  exit 1
fi
```

#### データの復元

```bash
#!/bin/bash

BACKUP_FILE="./backups/production-db-20241019.sql"
TARGET_DB="restored-db"

# 新しいデータベースを作成
turso db create "$TARGET_DB"

# バックアップから復元
echo "Restoring from $BACKUP_FILE..."
turso db shell "$TARGET_DB" < "$BACKUP_FILE"

echo "Restoration completed"
```

### データのインポート/エクスポート

#### CSVからのインポート

```bash
# CSVファイルの内容をテーブルにインポート
turso db shell my-database <<EOF
.mode csv
.import data.csv users
EOF
```

#### CSVへのエクスポート

```bash
# テーブルをCSVにエクスポート
turso db shell my-database <<EOF
.headers on
.mode csv
.output users.csv
SELECT * FROM users;
.output stdout
EOF
```

### スキーマの管理

#### スキーマのバックアップ

```bash
#!/bin/bash

DB_NAME="my-database"
SCHEMA_FILE="schema-$(date +%Y%m%d).sql"

echo "Exporting schema..."
turso db shell "$DB_NAME" ".schema" > "$SCHEMA_FILE"

echo "Schema exported to $SCHEMA_FILE"
```

#### スキーマの比較

```bash
#!/bin/bash

# 2つのデータベースのスキーマを比較
DB1="production-db"
DB2="staging-db"

turso db shell "$DB1" .schema > schema-prod.sql
turso db shell "$DB2" .schema > schema-staging.sql

diff schema-prod.sql schema-staging.sql
```

### マイグレーションの実行

#### マイグレーションスクリプト

```bash
#!/bin/bash

DB_NAME="my-database"
MIGRATION_FILE="migrations/001-add-users-table.sql"

echo "Running migration: $MIGRATION_FILE"

turso db shell "$DB_NAME" < "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
  echo "Migration completed successfully"
else
  echo "Migration failed"
  exit 1
fi
```

**マイグレーションファイルの例 (001-add-users-table.sql):**

```sql
BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- マイグレーション記録
INSERT INTO schema_migrations (version, applied_at)
VALUES ('001', CURRENT_TIMESTAMP);

COMMIT;
```

### データの検証

#### データ整合性チェック

```bash
#!/bin/bash

DB_NAME="production-db"

echo "Checking database integrity..."

# PRAGMA integrity_check
turso db shell "$DB_NAME" "PRAGMA integrity_check;"

# 外部キー制約のチェック
turso db shell "$DB_NAME" "PRAGMA foreign_key_check;"

# テーブル数の確認
TABLE_COUNT=$(turso db shell "$DB_NAME" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';" | tail -1)
echo "Total tables: $TABLE_COUNT"

# 行数の確認
echo ""
echo "Row counts by table:"
turso db shell "$DB_NAME" <<EOF
SELECT
  name,
  (SELECT COUNT(*) FROM sqlite_master AS sm WHERE sm.name = m.name) AS row_count
FROM sqlite_master AS m
WHERE type = 'table'
  AND name NOT LIKE 'sqlite_%';
EOF
```

### データのクリーンアップ

```bash
#!/bin/bash

DB_NAME="my-database"

echo "Cleaning up old data..."

# 古いレコードを削除
turso db shell "$DB_NAME" <<EOF
BEGIN TRANSACTION;

-- 6ヶ月以上前のログを削除
DELETE FROM logs WHERE created_at < date('now', '-6 months');

-- 削除フラグが立っているユーザーを削除
DELETE FROM users WHERE deleted = 1 AND deleted_at < date('now', '-30 days');

-- VACUUMでスペースを回収
VACUUM;

COMMIT;
EOF

echo "Cleanup completed"
```

## ベストプラクティス

### 1. トランザクションの使用

複数の変更を行う場合は、トランザクションを使用:

```bash
turso db shell my-database <<EOF
BEGIN TRANSACTION;

INSERT INTO users (name, email) VALUES ('User 1', 'user1@example.com');
INSERT INTO orders (user_id, product_id) VALUES (1, 100);
UPDATE inventory SET quantity = quantity - 1 WHERE product_id = 100;

COMMIT;
EOF
```

### 2. エラーハンドリング

```bash
#!/bin/bash

DB_NAME="my-database"

# SQLの実行とエラーチェック
if turso db shell "$DB_NAME" "SELECT * FROM users;" > /dev/null 2>&1; then
  echo "Query executed successfully"
else
  echo "Error: Query failed"
  exit 1
fi
```

### 3. 本番環境での注意

```bash
#!/bin/bash

DB_NAME="$1"
SQL_COMMAND="$2"

# 本番環境の確認
if [[ "$DB_NAME" == *"prod"* ]] || [[ "$DB_NAME" == *"production"* ]]; then
  echo "WARNING: This is a production database!"
  read -p "Are you sure you want to proceed? [y/N]: " confirm
  if [ "$confirm" != "y" ]; then
    echo "Cancelled"
    exit 0
  fi
fi

# コマンド実行
turso db shell "$DB_NAME" "$SQL_COMMAND"
```

### 4. スクリプトでの使用

ヒアドキュメントを使用して複数のコマンドを実行:

```bash
#!/bin/bash

turso db shell my-database <<'EOF'
-- 複数行のSQLコマンド
SELECT 'Creating tables...' AS status;

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  category_id INTEGER,
  name TEXT NOT NULL,
  price REAL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

SELECT 'Tables created successfully' AS status;
EOF
```

### 5. ログ記録

```bash
#!/bin/bash

DB_NAME="my-database"
LOG_FILE="db-operations.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# コマンドとその出力をログに記録
{
  echo "[$TIMESTAMP] Executing query on $DB_NAME"
  turso db shell "$DB_NAME" "SELECT COUNT(*) FROM users;"
} | tee -a "$LOG_FILE"
```

## セキュリティ考慮事項

### 1. 認証情報の保護

```bash
# 環境変数から認証情報を読み込む
export TURSO_AUTH_TOKEN="your-token"

# スクリプト内でトークンを露出しない
turso db shell my-database "SELECT * FROM users;"
```

### 2. SQLインジェクション対策

直接ユーザー入力をSQLに含めない:

```bash
# 悪い例
USER_INPUT="1; DROP TABLE users;"
turso db shell my-database "SELECT * FROM users WHERE id = $USER_INPUT"

# 良い例：入力の検証
if [[ "$USER_INPUT" =~ ^[0-9]+$ ]]; then
  turso db shell my-database "SELECT * FROM users WHERE id = $USER_INPUT"
else
  echo "Error: Invalid input"
fi
```

### 3. 本番データの保護

```bash
# 本番データベースへのシェルアクセスを制限
if [ "$DB_NAME" = "production-db" ] && [ "$USER" != "admin" ]; then
  echo "Error: Insufficient permissions"
  exit 1
fi
```

## トラブルシューティング

### エラー: "database not found"

**解決方法**:

```bash
# データベース名を確認
turso db list

# 正しい名前で接続
turso db shell <正しいデータベース名>
```

### エラー: "permission denied"

**解決方法**:

```bash
# 認証トークンを確認
turso auth token

# 適切な組織に切り替え
turso org switch <組織名>
```

### シェルが応答しない

**解決方法**:

```bash
# Ctrl+C で中断
# または別のターミナルから:
pkill -f "turso db shell"
```

### 大きなクエリ結果

```bash
# ページング
turso db shell my-database "SELECT * FROM large_table;" | less

# ファイルに出力
turso db shell my-database "SELECT * FROM large_table;" > output.txt
```

## パフォーマンス考慮事項

### 大量データの処理

```bash
# バッチ処理
turso db shell my-database <<EOF
BEGIN TRANSACTION;

-- 1000行ずつ処理
DELETE FROM old_data WHERE id IN (
  SELECT id FROM old_data
  WHERE created_at < date('now', '-1 year')
  LIMIT 1000
);

COMMIT;
EOF
```

### ネットワークレイテンシ

```bash
# 最も近いロケーションを指定
turso db shell my-database --location nrt
```

## 関連コマンド

- [`turso db show`](./db-show.md) - データベース情報を表示
- [`turso db inspect`](./db-inspect.md) - データベース使用状況を表示
- [`turso db export`](./db-export.md) - データベースをエクスポート
- [`turso db import`](./db-import.md) - データベースをインポート

## 参考リンク

- [SQLite ドットコマンド](https://www.sqlite.org/cli.html)
- [Turso SQL リファレンス](https://docs.turso.tech/sql)
- [libSQL について](https://docs.turso.tech/libsql)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
