# ユーザーアカウントの削除

ユーザーアカウントの削除を開始します。

## エンドポイント

```
DELETE /v1/user
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## リクエストボディ（オプション）

```typescript
interface DeleteRequest {
  reasons?: Array<{
    slug: string;        // 理由の識別子
    description: string; // 理由の説明
  }>;
}
```

## レスポンス

### 成功 (202)

削除が正常に開始されました：

```typescript
interface DeleteResponse {
  id: string;
  email: string;
  message: "Verification email sent";
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディ |
| 401 | 未認証 |
| 402 | 支払い問題 |
| 403 | 権限不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.user.requestDelete({
  reasons: [
    {
      slug: 'switching-service',
      description: '別のサービスに移行するため'
    }
  ]
});

console.log(`確認メールを送信: ${result.email}`);
console.log(result.message);
```

## ワークフロー

1. このエンドポイントを呼び出すと、アカウント削除が開始されます
2. 確認リンクが記載されたメールがユーザーに送信されます
3. ユーザーはリンクをクリックして削除を確定する必要があります

## 注意事項

- 削除は即座には実行されません
- ユーザーによる確認が必要です
- 削除理由の提供はオプションですが、フィードバックとして有用です

## 関連リンク

- [Get the User](/docs/services/vercel/docs/rest-api/reference/endpoints/user/get-the-user.md)
