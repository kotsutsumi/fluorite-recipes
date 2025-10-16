# マルチスキーマ

## 概要

PostgreSQL、CockroachDB、SQL Serverでは、データベースのテーブルを名前付きグループ（スキーマ）に編成できます。スキーマは名前空間として機能し、テーブルを論理的にグループ化し、外部キー制約を定義できます。

このページでは以下について説明します：

- Prismaスキーマへの複数のデータベーススキーマの追加
- Prisma Migrateを使用したスキーマ変更の適用
- 既存の複数スキーマデータベースの内省
- Prisma Clientを使用した複数スキーマにまたがるクエリ

**注意**: マルチスキーマ機能は、PostgreSQL、CockroachDB、SQL Serverでのみサポートされています。SQLiteとMySQLでは利用できません。

## Prismaスキーマへの複数データベーススキーマの追加

データソースブロックの`schemas`フィールドに、データベーススキーマ名の配列を追加します：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["base", "shop"]
}
```

モデルや列挙型に特定のデータベーススキーマを割り当てるには、`@@schema`属性を使用します：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["base", "shop"]
}

model User {
  id     Int     @id
  orders Order[]
  @@schema("base")
}

model Order {
  id      Int  @id
  user    User @relation(fields: [userId], references: [id])
  userId  Int
  @@schema("shop")
}
```

## スキーマ変更の適用

`prisma migrate dev`コマンドを使用して、スキーマ変更をデータベースに適用します：

```bash
npx prisma migrate dev --name add_multi_schema
```

## 既存データベースの内省

既存の複数スキーマデータベースを内省する場合：

```bash
npx prisma db pull
```

## Prisma Clientでのクエリ

複数スキーマを使用している場合でも、Prisma Clientの使用方法は変わりません：

```typescript
const users = await prisma.user.findMany({
  include: {
    orders: true,
  },
})
```

## ユースケース

- マイクロサービスアーキテクチャ
- マルチテナントアプリケーション
- データの論理的分離
- 権限管理の簡素化

## 制限事項

- SQLiteとMySQLではサポートされていません
- すべてのスキーマは同じデータベースインスタンスに存在する必要があります
- クロスデータベースクエリはサポートされていません
