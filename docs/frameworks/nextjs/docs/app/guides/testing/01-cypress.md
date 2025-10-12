# Cypress

Next.jsアプリケーションでCypressを使用してEnd-to-End（E2E）テストとコンポーネントテストをセットアップする方法を学びます。

## Cypressとは

Cypressは、モダンなWebアプリケーション向けのテストフレームワークです。E2Eテストとコンポーネントテストの両方をサポートし、ブラウザ内で実際のユーザーインタラクションをシミュレートします。

## クイックスタート

### create-next-appを使用

最も簡単な方法は、Cypressが設定済みのNext.jsプロジェクトを作成することです:

```bash
npx create-next-app@latest --example with-cypress with-cypress-app
```

このコマンドは、Cypressがすでに設定されたNext.jsプロジェクトを作成します。

### 手動セットアップ

既存のプロジェクトにCypressを追加する場合:

1. **Cypressをインストール:**

```bash
npm install -D cypress
# または
pnpm add -D cypress
# または
yarn add -D cypress
```

2. **package.jsonにスクリプトを追加:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "cypress:open": "cypress open"
  }
}
```

3. **Cypressを初めて実行:**

```bash
npm run cypress:open
```

このコマンドは、Cypressの設定ファイルとフォルダ構造を自動的に作成します。

## テストタイプ

Cypressは2つの主要なテストタイプをサポートしています:

### 1. End-to-Endテスト

E2Eテストは、実際のブラウザ環境でアプリケーション全体をテストします。

#### E2Eテストの例

`cypress/e2e/navigation.cy.ts` ファイルを作成:

```typescript
describe('ナビゲーション', () => {
  it('aboutページに遷移できる', () => {
    // トップページから開始
    cy.visit('http://localhost:3000/')

    // "about"を含むhref属性を持つリンクを見つけてクリック
    cy.get('a[href*="about"]').click()

    // 新しいURLに "/about" が含まれていることを確認
    cy.url().should('include', '/about')

    // 新しいページに h1 タグが含まれ、"About"というテキストがあることを確認
    cy.get('h1').contains('About')
  })
})
```

#### E2Eテストの実行

E2Eテストを実行する前に、開発サーバーを起動する必要があります:

```bash
# 開発サーバーを起動
npm run dev

# 別のターミナルでCypressを起動
npm run cypress:open
```

### 2. コンポーネントテスト

コンポーネントテストは、個別のコンポーネントを分離してテストします。アプリケーション全体をバンドルしたり、サーバーを起動したりする必要がありません。

#### コンポーネントテストの設定

Cypressでコンポーネントテストを有効にするには、`cypress.config.ts` に以下の設定を追加します:

```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

#### コンポーネントテストの例

`app/page.cy.tsx` ファイルを作成:

```typescript
import React from 'react'
import Page from './page'

describe('<Page />', () => {
  it('レンダリングされ、期待されるコンテンツが表示される', () => {
    // Pageコンポーネントをマウント
    cy.mount(<Page />)

    // h1タグに "Home" が含まれることを確認
    cy.get('h1').contains('Home')

    // aboutページへのリンクが表示されることを確認
    cy.get('a[href="/about"]').should('be.visible')
  })
})
```

## 重要な注意事項

### TypeScript互換性

Cypress 13.6.3より前のバージョンでは、TypeScriptの `moduleResolution: "bundler"` 設定との互換性に問題があります。

この問題を解決するには:

1. Cypressを最新バージョンにアップグレード（推奨）
2. または、`tsconfig.json` を以下のように設定:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    // ...その他の設定
  }
}
```

### Server Componentsの制限

Cypressのコンポーネントテストは、現在 `async` なServer Componentsをサポートしていません。E2Eテストの使用を推奨します。

### 本番コードに対するテスト

本番ビルドに対してテストを実行することを推奨します。これにより、本番環境での動作をより正確にテストできます:

```bash
# 本番ビルドを作成
npm run build

# 本番サーバーを起動
npm run start

# 別のターミナルでCypressを実行
npm run cypress:open
```

## Continuous Integration

CI環境でCypressをヘッドレスモードで実行するには:

1. **package.jsonにスクリプトを追加:**

```json
{
  "scripts": {
    "e2e": "start-server-and-test dev http://localhost:3000 \"cypress open --e2e\"",
    "e2e:headless": "start-server-and-test dev http://localhost:3000 \"cypress run --e2e\"",
    "component": "cypress open --component",
    "component:headless": "cypress run --component"
  }
}
```

2. **start-server-and-testをインストール:**

```bash
npm install -D start-server-and-test
```

3. **CIでヘッドレステストを実行:**

```bash
npm run e2e:headless
npm run component:headless
```

## Cypressの設定例

完全な `cypress.config.ts` の例:

```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // イベントリスナーを実装
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

## ベストプラクティス

### 1. テストの分離

各テストは独立して実行できるようにします。他のテストに依存しないようにしましょう。

### 2. データ属性の使用

セレクタにはCSSクラスではなく、`data-testid` 属性を使用することを推奨します:

```typescript
// コンポーネント
<button data-testid="submit-button">送信</button>

// テスト
cy.get('[data-testid="submit-button"]').click()
```

### 3. カスタムコマンド

繰り返し使用する操作はカスタムコマンドとして定義できます:

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="password"]').type(password)
  cy.get('[data-testid="submit"]').click()
})

// テストで使用
cy.login('user@example.com', 'password123')
```

## リソース

- [Cypress公式ドキュメント](https://docs.cypress.io/)
- [Next.js with Cypressの例](https://github.com/vercel/next.js/tree/canary/examples/with-cypress)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Discord](https://discord.com/invite/cypress)
