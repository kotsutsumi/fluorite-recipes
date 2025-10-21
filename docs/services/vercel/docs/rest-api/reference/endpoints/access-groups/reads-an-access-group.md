# アクセスグループの読み取り

アクセスグループの詳細情報を取得します。

## エンドポイント

```
GET /v1/access-groups/{idOrName}
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
| `teamId` | string | リクエストを代理実行するチーム識別子 |
| `slug` | string | リクエストを代理実行するチームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface AccessGroup {
  accessGroupId: string;
  name: string;
  teamId: string;
  createdAt: number;           // タイムスタンプ（ミリ秒）
  updatedAt: number;           // タイムスタンプ（ミリ秒）
  membersCount: number;
  projectsCount: number;
  teamPermissions: string[];   // 例: ["IntegrationManager", "CreateProject"]
  teamRoles: string[];         // 例: ["DEVELOPER", "BILLING"]
  entitlements: string[];      // 例: ["v0"]
  isDsyncManaged: boolean;
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

const accessGroup = await vercel.accessGroups.read({
  idOrName: "my-access-group",
  teamId: "team_abc123"
});

console.log(accessGroup);
```

## 関連リンク

- [Access Groups 更新](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/update-an-access-group.md)
- [Access Groups 削除](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/deletes-an-access-group.md)
