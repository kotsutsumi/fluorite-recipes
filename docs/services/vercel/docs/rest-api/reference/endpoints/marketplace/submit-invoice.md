# インボイスの提出

インストールの請求に対するインボイスを提出します。

## エンドポイント

```
POST /v1/installations/{integrationConfigurationId}/billing/invoices
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インストール識別子 |

## リクエストボディ

```typescript
interface SubmitInvoiceRequest {
  invoiceDate: string;                  // インボイス日付（ISO 8601形式）
  period: {                             // 請求期間
    start: string;                      // 期間開始（ISO 8601形式）
    end: string;                        // 期間終了（ISO 8601形式）
  };
  items: InvoiceItem[];                 // インボイスアイテムのリスト
}

interface InvoiceItem {
  description: string;                  // アイテムの説明
  amount: number;                       // 金額（セント単位）
  quantity?: number;                    // 数量（オプション）
  currency?: string;                    // 通貨コード（デフォルト: USD）
  metadata?: object;                    // カスタムメタデータ（オプション）
}
```

## レスポンス

### 成功 (200)

```typescript
interface SubmitInvoiceResponse {
  invoiceId: string;                    // 生成されたインボイスID
  test: boolean;                        // テストモードかどうか
  validationErrors?: string[];          // 検証エラーのリスト（存在する場合）
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストボディまたはクエリパラメータが無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | インストールが見つかりません |
| 422 | 処理不可能なエンティティ（検証エラー） |

## 使用例

### 基本的なインボイス提出

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.marketplace.submitInvoice({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    invoiceDate: '2024-03-01T00:00:00Z',
    period: {
      start: '2024-02-01T00:00:00Z',
      end: '2024-02-29T23:59:59Z'
    },
    items: [
      {
        description: 'Premium Plan - February 2024',
        amount: 9900,  // $99.00
        quantity: 1,
        currency: 'USD'
      }
    ]
  }
});

console.log(`✅ Invoice submitted: ${result.invoiceId}`);
console.log(`   Test mode: ${result.test}`);
```

### 複数アイテムのインボイス

```typescript
const result = await vercel.marketplace.submitInvoice({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    invoiceDate: '2024-03-01T00:00:00Z',
    period: {
      start: '2024-02-01T00:00:00Z',
      end: '2024-02-29T23:59:59Z'
    },
    items: [
      {
        description: 'Base Subscription',
        amount: 4900,
        quantity: 1,
        currency: 'USD'
      },
      {
        description: 'Additional Storage (100GB)',
        amount: 1000,
        quantity: 100,
        currency: 'USD',
        metadata: {
          type: 'storage',
          unit: 'GB'
        }
      },
      {
        description: 'API Calls (per 1000)',
        amount: 50,
        quantity: 250,
        currency: 'USD',
        metadata: {
          type: 'api_usage',
          calls: 250000
        }
      }
    ]
  }
});

console.log(`✅ Invoice ID: ${result.invoiceId}`);
console.log(`   Total: $${(9900 + 100000 + 12500) / 100}`);
```

### 従量課金のインボイス

```typescript
const result = await vercel.marketplace.submitInvoice({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    invoiceDate: '2024-03-01T00:00:00Z',
    period: {
      start: '2024-02-01T00:00:00Z',
      end: '2024-02-29T23:59:59Z'
    },
    items: [
      {
        description: 'Compute Hours',
        amount: 15,
        quantity: 2400,
        currency: 'USD',
        metadata: {
          category: 'compute',
          hours: 2400,
          rate: '$0.15/hour'
        }
      },
      {
        description: 'Data Transfer (per GB)',
        amount: 10,
        quantity: 500,
        currency: 'USD',
        metadata: {
          category: 'bandwidth',
          gigabytes: 500,
          rate: '$0.10/GB'
        }
      },
      {
        description: 'Database Storage (per GB)',
        amount: 20,
        quantity: 100,
        currency: 'USD',
        metadata: {
          category: 'storage',
          gigabytes: 100,
          rate: '$0.20/GB'
        }
      }
    ]
  }
});

console.log(`✅ Usage-based invoice submitted: ${result.invoiceId}`);
```

### 異なる通貨でのインボイス

```typescript
const result = await vercel.marketplace.submitInvoice({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    invoiceDate: '2024-03-01T00:00:00Z',
    period: {
      start: '2024-02-01T00:00:00Z',
      end: '2024-02-29T23:59:59Z'
    },
    items: [
      {
        description: 'Enterprise Plan - EUR Region',
        amount: 8900,  // €89.00
        quantity: 1,
        currency: 'EUR'
      }
    ]
  }
});

console.log(`Invoice submitted in EUR: ${result.invoiceId}`);
```

### メタデータ付きインボイス

```typescript
const result = await vercel.marketplace.submitInvoice({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    invoiceDate: '2024-03-01T00:00:00Z',
    period: {
      start: '2024-02-01T00:00:00Z',
      end: '2024-02-29T23:59:59Z'
    },
    items: [
      {
        description: 'Premium Database Plan',
        amount: 19900,
        quantity: 1,
        currency: 'USD',
        metadata: {
          plan: 'premium',
          region: 'us-east-1',
          features: ['backups', 'replication', 'monitoring'],
          contractId: 'contract_xyz789'
        }
      }
    ]
  }
});

console.log(`Invoice with metadata: ${result.invoiceId}`);
```

### エラーハンドリング付きインボイス提出

```typescript
async function submitInvoiceSafely(
  configId: string,
  invoiceData: any
) {
  try {
    const result = await vercel.marketplace.submitInvoice({
      integrationConfigurationId: configId,
      requestBody: invoiceData
    });

    if (result.validationErrors && result.validationErrors.length > 0) {
      console.warn('⚠️ Validation warnings:');
      result.validationErrors.forEach(error => {
        console.warn(`   - ${error}`);
      });
    }

    console.log(`✅ Invoice submitted: ${result.invoiceId}`);
    console.log(`   Test mode: ${result.test}`);

    return { success: true, invoiceId: result.invoiceId };
  } catch (error) {
    console.error('❌ Invoice submission failed');

    if (error.statusCode === 400) {
      console.error('   Invalid request body');
    } else if (error.statusCode === 404) {
      console.error('   Installation not found');
    } else if (error.statusCode === 422) {
      console.error('   Validation errors - check invoice data');
    } else {
      console.error(`   Error: ${error.message}`);
    }

    return { success: false, error: error.message };
  }
}

await submitInvoiceSafely('iconfig_abc123', {
  invoiceDate: '2024-03-01T00:00:00Z',
  period: {
    start: '2024-02-01T00:00:00Z',
    end: '2024-02-29T23:59:59Z'
  },
  items: [
    {
      description: 'Monthly Subscription',
      amount: 9900,
      quantity: 1,
      currency: 'USD'
    }
  ]
});
```

### 月次インボイス自動生成

```typescript
async function generateMonthlyInvoice(
  configId: string,
  year: number,
  month: number,
  items: Array<{ description: string; amount: number; quantity?: number }>
) {
  // 月の開始日と終了日を計算
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const invoiceDate = new Date(year, month, 1);

  const result = await vercel.marketplace.submitInvoice({
    integrationConfigurationId: configId,
    requestBody: {
      invoiceDate: invoiceDate.toISOString(),
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      items: items.map(item => ({
        ...item,
        currency: 'USD'
      }))
    }
  });

  console.log(`✅ Monthly invoice for ${year}-${month}: ${result.invoiceId}`);

  return result;
}

// 2024年2月のインボイスを生成
await generateMonthlyInvoice('iconfig_abc123', 2024, 2, [
  { description: 'Base Plan', amount: 4900, quantity: 1 },
  { description: 'Additional Users', amount: 1000, quantity: 5 }
]);
```

### 日割り計算インボイス

```typescript
function calculateProration(
  fullAmount: number,
  startDate: Date,
  endDate: Date,
  billingPeriodStart: Date,
  billingPeriodEnd: Date
): number {
  const totalDays = Math.ceil(
    (billingPeriodEnd.getTime() - billingPeriodStart.getTime()) / (1000 * 60 * 60 * 24)
  );
  const usedDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.round((fullAmount * usedDays) / totalDays);
}

const fullMonthAmount = 9900;  // $99.00
const startDate = new Date('2024-02-15');
const endDate = new Date('2024-02-29');
const billingStart = new Date('2024-02-01');
const billingEnd = new Date('2024-02-29');

const proratedAmount = calculateProration(
  fullMonthAmount,
  startDate,
  endDate,
  billingStart,
  billingEnd
);

const result = await vercel.marketplace.submitInvoice({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    invoiceDate: '2024-03-01T00:00:00Z',
    period: {
      start: startDate.toISOString(),
      end: endDate.toISOString()
    },
    items: [
      {
        description: 'Premium Plan (Prorated)',
        amount: proratedAmount,
        quantity: 1,
        currency: 'USD',
        metadata: {
          originalAmount: fullMonthAmount,
          proratedDays: 15,
          totalDays: 29
        }
      }
    ]
  }
});

console.log(`✅ Prorated invoice: ${result.invoiceId}`);
console.log(`   Original: $${fullMonthAmount / 100}`);
console.log(`   Prorated: $${proratedAmount / 100}`);
```

### 一括インボイス提出

```typescript
async function submitBatchInvoices(
  invoices: Array<{
    configId: string;
    invoiceDate: string;
    period: { start: string; end: string };
    items: any[];
  }>
) {
  console.log(`Submitting ${invoices.length} invoices...`);

  const results = [];

  for (const invoice of invoices) {
    try {
      const result = await vercel.marketplace.submitInvoice({
        integrationConfigurationId: invoice.configId,
        requestBody: {
          invoiceDate: invoice.invoiceDate,
          period: invoice.period,
          items: invoice.items
        }
      });

      results.push({
        configId: invoice.configId,
        success: true,
        invoiceId: result.invoiceId
      });

      console.log(`✅ Invoice submitted: ${result.invoiceId}`);
    } catch (error) {
      results.push({
        configId: invoice.configId,
        success: false,
        error: error.message
      });

      console.error(`❌ Failed for ${invoice.configId}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ Completed: ${successCount}/${invoices.length} invoices submitted`);

  return results;
}

await submitBatchInvoices([
  {
    configId: 'iconfig_1',
    invoiceDate: '2024-03-01T00:00:00Z',
    period: {
      start: '2024-02-01T00:00:00Z',
      end: '2024-02-29T23:59:59Z'
    },
    items: [
      { description: 'Plan A', amount: 4900, quantity: 1, currency: 'USD' }
    ]
  },
  {
    configId: 'iconfig_2',
    invoiceDate: '2024-03-01T00:00:00Z',
    period: {
      start: '2024-02-01T00:00:00Z',
      end: '2024-02-29T23:59:59Z'
    },
    items: [
      { description: 'Plan B', amount: 9900, quantity: 1, currency: 'USD' }
    ]
  }
]);
```

## 注意事項

- **金額の単位**: すべての金額はセント単位（最小通貨単位）で指定します
  - USD: 100 = $1.00
  - EUR: 100 = €1.00
  - JPY: 1 = ¥1
- **日付フォーマット**: ISO 8601形式（`YYYY-MM-DDTHH:mm:ssZ`）で指定します
- **請求期間**: `period.start`から`period.end`の範囲内である必要があります
- **検証エラー**: `validationErrors`配列が存在する場合、警告として扱い、修正を検討してください
- **テストモード**: `test: true`の場合、実際の請求は発生しません
- **通貨コード**: ISO 4217形式（USD, EUR, GBP, JPYなど）を使用します
- **インボイスID**: 提出後に自動生成され、追跡に使用できます

## 金額計算ガイド

### 基本計算

```typescript
// ドル額をセントに変換
const dollars = 99.99;
const cents = Math.round(dollars * 100);  // 9999

// セントをドル額に変換
const cents = 9999;
const dollars = cents / 100;  // 99.99
```

### 数量計算

```typescript
// 単価 × 数量
const unitPrice = 100;  // $1.00 per unit
const quantity = 50;
const totalAmount = unitPrice * quantity;  // 5000 = $50.00
```

### 税金計算

```typescript
const subtotal = 10000;  // $100.00
const taxRate = 0.10;    // 10%
const taxAmount = Math.round(subtotal * taxRate);  // 1000 = $10.00
const total = subtotal + taxAmount;  // 11000 = $110.00
```

## 関連リンク

- [Submit Billing Data](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/submit-billing-data.md)
- [Get Integration Resources](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resources.md)
- [Create Event](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/create-event.md)
