# インテグレーションリソースの一覧取得

インストールに関連付けられたすべてのリソースを取得します。

## エンドポイント

```
GET /v1/installations/{integrationConfigurationId}/resources
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

## レスポンス

### 成功 (200)

```typescript
interface Resource {
  partnerId: string;                    // パートナーが提供したリソースのID
  internalId: string;                   // Vercelが割り当てたリソース識別子
  name: string;                         // Vercel内のリソース名
  status: ResourceStatus;               // リソースステータス
  productId: string;                    // 関連プロダクトID
  protocolSettings?: object;            // プロトコル固有の設定
  notification?: {                      // ユーザー向け通知（オプション）
    level: 'info' | 'warn' | 'error';
    title: string;
    message: string;
    href?: string;
  };
  billingPlanId?: string;               // サブスクリプションプランID
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

interface Response {
  resources: Resource[];
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | リソースが見つかりません |

## 使用例

### 基本的なリソース一覧取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const result = await vercel.marketplace.getIntegrationResources({
  integrationConfigurationId: 'iconfig_abc123'
});

console.log(`Total resources: ${result.resources.length}`);

result.resources.forEach(resource => {
  console.log(`\n${resource.name}`);
  console.log(`  Partner ID: ${resource.partnerId}`);
  console.log(`  Status: ${resource.status}`);
  console.log(`  Product: ${resource.productId}`);
});
```

### ステータス別のリソースフィルタリング

```typescript
async function getResourcesByStatus(
  configId: string,
  status: string
) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const filtered = result.resources.filter(r => r.status === status);

  console.log(`Resources with status '${status}': ${filtered.length}`);

  filtered.forEach(resource => {
    console.log(`\n${resource.name} (${resource.partnerId})`);
  });

  return filtered;
}

// 使用可能なリソースを取得
const readyResources = await getResourcesByStatus('iconfig_abc123', 'ready');
```

### リソース詳細情報の表示

```typescript
async function displayResourceDetails(configId: string) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  console.log(`\n📦 Resources for installation: ${configId}`);
  console.log(`Total: ${result.resources.length}\n`);

  result.resources.forEach(resource => {
    console.log(`📌 ${resource.name}`);
    console.log(`   Partner ID: ${resource.partnerId}`);
    console.log(`   Internal ID: ${resource.internalId}`);
    console.log(`   Status: ${resource.status}`);
    console.log(`   Product: ${resource.productId}`);

    if (resource.billingPlanId) {
      console.log(`   Billing Plan: ${resource.billingPlanId}`);
    }

    if (resource.notification) {
      const { level, title, message } = resource.notification;
      console.log(`   ⚠️ Notification (${level}): ${title} - ${message}`);
    }

    if (resource.protocolSettings) {
      console.log(`   Protocol Settings: ${JSON.stringify(resource.protocolSettings)}`);
    }

    console.log('');
  });

  return result.resources;
}

await displayResourceDetails('iconfig_abc123');
```

### プロダクト別のリソース集計

```typescript
async function groupResourcesByProduct(configId: string) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const byProduct = result.resources.reduce((acc, resource) => {
    if (!acc[resource.productId]) {
      acc[resource.productId] = [];
    }
    acc[resource.productId].push(resource);
    return acc;
  }, {} as Record<string, typeof result.resources>);

  console.log('Resources by Product:');
  Object.entries(byProduct).forEach(([productId, resources]) => {
    console.log(`\n${productId}: ${resources.length} resources`);
    resources.forEach(r => {
      console.log(`  - ${r.name} (${r.status})`);
    });
  });

  return byProduct;
}

await groupResourcesByProduct('iconfig_abc123');
```

### 通知のあるリソースの確認

```typescript
async function checkResourceNotifications(configId: string) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const withNotifications = result.resources.filter(r => r.notification);

  console.log(`Resources with notifications: ${withNotifications.length}`);

  withNotifications.forEach(resource => {
    const { level, title, message, href } = resource.notification!;

    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌'
    }[level];

    console.log(`\n${emoji} ${resource.name}:`);
    console.log(`   ${title}`);
    console.log(`   ${message}`);
    if (href) {
      console.log(`   Link: ${href}`);
    }
  });

  return withNotifications;
}

await checkResourceNotifications('iconfig_abc123');
```

### リソースステータスの統計

```typescript
async function getResourceStatistics(configId: string) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const stats = {
    total: result.resources.length,
    byStatus: {} as Record<string, number>,
    byProduct: {} as Record<string, number>,
    withBilling: 0,
    withNotifications: 0
  };

  result.resources.forEach(resource => {
    // ステータス別
    stats.byStatus[resource.status] = (stats.byStatus[resource.status] || 0) + 1;

    // プロダクト別
    stats.byProduct[resource.productId] = (stats.byProduct[resource.productId] || 0) + 1;

    // 課金プランあり
    if (resource.billingPlanId) {
      stats.withBilling++;
    }

    // 通知あり
    if (resource.notification) {
      stats.withNotifications++;
    }
  });

  console.log('Resource Statistics:');
  console.log(`  Total: ${stats.total}`);
  console.log(`  With billing: ${stats.withBilling}`);
  console.log(`  With notifications: ${stats.withNotifications}`);

  console.log('\n  By status:');
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`    ${status}: ${count}`);
  });

  console.log('\n  By product:');
  Object.entries(stats.byProduct).forEach(([product, count]) => {
    console.log(`    ${product}: ${count}`);
  });

  return stats;
}

await getResourceStatistics('iconfig_abc123');
```

### 問題のあるリソースの検出

```typescript
async function findProblematicResources(configId: string) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const problematic = {
    suspended: [] as string[],
    error: [] as string[],
    errorNotifications: [] as string[]
  };

  result.resources.forEach(resource => {
    if (resource.status === 'suspended') {
      problematic.suspended.push(resource.name);
    }

    if (resource.status === 'error') {
      problematic.error.push(resource.name);
    }

    if (resource.notification && resource.notification.level === 'error') {
      problematic.errorNotifications.push(resource.name);
    }
  });

  console.log('⚠️ Problematic Resources:');
  console.log(`  Suspended: ${problematic.suspended.length}`);
  console.log(`  Error status: ${problematic.error.length}`);
  console.log(`  Error notifications: ${problematic.errorNotifications.length}`);

  if (problematic.suspended.length > 0) {
    console.log('\n  Suspended resources:');
    problematic.suspended.forEach(name => console.log(`    - ${name}`));
  }

  if (problematic.error.length > 0) {
    console.log('\n  Error status resources:');
    problematic.error.forEach(name => console.log(`    - ${name}`));
  }

  return problematic;
}

await findProblematicResources('iconfig_abc123');
```

### リソース健全性チェック

```typescript
async function checkResourceHealth(configId: string) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const health = {
    healthy: 0,
    warning: 0,
    critical: 0
  };

  result.resources.forEach(resource => {
    if (resource.status === 'ready' && !resource.notification) {
      health.healthy++;
    } else if (
      resource.status === 'pending' ||
      resource.status === 'onboarding' ||
      (resource.notification && resource.notification.level === 'warn')
    ) {
      health.warning++;
    } else if (
      resource.status === 'suspended' ||
      resource.status === 'error' ||
      (resource.notification && resource.notification.level === 'error')
    ) {
      health.critical++;
    }
  });

  const healthPercentage = (health.healthy / result.resources.length) * 100;

  console.log('\n🏥 Resource Health Check:');
  console.log(`  ✅ Healthy: ${health.healthy}`);
  console.log(`  ⚠️ Warning: ${health.warning}`);
  console.log(`  ❌ Critical: ${health.critical}`);
  console.log(`  Overall health: ${healthPercentage.toFixed(1)}%`);

  return health;
}

await checkResourceHealth('iconfig_abc123');
```

## リソースステータスの意味

| ステータス | 説明 | アクション |
|----------|------|-----------|
| `ready` | リソースは正常に動作しています | なし |
| `pending` | リソースの作成または設定が進行中 | 待機 |
| `onboarding` | ユーザーがオンボーディング中 | ユーザーアクションを待つ |
| `suspended` | リソースが一時停止されています | 管理者に連絡 |
| `resumed` | サスペンドから再開されました | なし |
| `uninstalled` | リソースがアンインストールされました | 再インストールまたは削除 |
| `error` | エラー状態です | 調査と修正が必要 |

## 注意事項

- すべてのリソースには`partnerId`と`internalId`の両方が含まれます
- `partnerId`はパートナーシステム内の識別子です
- `internalId`はVercelシステム内の識別子です
- `notification`フィールドはユーザーに表示される通知を含みます
- `protocolSettings`はプロトコル固有の設定（実験設定など）を含みます

## 関連リンク

- [Get Integration Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resource.md)
- [Import Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/import-resource.md)
- [Create Event](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/create-event.md)
