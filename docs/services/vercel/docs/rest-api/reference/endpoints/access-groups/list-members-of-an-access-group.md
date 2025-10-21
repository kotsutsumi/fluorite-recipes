# アクセスグループのメンバーリスト取得

アクセスグループに属するメンバーのリストを取得します。

## エンドポイント

```
GET /v1/access-groups/{idOrName}/members
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パラメータ

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `idOrName` | string | ✓ | アクセスグループのIDまたは名前 |

### クエリパラメータ

| パラメータ | 型 | 範囲/デフォルト | 説明 |
|----------|------|--------------|------|
| `limit` | integer | 1-100 (デフォルト: 20) | ページあたりの結果数 |
| `next` | string | - | 次のページ用のページネーションカーソル |
| `search` | string | - | 名前、ユーザー名、またはメールでメンバーをフィルタ |
| `teamId` | string | - | リクエスト用のチーム識別子 |
| `slug` | string | - | リクエスト用のチームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface MembersResponse {
  members: Array<{
    avatar: string;
    email: string;
    uid: string;
    username: string;
    name: string;
    createdAt: number;
    teamRole: "OWNER" | "MEMBER" | "DEVELOPER" | "SECURITY" | "BILLING" | "VIEWER" | "VIEWER_FOR_PLUS" | "CONTRIBUTOR";
  }>;
  pagination: {
    count: number;
    next: string | null;
  };
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ値 |
| 401 | 未認証リクエスト |
| 403 | 権限不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const response = await vercel.accessGroups.listMembers({
  idOrName: "my-access-group",
  limit: 50,
  search: "john",
  teamId: "team_abc123"
});

console.log(`Found ${response.members.length} members`);
response.members.forEach(member => {
  console.log(`- ${member.name} (${member.email}) - ${member.teamRole}`);
});
```

## ページネーション

```typescript
// すべてのメンバーを取得
async function getAllMembers(idOrName: string) {
  let allMembers = [];
  let next = undefined;

  do {
    const response = await vercel.accessGroups.listMembers({
      idOrName,
      limit: 100,
      next
    });

    allMembers.push(...response.members);
    next = response.pagination.next;
  } while (next);

  return allMembers;
}
```

## 関連リンク

- [Access Groups リスト](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/list-access-groups-for-a-team-project-or-member.md)
