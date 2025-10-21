# サブスクリプションの取得 - Turso API リファレンス

組織の現在のサブスクリプション情報を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/subscription
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
interface SubscriptionResponse {
  subscription: {
    name: string;
    overages: boolean;
    plan: string;
    timeline: string;
  };
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "subscription": {
    "name": "scaler",
    "overages": true,
    "plan": "scaler",
    "timeline": "monthly"
  }
}
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org/subscription" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const getSubscription = async (orgSlug) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/subscription`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get subscription');
  }

  return await response.json();
};
```

### Python

```python
def get_subscription(org_slug: str) -> dict:
    """組織のサブスクリプション情報を取得します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}/subscription"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()
```

## 関連リンク

- [プランの取得](/docs/services/turso/docs/api-reference/organizations/plans.md)
- [請求書の取得](/docs/services/turso/docs/api-reference/organizations/invoices.md)
