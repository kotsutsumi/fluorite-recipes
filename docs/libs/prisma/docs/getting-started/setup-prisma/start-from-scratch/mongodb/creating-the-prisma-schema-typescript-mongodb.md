# Prisma¹­üŞ’\Y‹ (TypeScript h MongoDB)

## ¹­üŞÕ¡¤ënèÆ

`prisma/schema.prisma`Õ¡¤ë’‹MÇÕ©ëÈn…¹’ån¹­üŞ³üÉknMÛH~Y

## Prisma¹­üŞn‹

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Post {
  id       String    @id @default(auto()) @map("_id") @db.ObjectId
  slug     String    @unique
  title    String
  body     String
  author   User      @relation(fields: [authorId], references: [id])
  authorId String    @db.ObjectId
  comments Comment[]
}

model User {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  email   String   @unique
  name    String?
  address Address?
  posts   Post[]
}

model Comment {
  id      String @id @default(auto()) @map("_id") @db.ObjectId
  comment String
  post    Post   @relation(fields: [postId], references: [id])
  postId  String @db.ObjectId
}

type Address {
  street String
  city   String
  state  String
  zip    String
}
```

## MongoDB¹­üŞnÍjè‹

### IDÕ£üëÉnŞÃÔó°

- MongoDBgoúhj‹IDÕ£üëÉo8k`_id`gY
- ID’`@map("_id")`gŞÃÔó°Y‹ÅLBŠ~Y
- `@db.ObjectId`¢ÈêÓåüÈ’(WfMongoDBnObjectId‹’šW~Y

### êìü·çÊëÇü¿Ùü¹hnUD

MongoDB¹­üŞkoêìü·çÊëÇü¿Ùü¹¹­üŞhÔWfånUDLBŠ~Y

- IDÕ£üëÉnŞÃÔó°¹Õ
- ObjectId‹n(
- Ë¼‹Address‹ji	nµİüÈ

## ¹­üŞnË 

### âÇë

- **Post**: Öí°•?’hYâÇë
- **User**: æü¶üÅ1’hYâÇë
- **Comment**: ³áóÈ’hYâÇë

### ‹

- **Address**: æü¶ünO@Å1’hYË¼‹

## !n¹ÆÃ×

!n»¯·çógoPrisma Clientn¤ó¹Èüë¹ÕkdDffs~Y
