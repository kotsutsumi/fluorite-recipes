# MongoDBÇü¿Ùü¹k¥šY‹ (TypeScript h MongoDB)

## Çü¿Ùü¹¥šn-š

Prisma¹­üŞgÇü¿½ü¹’»ÃÈ¢Ã×W~Y

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

## ¥šURLn-š

`.env`Õ¡¤ëg`DATABASE_URL`’š©W~Y

```env
DATABASE_URL="mongodb+srv://test:test@cluster0.ns1yp.mongodb.net/myFirstDatabase"
```

## ¥šURLb

MongoDBn¥šURLË 

```
mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

### ³óİüÍóÈn¬

- **USERNAME**: Çü¿Ùü¹æü¶ü
- **PASSWORD**: Çü¿Ùü¹æü¶ünÑ¹ïüÉ
- **HOST**: MongoDBÛ¹Èn4@
- **PORT**: Çü¿Ùü¹µüĞünİüÈ8o27017	
- **DATABASE**: yšnÇü¿Ùü¹

## ÈéÖë·åüÆ£ó°

### <nOL

<nOLLzW_4o¥š‡Wk`?authSource=admin`’ı WfO`UD

```env
DATABASE_URL="mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE?authSource=admin"
```

### ]nÖnè‹

- Çü¿Ùü¹L¥šURLk:„k+~ŒfD‹Sh’ºWfO`UD
- MongoDB Atlas’(WfD‹4o¥š‡WnbLårpjŠ~Y`mongodb+srv://`×íÈ³ë’(	
