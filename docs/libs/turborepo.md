# Turborepo ドキュメント

Turborepo は、JavaScript/TypeScript モノレポのための高性能ビルドシステムです。このドキュメントは、Turborepo の使い方、設定、ベストプラクティスを網羅しています。

## 📚 ドキュメント構造

### 🚀 Getting Started（はじめに）

- **[Introduction](./turborepo/docs.md)** - Turborepoの概要
- **[Getting Started](./turborepo/docs/getting-started.md)** - クイックスタートガイド
- **[Installation](./turborepo/docs/getting-started/installation.md)** - インストール方法
- **[Examples](./turborepo/docs/getting-started/examples.md)** - サンプルプロジェクト
- **[Add to Existing Repository](./turborepo/docs/getting-started/add-to-existing-repository.md)** - 既存リポジトリへの追加
- **[Editor Integration](./turborepo/docs/getting-started/editor-integration.md)** - エディター統合

### 🏗️ Crafting Your Repository（リポジトリの構築）

- **[Overview](./turborepo/docs/crafting-your-repository.md)** - リポジトリ構築ガイドの概要
- **[Structuring a Repository](./turborepo/docs/crafting-your-repository/structuring-a-repository.md)** - リポジトリ構造
- **[Managing Dependencies](./turborepo/docs/crafting-your-repository/managing-dependencies.md)** - 依存関係の管理
- **[Creating an Internal Package](./turborepo/docs/crafting-your-repository/creating-an-internal-package.md)** - 内部パッケージの作成
- **[Configuring Tasks](./turborepo/docs/crafting-your-repository/configuring-tasks.md)** - タスクの設定
- **[Running Tasks](./turborepo/docs/crafting-your-repository/running-tasks.md)** - タスクの実行
- **[Caching](./turborepo/docs/crafting-your-repository/caching.md)** - キャッシング
- **[Developing Applications](./turborepo/docs/crafting-your-repository/developing-applications.md)** - アプリケーション開発
- **[Using Environment Variables](./turborepo/docs/crafting-your-repository/using-environment-variables.md)** - 環境変数の使用
- **[Constructing CI](./turborepo/docs/crafting-your-repository/constructing-ci.md)** - CI/CDの構築
- **[Understanding Your Repository](./turborepo/docs/crafting-your-repository/understanding-your-repository.md)** - リポジトリの理解
- **[Upgrading](./turborepo/docs/crafting-your-repository/upgrading.md)** - アップグレード

### 🎯 Core Concepts（コアコンセプト）

- **[Remote Caching](./turborepo/docs/core-concepts/remote-caching.md)** - リモートキャッシング
- **[Package Types](./turborepo/docs/core-concepts/package-types.md)** - パッケージタイプ
- **[Internal Packages](./turborepo/docs/core-concepts/internal-packages.md)** - 内部パッケージ
- **[Package and Task Graph](./turborepo/docs/core-concepts/package-and-task-graph.md)** - パッケージとタスクグラフ

### 📖 Reference（リファレンス）

#### 設定
- **[Configuration](./turborepo/docs/reference/configuration.md)** - turbo.json設定
- **[Package Configurations](./turborepo/docs/reference/package-configurations.md)** - パッケージレベルの設定
- **[System Environment Variables](./turborepo/docs/reference/system-environment-variables.md)** - システム環境変数
- **[Globs](./turborepo/docs/reference/globs.md)** - Globパターン
- **[Options Overview](./turborepo/docs/reference/options-overview.md)** - オプション概要

#### CLIコマンド
- **[run](./turborepo/docs/reference/run.md)** - タスク実行
- **[watch](./turborepo/docs/reference/watch.md)** - ファイル監視
- **[prune](./turborepo/docs/reference/prune.md)** - 部分的なモノレポ生成
- **[boundaries](./turborepo/docs/reference/boundaries.md)** - 境界チェック（実験的）
- **[ls](./turborepo/docs/reference/ls.md)** - パッケージ一覧
- **[query](./turborepo/docs/reference/query.md)** - GraphQLクエリ（実験的）
- **[generate](./turborepo/docs/reference/generate.md)** - コード生成
- **[scan](./turborepo/docs/reference/scan.md)** - 最適化スキャン

#### リモートキャッシュ管理
- **[login](./turborepo/docs/reference/login.md)** - ログイン
- **[logout](./turborepo/docs/reference/logout.md)** - ログアウト
- **[link](./turborepo/docs/reference/link.md)** - リモートキャッシュとリンク
- **[unlink](./turborepo/docs/reference/unlink.md)** - リモートキャッシュとのリンク解除

#### ユーティリティ
- **[bin](./turborepo/docs/reference/bin.md)** - バイナリパスの取得
- **[info](./turborepo/docs/reference/info.md)** - デバッグ情報
- **[telemetry](./turborepo/docs/reference/telemetry.md)** - テレメトリー管理

#### ツールとパッケージ
- **[create-turbo](./turborepo/docs/reference/create-turbo.md)** - プロジェクト作成CLI
- **[eslint-config-turbo](./turborepo/docs/reference/eslint-config-turbo.md)** - ESLint設定
- **[eslint-plugin-turbo](./turborepo/docs/reference/eslint-plugin-turbo.md)** - ESLintプラグイン
- **[turbo-ignore](./turborepo/docs/reference/turbo-ignore.md)** - CI最適化ツール
- **[turbo-codemod](./turborepo/docs/reference/turbo-codemod.md)** - コード変換ツール
- **[turbo-gen](./turborepo/docs/reference/turbo-gen.md)** - コードジェネレーター

### 👥 Community & Support（コミュニティとサポート）

- **[Community](./turborepo/docs/community.md)** - コミュニティリソース
- **[Support Policy](./turborepo/docs/support-policy.md)** - サポートポリシー

## 🎯 主な特徴

1. **インクリメンタルビルド**: 変更された部分のみをビルド
2. **リモートキャッシング**: チーム全体でビルド結果を共有
3. **並列実行**: 複数のタスクを効率的に並列実行
4. **タスク依存関係**: 自動的にタスクの依存関係を解決
5. **パッケージマネージャー対応**: pnpm、yarn、npm、bunをサポート
6. **シンプルな設定**: turbo.jsonで簡単に設定

## 📝 クイックスタート

```bash
# インストール
npm install turbo --save-dev

# turbo.json を作成
cat > turbo.json <<EOF
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

# タスク実行
npx turbo build
npx turbo test
npx turbo dev
```

## 🔗 関連リンク

- 公式サイト: https://turborepo.com/
- GitHub: https://github.com/vercel/turborepo
- npm: https://www.npmjs.com/package/turbo

## 💡 LLM向けの参照ガイド

このドキュメント群を参照する際は、以下のように目的別に参照してください：

- **初学者**: `docs.md` → `getting-started/installation.md` → `getting-started/examples.md`
- **既存リポジトリへの追加**: `getting-started/add-to-existing-repository.md`
- **リポジトリ構造**: `crafting-your-repository/structuring-a-repository.md`
- **タスク設定**: `crafting-your-repository/configuring-tasks.md` → `reference/configuration.md`
- **キャッシング**: `crafting-your-repository/caching.md` → `core-concepts/remote-caching.md`
- **CI/CD構築**: `crafting-your-repository/constructing-ci.md`
- **内部パッケージ**: `crafting-your-repository/creating-an-internal-package.md` → `core-concepts/internal-packages.md`
- **パフォーマンス最適化**: `reference/run.md` → `reference/prune.md`
- **環境変数**: `crafting-your-repository/using-environment-variables.md` → `reference/system-environment-variables.md`
- **トラブルシューティング**: `reference/info.md`
- **アップグレード**: `crafting-your-repository/upgrading.md`

全47ページのドキュメントが日本語で利用可能です。
