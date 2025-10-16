# 型安全性

Prisma Clientのために生成されたコードには、アプリケーションをより型安全にするために使用できる便利な型とユーティリティがいくつか含まれています。

> **注意**: Prisma ORMでの高度な型安全性のトピックに興味がある場合は、TypeScriptの新しい`satisfies`キーワードでPrisma Clientのワークフローを改善する方法についての[ブログ記事](https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb)をぜひチェックしてください。

## 生成された型のインポート

`Prisma`名前空間をインポートし、ドット記法を使用して型とユーティリティにアクセスできます:

```typescript
import { Prisma } from '@prisma/client'

// 'select'オブジェクトを構築
const userEmail: Prisma.UserSelect = {
  email: true,
}

// selectオブジェクトを使用
const createUser = await prisma.user.create({
  data: {
    email: 'bob@prisma.io',
  },
  select: userEmail,
})
```

## 生成された型とは?

生成された型は、モデルから派生したTypeScriptの型です。`prisma.user.create()`のようなメソッドや、`select`や`include`のようなオプションのための型付きオブジェクトを作成するために使用できます。

生成された`UserSelect`型の例:

```typescript
type Prisma.UserSelect = {
  id?: boolean | undefined;
  email?: boolean | undefined;
  name?: boolean | undefined;
  posts?: boolean | Prisma.PostFindManyArgs | undefined;
  profile?: boolean | Prisma.ProfileArgs | undefined;
}
```

### 生成された`UncheckedInput`型

`UncheckedInput`型を使用すると、リレーションスカラーフィールドを直接書き込むなど、Prismaが「安全でない」と見なす操作を実行できます。

## 型ユーティリティ

Prisma Clientは、高度に型安全なアプリケーションを作成するための型ユーティリティを提供します:

- `Exact<Input, Shape>`: 厳密な型安全性を強制します
- `Args<Type, Operation>`: モデルとオペレーションの入力引数を取得します
- `Result<Type, Arguments, Operation>`: 指定された入力引数の結果を提供します
- `Payload<Type, Operation>`: 結果の全体構造を取得します

## 例: 型安全なクエリの構築

```typescript
import { Prisma } from '@prisma/client'

// ユーザーの選択オプションを定義
const userWithPosts: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  posts: {
    select: {
      id: true,
      title: true,
    },
  },
}

// 型安全なクエリの実行
const user = await prisma.user.findFirst({
  select: userWithPosts,
})

// userは完全に型付けされています
console.log(user?.posts[0]?.title)
```

## 例: 型ユーティリティの使用

```typescript
import { Prisma } from '@prisma/client'

// Argsを使用して入力引数の型を取得
type UserCreateArgs = Prisma.Args<typeof prisma.user, 'create'>

// Resultを使用して結果の型を取得
type UserWithPosts = Prisma.Result<
  typeof prisma.user,
  { include: { posts: true } },
  'findFirst'
>

// 型安全な関数の作成
async function createUser(args: UserCreateArgs) {
  return await prisma.user.create(args)
}

async function getUserWithPosts(id: number): Promise<UserWithPosts | null> {
  return await prisma.user.findFirst({
    where: { id },
    include: { posts: true },
  })
}
```

## ベストプラクティス

1. **生成された型を活用**: Prismaが生成する型を使用して、アプリケーション全体で一貫性を保つ

2. **型ユーティリティを使用**: `Exact`、`Args`、`Result`などの型ユーティリティを使用して、より柔軟で型安全なコードを書く

3. **カスタム型の作成**: 複雑なクエリや再利用可能なオプションには、カスタム型を定義する

4. **満足演算子の使用**: TypeScript 4.9以降では、`satisfies`演算子を使用してより良い型推論を得る

```typescript
const userSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect

// userSelectは型推論されつつ、UserSelectに準拠していることが保証される
```

## さらに学ぶ

- [Prisma validator](/docs/orm/prisma-client/type-safety/prisma-validator): 型安全なオブジェクトを作成する
- [部分的な構造の操作](/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types): モデル型のバリエーションを扱う
- [Prisma型システム](/docs/orm/prisma-client/type-safety/prisma-type-system): Prisma ORMの型システムの仕組みを理解する
