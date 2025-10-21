# 認証トークンメタデータの取得

特定の認証トークンのメタデータを取得します。

## エンドポイント

```
GET /v5/user/tokens/{tokenId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `tokenId` | string | ✓ | トークン識別子、または"current"で現在のトークン |

## レスポンス

### 成功 (200)

```typescript
interface AuthTokenMetadata {
  id: string;
  name: string;
  type: string;  // 例: "oauth2-token"
  origin: "github" | "gitlab" | "email" | "manual";
  scopes: Array<{
    type: string;
    origin: string;
    createdAt: number;
  }>;
  expiresAt: number;  // ミリ秒単位
  activeAt: number;   // 最終使用時刻
  createdAt: number;  // 作成時刻
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリ値 |
| 401 | 認証失敗 |
| 403 | 権限不足 |
| 404 | トークンが見つかりません |

## 使用例

### 特定のトークンの情報を取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const tokenMeta = await vercel.authentication.getAuthToken({
  tokenId: '5d9f2ebd38ddca62e5d51e9c1704c72530bdc8bfdd41e782a6687c48399e8391'
});

console.log(`Token Name: ${tokenMeta.name}`);
console.log(`Type: ${tokenMeta.type}`);
console.log(`Origin: ${tokenMeta.origin}`);

if (tokenMeta.expiresAt) {
  const expiryDate = new Date(tokenMeta.expiresAt);
  const now = Date.now();
  const daysLeft = Math.floor((tokenMeta.expiresAt - now) / (1000 * 60 * 60 * 24));

  console.log(`Expires: ${expiryDate.toLocaleString()}`);
  console.log(`Days remaining: ${daysLeft}`);
}

if (tokenMeta.activeAt) {
  const lastUsed = new Date(tokenMeta.activeAt);
  console.log(`Last used: ${lastUsed.toLocaleString()}`);
}

console.log(`\nScopes (${tokenMeta.scopes.length}):`);
tokenMeta.scopes.forEach(scope => {
  console.log(`  - ${scope.type} (from ${scope.origin})`);
});
```

### 現在のトークンの情報を取得

```typescript
// 特別な値 "current" を使用
const currentToken = await vercel.authentication.getAuthToken({
  tokenId: 'current'
});

console.log(`Current token: ${currentToken.name}`);
console.log(`Created: ${new Date(currentToken.createdAt).toLocaleString()}`);
```

### トークンの有効期限チェック

```typescript
async function checkTokenExpiry(tokenId: string) {
  const token = await vercel.authentication.getAuthToken({ tokenId });

  if (!token.expiresAt) {
    console.log('This token never expires');
    return;
  }

  const now = Date.now();
  const timeLeft = token.expiresAt - now;

  if (timeLeft < 0) {
    console.log('⚠️ Token has expired!');
  } else if (timeLeft < 7 * 24 * 60 * 60 * 1000) {
    console.log('⚠️ Token expires in less than 7 days');
  } else {
    console.log('✅ Token is valid');
  }
}

await checkTokenExpiry('current');
```

## 特別な値: "current"

`tokenId`に`"current"`を指定すると、現在のリクエストで使用されているトークン自身のメタデータを取得できます。

## トークンスコープ

`scopes`配列には、トークンが持つ権限情報が含まれます：

- **type**: 権限のタイプ
- **origin**: 権限の起源
- **createdAt**: 権限が付与された時刻

## 関連リンク

- [List Auth Tokens](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/list-auth-tokens.md)
- [Create Auth Token](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/create-an-auth-token.md)
- [Delete Auth Token](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/delete-an-authentication-token.md)
