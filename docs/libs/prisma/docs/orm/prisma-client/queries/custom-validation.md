# カスタムバリデーション

Prisma Clientは、ランタイム入力バリデーションのための2つの主要な方法を提供します:

1. Prisma Client Extensions
2. カスタムバリデーション関数

## 推奨されるバリデーションライブラリ

- **joi**
- **validator.js**
- **Yup**
- **Zod**
- **Superstruct**

## Prisma Client Extensionsを使用した入力バリデーション

Client Extensionsを使用すると、値を作成/更新する際にランタイムバリデーションを追加できます。

### Zodを使用した例

```typescript
const ProductCreateInput = z.object({
  slug: z.string().max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().max(100),
  description: z.string().max(1000),
  price: z.instanceof(Prisma.Decimal)
    .refine((price) => price.gte('0.01') && price.lt('1000000.00')),
})
```

**現在の制限**: トップレベルのデータオブジェクトバリデーションに限定されています。ネストされた操作ではクエリ拡張が機能しません。

## カスタム関数を使用した入力バリデーション

### Superstructを使用した例

```typescript
const Signup = object({
  email: refine(string(), 'email', (v) => isEmail.validate(v)),
  password: size(string(), 7, 30),
  firstName: size(string(), 2, 50),
  lastName: size(string(), 2, 50),
})

async function signup(input: Signup): Promise<User> {
  assert(input, Signup)
  return prisma.user.create({ data: input.user })
}
```

## 重要なポイント

- クエリ拡張はネストされた操作では機能しません
- 組み込みバリデーションのコミュニティ機能リクエストが存在します
- 高度なバリデーションには Prisma Client extensions を検討してください

バリデーションアプローチとライブラリの選択における柔軟性を強調しています。
