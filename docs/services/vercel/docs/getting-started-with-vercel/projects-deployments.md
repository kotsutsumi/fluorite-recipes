# プロジェクトとデプロイメント

Vercelを始めるにあたり、プロジェクトとデプロイメントを理解することが重要です：

## プロジェクトとデプロイメントの定義

### プロジェクト
- [プロジェクト](/docs/projects/overview)は、Vercelにデプロイされたアプリケーションです。
- 1つのリポジトリに複数のプロジェクトを接続できます（[モノレポ](/docs/monorepos)など）
- 各プロジェクトに複数の[デプロイメント](/docs/deployments)を作成可能
- [ダッシュボード](/dashboard)で全てのプロジェクトを確認できます
- [プロジェクトダッシュボード](/docs/projects/project-dashboard)で設定を構成できます

### デプロイメント
- [デプロイメント](/docs/deployments)は、プロジェクトの成功した[ビルド](/docs/deployments/builds#)の結果です
- 以下の方法でトリガーされます：
  - 既存のプロジェクトやテンプレートのインポート
  - [接続された統合](/docs/git)を通じたGitコミットのプッシュ
  - [CLI](/docs/cli)から`vercel deploy`の実行
- 各デプロイメントは[自動的にURLを生成](/docs/deployments/generated-urls)します

### 次のステップ

始めるには、以下の2つの方法があります：

1. [テンプレートをデプロイ](/docs/getting-started-with-vercel/template)
2. [既存のプロジェクトをインポート](/docs/getting-started-with-vercel/import)
