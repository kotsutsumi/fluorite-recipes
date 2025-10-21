# Turso API - クイックスタートガイド

このガイドでは、Turso Platform APIを使い始めるための基本的な手順を説明します。最初のAPIコールを実行し、データベースを作成するまでの流れを学びます。

## 前提条件

- Tursoアカウント（無料で作成可能）
- ターミナルまたはコマンドラインへのアクセス
- curl、Node.js、またはお好みのHTTPクライアント

## ステップ1: Turso CLIのインストール

Turso CLIは、認証とトークン管理に使用します。

### macOS / Linux

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### Windows

```powershell
irm get.tur.so/install.ps1 | iex
```

## ステップ2: 認証

### サインアップまたはログイン

新規ユーザーの場合：

```bash
turso auth signup
```

既存ユーザーの場合：

```bash
turso auth login
```

このコマンドを実行すると、ブラウザが開き、認証フローが開始されます。

## ステップ3: 組織スラッグの取得

組織スラッグは、APIリクエストで組織を識別するために使用します。

```bash
turso org list
```

**レスポンス例**:

```
my-organization
```

このスラッグ（例: `my-organization`）を後続のAPIコールで使用します。

## ステップ4: APIトークンの作成

APIトークンは、すべてのAPIリクエストで認証に使用します。

```bash
turso auth api-tokens mint quickstart
```

**レスポンス例**:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**重要**: このトークンは安全に保管してください。トークンは二度と表示されません。

### 環境変数として保存

```bash
export TURSO_API_TOKEN="your-token-here"
export TURSO_ORG_SLUG="your-org-slug"
```

## ステップ5: 最初のAPIコール - ロケーションの取得

利用可能なデータベースロケーションを取得します。

### cURLを使用

```bash
curl -L 'https://api.turso.tech/v1/locations' \
  -H 'Authorization: Bearer TOKEN'
```

環境変数を使用する場合：

```bash
curl -L 'https://api.turso.tech/v1/locations' \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}"
```

### Node.jsを使用

まず、Turso JavaScriptクライアントをインストール：

```bash
npm install @turso/api
```

コード例：

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: process.env.TURSO_ORG_SLUG,
  token: process.env.TURSO_API_TOKEN,
});

// ロケーションのリストを取得
const locations = await turso.locations.list();
console.log(locations);
```

### レスポンス例

```json
{
  "locations": {
    "ams": "Amsterdam, Netherlands",
    "arn": "Stockholm, Sweden",
    "bog": "Bogotá, Colombia",
    "bos": "Boston, Massachusetts (US)",
    "cdg": "Paris, France",
    "den": "Denver, Colorado (US)",
    "dfw": "Dallas, Texas (US)",
    "ewr": "Secaucus, NJ (US)",
    "fra": "Frankfurt, Germany",
    "gdl": "Guadalajara, Mexico",
    "gig": "Rio de Janeiro, Brazil",
    "gru": "Sao Paulo, Brazil",
    "hkg": "Hong Kong, Hong Kong",
    "iad": "Ashburn, Virginia (US)",
    "jnb": "Johannesburg, South Africa",
    "lax": "Los Angeles, California (US)",
    "lhr": "London, United Kingdom",
    "mad": "Madrid, Spain",
    "mia": "Miami, Florida (US)",
    "nrt": "Tokyo, Japan",
    "ord": "Chicago, Illinois (US)",
    "otp": "Bucharest, Romania",
    "qro": "Queretaro, Mexico",
    "scl": "Santiago, Chile",
    "sea": "Seattle, Washington (US)",
    "sin": "Singapore, Singapore",
    "sjc": "San Jose, California (US)",
    "syd": "Sydney, Australia",
    "waw": "Warsaw, Poland",
    "yul": "Montreal, Canada",
    "yyz": "Toronto, Canada"
  }
}
```

## ステップ6: データベースグループの作成

データベースグループは、レプリケーションとロケーション管理を行います。

### cURLを使用

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/{organizationSlug}/groups' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "default",
    "location": "lhr"
  }'
```

実際の例（環境変数を使用）：

```bash
curl -L -X POST "https://api.turso.tech/v1/organizations/${TURSO_ORG_SLUG}/groups" \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "default",
    "location": "lhr"
  }'
```

### Node.jsを使用

```typescript
const group = await turso.groups.create("default", "lhr");
console.log("Group created:", group);
```

### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `name` | string | はい | グループ名（英数字とハイフン） |
| `location` | string | はい | プライマリロケーションコード（例: "lhr", "ams"） |

### レスポンス例

```json
{
  "group": {
    "name": "default",
    "locations": ["lhr"],
    "primary": "lhr",
    "archived": false,
    "version": "0.24.1"
  }
}
```

## ステップ7: データベースの作成

グループ内にデータベースを作成します。

### cURLを使用

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/{organizationSlug}/databases' \
  -H 'Authorization: Bearer TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "my-db",
    "group": "default"
  }'
```

実際の例（環境変数を使用）：

```bash
curl -L -X POST "https://api.turso.tech/v1/organizations/${TURSO_ORG_SLUG}/databases" \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "my-db",
    "group": "default"
  }'
```

### Node.jsを使用

```typescript
const database = await turso.databases.create("my-db", {
  group: "default"
});
console.log("Database created:", database);
```

### リクエストパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `name` | string | はい | データベース名（英数字とハイフン） |
| `group` | string | はい | 所属するグループ名 |
| `seed` | object | いいえ | シードデータベース設定 |
| `size_limit` | string | いいえ | データベースサイズ制限 |

### レスポンス例

```json
{
  "database": {
    "DbId": "abc123def456",
    "Name": "my-db",
    "Hostname": "my-db-my-organization.turso.io",
    "IsSchema": false,
    "block_reads": false,
    "block_writes": false,
    "allow_attach": true,
    "regions": ["lhr"],
    "primaryRegion": "lhr",
    "type": "logical",
    "version": "0.24.1",
    "group": "default"
  }
}
```

## ステップ8: データベース接続トークンの作成

データベースに接続するためのトークンを作成します。

### cURLを使用

```bash
curl -L -X POST "https://api.turso.tech/v1/organizations/${TURSO_ORG_SLUG}/databases/my-db/auth/tokens" \
  -H "Authorization: Bearer ${TURSO_API_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "expiration": "never",
    "authorization": "full-access"
  }'
```

### Node.jsを使用

```typescript
const dbToken = await turso.databases.createToken("my-db", {
  expiration: "never",
  authorization: "full-access"
});
console.log("Database token:", dbToken.jwt);
```

### レスポンス例

```json
{
  "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."
}
```

## ステップ9: データベースに接続

作成したデータベースにSDKを使用して接続します。

### Turso SDK for TypeScript

```bash
npm install @libsql/client
```

```typescript
import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://my-db-my-organization.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."
});

// データベースクエリを実行
const result = await client.execute("SELECT * FROM users");
console.log(result.rows);
```

## 完全なワークフローの例

以下は、データベースの作成から接続までの完全なワークフロー例です：

```typescript
import { createClient } from "@turso/api";
import { createClient as createDbClient } from "@libsql/client";

async function setupDatabase() {
  // APIクライアントの初期化
  const turso = createClient({
    org: process.env.TURSO_ORG_SLUG!,
    token: process.env.TURSO_API_TOKEN!,
  });

  // 1. ロケーションの確認
  const locations = await turso.locations.list();
  console.log("Available locations:", Object.keys(locations.locations));

  // 2. グループの作成
  const group = await turso.groups.create("production", "lhr");
  console.log("Group created:", group.name);

  // 3. データベースの作成
  const database = await turso.databases.create("prod-db", {
    group: "production"
  });
  console.log("Database created:", database.Hostname);

  // 4. データベーストークンの作成
  const dbToken = await turso.databases.createToken("prod-db", {
    expiration: "never",
    authorization: "full-access"
  });

  // 5. データベースに接続
  const dbClient = createDbClient({
    url: `libsql://${database.Hostname}`,
    authToken: dbToken.jwt
  });

  // 6. テーブルの作成
  await dbClient.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 7. データの挿入
  await dbClient.execute({
    sql: "INSERT INTO users (name, email) VALUES (?, ?)",
    args: ["John Doe", "john@example.com"]
  });

  console.log("Database setup complete!");
}

setupDatabase().catch(console.error);
```

## トラブルシューティング

### 401 Unauthorized

トークンが無効または期限切れの場合：

```bash
# 新しいトークンを作成
turso auth api-tokens mint new-token
```

### 409 Conflict

リソースが既に存在する場合：

- 異なる名前を使用
- 既存のリソースを削除してから再作成

### 402 Payment Required

サブスクリプションプランの制限に達した場合：

- プランをアップグレード
- 不要なリソースを削除

## 次のステップ

これで基本的なAPIの使用方法を理解しました。次は以下を確認してください：

1. [認証ガイド](./03-authentication.md) - セキュリティのベストプラクティス
2. [Database APIs](./05-databases-list.md) - データベース管理の詳細
3. [Group APIs](./17-groups-list.md) - レプリケーション管理
4. [Organization APIs](./31-organizations-list.md) - 組織設定の管理

---

**参考リンク**:
- [API Introduction](./01-introduction.md)
- [Authentication](./03-authentication.md)
- [Response Codes](./04-response-codes.md)
