# グループ設定の取得 - Turso API リファレンス

指定されたグループの設定情報を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/groups/{groupName}/configuration
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
interface GroupConfiguration {
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

#### レスポンスフィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `delete_protection` | boolean | グループが削除から保護されているかどうか |

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org/groups/production/configuration" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const getGroupConfiguration = async (orgSlug, groupName) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/configuration`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
};

// 使用例
const config = await getGroupConfiguration('my-org', 'production');
console.log('Delete protection:', config.delete_protection);
```

### TypeScript

```typescript
import { GroupConfiguration, ErrorResponse } from './types';

async function getGroupConfiguration(
  orgSlug: string,
  groupName: string
): Promise<GroupConfiguration> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/configuration`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

// 使用例: 削除保護の確認
async function isProtected(orgSlug: string, groupName: string): Promise<boolean> {
  const config = await getGroupConfiguration(orgSlug, groupName);
  return config.delete_protection;
}

const protected = await isProtected('my-org', 'production');
console.log(`Group is ${protected ? 'protected' : 'not protected'}`);
```

### Python

```python
import os
import requests
from typing import Dict

def get_group_configuration(org_slug: str, group_name: str) -> Dict[str, bool]:
    """グループの設定情報を取得します。"""

    url = f"https://api.turso.tech/v1/organizations/{org_slug}/groups/{group_name}/configuration"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    return response.json()

# 使用例
config = get_group_configuration("my-org", "production")
print(f"Delete protection: {config['delete_protection']}")

# 削除保護の確認
def is_delete_protected(org_slug: str, group_name: str) -> bool:
    """グループが削除保護されているか確認します。"""
    config = get_group_configuration(org_slug, group_name)
    return config["delete_protection"]

if is_delete_protected("my-org", "production"):
    print("Group is protected from deletion")
else:
    print("Group can be deleted")
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

## ベストプラクティス

### 1. 削除前の確認

重要な操作を実行する前に、削除保護の状態を確認：

```typescript
async function safeDeleteGroup(orgSlug: string, groupName: string) {
  const config = await getGroupConfiguration(orgSlug, groupName);

  if (config.delete_protection) {
    throw new Error(
      `Cannot delete group '${groupName}': delete protection is enabled`
    );
  }

  // 削除処理を続行
  await deleteGroup(orgSlug, groupName);
}

// 使用例
try {
  await safeDeleteGroup('my-org', 'production');
  console.log('Group deleted successfully');
} catch (error) {
  console.error('Delete failed:', error.message);
}
```

### 2. 設定の監視

定期的に設定を確認してセキュリティポリシーに準拠：

```typescript
interface GroupSecurityStatus {
  name: string;
  deleteProtection: boolean;
  compliant: boolean;
}

async function checkGroupSecurity(
  orgSlug: string,
  groupName: string,
  requiredProtection: boolean
): Promise<GroupSecurityStatus> {
  const config = await getGroupConfiguration(orgSlug, groupName);

  return {
    name: groupName,
    deleteProtection: config.delete_protection,
    compliant: config.delete_protection === requiredProtection,
  };
}

// 使用例: 本番環境グループは削除保護が必要
const status = await checkGroupSecurity('my-org', 'production', true);
if (!status.compliant) {
  console.warn(`Security policy violation: ${status.name}`);
}
```

### 3. 設定の比較

複数のグループの設定を比較：

```typescript
async function compareGroupConfigurations(
  orgSlug: string,
  groupNames: string[]
): Promise<Map<string, GroupConfiguration>> {
  const configurations = new Map<string, GroupConfiguration>();

  await Promise.all(
    groupNames.map(async (name) => {
      try {
        const config = await getGroupConfiguration(orgSlug, name);
        configurations.set(name, config);
      } catch (error) {
        console.error(`Failed to get config for ${name}:`, error);
      }
    })
  );

  return configurations;
}

// 使用例
const configs = await compareGroupConfigurations('my-org', [
  'production',
  'staging',
  'development',
]);

configs.forEach((config, name) => {
  console.log(`${name}: delete_protection = ${config.delete_protection}`);
});
```

### 4. 設定の検証

```typescript
interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}

async function validateGroupConfiguration(
  orgSlug: string,
  groupName: string,
  requirements: {
    deleteProtection?: boolean;
  }
): Promise<ConfigValidationResult> {
  const config = await getGroupConfiguration(orgSlug, groupName);
  const errors: string[] = [];

  if (
    requirements.deleteProtection !== undefined &&
    config.delete_protection !== requirements.deleteProtection
  ) {
    errors.push(
      `Delete protection should be ${requirements.deleteProtection}, ` +
        `but is ${config.delete_protection}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// 使用例: 本番環境の設定を検証
const result = await validateGroupConfiguration('my-org', 'production', {
  deleteProtection: true,
});

if (!result.valid) {
  console.error('Configuration errors:', result.errors);
}
```

## 実用例

### 環境別の設定確認

```typescript
enum Environment {
  Production = 'production',
  Staging = 'staging',
  Development = 'development',
}

const ENVIRONMENT_REQUIREMENTS: Record<
  Environment,
  { deleteProtection: boolean }
> = {
  [Environment.Production]: { deleteProtection: true },
  [Environment.Staging]: { deleteProtection: false },
  [Environment.Development]: { deleteProtection: false },
};

async function auditEnvironmentConfiguration(
  orgSlug: string,
  environment: Environment
): Promise<boolean> {
  const requirements = ENVIRONMENT_REQUIREMENTS[environment];
  const config = await getGroupConfiguration(orgSlug, environment);

  const compliant = config.delete_protection === requirements.deleteProtection;

  if (!compliant) {
    console.warn(
      `${environment} configuration does not meet requirements:`,
      `Expected delete_protection=${requirements.deleteProtection},`,
      `got ${config.delete_protection}`
    );
  }

  return compliant;
}
```

### 設定のエクスポート

```typescript
async function exportGroupConfigurations(
  orgSlug: string,
  groupNames: string[]
): Promise<Record<string, GroupConfiguration>> {
  const configs: Record<string, GroupConfiguration> = {};

  for (const name of groupNames) {
    try {
      configs[name] = await getGroupConfiguration(orgSlug, name);
    } catch (error) {
      console.error(`Failed to export config for ${name}:`, error);
    }
  }

  return configs;
}

// 使用例: 設定をJSON形式でエクスポート
const configs = await exportGroupConfigurations('my-org', [
  'production',
  'staging',
]);
console.log(JSON.stringify(configs, null, 2));
```

## セキュリティ考慮事項

### APIトークンの保護

```typescript
// ✓ 環境変数を使用
const token = process.env.TURSO_API_TOKEN;

// ✗ ハードコードしない
const token = 'eyJhbGciOiJIUzI1NiIs...'; // 絶対にしない！
```

### アクセス制御

設定の取得には適切な読み取り権限が必要です：

```bash
# 読み取り専用トークンの作成
turso auth api-token create --name config-reader --permissions groups:read
```

## 関連リンク

- [グループの取得](/docs/services/turso/docs/api-reference/groups/retrieve.md)
- [グループ設定の更新](/docs/services/turso/docs/api-reference/groups/update-configuration.md)
- [グループの作成](/docs/services/turso/docs/api-reference/groups/create.md)
- [グループの削除](/docs/services/turso/docs/api-reference/groups/delete.md)
