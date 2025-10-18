# Netlify

[Prisma PostgresのNetlify拡張機能](https://www.netlify.com/integrations/prisma)は、NetlifyサイトをPrisma Postgresインスタンスと接続します。接続すると、拡張機能はデプロイされたNetlifyサイトに`DATABASE_URL`環境変数を自動的に設定します。

## 機能

- 本番環境とプレビュー環境のPrisma Postgres APIキーの自動生成
- Netlifyサイトの環境設定を簡素化

## 使用方法

### 拡張機能のインストール

拡張機能をインストールするには、Prisma Postgres拡張機能ページの上部にある**Install**をクリックします。

### NetlifyチームにPrisma Platformインテグレーショントークンを追加

NetlifyチームをPrisma Platformワークスペースと接続するために、以下の手順を_一度_実行します:

1. アカウントにログイン
2. Netlifyに接続したいワークスペースを選択
3. 左側のサイドバーの**Integrations**メニューに移動
4. プロンプトに従って新しいNetlifyインテグレーショントークンを作成し、トークン値をコピー
5. トークンを**Integration Token**フィールドに貼り付け
6. **Save**をクリックしてセットアップを完了

### NetlifyサイトにPrisma Postgresを追加

Prisma Postgresを使用したい_すべてのNetlifyサイト_について、以下の手順を実行します:

1. Netlifyのサイトビューに移動し、**Extensions**セクションの下にある**Prisma Postgres**をクリック
2. **Project**セレクターからPrismaプロジェクトを選択
3. **Production environment**の環境を設定
4. **Preview environment**の環境を設定
5. **Save**をクリックしてサイトのセットアップを完了
6. 拡張機能は自動的にPrisma Postgresインスタンスを作成し、その接続URLを`DATABASE_URL`環境変数に保存

## 追加の考慮事項

### プロジェクトが`DATABASE_URL`環境変数を使用していることを確認

`schema.prisma`ファイルのデータソースが`DATABASE_URL`環境変数を使用するように設定されていることを確認します:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
