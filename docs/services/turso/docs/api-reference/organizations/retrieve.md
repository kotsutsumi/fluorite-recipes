# 組織の取得 - Turso API リファレンス

指定された組織の詳細情報を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}
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

## TypeScript インターフェース

```typescript
interface OrganizationResponse {
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
    "overages": false,
    "blocked_reads": false,
    "blocked_writes": false,
    "plan_id": "developer",
    "plan_timeline": "monthly",
    "platform": "vercel"
  }
}
```

### エラー時 (404 Not Found)

```json
{
  "error": "organization not found"
}
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const getOrganization = async (orgSlug) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Organization '${orgSlug}' not found`);
  }

  return await response.json();
};
```

### Python

```python
def get_organization(org_slug: str) -> dict:
    """組織の詳細情報を取得します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}

    response = requests.get(url, headers=headers)
    if response.status_code == 404:
        raise ValueError(f"Organization not found: {org_slug}")

    response.raise_for_status()
    return response.json()
```

## 関連リンク

- [組織一覧の取得](/docs/services/turso/docs/api-reference/organizations/list.md)
- [組織の更新](/docs/services/turso/docs/api-reference/organizations/update.md)
