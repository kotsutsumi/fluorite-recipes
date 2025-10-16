# KoyebへのPrismaアプリのデプロイ

PostgreSQLを使用したPrisma ORMのNode.jsサーバーをKoyebにセットアップしてデプロイします。

## 前提条件

- ホスト済みPostgreSQLデータベース
- GitHubアカウント
- Koyebアカウント
- Node.jsのインストール

## デプロイ手順

### 1. GitHubにコードをプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Koyebでデプロイ

1. Koyebダッシュボードで**Create App**をクリック
2. GitHubリポジトリを選択
3. ブランチを選択
4. アプリ名とリージョンを設定

### 3. 環境変数の設定

`DATABASE_URL`をKoyeb Secretとして設定:
1. **Secrets**セクションに移動
2. 新しいSecretを作成
3. `DATABASE_URL`に接続文字列を設定

### 4. ビルド設定

`package.json`に以下を追加:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy",
    "start": "node server.js"
  }
}
```

Koyebは自動的に`build`と`start`スクリプトを実行します。

## 重要な設定詳細

- Git駆動のデプロイメントが自動ビルドをトリガー
- 環境変数はKoyeb Secretsで安全に管理
- ビルドプロセス中にマイグレーションが適用される
- Node.jsランタイムで自動ビルドと起動

## ベストプラクティス

- `DATABASE_URL`をSecretとして保存
- マイグレーションをビルドスクリプトに含める
- Git統合を使用して自動デプロイ

## さらに学ぶ

- [Koyebドキュメント](https://www.koyeb.com/docs)
- [Prisma Migrate](/docs/orm/prisma-migrate)
