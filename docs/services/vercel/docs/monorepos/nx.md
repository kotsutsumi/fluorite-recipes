# NxをVercelにデプロイする

## Nxについて

Nxは、モノレポ、統合、Vercelでのリモートキャッシングをサポートする拡張可能なビルドシステムです。

[Nxの概要](https://nx.dev/getting-started/intro)のドキュメントを読んで、モノレポを管理するNxの利点を学びましょう。

## Nxの主な機能

- **スマートな依存関係グラフ**：プロジェクト間の依存関係を自動的に解析
- **影響分析**：変更されたプロジェクトのみをテスト・ビルド
- **プラグインエコシステム**：React、Next.js、Nodeなど多数のフレームワークをサポート
- **タスクオーケストレーション**：効率的なタスクの並列実行
- **ビジュアライゼーション**：プロジェクト依存関係の可視化

## NxをVercelにデプロイする

### 1. Nxプロジェクトが正しく設定されていることを確認する

まだモノレポをNxに接続していない場合は、Nxのドキュメントの[はじめに](https://nx.dev/recipe/adding-to-monorepo)に従ってください。

#### 推奨されるバージョンと設定

VercelでNxを最適に使用するには、以下のバージョンと設定が推奨されます：

- `nx` バージョン `14.6.2` 以降
- `nx-cloud` バージョン `14.6.0` 以降

すべてのNxスターターと例は、これらの設定であらかじめ構成されています。

#### Nxワークスペースの構造例

```
my-nx-workspace/
├── apps/
│   ├── web/              # Next.jsアプリ
│   ├── api/              # Expressアプリ
│   └── admin/            # React管理画面
├── libs/
│   ├── ui/               # 共有UIライブラリ
│   ├── data-access/      # データアクセス層
│   └── utils/            # ユーティリティ
├── nx.json
├── workspace.json
└── package.json
```

### 2. プロジェクトをインポートする

1. Vercelダッシュボードで[新しいプロジェクトを作成](/docs/projects/overview#creating-a-project)
2. モノレポプロジェクトを[インポート](/docs/getting-started-with-vercel/import)

Vercelは、モノレポのすべての側面を自動的に処理します：

- [ビルドコマンド](/docs/deployments/configure-a-build#build-command)の検出
- [ルートディレクトリ](/docs/deployments/configure-a-build#root-directory)の設定
- npm、yarn、pnpmのサポート
- 環境変数の管理

#### 自動検出される設定

Vercelは以下を自動的に設定します：

**ビルドコマンド：**
```bash
npx nx build web --prod
```

**インストールコマンド：**
```bash
npm install
```

**出力ディレクトリ：**
```
dist/apps/web
```

### 3. Nx on Vercelのリモートキャッシングをセットアップする

Nxは、Vercel上で自動的にリモートキャッシングを使用します。追加の設定は不要です。

ローカル開発やCI/CDでリモートキャッシングを使用するには：

#### Nx Cloudのセットアップ

```bash
# Nx Cloudに接続
npx nx connect-to-nx-cloud
```

このコマンドは：
- Nx Cloudアカウントを作成（または既存のアカウントに接続）
- `nx.json`を更新してリモートキャッシングを有効化
- アクセストークンを設定

#### nx.jsonの設定例

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud",
      "options": {
        "cacheableOperations": ["build", "test", "lint"],
        "accessToken": "your-access-token"
      }
    }
  }
}
```

### 4. 環境変数の設定

各プロジェクトに必要な環境変数をVercelダッシュボードで設定：

1. プロジェクトの「Settings」→「Environment Variables」に移動
2. 必要な環境変数を追加
3. 環境（Production、Preview、Development）を選択

## Nx設定の詳細

### workspace.json / project.json

プロジェクトの設定とタスクを定義：

```json
{
  "version": 2,
  "projects": {
    "web": {
      "root": "apps/web",
      "sourceRoot": "apps/web/src",
      "projectType": "application",
      "targets": {
        "build": {
          "executor": "@nrwl/next:build",
          "outputs": ["{options.outputPath}"],
          "options": {
            "root": "apps/web",
            "outputPath": "dist/apps/web"
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "apps/web/src/environments/environment.ts",
                  "with": "apps/web/src/environments/environment.prod.ts"
                }
              ]
            }
          }
        },
        "serve": {
          "executor": "@nrwl/next:server",
          "options": {
            "buildTarget": "web:build",
            "dev": true
          }
        }
      }
    }
  }
}
```

### nx.json

Nxワークスペース全体の設定：

```json
{
  "npmScope": "myorg",
  "affected": {
    "defaultBase": "main"
  },
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud",
      "options": {
        "cacheableOperations": [
          "build",
          "lint",
          "test",
          "e2e"
        ],
        "accessToken": "your-nx-cloud-token"
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    },
    "test": {
      "inputs": ["default", "^production"]
    }
  },
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s"
    ],
    "sharedGlobals": []
  }
}
```

## Nxコマンド

### ビルドとテスト

```bash
# 特定のプロジェクトをビルド
nx build web

# 本番ビルド
nx build web --configuration=production

# テスト実行
nx test web

# リント
nx lint web

# すべてのタスクを実行
nx run-many --target=build --all
```

### 影響分析

変更されたプロジェクトのみを対象に実行：

```bash
# 影響を受けるプロジェクトをビルド
nx affected:build

# 影響を受けるプロジェクトをテスト
nx affected:test

# 影響を受けるプロジェクトにリント
nx affected:lint

# 影響を受けるプロジェクトを表示
nx affected:apps
nx affected:libs
```

### 依存関係グラフの可視化

```bash
# プロジェクト依存関係グラフを表示
nx graph

# 影響を受けるプロジェクトのグラフを表示
nx affected:graph
```

## CI/CDでの使用

### GitHub Actionsの例

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # 影響分析に必要

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run affected builds
        run: npx nx affected:build --base=origin/main
        env:
          NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}

      - name: Run affected tests
        run: npx nx affected:test --base=origin/main
        env:
          NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}
```

### 環境変数

CI/CDで以下の環境変数を設定：

- **NX_CLOUD_ACCESS_TOKEN**: Nx Cloudアクセストークン
- **NX_BRANCH**: ブランチ名（オプション）
- **NX_CLOUD_DISTRIBUTED_EXECUTION**: 分散実行を有効化（オプション）

## ベストプラクティス

### 1. タスク設定の最適化

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "outputs": ["{workspaceRoot}/dist/{projectRoot}"]
    }
  }
}
```

### 2. キャッシュ可能な操作の定義

```json
{
  "tasksRunnerOptions": {
    "default": {
      "options": {
        "cacheableOperations": [
          "build",
          "test",
          "lint",
          "e2e",
          "typecheck"
        ]
      }
    }
  }
}
```

### 3. 影響分析の活用

開発時は影響を受けるプロジェクトのみを対象に：

```bash
# package.jsonにスクリプトを追加
{
  "scripts": {
    "affected:build": "nx affected:build",
    "affected:test": "nx affected:test",
    "affected:lint": "nx affected:lint"
  }
}
```

### 4. プロジェクト構造の整理

```
libs/
├── feature/           # フィーチャーライブラリ
├── data-access/       # データアクセス
├── ui/                # UIコンポーネント
└── utils/             # ユーティリティ
```

## トラブルシューティング

### ビルドが失敗する

**依存関係を確認：**

```bash
# プロジェクトの依存関係を表示
nx graph --focus=web
```

**キャッシュをクリア：**

```bash
# Nxキャッシュをクリア
nx reset
```

### 影響分析が正しく動作しない

**ベースブランチを確認：**

```json
{
  "affected": {
    "defaultBase": "main"
  }
}
```

**Gitの履歴を確認：**

```bash
# CI/CDでは完全な履歴が必要
git fetch --depth=0
```

### リモートキャッシングが機能しない

**トークンを確認：**

```bash
echo $NX_CLOUD_ACCESS_TOKEN
```

**接続を確認：**

```bash
npx nx connect-to-nx-cloud
```

## パフォーマンス最適化

### 分散タスク実行

Nx Cloudの分散タスク実行を使用して、CI/CDを高速化：

```json
{
  "tasksRunnerOptions": {
    "default": {
      "options": {
        "parallel": 3,
        "cacheableOperations": ["build", "test"],
        "distributedExecutionBrokerUrl": "https://nx-cloud.io"
      }
    }
  }
}
```

### 並列実行の調整

```bash
# 並列実行数を指定
nx run-many --target=build --all --parallel=5

# 最大並列実行数を設定
nx run-many --target=test --all --maxParallel=3
```

## 関連リンク

- [Nx公式ドキュメント](https://nx.dev)
- [Vercelでのモノレポ](/docs/monorepos)
- [リモートキャッシング](/docs/monorepos/remote-caching)
- [モノレポFAQ](/docs/monorepos/monorepo-faq)
- [Nx Cloud](https://nx.app)
