# グループのアーカイブ解除 - Turso API リファレンス

アーカイブされたグループを復元します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/groups/{groupName}/unarchive
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
| `groupName` | string | ✓ | アーカイブ解除するグループの名前 |

## TypeScript インターフェース

```typescript
interface UnarchiveGroupResponse {
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
curl -X POST "https://api.turso.tech/v1/organizations/my-org/groups/archived-group/unarchive" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const unarchiveGroup = async (orgSlug, groupName) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/unarchive`,
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

  return await response.json();
};

// 使用例
try {
  const result = await unarchiveGroup('my-org', 'archived-group');
  console.log('Unarchived group:', result.group.name);
  console.log('UUID:', result.group.uuid);
  console.log('Locations:', result.group.locations.join(', '));
} catch (error) {
  console.error('Unarchive failed:', error.message);
}
```

### TypeScript

```typescript
import { UnarchiveGroupResponse, ErrorResponse } from './types';

async function unarchiveGroup(
  orgSlug: string,
  groupName: string
): Promise<UnarchiveGroupResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}/unarchive`,
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

  return await response.json();
}

// 使用例: アーカイブ解除と検証
async function restoreGroup(orgSlug: string, groupName: string): Promise<boolean> {
  try {
    console.log(`Unarchiving group: ${groupName}...`);

    const result = await unarchiveGroup(orgSlug, groupName);

    console.log('✓ Group unarchived successfully');
    console.log(`  Name: ${result.group.name}`);
    console.log(`  Version: ${result.group.version}`);
    console.log(`  Locations: ${result.group.locations.join(', ')}`);

    return true;
  } catch (error) {
    console.error('Unarchive failed:', error.message);
    return false;
  }
}
```

### Python

```python
import os
import requests
from typing import Dict, Any

def unarchive_group(org_slug: str, group_name: str) -> Dict[str, Any]:
    """アーカイブされたグループを復元します。"""

    url = f"https://api.turso.tech/v1/organizations/{org_slug}/groups/{group_name}/unarchive"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"
    }

    response = requests.post(url, headers=headers)

    if response.status_code == 404:
        raise ValueError(f"Group not found: {group_name}")

    response.raise_for_status()
    return response.json()

# 使用例
try:
    result = unarchive_group("my-org", "archived-group")
    group = result["group"]

    print(f"Unarchived group: {group['name']}")
    print(f"Version: {group['version']}")
    print(f"UUID: {group['uuid']}")
    print(f"Locations: {', '.join(group['locations'])}")
    print(f"Primary: {group['primary']}")

except ValueError as e:
    print(f"Error: {e}")
except requests.RequestException as e:
    print(f"Request error: {e}")
```

## エラーシナリオ

### 1. グループが存在しない

**エラー**: 指定されたグループ名が組織内に存在しない場合

```json
{
  "error": "group not found"
}
```

**対処法**: グループ名のスペルを確認するか、アーカイブされたグループのリストを確認します。

### 2. グループがアーカイブされていない

**エラー**: グループが既にアクティブな状態の場合

**対処法**: グループの状態を確認し、既にアクティブであれば操作は不要です。

### 3. 認証エラー

**エラー**: 無効または期限切れのAPIトークン

**対処法**: 有効なTurso APIトークンを使用していることを確認します。

## ベストプラクティス

### 1. アーカイブ状態の確認

```typescript
async function isGroupArchived(
  orgSlug: string,
  groupName: string
): Promise<boolean> {
  try {
    const group = await retrieveGroup(orgSlug, groupName);
    // アーカイブされたグループは特定のフィールドで識別可能
    return group.group.archived || false;
  } catch (error) {
    if (error.message.includes('not found')) {
      return false;
    }
    throw error;
  }
}

// 使用例
const archived = await isGroupArchived('my-org', 'old-group');
if (archived) {
  console.log('Group is archived, can be unarchived');
} else {
  console.log('Group is active or does not exist');
}
```

### 2. 復元後の検証

```typescript
async function unarchiveAndVerify(
  orgSlug: string,
  groupName: string
): Promise<boolean> {
  console.log(`Unarchiving group: ${groupName}...`);

  // アーカイブ解除
  const result = await unarchiveGroup(orgSlug, groupName);

  // グループが正常に復元されたことを確認
  const group = await retrieveGroup(orgSlug, groupName);

  if (group.group.uuid !== result.group.uuid) {
    throw new Error('UUID mismatch after unarchive');
  }

  // ロケーションが復元されたことを確認
  if (result.group.locations.length === 0) {
    console.warn('Warning: Group has no locations after unarchive');
  }

  console.log('✓ Group unarchived and verified');
  return true;
}
```

### 3. 一括復元

```typescript
async function unarchiveMultipleGroups(
  orgSlug: string,
  groupNames: string[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  for (const groupName of groupNames) {
    try {
      console.log(`Unarchiving ${groupName}...`);

      await unarchiveGroup(orgSlug, groupName);

      results.set(groupName, true);
      console.log(`✓ ${groupName} unarchived`);
    } catch (error) {
      results.set(groupName, false);
      console.error(`✗ Failed to unarchive ${groupName}:`, error.message);
    }
  }

  const successCount = Array.from(results.values()).filter(Boolean).length;
  console.log(`\n✓ Unarchived ${successCount}/${groupNames.length} groups`);

  return results;
}

// 使用例
const archivedGroups = ['old-group-1', 'old-group-2', 'old-group-3'];
const results = await unarchiveMultipleGroups('my-org', archivedGroups);
```

### 4. 自動復元スクリプト

```typescript
interface UnarchivePolicy {
  minDaysSinceArchive: number;
  maxDaysSinceArchive: number;
  namePattern?: RegExp;
}

async function autoUnarchiveGroups(
  orgSlug: string,
  policy: UnarchivePolicy
): Promise<void> {
  // アーカイブされたグループのリストを取得
  const archivedGroups = await listArchivedGroups(orgSlug);

  const now = Date.now();

  for (const group of archivedGroups) {
    const archiveAge = (now - group.archivedAt.getTime()) / (1000 * 60 * 60 * 24);

    // ポリシーに基づいて復元を判断
    if (
      archiveAge >= policy.minDaysSinceArchive &&
      archiveAge <= policy.maxDaysSinceArchive &&
      (!policy.namePattern || policy.namePattern.test(group.name))
    ) {
      try {
        await unarchiveGroup(orgSlug, group.name);
        console.log(`✓ Auto-unarchived: ${group.name}`);
      } catch (error) {
        console.error(`✗ Failed to auto-unarchive ${group.name}:`, error.message);
      }
    }
  }
}

// 使用例: 7-30日前にアーカイブされたグループを復元
await autoUnarchiveGroups('my-org', {
  minDaysSinceArchive: 7,
  maxDaysSinceArchive: 30,
  namePattern: /^production-/,
});
```

## 実用例

### ディザスタリカバリ

```typescript
async function emergencyRestore(
  orgSlug: string,
  groupName: string
): Promise<void> {
  console.log('🚨 Emergency restore initiated');

  try {
    // グループを復元
    const result = await unarchiveGroup(orgSlug, groupName);

    console.log(`✓ Group restored: ${result.group.name}`);
    console.log(`  Locations: ${result.group.locations.join(', ')}`);

    // 削除保護を有効化
    await updateGroupConfiguration(orgSlug, groupName, {
      delete_protection: true,
    });

    console.log('✓ Delete protection enabled');

    // 通知を送信
    await sendNotification({
      subject: 'Emergency Restore Complete',
      message: `Group ${groupName} has been restored and protected`,
    });

    console.log('✓ Emergency restore complete');
  } catch (error) {
    console.error('❌ Emergency restore failed:', error);
    await sendAlert({
      severity: 'critical',
      message: `Failed to restore group ${groupName}: ${error.message}`,
    });
    throw error;
  }
}
```

### スケジュールされた復元

```typescript
async function scheduleUnarchive(
  orgSlug: string,
  groupName: string,
  unarchiveDate: Date
): Promise<void> {
  const now = new Date();
  const delay = unarchiveDate.getTime() - now.getTime();

  if (delay <= 0) {
    console.log('Unarchiving immediately...');
    await unarchiveGroup(orgSlug, groupName);
    return;
  }

  console.log(
    `Scheduled unarchive for ${groupName} at ${unarchiveDate.toISOString()}`
  );

  setTimeout(async () => {
    try {
      await unarchiveGroup(orgSlug, groupName);
      console.log(`✓ Scheduled unarchive complete: ${groupName}`);
    } catch (error) {
      console.error('Scheduled unarchive failed:', error);
    }
  }, delay);
}

// 使用例: 1週間後に復元
const unarchiveDate = new Date();
unarchiveDate.setDate(unarchiveDate.getDate() + 7);
await scheduleUnarchive('my-org', 'seasonal-group', unarchiveDate);
```

### バックアップからの復元

```typescript
interface ArchivedGroupBackup {
  name: string;
  uuid: string;
  archivedAt: Date;
  originalConfig: any;
}

async function restoreFromBackup(
  orgSlug: string,
  backup: ArchivedGroupBackup
): Promise<void> {
  console.log(`Restoring group from backup: ${backup.name}`);

  try {
    // グループを復元
    const result = await unarchiveGroup(orgSlug, backup.name);

    // UUIDが一致することを確認
    if (result.group.uuid !== backup.uuid) {
      throw new Error('UUID mismatch - this may not be the same group');
    }

    // 元の設定を復元
    if (backup.originalConfig?.delete_protection) {
      await updateGroupConfiguration(orgSlug, backup.name, {
        delete_protection: backup.originalConfig.delete_protection,
      });
    }

    console.log('✓ Group restored from backup successfully');
  } catch (error) {
    console.error('Restore from backup failed:', error);
    throw error;
  }
}
```

## セキュリティ考慮事項

### 1. 復元の承認

```typescript
async function unarchiveGroupWithApproval(
  orgSlug: string,
  groupName: string,
  approver: string
): Promise<void> {
  // 承認を要求
  const approved = await requestApproval({
    action: 'unarchive_group',
    groupName,
    approver,
  });

  if (!approved) {
    throw new Error('Unarchive request was not approved');
  }

  // 承認されたので実行
  await unarchiveGroup(orgSlug, groupName);

  // 監査ログに記録
  await logAudit({
    action: 'unarchive',
    groupName,
    approver,
    timestamp: new Date(),
  });
}
```

### 2. APIトークンの保護

```typescript
// ✓ 環境変数を使用
const token = process.env.TURSO_API_TOKEN;

// ✗ ハードコードしない
const token = 'eyJhbGciOiJIUzI1NiIs...'; // 絶対にしない！
```

### 3. 権限の検証

```bash
# 適切な権限を持つトークンの作成
turso auth api-token create --name group-restorer --permissions groups:write
```

## 関連リンク

- [グループの作成](/docs/services/turso/docs/api-reference/groups/create.md)
- [グループの取得](/docs/services/turso/docs/api-reference/groups/retrieve.md)
- [グループの削除](/docs/services/turso/docs/api-reference/groups/delete.md)
- [グループ設定の更新](/docs/services/turso/docs/api-reference/groups/update-configuration.md)
