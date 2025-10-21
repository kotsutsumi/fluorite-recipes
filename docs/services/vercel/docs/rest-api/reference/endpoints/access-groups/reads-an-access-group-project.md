# アクセスグループプロジェクトの読み取り

アクセスグループ内の特定のプロジェクトの詳細を取得します。

## エンドポイント

```
GET /v1/access-groups/{accessGroupIdOrName}/projects/{projectId}
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
| `accessGroupIdOrName` | string | ✓ | アクセスグループの識別子または名前 |
| `projectId` | string | ✓ | プロジェクト識別子 |

### クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | リクエストを代理実行するチーム識別子 |
| `slug` | string | リクエストを代理実行するチームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface AccessGroupProject {
  teamId: string;
  accessGroupId: string;
  projectId: string;
  role: "ADMIN" | "PROJECT_DEVELOPER" | "PROJECT_VIEWER";
  createdAt: string;
  updatedAt: string;
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ値 |
| 401 | 認証が必要 |
| 403 | リソースへのアクセス権限が不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const project = await vercel.accessGroups.getProject({
  accessGroupIdOrName: "frontend-team",
  projectId: "prj_frontend_app",
  teamId: "team_abc123"
});

console.log(`Project: ${project.projectId}`);
console.log(`Role: ${project.role}`);
console.log(`Created: ${new Date(project.createdAt).toLocaleString()}`);
```

## 関連リンク

- [Access Group Projects リスト](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/list-projects-of-an-access-group.md)
- [Access Group Project 更新](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/update-an-access-group-project.md)
- [Access Group Project 削除](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/delete-an-access-group-project.md)
