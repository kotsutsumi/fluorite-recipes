# !n¹ÆÃ×MongoDB	

## Prisma Client API’MšM¢"Y‹

¨Ç£¿ünêÕÜŒ_ıCTRL+SPACE	’(WfAPI³üëhpkdDffvShLgM~YånˆFj¯¨ê’fWffO`UD

### "hello"’+€•?’Õ£ë¿êó°Y‹

```typescript
const filteredPosts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: 'hello' } },
      { body: { contains: 'hello' } }
    ],
  },
})
```

### °WD•?’\WfâXnæü¶ük¥šY‹

```typescript
const post = await prisma.post.create({
  data: {
    title: 'Join us for Prisma Day 2020',
    slug: 'prisma-day-2020',
    body: 'A conference on modern application development and databases.',
    author: {
      connect: { email: 'hello@prisma.com' },
    },
  },
})
```

## Prisma ORMg¢×ê’ËÉY‹

¨hUŒ‹ÁåüÈê¢ë

- **Next.js fullstack¢×ê** - Next.js’(W_Õë¹¿Ã¯¢×ê±ü·çónËÉ
- **Remix fullstack¢×ê** - Remix’(W_Õë¹¿Ã¯¢×ê±ü·çónËÉ
- **NestJS REST API** - NestJS’(W_REST APInËÉ

## Prisma StudiogÇü¿’¢"Y‹

Prisma Studio’(Y‹hÇü¿Ùü¹Çü¿’–š„kèÆgM~Y

```bash
npx prisma studio
```

Sn³ŞóÉ’ŸLY‹hÖé¦¶gÇü¿Ùü¹n…¹’h:JˆsèÆgM‹GUIL‹M~Y

## Prisma ORMnµó×ë’fY

U~V~j€S¹¿Ã¯nµó×ëL(UŒfD~Y

- **Next.js fullstack** - Next.js’(W_Õë¹¿Ã¯¢×ê±ü·çó
- **Next.js with GraphQL** - GraphQL’qW_Next.js¢×ê
- **GraphQL Nexus** - Nexus’(W_GraphQL API
- **Express REST API** - Express’(W_REST API
- **gRPC API** - gRPC×íÈ³ë’(W_API

[Prisma Examplesêİ¸Èê](https://github.com/prisma/prisma-examples/)gŸõ„jŸÅ‹’ºgM~Y

## yËdÒóÈ

- ¨Ç£¿ünêÕÜŒCTRL+SPACE	’(WfAPI³üëhp’fv
- U~V~j¯¨ê¿¤×hêìü·çó’¢"Y‹
- Ÿõ„jŸÅn_kµó×ëêİ¸Èê’ºY‹
