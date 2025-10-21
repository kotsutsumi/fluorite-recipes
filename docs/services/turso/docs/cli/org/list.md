# turso org list - 組織一覧の表示

自分がオーナーまたはメンバーとして所属するすべての組織を表示します。

## 構文

```bash
turso org list
```

## パラメータ

このコマンドにパラメータはありません。

## 出力形式

```
  personal
* company-org
  client-org-1
  client-org-2
```

- **`*`マーク**: 現在アクティブな組織
- **組織スラッグ**: 各行に1つの組織名

## 使用例

### 基本的な使用方法

```bash
# 組織一覧を表示
turso org list

# 出力例:
#   username (personal)
# * my-company
#   client-project
#   open-source-org
```

### 現在の組織を確認

```bash
# アクティブな組織（*マーク付き）を確認
turso org list | grep "^*"

# 出力例:
# * my-company
```

### 組織数を数える

```bash
# 所属する組織の総数
turso org list | wc -l

# 出力例: 4
```

## 組織の種類

### 個人アカウント
```bash
# 個人アカウントは常に存在
turso org list
# personal または username が表示される
```

### 組織アカウント
```bash
# 作成した組織またはメンバーとして招待された組織
turso org list
# company-org, team-org など
```

## ベストプラクティス

### 1. スクリプトで組織を取得

```bash
#!/bin/bash
# get-organizations.sh

# すべての組織を配列に格納
ORGS=($(turso org list | awk '{print $NF}'))

echo "You belong to ${#ORGS[@]} organizations:"
for org in "${ORGS[@]}"; do
  echo "  - $org"
done
```

### 2. 現在の組織を取得

```bash
#!/bin/bash
# current-org.sh

# アクティブな組織を取得
CURRENT_ORG=$(turso org list | grep "^*" | awk '{print $2}')

if [ -z "$CURRENT_ORG" ]; then
  echo "No active organization"
else
  echo "Current organization: $CURRENT_ORG"
fi
```

### 3. 組織の詳細情報を表示

```bash
#!/bin/bash
# org-summary.sh

echo "=== Organization Summary ==="

ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  # 組織に切り替え
  turso org switch $org > /dev/null 2>&1

  # 情報を収集
  GROUPS=$(turso group list 2>/dev/null | tail -n +2 | wc -l)
  DBS=$(turso db list 2>/dev/null | tail -n +2 | wc -l)
  MEMBERS=$(turso org members list 2>/dev/null | tail -n +2 | wc -l)

  # 表示
  echo ""
  echo "Organization: $org"
  echo "  Groups: $GROUPS"
  echo "  Databases: $DBS"
  echo "  Members: $MEMBERS"
done
```

### 4. 組織をフィルタリング

```bash
#!/bin/bash
# filter-organizations.sh

# 特定のパターンに一致する組織を検索
PATTERN=$1

if [ -z "$PATTERN" ]; then
  echo "Usage: $0 <pattern>"
  exit 1
fi

echo "Organizations matching '$PATTERN':"
turso org list | grep "$PATTERN"
```

## 使用シナリオ

### シナリオ 1: 組織のインベントリ

```bash
#!/bin/bash
# org-inventory.sh

echo "=== Organization Inventory ==="
echo "Date: $(date)"
echo ""

# すべての組織をリスト
turso org list

# 各組織の詳細
ORGS=$(turso org list | awk '{print $NF}')

echo ""
echo "=== Details ==="

for org in $ORGS; do
  turso org switch $org > /dev/null 2>&1

  echo ""
  echo "[$org]"
  echo "Groups: $(turso group list | tail -n +2 | wc -l)"
  echo "Databases: $(turso db list | tail -n +2 | wc -l)"
done
```

### シナリオ 2: 組織の選択メニュー

```bash
#!/bin/bash
# select-org-menu.sh

echo "Select an organization:"
echo ""

# 組織一覧を番号付きで表示
i=1
ORGS=($(turso org list | awk '{print $NF}'))

for org in "${ORGS[@]}"; do
  CURRENT=$(turso org list | grep "^*" | awk '{print $2}')
  if [ "$org" == "$CURRENT" ]; then
    echo "  $i) $org (current)"
  else
    echo "  $i) $org"
  fi
  ((i++))
done

echo ""
read -p "Enter number: " choice

# 選択された組織に切り替え
if [ "$choice" -ge 1 ] && [ "$choice" -le "${#ORGS[@]}" ]; then
  SELECTED=${ORGS[$((choice-1))]}
  turso org switch $SELECTED
  echo "Switched to: $SELECTED"
else
  echo "Invalid selection"
fi
```

### シナリオ 3: 組織の監査

```bash
#!/bin/bash
# audit-organizations.sh

OUTPUT_FILE="org-audit-$(date +%Y%m%d).txt"

echo "Turso Organization Audit" > $OUTPUT_FILE
echo "Date: $(date)" >> $OUTPUT_FILE
echo "User: $(turso auth whoami)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  echo "=== $org ===" >> $OUTPUT_FILE

  turso org switch $org > /dev/null 2>&1

  echo "Groups:" >> $OUTPUT_FILE
  turso group list >> $OUTPUT_FILE

  echo "" >> $OUTPUT_FILE
  echo "Databases:" >> $OUTPUT_FILE
  turso db list >> $OUTPUT_FILE

  echo "" >> $OUTPUT_FILE
  echo "Members:" >> $OUTPUT_FILE
  turso org members list >> $OUTPUT_FILE 2>&1

  echo "" >> $OUTPUT_FILE
done

echo "Audit report saved to: $OUTPUT_FILE"
```

## 出力のパース

### JSON形式での取得（手動パース）

```bash
#!/bin/bash
# org-list-json.sh

# 組織一覧をJSON形式に変換
echo "["

FIRST=true
while read -r line; do
  # *マークを除去
  ORG=$(echo "$line" | sed 's/^\* //' | awk '{print $1}')
  IS_CURRENT=$(echo "$line" | grep -q "^*" && echo "true" || echo "false")

  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    echo ","
  fi

  echo "  {"
  echo "    \"name\": \"$ORG\","
  echo "    \"current\": $IS_CURRENT"
  echo -n "  }"
done < <(turso org list)

echo ""
echo "]"
```

### CSVフ形式での出力

```bash
#!/bin/bash
# org-list-csv.sh

echo "Organization,Current,Groups,Databases,Members"

ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  IS_CURRENT=$(turso org list | grep "^* $org" > /dev/null && echo "Yes" || echo "No")

  turso org switch $org > /dev/null 2>&1

  GROUPS=$(turso group list 2>/dev/null | tail -n +2 | wc -l)
  DBS=$(turso db list 2>/dev/null | tail -n +2 | wc -l)
  MEMBERS=$(turso org members list 2>/dev/null | tail -n +2 | wc -l)

  echo "$org,$IS_CURRENT,$GROUPS,$DBS,$MEMBERS"
done
```

## 自動化の例

### 全組織のヘルスチェック

```bash
#!/bin/bash
# health-check-all-orgs.sh

echo "=== Organization Health Check ==="
echo "Started: $(date)"
echo ""

ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  echo "Checking $org..."
  turso org switch $org > /dev/null 2>&1

  # データベースの接続テスト
  DBS=$(turso db list 2>/dev/null | tail -n +2 | awk '{print $1}')

  for db in $DBS; do
    if turso db shell $db "SELECT 1;" > /dev/null 2>&1; then
      echo "  ✓ $db: OK"
    else
      echo "  ✗ $db: FAILED"
    fi
  done
done

echo ""
echo "Completed: $(date)"
```

### 組織間のリソース比較

```bash
#!/bin/bash
# compare-organizations.sh

echo "Organization,Groups,Databases,Total Size"

ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  turso org switch $org > /dev/null 2>&1

  GROUPS=$(turso group list 2>/dev/null | tail -n +2 | wc -l)
  DBS=$(turso db list 2>/dev/null | tail -n +2 | wc -l)

  # サイズ計算（疑似的）
  TOTAL_SIZE="N/A"

  echo "$org,$GROUPS,$DBS,$TOTAL_SIZE"
done
```

## エラーハンドリング

### 認証エラー

```bash
# エラー例
$ turso org list
Error: not authenticated

# 解決策: ログインする
turso auth login
turso org list
```

### 組織が表示されない

```bash
# 組織のメンバーではない可能性
# 解決策:
# 1. 組織の管理者に招待をリクエスト
# 2. 組織を作成する
turso org create my-organization
```

## モニタリング

### 組織数の追跡

```bash
#!/bin/bash
# track-org-count.sh

LOG_FILE="org-count.log"
COUNT=$(turso org list | wc -l)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "$TIMESTAMP,$COUNT" >> $LOG_FILE
echo "Organization count: $COUNT"
```

### 新しい組織の検出

```bash
#!/bin/bash
# detect-new-orgs.sh

CACHE_FILE="$HOME/.turso/org-cache.txt"

# 現在の組織一覧を取得
CURRENT=$(turso org list | sort)

# キャッシュが存在する場合、差分を確認
if [ -f "$CACHE_FILE" ]; then
  PREVIOUS=$(cat "$CACHE_FILE")

  NEW_ORGS=$(comm -13 <(echo "$PREVIOUS") <(echo "$CURRENT"))

  if [ -n "$NEW_ORGS" ]; then
    echo "New organizations detected:"
    echo "$NEW_ORGS"
  else
    echo "No new organizations"
  fi
fi

# キャッシュを更新
echo "$CURRENT" > "$CACHE_FILE"
```

## 関連コマンド

- `turso org switch <org-name>` - 組織の切り替え
- `turso org create <name>` - 新しい組織の作成
- `turso org members list` - 組織メンバーの一覧
- `turso org show <org-name>` - 組織の詳細表示（将来実装される可能性）
- `turso auth whoami` - 現在のユーザーを確認

## 参考リンク

- [組織管理の概要](../../features/organizations.md)
- [チーム協業](../../help/team-collaboration.md)
- [アクセス制御](../../features/access-control.md)
- [CLI リファレンス](../README.md)
