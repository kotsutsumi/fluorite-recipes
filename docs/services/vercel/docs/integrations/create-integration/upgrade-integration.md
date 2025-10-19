# インテグレーションのアップグレード

インテグレーションを以下のシナリオで更新する必要があります。

## インテグレーションのアップグレード

Vercelプラットフォームで古い機能を使用している場合、[これらのガイドライン](/docs/integrations/create-integration/upgrade-integration#upgrading-your-integration)に従ってインテグレーションをアップグレードし、最新の機能を使用してください。

準備ができたら、アップグレード後に[インテグレーションを申請](/docs/integrations/create-integration/submit-integration)してください。

## 汎用Webhookの使用

インテグレーション設定で汎用Webhook URLを指定できるようになりました。WebhookのAPIおよびDelete Hooksの代わりに汎用Webhookを使用してください。

Vercel REST APIでのWebhookのリスト、作成、削除は[廃止されました](https://vercel.com/changelog/sunsetting-ui-hooks-and-legacy-webhooks)。また、インテグレーション設定の削除時に通知するDelete Hooksもサポートされていません。これらの機能のいずれかまたは両方を使用している場合は、インテグレーションを更新する必要があります。

### 汎用Webhookへの移行

**以前の方法**（廃止）:
```typescript
// Webhook API を使用してWebhookを作成
const response = await fetch('https://api.vercel.com/v1/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    url: 'https://your-integration.com/webhook',
    events: ['deployment.created']
  })
});
```

**新しい方法**（推奨）:

1. インテグレーション設定で汎用Webhook URLを指定：

```
Webhook URL: https://your-integration.com/webhook
```

2. すべてのイベントが自動的にこのURLに送信されます：

```typescript
// Webhookハンドラーの実装
app.post('/webhook', async (req, res) => {
  const { type, payload } = req.body;

  switch (type) {
    case 'deployment.created':
      await handleDeploymentCreated(payload);
      break;
    case 'deployment.succeeded':
      await handleDeploymentSucceeded(payload);
      break;
    case 'integration-configuration.removed':
      await handleConfigurationRemoved(payload);
      break;
  }

  res.status(200).json({ received: true });
});
```

## 外部フローの使用

インテグレーションがOAuth2インストールフローを使用している場合、[外部インストールフロー](/docs/integrations/create-integration/submit-integration#external-installation-flow)を使用してください。外部フローを使用することで、ユーザーはVercelスコープ（個人アカウントまたはチーム）を選択してインテグレーションをインストールできます。

### 外部フローへの移行

**以前の方法**（内部フロー）:
- すべての設定がVercel内で完了
- 限定的なカスタマイズオプション

**新しい方法**（外部フロー）:

1. リダイレクトURLを設定：

```
https://your-integration.com/callback
```

2. OAuth2フローを実装：

```typescript
// ステップ1: Vercelからのコールバックを処理
app.get('/callback', async (req, res) => {
  const { code, state, teamId } = req.query;

  // ステップ2: コードをアクセストークンに交換
  const tokenResponse = await fetch('https://api.vercel.com/v2/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      redirect_uri: 'https://your-integration.com/callback',
    }),
  });

  const { access_token } = await tokenResponse.json();

  // ステップ3: アクセストークンを保存
  await saveAccessToken(teamId || userId, access_token);

  // ステップ4: ユーザーを設定ページにリダイレクト
  res.redirect('https://your-integration.com/setup');
});
```

## 独自UIの使用

UI Hooksは、Vercelダッシュボード内でインテグレーションのカスタムUIを表示する方法として廃止されました。代わりに、独自のUIをホストし、ユーザーをそこにリダイレクトしてください。

### UI Hooksからの移行

**以前の方法**（UI Hooks - 廃止）:
```typescript
{
  "uiHooks": [
    {
      "type": "configuration",
      "src": "https://your-integration.com/ui-hook"
    }
  ]
}
```

**新しい方法**（独自UI）:

1. 独自の設定UIをホスト：

```typescript
// 設定ページ
app.get('/configuration', async (req, res) => {
  const { teamId, configurationId } = req.query;

  // 設定UIをレンダリング
  res.render('configuration', {
    teamId,
    configurationId
  });
});
```

2. インテグレーション設定で設定URLを指定：

```
Configuration URL: https://your-integration.com/configuration
```

## デプロイメントアクションAPIの使用

デプロイメント時に自動化されたタスクを実行するために、[デプロイメントアクションAPI](/docs/integrations/create-integration/deployment-integration-action)を使用してください。

### デプロイメントアクションの実装

```typescript
// アクションの宣言
{
  "actions": [
    {
      "id": "run-tests",
      "name": "テストを実行",
      "description": "デプロイメント後に自動テストを実行します",
      "type": "deployment",
      "triggers": ["deployment.created"],
      "configuration": {
        "testSuite": {
          "type": "string",
          "description": "実行するテストスイート",
          "default": "all"
        }
      }
    }
  ]
}
```

## マーケットプレイスAPI v2の使用

ネイティブインテグレーションの場合、[マーケットプレイスAPI v2](/docs/integrations/marketplace-api)を使用してください。これにより、リソースのプロビジョニング、課金、環境変数の管理が改善されます。

### マーケットプレイスAPI v2への移行

**主な改善点**:
- より明確なリソースライフサイクル管理
- 改善された課金とメータリング
- 環境変数の自動管理
- デプロイメントアクションのサポート

**実装例**:

```typescript
// リソースの作成
app.post('/marketplace/resources', async (req, res) => {
  const { teamId, installationId, productId, planId, configuration } = req.body;

  // リソースをプロビジョニング
  const resource = await provisionResource({
    teamId,
    productId,
    planId,
    configuration
  });

  // 環境変数を返す
  res.json({
    resourceId: resource.id,
    status: 'active',
    environmentVariables: [
      {
        key: 'DATABASE_URL',
        value: resource.connectionString,
        target: ['production', 'preview', 'development'],
        type: 'encrypted'
      }
    ]
  });
});
```

## アップグレードチェックリスト

インテグレーションをアップグレードする際、以下を確認してください：

- [ ] 汎用Webhookを実装
- [ ] 外部インストールフローに移行（該当する場合）
- [ ] UI Hooksから独自UIに移行（該当する場合）
- [ ] デプロイメントアクションAPIを実装（該当する場合）
- [ ] マーケットプレイスAPI v2を使用（ネイティブインテグレーションの場合）
- [ ] すべての廃止されたAPIエンドポイントを削除
- [ ] 新しいAPIで統合をテスト
- [ ] ドキュメントを更新
- [ ] ユーザーに変更を通知（必要な場合）

## サポート

アップグレードに関するサポートが必要な場合：

- [Vercel サポート](https://vercel.com/support)に連絡
- [統合ドキュメント](/docs/integrations)を確認
- [コミュニティフォーラム](https://github.com/vercel/vercel/discussions)で質問

## タイムライン

**廃止された機能の削除スケジュール**:
- UI Hooks: 2024年Q2
- Webhook API: 2024年Q3
- 内部インストールフロー: 2024年Q4

これらの日付までにアップグレードを完了してください。
