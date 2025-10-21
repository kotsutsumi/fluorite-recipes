# すべてのチームの一覧取得

アカウントに関連付けられたすべてのチームを取得します。

## エンドポイント

```
GET /v2/teams
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `limit` | number | 返すチームの最大数（デフォルト: 20） |
| `since` | number | この日時以降に作成されたチームのみ（ミリ秒） |
| `until` | number | この日時以前に作成されたチームのみ（ミリ秒） |

## レスポンス

### 成功 (200)

```typescript
interface Team {
  id: string;
  slug: string;
  name: string | null;
  avatar: string | null;
  membership: {
    role: string;
    confirmed: boolean;
  };
  createdAt: number;
  resourceConfig: {
    buildLimits: object;
    storageLimits: object;
  };
  saml?: {
    enabled: boolean;
    enforcedForNewMembers: boolean;
  };
  defaultDeploymentProtection?: object;
}

interface Response {
  teams: (Team | TeamLimited)[];
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
| 400 | 無効なクエリパラメータ値 |
| 401 | 認証なし/無効 |
| 403 | リソースへのアクセス権限なし |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.teams.getTeams({
  limit: 20
});

console.log(`Total teams: ${result.pagination.count}`);

result.teams.forEach(team => {
  console.log(`\nTeam: ${team.name || team.slug}`);
  console.log(`  ID: ${team.id}`);
  console.log(`  Slug: ${team.slug}`);
  console.log(`  Your role: ${team.membership.role}`);
  console.log(`  Confirmed: ${team.membership.confirmed}`);
  console.log(`  Created: ${new Date(team.createdAt).toLocaleDateString()}`);
});

if (result.pagination.next) {
  console.log(`\nMore teams available (next: ${result.pagination.next})`);
}
```

## ページネーション

```typescript
async function getAllTeams() {
  const allTeams = [];
  let nextTimestamp: number | null = null;

  do {
    const result = await vercel.teams.getTeams({
      limit: 20,
      since: nextTimestamp || undefined
    });

    allTeams.push(...result.teams);
    nextTimestamp = result.pagination.next;

    console.log(`Fetched ${result.teams.length} teams...`);
  } while (nextTimestamp);

  console.log(`\nTotal teams fetched: ${allTeams.length}`);
  return allTeams;
}

const teams = await getAllTeams();
```

## ロール別フィルタリング

```typescript
const result = await vercel.teams.getTeams({ limit: 100 });

const teamsByRole = {
  owner: result.teams.filter(t => t.membership.role === 'OWNER'),
  member: result.teams.filter(t => t.membership.role === 'MEMBER'),
  viewer: result.teams.filter(t => t.membership.role === 'VIEWER'),
  developer: result.teams.filter(t => t.membership.role === 'DEVELOPER')
};

console.log('Teams by role:');
console.log(`  OWNER: ${teamsByRole.owner.length}`);
console.log(`  MEMBER: ${teamsByRole.member.length}`);
console.log(`  VIEWER: ${teamsByRole.viewer.length}`);
console.log(`  DEVELOPER: ${teamsByRole.developer.length}`);
```

## 日付範囲でのフィルタリング

```typescript
// 2024年1月1日以降に作成されたチーム
const since = new Date('2024-01-01').getTime();

const result = await vercel.teams.getTeams({
  since,
  limit: 50
});

console.log(`Teams created since 2024-01-01: ${result.teams.length}`);
```

## SAML有効チームの確認

```typescript
const result = await vercel.teams.getTeams({ limit: 100 });

const samlTeams = result.teams.filter(team => team.saml?.enabled);

console.log(`Teams with SAML enabled: ${samlTeams.length}`);

samlTeams.forEach(team => {
  console.log(`\n${team.name || team.slug}:`);
  console.log(`  SAML enforced: ${team.saml?.enforcedForNewMembers}`);
});
```

## チーム詳細の取得

```typescript
const result = await vercel.teams.getTeams({ limit: 20 });

// 各チームの詳細情報を取得
for (const team of result.teams) {
  const details = await vercel.teams.getTeam({ teamId: team.id });

  console.log(`\n${details.name}:`);
  console.log(`  Members: (use listTeamMembers to get count)`);
  console.log(`  Build limits: ${JSON.stringify(details.resourceConfig.buildLimits)}`);

  if (details.description) {
    console.log(`  Description: ${details.description}`);
  }
}
```

## 統計情報の集計

```typescript
const result = await vercel.teams.getTeams({ limit: 100 });

const stats = {
  total: result.pagination.count,
  confirmed: result.teams.filter(t => t.membership.confirmed).length,
  withSAML: result.teams.filter(t => t.saml?.enabled).length,
  byRole: {
    OWNER: 0,
    MEMBER: 0,
    VIEWER: 0,
    DEVELOPER: 0
  }
};

result.teams.forEach(team => {
  if (team.membership.role in stats.byRole) {
    stats.byRole[team.membership.role as keyof typeof stats.byRole]++;
  }
});

console.log('Team Statistics:');
console.log(`  Total teams: ${stats.total}`);
console.log(`  Confirmed memberships: ${stats.confirmed}`);
console.log(`  SAML-enabled teams: ${stats.withSAML}`);
console.log('\n  Roles:');
Object.entries(stats.byRole).forEach(([role, count]) => {
  console.log(`    ${role}: ${count}`);
});
```

## ページネーション情報

レスポンスの`pagination`オブジェクトには以下が含まれます：

- **count**: 総チーム数
- **next**: 次のページのタイムスタンプ（さらにチームがある場合）
- **prev**: 前のページのタイムスタンプ（前のページがある場合）

## 関連リンク

- [Get a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/get-a-team.md)
- [Create a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/create-a-team.md)
- [List Team Members](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/list-team-members.md)
