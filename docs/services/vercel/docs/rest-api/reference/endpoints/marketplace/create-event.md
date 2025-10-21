# イベントの作成

インテグレーションインストールのイベントを作成します。パートナーは、リソースやインストールの変更をVercelに通知するためにこのエンドポイントを使用します。

## エンドポイント

```
POST /v1/installations/{integrationConfigurationId}/events
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `integrationConfigurationId` | string | ✓ | インストール設定識別子 |

## リクエストボディ

```typescript
interface CreateEventRequest {
  event: InstallationUpdatedEvent | ResourceUpdatedEvent;
}

// インストール更新イベント
interface InstallationUpdatedEvent {
  type: "installation.updated";  // 必須
  billingPlanId?: string;         // インストールレベルのプランID
}

// リソース更新イベント
interface ResourceUpdatedEvent {
  type: "resource.updated";       // 必須
  resourceId: string;              // 必須: パートナー提供のリソースID
  productId?: string;              // パートナー提供のプロダクトスラッグまたはID
}
```

## レスポンス

### 成功 (201)

```
No Content
```

イベントが正常に作成されると、201ステータスコードが返されます（レスポンスボディなし）。

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストボディまたはクエリパラメータが無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限不足 |
| 404 | リソースが見つかりません |

## 使用例

### インストール更新イベントの作成

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.marketplace.createEvent({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    event: {
      type: 'installation.updated',
      billingPlanId: 'plan_pro_monthly'
    }
  }
});

console.log('✅ Installation updated event created');
```

### リソース更新イベントの作成

```typescript
await vercel.marketplace.createEvent({
  integrationConfigurationId: 'iconfig_abc123',
  requestBody: {
    event: {
      type: 'resource.updated',
      resourceId: 'resource_xyz789',
      productId: 'product_database'
    }
  }
});

console.log('✅ Resource updated event created');
```

### リソース名変更の通知

```typescript
async function notifyResourceRenamed(
  configId: string,
  resourceId: string,
  productId: string
) {
  await vercel.marketplace.createEvent({
    integrationConfigurationId: configId,
    requestBody: {
      event: {
        type: 'resource.updated',
        resourceId,
        productId
      }
    }
  });

  console.log(`✅ Notified Vercel of resource rename: ${resourceId}`);
}

await notifyResourceRenamed(
  'iconfig_abc123',
  'resource_xyz789',
  'product_database'
);
```

### リソースステータス変更の通知

```typescript
async function notifyResourceStatusChange(
  configId: string,
  resourceId: string,
  newStatus: 'suspended' | 'resumed' | 'error'
) {
  await vercel.marketplace.createEvent({
    integrationConfigurationId: configId,
    requestBody: {
      event: {
        type: 'resource.updated',
        resourceId
      }
    }
  });

  console.log(`✅ Notified Vercel of status change to: ${newStatus}`);
}

// リソースのサスペンド通知
await notifyResourceStatusChange('iconfig_abc123', 'resource_xyz789', 'suspended');
```

### 課金プラン変更の通知

```typescript
async function notifyBillingPlanChange(
  configId: string,
  newBillingPlanId: string
) {
  await vercel.marketplace.createEvent({
    integrationConfigurationId: configId,
    requestBody: {
      event: {
        type: 'installation.updated',
        billingPlanId: newBillingPlanId
      }
    }
  });

  console.log(`✅ Notified Vercel of billing plan change: ${newBillingPlanId}`);
}

await notifyBillingPlanChange('iconfig_abc123', 'plan_enterprise_yearly');
```

### 複数リソースの更新通知

```typescript
async function notifyMultipleResourceUpdates(
  configId: string,
  resourceIds: string[],
  productId: string
) {
  console.log(`Notifying updates for ${resourceIds.length} resources...`);

  for (const resourceId of resourceIds) {
    try {
      await vercel.marketplace.createEvent({
        integrationConfigurationId: configId,
        requestBody: {
          event: {
            type: 'resource.updated',
            resourceId,
            productId
          }
        }
      });

      console.log(`✅ Notified: ${resourceId}`);
    } catch (error) {
      console.error(`❌ Failed to notify ${resourceId}: ${error.message}`);
    }
  }

  console.log('Notification complete');
}

await notifyMultipleResourceUpdates(
  'iconfig_abc123',
  ['resource_1', 'resource_2', 'resource_3'],
  'product_database'
);
```

### エラーハンドリング付き通知

```typescript
async function notifyWithRetry(
  configId: string,
  event: any,
  maxRetries: number = 3
) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await vercel.marketplace.createEvent({
        integrationConfigurationId: configId,
        requestBody: { event }
      });

      console.log(`✅ Event created successfully (attempt ${attempt + 1})`);
      return true;
    } catch (error) {
      attempt++;

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

await notifyWithRetry('iconfig_abc123', {
  type: 'resource.updated',
  resourceId: 'resource_xyz789'
});
```

## イベントタイプの詳細

### installation.updated

インストールレベルの変更を通知します：
- 課金プランの変更
- インストール設定の更新
- インストールレベルの通知

### resource.updated

リソースレベルの変更を通知します：
- リソース名の変更
- リソースステータスの変更（suspend, resume, error）
- リソースメタデータの更新
- リソース設定の変更

## 動作の仕組み

1. **パートナーがイベントを送信**: パートナープラットフォームでリソースまたはインストールが変更されたとき
2. **Vercelが受信**: このエンドポイントがイベントを受信
3. **Vercelがデータ更新**: Vercelはパートナーの読み取りAPIを呼び出してデータストアを更新
4. **同期完了**: Vercel上の情報がパートナープラットフォームと同期される

## 使用シナリオ

### パートナー側での変更
- ユーザーがパートナーのダッシュボードでリソース名を変更
- パートナープラットフォームでリソースがサスペンドされる
- 課金プランがパートナー側でアップグレードされる
- リソースの設定が変更される

### Vercel外での操作
- ユーザーがVercelインターフェース外でインストールを変更
- パートナーAPIを直接使用してリソースを管理
- 自動化されたバックグラウンド処理によるリソース更新

## 注意事項

- イベントは非同期で処理されます
- Vercelはイベント受信後、パートナーのRead APIを呼び出します
- 頻繁な更新の場合、レート制限に注意してください
- イベント作成は冪等ではないため、重複送信は避けてください

## 関連リンク

- [Get Integration Resources](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resources.md)
- [Get Integration Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/get-integration-resource.md)
- [Import Resource](/docs/services/vercel/docs/rest-api/reference/endpoints/marketplace/import-resource.md)
