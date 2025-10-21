# turso group destroy - グループの削除

データベースグループとそれに関連するすべてのデータベースを完全に削除します。この操作は取り消すことができません。

## 構文

```bash
turso group destroy <group-name> [flags]
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: 削除するグループの名前
- **形式**: 既存のグループ名

## フラグ

### -y, --yes
- **説明**: 削除の確認プロンプトをスキップ
- **用途**: 自動化スクリプトでの使用
- **注意**: データ損失のリスクがあるため慎重に使用

## 使用例

### 基本的な使用方法

```bash
# 確認プロンプト付きで削除
turso group destroy old-group

# 出力例:
# Warning: This will permanently delete the group "old-group" and all its databases.
# Are you sure? (y/N): y
# Group "old-group" has been deleted.
```

### 確認なしで削除

```bash
# 自動化スクリプト用
turso group destroy old-group --yes

# 複数のグループを削除
turso group destroy test-group-1 --yes
turso group destroy test-group-2 --yes
turso group destroy test-group-3 --yes
```

### 削除前の確認

```bash
# グループの詳細を確認
turso group show staging

# グループ内のデータベースを確認
turso db list --group staging

# 確認後に削除
turso group destroy staging
```

## 削除される内容

グループを削除すると、以下が完全に削除されます：

1. **グループ自体**: グループの設定とメタデータ
2. **すべてのデータベース**: グループ内のすべてのデータベース
3. **すべてのレプリカ**: 全リージョンのレプリカデータ
4. **データベーストークン**: グループに関連するすべてのトークン
5. **バックアップ**: 自動バックアップと手動バックアップ

## ベストプラクティス

### 1. 削除前のバックアップ

```bash
# 重要なデータベースをバックアップ
# データをエクスポート
turso db shell mydb ".dump" > backup.sql

# または、別のグループに移行
turso db create backup-db --group backup-group
```

### 2. 段階的な削除

```bash
# まず個別のデータベースを削除して確認
turso db destroy test-db --group old-group --yes

# 問題なければグループを削除
turso group destroy old-group --yes
```

### 3. 削除前のチェックリスト

```bash
#!/bin/bash
# pre-destroy-checklist.sh

GROUP_NAME="old-group"

echo "=== Deletion Checklist for $GROUP_NAME ==="

# 1. グループの詳細を表示
echo "1. Group details:"
turso group show $GROUP_NAME

# 2. データベース一覧を表示
echo "2. Databases in group:"
turso db list --group $GROUP_NAME

# 3. 削除の確認
read -p "Proceed with deletion? (yes/no): " confirm
if [ "$confirm" == "yes" ]; then
  turso group destroy $GROUP_NAME --yes
  echo "Group deleted."
else
  echo "Deletion cancelled."
fi
```

### 4. 本番環境の保護

```bash
#!/bin/bash
# safe-destroy.sh

GROUP_NAME=$1
PROTECTED_GROUPS=("production" "prod" "main")

# 保護されたグループかチェック
if [[ " ${PROTECTED_GROUPS[@]} " =~ " ${GROUP_NAME} " ]]; then
  echo "Error: Cannot delete protected group '$GROUP_NAME'"
  exit 1
fi

# 削除実行
turso group destroy $GROUP_NAME
```

## エラーハンドリング

### グループが見つからない

```bash
# エラー例
$ turso group destroy nonexistent
Error: group "nonexistent" not found

# 解決策: グループ一覧を確認
turso group list
```

### デフォルトグループの削除

```bash
# エラー例
$ turso group destroy default
Error: cannot delete default group

# 解決策: デフォルトグループは削除できません
# 代わりに個別のデータベースを削除
turso db list --group default
turso db destroy <db-name>
```

### アクティブなデータベースが存在

```bash
# エラー例（一部の実装）
$ turso group destroy mygroup
Error: group contains active databases

# 解決策: まずデータベースを削除
turso db list --group mygroup
turso db destroy db1 --yes
turso db destroy db2 --yes
turso group destroy mygroup --yes
```

### 権限不足

```bash
# エラー例
$ turso group destroy shared-group
Error: insufficient permissions to delete group

# 解決策: グループのオーナーまたは管理者権限が必要
# オーナーに削除を依頼するか、権限を確認
turso org members list
```

## 削除の取り消し

**重要**: グループの削除は完全に不可逆的です。削除後のデータ復旧はできません。

```bash
# ❌ 削除後のデータ復旧は不可能
$ turso group destroy mygroup --yes
# データは完全に失われます

# ✅ 代替案: 削除前にアーカイブ
# 1. データをエクスポート
# 2. 新しいグループに移行
# 3. 古いグループを削除
```

## 自動化の例

### クリーンアップスクリプト

```bash
#!/bin/bash
# cleanup-old-groups.sh

# 古いテストグループを削除
OLD_GROUPS=$(turso group list | grep "test-" | awk '{print $1}')

for group in $OLD_GROUPS; do
  echo "Deleting group: $group"
  turso group destroy $group --yes

  if [ $? -eq 0 ]; then
    echo "✓ Deleted: $group"
  else
    echo "✗ Failed to delete: $group"
  fi
done

echo "Cleanup completed."
```

### CI/CDでの環境クリーンアップ

```bash
#!/bin/bash
# ci-cleanup.sh

BRANCH_NAME=$1
GROUP_NAME="ci-${BRANCH_NAME}"

echo "Cleaning up CI environment for branch: $BRANCH_NAME"

# CIグループが存在するか確認
if turso group show $GROUP_NAME &> /dev/null; then
  echo "Deleting group: $GROUP_NAME"
  turso group destroy $GROUP_NAME --yes
  echo "✓ Cleanup completed"
else
  echo "Group $GROUP_NAME does not exist, skipping"
fi
```

### 期限切れグループの削除

```bash
#!/bin/bash
# delete-expired-groups.sh

EXPIRY_DAYS=30

# 30日以上前に作成されたグループを削除
# (実際の実装は、グループ作成日時の取得方法に依存)

echo "Finding groups older than $EXPIRY_DAYS days..."

# 例: タグやメタデータでフィルタリング
EXPIRED_GROUPS=$(turso group list | grep "temp-" | awk '{print $1}')

for group in $EXPIRED_GROUPS; do
  read -p "Delete $group? (y/n): " confirm
  if [ "$confirm" == "y" ]; then
    turso group destroy $group --yes
    echo "✓ Deleted: $group"
  fi
done
```

## 安全な削除フロー

### 推奨手順

1. **事前確認**
   ```bash
   turso group show mygroup
   turso db list --group mygroup
   ```

2. **バックアップ作成**
   ```bash
   # データをエクスポート
   turso db shell mydb ".dump" > backup-$(date +%Y%m%d).sql
   ```

3. **関係者への通知**
   - チームメンバーに削除予定を連絡
   - 依存するアプリケーションがないか確認

4. **削除実行**
   ```bash
   turso group destroy mygroup
   ```

5. **削除確認**
   ```bash
   turso group list
   # 削除されたグループが表示されないことを確認
   ```

## 関連コマンド

- `turso group list` - グループ一覧の表示
- `turso group show <group-name>` - グループの詳細表示
- `turso group create <group-name>` - グループの作成
- `turso db list --group <group-name>` - グループ内のデータベース一覧
- `turso db destroy <db-name>` - 個別のデータベース削除

## 参考リンク

- [グループの概要](../../features/groups.md)
- [データベース管理](../../features/databases.md)
- [バックアップとリストア](../../features/backups.md)
- [CLI リファレンス](../README.md)
