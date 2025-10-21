# turso plan select - プランの選択

現在のプランを変更します。アップグレードまたはダウングレードが可能です。

## 構文

```bash
turso plan select
```

## 動作

コマンドを実行すると、利用可能なプランの一覧が表示され、選択できます：

1. Starter（無料）
2. Scaler（$29/月）
3. Pro（カスタム）
4. Enterprise（カスタム）

## 前提条件

有料プランへのアップグレードには：
- クレジットカード情報の登録が必要
- `turso org billing` で支払い方法を追加

## 使用例

### 基本的な使用方法

```bash
# プラン選択画面を開く
turso plan select

# プロンプトに従ってプランを選択
# > 1. Starter (Free)
# > 2. Scaler ($29/month)
# > 3. Pro (Contact sales)
# > 4. Enterprise (Contact sales)
# Select plan: 2
```

### Scalerプランへのアップグレード

```bash
# プラン選択を実行
turso plan select
# "2" を選択してScalerプランに変更
```

## プラン変更の影響

### アップグレード
- 即座に新しい制限が適用されます
- 次回請求サイクルから新料金が適用
- 使用量の上限が増加

### ダウングレード
- 次回請求サイクルから適用
- 現在の使用量が新プランの制限を超える場合は警告
- リソースの削除が必要な場合あり

## 関連コマンド

- `turso plan show` - 現在のプラン表示
- `turso plan upgrade` - プランのアップグレード
- `turso org billing` - 課金ポータルを開く

## 参考リンク

- [プランと価格](../../help/pricing.md)
- [CLI リファレンス](../README.md)
