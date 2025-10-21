# グループの取得 - Turso API リファレンス

指定されたグループの詳細情報を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/groups/{groupName}
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
| `groupName` | string | ✓ | 取得するグループの名前 |

## TypeScript インターフェース

```typescript
interface Group {
  name: string;
  version: string;
  uuid: string;
  locations: string[];
  primary: string;
  delete_protection: boolean;
}

interface RetrieveGroupResponse {
  group: Group;
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

#### レスポンスフィールド

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `name` | string | グループの名前 |
| `version` | string | データベースエンジンのバージョン |
| `uuid` | string | グループの一意識別子 |
| `locations` | string[] | グループが展開されているロケーションのリスト |
| `primary` | string | プライマリロケーション |
| `delete_protection` | boolean | 削除保護が有効かどうか |

### エラー時 (404 Not Found)

```json
{
  "error": "group not found"
}
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org/groups/default" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const getGroup = async (orgSlug, groupName) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}`,
    {
      method: 'GET',
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
  const result = await getGroup('my-org', 'default');
  console.log('Group:', result.group.name);
  console.log('Locations:', result.group.locations.join(', '));
  console.log('Primary:', result.group.primary);
} catch (error) {
  console.error('Error:', error.message);
}
```

### TypeScript

```typescript
import { RetrieveGroupResponse, ErrorResponse } from './types';

async function retrieveGroup(
  orgSlug: string,
  groupName: string
): Promise<RetrieveGroupResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups/${groupName}`,
    {
      method: 'GET',
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

// 使用例: グループ情報の取得と表示
async function displayGroupInfo(orgSlug: string, groupName: string) {
  const { group } = await retrieveGroup(orgSlug, groupName);

  console.log(`
    Group Information:
    - Name: ${group.name}
    - Version: ${group.version}
    - UUID: ${group.uuid}
    - Locations: ${group.locations.join(', ')}
    - Primary: ${group.primary}
    - Delete Protection: ${group.delete_protection ? 'Enabled' : 'Disabled'}
  `);
}
```

### Python

```python
import os
import requests
from typing import Dict, Any

def retrieve_group(org_slug: str, group_name: str) -> Dict[str, Any]:
    """グループの詳細情報を取得します。"""

    url = f"https://api.turso.tech/v1/organizations/{org_slug}/groups/{group_name}"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 404:
        raise ValueError(f"Group not found: {group_name}")

    response.raise_for_status()
    return response.json()

# 使用例
try:
    result = retrieve_group("my-org", "default")
    group = result["group"]

    print(f"Group: {group['name']}")
    print(f"Version: {group['version']}")
    print(f"UUID: {group['uuid']}")
    print(f"Locations: {', '.join(group['locations'])}")
    print(f"Primary: {group['primary']}")
    print(f"Delete Protection: {'Enabled' if group['delete_protection'] else 'Disabled'}")

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

**対処法**: グループ名のスペルを確認するか、利用可能なグループのリストを取得します。

### 2. 認証エラー

**エラー**: 無効または期限切れのAPIトークン

**対処法**: 有効なTurso APIトークンを使用していることを確認します。

### 3. 権限不足

**エラー**: 指定された組織へのアクセス権がない場合

**対処法**: 組織のメンバーであることを確認し、適切な権限を持つトークンを使用します。

## ベストプラクティス

### 1. 存在確認

グループを使用する前に存在を確認：

```typescript
async function ensureGroupExists(
  orgSlug: string,
  groupName: string
): Promise<boolean> {
  try {
    await retrieveGroup(orgSlug, groupName);
    return true;
  } catch (error) {
    if (error.message.includes('not found')) {
      return false;
    }
    throw error;
  }
}

// 使用例
if (await ensureGroupExists('my-org', 'production')) {
  console.log('Group exists, proceeding...');
} else {
  console.log('Group does not exist, creating...');
  await createGroup('my-org', { name: 'production', location: 'lhr' });
}
```

### 2. グループ情報のキャッシング

頻繁にアクセスされるグループ情報はキャッシュします：

```typescript
class GroupCache {
  private cache = new Map<string, { data: RetrieveGroupResponse; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5分

  async get(orgSlug: string, groupName: string): Promise<RetrieveGroupResponse> {
    const key = `${orgSlug}:${groupName}`;
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }

    const data = await retrieveGroup(orgSlug, groupName);
    this.cache.set(key, { data, timestamp: Date.now() });

    return data;
  }

  invalidate(orgSlug: string, groupName: string): void {
    const key = `${orgSlug}:${groupName}`;
    this.cache.delete(key);
  }
}

const groupCache = new GroupCache();
```

### 3. バージョン確認

データベースエンジンのバージョンを確認：

```typescript
async function checkGroupVersion(
  orgSlug: string,
  groupName: string,
  minVersion: string
): Promise<boolean> {
  const { group } = await retrieveGroup(orgSlug, groupName);

  // バージョン比較ロジック
  const currentVersion = group.version.replace('v', '');
  const minimumVersion = minVersion.replace('v', '');

  return currentVersion >= minimumVersion;
}

// 使用例
const isCompatible = await checkGroupVersion('my-org', 'production', 'v0.23.0');
if (!isCompatible) {
  console.warn('Group version is outdated');
}
```

### 4. 削除保護の確認

重要な操作前に削除保護の状態を確認：

```typescript
async function canDeleteGroup(
  orgSlug: string,
  groupName: string
): Promise<boolean> {
  const { group } = await retrieveGroup(orgSlug, groupName);
  return !group.delete_protection;
}

// 使用例
if (await canDeleteGroup('my-org', 'production')) {
  console.log('Group can be deleted');
} else {
  console.log('Group is protected from deletion');
}
```

## 実用例

### グループのヘルスチェック

```typescript
interface GroupHealth {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  locations: number;
  deleteProtection: boolean;
}

async function checkGroupHealth(
  orgSlug: string,
  groupName: string
): Promise<GroupHealth> {
  try {
    const { group } = await retrieveGroup(orgSlug, groupName);

    let status: GroupHealth['status'] = 'healthy';

    // ロケーション数が少ない場合は警告
    if (group.locations.length < 2) {
      status = 'warning';
    }

    return {
      name: group.name,
      status,
      locations: group.locations.length,
      deleteProtection: group.delete_protection,
    };
  } catch (error) {
    return {
      name: groupName,
      status: 'error',
      locations: 0,
      deleteProtection: false,
    };
  }
}
```

### マルチリージョン展開の確認

```typescript
async function isMultiRegion(
  orgSlug: string,
  groupName: string
): Promise<boolean> {
  const { group } = await retrieveGroup(orgSlug, groupName);
  return group.locations.length > 1;
}

// 使用例
const multiRegion = await isMultiRegion('my-org', 'production');
console.log(`Multi-region deployment: ${multiRegion ? 'Yes' : 'No'}`);
```

## セキュリティ考慮事項

### 1. APIトークンの保護

```typescript
// ✓ 環境変数を使用
const token = process.env.TURSO_API_TOKEN;

// ✗ ハードコードしない
const token = 'eyJhbGciOiJIUzI1NiIs...'; // 絶対にしない！
```

### 2. エラーメッセージの処理

機密情報を含む可能性のあるエラーメッセージをユーザーに直接表示しない：

```typescript
async function getGroupSafely(orgSlug: string, groupName: string) {
  try {
    return await retrieveGroup(orgSlug, groupName);
  } catch (error) {
    // 一般的なエラーメッセージをログに記録
    console.error('Failed to retrieve group');
    // ユーザーには簡潔なメッセージを返す
    throw new Error('Unable to retrieve group information');
  }
}
```

## 関連リンク

- [グループの作成](/docs/services/turso/docs/api-reference/groups/create.md)
- [グループの削除](/docs/services/turso/docs/api-reference/groups/delete.md)
- [グループ設定の取得](/docs/services/turso/docs/api-reference/groups/configuration.md)
- [グループ設定の更新](/docs/services/turso/docs/api-reference/groups/update-configuration.md)
