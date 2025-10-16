# モデル型の部分的な構造に対する操作

Prisma Clientを使用する場合、Prismaスキーマのすべてのモデルは専用のTypeScript型に変換されます。たとえば、次の`User`と`Post`モデルがあるとします:

```prisma
model User {
  id    Int     @id
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id        Int     @id
  author    User    @relation(fields: [userId], references: [id])
  title     String
  published Boolean @default(false)
  userId    Int
}
```

このスキーマから生成されるPrisma Clientコードには、`User`型の次の表現が含まれます:

```typescript
export type User = {
  id: number
  email: string
  name: string | null
}
```

## 問題: 生成されたモデル型のバリエーションの使用

### 説明

一部のシナリオでは、生成された`User`型の_バリエーション_が必要になる場合があります。たとえば、`posts`リレーションを持つ`User`モデルのインスタンスを期待する関数がある場合や、アプリケーションコードで`User`モデルの`email`と`name`フィールドのみを渡す必要がある型が必要な場合です。

### 解決策

解決策として、Prisma Clientのヘルパー型を使用して、生成されたモデル型をカスタマイズできます。

`User`型には、モデルのスカラーフィールドのみが含まれ、リレーションは含まれません。これは、Prisma Clientクエリではデフォルトでリレーションが含まれないためです。

これを実現する1つの方法は、アプリケーションコードでこれらの型を手動で定義することです:

```typescript
// 1: Postへのリレーションを含む型を定義
type UserWithPosts = {
  id: number
  email: string
  name: string | null
  posts: Post[]
}

// 2: スカラーフィールドのサブセットのみを含む型を定義
type UserPersonalData = {
  email: string
  name: string | null
}
```

よりクリーンな解決策は、Prisma Clientが提供する`UserGetPayload`型ヘルパーを使用することです。

## `UserGetPayload`の使用

`UserGetPayload`型ヘルパーを使用すると、特定のクエリの結果の型を取得できます。

### リレーションを含む型

```typescript
import { Prisma } from '@prisma/client'

// postsリレーションを含むUser型
type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true }
}>
```

### フィールドのサブセットを含む型

```typescript
import { Prisma } from '@prisma/client'

// emailとnameフィールドのみを含むUser型
type UserPersonalData = Prisma.UserGetPayload<{
  select: { email: true; name: true }
}>
```

### ネストされたリレーションを含む型

```typescript
import { Prisma } from '@prisma/client'

// postsとそのcategoriesを含むUser型
type UserWithPostsAndCategories = Prisma.UserGetPayload<{
  include: {
    posts: {
      include: {
        categories: true
      }
    }
  }
}>
```

## `validator`との組み合わせ

`Prisma.validator`と組み合わせて、再利用可能な型を作成できます:

```typescript
import { Prisma } from '@prisma/client'

// 再利用可能なクエリオプションを定義
const userWithPosts = Prisma.validator<Prisma.UserArgs>()({
  include: { posts: true },
})

// 型を取得
type UserWithPosts = Prisma.UserGetPayload<typeof userWithPosts>

// 関数で使用
function processUser(user: UserWithPosts) {
  console.log(`User ${user.name} has ${user.posts.length} posts`)
}
```

## 実践的な例

### 例1: API レスポンスの型定義

```typescript
import { Prisma } from '@prisma/client'

// APIレスポンス用の型を定義
const userForApi = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true,
        published: true,
      },
    },
  },
})

type UserApiResponse = Prisma.UserGetPayload<typeof userForApi>

// API ハンドラー
async function getUserForApi(userId: number): Promise<UserApiResponse | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
    ...userForApi,
  })
}
```

### 例2: フォーム入力の型定義

```typescript
import { Prisma } from '@prisma/client'

// フォーム入力用の型を定義
type UserFormInput = Prisma.UserGetPayload<{
  select: {
    email: true
    name: true
  }
}>

// フォームハンドラー
async function updateUserProfile(
  userId: number,
  formData: UserFormInput
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: formData,
  })
}
```

### 例3: 複雑なネストされた構造

```typescript
import { Prisma } from '@prisma/client'

// 複雑なネストされた構造の型
type UserWithCompleteProfile = Prisma.UserGetPayload<{
  include: {
    posts: {
      include: {
        categories: true
        comments: {
          include: {
            author: true
          }
        }
      }
    }
    profile: true
  }
}>
```

## `Prisma.PromiseReturnType`の使用

クエリの戻り値の型を直接取得することもできます:

```typescript
import { Prisma } from '@prisma/client'

// クエリ関数を定義
const getUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  })
}

// 戻り値の型を取得
type User = Prisma.PromiseReturnType<typeof getUser>
```

## ベストプラクティス

1. **型の再利用**: よく使用する型は、`Prisma.validator`と`UserGetPayload`を組み合わせて定義し、再利用する

2. **明示的な型定義**: 複雑な構造の場合は、型に明確な名前を付けてエクスポートする

3. **選択的なフィールド取得**: 必要なフィールドのみを選択して、パフォーマンスを最適化する

4. **中央管理**: 型定義は専用のファイル（例: `types/user.ts`）に集約する

```typescript
// types/user.ts
import { Prisma } from '@prisma/client'

export const userSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  email: true,
  name: true,
})

export const userWithPosts = Prisma.validator<Prisma.UserArgs>()({
  include: { posts: true },
})

export type UserBasic = Prisma.UserGetPayload<{ select: typeof userSelect }>
export type UserWithPosts = Prisma.UserGetPayload<typeof userWithPosts>
```

## さらに学ぶ

- [型安全性](/docs/orm/prisma-client/type-safety): Prisma Clientの型安全性について
- [Prisma validator](/docs/orm/prisma-client/type-safety/prisma-validator): 型安全なオブジェクトの作成
- [型システム](/docs/orm/prisma-client/type-safety/prisma-type-system): Prisma ORMの型システムの仕組み
