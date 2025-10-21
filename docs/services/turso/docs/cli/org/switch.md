# turso org switch - 組織の切り替え

CLI操作の対象となるアクティブな組織を切り替えます。

## 構文

```bash
turso org switch <organization-slug>
```

## パラメータ

### organization-slug
- **必須**: はい
- **説明**: 切り替え先の組織のスラッグ
- **形式**: 組織識別子（英数字とハイフン）

## 使用例

### 基本的な使用方法

```bash
# 組織を切り替え
turso org switch my-company

# 出力例:
# Switched to organization "my-company"
```

### 個人アカウントへの切り替え

```bash
# 個人アカウントに戻る
turso org switch personal

# または自分のユーザー名
turso org switch username
```

### 複数の組織間で切り替え

```bash
# 会社の組織に切り替え
turso org switch company-org

# グループを確認
turso group list

# クライアントの組織に切り替え
turso org switch client-org

# グループを確認
turso group list
```

## 組織コンテキスト

組織を切り替えると、以下のコマンドの対象が変更されます：

```bash
# 組織Aに切り替え
turso org switch organization-a

# この組織のリソースを操作
turso group list        # organization-aのグループ
turso db list           # organization-aのデータベース
turso org members list  # organization-aのメンバー

# 組織Bに切り替え
turso org switch organization-b

# この組織のリソースを操作
turso group list        # organization-bのグループ
turso db list           # organization-bのデータベース
```

## ベストプラクティス

### 1. 現在の組織を確認

```bash
#!/bin/bash
# check-current-org.sh

# 現在の組織を表示
CURRENT_ORG=$(turso org list | grep "^*" | awk '{print $2}')
echo "Current organization: $CURRENT_ORG"

# または、すべての組織を表示（現在の組織は*マーク付き）
turso org list
```

### 2. 安全な組織切り替え

```bash
#!/bin/bash
# safe-switch.sh

TARGET_ORG=$1

# 利用可能な組織を確認
echo "Available organizations:"
turso org list

# 組織が存在するか確認
if turso org list | grep -q "$TARGET_ORG"; then
  echo "Switching to $TARGET_ORG..."
  turso org switch $TARGET_ORG

  # 切り替えを確認
  turso group list
else
  echo "Error: Organization $TARGET_ORG not found"
  exit 1
fi
```

### 3. スクリプトでの組織管理

```bash
#!/bin/bash
# multi-org-operations.sh

ORGS=("company-a" "company-b" "company-c")

for org in "${ORGS[@]}"; do
  echo "=== Processing $org ==="

  # 組織を切り替え
  turso org switch $org

  # 各組織でグループ一覧を表示
  echo "Groups in $org:"
  turso group list

  # 各組織でデータベース一覧を表示
  echo "Databases in $org:"
  turso db list

  echo ""
done

# 元の組織に戻る
turso org switch personal
```

### 4. 環境変数での管理

```bash
#!/bin/bash
# set-org-context.sh

# 環境別の組織を定義
case $ENVIRONMENT in
  development)
    ORG="dev-organization"
    ;;
  staging)
    ORG="staging-organization"
    ;;
  production)
    ORG="prod-organization"
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

# 組織を切り替え
echo "Setting organization context to $ORG..."
turso org switch $ORG

# 確認
echo "Current organization:"
turso org list | grep "^*"
```

## エラーハンドリング

### 組織が見つからない

```bash
# エラー例
$ turso org switch nonexistent-org
Error: organization "nonexistent-org" not found

# 解決策: 利用可能な組織を確認
turso org list
turso org switch correct-org-slug
```

### アクセス権限がない

```bash
# エラー例
$ turso org switch restricted-org
Error: you are not a member of organization "restricted-org"

# 解決策: 組織へのアクセスをリクエスト
# 組織の管理者に連絡して、メンバーとして追加してもらう
```

### スラッグの形式エラー

```bash
# エラー例
$ turso org switch "My Company"  # スペースを含む
Error: invalid organization slug

# 解決策: スラッグを使用（スペースなし）
turso org list  # 正しいスラッグを確認
turso org switch my-company
```

## 使用シナリオ

### シナリオ 1: 複数のクライアントプロジェクト管理

```bash
#!/bin/bash
# client-project-manager.sh

# クライアントAのプロジェクト作業
echo "Working on Client A project..."
turso org switch client-a-org
turso db create client-a-api --group production
turso db shell client-a-api

# クライアントBのプロジェクト作業
echo "Working on Client B project..."
turso org switch client-b-org
turso db create client-b-api --group production
turso db shell client-b-api

# 個人プロジェクトに戻る
echo "Back to personal projects..."
turso org switch personal
```

### シナリオ 2: 開発と本番の分離

```bash
#!/bin/bash
# dev-prod-workflow.sh

# 開発組織で新機能をテスト
echo "Testing in development..."
turso org switch dev-company
turso db create feature-test --group development
# テストを実行

# 本番組織でデプロイ
echo "Deploying to production..."
turso org switch prod-company
turso db create feature-prod --group production
# デプロイを実行
```

### シナリオ 3: チーム間の協業

```bash
#!/bin/bash
# team-collaboration.sh

TEAMS=("frontend-team" "backend-team" "data-team")

echo "Checking resources across teams..."

for team in "${TEAMS[@]}"; do
  turso org switch $team

  echo "=== $team ==="
  echo "Groups:"
  turso group list

  echo "Recent databases:"
  turso db list | head -5

  echo ""
done
```

## 組織の確認方法

### 方法 1: 組織一覧から確認

```bash
# すべての組織を表示（現在の組織は*マーク）
turso org list

# 出力例:
#   personal
# * company-org
#   client-org
```

### 方法 2: スクリプトで取得

```bash
#!/bin/bash
# get-current-org.sh

CURRENT_ORG=$(turso org list | grep "^*" | awk '{print $2}')

if [ -z "$CURRENT_ORG" ]; then
  echo "No organization selected"
  exit 1
else
  echo "Current organization: $CURRENT_ORG"
fi
```

### 方法 3: プロンプトに表示

```bash
# .bashrc または .zshrc に追加
function turso_prompt() {
  TURSO_ORG=$(turso org list 2>/dev/null | grep "^*" | awk '{print $2}')
  if [ -n "$TURSO_ORG" ]; then
    echo " [turso:$TURSO_ORG]"
  fi
}

# PS1に追加
PS1='$(turso_prompt)'$PS1
```

## 自動化の例

### CI/CDでの組織切り替え

```yaml
# .github/workflows/deploy.yml
name: Deploy to Multiple Organizations

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        org: [dev-org, staging-org, prod-org]

    steps:
      - uses: actions/checkout@v3

      - name: Install Turso CLI
        run: curl -sSfL https://get.tur.so/install.sh | bash

      - name: Authenticate
        run: turso auth login --token ${{ secrets.TURSO_TOKEN }}

      - name: Switch to organization
        run: turso org switch ${{ matrix.org }}

      - name: Deploy databases
        run: |
          turso db create api --group production
          turso db shell api < schema.sql
```

### 組織ごとのバックアップ

```bash
#!/bin/bash
# backup-all-organizations.sh

BACKUP_DIR="./backups/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# すべての組織を取得
ORGS=$(turso org list | grep -v "^*" | awk '{print $1}')

for org in $ORGS; do
  echo "Backing up $org..."

  # 組織を切り替え
  turso org switch $org

  # 組織のディレクトリを作成
  ORG_DIR="$BACKUP_DIR/$org"
  mkdir -p "$ORG_DIR"

  # すべてのデータベースをバックアップ
  DATABASES=$(turso db list | tail -n +2 | awk '{print $1}')

  for db in $DATABASES; do
    echo "  Backing up $db..."
    turso db shell $db ".dump" > "$ORG_DIR/$db.sql"
  done
done

echo "Backup completed: $BACKUP_DIR"
```

### インタラクティブな組織セレクター

```bash
#!/bin/bash
# select-organization.sh

echo "Select an organization:"

# 組織一覧を取得
ORGS=$(turso org list | awk '{print $NF}')

select org in $ORGS "Quit"; do
  if [ "$org" == "Quit" ]; then
    echo "Cancelled"
    exit 0
  fi

  if [ -n "$org" ]; then
    echo "Switching to $org..."
    turso org switch $org

    # 組織のサマリーを表示
    echo ""
    echo "=== $org Summary ==="
    echo "Groups:"
    turso group list
    echo ""
    echo "Recent databases:"
    turso db list | head -5

    break
  fi
done
```

## 切り替え後の確認

```bash
#!/bin/bash
# verify-switch.sh

TARGET_ORG=$1

# 組織を切り替え
turso org switch $TARGET_ORG

# 切り替えが成功したか確認
CURRENT=$(turso org list | grep "^*" | awk '{print $2}')

if [ "$CURRENT" == "$TARGET_ORG" ]; then
  echo "✓ Successfully switched to $TARGET_ORG"

  # 組織の情報を表示
  echo ""
  echo "Organization: $TARGET_ORG"
  echo "Groups: $(turso group list | tail -n +2 | wc -l)"
  echo "Databases: $(turso db list | tail -n +2 | wc -l)"
else
  echo "✗ Failed to switch to $TARGET_ORG"
  echo "Current organization: $CURRENT"
  exit 1
fi
```

## トラブルシューティング

### 組織が表示されない

```bash
# 認証を確認
turso auth whoami

# 再ログイン
turso auth login

# 組織一覧を再取得
turso org list
```

### 切り替えが反映されない

```bash
# CLIのキャッシュをクリア（必要に応じて）
rm -rf ~/.turso/cache

# 組織を再度切り替え
turso org switch my-org

# 確認
turso org list
```

## 関連コマンド

- `turso org list` - 組織一覧の表示
- `turso org create <name>` - 新しい組織の作成
- `turso org members list` - 組織メンバーの一覧
- `turso group list` - グループ一覧の表示（現在の組織）
- `turso db list` - データベース一覧の表示（現在の組織）

## 参考リンク

- [組織管理の概要](../../features/organizations.md)
- [マルチテナント運用](../../help/multi-tenant.md)
- [アクセス制御](../../features/access-control.md)
- [CLI リファレンス](../README.md)
