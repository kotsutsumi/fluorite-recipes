# RenderへのPrismaアプリのデプロイ

Prisma ORMとPostgreSQLを使用するNode.jsサーバーをRenderにデプロイします。

## 前提条件

- Renderアカウント
- GitHubリポジトリ

## デプロイ手順

### 1. PostgreSQLデータベースの作成

1. Renderダッシュボードで**New +**をクリック
2. **PostgreSQL**を選択
3. データベース名とリージョンを設定
4. **Create Database**をクリック

### 2. Webサービスの作成

1. **New +** > **Web Service**を選択
2. GitHubリポジトリを接続
3. 以下を設定:
   - **Environment**: Node
   - **Build Command**: `npm install --production=false`
   - **Pre-Deploy Command**: `npx prisma migrate deploy`
   - **Start Command**: `npm run start`

### 3. 環境変数の設定

**Environment**タブで`DATABASE_URL`を設定:
- 内部データベースURLを使用（Renderダッシュボードから取得）

### 4. デプロイ

**Deploy**をクリックしてデプロイを開始

## データベースシード

### 方法1: Pre-Deployコマンドに追加

```
npx prisma migrate deploy; npx prisma db seed
```

### 方法2: SSHでサーバーにアクセス

```bash
npx prisma db seed
```

## render.yamlによるInfrastructure as Code

```yaml
services:
  - type: web
    name: myapp
    env: node
    buildCommand: npm install --production=false
    preDeployCommand: npx prisma migrate deploy
    startCommand: npm run start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: myapp-db
          property: connectionString

databases:
  - name: myapp-db
    databaseName: myapp
    user: myapp
```

## ベストプラクティス

- 内部データベースURLを使用してパフォーマンスを向上
- Git統合を活用して自動デプロイ
- デプロイ前にマイグレーションを実行

## さらに学ぶ

- [Renderドキュメント](https://render.com/docs)
- [Prisma Migrate](/docs/orm/prisma-migrate)
