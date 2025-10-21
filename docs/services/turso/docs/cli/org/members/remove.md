# turso org members remove - メンバーの削除

組織からメンバーを削除します。削除されたメンバーは組織のリソースにアクセスできなくなります。

## 構文

```bash
turso org members remove <username>
```

## パラメータ

### username
- **必須**: はい
- **説明**: 削除するメンバーのユーザー名
- **形式**: 組織に所属するメンバーのユーザー名

## 権限要件

- オーナーまたは管理者権限が必要
- オーナーは削除できません

## 使用例

### 基本的な使用方法

```bash
# メンバーを削除
turso org members remove bob

# 出力例:
# Member "bob" has been removed from the organization.
```

### 削除前の確認

```bash
# メンバー一覧を確認
turso org members list

# 特定のメンバーを削除
turso org members remove inactive-user

# 削除後の確認
turso org members list
```

### 複数メンバーの削除

```bash
#!/bin/bash
# remove-multiple-members.sh

MEMBERS_TO_REMOVE=("user1" "user2" "user3")

for member in "${MEMBERS_TO_REMOVE[@]}"; do
  echo "Removing $member..."
  turso org members remove $member
done

echo "All specified members removed."
```

## 削除の影響

### メンバーへの影響
- 組織のすべてのリソースへのアクセスが失われます
- 個人アカウントは影響を受けません
- 個人のデータベースは削除されません

### 組織への影響
- メンバー数が減少します
- 削除されたメンバーが作成したリソースは保持されます
- アクセス権限のみが削除されます

## ベストプラクティス

### 1. オフボーディングチェックリスト

```bash
#!/bin/bash
# offboarding.sh

USERNAME=$1

if [ -z "$USERNAME" ]; then
  echo "Usage: $0 <username>"
  exit 1
fi

echo "=== Offboarding Checklist for $USERNAME ==="

# 1. メンバーの確認
echo "1. Current member details:"
turso org members list | grep "$USERNAME"

# 2. メンバーの削除
read -p "Remove this member? (y/n): " confirm
if [ "$confirm" == "y" ]; then
  turso org members remove $USERNAME
  echo "✓ Member removed"
else
  echo "✗ Removal cancelled"
  exit 0
fi

# 3. トークンのローテーション（推奨）
echo "3. Consider rotating tokens for security"
read -p "Rotate group tokens? (y/n): " rotate
if [ "$rotate" == "y" ]; then
  GROUPS=$(turso group list | tail -n +2 | awk '{print $1}')
  for group in $GROUPS; do
    turso group tokens invalidate $group --yes
    turso group tokens create $group
  done
  echo "✓ Tokens rotated"
fi

echo "Offboarding completed."
```

### 2. 非アクティブメンバーの削除

```bash
#!/bin/bash
# remove-inactive-members.sh

# 非アクティブなメンバーのリスト（手動で作成）
INACTIVE_MEMBERS=("old-user1" "old-user2")

echo "=== Removing Inactive Members ==="

for member in "${INACTIVE_MEMBERS[@]}"; do
  # メンバーが存在するか確認
  if turso org members list | grep -q "$member"; then
    echo "Removing $member..."
    turso org members remove $member
  else
    echo "$member not found in organization"
  fi
done
```

### 3. セキュリティインシデント対応

```bash
#!/bin/bash
# security-incident-response.sh

COMPROMISED_USER=$1

echo "=== Security Incident Response ==="
echo "Compromised user: $COMPROMISED_USER"

# 1. ユーザーを即座に削除
echo "1. Removing user..."
turso org members remove $COMPROMISED_USER

# 2. すべてのトークンを無効化
echo "2. Invalidating all tokens..."
GROUPS=$(turso group list | tail -n +2 | awk '{print $1}')
for group in $GROUPS; do
  turso group tokens invalidate $group --yes
done

# 3. 新しいトークンを生成
echo "3. Generating new tokens..."
for group in $GROUPS; do
  NEW_TOKEN=$(turso group tokens create $group --expiration 90d)
  echo "New token for $group: $NEW_TOKEN"
done

echo "✓ Security incident response completed"
```

## エラーハンドリング

### メンバーが見つからない

```bash
# エラー例
$ turso org members remove nonexistent
Error: member "nonexistent" not found

# 解決策: メンバー一覧を確認
turso org members list
turso org members remove correct-username
```

### オーナーの削除

```bash
# エラー例
$ turso org members remove owner-username
Error: cannot remove organization owner

# オーナーは削除できません
# 必要に応じてオーナーシップを譲渡してから削除
```

### 権限不足

```bash
# エラー例
$ turso org members remove someone
Error: insufficient permissions

# 解決策: 管理者またはオーナー権限が必要
turso org members list  # 自分の権限を確認
```

### 自分自身の削除

```bash
# エラー例
$ turso org members remove $(turso auth whoami)
Error: cannot remove yourself from the organization

# 自分自身を削除することはできません
```

## 削除後の確認

```bash
#!/bin/bash
# verify-removal.sh

USERNAME=$1

# メンバー一覧から削除されたか確認
if turso org members list | grep -q "$USERNAME"; then
  echo "✗ $USERNAME is still a member"
  exit 1
else
  echo "✓ $USERNAME has been removed"
  exit 0
fi
```

## セキュリティ考慮事項

### トークンのローテーション

メンバーを削除した後、セキュリティのベストプラクティスとして：

```bash
# グループトークンを無効化
turso group tokens invalidate production --yes

# 新しいトークンを生成
turso group tokens create production --expiration 90d
```

### アクセスログの確認

削除前に、メンバーのアクセス履歴を確認することを推奨（可能な場合）：

```bash
# 課金ポータルでアクセスログを確認
turso org billing
```

## 監査ログ

```bash
#!/bin/bash
# log-member-removal.sh

USERNAME=$1
LOG_FILE="/var/log/turso-audit.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
ACTOR=$(turso auth whoami)
ORG=$(turso org list | grep '^*' | awk '{print $2}')

# メンバーを削除
turso org members remove $USERNAME

# 監査ログに記録
echo "$TIMESTAMP - Org: $ORG - Actor: $ACTOR - Action: member_remove - Target: $USERNAME" >> $LOG_FILE

echo "Member removed and logged"
```

## revoke vs remove の違い

### remove コマンド
- **対象**: 既存のメンバー（承認済み）
- **効果**: 組織からメンバーを削除

### revoke コマンド
- **対象**: 保留中の招待
- **効果**: まだ承認されていない招待を取り消し

## 関連コマンド

- `turso org members add <username>` - メンバーの追加
- `turso org members list` - メンバー一覧の表示
- `turso org members revoke <email>` - 招待の取り消し
- `turso group tokens invalidate <group>` - トークンの無効化

## 参考リンク

- [組織管理](../../features/organizations.md)
- [アクセス制御](../../features/access-control.md)
- [セキュリティベストプラクティス](../../help/security.md)
- [CLI リファレンス](../README.md)
