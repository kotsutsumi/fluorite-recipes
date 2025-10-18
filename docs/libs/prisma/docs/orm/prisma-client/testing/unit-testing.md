# Prisma ORMでのユニットテスト

ユニットテストは、コードの小さな部分（ユニット）を分離し、論理的に予測可能な動作をテストすることを目的としています。一般的に、実際の動作をシミュレートするために、オブジェクトやサーバーレスポンスをモックすることを含みます。

ユニットテストの利点:

- コード内のバグを迅速に発見して分離できる
- 各コードモジュールが何をすべきかを示すことで、ドキュメントとして機能する
- リファクタリングがうまくいったかどうかの有用な指標となる（テストはリファクタリング後も合格するべき）

Prisma ORMのコンテキストでは、これは一般的にPrisma Clientを使用してデータベース呼び出しを行う関数のテストを意味します。

単一のテストは、関数ロジックがさまざまな入力（null値や空のリストなど）をどのように処理するかに焦点を当てるべきです。

これは、テストとその環境をできるだけ軽量に保つために、外部サービスやデータベースなどの依存関係をできるだけ削除することを目指すべきであることを意味します。

> **注意**: この[ブログ記事](https://www.prisma.io/blog/testing-series-2-xPhjjmIEsM)は、Prisma ORMを使用したExpressプロジェクトでユニットテストを実装するための包括的なガイドを提供しています。

## 前提条件

このガイドは、JavaScriptテストライブラリの[`Jest`](https://jestjs.io/)と[`ts-jest`](https://github.com/kulshekhar/ts-jest)がプロジェクトにすでにセットアップされていることを前提としています。

```bash
npm install --save-dev jest ts-jest @types/jest
```

## Prisma Clientのモック

ユニットテストを外部要因から分離するために、Prisma Clientをモックできます。これにより、スキーマを使用できる（**_型安全性_**）という利点を得ながら、テストの実行時に実際にデータベースを呼び出す必要がありません。

このガイドでは、Prisma Clientをモックする2つのアプローチ、シングルトンインスタンスと依存性注入について説明します。どちらもユースケースに応じてメリットがあります。Prisma Clientのモックを支援するために、[`jest-mock-extended`](https://github.com/marchaos/jest-mock-extended)パッケージを使用します。

```bash
npm install jest-mock-extended@2.0.4 --save-dev
```

## アプローチ1: シングルトンパターン

### 1. Prisma Clientのシングルトンを作成

```typescript
// client.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default prisma
```

### 2. シングルトンのモックを作成

```typescript
// singleton.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import prisma from './client'

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
```

### 3. Jest設定を更新

```javascript
// jest.config.js
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
}
```

### 4. テストを作成

```typescript
// user.test.ts
import { prismaMock } from './singleton'
import { createUser } from './user'

test('should create new user', async () => {
  const user = {
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice',
    acceptTermsAndConditions: true,
  }

  prismaMock.user.create.mockResolvedValue(user)

  await expect(createUser(user)).resolves.toEqual({
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice',
    acceptTermsAndConditions: true,
  })
})

test('should fail if terms not accepted', async () => {
  const user = {
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice',
    acceptTermsAndConditions: false,
  }

  prismaMock.user.create.mockRejectedValue(
    new Error('User must accept terms!')
  )

  await expect(createUser(user)).rejects.toThrow('User must accept terms!')
})
```

### 5. テスト対象の関数

```typescript
// user.ts
import prisma from './client'

interface CreateUser {
  email: string
  name: string
  acceptTermsAndConditions: boolean
}

export async function createUser(user: CreateUser) {
  if (!user.acceptTermsAndConditions) {
    throw new Error('User must accept terms!')
  }

  return await prisma.user.create({
    data: user,
  })
}
```

## アプローチ2: 依存性注入

### 1. コンテキストを作成

```typescript
// context.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export type Context = {
  prisma: PrismaClient
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  }
}
```

### 2. テストを作成

```typescript
// user-di.test.ts
import { MockContext, Context, createMockContext } from './context'
import { createUser, updateUsername } from './user-di'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

test('should create new user', async () => {
  const user = {
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice',
    acceptTermsAndConditions: true,
  }

  mockCtx.prisma.user.create.mockResolvedValue(user)

  await expect(createUser(user, ctx)).resolves.toEqual({
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice',
    acceptTermsAndConditions: true,
  })
})

test('should update username', async () => {
  const user = {
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice Updated',
    acceptTermsAndConditions: true,
  }

  mockCtx.prisma.user.update.mockResolvedValue(user)

  await expect(updateUsername(1, 'Alice Updated', ctx)).resolves.toEqual({
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice Updated',
    acceptTermsAndConditions: true,
  })
})
```

### 3. テスト対象の関数（依存性注入版）

```typescript
// user-di.ts
import { Context } from './context'

interface CreateUser {
  email: string
  name: string
  acceptTermsAndConditions: boolean
}

export async function createUser(user: CreateUser, ctx: Context) {
  if (!user.acceptTermsAndConditions) {
    throw new Error('User must accept terms!')
  }

  return await ctx.prisma.user.create({
    data: user,
  })
}

export async function updateUsername(
  userId: number,
  newName: string,
  ctx: Context
) {
  return await ctx.prisma.user.update({
    where: { id: userId },
    data: { name: newName },
  })
}
```

## サンプルスキーマ

```prisma
model User {
  id                       Int     @id @default(autoincrement())
  email                    String  @unique
  name                     String?
  acceptTermsAndConditions Boolean
}
```

## より複雑なテスト例

### リレーションを含むテスト

```typescript
test('should create user with posts', async () => {
  const user = {
    id: 1,
    email: 'alice@prisma.io',
    name: 'Alice',
    posts: [
      { id: 1, title: 'First Post', content: 'Hello World' },
      { id: 2, title: 'Second Post', content: 'Prisma is great' },
    ],
  }

  mockCtx.prisma.user.create.mockResolvedValue(user)

  const result = await createUserWithPosts(
    {
      email: 'alice@prisma.io',
      name: 'Alice',
      posts: ['First Post', 'Second Post'],
    },
    ctx
  )

  expect(result).toEqual(user)
  expect(result.posts).toHaveLength(2)
})
```

### エラーハンドリングのテスト

```typescript
test('should handle duplicate email error', async () => {
  mockCtx.prisma.user.create.mockRejectedValue(
    new Error('Unique constraint failed on email')
  )

  await expect(
    createUser(
      {
        email: 'alice@prisma.io',
        name: 'Alice',
        acceptTermsAndConditions: true,
      },
      ctx
    )
  ).rejects.toThrow('Unique constraint failed on email')
})
```

## ベストプラクティス

1. **テストの独立性**: 各テストが他のテストに依存しないようにする

2. **beforeEachでモックをリセット**: テスト間でモックをリセットして、予期しない動作を防ぐ

3. **明確なテストケース**: テストケースの名前は、何をテストしているかが明確であるべき

4. **エッジケースのテスト**: 正常系だけでなく、エラーケースや境界ケースもテストする

5. **型安全性の活用**: モックでも型安全性を維持する

6. **適切なアサーション**: テストするべき値を明確にアサートする

## まとめ

- **シングルトンパターン**: グローバルなモックを使用し、セットアップが簡単
- **依存性注入**: より柔軟で、複数のコンテキストを扱いやすい

どちらのアプローチも有効で、プロジェクトの要件と好みに応じて選択できます。

## さらに学ぶ

- [インテグレーションテスト](/docs/orm/prisma-client/testing/integration-testing): 実際のデータベースを使用したテスト
- [Jestドキュメント](https://jestjs.io/): Jest公式ドキュメント
- [テストブログシリーズ](https://www.prisma.io/blog/testing-series-2-xPhjjmIEsM): Prismaでのテストに関する詳細なブログ記事
