# チームの取得

特定のチームの詳細情報を取得します。

## エンドポイント

```
GET /v2/teams/{teamId}
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

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `slug` | string | チームURLスラッグ（例: `my-team-url-slug`） |

## レスポンス

### 成功 (200)

```typescript
interface Team {
  id: string;
  slug: string;
  name: string | null;
  description: string | null;
  creatorId: string;
  createdAt: number;  // UNIXタイムスタンプ（ミリ秒）
  updatedAt: number;
  membership: {
    role: string;
    confirmed: boolean;
  };
  resourceConfig: {
    buildLimits: object;
    storageLimits: object;
  };
  saml?: {
    enabled: boolean;
    enforcedForNewMembers: boolean;
    connection: object;
  };
  // デプロイメント設定
  defaultDeploymentProtection?: object;
  // フィードバック設定
  enablePreviewFeedback?: string;
  enableProductionFeedback?: string;
  // セキュリティ設定
  hideIpAddresses?: boolean;
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ |
| 401 | 認証なし |
| 403 | リソースへのアクセス権限なし |
| 404 | チームが見つかりません |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const team = await vercel.teams.getTeam({
  teamId: 'team_abc123',
  slug: 'my-team'
});

console.log(`Team: ${team.name}`);
console.log(`Slug: ${team.slug}`);
console.log(`ID: ${team.id}`);
console.log(`Created: ${new Date(team.createdAt).toLocaleString()}`);
console.log(`Last updated: ${new Date(team.updatedAt).toLocaleString()}`);

if (team.description) {
  console.log(`Description: ${team.description}`);
}

console.log(`\nYour membership:`);
console.log(`  Role: ${team.membership.role}`);
console.log(`  Confirmed: ${team.membership.confirmed}`);

if (team.saml?.enabled) {
  console.log(`\nSAML SSO enabled`);
  console.log(`  Enforced for new members: ${team.saml.enforcedForNewMembers}`);
}
```

## チーム設定の確認

```typescript
async function checkTeamSettings(teamId: string) {
  const team = await vercel.teams.getTeam({ teamId });

  console.log(`=== Team Settings for ${team.name} ===\n`);

  // リソース制限
  console.log('Resource Limits:');
  console.log(`  Build limits: ${JSON.stringify(team.resourceConfig.buildLimits, null, 2)}`);
  console.log(`  Storage limits: ${JSON.stringify(team.resourceConfig.storageLimits, null, 2)}`);

  // フィードバック設定
  if (team.enablePreviewFeedback || team.enableProductionFeedback) {
    console.log('\nFeedback Settings:');
    if (team.enablePreviewFeedback) {
      console.log(`  Preview: ${team.enablePreviewFeedback}`);
    }
    if (team.enableProductionFeedback) {
      console.log(`  Production: ${team.enableProductionFeedback}`);
    }
  }

  // セキュリティ設定
  if (team.hideIpAddresses !== undefined) {
    console.log(`\nSecurity:`);
    console.log(`  Hide IP addresses: ${team.hideIpAddresses}`);
  }

  // デフォルトデプロイメント保護
  if (team.defaultDeploymentProtection) {
    console.log(`\nDefault Deployment Protection:`);
    console.log(JSON.stringify(team.defaultDeploymentProtection, null, 2));
  }

  return team;
}

await checkTeamSettings('team_abc123');
```

## メンバーシップ情報

```typescript
const team = await vercel.teams.getTeam({ teamId: 'team_abc123' });

console.log('Your membership status:');

switch (team.membership.role) {
  case 'OWNER':
    console.log('  You are an OWNER - full administrative access');
    break;
  case 'MEMBER':
    console.log('  You are a MEMBER - standard access');
    break;
  case 'VIEWER':
    console.log('  You are a VIEWER - read-only access');
    break;
  case 'DEVELOPER':
    console.log('  You are a DEVELOPER - development access');
    break;
  default:
    console.log(`  Your role: ${team.membership.role}`);
}

if (!team.membership.confirmed) {
  console.log('  ⚠️ Your membership is not yet confirmed');
}
```

## SAML SSO設定の確認

```typescript
async function checkSAMLStatus(teamId: string) {
  const team = await vercel.teams.getTeam({ teamId });

  if (!team.saml) {
    console.log('SAML SSO is not configured');
    return;
  }

  console.log('SAML SSO Configuration:');
  console.log(`  Enabled: ${team.saml.enabled}`);
  console.log(`  Enforced for new members: ${team.saml.enforcedForNewMembers}`);

  if (team.saml.connection) {
    console.log('  Connection details available');
  }

  return team.saml;
}

await checkSAMLStatus('team_abc123');
```

## 関連リンク

- [List All Teams](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/list-all-teams.md)
- [Update a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/update-a-team.md)
- [Delete a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/delete-a-team.md)
