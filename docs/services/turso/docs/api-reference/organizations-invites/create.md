# 組織招待の作成 - Turso API リファレンス

組織への新しい招待を作成します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/invites
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
| `email` | string | ✓ | 招待するユーザーのメールアドレス |
| `role` | string | - | ロール: "admin" または "member" (デフォルト: "member") |

## TypeScript インターフェース

```typescript
interface CreateInviteRequest {
  email: string;
  role?: 'admin' | 'member';
}

interface CreateInviteResponse {
  invite: {
    id: string;
    email: string;
    role: string;
    created_at: string;
    expires_at: string;
  };
}
```

## コード例

### cURL

```bash
curl -X POST "https://api.turso.tech/v1/organizations/my-org/invites" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "role": "member"}'
```

### JavaScript

```javascript
const createInvite = async (orgSlug, email, role = 'member') => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/invites`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, role }),
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to create invite');
  }
  
  return await response.json();
};

// 使用例
const invite = await createInvite('my-org', 'newuser@example.com', 'member');
console.log('Invite created:', invite.invite.id);
```

### Python

```python
def create_invite(org_slug: str, email: str, role: str = "member") -> dict:
    """組織への招待を作成します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}/invites"
    headers = {
        "Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}",
        "Content-Type": "application/json"
    }
    data = {"email": email, "role": role}
    
    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    return response.json()
```

## 注意

このエンドポイントは現在ドキュメント化されていない可能性があります。最新の情報については[Turso公式ドキュメント](https://docs.turso.tech)を参照してください。
