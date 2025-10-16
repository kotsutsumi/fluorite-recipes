# カスタムモデル

Prisma Clientでカスタムモデルを作成するための3つの主要なアプローチがあります:

## 1. Prisma Client Extensionsを使用した静的メソッド

Prisma Clientに直接カスタムメソッドを追加します。

```typescript
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async signUp(email: string, password: string) {
        // カスタムサインアップロジック
      },
      async findManyByDomain(domain: string) {
        // カスタムドメインベースのユーザー検索
      },
    },
  },
})
```

**利点**:
- 型安全なカスタムメソッド
- Prisma Clientとの直接統合

## 2. モデルをクラスでラップ

Prisma Client機能をカプセル化するクラスを作成します。

```typescript
class Users {
  constructor(private readonly prismaUser: PrismaClient['user']) {}

  async signup(data: Signup): Promise<User> {
    // カスタムサインアップ実装
  }
}
```

**利点**:
- カスタムバリデーション
- メソッドの実装制御
- 露出するPrisma Clientメソッドの制限が可能

## 3. Prisma Client Modelオブジェクトの拡張

`Object.assign`を使用して既存の機能を失わずにメソッドを追加します。

```typescript
function Users(prismaUser: PrismaClient['user']) {
  return Object.assign(prismaUser, {
    async signup(data: Signup): Promise<User> {
      // カスタムサインアップメソッド
    },
  })
}
```

**利点**:
- 完全なPrisma Clientメソッドアクセスを維持
- 柔軟なカスタムメソッド統合

## 推奨事項

ドキュメントでは、**カスタムモデルメソッドでモデルを拡張するためにPrisma Client extensionsを使用すること**を推奨しています。

## 主な利点

- 型安全なカスタムメソッド
- 柔軟な統合
- 完全なPrisma Client機能を維持

カスタムモデルを使用すると、標準的なPrisma Client操作を超えてビジネスロジックをカプセル化できます。
