# チームの削除

アカウントからチームを削除します。

## エンドポイント

```
DELETE /v1/teams/{teamId}
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
| `newDefaultTeamId` | string | 代替デフォルトチームのID（例: `team_LLHUOMOoDlqOp8wPE4kFo9pE`） |
| `slug` | string | リクエスト用のチームURLスラッグ（例: `my-team-url-slug`） |

## リクエストボディ（オプション）

```typescript
interface DeleteTeamRequest {
  reasons?: Array<{
    slug: string;        // 理由の識別子
    description: string; // 理由の説明
  }>;
}
```

## レスポンス

### 成功 (200)

```typescript
interface DeleteTeamResponse {
  id: string;                    // 例: "team_LLHUOMOoDlqOp8wPE4kFo9pE"
  newDefaultTeamIdError?: boolean;
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストパラメータ |
| 401 | 未認証 |
| 402 | 支払い問題 |
| 403 | 権限拒否またはチームにアクセスできません |
| 409 | 競合 |

## 使用例

### 基本的なチーム削除

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.teams.deleteTeam({
  teamId: 'team_abc123'
});

console.log(`Team deleted: ${result.id}`);
```

### 新しいデフォルトチームを指定して削除

```typescript
const result = await vercel.teams.deleteTeam({
  teamId: 'team_abc123',
  newDefaultTeamId: 'team_def456'
});

console.log(`Team deleted, new default: team_def456`);

if (result.newDefaultTeamIdError) {
  console.warn('⚠️ Error setting new default team');
}
```

### 削除理由付き

```typescript
const result = await vercel.teams.deleteTeam({
  teamId: 'team_abc123',
  requestBody: {
    reasons: [
      {
        slug: 'consolidation',
        description: 'Consolidating into a single team'
      },
      {
        slug: 'cost-reduction',
        description: 'Reducing operational costs'
      }
    ]
  }
});

console.log('Team deleted with reasons logged');
```

### 安全な削除（確認付き）

```typescript
async function deleteTeamSafely(teamId: string, newDefaultTeamId?: string) {
  try {
    // 1. チーム情報を取得
    const team = await vercel.teams.getTeam({ teamId });

    console.log(`About to delete team: ${team.name || team.slug}`);
    console.log(`Created: ${new Date(team.createdAt).toLocaleDateString()}`);

    // 2. メンバー数を確認
    const members = await vercel.teams.listTeamMembers({ teamId });
    console.log(`Team has ${members.pagination.count} members`);

    // 3. 確認メッセージ
    console.log('\n⚠️ WARNING: This action cannot be undone!');

    // 4. 削除実行
    const result = await vercel.teams.deleteTeam({
      teamId,
      newDefaultTeamId,
      requestBody: {
        reasons: [
          {
            slug: 'manual-deletion',
            description: 'Manually deleted via API'
          }
        ]
      }
    });

    console.log(`✅ Team ${result.id} has been deleted`);

    return result;
  } catch (error) {
    console.error(`❌ Failed to delete team: ${error.message}`);
    throw error;
  }
}

await deleteTeamSafely('team_abc123', 'team_def456');
```

### 複数チームの削除

```typescript
async function deleteMultipleTeams(
  teamIds: string[],
  newDefaultTeamId: string
) {
  console.log(`Deleting ${teamIds.length} teams...`);

  const results = [];

  for (const teamId of teamIds) {
    try {
      const result = await vercel.teams.deleteTeam({
        teamId,
        newDefaultTeamId
      });

      results.push({ teamId, success: true, id: result.id });
      console.log(`✅ Deleted: ${teamId}`);
    } catch (error) {
      results.push({ teamId, success: false, error: error.message });
      console.error(`❌ Failed: ${teamId} - ${error.message}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${successCount}/${teamIds.length} deleted`);

  return results;
}

await deleteMultipleTeams(
  ['team_old1', 'team_old2', 'team_old3'],
  'team_main'
);
```

### 削除前のデータエクスポート

```typescript
async function deleteTeamWithBackup(teamId: string) {
  // 1. チーム情報をバックアップ
  const team = await vercel.teams.getTeam({ teamId });
  const members = await vercel.teams.listTeamMembers({ teamId });

  const backup = {
    team: {
      id: team.id,
      slug: team.slug,
      name: team.name,
      createdAt: team.createdAt
    },
    members: members.members.map(m => ({
      email: m.email,
      role: m.role,
      username: m.username
    })),
    exportedAt: new Date().toISOString()
  };

  // 2. バックアップを保存（例: ファイルに書き出し）
  console.log('Team backup:');
  console.log(JSON.stringify(backup, null, 2));

  // 3. 削除実行
  const result = await vercel.teams.deleteTeam({
    teamId,
    requestBody: {
      reasons: [
        {
          slug: 'archived',
          description: 'Team archived with backup'
        }
      ]
    }
  });

  console.log('Team deleted, backup created');

  return { result, backup };
}

await deleteTeamWithBackup('team_abc123');
```

## 削除理由の一般的な例

```typescript
const commonReasons = [
  {
    slug: 'consolidation',
    description: 'Consolidating multiple teams'
  },
  {
    slug: 'project-completed',
    description: 'Project has been completed'
  },
  {
    slug: 'reorganization',
    description: 'Organizational restructuring'
  },
  {
    slug: 'cost-reduction',
    description: 'Reducing operational costs'
  },
  {
    slug: 'duplicate',
    description: 'Duplicate team'
  }
];
```

## 注意事項

⚠️ **重要な警告**:

- **元に戻せません**: チーム削除は永久的で、取り消すことができません
- **データ損失**: チームに関連付けられたすべてのデータが削除されます
- **プロジェクト**: チームのプロジェクトも削除される可能性があります
- **メンバー**: すべてのメンバーがチームから削除されます
- **デフォルトチーム**: 削除するチームがユーザーのデフォルトの場合、`newDefaultTeamId`を指定することを強く推奨します

## 削除前のチェックリスト

1. ✅ 重要なデータをバックアップ
2. ✅ プロジェクトを他のチームに移行
3. ✅ メンバーに事前通知
4. ✅ 新しいデフォルトチームを準備（該当する場合）
5. ✅ 課金情報を確認

## 関連リンク

- [Create a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/create-a-team.md)
- [Get a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/get-a-team.md)
- [List All Teams](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/list-all-teams.md)
