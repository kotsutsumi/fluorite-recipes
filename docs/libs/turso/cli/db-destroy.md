# turso db destroy - データベースの削除

Turso CLIの`turso db destroy`コマンドは、指定したデータベースを完全に削除します。この操作は**不可逆的**であり、削除されたデータは復元できません。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [使用例](#使用例)
- [安全性とベストプラクティス](#安全性とベストプラクティス)
- [トラブルシューティング](#トラブルシューティング)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db destroy <データベース名> [オプション]
```

### パラメータ

- `データベース名` (必須): 削除するデータベースの名前

## オプション

### `-y, --yes`

確認プロンプトをスキップして、データベースを直接削除します。

```bash
turso db destroy my-database --yes
```

**警告**: このフラグを使用すると、確認なしでデータベースが削除されます。

### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db destroy --help
```

## 使用例

### 基本的な削除

#### 対話的な削除（確認あり）

```bash
turso db destroy test-database
```

**実行時の確認プロンプト:**
```
Are you sure you want to destroy database "test-database"? [y/N]: y
Database "test-database" destroyed successfully.
```

ユーザーが`y`を入力すると、データベースが削除されます。

#### 確認をスキップして削除

```bash
turso db destroy test-database --yes
```

確認プロンプトなしで即座にデータベースが削除されます。

**出力例:**
```
Database "test-database" destroyed successfully.
```

### スクリプトでの使用

#### 複数の古いデータベースを削除

```bash
#!/bin/bash

# 削除対象のデータベース一覧
OLD_DATABASES=("old-test-1" "old-test-2" "deprecated-db")

for db in "${OLD_DATABASES[@]}"; do
  echo "Destroying $db..."
  turso db destroy "$db" --yes
  echo "Destroyed: $db"
done

echo "Cleanup completed"
```

#### 開発用データベースのクリーンアップ

```bash
#!/bin/bash

# 開発グループのすべてのデータベースを取得
DEV_DATABASES=$(turso db list --group development | tail -n +2 | awk '{print $1}')

# 確認
echo "The following databases will be destroyed:"
echo "$DEV_DATABASES"
read -p "Continue? [y/N]: " confirm

if [ "$confirm" = "y" ]; then
  for db in $DEV_DATABASES; do
    turso db destroy "$db" --yes
    echo "Destroyed: $db"
  done
  echo "Development databases cleaned up"
else
  echo "Cancelled"
fi
```

#### テスト後のクリーンアップ

```bash
#!/bin/bash

# テストデータベースを作成して使用
TEST_DB="test-$(date +%s)"

turso db create "$TEST_DB" --group testing
# ... テスト実行 ...

# テスト終了後、自動的に削除
turso db destroy "$TEST_DB" --yes
echo "Test database cleaned up: $TEST_DB"
```

### CI/CD での使用

#### GitHub Actions

```yaml
name: Test and Cleanup

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Turso CLI
        run: |
          curl -sSfL https://get.tur.so/install.sh | bash
          echo "$HOME/.turso/bin" >> $GITHUB_PATH

      - name: Authenticate
        run: turso auth login --token ${{ secrets.TURSO_TOKEN }}

      - name: Create test database
        run: |
          DB_NAME="test-${{ github.run_id }}"
          turso db create $DB_NAME --group testing
          echo "TEST_DB=$DB_NAME" >> $GITHUB_ENV

      - name: Run tests
        run: npm test

      - name: Cleanup test database
        if: always()
        run: turso db destroy ${{ env.TEST_DB }} --yes
```

#### GitLab CI

```yaml
test:
  script:
    - export TEST_DB="test-${CI_PIPELINE_ID}"
    - turso db create $TEST_DB --group testing
    - npm test
  after_script:
    - turso db destroy $TEST_DB --yes
```

### 条件付き削除

#### データベースが存在する場合のみ削除

```bash
#!/bin/bash

DB_NAME="maybe-exists"

# データベースの存在確認
if turso db show "$DB_NAME" > /dev/null 2>&1; then
  echo "Database exists, destroying..."
  turso db destroy "$DB_NAME" --yes
  echo "Database destroyed"
else
  echo "Database does not exist, skipping"
fi
```

#### サイズが一定以下の場合のみ削除

```bash
#!/bin/bash

DB_NAME="small-database"

# データベースサイズを取得
SIZE_INFO=$(turso db show "$DB_NAME" | grep "Size:")
SIZE_VALUE=$(echo "$SIZE_INFO" | awk '{print $2}')
SIZE_UNIT=$(echo "$SIZE_INFO" | awk '{print $3}')

# KB または MB の場合のみ削除（GB は保持）
if [ "$SIZE_UNIT" = "KB" ] || [ "$SIZE_UNIT" = "MB" ]; then
  echo "Database is small ($SIZE_VALUE $SIZE_UNIT), safe to destroy"
  turso db destroy "$DB_NAME" --yes
else
  echo "Database is large ($SIZE_VALUE $SIZE_UNIT), skipping for safety"
fi
```

## 安全性とベストプラクティス

### 1. 削除前のバックアップ

**重要**: 本番データベースを削除する前に、必ずバックアップを作成してください。

```bash
#!/bin/bash

DB_NAME="production-db"
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}-$(date +%Y%m%d-%H%M%S).db"

# バックアップディレクトリを作成
mkdir -p "$BACKUP_DIR"

# バックアップを作成
echo "Creating backup..."
turso db export "$DB_NAME" --output-file "$BACKUP_FILE"

# バックアップの検証
if sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;" > /dev/null 2>&1; then
  echo "Backup verified: $BACKUP_FILE"

  # 確認を求める
  read -p "Backup created. Proceed with destruction? [y/N]: " confirm

  if [ "$confirm" = "y" ]; then
    turso db destroy "$DB_NAME" --yes
    echo "Database destroyed. Backup available at: $BACKUP_FILE"
  else
    echo "Destruction cancelled"
  fi
else
  echo "Error: Backup verification failed. Aborting destruction."
  exit 1
fi
```

### 2. 環境の明確な分離

本番環境のデータベースを誤って削除しないよう、命名規則を使用:

```bash
# 良い命名規則
turso db destroy dev-myapp --yes      # 開発環境
turso db destroy test-myapp --yes     # テスト環境
turso db destroy staging-myapp --yes  # ステージング環境

# 本番環境は常に確認プロンプトを使用
turso db destroy prod-myapp  # --yes フラグを使用しない
```

### 3. 削除前の確認チェックリスト

```bash
#!/bin/bash

DB_NAME="$1"

echo "=== Database Destruction Checklist ==="
echo ""

# 1. データベース情報を表示
echo "1. Database Information:"
turso db show "$DB_NAME"
echo ""

# 2. 最終使用日時を確認（要実装）
echo "2. Last Access: (check application logs)"
echo ""

# 3. 依存関係を確認
echo "3. Dependencies: (check application configuration)"
echo ""

# 4. バックアップ状態を確認
echo "4. Recent Backups:"
ls -lh backups/*${DB_NAME}* 2>/dev/null || echo "No backups found!"
echo ""

# 5. 最終確認
read -p "All checks completed. Destroy $DB_NAME? [y/N]: " confirm

if [ "$confirm" = "y" ]; then
  turso db destroy "$DB_NAME" --yes
  echo "Database destroyed"
else
  echo "Destruction cancelled"
fi
```

### 4. 削除ログの記録

```bash
#!/bin/bash

LOG_FILE="database-deletions.log"
DB_NAME="$1"

# 削除前に情報を記録
echo "=== Deletion Log ===" >> "$LOG_FILE"
echo "Date: $(date)" >> "$LOG_FILE"
echo "Database: $DB_NAME" >> "$LOG_FILE"
echo "User: $(whoami)" >> "$LOG_FILE"
turso db show "$DB_NAME" >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"

# 削除実行
turso db destroy "$DB_NAME" --yes

echo "Deletion logged to $LOG_FILE"
```

### 5. 段階的削除プロセス

```bash
#!/bin/bash

DB_NAME="legacy-database"

echo "Stage 1: Mark as deprecated"
# アプリケーションの設定でデータベースを非推奨に設定
echo "  ✓ Database marked as deprecated in config"

echo "Stage 2: Waiting period (7 days)"
# 実際には7日間待つ
echo "  ✓ Waiting period completed"

echo "Stage 3: Create final backup"
turso db export "$DB_NAME" --output-file "final-backup-${DB_NAME}.db"
echo "  ✓ Final backup created"

echo "Stage 4: Verify no active connections"
# アプリケーションログで接続を確認
echo "  ✓ No active connections detected"

echo "Stage 5: Destroy database"
turso db destroy "$DB_NAME" --yes
echo "  ✓ Database destroyed"

echo "Staged deletion completed successfully"
```

## 削除の取り消し（復元）

データベースを削除した後の復元オプション:

### バックアップからの復元

```bash
#!/bin/bash

BACKUP_FILE="production-db-20241019.db"
NEW_DB_NAME="production-db"

# バックアップから新しいデータベースを作成
turso db create "$NEW_DB_NAME" --from-file "$BACKUP_FILE"

echo "Database restored from backup: $NEW_DB_NAME"
```

### ポイントインタイムリカバリ

削除前に他のデータベースにスナップショットを作成していた場合:

```bash
# 削除前にスナップショットを作成（推奨）
turso db create backup-snapshot --from-db production-db

# 削除後、スナップショットから復元
turso db create production-db --from-db backup-snapshot
```

## トラブルシューティング

### エラー: "database not found"

**原因**: 指定したデータベースが存在しない、または既に削除されている

**解決方法**:

```bash
# データベース一覧を確認
turso db list

# 正しいデータベース名で再実行
turso db destroy <正しいデータベース名>
```

### エラー: "permission denied"

**原因**: データベースを削除する権限がない

**解決方法**:

```bash
# 組織の所有者または管理者に連絡
# または、適切な権限を持つアカウントでログイン

# 現在の組織を確認
turso org list

# 必要に応じて組織を切り替え
turso org switch <組織名>
```

### エラー: "database is in use"

**原因**: データベースが現在使用中（将来的にこのエラーが実装される可能性）

**解決方法**:

```bash
# アプリケーションを停止
# データベースへの接続を確認

# 再度削除を試行
turso db destroy my-database --yes
```

### 誤って削除してしまった場合

**即座の対応**:

```bash
# 1. バックアップの確認
ls -lht backups/

# 2. 最新のバックアップから復元
LATEST_BACKUP=$(ls -t backups/*.db | head -1)
turso db create recovered-db --from-file "$LATEST_BACKUP"

# 3. アプリケーションの接続設定を更新
```

**バックアップがない場合**:

- Tursoのサポートに連絡（復元できる可能性は低い）
- アプリケーションログからデータを再構築
- 他のレプリカやキャッシュからデータを復元

## セキュリティ考慮事項

### アクセス制御

```typescript
interface DeletionSecurity {
  permissions: {
    required: "データベース削除権限";
    level: "組織所有者または管理者";
  };
  bestPractices: {
    production: "複数人の承認が必要";
    automation: "環境変数で保護";
    audit: "削除ログを記録";
  };
}
```

### 監査ログ

```bash
#!/bin/bash

# 削除操作の監査ログ
AUDIT_LOG="audit-deletions.log"

log_deletion() {
  local db_name=$1
  local user=$(whoami)
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  echo "$timestamp | USER:$user | ACTION:destroy | DATABASE:$db_name" >> "$AUDIT_LOG"
}

# 使用例
DB_NAME="test-database"
log_deletion "$DB_NAME"
turso db destroy "$DB_NAME" --yes
```

## パフォーマンス考慮事項

### 削除時間

```typescript
interface DeletionPerformance {
  factors: {
    databaseSize: "大きいほど時間がかかる";
    replicaCount: "レプリカ数に依存";
    groupSettings: "グループ設定に影響";
  };
  typical: {
    small: "数秒";
    medium: "数十秒";
    large: "数分";
  };
}
```

### 大規模データベースの削除

```bash
# 大規模データベースの削除は時間がかかる可能性がある
echo "Destroying large database..."
turso db destroy large-database --yes

# 完了まで待機
while turso db show large-database > /dev/null 2>&1; do
  echo "Waiting for deletion to complete..."
  sleep 5
done

echo "Deletion completed"
```

## 代替方法

### アーカイブ（削除せずに無効化）

完全な削除の代わりに、データベースをアーカイブ:

```bash
# データベースをエクスポートしてアーカイブ
ARCHIVE_DIR="./archives"
mkdir -p "$ARCHIVE_DIR"

turso db export archived-db \
  --output-file "$ARCHIVE_DIR/archived-db-$(date +%Y%m%d).db"

# 接続トークンを削除（アプリケーションからアクセス不可に）
# その後、必要に応じて削除
turso db destroy archived-db --yes
```

### グループからの移動

削除の代わりに、別のグループに移動:

```bash
# アーカイブグループに移動（グループ転送が利用可能な場合）
# 現在のCLIでは直接サポートされていない可能性があります
# 代わりに、エクスポート＆再インポート
turso db export old-db --output-file temp.db
turso db create old-db-archived --from-file temp.db --group archives
turso db destroy old-db --yes
rm temp.db
```

## 関連コマンド

- [`turso db create`](./db-create.md) - 新しいデータベースを作成
- [`turso db list`](./db-list.md) - データベース一覧を表示
- [`turso db export`](./db-export.md) - データベースをエクスポート
- [`turso db show`](./db-show.md) - データベース詳細を表示

## 参考リンク

- [Turso データベース管理](https://docs.turso.tech/concepts/databases)
- [バックアップとリカバリ](https://docs.turso.tech/guides/backup)
- [データ保護のベストプラクティス](https://docs.turso.tech/guides/best-practices)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
