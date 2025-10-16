# MongoDB������k��Y� (TypeScript h MongoDB)

## ��������n-�

Prisma����g���������Ȣ��W~Y

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

## ��URLn-�

`.env`ա��g`DATABASE_URL`���W~Y

```env
DATABASE_URL="mongodb+srv://test:test@cluster0.ns1yp.mongodb.net/myFirstDatabase"
```

## ��URLb

MongoDBn��URL� 

```
mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

### �������n�

- **USERNAME**: ����������
- **PASSWORD**: ����������nѹ���
- **HOST**: MongoDB۹�n4@
- **PORT**: ����������n���8o27017	
- **DATABASE**: y�n������

## ������ƣ�

### �<nOL

�<nOLLzW_4o���Wk`?authSource=admin`���WfO`UD

```env
DATABASE_URL="mongodb://USERNAME:PASSWORD@HOST:PORT/DATABASE?authSource=admin"
```

### ]n�n��

- ������L��URLk:�k+~�fD�Sh���WfO`UD
- MongoDB Atlas�(WfD�4o���WnbL�rpj�~Y`mongodb+srv://`��ȳ�(	
