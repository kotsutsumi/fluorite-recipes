# HerokuへのPrismaアプリのデプロイ

PostgreSQLを使用したPrisma ORMのNode.jsサーバーをHerokuにデプロイします。

## 前提条件

- Herokuアカウント
- Heroku CLIのインストール
- Node.jsのインストール
- PostgreSQL CLIのインストール

## セットアップ手順

### 1. サンプルコードのダウンロード

```bash
git clone https://github.com/prisma/prisma-examples
cd prisma-examples/deployment-platforms/heroku
npm install
```

### 2. Gitリポジトリの作成

```bash
git init
git add .
git commit -m "Initial commit"
```

### 3. Heroku CLIへのログイン

```bash
heroku login
```

### 4. Herokuアプリの作成

```bash
heroku create your-app-name
```

### 5. PostgreSQLデータベースの追加

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### 6. デプロイ

```bash
git push heroku main
```

## Heroku固有の考慮事項

### 動的ポートへのバインド

```javascript
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### データベースURL

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Herokuは自動的に`DATABASE_URL`環境変数を設定します。

### SSL証明書の検証

PostgreSQL接続でSSL証明書の検証を条件付きで処理:

```javascript
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})
```

## マイグレーション

Herokuのリリースフェーズで`prisma migrate deploy`を実行:

```json
{
  "scripts": {
    "build": "prisma generate",
    "heroku-postbuild": "prisma migrate deploy"
  }
}
```

## テスト

```bash
# ログを確認
heroku logs --tail

# アプリを開く
heroku open
```

## トラブルシューティング

### ビルドエラー

- Prismaが`dependencies`に含まれていることを確認（`devDependencies`ではない）
- `package.json`の`engines`フィールドでNode.jsバージョンを指定

### データベース接続エラー

- `DATABASE_URL`環境変数が正しく設定されているか確認
- Heroku PostgreSQLアドオンが追加されているか確認

## さらに学ぶ

- [Herokuドキュメント](https://devcenter.heroku.com/)
- [Prisma Migrate](/docs/orm/prisma-migrate)
