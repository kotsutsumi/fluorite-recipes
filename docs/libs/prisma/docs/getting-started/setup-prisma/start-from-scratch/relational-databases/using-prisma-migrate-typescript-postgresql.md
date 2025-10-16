# Prisma Migrate�(Y� (TypeScript h PostgreSQL)

## ����������n\

�o3dn���PostProfileUser	�+�Prisma����n�gY

### Prisma����n�

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}
```

## ������ޤ������n�L

!n����g������ޤ������LW~Y

```bash
npx prisma migrate dev --name init
```

### ޤ���������n�\

Sn����o���LW~Y

1. �WDSQLޤ������ա��\
2. ������k�WfSQLޤ������ա�뒟L
3. Prisma Client��Մk

## ́j��

`prisma migrate dev`��LY�h`generate`����L�Մk|s�U�~Y
