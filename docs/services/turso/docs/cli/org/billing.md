# turso org billing - 課金ポータルの表示

組織の課金ポータルをブラウザで開き、支払い方法、請求書、使用状況を管理します。

## 構文

```bash
turso org billing
```

## パラメータ

このコマンドにパラメータはありません。

## 機能

課金ポータルでは以下の操作が可能です：

- **支払い方法の管理**: クレジットカードの追加・削除・更新
- **請求書の確認**: 過去の請求書をダウンロード
- **使用状況の確認**: 現在の使用量とコスト
- **プランの変更**: プランのアップグレード・ダウングレード
- **課金アラートの設定**: 使用量の閾値設定

## 使用例

### 基本的な使用方法

```bash
# 課金ポータルを開く
turso org billing

# ブラウザが自動的に開き、課金ダッシュボードが表示されます
```

### 特定の組織の課金情報

```bash
# 組織を切り替え
turso org switch my-company

# その組織の課金ポータルを開く
turso org billing
```

### 複数組織の課金確認

```bash
#!/bin/bash
# check-billing-all-orgs.sh

ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  echo "Opening billing for $org..."
  turso org switch $org
  turso org billing

  read -p "Press Enter to continue to next organization..."
done
```

## 課金ポータルでの操作

### 1. 支払い方法の追加

```
1. turso org billing でポータルを開く
2. "Payment Methods" をクリック
3. "Add Payment Method" をクリック
4. クレジットカード情報を入力
5. "Save" をクリック
```

### 2. 請求書のダウンロード

```
1. 課金ポータルを開く
2. "Invoices" セクションに移動
3. ダウンロードしたい請求書を選択
4. "Download PDF" をクリック
```

### 3. 使用状況の確認

```
1. 課金ポータルを開く
2. "Usage" タブをクリック
3. データベース数、ストレージ、リクエスト数などを確認
```

## ベストプラクティス

### 1. 定期的な確認

```bash
#!/bin/bash
# monthly-billing-check.sh

# 月初に実行するスクリプト
echo "=== Monthly Billing Check ==="
echo "Date: $(date)"
echo ""

# 各組織の課金情報を確認
ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  echo "Organization: $org"
  turso org switch $org

  # プランを確認
  echo "Current plan:"
  turso plan show

  # 課金ポータルを開く
  echo "Opening billing portal..."
  turso org billing

  read -p "Review complete? Press Enter to continue..."
done
```

### 2. 課金アラートの設定

課金ポータルで以下のアラートを設定することを推奨：

- **データベース数の上限**: 計画外の作成を防ぐ
- **ストレージ使用量**: 特定の閾値で通知
- **月額コスト**: 予算超過の警告
- **リクエスト数**: トラフィック急増の検知

### 3. 請求書の自動保存

```bash
#!/bin/bash
# save-invoices.sh

ORG_NAME=$(turso org list | grep "^*" | awk '{print $2}')
INVOICE_DIR="$HOME/Documents/Turso-Invoices/$ORG_NAME"

mkdir -p "$INVOICE_DIR"

echo "Saving invoices for $ORG_NAME"
echo "Directory: $INVOICE_DIR"
echo ""
echo "1. Open billing portal"
turso org billing

echo "2. Download invoices manually to: $INVOICE_DIR"
echo "3. Rename files as: invoice-YYYY-MM.pdf"
```

### 4. プランの最適化確認

```bash
#!/bin/bash
# optimize-plan.sh

echo "=== Plan Optimization Check ==="

# 現在のプランを表示
echo "Current plan:"
turso plan show

echo ""
echo "Usage summary:"
echo "  Databases: $(turso db list | tail -n +2 | wc -l)"
echo "  Groups: $(turso group list | tail -n +2 | wc -l)"

echo ""
echo "Opening billing portal for detailed usage..."
turso org billing

echo ""
echo "Questions to consider:"
echo "  - Are you using features from your current plan?"
echo "  - Could you downgrade to save costs?"
echo "  - Do you need to upgrade for more resources?"
```

## コスト管理

### プラン別の料金体系

```bash
# Starterプラン（無料）
# - 組織作成: 不可
# - データベース: 最大500
# - グループ: 1
# - ストレージ: 9GB
# - 月間リクエスト: 1億回

# Scalerプラン（$29/月）
# - 組織作成: 可能
# - データベース: 無制限
# - グループ: 無制限
# - 追加料金: 使用量に応じて
```

### 使用量の監視

```bash
#!/bin/bash
# monitor-usage.sh

echo "=== Turso Usage Monitoring ==="
echo "Organization: $(turso org list | grep '^*' | awk '{print $2}')"
echo "Date: $(date)"
echo ""

# リソース数を取得
DATABASES=$(turso db list | tail -n +2 | wc -l)
GROUPS=$(turso group list | tail -n +2 | wc -l)

echo "Current Usage:"
echo "  Databases: $DATABASES"
echo "  Groups: $GROUPS"

echo ""
echo "For detailed usage and costs:"
turso org billing
```

## エラーハンドリング

### 認証エラー

```bash
# エラー例
$ turso org billing
Error: not authenticated

# 解決策
turso auth login
turso org billing
```

### 組織が選択されていない

```bash
# エラー例
$ turso org billing
Error: no organization selected

# 解決策
turso org list
turso org switch my-org
turso org billing
```

### ブラウザが開かない

```bash
# 手動でURLを開く必要がある場合
$ turso org billing
Opening billing portal...
URL: https://turso.tech/billing/...

# URLを手動でブラウザにコピー＆ペースト
```

## 自動化の例

### 月次レポートの生成

```bash
#!/bin/bash
# monthly-billing-report.sh

REPORT_FILE="billing-report-$(date +%Y-%m).txt"

echo "Turso Monthly Billing Report" > $REPORT_FILE
echo "Generated: $(date)" >> $REPORT_FILE
echo "" >> $REPORT_FILE

ORGS=$(turso org list | awk '{print $NF}')

for org in $ORGS; do
  echo "=== $org ===" >> $REPORT_FILE

  turso org switch $org

  echo "Plan:" >> $REPORT_FILE
  turso plan show >> $REPORT_FILE

  echo "" >> $REPORT_FILE
  echo "Resources:" >> $REPORT_FILE
  echo "  Databases: $(turso db list | tail -n +2 | wc -l)" >> $REPORT_FILE
  echo "  Groups: $(turso group list | tail -n +2 | wc -l)" >> $REPORT_FILE

  echo "" >> $REPORT_FILE
done

echo "Report saved to: $REPORT_FILE"
echo ""
echo "Next steps:"
echo "1. Review the report"
echo "2. Open billing portal for detailed costs: turso org billing"
```

### コストアラート

```bash
#!/bin/bash
# cost-alert.sh

THRESHOLD_DBS=100  # データベース数の閾値
THRESHOLD_GROUPS=10  # グループ数の閾値

DATABASES=$(turso db list | tail -n +2 | wc -l)
GROUPS=$(turso group list | tail -n +2 | wc -l)

if [ $DATABASES -gt $THRESHOLD_DBS ]; then
  echo "⚠ Alert: Database count ($DATABASES) exceeds threshold ($THRESHOLD_DBS)"
  # 通知を送信（例: Slack、メール）
fi

if [ $GROUPS -gt $THRESHOLD_GROUPS ]; then
  echo "⚠ Alert: Group count ($GROUPS) exceeds threshold ($THRESHOLD_GROUPS)"
fi

# 詳細確認のため課金ポータルを開く
if [ $DATABASES -gt $THRESHOLD_DBS ] || [ $GROUPS -gt $THRESHOLD_GROUPS ]; then
  echo "Opening billing portal for review..."
  turso org billing
fi
```

## 請求サイクル

### 月次課金

- **課金日**: 毎月同じ日（プラン開始日基準）
- **使用量計測**: 月単位で集計
- **支払い**: 自動引き落とし

### 使用量ベースの課金

```bash
# 使用量の確認
turso org billing

# 課金ポータルで確認できる項目:
# - データベース数（Scaler以上）
# - ストレージ使用量（9GB超過分）
# - リクエスト数（1億回超過分）
# - レプリカ数
# - データ転送量
```

## セキュリティ

### 課金情報へのアクセス

- **オーナー**: すべての課金操作が可能
- **管理者**: 課金情報の閲覧が可能（権限による）
- **メンバー**: アクセス不可

### 支払い情報の保護

```bash
# 組織のオーナーのみが支払い方法を管理
# メンバーには課金情報が表示されない

# 権限の確認
turso org members list
```

## 関連コマンド

- `turso plan show` - 現在のプランと使用状況を表示
- `turso plan upgrade` - プランのアップグレード
- `turso plan select` - プランの選択
- `turso org create <name>` - 新しい組織の作成
- `turso org list` - 組織一覧の表示

## 参考リンク

- [プランと価格](../../help/pricing.md)
- [課金管理ガイド](../../help/billing.md)
- [使用量の最適化](../../help/usage-optimization.md)
- [組織管理](../../features/organizations.md)
- [CLI リファレンス](../README.md)
