# コメント統合

## Gitプロバイダー統合

コメント機能は、あらゆるGitプロバイダーを使用するプロジェクトで利用可能です：

- GitHub、BitBucket、GitLabは「同じレベルの統合で自動的にサポートされます」

主な機能：

- デプロイメントを含むプルリクエストはVercel botからのPRメッセージを受け取る
- PRメッセージには以下が含まれる：
  - デプロイメントURL
  - 「Add your feedback」URL
  - 解決済みコメントの追跡

Vercelはコメント付きのPRにチェックを追加し、これは：

- 未解決のコメントを作成者に通知
- デフォルトでは必須ではない

必須チェックを設定するためのプロバイダー：

- GitHub
- BitBucket
- GitLab

### Vercel CLIデプロイメント

以下のGitプロバイダーでVercel CLIデプロイメントにコメント機能が利用可能：

- GitHub
- GitLab
- BitBucket

コメント機能は以下で動作：

- 本番環境
- localhost（Vercel Toolbarパッケージを使用）

## Vercel Slackアプリ統合

Vercel SlackアプリはデプロイメントをSlackチャネルに接続し、以下の機能を提供：

- デプロイメントとSlack間でディスカッションを同期
- クロスプラットフォームコミュニケーションを許可

### セットアップ手順

1. Vercel MarketplaceからSlack統合を追加
2. 必要な権限を提供
3. VercelアカウントをSlackに接続

### Slackユーザーリンク

- Slackチャネルで`/vercel login`を使用
- クロスプラットフォームでのユーザーメンションを有効化
- 追加のアクションを許可

### Slackコマンド

- `/vercel help`：すべてのコマンドをリスト表示
- `/vercel subscribe`：プロジェクトサブスクリプションを設定
- `/vercel whoami`：リンクされたアカウントを確認

## イシュートラッカー統合

すべてのVercelプランで利用可能、サポート：

- Linear
- Jira Cloud
- GitHub

### プロセス

1. 選択したイシュートラッカーの統合をインストール
2. コメントをイシューに変換
3. イシューの詳細を記入
4. イシューの作成を確認

各イシュートラッカーには、変換時の特定の設定オプションがあります。
