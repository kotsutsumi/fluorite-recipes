# Webhookの一覧取得

チームまたはプロジェクトに関連付けられたすべてのWebhookを取得します。

## エンドポイント

```
GET /v1/webhooks
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `projectId` | string | 特定のプロジェクト識別子（省略可能） |
| `teamId` | string | チーム識別子 |
| `slug` | string | リクエスト用のチームURLスラッグ |

## レスポンス

### 成功 (200)

```typescript
interface Webhook {
  id: string;                    // Webhook識別子
  url: string;                   // WebhookエンドポイントURL
  events: string[];              // サブスクライブされたイベントタイプ（例: "deployment.created"）
  ownerId: string;               // Webhookを所有するチームID
  createdAt: number;             // 作成タイムスタンプ（ミリ秒）
  updatedAt: number;             // 最終更新タイムスタンプ（ミリ秒）
  projectIds: string[];          // 関連付けられたプロジェクトID
  projectsMetadata?: Array<{     // プロジェクト詳細情報（オプション）
    id: string;
    name: string;
    framework: string;
    latestDeployment: object;
  }>;
}

type Response = Webhook[];
```

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |

## 使用例

### 基本的なWebhook一覧取得

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const webhooks = await vercel.webhooks.getWebhooks();

console.log(`Total webhooks: ${webhooks.length}`);

webhooks.forEach(webhook => {
  console.log(`\nWebhook: ${webhook.id}`);
  console.log(`  URL: ${webhook.url}`);
  console.log(`  Events: ${webhook.events.join(', ')}`);
  console.log(`  Projects: ${webhook.projectIds.length}`);
});
```

### 特定のチームのWebhook一覧

```typescript
const webhooks = await vercel.webhooks.getWebhooks({
  teamId: 'team_abc123'
});

console.log(`Team webhooks: ${webhooks.length}`);

webhooks.forEach(webhook => {
  console.log(`\n${webhook.url}`);
  console.log(`  Listening for: ${webhook.events.join(', ')}`);
  console.log(`  Created: ${new Date(webhook.createdAt).toLocaleDateString()}`);
});
```

### 特定のプロジェクトのWebhook取得

```typescript
const projectId = 'prj_abc123';

const webhooks = await vercel.webhooks.getWebhooks({
  projectId,
  teamId: 'team_abc123'
});

console.log(`Webhooks for project ${projectId}:`);

webhooks.forEach(webhook => {
  const hasProject = webhook.projectIds.includes(projectId);
  if (hasProject) {
    console.log(`\n✅ ${webhook.url}`);
    console.log(`   Events: ${webhook.events.join(', ')}`);
  }
});
```

### Webhookの詳細情報取得

```typescript
const webhooks = await vercel.webhooks.getWebhooks({
  teamId: 'team_abc123'
});

webhooks.forEach(webhook => {
  console.log(`\n📡 Webhook: ${webhook.id}`);
  console.log(`   URL: ${webhook.url}`);
  console.log(`   Owner: ${webhook.ownerId}`);
  console.log(`   Created: ${new Date(webhook.createdAt).toLocaleString()}`);
  console.log(`   Updated: ${new Date(webhook.updatedAt).toLocaleString()}`);

  if (webhook.projectsMetadata) {
    console.log(`\n   Projects:`);
    webhook.projectsMetadata.forEach(project => {
      console.log(`   - ${project.name} (${project.framework})`);
    });
  }
});
```

### イベントタイプ別のWebhookフィルタリング

```typescript
const webhooks = await vercel.webhooks.getWebhooks({
  teamId: 'team_abc123'
});

// デプロイメントイベントのWebhookを抽出
const deploymentWebhooks = webhooks.filter(webhook =>
  webhook.events.some(event => event.startsWith('deployment.'))
);

console.log(`Deployment webhooks: ${deploymentWebhooks.length}`);

deploymentWebhooks.forEach(webhook => {
  console.log(`\n${webhook.url}`);
  const deployEvents = webhook.events.filter(e => e.startsWith('deployment.'));
  console.log(`  Deployment events: ${deployEvents.join(', ')}`);
});
```

### Webhookの統計情報

```typescript
const webhooks = await vercel.webhooks.getWebhooks({
  teamId: 'team_abc123'
});

const stats = {
  total: webhooks.length,
  byEventType: {} as Record<string, number>,
  totalProjects: new Set<string>()
};

webhooks.forEach(webhook => {
  webhook.events.forEach(event => {
    stats.byEventType[event] = (stats.byEventType[event] || 0) + 1;
  });

  webhook.projectIds.forEach(projectId => {
    stats.totalProjects.add(projectId);
  });
});

console.log('Webhook Statistics:');
console.log(`  Total webhooks: ${stats.total}`);
console.log(`  Unique projects: ${stats.totalProjects.size}`);
console.log('\n  Events breakdown:');
Object.entries(stats.byEventType).forEach(([event, count]) => {
  console.log(`    ${event}: ${count}`);
});
```

### Webhookの健全性チェック

```typescript
async function checkWebhookHealth(teamId: string) {
  const webhooks = await vercel.webhooks.getWebhooks({ teamId });

  console.log(`Checking ${webhooks.length} webhooks...`);

  const issues = {
    noEvents: [] as string[],
    noProjects: [] as string[],
    old: [] as string[]
  };

  webhooks.forEach(webhook => {
    // イベントが設定されていない
    if (webhook.events.length === 0) {
      issues.noEvents.push(webhook.id);
    }

    // プロジェクトが関連付けられていない
    if (webhook.projectIds.length === 0) {
      issues.noProjects.push(webhook.id);
    }

    // 6ヶ月以上更新されていない
    const sixMonthsAgo = Date.now() - (6 * 30 * 24 * 60 * 60 * 1000);
    if (webhook.updatedAt < sixMonthsAgo) {
      issues.old.push(webhook.id);
    }
  });

  console.log('\n⚠️ Issues found:');
  console.log(`  No events configured: ${issues.noEvents.length}`);
  console.log(`  No projects: ${issues.noProjects.length}`);
  console.log(`  Not updated in 6+ months: ${issues.old.length}`);

  return issues;
}

await checkWebhookHealth('team_abc123');
```

## 利用可能なイベントタイプ

Webhookでサブスクライブ可能な主なイベントタイプ：

```typescript
const eventTypes = [
  // デプロイメント
  'deployment.created',
  'deployment.ready',
  'deployment.error',
  'deployment.succeeded',
  'deployment.canceled',

  // ドメイン
  'domain.created',
  'domain.updated',
  'domain.deleted',

  // プロジェクト
  'project.created',
  'project.removed',

  // ファイアウォール
  'firewall.rule.created',
  'firewall.rule.updated',

  // バジェット
  'budget.exceeded',

  // Edge Config
  'edge-config.created',
  'edge-config.updated'
];
```

## 注意事項

- Webhookは作成されたチームに属します
- プロジェクトIDを指定すると、そのプロジェクトに関連するWebhookのみが返されます
- `projectsMetadata`は、関連するプロジェクトの詳細情報を含みますが、すべてのレスポンスに含まれるわけではありません
- Webhookの更新タイムスタンプは、Webhook設定が変更された時に更新されます

## 関連リンク

- [Create a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/creates-a-webhook.md)
- [Get a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/get-a-webhook.md)
- [Delete a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/deletes-a-webhook.md)
