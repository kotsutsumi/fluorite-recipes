# Prisma���ޒ\Y� (TypeScript h MongoDB)

## ����ա��n��

`prisma/schema.prisma`ա�뒋M�թ��n����n���޳��knM�H~Y

## Prisma����n�

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

## MongoDB����ńj��

### IDգ���n����

- MongoDBgo�hj�IDգ���o8k`_id`gY
- ID�`@map("_id")`g����Y�ŁLB�~Y
- `@db.ObjectId`������Ȓ(WfMongoDBnObjectId���W~Y

### �������������hnUD

MongoDB����ko�����������������h�Wf�nUDLB�~Y

- IDգ���n�����
- ObjectId�n(
- ˁ��Address�ji	n����

## ����n�� 

### ���

- **Post**: ��?�hY���
- **User**: �����1�hY���
- **Comment**: ���ȒhY���

### �

- **Address**: ����nO@�1�hYˁ��

## !n����

!n�����goPrisma Clientn������kdDffs~Y
