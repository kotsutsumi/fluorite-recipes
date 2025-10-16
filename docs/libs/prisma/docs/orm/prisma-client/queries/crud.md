# CRUD操作

Prisma Clientは、データベースレコードの作成、読み取り、更新、削除（CRUD）のための型安全なクエリを提供します。

## Create（作成）

### 単一レコードの作成

```typescript
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma'
  }
})
```

### 複数レコードの作成

```typescript
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@prisma.io', name: 'User 1' },
    { email: 'user2@prisma.io', name: 'User 2' },
  ],
  skipDuplicates: true, // 重複をスキップ
})
```

## Read（読み取り）

### 全レコードの取得

```typescript
const allUsers = await prisma.user.findMany()
```

### 条件付き検索

```typescript
const users = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io'
    }
  }
})
```

### 特定レコードの取得

```typescript
const user = await prisma.user.findUnique({
  where: {
    email: 'elsa@prisma.io'
  }
})
```

### 特定フィールドの選択

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    email: true,
    name: true
  }
})
```

## Update（更新）

### 単一レコードの更新

```typescript
const user = await prisma.user.update({
  where: {
    email: 'viola@prisma.io'
  },
  data: {
    name: 'Viola the Magnificent'
  }
})
```

### 複数レコードの更新

```typescript
const updateUsers = await prisma.user.updateMany({
  where: {
    email: {
      contains: 'prisma.io'
    }
  },
  data: {
    role: 'ADMIN'
  }
})
```

### Upsert（作成または更新）

```typescript
const user = await prisma.user.upsert({
  where: {
    email: 'viola@prisma.io'
  },
  update: {
    name: 'Viola'
  },
  create: {
    email: 'viola@prisma.io',
    name: 'Viola'
  }
})
```

## Delete（削除）

### 単一レコードの削除

```typescript
const user = await prisma.user.delete({
  where: {
    email: 'bert@prisma.io'
  }
})
```

### 複数レコードの削除

```typescript
const deleteUsers = await prisma.user.deleteMany({
  where: {
    email: {
      contains: 'prisma.io'
    }
  }
})
```

### 全レコードの削除

```typescript
const deleteUsers = await prisma.user.deleteMany({})
```

## 関連レコードの操作

### ネストされた作成

```typescript
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa',
    posts: {
      create: [
        { title: 'My first post' },
        { title: 'My second post' }
      ]
    }
  }
})
```

## ベストプラクティス

- 一意制約のあるフィールドには`findUnique`を使用
- バルク操作には`createMany`、`updateMany`、`deleteMany`を使用
- トランザクションが必要な場合は`$transaction`を使用
- エラーハンドリングを適切に実装
