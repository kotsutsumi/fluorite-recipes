# アクセスグループプロジェクトの更新

アクセスグループ内のプロジェクトのロールを更新します。

## エンドポイント

```
PATCH /v1/access-groups/{accessGroupIdOrName}/projects/{projectId}
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
| `teamId` | string | リクエストコンテキスト用のチーム識別子 |
| `slug` | string | リクエストコンテキスト用のチームスラッグ |

### リクエストボディ

```typescript
interface UpdateProjectRequest {
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
| 400 | 無効なリクエストボディまたはクエリ値 |
| 401 | 未認証リクエスト |
| 403 | リソースへのアクセス権限が不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const updated = await vercel.accessGroups.updateProject({
  accessGroupIdOrName: "frontend-team",
  projectId: "prj_frontend_app",
  teamId: "team_abc123",
  requestBody: {
    role: "ADMIN"  // PROJECT_DEVELOPERからADMINに昇格
  }
});

console.log(`Project role updated to: ${updated.role}`);
console.log(`Updated at: ${new Date(updated.updatedAt).toLocaleString()}`);
```

## プロジェクトロール

| ロール | 説明 | 変更先の一般的なケース |
|-------|------|---------------------|
| `ADMIN` | 完全な管理権限 | プロジェクトリーダーに昇格 |
| `PROJECT_DEVELOPER` | 開発者権限 | 標準的な開発チームメンバー |
| `PROJECT_VIEWER` | 読み取り専用 | 監視やレビュー目的でアクセスを制限 |

## 関連リンク

- [Access Group Project 読み取り](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/reads-an-access-group-project.md)
- [Access Group Project 削除](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/delete-an-access-group-project.md)
