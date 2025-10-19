# APIトークン一覧の取得 - Turso API リファレンス

ユーザーに属するすべてのAPIトークンを取得します。

## エンドポイント

```
GET /v1/auth/api-tokens
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

なし

## TypeScript インターフェース

```typescript
interface APIToken {
  name: string;
  id: string;
}

type ListTokensResponse = APIToken[];
```

## レスポンス

### 成功時 (200 OK)

```json
[
  {
    "name": "my-token",
    "id": "clGFZ4STEe6fljpFzIum8A"
  },
  {
    "name": "production-token",
    "id": "abCDeFgH1234567890XyZw"
  }
]
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/auth/api-tokens" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const listAPITokens = async () => {
  const response = await fetch('https://api.turso.tech/v1/auth/api-tokens', {
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to list API tokens');
  }

  return await response.json();
};

// 使用例
const tokens = await listAPITokens();
console.log(`Found ${tokens.length} API token(s)`);

tokens.forEach(token => {
  console.log(`- ${token.name} (ID: ${token.id})`);
});
```

### TypeScript

```typescript
import { APIToken } from './types';

async function listAPITokens(): Promise<APIToken[]> {
  const response = await fetch('https://api.turso.tech/v1/auth/api-tokens', {
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to list API tokens');
  }

  return await response.json();
}

// トークン検索
async function findTokenByName(name: string): Promise<APIToken | undefined> {
  const tokens = await listAPITokens();
  return tokens.find(t => t.name === name);
}

// 使用例
const token = await findTokenByName('production-token');
if (token) {
  console.log('Found token:', token.id);
} else {
  console.log('Token not found');
}
```

### Python

```python
import os
import requests
from typing import List, Dict, Optional

def list_api_tokens() -> List[Dict[str, str]]:
    """すべてのAPIトークンを取得します。"""
    url = "https://api.turso.tech/v1/auth/api-tokens"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

# 使用例
tokens = list_api_tokens()
print(f"Found {len(tokens)} API token(s)")

for token in tokens:
    print(f"- {token['name']} (ID: {token['id']})")

# トークン検索
def find_token_by_name(name: str) -> Optional[Dict[str, str]]:
    """名前でトークンを検索します。"""
    tokens = list_api_tokens()
    return next((t for t in tokens if t["name"] == name), None)

# 使用例
token = find_token_by_name("production-token")
if token:
    print(f"Found token: {token['id']}")
else:
    print("Token not found")
```

## ベストプラクティス

### 1. トークン監査

```typescript
async function auditTokens(): Promise<void> {
  const tokens = await listAPITokens();

  console.log('Token Audit Report');
  console.log('==================');
  console.log(`Total tokens: ${tokens.length}`);
  console.log('\nTokens:');

  tokens.forEach((token, index) => {
    console.log(`${index + 1}. ${token.name}`);
    console.log(`   ID: ${token.id}`);
  });

  // 未使用トークンの警告
  const unusedTokens = tokens.filter(t => t.name.includes('old-') || t.name.includes('deprecated-'));

  if (unusedTokens.length > 0) {
    console.log('\n⚠️  Potentially unused tokens:');
    unusedTokens.forEach(t => console.log(`   - ${t.name}`));
  }
}
```

### 2. トークンの整理

```typescript
async function cleanupOldTokens(pattern: RegExp): Promise<void> {
  const tokens = await listAPITokens();

  const tokensToRemove = tokens.filter(t => pattern.test(t.name));

  console.log(`Found ${tokensToRemove.length} token(s) to remove`);

  for (const token of tokensToRemove) {
    console.log(`Revoking: ${token.name}`);
    await revokeAPIToken(token.name);
  }

  console.log('✓ Cleanup complete');
}

// 使用例: "test-" で始まるトークンを削除
await cleanupOldTokens(/^test-/);
```

### 3. トークンインベントリ

```typescript
interface TokenInventory {
  total: number;
  byEnvironment: Record<string, number>;
  byPurpose: Record<string, number>;
  tokens: APIToken[];
}

async function getTokenInventory(): Promise<TokenInventory> {
  const tokens = await listAPITokens();

  const byEnvironment: Record<string, number> = {};
  const byPurpose: Record<string, number> = {};

  tokens.forEach(token => {
    // 環境別カウント
    if (token.name.includes('production')) {
      byEnvironment.production = (byEnvironment.production || 0) + 1;
    } else if (token.name.includes('staging')) {
      byEnvironment.staging = (byEnvironment.staging || 0) + 1;
    } else if (token.name.includes('development')) {
      byEnvironment.development = (byEnvironment.development || 0) + 1;
    }

    // 用途別カウント
    if (token.name.includes('ci') || token.name.includes('cd')) {
      byPurpose.cicd = (byPurpose.cicd || 0) + 1;
    } else if (token.name.includes('api')) {
      byPurpose.api = (byPurpose.api || 0) + 1;
    }
  });

  return {
    total: tokens.length,
    byEnvironment,
    byPurpose,
    tokens,
  };
}
```

### 4. トークンの有効性チェック

```typescript
async function verifyAllTokens(): Promise<Map<string, boolean>> {
  const tokens = await listAPITokens();
  const results = new Map<string, boolean>();

  for (const token of tokens) {
    try {
      // 注: 実際のトークン値を持っていないため、名前のみで追跡
      console.log(`Checking token: ${token.name}`);
      results.set(token.name, true);
    } catch (error) {
      console.error(`Token ${token.name} is invalid`);
      results.set(token.name, false);
    }
  }

  return results;
}
```

## セキュリティ考慮事項

### 1. 定期的な監査

トークン一覧を定期的に確認し、不要なトークンを削除します：

```typescript
async function scheduleTokenAudit(): Promise<void> {
  // 月次監査
  setInterval(async () => {
    console.log('Starting monthly token audit...');
    await auditTokens();
  }, 30 * 24 * 60 * 60 * 1000); // 30日ごと
}
```

### 2. アクセス制限

トークン一覧の取得は管理者のみに制限：

```typescript
async function listTokensIfAuthorized(userRole: string): Promise<APIToken[]> {
  if (userRole !== 'admin') {
    throw new Error('Only administrators can list API tokens');
  }

  return await listAPITokens();
}
```

### 3. トークン情報の保護

```typescript
// ✓ トークンIDのみをログに記録
console.log('Token IDs:', tokens.map(t => t.id));

// ✗ トークン名を公開しない（セキュリティ上の理由で）
// トークン名には環境情報が含まれる可能性があるため
```

## 関連リンク

- [トークンの作成](/docs/services/turso/docs/api-reference/tokens/create.md)
- [トークンの検証](/docs/services/turso/docs/api-reference/tokens/validate.md)
- [トークンの失効](/docs/services/turso/docs/api-reference/tokens/revoke.md)
