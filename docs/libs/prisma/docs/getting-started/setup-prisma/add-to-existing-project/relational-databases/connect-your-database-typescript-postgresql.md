# TypeScriptとPostgreSQLを使用して既存のデータベースに接続する

## データベース接続の主要なステップ

1. Prismaスキーマファイル（`prisma/schema.prisma`）でデータベース接続を設定します:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. `.env`ファイルでデータベース接続URLを定義します

### 接続URL形式
PostgreSQLの接続URLは次の構造に従います:
`postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA`

### 接続URLの例:
- Herokuでホストされているデータベース:
```
DATABASE_URL="postgresql://opnmyfngbknppm:XXX@ec2-46-137-91-216.eu-west-1.compute.amazonaws.com:5432/d50rgmkqi2ipus?schema=hello-prisma"
```

- ローカルmacOSデータベース:
```
DATABASE_URL="postgresql://janedoe:janedoe@localhost:5432/janedoe?schema=hello-prisma"
```

### 重要な注意事項:
- データベースURLには環境変数を使用してください
- `schema`パラメータはオプションです
- `postgres://`と`postgresql://`は多くの場合互換性があります
- 指定されていない場合、デフォルトのスキーマは`public`です

このドキュメントは、TypeScriptを使用してPrismaプロジェクトにPostgreSQLデータベースを接続するためのガイダンスを提供し、柔軟な設定と安全な接続管理を重視しています。
