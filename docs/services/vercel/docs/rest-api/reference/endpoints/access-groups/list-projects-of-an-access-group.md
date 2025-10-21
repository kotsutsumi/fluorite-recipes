# アクセスグループのプロジェクトリスト取得

アクセスグループに関連付けられているプロジェクトのリストを取得します。

## エンドポイント

```
GET /v1/access-groups/{idOrName}/projects
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
| `idOrName` | string | ✓ | アクセスグループのIDまたは名前 |

### クエリパラメータ

| パラメータ | 型 | 範囲 | 説明 |
|----------|------|------|------|
| `limit` | integer | 1-100 | 結果の最大数 |
| `next` | string | - | 次のページ取得用のページネーションカーソル |
| `teamId` | string | - | リクエストコンテキスト用のチーム識別子 |
| `slug` | string | - | リクエストコンテキスト用のチームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface ProjectsResponse {
  projects: Array<{
    projectId: string;
    role: "ADMIN" | "PROJECT_DEVELOPER" | "PROJECT_VIEWER";
    createdAt: string;
    updatedAt: string;
    project: {
      name: string;
      framework: string | null;
      latestDeploymentId: string;
    };
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
| 401 | 未認証リクエスト |
| 403 | 権限不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const response = await vercel.accessGroups.listProjects({
  idOrName: "my-access-group",
  limit: 50,
  teamId: "team_abc123"
});

console.log(`Found ${response.projects.length} projects`);
response.projects.forEach(proj => {
  console.log(`- ${proj.project.name} (${proj.role})`);
});
```

## 関連リンク

- [Access Group Project 作成](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/create-an-access-group-project.md)
- [Access Group Project 読み取り](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/reads-an-access-group-project.md)
