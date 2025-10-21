# アクセスグループプロジェクトの作成

アクセスグループにプロジェクトを追加します。

## エンドポイント

```
POST /v1/access-groups/{accessGroupIdOrName}/projects
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

### クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |
| `slug` | string | チームスラッグ（例: `my-team-url-slug`） |

### リクエストボディ

```typescript
interface CreateProjectRequest {
  projectId: string;     // 必須: プロジェクト識別子（最大256文字）
  role: "ADMIN" | "PROJECT_DEVELOPER" | "PROJECT_VIEWER";  // 必須
}
```

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
| 400 | 無効なリクエスト値 |
| 401 | リクエストが認証されていない |
| 403 | このリソースへのアクセス権限がない |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const result = await vercel.accessGroups.createProject({
  accessGroupIdOrName: "frontend-team",
  teamId: "team_abc123",
  requestBody: {
    projectId: "prj_frontend_app",
    role: "PROJECT_DEVELOPER"
  }
});

console.log(`Project added with role: ${result.role}`);
```

## プロジェクトロール

| ロール | 説明 |
|-------|------|
| `ADMIN` | プロジェクトへの完全な管理権限 |
| `PROJECT_DEVELOPER` | 開発者権限（デプロイ、環境変数管理など） |
| `PROJECT_VIEWER` | 読み取り専用アクセス |

## 関連リンク

- [Access Group Projects リスト](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/list-projects-of-an-access-group.md)
- [Access Group Project 削除](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/delete-an-access-group-project.md)
