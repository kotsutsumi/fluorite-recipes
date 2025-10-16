# Prismaスキーマリファレンス

Prismaスキーマの構文とフィールドタイプの完全なリファレンスです。

## データソース

```prisma
datasource db {
  provider = "postgresql" | "mysql" | "sqlite" | "sqlserver" | "mongodb"
  url      = env("DATABASE_URL")
}
```

## ジェネレーター

```prisma
generator client {
  provider = "prisma-client-js"
}
```

## モデル

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```

## フィールドタイプ

- `String`: 文字列
- `Int`: 整数
- `Float`: 浮動小数点数
- `Boolean`: 真偽値
- `DateTime`: 日時
- `Json`: JSON
- `Bytes`: バイナリデータ

## 属性

- `@id`: プライマリキー
- `@unique`: 一意制約
- `@default`: デフォルト値
- `@relation`: リレーション
- `@map`: データベースカラム名のマッピング
- `@db`: ネイティブデータベース型

詳細については、[公式ドキュメント](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)を参照してください。
