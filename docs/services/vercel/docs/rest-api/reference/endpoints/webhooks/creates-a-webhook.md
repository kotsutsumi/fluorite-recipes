# Webhookの作成

チームまたはプロジェクトの新しいWebhookを作成します。

## エンドポイント

```
POST /v1/webhooks
```

**ベースURL**: `https://api.vercel.com`

## 認証

```
Authorization: Bearer <YOUR_BEARER_TOKEN_HERE>
```

## クエリパラメータ

| パラメータ | 型 | 説明 |
|----------|------|------|
| `teamId` | string | チーム識別子 |
| `slug` | string | リクエスト用のチームURLスラッグ |

## リクエストボディ

```typescript
interface CreateWebhookRequest {
  url: string;           // 必須: HTTPS WebhookエンドポイントURL
  events: string[];      // 必須: イベントタイプの配列（最小1つ）
  projectIds?: string[]; // オプション: 関連付けるプロジェクトID（1-50個）
}
```

### 利用可能なイベントタイプ

**バジェットイベント**:
- `budget.exceeded` - バジェット超過

**ドメインイベント**:
- `domain.auto-renew.changed` - 自動更新設定の変更
- `domain.created` - ドメイン作成
- `domain.deleted` - ドメイン削除
- `domain.moved` - ドメイン移動
- `domain.purchased` - ドメイン購入
- `domain.service-changed` - サービス変更
- `domain.transfer-changed` - 転送変更
- `domain.updated` - ドメイン更新

**デプロイメントイベント**:
- `deployment.created` - デプロイメント作成
- `deployment.succeeded` - デプロイメント成功
- `deployment.ready` - デプロイメント準備完了
- `deployment.canceled` - デプロイメントキャンセル
- `deployment.error` - デプロイメントエラー
- `deployment.check-rerequested` - チェック再実行

**Edge Configイベント**:
- `edge-config.created` - Edge Config作成
- `edge-config.deleted` - Edge Config削除
- `edge-config.updated` - Edge Config更新

**ファイアウォールイベント**:
- `firewall.managed-ruleset.changed` - マネージドルールセット変更
- `firewall.rule.created` - ルール作成
- `firewall.rule.deleted` - ルール削除
- `firewall.rule.updated` - ルール更新
- `firewall.systembypass.changed` - システムバイパス変更

**インテグレーションイベント**:
- `integration-configuration.removed` - 設定削除
- `integration-configuration.scope-change-confirmed` - スコープ変更確認
- `integration-configuration.permission-upgraded` - 権限アップグレード

**プロジェクトイベント**:
- `project.created` - プロジェクト作成
- `project.removed` - プロジェクト削除

**マーケットプレイスイベント**:
- `marketplace.resource.created` - リソース作成
- `marketplace.resource.updated` - リソース更新
- `marketplace.resource.deleted` - リソース削除

**可観測性イベント**:
- `observability.log-drain.created` - ログドレイン作成
- `observability.log-drain.deleted` - ログドレイン削除

## レスポンス

### 成功 (200)

```typescript
interface CreateWebhookResponse {
  secret: string;        // ペイロード検証用の署名シークレット
  id: string;            // Webhook識別子
  url: string;           // 登録されたWebhook URL
  events: string[];      // サブスクライブされたイベントタイプ
  ownerId: string;       // チーム所有者識別子
  createdAt: number;     // 作成タイムスタンプ（ミリ秒）
  updatedAt: number;     // 最終更新タイムスタンプ（ミリ秒）
  projectIds: string[];  // 関連付けられたプロジェクトID
}
```

⚠️ **重要**: `secret`はこのレスポンスでのみ提供されます。Webhookペイロードの署名検証に必要なため、必ず保存してください。

### エラー

| コード | 説明 |
|-------|------|
| 400 | リクエストボディの値が無効 |
| 401 | 未認証 |
| 403 | リソースへのアクセス権限なし |

## 使用例

### 基本的なWebhook作成

```typescript
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN
});

const webhook = await vercel.webhooks.createWebhook({
  teamId: 'team_abc123',
  requestBody: {
    url: 'https://example.com/webhook',
    events: ['deployment.created', 'deployment.ready']
  }
});

console.log(`✅ Webhook created: ${webhook.id}`);
console.log(`🔐 Secret (保存してください): ${webhook.secret}`);
console.log(`📡 URL: ${webhook.url}`);
console.log(`📢 Events: ${webhook.events.join(', ')}`);
```

### プロジェクト固有のWebhook作成

```typescript
const webhook = await vercel.webhooks.createWebhook({
  teamId: 'team_abc123',
  requestBody: {
    url: 'https://example.com/project-webhook',
    events: [
      'deployment.created',
      'deployment.succeeded',
      'deployment.error'
    ],
    projectIds: ['prj_abc123']
  }
});

console.log(`Webhook created for project: ${webhook.projectIds[0]}`);
console.log(`Monitoring: ${webhook.events.join(', ')}`);
```

### 複数プロジェクトのWebhook作成

```typescript
const webhook = await vercel.webhooks.createWebhook({
  teamId: 'team_abc123',
  requestBody: {
    url: 'https://example.com/multi-project-webhook',
    events: ['deployment.ready', 'deployment.error'],
    projectIds: ['prj_abc123', 'prj_def456', 'prj_ghi789']
  }
});

console.log(`✅ Webhook monitoring ${webhook.projectIds.length} projects`);
```

### ドメインイベントのWebhook作成

```typescript
const webhook = await vercel.webhooks.createWebhook({
  teamId: 'team_abc123',
  requestBody: {
    url: 'https://example.com/domain-webhook',
    events: [
      'domain.created',
      'domain.updated',
      'domain.deleted',
      'domain.purchased'
    ]
  }
});

console.log('Domain monitoring webhook created');
```

### 包括的なモニタリングWebhook

```typescript
const webhook = await vercel.webhooks.createWebhook({
  teamId: 'team_abc123',
  requestBody: {
    url: 'https://example.com/monitoring-webhook',
    events: [
      // デプロイメント
      'deployment.created',
      'deployment.ready',
      'deployment.error',

      // プロジェクト
      'project.created',
      'project.removed',

      // ドメイン
      'domain.created',
      'domain.deleted',

      // バジェット
      'budget.exceeded',

      // ファイアウォール
      'firewall.rule.created',
      'firewall.rule.deleted'
    ]
  }
});

console.log('✅ Comprehensive monitoring webhook created');
console.log(`   Monitoring ${webhook.events.length} event types`);
```

### Webhookシークレットの保存

```typescript
async function createAndStoreWebhook(
  teamId: string,
  webhookUrl: string,
  events: string[]
) {
  const webhook = await vercel.webhooks.createWebhook({
    teamId,
    requestBody: {
      url: webhookUrl,
      events
    }
  });

  // シークレットを安全に保存（環境変数、データベース、シークレット管理サービスなど）
  const secretData = {
    webhookId: webhook.id,
    secret: webhook.secret,
    createdAt: new Date(webhook.createdAt).toISOString()
  };

  console.log('⚠️ IMPORTANT: Save this secret securely!');
  console.log(JSON.stringify(secretData, null, 2));

  // 環境変数ファイルへの保存例（本番環境では使用しないでください）
  // await fs.writeFile('.env.local',
  //   `WEBHOOK_SECRET_${webhook.id}=${webhook.secret}\n`,
  //   { flag: 'a' }
  // );

  return webhook;
}

await createAndStoreWebhook(
  'team_abc123',
  'https://example.com/webhook',
  ['deployment.ready']
);
```

### Webhookペイロードの検証

```typescript
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}

// Express.jsでの使用例
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-vercel-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET;

  if (!verifyWebhookSignature(payload, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }

  // Webhookペイロードの処理
  console.log('✅ Valid webhook received:', req.body);
  res.status(200).send('OK');
});
```

## Webhookペイロードの例

### deployment.ready イベント

```typescript
interface DeploymentReadyPayload {
  type: 'deployment.ready';
  createdAt: number;
  payload: {
    deployment: {
      id: string;
      url: string;
      name: string;
      meta: object;
    };
    project: {
      id: string;
      name: string;
    };
    team: {
      id: string;
      slug: string;
    };
  };
}
```

## 注意事項

- **HTTPS必須**: Webhook URLは必ずHTTPSでなければなりません
- **シークレット保存**: `secret`は作成時にのみ返されるため、必ず安全に保存してください
- **イベント数**: 最低1つのイベントタイプが必要です
- **プロジェクト数**: 1-50個のプロジェクトを関連付けることができます
- **ペイロード検証**: すべてのWebhookペイロードは署名を使用して検証する必要があります

## 関連リンク

- [Get a List of Webhooks](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/get-a-list-of-webhooks.md)
- [Get a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/get-a-webhook.md)
- [Delete a Webhook](/docs/services/vercel/docs/rest-api/reference/endpoints/webhooks/deletes-a-webhook.md)
