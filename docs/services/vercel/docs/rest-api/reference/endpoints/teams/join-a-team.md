# チームへの参加

招待コードを使用してチームに参加します。

## エンドポイント

```
POST /v1/teams/{teamId}/members/teams/join
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
interface JoinTeamRequest {
  inviteCode: string;  // チームに参加するための招待コード
}
```

## レスポンス

### 成功 (200)

```typescript
interface JoinTeamResponse {
  teamId: string;      // 例: "team_LLHUOMOoDlqOp8wPE4kFo9pE"
  slug: string;        // 例: "my-team"
  name: string;        // 例: "My Team"
  from: string;        // 例: "email"
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディ値 |
| 401 | 未認証 |
| 402 | 支払いが必要 |
| 403 | 権限不足 |
| 404 | 見つかりません |

## 使用例

### 招待コードで参加

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.teams.joinTeam({
  teamId: 'team_abc123',
  requestBody: {
    inviteCode: 'fisdh38aejkeivn34nslfore9vjtn4ls'
  }
});

console.log(`✅ Joined team: ${result.name}`);
console.log(`Team ID: ${result.teamId}`);
console.log(`Slug: ${result.slug}`);
console.log(`Joined from: ${result.from}`);
```

### 参加完了の確認

```typescript
async function joinTeamWithCode(teamId: string, inviteCode: string) {
  try {
    const result = await vercel.teams.joinTeam({
      teamId,
      requestBody: { inviteCode }
    });

    console.log(`🎉 Successfully joined ${result.name}`);

    // チームメンバー一覧を取得して確認
    const members = await vercel.teams.listTeamMembers({
      teamId: result.teamId
    });

    console.log(`Team has ${members.pagination.count} members`);

    return result;
  } catch (error) {
    if (error.statusCode === 400) {
      console.error('❌ Invalid invite code');
    } else if (error.statusCode === 404) {
      console.error('❌ Team or invite code not found');
    } else {
      console.error('❌ Failed to join team:', error.message);
    }
    throw error;
  }
}

await joinTeamWithCode('team_abc123', 'your-invite-code');
```

### 招待コードの取得から参加まで

```typescript
// 通常、招待コードは以下のいずれかの方法で取得します：
// 1. チームオーナーから直接受け取る
// 2. メール招待から取得
// 3. チーム設定ページで確認

const inviteCode = 'fisdh38aejkeivn34nslfore9vjtn4ls';

const joinResult = await vercel.teams.joinTeam({
  teamId: 'team_abc123',
  requestBody: {
    inviteCode
  }
});

console.log(`Joined team "${joinResult.name}" (${joinResult.slug})`);
```

## 参加元（from）

レスポンスの`from`フィールドは、どのようにチームに参加したかを示します：

- **email**: メール招待から
- **link**: 招待リンクから
- **direct**: 直接招待コードで

## ワークフロー

1. **招待コード取得**: チームオーナーまたは招待メールから招待コードを受け取る
2. **参加リクエスト**: このエンドポイントで招待コードを使用して参加
3. **即座にメンバーに**: 招待コードが有効であれば、即座にチームメンバーになります

## 招待コードの種類

Vercelには主に2種類の招待方法があります：

1. **個別招待** (`/invite-a-user`): 特定のメールアドレスに送信される個別の招待
2. **チーム招待コード** (`/join-a-team`): 誰でも使用できる共有可能な招待コード

## 注意事項

- 招待コードは一度使用すると無効になる場合があります
- 無効な招待コードを使用すると400エラーが返されます
- チームが削除されている場合は404エラーが返されます

## 関連リンク

- [Invite a User](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/invite-a-user.md)
- [List Team Members](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/list-team-members.md)
- [Delete Team Invite Code](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/delete-a-team-invite-code.md)
