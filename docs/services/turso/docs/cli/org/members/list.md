# turso org members list - メンバー一覧の表示

現在アクティブな組織のすべてのメンバーを表示します。

## 構文

```bash
turso org members list
```

## パラメータ

このコマンドにパラメータはありません。

## 前提条件

- アクティブな組織が選択されている必要があります
- 組織が選択されていない場合は、先に `turso org switch` を実行してください

## 出力形式

```
USERNAME      ROLE       EMAIL
alice         owner      alice@example.com
bob           admin      bob@example.com
charlie       member     charlie@example.com
```

## 使用例

### 基本的な使用方法

```bash
# 現在の組織のメンバー一覧を表示
turso org members list

# 出力例:
# USERNAME      ROLE       EMAIL
# alice         owner      alice@example.com
# bob           admin      bob@example.com
# charlie       member     charlie@example.com
```

### 特定の組織のメンバー確認

```bash
# 組織を切り替え
turso org switch my-company

# メンバー一覧を表示
turso org members list
```

### メンバー数を数える

```bash
# メンバー数を取得
turso org members list | tail -n +2 | wc -l

# 出力例: 5
```

### 管理者のみを表示

```bash
# 管理者とオーナーのみをフィルタリング
turso org members list | grep -E "admin|owner"

# 出力例:
# alice         owner      alice@example.com
# bob           admin      bob@example.com
```

## ロールの説明

### Owner（オーナー）
- 組織の作成者または譲渡された所有者
- すべての権限を持つ
- 組織の削除が可能
- 通常、組織に1人のみ

### Admin（管理者）
- メンバー管理が可能
- リソースの作成・削除が可能
- 課金情報の閲覧が可能

### Member（メンバー）
- リソースの表示・使用が可能
- データベースの作成・削除が可能
- 組織設定の変更は不可

## ベストプラクティス

### 1. 定期的な監査

```bash
#!/bin/bash
# audit-members.sh

echo "=== Organization Members Audit ==="
echo "Date: $(date)"
echo "Organization: $(turso org list | grep '^*' | awk '{print $2}')"
echo ""

turso org members list

echo ""
echo "Total members: $(turso org members list | tail -n +2 | wc -l)"
echo "Admins: $(turso org members list | grep -c admin)"
echo "Regular members: $(turso org members list | grep -c member)"
```

### 2. 全組織のメンバー確認

```bash
#!/bin/bash
# check-all-org-members.sh

ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  echo "=== $org ==="
  turso org switch $org > /dev/null 2>&1
  turso org members list
  echo ""
done
```

## エラーハンドリング

### 組織が選択されていない

```bash
# エラー例
$ turso org members list
Error: no active organization. Use 'org switch' first

# 解決策
turso org list
turso org switch my-org
turso org members list
```

### 権限不足

```bash
# エラー例
$ turso org members list
Error: insufficient permissions

# メンバー一覧の表示には最低限のメンバー権限が必要
```

## 自動化の例

### CSVエクスポート

```bash
#!/bin/bash
# export-members-csv.sh

ORG=$(turso org list | grep '^*' | awk '{print $2}')
OUTPUT="members-$ORG-$(date +%Y%m%d).csv"

# ヘッダー
echo "Organization,Username,Role,Email" > $OUTPUT

# メンバー情報を追加
turso org members list | tail -n +2 | while read username role email; do
  echo "$ORG,$username,$role,$email" >> $OUTPUT
done

echo "Exported to: $OUTPUT"
```

### Slack通知

```bash
#!/bin/bash
# notify-new-members.sh

CACHE_FILE="$HOME/.turso/members-cache.txt"
CURRENT=$(turso org members list | tail -n +2 | sort)

if [ -f "$CACHE_FILE" ]; then
  PREVIOUS=$(cat "$CACHE_FILE")
  NEW_MEMBERS=$(comm -13 <(echo "$PREVIOUS") <(echo "$CURRENT"))

  if [ -n "$NEW_MEMBERS" ]; then
    echo "New members detected:"
    echo "$NEW_MEMBERS"

    # Slack通知を送信
    # curl -X POST $SLACK_WEBHOOK_URL -d "{\"text\":\"New member: $NEW_MEMBERS\"}"
  fi
fi

echo "$CURRENT" > "$CACHE_FILE"
```

## 関連コマンド

- `turso org members add <username>` - メンバーの追加
- `turso org members invite <email>` - メンバーの招待
- `turso org members remove <username>` - メンバーの削除
- `turso org switch <org-name>` - 組織の切り替え

## 参考リンク

- [組織管理](../../features/organizations.md)
- [アクセス制御](../../features/access-control.md)
- [チーム協業](../../help/team-collaboration.md)
- [CLI リファレンス](../README.md)
