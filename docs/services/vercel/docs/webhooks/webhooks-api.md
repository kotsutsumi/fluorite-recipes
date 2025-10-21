# Webhooks APIリファレンス

Vercelインテグレーションは、Webhookを通じて特定のトリガーベースのイベントを購読できます。Webhookの典型的なユースケースの1つは、インテグレーションを削除した後にリソースをクリーンアップすることです。

## 概要

Webhooks APIを使用すると、プログラムでWebhookを作成、取得、削除できます。

### 認証

すべてのAPIリクエストには、Vercelアクセストークンが必要です：

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.vercel.com/v1/webhooks
```

## ペイロード構造

Webhookペイロードは、以下のキーを持つJSONオブジェクトです。

| キー | タイプ | 説明 |
|------|--------|------|
| `id` | 文字列 | Webhook配信の一意なID |
| `type` | 文字列 | [イベントタイプ](#サポートされているイベントタイプ) |
| `createdAt` | 数値 | Webhook配信のタイムスタンプ（Unixエポック秒） |
| `region` | 文字列 | イベントが発生したリージョン（nullの可能性あり） |
| `payload` | オブジェクト | Webhookのペイロード。詳細は[サポートされているイベントタイプ](#サポートされているイベントタイプ)を参照 |

### 例

```json
{
  "id": "evt_abc123def456",
  "type": "deployment.created",
  "createdAt": 1234567890,
  "region": "iad1",
  "payload": {
    "deployment": {
      "id": "dpl_abc123",
      "url": "my-app-abc123.vercel.app"
    },
    "project": {
      "id": "prj_abc123"
    }
  }
}
```

## サポートされているイベントタイプ

### deployment.canceled

デプロイメントがキャンセルされた際に発生します。

**主な関連ペイロードキー:**
- `payload.team.id`: イベントのチームID
- `payload.user.id`: イベントのユーザーID
- `payload.deployment.id`: デプロイメントID
- `payload.deployment.url`: デプロイメントURL

**例:**

```json
{
  "id": "evt_canceled123",
  "type": "deployment.canceled",
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
      "url": "my-app-abc123.vercel.app"
    },
    "project": {
      "id": "prj_abc123"
    }
  }
}
```

### deployment.created

デプロイメントが作成された際に発生します。

**主な関連ペイロードキー:**
- `payload.alias`: デプロイメント準備時に割り当てられるエイリアスの配列
- `payload.deployment.id`: デプロイメントID
- `payload.deployment.name`: デプロイメントの名前
- `payload.deployment.url`: デプロイメントURL
- `payload.deployment.meta`: Gitメタデータ（コミット、ブランチなど）

**例:**

```json
{
  "id": "evt_created123",
  "type": "deployment.created",
  "createdAt": 1234567890,
  "payload": {
    "alias": ["my-app.vercel.app"],
    "deployment": {
      "id": "dpl_abc123",
      "name": "my-app",
      "url": "my-app-abc123.vercel.app",
      "meta": {
        "githubCommitRef": "main",
        "githubCommitSha": "abc123def456",
        "githubCommitMessage": "feat: add new feature",
        "githubCommitAuthorName": "John Doe"
      }
    },
    "project": {
      "id": "prj_abc123"
    },
    "team": {
      "id": "team_abc123"
    },
    "user": {
      "id": "user_abc123"
    },
    "links": {
      "deployment": "https://vercel.com/team/project/abc123",
      "project": "https://vercel.com/team/project"
    }
  }
}
```

### deployment.succeeded

デプロイメントが正常に完了した際に発生します。

**主な関連ペイロードキー:**
- `payload.deployment.id`: デプロイメントID
- `payload.deployment.url`: デプロイメントURL
- `payload.project.id`: プロジェクトID
- `payload.plan`: プランタイプ（hobby、pro、enterprise）

**例:**

```json
{
  "id": "evt_succeeded123",
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
    "team": {
      "id": "team_abc123"
    },
    "plan": "pro"
  }
}
```

### deployment.ready

デプロイメントが準備完了し、本番環境に昇格可能な状態になった際に発生します。

**主な関連ペイロードキー:**
- `payload.deployment.id`: デプロイメントID
- `payload.deployment.url`: デプロイメントURL
- `payload.deployment.readyState`: 準備状態（READY）

**例:**

```json
{
  "id": "evt_ready123",
  "type": "deployment.ready",
  "createdAt": 1234567905,
  "payload": {
    "deployment": {
      "id": "dpl_abc123",
      "url": "my-app-abc123.vercel.app",
      "readyState": "READY"
    },
    "project": {
      "id": "prj_abc123"
    }
  }
}
```

### deployment.promoted

デプロイメントが本番環境に昇格した際に発生します。

**主な関連ペイロードキー:**
- `payload.deployment.id`: デプロイメントID
- `payload.deployment.url`: デプロイメントURL
- `payload.aliases`: 本番ドメインのエイリアス

**例:**

```json
{
  "id": "evt_promoted123",
  "type": "deployment.promoted",
  "createdAt": 1234567910,
  "payload": {
    "deployment": {
      "id": "dpl_abc123",
      "url": "my-app-abc123.vercel.app"
    },
    "project": {
      "id": "prj_abc123"
    },
    "aliases": [
      "my-app.com",
      "www.my-app.com"
    ]
  }
}
```

### deployment.error

デプロイメントがエラーで失敗した際に発生します。

**主な関連ペイロードキー:**
- `payload.deployment.id`: デプロイメントID
- `payload.deployment.url`: デプロイメントURL
- `payload.errorMessage`: エラーメッセージ
- `payload.errorCode`: エラーコード（オプション）

**例:**

```json
{
  "id": "evt_error123",
  "type": "deployment.error",
  "createdAt": 1234567915,
  "payload": {
    "deployment": {
      "id": "dpl_def456",
      "url": "my-app-def456.vercel.app"
    },
    "project": {
      "id": "prj_abc123"
    },
    "errorMessage": "Build failed: Module not found",
    "errorCode": "BUILD_FAILED"
  }
}
```

### deployment.check-rerequested

デプロイメントのチェックが再リクエストされた際に発生します。

**主な関連ペイロードキー:**
- `payload.deployment.id`: デプロイメントID
- `payload.check.id`: チェックID
- `payload.check.name`: チェック名

**例:**

```json
{
  "id": "evt_recheck123",
  "type": "deployment.check-rerequested",
  "createdAt": 1234567920,
  "payload": {
    "deployment": {
      "id": "dpl_abc123"
    },
    "check": {
      "id": "check_abc123",
      "name": "E2E Tests"
    }
  }
}
```

### project.created

プロジェクトが作成された際に発生します。

**主な関連ペイロードキー:**
- `payload.project.id`: プロジェクトID
- `payload.project.name`: プロジェクト名
- `payload.team.id`: チームID（チームプロジェクトの場合）

**例:**

```json
{
  "id": "evt_project_created123",
  "type": "project.created",
  "createdAt": 1234567925,
  "payload": {
    "project": {
      "id": "prj_new123",
      "name": "new-project"
    },
    "team": {
      "id": "team_abc123"
    },
    "user": {
      "id": "user_abc123"
    }
  }
}
```

### project.removed

プロジェクトが削除された際に発生します。

**主な関連ペイロードキー:**
- `payload.project.id`: 削除されたプロジェクトID
- `payload.project.name`: 削除されたプロジェクト名

**例:**

```json
{
  "id": "evt_project_removed123",
  "type": "project.removed",
  "createdAt": 1234567930,
  "payload": {
    "project": {
      "id": "prj_old123",
      "name": "old-project"
    },
    "team": {
      "id": "team_abc123"
    }
  }
}
```

### domain.created

ドメインが追加された際に発生します。

**主な関連ペイロードキー:**
- `payload.domain.name`: ドメイン名
- `payload.project.id`: プロジェクトID

**例:**

```json
{
  "id": "evt_domain_created123",
  "type": "domain.created",
  "createdAt": 1234567935,
  "payload": {
    "domain": {
      "name": "example.com"
    },
    "project": {
      "id": "prj_abc123"
    }
  }
}
```

### domain.deleted

ドメインが削除された際に発生します。

**主な関連ペイロードキー:**
- `payload.domain.name`: 削除されたドメイン名

**例:**

```json
{
  "id": "evt_domain_deleted123",
  "type": "domain.deleted",
  "createdAt": 1234567940,
  "payload": {
    "domain": {
      "name": "old-example.com"
    }
  }
}
```

### integration-configuration.removed

インテグレーション設定が削除された際に発生します。

**主な関連ペイロードキー:**
- `payload.configuration.id`: 設定ID
- `payload.integration.id`: インテグレーションID

**例:**

```json
{
  "id": "evt_integration_removed123",
  "type": "integration-configuration.removed",
  "createdAt": 1234567945,
  "payload": {
    "configuration": {
      "id": "cfg_abc123"
    },
    "integration": {
      "id": "int_abc123"
    },
    "team": {
      "id": "team_abc123"
    }
  }
}
```

## REST API エンドポイント

### Webhookの一覧取得

チームまたはユーザーに関連付けられたすべてのWebhookを取得します。

**エンドポイント:**

```
GET /v1/webhooks
```

**パラメータ:**

| パラメータ | タイプ | 説明 |
|-----------|--------|------|
| `teamId` | 文字列 | チームID（オプション） |

**例:**

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.vercel.com/v1/webhooks?teamId=team_abc123"
```

**レスポンス:**

```json
{
  "webhooks": [
    {
      "id": "hook_abc123",
      "url": "https://example.com/webhook",
      "events": ["deployment.created", "deployment.succeeded"],
      "projectIds": ["prj_abc123"],
      "createdAt": 1234567890
    }
  ],
  "pagination": {
    "count": 1,
    "next": null,
    "prev": null
  }
}
```

### Webhookの作成

新しいWebhookを作成します。

**エンドポイント:**

```
POST /v1/webhooks
```

**リクエストボディ:**

```json
{
  "url": "https://example.com/webhook",
  "events": ["deployment.created", "deployment.succeeded"],
  "projectIds": ["prj_abc123"]
}
```

**例:**

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/webhook",
    "events": ["deployment.created", "deployment.succeeded"],
    "projectIds": ["prj_abc123"]
  }' \
  "https://api.vercel.com/v1/webhooks"
```

**レスポンス:**

```json
{
  "id": "hook_new123",
  "url": "https://example.com/webhook",
  "events": ["deployment.created", "deployment.succeeded"],
  "projectIds": ["prj_abc123"],
  "secret": "whsec_abc123def456...",
  "createdAt": 1234567950
}
```

### Webhookの削除

既存のWebhookを削除します。

**エンドポイント:**

```
DELETE /v1/webhooks/:id
```

**例:**

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.vercel.com/v1/webhooks/hook_abc123"
```

**レスポンス:**

```json
{
  "id": "hook_abc123"
}
```

## セキュリティ

### 署名検証

すべてのWebhookペイロードには、`x-vercel-signature`ヘッダーが含まれます。

**署名の形式:**

```
sha1=<hex_digest>
```

**検証手順:**

1. リクエストボディ（JSON文字列）を取得
2. Webhookシークレットを使用してHMAC-SHA1ハッシュを計算
3. 計算したハッシュと`x-vercel-signature`ヘッダーの値を比較

**Node.jsでの実装:**

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(body, signature, secret) {
  const hmac = crypto.createHmac('sha1', secret);
  const digest = 'sha1=' + hmac.update(body).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

// 使用例
const isValid = verifyWebhookSignature(
  JSON.stringify(req.body),
  req.headers['x-vercel-signature'],
  process.env.WEBHOOK_SECRET
);
```

## ベストプラクティス

### 1. 冪等性の確保

同じイベントが複数回配信される可能性があるため、イベントIDを使用して重複を処理：

```javascript
const processedEvents = new Set();

app.post('/webhook', (req, res) => {
  if (processedEvents.has(req.body.id)) {
    return res.status(200).send('Already processed');
  }

  processedEvents.add(req.body.id);
  // イベントを処理
});
```

### 2. 非同期処理

Webhookエンドポイントは迅速に応答し、処理はバックグラウンドで実行：

```javascript
app.post('/webhook', (req, res) => {
  res.status(200).send('OK');

  // バックグラウンドで処理
  processWebhookAsync(req.body).catch(console.error);
});
```

### 3. エラーハンドリング

適切なエラーハンドリングとログ記録：

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

### 4. リトライロジック

Vercelは、5xx エラーの場合にWebhookを自動的に再試行します。適切なHTTPステータスコードを返してください。

## 関連リンク

- [Webhooks](/docs/webhooks)
- [Vercel API](https://vercel.com/docs/rest-api)
- [デプロイメント](/docs/deployments)
- [プロジェクト](/docs/projects)
