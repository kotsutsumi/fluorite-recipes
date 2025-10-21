# インテグレーション構成の削除

インテグレーション構成を削除します。

## エンドポイント

```
DELETE /v1/integrations/configuration/{id}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `id` | string | ✓ | 削除する構成識別子 |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | チームURLスラッグ |

## レスポンス

### 成功 (204)

構成が正常に削除されました。レスポンスボディはありません。

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | 構成が見つかりません |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.integrations.deleteConfiguration({
  id: 'icfg_abc123',
  teamId: 'team_my_team'
});

console.log('インテグレーション構成を削除しました');
```

## 重要な動作

構成を削除すると、以下の関連リソースも削除されます：

- **Webhooks**: 設定されたすべてのwebhook
- **Log Drains**: ログドレイン設定
- **Environment Variables**: プロジェクト環境変数

## 注意事項

- 削除操作は元に戻せません
- 削除前に関連リソースをバックアップすることを推奨します
- 削除により影響を受けるプロジェクトを事前に確認してください

## 関連リンク

- [Retrieve Configuration](/docs/services/vercel/docs/rest-api/reference/endpoints/integrations/retrieve-an-integration-configuration.md)
- [Get Configurations](/docs/services/vercel/docs/rest-api/reference/endpoints/integrations/get-configurations-for-the-authenticated-user-or-team.md)
