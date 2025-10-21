# 組織メンバーの削除 - Turso API リファレンス

組織からメンバーを削除します。

## エンドポイント

```
DELETE /v1/organizations/{organizationSlug}/members/{username}
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
| `username` | string | ✓ | 削除するメンバーのユーザー名 |

## コード例

### cURL

```bash
curl -X DELETE "https://api.turso.tech/v1/organizations/my-org/members/username" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

### JavaScript

```javascript
const removeMember = async (orgSlug, username) => {
  const response = await fetch(
    `https://api.turso.tech/v1/organizations/${orgSlug}/members/${username}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.TURSO_API_TOKEN}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to remove member');
  }
  
  return await response.json();
};
```

## 注意

このエンドポイントは現在ドキュメント化されていない可能性があります。最新の情報については[Turso公式ドキュメント](https://docs.turso.tech)を参照してください。
