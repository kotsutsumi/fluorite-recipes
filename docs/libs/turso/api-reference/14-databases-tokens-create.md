# Databases API - データベーストークンの作成

データベースに接続するための認証トークンを作成します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/databases/{databaseName}/auth/tokens
```

## リクエスト

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `organizationSlug` | string | はい | 組織のスラッグ |
| `databaseName` | string | はい | データベース名 |

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `expiration` | string | いいえ | 有効期限（デフォルト: "never"） |
| `authorization` | string | いいえ | アクセスレベル: "full-access" または "read-only"（デフォルト: "full-access"） |

### リクエストボディ（オプション）

```typescript
interface CreateTokenRequest {
  permissions?: {
    read_attach?: {
      databases?: string[];  // アタッチ読み取りを許可するデータベース
    };
  };
}
```

## レスポンス

```typescript
interface CreateTokenResponse {
  jwt: string;  // データベース接続用JWTトークン
}
```

### レスポンス例

```json
{
  "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDI0LTAxLTE1VDEwOjMwOjAwWiIsImlkIjoiYWJjMTIzIn0.signature..."
}
```

## 使用例

### cURL

**フルアクセストークン（有効期限なし）**:

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/auth/tokens?expiration=never&authorization=full-access' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

**読み取り専用トークン（7日間有効）**:

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/auth/tokens?expiration=7d&authorization=read-only' \
  -H 'Authorization: Bearer YOUR_API_TOKEN'
```

**アタッチ権限付きトークン**:

```bash
curl -L -X POST 'https://api.turso.tech/v1/organizations/my-org/databases/my-db/auth/tokens' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "permissions": {
      "read_attach": {
        "databases": ["other-db-1", "other-db-2"]
      }
    }
  }'
```

### JavaScript / TypeScript

```typescript
interface TokenOptions {
  expiration?: string;        // "never", "7d", "30d", "1y"
  authorization?: "full-access" | "read-only";
  permissions?: {
    read_attach?: {
      databases?: string[];
    };
  };
}

async function createDatabaseToken(
  organizationSlug: string,
  databaseName: string,
  options: TokenOptions = {}
) {
  const params = new URLSearchParams();
  if (options.expiration) params.set('expiration', options.expiration);
  if (options.authorization) params.set('authorization', options.authorization);

  const url = `https://api.turso.tech/v1/organizations/${organizationSlug}/databases/${databaseName}/auth/tokens?${params}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: options.permissions ? JSON.stringify({ permissions: options.permissions }) : undefined
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.jwt;
}

// フルアクセストークン
const fullAccessToken = await createDatabaseToken('my-org', 'my-db', {
  expiration: 'never',
  authorization: 'full-access'
});

// 読み取り専用トークン（7日間）
const readOnlyToken = await createDatabaseToken('my-org', 'my-db', {
  expiration: '7d',
  authorization: 'read-only'
});

// アタッチ権限付き
const attachToken = await createDatabaseToken('my-org', 'my-db', {
  permissions: {
    read_attach: {
      databases: ['other-db']
    }
  }
});
```

### Turso JavaScript SDK

```typescript
import { createClient } from "@turso/api";

const turso = createClient({
  org: "my-org",
  token: process.env.TURSO_API_TOKEN!,
});

// トークンの作成
const token = await turso.databases.createToken("my-db", {
  expiration: "7d",
  authorization: "read-only"
});

console.log('Database token:', token.jwt);
```

### データベース接続での使用

```typescript
import { createClient as createDbClient } from "@libsql/client";

// データベーストークンを作成
const dbToken = await createDatabaseToken('my-org', 'my-db');

// データベースに接続
const db = createDbClient({
  url: "libsql://my-db-my-org.turso.io",
  authToken: dbToken
});

// クエリを実行
const result = await db.execute("SELECT * FROM users");
console.log(result.rows);
```

## 有効期限のオプション

| 値 | 説明 |
|----|------|
| `never` | 無期限（デフォルト） |
| `7d` | 7日間 |
| `30d` | 30日間 |
| `1y` | 1年間 |
| ISO 8601 | 特定の日時（例: "2024-12-31T23:59:59Z"） |

## 権限レベル

### full-access

すべてのSQL操作が可能：
- SELECT（読み取り）
- INSERT（挿入）
- UPDATE（更新）
- DELETE（削除）
- CREATE TABLE, ALTER TABLE など

### read-only

読み取り操作のみ：
- SELECT
- プリペアドステートメントの読み取り

## ベストプラクティス

### 環境別トークン管理

```typescript
async function setupEnvironmentTokens(
  organizationSlug: string,
  databaseName: string
) {
  const tokens = {
    production: await createDatabaseToken(organizationSlug, databaseName, {
      expiration: 'never',
      authorization: 'full-access'
    }),
    staging: await createDatabaseToken(organizationSlug, databaseName, {
      expiration: '30d',
      authorization: 'full-access'
    }),
    development: await createDatabaseToken(organizationSlug, databaseName, {
      expiration: '7d',
      authorization: 'full-access'
    }),
    readonly: await createDatabaseToken(organizationSlug, databaseName, {
      expiration: 'never',
      authorization: 'read-only'
    })
  };

  console.log('Tokens created for all environments');
  return tokens;
}
```

### トークンの安全な保存

```typescript
import fs from 'fs';

async function saveTokenSecurely(
  organizationSlug: string,
  databaseName: string,
  environment: string
) {
  const token = await createDatabaseToken(organizationSlug, databaseName, {
    expiration: environment === 'production' ? 'never' : '30d'
  });

  // 環境変数ファイルに保存
  const envContent = `TURSO_DB_TOKEN_${environment.toUpperCase()}=${token}\n`;
  fs.appendFileSync(`.env.${environment}`, envContent);

  console.log(`✓ Token saved to .env.${environment}`);
  console.log(`  Add this file to .gitignore!`);
}
```

---

**参考リンク**:
- [データベーストークンの無効化](./15-databases-tokens-invalidate.md)
- [データベースへの接続](./06-databases-create.md)
