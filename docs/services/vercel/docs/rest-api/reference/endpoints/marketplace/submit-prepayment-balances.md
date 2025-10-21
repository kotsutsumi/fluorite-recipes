# プリペイメント残高の提出

インストールのプリペイメント（前払い）残高情報を提出します。クレジットベースの課金モデルで使用します。

## エンドポイント

```
POST /v1/installations/{integrationConfigurationId}/billing/balance
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
interface SubmitPrepaymentBalancesRequest {
  timestamp: string;                    // サーバータイムスタンプ（ISO 8601形式）
  balances: Balance[];                  // 残高情報の配列
}

interface Balance {
  resourceId?: string;                  // リソースID（省略可：インストールに紐付ける場合）
  credit?: string;                      // 人間が読める形式のクレジット説明（例: "2,000 Tokens"）
  nameLabel?: string;                   // クレジットの表示名（例: "Tokens"）
  currencyValueInCents: number;         // USD換算値（セント単位） - 必須
}
```

## レスポンス

### 成功 (201)

```
空のレスポンス（ステータスコード201のみ）
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストボディまたはクエリパラメータが無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | インストールが見つかりません |

## 使用例

### 基本的な残高提出

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.marketplace.submitPrepaymentBalances({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    timestamp: new Date().toISOString(),
    balances: [
      {
        credit: '10,000 API Calls',
        nameLabel: 'API Calls',
        currencyValueInCents: 10000  // $100.00相当
      }
    ]
  }
});

console.log('✅ Balance submitted successfully');
```

### リソース別の残高提出

```typescript
await vercel.marketplace.submitPrepaymentBalances({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    timestamp: new Date().toISOString(),
    balances: [
      {
        resourceId: 'resource_database_1',
        credit: '500 GB Storage',
        nameLabel: 'Storage',
        currencyValueInCents: 5000  // $50.00相当
      },
      {
        resourceId: 'resource_cache_1',
        credit: '100,000 Requests',
        nameLabel: 'Cache Requests',
        currencyValueInCents: 2000  // $20.00相当
      }
    ]
  }
});

console.log('✅ Resource balances submitted');
```

### トークンベースの残高

```typescript
await vercel.marketplace.submitPrepaymentBalances({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    timestamp: new Date().toISOString(),
    balances: [
      {
        credit: '1,000,000 Tokens',
        nameLabel: 'AI Tokens',
        currencyValueInCents: 50000  // $500.00相当
      }
    ]
  }
});

console.log('✅ Token balance submitted');
```

### 複数タイプのクレジット残高

```typescript
await vercel.marketplace.submitPrepaymentBalances({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    timestamp: new Date().toISOString(),
    balances: [
      {
        credit: '100 Hours',
        nameLabel: 'Compute Hours',
        currencyValueInCents: 15000  // $150.00相当
      },
      {
        credit: '1 TB',
        nameLabel: 'Data Transfer',
        currencyValueInCents: 10000  // $100.00相当
      },
      {
        credit: '500 GB',
        nameLabel: 'Storage',
        currencyValueInCents: 5000   // $50.00相当
      }
    ]
  }
});

console.log('✅ Multiple credit types submitted');
```

### 定期的な残高更新

```typescript
async function updateBalancesRegularly(
  configId: string,
  getBalanceData: () => Balance[]
) {
  const balanceData = getBalanceData();

  await vercel.marketplace.submitPrepaymentBalances({
    integrationConfigurationId: configId,
    requestBody: {
      timestamp: new Date().toISOString(),
      balances: balanceData
    }
  });

  console.log(`✅ Balances updated: ${balanceData.length} entries`);
}

// 使用例: 1時間ごとに残高を更新
setInterval(
  () => updateBalancesRegularly('iconfig_abc123', () => [
    {
      credit: '50,000 API Calls',
      nameLabel: 'API Calls',
      currencyValueInCents: 5000
    }
  ]),
  3600000  // 1時間
);
```

### エラーハンドリング付き提出

```typescript
async function submitBalancesSafely(
  configId: string,
  balances: Balance[]
) {
  try {
    await vercel.marketplace.submitPrepaymentBalances({
      integrationConfigurationId: configId,
      requestBody: {
        timestamp: new Date().toISOString(),
        balances
      }
    });

    console.log('✅ Balances submitted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Balance submission failed');

    if (error.statusCode === 400) {
      console.error('   Invalid balance data format');
    } else if (error.statusCode === 404) {
      console.error('   Installation not found');
    } else {
      console.error(`   Error: ${error.message}`);
    }

    return { success: false, error: error.message };
  }
}

await submitBalancesSafely('iconfig_abc123', [
  {
    credit: '10,000 Credits',
    nameLabel: 'Credits',
    currencyValueInCents: 10000
  }
]);
```

### 残高履歴の追跡

```typescript
interface BalanceSnapshot {
  timestamp: string;
  balances: Balance[];
  submitted: boolean;
}

class BalanceTracker {
  private history: BalanceSnapshot[] = [];

  async submitAndTrack(
    configId: string,
    balances: Balance[]
  ) {
    const snapshot: BalanceSnapshot = {
      timestamp: new Date().toISOString(),
      balances: JSON.parse(JSON.stringify(balances)),
      submitted: false
    };

    try {
      await vercel.marketplace.submitPrepaymentBalances({
        integrationConfigurationId: configId,
        requestBody: {
          timestamp: snapshot.timestamp,
          balances
        }
      });

      snapshot.submitted = true;
      this.history.push(snapshot);

      console.log(`✅ Balance submitted and tracked`);
      return true;
    } catch (error) {
      snapshot.submitted = false;
      this.history.push(snapshot);

      console.error(`❌ Failed to submit balance: ${error.message}`);
      return false;
    }
  }

  getHistory() {
    return this.history;
  }

  getLastSuccessful() {
    return this.history
      .filter(s => s.submitted)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }
}

const tracker = new BalanceTracker();
await tracker.submitAndTrack('iconfig_abc123', [
  {
    credit: '5,000 Credits',
    nameLabel: 'Credits',
    currencyValueInCents: 5000
  }
]);
```

### クレジット消費計算

```typescript
interface CreditUsage {
  initialCredits: number;
  usedCredits: number;
  remainingCredits: number;
  currencyValueInCents: number;
}

async function submitRemainingBalance(
  configId: string,
  usage: CreditUsage
) {
  const remainingValue = Math.round(
    (usage.remainingCredits / usage.initialCredits) * usage.currencyValueInCents
  );

  await vercel.marketplace.submitPrepaymentBalances({
    integrationConfigurationId: configId,
    requestBody: {
      timestamp: new Date().toISOString(),
      balances: [
        {
          credit: `${usage.remainingCredits.toLocaleString()} Credits`,
          nameLabel: 'Credits',
          currencyValueInCents: remainingValue
        }
      ]
    }
  });

  console.log(`✅ Remaining balance submitted:`);
  console.log(`   Initial: ${usage.initialCredits} credits`);
  console.log(`   Used: ${usage.usedCredits} credits`);
  console.log(`   Remaining: ${usage.remainingCredits} credits`);
  console.log(`   Value: $${(remainingValue / 100).toFixed(2)}`);
}

await submitRemainingBalance('iconfig_abc123', {
  initialCredits: 10000,
  usedCredits: 3500,
  remainingCredits: 6500,
  currencyValueInCents: 10000
});
```

### バッチ残高更新

```typescript
async function batchSubmitBalances(
  installations: Array<{
    configId: string;
    balances: Balance[];
  }>
) {
  console.log(`Submitting balances for ${installations.length} installations...`);

  const results = [];

  for (const installation of installations) {
    try {
      await vercel.marketplace.submitPrepaymentBalances({
        integrationConfigurationId: installation.configId,
        requestBody: {
          timestamp: new Date().toISOString(),
          balances: installation.balances
        }
      });

      results.push({
        configId: installation.configId,
        success: true
      });

      console.log(`✅ ${installation.configId}`);
    } catch (error) {
      results.push({
        configId: installation.configId,
        success: false,
        error: error.message
      });

      console.error(`❌ ${installation.configId}: ${error.message}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\n✅ Completed: ${successCount}/${installations.length}`);

  return results;
}

await batchSubmitBalances([
  {
    configId: 'iconfig_1',
    balances: [
      { credit: '5,000 Credits', nameLabel: 'Credits', currencyValueInCents: 5000 }
    ]
  },
  {
    configId: 'iconfig_2',
    balances: [
      { credit: '10,000 Credits', nameLabel: 'Credits', currencyValueInCents: 10000 }
    ]
  }
]);
```

### 残高アラートシステム

```typescript
async function checkAndSubmitWithAlert(
  configId: string,
  currentBalance: Balance,
  threshold: number
) {
  const remainingValue = currentBalance.currencyValueInCents;

  if (remainingValue < threshold) {
    console.warn(`⚠️ Low balance alert: $${(remainingValue / 100).toFixed(2)}`);
    console.warn(`   Threshold: $${(threshold / 100).toFixed(2)}`);
  }

  await vercel.marketplace.submitPrepaymentBalances({
    integrationConfigurationId: configId,
    requestBody: {
      timestamp: new Date().toISOString(),
      balances: [currentBalance]
    }
  });

  if (remainingValue < threshold) {
    console.log('📧 Consider sending low balance notification to customer');
  }
}

await checkAndSubmitWithAlert(
  'iconfig_abc123',
  {
    credit: '1,000 Credits',
    nameLabel: 'Credits',
    currencyValueInCents: 1000  // $10.00
  },
  2000  // $20.00 threshold
);
```

## 注意事項

- **提出頻度**: 少なくとも1日1回、理想的には1時間ごとに残高を提出してください
- **タイムスタンプ**: サーバータイムスタンプを使用することで、競合状態を回避できます
- **データ保持**: 各日/週/月の最新の使用データのみが保持されます
- **通貨価値**: `currencyValueInCents`は必須フィールドで、USD換算値をセント単位で指定します
- **リソースID**: 省略した場合、クレジットはインストール全体に紐付けられます
- **クレジット表示**: `credit`と`nameLabel`は顧客向けの表示に使用されます
- **レスポンス**: 成功時は201ステータスコードのみが返され、レスポンスボディは空です

## クレジット価値の計算

### 基本計算

```typescript
// 単位あたりの価格からセント単位に変換
const creditsPerDollar = 100;  // 100クレジット = $1.00
const totalCredits = 10000;
const currencyValueInCents = (totalCredits / creditsPerDollar) * 100;
// = 10000 cents = $100.00
```

### 従量課金からクレジット換算

```typescript
const usageUnits = 1000;       // 1000 API calls
const pricePerUnit = 0.01;     // $0.01 per call
const totalValue = usageUnits * pricePerUnit * 100;
// = 1000 cents = $10.00
```

## 関連リンク

- [Submit Invoice](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/submit-invoice.md)
- [Submit Billing Data](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/submit-billing-data.md)
- [Get Integration Resources](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resources.md)
