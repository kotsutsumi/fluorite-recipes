# Vercel デプロイメント保護のバイパス（自動化用）

## 概要

Vercelのデプロイメント保護バイパス機能は、E2Eテストやその他の自動化ツール用に設計された機能で、以下の保護方法をスキップできます：

- パスワード保護
- Vercel認証
- 信頼できるIP

### 対象プラン

すべてのVercelプランで利用可能

## 対象ユーザー

以下のロールを持つユーザーが自動化バイパスシークレットを管理できます：

- チームメンバー（少なくともメンバーロール）
- プロジェクト管理者

## 使用方法

### 基本的な使用方法

自動化ツール用に生成されたシークレットを、ヘッダーまたはクエリパラメータとして送信します。

#### ヘッダーとして送信

```
x-vercel-protection-bypass: your-generated-secret
```

#### クエリパラメータとして送信

```
https://your-deployment.vercel.app?x-vercel-protection-bypass=your-generated-secret
```

### 高度な設定

#### フォローアップリクエストの認証バイパス

最初のリクエストでバイパスCookieを設定すると、同じセッション内の後続のリクエストで再度シークレットを送信する必要がなくなります：

```
x-vercel-set-bypass-cookie: true
```

**注意**: このヘッダーは、最初のリクエストでのみ必要です。

## シークレットの生成

### ダッシュボードから生成

1. Vercelダッシュボードからプロジェクトを選択
2. 「設定」タブに移動
3. 「デプロイメント保護」セクションを選択
4. 「自動化バイパス」セクションを見つける
5. 「シークレットを生成」ボタンをクリック
6. 生成されたシークレットをコピーして安全に保管

### APIから生成

```bash
curl -X POST "https://api.vercel.com/v1/projects/PROJECT_ID/deployment-protection/bypass" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**レスポンス**:
```json
{
  "id": "bypass_xxxxxxxxxxxxx",
  "secret": "your-generated-secret",
  "createdAt": 1234567890000
}
```

## 実装例

### Playwright での使用

```typescript
import { defineConfig, devices } from '@playwright/test';

const config = defineConfig({
  use: {
    baseURL: 'https://your-deployment.vercel.app',
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
      'x-vercel-set-bypass-cookie': 'true', // オプション
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

export default config;
```

### Cypress での使用

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://your-deployment.vercel.app',
    setupNodeEvents(on, config) {
      // 環境変数からシークレットを取得
      config.env.bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
      return config;
    },
  },
});

// cypress/support/e2e.js
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const bypassSecret = Cypress.env('bypassSecret');

  return originalFn(url, {
    ...options,
    headers: {
      ...options?.headers,
      'x-vercel-protection-bypass': bypassSecret,
      'x-vercel-set-bypass-cookie': 'true',
    },
  });
});
```

### Puppeteer での使用

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // カスタムヘッダーを設定
  await page.setExtraHTTPHeaders({
    'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
    'x-vercel-set-bypass-cookie': 'true',
  });

  await page.goto('https://your-deployment.vercel.app');

  // テストを実行
  // ...

  await browser.close();
})();
```

### fetch API での使用

```javascript
const response = await fetch('https://your-deployment.vercel.app/api/data', {
  headers: {
    'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
    'x-vercel-set-bypass-cookie': 'true',
  },
});

const data = await response.json();
```

### cURL での使用

```bash
curl -H "x-vercel-protection-bypass: your-generated-secret" \
     -H "x-vercel-set-bypass-cookie: true" \
     https://your-deployment.vercel.app
```

## シークレットの管理

### 環境変数として保管

シークレットは、環境変数として保管することを強く推奨します：

#### ローカル開発

```bash
# .env.local
VERCEL_AUTOMATION_BYPASS_SECRET=your-generated-secret
```

#### CI/CD環境

各CI/CDプロバイダの環境変数設定で、シークレットを設定します：

**GitHub Actions**:
```yaml
# .github/workflows/test.yml
name: E2E Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        env:
          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
        run: npm run test:e2e
```

**GitLab CI**:
```yaml
# .gitlab-ci.yml
test:
  script:
    - npm run test:e2e
  variables:
    VERCEL_AUTOMATION_BYPASS_SECRET: $VERCEL_AUTOMATION_BYPASS_SECRET
```

### シークレットのローテーション

定期的にシークレットをローテーションすることを推奨します：

1. 新しいシークレットを生成
2. CI/CD環境の環境変数を更新
3. 古いシークレットを削除

**注意**: シークレットを再生成すると、以前のシークレットは無効化されます。

## トラブルシューティング

### 問題1: シークレットが機能しない

**確認事項**:
- [ ] シークレットが正しく設定されているか
- [ ] ヘッダー名が正確か（`x-vercel-protection-bypass`）
- [ ] シークレットが再生成されていないか
- [ ] リクエストがHTTPSを使用しているか

**解決策**:
```javascript
// デバッグ用にヘッダーを確認
console.log('Bypass Secret:', process.env.VERCEL_AUTOMATION_BYPASS_SECRET);
```

### 問題2: 一部のリクエストでバイパスが機能しない

**原因**: フォローアップリクエストでシークレットが送信されていない

**解決策**:
1. `x-vercel-set-bypass-cookie: true`を使用してCookieを設定
2. または、すべてのリクエストでシークレットを送信

### 問題3: CI/CDでテストが失敗する

**確認事項**:
- [ ] 環境変数が正しく設定されているか
- [ ] CI/CD環境でシークレットにアクセスできるか
- [ ] ネットワーク設定でHTTPSが許可されているか

**解決策**:
```bash
# CI/CD環境で環境変数を確認
echo $VERCEL_AUTOMATION_BYPASS_SECRET
```

## セキュリティベストプラクティス

### 1. シークレットの保護

- **絶対に**シークレットをコードにハードコードしない
- 環境変数または秘密管理ツールで管理
- `.gitignore`に`.env.local`を追加

```gitignore
# .gitignore
.env.local
.env*.local
```

### 2. アクセス制御

- シークレットへのアクセスを最小限のユーザーに制限
- 定期的にアクセス権限を確認
- 退職者のアクセスを即座に削除

### 3. 監査とモニタリング

- アクティビティログでシークレットの使用を追跡
- 異常なアクセスパターンを監視
- 定期的にログを確認

### 4. シークレットのローテーション

- 定期的（例：90日ごと）にシークレットをローテーション
- セキュリティインシデント発生時は即座にローテーション
- 古いシークレットは使用されなくなったら削除

## ユースケース

### 1. E2Eテスト

プレビューデプロイメントでE2Eテストを実行：

```yaml
# .github/workflows/e2e.yml
name: E2E Tests
on: [deployment_status]
jobs:
  e2e:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run E2E tests
        env:
          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
          DEPLOYMENT_URL: ${{ github.event.deployment_status.target_url }}
        run: npm run test:e2e
```

### 2. ビジュアルリグレッションテスト

スクリーンショット比較テスト：

```javascript
// chromatic.config.js
module.exports = {
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN,
  buildScriptName: 'build-storybook',
  onlyChanged: true,
  exitZeroOnChanges: true,
  // Vercelデプロイメント保護をバイパス
  manuallySetRequestHeaders: {
    'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
  },
};
```

### 3. パフォーマンステスト

Lighthouseを使用したパフォーマンステスト：

```javascript
// lighthouse.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    port: chrome.port,
    extraHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET,
    },
  };

  const runnerResult = await lighthouse(url, options);

  await chrome.kill();

  return runnerResult.lhr;
}

runLighthouse('https://your-deployment.vercel.app');
```

## 追加情報

### 生成されるシークレットの特徴

- ランダムに生成された一意の文字列
- プロジェクトごとに複数のシークレットを生成可能
- シークレットに有効期限はありません（手動で削除するまで有効）

### 適用範囲

- プロジェクトのすべてのデプロイメント（プレビュー、本番）に適用
- すべてのデプロイメント保護方法をバイパス

### 制限事項

- シークレットは再利用可能（使い捨てではない）
- シークレットを知っている人は誰でもデプロイメントにアクセス可能

## 関連リソース

- [デプロイメント保護](/docs/deployment-protection)
- [デプロイメント保護のバイパス方法](/docs/deployment-protection/methods-to-bypass-deployment-protection)
- [Playwright公式ドキュメント](https://playwright.dev/)
- [Cypress公式ドキュメント](https://www.cypress.io/)
- [環境変数](/docs/environment-variables)
