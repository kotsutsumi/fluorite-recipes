# turso plan upgrade - プランのアップグレード

アカウントを有料プランにアップグレードします。

## 構文

```bash
turso plan upgrade
```

## 前提条件

- クレジットカード情報の登録が必要
- `turso org billing` で支払い方法を事前に追加

## 動作

このコマンドを実行すると、以下が行われます：

1. 利用可能なアップグレードオプションが表示されます
2. プランを選択します
3. 確認後、即座にアップグレードが適用されます

## 使用例

### 基本的な使用方法

```bash
# プランをアップグレード
turso plan upgrade

# 出力例:
# Current plan: Starter
# Available upgrades:
#   - Scaler ($29/month)
#   - Pro (Contact sales)
#   - Enterprise (Contact sales)
```

### Scalerプランへのアップグレード

```bash
# Scalerプランにアップグレード（推奨）
turso plan upgrade
# "Scaler" を選択
```

## アップグレードの利点

### Starter → Scaler
- 組織の作成が可能
- データベース数: 500 → 無制限
- グループ数: 1 → 無制限
- より高い使用量上限
- プライオリティサポート

## 料金

- **Scaler**: $29/月 + 使用量ベースの追加料金
- **Pro/Enterprise**: カスタム価格（営業に問い合わせ）

## エラーハンドリング

### 支払い方法が未登録

```bash
# エラー例
$ turso plan upgrade
Error: payment method required

# 解決策
turso org billing  # 支払い方法を追加
turso plan upgrade
```

## 関連コマンド

- `turso plan show` - 現在のプラン表示
- `turso plan select` - プランの選択
- `turso org billing` - 課金ポータルを開く

## 参考リンク

- [プランと価格](../../help/pricing.md)
- [組織の作成](../../features/organizations.md)
- [CLI リファレンス](../README.md)
