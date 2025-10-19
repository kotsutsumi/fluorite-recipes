# turso db show - データベース詳細表示

Turso CLIの`turso db show`コマンドは、指定したデータベースの詳細情報を表示します。データベースの設定、ロケーション、サイズ、接続URLなどの情報を確認できます。

## 📚 目次

- [基本構文](#基本構文)
- [オプション](#オプション)
- [表示される情報](#表示される情報)
- [使用例](#使用例)
- [ベストプラクティス](#ベストプラクティス)
- [関連コマンド](#関連コマンド)

## 基本構文

```bash
turso db show <データベース名> [オプション]
```

### パラメータ

- `データベース名` (必須): 詳細を表示するデータベースの名前

## オプション

### `--url`

データベースのHTTP API URLを表示します。

```bash
turso db show my-database --url
```

### `--http-url`

HTTP URLを表示します（`--url`と同じ機能）。

```bash
turso db show my-database --http-url
```

### `-h, --help`

ヘルプ情報を表示します。

```bash
turso db show --help
```

## 表示される情報

### 基本情報

`turso db show`コマンドは以下の情報を表示します:

```typescript
interface DatabaseInfo {
  name: string;              // データベース名
  id: string;                // データベースID (UUID)
  version: string;           // libSQLサーバーバージョン
  group: string;             // 所属グループ名
  size: string;              // データベースサイズ
  location: string;          // プライマリロケーション
}
```

### 出力例

```
Name:     my-database
ID:       1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
Version:  libsql-server-0.24.1
Group:    production
Size:     42.3 MB
Location: nrt (Tokyo)
```

## 使用例

### 基本的な使用

#### データベース情報の表示

```bash
turso db show my-database
```

**出力:**
```
Name:     my-database
ID:       abc123def456
Version:  libsql-server-0.24.1
Group:    default
Size:     15.7 MB
Location: nrt (Tokyo)
```

#### 接続URLの取得

```bash
turso db show my-database --url
```

**出力:**
```
libsql://my-database-username.turso.io
```

この URLをアプリケーションの接続設定に使用します。

### 複数のデータベース情報を確認

```bash
# 本番データベースの情報
turso db show production-db

# 開発データベースの情報
turso db show dev-db

# ステージングデータベースの情報
turso db show staging-db
```

### スクリプトでの使用

#### 接続URLを環境変数に設定

```bash
#!/bin/bash

# データベースURLを取得
DB_URL=$(turso db show my-database --url)

# 環境変数に設定
export DATABASE_URL="$DB_URL"

# アプリケーションを起動
npm start
```

#### 複数データベースの情報を収集

```bash
#!/bin/bash

# データベース一覧を取得
databases=$(turso db list | tail -n +2 | awk '{print $1}')

# 各データベースの詳細を表示
for db in $databases; do
  echo "=== $db ==="
  turso db show "$db"
  echo ""
done
```

### CI/CD での使用

```bash
#!/bin/bash

# デプロイ前にデータベース情報を確認
echo "Checking database configuration..."

# データベースの存在確認
if turso db show production-db > /dev/null 2>&1; then
  echo "Database exists"

  # URL を取得して設定ファイルに書き込み
  DB_URL=$(turso db show production-db --url)
  echo "DATABASE_URL=$DB_URL" >> .env.production

  echo "Database configuration completed"
else
  echo "Error: Database not found"
  exit 1
fi
```

## 詳細情報の解釈

### データベースID

```typescript
interface DatabaseID {
  format: "UUID";
  uniqueness: "グローバルに一意";
  usage: "APIリクエスト、内部参照";
}
```

**例:**
```
ID: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p
```

### libSQLバージョン

```typescript
interface LibSQLVersion {
  format: "libsql-server-X.Y.Z";
  compatibility: "SQLite 3.x ベース";
  updates: "自動更新または手動管理";
}
```

**例:**
```
Version: libsql-server-0.24.1
```

このバージョン情報は、使用可能な機能や互換性を確認する際に重要です。

### データベースサイズ

```typescript
interface DatabaseSize {
  units: ["B", "KB", "MB", "GB"];
  calculation: "実際のデータ + インデックス + メタデータ";
  monitoring: "課金やパフォーマンスに影響";
}
```

**例:**
```
Size: 42.3 MB
Size: 1.2 GB
Size: 512 KB
```

### ロケーション

```typescript
interface Location {
  format: "3文字コード (都市名)";
  examples: {
    nrt: "Tokyo (東京)";
    lax: "Los Angeles (ロサンゼルス)";
    fra: "Frankfurt (フランクフルト)";
    sin: "Singapore (シンガポール)";
  };
}
```

**例:**
```
Location: nrt (Tokyo)
```

## 接続URLの取得と使用

### URLフォーマット

```typescript
interface ConnectionURL {
  format: "libsql://[database]-[org].turso.io";
  protocol: "libsql" | "https";
  authentication: "トークンが必要";
}
```

### アプリケーションでの使用

#### Node.js / TypeScript

```typescript
import { createClient } from '@libsql/client';

// URLを取得: turso db show my-db --url
const url = 'libsql://my-db-myorg.turso.io';

// トークンを取得: turso db tokens create my-db
const authToken = 'eyJ...';

const client = createClient({
  url,
  authToken,
});
```

#### 環境変数での管理

```bash
# URLを取得して環境変数に設定
export DATABASE_URL=$(turso db show my-database --url)
export DATABASE_AUTH_TOKEN=$(turso db tokens create my-database)

# .env ファイルに保存
echo "DATABASE_URL=$(turso db show my-database --url)" > .env
echo "DATABASE_AUTH_TOKEN=$(turso db tokens create my-database)" >> .env
```

#### Python

```python
import os
from libsql_client import create_client

# URLを環境変数から取得
url = os.getenv('DATABASE_URL')
auth_token = os.getenv('DATABASE_AUTH_TOKEN')

client = create_client(
    url=url,
    auth_token=auth_token
)
```

## ベストプラクティス

### 1. 定期的な情報確認

データベースの状態を定期的に確認:

```bash
# 日次チェックスクリプト
#!/bin/bash

echo "Daily Database Check - $(date)"
echo "================================"

# 本番データベースの状態確認
turso db show production-db

# サイズの監視
SIZE=$(turso db show production-db | grep "Size:" | awk '{print $2, $3}')
echo "Current size: $SIZE"

# アラートの設定（例: 1GBを超えた場合）
if [[ $SIZE =~ "GB" ]]; then
  echo "WARNING: Database size exceeds 1GB"
fi
```

### 2. バージョン管理

libSQLバージョンを記録してトラッキング:

```bash
#!/bin/bash

# バージョン情報をファイルに記録
turso db show my-database | grep "Version:" >> version-history.txt
```

### 3. URL の安全な管理

接続URLは機密情報として扱う:

```bash
# URLを安全に取得して環境変数に設定
DB_URL=$(turso db show my-database --url)

# .env ファイルに保存（.gitignore に追加済みであることを確認）
echo "DATABASE_URL=$DB_URL" > .env.local

# パーミッションを制限
chmod 600 .env.local
```

### 4. 自動化スクリプトでの検証

デプロイ前にデータベースの状態を検証:

```bash
#!/bin/bash

DB_NAME="production-db"

# データベースの存在確認
if ! turso db show "$DB_NAME" > /dev/null 2>&1; then
  echo "Error: Database $DB_NAME not found"
  exit 1
fi

# サイズチェック
SIZE_LINE=$(turso db show "$DB_NAME" | grep "Size:")
echo "Database size: $SIZE_LINE"

# グループ確認
GROUP=$(turso db show "$DB_NAME" | grep "Group:" | awk '{print $2}')
if [ "$GROUP" != "production" ]; then
  echo "Warning: Database is not in production group"
fi

echo "Database validation completed"
```

### 5. ドキュメント化

データベース情報をドキュメントに記録:

```bash
#!/bin/bash

# データベース情報をMarkdownファイルに出力
cat > database-info.md <<EOF
# Database Information

Generated: $(date)

## Production Database

\`\`\`
$(turso db show production-db)
\`\`\`

## Connection Details

- URL: \`$(turso db show production-db --url)\`
- Group: production
- Location: Tokyo (nrt)

EOF
```

## トラブルシューティング

### エラー: "database not found"

**原因**: 指定したデータベースが存在しない、または名前が間違っている

**解決方法**:

```bash
# データベース一覧を確認
turso db list

# 正しいデータベース名で再実行
turso db show <正しいデータベース名>
```

### エラー: "permission denied"

**原因**: データベースへのアクセス権限がない

**解決方法**:

```bash
# 現在の組織を確認
turso org list

# 適切な組織に切り替え
turso org switch <組織名>

# 再度実行
turso db show my-database
```

### 情報が古い場合

**原因**: キャッシュされた情報が表示されている可能性

**解決方法**:

```bash
# 最新情報を取得するため、再度実行
turso db show my-database

# または inspect コマンドで詳細情報を取得
turso db inspect my-database --verbose
```

## 出力のパース

### シェルスクリプトでのパース

```bash
#!/bin/bash

DB_NAME="my-database"

# 各フィールドを個別に取得
DB_ID=$(turso db show $DB_NAME | grep "ID:" | awk '{print $2}')
DB_VERSION=$(turso db show $DB_NAME | grep "Version:" | awk '{print $2}')
DB_GROUP=$(turso db show $DB_NAME | grep "Group:" | awk '{print $2}')
DB_SIZE=$(turso db show $DB_NAME | grep "Size:" | awk '{print $2, $3}')
DB_LOCATION=$(turso db show $DB_NAME | grep "Location:" | awk '{print $2, $3}')

echo "Database Details:"
echo "  ID: $DB_ID"
echo "  Version: $DB_VERSION"
echo "  Group: $DB_GROUP"
echo "  Size: $DB_SIZE"
echo "  Location: $DB_LOCATION"
```

### JSON形式での使用（将来的）

現在はテキスト形式のみですが、将来的にはJSON出力がサポートされる可能性があります:

```bash
# 将来的な使用例
turso db show my-database --format json | jq '.size'
```

## パフォーマンスモニタリング

### サイズトラッキング

```bash
#!/bin/bash

# データベースサイズを記録
echo "$(date +%Y-%m-%d),$(turso db show production-db | grep 'Size:' | awk '{print $2}')" >> db-size-log.csv

# 月次レポート生成
cat db-size-log.csv
```

### ロケーション最適化の確認

```bash
# データベースのロケーションを確認
turso db show my-database | grep "Location:"

# レイテンシを確認
turso db locations --show-latencies
```

## 関連コマンド

- [`turso db list`](./db-list.md) - データベース一覧を表示
- [`turso db inspect`](./db-inspect.md) - データベース使用状況を詳細表示
- [`turso db create`](./db-create.md) - 新しいデータベースを作成
- [`turso db tokens create`](./db-tokens-create.md) - 認証トークンを作成
- [`turso db locations`](./db-locations.md) - 利用可能なロケーションを表示

## 参考リンク

- [Turso データベース管理](https://docs.turso.tech/concepts/databases)
- [接続方法](https://docs.turso.tech/sdk)
- [libSQL について](https://docs.turso.tech/libsql)

---

**更新日**: 2025-10-19
**CLIバージョン**: 最新版に対応
