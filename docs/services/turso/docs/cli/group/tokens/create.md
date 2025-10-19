# turso group tokens create - グループトークンの作成

グループ内のすべてのデータベースにアクセスできる認証トークンを生成します。

## 構文

```bash
turso group tokens create <group-name> [flags]
```

## パラメータ

### group-name
- **必須**: はい
- **説明**: トークンを生成するグループの名前
- **形式**: 既存のグループ名

## フラグ

### -e, --expiration
- **説明**: トークンの有効期限を設定
- **値**: `never` または期間（例：`7d`, `24h`, `30d`）
- **デフォルト**: `never`（無期限）
- **形式**: `{days}d{hours}h{minutes}m{seconds}s`

### -r, --read-only
- **説明**: 読み取り専用トークンを生成
- **デフォルト**: false（読み取り・書き込み可能）
- **用途**: 分析、レポート、公開データアクセス

## 使用例

### 基本的な使用方法

```bash
# グループ全体へのフルアクセストークンを生成
turso group tokens create production

# 出力例:
# eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### 読み取り専用トークン

```bash
# 読み取り専用トークンを生成
turso group tokens create production --read-only

# 分析用の読み取り専用トークン
turso group tokens create analytics --read-only

# 公開データアクセス用
turso group tokens create public-data --read-only
```

### 有効期限付きトークン

```bash
# 7日間有効なトークン
turso group tokens create production --expiration 7d

# 24時間有効なトークン
turso group tokens create staging --expiration 24h

# 30日間有効なトークン
turso group tokens create temporary --expiration 30d

# 詳細な期間指定
turso group tokens create test --expiration 7d12h30m
```

### 組み合わせ

```bash
# 読み取り専用 + 有効期限付き
turso group tokens create reports --read-only --expiration 30d

# 一時的なフルアクセス
turso group tokens create migration --expiration 1d

# 長期的な読み取り専用アクセス
turso group tokens create dashboard --read-only --expiration 365d
```

## トークンの用途

### 1. アプリケーション認証

```bash
# 本番環境用トークン
PROD_TOKEN=$(turso group tokens create production)

# 環境変数として設定
echo "TURSO_AUTH_TOKEN=$PROD_TOKEN" >> .env.production
```

```javascript
// Node.js example
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_GROUP_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});
```

### 2. 分析・BIツール

```bash
# 読み取り専用トークンを生成
ANALYTICS_TOKEN=$(turso group tokens create analytics --read-only)

# BIツールに設定
echo "BI_READONLY_TOKEN=$ANALYTICS_TOKEN"
```

### 3. 一時的なアクセス

```bash
# 1日限定のアクセストークン
TEMP_TOKEN=$(turso group tokens create temp-access --expiration 24h)

# 外部パートナーに提供
echo "Temporary access token (valid for 24h): $TEMP_TOKEN"
```

### 4. CI/CD環境

```bash
# CI用の読み取り専用トークン
CI_TOKEN=$(turso group tokens create ci-readonly --read-only --expiration 90d)

# GitHub Secretsに設定
gh secret set TURSO_CI_TOKEN --body "$CI_TOKEN"
```

## ベストプラクティス

### 1. 最小権限の原則

```bash
# 読み取りのみが必要な場合
turso group tokens create analytics --read-only

# 書き込みが必要な場合のみフルアクセス
turso group tokens create backend-api
```

### 2. トークンのローテーション

```bash
#!/bin/bash
# rotate-tokens.sh

GROUP_NAME="production"

# 新しいトークンを生成
NEW_TOKEN=$(turso group tokens create $GROUP_NAME --expiration 90d)

# 環境変数を更新
echo "New token generated. Update your application:"
echo "TURSO_AUTH_TOKEN=$NEW_TOKEN"

# アプリケーションを更新後、古いトークンを無効化
# (invalidateコマンドが利用可能な場合)
```

### 3. 環境別のトークン管理

```bash
#!/bin/bash
# setup-environment-tokens.sh

# 開発環境（無期限、フルアクセス）
DEV_TOKEN=$(turso group tokens create development)
echo "TURSO_AUTH_TOKEN=$DEV_TOKEN" > .env.development

# ステージング環境（90日、フルアクセス）
STAGING_TOKEN=$(turso group tokens create staging --expiration 90d)
echo "TURSO_AUTH_TOKEN=$STAGING_TOKEN" > .env.staging

# 本番環境（90日、フルアクセス）
PROD_TOKEN=$(turso group tokens create production --expiration 90d)
echo "TURSO_AUTH_TOKEN=$PROD_TOKEN" > .env.production

# 分析環境（無期限、読み取り専用）
ANALYTICS_TOKEN=$(turso group tokens create production --read-only)
echo "TURSO_ANALYTICS_TOKEN=$ANALYTICS_TOKEN" > .env.analytics
```

### 4. トークンの安全な保管

```bash
# ❌ 悪い例：トークンをコミット
git add .env
git commit -m "Add database token"  # 危険！

# ✅ 良い例：環境変数として管理
echo ".env*" >> .gitignore
turso group tokens create production > .env.local

# ✅ シークレット管理サービスを使用
TOKEN=$(turso group tokens create production)
aws secretsmanager create-secret \
  --name turso-prod-token \
  --secret-string "$TOKEN"
```

## トークンの有効期限

### 期間の指定形式

```bash
# 日数
turso group tokens create mygroup --expiration 7d    # 7日間
turso group tokens create mygroup --expiration 30d   # 30日間
turso group tokens create mygroup --expiration 365d  # 1年間

# 時間
turso group tokens create mygroup --expiration 24h   # 24時間
turso group tokens create mygroup --expiration 72h   # 72時間

# 組み合わせ
turso group tokens create mygroup --expiration 7d12h     # 7日12時間
turso group tokens create mygroup --expiration 30d8h30m  # 30日8時間30分

# 無期限
turso group tokens create mygroup --expiration never
turso group tokens create mygroup  # デフォルトでnever
```

### 推奨する有効期限

```bash
# 開発環境: 無期限または長期
turso group tokens create dev

# CI/CD: 90日（定期的にローテーション）
turso group tokens create ci --expiration 90d

# 本番環境: 90日（定期的にローテーション）
turso group tokens create prod --expiration 90d

# 一時的なアクセス: 短期
turso group tokens create temp --expiration 24h

# 分析・レポート: 長期、読み取り専用
turso group tokens create analytics --read-only --expiration 365d
```

## セキュリティ考慮事項

### 1. トークンの保護

```bash
# トークンを環境変数として保存
export TURSO_AUTH_TOKEN=$(turso group tokens create production)

# ファイル権限を制限
chmod 600 .env.production

# トークンを表示しない（ログに残さない）
turso group tokens create production > /dev/null 2>&1
```

### 2. 読み取り専用トークンの活用

```bash
# 外部サービスには読み取り専用を提供
PUBLIC_TOKEN=$(turso group tokens create public --read-only)

# 分析ツールには読み取り専用
METABASE_TOKEN=$(turso group tokens create analytics --read-only)
```

### 3. 短命トークンの使用

```bash
# メンテナンス作業用の短命トークン
MAINT_TOKEN=$(turso group tokens create prod --expiration 4h)

# スクリプト実行用の一時トークン
SCRIPT_TOKEN=$(turso group tokens create temp --expiration 1h)
```

## エラーハンドリング

### グループが見つからない

```bash
# エラー例
$ turso group tokens create nonexistent
Error: group "nonexistent" not found

# 解決策
turso group list
turso group tokens create correct-group-name
```

### 無効な有効期限

```bash
# エラー例
$ turso group tokens create mygroup --expiration invalid
Error: invalid expiration format

# 解決策
turso group tokens create mygroup --expiration 7d
turso group tokens create mygroup --expiration 24h
turso group tokens create mygroup --expiration never
```

### 権限不足

```bash
# エラー例
$ turso group tokens create shared-group
Error: insufficient permissions

# 解決策: グループへのアクセス権限が必要
turso org members list
```

## トークンの管理

### トークンのテスト

```bash
# トークンを生成
TOKEN=$(turso group tokens create test-group)

# トークンをテスト
export TURSO_AUTH_TOKEN=$TOKEN
turso db shell mydb "SELECT 1;"

# 読み取り専用トークンのテスト
RO_TOKEN=$(turso group tokens create test-group --read-only)
export TURSO_AUTH_TOKEN=$RO_TOKEN
turso db shell mydb "SELECT * FROM users;"  # OK
turso db shell mydb "INSERT INTO users VALUES (1);"  # エラー
```

### トークンの保存と取得

```bash
#!/bin/bash
# token-manager.sh

TOKEN_DIR="$HOME/.turso/tokens"
mkdir -p "$TOKEN_DIR"

# トークンを生成して保存
generate_token() {
  local group=$1
  local name=$2
  local token=$(turso group tokens create $group)

  echo "$token" > "$TOKEN_DIR/$name.token"
  chmod 600 "$TOKEN_DIR/$name.token"

  echo "Token saved to $TOKEN_DIR/$name.token"
}

# トークンを取得
get_token() {
  local name=$1
  cat "$TOKEN_DIR/$name.token"
}

# 使用例
generate_token production prod-token
export TURSO_AUTH_TOKEN=$(get_token prod-token)
```

## グループトークン vs データベーストークン

### グループトークン

```bash
# グループ内のすべてのデータベースにアクセス可能
turso group tokens create production

# 用途:
# - マイクロサービスアーキテクチャ
# - 複数のデータベースを使用するアプリ
# - グループレベルの管理
```

### データベーストークン

```bash
# 特定のデータベースのみにアクセス可能
turso db tokens create mydb

# 用途:
# - 単一データベースアプリ
# - より厳格なアクセス制御
# - データベース固有の権限
```

## 自動化の例

### デプロイスクリプト

```bash
#!/bin/bash
# deploy-with-token.sh

ENV=$1  # production, staging, development
GROUP_NAME=$ENV

# トークンを生成
echo "Generating token for $ENV environment..."
TOKEN=$(turso group tokens create $GROUP_NAME --expiration 90d)

# 環境変数ファイルを更新
echo "TURSO_AUTH_TOKEN=$TOKEN" > .env.$ENV

# デプロイ
echo "Deploying to $ENV..."
npm run deploy:$ENV

echo "Deployment completed with new token"
```

### CI/CD統合

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Turso CLI
        run: curl -sSfL https://get.tur.so/install.sh | bash

      - name: Generate group token
        run: |
          TOKEN=$(turso group tokens create production --expiration 90d)
          echo "::add-mask::$TOKEN"
          echo "TURSO_AUTH_TOKEN=$TOKEN" >> $GITHUB_ENV

      - name: Deploy
        run: npm run deploy
        env:
          TURSO_AUTH_TOKEN: ${{ env.TURSO_AUTH_TOKEN }}
```

## 関連コマンド

- `turso group tokens invalidate <group-name>` - グループトークンの無効化
- `turso db tokens create <db-name>` - データベーストークンの作成
- `turso db tokens invalidate <db-name>` - データベーストークンの無効化
- `turso group show <group-name>` - グループの詳細表示

## 参考リンク

- [認証とトークン](../../features/authentication.md)
- [セキュリティベストプラクティス](../../help/security.md)
- [グループの概要](../../features/groups.md)
- [CLI リファレンス](../README.md)
