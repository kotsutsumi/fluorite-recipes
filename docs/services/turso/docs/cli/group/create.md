# turso group create - グループの作成

新しいデータベースグループを作成します。グループは特定のプライマリリージョンに関連付けられ、複数のデータベースをまとめて管理できます。

## 構文

```bash
turso group create <group-name> [flags]
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: 作成するグループの名前
- **形式**: 英数字とハイフン

## フラグ

### --canary
- **説明**: データベースのカナリアビルドを使用
- **用途**: 最新の実験的機能をテスト

### --location
- **説明**: プライマリロケーションを3文字のコードで指定
- **デフォルト**: 最も近いリージョンを自動検出
- **例**: `nrt` (東京)、`sjc` (サンノゼ)、`fra` (フランクフルト)

### -w, --wait
- **説明**: グループの準備が完了するまで待機してから終了
- **用途**: スクリプトでの同期処理

## 使用例

### 基本的な使用方法

```bash
# デフォルトリージョンでグループを作成
turso group create production
```

### 特定のリージョンを指定

```bash
# 東京リージョンでグループを作成
turso group create production --location nrt

# サンノゼリージョンでグループを作成
turso group create us-west --location sjc

# フランクフルトリージョンでグループを作成
turso group create eu-central --location fra
```

### カナリアビルドの使用

```bash
# 最新の実験的機能を使用するグループを作成
turso group create experimental --canary

# カナリアビルドと特定リージョンを組み合わせ
turso group create staging --canary --location nrt
```

### 準備完了を待機

```bash
# グループの作成完了を待つ
turso group create production --wait

# すべてのオプションを組み合わせ
turso group create production --location nrt --wait
```

## プランによる制限

### Starter プラン
- **グループ数**: 1つのみ（デフォルトグループ）
- **制限**: 追加のグループは作成不可

### Scaler, Pro, Enterprise プラン
- **グループ数**: 複数のグループを作成可能
- **用途**: 環境分離、リージョン分散、パフォーマンス最適化

## ベストプラクティス

### 1. 環境ごとにグループを分離

```bash
# 開発環境用グループ
turso group create development --location nrt

# ステージング環境用グループ
turso group create staging --location nrt

# 本番環境用グループ
turso group create production --location nrt --wait
```

### 2. リージョンの選択

```bash
# ユーザーに最も近いリージョンを選択
# アジア太平洋: nrt (東京), sin (シンガポール)
turso group create apac-group --location nrt

# 北米: sjc (サンノゼ), iad (バージニア)
turso group create na-group --location sjc

# ヨーロッパ: fra (フランクフルト), lhr (ロンドン)
turso group create eu-group --location fra
```

### 3. 命名規則

```bash
# 環境とリージョンを含む命名
turso group create prod-apac --location nrt
turso group create prod-eu --location fra
turso group create prod-us --location sjc

# 用途別の命名
turso group create analytics-group
turso group create user-data-group
turso group create cache-group
```

## エラーハンドリング

### グループ名の重複

```bash
# エラー例
$ turso group create production
Error: group "production" already exists

# 解決策: 別の名前を使用
turso group create production-v2
```

### プラン制限

```bash
# エラー例
$ turso group create secondary
Error: multiple groups require Scaler plan or higher

# 解決策: プランをアップグレード
turso plan upgrade
```

### 無効なロケーション

```bash
# エラー例
$ turso group create mygroup --location invalid
Error: invalid location code

# 解決策: 有効なロケーションコードを使用
turso group locations  # 利用可能なロケーションを確認
turso group create mygroup --location nrt
```

## グループ作成後の確認

```bash
# グループの詳細を確認
turso group show production

# グループ一覧を表示
turso group list

# グループにデータベースを作成
turso db create mydb --group production
```

## 関連コマンド

- `turso group list` - グループ一覧の表示
- `turso group show <group-name>` - グループの詳細表示
- `turso group update <group-name>` - グループの更新
- `turso group destroy <group-name>` - グループの削除
- `turso group locations` - 利用可能なロケーション一覧

## 参考リンク

- [グループの概要](../../features/groups.md)
- [リージョンとレプリケーション](../../features/replicas.md)
- [プラン比較](../../help/pricing.md)
- [CLI リファレンス](../README.md)
