# Create React App on Vercel

## はじめに

Create React App (CRA) は、React フレームワークでシングルページアプリケーションを構築するための開発環境です。最新の JavaScript 機能を設定し、アプリを本番環境用に最適化します。

## Vercel での始め方

CRA を Vercel で始めるには、以下の方法があります：

1. 既存の CRA プロジェクトがある場合：
   - [Vercel CLI](/docs/cli) をインストール
   - プロジェクトのルートディレクトリから `vercel` コマンドを実行

2. テンプレートをデプロイ：
   - [CRA テンプレートをデプロイ](/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmain%2Fexamples%2Fcreate-react-app&template=create-react-app)
   - [ライブ例を確認](https://create-react-template.vercel.app/)

3. Vercel マーケットプレイスからテンプレートを選択

## 静的ファイルのキャッシング

Vercel では：
- 静的ファイルはグローバル CDN の全リージョンにレプリケーション
- 最大 31 日間キャッシュ
- デプロイメント時に最新バージョンを提供

## プレビューデプロイメント

- Git リポジトリを接続すると、各プルリクエストで自動的にプレビューデプロイメントを生成
- コメント機能で共同作業とフィードバックが可能

## Web Analytics

- `@vercel/analytics` パッケージをインストール
- メインコンポーネントに Analytics を追加
