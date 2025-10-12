# Jest

Next.jsアプリケーションでJestとReact Testing Libraryを使用してユニットテストとコンポーネントテストをセットアップする方法を学びます。

## Jestとは

JestはJavaScriptのテストフレームワークで、シンプルな設定で強力なテスト機能を提供します。Next.jsアプリケーションのユニットテストやコンポーネントテストに最適です。

## クイックスタート

### create-next-appを使用

Next.jsとJestの設定済みプロジェクトを作成できます:

```bash
npx create-next-app@latest --example with-jest with-jest-app
```

### 手動セットアップ

既存のNext.jsプロジェクトにJestを追加する場合:

#### 1. 依存関係のインストール

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# または
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# または
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

#### 2. Jest設定の生成

以下のコマンドでJestの基本設定を生成します:

```bash
npm init jest@latest
```

このコマンドは、プロジェクトに適した設定を対話的に作成します。

#### 3. next/jestを使用した設定

`jest.config.ts` または `jest.config.js` を以下のように更新します:

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // テスト環境におけるnext.config.jsとfont、外部CSSのインポートをロードするために、
  // Next.jsアプリへのパスを提供
  dir: './',
})

// Jestに渡すカスタム設定
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // 各テストの実行前にセットアップオプションを追加
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfigはこの方法でエクスポートされ、next/jestがNext.jsの設定を
// 非同期でロードできるようにします
export default createJestConfig(config)
```

`next/jest` は自動的に以下を設定します:

- `next.config.js` のTransform設定（SWCを使用）
- スタイルシート（`.css`、`.module.css`、scssバリアント）、画像インポート、`next/font` のモック
- `.env` ファイルからの環境変数のロード
- テスト解決とトランスフォームから `node_modules` を除外
- テスト解決から `.next` を除外
- SWCトランスフォームを有効にするフラグをロード

## テストの作成

### 基本的なテストの例

プロジェクトルートに `__tests__` フォルダを作成し、最初のテストを追加します:

```typescript
// __tests__/page.test.tsx
import { expect, test } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  test('見出しがレンダリングされる', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
```

### React Testing Libraryの使用

React Testing Libraryは、ユーザーの視点からコンポーネントをテストするためのユーティリティを提供します:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../components/Button'

describe('Button', () => {
  test('クリックイベントが発火する', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>クリック</Button>)

    const button = screen.getByRole('button', { name: /クリック/i })
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## オプション設定

### 絶対インポートとモジュールパスエイリアス

プロジェクトで絶対インポートやモジュールパスエイリアスを使用している場合、`jest.config.ts` の `moduleNameMapper` オプションを設定する必要があります:

```typescript
const config: Config = {
  // ...その他の設定
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
```

### カスタムマッチャーの追加

`@testing-library/jest-dom` は便利なカスタムマッチャーを提供します:

1. **jest.setup.tsファイルを作成:**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

2. **jest.configで参照:**

```typescript
const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // ...その他の設定
}
```

これにより、以下のようなマッチャーが使用できます:

```typescript
expect(element).toBeInTheDocument()
expect(element).toHaveClass('active')
expect(element).toBeVisible()
```

## テストの実行

### package.jsonにスクリプトを追加

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### テストの実行

```bash
# すべてのテストを実行
npm run test

# ウォッチモードで実行
npm run test:watch

# カバレッジレポートを生成
npm run test -- --coverage
```

## ベストプラクティス

### 1. テストの構造化

わかりやすいテスト構造を使用します:

```typescript
describe('コンポーネント名', () => {
  describe('機能や振る舞い', () => {
    test('期待される結果', () => {
      // テストコード
    })
  })
})
```

### 2. AAA パターン

テストを Arrange（準備）、Act（実行）、Assert（検証）の3つのセクションに分けます:

```typescript
test('ユーザー名が表示される', () => {
  // Arrange: テストデータとコンポーネントを準備
  const user = { name: '太郎' }
  render(<UserProfile user={user} />)

  // Act: 操作を実行（この例では不要）

  // Assert: 結果を検証
  expect(screen.getByText('太郎')).toBeInTheDocument()
})
```

### 3. データ属性の使用

セレクタには `data-testid` 属性を使用することを推奨します:

```typescript
// コンポーネント
<button data-testid="submit-button">送信</button>

// テスト
const button = screen.getByTestId('submit-button')
```

### 4. 非同期テスト

非同期操作をテストする場合は `waitFor` や `findBy` を使用します:

```typescript
import { waitFor, screen } from '@testing-library/react'

test('データが読み込まれる', async () => {
  render(<AsyncComponent />)

  await waitFor(() => {
    expect(screen.getByText('読み込み完了')).toBeInTheDocument()
  })
})
```

## 重要な注意事項

### Server Componentsの制限

Jestは現在、`async` なServer Componentsを完全にサポートしていません。Server Componentsをテストする場合は、E2Eテストの使用を推奨します。

### モックの使用

外部APIやモジュールをモックすることで、テストを高速かつ安定させることができます:

```typescript
// APIをモック
jest.mock('../lib/api', () => ({
  fetchUser: jest.fn(() => Promise.resolve({ name: '太郎' })),
}))

test('ユーザーデータが表示される', async () => {
  render(<UserComponent />)

  await waitFor(() => {
    expect(screen.getByText('太郎')).toBeInTheDocument()
  })
})
```

## カバレッジの設定

`jest.config.ts` でカバレッジ設定をカスタマイズできます:

```typescript
const config: Config = {
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

## リソース

- [Jest公式ドキュメント](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js with Jestの例](https://github.com/vercel/next.js/tree/canary/examples/with-jest)
- [Testing Library Playground](https://testing-playground.com/)
