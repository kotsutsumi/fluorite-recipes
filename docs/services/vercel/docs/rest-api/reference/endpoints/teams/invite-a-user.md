# ユーザーをチームに招待

チームに新しいユーザーを招待します。

## エンドポイント

```
POST /v1/teams/{teamId}/members
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

**権限**: このリクエストを実行するには`OWNER`ステータスが必要です。

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `teamId` | string | ✓ | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |

## リクエストボディ

```typescript
interface InviteRequest {
  email: string;  // 必須: 招待するユーザーのメールアドレス
  role?: "OWNER" | "MEMBER" | "DEVELOPER" | "SECURITY" | "BILLING" | "VIEWER" | "VIEWER_FOR_PLUS" | "CONTRIBUTOR";  // デフォルト: MEMBER
  projects?: Array<{
    projectId: string;  // 最大64文字
    role: "ADMIN" | "PROJECT_VIEWER" | "PROJECT_DEVELOPER";
  }>;
}
```

## レスポンス

### 成功 (200)

```typescript
interface InviteResponse {
  uid: string;
  username: string;
  email: string;
  role: string;
  teamRoles: string[];
  teamPermissions: string[];  // 例: ["CreateProject", "IntegrationManager"]
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエスト値、重複招待、またはチームメンバー上限超過 |
| 401 | 未認証 |
| 403 | 権限不足（オーナーではない） |
| 503 | サービス利用不可 |

## 使用例

### 基本的な招待

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.teams.inviteUserToTeam({
  teamId: 'team_abc123',
  requestBody: {
    email: 'john@example.com',
    role: 'DEVELOPER'
  }
});

console.log(`Invited: ${result.username}`);
console.log(`Email: ${result.email}`);
console.log(`Role: ${result.role}`);
```

### プロジェクトロール付き招待

```typescript
const result = await vercel.teams.inviteUserToTeam({
  teamId: 'team_abc123',
  requestBody: {
    email: 'jane@example.com',
    role: 'DEVELOPER',
    projects: [
      {
        projectId: 'prj_frontend',
        role: 'ADMIN'
      },
      {
        projectId: 'prj_backend',
        role: 'PROJECT_DEVELOPER'
      }
    ]
  }
});

console.log(`Invited with ${result.projects.length} project roles`);
```

### オーナーとして招待

```typescript
const result = await vercel.teams.inviteUserToTeam({
  teamId: 'team_abc123',
  requestBody: {
    email: 'admin@example.com',
    role: 'OWNER'
  }
});

console.log(`New owner invited: ${result.email}`);
console.log(`Permissions: ${result.teamPermissions.join(', ')}`);
```

## チームロール

- **OWNER**: 完全な管理権限
- **MEMBER**: 標準メンバー権限
- **DEVELOPER**: 開発者権限
- **SECURITY**: セキュリティ管理者
- **BILLING**: 請求管理者
- **VIEWER**: 読み取り専用
- **VIEWER_FOR_PLUS**: Plus閲覧者
- **CONTRIBUTOR**: コントリビューター

## プロジェクトロール

- **ADMIN**: プロジェクト管理者
- **PROJECT_DEVELOPER**: プロジェクト開発者
- **PROJECT_VIEWER**: プロジェクト閲覧者

## 注意事項

- 招待を送信するにはオーナー権限が必要です
- 同じメールアドレスへの重複招待はエラーになります
- チームメンバー数の上限に達している場合は招待できません
