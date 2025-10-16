# Prisma validator

`Prisma.validator`は、生成された型を受け取り、生成された型のモデルフィールドに準拠する型安全なオブジェクトを返すユーティリティ関数です。

> **注意**: `Prisma.validator`のユースケースがある場合は、TypeScriptの新しい`satisfies`キーワードでPrisma Clientのワークフローを改善する方法についての[ブログ記事](https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb)をぜひチェックしてください。

## 型付きクエリステートメントの作成

アプリケーション全体でさまざまなクエリで再利用したい新しい`userEmail`オブジェクトを作成したとします:

```typescript
import { Prisma } from '@prisma/client'

const userEmail: Prisma.UserSelect = {
  email: true,
}

// 非同期関数内で実行
const user = await prisma.user.findUnique({
  where: {
    id: 3,
  },
  select: userEmail,
})
```

これはうまく機能しますが、注意点があります: TypeScriptはオブジェクトのキーや値を推論しません。

## `Prisma.validator`の使用

次の例では、`UserSelect`生成型を`Prisma.validator`ユーティリティ関数に渡しています:

```typescript
import { Prisma } from '@prisma/client'

const userEmail = Prisma.validator<Prisma.UserSelect>()({
  email: true,
})

// 非同期関数内で実行
const user = await prisma.user.findUnique({
  where: {
    id: 3,
  },
  select: userEmail,
})
```

この方法により、TypeScriptは`userEmail`オブジェクトのキーと値を正しく推論できます。

## `Prisma.validator`とフォーム入力の組み合わせ

フォーム入力を処理するための型安全な関数の作成例:

```typescript
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const userCreateInput = Prisma.validator<Prisma.UserCreateInput>()({
  email: '',
  name: '',
  posts: {
    create: {
      title: '',
    },
  },
  profile: {
    create: {
      bio: '',
    },
  },
})

const createUserAndPost = async (
  name: string,
  email: string,
  postTitle: string,
  profileBio: string
) => {
  const data: typeof userCreateInput = {
    email,
    name,
    posts: {
      create: {
        title: postTitle,
      },
    },
    profile: {
      create: {
        bio: profileBio,
      },
    },
  }

  const user = await prisma.user.create({ data })
  return user
}
```

## 複雑なクエリオプションの検証

```typescript
import { Prisma } from '@prisma/client'

// 複雑なincludeオプションを定義
const userWithRelations = Prisma.validator<Prisma.UserInclude>()({
  posts: {
    include: {
      categories: true,
    },
  },
  profile: true,
})

// 使用例
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: userWithRelations,
})
```

## ネストされたクエリの検証

```typescript
import { Prisma } from '@prisma/client'

// ネストされたクエリオプションを定義
const postWithAuthor = Prisma.validator<Prisma.PostArgs>()({
  include: {
    author: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
})

// リレーション内で使用
const users = await prisma.user.findMany({
  include: {
    posts: postWithAuthor,
  },
})
```

## `where`句の検証

```typescript
import { Prisma } from '@prisma/client'

// 再利用可能なwhereフィルターを定義
const publishedPostsFilter = Prisma.validator<Prisma.PostWhereInput>()({
  published: true,
  author: {
    email: {
      endsWith: '@prisma.io',
    },
  },
})

// 使用例
const posts = await prisma.post.findMany({
  where: publishedPostsFilter,
})
```

## TypeScriptの`satisfies`との比較

TypeScript 4.9以降では、`satisfies`演算子を使用することもできます:

```typescript
import { Prisma } from '@prisma/client'

// Prisma.validator を使用
const selectWithValidator = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
})

// satisfies を使用（TypeScript 4.9+）
const selectWithSatisfies = {
  id: true,
  email: true,
} satisfies Prisma.UserSelect
```

`satisfies`の利点:
- よりシンプルな構文
- より良い型推論
- エラーメッセージが明確

## ベストプラクティス

1. **再利用可能なクエリオプション**: 複数の場所で使用されるクエリオプションには`Prisma.validator`を使用する

2. **型安全性の向上**: 複雑なネストされたクエリでは、validatorを使用して型エラーを早期に検出する

3. **ドキュメント化**: 検証されたオブジェクトには明確な名前とコメントを付ける

4. **satisfiesの検討**: TypeScript 4.9以降を使用している場合は、`satisfies`演算子の使用を検討する

5. **中央管理**: よく使用されるクエリオプションは、専用のファイルに集約して管理する

```typescript
// queries/user.ts
import { Prisma } from '@prisma/client'

export const userWithPosts = Prisma.validator<Prisma.UserInclude>()({
  posts: true,
})

export const userWithProfile = Prisma.validator<Prisma.UserInclude>()({
  profile: true,
})

export const activeUsersFilter = Prisma.validator<Prisma.UserWhereInput>()({
  isActive: true,
  deletedAt: null,
})
```

## さらに学ぶ

- [型安全性](/docs/orm/prisma-client/type-safety): Prisma Clientの型安全性について
- [部分的な構造の操作](/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types): モデル型のバリエーションを扱う
- [TypeScript satisfies演算子](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator): TypeScript公式ドキュメント
