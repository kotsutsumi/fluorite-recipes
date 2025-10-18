# SevallaへのPrismaアプリのデプロイ

Prisma ORMとPostgreSQLを使用するNode.jsサーバーをSevallaにデプロイします。

## 前提条件

- Sevallaアカウント（$50の無料クレジット含む）
- GitHubリポジトリ

## デプロイ手順

### 1. Sevallaでアプリケーションを作成

1. Sevallaダッシュボードにログイン
2. **New Application**をクリック
3. Gitリポジトリを選択
4. ブランチを選択
5. アプリケーション名とリージョンを設定
6. Podサイズを選択

### 2. PostgreSQLデータベースの設定

1. 同じリージョンにデータベースを作成
2. アプリケーションをデータベースに接続
3. `DATABASE_URL`環境変数を設定

### 3. デプロイのトリガー

1. アプリケーションダッシュボードで**Deploy**をクリック
2. Sevallaは自動的にNixpacksを使用してビルド

## オプション: データベースシード

Webターミナルを使用:

```bash
npx prisma db seed
```

## Sevallaの注目機能

- Git駆動のデプロイメント
- Google Kubernetes Engine上で実行
- プライベートネットワーキング
- 組み込みの自動スケーリング
- 複数のデータベースタイプをサポート

## サンプルプロジェクト

既存のアプリケーションがない場合は、[サンプルプロジェクト](https://github.com/sevalla-templates/express-prisma-demo)を使用できます。

## ベストプラクティス

- アプリケーションとデータベースを同じリージョンに配置
- プライベートネットワーキングを使用してセキュリティを向上
- 自動スケーリング機能を活用

## さらに学ぶ

- [Sevallaドキュメント](https://docs.sevalla.com/)
- [Prisma Migrate](/docs/orm/prisma-migrate)
