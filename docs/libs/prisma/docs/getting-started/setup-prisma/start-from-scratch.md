# ゼロから始める

このセクションでは、新しいPrismaプロジェクトを開始するための2つの主要なパスを提供します。

## データベースの選択

### リレーショナルデータベース

TypeScriptとPrisma Postgresを使用してリレーショナルデータベースで始める方法を学びます。このパスでは、次のことを学習できます:
- Prisma CLI
- Prisma Client
- Prisma Migrate

### MongoDB

TypeScriptとMongoDBを使用して始める方法を学びます。

## TypeScriptとPostgreSQLでのセットアップ

### 前提条件
- Node.jsがインストールされていること
- PostgreSQLデータベースサーバーが実行されていること

### プロジェクトのセットアップ手順

#### 1. プロジェクトディレクトリの作成

```bash
mkdir hello-prisma
cd hello-prisma
```

#### 2. プロジェクトの初期化

```bash
npm init -y
npm install prisma typescript tsx @types/node --save-dev
npx tsc --init
```

#### 3. Prismaの初期化

```bash
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

#### 4. データベース接続の設定

`.env`ファイルを作成/編集してPostgreSQL接続URLを設定:

```
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
```

#### 5. Prismaスキーマの定義

`prisma/schema.prisma`ファイル内:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// モデルの例
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

### 主要な推奨事項

- データベース認証情報には環境変数を使用
- 明確な型安全なデータモデルを定義
- Prismaの型安全なクエリ機能を活用
- TypeScriptのベストプラクティスに従う

### 次のステップ

このチュートリアルの基礎を完了した後、次のことを実行できます:

1. データベースへの接続
2. マイグレーションの実行
3. Prisma Clientの生成
4. データベースクエリの実行

このチュートリアルは、TypeScriptを使用してPrisma ORMとPostgreSQLを統合するための基礎的なアプローチを提供します。
