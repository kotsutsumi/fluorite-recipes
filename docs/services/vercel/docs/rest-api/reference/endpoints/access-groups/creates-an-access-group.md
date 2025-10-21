# アクセスグループの作成

新しいアクセスグループを作成します。

## エンドポイント

```
POST /v1/access-groups
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パラメータ

### クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |
| `slug` | string | チームスラッグ（例: `my-team-url-slug`） |

### リクエストボディ

```typescript
interface CreateAccessGroupRequest {
  name: string;                      // 必須: アクセスグループ名（最大50文字、英数字/アンダースコア/ダッシュのみ）
  projects?: Array<{
    projectId: string;
    role: "ADMIN" | "PROJECT_VIEWER" | "PROJECT_DEVELOPER";
  }>;
  membersToAdd?: string[];           // 追加するユーザーID配列
}
```

## レスポンス

### 成功 (200)

```typescript
interface AccessGroup {
  accessGroupId: string;             // 一意の識別子
  name: string;                      // グループ名
  teamId: string;                    // 関連チーム
  membersCount: number;              // メンバー数
  projectsCount: number;             // プロジェクト数
  createdAt: number;                 // 作成タイムスタンプ（ミリ秒）
  updatedAt: number;                 // 更新タイムスタンプ（ミリ秒）
  teamRoles: string[];               // 割り当てられたロール
  teamPermissions: string[];         // 権限
  entitlements: string[];            // 例: ["v0"]
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディ値 |
| 401 | 未認証（トークンが欠落または無効） |
| 403 | 権限不足 |

## 使用例

### 基本的な作成

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const accessGroup = await vercel.accessGroups.createAccessGroup({
  teamId: "team_abc123",
  requestBody: {
    name: "My access group"
  }
});

console.log(`Created access group: ${accessGroup.accessGroupId}`);
```

### プロジェクトとメンバーを含む作成

```typescript
const accessGroup = await vercel.accessGroups.createAccessGroup({
  teamId: "team_abc123",
  requestBody: {
    name: "Frontend Team",
    projects: [
      { projectId: "prj_frontend", role: "ADMIN" },
      { projectId: "prj_website", role: "PROJECT_DEVELOPER" }
    ],
    membersToAdd: [
      "usr_john_doe",
      "usr_jane_smith"
    ]
  }
});

console.log(`Group created with ${accessGroup.membersCount} members`);
console.log(`Assigned to ${accessGroup.projectsCount} projects`);
```

## 名前の制約

- **最大長**: 50文字
- **許可文字**: 英字（A-Z、a-z）、数字（0-9）、アンダースコア（_）、スペース、ダッシュ（-）
- **パターン**: `^[A-z0-9_ -]+$`

## プロジェクトロール

| ロール | 説明 |
|-------|------|
| `ADMIN` | プロジェクトへの完全なアクセス権限 |
| `PROJECT_VIEWER` | 読み取り専用アクセス |
| `PROJECT_DEVELOPER` | 開発者権限 |

## 関連リンク

- [Access Groups 更新](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/update-an-access-group.md)
- [Access Groups リスト](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/list-access-groups-for-a-team-project-or-member.md)
