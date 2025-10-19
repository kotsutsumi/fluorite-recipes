# turso plan show - プラン情報の表示

現在のプランの使用状況と制限を表示します。

## 構文

```bash
turso plan show
```

## 表示される情報

- **プラン名**: Starter, Scaler, Pro, Enterprise
- **月額料金**: プランの基本料金
- **使用状況**: 現在の使用量
- **制限**: プランごとの上限
- **超過料金**: 使用量ベースの追加料金

## 使用例

### 基本的な使用方法

```bash
turso plan show

# 出力例:
# Plan: Scaler
# Monthly Base: $29
#
# Usage:
#   Databases: 15 / unlimited
#   Groups: 3 / unlimited
#   Storage: 2.5 GB / 9 GB included
#   Rows Read: 50M / 1B included
#   Rows Written: 10M / 25M included
```

### スクリプトでの使用

```bash
#!/bin/bash
# check-usage.sh

echo "=== Current Plan Usage ==="
turso plan show

# 使用量が閾値を超えた場合に警告
# （実際のパースロジックは出力形式に依存）
```

## プラン比較

### Starter（無料）
- データベース: 500
- グループ: 1
- ストレージ: 9 GB
- 行読み取り: 1億行/月
- 行書き込み: 2500万行/月

### Scaler（$29/月）
- データベース: 無制限
- グループ: 無制限
- ストレージ: 9 GB含む（超過分は従量課金）
- 行読み取り: 10億行/月含む
- 行書き込み: 2500万行/月含む

### Pro・Enterprise
- カスタム制限とサポート

## 関連コマンド

- `turso plan select` - プランの選択
- `turso plan upgrade` - プランのアップグレード
- `turso org billing` - 課金ポータルを開く

## 参考リンク

- [プランと価格](../../help/pricing.md)
- [使用量の最適化](../../help/usage-optimization.md)
- [CLI リファレンス](../README.md)
