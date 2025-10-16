# Prisma スキーマの概要

Prismaスキーマは、Prisma ORMのセットアップを構成する主要な方法です。以下の部分で構成されています：

## 構成要素

### データソース

Prisma ORMが接続するデータソースの詳細を指定します（例：PostgreSQLデータベース）。

### ジェネレータ

データモデルに基づいて生成するクライアントを指定します（例：Prisma Client）。

### データモデル定義

アプリケーションのモデルと関連を指定します。

## ファイル構造

通常、`schema.prisma`という単一のファイル（または`.prisma`拡張子の複数のファイル）で構成されます。

## 主な特徴

- 環境変数を使用してデータベース接続などを設定可能
- コメントは3種類（`//`、`///`、`/* */`）をサポート
- 自動フォーマット機能あり

## 例

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

enum Role {
  USER
  ADMIN
}
```

このスキーマは、データベース接続、クライアント生成、モデル定義を包括的に示しています。
