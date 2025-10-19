# グループの作成 - Turso API リファレンス

新しいデータベースグループを作成します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/groups
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

### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `name` | string | ✓ | 新しいグループの名前 |
| `location` | string | ✓ | グループのロケーションキー（例: "lhr", "ams", "bos"） |
| `extensions` | string \| string[] | - | 有効にする拡張機能。"all" または個別の拡張機能の配列 |

#### 利用可能な拡張機能

- `vector` - ベクトル検索機能
- `crypto` - 暗号化機能
- `fuzzy` - ファジー検索
- `math` - 数学関数
- `stats` - 統計関数
- `text` - テキスト処理
- `unicode` - Unicode処理
- `uuid` - UUID生成
- `regexp` - 正規表現
- `vec` - ベクトル操作

## TypeScript インターフェース

```typescript
interface CreateGroupRequest {
  name: string;
  location: string;
  extensions?: 'all' | Array<
    'vector' | 'crypto' | 'fuzzy' | 'math' | 'stats' |
    'text' | 'unicode' | 'uuid' | 'regexp' | 'vec'
  >;
}

interface CreateGroupResponse {
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
    "name": "new-group",
    "version": "v0.23.7",
    "uuid": "0a28102d-6906-11ee-8553-eaa7715aeaf2",
    "locations": ["lhr"],
    "primary": "lhr",
    "delete_protection": false
  }
}
```

### エラー時 (409 Conflict)

```json
{
  "error": "group already exists"
}
```

## コード例

### cURL

```bash
curl -X POST "https://api.turso.tech/v1/organizations/my-org/groups" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "new-group",
    "location": "lhr"
  }'
```

### JavaScript

```javascript
const createGroup = async (orgSlug, groupName, location) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: groupName,
        location: location,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
};

// 使用例
const group = await createGroup('my-org', 'new-group', 'lhr');
console.log('Created group:', group.group.name);
```

### TypeScript

```typescript
import { CreateGroupRequest, CreateGroupResponse, ErrorResponse } from './types';

async function createGroup(
  orgSlug: string,
  config: CreateGroupRequest
): Promise<CreateGroupResponse> {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/groups`,
    {
      method: 'POST',
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

// 使用例
const group = await createGroup('my-org', {
  name: 'production-group',
  location: 'lhr',
  extensions: ['vector', 'crypto'],
});
```

### Python

```python
import os
import requests
from typing import List, Union, Optional

def create_group(
    org_slug: str,
    name: str,
    location: str,
    extensions: Optional[Union[str, List[str]]] = None
) -> dict:
    """新しいグループを作成します。"""

    url = f"https://api.turso.tech/v1/organizations/{org_slug}/groups"

    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}",
        "Content-Type": "application/json"
    }

    data = {
        "name": name,
        "location": location
    }

    if extensions:
        data["extensions"] = extensions

    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 409:
        raise ValueError(f"Group already exists: {name}")

    response.raise_for_status()
    return response.json()

# 使用例
group = create_group(
    org_slug="my-org",
    name="production-group",
    location="lhr",
    extensions=["vector", "crypto"]
)

print(f"Created group: {group['group']['name']}")
print(f"UUID: {group['group']['uuid']}")
```

## エラーシナリオ

### 1. グループ名の重複

**エラー**: 同じ組織内に既に同じ名前のグループが存在する場合

```json
{
  "error": "group already exists"
}
```

**対処法**: 異なるグループ名を使用するか、既存のグループを削除してから再作成します。

### 2. 無効なロケーション

**エラー**: サポートされていないロケーションキーを指定した場合

**対処法**: 有効なロケーションキーを使用します。利用可能なロケーションは [Locations API](/docs/services/turso/docs/api-reference/locations/closest-region.md) で確認できます。

### 3. 認証エラー

**エラー**: 無効または期限切れのAPIトークン

**対処法**: 有効なTurso APIトークンを使用していることを確認します。

## ベストプラクティス

### 1. 適切な命名規則

```typescript
// Good: 明確で説明的な名前
await createGroup('my-org', {
  name: 'production-api',
  location: 'lhr',
});

// Bad: 曖昧な名前
await createGroup('my-org', {
  name: 'group1',
  location: 'lhr',
});
```

### 2. ロケーションの選択

ユーザーに最も近いリージョンを選択してレイテンシを最小化します：

```typescript
// ユーザーの地理的位置に基づいてロケーションを選択
const userLocation = getUserLocation(); // 例: 'europe'
const location = userLocation === 'europe' ? 'lhr' : 'iad';

await createGroup('my-org', {
  name: 'user-databases',
  location: location,
});
```

### 3. 拡張機能の選択

必要な拡張機能のみを有効にしてパフォーマンスを最適化します：

```typescript
// AIアプリケーション向け
await createGroup('my-org', {
  name: 'ai-embeddings',
  location: 'lhr',
  extensions: ['vector'], // ベクトル検索のみ
});

// 汎用アプリケーション向け
await createGroup('my-org', {
  name: 'general-app',
  location: 'lhr',
  extensions: 'all', // すべての拡張機能
});
```

### 4. エラーハンドリング

```typescript
async function createGroupSafely(
  orgSlug: string,
  config: CreateGroupRequest
): Promise<CreateGroupResponse | null> {
  try {
    return await createGroup(orgSlug, config);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Group already exists, retrieving existing group...');
      // 既存のグループを取得
      return await getGroup(orgSlug, config.name);
    }
    console.error('Failed to create group:', error);
    return null;
  }
}
```

## セキュリティ考慮事項

### APIトークンの保護

```typescript
// ✓ 環境変数を使用
const token = process.env.TURSO_API_TOKEN;

// ✗ ハードコードしない
const token = 'eyJhbGciOiJIUzI1NiIs...'; // 絶対にしない！
```

### トークンの権限

グループ作成には適切な組織権限を持つAPIトークンが必要です：

```bash
# 適切な権限を持つトークンを作成
turso auth api-token create --name group-manager --permissions groups:write
```

## 関連リンク

- [グループの取得](/docs/services/turso/docs/api-reference/groups/retrieve.md)
- [グループの削除](/docs/services/turso/docs/api-reference/groups/delete.md)
- [グループ設定の更新](/docs/services/turso/docs/api-reference/groups/update-configuration.md)
- [ロケーション一覧](/docs/services/turso/docs/api-reference/locations/closest-region.md)
