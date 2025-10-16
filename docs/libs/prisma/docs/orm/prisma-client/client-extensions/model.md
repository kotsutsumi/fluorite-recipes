# Model Extensions

Model Extensionsを使用すると、Prismaモデルにカスタムメソッドを追加できます。

**利用可能**: Prisma Client 4.16.0以降

## ユースケース

- 既存のPrisma Clientメソッドと並んで新しい操作を追加
- ビジネスロジックのカプセル化
- 繰り返しの操作を作成
- モデル固有のユーティリティを追加

## 拡張タイプ

### 1. 特定モデルの拡張

```typescript
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async signUp(email: string) {
        await prisma.user.create({ data: { email } })
      },
    },
  },
})
```

### 2. すべてのモデルの拡張

```typescript
const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      async exists<T>(
        this: T,
        where: Prisma.Args<T, 'findFirst'>['where']
      ): Promise<boolean> {
        const context = Prisma.getExtensionContext(this)
        const result = await (context as any).findFirst({ where })
        return result !== null
      },
    },
  },
})
```

## 高度な機能

- `Prisma.getExtensionContext(this)`を使用して他のカスタムメソッドからカスタムメソッドを呼び出す
- `context.$name`でランタイムに現在のモデル名を取得
- 改善された型安全性のために型ユーティリティを使用

## 主要メソッド

- **`$extends()`**: カスタムモデルメソッドで拡張クライアントを作成
- **`Prisma.getExtensionContext(this)`**: 現在のモデルコンテキストを取得

ドキュメントは、型安全性とシンプルな使いやすさを維持しながら、Prismaモデルにカスタム機能を追加する柔軟性を強調しています。
