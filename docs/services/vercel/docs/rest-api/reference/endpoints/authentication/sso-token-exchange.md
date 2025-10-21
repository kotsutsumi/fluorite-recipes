# SSOトークン交換

Vercelから受け取ったコードをアクセストークンと交換します。

## エンドポイント

```
POST /v1/integrations/sso/token
```

**ベースURL**: `https://api.vercel.com`

## 認証

このエンドポイントは認証不要です。

## リクエストボディ

```typescript
interface TokenExchangeRequest {
  // 必須フィールド
  code: string;           // Vercelから受け取った機密コード
  client_id: string;      // インテグレーションクライアントID
  client_secret: string;  // インテグレーションクライアントシークレット

  // オプションフィールド
  state?: string;         // 初期化リクエストから受け取った状態
  redirect_uri?: string;  // インテグレーションリダイレクトURI
  grant_type?: "authorization_code";  // フォームエンコード時に必須
}
```

## レスポンス

### 成功 (200)

```typescript
interface TokenExchangeResponse {
  id_token: string;
  access_token: string | null;
  token_type: string | null;
  expires_in: number;
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディパラメータ |
| 403 | 禁止 |
| 404 | 見つかりません |
| 500 | サーバーエラー |

## 使用例

```typescript
// OAuth認証フローでの使用
const response = await fetch('https://api.vercel.com/v1/integrations/sso/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: 'auth_code_from_vercel',
    client_id: 'your_client_id',
    client_secret: 'your_client_secret',
    redirect_uri: 'https://your-app.com/callback',
    state: 'random_state_value'
  })
});

const tokens = await response.json();

console.log(`ID Token: ${tokens.id_token}`);
console.log(`Expires in: ${tokens.expires_in} seconds`);

// トークンを使用してAPIリクエストを実行
if (tokens.access_token) {
  // アクセストークンでAPIを呼び出す
}
```

## 重要な注意事項

⚠️ **トークンの永続化について**

- 返された `id_token` をデータベースに永続化しないでください
- トークンは有効期限があります（`expires_in`で指定）
- OAuth認証フロー中の一時的な使用のみを想定しています

## OAuthフロー

1. ユーザーをVercel認証ページにリダイレクト
2. ユーザーが認証を承認
3. Vercelがコード付きでリダイレクトURI にリダイレクト
4. このエンドポイントでコードをトークンに交換
5. トークンを使用してAPIリクエストを実行

## コンテンツタイプ

- **JSON**: `application/json`
- **フォームエンコード**: `application/x-www-form-urlencoded` （`grant_type`が必要）
