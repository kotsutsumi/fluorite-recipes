# Playwright

Next.jsアプリケーションでPlaywrightを使用してEnd-to-End（E2E）テストをセットアップする方法を学びます。

## Playwrightとは

Playwrightは、Microsoft製のE2Eテストフレームワークで、Chromium、Firefox、WebKitなど複数のブラウザでのテストをサポートします。クロスブラウザテストに最適です。

## クイックスタート

### create-next-appを使用

最も簡単な方法は、Playwrightが設定済みのNext.jsプロジェクトを作成することです:

```bash
npx create-next-app@latest --example with-playwright with-playwright-app
```

### 手動セットアップ

既存のプロジェクトにPlaywrightを追加する場合:

```bash
npm init playwright
# または
yarn create playwright
# または
pnpm create playwright
```

このコマンドは対話的なセットアップウィザードを起動し、以下を設定します:

1. TypeScriptまたはJavaScriptの選択
2. テストフォルダの名前
3. GitHubアクションワークフローの追加オプション
4. ブラウザのインストール（Chromium、Firefox、WebKit）

## テストの作成

### サンプルページの作成

まず、テスト用の簡単なページを作成します:

#### ホームページ（`app/page.tsx`）

```typescript
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
    </div>
  )
}
```

#### Aboutページ（`app/about/page.tsx`）

```typescript
import Link from 'next/link'

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <Link href="/">Home</Link>
    </div>
  )
}
```

### テストの記述

`e2e/example.spec.ts` ファイルを作成し、ナビゲーションをテストします:

```typescript
import { test, expect } from '@playwright/test'

test('aboutページに遷移できる', async ({ page }) => {
  // ホームページから開始
  await page.goto('http://localhost:3000/')

  // "About"リンクをクリック
  await page.click('text=About')

  // 新しいURLを確認
  await expect(page).toHaveURL('http://localhost:3000/about')

  // 新しいページにh1タグがあり、"About"が含まれることを確認
  await expect(page.locator('h1')).toContainText('About')
})
```

### より複雑なテストの例

```typescript
import { test, expect } from '@playwright/test'

test.describe('ユーザー認証', () => {
  test('ログインフォームが動作する', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    // フォームに入力
    await page.fill('[data-testid="email"]', 'user@example.com')
    await page.fill('[data-testid="password"]', 'password123')

    // 送信ボタンをクリック
    await page.click('[data-testid="submit"]')

    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL('http://localhost:3000/dashboard')

    // ウェルカムメッセージを確認
    await expect(page.locator('h1')).toContainText('ようこそ')
  })

  test('無効な認証情報でエラーが表示される', async ({ page }) => {
    await page.goto('http://localhost:3000/login')

    await page.fill('[data-testid="email"]', 'wrong@example.com')
    await page.fill('[data-testid="password"]', 'wrongpassword')
    await page.click('[data-testid="submit"]')

    // エラーメッセージを確認
    await expect(page.locator('[role="alert"]')).toContainText(
      'メールアドレスまたはパスワードが正しくありません'
    )
  })
})
```

## テストの実行

### 開発環境でのテスト

1. **アプリケーションをビルドして起動:**

```bash
npm run build
npm run start
```

> **注意**: 開発サーバー（`npm run dev`）ではなく、本番ビルド（`npm run start`）に対してテストを実行することを推奨します。

2. **別のターミナルでPlaywrightを実行:**

```bash
npx playwright test
```

### UIモードでのテスト

Playwrightは、テストを視覚的に実行できるUIモードを提供します:

```bash
npx playwright test --ui
```

### 特定のテストの実行

```bash
# 特定のファイル
npx playwright test e2e/example.spec.ts

# 特定のテスト
npx playwright test -g "aboutページに遷移できる"
```

### ブラウザ指定

```bash
# Chromiumのみ
npx playwright test --project=chromium

# すべてのブラウザ
npx playwright test --project=chromium --project=firefox --project=webkit
```

## Playwright設定

`playwright.config.ts` ファイルで設定をカスタマイズできます:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // テストの最大実行時間
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  // 本番ビルドに対してテストを実行
  fullyParallel: true,
  // CIでの再試行
  retries: process.env.CI ? 2 : 0,
  // CIでのワーカー数
  workers: process.env.CI ? 1 : undefined,
  // レポーター
  reporter: 'html',
  use: {
    // すべてのテストのベースURL
    baseURL: 'http://localhost:3000',
    // 失敗時のスクリーンショット
    screenshot: 'only-on-failure',
    // トレースの記録
    trace: 'retain-on-failure',
  },
  // 複数のブラウザで実行
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // モバイルビューポート
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  // テスト前にサーバーを起動
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Continuous Integration

### GitHub Actions

`.github/workflows/playwright.yml` を作成:

```yaml
name: Playwright Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Build Next.js app
        run: npm run build
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### ブラウザのインストール

CI環境では、Playwrightのブラウザを明示的にインストールする必要があります:

```bash
npx playwright install --with-deps
```

## ベストプラクティス

### 1. ページオブジェクトモデル

共通の操作をページオブジェクトにまとめます:

```typescript
// e2e/pages/login.page.ts
import { Page } from '@playwright/test'

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email)
    await this.page.fill('[data-testid="password"]', password)
    await this.page.click('[data-testid="submit"]')
  }
}

// テストで使用
import { LoginPage } from './pages/login.page'

test('ログイン', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('user@example.com', 'password')
})
```

### 2. テストの分離

各テストは独立して実行できるようにします:

```typescript
test.beforeEach(async ({ page }) => {
  // 各テスト前にクリーンな状態を作成
  await page.goto('/')
})

test.afterEach(async ({ page }) => {
  // テスト後のクリーンアップ
  await page.context().clearCookies()
})
```

### 3. 待機戦略

要素が表示されるまで待機します:

```typescript
// 要素が表示されるまで待機
await page.waitForSelector('[data-testid="content"]', { state: 'visible' })

// ネットワークがアイドル状態になるまで待機
await page.waitForLoadState('networkidle')
```

### 4. スクリーンショットとビデオ

デバッグ用にスクリーンショットとビデオを記録:

```typescript
// playwright.config.ts
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

## APIテスト

PlaywrightはAPIテストもサポートしています:

```typescript
import { test, expect } from '@playwright/test'

test('APIエンドポイントが動作する', async ({ request }) => {
  const response = await request.get('http://localhost:3000/api/users')

  expect(response.ok()).toBeTruthy()
  expect(response.status()).toBe(200)

  const data = await response.json()
  expect(data).toHaveLength(10)
})
```

## リソース

- [Playwright公式ドキュメント](https://playwright.dev/docs/intro)
- [Next.js with Playwrightの例](https://github.com/vercel/next.js/tree/canary/examples/with-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Discord](https://discord.com/invite/playwright)
