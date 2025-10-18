# Çü¿Ùü¹k¥šY‹ (TypeScript h PostgreSQL)

## Çü¿Ùü¹¥šn-š

Prisma¹­üŞÕ¡¤ë`prisma/schema.prisma`	gÇü¿Ùü¹¥š’-šW~YÇü¿Ùü¹URLko°ƒ	p’(W~Y

### schema.prisman-š

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## ¥šURLb

PostgreSQLn¥šURLË 

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

### ³óİüÍóÈn¬

- **USER**: Çü¿Ùü¹æü¶ü
- **PASSWORD**: Çü¿Ùü¹æü¶ünÑ¹ïüÉ
- **HOST**: Û¹È‹: localhost	
- **PORT**: Çü¿Ùü¹µüĞünİüÈ8o5432	
- **DATABASE**: Çü¿Ùü¹
- **SCHEMA**: Çü¿Ùü¹¹­üŞª×·çóÇÕ©ëÈo "public"	

## ¥šURLn‹

### íü«ë macOS n‹

```env
DATABASE_URL="postgresql://janedoe:janedoe@localhost:5432/janedoe?schema=hello-prisma"
```

### Heroku n‹

```env
DATABASE_URL="postgresql://opnmyfngbknppm:XXX@ec2-46-137-91-216.eu-west-1.compute.amazonaws.com:5432/d50rgmkqi2ipus?schema=hello-prisma"
```

## Íjè‹

°ƒ	p’³ßÃÈWjDˆFk`.gitignore`k`.env`’ı Y‹Sh’¨hW~Y
