# 組織メンバーの取得 - Turso API リファレンス

指定されたメンバーの詳細情報を取得します。

## エンドポイント

```
GET /v1/organizations/{organizationSlug}/members/{username}
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
| `username` | string | ✓ | メンバーのユーザー名 |

## TypeScript インターフェース

```typescript
interface MemberResponse {
  member: {
    username: string;
    email: string;
    role: 'owner' | 'admin' | 'member';
    joined_at: string;
  };
}
```

## コード例

### cURL

```bash
curl -X GET "https://api.turso.tech/v1/organizations/my-org/members/username" \
  -H "Authorization: Bearer $TURSO_API_TOKEN"
```

## 注意

このエンドポイントは現在ドキュメント化されていない可能性があります。最新の情報については[Turso公式ドキュメント](https://docs.turso.tech)を参照してください。
