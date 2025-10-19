# Deploy Hooks（デプロイフック）

HTTP POSTリクエストでデプロイメントをトリガーするURL。

## 概要

Deploy Hooksは、HTTP POSTリクエストを送信することでデプロイメントをトリガーできるURLです。外部システムやサービスとの統合に使用されます。

## 主な機能

### デプロイメントのトリガー

- 特定のプロジェクトブランチのデプロイメントをトリガー
- 新しいGitコミットなしでデプロイメント可能

### 統合シナリオ

```typescript
interface DeployHookUseCases {
  cms: 'ヘッドレスCMSのコンテンツ変更時';
  scheduled: 'サードパーティサービスによるスケジュールデプロイメント';
  cli: 'コマンドラインからの強制デプロイメント';
  webhook: '外部システムからのWebhook統合';
}
```

## Deploy Hookの作成

### 前提条件

プロジェクトがGitリポジトリに接続されている必要があります。

### 作成手順

1. **プロジェクト設定に移動**
   - プロジェクトダッシュボードを開く
   - **Settings** > **Git**メニューに移動

2. **Deploy Hookの設定**
   - **Deploy Hooks**セクションを見つける
   - **Create Hook**ボタンをクリック

3. **設定項目**
   ```typescript
   interface DeployHookConfig {
     name: string;          // フックの名前
     branch: string;        // ターゲットブランチ
   }
   ```

4. **URLの取得**
   - フックが作成されると、固有のURLが生成される
   - このURLを安全に保存

### 設定例

```
Hook Name: Content Update Hook
Branch: main
URL: https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY
```

## Deploy Hookのトリガー

### GETまたはPOSTリクエスト

GETまたはPOSTリクエストを生成されたURLに送信します。

### 認証不要

Deploy Hook URLには認証が組み込まれているため、追加の認証は不要です。

### curlを使用した例

```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_98g22o5YUFVHlKOzj9vKPTyN2SDG/tKybBxqhQs
```

### JavaScriptでの例

```javascript
// Node.js
const fetch = require('node-fetch');

async function triggerDeploy() {
  const hookUrl = 'https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY';

  try {
    const response = await fetch(hookUrl, { method: 'POST' });
    const data = await response.json();

    console.log('デプロイメントがトリガーされました:', data);
  } catch (error) {
    console.error('エラー:', error);
  }
}

triggerDeploy();
```

### Pythonでの例

```python
import requests

def trigger_deploy():
    hook_url = 'https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY'

    try:
        response = requests.post(hook_url)
        print('デプロイメントがトリガーされました:', response.json())
    except Exception as error:
        print('エラー:', error)

trigger_deploy()
```

## キャッシュの制御

### ビルドキャッシュの無効化

URLパラメータを使用して、ビルドキャッシュを無効にできます：

```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY?noCache=1"
```

### キャッシュ動作

```typescript
interface CacheBehavior {
  default: '自動ビルドキャッシュ';
  noCache: 'キャッシュなしで新規ビルド';
}
```

## 統合例

### ヘッドレスCMSとの統合

#### Contentful Webhook

```javascript
// Contentful Webhookハンドラー
app.post('/contentful-webhook', async (req, res) => {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK;

  // コンテンツが公開されたときのみデプロイ
  if (req.body.sys.type === 'Entry' && req.body.sys.publishedVersion) {
    await fetch(deployHookUrl, { method: 'POST' });
    res.json({ message: 'デプロイメントがトリガーされました' });
  } else {
    res.json({ message: 'デプロイメントはスキップされました' });
  }
});
```

#### Sanity Webhook

```javascript
// Sanity Webhookハンドラー
app.post('/sanity-webhook', async (req, res) => {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK;

  // ドキュメントが公開されたときのみデプロイ
  if (req.body.transition === 'update') {
    await fetch(deployHookUrl, { method: 'POST' });
    res.json({ status: 'success' });
  }
});
```

### スケジュールデプロイメント

#### GitHub Actionsでの定期デプロイ

```yaml
# .github/workflows/scheduled-deploy.yml
name: Scheduled Deploy

on:
  schedule:
    # 毎日午前9時（UTC）にデプロイ
    - cron: '0 9 * * *'

jobs:
  trigger-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Deploy Hook
        run: |
          curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK }}
```

#### Cron Jobでの定期デプロイ

```bash
# crontabエントリ
# 毎日午前2時にデプロイ
0 2 * * * curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY
```

### CI/CDパイプラインとの統合

```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - curl -X POST $VERCEL_DEPLOY_HOOK
  only:
    - main
```

## セキュリティと制限

### セキュリティのベストプラクティス

```typescript
interface SecurityPractices {
  treatAsPassword: 'Deploy Hook URLをパスワードとして扱う';
  useEnvironmentVariables: '環境変数に保存';
  revokable: '侵害された場合は取り消し可能';
  noPublicExposure: '公開リポジトリにコミットしない';
}
```

### URLの保護

1. **環境変数に保存**
   ```bash
   # .env.local
   VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY
   ```

2. **CI/CDシークレットとして設定**
   - GitHub Secrets
   - GitLab CI/CD Variables
   - その他のCI/CDプラットフォームのシークレット管理

3. **アクセス制限**
   - 必要なサービスとユーザーのみがアクセス

### Deploy Hookの制限

| プラン | プロジェクトあたりのDeploy Hook数 |
|--------|----------------------------------|
| Hobby / Pro | 5 |
| Enterprise | 10 |

### 取り消しと再作成

侵害された場合：

1. **既存のフックを削除**
   - Settings > Git > Deploy Hooks
   - 該当フックの削除ボタンをクリック

2. **新しいフックを作成**
   - 新しいURLが生成される
   - 統合を更新して新しいURLを使用

## デプロイメントの最適化

### 前回のデプロイメントのキャンセル

Deploy Hookは、同じバージョンの前回のデプロイメントを自動的にキャンセルして、ビルド時間を短縮します。

```typescript
interface OptimizationBehavior {
  cancelPrevious: true;
  reason: '同じバージョンの重複ビルドを避ける';
  benefit: 'ビルド時間の短縮とリソースの節約';
}
```

### ビルドキャッシュの活用

デフォルトで自動ビルドキャッシュが有効：

```bash
# キャッシュを使用（デフォルト）
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY

# キャッシュを無効化
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY?noCache=1"
```

## レスポンス

### 成功レスポンス

```json
{
  "job": {
    "id": "abc123",
    "state": "PENDING",
    "createdAt": 1234567890
  }
}
```

### エラーレスポンス

```json
{
  "error": {
    "code": "forbidden",
    "message": "Invalid deploy hook"
  }
}
```

## モニタリング

### デプロイメント状態の確認

1. **Vercelダッシュボード**
   - Deploymentsタブで最新のデプロイメント状態を確認

2. **Vercel API**
   ```bash
   curl -H "Authorization: Bearer $VERCEL_TOKEN" \
     https://api.vercel.com/v6/deployments
   ```

### ログの確認

```bash
vercel logs <deployment-url>
```

## トラブルシューティング

### Deploy Hookが機能しない

**問題:**
リクエストを送信してもデプロイメントが開始されない。

**解決策:**

1. **URLの確認**
   - Deploy Hook URLが正しいか確認
   - 完全なURLをコピー

2. **プロジェクトの接続確認**
   - プロジェクトがGitリポジトリに接続されているか確認

3. **ブランチの存在確認**
   - 指定したブランチが存在するか確認

4. **制限の確認**
   - プランの制限内でDeploy Hookを作成しているか確認

### デプロイメントが頻繁にトリガーされる

**問題:**
意図しないデプロイメントが多数発生する。

**解決策:**

1. **Webhookの設定を確認**
   - CMSやサードパーティサービスのWebhook設定を見直す

2. **条件分岐の追加**
   ```javascript
   // 特定の条件でのみデプロイ
   if (shouldDeploy(req.body)) {
     await fetch(deployHookUrl, { method: 'POST' });
   }
   ```

3. **レート制限の実装**
   ```javascript
   const rateLimit = require('express-rate-limit');

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15分
     max: 5 // 最大5リクエスト
   });

   app.post('/webhook', limiter, handleWebhook);
   ```

## ベストプラクティス

1. **環境変数の使用**
   - Deploy Hook URLを環境変数に保存

2. **条件付きトリガー**
   - 本当に必要なときのみデプロイメントをトリガー

3. **エラーハンドリング**
   - Deploy Hook呼び出しに適切なエラー処理を実装

4. **ログとモニタリング**
   - Deploy Hookの使用状況を記録

5. **セキュリティ**
   - URLを公開しない
   - 定期的にフックをローテーション

## 関連リンク

- [デプロイメント概要](/docs/deployments)
- [Git統合](/docs/git)
- [Vercel API](/docs/rest-api)
- [環境変数](/docs/environment-variables)
