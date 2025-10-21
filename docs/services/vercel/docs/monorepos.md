# モノレポの使用

## モノレポとは

モノレポは、複数のプロジェクトを1つのリポジトリで管理する方法です。プロジェクトの整理と作業を容易にする優れた方法です。

## モノレポの利点

- **コード共有**：複数のプロジェクト間で共通のコードを簡単に共有
- **一元管理**：すべての依存関係とツールを1か所で管理
- **アトミックな変更**：複数のプロジェクトにまたがる変更を1つのコミットで実行
- **一貫性**：すべてのプロジェクトで同じリンティング、テスト、ビルドプロセスを使用
- **効率的なCI/CD**：変更されたプロジェクトのみをビルド・デプロイ

## モノレポテンプレートのデプロイ

Vercelでモノレポをすぐに始めるには、以下のテンプレートを使用できます：

### Turborepo

Turborepoは、JavaScriptおよびTypeScriptコードベース向けの高性能ビルドシステムです。

- [Turborepoのドキュメントを読む](/docs/monorepos/turborepo)
- [テンプレートをデプロイ](https://vercel.com/new/clone?repository-url=https://github.com/vercel/turbo/tree/main/examples/basic&project-name=turbo-monorepo&repository-name=turbo-monorepo&root-directory=apps/web&install-command=pnpm%20install&build-command=turbo%20build&skip-unaffected=true)
- [ライブ例を見る](https://examples-basic-web.vercel.sh/)

**主な機能：**
- 高速な増分ビルド
- コンテンツ対応のハッシング
- リモートキャッシング
- 並列実行

### Nx

Nxは、モノレポ管理と統合のための拡張可能なビルドシステムです。

- [Nxのドキュメントを読む](/docs/monorepos/nx)
- [テンプレートをデプロイ](https://vercel.com/new/clone?demo-description=Learn%20to%20implement%20a%20monorepo%20with%20a%20single%20Next.js%20site%20using%20Nx.&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F4w8MJqkgHvXlKgBMglBHsB%2F6cd4b35af6024e08c9a8b7ded092af2d%2Fsolutions-nx-monorepo.vercel.sh_.png&demo-title=Nx%20Monorepo)

**主な機能：**
- スマートな依存関係グラフ
- 影響を受けるプロジェクトのみをテスト・ビルド
- プラグインエコシステム
- ビジュアライゼーションツール

## モノレポ構造の例

### 基本的な構造

```
my-monorepo/
├── apps/
│   ├── web/              # Next.jsアプリ
│   ├── docs/             # ドキュメントサイト
│   └── admin/            # 管理画面
├── packages/
│   ├── ui/               # 共有UIコンポーネント
│   ├── utils/            # 共有ユーティリティ
│   └── config/           # 共有設定
├── package.json
├── turbo.json            # Turborepo設定
└── pnpm-workspace.yaml   # pnpmワークスペース設定
```

### パッケージの定義

**apps/web/package.json:**

```json
{
  "name": "web",
  "version": "1.0.0",
  "dependencies": {
    "next": "latest",
    "ui": "workspace:*",
    "utils": "workspace:*"
  }
}
```

**packages/ui/package.json:**

```json
{
  "name": "ui",
  "version": "1.0.0",
  "exports": {
    "./button": "./src/button.tsx",
    "./input": "./src/input.tsx"
  }
}
```

## Vercelでのモノレポのセットアップ

### 1. プロジェクトのインポート

1. [Vercelダッシュボード](https://vercel.com/dashboard)に移動
2. 「新しいプロジェクトを追加」をクリック
3. Gitリポジトリを選択
4. Vercelが自動的にモノレポを検出

### 2. ルートディレクトリの設定

各アプリケーションに対して、適切なルートディレクトリを設定：

- **Web アプリ**: `apps/web`
- **ドキュメント**: `apps/docs`
- **管理画面**: `apps/admin`

### 3. ビルド設定

Vercelは、モノレポツールに基づいて自動的にビルド設定を検出します：

**Turborepo:**

```json
{
  "buildCommand": "turbo build",
  "installCommand": "pnpm install"
}
```

**Nx:**

```json
{
  "buildCommand": "nx build web --prod",
  "installCommand": "npm install"
}
```

### 4. 環境変数の設定

環境変数は、各プロジェクトで個別に設定することも、すべてのプロジェクトで共有することもできます。

## パッケージマネージャーの選択

Vercelは、以下のパッケージマネージャーをサポートしています：

- **npm**: 標準のNode.jsパッケージマネージャー
- **Yarn**: 高速で信頼性の高いパッケージマネージャー（v1、v2、v3対応）
- **pnpm**: ディスク効率の良いパッケージマネージャー

詳細は[パッケージマネージャーのドキュメント](/docs/package-managers)を参照してください。

## リモートキャッシング

[リモートキャッシング](/docs/monorepos/remote-caching)を使用すると、チーム全体でビルドキャッシュを共有できます：

```bash
# Turborepoでリモートキャッシングを有効化
npx turbo login
npx turbo link
```

**利点：**
- CI/CDパイプラインの高速化
- ローカルビルドの高速化
- チーム全体でのキャッシュ共有

## ベストプラクティス

### 1. ワークスペースの設定

**pnpm-workspace.yaml:**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**package.json (ルート):**

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### 2. 共有設定の活用

**packages/config/eslint-config.js:**

```javascript
module.exports = {
  extends: ['next', 'prettier'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
};
```

**apps/web/.eslintrc.js:**

```javascript
module.exports = {
  extends: ['config/eslint-config'],
};
```

### 3. 依存関係の管理

```bash
# 特定のワークスペースに依存関係を追加
pnpm add react --filter web

# すべてのワークスペースに依存関係を追加
pnpm add -w typescript

# 開発依存関係として追加
pnpm add -D vitest --filter ui
```

### 4. スクリプトの統一

**package.json (ルート):**

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  }
}
```

## トラブルシューティング

一般的な問題の解決方法については、[モノレポFAQ](/docs/monorepos/monorepo-faq)を参照してください。

## 関連リンク

- [Turborepo](/docs/monorepos/turborepo)
- [Nx](/docs/monorepos/nx)
- [リモートキャッシング](/docs/monorepos/remote-caching)
- [モノレポFAQ](/docs/monorepos/monorepo-faq)
- [パッケージマネージャー](/docs/package-managers)
