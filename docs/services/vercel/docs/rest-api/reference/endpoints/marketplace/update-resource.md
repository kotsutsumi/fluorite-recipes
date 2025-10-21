# リソースの更新

既存のインテグレーションリソースの設定を部分的に更新します。

## エンドポイント

```
PATCH /v1/installations/{integrationConfigurationId}/resources/{resourceId}
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
| `resourceId` | string | ✓ | リソース識別子 |

## リクエストボディ（すべてオプション）

```typescript
interface UpdateResourceRequest {
  ownership?: 'owned' | 'linked' | 'sandbox';  // 所有権タイプ
  name?: string;                                // リソース名
  status?: ResourceStatus;                      // リソースステータス
  metadata?: object;                            // カスタムメタデータ
  billingPlan?: {                               // 課金プラン
    id: string;                                 // 必須（含める場合）
    type: 'subscription' | 'prepayment';        // 必須（含める場合）
    name: string;                               // 必須（含める場合）
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
  notification?: {                              // ユーザー向け通知
    level: 'info' | 'warn' | 'error';
    title: string;
    message?: string;
    href?: string;
  };
  extras?: object;                              // 追加設定
  secrets?: Array<{                             // シークレット設定
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
interface UpdateResourceResponse {
  name: string;  // 更新されたリソースの名前
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

### リソース名の更新

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.marketplace.updateResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    name: 'Production Database v2'
  }
});

console.log(`✅ Resource renamed to: ${result.name}`);
```

### ステータスの更新

```typescript
const result = await vercel.marketplace.updateResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    status: 'suspended'
  }
});

console.log(`Resource suspended: ${result.name}`);
```

### メタデータの更新

```typescript
const result = await vercel.marketplace.updateResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    metadata: {
      region: 'eu-west-1',
      size: 'xlarge',
      version: '15.2',
      lastMigration: new Date().toISOString(),
      tags: ['production', 'critical']
    }
  }
});

console.log(`✅ Metadata updated for: ${result.name}`);
```

### 課金プランの更新

```typescript
const result = await vercel.marketplace.updateResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    billingPlan: {
      id: 'plan_enterprise_yearly',
      type: 'subscription',
      name: 'Enterprise Plan',
      description: 'Enterprise-grade features and support',
      cost: {
        amount: 999,
        currency: 'USD',
        interval: 'yearly'
      },
      details: [
        { label: 'Storage', value: 'Unlimited' },
        { label: 'Connections', value: '10,000' },
        { label: 'Support', value: '24/7 Priority' }
      ]
    }
  }
});

console.log(`✅ Billing plan updated: ${result.name}`);
```

### 通知の追加

```typescript
const result = await vercel.marketplace.updateResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    notification: {
      level: 'warn',
      title: 'Maintenance Scheduled',
      message: 'Database maintenance scheduled for tonight at 2 AM UTC. Expected downtime: 1 hour.',
      href: 'https://status.example.com/maintenance'
    }
  }
});

console.log(`✅ Notification added to: ${result.name}`);
```

### 通知のクリア

```typescript
const result = await vercel.marketplace.updateResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    notification: null  // 通知をクリア
  }
});

console.log(`✅ Notification cleared for: ${result.name}`);
```

### 複数フィールドの同時更新

```typescript
const result = await vercel.marketplace.updateResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    name: 'Upgraded Database',
    status: 'ready',
    metadata: {
      upgraded: true,
      upgradedAt: new Date().toISOString()
    },
    notification: {
      level: 'info',
      title: 'Upgrade Complete',
      message: 'Database has been successfully upgraded to the latest version.'
    }
  }
});

console.log(`✅ Multiple fields updated: ${result.name}`);
```

### シークレットの更新

```typescript
const result = await vercel.marketplace.updateResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789',
  requestBody: {
    secrets: [
      {
        name: 'DATABASE_URL',
        value: 'postgresql://newuser:newpass@newhost:5432/newdb',
        prefix: 'DB_'
      },
      {
        name: 'API_KEY',
        value: 'sk_live_new_key',
        environmentOverrides: [
          {
            target: ['production'],
            value: 'sk_live_prod_key'
          },
          {
            target: ['preview', 'development'],
            value: 'sk_test_dev_key'
          }
        ]
      }
    ]
  }
});

console.log(`✅ Secrets updated for: ${result.name}`);
```

### エラーハンドリング付き更新

```typescript
async function updateResourceSafely(
  configId: string,
  resourceId: string,
  updates: any
) {
  try {
    const result = await vercel.marketplace.updateResource({
      integrationConfigurationId: configId,
      resourceId,
      requestBody: updates
    });

    console.log(`✅ Successfully updated: ${result.name}`);
    return { success: true, resource: result };
  } catch (error) {
    console.error(`❌ Update failed for ${resourceId}`);

    if (error.statusCode === 400) {
      console.error('   Invalid request body');
    } else if (error.statusCode === 404) {
      console.error('   Resource not found');
    } else if (error.statusCode === 409) {
      console.error('   Conflict - resource may be locked');
    } else if (error.statusCode === 422) {
      console.error('   Unprocessable entity - check data format');
    } else {
      console.error(`   Error: ${error.message}`);
    }

    return { success: false, error: error.message };
  }
}

await updateResourceSafely('iconfig_abc123', 'resource_xyz789', {
  name: 'Updated Name',
  status: 'ready'
});
```

### ステータス遷移の管理

```typescript
async function transitionResourceStatus(
  configId: string,
  resourceId: string,
  newStatus: string,
  notificationMessage?: string
) {
  const updates: any = {
    status: newStatus
  };

  // ステータスに応じた通知を追加
  if (newStatus === 'suspended') {
    updates.notification = {
      level: 'warn',
      title: 'Resource Suspended',
      message: notificationMessage || 'This resource has been temporarily suspended.'
    };
  } else if (newStatus === 'error') {
    updates.notification = {
      level: 'error',
      title: 'Resource Error',
      message: notificationMessage || 'An error occurred with this resource.'
    };
  } else if (newStatus === 'ready') {
    updates.notification = null;  // 正常状態では通知をクリア
  }

  const result = await vercel.marketplace.updateResource({
    integrationConfigurationId: configId,
    resourceId,
    requestBody: updates
  });

  console.log(`✅ Status transitioned to ${newStatus}: ${result.name}`);

  return result;
}

// サスペンド
await transitionResourceStatus(
  'iconfig_abc123',
  'resource_xyz789',
  'suspended',
  'Payment overdue. Please update billing information.'
);
```

### バッチ更新処理

```typescript
async function batchUpdateResources(
  configId: string,
  updates: Array<{ resourceId: string; changes: any }>
) {
  console.log(`Updating ${updates.length} resources...`);

  const results = [];

  for (const { resourceId, changes } of updates) {
    try {
      const result = await vercel.marketplace.updateResource({
        integrationConfigurationId: configId,
        resourceId,
        requestBody: changes
      });

      results.push({ resourceId, success: true, name: result.name });
      console.log(`✅ Updated: ${result.name}`);
    } catch (error) {
      results.push({ resourceId, success: false, error: error.message });
      console.error(`❌ Failed: ${resourceId}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${successCount}/${updates.length} updated`);

  return results;
}

await batchUpdateResources('iconfig_abc123', [
  {
    resourceId: 'res_1',
    changes: { status: 'ready' }
  },
  {
    resourceId: 'res_2',
    changes: { name: 'Updated Name' }
  },
  {
    resourceId: 'res_3',
    changes: { metadata: { updated: true } }
  }
]);
```

### 段階的アップグレード

```typescript
async function upgradeResourceGradually(
  configId: string,
  resourceId: string
) {
  console.log('Starting gradual upgrade...');

  // ステップ 1: オンボーディング状態に設定
  await vercel.marketplace.updateResource({
    integrationConfigurationId: configId,
    resourceId,
    requestBody: {
      status: 'onboarding',
      notification: {
        level: 'info',
        title: 'Upgrade Starting',
        message: 'Resource upgrade is beginning...'
      }
    }
  });
  console.log('✓ Step 1: Onboarding started');

  // ステップ 2: メタデータを更新
  await new Promise(resolve => setTimeout(resolve, 1000));
  await vercel.marketplace.updateResource({
    integrationConfigurationId: configId,
    resourceId,
    requestBody: {
      metadata: {
        upgrading: true,
        upgradeStarted: new Date().toISOString()
      }
    }
  });
  console.log('✓ Step 2: Metadata updated');

  // ステップ 3: 準備完了状態に設定
  await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await vercel.marketplace.updateResource({
    integrationConfigurationId: configId,
    resourceId,
    requestBody: {
      status: 'ready',
      notification: {
        level: 'info',
        title: 'Upgrade Complete',
        message: 'Resource has been successfully upgraded!'
      },
      metadata: {
        upgrading: false,
        upgradeCompleted: new Date().toISOString()
      }
    }
  });

  console.log(`✅ Upgrade complete: ${result.name}`);
}

await upgradeResourceGradually('iconfig_abc123', 'resource_xyz789');
```

## 注意事項

- このエンドポイントは部分更新（PATCH）を実行します
- 指定されたフィールドのみが更新されます
- `billingPlan`を含める場合、`id`、`type`、`name`は必須です
- `notification`を`null`に設定すると通知がクリアされます
- ステータス遷移によっては、追加の検証が必要な場合があります

## 関連リンク

- [Get Integration Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resource.md)
- [Import Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/import-resource.md)
- [Delete Integration Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/delete-integration-resource.md)
