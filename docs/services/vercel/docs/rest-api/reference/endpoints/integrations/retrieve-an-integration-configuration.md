# インテグレーション構成の取得

特定のインテグレーション構成の詳細を取得します。

## エンドポイント

```
GET /v1/integrations/configuration/{id}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `id` | string | ✓ | 構成識別子（例: `icfg_cuwj0AdCdH3BwWT4LPijCC7t`） |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | チームスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface Configuration {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  ownerId: string;
  userId: string;
  teamId?: string;
  projectSelection: "all" | "selected";
  projects?: Array<{
    id: string;
    name: string;
  }>;
  scopes: string[];
  integrationId: string;
  slug: string;
  installationType: "marketplace" | "external";
  source: string;
  disabledAt?: string;
  disabledReason?: string;
  deleteRequestedAt?: string;
}
```

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

const config = await vercel.integrations.getConfiguration({
  id: 'icfg_abc123',
  teamId: 'team_my_team'
});

console.log(`Configuration: ${config.slug}`);
console.log(`Integration: ${config.integrationId}`);
console.log(`Project Selection: ${config.projectSelection}`);

if (config.projects) {
  console.log(`Connected Projects: ${config.projects.length}`);
  config.projects.forEach(p => console.log(`  - ${p.name}`));
}

if (config.disabledAt) {
  console.log(`Disabled at: ${config.disabledAt}`);
  console.log(`Reason: ${config.disabledReason}`);
}
```

## プロジェクト選択モード

- **all**: すべてのプロジェクトに適用
- **selected**: 選択されたプロジェクトのみに適用

## 関連リンク

- [Get Configurations](/docs/services/vercel/docs/rest-api/reference/endpoints/integrations/get-configurations-for-the-authenticated-user-or-team.md)
- [Delete Configuration](/docs/services/vercel/docs/rest-api/reference/endpoints/integrations/delete-an-integration-configuration.md)
