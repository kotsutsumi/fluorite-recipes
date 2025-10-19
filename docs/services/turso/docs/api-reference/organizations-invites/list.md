# 組織招待の一覧取得 - Turso API リファレンス

組織の招待一覧を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/invites
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
interface Invite {
  id: string;
  email: string;
  role: 'admin' | 'member';
  created_at: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired';
}

type ListInvitesResponse = Invite[];
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org/invites" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const listInvites = async (orgSlug) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/invites`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to list invites');
  }
  
  return await response.json();
};
```

### Python

```python
def list_invites(org_slug: str) -> list:
    """組織の招待一覧を取得します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}/invites"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()
```

## 注意

このエンドポイントは現在ドキュメント化されていない可能性があります。最新の情報については[Turso公式ドキュメント](https://docs.turso.tech)を参照してください。
