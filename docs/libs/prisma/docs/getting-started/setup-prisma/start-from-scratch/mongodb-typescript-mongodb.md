# MongoDBhTypeScriptg¼íK‰Ë‹

## MĞaö

- Node.jsL¤ó¹ÈüëUŒfD‹
- MongoDB 4.2+µüĞüxn¢¯»¹ì×ê«»ÃÈÇ×í¤áóÈ	
- ¨h: MongoDB Atlas’(Y‹h!Xk»ÃÈ¢Ã×gM~Y

## ×í¸§¯Èn»ÃÈ¢Ã×

SnÁåüÈê¢ëgoPrisma ORMhMongoDB’(Wf°WDNode.js/TypeScript×í¸§¯È’\Y‹¹Õ’fs~Y

### 1. ×í¸§¯ÈÇ£ì¯Èê’\Y‹

```bash
mkdir hello-prisma
cd hello-prisma
```

### 2. TypeScript×í¸§¯È’Y‹

```bash
npm init -y
npm install prisma typescript tsx @types/node --save-dev
```

### 3. TypeScript’Y‹

```bash
npx tsc --init
```

### 4. Prisma’Y‹MongoDB×íĞ¤Àü	

```bash
npx prisma init --datasource-provider mongodb --output ../generated/prisma
```

Sn³ŞóÉoå’ŸLW~Y

- `prisma`Ç£ì¯Èê’\
- `schema.prisma`Õ¡¤ë’MongoDB×íĞ¤Àüg-š	
- `.env`Õ¡¤ë’\
- Çü¿Ùü¹¥š	p’-š

## Íjè‹

- SnÁåüÈê¢ëgo`schema.prisma`Õ¡¤ë’èÆWf×íĞ¤Àü’MongoDBk-šY‹ÅLBŠ~Y
- Çü¿Ùü¹¥šh¹­üŞn»ÃÈ¢Ã×k¢Y‹¬¤Àó¹’Ğ›W~Y
- MongoDB 4.2åMnĞü¸çóLì×ê«»ÃÈÇ×í¤áóÈgÅgY

## !n¹ÆÃ×

!n»¯·çógoMongoDBÇü¿Ùü¹xn¥š¹Õh¹­üŞn\¹ÕkdDffs~Y
