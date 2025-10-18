# 型ユーティリティ

Prisma Client内には、高度に型安全な拡張の作成を支援するいくつかの型ユーティリティが存在します。

## 型ユーティリティについて

Prisma Client型ユーティリティは、アプリケーションとPrisma Client拡張内で利用でき、拡張のための安全で拡張可能な型を構築する便利な方法を提供します。

利用可能な型ユーティリティは以下の通りです:

* `Exact<Input, Shape>`: `Input`に対して厳密な型安全性を強制します。`Exact`は、ジェネリック型`Input`が`Shape`で指定した型に厳密に準拠することを確認します。`Input`を最も正確な型に絞り込みます。

* `Args<Type, Operation>`: 任意のモデルとオペレーションの入力引数を取得します。これは、以下を行いたい拡張作成者にとって特に便利です:
    * 既存の型を拡張または変更するために再利用する
    * 既存のオペレーションと同じ自動補完体験の恩恵を受ける

* `Result<Type, Arguments, Operation>`: 入力引数を受け取り、指定されたモデルとオペレーションの結果を提供します。通常、これは`Args`と組み合わせて使用します。`Args`と同様に、`Result`は既存の型を拡張または変更するために再利用するのに役立ちます。

* `Payload<Type, Operation>`: 指定されたモデルとオペレーションのスカラーとリレーションオブジェクトとしての結果の全体構造を取得します。たとえば、これを使用して、型レベルでどのキーがスカラーまたはオブジェクトであるかを判断できます。

## 例: 既存のオペレーションに基づく新しいオペレーション

次の例では、`findFirst`に基づいた新しいオペレーション`exists`を作成します。これは`findFirst`のすべての引数を持ちます:

```typescript
const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      // すべてのモデルで新しい`exists`オペレーションを定義
      // Tは現在のモデルに対応するジェネリック型
      async exists<T>(
        // `this`は現在の型を参照します。例: 実行時の`prisma.user`
        this: T,
        // `exists`関数は現在のモデルの`where`引数を使用します
        where: Prisma.Args<T, 'findFirst'>['where']
      ): Promise<boolean> {
        // モデルコンテキストを取得
        const context = Prisma.getExtensionContext(this)
        // findFirstを実行してレコードの存在を確認
        const result = await (context as any).findFirst({ where })
        return result !== null
      }
    }
  }
})

// 使用例
const userExists = await prisma.user.exists({
  where: { email: 'alice@prisma.io' }
})
console.log(userExists) // true または false
```

## 例: Resultを使用した結果の型付け

```typescript
type UserWithPosts = Prisma.Result<
  typeof prisma.user,
  { include: { posts: true } },
  'findFirst'
>

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async findWithPosts(id: number): Promise<UserWithPosts | null> {
        return prisma.user.findFirst({
          where: { id },
          include: { posts: true }
        })
      }
    }
  }
})
```

## 例: Payloadを使用した構造の判断

```typescript
type UserPayload = Prisma.Payload<typeof prisma.user, 'findFirst'>

// UserPayloadは以下のような構造を持ちます:
// {
//   scalars: { id: number, email: string, name: string | null, ... }
//   objects: { posts: Post[], profile: Profile | null, ... }
// }
```

## 例: Exactを使用した厳密な型チェック

```typescript
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async createStrict<T>(
        data: Prisma.Exact<T, Prisma.UserCreateInput>
      ) {
        return prisma.user.create({ data })
      }
    }
  }
})

// 正しい使用
await prisma.user.createStrict({
  email: 'alice@prisma.io',
  name: 'Alice'
})

// エラー: 余分なプロパティが検出されます
await prisma.user.createStrict({
  email: 'alice@prisma.io',
  name: 'Alice',
  invalidField: 'value' // TypeScriptエラー
})
```

## ベストプラクティス

1. **型の再利用**: 既存のPrisma型を再利用して一貫性を保つ
2. **ジェネリックの活用**: ジェネリック型を使用して柔軟な拡張を作成
3. **厳密な型付け**: `Exact`を使用して予期しないプロパティを防ぐ
4. **ドキュメント**: 型ユーティリティの使用方法を明確にドキュメント化

これらの型ユーティリティを使用することで、型安全で保守性の高いPrisma Client拡張を作成できます。
