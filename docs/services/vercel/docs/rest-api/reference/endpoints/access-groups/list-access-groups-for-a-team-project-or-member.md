# アクセスグループのリスト取得

チーム、プロジェクト、またはメンバーのアクセスグループリストを取得します。

## エンドポイント

```
GET /v1/access-groups
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 範囲 | 説明 |
|----------|------|------|------|
| `projectId` | string | - | プロジェクトでアクセスグループをフィルタ |
| `search` | string | - | 名前でアクセスグループを検索 |
| `membersLimit` | integer | 1-100 | レスポンスに含めるメンバー数 |
| `projectsLimit` | integer | 1-100 | レスポンスに含めるプロジェクト数 |
| `limit` | integer | 1-100 | 返されるアクセスグループの制限数 |
| `next` | string | - | ページネーション用の継続カーソル |
| `teamId` | string | - | リクエストコンテキスト用のチーム識別子 |
| `slug` | string | - | リクエストコンテキスト用のチームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface AccessGroupsResponse {
  accessGroups: Array<{
    accessGroupId: string;
    name: string;
    teamId: string;
    membersCount: number;
    projectsCount: number;
    createdAt: number;
    updatedAt: number;
    teamRoles: string[];
    teamPermissions: string[];
    entitlements: string[];
    members?: Array<{
      uid: string;
      email: string;
      name: string;
    }>;
    projects?: Array<{
      projectId: string;
      role: string;
    }>;
  }>;
  pagination: {
    count: number;
    next: string | null;
  };
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ値 |
| 401 | 認証が必要 |
| 403 | リソースへのアクセス権限が不足 |

## 使用例

### 基本的な使用

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const response = await vercel.accessGroups.list({
  teamId: "team_abc123",
  limit: 20
});

console.log(`Found ${response.accessGroups.length} access groups`);
```

### プロジェクトでフィルタ

```typescript
const projectGroups = await vercel.accessGroups.list({
  projectId: "prj_abc123",
  membersLimit: 10,
  projectsLimit: 5
});
```

### 検索機能

```typescript
const searchResults = await vercel.accessGroups.list({
  search: "frontend",
  teamId: "team_abc123"
});
```

## 関連リンク

- [Access Groups 作成](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/creates-an-access-group.md)
- [Access Groups メンバー](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/list-members-of-an-access-group.md)
