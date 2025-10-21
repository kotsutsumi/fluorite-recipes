# 認証トークンの作成

新しい認証トークンを作成します。

## エンドポイント

```
POST /v3/user/tokens
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |
| `slug` | string | チームスラッグ（例: `my-team-url-slug`） |

## リクエストボディ

```typescript
interface CreateTokenRequest {
  name: string;       // 必須: トークン名
  expiresAt?: number; // オプション: 有効期限（ミリ秒単位のタイムスタンプ）
}
```

## レスポンス

### 成功 (200)

```typescript
interface CreateTokenResponse {
  token: {
    id: string;
    name: string;
    type: "oauth2-token";
    origin: "github" | "email" | "manual";
    scopes: Array<{
      type: string;
      origin: string;
      createdAt: number;
    }>;
    expiresAt: number;
    activeAt: number;
    createdAt: number;
  };
  bearerToken: string;  // このレスポンスでのみ提供される
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディ |
| 401 | 未認証 |
| 403 | 権限不足 |

## 使用例

### 基本的なトークン作成

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.authentication.createAuthToken({
  requestBody: {
    name: 'CI/CD Pipeline Token'
  }
});

// ⚠️ 重要: bearerTokenはこのレスポンスでのみ提供されます
console.log('New Token:', result.bearerToken);
console.log('Token ID:', result.token.id);

// トークンを安全に保存
process.env.NEW_VERCEL_TOKEN = result.bearerToken;
```

### 有効期限付きトークン

```typescript
// 30日後に期限切れになるトークンを作成
const expiresIn30Days = Date.now() + (30 * 24 * 60 * 60 * 1000);

const tempToken = await vercel.authentication.createAuthToken({
  requestBody: {
    name: 'Temporary Access Token',
    expiresAt: expiresIn30Days
  }
});

console.log(`Token expires: ${new Date(tempToken.token.expiresAt).toLocaleString()}`);
```

### チーム用トークン

```typescript
const teamToken = await vercel.authentication.createAuthToken({
  teamId: 'team_abc123',
  requestBody: {
    name: 'Team Deployment Token'
  }
});

console.log('Team Token Created:', teamToken.bearerToken);
```

## 重要な注意事項

⚠️ **bearerTokenの保存**

`bearerToken`プロパティは**レスポンス時に一度だけ**提供されます。必ずクライアント側で安全に保存してください：

```typescript
// 良い例: すぐに保存
const { bearerToken } = result;
await saveToSecureStorage(bearerToken);

// 悪い例: 保存し忘れた場合、再取得不可
```

## トークンの用途

- **CI/CD**: デプロイメント自動化
- **自動化スクリプト**: プロジェクト管理の自動化
- **サードパーティ連携**: 外部サービスとの統合
- **一時的アクセス**: 期限付きの限定的アクセス

## 関連リンク

- [List Auth Tokens](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/list-auth-tokens.md)
- [Get Auth Token Metadata](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/get-auth-token-metadata.md)
- [Delete Auth Token](/docs/services/vercel/docs/rest-api/reference/endpoints/authentication/delete-an-authentication-token.md)
