# �X����kPrisma ORM���Y� (TypeScript h PostgreSQL)

## M�a�

�X����kPrisma���Y�Mk�LŁgY

- `package.json`�+��XnNode.js����
- Node.jsL�����U�fD�
- PostgreSQL����������L<�WfD�

## Prisma ORMn��Ȣ��

### 1. Prisma CLI������Y�

�z�X��hWfPrisma CLI������W~Y

```bash
npm install prisma --save-dev
```

### 2. Prisma���ȒY�

!n����gPrisma���ȒW~Y

```bash
npx prisma init --datasource-provider postgresql --output ../generated/prisma
```

Sn����o�n3d��LW~Y

1. `prisma`ǣ���\
2. `schema.prisma`ա��\
3. ��������(n`.env`ա��\

### 3. ������-����Y�

`schema.prisma`ա��g������n-����W~Y

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 4. ��������URL�-�Y�

`.env`ա��g`DATABASE_URL`�-�W~Y

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

��URLnb

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

## ́j��

- Prismao�ï���/APIdQk-U�fD~Y
- ��������URLLŁgY
- pn��������Ф�������WfD~Y

## !n����

!n�����go�Xn���������ޒPrisma����hWfh�Y���kdDffs~Y
