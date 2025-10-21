# アクセスリクエストステータスの取得

チームへのアクセスリクエストの現在のステータスを取得します。

## エンドポイント

```
GET /v1/teams/{teamId}/request/{userId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `teamId` | string | ✓ | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |
| `userId` | string | ✓ | ユーザー識別子 |

## レスポンス

### 成功 (200)

```typescript
interface AccessRequestStatus {
  teamSlug: string;
  teamName: string;
  confirmed: boolean;  // false = 承認待ち, true = メンバーとして承認済み
  joinedFrom: {
    origin: "link" | "mail" | "import" | "teams" | "github" | "gitlab" | "bitbucket" | "saml" | "dsync" | "feedback" | "organization-teams";
    commitId?: string;
    repoId?: string;
    repoPath?: string;
    gitUserId?: string | number;
    gitUserLogin?: string;
  };
  accessRequestedAt: number;  // ミリ秒単位のタイムスタンプ
  github?: { login: string } | null;
  gitlab?: { login: string } | null;
  bitbucket?: { login: string } | null;
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエスト値、またはユーザーが既に承認済みメンバー |
| 401 | 認証なし/無効 |
| 403 | 権限不足 |
| 404 | ユーザーにメンバーシップがない、またはチームが見つかりません |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const status = await vercel.teams.getTeamAccessRequest({
  teamId: 'team_abc123',
  userId: 'user_xyz789'
});

console.log(`Team: ${status.teamName}`);
console.log(`Status: ${status.confirmed ? 'Approved ✅' : 'Pending ⏳'}`);

const requestedDate = new Date(status.accessRequestedAt);
console.log(`Requested: ${requestedDate.toLocaleString()}`);

console.log(`\nJoined from: ${status.joinedFrom.origin}`);

if (status.github) {
  console.log(`GitHub: ${status.github.login}`);
}
if (status.gitlab) {
  console.log(`GitLab: ${status.gitlab.login}`);
}
if (status.bitbucket) {
  console.log(`Bitbucket: ${status.bitbucket.login}`);
}

if (status.joinedFrom.repoPath) {
  console.log(`Repository: ${status.joinedFrom.repoPath}`);
}
```

## ステータスのチェック

```typescript
async function checkAccessStatus(teamId: string, userId: string) {
  try {
    const status = await vercel.teams.getTeamAccessRequest({
      teamId,
      userId
    });

    if (status.confirmed) {
      console.log('✅ User is a confirmed member');
      return 'member';
    } else {
      const daysPending = Math.floor(
        (Date.now() - status.accessRequestedAt) / (1000 * 60 * 60 * 24)
      );
      console.log(`⏳ Access request pending for ${daysPending} days`);
      return 'pending';
    }
  } catch (error) {
    if (error.statusCode === 404) {
      console.log('❌ No access request found');
      return 'no-request';
    }
    throw error;
  }
}

await checkAccessStatus('team_abc123', 'user_xyz789');
```

## リクエスト元の追跡

```typescript
const status = await vercel.teams.getTeamAccessRequest({
  teamId: 'team_abc123',
  userId: 'user_xyz789'
});

switch (status.joinedFrom.origin) {
  case 'github':
    console.log(`Joined via GitHub: ${status.joinedFrom.repoPath}`);
    break;
  case 'gitlab':
    console.log(`Joined via GitLab: ${status.joinedFrom.repoPath}`);
    break;
  case 'teams':
    console.log('Joined via Teams page');
    break;
  case 'link':
    console.log('Joined via invite link');
    break;
  case 'saml':
    console.log('Joined via SAML SSO');
    break;
  default:
    console.log(`Joined via: ${status.joinedFrom.origin}`);
}
```

## 注意事項

- ユーザーが既にメンバーとして承認されている場合、400エラーが返されます
- アクセスリクエストが存在しない場合、404エラーが返されます
- `confirmed: false`は承認待ちを意味します
- `confirmed: true`は承認済みでメンバーになっていることを意味します

## 関連リンク

- [Request Access to Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/request-access-to-a-team.md)
- [Join a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/join-a-team.md)
