# APIトークンの作成 - Turso API リファレンス

新しいAPIトークンを作成します。

## エンドポイント

```
POST /v1/auth/api-tokens/{tokenName}
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `tokenName` | string | ✓ | トークンの名前 |

## TypeScript インターフェース

```typescript
interface CreateTokenResponse {
  name: string;
  id: string;
  token: string; // JWT - 一度のみ表示されます
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "name": "my-token",
  "id": "clGFZ4STEe6fljpFzIum8A",
  "token": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."
}
```

**重要**: `token`フィールドは作成時に一度だけ表示されます。後で取得することはできないため、安全な場所に保存してください。

## コード例

### cURL

```bash
curl -X POST "https://api.turso.tech/v1/auth/api-tokens/my-production-token" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const createAPIToken = async (tokenName) => {
  const response = await fetch(
    `https://api.turso.tech/v1/auth/api-tokens/${tokenName}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create token: ${tokenName}`);
  }

  return await response.json();
};

// 使用例
const result = await createAPIToken('my-app-token');
console.log('Token created:', result.name);
console.log('Token ID:', result.id);
console.log('Save this token securely:', result.token);

// 環境変数に保存（開発環境のみ）
if (process.env.NODE_ENV === 'development') {
  await writeEnvFile({
    TURSO_API_TOKEN: result.token,
  });
}
```

### TypeScript

```typescript
import { CreateTokenResponse } from './types';

async function createAPIToken(tokenName: string): Promise<CreateTokenResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/auth/api-tokens/${tokenName}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to create token: ${tokenName}`);
  }

  return await response.json();
}

// 安全なトークン管理
class TokenManager {
  async createAndStore(tokenName: string, storage: 'env' | 'secrets'): Promise<string> {
    const result = await createAPIToken(tokenName);

    // ストレージに保存
    if (storage === 'env') {
      await this.saveToEnv(tokenName, result.token);
    } else {
      await this.saveToSecretsManager(tokenName, result.token);
    }

    return result.id;
  }

  private async saveToEnv(name: string, token: string): Promise<void> {
    // .env ファイルに保存
  }

  private async saveToSecretsManager(name: string, token: string): Promise<void> {
    // シークレットマネージャーに保存（AWS Secrets Manager、HashiCorp Vaultなど）
  }
}
```

### Python

```python
import os
import requests

def create_api_token(token_name: str) -> dict:
    """新しいAPIトークンを作成します。"""
    url = f"https://api.turso.tech/v1/auth/api-tokens/{token_name}"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}

    response = requests.post(url, headers=headers)
    response.raise_for_status()
    return response.json()

# 使用例
result = create_api_token("my-app-token")
print(f"Token created: {result['name']}")
print(f"Token ID: {result['id']}")
print(f"Save this token securely: {result['token']}")

# 環境変数ファイルに保存
def save_token_to_env(token_name: str, token: str):
    """トークンを.envファイルに保存します。"""
    with open(".env", "a") as f:
        f.write(f"\nTURSO_API_TOKEN_{token_name.upper()}={token}\n")
```

## ベストプラクティス

### 1. トークン名の命名規則

```typescript
// Good: 目的を明確に
await createAPIToken('production-api');
await createAPIToken('ci-cd-pipeline');
await createAPIToken('development-local');

// Bad: 曖昧な名前
await createAPIToken('token1');
await createAPIToken('test');
```

### 2. トークンの即時保存

```typescript
async function createAndSecureToken(tokenName: string): Promise<string> {
  const result = await createAPIToken(tokenName);

  // トークンを即座に安全な場所に保存
  await saveToVault(tokenName, result.token);

  // トークンIDのみを返す（トークン自体は返さない）
  return result.id;
}
```

### 3. 環境別トークン

```typescript
async function setupEnvironmentTokens(environment: 'production' | 'staging' | 'development'): Promise<void> {
  const tokenName = `${environment}-api-token`;

  const result = await createAPIToken(tokenName);

  console.log(`Created token for ${environment}`);
  console.log(`Token ID: ${result.id}`);
  console.log('Store this token in your secrets management system');

  // 環境別の設定に保存
  await storeInEnvironmentConfig(environment, result.token);
}
```

### 4. トークンローテーション

```typescript
async function rotateAPIToken(oldTokenName: string): Promise<void> {
  const newTokenName = `${oldTokenName}-${Date.now()}`;

  // 新しいトークンを作成
  const newToken = await createAPIToken(newTokenName);

  // 新しいトークンを保存
  await saveToken(newTokenName, newToken.token);

  console.log('New token created:', newToken.id);
  console.log('Please update your applications with the new token');
  console.log('After verification, revoke the old token');

  // 古いトークンは手動で確認後に削除
}
```

## セキュリティ考慮事項

### 1. トークンの安全な保管

```typescript
// ✓ シークレットマネージャーを使用
await aws.secretsManager.createSecret({
  name: `turso-api-token-${tokenName}`,
  secretString: result.token,
});

// ✓ 環境変数を使用（開発環境のみ）
process.env.TURSO_API_TOKEN = result.token;

// ✗ コードにハードコードしない
const token = 'eyJhbGciOiJFZERTQSIs...'; // 絶対にしない！

// ✗ バージョン管理にコミットしない
// .env ファイルは .gitignore に追加
```

### 2. トークンの即時保護

```typescript
async function createProtectedToken(tokenName: string): Promise<void> {
  const result = await createAPIToken(tokenName);

  try {
    // 即座に安全な場所に保存
    await saveToSecureStorage(result.token);

    // コンソールには表示しない（本番環境）
    if (process.env.NODE_ENV !== 'development') {
      console.log('Token created and stored securely');
    } else {
      console.log('Token:', result.token); // 開発環境のみ
    }
  } catch (error) {
    // 保存に失敗した場合、トークンを即座に失効
    await revokeAPIToken(tokenName);
    throw error;
  }
}
```

### 3. アクセス監査

```typescript
interface TokenCreationLog {
  tokenName: string;
  tokenId: string;
  createdAt: Date;
  createdBy: string;
  purpose: string;
}

async function createTokenWithAudit(
  tokenName: string,
  createdBy: string,
  purpose: string
): Promise<void> {
  const result = await createAPIToken(tokenName);

  // 監査ログに記録
  const log: TokenCreationLog = {
    tokenName,
    tokenId: result.id,
    createdAt: new Date(),
    createdBy,
    purpose,
  };

  await saveAuditLog(log);

  // 管理者に通知
  await notifyAdmins({
    subject: 'New API Token Created',
    message: `Token "${tokenName}" was created by ${createdBy} for ${purpose}`,
  });
}
```

## 関連リンク

- [トークン一覧の取得](/docs/services/turso/docs/api-reference/tokens/list.md)
- [トークンの検証](/docs/services/turso/docs/api-reference/tokens/validate.md)
- [トークンの失効](/docs/services/turso/docs/api-reference/tokens/revoke.md)
