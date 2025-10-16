# カスタムモデルとフィールド名

Prismaスキーマでは、データベースのテーブルや列の名前を、PrismaクライアントのAPIで使用される名前から分離することができます。

## 主な目的

- データベースのネーミング規則とPrismaのネーミング規則を調整する
- モデルとフィールドの名前をより自然で読みやすいものにする

## 使用方法

### フィールド名のマッピング（@map）

```prisma
model User {
  id    Int     @id @default(autoincrement()) @map("user_id")
  name  String? @db.VarChar(256)
  email String  @unique @db.VarChar(256)
}
```

### モデル名のマッピング（@@map）

```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String?
  email String  @unique

  @@map("users")
}
```

## 完全な例

元のデータベーススキーマ：

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(256),
    email VARCHAR(256) UNIQUE NOT NULL
);
```

Prismaスキーマの調整：

```prisma
model User {
  id    Int     @id @default(autoincrement()) @map("user_id")
  name  String? @db.VarChar(256)
  email String  @unique @db.VarChar(256)

  @@map("users")
}
```

## メリット

- Prismaの命名規則に従いやすくなる
- コードの可読性の向上
- データベーススキーマとの柔軟な統合
- データベース再内省時にカスタム名を保持

## リレーションでの使用

```prisma
model User {
  id    Int    @id @default(autoincrement()) @map("user_id")
  posts Post[]

  @@map("users")
}

model Post {
  id       Int  @id @default(autoincrement()) @map("post_id")
  author   User @relation(fields: [authorId], references: [id])
  authorId Int  @map("author_id")

  @@map("posts")
}
```
