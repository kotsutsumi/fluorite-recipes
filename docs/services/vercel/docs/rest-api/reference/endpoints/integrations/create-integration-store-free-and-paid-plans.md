# インテグレーションストアの作成（無料・有料プラン）

無料および有料課金プランのインテグレーションストレージをプロビジョニングします。

## エンドポイント

```
POST /v1/storage/stores/integration/direct
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | チームURLスラッグ |

## リクエストボディ

```typescript
interface CreateStoreRequest {
  // 必須フィールド
  name: string;                          // 最大128文字
  integrationConfigurationId: string;    // パターン: ^icfg_[a-zA-Z0-9]+$
  integrationProductIdOrSlug: string;    // 製品識別子またはスラッグ

  // オプションフィールド
  metadata?: Record<string, string | number | boolean | any[]>;
  externalId?: string;
  protocolSettings?: object;
  source?: string;                       // デフォルト: "marketplace"
  billingPlanId?: string;                // 有料プランの場合は必須
  paymentMethodId?: string;
  prepaymentAmountCents?: number;        // 最小50、変動前払いプランに必要
}
```

## レスポンス

### 成功 (200)

```typescript
interface Store {
  projectsMetadata: Array<{
    id: string;
    name: string;
  }>;
  status: "available" | "error" | "suspended" | "initializing";
  product: {
    name: string;
    capabilities: string[];
    metadataSchema: object;
  };
  billingPlan?: {
    type: "free" | "prepayment" | "subscription";
    cost?: number;
    details: string[];
  };
  externalResourceId: string;
  protocolSettings: object;
  secrets?: object;
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | 無効な入力または課金問題 |
| 401 | 未認証 |
| 402 | 支払い方法が不足 |
| 403 | 権限不足（管理者専用） |
| 404 | 構成または製品が見つかりません |
| 429 | レート制限超過 |

## 使用例

### 無料プラン

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

// 無料プランの場合、billingPlanIdを省略
const store = await vercel.storage.createIntegrationStore({
  teamId: 'team_my_team',
  requestBody: {
    name: 'My Development Database',
    integrationConfigurationId: 'icfg_abc123',
    integrationProductIdOrSlug: 'postgres-free',
    metadata: {
      region: 'us-east-1',
      environment: 'development'
    }
  }
});

console.log(`Store created: ${store.externalResourceId}`);
console.log(`Status: ${store.status}`);
```

### 有料プラン（サブスクリプション）

```typescript
const paidStore = await vercel.storage.createIntegrationStore({
  teamId: 'team_my_team',
  requestBody: {
    name: 'Production Database',
    integrationConfigurationId: 'icfg_abc123',
    integrationProductIdOrSlug: 'postgres-pro',
    billingPlanId: 'plan_pro_monthly',
    paymentMethodId: 'pm_xyz789',
    metadata: {
      region: 'us-east-1',
      environment: 'production',
      highAvailability: true
    }
  }
});

console.log(`Billing Plan: ${paidStore.billingPlan.type}`);
console.log(`Monthly Cost: $${paidStore.billingPlan.cost / 100}`);
```

### 有料プラン（前払い）

```typescript
const prepaidStore = await vercel.storage.createIntegrationStore({
  teamId: 'team_my_team',
  requestBody: {
    name: 'Storage Credits',
    integrationConfigurationId: 'icfg_abc123',
    integrationProductIdOrSlug: 'storage-credits',
    billingPlanId: 'plan_prepaid',
    paymentMethodId: 'pm_xyz789',
    prepaymentAmountCents: 10000  // $100
  }
});

console.log(`Prepaid amount: $${prepaidStore.prepaymentAmountCents / 100}`);
```

## 主要な機能

- **無料プラン自動検出**: `billingPlanId`を省略すると自動的に無料プランを使用
- **インライン課金認証**: 有料リソースの課金認証を自動処理
- **実リソースプロビジョニング**: Vercel Marketplaceを通じて実際のリソースを作成
- **管理者専用アクセス**: 管理者権限が必要

## 注意事項

- 管理者権限が必要です
- 有料プランには有効な支払い方法が必要です
- 前払いプランの最小金額は$0.50（50セント）です

## 関連リンク

- [List Integration Billing Plans](/docs/services/vercel/docs/rest-api/reference/endpoints/integrations/list-integration-billing-plans.md)
