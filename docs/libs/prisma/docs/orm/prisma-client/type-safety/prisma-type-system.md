# Prisma ORMの型システムの使用方法

## Prisma ORMの型システムはどのように機能しますか?

Prisma ORMは、_型_を使用してフィールドが保持できるデータの種類を定義します。簡単に始められるように、Prisma ORMはほとんどのデフォルトユースケースをカバーする少数のコアスカラー型を提供しています。

### デフォルトの型マッピング

Prisma ORMは、各スカラー型を基盤となるデータベースのデフォルト型にマッピングする_デフォルトの型マッピング_を提供します。例えば:

- デフォルトでPrisma ORMの`String`型はPostgreSQLの`text`型とMySQLの`varchar`型にマッピングされます
- デフォルトでPrisma ORMの`DateTime`型はPostgreSQLの`timestamp(3)`型とSQL Serverの`datetime2`型にマッピングされます

### Prismaのスカラー型

Prisma ORMは以下のスカラー型を提供します:

| Prisma型 | 説明 |
|---------|------|
| `String` | 可変長のテキスト |
| `Boolean` | 真または偽の値 |
| `Int` | 整数 |
| `BigInt` | 大きな整数 |
| `Float` | 浮動小数点数 |
| `Decimal` | 正確な小数点数 |
| `DateTime` | タイムスタンプ |
| `Json` | JSONデータ |
| `Bytes` | バイナリデータ |

## ネイティブ型マッピング

デフォルトの型マッピングの1つではない、より具体的なデータベース型を使用する必要がある場合があります。この目的のために、Prisma ORMはコアスカラー型を改良するネイティブ型属性を提供します。

### 例: PostgreSQLのネイティブ型

```prisma
model Post {
  id        Int      @id
  title     String   @db.VarChar(255)
  content   String   @db.Text
  price     Decimal  @db.Money
  createdAt DateTime @db.Date
  metadata  Json     @db.JsonB
}
```

### 例: MySQLのネイティブ型

```prisma
model Post {
  id        Int      @id
  title     String   @db.VarChar(255)
  content   String   @db.LongText
  createdAt DateTime @db.DateTime(0)
  views     BigInt   @db.BigInt
}
```

### 例: SQL Serverのネイティブ型

```prisma
model Post {
  id        Int      @id
  title     String   @db.NVarChar(255)
  content   String   @db.Text
  createdAt DateTime @db.DateTime2
  isActive  Boolean  @db.Bit
}
```

## データベース型のイントロスペクション

既存のデータベースをイントロスペクトすると、Prisma ORMは各テーブルカラムのデータベース型を取得し、正しいPrisma ORM型を使用してPrismaスキーマで表現します。

### イントロスペクションの例

SQLテーブル定義:

```sql
CREATE TABLE "public"."User" (
  id serial PRIMARY KEY NOT NULL,
  name text NOT NULL,
  email varchar(255) NOT NULL,
  "isActive" boolean NOT NULL,
  "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  balance decimal(10, 2)
);
```

`npx prisma db pull`を実行すると、次のようになります:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @db.VarChar(255)
  isActive  Boolean
  createdAt DateTime @default(now()) @db.Timestamp(3)
  balance   Decimal? @db.Decimal(10, 2)
}
```

Prismaは、データベースの型を正確に保持するためにネイティブ型属性を追加します。

## スキーマ変更をデータベースに適用する方法

Prisma Migrateまたは`db push`を使用してスキーマ変更を適用すると、Prisma ORMはPrismaスカラー型とネイティブ属性の両方を使用して、正しいデータベース型を決定します。

### 例: マイグレーションでの型の使用

Prismaスキーマ:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(100)
  description String   @db.Text
  price       Decimal  @db.Decimal(10, 2)
  stock       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

`npx prisma migrate dev`を実行すると、Prismaは次のようなSQLを生成します:

```sql
CREATE TABLE "Product" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "stock" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
```

## データベース固有のネイティブ型

### PostgreSQL

```prisma
model Example {
  id       Int      @id
  text     String   @db.Text
  varchar  String   @db.VarChar(255)
  char     String   @db.Char(10)
  smallint Int      @db.SmallInt
  integer  Int      @db.Integer
  bigint   BigInt   @db.BigInt
  decimal  Decimal  @db.Decimal(10, 2)
  numeric  Decimal  @db.Numeric(10, 2)
  real     Float    @db.Real
  double   Float    @db.DoublePrecision
  money    Decimal  @db.Money
  json     Json     @db.Json
  jsonb    Json     @db.JsonB
  uuid     String   @db.Uuid
  date     DateTime @db.Date
  time     DateTime @db.Time(6)
  timestamp DateTime @db.Timestamp(6)
  timestamptz DateTime @db.Timestamptz(6)
}
```

### MySQL

```prisma
model Example {
  id        Int      @id
  varchar   String   @db.VarChar(255)
  text      String   @db.Text
  tinytext  String   @db.TinyText
  mediumtext String  @db.MediumText
  longtext  String   @db.LongText
  tinyint   Int      @db.TinyInt
  smallint  Int      @db.SmallInt
  mediumint Int      @db.MediumInt
  int       Int      @db.Int
  bigint    BigInt   @db.BigInt
  decimal   Decimal  @db.Decimal(10, 2)
  float     Float    @db.Float
  double    Float    @db.Double
  date      DateTime @db.Date
  datetime  DateTime @db.DateTime(0)
  timestamp DateTime @db.Timestamp(0)
  time      DateTime @db.Time(0)
  year      Int      @db.Year
}
```

### SQL Server

```prisma
model Example {
  id          Int      @id
  nvarchar    String   @db.NVarChar(255)
  varchar     String   @db.VarChar(255)
  text        String   @db.Text
  ntext       String   @db.NText
  tinyint     Int      @db.TinyInt
  smallint    Int      @db.SmallInt
  int         Int      @db.Int
  bigint      BigInt   @db.BigInt
  decimal     Decimal  @db.Decimal(10, 2)
  numeric     Decimal  @db.Numeric(10, 2)
  float       Float    @db.Float(53)
  real        Float    @db.Real
  money       Decimal  @db.Money
  smallmoney  Decimal  @db.SmallMoney
  bit         Boolean  @db.Bit
  date        DateTime @db.Date
  datetime    DateTime @db.DateTime
  datetime2   DateTime @db.DateTime2
  time        DateTime @db.Time
  uniqueidentifier String @db.UniqueIdentifier
}
```

## ベストプラクティス

1. **適切な型の選択**: データの性質に基づいて適切なPrisma型を選択する

2. **ネイティブ型の使用**: データベース固有の最適化が必要な場合は、ネイティブ型属性を使用する

3. **精度の指定**: 金銭的な値には`Decimal`型を使用し、適切な精度を指定する

4. **文字列長の制限**: 可能な限り`@db.VarChar(n)`を使用して文字列長を制限する

5. **イントロスペクションの活用**: 既存のデータベースをイントロスペクトして、正しい型マッピングを確認する

## さらに学ぶ

- [Prismaスキーマリファレンス](/docs/orm/reference/prisma-schema-reference): すべての型とネイティブ型属性の完全なリファレンス
- [データモデル](/docs/orm/prisma-schema/data-model): Prismaスキーマでのデータモデリング
- [イントロスペクション](/docs/orm/prisma-schema/introspection): 既存のデータベースからスキーマを生成
