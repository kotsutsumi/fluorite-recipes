# turso group tokens invalidate - グループトークンの無効化

グループに対して生成されたすべての認証トークンを無効化します。セキュリティ侵害時やトークンのローテーション時に使用します。

## 構文

```bash
turso group tokens invalidate <group-name> [flags]
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: トークンを無効化するグループの名前
- **形式**: 既存のグループ名

## フラグ

### -y, --yes
- **説明**: 確認プロンプトをスキップ
- **用途**: 自動化スクリプトでの使用
- **注意**: すべてのアクティブな接続が切断されます

## 使用例

### 基本的な使用方法

```bash
# 確認プロンプト付きでトークンを無効化
turso group tokens invalidate production

# 出力例:
# Warning: This will invalidate all tokens for group "production".
# All applications using these tokens will lose access.
# Are you sure? (y/N): y
# All tokens for group "production" have been invalidated.
```

### 確認なしで無効化

```bash
# 緊急時やスクリプトで使用
turso group tokens invalidate production --yes

# 複数のグループのトークンを無効化
turso group tokens invalidate staging --yes
turso group tokens invalidate development --yes
```

### 無効化後の再生成

```bash
# トークンを無効化
turso group tokens invalidate production --yes

# 新しいトークンを生成
NEW_TOKEN=$(turso group tokens create production --expiration 90d)

# 環境変数を更新
echo "TURSO_AUTH_TOKEN=$NEW_TOKEN" > .env.production
```

## 使用シナリオ

### 1. セキュリティ侵害への対応

```bash
#!/bin/bash
# security-breach-response.sh

GROUP_NAME="production"

echo "=== Security Breach Response ==="
echo "Step 1: Invalidating all tokens..."
turso group tokens invalidate $GROUP_NAME --yes

echo "Step 2: Generating new tokens..."
NEW_TOKEN=$(turso group tokens create $GROUP_NAME --expiration 90d)

echo "Step 3: Updating application..."
# アプリケーションの環境変数を更新
kubectl create secret generic turso-token \
  --from-literal=token=$NEW_TOKEN \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Step 4: Rolling out update..."
kubectl rollout restart deployment/app

echo "Security incident response completed."
```

### 2. 定期的なトークンローテーション

```bash
#!/bin/bash
# rotate-tokens.sh

GROUP_NAME=$1
EXPIRATION="90d"

echo "Starting token rotation for $GROUP_NAME..."

# 古いトークンを無効化
echo "Invalidating old tokens..."
turso group tokens invalidate $GROUP_NAME --yes

# 新しいトークンを生成
echo "Generating new token..."
NEW_TOKEN=$(turso group tokens create $GROUP_NAME --expiration $EXPIRATION)

# トークンを保存
echo "$NEW_TOKEN" > ~/.turso/tokens/$GROUP_NAME.token
chmod 600 ~/.turso/tokens/$GROUP_NAME.token

echo "Token rotation completed."
echo "New token saved to ~/.turso/tokens/$GROUP_NAME.token"
```

### 3. 従業員の退職時

```bash
#!/bin/bash
# offboarding.sh

EMPLOYEE_GROUPS=("dev-team" "staging-access")

echo "Starting offboarding process..."

for group in "${EMPLOYEE_GROUPS[@]}"; do
  echo "Revoking access to $group..."
  turso group tokens invalidate $group --yes

  # 新しいトークンを生成
  NEW_TOKEN=$(turso group tokens create $group)
  echo "New token for $group: $NEW_TOKEN"
done

echo "Offboarding completed. Distribute new tokens to remaining team members."
```

### 4. 環境のクリーンアップ

```bash
#!/bin/bash
# cleanup-temp-environments.sh

# 一時的な環境のトークンを無効化
TEMP_GROUPS=$(turso group list | grep "temp-" | awk '{print $1}')

for group in $TEMP_GROUPS; do
  echo "Invalidating tokens for $group..."
  turso group tokens invalidate $group --yes
done

echo "Temporary environment tokens invalidated."
```

## ベストプラクティス

### 1. ゼロダウンタイムのトークンローテーション

```bash
#!/bin/bash
# zero-downtime-rotation.sh

GROUP_NAME="production"

# ステップ1: 新しいトークンを生成
echo "Generating new token..."
NEW_TOKEN=$(turso group tokens create $GROUP_NAME --expiration 90d)

# ステップ2: 新しいトークンをデプロイ（古いトークンも有効）
echo "Deploying new token..."
kubectl set env deployment/app TURSO_AUTH_TOKEN=$NEW_TOKEN

# ステップ3: デプロイの完了を待つ
echo "Waiting for rollout to complete..."
kubectl rollout status deployment/app

# ステップ4: 古いトークンを無効化
echo "Invalidating old tokens..."
sleep 30  # 猶予期間
turso group tokens invalidate $GROUP_NAME --yes

echo "Zero-downtime rotation completed."
```

### 2. 緊急時の手順

```bash
#!/bin/bash
# emergency-lockdown.sh

CRITICAL_GROUPS=("production" "prod-eu" "prod-us")

echo "=== EMERGENCY LOCKDOWN ==="
echo "This will invalidate all tokens for critical groups."
read -p "Type 'CONFIRM' to proceed: " confirmation

if [ "$confirmation" != "CONFIRM" ]; then
  echo "Lockdown cancelled."
  exit 1
fi

# すべての本番グループのトークンを無効化
for group in "${CRITICAL_GROUPS[@]}"; do
  echo "Locking down $group..."
  turso group tokens invalidate $group --yes
done

echo "Emergency lockdown completed."
echo "Generate new tokens when ready to restore service."
```

### 3. 無効化前の通知

```bash
#!/bin/bash
# notify-and-invalidate.sh

GROUP_NAME=$1
NOTIFICATION_EMAIL="team@example.com"

# チームに通知
echo "Sending notification to team..."
echo "Token rotation scheduled for $GROUP_NAME in 1 hour" | \
  mail -s "Turso Token Rotation Notice" $NOTIFICATION_EMAIL

# 1時間待機
echo "Waiting 1 hour before invalidation..."
sleep 3600

# トークンを無効化
echo "Invalidating tokens for $GROUP_NAME..."
turso group tokens invalidate $GROUP_NAME --yes

# 新しいトークンを生成
NEW_TOKEN=$(turso group tokens create $GROUP_NAME --expiration 90d)

# 完了通知
echo "Token rotation completed. New token: $NEW_TOKEN" | \
  mail -s "Turso Token Rotation Completed" $NOTIFICATION_EMAIL
```

### 4. 監査ログの記録

```bash
#!/bin/bash
# audit-invalidate.sh

GROUP_NAME=$1
LOG_FILE="/var/log/turso-audit.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
USER=$(whoami)

# 無効化を実行
turso group tokens invalidate $GROUP_NAME --yes

# 監査ログに記録
echo "$TIMESTAMP - User: $USER - Action: token_invalidate - Group: $GROUP_NAME" >> $LOG_FILE

# Slackに通知
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"🔒 Tokens invalidated for group: $GROUP_NAME by $USER\"}"
```

## エラーハンドリング

### グループが見つからない

```bash
# エラー例
$ turso group tokens invalidate nonexistent
Error: group "nonexistent" not found

# 解決策
turso group list
turso group tokens invalidate correct-group-name
```

### 権限不足

```bash
# エラー例
$ turso group tokens invalidate shared-group
Error: insufficient permissions to invalidate tokens

# 解決策: グループのオーナーまたは管理者権限が必要
turso org members list
```

### トークンが既に無効化済み

```bash
# エラー例
$ turso group tokens invalidate mygroup --yes
Warning: No active tokens found for group "mygroup"

# これは通常問題ではありません
# 新しいトークンを生成できます
turso group tokens create mygroup
```

## 無効化の影響

### 即座に影響を受けるもの

1. **アクティブな接続**: 既存の接続は次のリクエスト時にエラー
2. **新しい接続**: 即座に拒否される
3. **すべてのクライアント**: 無効化されたトークンを使用するすべてのアプリケーション

### 影響を受けないもの

1. **データ**: データベースのデータは影響を受けません
2. **グループ設定**: グループの設定は変更されません
3. **他のグループ**: 他のグループのトークンは有効なまま

## トークンローテーションスケジュール

### 推奨スケジュール

```bash
#!/bin/bash
# scheduled-rotation.sh

# 本番環境: 90日ごと
# crontab: 0 0 1 */3 * /path/to/rotate-production.sh

GROUP_NAME="production"

# 現在のトークンの有効期限を確認（疑似コード）
# DAYS_UNTIL_EXPIRY=$(check_token_expiry $GROUP_NAME)

# 30日前に警告
# if [ $DAYS_UNTIL_EXPIRY -lt 30 ]; then
#   send_notification "Token rotation needed in $DAYS_UNTIL_EXPIRY days"
# fi

# ローテーション実行
turso group tokens invalidate $GROUP_NAME --yes
NEW_TOKEN=$(turso group tokens create $GROUP_NAME --expiration 90d)

# 新しいトークンをデプロイ
deploy_new_token $GROUP_NAME $NEW_TOKEN
```

### 環境別のローテーション戦略

```bash
# 開発環境: 無効化は手動のみ
# ステージング環境: 30日ごと
# 本番環境: 90日ごと、計画的なメンテナンスウィンドウで実行

#!/bin/bash
# environment-rotation.sh

case $ENVIRONMENT in
  development)
    echo "Development tokens: manual rotation only"
    ;;
  staging)
    echo "Rotating staging tokens (30-day cycle)..."
    turso group tokens invalidate staging --yes
    turso group tokens create staging --expiration 30d
    ;;
  production)
    echo "Rotating production tokens (90-day cycle)..."
    # 計画的なメンテナンスウィンドウで実行
    turso group tokens invalidate production --yes
    turso group tokens create production --expiration 90d
    ;;
esac
```

## 複数環境での管理

### すべての環境のトークンを無効化

```bash
#!/bin/bash
# invalidate-all-environments.sh

ENVIRONMENTS=("development" "staging" "production")

echo "This will invalidate tokens for all environments."
read -p "Are you absolutely sure? (type 'YES'): " confirm

if [ "$confirm" != "YES" ]; then
  echo "Operation cancelled."
  exit 1
fi

for env in "${ENVIRONMENTS[@]}"; do
  echo "Invalidating $env tokens..."
  turso group tokens invalidate $env --yes

  # 新しいトークンを生成
  NEW_TOKEN=$(turso group tokens create $env --expiration 90d)
  echo "$env new token: $NEW_TOKEN"
done

echo "All environment tokens have been rotated."
```

### 選択的な無効化

```bash
#!/bin/bash
# selective-invalidate.sh

echo "Select groups to invalidate tokens:"
GROUPS=$(turso group list | tail -n +2 | awk '{print $1}')

select group in $GROUPS "Cancel"; do
  if [ "$group" == "Cancel" ]; then
    echo "Operation cancelled."
    exit 0
  fi

  echo "Invalidating tokens for $group..."
  turso group tokens invalidate $group

  read -p "Generate new token? (y/n): " gen_new
  if [ "$gen_new" == "y" ]; then
    NEW_TOKEN=$(turso group tokens create $group)
    echo "New token: $NEW_TOKEN"
  fi

  read -p "Invalidate more groups? (y/n): " continue
  [ "$continue" != "y" ] && break
done
```

## セキュリティチェックリスト

無効化後に確認すべき項目：

```bash
#!/bin/bash
# post-invalidation-checklist.sh

GROUP_NAME=$1

echo "=== Post-Invalidation Security Checklist ==="

# 1. 新しいトークンが生成されているか
echo "1. Verify new token exists"
read -p "Has new token been generated? (y/n): " has_token

# 2. アプリケーションが更新されているか
echo "2. Verify application updated"
read -p "Has application been updated with new token? (y/n): " app_updated

# 3. すべてのサービスが動作しているか
echo "3. Check service health"
read -p "Are all services running correctly? (y/n): " services_ok

# 4. 監査ログが記録されているか
echo "4. Verify audit log"
read -p "Has invalidation been logged? (y/n): " logged

if [ "$has_token" == "y" ] && [ "$app_updated" == "y" ] && \
   [ "$services_ok" == "y" ] && [ "$logged" == "y" ]; then
  echo "✓ All checks passed"
else
  echo "✗ Some checks failed. Please review."
fi
```

## 関連コマンド

- `turso group tokens create <group-name>` - グループトークンの生成
- `turso db tokens invalidate <db-name>` - データベーストークンの無効化
- `turso group show <group-name>` - グループの詳細表示
- `turso org members list` - 組織メンバーの一覧

## 参考リンク

- [認証とトークン](../../features/authentication.md)
- [セキュリティベストプラクティス](../../help/security.md)
- [トークンローテーション](../../help/token-rotation.md)
- [グループの概要](../../features/groups.md)
- [CLI リファレンス](../README.md)
