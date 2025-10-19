# turso group transfer - グループの転送

データベースグループとそれに関連するすべてのデータベースを別の組織に転送します。

## 構文

```bash
turso group transfer <group-name> <organization-name> [flags]
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: 転送するグループの名前
- **形式**: 既存のグループ名

### organization-name
- **必須**: はい
- **説明**: 転送先の組織名
- **形式**: 組織のスラッグまたは名前

## フラグ

### -y, --yes
- **説明**: 転送の確認プロンプトをスキップ
- **用途**: 自動化スクリプトでの使用

## 権限要件

転送を実行するには、以下の権限が必要です：

- **転送元**: グループの所有者またはオーナー
- **転送先**: 組織の管理者（admin）またはオーナー（owner）

## 使用例

### 基本的な使用方法

```bash
# 確認プロンプト付きで転送
turso group transfer mygroup my-organization

# 出力例:
# Warning: This will transfer the group "mygroup" to organization "my-organization".
# Are you sure? (y/N): y
# Group "mygroup" has been transferred.
```

### 確認なしで転送

```bash
# 自動化スクリプト用
turso group transfer production company-org --yes

# 複数のグループを転送
turso group transfer group1 new-org --yes
turso group transfer group2 new-org --yes
turso group transfer group3 new-org --yes
```

### 転送前の確認

```bash
# グループの詳細を確認
turso group show mygroup

# 転送先組織の確認
turso org list

# 組織を切り替えて確認
turso org switch target-org

# 元の組織に戻る
turso org switch source-org

# 転送実行
turso group transfer mygroup target-org
```

## 転送の影響

### 継続して動作するもの

1. **既存のデータベースURL**: 転送後も同じURLで接続可能
2. **既存のトークン**: 転送前のトークンは引き続き有効
3. **データ**: すべてのデータは保持されます
4. **レプリカ**: すべてのリージョンのレプリカは維持されます

### 変更が必要なもの

```bash
# 転送後、新しい組織のコンテキストで操作
turso org switch new-organization

# 新しいURLとトークンを取得
turso db show mydb --group transferred-group

# 新しいトークンを生成（推奨）
turso db tokens create mydb
```

## ベストプラクティス

### 1. 転送前の準備

```bash
#!/bin/bash
# pre-transfer-checklist.sh

GROUP_NAME="mygroup"
TARGET_ORG="target-org"

echo "=== Transfer Preparation Checklist ==="

# 1. グループの詳細を確認
echo "1. Source group details:"
turso group show $GROUP_NAME

# 2. データベース一覧を確認
echo "2. Databases in group:"
turso db list --group $GROUP_NAME

# 3. 転送先組織の確認
echo "3. Target organization:"
turso org show $TARGET_ORG

# 4. 権限の確認
echo "4. Checking permissions..."
turso org members list
```

### 2. 転送後の更新手順

```bash
#!/bin/bash
# post-transfer-update.sh

GROUP_NAME="transferred-group"
NEW_ORG="new-org"

# 新しい組織に切り替え
turso org switch $NEW_ORG

# データベース一覧を取得
DATABASES=$(turso db list --group $GROUP_NAME | tail -n +2 | awk '{print $1}')

# 各データベースの新しいトークンを生成
for db in $DATABASES; do
  echo "Generating new token for $db..."
  TOKEN=$(turso db tokens create $db)
  echo "$db: $TOKEN"
done
```

### 3. アプリケーション設定の更新

```bash
# 1. 新しいURLを取得
NEW_URL=$(turso db show mydb --json | jq -r '.Hostname')

# 2. 新しいトークンを生成
NEW_TOKEN=$(turso db tokens create mydb)

# 3. 環境変数を更新
echo "TURSO_DATABASE_URL=$NEW_URL" > .env.production
echo "TURSO_AUTH_TOKEN=$NEW_TOKEN" >> .env.production

# 4. アプリケーションを再起動
```

### 4. 段階的な移行

```bash
#!/bin/bash
# phased-migration.sh

# フェーズ 1: テストグループを転送
echo "Phase 1: Transfer test group"
turso group transfer test-group new-org --yes

# アプリケーションでテスト
echo "Testing application with new organization..."
# テストスクリプトを実行

# フェーズ 2: ステージンググループを転送
echo "Phase 2: Transfer staging group"
turso group transfer staging-group new-org --yes

# 検証
echo "Validating staging environment..."

# フェーズ 3: 本番グループを転送
echo "Phase 3: Transfer production group"
turso group transfer production-group new-org

# 本番環境の更新
echo "Updating production environment..."
```

## エラーハンドリング

### グループが見つからない

```bash
# エラー例
$ turso group transfer nonexistent my-org
Error: group "nonexistent" not found

# 解決策: グループ一覧を確認
turso group list
turso group transfer correct-group-name my-org
```

### 組織が見つからない

```bash
# エラー例
$ turso group transfer mygroup nonexistent-org
Error: organization "nonexistent-org" not found

# 解決策: 組織一覧を確認
turso org list
turso group transfer mygroup correct-org-name
```

### 権限不足

```bash
# エラー例
$ turso group transfer shared-group target-org
Error: insufficient permissions

# 解決策: 権限を確認
# 転送元でのオーナー権限を確認
turso group show shared-group

# 転送先での管理者権限を確認
turso org switch target-org
turso org members list

# 必要に応じて権限をリクエスト
```

### デフォルトグループの転送

```bash
# エラー例
$ turso group transfer default target-org
Error: cannot transfer default group

# 解決策: デフォルトグループは転送できません
# データベースを新しいグループに移動してから転送
```

## 組織間の移行シナリオ

### シナリオ 1: 個人アカウントから組織へ

```bash
# 個人アカウントで開発したグループを会社組織に移行
turso group transfer my-project company-org

# 組織に切り替え
turso org switch company-org

# グループの確認
turso group show my-project
```

### シナリオ 2: 組織の統合

```bash
# 旧組織のグループを新組織に移行
OLD_ORG="old-company"
NEW_ORG="merged-company"

# 旧組織のグループを一覧表示
turso org switch $OLD_ORG
GROUPS=$(turso group list | tail -n +2 | awk '{print $1}')

# 各グループを新組織に転送
for group in $GROUPS; do
  echo "Transferring $group to $NEW_ORG..."
  turso group transfer $group $NEW_ORG --yes
done

# 新組織に切り替えて確認
turso org switch $NEW_ORG
turso group list
```

### シナリオ 3: プロジェクトの譲渡

```bash
# プロジェクトを別の組織に譲渡
PROJECT_GROUP="client-project"
CLIENT_ORG="client-organization"

# 転送前のドキュメント作成
echo "=== Project Transfer Documentation ===" > transfer-docs.txt
turso group show $PROJECT_GROUP >> transfer-docs.txt
turso db list --group $PROJECT_GROUP >> transfer-docs.txt

# 転送実行
turso group transfer $PROJECT_GROUP $CLIENT_ORG

# クライアントに通知
echo "Project has been transferred. Please update your credentials." | mail -s "Project Transfer Complete" client@example.com
```

## 転送後の確認チェックリスト

```bash
#!/bin/bash
# post-transfer-verification.sh

GROUP_NAME=$1
NEW_ORG=$2

echo "=== Post-Transfer Verification ==="

# 1. 組織を切り替え
turso org switch $NEW_ORG

# 2. グループの存在確認
echo "1. Verifying group exists:"
turso group show $GROUP_NAME

# 3. データベースの確認
echo "2. Verifying databases:"
turso db list --group $GROUP_NAME

# 4. 接続テスト
echo "3. Testing database connections:"
DATABASES=$(turso db list --group $GROUP_NAME | tail -n +2 | awk '{print $1}')
for db in $DATABASES; do
  echo "Testing $db..."
  turso db shell $db "SELECT 1" || echo "⚠ Connection failed for $db"
done

echo "Verification completed."
```

## 重要な注意事項

### URLとトークンの更新

転送後も既存のURLとトークンは機能しますが、セキュリティのベストプラクティスとして、できるだけ早く新しいトークンを生成して更新することを推奨します。

```bash
# 転送後、新しいトークンを生成
turso org switch new-org
turso db tokens create mydb

# 古いトークンを無効化（将来の実装で利用可能になる可能性）
# turso db tokens invalidate <old-token>
```

### ダウンタイムの最小化

グループ転送中もデータベースは稼働し続けますが、以下の点に注意：

- 転送処理は通常数秒で完了
- 既存の接続は影響を受けません
- 新しい組織での管理操作が可能になります

## 関連コマンド

- `turso org list` - 組織一覧の表示
- `turso org switch <org-name>` - 組織の切り替え
- `turso group list` - グループ一覧の表示
- `turso group show <group-name>` - グループの詳細表示
- `turso db tokens create <db-name>` - 新しいトークンの生成

## 参考リンク

- [組織管理](../../features/organizations.md)
- [グループの概要](../../features/groups.md)
- [アクセス管理](../../features/access-control.md)
- [CLI リファレンス](../README.md)
