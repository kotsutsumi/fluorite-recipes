# インボイスの取得

指定されたインボイスIDのインボイス詳細とステータスを取得します。

## エンドポイント

```
GET /v1/installations/{integrationConfigurationId}/billing/invoices/{invoiceId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インテグレーション設定識別子 |
| `invoiceId` | string | ✓ | インボイス識別子 |

## レスポンス

### 成功 (200)

```typescript
interface Invoice {
  test?: boolean;                       // テストモードかどうか
  invoiceId: string;                    // インボイスID
  externalId?: string;                  // 外部システムのID
  state: InvoiceState;                  // インボイスの状態
  invoiceNumber?: string;               // インボイス番号
  invoiceDate: string;                  // インボイス日付（ISO 8601形式）
  period: {                             // 請求期間
    start: string;                      // 期間開始（ISO 8601形式）
    end: string;                        // 期間終了（ISO 8601形式）
  };
  memo?: string;                        // メモ
  items: InvoiceItem[];                 // インボイスアイテムのリスト
  discounts?: InvoiceDiscount[];        // 割引のリスト
  total: string;                        // 合計金額（ドル表記）
  refundReason?: string;                // 返金理由
  refundTotal?: string;                 // 返金合計金額（ドル表記）
  created: string;                      // 作成日時（ISO 8601形式）
  updated: string;                      // 更新日時（ISO 8601形式）
}

type InvoiceState =
  | 'pending'              // 保留中
  | 'scheduled'            // スケジュール済み
  | 'invoiced'             // 請求済み
  | 'paid'                 // 支払い済み
  | 'notpaid'              // 未払い
  | 'refund_requested'     // 返金リクエスト済み
  | 'refunded';            // 返金済み

interface InvoiceItem {
  billingPlanId: string;                // 課金プランID
  resourceId?: string;                  // リソースID
  start?: string;                       // 開始日時（ISO 8601形式）
  end?: string;                         // 終了日時（ISO 8601形式）
  name: string;                         // アイテム名
  details?: string;                     // 詳細説明
  price: string;                        // 単価（ドル表記）
  quantity: number;                     // 数量
  units: string;                        // 単位
  total: string;                        // 合計金額（ドル表記）
}

interface InvoiceDiscount {
  billingPlanId: string;                // 課金プランID
  resourceId?: string;                  // リソースID
  start?: string;                       // 開始日時（ISO 8601形式）
  end?: string;                         // 終了日時（ISO 8601形式）
  name: string;                         // 割引名
  details?: string;                     // 詳細説明
  amount: string;                       // 割引金額（ドル表記）
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | インボイスが見つかりません |

## 使用例

### 基本的なインボイス取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const invoice = await vercel.marketplace.getInvoice({
  integrationConfigurationId: 'iconfig_abc123',
  invoiceId: 'invoice_xyz789'
});

console.log('📄 Invoice Details:');
console.log(`   ID: ${invoice.invoiceId}`);
console.log(`   Number: ${invoice.invoiceNumber || 'N/A'}`);
console.log(`   State: ${invoice.state}`);
console.log(`   Total: ${invoice.total}`);
console.log(`   Date: ${invoice.invoiceDate}`);
```

### インボイス状態の確認

```typescript
async function checkInvoiceStatus(
  configId: string,
  invoiceId: string
) {
  const invoice = await vercel.marketplace.getInvoice({
    integrationConfigurationId: configId,
    invoiceId
  });

  const stateEmoji = {
    pending: '⏳',
    scheduled: '📅',
    invoiced: '📧',
    paid: '✅',
    notpaid: '⚠️',
    refund_requested: '🔄',
    refunded: '💸'
  };

  console.log(`${stateEmoji[invoice.state]} Invoice State: ${invoice.state}`);

  switch (invoice.state) {
    case 'paid':
      console.log('✅ Payment received');
      break;
    case 'notpaid':
      console.log('⚠️ Payment overdue - follow up required');
      break;
    case 'refund_requested':
      console.log('🔄 Refund requested - process refund');
      if (invoice.refundReason) {
        console.log(`   Reason: ${invoice.refundReason}`);
      }
      break;
    case 'refunded':
      console.log('💸 Refund completed');
      if (invoice.refundTotal) {
        console.log(`   Amount: ${invoice.refundTotal}`);
      }
      break;
  }

  return invoice;
}

await checkInvoiceStatus('iconfig_abc123', 'invoice_xyz789');
```

### インボイス詳細の表示

```typescript
async function displayInvoiceDetails(
  configId: string,
  invoiceId: string
) {
  const invoice = await vercel.marketplace.getInvoice({
    integrationConfigurationId: configId,
    invoiceId
  });

  console.log('\n📄 Invoice Summary:');
  console.log(`   Invoice ID: ${invoice.invoiceId}`);
  console.log(`   Invoice #: ${invoice.invoiceNumber || 'Pending'}`);
  console.log(`   Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`);
  console.log(`   State: ${invoice.state}`);

  console.log('\n📅 Billing Period:');
  console.log(`   From: ${new Date(invoice.period.start).toLocaleDateString()}`);
  console.log(`   To: ${new Date(invoice.period.end).toLocaleDateString()}`);

  console.log('\n📋 Line Items:');
  invoice.items.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.name}`);
    console.log(`      Price: ${item.price} × ${item.quantity} ${item.units}`);
    console.log(`      Total: ${item.total}`);
    if (item.details) {
      console.log(`      Details: ${item.details}`);
    }
  });

  if (invoice.discounts && invoice.discounts.length > 0) {
    console.log('\n💰 Discounts:');
    invoice.discounts.forEach((discount, index) => {
      console.log(`   ${index + 1}. ${discount.name}`);
      console.log(`      Amount: -${discount.amount}`);
      if (discount.details) {
        console.log(`      Details: ${discount.details}`);
      }
    });
  }

  console.log(`\n💵 Total: ${invoice.total}`);

  if (invoice.memo) {
    console.log(`\n📝 Memo: ${invoice.memo}`);
  }

  if (invoice.test) {
    console.log('\n⚠️ TEST MODE - This is not a real invoice');
  }

  return invoice;
}

await displayInvoiceDetails('iconfig_abc123', 'invoice_xyz789');
```

### インボイスアイテムの分析

```typescript
async function analyzeInvoiceItems(
  configId: string,
  invoiceId: string
) {
  const invoice = await vercel.marketplace.getInvoice({
    integrationConfigurationId: configId,
    invoiceId
  });

  const analysis = {
    totalItems: invoice.items.length,
    totalAmount: parseFloat(invoice.total),
    itemsByPlan: {} as Record<string, any>,
    totalDiscounts: 0
  };

  // アイテムをプラン別に集計
  invoice.items.forEach(item => {
    if (!analysis.itemsByPlan[item.billingPlanId]) {
      analysis.itemsByPlan[item.billingPlanId] = {
        count: 0,
        total: 0,
        items: []
      };
    }

    analysis.itemsByPlan[item.billingPlanId].count++;
    analysis.itemsByPlan[item.billingPlanId].total += parseFloat(item.total);
    analysis.itemsByPlan[item.billingPlanId].items.push(item);
  });

  // 割引額を集計
  if (invoice.discounts) {
    analysis.totalDiscounts = invoice.discounts.reduce(
      (sum, discount) => sum + parseFloat(discount.amount),
      0
    );
  }

  console.log('\n📊 Invoice Analysis:');
  console.log(`   Total Items: ${analysis.totalItems}`);
  console.log(`   Total Amount: $${analysis.totalAmount.toFixed(2)}`);
  console.log(`   Total Discounts: -$${analysis.totalDiscounts.toFixed(2)}`);

  console.log('\n   By Billing Plan:');
  Object.entries(analysis.itemsByPlan).forEach(([planId, data]) => {
    console.log(`   ${planId}:`);
    console.log(`     Items: ${data.count}`);
    console.log(`     Total: $${data.total.toFixed(2)}`);
  });

  return analysis;
}

await analyzeInvoiceItems('iconfig_abc123', 'invoice_xyz789');
```

### 返金処理の追跡

```typescript
async function trackRefund(
  configId: string,
  invoiceId: string
) {
  const invoice = await vercel.marketplace.getInvoice({
    integrationConfigurationId: configId,
    invoiceId
  });

  if (invoice.state === 'refund_requested' || invoice.state === 'refunded') {
    console.log('\n💸 Refund Information:');
    console.log(`   Status: ${invoice.state}`);

    if (invoice.refundReason) {
      console.log(`   Reason: ${invoice.refundReason}`);
    }

    if (invoice.refundTotal) {
      console.log(`   Amount: ${invoice.refundTotal}`);
      console.log(`   Original: ${invoice.total}`);

      const refundPercent = (
        (parseFloat(invoice.refundTotal) / parseFloat(invoice.total)) * 100
      ).toFixed(1);
      console.log(`   Percentage: ${refundPercent}%`);
    }

    if (invoice.state === 'refunded') {
      console.log(`   Processed: ${invoice.updated}`);
    }
  } else {
    console.log('ℹ️ No refund activity for this invoice');
  }

  return invoice;
}

await trackRefund('iconfig_abc123', 'invoice_xyz789');
```

### 期間別インボイス取得

```typescript
async function getInvoicesForPeriod(
  configId: string,
  invoiceIds: string[]
) {
  console.log(`Retrieving ${invoiceIds.length} invoices...`);

  const invoices = [];

  for (const invoiceId of invoiceIds) {
    try {
      const invoice = await vercel.marketplace.getInvoice({
        integrationConfigurationId: configId,
        invoiceId
      });

      invoices.push(invoice);
      console.log(`✅ Retrieved: ${invoiceId} (${invoice.state})`);
    } catch (error) {
      console.error(`❌ Failed: ${invoiceId} - ${error.message}`);
    }
  }

  // 期間でソート
  invoices.sort((a, b) =>
    new Date(a.invoiceDate).getTime() - new Date(b.invoiceDate).getTime()
  );

  return invoices;
}

const invoices = await getInvoicesForPeriod('iconfig_abc123', [
  'invoice_jan',
  'invoice_feb',
  'invoice_mar'
]);
```

### 未払いインボイスの確認

```typescript
async function checkUnpaidInvoices(
  configId: string,
  invoiceIds: string[]
) {
  console.log('Checking for unpaid invoices...');

  const unpaidInvoices = [];

  for (const invoiceId of invoiceIds) {
    try {
      const invoice = await vercel.marketplace.getInvoice({
        integrationConfigurationId: configId,
        invoiceId
      });

      if (invoice.state === 'notpaid') {
        const daysOverdue = Math.floor(
          (Date.now() - new Date(invoice.invoiceDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        unpaidInvoices.push({
          invoiceId: invoice.invoiceId,
          invoiceNumber: invoice.invoiceNumber,
          amount: invoice.total,
          invoiceDate: invoice.invoiceDate,
          daysOverdue
        });
      }
    } catch (error) {
      console.error(`Error checking ${invoiceId}: ${error.message}`);
    }
  }

  if (unpaidInvoices.length > 0) {
    console.log(`\n⚠️ ${unpaidInvoices.length} Unpaid Invoice(s):`);
    unpaidInvoices.forEach(inv => {
      console.log(`   Invoice #${inv.invoiceNumber || inv.invoiceId}`);
      console.log(`     Amount: ${inv.amount}`);
      console.log(`     Days Overdue: ${inv.daysOverdue}`);
    });
  } else {
    console.log('✅ All invoices are paid');
  }

  return unpaidInvoices;
}

await checkUnpaidInvoices('iconfig_abc123', [
  'invoice_1',
  'invoice_2',
  'invoice_3'
]);
```

### インボイス監査レポート

```typescript
async function generateInvoiceAuditReport(
  configId: string,
  invoiceId: string
) {
  const invoice = await vercel.marketplace.getInvoice({
    integrationConfigurationId: configId,
    invoiceId
  });

  console.log('\n📋 Invoice Audit Report');
  console.log('='.repeat(50));

  console.log('\nBasic Information:');
  console.log(`  Invoice ID: ${invoice.invoiceId}`);
  console.log(`  Invoice Number: ${invoice.invoiceNumber || 'N/A'}`);
  console.log(`  External ID: ${invoice.externalId || 'N/A'}`);
  console.log(`  State: ${invoice.state}`);
  console.log(`  Test Mode: ${invoice.test ? 'Yes' : 'No'}`);

  console.log('\nTimestamps:');
  console.log(`  Invoice Date: ${invoice.invoiceDate}`);
  console.log(`  Created: ${invoice.created}`);
  console.log(`  Last Updated: ${invoice.updated}`);

  console.log('\nBilling Period:');
  const periodDays = Math.ceil(
    (new Date(invoice.period.end).getTime() -
      new Date(invoice.period.start).getTime()) / (1000 * 60 * 60 * 24)
  );
  console.log(`  Start: ${invoice.period.start}`);
  console.log(`  End: ${invoice.period.end}`);
  console.log(`  Duration: ${periodDays} days`);

  console.log('\nFinancial Summary:');
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + parseFloat(item.total),
    0
  );
  const totalDiscounts = invoice.discounts
    ? invoice.discounts.reduce((sum, d) => sum + parseFloat(d.amount), 0)
    : 0;

  console.log(`  Subtotal: $${subtotal.toFixed(2)}`);
  console.log(`  Discounts: -$${totalDiscounts.toFixed(2)}`);
  console.log(`  Total: ${invoice.total}`);

  if (invoice.refundTotal) {
    console.log(`  Refund: -${invoice.refundTotal}`);
  }

  console.log('\nItems Breakdown:');
  invoice.items.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.name}`);
    console.log(`     Plan: ${item.billingPlanId}`);
    console.log(`     Quantity: ${item.quantity} ${item.units}`);
    console.log(`     Price: ${item.price}`);
    console.log(`     Total: ${item.total}`);
  });

  console.log('\n' + '='.repeat(50));

  return invoice;
}

await generateInvoiceAuditReport('iconfig_abc123', 'invoice_xyz789');
```

## 注意事項

- **インボイス状態**: インボイスのライフサイクルは `pending` → `scheduled` → `invoiced` → `paid/notpaid` の順で進行します
- **金額表記**: すべての金額はドル表記の文字列です（例: "99.00"）
- **日付フォーマット**: すべての日付はISO 8601形式（`YYYY-MM-DDTHH:mm:ssZ`）です
- **テストモード**: `test: true`の場合、実際の請求は発生しません
- **返金処理**: 返金リクエストがある場合、`refundReason`と`refundTotal`が設定されます
- **外部ID**: `externalId`は外部システムとの統合に使用できます

## インボイス状態の説明

| 状態 | 説明 |
|-----|------|
| `pending` | インボイス作成中または確認待ち |
| `scheduled` | 送信スケジュール済み |
| `invoiced` | 顧客に送信済み |
| `paid` | 支払い完了 |
| `notpaid` | 期限切れ未払い |
| `refund_requested` | 返金リクエスト受領 |
| `refunded` | 返金処理完了 |

## 関連リンク

- [Submit Invoice](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/submit-invoice.md)
- [Submit Billing Data](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/submit-billing-data.md)
- [Get Integration Resources](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resources.md)
