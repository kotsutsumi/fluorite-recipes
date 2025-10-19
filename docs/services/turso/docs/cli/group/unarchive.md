# turso group unarchive - グループのアーカイブ解除

非アクティブによりアーカイブされたデータベースグループを再アクティブ化します。

## 構文

```bash
turso group unarchive <group-name>
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: アーカイブ解除するグループの名前
- **形式**: アーカイブされたグループ名

## アーカイブについて

### 自動アーカイブの条件

Tursoは以下の条件でデータベースを自動的にアーカイブします：

- **対象プラン**: Starterプラン（無料プラン）
- **非アクティブ期間**: 10日間アクセスがない場合
- **目的**: リソースの効率的な利用

### アーカイブされたデータベースの状態

- **データ保持**: すべてのデータは保持されます
- **アクセス**: 読み取り・書き込みが一時的に無効
- **料金**: アーカイブ中は課金されません（Starterプラン）
- **復元**: `unarchive`コマンドで即座に復元可能

## 使用例

### 基本的な使用方法

```bash
# アーカイブされたグループを復元
turso group unarchive my-archived-group

# 出力例:
# Unarchiving group "my-archived-group"...
# Group "my-archived-group" has been unarchived and is now active.
```

### アーカイブ状態の確認

```bash
# グループの状態を確認
turso group show my-group

# 出力例（アーカイブされている場合）:
# Name: my-group
# Status: archived
# Databases: 3
# Last accessed: 2024-10-01
```

### 複数のグループを復元

```bash
#!/bin/bash
# unarchive-all.sh

# アーカイブされたグループのリスト
ARCHIVED_GROUPS=(
  "archived-group-1"
  "archived-group-2"
  "archived-group-3"
)

for group in "${ARCHIVED_GROUPS[@]}"; do
  echo "Unarchiving $group..."
  turso group unarchive $group

  if [ $? -eq 0 ]; then
    echo "✓ $group unarchived successfully"
  else
    echo "✗ Failed to unarchive $group"
  fi
done
```

## Scale to Zero（スケールtoゼロ）

### 仕組み

Tursoの「Scale to Zero」機能により、非アクティブなデータベースは自動的にスケールダウンされます：

1. **10日間非アクティブ**: データベースへのアクセスがない
2. **自動アーカイブ**: リソースが解放される
3. **データ保持**: すべてのデータは安全に保管
4. **即座に復元**: `unarchive`で数秒で再開

### メリット

- **コスト削減**: 非アクティブなデータベースに課金されない
- **リソース効率**: 必要な時だけリソースを使用
- **データ安全性**: アーカイブ中もデータは保護される
- **簡単な復元**: ワンコマンドで即座に復元

## ベストプラクティス

### 1. 定期的なアクティビティ維持

```bash
#!/bin/bash
# keep-alive.sh
# アーカイブを防ぐための定期アクセス

GROUP_NAME="important-group"

# データベース一覧を取得
DATABASES=$(turso db list --group $GROUP_NAME | tail -n +2 | awk '{print $1}')

# 各データベースにアクセス
for db in $DATABASES; do
  echo "Keeping $db alive..."
  turso db shell $db "SELECT 1;" > /dev/null
done

echo "Keep-alive completed for $GROUP_NAME"
```

```bash
# cronで毎週実行（アーカイブを防ぐ）
# crontab -e
0 0 * * 0 /path/to/keep-alive.sh
```

### 2. アーカイブ前の通知

```bash
#!/bin/bash
# check-inactive-groups.sh

# グループの状態を確認
GROUPS=$(turso group list | tail -n +2 | awk '{print $1}')

for group in $GROUPS; do
  STATUS=$(turso group show $group --json | jq -r '.status')

  if [ "$STATUS" == "archived" ]; then
    echo "⚠ Warning: $group is archived"
    # 通知を送信（例：メール、Slack）
    # send-notification.sh "Group $group is archived"
  fi
done
```

### 3. 自動復元スクリプト

```bash
#!/bin/bash
# auto-unarchive.sh

GROUP_NAME=$1

# グループの状態を確認
STATUS=$(turso group show $GROUP_NAME --json | jq -r '.status')

if [ "$STATUS" == "archived" ]; then
  echo "Group $GROUP_NAME is archived. Unarchiving..."
  turso group unarchive $GROUP_NAME

  # 復元完了を待つ
  sleep 5

  # 接続テスト
  turso db shell $(turso db list --group $GROUP_NAME | tail -n +2 | head -1 | awk '{print $1}') "SELECT 1;"

  if [ $? -eq 0 ]; then
    echo "✓ Group $GROUP_NAME unarchived and ready"
  else
    echo "✗ Unarchive failed for $GROUP_NAME"
  fi
else
  echo "Group $GROUP_NAME is already active"
fi
```

### 4. 開発環境での活用

```bash
#!/bin/bash
# dev-environment-restore.sh

# 開発開始時にアーカイブされたグループを復元
DEV_GROUPS=("dev-frontend" "dev-backend" "dev-testing")

echo "Restoring development environment..."

for group in "${DEV_GROUPS[@]}"; do
  turso group unarchive $group 2>/dev/null || echo "$group already active"
done

echo "Development environment ready!"
```

## エラーハンドリング

### グループが見つからない

```bash
# エラー例
$ turso group unarchive nonexistent
Error: group "nonexistent" not found

# 解決策: グループ一覧を確認
turso group list
```

### 既にアクティブなグループ

```bash
# エラー例
$ turso group unarchive active-group
Error: group "active-group" is not archived

# 解決策: 既にアクティブな場合は何もする必要なし
turso group show active-group
```

### 権限不足

```bash
# エラー例
$ turso group unarchive shared-group
Error: insufficient permissions

# 解決策: グループのオーナーまたは管理者権限が必要
turso org members list
```

### Starterプラン以外でのエラー

```bash
# 有料プランではアーカイブが発生しない
$ turso group unarchive mygroup
Error: group is not archived (paid plan databases don't auto-archive)

# 有料プランでは10日間の非アクティブでもアーカイブされません
```

## プラン別の動作

### Starterプラン（無料）

- **自動アーカイブ**: あり（10日間非アクティブ後）
- **復元**: `unarchive`コマンドで即座に復元
- **コスト**: アーカイブ中は課金なし

```bash
# Starterプランでの典型的な使用
turso group unarchive hobby-project
```

### 有料プラン（Scaler, Pro, Enterprise）

- **自動アーカイブ**: なし
- **常時アクティブ**: 常にアクセス可能
- **コスト**: 常時課金（非アクティブでも）

```bash
# 有料プランではアーカイブされないため、このコマンドは不要
# データベースは常にアクティブ
```

## アーカイブを回避する方法

### 方法 1: 定期的なアクセス

```bash
#!/bin/bash
# scheduled-access.sh

# 週に1回アクセスしてアーカイブを防ぐ
turso db shell mydb "SELECT datetime('now');"
```

### 方法 2: ヘルスチェックの実装

```javascript
// Node.js example
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// 毎日実行
async function healthCheck() {
  try {
    await client.execute('SELECT 1');
    console.log('Database is active');
  } catch (error) {
    console.error('Database check failed:', error);
  }
}

// cronジョブまたはスケジューラーで実行
healthCheck();
```

### 方法 3: 有料プランへのアップグレード

```bash
# 常時アクティブが必要な場合
turso plan upgrade

# Scalerプランにアップグレード
turso plan select
# "Scaler"を選択
```

## 復元後の確認

```bash
# グループの状態を確認
turso group show my-group

# データベースへの接続テスト
turso db shell mydb "SELECT COUNT(*) FROM sqlite_master;"

# レプリカの状態確認
turso group locations my-group
```

## 自動化の例

### CI/CDでの自動復元

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Install Turso CLI
        run: |
          curl -sSfL https://get.tur.so/install.sh | bash

      - name: Unarchive database if needed
        run: |
          turso group unarchive production || echo "Already active"

      - name: Run migrations
        run: |
          npm run migrate

      - name: Deploy application
        run: |
          npm run deploy
```

### スクリプトでのエラーハンドリング

```bash
#!/bin/bash
# robust-unarchive.sh

GROUP_NAME=$1

# 引数チェック
if [ -z "$GROUP_NAME" ]; then
  echo "Usage: $0 <group-name>"
  exit 1
fi

# アーカイブ解除を試行
echo "Attempting to unarchive $GROUP_NAME..."

if turso group unarchive $GROUP_NAME; then
  echo "✓ Successfully unarchived $GROUP_NAME"
  exit 0
else
  # エラーの詳細を確認
  STATUS=$(turso group show $GROUP_NAME 2>&1)

  if echo "$STATUS" | grep -q "not found"; then
    echo "✗ Error: Group $GROUP_NAME does not exist"
    exit 1
  elif echo "$STATUS" | grep -q "not archived"; then
    echo "✓ Group $GROUP_NAME is already active"
    exit 0
  else
    echo "✗ Unknown error occurred"
    echo "$STATUS"
    exit 1
  fi
fi
```

## 関連コマンド

- `turso group show <group-name>` - グループの状態確認
- `turso group list` - グループ一覧の表示
- `turso db list --group <group-name>` - グループ内のデータベース一覧
- `turso plan show` - 現在のプラン確認
- `turso plan upgrade` - プランのアップグレード

## 参考リンク

- [Scale to Zero機能](../../features/scale-to-zero.md)
- [プランと価格](../../help/pricing.md)
- [グループの概要](../../features/groups.md)
- [データベース管理](../../features/databases.md)
- [CLI リファレンス](../README.md)
