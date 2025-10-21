# 請求書の取得 - Turso API リファレンス

組織の請求書一覧を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/invoices
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

### クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `type` | string | - | フィルタータイプ: "all", "upcoming", "issued" |

## TypeScript インターフェース

```typescript
interface Invoice {
  invoice_number: string;
  amount_due: string;
  due_date: string;
  paid_at?: string;
  payment_failed_at?: string;
  invoice_pdf?: string;
}

interface InvoicesResponse {
  invoices: Invoice[];
}
```

## レスポンス

### 成功時 (200 OK)

```json
{
  "invoices": [
    {
      "invoice_number": "LFONTK-00001",
      "amount_due": "10.29",
      "due_date": "2024-01-01T05:00:00+00:00",
      "paid_at": "2024-01-01T05:00:00+00:00",
      "payment_failed_at": null,
      "invoice_pdf": "https://assets.withorb.com/invoice/..."
    }
  ]
}
```

## コード例

### cURL

```bash
# すべての請求書
curl -X GET "https://api.turso.tech/v1/organizations/my-org/invoices?type=all" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"

# 発行済みの請求書のみ
curl -X GET "https://api.turso.tech/v1/organizations/my-org/invoices?type=issued" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const getInvoices = async (orgSlug, type = 'all') => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/invoices?type=${type}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get invoices');
  }

  return await response.json();
};
```

### Python

```python
def get_invoices(org_slug: str, invoice_type: str = "all") -> dict:
    """組織の請求書を取得します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}/invoices"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}
    params = {"type": invoice_type}

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()
```

## 関連リンク

- [サブスクリプションの取得](/docs/services/turso/docs/api-reference/organizations/subscription.md)
- [使用状況の取得](/docs/services/turso/docs/api-reference/organizations/usage.md)
