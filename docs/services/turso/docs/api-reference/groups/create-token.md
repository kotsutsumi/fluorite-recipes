# グループトークンの作成 - Turso API リファレンス

指定されたグループの認証トークン（JWT）を生成します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/groups/{groupName}/auth/tokens
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `organizationSlug` | string | ✓ | 組織またはユーザーアカウントのスラッグ |
| `groupName` | string | ✓ | グループの名前 |

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 | デフォルト |
|-----------|-----|------|------|----------|
| `expiration` | string | - | トークンの有効期限（例: "1h", "24h", "7d"） | never（無期限） |
| `authorization` | string | - | アクセスレベル（"full-access" または "read-only"） | full-access |

### リクエストボディ（オプション）

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `permissions` | object | - | 特定のデータベースへのアクセス許可 |
| `permissions.read_attach` | object | - | 読み取り専用でアタッチ可能なデータベース |
| `permissions.read_attach.databases` | string[] | - | データベース名の配列 |

## TypeScript インターフェース

```typescript
interface CreateTokenRequest {
  permissions?: {
    read_attach?: {
      databases: string[];
    };
  };
}

interface CreateTokenResponse {
  jwt: string;
}

interface ErrorResponse {
  error: string;
}

type Authorization = 'full-access' | 'read-only';
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "jwt": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."
}
```

### エラー時

#### 400 Bad Request

```json
{
  "error": "Invalid expiration format"
}
```

#### 404 Not Found

```json
{
  "error": "group not found"
}
```

## コード例

### cURL

```bash
# 基本的なトークン生成
curl -X POST "https://api.turso.tech/v1/organizations/my-org/groups/production/auth/tokens" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"

# 有効期限付きトークン
curl -X POST "https://api.turso.tech/v1/organizations/my-org/groups/production/auth/tokens?expiration=24h" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"

# 読み取り専用トークン
curl -X POST "https://api.turso.tech/v1/organizations/my-org/groups/production/auth/tokens?authorization=read-only" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"

# 特定のデータベースへのアクセスを許可
curl -X POST "https://api.turso.tech/v1/organizations/my-org/groups/production/auth/tokens" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": {
      "read_attach": {
        "databases": ["db1", "db2"]
      }
    }
  }'
```

### JavaScript

```javascript
const createGroupToken = async (
  orgSlug,
  groupName,
  options = {}
) => {
  const { expiration, authorization, permissions } = options;

  const params = new URLSearchParams();
  if (expiration) params.append('expiration', expiration);
  if (authorization) params.append('authorization', authorization);

  const url = `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/auth/tokens?${params}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: permissions ? JSON.stringify({ permissions }) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
};

// 使用例
// 基本的なトークン
const token1 = await createGroupToken('my-org', 'production');
console.log('Token:', token1.jwt);

// 1日で期限切れのトークン
const token2 = await createGroupToken('my-org', 'production', {
  expiration: '24h',
});

// 読み取り専用トークン
const token3 = await createGroupToken('my-org', 'production', {
  authorization: 'read-only',
  expiration: '1h',
});

// 特定のデータベースへのアクセス
const token4 = await createGroupToken('my-org', 'production', {
  permissions: {
    read_attach: {
      databases: ['users-db', 'products-db'],
    },
  },
});
```

### TypeScript

```typescript
import {
  CreateTokenRequest,
  CreateTokenResponse,
  Authorization,
  ErrorResponse,
} from './types';

interface TokenOptions {
  expiration?: string;
  authorization?: Authorization;
  permissions?: CreateTokenRequest['permissions'];
}

async function createGroupToken(
  orgSlug: string,
  groupName: string,
  options: TokenOptions = {}
): Promise<CreateTokenResponse> {
  const { expiration, authorization, permissions } = options;

  const params = new URLSearchParams();
  if (expiration) params.append('expiration', expiration);
  if (authorization) params.append('authorization', authorization);

  const url = `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/auth/tokens?${params}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: permissions ? JSON.stringify({ permissions }) : undefined,
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Invalid request parameters');
    }
    if (response.status === 404) {
      throw new Error(`Group '${groupName}' not found`);
    }
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// 使用例: 環境別のトークン生成
async function generateEnvironmentToken(
  orgSlug: string,
  environment: 'production' | 'staging' | 'development'
): Promise<string> {
  const config: Record<typeof environment, TokenOptions> = {
    production: {
      expiration: '7d',
      authorization: 'read-only',
    },
    staging: {
      expiration: '24h',
      authorization: 'full-access',
    },
    development: {
      // 無期限、フルアクセス
    },
  };

  const result = await createGroupToken(orgSlug, environment, config[environment]);
  return result.jwt;
}
```

### Python

```python
import os
import requests
from typing import Dict, List, Optional, Literal

def create_group_token(
    org_slug: str,
    group_name: str,
    expiration: Optional[str] = None,
    authorization: Optional[Literal["full-access", "read-only"]] = None,
    permissions: Optional[Dict] = None
) -> str:
    """グループの認証トークンを生成します。"""

    url = f"https://api.turso.tech/v1/organizations/{org_slug}/groups/{group_name}/auth/tokens"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}",
        "Content-Type": "application/json"
    }

    params = {}
    if expiration:
        params["expiration"] = expiration
    if authorization:
        params["authorization"] = authorization

    data = None
    if permissions:
        data = {"permissions": permissions}

    response = requests.post(url, headers=headers, params=params, json=data)

    if response.status_code == 400:
        raise ValueError(f"Invalid request: {response.json()['error']}")
    if response.status_code == 404:
        raise ValueError(f"Group not found: {group_name}")

    response.raise_for_status()
    return response.json()["jwt"]

# 使用例
# 基本的なトークン
token = create_group_token("my-org", "production")
print(f"Token: {token[:50]}...")

# 有効期限付きトークン
token_24h = create_group_token("my-org", "production", expiration="24h")

# 読み取り専用トークン
readonly_token = create_group_token(
    "my-org",
    "production",
    authorization="read-only",
    expiration="1h"
)

# 特定のデータベースへのアクセス
limited_token = create_group_token(
    "my-org",
    "production",
    permissions={
        "read_attach": {
            "databases": ["users-db", "products-db"]
        }
    }
)
```

## 有効期限の形式

有効期限は以下の形式で指定できます：

| 形式 | 説明 | 例 |
|------|------|-----|
| `{n}s` | n秒 | "30s" |
| `{n}m` | n分 | "15m" |
| `{n}h` | n時間 | "24h" |
| `{n}d` | n日 | "7d" |
| `{n}w` | n週 | "2w" |
| `never` | 無期限 | "never"（デフォルト） |

## エラーシナリオ

### 1. 無効な有効期限形式

**エラー**: 有効期限の形式が正しくない場合

```json
{
  "error": "Invalid expiration format"
}
```

**対処法**: 正しい形式（例: "1h", "24h", "7d"）を使用します。

### 2. グループが存在しない

**エラー**: 指定されたグループが見つからない場合

```json
{
  "error": "group not found"
}
```

**対処法**: グループ名と組織スラッグが正しいことを確認します。

## ベストプラクティス

### 1. 最小権限の原則

```typescript
// アプリケーションの用途に応じて適切な権限を設定
async function createAppToken(
  orgSlug: string,
  groupName: string,
  appType: 'frontend' | 'backend' | 'analytics'
): Promise<string> {
  let config: TokenOptions;

  switch (appType) {
    case 'frontend':
      // フロントエンドは読み取り専用、短い有効期限
      config = {
        authorization: 'read-only',
        expiration: '1h',
      };
      break;

    case 'backend':
      // バックエンドはフルアクセス、長めの有効期限
      config = {
        authorization: 'full-access',
        expiration: '7d',
      };
      break;

    case 'analytics':
      // 分析ツールは読み取り専用、中程度の有効期限
      config = {
        authorization: 'read-only',
        expiration: '24h',
      };
      break;
  }

  const result = await createGroupToken(orgSlug, groupName, config);
  return result.jwt;
}
```

### 2. トークンのローテーション

```typescript
class TokenManager {
  private tokens = new Map<string, { jwt: string; expiresAt: Date }>();

  async getToken(
    orgSlug: string,
    groupName: string,
    expiration = '24h'
  ): Promise<string> {
    const key = `${orgSlug}:${groupName}`;
    const cached = this.tokens.get(key);

    // トークンが存在し、まだ有効な場合は再利用
    if (cached && cached.expiresAt > new Date()) {
      return cached.jwt;
    }

    // 新しいトークンを生成
    const result = await createGroupToken(orgSlug, groupName, { expiration });

    // キャッシュに保存
    const expiresAt = this.calculateExpiration(expiration);
    this.tokens.set(key, { jwt: result.jwt, expiresAt });

    return result.jwt;
  }

  private calculateExpiration(expiration: string): Date {
    const match = expiration.match(/^(\d+)([smhdw])$/);
    if (!match) return new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [, amount, unit] = match;
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000 };
    const ms = parseInt(amount) * (multipliers[unit as keyof typeof multipliers] || 3600000);

    return new Date(Date.now() + ms);
  }
}

// 使用例
const tokenManager = new TokenManager();
const token = await tokenManager.getToken('my-org', 'production', '1h');
```

### 3. 環境変数での管理

```typescript
// トークンを環境変数に保存
async function setupEnvironmentToken(
  orgSlug: string,
  groupName: string
): Promise<void> {
  const token = await createGroupToken(orgSlug, groupName, {
    expiration: '7d',
    authorization: 'full-access',
  });

  // .env ファイルに書き込み（開発環境のみ）
  if (process.env.NODE_ENV === 'development') {
    await writeEnvFile({
      TURSO_GROUP_TOKEN: token.jwt,
    });
    console.log('Token saved to .env file');
  } else {
    console.log('Token:', token.jwt);
    console.log('Save this token securely!');
  }
}
```

### 4. データベース固有のトークン

```typescript
async function createDatabaseSpecificToken(
  orgSlug: string,
  groupName: string,
  databases: string[],
  expiration = '24h'
): Promise<string> {
  const result = await createGroupToken(orgSlug, groupName, {
    expiration,
    authorization: 'read-only',
    permissions: {
      read_attach: {
        databases,
      },
    },
  });

  return result.jwt;
}

// 使用例: 特定のデータベースのみアクセス可能なトークン
const token = await createDatabaseSpecificToken(
  'my-org',
  'production',
  ['users-db', 'posts-db'],
  '1h'
);
```

## 実用例

### CI/CDパイプライン用トークン

```typescript
async function generateCIToken(
  orgSlug: string,
  groupName: string
): Promise<string> {
  // CI/CDには短い有効期限の読み取り専用トークンを使用
  const result = await createGroupToken(orgSlug, groupName, {
    authorization: 'read-only',
    expiration: '1h',
  });

  console.log('CI Token generated (expires in 1 hour)');
  return result.jwt;
}
```

### マルチテナントアプリケーション

```typescript
async function generateTenantToken(
  orgSlug: string,
  groupName: string,
  tenantId: string,
  tenantDatabases: string[]
): Promise<string> {
  const result = await createGroupToken(orgSlug, groupName, {
    expiration: '7d',
    authorization: 'full-access',
    permissions: {
      read_attach: {
        databases: tenantDatabases,
      },
    },
  });

  console.log(`Token generated for tenant: ${tenantId}`);
  return result.jwt;
}

// 使用例
const tenantToken = await generateTenantToken(
  'my-org',
  'multi-tenant',
  'tenant-123',
  ['tenant-123-users', 'tenant-123-orders']
);
```

## セキュリティ考慮事項

### 1. トークンの安全な保管

```typescript
// ✓ 環境変数を使用
const groupToken = process.env.TURSO_GROUP_TOKEN;

// ✗ ハードコードしない
const groupToken = 'eyJhbGciOiJFZERTQSIs...'; // 絶対にしない！
```

### 2. トークンの有効期限

```typescript
// 本番環境では適切な有効期限を設定
const ENVIRONMENT_EXPIRATION = {
  production: '7d',   // 本番環境
  staging: '24h',     // ステージング
  development: '1h',  // 開発環境
};

async function createSecureToken(
  orgSlug: string,
  groupName: string,
  environment: keyof typeof ENVIRONMENT_EXPIRATION
): Promise<string> {
  const expiration = ENVIRONMENT_EXPIRATION[environment];

  const result = await createGroupToken(orgSlug, groupName, {
    expiration,
    authorization: environment === 'production' ? 'read-only' : 'full-access',
  });

  return result.jwt;
}
```

### 3. トークンの監査

```typescript
interface TokenAuditLog {
  timestamp: Date;
  groupName: string;
  authorization: Authorization;
  expiration: string;
  createdBy: string;
}

async function createTokenWithAudit(
  orgSlug: string,
  groupName: string,
  options: TokenOptions,
  createdBy: string
): Promise<string> {
  const result = await createGroupToken(orgSlug, groupName, options);

  // 監査ログを記録
  const auditLog: TokenAuditLog = {
    timestamp: new Date(),
    groupName,
    authorization: options.authorization || 'full-access',
    expiration: options.expiration || 'never',
    createdBy,
  };

  await saveAuditLog(auditLog);

  return result.jwt;
}
```

## 関連リンク

- [グループトークンの無効化](/docs/services/turso/docs/api-reference/groups/invalidate-tokens.md)
- [グループの取得](/docs/services/turso/docs/api-reference/groups/retrieve.md)
- [認証について](/docs/services/turso/docs/sdk/authentication.md)
