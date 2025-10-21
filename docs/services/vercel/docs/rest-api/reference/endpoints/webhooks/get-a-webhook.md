# Webhookの取得

特定のWebhookの詳細情報を取得します。

## エンドポイント

```
GET /v1/webhooks/{id}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `id` | string | ✓ | Webhook識別子（例: `account_hook_GflD6EYyo7F4ViYS`） |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |
| `slug` | string | リクエスト用のチームURLスラッグ（例: `my-team-url-slug`） |

## レスポンス

### 成功 (200)

```typescript
interface Webhook {
  id: string;            // Webhook識別子
  url: string;           // Webhook URL
  events: string[];      // サブスクライブされたイベントタイプ（例: "deployment.created"）
  ownerId: string;       // Webhookが属するチームのID
  createdAt: number;     // 作成タイムスタンプ（ミリ秒）
  updatedAt: number;     // 最終更新タイムスタンプ（ミリ秒）
  projectIds: string[];  // 関連付けられたプロジェクトID
}
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |

## 使用例

### 基本的なWebhook取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const webhook = await vercel.webhooks.getWebhook({
  id: 'account_hook_GflD6EYyo7F4ViYS',
  teamId: 'team_abc123'
});

console.log(`Webhook: ${webhook.id}`);
console.log(`  URL: ${webhook.url}`);
console.log(`  Events: ${webhook.events.join(', ')}`);
console.log(`  Projects: ${webhook.projectIds.length}`);
console.log(`  Created: ${new Date(webhook.createdAt).toLocaleDateString()}`);
```

### Webhook詳細情報の表示

```typescript
async function displayWebhookDetails(webhookId: string, teamId: string) {
  const webhook = await vercel.webhooks.getWebhook({
    id: webhookId,
    teamId
  });

  console.log('\n📡 Webhook Details:');
  console.log(`   ID: ${webhook.id}`);
  console.log(`   URL: ${webhook.url}`);
  console.log(`   Owner Team: ${webhook.ownerId}`);
  console.log(`   Created: ${new Date(webhook.createdAt).toLocaleString()}`);
  console.log(`   Last Updated: ${new Date(webhook.updatedAt).toLocaleString()}`);

  console.log('\n   Subscribed Events:');
  webhook.events.forEach(event => {
    console.log(`   - ${event}`);
  });

  if (webhook.projectIds.length > 0) {
    console.log(`\n   Associated Projects (${webhook.projectIds.length}):`);
    webhook.projectIds.forEach(projectId => {
      console.log(`   - ${projectId}`);
    });
  } else {
    console.log('\n   ℹ️ Monitoring all projects');
  }

  return webhook;
}

await displayWebhookDetails(
  'account_hook_GflD6EYyo7F4ViYS',
  'team_abc123'
);
```

### Webhookの存在確認

```typescript
async function webhookExists(webhookId: string, teamId: string): Promise<boolean> {
  try {
    await vercel.webhooks.getWebhook({
      id: webhookId,
      teamId
    });
    console.log(`✅ Webhook ${webhookId} exists`);
    return true;
  } catch (error) {
    if (error.statusCode === 403 || error.statusCode === 404) {
      console.log(`❌ Webhook ${webhookId} not found`);
      return false;
    }
    throw error;
  }
}

const exists = await webhookExists('account_hook_GflD6EYyo7F4ViYS', 'team_abc123');
```

### Webhookの設定検証

```typescript
async function validateWebhookConfig(
  webhookId: string,
  teamId: string,
  expectedEvents: string[]
) {
  const webhook = await vercel.webhooks.getWebhook({
    id: webhookId,
    teamId
  });

  const validation = {
    hasRequiredEvents: true,
    missingEvents: [] as string[],
    extraEvents: [] as string[]
  };

  // 必要なイベントがすべて含まれているか確認
  expectedEvents.forEach(event => {
    if (!webhook.events.includes(event)) {
      validation.hasRequiredEvents = false;
      validation.missingEvents.push(event);
    }
  });

  // 追加のイベントを特定
  webhook.events.forEach(event => {
    if (!expectedEvents.includes(event)) {
      validation.extraEvents.push(event);
    }
  });

  console.log('\n🔍 Webhook Configuration Validation:');
  console.log(`   Webhook ID: ${webhook.id}`);
  console.log(`   Has required events: ${validation.hasRequiredEvents ? '✅' : '❌'}`);

  if (validation.missingEvents.length > 0) {
    console.log(`   Missing events: ${validation.missingEvents.join(', ')}`);
  }

  if (validation.extraEvents.length > 0) {
    console.log(`   Extra events: ${validation.extraEvents.join(', ')}`);
  }

  return validation;
}

await validateWebhookConfig(
  'account_hook_GflD6EYyo7F4ViYS',
  'team_abc123',
  ['deployment.created', 'deployment.ready']
);
```

### Webhookの比較

```typescript
async function compareWebhooks(
  webhook1Id: string,
  webhook2Id: string,
  teamId: string
) {
  const [webhook1, webhook2] = await Promise.all([
    vercel.webhooks.getWebhook({ id: webhook1Id, teamId }),
    vercel.webhooks.getWebhook({ id: webhook2Id, teamId })
  ]);

  console.log('\n🔀 Webhook Comparison:');

  console.log(`\nWebhook 1: ${webhook1.id}`);
  console.log(`  URL: ${webhook1.url}`);
  console.log(`  Events: ${webhook1.events.length}`);
  console.log(`  Projects: ${webhook1.projectIds.length}`);

  console.log(`\nWebhook 2: ${webhook2.id}`);
  console.log(`  URL: ${webhook2.url}`);
  console.log(`  Events: ${webhook2.events.length}`);
  console.log(`  Projects: ${webhook2.projectIds.length}`);

  // イベントの差分
  const uniqueToFirst = webhook1.events.filter(e => !webhook2.events.includes(e));
  const uniqueToSecond = webhook2.events.filter(e => !webhook1.events.includes(e));
  const common = webhook1.events.filter(e => webhook2.events.includes(e));

  console.log(`\nCommon events: ${common.length}`);
  console.log(`Unique to first: ${uniqueToFirst.length}`);
  console.log(`Unique to second: ${uniqueToSecond.length}`);

  return { webhook1, webhook2, common, uniqueToFirst, uniqueToSecond };
}

await compareWebhooks(
  'account_hook_abc123',
  'account_hook_def456',
  'team_abc123'
);
```

### Webhookのモニタリング情報

```typescript
async function getWebhookMonitoringInfo(webhookId: string, teamId: string) {
  const webhook = await vercel.webhooks.getWebhook({
    id: webhookId,
    teamId
  });

  const age = Date.now() - webhook.createdAt;
  const daysSinceCreation = Math.floor(age / (1000 * 60 * 60 * 24));
  const daysSinceUpdate = Math.floor((Date.now() - webhook.updatedAt) / (1000 * 60 * 60 * 24));

  const info = {
    id: webhook.id,
    url: webhook.url,
    age: {
      days: daysSinceCreation,
      isOld: daysSinceCreation > 180  // 6ヶ月以上
    },
    activity: {
      daysSinceUpdate,
      isStale: daysSinceUpdate > 90  // 3ヶ月以上更新なし
    },
    coverage: {
      eventCount: webhook.events.length,
      projectCount: webhook.projectIds.length,
      isGlobal: webhook.projectIds.length === 0
    }
  };

  console.log('\n📊 Webhook Monitoring Info:');
  console.log(`   Age: ${info.age.days} days ${info.age.isOld ? '(⚠️ Old)' : ''}`);
  console.log(`   Last updated: ${info.activity.daysSinceUpdate} days ago ${info.activity.isStale ? '(⚠️ Stale)' : ''}`);
  console.log(`   Events: ${info.coverage.eventCount}`);
  console.log(`   Scope: ${info.coverage.isGlobal ? 'All projects' : `${info.coverage.projectCount} projects`}`);

  return info;
}

await getWebhookMonitoringInfo('account_hook_GflD6EYyo7F4ViYS', 'team_abc123');
```

### Webhookの更新候補確認

```typescript
async function checkWebhookForUpdates(webhookId: string, teamId: string) {
  const webhook = await vercel.webhooks.getWebhook({
    id: webhookId,
    teamId
  });

  const recommendations = {
    updateUrl: false,
    addEvents: false,
    removeProjects: false,
    needsUpdate: false
  };

  // URLがHTTPSかチェック
  if (!webhook.url.startsWith('https://')) {
    recommendations.updateUrl = true;
    recommendations.needsUpdate = true;
  }

  // イベントが少なすぎるか確認
  if (webhook.events.length < 2) {
    recommendations.addEvents = true;
    recommendations.needsUpdate = true;
  }

  // プロジェクトが多すぎるか確認
  if (webhook.projectIds.length > 30) {
    recommendations.removeProjects = true;
    recommendations.needsUpdate = true;
  }

  console.log('\n💡 Update Recommendations:');
  console.log(`   Update URL: ${recommendations.updateUrl ? '⚠️ Yes' : '✅ No'}`);
  console.log(`   Add more events: ${recommendations.addEvents ? '⚠️ Yes' : '✅ No'}`);
  console.log(`   Remove projects: ${recommendations.removeProjects ? '⚠️ Yes' : '✅ No'}`);
  console.log(`   Overall: ${recommendations.needsUpdate ? '⚠️ Updates recommended' : '✅ Configuration looks good'}`);

  return recommendations;
}

await checkWebhookForUpdates('account_hook_GflD6EYyo7F4ViYS', 'team_abc123');
```

## 注意事項

- Webhookの`secret`はこのエンドポイントでは返されません（作成時のみ提供）
- Webhookはチームに属するため、適切なチームIDまたはスラッグを指定する必要があります
- 存在しないWebhook IDを指定すると403または404エラーが返されます

## 関連リンク

- [Get a List of Webhooks](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/get-a-list-of-webhooks.md)
- [Create a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/creates-a-webhook.md)
- [Delete a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/deletes-a-webhook.md)
