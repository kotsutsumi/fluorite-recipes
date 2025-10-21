# チーム招待コードの削除

チームの招待コードを削除します。

## エンドポイント

```
DELETE /v1/teams/{teamId}/invites/{inviteId}
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
| `inviteId` | string | ✓ | チーム招待コードID |

## レスポンス

### 成功 (200)

```typescript
interface DeleteInviteResponse {
  id: string;  // チームのID
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストクエリ値 |
| 401 | 未認証 |
| 403 | アクセス拒否（ディレクトリ同期管理または権限不足） |
| 404 | チーム招待コードが見つかりません |

## 使用例

### 基本的な招待コード削除

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.teams.deleteTeamInviteCode({
  teamId: 'team_abc123',
  inviteId: '2wn2hudbr4chb1ecywo9dvzo7g9sscs6mzcz8htdde0txyom4l'
});

console.log(`Invite code deleted for team: ${result.id}`);
```

### 招待コードの取得と削除

```typescript
async function deleteInviteCodeSafely(teamId: string, inviteId: string) {
  try {
    const result = await vercel.teams.deleteTeamInviteCode({
      teamId,
      inviteId
    });

    console.log(`✅ Invite code deleted`);
    console.log(`  Team ID: ${result.id}`);
    console.log(`  Invite ID: ${inviteId}`);

    return result;
  } catch (error) {
    if (error.statusCode === 404) {
      console.error('❌ Invite code not found');
    } else if (error.statusCode === 403) {
      console.error('❌ Access denied - insufficient permissions or directory sync managed');
    } else {
      console.error(`❌ Failed to delete invite code: ${error.message}`);
    }
    throw error;
  }
}

await deleteInviteCodeSafely(
  'team_abc123',
  '2wn2hudbr4chb1ecywo9dvzo7g9sscs6mzcz8htdde0txyom4l'
);
```

### すべての保留中招待コードの削除

```typescript
async function deleteAllPendingInvites(teamId: string) {
  // メンバー一覧を取得（招待コード情報を含む）
  const members = await vercel.teams.listTeamMembers({ teamId });

  const pendingInvites = members.emailInviteCodes || [];

  console.log(`Found ${pendingInvites.length} pending invites`);

  const results = [];

  for (const invite of pendingInvites) {
    try {
      const result = await vercel.teams.deleteTeamInviteCode({
        teamId,
        inviteId: invite.inviteCode
      });

      results.push({
        email: invite.email,
        success: true,
        id: result.id
      });

      console.log(`✅ Deleted invite for: ${invite.email}`);
    } catch (error) {
      results.push({
        email: invite.email,
        success: false,
        error: error.message
      });

      console.error(`❌ Failed to delete invite for ${invite.email}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${successCount}/${pendingInvites.length} deleted`);

  return results;
}

await deleteAllPendingInvites('team_abc123');
```

### 期限切れ招待コードのクリーンアップ

```typescript
async function cleanupExpiredInvites(teamId: string, daysOld: number) {
  const members = await vercel.teams.listTeamMembers({ teamId });
  const pendingInvites = members.emailInviteCodes || [];

  const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
  const expiredInvites = pendingInvites.filter(
    invite => invite.createdAt < cutoffTime
  );

  console.log(`Found ${expiredInvites.length} invites older than ${daysOld} days`);

  for (const invite of expiredInvites) {
    try {
      await vercel.teams.deleteTeamInviteCode({
        teamId,
        inviteId: invite.inviteCode
      });

      const age = Math.floor((Date.now() - invite.createdAt) / (1000 * 60 * 60 * 24));
      console.log(`✅ Deleted ${age}-day old invite for: ${invite.email}`);
    } catch (error) {
      console.error(`❌ Failed to delete invite for ${invite.email}`);
    }
  }

  console.log('Cleanup complete');
}

// 30日以上古い招待コードを削除
await cleanupExpiredInvites('team_abc123', 30);
```

### 特定のメールアドレスの招待コード削除

```typescript
async function deleteInviteByEmail(teamId: string, email: string) {
  const members = await vercel.teams.listTeamMembers({ teamId });
  const pendingInvites = members.emailInviteCodes || [];

  const invite = pendingInvites.find(inv => inv.email === email);

  if (!invite) {
    console.log(`No pending invite found for: ${email}`);
    return null;
  }

  const result = await vercel.teams.deleteTeamInviteCode({
    teamId,
    inviteId: invite.inviteCode
  });

  console.log(`✅ Deleted invite for: ${email}`);
  console.log(`  Invite was created: ${new Date(invite.createdAt).toLocaleString()}`);

  return result;
}

await deleteInviteByEmail('team_abc123', 'user@example.com');
```

### 招待コードの再送前の削除

```typescript
async function resendInvite(teamId: string, email: string, role: string = 'MEMBER') {
  // 1. 既存の招待コードがあれば削除
  try {
    await deleteInviteByEmail(teamId, email);
    console.log('Existing invite deleted');
  } catch (error) {
    console.log('No existing invite to delete');
  }

  // 2. 新しい招待を送信
  const newInvite = await vercel.teams.inviteUserToTeam({
    teamId,
    requestBody: {
      email,
      role
    }
  });

  console.log(`✅ New invite sent to: ${email}`);
  return newInvite;
}

await resendInvite('team_abc123', 'user@example.com', 'DEVELOPER');
```

## 招待コードの種類

Vercelには2種類の招待方法があります：

1. **メール招待コード** (`emailInviteCodes`): 特定のメールアドレスに送信される個別の招待
2. **共有招待コード**: 誰でも使用できるチーム招待コード

このエンドポイントはどちらのタイプも削除できます。

## 注意事項

- 招待コードを削除すると、受信者は招待リンクを使用できなくなります
- 削除は即座に有効になります
- 削除操作は元に戻せません
- ディレクトリ同期で管理されているチームの場合、403エラーが返される可能性があります

## 関連リンク

- [Invite a User](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/invite-a-user.md)
- [Join a Team](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/join-a-team.md)
- [List Team Members](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/list-team-members.md)
