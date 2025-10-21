# 組織の更新 - Turso API リファレンス

組織の設定を更新します。

## エンドポイント

```
PATCH /v1/organizations/{organizationSlug}
```

## ベースURL

```
https://api.turso.tech
```

## パラメータ

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `organizationSlug` | string | ✓ | 組織のスラッグ |

### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `overages` | boolean | ✓ | オーバー許可の有効/無効 |

## TypeScript インターフェース

```typescript
interface UpdateOrganizationRequest {
  overages: boolean;
}

interface UpdateOrganizationResponse {
  organization: {
    name: string;
    slug: string;
    type: 'personal' | 'team';
    overages: boolean;
    blocked_reads: boolean;
    blocked_writes: boolean;
    plan_id: string;
    plan_timeline: string;
    platform?: string;
  };
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "organization": {
    "name": "personal",
    "slug": "iku",
    "type": "personal",
    "overages": true,
    "blocked_reads": false,
    "blocked_writes": false,
    "plan_id": "developer",
    "plan_timeline": "monthly",
    "platform": "vercel"
  }
}
```

## コード例

### cURL

```bash
curl -X PATCH "https://api.turso.tech/v1/organizations/my-org" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"overages": true}'
```

### JavaScript

```javascript
const updateOrganization = async (orgSlug, overages) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ overages }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update organization');
  }

  return await response.json();
};
```

### Python

```python
def update_organization(org_slug: str, overages: bool) -> dict:
    """組織の設定を更新します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}"
    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}",
        "Content-Type": "application/json"
    }
    data = {"overages": overages}

    response = requests.patch(url, json=data, headers=headers)
    response.raise_for_status()
    return response.json()
```

## 関連リンク

- [組織の取得](/docs/services/turso/docs/api-reference/organizations/retrieve.md)
- [組織プランの取得](/docs/services/turso/docs/api-reference/organizations/plans.md)
