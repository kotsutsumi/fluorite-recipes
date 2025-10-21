# 認証済みユーザーまたはチームの構成を取得

認証済みインテグレーションのすべての構成を取得します。

## エンドポイント

```
GET /v1/integrations/configurations
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `view` | enum | ✓ | "account" または "project" |
| `installationType` | enum | | "marketplace" または "external" |
| `integrationIdOrSlug` | string | | インテグレーション識別子 |
| `teamId` | string | | チーム識別子 |
| `slug` | string | | チームURLスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface Configuration {
  id: string;
  integrationId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  slug: string;
  source: string;
  type: "integration-configuration";
  scopes: string[];
  projects?: Array<{
    id: string;
    name: string;
  }>;
  teamId?: string;
  disabledAt?: string;
  deletedAt?: string;
  disabledReason?: string;
  integration?: {
    name: string;
    icon: string;
    categoryTags: string[];
  };
}

type Response = Configuration[];
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const configurations = await vercel.integrations.getConfigurations({
  view: 'account',
  teamId: 'team_abc123'
});

configurations.forEach(config => {
  console.log(`Configuration: ${config.slug}`);
  console.log(`Integration: ${config.integrationId}`);
  console.log(`Scopes: ${config.scopes.join(', ')}`);

  if (config.projects) {
    console.log(`Projects: ${config.projects.length}`);
  }
});
```

## ビューモード

### account
- すべての構成を返します
- 認証フロー構成を含みます

### project
- 認証フロー構成を除外します
- プロジェクト固有の構成のみを返します
- ネストされた `integration` オブジェクトを含みます

## フィルタリング

- **installationType**: マーケットプレイスまたは外部インテグレーションでフィルタ
- **integrationIdOrSlug**: 特定のインテグレーションに限定
