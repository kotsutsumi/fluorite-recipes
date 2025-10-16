# !n����MongoDB	

## Prisma Client API�M�M�"Y�

�ǣ��n��܌_�CTRL+SPACE	�(WfAPI���hpkdDffvShLgM~Y�n�Fj���fWffO`UD

### "hello"�+��?�գ���Y�

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

### �WD�?�\Wf�Xn����k��Y�

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

## Prisma ORMg�����Y�

�hU��������

- **Next.js fullstack���** - Next.js�(W_�빿ï�������n��
- **Remix fullstack���** - Remix�(W_�빿ï�������n��
- **NestJS REST API** - NestJS�(W_REST APIn��

## Prisma Studiog�����"Y�

Prisma Studio�(Y�h�������������k��gM~Y

```bash
npx prisma studio
```

Sn���ɒ�LY�h�馶g������n���h:J�s��gM�GUIL�M~Y

## Prisma ORMn����fY

U~V~j�S��ïn����L(U�fD~Y

- **Next.js fullstack** - Next.js�(W_�빿ï�������
- **Next.js with GraphQL** - GraphQL�qW_Next.js���
- **GraphQL Nexus** - Nexus�(W_GraphQL API
- **Express REST API** - Express�(W_REST API
- **gRPC API** - gRPC��ȳ�(W_API

[Prisma Examples�ݸ��](https://github.com/prisma/prisma-examples/)g���j�ŋ���gM~Y

## y�d���

- �ǣ��n��܌CTRL+SPACE	�(WfAPI���hp�fv
- U~V~j��꿤�h������"Y�
- ���j��n_�k�����ݸ�꒺�Y�
