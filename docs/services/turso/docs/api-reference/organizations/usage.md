# 使用状況の取得 - Turso API リファレンス

現在の請求サイクルにおける組織の使用状況を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/usage
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
interface DatabaseUsage {
  uuid: string;
  rows_read: number;
  rows_written: number;
  storage_bytes: number;
  bytes_synced: number;
}

interface UsageResponse {
  usage: {
    uuid: string;
    rows_read: number;
    rows_written: number;
    databases: number;
    storage_bytes: number;
    locations: number;
    bytes_synced: number;
    databases_usage: DatabaseUsage[];
  };
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "usage": {
    "uuid": "org-uuid-123",
    "rows_read": 1000000,
    "rows_written": 50000,
    "databases": 10,
    "storage_bytes": 1073741824,
    "locations": 3,
    "bytes_synced": 536870912,
    "databases_usage": [
      {
        "uuid": "db-uuid-123",
        "rows_read": 100000,
        "rows_written": 5000,
        "storage_bytes": 107374182,
        "bytes_synced": 53687091
      }
    ]
  }
}
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org/usage" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const getUsage = async (orgSlug) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/usage`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get usage');
  }

  return await response.json();
};

// 使用例
const { usage } = await getUsage('my-org');
console.log(`Rows read: ${usage.rows_read.toLocaleString()}`);
console.log(`Rows written: ${usage.rows_written.toLocaleString()}`);
console.log(`Storage: ${(usage.storage_bytes / 1e9).toFixed(2)}GB`);
console.log(`Databases: ${usage.databases}`);
```

### Python

```python
def get_usage(org_slug: str) -> dict:
    """組織の使用状況を取得します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}/usage"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

# 使用例
result = get_usage("my-org")
usage = result["usage"]
print(f"Rows read: {usage['rows_read']:,}")
print(f"Rows written: {usage['rows_written']:,}")
print(f"Storage: {usage['storage_bytes'] / 1e9:.2f}GB")
print(f"Databases: {usage['databases']}")
```

## 関連リンク

- [サブスクリプションの取得](/docs/services/turso/docs/api-reference/organizations/subscription.md)
- [プランの取得](/docs/services/turso/docs/api-reference/organizations/plans.md)
- [請求書の取得](/docs/services/turso/docs/api-reference/organizations/invoices.md)
