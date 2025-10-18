# 複合IDと制約の操作

複合IDは、2つのフィールドの組み合わせ値を主キーとして使用します。

**注意**: MongoDBは複合IDをサポートしていません。

## スキーマ例

```prisma
model Like {
  postId Int
  userId Int
  User   User @relation(fields: [userId], references: [id])
  Post   Post @relation(fields: [postId], references: [id])
  @@id([postId, userId])
}
```

## 複合IDを使用できる場所

- `findUnique()`
- `findUniqueOrThrow()`
- `delete()`
- `update()`
- `upsert()`
- `connect`と`connectOrCreate`を使用したリレーショナルデータ作成

## クエリ例

### 1. ユニークレコードの検索

```typescript
const like = await prisma.like.findUnique({
  where: {
    likeId: {
      userId: 1,
      postId: 1,
    },
  },
})
```

### 2. レコードの削除

```typescript
const like = await prisma.like.delete({
  where: {
    likeId: {
      userId: 1,
      postId: 1,
    },
  },
})
```

### 3. レコードの更新

```typescript
const like = await prisma.like.update({
  where: {
    likeId: {
      userId: 1,
      postId: 1,
    },
  },
  data: {
    postId: 2,
  },
})
```

### 4. リレーションクエリでの接続

```typescript
await prisma.user.create({
  data: {
    name: 'Alice',
    likes: {
      connect: {
        likeId: {
          postId: 1,
          userId: 2,
        },
      },
    },
  },
})
```

## 重要な注意事項

- 複合IDキーは複数のフィールドで構成されます
- Prismaスキーマで`@@id`属性を使用して定義
- ユニーク操作とリレーション接続に有用
- 多対多リレーションシップで一般的

複合IDは、複数フィールドの組み合わせでレコードを一意に識別する強力な方法を提供します。
