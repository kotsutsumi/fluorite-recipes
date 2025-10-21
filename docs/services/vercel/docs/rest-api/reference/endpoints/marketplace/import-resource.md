# リソースのインポート

Vercelのインストールにリソースをインポート（アップサート）します。パートナー側で独立して作成されたリソースをVercelと同期する必要がある場合に使用します。

## エンドポイント

```
PUT /v1/installations/{integrationConfigurationId}/resources/{resourceId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インテグレーション設定ID |
| `resourceId` | string | ✓ | リソース識別子 |

## リクエストボディ

```typescript
interface ImportResourceRequest {
  // 必須フィールド
  productId: string;                    // プロダクトID
  name: string;                         // リソース名
  status: ResourceStatus;               // リソースステータス

  // オプションフィールド
  ownership?: 'owned' | 'linked' | 'sandbox';  // 所有権タイプ
  metadata?: object;                    // カスタムメタデータ
  billingPlan?: {                       // 課金プラン
    id: string;
    type: 'subscription' | 'prepayment';
    name: string;
    description?: string;
    cost?: {
      amount: number;
      currency: string;
      interval?: 'monthly' | 'yearly';
    };
    details?: Array<{
      label: string;
      value: string;
    }>;
  };
  notification?: {                      // ユーザー向け通知
    level: 'info' | 'warn' | 'error';
    title: string;
    message: string;
    href?: string;
  };
  extras?: object;                      // 追加設定
  secrets?: Array<{                     // シークレット設定
    name: string;
    value: string;
    prefix?: string;
    environmentOverrides?: Array<{
      target: string[];
      value: string;
    }>;
  }>;
}

type ResourceStatus =
  | 'ready'
  | 'pending'
  | 'onboarding'
  | 'suspended'
  | 'resumed'
  | 'uninstalled'
  | 'error';
```

## レスポンス

### 成功 (200)

```typescript
interface ImportResourceResponse {
  name: string;  // インポートされたリソースの名前
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストボディまたはクエリパラメータが無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | リソースが見つかりません |
| 409 | 競合 |
| 422 | 処理不可能なエンティティ |

## 使用例

### 基本的なリソースのインポート

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.marketplace.importResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    productId: 'product_database',
    name: 'Production Database',
    status: 'ready'
  }
});

console.log(`✅ Resource imported: ${result.name}`);
```

### 所有権タイプ付きインポート

```typescript
const result = await vercel.marketplace.importResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    productId: 'product_database',
    name: 'Staging Database',
    status: 'ready',
    ownership: 'owned'  // このリソースは所有されている
  }
});

console.log(`Imported ${result.name} as owned resource`);
```

### メタデータ付きインポート

```typescript
const result = await vercel.marketplace.importResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    productId: 'product_database',
    name: 'Customer DB',
    status: 'ready',
    metadata: {
      region: 'us-east-1',
      size: 'large',
      version: '14.5',
      connections: 100,
      tags: ['production', 'primary']
    }
  }
});

console.log('Resource imported with metadata');
```

### 課金プラン付きインポート

```typescript
const result = await vercel.marketplace.importResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    productId: 'product_database',
    name: 'Premium Database',
    status: 'ready',
    billingPlan: {
      id: 'plan_premium_monthly',
      type: 'subscription',
      name: 'Premium Plan',
      description: 'High-performance database with advanced features',
      cost: {
        amount: 99,
        currency: 'USD',
        interval: 'monthly'
      },
      details: [
        { label: 'Storage', value: '500 GB' },
        { label: 'Connections', value: '1000' },
        { label: 'Backups', value: 'Daily' }
      ]
    }
  }
});

console.log(`Imported with billing plan: ${result.name}`);
```

### 通知付きインポート

```typescript
const result = await vercel.marketplace.importResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    productId: 'product_database',
    name: 'Migration Database',
    status: 'onboarding',
    notification: {
      level: 'warn',
      title: 'Migration in Progress',
      message: 'Database is being migrated to a new region. Downtime expected: 2 hours.',
      href: 'https://status.example.com/migration'
    }
  }
});

console.log('Resource imported with notification');
```

### シークレット付きインポート

```typescript
const result = await vercel.marketplace.importResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    productId: 'product_database',
    name: 'Secure Database',
    status: 'ready',
    secrets: [
      {
        name: 'DATABASE_URL',
        value: 'postgresql://user:pass@host:5432/dbname',
        prefix: 'DB_'
      },
      {
        name: 'API_KEY',
        value: 'sk_live_abc123',
        environmentOverrides: [
          {
            target: ['production'],
            value: 'sk_live_production_key'
          },
          {
            target: ['preview', 'development'],
            value: 'sk_test_development_key'
          }
        ]
      }
    ]
  }
});

console.log('Resource imported with secrets');
```

### 複数リソースの一括インポート

```typescript
async function importMultipleResources(
  configId: string,
  resources: Array<{ id: string; name: string; productId: string }>
) {
  console.log(`Importing ${resources.length} resources...`);

  const results = [];

  for (const resource of resources) {
    try {
      const result = await vercel.marketplace.importResource({
        integrationConfigurationId: configId,
        resourceId: resource.id,
        requestBody: {
          productId: resource.productId,
          name: resource.name,
          status: 'ready'
        }
      });

      results.push({ id: resource.id, success: true, name: result.name });
      console.log(`✅ Imported: ${result.name}`);
    } catch (error) {
      results.push({ id: resource.id, success: false, error: error.message });
      console.error(`❌ Failed: ${resource.id} - ${error.message}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${successCount}/${resources.length} imported`);

  return results;
}

await importMultipleResources('iconfig_abc123', [
  { id: 'res_1', name: 'Database 1', productId: 'product_db' },
  { id: 'res_2', name: 'Database 2', productId: 'product_db' },
  { id: 'res_3', name: 'Cache 1', productId: 'product_cache' }
]);
```

### エラーハンドリング付きインポート

```typescript
async function importResourceSafely(
  configId: string,
  resourceId: string,
  resourceData: any
) {
  try {
    const result = await vercel.marketplace.importResource({
      integrationConfigurationId: configId,
      resourceId,
      requestBody: resourceData
    });

    console.log(`✅ Successfully imported: ${result.name}`);
    return { success: true, resource: result };
  } catch (error) {
    console.error(`❌ Import failed for ${resourceId}`);

    if (error.statusCode === 400) {
      console.error('   Invalid request body');
    } else if (error.statusCode === 404) {
      console.error('   Configuration or resource not found');
    } else if (error.statusCode === 409) {
      console.error('   Conflict - resource may already exist');
    } else if (error.statusCode === 422) {
      console.error('   Unprocessable entity - check data format');
    } else {
      console.error(`   Error: ${error.message}`);
    }

    return { success: false, error: error.message };
  }
}

await importResourceSafely('iconfig_abc123', 'resource_xyz789', {
  productId: 'product_database',
  name: 'Test Database',
  status: 'ready'
});
```

### パートナー側からの同期

```typescript
async function syncPartnerResources(
  configId: string,
  partnerResources: any[]
) {
  console.log(`Syncing ${partnerResources.length} resources from partner...`);

  for (const partnerResource of partnerResources) {
    try {
      // パートナーリソースをVercel形式に変換
      const vercelResource = {
        productId: partnerResource.product_id,
        name: partnerResource.display_name,
        status: mapPartnerStatusToVercel(partnerResource.state),
        metadata: {
          partnerId: partnerResource.id,
          region: partnerResource.region,
          created: partnerResource.created_at
        }
      };

      const result = await vercel.marketplace.importResource({
        integrationConfigurationId: configId,
        resourceId: partnerResource.id,
        requestBody: vercelResource
      });

      console.log(`✅ Synced: ${result.name}`);
    } catch (error) {
      console.error(`❌ Failed to sync ${partnerResource.id}`);
    }
  }
}

function mapPartnerStatusToVercel(partnerStatus: string): string {
  const statusMap: Record<string, string> = {
    'active': 'ready',
    'creating': 'pending',
    'setup': 'onboarding',
    'paused': 'suspended',
    'failed': 'error',
    'deleted': 'uninstalled'
  };

  return statusMap[partnerStatus] || 'pending';
}

// パートナーAPIからリソースを取得して同期
// const partnerResources = await fetchFromPartnerAPI();
// await syncPartnerResources('iconfig_abc123', partnerResources);
```

### リソース更新（アップサート）

```typescript
async function upsertResource(
  configId: string,
  resourceId: string,
  resourceData: any
) {
  // 既存リソースを確認
  let exists = false;
  try {
    await vercel.marketplace.getIntegrationResource({
      integrationConfigurationId: configId,
      resourceId
    });
    exists = true;
    console.log(`ℹ️ Resource exists, updating...`);
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`ℹ️ Resource not found, creating...`);
    } else {
      throw error;
    }
  }

  // インポート（作成または更新）
  const result = await vercel.marketplace.importResource({
    integrationConfigurationId: configId,
    resourceId,
    requestBody: resourceData
  });

  console.log(`✅ ${exists ? 'Updated' : 'Created'}: ${result.name}`);

  return result;
}

await upsertResource('iconfig_abc123', 'resource_xyz789', {
  productId: 'product_database',
  name: 'Updated Database Name',
  status: 'ready'
});
```

## 所有権タイプ

| タイプ | 説明 | 使用例 |
|-------|------|--------|
| `owned` | リソースは完全に所有されている | メインのプロダクションリソース |
| `linked` | リソースは他から参照されている | 共有リソース、外部サービス |
| `sandbox` | テスト/開発環境のリソース | サンドボックス、開発環境 |

## 注意事項

- このエンドポイントはアップサート（作成または更新）操作を実行します
- リソースがパートナー側で独立して作成された場合に使用します
- `resourceId`はパートナーシステム内の識別子である必要があります
- シークレットは環境オーバーライドをサポートします
- 課金プランは、サブスクリプションまたはプリペイメントタイプをサポートします

## 関連リンク

- [Get Integration Resources](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resources.md)
- [Get Integration Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resource.md)
- [Create Event](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/create-event.md)
