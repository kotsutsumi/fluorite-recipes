# TurborepoをVercelにデプロイする

## Turborepoについて

Turborepoは、以下の特徴を持つJavaScriptおよびTypeScriptコードベース向けの高性能ビルドシステムです：

- **高速な増分ビルド**：変更されたファイルのみを再ビルド
- **コンテンツ対応のハッシング**：同じ入力からは同じ出力を生成
- **リモートキャッシング**：チームとCI/CDパイプラインでビルドキャッシュを共有
- **並列実行**：複数のタスクを同時に実行
- **パイプライン設定**：タスク間の依存関係を定義

## TurborepoをVercelにデプロイする手順

### 1. 環境変数の処理

環境変数を正しく管理することが重要です。`turbo.json`で環境変数のリストを作成し、Turborepoに異なる環境のキャッシュを認識させます。

#### `turbo.json`の例

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "env": [
        "SOME_ENV_VAR"
      ],
      "outputs": ["dist/**"]
    },
    "web#build": {
      "dependsOn": ["^build"],
      "env": ["SOME_OTHER_ENV_VAR"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  },
  "globalEnv": [
    "GITHUB_TOKEN",
    "VERCEL_ENV"
  ],
  "globalDependencies": [
    "tsconfig.json"
  ]
}
```

#### 環境変数の種類

**タスク固有の環境変数（`env`）:**
- 特定のタスクにのみ影響する環境変数
- キャッシュキーの計算に含まれる

**グローバル環境変数（`globalEnv`）:**
- すべてのタスクに影響する環境変数
- すべてのキャッシュキーの計算に含まれる

### 2. TurborepoをVercelにインポート

#### プロジェクトの作成

1. [新しいプロジェクト](/new)を作成
2. モノレポプロジェクトを[インポート](/docs/getting-started-with-vercel/import)
3. Vercelが自動的にTurborepo設定を検出

#### 自動設定

Vercelは以下を自動的に設定します：

- ルートディレクトリの検出
- ビルドコマンドの設定
- 出力ディレクトリの設定
- 依存関係のインストール

### 3. リモートキャッシングの設定

リモートキャッシングにより、チーム全体でビルドキャッシュを共有できます。

#### セットアップ手順

```bash
# Vercelアカウントでログイン
npx turbo login

# リモートキャッシュにリンク
npx turbo link
```

これにより、以下の環境変数が自動的に設定されます：
- `TURBO_TOKEN`: Vercelアクセストークン
- `TURBO_TEAM`: チームのスラッグ

詳細は[リモートキャッシングのドキュメント](/docs/monorepos/remote-caching)を参照してください。

### 4. プロジェクト設定の調整

#### ビルドコマンド

Vercelは通常、以下のビルドコマンドを自動的に設定します：

```bash
turbo build --filter=web
```

カスタマイズする場合は、プロジェクト設定で変更できます：

```bash
turbo build --filter=web... --no-cache
```

#### インストールコマンド

パッケージマネージャーに応じて、適切なインストールコマンドが使用されます：

- **pnpm**: `pnpm install`
- **npm**: `npm install`
- **yarn**: `yarn install`

## Turborepo設定の詳細

### パイプライン設定

#### 基本的なタスク定義

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

**主なフィールド：**
- `dependsOn`: タスクの依存関係
- `outputs`: キャッシュする出力ファイル
- `env`: タスク固有の環境変数
- `cache`: キャッシュを有効/無効にする
- `persistent`: 永続的なタスク（開発サーバーなど）

#### 依存関係の指定

```json
{
  "pipeline": {
    "build": {
      // 依存パッケージのbuildタスクを先に実行
      "dependsOn": ["^build"]
    },
    "deploy": {
      // 同じパッケージのbuildタスクを先に実行
      "dependsOn": ["build"]
    },
    "test": {
      // buildとlintを先に実行
      "dependsOn": ["build", "lint"]
    }
  }
}
```

### ワークスペースの設定

#### package.json（ルート）

```json
{
  "name": "my-turborepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
```

#### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### フィルタリング

特定のパッケージやアプリのみを対象にタスクを実行：

```bash
# 特定のアプリのみビルド
turbo build --filter=web

# 特定のアプリとその依存関係をビルド
turbo build --filter=web...

# 変更されたパッケージのみビルド
turbo build --filter=[HEAD^1]

# 複数のフィルタを組み合わせ
turbo build --filter=web --filter=docs
```

## ベストプラクティス

### 1. 適切なキャッシュ戦略

```json
{
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"],
      "env": ["NEXT_PUBLIC_*"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### 2. 環境変数の明示的な指定

キャッシュに影響する環境変数は明示的に指定：

```json
{
  "pipeline": {
    "build": {
      "env": [
        "NEXT_PUBLIC_API_URL",
        "NEXT_PUBLIC_ANALYTICS_ID"
      ]
    }
  },
  "globalEnv": [
    "NODE_ENV",
    "VERCEL_ENV"
  ]
}
```

### 3. 出力ディレクトリの適切な設定

不要なファイルをキャッシュから除外：

```json
{
  "pipeline": {
    "build": {
      "outputs": [
        ".next/**",
        "!.next/cache/**",
        "dist/**",
        "!dist/**/*.map"
      ]
    }
  }
}
```

### 4. タスクの並列化

依存関係のないタスクは並列実行されるように設定：

```json
{
  "pipeline": {
    "lint": {},
    "test": {},
    "typecheck": {}
  }
}
```

## トラブルシューティング

### キャッシュが機能しない

**原因と解決策：**

1. **環境変数が指定されていない**
   ```json
   {
     "pipeline": {
       "build": {
         "env": ["MISSING_ENV_VAR"]
       }
     }
   }
   ```

2. **出力ディレクトリが正しくない**
   ```bash
   # キャッシュをクリアして再ビルド
   turbo build --force
   ```

3. **リモートキャッシングが設定されていない**
   ```bash
   npx turbo login
   npx turbo link
   ```

### ビルドが失敗する

**依存関係の順序を確認：**

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

**ログを確認：**

```bash
# 詳細なログを出力
turbo build --verbosity=2
```

## パフォーマンス最適化

### ビルド時間の短縮

1. **リモートキャッシングの活用**
2. **並列実行の最大化**
3. **不要な依存関係の削減**
4. **増分ビルドの活用**

### メトリクスの確認

```bash
# ビルド時間の分析
turbo build --summarize

# グラフの可視化
turbo build --graph=graph.html
```

## 関連リンク

- [Turborepo公式ドキュメント](https://turbo.build/repo/docs)
- [リモートキャッシング](/docs/monorepos/remote-caching)
- [モノレポFAQ](/docs/monorepos/monorepo-faq)
- [Vercelでのモノレポ](/docs/monorepos)
