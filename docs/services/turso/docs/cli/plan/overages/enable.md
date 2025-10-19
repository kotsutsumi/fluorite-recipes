# turso plan overages enable - 超過料金の有効化

プランの使用量上限を超えた場合に、自動的に超過料金で継続使用できるようにします。

## 構文

```bash
turso plan overages enable
```

## 動作

このコマンドを実行すると：

- 使用量がプランの上限を超えた場合、自動的に従量課金が適用されます
- サービスの中断を防ぎます
- 超過分は月次請求書に追加されます

## 使用例

### 基本的な使用方法

```bash
# 超過料金を有効化
turso plan overages enable

# 出力例:
# Overages enabled. Your account will continue to function if you exceed plan limits.
# Additional charges will apply for usage beyond included limits.
```

## 超過料金の対象

- **ストレージ**: 9 GB超過分
- **行読み取り**: プラン含有量超過分
- **行書き込み**: プラン含有量超過分
- **データ転送**: プラン含有量超過分

## ベストプラクティス

### 1. 使用量アラートの設定

```bash
# 課金ポータルでアラートを設定
turso org billing

# 設定推奨項目:
# - ストレージ使用量が8 GBに達した時
# - 月間コストが$100に達した時
# - 行読み取りが90%に達した時
```

### 2. 定期的な使用量確認

```bash
#!/bin/bash
# check-usage-weekly.sh

echo "=== Weekly Usage Check ==="
turso plan show

# 使用量が高い場合は警告
```

## 無効化

超過料金を無効化する場合：

```bash
turso plan overages disable
```

無効化すると、使用量が上限に達した時点でサービスが制限されます。

## 関連コマンド

- `turso plan overages disable` - 超過料金の無効化
- `turso plan show` - 使用量の確認
- `turso org billing` - 課金ポータルを開く

## 参考リンク

- [プランと価格](../../help/pricing.md)
- [使用量管理](../../help/usage-management.md)
- [CLI リファレンス](../README.md)

## 注意

超過料金を有効にすると、予期しない高額請求が発生する可能性があります。課金アラートの設定を推奨します。
