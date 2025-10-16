# モノレポ

## はじめに

これまで、shadcn/uiをモノレポで使用することは少し難しいものでした。コンポーネントをCLIで追加できましたが、コンポーネントのインストール場所を管理し、インポートパスを手動で修正する必要がありました。

新しいCLIのモノレポサポートにより、shadcn/uiをモノレポで使用することがずっと簡単になりました。

CLIはモノレポの構造を理解し、コンポーネント、依存関係、レジストリ依存関係を正しいパスにインストールし、インポートを自動的に処理します。

## モノレポの利点

### コード共有
複数のアプリケーション間でコンポーネントとユーティリティを共有できます。

### 一貫性
デザインシステムとUIコンポーネントを組織全体で統一できます。

### 保守性
1つの場所でコンポーネントを更新すると、すべてのアプリに反映されます。

### 型安全性
TypeScriptの型定義をワークスペース間で共有できます。

## モノレポプロジェクトの開始

### 新しいモノレポプロジェクトの作成

新しいモノレポプロジェクトを作成するには、`init`コマンドを実行します。プロジェクトの種類を選択するよう求められます。

```bash
pnpm dlx shadcn@canary init
```

プロンプトで`Next.js (Monorepo)`オプションを選択します。

これにより、以下のような構造のモノレポプロジェクトが作成されます：

```
my-monorepo/
├── apps/
│   └── web/              # Next.jsアプリケーション
│       ├── app/
│       ├── components/
│       └── package.json
├── packages/
│   └── ui/               # 共有UIコンポーネント
│       ├── components/
│       ├── lib/
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

このセットアップでは：
- **apps/web:** メインのNext.jsアプリケーション
- **packages/ui:** 共有UIコンポーネントパッケージ
- [Turborepo](https://turbo.build/repo/docs) をビルドシステムとして使用
- React 19とTailwind CSS v4を使用

すべてが自動的に設定されるので、プロジェクトにコンポーネントを追加できます。

### 既存のモノレポへの追加

既存のモノレポがある場合は、各ワークスペースで個別に`init`コマンドを実行できます：

```bash
# アプリディレクトリに移動
cd apps/web

# shadcn/uiを初期化
pnpm dlx shadcn@canary init
```

## プロジェクトへのコンポーネントの追加

コンポーネントを追加するには、**アプリまたはパッケージのパス内で**`add`コマンドを実行します。

### アプリへのコンポーネント追加

```bash
# アプリディレクトリに移動
cd apps/web

# コンポーネントを追加
pnpm dlx shadcn@canary add button
```

### 共有パッケージへのコンポーネント追加

```bash
# パッケージディレクトリに移動
cd packages/ui

# コンポーネントを追加
pnpm dlx shadcn@canary add button
```

CLIは自動的に：
1. 正しい場所にコンポーネントをインストール
2. 必要な依存関係を適切な`package.json`に追加
3. インポートパスを正しく設定

## モノレポ構造の例

### Turborepo + pnpm

```
my-project/
├── apps/
│   ├── web/                    # Next.js Webアプリ
│   │   ├── app/
│   │   ├── components/
│   │   ├── package.json
│   │   └── components.json
│   └── mobile/                 # React Nativeアプリ
│       ├── src/
│       ├── package.json
│       └── components.json
├── packages/
│   ├── ui/                     # 共有UIコンポーネント
│   │   ├── components/
│   │   ├── lib/
│   │   ├── package.json
│   │   └── components.json
│   └── config/                 # 共有設定
│       ├── tailwind/
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Yarn Workspaces

```
my-project/
├── apps/
│   └── dashboard/
│       └── components.json
├── packages/
│   └── ui/
│       └── components.json
├── package.json
└── yarn.lock
```

### npm Workspaces

```
my-project/
├── apps/
│   └── admin/
│       └── components.json
├── packages/
│   └── components/
│       └── components.json
└── package.json
```

## ワークスペース設定

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### package.json（Yarn/npm）

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

## 共有コンポーネントパッケージ

### packages/ui/package.json

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./components/*": "./components/*.tsx",
    "./lib/*": "./lib/*.ts"
  },
  "dependencies": {
    "react": "^19.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### packages/ui/components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "rsc": true,
  "tsx": true,
  "aliases": {
    "components": "@repo/ui/components",
    "utils": "@repo/ui/lib/utils"
  }
}
```

## アプリからの使用

### apps/web/app/page.tsx

```typescript
import { Button } from "@repo/ui/components/button"
import { Card } from "@repo/ui/components/card"

export default function Page() {
  return (
    <div>
      <Card>
        <Button>クリック</Button>
      </Card>
    </div>
  )
}
```

### apps/web/package.json

```json
{
  "name": "web",
  "dependencies": {
    "@repo/ui": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0"
  }
}
```

## Tailwind CSS設定の共有

### packages/config/tailwind/index.ts

```typescript
import type { Config } from "tailwindcss"

export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
```

### apps/web/tailwind.config.ts

```typescript
import baseConfig from "@repo/config/tailwind"
import type { Config } from "tailwindcss"

export default {
  ...baseConfig,
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/components/**/*.{ts,tsx}",
  ],
} satisfies Config
```

## TypeScript設定の共有

### packages/config/typescript/base.json

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### apps/web/tsconfig.json

```json
{
  "extends": "@repo/config/typescript/base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## ビルドシステム

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

### package.json（ルート）

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  }
}
```

## ベストプラクティス

### 1. 依存関係管理
共有依存関係はルートの`package.json`で管理します。

### 2. バージョン同期
すべてのワークスペースで同じバージョンのReactとTailwindを使用します。

### 3. 型定義の共有
共通の型定義を`packages/types`などで共有します。

### 4. コンポーネントのドキュメント化
共有コンポーネントには適切なドキュメントを作成します。

### 5. テスト
共有コンポーネントには包括的なテストを書きます。

## トラブルシューティング

### インポートエラー
- ワークスペースが正しく設定されているか確認
- `package.json`の`exports`フィールドを確認
- TypeScriptの`paths`設定を確認

### スタイリング問題
- Tailwind設定のcontentパスが正しいか確認
- CSSファイルが正しくインポートされているか確認

### ビルドエラー
- 依存関係が正しくインストールされているか確認
- ビルド順序が正しいか確認（Turborepо pipeline）

## 参考リンク

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

Vercelはモノレポを完全にサポートしており、自動的にワークスペースを検出します。

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。