# グループの転送 - Turso API リファレンス

グループを別の組織に転送します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/groups/{groupName}/transfer
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `organizationSlug` | string | ✓ | 転送元の組織スラッグ |
| `groupName` | string | ✓ | 転送するグループの名前 |

### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `organization` | string | ✓ | 転送先の組織スラッグ |

## TypeScript インターフェース

```typescript
interface TransferGroupRequest {
  organization: string;
}

interface TransferGroupResponse {
  name: string;
  uuid: string;
  primary: string;
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
  "name": "default",
  "uuid": "0a28102d-6906-11ee-8553-eaa7715aeaf2",
  "primary": "us-east-1",
  "delete_protection": false
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
curl -X POST "https://api.turso.tech/v1/organizations/source-org/groups/my-group/transfer" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organization": "target-org"
  }'
```

### JavaScript

```javascript
const transferGroup = async (sourceOrg, groupName, targetOrg) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${sourceOrg}/groups/${groupName}/transfer`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organization: targetOrg,
      }),
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
const result = await transferGroup('my-org', 'production-db', 'new-org');
console.log('Transferred group:', result.name);
console.log('UUID:', result.uuid);
```

### TypeScript

```typescript
import { TransferGroupRequest, TransferGroupResponse, ErrorResponse } from './types';

async function transferGroup(
  sourceOrg: string,
  groupName: string,
  request: TransferGroupRequest
): Promise<TransferGroupResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${sourceOrg}/groups/${groupName}/transfer`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
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

// 使用例: 安全な転送
async function safeTransferGroup(
  sourceOrg: string,
  groupName: string,
  targetOrg: string
): Promise<boolean> {
  try {
    console.log(`Transferring '${groupName}' from ${sourceOrg} to ${targetOrg}...`);

    const result = await transferGroup(sourceOrg, groupName, {
      organization: targetOrg,
    });

    console.log(`✓ Group transferred successfully`);
    console.log(`  UUID: ${result.uuid}`);
    console.log(`  Primary: ${result.primary}`);

    return true;
  } catch (error) {
    console.error('Transfer failed:', error.message);
    return false;
  }
}
```

### Python

```python
import os
import requests
from typing import Dict, Any

def transfer_group(
    source_org: str,
    group_name: str,
    target_org: str
) -> Dict[str, Any]:
    """グループを別の組織に転送します。"""

    url = f"https://api.turso.tech/v1/organizations/{source_org}/groups/{group_name}/transfer"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}",
        "Content-Type": "application/json"
    }

    data = {
        "organization": target_org
    }

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 404:
        raise ValueError(f"Group not found: {group_name}")

    response.raise_for_status()
    return response.json()

# 使用例
try:
    result = transfer_group("source-org", "my-group", "target-org")
    print(f"Transferred group: {result['name']}")
    print(f"UUID: {result['uuid']}")
    print(f"Primary: {result['primary']}")
except ValueError as e:
    print(f"Error: {e}")
except requests.RequestException as e:
    print(f"Request error: {e}")
```

## エラーシナリオ

### 1. グループが存在しない

**エラー**: 転送元の組織に指定されたグループが存在しない場合

```json
{
  "error": "group not found"
}
```

**対処法**: グループ名と組織スラッグが正しいことを確認します。

### 2. 転送先組織へのアクセス権がない

**エラー**: 転送先の組織のメンバーでない、または適切な権限がない場合

**対処法**: 両方の組織で管理者権限を持つトークンを使用します。

### 3. 転送先組織に同名のグループが存在

**エラー**: 転送先の組織に同じ名前のグループが既に存在する場合

**対処法**: グループ名を変更するか、転送先の既存グループを削除/リネームします。

## ベストプラクティス

### 1. 転送前の確認

```typescript
async function transferGroupWithValidation(
  sourceOrg: string,
  groupName: string,
  targetOrg: string
): Promise<boolean> {
  // 1. 転送元でグループの存在を確認
  try {
    const group = await retrieveGroup(sourceOrg, groupName);
    console.log(`Found group in ${sourceOrg}:`, group.group.name);
  } catch (error) {
    console.error('Group not found in source organization');
    return false;
  }

  // 2. 転送先で同名のグループがないか確認
  try {
    await retrieveGroup(targetOrg, groupName);
    console.error(`Group '${groupName}' already exists in target organization`);
    return false;
  } catch (error) {
    // グループが存在しない（正常）
  }

  // 3. 転送実行
  const result = await transferGroup(sourceOrg, groupName, {
    organization: targetOrg,
  });

  console.log(`✓ Successfully transferred: ${result.name}`);
  return true;
}
```

### 2. バックアップの作成

```typescript
interface GroupTransferBackup {
  timestamp: Date;
  sourceOrg: string;
  targetOrg: string;
  groupName: string;
  groupUuid: string;
  groupDetails: any;
}

async function transferGroupWithBackup(
  sourceOrg: string,
  groupName: string,
  targetOrg: string
): Promise<void> {
  // 転送前にバックアップを作成
  const group = await retrieveGroup(sourceOrg, groupName);

  const backup: GroupTransferBackup = {
    timestamp: new Date(),
    sourceOrg,
    targetOrg,
    groupName,
    groupUuid: group.group.uuid,
    groupDetails: group.group,
  };

  // バックアップを保存
  await saveBackup(backup);
  console.log('Backup created');

  // 転送実行
  const result = await transferGroup(sourceOrg, groupName, {
    organization: targetOrg,
  });

  console.log(`Transferred ${groupName} from ${sourceOrg} to ${targetOrg}`);
}
```

### 3. 転送後の確認

```typescript
async function transferAndVerify(
  sourceOrg: string,
  groupName: string,
  targetOrg: string
): Promise<boolean> {
  // 転送前のUUIDを記録
  const originalGroup = await retrieveGroup(sourceOrg, groupName);
  const originalUuid = originalGroup.group.uuid;

  // 転送実行
  const result = await transferGroup(sourceOrg, groupName, {
    organization: targetOrg,
  });

  // UUIDが一致することを確認
  if (result.uuid !== originalUuid) {
    throw new Error('UUID mismatch after transfer');
  }

  // 転送先で確認
  const verifyGroup = await retrieveGroup(targetOrg, groupName);
  if (verifyGroup.group.uuid !== originalUuid) {
    throw new Error('Group not found in target organization');
  }

  // 転送元から削除されたことを確認
  try {
    await retrieveGroup(sourceOrg, groupName);
    throw new Error('Group still exists in source organization');
  } catch (error) {
    // グループが存在しない（正常）
  }

  console.log('✓ Transfer verified successfully');
  return true;
}
```

### 4. 一括転送

```typescript
interface GroupTransferTask {
  groupName: string;
  targetOrg: string;
}

async function bulkTransferGroups(
  sourceOrg: string,
  transfers: GroupTransferTask[]
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  for (const task of transfers) {
    try {
      console.log(`Transferring ${task.groupName} to ${task.targetOrg}...`);

      await transferGroup(sourceOrg, task.groupName, {
        organization: task.targetOrg,
      });

      results.set(task.groupName, true);
      console.log(`✓ ${task.groupName} transferred`);
    } catch (error) {
      results.set(task.groupName, false);
      console.error(`✗ Failed to transfer ${task.groupName}:`, error.message);
    }
  }

  return results;
}

// 使用例
const transfers: GroupTransferTask[] = [
  { groupName: 'group-1', targetOrg: 'org-a' },
  { groupName: 'group-2', targetOrg: 'org-b' },
  { groupName: 'group-3', targetOrg: 'org-a' },
];

const results = await bulkTransferGroups('source-org', transfers);
console.log(`Transferred ${Array.from(results.values()).filter(Boolean).length} groups`);
```

## 実用例

### 組織の統合

```typescript
async function consolidateOrganizations(
  sourceOrgs: string[],
  targetOrg: string,
  groupPattern?: RegExp
): Promise<void> {
  console.log(`Consolidating groups into ${targetOrg}...`);

  for (const sourceOrg of sourceOrgs) {
    console.log(`\nProcessing ${sourceOrg}...`);

    // グループ一覧を取得
    const groups = await listGroups(sourceOrg);

    // パターンでフィルタリング（指定されている場合）
    const groupsToTransfer = groupPattern
      ? groups.filter((g) => groupPattern.test(g.name))
      : groups;

    console.log(`Found ${groupsToTransfer.length} group(s) to transfer`);

    // 転送実行
    for (const group of groupsToTransfer) {
      try {
        await transferGroup(sourceOrg, group.name, {
          organization: targetOrg,
        });
        console.log(`  ✓ Transferred: ${group.name}`);
      } catch (error) {
        console.error(`  ✗ Failed: ${group.name} - ${error.message}`);
      }
    }
  }

  console.log('\n✓ Consolidation complete');
}

// 使用例
await consolidateOrganizations(
  ['old-org-1', 'old-org-2'],
  'main-org',
  /^production-/ // "production-" で始まるグループのみ
);
```

### 環境の再編成

```typescript
async function reorganizeEnvironments(
  currentOrg: string,
  envMapping: Map<string, string>
): Promise<void> {
  for (const [groupName, targetOrg] of envMapping) {
    try {
      console.log(`Moving ${groupName} to ${targetOrg}...`);

      await transferGroup(currentOrg, groupName, {
        organization: targetOrg,
      });

      console.log(`✓ Moved successfully`);
    } catch (error) {
      console.error(`✗ Failed to move ${groupName}:`, error.message);
    }
  }
}

// 使用例: 環境別に組織を分離
const envMapping = new Map([
  ['production', 'prod-org'],
  ['staging', 'staging-org'],
  ['development', 'dev-org'],
]);

await reorganizeEnvironments('current-org', envMapping);
```

## セキュリティ考慮事項

### 1. 権限の確認

```typescript
async function transferGroupSecurely(
  sourceOrg: string,
  groupName: string,
  targetOrg: string,
  userRole: 'admin' | 'member'
): Promise<void> {
  // 管理者のみが転送可能
  if (userRole !== 'admin') {
    throw new Error('Only administrators can transfer groups');
  }

  // 重要なグループの転送を制限
  const protectedGroups = ['production', 'prod', 'live'];
  if (protectedGroups.includes(groupName.toLowerCase())) {
    console.warn(`⚠️  Transferring protected group: ${groupName}`);
    const confirmed = await confirm(
      'This is a protected group. Are you sure you want to transfer it?'
    );
    if (!confirmed) {
      throw new Error('Transfer cancelled');
    }
  }

  await transferGroup(sourceOrg, groupName, {
    organization: targetOrg,
  });
}
```

### 2. 監査ログ

```typescript
interface TransferAuditLog {
  timestamp: Date;
  user: string;
  sourceOrg: string;
  targetOrg: string;
  groupName: string;
  groupUuid: string;
  reason: string;
}

async function transferGroupWithAudit(
  sourceOrg: string,
  groupName: string,
  targetOrg: string,
  user: string,
  reason: string
): Promise<void> {
  // 転送前の情報を取得
  const group = await retrieveGroup(sourceOrg, groupName);

  // 転送実行
  const result = await transferGroup(sourceOrg, groupName, {
    organization: targetOrg,
  });

  // 監査ログを記録
  const auditLog: TransferAuditLog = {
    timestamp: new Date(),
    user,
    sourceOrg,
    targetOrg,
    groupName,
    groupUuid: result.uuid,
    reason,
  };

  await saveAuditLog(auditLog);
  console.log('Transfer completed and logged');
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

- [グループの作成](/docs/services/turso/docs/api-reference/groups/create.md)
- [グループの取得](/docs/services/turso/docs/api-reference/groups/retrieve.md)
- [グループの削除](/docs/services/turso/docs/api-reference/groups/delete.md)
- [組織の取得](/docs/services/turso/docs/api-reference/organizations/retrieve.md)
