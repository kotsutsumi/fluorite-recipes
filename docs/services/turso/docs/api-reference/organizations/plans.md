# 利用可能なプランの取得 - Turso API リファレンス

組織で利用可能な料金プランの一覧を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/plans
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
interface PlanQuotas {
  rowsRead: number;
  rowsWritten: number;
  databases: number;
  locations: number;
  storage: number;
  groups: number;
  bytesSynced: number;
}

interface Plan {
  name: string;
  price: string;
  timeline: string;
  quotas: PlanQuotas;
}

type PlansResponse = Plan[];
```

## レスポンス

### 成功時 (200 OK)

```json
[
  {
    "name": "starter",
    "price": "$0 / $29",
    "timeline": "monthly",
    "quotas": {
      "rowsRead": 1000000000,
      "rowsWritten": 25000000,
      "databases": 500,
      "locations": 3,
      "storage": 9000000000,
      "groups": 1,
      "bytesSynced": 3000000000
    }
  }
]
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org/plans" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const getAvailablePlans = async (orgSlug) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/plans`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get plans');
  }

  return await response.json();
};

// 使用例
const plans = await getAvailablePlans('my-org');
plans.forEach(plan => {
  console.log(`${plan.name}: ${plan.price} (${plan.timeline})`);
  console.log(`- Databases: ${plan.quotas.databases}`);
  console.log(`- Storage: ${plan.quotas.storage / 1e9}GB`);
});
```

### Python

```python
def get_available_plans(org_slug: str) -> list:
    """利用可能な料金プランを取得します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}/plans"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()
```

## 関連リンク

- [サブスクリプションの取得](/docs/services/turso/docs/api-reference/organizations/subscription.md)
- [使用状況の取得](/docs/services/turso/docs/api-reference/organizations/usage.md)
