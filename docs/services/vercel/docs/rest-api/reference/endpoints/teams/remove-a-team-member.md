# チームメンバーの削除

チームからメンバーを削除します。

## エンドポイント

```
DELETE /v1/teams/{teamId}/members/{uid}
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
| `uid` | string | ✓ | 削除するメンバーのユーザーID |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `newDefaultTeamId` | string | ユーザーのデフォルトチームとして設定するチームID |

## レスポンス

### 成功 (200)

```typescript
interface RemoveMemberResponse {
  id: string;  // チームID
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ値 |
| 401 | 認証なし |
| 403 | チームを変更する権限不足 |
| 404 | リソースが見つかりません |
| 503 | サービス利用不可 |

## 使用例

### 基本的なメンバー削除

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.teams.removeTeamMember({
  teamId: 'team_abc123',
  uid: 'user_xyz789'
});

console.log(`Member removed from team: ${result.id}`);
```

### デフォルトチームを指定して削除

```typescript
// メンバーを削除し、別のチームをデフォルトに設定
const result = await vercel.teams.removeTeamMember({
  teamId: 'team_abc123',
  uid: 'user_xyz789',
  newDefaultTeamId: 'team_def456'
});

console.log(`Member removed, new default team set`);
```

### 削除前の確認

```typescript
async function removeMemberSafely(
  teamId: string,
  uid: string,
  options?: { newDefaultTeamId?: string }
) {
  try {
    // まずメンバーが存在するか確認
    const members = await vercel.teams.listTeamMembers({ teamId });
    const member = members.members.find(m => m.uid === uid);

    if (!member) {
      console.log('⚠️ Member not found in team');
      return null;
    }

    console.log(`Removing ${member.username} (${member.email})...`);

    const result = await vercel.teams.removeTeamMember({
      teamId,
      uid,
      ...options
    });

    console.log(`✅ ${member.username} has been removed from the team`);
    return result;

  } catch (error) {
    console.error('❌ Failed to remove member:', error.message);
    throw error;
  }
}

await removeMemberSafely('team_abc123', 'user_xyz789');
```

### 複数メンバーの一括削除

```typescript
async function removeMembersInBulk(
  teamId: string,
  userIds: string[]
) {
  console.log(`Removing ${userIds.length} members...`);

  const results = [];
  for (const uid of userIds) {
    try {
      const result = await vercel.teams.removeTeamMember({
        teamId,
        uid
      });
      results.push({ uid, success: true, teamId: result.id });
      console.log(`✅ Removed: ${uid}`);
    } catch (error) {
      results.push({ uid, success: false, error: error.message });
      console.error(`❌ Failed to remove ${uid}:`, error.message);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${successCount}/${userIds.length} removed`);

  return results;
}

await removeMembersInBulk('team_abc123', [
  'user_xyz789',
  'user_abc456',
  'user_def123'
]);
```

### ロールチェック付き削除

```typescript
async function removeNonOwnerMember(teamId: string, uid: string) {
  const members = await vercel.teams.listTeamMembers({ teamId });
  const member = members.members.find(m => m.uid === uid);

  if (!member) {
    throw new Error('Member not found');
  }

  if (member.role === 'OWNER') {
    throw new Error('Cannot remove OWNER role members via this method');
  }

  console.log(`Removing ${member.role} member: ${member.username}`);

  return await vercel.teams.removeTeamMember({
    teamId,
    uid
  });
}

await removeNonOwnerMember('team_abc123', 'user_xyz789');
```

## デフォルトチームについて

ユーザーが複数のチームに所属している場合、削除されるチームがそのユーザーのデフォルトチームである可能性があります。その場合、`newDefaultTeamId`パラメータで新しいデフォルトチームを指定することを推奨します。

## 注意事項

- メンバーを削除するには適切な権限が必要です（通常はOWNERロール）
- 削除操作は元に戻せません
- メンバーのプロジェクトへのアクセスも同時に削除されます
- 最後のOWNERを削除することはできません

## 関連リンク

- [List Team Members](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/list-team-members.md)
- [Invite a User](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/invite-a-user.md)
- [Update a Team Member](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/update-a-team-member.md)
