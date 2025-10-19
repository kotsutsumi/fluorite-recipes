# APIトークンの失効 - Turso API リファレンス

指定されたAPIトークンを失効させます。

## エンドポイント

```
DELETE /v1/auth/api-tokens/{tokenName}
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `tokenName` | string | ✓ | 失効させるトークンの名前 |

## TypeScript インターフェース

```typescript
interface RevokeTokenResponse {
  token: string; // 失効したトークンの名前
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "token": "my-token"
}
```

## コード例

### cURL

```bash
curl -X DELETE "https://api.turso.tech/v1/auth/api-tokens/old-token" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const revokeAPIToken = async (tokenName) => {
  const response = await fetch(
    `https://api.turso.tech/v1/auth/api-tokens/${tokenName}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to revoke token: ${tokenName}`);
  }

  return await response.json();
};

// 使用例
try {
  const result = await revokeAPIToken('old-token');
  console.log('Revoked token:', result.token);
} catch (error) {
  console.error('Revoke failed:', error.message);
}
```

### TypeScript

```typescript
import { RevokeTokenResponse } from './types';

async function revokeAPIToken(tokenName: string): Promise<RevokeTokenResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/auth/api-tokens/${tokenName}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to revoke token: ${tokenName}`);
  }

  return await response.json();
}

// 確認付き失効
async function safeRevokeToken(tokenName: string): Promise<boolean> {
  const confirmed = await confirm(`Are you sure you want to revoke "${tokenName}"?`);

  if (!confirmed) {
    console.log('Revoke cancelled');
    return false;
  }

  try {
    await revokeAPIToken(tokenName);
    console.log(`✓ Token "${tokenName}" revoked successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to revoke token: ${error.message}`);
    return false;
  }
}
```

### Python

```python
import os
import requests

def revoke_api_token(token_name: str) -> dict:
    """APIトークンを失効させます。"""
    url = f"https://api.turso.tech/v1/auth/api-tokens/{token_name}"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}

    response = requests.delete(url, headers=headers)
    response.raise_for_status()
    return response.json()

# 使用例
try:
    result = revoke_api_token("old-token")
    print(f"Revoked token: {result['token']}")
except requests.RequestException as e:
    print(f"Revoke failed: {e}")

# 確認付き失効
def safe_revoke_token(token_name: str) -> bool:
    """確認後にトークンを失効させます。"""
    confirm = input(f"Are you sure you want to revoke '{token_name}'? (yes/no): ")

    if confirm.lower() != "yes":
        print("Revoke cancelled")
        return False

    try:
        revoke_api_token(token_name)
        print(f"✓ Token '{token_name}' revoked successfully")
        return True
    except Exception as e:
        print(f"Failed to revoke token: {e}")
        return False
```

## ベストプラクティス

### 1. トークンローテーション

```typescript
async function rotateToken(oldTokenName: string, newTokenName: string): Promise<void> {
  console.log(`Rotating token: ${oldTokenName} → ${newTokenName}`);

  // 新しいトークンを作成
  const newToken = await createAPIToken(newTokenName);
  console.log('✓ New token created');

  // 新しいトークンを保存
  await saveToken(newTokenName, newToken.token);
  console.log('✓ New token saved');

  // アプリケーションが新しいトークンを使用していることを確認
  console.log('⚠️  Update your applications to use the new token');
  console.log('   Press Enter when ready to revoke the old token...');

  await waitForUserInput();

  // 古いトークンを失効
  await revokeAPIToken(oldTokenName);
  console.log('✓ Old token revoked');

  console.log('Token rotation complete');
}
```

### 2. 一括失効

```typescript
async function revokeMultipleTokens(tokenNames: string[]): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  for (const name of tokenNames) {
    try {
      await revokeAPIToken(name);
      results.set(name, true);
      console.log(`✓ Revoked: ${name}`);
    } catch (error) {
      results.set(name, false);
      console.error(`✗ Failed to revoke ${name}:`, error.message);
    }
  }

  const successCount = Array.from(results.values()).filter(Boolean).length;
  console.log(`\nRevoked ${successCount}/${tokenNames.length} token(s)`);

  return results;
}

// 使用例
await revokeMultipleTokens(['old-token-1', 'old-token-2', 'test-token']);
```

### 3. パターンマッチング失効

```typescript
async function revokeTokensByPattern(pattern: RegExp): Promise<void> {
  const tokens = await listAPITokens();

  const tokensToRevoke = tokens.filter(t => pattern.test(t.name));

  if (tokensToRevoke.length === 0) {
    console.log('No tokens match the pattern');
    return;
  }

  console.log(`Found ${tokensToRevoke.length} token(s) to revoke:`);
  tokensToRevoke.forEach(t => console.log(`  - ${t.name}`));

  const confirmed = await confirm('Proceed with revocation?');

  if (!confirmed) {
    console.log('Cancelled');
    return;
  }

  await revokeMultipleTokens(tokensToRevoke.map(t => t.name));
}

// 使用例: "test-" で始まるすべてのトークンを失効
await revokeTokensByPattern(/^test-/);
```

### 4. セキュリティインシデント対応

```typescript
async function emergencyRevokeAllTokens(reason: string): Promise<void> {
  console.log('🚨 Emergency token revocation initiated');
  console.log(`Reason: ${reason}`);

  const tokens = await listAPITokens();

  console.log(`Revoking ${tokens.length} token(s)...`);

  const results = await revokeMultipleTokens(tokens.map(t => t.name));

  // 監査ログに記録
  await logSecurityEvent({
    event: 'emergency_token_revocation',
    reason,
    tokensRevoked: Array.from(results.entries()).filter(([_, success]) => success).length,
    timestamp: new Date(),
  });

  // セキュリティチームに通知
  await notifySecurityTeam({
    subject: 'Emergency Token Revocation',
    message: `All API tokens have been revoked due to: ${reason}`,
  });

  console.log('✓ Emergency revocation complete');
}

// 使用例
await emergencyRevokeAllTokens('Suspected credential compromise');
```

### 5. 監査ログ付き失効

```typescript
interface TokenRevocationLog {
  tokenName: string;
  revokedAt: Date;
  revokedBy: string;
  reason: string;
}

async function revokeWithAudit(
  tokenName: string,
  revokedBy: string,
  reason: string
): Promise<void> {
  // トークンを失効
  await revokeAPIToken(tokenName);

  // 監査ログに記録
  const log: TokenRevocationLog = {
    tokenName,
    revokedAt: new Date(),
    revokedBy,
    reason,
  };

  await saveAuditLog(log);

  console.log(`Token "${tokenName}" revoked by ${revokedBy}`);
  console.log(`Reason: ${reason}`);
}

// 使用例
await revokeWithAudit(
  'old-production-token',
  'admin@example.com',
  'Token rotation - monthly maintenance'
);
```

## セキュリティ考慮事項

### 1. 失効前の確認

```typescript
async function confirmRevokeToken(tokenName: string): Promise<void> {
  // トークン情報を表示
  const tokens = await listAPITokens();
  const token = tokens.find(t => t.name === tokenName);

  if (!token) {
    throw new Error(`Token not found: ${tokenName}`);
  }

  console.log('Token to be revoked:');
  console.log(`  Name: ${token.name}`);
  console.log(`  ID: ${token.id}`);

  const confirmed = await confirm('Are you absolutely sure?');

  if (!confirmed) {
    throw new Error('Revocation cancelled by user');
  }

  await revokeAPIToken(tokenName);
}
```

### 2. 本番環境トークンの保護

```typescript
async function revokeTokenSafely(tokenName: string): Promise<void> {
  const protectedPatterns = [/production/, /prod/, /live/];

  const isProtected = protectedPatterns.some(pattern => pattern.test(tokenName));

  if (isProtected) {
    console.warn(`⚠️  This appears to be a production token: ${tokenName}`);
    console.warn('   Revoking this token may cause service disruption');

    const extraConfirm = await confirm('Type the token name to confirm:');
    const userInput = await getUserInput();

    if (userInput !== tokenName) {
      throw new Error('Token name mismatch - revocation cancelled');
    }
  }

  await revokeAPIToken(tokenName);
}
```

### 3. 通知の送信

```typescript
async function revokeWithNotification(tokenName: string): Promise<void> {
  await revokeAPIToken(tokenName);

  // チームに通知
  await sendNotification({
    subject: 'API Token Revoked',
    message: `The API token "${tokenName}" has been revoked. If you were using this token, please update your configuration.`,
    recipients: ['team@example.com'],
  });
}
```

## 関連リンク

- [トークンの作成](/docs/services/turso/docs/api-reference/tokens/create.md)
- [トークン一覧の取得](/docs/services/turso/docs/api-reference/tokens/list.md)
- [トークンの検証](/docs/services/turso/docs/api-reference/tokens/validate.md)
