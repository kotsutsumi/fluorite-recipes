# MongoDBhTypeScriptg��K�ˁ�

## M�a�

- Node.jsL�����U�fD�
- MongoDB 4.2+����xn������꫻��������	
- �h: MongoDB Atlas�(Y�h!Xk��Ȣ��gM~Y

## ����n��Ȣ��

Sn������goPrisma ORMhMongoDB�(Wf�WDNode.js/TypeScript���Ȓ\Y��Ւfs~Y

### 1. ����ǣ���\Y�

```bash
mkdir hello-prisma
cd hello-prisma
```

### 2. TypeScript���ȒY�

```bash
npm init -y
npm install prisma typescript tsx @types/node --save-dev
```

### 3. TypeScript�Y�

```bash
npx tsc --init
```

### 4. Prisma�Y�MongoDB��Ф��	

```bash
npx prisma init --datasource-provider mongodb --output ../generated/prisma
```

Sn����o���LW~Y

- `prisma`ǣ���\
- `schema.prisma`ա��MongoDB��Ф��g-�	
- `.env`ա��\
- ��������	p�-�

## ́j��

- Sn������go`schema.prisma`ա����Wf��Ф���MongoDBk-�Y�ŁLB�~Y
- ��������h����n��Ȣ��k�Y�����ЛW~Y
- MongoDB 4.2�Mn�����L��꫻��������gŁgY

## !n����

!n�����goMongoDB������xn����h����n\��kdDffs~Y
