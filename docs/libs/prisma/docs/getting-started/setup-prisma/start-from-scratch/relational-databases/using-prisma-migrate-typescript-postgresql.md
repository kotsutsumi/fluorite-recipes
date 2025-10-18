# Prisma Migrate’(Y‹ (TypeScript h PostgreSQL)

## Çü¿Ùü¹¹­üŞn\

åo3dnâÇëPostProfileUser	’+€Prisma¹­üŞn‹gY

### Prisma¹­üŞn‹

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

## Çü¿Ùü¹Ş¤°ìü·çónŸL

!n³ŞóÉgÇü¿Ùü¹Ş¤°ìü·çó’ŸLW~Y

```bash
npx prisma migrate dev --name init
```

### Ş¤°ìü·çó³ŞóÉnÕ\

Sn³ŞóÉoå’ŸLW~Y

1. °WDSQLŞ¤°ìü·çóÕ¡¤ë’\
2. Çü¿Ùü¹kşWfSQLŞ¤°ìü·çóÕ¡¤ë’ŸL
3. Prisma Client’êÕ„k

## Íjè‹

`prisma migrate dev`’ŸLY‹h`generate`³ŞóÉLêÕ„k|súUŒ~Y
