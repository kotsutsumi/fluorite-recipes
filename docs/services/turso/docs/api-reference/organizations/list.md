# 組織一覧の取得 - Turso API リファレンス

ユーザーがアクセス可能なすべての組織を取得します。

## エンドポイント

```
GET /v1/organizations
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

なし

## TypeScript インターフェース

```typescript
interface Organization {
  name: string;
  slug: string;
  type: 'personal' | 'team';
  overages: boolean;
  blocked_reads: boolean;
  blocked_writes: boolean;
  plan_id: string;
  plan_timeline: string;
  platform?: string;
}

type ListOrganizationsResponse = Organization[];
```

## レスポンス

### 成功時 (200 OK)

```json
[
  {
    "name": "personal",
    "slug": "iku",
    "type": "personal",
    "overages": false,
    "blocked_reads": false,
    "blocked_writes": false,
    "plan_id": "developer",
    "plan_timeline": "monthly",
    "platform": "vercel"
  }
]
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const listOrganizations = async () => {
  const response = await fetch('https://api.turso.tech/v1/organizations', {
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to list organizations');
  }

  return await response.json();
};

// 使用例
const orgs = await listOrganizations();
console.log(`Found ${orgs.length} organization(s)`);
orgs.forEach(org => {
  console.log(`- ${org.name} (${org.type}): ${org.plan_id}`);
});
```

### TypeScript

```typescript
async function listOrganizations(): Promise<Organization[]> {
  const response = await fetch('https://api.turso.tech/v1/organizations', {
    headers: {
      'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to list organizations');
  }

  return await response.json();
}
```

### Python

```python
import os
import requests
from typing import List, Dict

def list_organizations() -> List[Dict]:
    """ユーザーがアクセス可能なすべての組織を取得します。"""
    url = "https://api.turso.tech/v1/organizations"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

# 使用例
orgs = list_organizations()
print(f"Found {len(orgs)} organization(s)")
for org in orgs:
    print(f"- {org['name']} ({org['type']}): {org['plan_id']}")
```

## 関連リンク

- [組織の取得](/docs/services/turso/docs/api-reference/organizations/retrieve.md)
- [組織の更新](/docs/services/turso/docs/api-reference/organizations/update.md)
