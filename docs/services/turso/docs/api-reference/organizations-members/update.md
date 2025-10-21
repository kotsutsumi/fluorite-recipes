# 組織メンバーの更新 - Turso API リファレンス

メンバーのロールを更新します。

## エンドポイント

```
PATCH /v1/organizations/{organizationSlug}/members/{username}
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

### リクエストボディ

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `role` | string | ✓ | 新しいロール: "admin" または "member" |

## TypeScript インターフェース

```typescript
interface UpdateMemberRequest {
  role: 'admin' | 'member';
}
```

## コード例

### cURL

```bash
curl -X PATCH "https://api.turso.tech/v1/organizations/my-org/members/username" \
  -H "Authorization: Bearer $TURSO_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

## 注意

このエンドポイントは現在ドキュメント化されていない可能性があります。最新の情報については[Turso公式ドキュメント](https://docs.turso.tech)を参照してください。
