# 組織メンバーの一覧取得 - Turso API リファレンス

組織のメンバー一覧を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/members
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
interface Member {
  username: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

type ListMembersResponse = Member[];
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org/members" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const listMembers = async (orgSlug) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/members`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to list members');
  }
  
  return await response.json();
};
```

## 注意

このエンドポイントは現在ドキュメント化されていない可能性があります。最新の情報については[Turso公式ドキュメント](https://docs.turso.tech)を参照してください。
