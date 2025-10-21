# 認証トークンの削除

認証トークンを無効化して削除します。

## エンドポイント

```
DELETE /v3/user/tokens/{tokenId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `tokenId` | string | ✓ | 64文字の16進文字列、または"current" |

## レスポンス

### 成功 (200)

```typescript
interface DeleteTokenResponse {
  tokenId: string;  // 削除されたトークンのID
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリ値 |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | 指定されたtokenIdのトークンが見つかりません |

## 使用例

### 特定のトークンを削除

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.authentication.deleteAuthToken({
  tokenId: '5d9f2ebd38ddca62e5d51e9c1704c72530bdc8bfdd41e782a6687c48399e8391'
});

console.log(`Deleted token: ${result.tokenId}`);
```

### 現在のトークンを無効化

```typescript
// 特別な値 "current" を使用してリクエストに使用中のトークンを削除
const result = await vercel.authentication.deleteAuthToken({
  tokenId: 'current'
});

console.log('Current token has been invalidated');
// この後、このトークンでのAPIリクエストは失敗します
```

### 期限切れトークンのクリーンアップ

```typescript
async function cleanupExpiredTokens() {
  // すべてのトークンを取得
  const { tokens } = await vercel.authentication.listAuthTokens();

  const now = Date.now();
  const expiredTokens = tokens.filter(
    token => token.expiresAt && token.expiresAt < now
  );

  console.log(`Found ${expiredTokens.length} expired tokens`);

  // 期限切れトークンを削除
  for (const token of expiredTokens) {
    await vercel.authentication.deleteAuthToken({
      tokenId: token.id
    });
    console.log(`Deleted expired token: ${token.name}`);
  }
}

await cleanupExpiredTokens();
```

### 未使用トークンの削除

```typescript
async function removeUnusedTokens(daysInactive: number) {
  const { tokens } = await vercel.authentication.listAuthTokens();

  const cutoffTime = Date.now() - (daysInactive * 24 * 60 * 60 * 1000);
  const unusedTokens = tokens.filter(
    token => token.activeAt < cutoffTime
  );

  console.log(`Found ${unusedTokens.length} tokens unused for ${daysInactive}+ days`);

  for (const token of unusedTokens) {
    await vercel.authentication.deleteAuthToken({
      tokenId: token.id
    });

    const lastUsed = new Date(token.activeAt).toLocaleDateString();
    console.log(`Deleted: ${token.name} (last used: ${lastUsed})`);
  }
}

// 90日以上使用されていないトークンを削除
await removeUnusedTokens(90);
```

## 特別な値: "current"

`tokenId`に`"current"`を指定すると、現在のAPIリクエストで使用されているトークン自身を削除できます。

⚠️ **注意**: この操作を実行すると、即座にそのトークンが無効化され、以降のAPIリクエストは認証エラーになります。

## セキュリティのベストプラクティス

1. **定期的なトークンローテーション**: 古いトークンを削除して新しいものを作成
2. **侵害時の対応**: トークンが漏洩した疑いがある場合は即座に削除
3. **未使用トークンのクリーンアップ**: 定期的に使用されていないトークンを削除
4. **期限切れトークンの削除**: 有効期限が切れたトークンは削除

## 関連リンク

- [List Auth Tokens](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/list-auth-tokens.md)
- [Create Auth Token](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/create-an-auth-token.md)
- [Get Auth Token Metadata](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/get-auth-token-metadata.md)
