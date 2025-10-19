# Vercel Webhooksの設定

## Webhookとは

Webhookは、特定のイベントが発生したときにHTTP POSTリクエストを送信するトリガーベースのHTTPエンドポイントです。イベント発生時に、別のサードパーティアプリに通知を送信し、適切なアクションを実行できます。

## 主な用途

- **自動化**：デプロイメント完了時に自動的にタスクを実行
- **通知**：Slack、Discord、メールなどに通知を送信
- **統合**：CI/CD、監視ツール、カスタムシステムと統合
- **分析**：デプロイメントイベントを追跡・記録

## アカウントWebhooks

アカウントWebhooksは、[Enterprise](/docs/plans/enterprise)および[Pro](/docs/plans/pro)プランで利用可能です。

### 主な特徴

- チームレベルでのWebhook設定
- 複数のプロジェクトを監視可能
- イベントのフィルタリング
- セキュアな署名検証

## Webhookの設定手順

### 1. チームの設定に移動

1. Vercelダッシュボードでチームスコープを選択
2. 上部メニューから「Settings」を選択
3. サイドメニューから「Webhooks」に移動

### 2. リスニングするイベントの選択

以下のイベントカテゴリから選択可能：

#### デプロイメントイベント

- **deployment.created**：デプロイメントが作成された
- **deployment.succeeded**：デプロイメントが成功した
- **deployment.ready**：デプロイメントが準備完了（本番環境に昇格可能）
- **deployment.promoted**：デプロイメントが本番環境に昇格した
- **deployment.error**：デプロイメントがエラーで失敗した
- **deployment.canceled**：デプロイメントがキャンセルされた
- **deployment.check-rerequested**：デプロイメントのチェックが再リクエストされた

#### プロジェクトイベント

- **project.created**：プロジェクトが作成された
- **project.removed**：プロジェクトが削除された

#### ドメインイベント

- **domain.created**：ドメインが追加された
- **domain.deleted**：ドメインが削除された

#### ファイアウォールイベント

- **attack.detected**：攻撃が検出された

### 3. ターゲットプロジェクトの選択

- **すべてのプロジェクト**：チーム内のすべてのプロジェクトのイベントを監視
- **特定のプロジェクト**：選択したプロジェクトのみのイベントを監視

### 4. エンドポイントURLの入力

- イベントを受信する公開可能なURLを指定
- HTTPSエンドポイントを推奨
- Webhookが作成されると、シークレットキーが表示される（安全に保管）

### 例：Webhook設定

```
名前: Slack通知
URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
イベント: deployment.succeeded, deployment.error
プロジェクト: すべて
```

## イベントペイロード

各Webhookイベントは、以下の形式のJSONペイロードを送信します：

### 基本構造

```json
{
  "id": "evt_abc123",
  "type": "deployment.succeeded",
  "createdAt": 1234567890,
  "payload": {
    // イベント固有のデータ
  }
}
```

### deployment.created

デプロイメントが作成されたときに送信されます。

```json
{
  "id": "evt_abc123",
  "type": "deployment.created",
  "createdAt": 1234567890,
  "payload": {
    "team": {
      "id": "team_abc123"
    },
    "user": {
      "id": "user_abc123"
    },
    "deployment": {
      "id": "dpl_abc123",
      "url": "my-app-abc123.vercel.app",
      "name": "my-app",
      "meta": {
        "githubCommitRef": "main",
        "githubCommitSha": "abc123",
        "githubCommitMessage": "feat: add new feature"
      }
    },
    "project": {
      "id": "prj_abc123"
    },
    "links": {
      "deployment": "https://vercel.com/team/project/abc123",
      "project": "https://vercel.com/team/project"
    }
  }
}
```

### deployment.succeeded

デプロイメントが成功したときに送信されます。

```json
{
  "id": "evt_def456",
  "type": "deployment.succeeded",
  "createdAt": 1234567900,
  "payload": {
    "deployment": {
      "id": "dpl_abc123",
      "url": "my-app-abc123.vercel.app"
    },
    "project": {
      "id": "prj_abc123"
    },
    "plan": "pro"
  }
}
```

### deployment.error

デプロイメントが失敗したときに送信されます。

```json
{
  "id": "evt_ghi789",
  "type": "deployment.error",
  "createdAt": 1234567910,
  "payload": {
    "deployment": {
      "id": "dpl_def456",
      "url": "my-app-def456.vercel.app"
    },
    "project": {
      "id": "prj_abc123"
    },
    "errorMessage": "Build failed"
  }
}
```

### project.created

プロジェクトが作成されたときに送信されます。

```json
{
  "id": "evt_jkl012",
  "type": "project.created",
  "createdAt": 1234567920,
  "payload": {
    "project": {
      "id": "prj_def456",
      "name": "new-project"
    },
    "team": {
      "id": "team_abc123"
    }
  }
}
```

## 署名検証

Webhookのペイロードは、署名ヘッダー`x-vercel-signature`で検証できます。

### Node.jsでの検証例

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha1', secret);
  const digest = 'sha1=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// Expressでの使用例
app.post('/webhook', (req, res) => {
  const signature = req.headers['x-vercel-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET;

  if (!verifySignature(payload, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }

  // Webhookを処理
  console.log('Event:', req.body.type);
  res.status(200).send('OK');
});
```

### Pythonでの検証例

```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    digest = 'sha1=' + hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha1
    ).hexdigest()
    return hmac.compare_digest(signature, digest)

# Flaskでの使用例
@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('x-vercel-signature')
    payload = request.get_data(as_text=True)
    secret = os.environ.get('WEBHOOK_SECRET')

    if not verify_signature(payload, signature, secret):
        return 'Invalid signature', 401

    # Webhookを処理
    data = request.json
    print('Event:', data['type'])
    return 'OK', 200
```

## 使用例

### Slackへの通知

```javascript
const axios = require('axios');

app.post('/webhook', async (req, res) => {
  const { type, payload } = req.body;

  if (type === 'deployment.succeeded') {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `✅ デプロイメント成功: ${payload.deployment.url}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*デプロイメント成功*\n<https://${payload.deployment.url}|${payload.deployment.url}>`
          }
        }
      ]
    });
  }

  if (type === 'deployment.error') {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `❌ デプロイメント失敗: ${payload.deployment.url}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*デプロイメント失敗*\nエラー: ${payload.errorMessage}`
          }
        }
      ]
    });
  }

  res.status(200).send('OK');
});
```

### Discordへの通知

```javascript
app.post('/webhook', async (req, res) => {
  const { type, payload } = req.body;

  if (type === 'deployment.succeeded') {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: '✅ デプロイメント成功',
      embeds: [
        {
          title: 'デプロイメント詳細',
          url: `https://${payload.deployment.url}`,
          color: 0x00ff00,
          fields: [
            {
              name: 'URL',
              value: payload.deployment.url,
              inline: true
            },
            {
              name: 'プロジェクト',
              value: payload.deployment.name,
              inline: true
            }
          ]
        }
      ]
    });
  }

  res.status(200).send('OK');
});
```

### データベースへの記録

```javascript
app.post('/webhook', async (req, res) => {
  const { type, payload } = req.body;

  // データベースにイベントを記録
  await db.deployments.create({
    type,
    deploymentId: payload.deployment?.id,
    deploymentUrl: payload.deployment?.url,
    projectId: payload.project?.id,
    status: type.includes('succeeded') ? 'success' : 'error',
    createdAt: new Date(req.body.createdAt * 1000)
  });

  res.status(200).send('OK');
});
```

### カスタムCI/CDトリガー

```javascript
app.post('/webhook', async (req, res) => {
  const { type, payload } = req.body;

  if (type === 'deployment.succeeded') {
    // E2Eテストをトリガー
    await axios.post('https://ci-system.example.com/trigger', {
      url: payload.deployment.url,
      type: 'e2e-test'
    });

    // パフォーマンステストをトリガー
    await axios.post('https://ci-system.example.com/trigger', {
      url: payload.deployment.url,
      type: 'performance-test'
    });
  }

  res.status(200).send('OK');
});
```

## ベストプラクティス

### 1. 署名検証を実装

すべてのWebhookリクエストで署名を検証：

```javascript
if (!verifySignature(payload, signature, secret)) {
  return res.status(401).send('Invalid signature');
}
```

### 2. 冪等性を確保

同じイベントが複数回送信される可能性があるため、冪等性を確保：

```javascript
const processedEvents = new Set();

app.post('/webhook', (req, res) => {
  const eventId = req.body.id;

  if (processedEvents.has(eventId)) {
    return res.status(200).send('Already processed');
  }

  // イベントを処理
  processedEvents.add(eventId);
  res.status(200).send('OK');
});
```

### 3. エラーハンドリング

適切なエラーハンドリングを実装：

```javascript
app.post('/webhook', async (req, res) => {
  try {
    await processWebhook(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal Server Error');
  }
});
```

### 4. タイムアウト設定

Webhookエンドポイントは迅速に応答：

```javascript
app.post('/webhook', async (req, res) => {
  // すぐに応答
  res.status(200).send('OK');

  // バックグラウンドで処理
  processWebhookAsync(req.body).catch(console.error);
});
```

### 5. ログ記録

すべてのWebhookイベントをログに記録：

```javascript
app.post('/webhook', (req, res) => {
  logger.info('Webhook received', {
    type: req.body.type,
    id: req.body.id,
    timestamp: new Date(req.body.createdAt * 1000)
  });

  res.status(200).send('OK');
});
```

## トラブルシューティング

### Webhookが受信されない

**原因：** URLが正しくない、またはファイアウォールでブロックされている

**解決策：**

1. URLが公開アクセス可能か確認
2. HTTPSエンドポイントを使用
3. ファイアウォールの設定を確認
4. Vercelダッシュボードで配信ログを確認

### 署名検証が失敗する

**原因：** シークレットキーが正しくない、またはペイロードが改ざんされている

**解決策：**

1. シークレットキーが正しいか確認
2. ペイロードが変更されていないか確認（ミドルウェアでの変換に注意）
3. 署名検証のアルゴリズムが正しいか確認

### 重複イベントが送信される

**原因：** Vercelは配信に失敗した場合、再試行する

**解決策：**

イベントIDを使用して重複を検出：

```javascript
const processedEvents = new Set();

if (processedEvents.has(req.body.id)) {
  return res.status(200).send('Already processed');
}
```

## Webhook API

プログラムでWebhookを管理するためのAPIも提供されています。

詳細は[Webhooks API](/docs/webhooks/webhooks-api)を参照してください。

## 関連リンク

- [Webhooks API](/docs/webhooks/webhooks-api)
- [デプロイメント](/docs/deployments)
- [プロジェクト](/docs/projects)
- [Vercel API](https://vercel.com/docs/rest-api)
