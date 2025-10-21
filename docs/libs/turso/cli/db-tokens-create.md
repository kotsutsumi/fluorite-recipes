# turso db tokens create - データベース認証トークンの作成

Turso CLIの`turso db tokens create`コマンドは、特定のデータベースに接続するための認証トークンを生成します。このトークンはアプリケーションからデータベースにアクセスする際に必要です。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [使用例](#使用例)
- [トークンの種類と用途](#トークンの種類と用途)
- [セキュリティのベストプラクティス](#セキュリティのベストプラクティス)
- [トークンのライフサイクル管理](#トークンのライフサイクル管理)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db tokens create <データベース名> [オプション]
```

### パラメータ

- `データベース名` (必須): トークンを生成するデータベースの名前

## オプション

### `-r, --read-only`

読み取り専用アクセスに制限されたトークンを作成します。

```bash
turso db tokens create my-database --read-only
```

**用途**: 分析ツール、レポート作成、公開データの提供など

### `-e, --expiration <期間>`

トークンの有効期限を設定します。

```bash
turso db tokens create my-database --expiration 7d
```

**フォーマット**:
- `never` - 無期限（デフォルト）
- `Xd` - X日間（例: `7d`, `30d`）
- `Xh` - X時間（例: `24h`, `48h`）
- `Xm` - X分（例: `30m`, `60m`）
- `Xs` - X秒（例: `3600s`）
- 組み合わせ可能: `7d3h2m1s`

### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db tokens create --help
```

## 使用例

### 基本的なトークン作成

#### 無期限の読み書きトークン

```bash
turso db tokens create my-database
```

**出力例:**

```
eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDk4MjM2MDAsImV4cCI6bnVsbCwiZGIiOiJteS1kYXRhYmFzZSJ9.xxx
```

このトークンは無期限に有効で、読み書き両方の操作が可能です。

#### 読み取り専用トークン

```bash
turso db tokens create my-database --read-only
```

データの読み取りのみが許可されるトークンが生成されます。

#### 有効期限付きトークン

```bash
# 7日間有効
turso db tokens create my-database --expiration 7d

# 24時間有効
turso db tokens create my-database --expiration 24h

# 30分有効
turso db tokens create my-database --expiration 30m
```

#### 複雑な有効期限

```bash
# 7日3時間2分1秒有効
turso db tokens create my-database --expiration 7d3h2m1s
```

### 環境別のトークン管理

#### 開発環境用トークン

```bash
#!/bin/bash

DB_NAME="dev-database"

# 開発用の無期限トークン（ローカル開発用）
DEV_TOKEN=$(turso db tokens create "$DB_NAME")

echo "Development token created"
echo "Add to .env.local:"
echo "DATABASE_AUTH_TOKEN=$DEV_TOKEN"
```

#### 本番環境用トークン

```bash
#!/bin/bash

DB_NAME="production-db"

# 本番用の読み書きトークン（無期限だが定期ローテーション推奨）
PROD_TOKEN=$(turso db tokens create "$DB_NAME")

echo "Production token created"
echo "Store securely in your secrets management system"
```

#### ステージング環境用トークン

```bash
#!/bin/bash

DB_NAME="staging-db"

# 30日で自動失効するトークン
STAGING_TOKEN=$(turso db tokens create "$DB_NAME" --expiration 30d)

echo "Staging token created (expires in 30 days)"
echo "DATABASE_AUTH_TOKEN=$STAGING_TOKEN"
```

### 用途別トークン

#### 分析・レポート用（読み取り専用）

```bash
# BIツール用の読み取り専用トークン
turso db tokens create analytics-db --read-only
```

#### 一時アクセス用

```bash
# サポートチーム用の24時間限定トークン
turso db tokens create support-db --expiration 24h --read-only
```

#### テスト用

```bash
# E2Eテスト用の1時間限定トークン
turso db tokens create test-db --expiration 1h
```

## トークンの種類と用途

### 読み書きトークン

```typescript
interface ReadWriteToken {
  permissions: {
    read: true;
    write: true;
    schema: true;  // テーブル作成・変更
  };
  useCases: [
    "アプリケーションバックエンド",
    "マイグレーションスクリプト",
    "管理ツール"
  ];
  security: {
    risk: "高";
    storage: "安全な環境変数またはシークレット管理";
    rotation: "定期的なローテーション推奨";
  };
}
```

**作成例:**

```bash
# アプリケーション用
turso db tokens create app-db

# 管理ツール用（期限付き）
turso db tokens create app-db --expiration 90d
```

### 読み取り専用トークン

```typescript
interface ReadOnlyToken {
  permissions: {
    read: true;
    write: false;
    schema: false;
  };
  useCases: [
    "分析ツール（Metabase, Grafana）",
    "レポート生成",
    "データエクスポート",
    "公開API"
  ];
  security: {
    risk: "中";
    exposure: "限定的な露出が可能";
    monitoring: "アクセスログの監視推奨";
  };
}
```

**作成例:**

```bash
# 分析ツール用
turso db tokens create analytics-db --read-only

# 公開データAPI用
turso db tokens create public-data --read-only --expiration never
```

## トークンの使用

### アプリケーション統合

#### Node.js / TypeScript

```typescript
import { createClient } from '@libsql/client';

const client = createClient({
  url: 'libsql://my-database-org.turso.io',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

// 使用例
const result = await client.execute('SELECT * FROM users');
```

#### Python

```python
import os
from libsql_client import create_client

client = create_client(
    url='libsql://my-database-org.turso.io',
    auth_token=os.environ['DATABASE_AUTH_TOKEN']
)

# 使用例
result = client.execute('SELECT * FROM users')
```

#### Rust

```rust
use libsql_client::Client;

let client = Client::from_config(Config {
    url: "libsql://my-database-org.turso.io".to_string(),
    auth_token: Some(std::env::var("DATABASE_AUTH_TOKEN")?),
})?;

// 使用例
let result = client.query("SELECT * FROM users", &[]).await?;
```

### 環境変数での管理

#### .env ファイル

```bash
#!/bin/bash

DB_NAME="my-database"
ENV_FILE=".env.production"

# データベースURLを取得
DB_URL=$(turso db show "$DB_NAME" --url)

# トークンを生成
AUTH_TOKEN=$(turso db tokens create "$DB_NAME")

# .env ファイルに書き込み
cat > "$ENV_FILE" <<EOF
DATABASE_URL=$DB_URL
DATABASE_AUTH_TOKEN=$AUTH_TOKEN
EOF

# パーミッションを制限
chmod 600 "$ENV_FILE"

echo "Credentials saved to $ENV_FILE"
```

#### Docker での使用

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .

# 環境変数として渡される
ENV DATABASE_URL=${DATABASE_URL}
ENV DATABASE_AUTH_TOKEN=${DATABASE_AUTH_TOKEN}

RUN npm install
CMD ["npm", "start"]
```

```bash
# docker-compose.yml での使用
services:
  app:
    build: .
    environment:
      DATABASE_URL: ${DATABASE_URL}
      DATABASE_AUTH_TOKEN: ${DATABASE_AUTH_TOKEN}
```

### CI/CD での使用

#### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate Turso Token
        run: |
          TOKEN=$(turso db tokens create production-db --expiration 1h)
          echo "::add-mask::$TOKEN"
          echo "TURSO_TOKEN=$TOKEN" >> $GITHUB_ENV

      - name: Run Tests
        env:
          DATABASE_AUTH_TOKEN: ${{ env.TURSO_TOKEN }}
        run: npm test

      - name: Deploy
        env:
          DATABASE_AUTH_TOKEN: ${{ env.TURSO_TOKEN }}
        run: npm run deploy
```

#### GitLab CI

```yaml
deploy:
  script:
    - export TURSO_TOKEN=$(turso db tokens create production-db --expiration 1h)
    - npm test
    - npm run deploy
  variables:
    DATABASE_AUTH_TOKEN: $TURSO_TOKEN
```

## セキュリティのベストプラクティス

### 1. トークンの安全な保管

```typescript
interface TokenStorageBestPractices {
  development: {
    storage: ".env.local (gitignore済み)";
    sharing: "開発チーム内のみ";
    rotation: "月次または必要時";
  };
  staging: {
    storage: "CI/CDシークレット";
    access: "制限されたチームメンバー";
    rotation: "月次";
  };
  production: {
    storage: "Secrets Manager (AWS/GCP/Azure)";
    access: "最小権限の原則";
    rotation: "週次または月次";
    monitoring: "使用状況の監視";
  };
}
```

**実装例:**

```bash
#!/bin/bash

# AWS Secrets Manager に保存
DB_NAME="production-db"
TOKEN=$(turso db tokens create "$DB_NAME" --expiration 30d)

aws secretsmanager create-secret \
  --name turso-production-token \
  --secret-string "$TOKEN"

echo "Token securely stored in AWS Secrets Manager"
```

### 2. 最小権限の原則

```bash
#!/bin/bash

# 用途に応じて適切な権限のトークンを使用

# アプリケーション: 読み書き
turso db tokens create app-db > app-token.txt

# 分析ツール: 読み取りのみ
turso db tokens create app-db --read-only > analytics-token.txt

# サポート: 読み取りのみ + 有効期限
turso db tokens create app-db --read-only --expiration 24h > support-token.txt
```

### 3. トークンの定期ローテーション

```bash
#!/bin/bash

# トークンローテーションスクリプト
DB_NAME="production-db"
SECRET_NAME="turso-prod-token"

echo "Rotating token for $DB_NAME..."

# 新しいトークンを生成
NEW_TOKEN=$(turso db tokens create "$DB_NAME" --expiration 30d)

# Secrets Manager を更新
aws secretsmanager update-secret \
  --secret-id "$SECRET_NAME" \
  --secret-string "$NEW_TOKEN"

echo "Token rotated successfully"
echo "Remember to restart applications to use the new token"
```

### 4. トークンの失効

```typescript
interface TokenRevocation {
  methods: {
    expiration: "有効期限の設定（推奨）";
    regeneration: "新しいトークンの生成で旧トークンを無効化";
    databaseRotation: "データベース自体の再作成（最終手段）";
  };
  whenToRevoke: [
    "トークンの漏洩が疑われる",
    "チームメンバーの退職",
    "サードパーティツールの使用終了",
    "定期的なセキュリティローテーション"
  ];
}
```

**トークン失効の実践:**

```bash
#!/bin/bash

# トークンが漏洩した場合の対応
DB_NAME="compromised-db"

echo "Security incident detected!"
echo "1. Generating new token..."
NEW_TOKEN=$(turso db tokens create "$DB_NAME" --expiration 30d)

echo "2. Updating production secrets..."
# 本番環境のシークレットを更新

echo "3. Deploying applications with new token..."
# アプリケーションを再デプロイ

echo "4. Old tokens will stop working once applications restart"
echo "Security incident resolved"
```

### 5. 環境分離

```bash
#!/bin/bash

# 環境ごとに異なるトークンを使用
declare -A ENVIRONMENTS=(
  ["development"]="dev-db"
  ["staging"]="staging-db"
  ["production"]="prod-db"
)

for env in "${!ENVIRONMENTS[@]}"; do
  DB_NAME="${ENVIRONMENTS[$env]}"

  echo "Creating token for $env environment..."

  # 開発環境は無期限、それ以外は期限付き
  if [ "$env" = "development" ]; then
    TOKEN=$(turso db tokens create "$DB_NAME")
  else
    TOKEN=$(turso db tokens create "$DB_NAME" --expiration 30d)
  fi

  # 環境別ファイルに保存
  echo "DATABASE_AUTH_TOKEN=$TOKEN" > ".env.$env"
  chmod 600 ".env.$env"

  echo "✓ $env token created"
done
```

## トークンのライフサイクル管理

### トークン追跡システム

```bash
#!/bin/bash

# トークン管理ログ
LOG_FILE="token-management.log"

log_token_creation() {
  local db_name=$1
  local token_type=$2
  local expiration=$3
  local purpose=$4

  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | CREATE | DB:$db_name | TYPE:$token_type | EXP:$expiration | PURPOSE:$purpose" >> "$LOG_FILE"
}

# 使用例
DB_NAME="production-db"
TOKEN=$(turso db tokens create "$DB_NAME" --expiration 30d)
log_token_creation "$DB_NAME" "read-write" "30d" "production-app"
```

### 有効期限の監視

```bash
#!/bin/bash

# トークン有効期限の監視スクリプト
TOKEN_REGISTRY="token-registry.txt"

# トークン情報を記録
# フォーマット: db_name,token_type,created_date,expiration_days,purpose

warn_expiring_tokens() {
  local warn_days=7

  while IFS=',' read -r db_name token_type created expiration purpose; do
    if [ "$expiration" != "never" ]; then
      # 有効期限を計算
      exp_days=$(echo "$expiration" | grep -oE '[0-9]+')
      created_epoch=$(date -d "$created" +%s)
      expire_epoch=$((created_epoch + exp_days * 86400))
      current_epoch=$(date +%s)
      days_left=$(( (expire_epoch - current_epoch) / 86400 ))

      if [ "$days_left" -le "$warn_days" ] && [ "$days_left" -ge 0 ]; then
        echo "WARNING: Token for $db_name ($purpose) expires in $days_left days"
      fi
    fi
  done < "$TOKEN_REGISTRY"
}

# 毎日実行（crontab）
warn_expiring_tokens
```

### 自動ローテーション

```bash
#!/bin/bash

# トークンの自動ローテーション（月次）
ROTATION_CONFIG="rotation-config.json"

# 設定例:
# {
#   "production-db": {"interval": 30, "type": "read-write"},
#   "analytics-db": {"interval": 90, "type": "read-only"}
# }

rotate_tokens() {
  # 設定を読み込んでトークンをローテーション
  # Secrets Manager を更新
  # アプリケーションに通知
  echo "Automatic token rotation completed"
}

# crontab: 毎月1日の午前2時に実行
# 0 2 1 * * /path/to/rotate_tokens.sh
```

## トラブルシューティング

### エラー: "invalid token"

**原因:**
- トークンが期限切れ
- トークンがコピー時に切れている
- 間違ったデータベース用のトークン

**解決方法:**

```bash
# 新しいトークンを生成
NEW_TOKEN=$(turso db tokens create my-database)

# 環境変数を更新
export DATABASE_AUTH_TOKEN="$NEW_TOKEN"

# アプリケーションを再起動
```

### エラー: "permission denied"

**原因:**
- 読み取り専用トークンで書き込み操作を試行

**解決方法:**

```bash
# 読み書き可能なトークンを生成
turso db tokens create my-database
```

### トークンが機能しない

**確認事項:**

```bash
# 1. トークンが完全にコピーされているか確認
echo "$DATABASE_AUTH_TOKEN" | wc -c

# 2. データベース名が正しいか確認
turso db show my-database

# 3. 新しいトークンを生成してテスト
TEST_TOKEN=$(turso db tokens create my-database --expiration 1h)
# このトークンでテスト
```

## パフォーマンス考慮事項

### トークンのキャッシュ

```typescript
interface TokenCaching {
  strategy: {
    appLevel: "アプリケーション起動時に1回読み込み";
    noRuntimeGeneration: "実行時にトークンを生成しない";
    secretsCache: "Secrets Managerからのキャッシュ";
  };
  refresh: {
    trigger: "有効期限の7日前";
    method: "ローリング更新";
    fallback: "旧トークンの一時的な有効化";
  };
}
```

## 関連コマンド

- [`turso db show`](./db-show.md) - データベースURLの取得
- [`turso db create`](./db-create.md) - 新しいデータベースの作成
- [`turso db shell`](./db-shell.md) - データベースへの接続
- [`turso auth login`](./auth-login.md) - Tursoへの認証

## 参考リンク

- [Turso 認証ガイド](https://docs.turso.tech/sdk/authentication)
- [セキュリティベストプラクティス](https://docs.turso.tech/guides/security)
- [トークン管理](https://docs.turso.tech/concepts/tokens)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
