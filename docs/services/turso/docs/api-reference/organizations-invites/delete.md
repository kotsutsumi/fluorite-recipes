# 組織招待の削除 - Turso API リファレンス

組織の招待を削除（取り消し）します。

## エンドポイント

```
DELETE /v1/organizations/{organizationSlug}/invites/{inviteId}
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
| `inviteId` | string | ✓ | 招待のID |

## TypeScript インターフェース

```typescript
interface DeleteInviteResponse {
  message: string;
}
```

## コード例

### cURL

```bash
curl -X DELETE "https://api.turso.tech/v1/organizations/my-org/invites/invite-id" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const deleteInvite = async (orgSlug, inviteId) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/invites/${inviteId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to delete invite');
  }
  
  return await response.json();
};

// 使用例
await deleteInvite('my-org', 'invite-123');
console.log('Invite deleted successfully');
```

### Python

```python
def delete_invite(org_slug: str, invite_id: str) -> dict:
    """組織の招待を削除します。"""
    url = f"https://api.turso.tech/v1/organizations/{org_slug}/invites/{invite_id}"
    headers = {"Authorization": f"Bearer {os.environ['TURSO_API_TOKEN']}"}
    
    response = requests.delete(url, headers=headers)
    response.raise_for_status()
    return response.json()
```

## ベストプラクティス

### 期限切れ招待のクリーンアップ

```typescript
async function cleanupExpiredInvites(orgSlug: string): Promise<void> {
  const invites = await listInvites(orgSlug);
  const now = new Date();
  
  const expiredInvites = invites.filter(invite => {
    const expiresAt = new Date(invite.expires_at);
    return expiresAt < now && invite.status === 'pending';
  });
  
  console.log(`Found ${expiredInvites.length} expired invite(s)`);
  
  for (const invite of expiredInvites) {
    await deleteInvite(orgSlug, invite.id);
    console.log(`Deleted expired invite: ${invite.email}`);
  }
}
```

## 注意

このエンドポイントは現在ドキュメント化されていない可能性があります。最新の情報については[Turso公式ドキュメント](https://docs.turso.tech)を参照してください。
