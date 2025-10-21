# turso group list - グループ一覧表示

Turso CLIの`turso group list`コマンドは、現在のユーザーまたは組織のすべてのグループを一覧表示します。グループはデータベースの論理的なコレクションで、同じ設定とロケーションを共有します。

## 📚 目次

- [基本構文](#基本構文)
- [使用例](#使用例)
- [出力形式](#出力形式)
- [グループの理解](#グループの理解)
- [ベストプラクティス](#ベストプラクティス)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso group list
```

このコマンドにはオプションはありません。すべてのグループが一覧表示されます。

## 使用例

### 基本的な使用

#### すべてのグループを表示

```bash
turso group list
```

**出力例:**

```
Name            Location        Databases
default         nrt (Tokyo)     3
production      iad (Virginia)  5
development     sin (Singapore) 2
staging         fra (Frankfurt) 1
```

### スクリプトでの使用

#### グループ数の確認

```bash
#!/bin/bash

# グループ一覧を取得
GROUP_COUNT=$(turso group list | tail -n +2 | wc -l)

echo "Total groups: $GROUP_COUNT"
```

#### 各グループの詳細を表示

```bash
#!/bin/bash

echo "Group Overview"
echo "=============="

# ヘッダーをスキップして各グループを処理
turso group list | tail -n +2 | while read name location databases; do
  echo ""
  echo "Group: $name"
  echo "  Location: $location"
  echo "  Databases: $databases"

  # データベース一覧を表示
  echo "  Database list:"
  turso db list --group "$name" | tail -n +2
done
```

#### グループごとのデータベース統計

```bash
#!/bin/bash

echo "Group Statistics"
echo "================"

turso group list | tail -n +2 | while read name location db_count rest; do
  echo ""
  echo "Group: $name"
  echo "Location: $location"
  echo "Database count: $db_count"

  # 合計サイズを計算（例）
  total_size=0
  turso db list --group "$name" | tail -n +2 | while read db rest; do
    # データベースごとのサイズ情報を取得
    size_info=$(turso db show "$db" 2>/dev/null | grep "Size:")
    echo "  - $db: $size_info"
  done
done
```

## 出力形式

### 表示される情報

```typescript
interface GroupListOutput {
  columns: {
    name: string;              // グループ名
    location: string;          // プライマリロケーション
    databases: number;         // データベース数
  };
  format: "テーブル形式";
  sorting: "グループ名のアルファベット順";
}
```

### 出力カラムの説明

| カラム | 説明 |
|--------|------|
| **Name** | グループの名前（一意） |
| **Location** | プライマリロケーション（地域コード + 都市名） |
| **Databases** | グループ内のデータベース数 |

## グループの理解

### グループとは

```typescript
interface GroupConcept {
  definition: "データベースの論理的コレクション";
  purpose: {
    configuration: "共通の設定を共有";
    location: "同じプライマリロケーション";
    management: "一括管理の単位";
    replication: "レプリカ設定の共有";
  };
  characteristics: {
    databases: "複数のデータベースを含む";
    settings: "拡張機能、バージョンなどを共有";
    tokens: "グループレベルのアクセストークン";
  };
}
```

### デフォルトグループ

```typescript
interface DefaultGroup {
  name: "default";
  creation: "アカウント作成時に自動生成";
  location: "最寄りのロケーション";
  usage: "単一グループで十分な場合に使用";
}
```

**確認:**

```bash
turso group list
# default グループが存在する
```

### マルチグループの使用シーン

```typescript
interface MultiGroupScenarios {
  環境分離: {
    groups: ["development", "staging", "production"];
    benefit: "環境ごとの独立した管理";
  };
  地理的分散: {
    groups: ["asia", "americas", "europe"];
    benefit: "リージョンごとの最適化";
  };
  プロジェクト分離: {
    groups: ["project-a", "project-b", "project-c"];
    benefit: "プロジェクトごとの独立性";
  };
  用途別分離: {
    groups: ["transactional", "analytical", "cache"];
    benefit: "ワークロードの分離";
  };
}
```

## 実践的なワークフロー

### グループ情報の監査

```bash
#!/bin/bash

AUDIT_FILE="group-audit-$(date +%Y%m%d).txt"

echo "Turso Group Audit Report" > "$AUDIT_FILE"
echo "Date: $(date)" >> "$AUDIT_FILE"
echo "=========================" >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"

# グループ一覧を記録
echo "Groups:" >> "$AUDIT_FILE"
turso group list >> "$AUDIT_FILE"
echo "" >> "$AUDIT_FILE"

# 各グループの詳細
turso group list | tail -n +2 | while read name location db_count rest; do
  echo "Group: $name" >> "$AUDIT_FILE"
  echo "Databases:" >> "$AUDIT_FILE"
  turso db list --group "$name" >> "$AUDIT_FILE"
  echo "" >> "$AUDIT_FILE"
done

echo "Audit report generated: $AUDIT_FILE"
```

### グループ使用状況のレポート

```bash
#!/bin/bash

echo "Turso Group Usage Report"
echo "========================"
echo ""

total_groups=0
total_databases=0

turso group list | tail -n +2 | while read name location db_count rest; do
  total_groups=$((total_groups + 1))
  total_databases=$((total_databases + db_count))

  echo "Group: $name"
  echo "  Location: $location"
  echo "  Databases: $db_count"
  echo ""
done

echo "Summary:"
echo "  Total Groups: $total_groups"
echo "  Total Databases: $total_databases"
```

### 空のグループの検出

```bash
#!/bin/bash

echo "Checking for empty groups..."
echo ""

has_empty=false

turso group list | tail -n +2 | while read name location db_count rest; do
  if [ "$db_count" = "0" ]; then
    echo "Empty group found: $name (Location: $location)"
    has_empty=true
  fi
done

if [ "$has_empty" = false ]; then
  echo "No empty groups found"
fi
```

### グループごとの設定確認

```bash
#!/bin/bash

echo "Group Configuration Overview"
echo "============================"

turso group list | tail -n +2 | while read name rest; do
  echo ""
  echo "Group: $name"
  echo "-------------"

  # データベース一覧
  echo "Databases:"
  turso db list --group "$name" | tail -n +2 | awk '{print "  - " $1}'

  # 設定情報（データベースから推測）
  first_db=$(turso db list --group "$name" | tail -n +2 | head -1 | awk '{print $1}')
  if [ -n "$first_db" ]; then
    echo ""
    echo "Configuration (from $first_db):"
    turso db show "$first_db" | grep -E "(Version|Group)"
  fi
done
```

## ベストプラクティス

### 1. 適切なグループ構造の設計

#### 環境ベースのグループ分け

```bash
# 環境ごとにグループを作成
turso group create development --location nrt
turso group create staging --location sin
turso group create production --location iad

# 確認
turso group list
```

**メリット:**
- 環境の独立性
- 設定の分離
- トークンの分離

#### リージョンベースのグループ分け

```bash
# リージョンごとにグループを作成
turso group create asia-pacific --location nrt
turso group create americas --location iad
turso group create europe --location fra

# 確認
turso group list
```

**メリット:**
- 地理的な最適化
- レイテンシの最小化
- データ主権への対応

### 2. 命名規則の確立

```typescript
interface NamingConventions {
  環境ベース: {
    pattern: "{env}";
    examples: ["dev", "staging", "prod"];
  };
  リージョンベース: {
    pattern: "{region}";
    examples: ["apac", "emea", "amer"];
  };
  プロジェクトベース: {
    pattern: "{project}-{env}";
    examples: ["webapp-prod", "api-staging"];
  };
  複合: {
    pattern: "{project}-{region}-{env}";
    examples: ["webapp-apac-prod", "api-emea-staging"];
  };
}
```

### 3. グループ情報のドキュメント化

```bash
#!/bin/bash

# グループ構成をMarkdownドキュメントに出力
cat > group-structure.md <<EOF
# Turso Group Structure

Generated: $(date)

## Groups Overview

EOF

turso group list | while read line; do
  echo "$line" >> group-structure.md
done

cat >> group-structure.md <<EOF

## Group Details

EOF

turso group list | tail -n +2 | while read name location db_count rest; do
  cat >> group-structure.md <<DETAIL

### Group: $name

- **Location**: $location
- **Databases**: $db_count
- **Purpose**: [Add description here]
- **Owner**: [Add owner here]

**Databases:**

DETAIL

  turso db list --group "$name" | tail -n +2 | while read db rest; do
    echo "- $db" >> group-structure.md
  done

  echo "" >> group-structure.md
done

echo "Documentation generated: group-structure.md"
```

### 4. 定期的なレビュー

```bash
#!/bin/bash

# 月次グループレビュースクリプト
echo "Monthly Group Review - $(date +%Y-%m)"
echo "======================================"
echo ""

echo "Current Groups:"
turso group list

echo ""
echo "Review Checklist:"
echo "[ ] All groups are being actively used"
echo "[ ] Group locations are optimal"
echo "[ ] No empty or abandoned groups"
echo "[ ] Group naming follows conventions"
echo "[ ] Documentation is up to date"
```

### 5. プラン制限の理解

```typescript
interface PlanLimitations {
  starter: {
    groups: 1;
    databases: "無制限";
    note: "デフォルトグループのみ";
  };
  scaler: {
    groups: "複数可";
    databases: "プランによる";
    note: "マルチグループサポート";
  };
  pro: {
    groups: "複数可";
    databases: "プランによる";
    features: "高度な機能";
  };
  enterprise: {
    groups: "無制限";
    databases: "カスタム";
    features: "すべての機能";
  };
}
```

**グループ数の確認:**

```bash
#!/bin/bash

GROUP_COUNT=$(turso group list | tail -n +2 | wc -l)
echo "Current group count: $GROUP_COUNT"

# プラン制限の警告
if [ "$GROUP_COUNT" -gt 1 ]; then
  echo "Note: Multiple groups require Scaler plan or higher"
fi
```

## トラブルシューティング

### グループが表示されない

**原因:**
- 間違った組織にログインしている
- グループが削除された

**解決方法:**

```bash
# 現在の組織を確認
turso org list

# 組織を切り替え
turso org switch <組織名>

# 再度確認
turso group list
```

### デフォルトグループがない

**原因:**
- アカウントが新規作成されたばかり
- デフォルトグループが削除された（通常は起こらない）

**解決方法:**

```bash
# 新しいグループを作成
turso group create default --location nrt

# または別の名前で
turso group create my-group --location nrt
```

### プラン制限エラー

**エラー:** "Multiple groups require upgraded plan"

**解決方法:**

```bash
# 現在のプランを確認
turso plan show

# プランのアップグレード
turso plan select scaler
```

## 出力のパース

### シェルスクリプトでの処理

```bash
#!/bin/bash

# グループ情報を配列に格納
declare -A groups

while IFS= read -r line; do
  if [[ $line =~ ^[a-z] ]]; then
    name=$(echo "$line" | awk '{print $1}')
    location=$(echo "$line" | awk '{print $2}')
    db_count=$(echo "$line" | awk '{print $3}')

    groups[$name]="$location|$db_count"
  fi
done < <(turso group list | tail -n +2)

# グループ情報を使用
for group in "${!groups[@]}"; do
  IFS='|' read -r location db_count <<< "${groups[$group]}"
  echo "Group $group has $db_count databases at $location"
done
```

### JSONフォーマットでの出力（将来的）

```bash
# 将来的な使用例
turso group list --format json | jq '.[] | select(.databases > 0)'
```

## パフォーマンス考慮事項

### グループ数の影響

```typescript
interface PerformanceConsiderations {
  listCommand: {
    groups: "グループ数に比例";
    typical: "数ミリ秒";
    large: "100+グループでも高速";
  };
  management: {
    fewGroups: "管理が簡単";
    manyGroups: "柔軟だが複雑";
    recommendation: "必要最小限";
  };
}
```

## 関連コマンド

- [`turso group create`](./group-create.md) - 新しいグループを作成
- [`turso group destroy`](./group-destroy.md) - グループを削除
- [`turso group update`](./group-update.md) - グループ設定を更新
- [`turso db list`](./db-list.md) - データベース一覧を表示
- [`turso org list`](./org-list.md) - 組織一覧を表示

## 参考リンク

- [Turso グループの概念](https://docs.turso.tech/concepts/groups)
- [マルチグループ管理](https://docs.turso.tech/guides/multi-group)
- [料金プラン](https://docs.turso.tech/pricing)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
