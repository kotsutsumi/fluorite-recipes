# グループトークンの無効化 - Turso API リファレンス

指定されたグループのすべての認証トークンを無効化します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/groups/{groupName}/auth/rotate
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

## TypeScript インターフェース

```typescript
interface ErrorResponse {
  error: string;
}
```

## レスポンス

### 成功時 (200 OK)

レスポンスボディなし（No Content）

### エラー時 (404 Not Found)

```json
{
  "error": "group not found"
}
```

## コード例

### cURL

```bash
curl -X POST "https://api.turso.tech/v1/organizations/my-org/groups/production/auth/rotate" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const invalidateGroupTokens = async (orgSlug, groupName) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/auth/rotate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Group '${groupName}' not found`);
    }
    const error = await response.json();
    throw new Error(error.error);
  }

  return true;
};

// 使用例
try {
  await invalidateGroupTokens('my-org', 'production');
  console.log('All group tokens invalidated successfully');
} catch (error) {
  console.error('Failed to invalidate tokens:', error.message);
}
```

### TypeScript

```typescript
import { ErrorResponse } from './types';

async function invalidateGroupTokens(
  orgSlug: string,
  groupName: string
): Promise<void> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/auth/rotate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Group '${groupName}' not found`);
    }
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }
}

// 使用例: 安全なトークン無効化
async function rotateGroupTokens(
  orgSlug: string,
  groupName: string
): Promise<string> {
  console.log(`Invalidating all tokens for group: ${groupName}...`);

  // 既存のトークンを無効化
  await invalidateGroupTokens(orgSlug, groupName);

  console.log('✓ All tokens invalidated');

  // 新しいトークンを生成
  console.log('Generating new token...');
  const result = await createGroupToken(orgSlug, groupName, {
    expiration: '7d',
  });

  console.log('✓ New token generated');

  return result.jwt;
}
```

### Python

```python
import os
import requests

def invalidate_group_tokens(org_slug: str, group_name: str) -> None:
    """グループのすべての認証トークンを無効化します。"""

    url = f"https://api.turso.tech/v1/organizations/{org_slug}/groups/{group_name}/auth/rotate"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"
    }

    response = requests.post(url, headers=headers)

    if response.status_code == 404:
        raise ValueError(f"Group not found: {group_name}")

    response.raise_for_status()

# 使用例
try:
    invalidate_group_tokens("my-org", "production")
    print("All group tokens invalidated successfully")
except ValueError as e:
    print(f"Error: {e}")
except requests.RequestException as e:
    print(f"Request error: {e}")

# トークンのローテーション
def rotate_group_tokens(org_slug: str, group_name: str) -> str:
    """既存のトークンを無効化して新しいトークンを生成します。"""

    print(f"Invalidating all tokens for group: {group_name}...")
    invalidate_group_tokens(org_slug, group_name)
    print("✓ All tokens invalidated")

    print("Generating new token...")
    new_token = create_group_token(org_slug, group_name, expiration="7d")
    print("✓ New token generated")

    return new_token
```

## エラーシナリオ

### 1. グループが存在しない

**エラー**: 指定されたグループ名が組織内に存在しない場合

```json
{
  "error": "group not found"
}
```

**対処法**: グループ名と組織スラッグが正しいことを確認します。

### 2. 認証エラー

**エラー**: 無効または期限切れのAPIトークン

**対処法**: 有効なTurso APIトークンを使用していることを確認します。

### 3. 権限不足

**エラー**: トークンを無効化する権限がない場合

**対処法**: 組織の管理者権限を持つトークンを使用します。

## ベストプラクティス

### 1. トークンのローテーション

```typescript
interface TokenRotationResult {
  invalidated: boolean;
  newToken: string;
  timestamp: Date;
}

async function rotateTokensSafely(
  orgSlug: string,
  groupName: string,
  expiration = '7d'
): Promise<TokenRotationResult> {
  const timestamp = new Date();

  try {
    // 既存のトークンを無効化
    await invalidateGroupTokens(orgSlug, groupName);

    // 新しいトークンを即座に生成
    const result = await createGroupToken(orgSlug, groupName, {
      expiration,
    });

    return {
      invalidated: true,
      newToken: result.jwt,
      timestamp,
    };
  } catch (error) {
    console.error('Token rotation failed:', error);
    throw error;
  }
}

// 使用例
const result = await rotateTokensSafely('my-org', 'production', '7d');
console.log('New token:', result.newToken);
```

### 2. スケジュールされたローテーション

```typescript
class TokenRotationScheduler {
  private intervals = new Map<string, NodeJS.Timeout>();

  scheduleRotation(
    orgSlug: string,
    groupName: string,
    intervalDays: number
  ): void {
    const key = `${orgSlug}:${groupName}`;

    // 既存のスケジュールをクリア
    this.cancelRotation(key);

    // 新しいスケジュールを設定
    const interval = setInterval(
      async () => {
        try {
          console.log(`Scheduled rotation for ${groupName}...`);
          await rotateTokensSafely(orgSlug, groupName);
          console.log(`✓ Tokens rotated for ${groupName}`);
        } catch (error) {
          console.error(`Failed to rotate tokens for ${groupName}:`, error);
        }
      },
      intervalDays * 24 * 60 * 60 * 1000
    );

    this.intervals.set(key, interval);
  }

  cancelRotation(key: string): void {
    const interval = this.intervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(key);
    }
  }
}

// 使用例: 7日ごとにトークンをローテーション
const scheduler = new TokenRotationScheduler();
scheduler.scheduleRotation('my-org', 'production', 7);
```

### 3. セキュリティインシデント対応

```typescript
async function emergencyTokenInvalidation(
  orgSlug: string,
  groupNames: string[],
  reason: string
): Promise<void> {
  console.log('🚨 Emergency token invalidation initiated');
  console.log(`Reason: ${reason}`);

  const results: Map<string, boolean> = new Map();

  for (const groupName of groupNames) {
    try {
      console.log(`Invalidating tokens for ${groupName}...`);
      await invalidateGroupTokens(orgSlug, groupName);
      results.set(groupName, true);
      console.log(`✓ ${groupName} - tokens invalidated`);
    } catch (error) {
      results.set(groupName, false);
      console.error(`✗ ${groupName} - failed:`, error.message);
    }
  }

  // 結果をログに記録
  const successCount = Array.from(results.values()).filter(Boolean).length;
  console.log(`\n✓ Invalidated tokens for ${successCount}/${groupNames.length} groups`);

  // セキュリティチームに通知
  await notifySecurityTeam({
    type: 'emergency_token_invalidation',
    reason,
    groups: groupNames,
    results: Object.fromEntries(results),
    timestamp: new Date(),
  });
}

// 使用例
await emergencyTokenInvalidation(
  'my-org',
  ['production', 'staging', 'development'],
  'Suspected token compromise'
);
```

### 4. 通知付きローテーション

```typescript
async function rotateWithNotification(
  orgSlug: string,
  groupName: string,
  notifyEmails: string[]
): Promise<void> {
  console.log(`Starting token rotation for ${groupName}...`);

  // トークンをローテーション
  const result = await rotateTokensSafely(orgSlug, groupName);

  // 関係者に通知
  await sendEmail({
    to: notifyEmails,
    subject: `Tokens rotated for ${groupName}`,
    body: `
      All authentication tokens for the group "${groupName}" have been invalidated.

      A new token has been generated and is valid for 7 days.

      Timestamp: ${result.timestamp.toISOString()}

      Please update your applications with the new token.
    `,
  });

  console.log('✓ Token rotation complete and notifications sent');
}

// 使用例
await rotateWithNotification('my-org', 'production', [
  'admin@example.com',
  'dev-team@example.com',
]);
```

## 実用例

### 定期的なセキュリティメンテナンス

```typescript
async function performSecurityMaintenance(
  orgSlug: string,
  groups: string[]
): Promise<void> {
  console.log('Starting security maintenance...');

  for (const groupName of groups) {
    console.log(`\n[${groupName}]`);

    try {
      // トークンを無効化
      await invalidateGroupTokens(orgSlug, groupName);
      console.log('  ✓ Tokens invalidated');

      // 新しいトークンを生成
      const result = await createGroupToken(orgSlug, groupName, {
        expiration: '30d',
      });
      console.log('  ✓ New token generated');

      // 設定を確認・更新
      const config = await getGroupConfiguration(orgSlug, groupName);
      if (!config.delete_protection && groupName === 'production') {
        await updateGroupConfiguration(orgSlug, groupName, {
          delete_protection: true,
        });
        console.log('  ✓ Delete protection enabled');
      }
    } catch (error) {
      console.error(`  ✗ Failed: ${error.message}`);
    }
  }

  console.log('\n✓ Security maintenance complete');
}

// 使用例: 月次メンテナンス
await performSecurityMaintenance('my-org', [
  'production',
  'staging',
  'development',
]);
```

### オフボーディングプロセス

```typescript
async function revokeUserAccess(
  orgSlug: string,
  userEmail: string,
  affectedGroups: string[]
): Promise<void> {
  console.log(`Revoking access for user: ${userEmail}`);

  // すべての関連グループのトークンを無効化
  for (const groupName of affectedGroups) {
    try {
      await invalidateGroupTokens(orgSlug, groupName);
      console.log(`✓ Invalidated tokens for ${groupName}`);
    } catch (error) {
      console.error(`✗ Failed to invalidate ${groupName}:`, error.message);
    }
  }

  // 監査ログに記録
  await logAudit({
    action: 'revoke_user_access',
    user: userEmail,
    groups: affectedGroups,
    timestamp: new Date(),
  });

  console.log('✓ User access revoked');
}

// 使用例
await revokeUserAccess('my-org', 'former-employee@example.com', [
  'production',
  'staging',
]);
```

### コンプライアンス監査

```typescript
interface AuditReport {
  timestamp: Date;
  groupName: string;
  tokenRotated: boolean;
  newTokenExpiration: string;
}

async function complianceAudit(
  orgSlug: string,
  groups: string[]
): Promise<AuditReport[]> {
  const reports: AuditReport[] = [];

  for (const groupName of groups) {
    const timestamp = new Date();

    try {
      // トークンをローテーション
      await invalidateGroupTokens(orgSlug, groupName);

      // 新しいトークンを生成（90日の有効期限）
      const expiration = '90d';
      await createGroupToken(orgSlug, groupName, { expiration });

      reports.push({
        timestamp,
        groupName,
        tokenRotated: true,
        newTokenExpiration: expiration,
      });
    } catch (error) {
      reports.push({
        timestamp,
        groupName,
        tokenRotated: false,
        newTokenExpiration: 'N/A',
      });
    }
  }

  // レポートを保存
  await saveAuditReport({
    type: 'token_rotation_audit',
    reports,
    timestamp: new Date(),
  });

  return reports;
}
```

## セキュリティ考慮事項

### 1. アトミックなローテーション

```typescript
// トークンの無効化と新規生成を原子的に実行
async function atomicTokenRotation(
  orgSlug: string,
  groupName: string
): Promise<string> {
  try {
    // 新しいトークンを先に生成
    const newToken = await createGroupToken(orgSlug, groupName, {
      expiration: '7d',
    });

    // 古いトークンを無効化
    await invalidateGroupTokens(orgSlug, groupName);

    return newToken.jwt;
  } catch (error) {
    console.error('Atomic rotation failed:', error);
    throw error;
  }
}
```

### 2. 監査ログの記録

```typescript
interface TokenInvalidationLog {
  timestamp: Date;
  groupName: string;
  invalidatedBy: string;
  reason: string;
  newTokenGenerated: boolean;
}

async function invalidateWithAudit(
  orgSlug: string,
  groupName: string,
  invalidatedBy: string,
  reason: string
): Promise<void> {
  // トークンを無効化
  await invalidateGroupTokens(orgSlug, groupName);

  // 監査ログを記録
  const log: TokenInvalidationLog = {
    timestamp: new Date(),
    groupName,
    invalidatedBy,
    reason,
    newTokenGenerated: false,
  };

  await saveAuditLog(log);
}
```

### 3. APIトークンの保護

```typescript
// ✓ 環境変数を使用
const token = process.env.TURSO_API_TOKEN;

// ✗ ハードコードしない
const token = 'eyJhbGciOiJIUzI1NiIs...'; // 絶対にしない！
```

### 4. 権限の検証

```bash
# トークン無効化権限を持つAPIトークンの作成
turso auth api-token create --name token-manager --permissions groups:write
```

## 関連リンク

- [グループトークンの作成](/docs/services/turso/docs/api-reference/groups/create-token.md)
- [グループの取得](/docs/services/turso/docs/api-reference/groups/retrieve.md)
- [認証について](/docs/services/turso/docs/sdk/authentication.md)
