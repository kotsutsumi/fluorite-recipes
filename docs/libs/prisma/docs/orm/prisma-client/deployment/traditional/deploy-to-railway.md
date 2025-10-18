# RailwayへのPrismaアプリのデプロイ

Prisma ORMとPrisma Postgresを使用するアプリをRailwayにデプロイします。

## 前提条件

- Railwayアカウント
- GitHubリポジトリ

## デプロイ手順

### 1. Railwayプロジェクトの作成

1. Railwayダッシュボードに移動
2. **Create a New Project**をクリック
3. **GitHub Repo**を選択
4. Railwayを認可
5. リポジトリを選択

### 2. データベースの設定

#### オプション1: 新しいデータベースを作成

Railwayダッシュボードで新しいPostgresデータベースを作成

#### オプション2: CLIを使用

```bash
npx create-db
```

### 3. データベースURLの追加

1. サービスの**Variables**タブに移動
2. `DATABASE_URL`変数を作成
3. 接続文字列を貼り付け
4. **Deploy**をクリック

### 4. アプリケーションへのアクセス

1. **Settings**タブに移動
2. **Generate Domain**をクリック
3. 生成されたURLにアクセス

## クイックセットアップ

[公式Prisma Railwayテンプレート](https://railway.com/deploy/prisma-postgres)を使用して迅速にセットアップできます。

## トラブルシューティング

- デプロイが失敗した場合、サービスログを確認
- `DATABASE_URL`が正しく設定されているか確認

## ベストプラクティス

- 環境変数で機密情報を管理
- Gitベースのデプロイメントを使用
- サービスログを定期的に確認

## さらに学ぶ

- [Railwayドキュメント](https://docs.railway.app)
- [Prismaデプロイメントガイド](https://www.prisma.io/docs/orm/prisma-client/deployment)
