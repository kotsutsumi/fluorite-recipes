# インテグレーションリソースをプロジェクトに接続

プロビジョニングされたインテグレーションリソースと特定のVercelプロジェクトを接続します。

## エンドポイント

```
POST /v1/integrations/installations/{integrationConfigurationId}/resources/{resourceId}/connections
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インテグレーション構成識別子 |
| `resourceId` | string | ✓ | リソース識別子 |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | チームURLスラッグ |

## リクエストボディ

```typescript
interface ConnectRequest {
  projectId: string;  // 必須
}
```

## レスポンス

### 成功 (201)

接続が正常に作成されました。

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なリクエストボディまたはクエリパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | 見つかりません |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.integrations.connectIntegrationResourceToProject({
  integrationConfigurationId: 'icfg_abc123',
  resourceId: 'res_xyz789',
  teamId: 'team_my_team',
  requestBody: {
    projectId: 'prj_frontend_app'
  }
});

console.log('リソースがプロジェクトに接続されました');
```

## ユースケース

このエンドポイントは以下の場合に使用します：

1. データベースリソースをプロジェクトに接続
2. ストレージサービスをプロジェクトに関連付け
3. 外部APIリソースをプロジェクトにリンク

## 注意事項

- リソースは事前にプロビジョニングされている必要があります
- プロジェクトは接続前に存在している必要があります
- 適切な権限が必要です
