# チームメンバー一覧の取得

チームのメンバー一覧を取得します。

## エンドポイント

```
GET /v3/teams/{teamId}/members
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `teamId` | string | ✓ | チーム識別子 |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `limit` | number | 返すメンバー数の上限（最小: 1） |
| `since` | number | この日時以降に追加されたメンバーのみ（ミリ秒） |
| `until` | number | この日時以前に追加されたメンバーのみ（ミリ秒） |
| `search` | string | 名前、ユーザー名、メールでメンバーを検索 |
| `role` | enum | ロールでフィルタ |
| `excludeProject` | string | 指定プロジェクトのメンバーを除外 |
| `eligibleMembersForProjectId` | string | 指定プロジェクトに適格なメンバーを含む |

## ロール

- `OWNER` - オーナー
- `MEMBER` - メンバー
- `DEVELOPER` - 開発者
- `SECURITY` - セキュリティ
- `BILLING` - 請求管理者
- `VIEWER` - 閲覧者
- `VIEWER_FOR_PLUS` - Plus閲覧者
- `CONTRIBUTOR` - コントリビューター

## レスポンス

### 成功 (200)

```typescript
interface TeamMember {
  uid: string;
  username: string;
  email: string;
  role: string;
  createdAt: number;
  confirmedAt?: number;
  github?: { login: string };
  gitlab?: { login: string };
  bitbucket?: { login: string };
  projectMemberships?: Array<{
    projectId: string;
    role: string;
  }>;
}

interface Response {
  members: TeamMember[];
  emailInviteCodes: Array<{
    email: string;
    inviteCode: string;
    createdAt: number;
  }>;
  pagination: {
    hasNext: boolean;
    count: number;
    next?: number;
    prev?: number;
  };
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | リソースが見つかりません |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.teams.listTeamMembers({
  teamId: 'team_abc123',
  limit: 20,
  role: 'DEVELOPER'
});

console.log(`Total members: ${result.pagination.count}`);

result.members.forEach(member => {
  console.log(`${member.username} (${member.role})`);
  console.log(`  Email: ${member.email}`);

  if (member.github) {
    console.log(`  GitHub: ${member.github.login}`);
  }

  if (member.projectMemberships) {
    console.log(`  Projects: ${member.projectMemberships.length}`);
  }
});

if (result.emailInviteCodes.length > 0) {
  console.log(`\nPending invites: ${result.emailInviteCodes.length}`);
}
```

## フィルタリング例

### ロールで絞り込み

```typescript
const developers = await vercel.teams.listTeamMembers({
  teamId: 'team_abc123',
  role: 'DEVELOPER'
});
```

### 検索

```typescript
const searchResults = await vercel.teams.listTeamMembers({
  teamId: 'team_abc123',
  search: 'john'
});
```

### プロジェクト適格性

```typescript
const eligible = await vercel.teams.listTeamMembers({
  teamId: 'team_abc123',
  eligibleMembersForProjectId: 'prj_xyz789'
});
```
