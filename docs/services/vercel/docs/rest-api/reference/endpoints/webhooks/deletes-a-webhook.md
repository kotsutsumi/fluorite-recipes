# Webhookの削除

既存のWebhookを削除します。

## エンドポイント

```
DELETE /v1/webhooks/{id}
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## パスパラメータ

| パラメータ | 型 | 必須 | 説明 |
|----------|------|------|------|
| `id` | string | ✓ | Webhook識別子 |

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子（例: `team_1a2b3c4d5e6f7g8h9i0j1k2l`） |
| `slug` | string | リクエスト用のチームURLスラッグ（例: `my-team-url-slug`） |

## レスポンス

### 成功 (204)

```
No Content
```

削除が成功すると、レスポンスボディなしで204ステータスが返されます。

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストクエリの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |

## 使用例

### 基本的なWebhook削除

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

await vercel.webhooks.deleteWebhook({
  id: 'account_hook_GflD6EYyo7F4ViYS',
  teamId: 'team_abc123'
});

console.log('✅ Webhook deleted successfully');
```

### 安全な削除（確認付き）

```typescript
async function deleteWebhookSafely(webhookId: string, teamId: string) {
  try {
    // 1. 削除前にWebhook情報を取得
    const webhook = await vercel.webhooks.getWebhook({
      id: webhookId,
      teamId
    });

    console.log('⚠️ About to delete webhook:');
    console.log(`   ID: ${webhook.id}`);
    console.log(`   URL: ${webhook.url}`);
    console.log(`   Events: ${webhook.events.join(', ')}`);
    console.log(`   Projects: ${webhook.projectIds.length}`);

    // 2. 削除実行
    await vercel.webhooks.deleteWebhook({
      id: webhookId,
      teamId
    });

    console.log('\n✅ Webhook deleted successfully');

    return { deleted: true, webhook };
  } catch (error) {
    console.error(`❌ Failed to delete webhook: ${error.message}`);
    throw error;
  }
}

await deleteWebhookSafely('account_hook_GflD6EYyo7F4ViYS', 'team_abc123');
```

### 複数Webhookの削除

```typescript
async function deleteMultipleWebhooks(webhookIds: string[], teamId: string) {
  console.log(`Deleting ${webhookIds.length} webhooks...`);

  const results = [];

  for (const webhookId of webhookIds) {
    try {
      await vercel.webhooks.deleteWebhook({
        id: webhookId,
        teamId
      });

      results.push({ webhookId, success: true });
      console.log(`✅ Deleted: ${webhookId}`);
    } catch (error) {
      results.push({ webhookId, success: false, error: error.message });
      console.error(`❌ Failed: ${webhookId} - ${error.message}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\nCompleted: ${successCount}/${webhookIds.length} deleted`);

  return results;
}

await deleteMultipleWebhooks(
  ['account_hook_abc123', 'account_hook_def456', 'account_hook_ghi789'],
  'team_abc123'
);
```

### 使用されていないWebhookの削除

```typescript
async function deleteUnusedWebhooks(teamId: string, daysThreshold: number = 90) {
  // 1. すべてのWebhookを取得
  const webhooks = await vercel.webhooks.getWebhooks({ teamId });

  const cutoffTime = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);
  const unusedWebhooks = webhooks.filter(
    webhook => webhook.updatedAt < cutoffTime
  );

  console.log(`Found ${unusedWebhooks.length} unused webhooks (${daysThreshold}+ days old)`);

  const deleted = [];

  for (const webhook of unusedWebhooks) {
    try {
      await vercel.webhooks.deleteWebhook({
        id: webhook.id,
        teamId
      });

      const age = Math.floor((Date.now() - webhook.updatedAt) / (1000 * 60 * 60 * 24));
      deleted.push(webhook.id);
      console.log(`✅ Deleted ${age}-day old webhook: ${webhook.url}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${webhook.id}: ${error.message}`);
    }
  }

  console.log(`\nDeleted ${deleted.length}/${unusedWebhooks.length} unused webhooks`);

  return deleted;
}

// 90日以上更新されていないWebhookを削除
await deleteUnusedWebhooks('team_abc123', 90);
```

### 特定のプロジェクトのWebhook削除

```typescript
async function deleteProjectWebhooks(projectId: string, teamId: string) {
  const webhooks = await vercel.webhooks.getWebhooks({ teamId });

  const projectWebhooks = webhooks.filter(webhook =>
    webhook.projectIds.includes(projectId)
  );

  console.log(`Found ${projectWebhooks.length} webhooks for project ${projectId}`);

  for (const webhook of projectWebhooks) {
    try {
      await vercel.webhooks.deleteWebhook({
        id: webhook.id,
        teamId
      });

      console.log(`✅ Deleted webhook: ${webhook.url}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${webhook.id}`);
    }
  }
}

await deleteProjectWebhooks('prj_abc123', 'team_abc123');
```

### 特定のURLパターンのWebhook削除

```typescript
async function deleteWebhooksByUrlPattern(
  teamId: string,
  urlPattern: string | RegExp
) {
  const webhooks = await vercel.webhooks.getWebhooks({ teamId });

  const pattern = typeof urlPattern === 'string'
    ? new RegExp(urlPattern)
    : urlPattern;

  const matchingWebhooks = webhooks.filter(webhook =>
    pattern.test(webhook.url)
  );

  console.log(`Found ${matchingWebhooks.length} webhooks matching pattern: ${pattern}`);

  const deleted = [];

  for (const webhook of matchingWebhooks) {
    try {
      await vercel.webhooks.deleteWebhook({
        id: webhook.id,
        teamId
      });

      deleted.push(webhook.url);
      console.log(`✅ Deleted: ${webhook.url}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${webhook.url}`);
    }
  }

  console.log(`\nDeleted ${deleted.length} webhooks`);

  return deleted;
}

// 例: 開発環境のWebhookをすべて削除
await deleteWebhooksByUrlPattern('team_abc123', /localhost|\.dev|\.test/);
```

### イベントタイプ別のWebhook削除

```typescript
async function deleteWebhooksByEvent(
  teamId: string,
  eventType: string
) {
  const webhooks = await vercel.webhooks.getWebhooks({ teamId });

  const matchingWebhooks = webhooks.filter(webhook =>
    webhook.events.includes(eventType)
  );

  console.log(`Found ${matchingWebhooks.length} webhooks with event: ${eventType}`);

  for (const webhook of matchingWebhooks) {
    // イベントが1つだけの場合のみ削除
    if (webhook.events.length === 1) {
      try {
        await vercel.webhooks.deleteWebhook({
          id: webhook.id,
          teamId
        });

        console.log(`✅ Deleted webhook (single event): ${webhook.url}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${webhook.id}`);
      }
    } else {
      console.log(`⚠️ Skipped webhook (multiple events): ${webhook.url}`);
      console.log(`   Events: ${webhook.events.join(', ')}`);
    }
  }
}

await deleteWebhooksByEvent('team_abc123', 'deployment.created');
```

### Webhookクリーンアップバッチ処理

```typescript
async function cleanupWebhooks(teamId: string) {
  console.log('Starting webhook cleanup...\n');

  const webhooks = await vercel.webhooks.getWebhooks({ teamId });

  const issues = {
    noEvents: [] as string[],
    invalidUrl: [] as string[],
    noProjects: [] as string[],
    stale: [] as string[]
  };

  const threeMonthsAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);

  webhooks.forEach(webhook => {
    if (webhook.events.length === 0) {
      issues.noEvents.push(webhook.id);
    }
    if (!webhook.url.startsWith('https://')) {
      issues.invalidUrl.push(webhook.id);
    }
    if (webhook.projectIds.length === 0 && webhook.events.length < 3) {
      issues.noProjects.push(webhook.id);
    }
    if (webhook.updatedAt < threeMonthsAgo) {
      issues.stale.push(webhook.id);
    }
  });

  // 削除候補のWebhook IDを集約（重複除去）
  const toDelete = new Set([
    ...issues.noEvents,
    ...issues.invalidUrl,
    ...issues.stale
  ]);

  console.log('Issues found:');
  console.log(`  No events: ${issues.noEvents.length}`);
  console.log(`  Invalid URLs: ${issues.invalidUrl.length}`);
  console.log(`  Stale (90+ days): ${issues.stale.length}`);
  console.log(`\nTotal to delete: ${toDelete.size}`);

  let deleted = 0;

  for (const webhookId of toDelete) {
    try {
      await vercel.webhooks.deleteWebhook({ id: webhookId, teamId });
      deleted++;
      console.log(`✅ Deleted: ${webhookId}`);
    } catch (error) {
      console.error(`❌ Failed: ${webhookId}`);
    }
  }

  console.log(`\n✅ Cleanup complete: ${deleted}/${toDelete.size} deleted`);

  return { deleted, total: toDelete.size };
}

await cleanupWebhooks('team_abc123');
```

## 注意事項

- **元に戻せません**: Webhookの削除は永久的で、取り消すことができません
- **即座に有効**: 削除後、そのWebhook URLへのイベント配信は即座に停止されます
- **確認なし**: API呼び出しで確認プロンプトは表示されません
- **依存関係**: Webhookを使用している統合がある場合は、削除前に確認してください

## 削除前のチェックリスト

1. ✅ Webhook IDが正しいことを確認
2. ✅ Webhookが使用されていないことを確認
3. ✅ 必要に応じてWebhook設定をバックアップ
4. ✅ 依存する統合やサービスに影響がないか確認
5. ✅ チームメンバーに事前通知

## 関連リンク

- [Get a List of Webhooks](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/get-a-list-of-webhooks.md)
- [Create a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/creates-a-webhook.md)
- [Get a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/get-a-webhook.md)
