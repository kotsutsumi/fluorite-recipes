# âX×í¸§¯ÈkPrisma ORM’ı Y‹ (TypeScript h PostgreSQL)

## MĞaö

âX×í¸§¯ÈkPrisma’ı Y‹MkåLÅgY

- `package.json`’+€âXnNode.js×í¸§¯È
- Node.jsL¤ó¹ÈüëUŒfD‹
- PostgreSQLÇü¿Ùü¹µüĞüL<ÍWfD‹

## Prisma ORMn»ÃÈ¢Ã×

### 1. Prisma CLI’¤ó¹ÈüëY‹

‹zX¢ÂhWfPrisma CLI’¤ó¹ÈüëW~Y

```bash
npm install prisma --save-dev
```

### 2. Prisma×í¸§¯È’Y‹

!n³ŞóÉgPrisma×í¸§¯È’W~Y

```bash
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

Sn³ŞóÉoån3d’ŸLW~Y

1. `prisma`Ç£ì¯Èê’\
2. `schema.prisma`Õ¡¤ë’\
3. Çü¿Ùü¹¥š(n`.env`Õ¡¤ë’\

### 3. Çü¿½ü¹-š’ºY‹

`schema.prisma`Õ¡¤ëgÇü¿½ü¹n-š’ºW~Y

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 4. Çü¿Ùü¹¥šURL’-šY‹

`.env`Õ¡¤ëg`DATABASE_URL`’-šW~Y

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

¥šURLnb

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

## Íjè‹

- PrismaoĞÃ¯¨óÉ/APIdQk-UŒfD~Y
- Çü¿Ùü¹¥šURLLÅgY
- pnÇü¿Ùü¹×íĞ¤Àü’µİüÈWfD~Y

## !n¹ÆÃ×

!n»¯·çógoâXnÇü¿Ùü¹¹­üŞ’Prisma¹­üŞhWfhşY‹¹ÕkdDffs~Y
