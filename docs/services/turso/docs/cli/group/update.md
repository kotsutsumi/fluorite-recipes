# turso group update - グループの更新

既存のデータベースグループとそれに関連するすべてのデータベースを更新します。バージョン変更や拡張機能の設定を行うことができます。

## 構文

```bash
turso group update <group-name> [flags]
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: 更新するグループの名前
- **形式**: 既存のグループ名

## フラグ

### --extensions
- **説明**: 拡張機能の有効化設定
- **値**: `all` または `none`
- **デフォルト**: 変更なし

### --version
- **説明**: グループのバージョンを指定
- **値**: `latest` または `canary`
- **デフォルト**: `latest`

### -y, --yes
- **説明**: 確認プロンプトをスキップ
- **用途**: 自動化スクリプトでの使用

## 使用例

### 拡張機能の管理

```bash
# すべての拡張機能を有効化
turso group update production --extensions all

# すべての拡張機能を無効化
turso group update production --extensions none

# 確認なしで拡張機能を有効化
turso group update production --extensions all --yes
```

### バージョンの更新

```bash
# 最新の安定版に更新
turso group update production --version latest

# カナリアビルドに更新（実験的機能）
turso group update staging --version canary

# 確認なしでバージョン更新
turso group update production --version latest --yes
```

### 複数の設定を同時に更新

```bash
# バージョンと拡張機能を同時に更新
turso group update production --version latest --extensions all

# すべての設定を更新（確認なし）
turso group update production --version latest --extensions all --yes
```

## 拡張機能について

### 利用可能な拡張機能

Tursoは以下のSQLite拡張機能をサポートしています：

- **vector**: ベクトル検索機能
- **crypto**: 暗号化関数
- **fuzzy**: あいまい検索
- **math**: 数学関数
- **stats**: 統計関数
- **text**: テキスト処理関数
- **unicode**: Unicode処理
- **uuid**: UUID生成

### 拡張機能の使用例

```bash
# 拡張機能を有効化
turso group update mygroup --extensions all

# データベースで拡張機能を使用
turso db shell mydb
> SELECT hex(randomblob(16)); -- crypto拡張
> SELECT uuid(); -- uuid拡張
```

## バージョン管理

### latest（推奨）

```bash
# 安定版の最新バージョンを使用
turso group update production --version latest
```

- **特徴**: 本番環境に適した安定版
- **更新頻度**: 定期的なセキュリティ・機能更新
- **推奨用途**: 本番環境、ステージング環境

### canary（実験的）

```bash
# 最新の実験的機能を使用
turso group update experimental --version canary
```

- **特徴**: 最新機能の早期アクセス
- **注意**: 不安定な可能性あり
- **推奨用途**: 開発環境、テスト環境

## ベストプラクティス

### 1. 段階的なロールアウト

```bash
# まず開発環境で更新
turso group update development --version latest --extensions all --yes

# 次にステージング環境で検証
turso group update staging --version latest --extensions all --yes

# 最後に本番環境へ適用
turso group update production --version latest --extensions all
```

### 2. 更新前のバックアップ確認

```bash
# グループの現在の状態を確認
turso group show production

# 重要なデータベースのバックアップを確認
turso db show mydb

# 更新を実行
turso group update production --version latest
```

### 3. メンテナンスウィンドウでの更新

```bash
# 深夜など低トラフィック時に実行
# スクリプト例
#!/bin/bash
echo "Starting maintenance at $(date)"
turso group update production --version latest --yes
echo "Maintenance completed at $(date)"
```

### 4. 更新後の動作確認

```bash
# グループの状態を確認
turso group show production

# データベースの接続確認
turso db shell mydb
> SELECT sqlite_version();
> .quit

# アプリケーションからの接続テスト
```

## エラーハンドリング

### グループが見つからない

```bash
# エラー例
$ turso group update nonexistent --version latest
Error: group "nonexistent" not found

# 解決策: グループ一覧を確認
turso group list
turso group update correct-group-name --version latest
```

### 無効なバージョン指定

```bash
# エラー例
$ turso group update mygroup --version invalid
Error: invalid version, must be 'latest' or 'canary'

# 解決策: 正しいバージョンを指定
turso group update mygroup --version latest
```

### 無効な拡張機能設定

```bash
# エラー例
$ turso group update mygroup --extensions some
Error: extensions must be 'all' or 'none'

# 解決策: 正しい値を指定
turso group update mygroup --extensions all
```

### 更新中のエラー

```bash
# エラー例
$ turso group update production --version latest
Error: group update failed, databases are being updated

# 解決策: しばらく待ってから再試行
sleep 60
turso group update production --version latest
```

## 自動化の例

### CI/CDパイプラインでの使用

```bash
#!/bin/bash
# deploy.sh

GROUP_NAME="production"

# 更新前の確認
echo "Current group status:"
turso group show $GROUP_NAME

# 更新の実行
echo "Updating group..."
if turso group update $GROUP_NAME --version latest --extensions all --yes; then
  echo "Group updated successfully"

  # 更新後の確認
  turso group show $GROUP_NAME
else
  echo "Group update failed"
  exit 1
fi
```

### ロールバックスクリプト

```bash
#!/bin/bash
# rollback.sh

GROUP_NAME="production"

echo "Rolling back to stable version..."
turso group update $GROUP_NAME --version latest --yes

if [ $? -eq 0 ]; then
  echo "Rollback successful"
else
  echo "Rollback failed"
  exit 1
fi
```

## 影響範囲

グループを更新すると、以下に影響します：

1. **グループ内のすべてのデータベース**: バージョンと拡張機能が更新されます
2. **既存の接続**: 更新中は一時的に接続が中断される可能性があります
3. **レプリカ**: すべてのリージョンのレプリカが更新されます

## 関連コマンド

- `turso group show <group-name>` - グループの詳細表示
- `turso group list` - グループ一覧の表示
- `turso group create <group-name>` - グループの作成
- `turso db list` - データベース一覧の表示
- `turso db show <db-name>` - データベースの詳細表示

## 参考リンク

- [グループの概要](../../features/groups.md)
- [拡張機能ガイド](../../features/extensions.md)
- [バージョン管理](../../features/versioning.md)
- [CLI リファレンス](../README.md)
