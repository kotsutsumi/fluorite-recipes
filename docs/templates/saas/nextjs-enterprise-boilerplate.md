# Next.js Enterprise Boilerplate

## 概要

Next.jsでエンタープライズアプリケーションを構築するための本番対応テンプレートです。

**デモ**: https://next-enterprise.vercel.app/
**GitHub**: https://github.com/Blazity/next-enterprise

## 主な機能

- Next.js 15とApp Directory
- Tailwind CSS v4
- 厳格な設定のTypeScript
- ESlint 9とPrettier
- 包括的なテストスイート(Vitest、React Testing Library、Playwright)
- コンポーネント開発用のStorybook
- GitHub Actionsワークフロー
- パフォーマンス最適化
- Radix UIコンポーネント
- Open Telemetryによる可観測性
- Renovate BOTによる自動依存関係更新

## 技術スタック

- **フレームワーク**: Next.js
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **テスト**: Vitest、Playwright
- **ドキュメント**: Storybook
- **UIコンポーネント**: Radix UI

## はじめに

### 前提条件

- Node.js 18以降
- pnpm(推奨)

### プロジェクトのクローン

```bash
git clone https://github.com/Blazity/next-enterprise.git
cd next-enterprise
```

### 依存関係のインストール

```bash
pnpm install
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## スクリプト

### 開発

```bash
pnpm dev          # 開発サーバーを起動
pnpm build        # 本番ビルド
pnpm start        # 本番サーバーを起動
```

### テスト

```bash
pnpm test         # ユニットテストを実行
pnpm test:e2e     # E2Eテストを実行
pnpm test:watch   # ウォッチモードでテストを実行
```

### リント&フォーマット

```bash
pnpm lint         # コードをリント
pnpm format       # コードをフォーマット
pnpm typecheck    # 型チェックを実行
```

### Storybook

```bash
pnpm storybook    # Storybookを起動
pnpm build-storybook # Storybookをビルド
```

## プロジェクト構造

```
.
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
├── lib/             # ユーティリティとヘルパー
├── public/          # 静的アセット
├── stories/         # Storybookストーリー
├── tests/           # テストファイル
│   ├── unit/        # ユニットテスト
│   └── e2e/         # E2Eテスト
└── types/           # TypeScript型定義
```

## 機能の詳細

### TypeScript厳格モード

厳格なTypeScript設定により、型安全性を確保:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

### テスト戦略

#### ユニットテスト(Vitest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

test('renders button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

#### E2Eテスト(Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Next.js Enterprise/)
})
```

### Storybook統合

コンポーネントを独立して開発およびドキュメント化:

```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Primary Button',
  },
}
```

### GitHub Actionsワークフロー

自動化されたCI/CDパイプライン:

- リントとフォーマットチェック
- 型チェック
- ユニットテスト
- E2Eテスト
- ビルド検証

### 可観測性

Open Telemetryによる包括的な可観測性:

- パフォーマンス監視
- エラートラッキング
- 分散トレーシング

## デプロイオプション

### Vercelへのデプロイ(推奨)

```bash
vercel deploy
```

### AWSへのデプロイ

カスタムクラウドインフラストラクチャでAWSサポートが利用可能です。

## カスタマイズ

### Tailwind CSSテーマ

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#your-color',
        },
      },
    },
  },
}
```

### 環境変数

`.env.local`ファイルを作成して環境変数を設定:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

## ベストプラクティス

- コンポーネントの共同配置
- 一貫した命名規則
- 包括的なテストカバレッジ
- 適切なエラー処理
- パフォーマンス最適化
- アクセシビリティ準拠

## メンテナンス

このボイラープレートはBlazityによってメンテナンスされており、エンタープライズグレードのアプリケーション開発に焦点を当てたアクティブな貢献者がいます。

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## ライセンス

MITライセンス
