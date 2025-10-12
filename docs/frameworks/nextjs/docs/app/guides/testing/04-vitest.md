# Vitest

Next.jsアプリケーションでVitestとReact Testing Libraryを使用してユニットテストをセットアップする方法を学びます。

## Vitestとは

VitestはViteをベースにした高速なユニットテストフレームワークです。Jestと互換性のあるAPIを提供しながら、より高速な実行速度を実現します。

## クイックスタート

### create-next-appを使用

Vitestが設定済みのNext.jsプロジェクトを作成できます:

```bash
npx create-next-app@latest --example with-vitest with-vitest-app
```

### 手動セットアップ

既存のNext.jsプロジェクトにVitestを追加する場合:

#### 1. 依存関係のインストール

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
# または
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
# または
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

TypeScriptのパスエイリアスを使用している場合は、`vite-tsconfig-paths` も追加します:

```bash
npm install -D vite-tsconfig-paths
```

#### 2. Vitest設定ファイルの作成

プロジェクトルートに `vitest.config.mts` ファイルを作成します:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
  },
})
```

#### 3. package.jsonにスクリプトを追加

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest"
  }
}
```

## テストの作成

### 最初のテスト

`__tests__` フォルダを作成し、最初のテストを追加します:

```typescript
// __tests__/page.test.tsx
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
```

### コンポーネントテストの例

```typescript
// __tests__/Button.test.tsx
import { expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../components/Button'

test('ボタンをクリックするとハンドラが呼ばれる', () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>クリック</Button>)

  const button = screen.getByRole('button', { name: /クリック/i })
  fireEvent.click(button)

  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### 非同期テストの例

```typescript
import { expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import UserProfile from '../components/UserProfile'

test('ユーザーデータが読み込まれる', async () => {
  render(<UserProfile userId="123" />)

  // 読み込み中の表示を確認
  expect(screen.getByText('読み込み中...')).toBeDefined()

  // データが表示されるまで待機
  await waitFor(() => {
    expect(screen.getByText('太郎')).toBeDefined()
  })
})
```

## テストの実行

### 基本的な実行コマンド

```bash
# すべてのテストを実行
npm run test

# ウォッチモードで実行（ファイル変更時に自動再実行）
npm run test -- --watch

# UIモードで実行
npm run test -- --ui

# カバレッジレポートを生成
npm run test -- --coverage
```

### 特定のテストの実行

```bash
# 特定のファイル
npm run test __tests__/page.test.tsx

# 特定のテスト名にマッチ
npm run test -t "ボタンをクリック"
```

## カバレッジの設定

カバレッジレポートを有効にするには、追加の依存関係をインストールします:

```bash
npm install -D @vitest/coverage-v8
```

`vitest.config.mts` にカバレッジ設定を追加:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.config.*',
        '**/node_modules/**',
        '**/.next/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

## オプション設定

### カスタムマッチャーの追加

`@testing-library/jest-dom` のマッチャーを使用するには:

1. **依存関係をインストール:**

```bash
npm install -D @testing-library/jest-dom
```

2. **セットアップファイルを作成:**

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
```

3. **vitest.configで参照:**

```typescript
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

これにより、以下のようなマッチャーが使用できます:

```typescript
expect(element).toBeInTheDocument()
expect(element).toHaveClass('active')
expect(element).toBeVisible()
```

### グローバル設定

グローバルに `describe`、`test`、`expect` を使用したい場合:

```typescript
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

これにより、インポートなしで使用できます:

```typescript
// import { describe, test, expect } from 'vitest' が不要
describe('MyComponent', () => {
  test('renders correctly', () => {
    expect(true).toBe(true)
  })
})
```

## モックの使用

### モジュールのモック

```typescript
import { vi } from 'vitest'

// APIをモック
vi.mock('../lib/api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ name: '太郎' })),
}))

test('ユーザーデータが表示される', async () => {
  render(<UserComponent />)

  await waitFor(() => {
    expect(screen.getByText('太郎')).toBeDefined()
  })
})
```

### 環境変数のモック

```typescript
import { vi } from 'vitest'

test('API URLを使用する', () => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://api.example.com')

  // テストコード
})
```

### タイマーのモック

```typescript
import { vi } from 'vitest'

test('タイマーが動作する', () => {
  vi.useFakeTimers()

  const callback = vi.fn()
  setTimeout(callback, 1000)

  // 1秒進める
  vi.advanceTimersByTime(1000)

  expect(callback).toHaveBeenCalledTimes(1)

  vi.useRealTimers()
})
```

## ベストプラクティス

### 1. テストの構造化

```typescript
import { describe, test, expect } from 'vitest'

describe('UserProfile コンポーネント', () => {
  describe('ログイン時', () => {
    test('ユーザー名が表示される', () => {
      // テストコード
    })

    test('ログアウトボタンが表示される', () => {
      // テストコード
    })
  })

  describe('未ログイン時', () => {
    test('ログインボタンが表示される', () => {
      // テストコード
    })
  })
})
```

### 2. テストヘルパーの作成

繰り返し使用するロジックをヘルパー関数にまとめます:

```typescript
// test-utils.tsx
import { render } from '@testing-library/react'
import { ReactElement } from 'react'
import { ThemeProvider } from '../context/ThemeContext'

export function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

// テストで使用
test('テーマが適用される', () => {
  renderWithTheme(<MyComponent />)
  // ...
})
```

### 3. データテストID

セレクタには `data-testid` 属性を使用:

```typescript
// コンポーネント
<button data-testid="submit-button">送信</button>

// テスト
const button = screen.getByTestId('submit-button')
```

## 重要な注意事項

### Server Componentsの制限

Vitestは現在、`async` なServer Componentsを完全にサポートしていません。Server Componentsをテストする場合は、E2Eテスト（PlaywrightやCypress）の使用を推奨します。

### Next.js機能との互換性

一部のNext.js固有の機能（例: `next/image`、`next/router`）をテストする場合、モックが必要になる場合があります:

```typescript
// next/imageのモック
vi.mock('next/image', () => ({
  default: (props: any) => {
    return <img {...props} />
  },
}))
```

## UIモード

Vitestは視覚的なUIモードを提供します:

```bash
npm run test -- --ui
```

これにより、ブラウザでテスト結果を確認し、インタラクティブにテストを実行できます。

## Continuous Integration

### GitHub Actions

`.github/workflows/test.yml` を作成:

```yaml
name: Vitest Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test
      - name: Generate coverage
        run: npm run test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## リソース

- [Vitest公式ドキュメント](https://vitest.dev/)
- [Next.js with Vitestの例](https://github.com/vercel/next.js/tree/canary/examples/with-vitest)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest UI](https://vitest.dev/guide/ui.html)
