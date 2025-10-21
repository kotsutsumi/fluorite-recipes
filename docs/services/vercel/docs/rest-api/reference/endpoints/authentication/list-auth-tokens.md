# 認証トークン一覧の取得

すべての認証トークンのリストを取得します。

## エンドポイント

```
GET /v5/user/tokens
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パラメータ

パラメータは不要です。

## レスポンス

### 成功 (200)

```typescript
interface AuthToken {
  id: string;
  name: string;
  type: string;  // 例: "oauth2-token"
  origin: "github" | "gitlab" | "email" | "manual" | string;
  scopes: Array<{
    type: string;
    origin: string;
    createdAt: number;
  }>;
  expiresAt: number;   // ミリ秒単位のタイムスタンプ
  activeAt: number;    // 最終使用時刻
  createdAt: number;   // 作成時刻
}

interface Response {
  tokens: AuthToken[];
  pagination: {
    count: number;
    next: number | null;
    prev: number | null;
  };
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 不正なリクエスト |
| 401 | 未認証 |
| 403 | 権限不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.authentication.listAuthTokens();

console.log(`Total tokens: ${result.pagination.count}`);

result.tokens.forEach(token => {
  console.log(`\nToken: ${token.name}`);
  console.log(`ID: ${token.id}`);
  console.log(`Type: ${token.type}`);
  console.log(`Origin: ${token.origin}`);

  if (token.expiresAt) {
    const expiresDate = new Date(token.expiresAt);
    console.log(`Expires: ${expiresDate.toLocaleString()}`);
  }

  if (token.activeAt) {
    const lastUsed = new Date(token.activeAt);
    console.log(`Last used: ${lastUsed.toLocaleString()}`);
  }

  console.log(`Scopes: ${token.scopes.length}`);
});
```

## トークンの起源

- **github**: GitHubから作成されたトークン
- **gitlab**: GitLabから作成されたトークン
- **email**: メール経由で作成されたトークン
- **manual**: 手動で作成されたトークン

## ページネーション

レスポンスにはページネーション情報が含まれます：

- **count**: 総トークン数
- **next**: 次のページがある場合はそのID
- **prev**: 前のページがある場合はそのID

## 関連リンク

- [Create Auth Token](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/create-an-auth-token.md)
- [Get Auth Token Metadata](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/get-auth-token-metadata.md)
- [Delete Auth Token](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/delete-an-authentication-token.md)
