# グループ設定の更新 - Turso API リファレンス

グループの設定を更新します。

## エンドポイント

```
PATCH /v1/organizations/{organizationSlug}/groups/{groupName}/configuration
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

### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `delete_protection` | boolean | ✓ | グループを削除から保護するかどうか |

## TypeScript インターフェース

```typescript
interface UpdateGroupConfigurationRequest {
  delete_protection: boolean;
}

interface UpdateGroupConfigurationResponse {
  delete_protection: boolean;
}

interface ErrorResponse {
  error: string;
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "delete_protection": true
}
```

## コード例

### cURL

```bash
# 削除保護を有効化
curl -X PATCH "https://api.turso.tech/v1/organizations/my-org/groups/production/configuration" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"delete_protection": true}'

# 削除保護を無効化
curl -X PATCH "https://api.turso.tech/v1/organizations/my-org/groups/staging/configuration" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"delete_protection": false}'
```

### JavaScript

```javascript
const updateGroupConfiguration = async (
  orgSlug,
  groupName,
  deleteProtection
) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/configuration`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        delete_protection: deleteProtection,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
};

// 使用例: 本番環境グループを保護
await updateGroupConfiguration('my-org', 'production', true);
console.log('Delete protection enabled');

// 開発環境グループの保護を解除
await updateGroupConfiguration('my-org', 'development', false);
console.log('Delete protection disabled');
```

### TypeScript

```typescript
import {
  UpdateGroupConfigurationRequest,
  UpdateGroupConfigurationResponse,
  ErrorResponse,
} from './types';

async function updateGroupConfiguration(
  orgSlug: string,
  groupName: string,
  config: UpdateGroupConfigurationRequest
): Promise<UpdateGroupConfigurationResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/configuration`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    }
  );

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// 使用例: 削除保護の有効化/無効化
async function setDeleteProtection(
  orgSlug: string,
  groupName: string,
  enabled: boolean
): Promise<void> {
  const result = await updateGroupConfiguration(orgSlug, groupName, {
    delete_protection: enabled,
  });

  console.log(
    `Delete protection for '${groupName}': ${
      result.delete_protection ? 'enabled' : 'disabled'
    }`
  );
}

// 本番環境を保護
await setDeleteProtection('my-org', 'production', true);
```

### Python

```python
import os
import requests
from typing import Dict

def update_group_configuration(
    org_slug: str,
    group_name: str,
    delete_protection: bool
) -> Dict[str, bool]:
    """グループの設定を更新します。"""

    url = f"https://api.turso.tech/v1/organizations/{org_slug}/groups/{group_name}/configuration"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}",
        "Content-Type": "application/json"
    }

    data = {
        "delete_protection": delete_protection
    }

    response = requests.patch(url, json=data, headers=headers)
    response.raise_for_status()

    return response.json()

# 使用例: 削除保護を有効化
result = update_group_configuration("my-org", "production", True)
print(f"Delete protection enabled: {result['delete_protection']}")

# 便利なヘルパー関数
def enable_delete_protection(org_slug: str, group_name: str) -> None:
    """グループの削除保護を有効にします。"""
    update_group_configuration(org_slug, group_name, True)
    print(f"Delete protection enabled for '{group_name}'")

def disable_delete_protection(org_slug: str, group_name: str) -> None:
    """グループの削除保護を無効にします。"""
    update_group_configuration(org_slug, group_name, False)
    print(f"Delete protection disabled for '{group_name}'")

# 使用例
enable_delete_protection("my-org", "production")
disable_delete_protection("my-org", "development")
```

## エラーシナリオ

### 1. グループが存在しない

**エラー**: 指定されたグループ名が組織内に存在しない場合

```json
{
  "error": "group not found"
}
```

**対処法**: グループ名のスペルを確認するか、グループが存在することを確認します。

### 2. 認証エラー

**エラー**: 無効または期限切れのAPIトークン

**対処法**: 有効なTurso APIトークンを使用していることを確認します。

### 3. 権限不足

**エラー**: グループ設定を変更する権限がない場合

**対処法**: 組織の管理者権限を持つトークンを使用します。

## ベストプラクティス

### 1. 環境別の設定管理

```typescript
enum Environment {
  Production = 'production',
  Staging = 'staging',
  Development = 'development',
}

const DELETE_PROTECTION_POLICY: Record<Environment, boolean> = {
  [Environment.Production]: true, // 本番環境は常に保護
  [Environment.Staging]: true, // ステージングも保護推奨
  [Environment.Development]: false, // 開発環境は柔軟に
};

async function applySecurityPolicy(
  orgSlug: string,
  environment: Environment
): Promise<void> {
  const shouldProtect = DELETE_PROTECTION_POLICY[environment];

  await updateGroupConfiguration(orgSlug, environment, {
    delete_protection: shouldProtect,
  });

  console.log(
    `Applied security policy to ${environment}: ` +
      `delete_protection=${shouldProtect}`
  );
}

// すべての環境にポリシーを適用
for (const env of Object.values(Environment)) {
  await applySecurityPolicy('my-org', env);
}
```

### 2. 設定変更の確認

```typescript
async function updateAndVerifyConfiguration(
  orgSlug: string,
  groupName: string,
  deleteProtection: boolean
): Promise<boolean> {
  // 設定を更新
  await updateGroupConfiguration(orgSlug, groupName, {
    delete_protection: deleteProtection,
  });

  // 更新を確認
  const config = await getGroupConfiguration(orgSlug, groupName);

  if (config.delete_protection !== deleteProtection) {
    throw new Error(
      `Configuration update failed: expected ${deleteProtection}, ` +
        `got ${config.delete_protection}`
    );
  }

  return true;
}

// 使用例
const success = await updateAndVerifyConfiguration('my-org', 'production', true);
console.log('Configuration updated and verified');
```

### 3. 一括設定更新

```typescript
interface GroupConfigUpdate {
  name: string;
  deleteProtection: boolean;
}

async function updateMultipleGroupConfigurations(
  orgSlug: string,
  updates: GroupConfigUpdate[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  for (const update of updates) {
    try {
      await updateGroupConfiguration(orgSlug, update.name, {
        delete_protection: update.deleteProtection,
      });
      results.set(update.name, true);
      console.log(`✓ Updated ${update.name}`);
    } catch (error) {
      results.set(update.name, false);
      console.error(`✗ Failed to update ${update.name}:`, error.message);
    }
  }

  return results;
}

// 使用例: 複数のグループを一括更新
const updates: GroupConfigUpdate[] = [
  { name: 'production', deleteProtection: true },
  { name: 'staging', deleteProtection: true },
  { name: 'development', deleteProtection: false },
];

const results = await updateMultipleGroupConfigurations('my-org', updates);
console.log(`Updated ${results.size} groups`);
```

### 4. 変更履歴の記録

```typescript
interface ConfigChange {
  timestamp: Date;
  groupName: string;
  previousValue: boolean;
  newValue: boolean;
  user: string;
}

class ConfigurationAuditLog {
  private changes: ConfigChange[] = [];

  async updateWithAudit(
    orgSlug: string,
    groupName: string,
    newValue: boolean,
    user: string
  ): Promise<void> {
    // 現在の値を取得
    const current = await getGroupConfiguration(orgSlug, groupName);

    // 設定を更新
    await updateGroupConfiguration(orgSlug, groupName, {
      delete_protection: newValue,
    });

    // 変更を記録
    this.changes.push({
      timestamp: new Date(),
      groupName,
      previousValue: current.delete_protection,
      newValue,
      user,
    });
  }

  getHistory(groupName?: string): ConfigChange[] {
    if (groupName) {
      return this.changes.filter((c) => c.groupName === groupName);
    }
    return this.changes;
  }
}

// 使用例
const auditLog = new ConfigurationAuditLog();
await auditLog.updateWithAudit('my-org', 'production', true, 'admin@example.com');
```

## 実用例

### デプロイメント時の自動保護

```typescript
async function protectGroupOnDeploy(
  orgSlug: string,
  groupName: string,
  deploymentEnv: 'production' | 'staging' | 'development'
): Promise<void> {
  const shouldProtect = deploymentEnv === 'production' || deploymentEnv === 'staging';

  if (shouldProtect) {
    console.log(`Enabling delete protection for ${groupName}...`);
    await updateGroupConfiguration(orgSlug, groupName, {
      delete_protection: true,
    });
    console.log('✓ Group is now protected');
  }
}

// CI/CDパイプラインでの使用例
await protectGroupOnDeploy('my-org', 'production', 'production');
```

### メンテナンスモード

```typescript
async function enterMaintenanceMode(
  orgSlug: string,
  groupName: string
): Promise<void> {
  console.log('Entering maintenance mode...');

  // メンテナンス中は削除を防止
  await updateGroupConfiguration(orgSlug, groupName, {
    delete_protection: true,
  });

  console.log('✓ Maintenance mode enabled - group is protected');
}

async function exitMaintenanceMode(
  orgSlug: string,
  groupName: string,
  restoreProtection: boolean
): Promise<void> {
  console.log('Exiting maintenance mode...');

  await updateGroupConfiguration(orgSlug, groupName, {
    delete_protection: restoreProtection,
  });

  console.log('✓ Maintenance mode disabled');
}
```

## セキュリティ考慮事項

### 1. 本番環境の保護

```typescript
// 本番環境は常に削除保護を有効化
const PROTECTED_ENVIRONMENTS = ['production', 'prod', 'live'];

async function ensureProductionProtection(
  orgSlug: string,
  groupName: string
): Promise<void> {
  const isProduction = PROTECTED_ENVIRONMENTS.some((env) =>
    groupName.toLowerCase().includes(env)
  );

  if (isProduction) {
    const config = await getGroupConfiguration(orgSlug, groupName);

    if (!config.delete_protection) {
      console.warn(
        `⚠️  Production group '${groupName}' is not protected!`
      );
      await updateGroupConfiguration(orgSlug, groupName, {
        delete_protection: true,
      });
      console.log('✓ Protection enabled');
    }
  }
}
```

### 2. 権限の検証

```typescript
async function safeUpdateConfiguration(
  orgSlug: string,
  groupName: string,
  deleteProtection: boolean,
  userRole: 'admin' | 'member'
): Promise<void> {
  // 管理者のみが設定を変更可能
  if (userRole !== 'admin') {
    throw new Error('Only administrators can update group configuration');
  }

  await updateGroupConfiguration(orgSlug, groupName, {
    delete_protection: deleteProtection,
  });
}
```

### 3. APIトークンの保護

```typescript
// ✓ 環境変数を使用
const token = process.env.TURSO_API_TOKEN;

// ✗ ハードコードしない
const token = 'eyJhbGciOiJIUzI1NiIs...'; // 絶対にしない！
```

## 関連リンク

- [グループ設定の取得](/docs/services/turso/docs/api-reference/groups/configuration.md)
- [グループの作成](/docs/services/turso/docs/api-reference/groups/create.md)
- [グループの削除](/docs/services/turso/docs/api-reference/groups/delete.md)
- [グループの取得](/docs/services/turso/docs/api-reference/groups/retrieve.md)
