# 課金データの送信

インストールの課金および使用状況データをVercelに送信します。

## エンドポイント

```
POST /v1/installations/{integrationConfigurationId}/billing
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

インストール設定時に提供された`credentials.access_token`を使用してください。

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インストール識別子 |

## リクエストボディ

```typescript
interface SubmitBillingDataRequest {
  // 必須フィールド
  timestamp: string;              // ISO 8601日時: サーバー時刻（競合検出用）
  eod: string;                    // ISO 8601日時: UTC終日（課金日）、24時間以内
  period: {                       // 課金サイクル
    start: string;                // ISO 8601日時
    end: string;                  // ISO 8601日時
  };
  billing: BillingItem[] | BillingItem;  // 請求項目（配列またはオブジェクト）
  usage: UsageMetric[];           // 使用状況メトリクス

  // オプションフィールド
  resourceId?: string;            // 特定のリソースに関連付ける場合
}

interface BillingItem {
  billingPlanId: string;          // 必須: 課金プランID
  name: string;                   // 必須: 項目名
  price: string;                  // 必須: 単価（文字列形式の10進数）
  quantity: number;               // 必須: 数量
  units: string;                  // 必須: 単位
  total: string;                  // 必須: 合計金額（文字列形式の10進数）
  resourceId?: string;            // オプション: リソースID
  start?: string;                 // オプション: 開始日時
  end?: string;                   // オプション: 終了日時
  details?: Array<{               // オプション: 詳細情報
    label: string;
    value: string;
  }>;
}

interface UsageMetric {
  name: string;                   // 必須: メトリクス名
  type: 'total' | 'interval' | 'rate';  // 必須: メトリクスタイプ
  units: string;                  // 必須: 単位
  dayValue: number;               // 必須: 日次値
  periodValue: number;            // 必須: 期間値
  planValue?: number;             // オプション: プラン値
  resourceId?: string;            // オプション: リソースID
}
```

## レスポンス

### 成功 (201)

```
No Content
```

課金データが正常に送信されると、201ステータスコードが返されます。

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストボディまたはクエリパラメータが無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | リソースが見つかりません |

## 使用例

### 基本的な課金データの送信

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_ACCESS_TOKEN
});

await vercel.marketplace.submitBillingData({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    timestamp: new Date().toISOString(),
    eod: new Date().toISOString(),
    period: {
      start: new Date('2024-01-01').toISOString(),
      end: new Date('2024-01-31').toISOString()
    },
    billing: [
      {
        billingPlanId: 'plan_pro_monthly',
        name: 'Pro Plan Subscription',
        price: '99.00',
        quantity: 1,
        units: 'subscription',
        total: '99.00'
      }
    ],
    usage: [
      {
        name: 'API Requests',
        type: 'total',
        units: 'requests',
        dayValue: 50000,
        periodValue: 1500000
      }
    ]
  }
});

console.log('✅ Billing data submitted successfully');
```

### リソース別の課金データ送信

```typescript
await vercel.marketplace.submitBillingData({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    timestamp: new Date().toISOString(),
    eod: new Date().toISOString(),
    period: {
      start: new Date('2024-01-01').toISOString(),
      end: new Date('2024-01-31').toISOString()
    },
    billing: [
      {
        billingPlanId: 'plan_database',
        name: 'Database Usage',
        price: '0.10',
        quantity: 1000,
        units: 'GB-hours',
        total: '100.00',
        resourceId: 'resource_db_1',
        details: [
          { label: 'Storage', value: '500 GB' },
          { label: 'Hours', value: '720' }
        ]
      }
    ],
    usage: [
      {
        name: 'Storage',
        type: 'interval',
        units: 'GB',
        dayValue: 500,
        periodValue: 15500,
        resourceId: 'resource_db_1'
      },
      {
        name: 'Queries',
        type: 'total',
        units: 'queries',
        dayValue: 100000,
        periodValue: 3100000,
        resourceId: 'resource_db_1'
      }
    ]
  }
});

console.log('✅ Resource billing data submitted');
```

### 日次課金データの送信

```typescript
async function submitDailyBilling(
  configId: string,
  date: Date,
  billingItems: any[],
  usageMetrics: any[]
) {
  const eod = new Date(date);
  eod.setUTCHours(23, 59, 59, 999);

  const periodStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const periodEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  await vercel.marketplace.submitBillingData({
    integrationConfigurationId: configId,
    requestBody: {
      timestamp: new Date().toISOString(),
      eod: eod.toISOString(),
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString()
      },
      billing: billingItems,
      usage: usageMetrics
    }
  });

  console.log(`✅ Daily billing submitted for ${date.toDateString()}`);
}

// 今日の課金データを送信
await submitDailyBilling(
  'iconfig_abc123',
  new Date(),
  [
    {
      billingPlanId: 'plan_pro',
      name: 'Daily Usage',
      price: '3.30',
      quantity: 1,
      units: 'day',
      total: '3.30'
    }
  ],
  [
    {
      name: 'Bandwidth',
      type: 'total',
      units: 'GB',
      dayValue: 150,
      periodValue: 4500
    }
  ]
);
```

### 時間別の詳細な使用状況送信

```typescript
async function submitHourlyUsage(
  configId: string,
  resourceId: string,
  hourlyData: {
    storage: number;
    bandwidth: number;
    requests: number;
  }
) {
  const now = new Date();
  const eod = new Date(now);
  eod.setUTCHours(23, 59, 59, 999);

  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // 時間単価を計算
  const storageRate = 0.10;  // $0.10 per GB-hour
  const bandwidthRate = 0.05;  // $0.05 per GB
  const requestRate = 0.0001;  // $0.0001 per request

  const storageTotal = (hourlyData.storage * storageRate).toFixed(2);
  const bandwidthTotal = (hourlyData.bandwidth * bandwidthRate).toFixed(2);
  const requestTotal = (hourlyData.requests * requestRate).toFixed(2);

  await vercel.marketplace.submitBillingData({
    integrationConfigurationId: configId,
    requestBody: {
      timestamp: now.toISOString(),
      eod: eod.toISOString(),
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString()
      },
      billing: [
        {
          billingPlanId: 'plan_usage',
          name: 'Storage Usage',
          price: storageRate.toString(),
          quantity: hourlyData.storage,
          units: 'GB-hours',
          total: storageTotal,
          resourceId
        },
        {
          billingPlanId: 'plan_usage',
          name: 'Bandwidth Usage',
          price: bandwidthRate.toString(),
          quantity: hourlyData.bandwidth,
          units: 'GB',
          total: bandwidthTotal,
          resourceId
        },
        {
          billingPlanId: 'plan_usage',
          name: 'API Requests',
          price: requestRate.toString(),
          quantity: hourlyData.requests,
          units: 'requests',
          total: requestTotal,
          resourceId
        }
      ],
      usage: [
        {
          name: 'Storage',
          type: 'interval',
          units: 'GB',
          dayValue: hourlyData.storage,
          periodValue: hourlyData.storage * 24,
          resourceId
        },
        {
          name: 'Bandwidth',
          type: 'total',
          units: 'GB',
          dayValue: hourlyData.bandwidth,
          periodValue: hourlyData.bandwidth * 30,
          resourceId
        },
        {
          name: 'Requests',
          type: 'rate',
          units: 'req/hour',
          dayValue: hourlyData.requests,
          periodValue: hourlyData.requests * 24 * 30,
          resourceId
        }
      ]
    }
  });

  console.log('✅ Hourly usage submitted');
}

// 1時間ごとに実行
await submitHourlyUsage('iconfig_abc123', 'resource_db_1', {
  storage: 500,
  bandwidth: 25,
  requests: 50000
});
```

### 複数リソースの課金データ送信

```typescript
async function submitMultiResourceBilling(
  configId: string,
  resources: Array<{
    id: string;
    planId: string;
    usage: any;
  }>
) {
  const now = new Date();
  const eod = new Date(now);
  eod.setUTCHours(23, 59, 59, 999);

  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // 各リソースの課金項目を作成
  const billingItems = resources.map(resource => ({
    billingPlanId: resource.planId,
    name: `Resource ${resource.id} Usage`,
    price: '50.00',
    quantity: 1,
    units: 'resource',
    total: '50.00',
    resourceId: resource.id
  }));

  // 各リソースの使用状況メトリクスを作成
  const usageMetrics = resources.flatMap(resource => [
    {
      name: 'Storage',
      type: 'interval' as const,
      units: 'GB',
      dayValue: resource.usage.storage,
      periodValue: resource.usage.storage * 30,
      resourceId: resource.id
    },
    {
      name: 'Requests',
      type: 'total' as const,
      units: 'requests',
      dayValue: resource.usage.requests,
      periodValue: resource.usage.requests * 30,
      resourceId: resource.id
    }
  ]);

  await vercel.marketplace.submitBillingData({
    integrationConfigurationId: configId,
    requestBody: {
      timestamp: now.toISOString(),
      eod: eod.toISOString(),
      period: {
        start: periodStart.toISOString(),
        end: periodEnd.toISOString()
      },
      billing: billingItems,
      usage: usageMetrics
    }
  });

  console.log(`✅ Billing submitted for ${resources.length} resources`);
}

await submitMultiResourceBilling('iconfig_abc123', [
  {
    id: 'resource_1',
    planId: 'plan_pro',
    usage: { storage: 100, requests: 10000 }
  },
  {
    id: 'resource_2',
    planId: 'plan_enterprise',
    usage: { storage: 500, requests: 50000 }
  }
]);
```

### エラーハンドリング付き送信

```typescript
async function submitBillingWithRetry(
  configId: string,
  billingData: any,
  maxRetries: number = 3
) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await vercel.marketplace.submitBillingData({
        integrationConfigurationId: configId,
        requestBody: billingData
      });

      console.log(`✅ Billing data submitted (attempt ${attempt + 1})`);
      return true;
    } catch (error) {
      attempt++;

      if (error.statusCode === 400) {
        console.error('❌ Invalid billing data format');
        throw error;  // リトライしない
      }

      if (attempt >= maxRetries) {
        console.error(`❌ Failed after ${maxRetries} attempts: ${error.message}`);
        throw error;
      }

      console.log(`⚠️ Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  return false;
}
```

### 自動日次送信スケジューラ

```typescript
async function scheduleDailyBillingSubmission(configId: string) {
  const submitDaily = async () => {
    const now = new Date();
    const eod = new Date(now);
    eod.setUTCHours(23, 59, 59, 999);

    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 実際の使用状況データを収集
    const usageData = await collectDailyUsage();

    try {
      await vercel.marketplace.submitBillingData({
        integrationConfigurationId: configId,
        requestBody: {
          timestamp: now.toISOString(),
          eod: eod.toISOString(),
          period: {
            start: periodStart.toISOString(),
            end: periodEnd.toISOString()
          },
          billing: usageData.billing,
          usage: usageData.usage
        }
      });

      console.log(`✅ Daily billing submitted: ${now.toDateString()}`);
    } catch (error) {
      console.error(`❌ Failed to submit daily billing: ${error.message}`);
      // エラーログを記録、アラートを送信など
    }
  };

  // 毎日UTC 23:30に実行（実際の実装ではcronジョブや
  //スケジューラーサービスを使用）
  console.log('Daily billing submission scheduled');
}

async function collectDailyUsage() {
  // 実際の使用状況データを収集するロジック
  return {
    billing: [
      {
        billingPlanId: 'plan_pro',
        name: 'Daily Usage',
        price: '3.30',
        quantity: 1,
        units: 'day',
        total: '3.30'
      }
    ],
    usage: [
      {
        name: 'Storage',
        type: 'interval' as const,
        units: 'GB',
        dayValue: 500,
        periodValue: 15000
      }
    ]
  };
}
```

## メトリクスタイプの説明

| タイプ | 説明 | 使用例 |
|-------|------|--------|
| `total` | 累積合計値 | APIリクエスト総数、処理されたジョブ数 |
| `interval` | 期間内の平均値 | ストレージ使用量、アクティブユーザー数 |
| `rate` | 単位時間あたりのレート | リクエスト/秒、スループット |

## 送信頻度の推奨事項

- **最低**: 1日1回
- **推奨**: 1時間に1回
- **理由**: より頻繁な送信により、Vercelダッシュボードでリアルタイムに近い使用状況が表示されます

## 注意事項

- `timestamp`はサーバー時刻を使用し、競合検出に使用されます
- `eod`（End of Day）は24時間以内でなければなりません
- 日次/週次/月次データの最新版のみが保持されます
- すべての金額は文字列形式の10進数で指定します
- `billing`は配列またはオブジェクトを受け付けます

## 関連リンク

- [Submit Invoice](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/submit-invoice.md)
- [Get Integration Resources](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resources.md)
- [Update Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/update-resource.md)
