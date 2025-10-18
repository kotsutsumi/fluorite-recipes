# フィールドの除外

Prisma ORM v6.2.0以降、Prismaは`omit`オプションを使用してクエリ結果からフィールドを除外できます。

## グローバルフィールド除外

すべてのクエリで特定のフィールドを除外:

```typescript
const prisma = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
})
```

## ローカルフィールド除外

単一クエリでフィールドを除外:

```typescript
const user = await prisma.user.findUnique({
  omit: {
    password: true
  },
  where: { id: 1 }
})
```

## 複数フィールドの省略

```typescript
const user = await prisma.user.findUnique({
  omit: {
    email: true,
    password: true
  },
  where: { id: 1 }
})
```

## 以前に省略されたフィールドの選択

グローバル省略を`select`または`omit`を`false`に設定することで上書きできます:

```typescript
const user = await prisma.user.findUnique({
  omit: {
    password: false  // グローバル省略を上書き
  },
  where: { id: 1 }
})
```

## TypeScriptの型安全性

正確な型推論を確保するには、`as const`を使用します:

```typescript
const omitConfig = {
  profile: { email: true },
  user: { password: true }
} as const;

const prisma = new PrismaClient({ omit: omitConfig })
```

## 推奨事項

- **グローバル省略**: 機密データの偶発的な露出を防ぐために使用
- **ローカル省略**: クエリ固有のフィールド除外に使用

型安全性を強調し、Prisma Clientクエリでフィールドを除外するための柔軟な方法を提供します。
