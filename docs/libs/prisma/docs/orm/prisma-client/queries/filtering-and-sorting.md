# フィルタリングとソート

Prisma Clientは、任意のモデルフィールドや関連モデルでフィルタリングとソートが可能です。

## フィルタリング（where）

### 基本的なフィルタリング

```typescript
const result = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io'
    }
  }
})
```

### 複数条件の組み合わせ

```typescript
const result = await prisma.user.findMany({
  where: {
    email: { endsWith: 'prisma.io' },
    posts: {
      some: {
        published: true
      }
    }
  }
})
```

### 比較演算子

```typescript
const users = await prisma.user.findMany({
  where: {
    age: {
      gte: 18, // 以上
      lt: 65   // 未満
    }
  }
})
```

### OR条件

```typescript
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: 'prisma.io' } },
      { email: { contains: 'gmail.com' } }
    ]
  }
})
```

### NOT条件

```typescript
const users = await prisma.user.findMany({
  where: {
    NOT: {
      email: { contains: 'test' }
    }
  }
})
```

## ソート（orderBy）

### 単一フィールドでのソート

```typescript
const users = await prisma.user.findMany({
  orderBy: {
    name: 'asc' // 昇順
  }
})
```

### 複数フィールドでのソート

```typescript
const users = await prisma.user.findMany({
  orderBy: [
    { role: 'desc' },
    { name: 'desc' }
  ]
})
```

### リレーションフィールドでのソート

```typescript
const users = await prisma.user.findMany({
  orderBy: {
    posts: {
      _count: 'desc' // 投稿数で降順
    }
  }
})
```

## 高度なフィルタリング

### 大文字小文字を区別しないフィルタリング

```typescript
const users = await prisma.user.findMany({
  where: {
    email: {
      contains: 'prisma',
      mode: 'insensitive' // PostgreSQLとMongoDB
    }
  }
})
```

### NULLチェック

```typescript
const users = await prisma.user.findMany({
  where: {
    name: null // nameがNULLのユーザー
  }
})

const usersWithName = await prisma.user.findMany({
  where: {
    name: { not: null } // nameが非NULLのユーザー
  }
})
```

### 配列フィールドのフィルタリング

```typescript
const posts = await prisma.post.findMany({
  where: {
    tags: {
      has: 'javascript' // tagsに'javascript'を含む
    }
  }
})

const postsWithTags = await prisma.post.findMany({
  where: {
    tags: {
      hasSome: ['typescript', 'prisma'] // いずれかを含む
    }
  }
})
```

## リレーションフィルタリング

### some（少なくとも1つ）

```typescript
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true
      }
    }
  }
})
```

### every（すべて）

```typescript
const users = await prisma.user.findMany({
  where: {
    posts: {
      every: {
        published: true
      }
    }
  }
})
```

### none（1つもない）

```typescript
const users = await prisma.user.findMany({
  where: {
    posts: {
      none: {
        published: false
      }
    }
  }
})
```

## ベストプラクティス

- インデックスが設定されたフィールドでフィルタリング
- 必要最小限の条件を使用
- 複雑なORクエリはパフォーマンスに注意
- 大文字小文字を区別しない検索はデータベースによってサポートが異なる
