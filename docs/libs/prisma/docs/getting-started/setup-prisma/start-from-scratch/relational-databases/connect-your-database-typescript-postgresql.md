# ������k��Y� (TypeScript h PostgreSQL)

## ��������n-�

Prisma����ա��`prisma/schema.prisma`	g���������-�W~Y������URLko��	p�(W~Y

### schema.prisman-�

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## ��URLb

PostgreSQLn��URL� 

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

### �������n�

- **USER**: ����������
- **PASSWORD**: ����������nѹ���
- **HOST**: ۹��: localhost	
- **PORT**: ����������n���8o5432	
- **DATABASE**: ������
- **SCHEMA**: �����������׷���թ��o "public"	

## ��URLn�

### ���� macOS n�

```env
DATABASE_URL="postgresql://janedoe:janedoe@localhost:5432/janedoe?schema=hello-prisma"
```

### Heroku n�

```env
DATABASE_URL="postgresql://opnmyfngbknppm:XXX@ec2-46-137-91-216.eu-west-1.compute.amazonaws.com:5432/d50rgmkqi2ipus?schema=hello-prisma"
```

## ́j��

��	p�����WjD�Fk`.gitignore`k`.env`���Y�Sh��hW~Y
