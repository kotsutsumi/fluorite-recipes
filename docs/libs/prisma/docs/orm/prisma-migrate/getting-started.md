# Prisma Migrateの開始

## 前提条件

- Prisma CLIのインストール
- Prismaスキーマの作成
- データベース接続の設定

## 初回マイグレーション

### 1. Prismaスキーマの作成

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### 2. マイグレーションの作成と適用

```bash
npx prisma migrate dev --name init
```

このコマンドは:
- マイグレーションSQLファイルを生成
- データベースに適用
- Prisma Clientを再生成

### 3. マイグレーションファイルの確認

`prisma/migrations/`ディレクトリに生成されたファイルを確認します。

## スキーマの変更

### 1. スキーマを更新

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

### 2. マイグレーションを作成

```bash
npx prisma migrate dev --name add_created_at
```

## ベストプラクティス

- 意味のあるマイグレーション名を使用
- 大きな変更は小さなマイグレーションに分割
- マイグレーション前にデータベースをバックアップ
