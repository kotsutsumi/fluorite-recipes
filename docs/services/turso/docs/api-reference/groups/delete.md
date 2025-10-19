# グループの削除 - Turso API リファレンス

指定されたグループを削除します。

## エンドポイント

```
DELETE /v1/organizations/{organizationSlug}/groups/{groupName}
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
| `groupName` | string | ✓ | 削除するグループの名前 |

## TypeScript インターフェース

```typescript
interface DeleteGroupResponse {
  group: {
    name: string;
    version: string;
    uuid: string;
    locations: string[];
    primary: string;
    delete_protection: boolean;
  };
}

interface ErrorResponse {
  error: string;
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "group": {
    "name": "default",
    "version": "v0.23.7",
    "uuid": "0a28102d-6906-11ee-8553-eaa7715aeaf2",
    "locations": ["lhr", "ams", "bos"],
    "primary": "us-east-1",
    "delete_protection": false
  }
}
```

### エラー時 (404 Not Found)

```json
{
  "error": "group not found"
}
```

## コード例

### cURL

```bash
curl -X DELETE "https://api.turso.tech/v1/organizations/my-org/groups/old-group" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const deleteGroup = async (orgSlug, groupName) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}`,
    {
      method: 'DELETE',
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

  return await response.json();
};

// 使用例
try {
  const result = await deleteGroup('my-org', 'old-group');
  console.log('Deleted group:', result.group.name);
  console.log('UUID:', result.group.uuid);
} catch (error) {
  console.error('Delete failed:', error.message);
}
```

### TypeScript

```typescript
import { DeleteGroupResponse, ErrorResponse } from './types';

async function deleteGroup(
  orgSlug: string,
  groupName: string
): Promise<DeleteGroupResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}`,
    {
      method: 'DELETE',
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

  return await response.json();
}

// 使用例: 安全な削除
async function safeDeleteGroup(
  orgSlug: string,
  groupName: string
): Promise<boolean> {
  try {
    // 削除保護の確認
    const config = await getGroupConfiguration(orgSlug, groupName);

    if (config.delete_protection) {
      console.error(`Cannot delete '${groupName}': delete protection is enabled`);
      return false;
    }

    // 確認プロンプト
    const confirmed = await confirmDelete(groupName);
    if (!confirmed) {
      console.log('Delete cancelled');
      return false;
    }

    // 削除実行
    const result = await deleteGroup(orgSlug, groupName);
    console.log(`Successfully deleted group: ${result.group.name}`);
    return true;
  } catch (error) {
    console.error('Delete failed:', error.message);
    return false;
  }
}
```

### Python

```python
import os
import requests
from typing import Dict, Any

def delete_group(org_slug: str, group_name: str) -> Dict[str, Any]:
    """グループを削除します。"""

    url = f"https://api.turso.tech/v1/organizations/{org_slug}/groups/{group_name}"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"
    }

    response = requests.delete(url, headers=headers)

    if response.status_code == 404:
        raise ValueError(f"Group not found: {group_name}")

    response.raise_for_status()
    return response.json()

# 使用例
try:
    result = delete_group("my-org", "old-group")
    print(f"Deleted group: {result['group']['name']}")
    print(f"UUID: {result['group']['uuid']}")
except ValueError as e:
    print(f"Error: {e}")
except requests.RequestException as e:
    print(f"Request error: {e}")

# 安全な削除関数
def safe_delete_group(org_slug: str, group_name: str) -> bool:
    """削除保護を確認してからグループを削除します。"""

    # 設定を確認
    config = get_group_configuration(org_slug, group_name)

    if config["delete_protection"]:
        print(f"Cannot delete '{group_name}': delete protection is enabled")
        return False

    # 確認
    confirm = input(f"Are you sure you want to delete '{group_name}'? (yes/no): ")
    if confirm.lower() != "yes":
        print("Delete cancelled")
        return False

    # 削除
    result = delete_group(org_slug, group_name)
    print(f"Successfully deleted: {result['group']['name']}")
    return True
```

## エラーシナリオ

### 1. グループが存在しない

**エラー**: 指定されたグループ名が組織内に存在しない場合

```json
{
  "error": "group not found"
}
```

**対処法**: グループ名のスペルを確認するか、グループのリストを取得して存在を確認します。

### 2. 削除保護が有効

**エラー**: グループに削除保護が設定されている場合、削除は失敗します

**対処法**:
1. 削除保護を無効化する
2. または、削除が本当に必要か再検討する

```typescript
// 削除保護を無効化してから削除
await updateGroupConfiguration(orgSlug, groupName, {
  delete_protection: false,
});
await deleteGroup(orgSlug, groupName);
```

### 3. データベースが存在する

**エラー**: グループ内にデータベースが存在する場合

**対処法**: グループ内のすべてのデータベースを削除してからグループを削除します。

## ベストプラクティス

### 1. 削除前の確認

```typescript
async function deleteGroupWithConfirmation(
  orgSlug: string,
  groupName: string
): Promise<boolean> {
  // 1. グループの存在確認
  const group = await retrieveGroup(orgSlug, groupName);

  // 2. 削除保護の確認
  const config = await getGroupConfiguration(orgSlug, groupName);
  if (config.delete_protection) {
    throw new Error(
      `Cannot delete '${groupName}': delete protection is enabled. ` +
        'Disable protection first.'
    );
  }

  // 3. グループ内のデータベース数を確認
  const databases = await listDatabases(orgSlug, groupName);
  if (databases.length > 0) {
    console.warn(
      `Warning: Group contains ${databases.length} database(s). ` +
        'All databases will be deleted.'
    );
  }

  // 4. ユーザー確認
  const confirmed = await confirm(
    `Delete group '${groupName}' and all its databases?`
  );

  if (!confirmed) {
    console.log('Delete cancelled');
    return false;
  }

  // 5. 削除実行
  await deleteGroup(orgSlug, groupName);
  console.log(`Successfully deleted group: ${groupName}`);
  return true;
}
```

### 2. バックアップの作成

```typescript
interface GroupBackup {
  group: DeleteGroupResponse['group'];
  databases: any[];
  timestamp: Date;
}

async function backupBeforeDelete(
  orgSlug: string,
  groupName: string
): Promise<GroupBackup> {
  // グループ情報を取得
  const group = await retrieveGroup(orgSlug, groupName);

  // データベース情報を取得
  const databases = await listDatabases(orgSlug, groupName);

  // バックアップデータを作成
  const backup: GroupBackup = {
    group: group.group,
    databases,
    timestamp: new Date(),
  };

  // バックアップを保存
  await saveBackup(backup);

  return backup;
}

async function deleteGroupWithBackup(
  orgSlug: string,
  groupName: string
): Promise<void> {
  console.log('Creating backup...');
  const backup = await backupBeforeDelete(orgSlug, groupName);
  console.log(`Backup created: ${backup.timestamp.toISOString()}`);

  console.log('Deleting group...');
  await deleteGroup(orgSlug, groupName);
  console.log('Group deleted successfully');
}
```

### 3. 段階的な削除

```typescript
async function safelyDeleteGroupAndDatabases(
  orgSlug: string,
  groupName: string
): Promise<void> {
  console.log(`Starting deletion process for group: ${groupName}`);

  // 1. グループ情報を取得
  const { group } = await retrieveGroup(orgSlug, groupName);
  console.log(`Found group with ${group.locations.length} location(s)`);

  // 2. 削除保護を確認
  const config = await getGroupConfiguration(orgSlug, groupName);
  if (config.delete_protection) {
    console.log('Disabling delete protection...');
    await updateGroupConfiguration(orgSlug, groupName, {
      delete_protection: false,
    });
  }

  // 3. データベースを削除
  const databases = await listDatabases(orgSlug, groupName);
  console.log(`Deleting ${databases.length} database(s)...`);

  for (const db of databases) {
    console.log(`  Deleting database: ${db.name}`);
    await deleteDatabase(orgSlug, db.name);
  }

  // 4. グループを削除
  console.log('Deleting group...');
  await deleteGroup(orgSlug, groupName);

  console.log(`✓ Successfully deleted group: ${groupName}`);
}
```

### 4. エラーハンドリングとロールバック

```typescript
async function deleteGroupWithRollback(
  orgSlug: string,
  groupName: string
): Promise<boolean> {
  let originalConfig: { delete_protection: boolean } | null = null;

  try {
    // 現在の設定を保存
    originalConfig = await getGroupConfiguration(orgSlug, groupName);

    // 削除保護を無効化
    if (originalConfig.delete_protection) {
      await updateGroupConfiguration(orgSlug, groupName, {
        delete_protection: false,
      });
    }

    // 削除実行
    await deleteGroup(orgSlug, groupName);

    console.log(`Successfully deleted group: ${groupName}`);
    return true;
  } catch (error) {
    console.error('Delete failed:', error.message);

    // ロールバック: 削除保護を元に戻す
    if (originalConfig?.delete_protection) {
      try {
        await updateGroupConfiguration(orgSlug, groupName, {
          delete_protection: true,
        });
        console.log('Rolled back configuration changes');
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError.message);
      }
    }

    return false;
  }
}
```

## 実用例

### クリーンアップスクリプト

```typescript
async function cleanupOldGroups(
  orgSlug: string,
  pattern: RegExp,
  dryRun = true
): Promise<void> {
  const groups = await listGroups(orgSlug);

  const toDelete = groups.filter((g) => pattern.test(g.name));

  console.log(`Found ${toDelete.length} group(s) matching pattern: ${pattern}`);

  for (const group of toDelete) {
    if (dryRun) {
      console.log(`[DRY RUN] Would delete: ${group.name}`);
    } else {
      try {
        await deleteGroup(orgSlug, group.name);
        console.log(`✓ Deleted: ${group.name}`);
      } catch (error) {
        console.error(`✗ Failed to delete ${group.name}:`, error.message);
      }
    }
  }
}

// 使用例: "test-" で始まるグループを削除
await cleanupOldGroups('my-org', /^test-/, false);
```

### 環境のクリーンアップ

```typescript
async function cleanupEnvironment(
  orgSlug: string,
  environment: 'development' | 'staging' | 'production',
  confirm = true
): Promise<void> {
  const groupName = environment;

  if (environment === 'production' && confirm) {
    throw new Error('Cannot delete production environment');
  }

  console.log(`Cleaning up ${environment} environment...`);

  try {
    await deleteGroup(orgSlug, groupName);
    console.log(`✓ Deleted ${environment} environment`);
  } catch (error) {
    console.error(`Failed to delete ${environment}:`, error.message);
  }
}
```

## セキュリティ考慮事項

### 1. 本番環境の保護

```typescript
const PROTECTED_GROUPS = ['production', 'prod', 'live'];

async function deleteGroupSafely(
  orgSlug: string,
  groupName: string
): Promise<void> {
  // 本番環境の誤削除を防止
  if (PROTECTED_GROUPS.includes(groupName.toLowerCase())) {
    throw new Error(
      `Cannot delete protected group: ${groupName}. ` +
        'This appears to be a production environment.'
    );
  }

  await deleteGroup(orgSlug, groupName);
}
```

### 2. 監査ログの記録

```typescript
interface DeleteAuditLog {
  timestamp: Date;
  user: string;
  groupName: string;
  groupUuid: string;
  reason: string;
}

async function deleteGroupWithAudit(
  orgSlug: string,
  groupName: string,
  user: string,
  reason: string
): Promise<void> {
  // グループ情報を取得（監査用）
  const { group } = await retrieveGroup(orgSlug, groupName);

  // 削除実行
  const result = await deleteGroup(orgSlug, groupName);

  // 監査ログを記録
  const auditLog: DeleteAuditLog = {
    timestamp: new Date(),
    user,
    groupName: result.group.name,
    groupUuid: result.group.uuid,
    reason,
  };

  await saveAuditLog(auditLog);
  console.log('Audit log saved');
}
```

### 3. APIトークンの権限

```bash
# 削除権限を持つトークンの作成
turso auth api-token create --name group-admin --permissions groups:delete
```

## 関連リンク

- [グループの作成](/docs/services/turso/docs/api-reference/groups/create.md)
- [グループの取得](/docs/services/turso/docs/api-reference/groups/retrieve.md)
- [グループ設定の更新](/docs/services/turso/docs/api-reference/groups/update-configuration.md)
- [グループのアーカイブ解除](/docs/services/turso/docs/api-reference/groups/unarchive.md)
