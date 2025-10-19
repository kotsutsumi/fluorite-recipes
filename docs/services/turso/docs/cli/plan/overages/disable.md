# turso plan overages disable - 超過料金の無効化

プランの使用量上限を超えた場合に、自動的な従量課金を無効にします。

## 構文

```bash
turso plan overages disable
```

## 動作

このコマンドを実行すると：

- 使用量がプランの上限に達した時点でサービスが制限されます
- 追加の超過料金は発生しません
- 予期しない高額請求を防ぎます

## 使用例

### 基本的な使用方法

```bash
# 超過料金を無効化
turso plan overages disable

# 出力例:
# Overages disabled. Service will be limited if you exceed plan limits.
# No additional charges will apply beyond your base plan cost.
```

## サービス制限の内容

超過料金が無効で上限に達した場合：

- **書き込み**: 新しい書き込みが拒否されます
- **読み取り**: 継続して利用可能（プランによる）
- **データベース作成**: 新規作成が制限されます

## ベストプラクティス

### 1. コスト管理を重視する場合

```bash
# 予算を厳密に管理
turso plan overages disable

# 定期的に使用量を確認
turso plan show
```

### 2. 開発・テスト環境

```bash
# テスト環境では超過料金を無効化
turso org switch dev-org
turso plan overages disable
```

## 有効化

超過料金を再度有効にする場合：

```bash
turso plan overages enable
```

## 関連コマンド

- `turso plan overages enable` - 超過料金の有効化
- `turso plan show` - 使用量の確認
- `turso plan upgrade` - プランのアップグレード

## 参考リンク

- [プランと価格](../../help/pricing.md)
- [コスト管理](../../help/cost-management.md)
- [CLI リファレンス](../README.md)

## 推奨

予期しない高額請求を防ぐため、超過料金の無効化を推奨します。必要に応じて、より高いプランへのアップグレードを検討してください。
