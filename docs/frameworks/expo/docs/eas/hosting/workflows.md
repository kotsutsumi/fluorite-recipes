# EAS WorkflowsによるWebデプロイ

EAS WorkflowsでReact NativeウェブサイトとAPIルートのデプロイを自動化する方法を説明します。

## 前提条件

- EAS WorkflowsとGitHub統合が設定されていること
- EAS Hostingプロジェクトが作成されていること

## ワークフロー設定

### ステップ1: ワークフローファイルの作成

`.eas/workflows/deploy.yml`ファイルをプロジェクトに作成します。

### 基本的なデプロイワークフロー

```yaml
name: Deploy
on:
  push:
    branches: ['main']
jobs:
  deploy:
    type: deploy
    name: Deploy
    environment: production
    params:
      prod: true
```

このワークフローは：
- `main`ブランチへのプッシュで自動的にトリガー
- プロダクション環境変数を使用
- Webバンドルをエクスポート
- プロジェクトをデプロイ
- プロダクションに昇格

## ワークフローの詳細設定

### 複数環境のデプロイ

```yaml
name: Deploy to Multiple Environments
on:
  push:
    branches: ['main', 'develop']
jobs:
  deploy-production:
    type: deploy
    name: Deploy to Production
    environment: production
    if: ${{ github.ref == 'refs/heads/main' }}
    params:
      prod: true

  deploy-staging:
    type: deploy
    name: Deploy to Staging
    environment: staging
    if: ${{ github.ref == 'refs/heads/develop' }}
    params:
      alias: staging
```

### プルリクエストプレビュー

```yaml
name: Preview Deployment
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  preview:
    type: deploy
    name: Deploy Preview
    environment: preview
    params:
      alias: pr-${{ github.event.pull_request.number }}
```

## ワークフローパラメータ

### 必須パラメータ

| パラメータ | 説明 |
|-----------|------|
| `type: deploy` | デプロイジョブタイプを指定 |
| `environment` | 使用する環境変数セット |

### オプションパラメータ

| パラメータ | 説明 | 例 |
|-----------|------|-----|
| `prod` | プロダクションに昇格 | `true` / `false` |
| `alias` | デプロイメントエイリアス | `staging`, `preview` |

## 手動トリガー

### CLIから実行

```bash
eas workflow:run deploy
```

これにより、定義されたワークフローが手動で実行されます。

### GitHub UIから実行

1. GitHubリポジトリに移動
2. Actionsタブを開く
3. ワークフローを選択
4. "Run workflow"をクリック

## 環境変数の管理

### ワークフローでの環境変数使用

```yaml
name: Deploy with Environment Variables
on:
  push:
    branches: ['main']
jobs:
  deploy:
    type: deploy
    name: Deploy
    environment: production  # EASの環境変数を使用
    params:
      prod: true
```

### 環境変数の設定

```bash
# プロダクション環境変数を設定
eas env:create --name API_URL --value "https://api.production.com" --environment production

# ステージング環境変数を設定
eas env:create --name API_URL --value "https://api.staging.com" --environment staging
```

## 高度なワークフロー例

### ビルド、テスト、デプロイパイプライン

```yaml
name: Full CI/CD Pipeline
on:
  push:
    branches: ['main']
jobs:
  test:
    type: generic
    name: Run Tests
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy:
    type: deploy
    name: Deploy to Production
    needs: [test]  # テスト成功後のみデプロイ
    environment: production
    params:
      prod: true
```

### 条件付きデプロイ

```yaml
name: Conditional Deploy
on:
  push:
    branches: ['main', 'develop']
    paths:
      - 'app/**'
      - 'package.json'
jobs:
  deploy:
    type: deploy
    name: Deploy if App Changed
    environment: production
    params:
      prod: ${{ github.ref == 'refs/heads/main' }}
      alias: ${{ github.ref == 'refs/heads/develop' && 'staging' || '' }}
```

## 通知の設定

### Slackへの通知

```yaml
name: Deploy with Notifications
on:
  push:
    branches: ['main']
jobs:
  deploy:
    type: deploy
    name: Deploy
    environment: production
    params:
      prod: true

  notify:
    name: Notify Slack
    needs: [deploy]
    runs-on: ubuntu-latest
    steps:
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "Deployment to production completed!"
            }
```

## ワークフローの監視

### ダッシュボードで確認

1. [expo.dev](https://expo.dev)にアクセス
2. プロジェクトを選択
3. Workflows タブを開く
4. 実行履歴とステータスを確認

### ログの確認

- 各ワークフロー実行の詳細ログを表示
- エラーメッセージとスタックトレースを確認
- デプロイ時間とリソース使用状況を監視

## トラブルシューティング

### デプロイ失敗

1. **環境変数が設定されていない**
   ```bash
   eas env:list --environment production
   ```

2. **ビルドエラー**
   - ワークフローログを確認
   - ローカルで`npx expo export --platform web`を実行してテスト

3. **権限エラー**
   - GitHub統合が正しく設定されているか確認
   - EASプロジェクトへのアクセス権限を確認

## ベストプラクティス

### 1. 環境の分離

```yaml
# プロダクション環境とステージング環境を分離
production:
  branch: main
  environment: production
  prod: true

staging:
  branch: develop
  environment: staging
  alias: staging
```

### 2. テストの統合

```yaml
# デプロイ前にテストを実行
jobs:
  test:
    - run: npm test
    - run: npm run lint

  deploy:
    needs: [test]
    # デプロイ設定
```

### 3. ロールバック戦略

デプロイ前に：
- 現在のプロダクションバージョンを記録
- ロールバック用のエイリアスを作成
- デプロイ後の監視を設定

## 次のステップ

- [環境変数の詳細設定](/frameworks/expo/docs/eas/hosting/environment-variables)
- [キャッシング戦略の最適化](/frameworks/expo/docs/eas/hosting/reference/caching)
- [APIルートの監視](/frameworks/expo/docs/eas/hosting/api-routes)

## 関連リソース

- [EAS Workflowsドキュメント](https://docs.expo.dev/eas/workflows/)
- [GitHub Actions統合](https://docs.expo.dev/eas/workflows/github-actions/)
