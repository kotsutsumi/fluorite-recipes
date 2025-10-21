# アクセスグループの更新

アクセスグループの設定を更新します。

## エンドポイント

```
POST /v1/access-groups/{idOrName}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パラメータ

### パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `idOrName` | string | ✓ | アクセスグループの識別子または名前 |

### クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | チームスラッグ |

### リクエストボディ

```typescript
interface UpdateAccessGroupRequest {
  name?: string;                // グループ名（最大50文字、パターン: ^[A-z0-9_ -]+$）
  projects?: Array<{
    projectId: string;
    role: "ADMIN" | "PROJECT_VIEWER" | "PROJECT_DEVELOPER" | null;
  }>;
  membersToAdd?: string[];      // 追加するユーザーID配列
  membersToRemove?: string[];   // 削除するユーザーID配列
}
```

## レスポンス

### 成功 (200)

```typescript
interface AccessGroup {
  accessGroupId: string;
  name: string;
  teamId: string;
  createdAt: number;
  updatedAt: number;
  membersCount: number;
  projectsCount: number;
  teamRoles: string[];
  teamPermissions: string[];
  entitlements: string[];
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディまたはクエリ値 |
| 401 | 未認証リクエスト |
| 403 | 権限不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const updated = await vercel.accessGroups.update({
  idOrName: "my-access-group",
  teamId: "team_abc123",
  requestBody: {
    name: "Updated Group Name",
    membersToAdd: ["user_123", "user_456"],
    projects: [
      { projectId: "proj_1", role: "ADMIN" },
      { projectId: "proj_2", role: "PROJECT_DEVELOPER" }
    ]
  }
});
```

## 関連リンク

- [Access Groups 読み取り](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/reads-an-access-group.md)
- [Access Groups 削除](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/deletes-an-access-group.md)
