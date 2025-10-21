# アクセスグループプロジェクトの削除

アクセスグループからプロジェクトを削除します。

## エンドポイント

```
DELETE /v1/access-groups/{accessGroupIdOrName}/projects/{projectId}
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

空のレスポンスボディ

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリで提供された値の1つが無効 |
| 401 | リクエストが認証されていない |
| 403 | このリソースへのアクセス権限がない |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

await vercel.accessGroups.deleteProject({
  accessGroupIdOrName: "frontend-team",
  projectId: "prj_frontend_app",
  teamId: "team_abc123"
});

console.log('Project removed from access group');
```

## 注意事項

- プロジェクトの削除は元に戻せません
- アクセスグループメンバーはこのプロジェクトへのアクセス権を失います
- プロジェクト自体は削除されません（アクセスグループからの関連付けのみが削除されます）

## 関連リンク

- [Access Group Project 作成](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/create-an-access-group-project.md)
- [Access Group Projects リスト](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/list-projects-of-an-access-group.md)
