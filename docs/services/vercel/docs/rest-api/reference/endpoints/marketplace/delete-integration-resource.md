# インテグレーションリソースの削除

インストールに関連付けられたリソースを削除します。

## エンドポイント

```
DELETE /v1/installations/{integrationConfigurationId}/resources/{resourceId}
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

## レスポンス

### 成功 (204)

```
No Content
```

削除が成功すると、204ステータスコードが返されます（レスポンスボディなし）。

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | リソースが見つかりません |

## 使用例

### 基本的なリソース削除

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.marketplace.deleteIntegrationResource({
  integrationConfigurationId: 'iconfig_abc123',
  resourceId: 'resource_xyz789'
});

console.log('✅ Resource deleted successfully');
```

### 安全な削除（確認付き）

```typescript
async function deleteResourceSafely(configId: string, resourceId: string) {
  try {
    // 1. 削除前にリソース情報を取得
    const resource = await vercel.marketplace.getIntegrationResource({
      integrationConfigurationId: configId,
      resourceId
    });

    console.log('⚠️ About to delete resource:');
    console.log(`   Name: ${resource.name}`);
    console.log(`   Product: ${resource.productId}`);
    console.log(`   Status: ${resource.status}`);

    // 2. 削除実行
    await vercel.marketplace.deleteIntegrationResource({
      integrationConfigurationId: configId,
      resourceId
    });

    console.log('\n✅ Resource deleted successfully');

    return { deleted: true, resource };
  } catch (error) {
    console.error(`❌ Failed to delete resource: ${error.message}`);
    throw error;
  }
}

await deleteResourceSafely('iconfig_abc123', 'resource_xyz789');
```

### 複数リソースの削除

```typescript
async function deleteMultipleResources(
  configId: string,
  resourceIds: string[]
) {
  console.log(`Deleting ${resourceIds.length} resources...`);

  const results = [];

  for (const resourceId of resourceIds) {
    try {
      await vercel.marketplace.deleteIntegrationResource({
        integrationConfigurationId: configId,
        resourceId
      });

      results.push({ resourceId, success: true });
      console.log(`✅ Deleted: ${resourceId}`);
    } catch (error) {
      results.push({ resourceId, success: false, error: error.message });
      console.error(`❌ Failed: ${resourceId} - ${error.message}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${successCount}/${resourceIds.length} deleted`);

  return results;
}

await deleteMultipleResources('iconfig_abc123', [
  'resource_1',
  'resource_2',
  'resource_3'
]);
```

### ステータス別リソースの削除

```typescript
async function deleteResourcesByStatus(
  configId: string,
  statusToDelete: string
) {
  // 1. すべてのリソースを取得
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  // 2. 指定されたステータスのリソースをフィルタ
  const toDelete = result.resources.filter(r => r.status === statusToDelete);

  console.log(`Found ${toDelete.length} resources with status '${statusToDelete}'`);

  // 3. 各リソースを削除
  for (const resource of toDelete) {
    try {
      await vercel.marketplace.deleteIntegrationResource({
        integrationConfigurationId: configId,
        resourceId: resource.partnerId
      });

      console.log(`✅ Deleted: ${resource.name}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${resource.name}`);
    }
  }
}

// エラー状態のリソースを削除
await deleteResourcesByStatus('iconfig_abc123', 'error');
```

### アンインストール済みリソースのクリーンアップ

```typescript
async function cleanupUninstalledResources(configId: string) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const uninstalled = result.resources.filter(
    r => r.status === 'uninstalled'
  );

  console.log(`Cleaning up ${uninstalled.length} uninstalled resources...`);

  for (const resource of uninstalled) {
    try {
      await vercel.marketplace.deleteIntegrationResource({
        integrationConfigurationId: configId,
        resourceId: resource.partnerId
      });

      console.log(`✅ Cleaned up: ${resource.name}`);
    } catch (error) {
      console.error(`❌ Failed to clean up ${resource.name}`);
    }
  }
}

await cleanupUninstalledResources('iconfig_abc123');
```

### エラーハンドリング付き削除

```typescript
async function deleteResourceWithRetry(
  configId: string,
  resourceId: string,
  maxRetries: number = 3
) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await vercel.marketplace.deleteIntegrationResource({
        integrationConfigurationId: configId,
        resourceId
      });

      console.log(`✅ Resource deleted successfully (attempt ${attempt + 1})`);
      return true;
    } catch (error) {
      attempt++;

      if (error.statusCode === 404) {
        console.log(`ℹ️ Resource already deleted or not found`);
        return true;
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

await deleteResourceWithRetry('iconfig_abc123', 'resource_xyz789');
```

### 削除前の依存関係チェック

```typescript
async function deleteResourceWithDependencyCheck(
  configId: string,
  resourceId: string
) {
  // 1. リソース情報を取得
  const resource = await vercel.marketplace.getIntegrationResource({
    integrationConfigurationId: configId,
    resourceId
  });

  // 2. 依存関係をチェック
  const warnings = [];

  if (resource.status === 'ready') {
    warnings.push('Resource is currently active');
  }

  if (resource.billingPlanId) {
    warnings.push('Resource has active billing plan');
  }

  if (resource.notification) {
    warnings.push(`Resource has notification: ${resource.notification.title}`);
  }

  // 3. 警告を表示
  if (warnings.length > 0) {
    console.log('⚠️ Warnings before deletion:');
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }

  // 4. 削除実行
  await vercel.marketplace.deleteIntegrationResource({
    integrationConfigurationId: configId,
    resourceId
  });

  console.log(`✅ Resource deleted: ${resource.name}`);
}

await deleteResourceWithDependencyCheck('iconfig_abc123', 'resource_xyz789');
```

### プロダクト別リソースの削除

```typescript
async function deleteResourcesByProduct(
  configId: string,
  productId: string
) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const productResources = result.resources.filter(
    r => r.productId === productId
  );

  console.log(`Deleting ${productResources.length} resources for product ${productId}...`);

  for (const resource of productResources) {
    try {
      await vercel.marketplace.deleteIntegrationResource({
        integrationConfigurationId: configId,
        resourceId: resource.partnerId
      });

      console.log(`✅ Deleted: ${resource.name}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${resource.name}`);
    }
  }
}

await deleteResourcesByProduct('iconfig_abc123', 'product_database');
```

### バッチ削除処理

```typescript
async function batchDeleteResources(
  configId: string,
  batchSize: number = 5
) {
  const result = await vercel.marketplace.getIntegrationResources({
    integrationConfigurationId: configId
  });

  const resources = result.resources;
  const batches = [];

  // バッチに分割
  for (let i = 0; i < resources.length; i += batchSize) {
    batches.push(resources.slice(i, i + batchSize));
  }

  console.log(`Processing ${batches.length} batches...`);

  let totalDeleted = 0;

  for (let i = 0; i < batches.length; i++) {
    console.log(`\nBatch ${i + 1}/${batches.length}:`);

    const deletePromises = batches[i].map(resource =>
      vercel.marketplace.deleteIntegrationResource({
        integrationConfigurationId: configId,
        resourceId: resource.partnerId
      })
        .then(() => {
          console.log(`✅ ${resource.name}`);
          return true;
        })
        .catch(error => {
          console.error(`❌ ${resource.name}`);
          return false;
        })
    );

    const results = await Promise.all(deletePromises);
    totalDeleted += results.filter(Boolean).length;
  }

  console.log(`\n✅ Total deleted: ${totalDeleted}/${resources.length}`);
}

await batchDeleteResources('iconfig_abc123', 5);
```

## 注意事項

- **元に戻せません**: リソースの削除は永久的で、取り消すことができません
- **即座に有効**: 削除後、リソースは即座に利用できなくなります
- **依存関係**: 削除前に、リソースに依存する他のサービスや設定を確認してください
- **課金**: アクティブな課金プランがある場合は、削除前に確認してください
- **404エラー**: リソースが既に削除されている場合、404エラーが返されます

## 削除前のチェックリスト

1. ✅ リソースIDが正しいことを確認
2. ✅ リソースが使用されていないことを確認
3. ✅ アクティブな課金プランがないか確認
4. ✅ 依存する統合やサービスに影響がないか確認
5. ✅ 必要に応じてリソース情報をバックアップ

## 関連リンク

- [Get Integration Resources](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resources.md)
- [Get Integration Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resource.md)
- [Update Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/update-resource.md)
