# アクセスグループの削除

アクセスグループを削除します。

## エンドポイント

```
DELETE /v1/access-groups/{idOrName}
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
| `teamId` | string | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |
| `slug` | string | チームスラッグ（例: `my-team-url-slug`） |

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

await vercel.accessGroups.delete({
  idOrName: "my-access-group",
  teamId: "team_abc123"
});

console.log('Access group deleted successfully');
```

## 注意事項

- アクセスグループの削除は元に戻せません
- グループに関連付けられているメンバーとプロジェクトの関連付けも削除されます
- 削除前に影響を確認してください

## 関連リンク

- [Access Groups 読み取り](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/reads-an-access-group.md)
- [Access Groups 更新](/docs/services/vercel/docs/rest-api/reference/endpoints/access-groups/update-an-access-group.md)
