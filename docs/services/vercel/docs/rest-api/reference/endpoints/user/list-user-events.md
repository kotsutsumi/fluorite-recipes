# ユーザーイベント一覧の取得

ユーザーがVercel上で生成した「イベント」のリストを取得します（ログイン、デプロイメント作成、チーム参加など）。

## エンドポイント

```
GET /v3/events
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `limit` | number | 最大結果数（例: 20） |
| `since` | string | この日時以降に作成されたイベントをフィルタ（ISO 8601） |
| `until` | string | この日時以前に作成されたイベントをフィルタ（ISO 8601） |
| `types` | string | イベントタイプのカンマ区切りリスト（例: login, team-member-join） |
| `userId` | string | 非推奨。`principalId` を使用してください |
| `principalId` | string | チームイベント取得時の特定プリンシパルでフィルタ |
| `projectIds` | string | プロジェクトIDのカンマ区切りリスト |
| `withPayload` | string | "true"に設定するとペイロードを含む |
| `teamId` | string | リクエストコンテキスト用のチーム識別子 |
| `slug` | string | リクエストコンテキスト用のチームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface Event {
  id: string;
  text: string;
  entities: Array<{
    type: string;
    start: number;
    end: number;
  }>;
  createdAt: number;
  user: {
    username: string;
    avatar: string;
    email: string;
    uid: string;
  };
  principal: object;
  via: object;
  userId: string;
  principalId: string;
  payload?: object;
}

interface Response {
  events: Event[];
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.user.listUserEvents({
  limit: 20,
  types: 'login,team-member-join'
});

result.events.forEach(event => {
  console.log(`${event.text} - ${new Date(event.createdAt)}`);
});
```

## イベントタイプの例

- `login` - ユーザーログイン
- `team-member-join` - チームメンバー参加
- `domain-buy` - ドメイン購入
- `deployment-created` - デプロイメント作成

## 関連リンク

- [Get the User](/docs/services/vercel/docs/rest-api/reference/endpoints/user/get-the-user.md)
