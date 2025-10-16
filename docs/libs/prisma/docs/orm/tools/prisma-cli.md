# Prisma CLI

Prisma CLIは、Prismaプロジェクトを管理するための強力なコマンドラインツールです。

## インストール

```bash
npm install -D prisma
```

## 主要なコマンド

### 初期化

```bash
npx prisma init
```

### Clientの生成

```bash
npx prisma generate
```

### マイグレーション

```bash
# 開発環境
npx prisma migrate dev

# 本番環境
npx prisma migrate deploy

# マイグレーション状態の確認
npx prisma migrate status
```

### データベース操作

```bash
# スキーマをデータベースにプッシュ
npx prisma db push

# データベースからスキーマを取得
npx prisma db pull

# データベースをシード
npx prisma db seed
```

### Prisma Studio

```bash
npx prisma studio
```

### フォーマット

```bash
npx prisma format
```

### バリデーション

```bash
npx prisma validate
```

## 環境変数

`.env`ファイルまたは`--env-file`オプションで環境変数を指定:

```bash
npx prisma migrate dev --env-file .env.development
```

## ベストプラクティス

- プロジェクトごとにローカルインストール
- `package.json`にスクリプトを追加
- CI/CDパイプラインで自動化
