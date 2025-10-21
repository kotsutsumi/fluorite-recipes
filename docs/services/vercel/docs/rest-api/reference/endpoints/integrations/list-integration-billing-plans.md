# インテグレーション課金プランの一覧取得

インテグレーション製品の課金プラン一覧を取得します。

## エンドポイント

```
GET /v1/integrations/integration/{integrationIdOrSlug}/products/{productIdOrSlug}/plans
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationIdOrSlug` | string | ✓ | インテグレーション識別子またはスラッグ |
| `productIdOrSlug` | string | ✓ | 製品識別子またはスラッグ |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `metadata` | string | メタデータフィルタ |
| `teamId` | string | チーム識別子 |
| `slug` | string | チームURLスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface Plan {
  type: "prepayment" | "subscription";
  id: string;
  name: string;
  description: string;
  scope: "installation" | "resource";
  paymentMethodRequired: boolean;
  preauthorizationAmount?: number;
  initialCharge?: number;
  cost?: number;
  minimumAmount?: number;
  maximumAmount?: number;
  details: string[];
  highlightedDetails: string[];
  quote: Array<{
    item: string;
    price: number;
  }>;
  effectiveDate?: string;
  disabled: boolean;
}

interface Response {
  plans: Plan[];
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効なクエリパラメータ |
| 401 | 未認証 |
| 403 | 権限不足 |
| 404 | 見つかりません |

## 使用例

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.integrations.getBillingPlans({
  integrationIdOrSlug: 'my-integration',
  productIdOrSlug: 'premium-tier',
  teamId: 'team_abc123'
});

result.plans.forEach(plan => {
  console.log(`${plan.name} (${plan.type})`);
  console.log(`Cost: ${plan.cost}`);
  console.log(`Payment required: ${plan.paymentMethodRequired}`);
});
```

## プランタイプ

- **prepayment**: 前払いプラン
- **subscription**: サブスクリプションプラン

## スコープ

- **installation**: インストールレベルの課金
- **resource**: リソースレベルの課金
