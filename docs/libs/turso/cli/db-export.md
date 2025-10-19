# turso db export - データベースのエクスポート

Turso CLIの`turso db export`コマンドは、TursoデータベースのスナップショットをローカルのSQLiteファイルにエクスポートします。バックアップやローカル開発での使用に適しています。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [使用例](#使用例)
- [重要な注意事項](#重要な注意事項)
- [ベストプラクティス](#ベストプラクティス)
- [トラブルシューティング](#トラブルシューティング)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db export <データベース名> [オプション]
```

### パラメータ

- `データベース名` (必須): エクスポートするデータベースの名前

## オプション

### `--output-file <ファイル名>`

エクスポート先のファイル名を指定します。

```bash
turso db export my-database --output-file backup.db
```

**デフォルト**: `<データベース名>.db`

### `--overwrite`

既存の出力ファイルを上書きします。

```bash
turso db export my-database --output-file backup.db --overwrite
```

### `--with-metadata`

エクスポートにメタデータを含めます。

```bash
turso db export my-database --with-metadata
```

### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db export --help
```

## 使用例

### 基本的なエクスポート

#### デフォルトファイル名でエクスポート

```bash
turso db export my-database
```

カレントディレクトリに`my-database.db`ファイルが作成されます。

#### カスタムファイル名でエクスポート

```bash
turso db export my-database --output-file backup-20241019.db
```

指定したファイル名でエクスポートされます。

#### 既存ファイルを上書き

```bash
turso db export my-database --output-file backup.db --overwrite
```

既存の`backup.db`ファイルが上書きされます。

### バックアップワークフロー

#### 日次バックアップ

```bash
#!/bin/bash

# タイムスタンプ付きバックアップ
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d)
DB_NAME="production-db"

# バックアップディレクトリが存在しない場合は作成
mkdir -p "$BACKUP_DIR"

# エクスポート実行
turso db export "$DB_NAME" --output-file "$BACKUP_DIR/${DB_NAME}-${DATE}.db"

echo "Backup completed: ${DB_NAME}-${DATE}.db"
```

#### 複数データベースのバックアップ

```bash
#!/bin/bash

BACKUP_DIR="./backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# バックアップ対象のデータベース一覧
DATABASES=("production-db" "analytics-db" "cache-db")

for db in "${DATABASES[@]}"; do
  echo "Exporting $db..."
  turso db export "$db" --output-file "$BACKUP_DIR/${db}.db"
  echo "Completed: $db"
done

echo "All backups completed in $BACKUP_DIR"
```

#### 週次フルバックアップ

```bash
#!/bin/bash

# 週次バックアップスクリプト
BACKUP_BASE="./backups/weekly"
WEEK=$(date +%Y-W%U)
BACKUP_DIR="$BACKUP_BASE/$WEEK"

mkdir -p "$BACKUP_DIR"

# すべてのデータベースをエクスポート
turso db list | tail -n +2 | awk '{print $1}' | while read db; do
  echo "Backing up $db..."
  turso db export "$db" \
    --output-file "$BACKUP_DIR/${db}.db" \
    --with-metadata
done

# バックアップの圧縮
tar -czf "$BACKUP_BASE/backup-$WEEK.tar.gz" -C "$BACKUP_BASE" "$WEEK"
echo "Weekly backup completed: backup-$WEEK.tar.gz"
```

### ローカル開発用のエクスポート

#### 開発環境にデータをコピー

```bash
#!/bin/bash

# 本番データを開発用にエクスポート
turso db export production-db --output-file dev-data.db

echo "Production data exported for local development"
echo "Use: sqlite3 dev-data.db"
```

#### データサニタイズ後のローカル使用

```bash
#!/bin/bash

# エクスポート
turso db export production-db --output-file temp.db

# データのサニタイズ
sqlite3 temp.db <<EOF
-- 個人情報を匿名化
UPDATE users SET
  email = 'user' || id || '@example.com',
  phone = NULL,
  address = 'Anonymous';

-- センシティブなログを削除
DELETE FROM audit_logs WHERE created_at < date('now', '-30 days');

-- パスワードをリセット
UPDATE users SET password_hash = 'dev_password_hash';
EOF

# サニタイズ済みデータを最終ファイルに
mv temp.db dev-sanitized.db

echo "Sanitized database ready: dev-sanitized.db"
```

### CI/CD でのエクスポート

```yaml
# GitHub Actions の例
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # 毎日午前2時

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Install Turso CLI
        run: |
          curl -sSfL https://get.tur.so/install.sh | bash
          echo "$HOME/.turso/bin" >> $GITHUB_PATH

      - name: Authenticate
        run: turso auth login --token ${{ secrets.TURSO_TOKEN }}

      - name: Export Database
        run: |
          turso db export production-db \
            --output-file backup-$(date +%Y%m%d).db

      - name: Upload to S3
        run: |
          aws s3 cp backup-$(date +%Y%m%d).db \
            s3://my-backups/turso/
```

## 重要な注意事項

### スナップショットの性質

```typescript
interface ExportBehavior {
  dataFreshness: {
    type: "スナップショット";
    timing: "現在の世代";
    latency: "最新の変更が含まれない可能性";
  };
  recommendation: {
    action: "エクスポート後にSDKで同期";
    reason: "最新のデータを確実に取得";
  };
}
```

**重要**: エクスポートされたファイルには最新の変更が含まれていない可能性があります。SDK を使用してデータベースを同期し、最新バージョンを取得することを推奨します。

### 同期の実行

エクスポート後、SDKを使用してデータベースを同期:

```typescript
import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:backup-20241019.db',
  syncUrl: 'libsql://my-database-org.turso.io',
  authToken: 'your-auth-token',
});

// データベースを同期して最新データを取得
await client.sync();
```

## ベストプラクティス

### 1. 定期的なバックアップスケジュール

```bash
# crontab の設定例
# 毎日午前2時にバックアップ
0 2 * * * /home/user/scripts/daily-backup.sh

# 週次フルバックアップ（日曜午前3時）
0 3 * * 0 /home/user/scripts/weekly-backup.sh
```

バックアップスクリプト例:
```bash
#!/bin/bash
# daily-backup.sh

BACKUP_DIR="/backups/turso"
DATE=$(date +%Y%m%d)
RETENTION_DAYS=30

# バックアップ実行
turso db export production-db \
  --output-file "$BACKUP_DIR/production-$DATE.db"

# 古いバックアップを削除
find "$BACKUP_DIR" -name "production-*.db" -mtime +$RETENTION_DAYS -delete

# ログ記録
echo "$(date): Backup completed - production-$DATE.db" >> "$BACKUP_DIR/backup.log"
```

### 2. メタデータの保存

重要なデータベースはメタデータ付きでエクスポート:

```bash
turso db export production-db \
  --output-file "production-backup.db" \
  --with-metadata
```

### 3. バックアップの検証

エクスポート後は必ずファイルを検証:

```bash
#!/bin/bash

DB_FILE="backup.db"

# ファイルの存在確認
if [ ! -f "$DB_FILE" ]; then
  echo "Error: Backup file not found"
  exit 1
fi

# SQLiteファイルとして有効か確認
if ! sqlite3 "$DB_FILE" "PRAGMA integrity_check;" > /dev/null 2>&1; then
  echo "Error: Backup file is corrupted"
  exit 1
fi

# テーブル数を確認
TABLE_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
echo "Backup validated: $TABLE_COUNT tables found"
```

### 4. 圧縮とアーカイブ

ディスク容量を節約するために圧縮:

```bash
#!/bin/bash

# エクスポート
turso db export large-database --output-file backup.db

# 圧縮
gzip backup.db
# 結果: backup.db.gz

# または tar + gzip
tar -czf backup-$(date +%Y%m%d).tar.gz backup.db
```

### 5. リモートストレージへのアップロード

```bash
#!/bin/bash

BACKUP_FILE="production-$(date +%Y%m%d).db"

# エクスポート
turso db export production-db --output-file "$BACKUP_FILE"

# S3へアップロード
aws s3 cp "$BACKUP_FILE" s3://my-backups/turso/

# Google Cloud Storageへアップロード
gsutil cp "$BACKUP_FILE" gs://my-backups/turso/

# Dropboxへアップロード（dropbox-cliを使用）
dropbox-cli upload "$BACKUP_FILE" /turso-backups/

echo "Backup uploaded to remote storage"
```

### 6. エクスポート履歴の記録

```bash
#!/bin/bash

LOG_FILE="export-history.log"

# エクスポート実行
DB_NAME="production-db"
OUTPUT_FILE="backup-$(date +%Y%m%d-%H%M%S).db"

turso db export "$DB_NAME" --output-file "$OUTPUT_FILE"

# ログ記録
FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
echo "$(date '+%Y-%m-%d %H:%M:%S'),$DB_NAME,$OUTPUT_FILE,$FILE_SIZE" >> "$LOG_FILE"

echo "Export completed and logged"
```

## データの復元

### エクスポートファイルからの復元

#### 新しいTursoデータベースとして復元

```bash
# エクスポートファイルから新しいデータベースを作成
turso db create restored-db --from-file backup.db
```

#### ローカルでの使用

```bash
# SQLiteとして直接使用
sqlite3 backup.db "SELECT * FROM users LIMIT 5;"

# アプリケーションで使用
# Node.js の例:
import Database from 'better-sqlite3';
const db = new Database('backup.db');
```

### 完全な復元プロセス

```bash
#!/bin/bash

# 復元スクリプト
BACKUP_FILE="production-20241019.db"
NEW_DB_NAME="production-db-restored"

# ステップ 1: バックアップファイルの検証
echo "Validating backup file..."
sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;"

# ステップ 2: 新しいデータベースを作成
echo "Creating new database from backup..."
turso db create "$NEW_DB_NAME" --from-file "$BACKUP_FILE"

# ステップ 3: 検証
echo "Verifying restored database..."
turso db show "$NEW_DB_NAME"

echo "Restoration completed: $NEW_DB_NAME"
```

## トラブルシューティング

### エラー: "permission denied"

**原因**: 出力ディレクトリへの書き込み権限がない

**解決方法**:
```bash
# 書き込み可能なディレクトリを使用
turso db export my-database --output-file ~/backups/backup.db

# または現在のディレクトリの権限を確認
ls -la
```

### エラー: "file already exists"

**原因**: 同名のファイルが既に存在

**解決方法**:
```bash
# 上書きフラグを使用
turso db export my-database --output-file backup.db --overwrite

# または異なるファイル名を使用
turso db export my-database --output-file backup-new.db
```

### エクスポートファイルが破損している

**原因**: エクスポート中の中断、ディスク容量不足

**解決方法**:
```bash
# ディスク容量を確認
df -h

# ファイルの整合性をチェック
sqlite3 backup.db "PRAGMA integrity_check;"

# 再度エクスポート
turso db export my-database --output-file backup-retry.db
```

### データが古い

**原因**: エクスポートはスナップショットであり、最新データが含まれていない

**解決方法**:
```typescript
// SDKで同期して最新データを取得
import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:backup.db',
  syncUrl: 'libsql://my-database-org.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await client.sync();
console.log('Database synced with latest data');
```

## セキュリティ考慮事項

### 1. バックアップファイルの保護

```bash
# エクスポート後、ファイルのパーミッションを制限
turso db export sensitive-db --output-file backup.db
chmod 600 backup.db

# 所有者のみアクセス可能に
ls -l backup.db
# -rw------- 1 user user 10485760 Oct 19 10:00 backup.db
```

### 2. 暗号化

機密データを含むバックアップは暗号化:

```bash
# エクスポート後に暗号化
turso db export production-db --output-file backup.db
gpg --symmetric --cipher-algo AES256 backup.db
rm backup.db  # 元のファイルを削除

# 復号化（使用時）
gpg --decrypt backup.db.gpg > backup.db
```

### 3. 機密情報の除外

必要に応じてデータをサニタイズ:

```bash
# エクスポート後にサニタイズ
turso db export production-db --output-file temp.db

sqlite3 temp.db <<EOF
DELETE FROM api_keys;
DELETE FROM access_tokens;
UPDATE users SET password_hash = 'redacted';
EOF

mv temp.db sanitized-backup.db
```

## パフォーマンス考慮事項

### エクスポート時間

```typescript
interface ExportPerformance {
  factors: {
    databaseSize: "大きいほど時間がかかる";
    networkLatency: "Tursoサーバーとの距離";
    diskSpeed: "ローカルディスクの書き込み速度";
  };
  optimization: {
    offPeakHours: "ピーク外の時間帯に実行";
    bandwidth: "十分な帯域幅を確保";
  };
}
```

### 大規模データベースのエクスポート

```bash
# 大規模データベースは時間がかかる可能性があるため、
# バックグラウンドで実行
nohup turso db export large-database \
  --output-file large-backup.db &

# プロセスの確認
jobs
```

## 関連コマンド

- [`turso db import`](./db-import.md) - SQLiteファイルをインポート
- [`turso db create`](./db-create.md) - データベースを作成
- [`turso db shell`](./db-shell.md) - データベースシェルを起動
- [`turso db show`](./db-show.md) - データベース情報を表示

## 参考リンク

- [Turso SDK](https://docs.turso.tech/sdk)
- [バックアップ戦略](https://docs.turso.tech/guides/backup)
- [データ同期](https://docs.turso.tech/embedded-replicas)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
