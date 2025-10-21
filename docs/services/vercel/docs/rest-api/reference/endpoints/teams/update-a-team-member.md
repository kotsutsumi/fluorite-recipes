# チームメンバーの更新

チームメンバーの詳細（ロール変更やメンバーシップ確認など）を変更します。

## エンドポイント

```
PATCH /v1/teams/{teamId}/members/{uid}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

**権限**: このエンドポイントを実行するには`OWNER`である必要があります。

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `teamId` | string | ✓ | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |
| `uid` | string | ✓ | メンバーID（例: `ndfasllgPyCtREAqxxdyFKb`） |

## リクエストボディ

```typescript
interface UpdateMemberRequest {
  confirmed?: boolean;  // 保留中のアクセスリクエストを承認
  role?: "MEMBER" | "VIEWER";  // デフォルト: MEMBER
  projects?: Array<{
    projectId: string;     // プロジェクト識別子
    role: "ADMIN" | "PROJECT_VIEWER" | "PROJECT_DEVELOPER" | null;
  }>;
  joinedFrom?: {
    ssoUserId: string | null;  // SSOユーザー識別子
  };
}
```

## レスポンス

### 成功 (200)

```typescript
interface UpdateMemberResponse {
  id: string;  // チームID
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエスト値またはメンバーシップ状態エラー |
| 401 | 認証不足 |
| 403 | 権限拒否 |
| 404 | ユーザーまたはチームが見つかりません |
| 500 | サーバーエラー |

## 使用例

### アクセスリクエストを承認

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

// 保留中のアクセスリクエストを承認してメンバーに
const result = await vercel.teams.updateTeamMember({
  teamId: 'team_abc123',
  uid: 'user_xyz789',
  requestBody: {
    confirmed: true,
    role: 'MEMBER'
  }
});

console.log(`✅ Access request approved, team: ${result.id}`);
```

### メンバーのロール変更

```typescript
// MEMBERからVIEWERに変更
const result = await vercel.teams.updateTeamMember({
  teamId: 'team_abc123',
  uid: 'user_xyz789',
  requestBody: {
    role: 'VIEWER'
  }
});

console.log('Role changed to VIEWER');
```

### プロジェクトロールの更新

```typescript
const result = await vercel.teams.updateTeamMember({
  teamId: 'team_abc123',
  uid: 'user_xyz789',
  requestBody: {
    projects: [
      {
        projectId: 'prj_frontend',
        role: 'ADMIN'  // ADMINに昇格
      },
      {
        projectId: 'prj_backend',
        role: 'PROJECT_DEVELOPER'
      },
      {
        projectId: 'prj_legacy',
        role: null  // プロジェクトロールを削除
      }
    ]
  }
});

console.log('Project roles updated');
```

### 複合的な更新

```typescript
// アクセス承認 + ロール設定 + プロジェクトロール付与
const result = await vercel.teams.updateTeamMember({
  teamId: 'team_abc123',
  uid: 'user_xyz789',
  requestBody: {
    confirmed: true,
    role: 'MEMBER',
    projects: [
      {
        projectId: 'prj_main',
        role: 'PROJECT_DEVELOPER'
      }
    ]
  }
});

console.log('Member fully configured');
```

### SSOユーザーの紐付け

```typescript
const result = await vercel.teams.updateTeamMember({
  teamId: 'team_abc123',
  uid: 'user_xyz789',
  requestBody: {
    joinedFrom: {
      ssoUserId: 'sso_user_12345'
    }
  }
});

console.log('SSO user ID linked');
```

## チームロール

- **MEMBER**: 標準メンバー権限
- **VIEWER**: 読み取り専用アクセス

## プロジェクトロール

- **ADMIN**: プロジェクト管理者（完全なアクセス）
- **PROJECT_DEVELOPER**: 開発者権限（デプロイ可能）
- **PROJECT_VIEWER**: 閲覧者権限（読み取りのみ）
- **null**: プロジェクトロールを削除

## アクセスリクエストの承認フロー

```typescript
async function approveAccessRequest(
  teamId: string,
  userId: string,
  role: 'MEMBER' | 'VIEWER' = 'MEMBER'
) {
  // まずリクエストのステータスを確認
  const status = await vercel.teams.getTeamAccessRequest({
    teamId,
    userId
  });

  if (status.confirmed) {
    console.log('Already a confirmed member');
    return;
  }

  console.log(`Approving access request from: ${status.joinedFrom.origin}`);

  // アクセスリクエストを承認
  const result = await vercel.teams.updateTeamMember({
    teamId,
    uid: userId,
    requestBody: {
      confirmed: true,
      role
    }
  });

  console.log(`✅ ${userId} is now a ${role} of team ${result.id}`);

  return result;
}

await approveAccessRequest('team_abc123', 'user_xyz789', 'MEMBER');
```

## 注意事項

- このエンドポイントを実行するにはOWNER権限が必要です
- `confirmed: true`は保留中のアクセスリクエストを承認します
- プロジェクトロールを`null`に設定すると、そのプロジェクトへのアクセスが削除されます
- ロール変更は即座に反映されます

## 関連リンク

- [Get Access Request Status](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/get-access-request-status.md)
- [List Team Members](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/list-team-members.md)
- [Remove a Team Member](/docs/services/vercel/docs/rest-api/reference/endpoints/teams/remove-a-team-member.md)
