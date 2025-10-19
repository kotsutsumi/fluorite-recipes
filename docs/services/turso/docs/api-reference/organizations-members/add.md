# 組織メンバーの追加 - Turso API リファレンス

組織に新しいメンバーを追加します。

## エンドポイント

```
POST /v1/organizations/{organizationSlug}/members
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
| `username` | string | ✓ | 追加するユーザーのユーザー名 |
| `role` | string | - | ロール: "admin" または "member" |

## TypeScript インターフェース

```typescript
interface AddMemberRequest {
  username: string;
  role?: 'admin' | 'member';
}
```

## コード例

### cURL

```bash
curl -X POST "https://api.turso.tech/v1/organizations/my-org/members" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username": "newuser", "role": "member"}'
```

## 注意

このエンドポイントは現在ドキュメント化されていない可能性があります。最新の情報については[Turso公式ドキュメント](https://docs.turso.tech)を参照してください。
