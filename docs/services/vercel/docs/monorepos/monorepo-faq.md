# モノレポ FAQ

## ビルドを高速化するには？

デプロイメントがキューに入るかどうかは、利用可能な「同時ビルド」の数に依存します。

### プラン別の同時ビルド数

- **Hobbyプラン**：1つの同時ビルドに制限されています
- **ProまたはEnterpriseプラン**：チーム設定の「課金」ページでカスタマイズ可能です

[同時ビルドの詳細を確認する](/docs/deployments/concurrent-builds)

### ビルド時間を短縮する方法

1. **リモートキャッシングを使用**
   - [Turborepoのリモートキャッシング](/docs/monorepos/remote-caching)を有効化
   - チーム全体でビルド成果物を共有

2. **増分ビルドを活用**
   - 変更されたプロジェクトのみをビルド
   - Turborepoの`--filter`オプションを使用

3. **並列実行を最大化**
   - 依存関係のないタスクを並列実行
   - `turbo.json`で適切な依存関係を設定

4. **不要な依存関係を削減**
   - 大きなパッケージを避ける
   - 必要なモジュールのみをインポート

## 同じドメイン下で異なるパスにプロジェクトを配置するには？

各ディレクトリは別のVercelプロジェクトになり、個別のドメインで利用可能になります。

### 単一ドメイン下で複数のプロジェクトをホストする方法

#### オプション1: マイクロフロントエンド

[マイクロフロントエンド](/docs/microfrontends)を使用して、複数のプロジェクトを1つのドメインで統合：

```json
{
  "$schema": "https://openapi.vercel.sh/microfrontends.json",
  "applications": {
    "web": {},
    "docs": {
      "routing": [
        {
          "paths": ["/docs", "/docs/:path*"]
        }
      ]
    },
    "blog": {
      "routing": [
        {
          "paths": ["/blog", "/blog/:path*"]
        }
      ]
    }
  }
}
```

#### オプション2: リライト（Rewrites）

`vercel.json`の[書き換え](/docs/project-configuration#rewrites)プロパティを使用して、上流プロジェクトにリクエストをプロキシ：

```json
{
  "rewrites": [
    {
      "source": "/docs/:path*",
      "destination": "https://docs-project.vercel.app/docs/:path*"
    },
    {
      "source": "/blog/:path*",
      "destination": "https://blog-project.vercel.app/blog/:path*"
    }
  ]
}
```

**手順：**
1. 新しいプロジェクトを作成（例：メインサイト）
2. プロジェクト設定でドメインを割り当て
3. `vercel.json`でリライトルールを設定
4. 各サブプロジェクトのURLを指定

## プッシュ後のプロジェクトビルド方法

Gitリポジトリにプッシュすると、接続された複数のVercelプロジェクトで並行してデプロイメントが作成・ビルドされます。

### デプロイメントのトリガー

#### すべてのプロジェクトをビルド

- デフォルトでは、すべてのプロジェクトがビルドされます
- プッシュごとに並行してビルドが実行されます

#### 影響を受けるプロジェクトのみをビルド

**Turborepoを使用：**

プロジェクト設定で「Ignored Build Step」を設定：

```bash
# apps/webが変更された場合のみビルド
npx turbo-ignore
```

`turbo-ignore`は、プロジェクトまたはその依存関係が変更された場合にのみビルドをトリガーします。

**Nxを使用：**

```bash
# 影響を受けるプロジェクトのみをビルド
npx nx affected:build --base=origin/main
```

## ソースファイルの共有は可能？

はい、ルートディレクトリ外のソースファイルにアクセスできます。

### 設定方法

1. プロジェクト設定に移動
2. 「Build & Development Settings」セクションを開く
3. 「Root Directory」セクションで、「Include source files outside of the Root Directory in the Build Step」オプションを有効化

### ワークスペースの使用

#### Yarn Workspaces

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Yarn workspacesの詳細については、[Yarn monoreposのVercelへのデプロイ](https://vercel.com/guides/deploying-yarn-monorepos)を参照してください。

#### pnpm Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

#### npm Workspaces

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

## 環境変数を複数のプロジェクトで共有するには？

環境変数は、各プロジェクトで個別に設定する必要があります。

### 手動での設定

各プロジェクトのダッシュボードで：

1. 「Settings」→「Environment Variables」に移動
2. 必要な環境変数を追加

### CLIを使用した自動化

Vercel CLIを使用してスクリプト化：

```bash
#!/bin/bash

PROJECTS=("web" "docs" "blog")
ENV_VAR_NAME="API_KEY"
ENV_VAR_VALUE="your-api-key"

for PROJECT in "${PROJECTS[@]}"; do
  vercel env add $ENV_VAR_NAME production $ENV_VAR_VALUE --scope $PROJECT
done
```

### .envファイルの共有

ルートに共通の`.env`ファイルを配置し、各プロジェクトから参照：

```bash
# モノレポのルート
├── .env.shared
├── apps/
│   ├── web/
│   │   └── .env -> ../../.env.shared
│   └── docs/
│       └── .env -> ../../.env.shared
```

**注意：** センシティブな情報は`.env`ファイルにコミットしないでください。

## 特定のパッケージの変更時にのみデプロイするには？

### Turborepoの場合

`turbo-ignore`を使用：

**プロジェクト設定 → Build & Development Settings → Ignored Build Step:**

```bash
npx turbo-ignore
```

`turbo.json`で依存関係を定義：

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

これにより、プロジェクトまたはその依存パッケージが変更された場合にのみビルドされます。

### Nxの場合

**Ignored Build Step:**

```bash
npx nx affected:apps --base=origin/main --plain | grep -q '^web$' && exit 1 || exit 0
```

または、GitHub Actionsで：

```yaml
- name: Check if affected
  id: affected
  run: |
    if npx nx affected:apps --base=origin/main --plain | grep -q '^web$'; then
      echo "affected=true" >> $GITHUB_OUTPUT
    else
      echo "affected=false" >> $GITHUB_OUTPUT
    fi

- name: Deploy
  if: steps.affected.outputs.affected == 'true'
  run: vercel deploy --prod
```

## モノレポで複数のフレームワークを使用できますか？

はい、モノレポ内で異なるフレームワークを使用できます。

### 例：複数フレームワークの構成

```
my-monorepo/
├── apps/
│   ├── nextjs-web/       # Next.js
│   ├── vite-docs/        # Vite
│   ├── astro-blog/       # Astro
│   └── remix-admin/      # Remix
└── packages/
    └── shared-ui/        # 共有UIライブラリ
```

各プロジェクトは、Vercelで個別に設定され、適切なフレームワークが自動検出されます。

## モノレポのデバッグ方法は？

### ビルドログの確認

1. Vercelダッシュボードでデプロイメントを選択
2. 「Building」タブでログを確認
3. エラーメッセージを検索

### ローカルでのビルドテスト

```bash
# Turborepoの場合
turbo build --filter=web

# Nxの場合
nx build web

# Vercel CLIでビルド
vercel build
```

### 依存関係の確認

```bash
# 依存関係グラフを表示（Turborepo）
turbo build --graph

# 依存関係グラフを表示（Nx）
nx graph
```

### 環境変数の確認

```bash
# ローカルで環境変数をテスト
vercel env pull .env.local
```

## モノレポのパフォーマンス最適化

### 1. 選択的デプロイメント

変更されたプロジェクトのみをデプロイ：

```bash
npx turbo-ignore
```

### 2. リモートキャッシング

[リモートキャッシング](/docs/monorepos/remote-caching)を有効化：

```bash
npx turbo login
npx turbo link
```

### 3. 並列ビルド

複数の同時ビルドを購入（ProまたはEnterpriseプラン）

### 4. 依存関係の最適化

- 不要な依存関係を削除
- 共有パッケージを効率的に設計
- 循環依存を避ける

### 5. ビルドキャッシュの活用

```json
{
  "pipeline": {
    "build": {
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

## よくあるエラーと解決方法

### エラー: "Module not found"

**原因：** ワークスペースの依存関係が正しく解決されていない

**解決策：**
1. `package.json`で依存関係を確認
2. ワークスペース設定を確認
3. `node_modules`を削除して再インストール

```bash
rm -rf node_modules
pnpm install
```

### エラー: "Build failed"

**原因：** ビルドコマンドまたは出力ディレクトリが間違っている

**解決策：**
1. プロジェクト設定でビルドコマンドを確認
2. ローカルでビルドをテスト
3. ログを確認してエラーを特定

### エラー: "Environment variable not found"

**原因：** 環境変数が設定されていない

**解決策：**
1. Vercelダッシュボードで環境変数を設定
2. すべての環境（Production、Preview、Development）に設定
3. デプロイメントを再実行

## 関連リンク

- [Vercelでのモノレポ](/docs/monorepos)
- [Turborepo](/docs/monorepos/turborepo)
- [Nx](/docs/monorepos/nx)
- [リモートキャッシング](/docs/monorepos/remote-caching)
- [マイクロフロントエンド](/docs/microfrontends)
