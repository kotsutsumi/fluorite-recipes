# 現在のユーザー情報の取得

認証済みユーザーの情報を取得します。

## エンドポイント

```
GET /v2/user
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パラメータ

認証以外のパラメータは不要です。

## レスポンス

### 成功 (200)

**完全なユーザーデータ（AuthUser）**:
```typescript
interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar: string;
  createdAt: number;
  billing: object;
  resourceConfig: {
    buildLimits: object;
    databaseAllocations: object;
    featureEntitlements: object;
  };
  dashboardPreferences: object;
  trialStatus: object;
}
```

**制限付きユーザーデータ（AuthUserLimited）**:
```typescript
interface AuthUserLimited {
  id: string;
  email: string;
  username: string;
  avatar: string;
  limited: true;  // 制限付きトークン権限を示す
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 不正なリクエスト |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |
| 409 | 競合 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const user = await vercel.user.getAuthUser();

console.log(`User: ${user.username}`);
console.log(`Email: ${user.email}`);
console.log(`Created: ${new Date(user.createdAt).toLocaleDateString()}`);

if ('limited' in user && user.limited) {
  console.log('Limited token privileges');
}
```

## レスポンスタイプの違い

- **完全データ**: フルアクセストークン使用時
- **制限付きデータ**: 制限付きトークン使用時（`limited: true`フラグ）

## 関連リンク

- [List User Events](/docs/services/vercel/docs/rest-api/reference/endpoints/user/list-user-events.md)
- [Delete User Account](/docs/services/vercel/docs/rest-api/reference/endpoints/user/delete-user-account.md)
