# リモートキャッシング

## 概要

リモートキャッシングは、Vercelのすべてのプランで利用可能な機能で、チーム全体で同じタスクを二度繰り返さないようにするツールです。

## 主な特徴

- **チーム全体でのキャッシュ共有**：ビルドおよびログの成果物を自動的に共有
- **CI/CDとの統合**：外部CI/CDおよびVercelビルドプロセス中にキャッシュを再利用
- **Turborepo統合**：最初のツールは[Turborepo](https://turborepo.com)

## リモートキャッシングの仕組み

### ローカルキャッシング

Turborepoは、タスクの出力をローカルにキャッシュします：

1. タスクを実行
2. 入力（ソースコード、環境変数など）からハッシュを計算
3. 出力をローカルの`.turbo/cache`ディレクトリに保存
4. 同じ入力で再度実行する場合、キャッシュから出力を復元

### リモートキャッシング

リモートキャッシングを有効にすると、Vercelのクラウドにキャッシュを保存：

1. タスクを実行
2. 出力をローカルとリモートの両方に保存
3. チームメンバーやCIが同じタスクを実行する際、リモートキャッシュから復元
4. ビルド時間を大幅に短縮

## 使用方法

### セットアップ手順

#### 1. Vercelアカウントで認証

```bash
npx turbo login
```

このコマンドは、ブラウザを開いてVercelアカウントでログインするよう促します。

#### 2. リモートキャッシュにリンク

```bash
npx turbo link
```

このコマンドは、以下を行います：
- Vercelチームとプロジェクトを選択
- `.turbo/config.json`に設定を保存
- リモートキャッシングを有効化

### ローカル開発での使用

セットアップ後、通常どおりTurborepoコマンドを実行するだけです：

```bash
# ビルド（キャッシュがあればリモートから取得）
turbo build

# 開発サーバー起動
turbo dev

# テスト実行
turbo test
```

### CI/CDでの使用

#### GitHub Actionsの例

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

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: turbo build
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
```

#### 環境変数の設定

以下の環境変数を設定する必要があります：

- **TURBO_TOKEN**: Vercelアクセストークン
  - [Vercelダッシュボード](https://vercel.com/account/tokens)で作成
  - CI/CDの環境変数として設定

- **TURBO_TEAM**: チームのスラッグ
  - `turbo link`実行時に表示される
  - または、Vercelダッシュボードで確認

### GitLab CIの例

```yaml
build:
  stage: build
  script:
    - pnpm install
    - turbo build
  variables:
    TURBO_TOKEN: $TURBO_TOKEN
    TURBO_TEAM: $TURBO_TEAM
```

### CircleCIの例

```yaml
version: 2.1

jobs:
  build:
    docker:
      - image: node:18
    steps:
      - checkout
      - run: pnpm install
      - run:
          command: turbo build
          environment:
            TURBO_TOKEN: ${TURBO_TOKEN}
            TURBO_TEAM: ${TURBO_TEAM}
```

## 使用制限

### プラン別のフェアユースガイドライン

| プラン       | アップロード制限 | 成果物リクエスト制限 |
|-------------|----------------|----------------------|
| Hobby       | 100GB/月       | 100/分               |
| Pro         | 1TB/月         | 10,000/分            |
| Enterprise  | 4TB/月         | 10,000/分            |

### 制限超過時の動作

- 制限を超えた場合、リモートキャッシングは一時的に無効化
- ローカルキャッシングは引き続き機能
- 次の請求期間に制限がリセット

## キャッシュの管理

### キャッシュの有効期限

- キャッシュは7日後に自動的に期限切れ
- 頻繁に使用されるキャッシュは優先的に保持

### キャッシュのクリア

```bash
# ローカルキャッシュをクリア
rm -rf .turbo/cache

# 特定のタスクのキャッシュを無視
turbo build --force

# すべてのキャッシュを無視
turbo build --force --no-cache
```

### キャッシュの確認

```bash
# キャッシュヒット/ミスの確認
turbo build --summarize

# 詳細なログ
turbo build --verbosity=2
```

## ベストプラクティス

### 1. 環境変数の適切な処理

キャッシュに影響する環境変数は`turbo.json`で明示的に指定：

```json
{
  "pipeline": {
    "build": {
      "env": [
        "NEXT_PUBLIC_API_URL",
        "DATABASE_URL"
      ],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  },
  "globalEnv": [
    "NODE_ENV",
    "VERCEL_ENV"
  ]
}
```

### 2. センシティブな情報の保護

ログもキャッシュされるため、注意が必要：

```json
{
  "pipeline": {
    "build": {
      "outputs": [
        ".next/**",
        "!.next/cache/**",
        "!**/*.log"  // ログファイルを除外
      ]
    }
  }
}
```

### 3. キャッシュキーの最適化

不要な入力を除外してキャッシュヒット率を向上：

```json
{
  "pipeline": {
    "build": {
      "inputs": [
        "src/**",
        "!src/**/*.test.ts"  // テストファイルを除外
      ]
    }
  }
}
```

### 4. チーム全体での一貫性

すべてのチームメンバーとCIで同じTurborepoバージョンを使用：

```json
{
  "packageManager": "pnpm@8.0.0",
  "devDependencies": {
    "turbo": "1.10.0"
  }
}
```

## トラブルシューティング

### キャッシュが使用されない

**原因と解決策：**

1. **環境変数が未設定**
   ```bash
   echo $TURBO_TOKEN
   echo $TURBO_TEAM
   ```

2. **ログインしていない**
   ```bash
   npx turbo login
   npx turbo link
   ```

3. **環境変数の不一致**
   - `turbo.json`で環境変数を正しく指定
   - すべての環境で同じ値を使用

### 認証エラー

```bash
# トークンを再生成
# 1. Vercelダッシュボードで新しいトークンを作成
# 2. 環境変数を更新
export TURBO_TOKEN=new_token_value

# 再度ログイン
npx turbo login
```

### パフォーマンスの問題

```bash
# キャッシュヒット率を確認
turbo build --summarize

# ネットワーク速度を確認
# 大きなファイルはキャッシュから除外を検討
```

## セキュリティ

### アクセス制御

- リモートキャッシュへのアクセスはVercelチームメンバーに制限
- トークンは安全に保管
- CI/CDの環境変数として設定（平文でコミットしない）

### 監査ログ

Enterpriseプランでは、キャッシュアクセスの監査ログを確認可能：

1. Vercelダッシュボードに移動
2. チーム設定 → 監査ログ
3. リモートキャッシングのアクティビティを確認

## メトリクスと分析

### キャッシュヒット率の確認

```bash
# サマリーレポート生成
turbo build --summarize

# JSONレポート出力
turbo build --summarize=json > summary.json
```

### ビルド時間の比較

```bash
# キャッシュあり
turbo build

# キャッシュなし
turbo build --force
```

## その他のリソース

- [Turborepo公式ドキュメント](https://turbo.build/repo/docs)
- [Remote Cache API仕様](https://turbo.build/repo/docs/core-concepts/remote-caching#remote-cache-api)
- [Vercelでのモノレポ](/docs/monorepos)
- [Turborepo FAQ](https://turbo.build/repo/docs/faq)
