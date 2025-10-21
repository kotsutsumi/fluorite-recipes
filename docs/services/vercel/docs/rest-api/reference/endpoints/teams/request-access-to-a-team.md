# チームへのアクセスリクエスト

メンバーとしてチームへのアクセスをリクエストします。

## エンドポイント

```
POST /v1/teams/{teamId}/request
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

## リクエストボディ

```typescript
interface AccessRequest {
  joinedFrom: {
    origin: "import" | "teams" | "github" | "gitlab" | "bitbucket" | "feedback" | "organization-teams";
    commitId?: string;       // Gitプロバイダー用のコミットSHA
    repoId?: string;         // リポジトリID
    repoPath?: string;       // リポジトリパス（例: "jane-doe/example"）
    gitUserId?: string | number;  // GitアカウントユーザーID
    gitUserLogin?: string;   // Gitアカウントログイン名
  };
}
```

## レスポンス

### 成功 (200)

```typescript
interface AccessRequestResponse {
  teamSlug: string;
  teamName: string;
  confirmed: boolean;  // false = 承認待ち
  joinedFrom: {
    origin: string;
    commitId?: string;
    repoId?: string;
    repoPath?: string;
    gitUserId?: string | number;
    gitUserLogin?: string;
  };
  accessRequestedAt: number;  // タイムスタンプ
  github?: { login: string } | null;
  gitlab?: { login: string } | null;
  bitbucket?: { login: string } | null;
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディまたはクエリ値 |
| 401 | 認証が必要 |
| 403 | 権限不足 |
| 404 | チームが見つかりません |
| 503 | サービス利用不可 |

## 使用例

### 基本的なアクセスリクエスト

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.teams.requestAccessToTeam({
  teamId: 'team_abc123',
  requestBody: {
    joinedFrom: {
      origin: 'teams'
    }
  }
});

console.log(`Request sent to: ${result.teamName}`);
console.log(`Status: ${result.confirmed ? 'Approved' : 'Pending'}`);
console.log(`Requested at: ${new Date(result.accessRequestedAt).toLocaleString()}`);
```

### GitHubから のリクエスト

```typescript
const result = await vercel.teams.requestAccessToTeam({
  teamId: 'team_abc123',
  requestBody: {
    joinedFrom: {
      origin: 'github',
      repoPath: 'username/my-repo',
      commitId: 'abc123def456',
      gitUserLogin: 'github-username',
      gitUserId: '12345'
    }
  }
});

console.log(`GitHub user: ${result.github?.login}`);
```

### GitLabからのリクエスト

```typescript
const result = await vercel.teams.requestAccessToTeam({
  teamId: 'team_abc123',
  requestBody: {
    joinedFrom: {
      origin: 'gitlab',
      repoPath: 'username/my-project',
      repoId: 'proj_789',
      gitUserLogin: 'gitlab-username'
    }
  }
});

console.log(`GitLab user: ${result.gitlab?.login}`);
```

## リクエスト元（origin）

- **import**: インポートから
- **teams**: チームページから
- **github**: GitHubから
- **gitlab**: GitLabから
- **bitbucket**: Bitbucketから
- **feedback**: フィードバックから
- **organization-teams**: 組織チームから

## 制限事項

⚠️ **同時リクエスト数**: 一度に最大10人のユーザーがチームへのアクセスをリクエストできます。

## ワークフロー

1. ユーザーがこのエンドポイントでアクセスをリクエスト
2. チームオーナーが通知を受け取る
3. オーナーがリクエストを承認または拒否
4. 承認されると `confirmed: true` になり、メンバーとして追加される

## 関連リンク

- [Get Access Request Status](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/get-access-request-status.md)
- [Join a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/join-a-team.md)
