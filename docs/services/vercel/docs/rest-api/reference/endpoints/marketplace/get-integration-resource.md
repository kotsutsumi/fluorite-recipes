# インテグレーションリソースの取得

特定のインテグレーションリソースの詳細情報を取得します。

## エンドポイント

```
GET /v1/installations/{integrationConfigurationId}/resources/{resourceId}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | リソースが属するインテグレーション設定（インストール）のID |
| `resourceId` | string | ✓ | サードパーティプロバイダーが提供したリソースのID |

## レスポンス

### 成功 (200)

```typescript
interface Resource {
  id: string;                           // サードパーティプロバイダーのリソース識別子
  internalId: string;                   // Vercelが割り当てたリソース識別子
  name: string;                         // Vercelに記録されているリソース名
  status: ResourceStatus;               // リソースの現在の状態
  productId: string;                    // 派生プロダクトのID
  protocolSettings: object;             // プロダクトのプロトコルをサポートする設定
  notification?: {                      // ユーザー向け通知（オプション）
    level: 'info' | 'warn' | 'error';
    title: string;
    message: string;
    href?: string;
  };
  billingPlanId?: string;               // 関連する課金プランID
  metadata?: object;                    // プロダクトスキーマごとのカスタムメタデータ
}

type ResourceStatus =
  | 'ready'          // 使用可能
  | 'pending'        // 保留中
  | 'onboarding'     // オンボーディング中
  | 'suspended'      // サスペンド中
  | 'resumed'        // 再開
  | 'uninstalled'    // アンインストール済み
  | 'error';         // エラー状態
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | リソースが見つかりません |

## 使用例

### 基本的なリソース取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const resource = await vercel.marketplace.getIntegrationResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789'
});

console.log(`Resource: ${resource.name}`);
console.log(`  ID: ${resource.id}`);
console.log(`  Internal ID: ${resource.internalId}`);
console.log(`  Status: ${resource.status}`);
console.log(`  Product: ${resource.productId}`);
```

### リソース詳細情報の表示

```typescript
async function displayResourceInfo(configId: string, resourceId: string) {
  const resource = await vercel.marketplace.getIntegrationResource({
    integrationConfigurationId: configId,
    resourceId
  });

  console.log('\n📦 Resource Details:');
  console.log(`   Name: ${resource.name}`);
  console.log(`   Partner ID: ${resource.id}`);
  console.log(`   Vercel ID: ${resource.internalId}`);
  console.log(`   Status: ${resource.status}`);
  console.log(`   Product: ${resource.productId}`);

  if (resource.billingPlanId) {
    console.log(`   Billing Plan: ${resource.billingPlanId}`);
  }

  if (resource.notification) {
    const { level, title, message, href } = resource.notification;
    const emoji = { info: 'ℹ️', warn: '⚠️', error: '❌' }[level];

    console.log(`\n   ${emoji} Notification:`);
    console.log(`      Level: ${level}`);
    console.log(`      Title: ${title}`);
    console.log(`      Message: ${message}`);
    if (href) {
      console.log(`      Link: ${href}`);
    }
  }

  if (resource.protocolSettings) {
    console.log(`\n   Protocol Settings:`);
    console.log(`      ${JSON.stringify(resource.protocolSettings, null, 2)}`);
  }

  if (resource.metadata) {
    console.log(`\n   Metadata:`);
    console.log(`      ${JSON.stringify(resource.metadata, null, 2)}`);
  }

  return resource;
}

await displayResourceInfo('iconfig_abc123', 'resource_xyz789');
```

### リソースステータスの確認

```typescript
async function checkResourceStatus(
  configId: string,
  resourceId: string
): Promise<'healthy' | 'warning' | 'critical'> {
  const resource = await vercel.marketplace.getIntegrationResource({
    integrationConfigurationId: configId,
    resourceId
  });

  let health: 'healthy' | 'warning' | 'critical';

  if (resource.status === 'ready' && !resource.notification) {
    health = 'healthy';
    console.log(`✅ Resource ${resource.name} is healthy`);
  } else if (
    resource.status === 'pending' ||
    resource.status === 'onboarding' ||
    (resource.notification && resource.notification.level === 'warn')
  ) {
    health = 'warning';
    console.log(`⚠️ Resource ${resource.name} needs attention`);
  } else {
    health = 'critical';
    console.log(`❌ Resource ${resource.name} has critical issues`);
  }

  console.log(`   Status: ${resource.status}`);
  if (resource.notification) {
    console.log(`   Notification: ${resource.notification.title}`);
  }

  return health;
}

await checkResourceStatus('iconfig_abc123', 'resource_xyz789');
```

### リソースの存在確認

```typescript
async function resourceExists(
  configId: string,
  resourceId: string
): Promise<boolean> {
  try {
    await vercel.marketplace.getIntegrationResource({
      integrationConfigurationId: configId,
      resourceId
    });
    console.log(`✅ Resource exists: ${resourceId}`);
    return true;
  } catch (error) {
    if (error.statusCode === 404) {
      console.log(`❌ Resource not found: ${resourceId}`);
      return false;
    }
    throw error;
  }
}

const exists = await resourceExists('iconfig_abc123', 'resource_xyz789');
```

### リソース設定の検証

```typescript
async function validateResourceConfiguration(
  configId: string,
  resourceId: string
) {
  const resource = await vercel.marketplace.getIntegrationResource({
    integrationConfigurationId: configId,
    resourceId
  });

  const validation = {
    hasValidStatus: ['ready', 'pending', 'onboarding'].includes(resource.status),
    hasProduct: !!resource.productId,
    hasBillingPlan: !!resource.billingPlanId,
    hasProtocolSettings: !!resource.protocolSettings,
    hasNotifications: !!resource.notification,
    isHealthy: resource.status === 'ready' && !resource.notification
  };

  console.log('\n✓ Resource Configuration Validation:');
  console.log(`   Resource: ${resource.name}`);
  console.log(`   Valid status: ${validation.hasValidStatus ? '✅' : '❌'}`);
  console.log(`   Has product: ${validation.hasProduct ? '✅' : '❌'}`);
  console.log(`   Has billing plan: ${validation.hasBillingPlan ? '✅' : '⚠️ (optional)'}`);
  console.log(`   Has protocol settings: ${validation.hasProtocolSettings ? '✅' : '⚠️'}`);
  console.log(`   Has notifications: ${validation.hasNotifications ? '⚠️' : '✅'}`);
  console.log(`   Overall health: ${validation.isHealthy ? '✅' : '⚠️'}`);

  return validation;
}

await validateResourceConfiguration('iconfig_abc123', 'resource_xyz789');
```

### リソースメタデータの取得

```typescript
async function getResourceMetadata(configId: string, resourceId: string) {
  const resource = await vercel.marketplace.getIntegrationResource({
    integrationConfigurationId: configId,
    resourceId
  });

  if (!resource.metadata) {
    console.log(`ℹ️ No metadata available for ${resource.name}`);
    return null;
  }

  console.log(`\n📋 Metadata for ${resource.name}:`);
  Object.entries(resource.metadata).forEach(([key, value]) => {
    console.log(`   ${key}: ${JSON.stringify(value)}`);
  });

  return resource.metadata;
}

await getResourceMetadata('iconfig_abc123', 'resource_xyz789');
```

### リソース通知の処理

```typescript
async function handleResourceNotifications(configId: string, resourceId: string) {
  const resource = await vercel.marketplace.getIntegrationResource({
    integrationConfigurationId: configId,
    resourceId
  });

  if (!resource.notification) {
    console.log(`ℹ️ No notifications for ${resource.name}`);
    return null;
  }

  const { level, title, message, href } = resource.notification;

  switch (level) {
    case 'info':
      console.log(`\nℹ️ INFO: ${resource.name}`);
      break;
    case 'warn':
      console.log(`\n⚠️ WARNING: ${resource.name}`);
      break;
    case 'error':
      console.log(`\n❌ ERROR: ${resource.name}`);
      break;
  }

  console.log(`   ${title}`);
  console.log(`   ${message}`);

  if (href) {
    console.log(`   More info: ${href}`);
  }

  // レベルに応じたアクション
  if (level === 'error') {
    console.log('\n   ⚡ Action required: Investigate and resolve error');
  } else if (level === 'warn') {
    console.log('\n   📝 Action suggested: Review and address warning');
  }

  return resource.notification;
}

await handleResourceNotifications('iconfig_abc123', 'resource_xyz789');
```

### リソース課金情報の確認

```typescript
async function checkResourceBilling(configId: string, resourceId: string) {
  const resource = await vercel.marketplace.getIntegrationResource({
    integrationConfigurationId: configId,
    resourceId
  });

  console.log(`\n💰 Billing Information for ${resource.name}:`);

  if (resource.billingPlanId) {
    console.log(`   Billing Plan: ${resource.billingPlanId}`);
    console.log(`   Status: Active`);
  } else {
    console.log(`   Billing Plan: None (Free tier or not configured)`);
  }

  console.log(`   Resource Status: ${resource.status}`);

  // ステータスに基づく課金の影響
  if (resource.status === 'suspended') {
    console.log(`   ⚠️ Resource is suspended - may affect billing`);
  } else if (resource.status === 'uninstalled') {
    console.log(`   ℹ️ Resource is uninstalled - billing should be stopped`);
  }

  return {
    billingPlanId: resource.billingPlanId,
    status: resource.status
  };
}

await checkResourceBilling('iconfig_abc123', 'resource_xyz789');
```

### リソース変更の監視

```typescript
async function monitorResourceChanges(
  configId: string,
  resourceId: string,
  intervalSeconds: number = 60
) {
  console.log(`🔍 Monitoring resource ${resourceId}...`);

  let previousStatus: string | null = null;
  let previousNotification: any = null;

  const check = async () => {
    try {
      const resource = await vercel.marketplace.getIntegrationResource({
        integrationConfigurationId: configId,
        resourceId
      });

      // ステータス変更の検出
      if (previousStatus && previousStatus !== resource.status) {
        console.log(`\n📢 Status changed: ${previousStatus} → ${resource.status}`);
      }

      // 通知変更の検出
      const hasNotification = !!resource.notification;
      const hadNotification = !!previousNotification;

      if (!hadNotification && hasNotification) {
        console.log(`\n⚠️ New notification: ${resource.notification!.title}`);
      } else if (hadNotification && !hasNotification) {
        console.log(`\n✅ Notification cleared`);
      }

      previousStatus = resource.status;
      previousNotification = resource.notification;
    } catch (error) {
      console.error(`❌ Error monitoring resource: ${error.message}`);
    }
  };

  // 初回チェック
  await check();

  // 定期チェック（実際の使用では適切なタイマー管理が必要）
  console.log(`   Checking every ${intervalSeconds} seconds...`);
}

// 注意: 実際の使用では適切なタイマーとクリーンアップが必要
await monitorResourceChanges('iconfig_abc123', 'resource_xyz789', 60);
```

## 注意事項

- `id`フィールドはパートナーシステム内の識別子です
- `internalId`フィールドはVercelシステム内の識別子です
- リソースが見つからない場合、404エラーが返されます
- `notification`フィールドは、ユーザーに表示される重要な情報を含みます
- `protocolSettings`は、プロダクトがサポートするプロトコル固有の設定を含みます

## 関連リンク

- [Get Integration Resources](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resources.md)
- [Import Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/import-resource.md)
- [Create Event](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/create-event.md)
