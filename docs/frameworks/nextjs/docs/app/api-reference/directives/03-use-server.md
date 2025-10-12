# use server

`'use server'`ディレクティブは、関数またはファイルをサーバー側で実行されるように指定するReactの機能です。このディレクティブを使用することで、クライアント側からサーバー側の関数を安全に呼び出すことができます。

## 概要

`'use server'`は2つのレベルで使用できます:

1. **ファイルの先頭**: ファイル内のすべての関数をサーバー側関数としてマークします
2. **関数の先頭（インライン）**: 特定の関数のみをサーバー関数としてマークします

これにより、サーバー側でのみ実行されるべきロジック（データベースアクセス、認証、機密情報の処理など）を明確に分離できます。

## 使用方法

### ファイルレベルでの使用

ファイルの先頭に`'use server'`を配置すると、そのファイル内のすべてのエクスポートされた関数がサーバー関数になります:

```typescript
// lib/actions.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createUser(data: { name: string; email: string }) {
  // この関数はサーバー側でのみ実行される
  const user = await db.user.create({ data })
  return user
}

export async function deleteUser(userId: string) {
  // この関数もサーバー側でのみ実行される
  await db.user.delete({ where: { id: userId } })
  revalidatePath('/users')
}
```

### インライン（関数レベル）での使用

関数の内部、先頭に`'use server'`を配置することで、その関数のみをサーバー関数としてマークできます:

```typescript
// app/post/[id]/page.tsx
import { revalidatePath } from 'next/cache'

export default function Post({ params }: { params: { id: string } }) {
  async function updatePost(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const content = formData.get('content') as string

    await savePost(params.id, { title, content })
    revalidatePath(`/posts/${params.id}`)
  }

  return (
    <form action={updatePost}>
      <input name="title" type="text" />
      <textarea name="content" />
      <button type="submit">更新</button>
    </form>
  )
}
```

## Server Actionsとの統合

`'use server'`は、Next.jsのServer Actionsと密接に連携します。Server Actionsは、フォームの送信やデータの変更を処理するためのサーバー側関数です。

### フォーム送信の処理

```typescript
// app/create-post/page.tsx
import { redirect } from 'next/navigation'

async function createPost(formData: FormData) {
  'use server'

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const post = await db.post.create({
    data: { title, content }
  })

  redirect(`/posts/${post.id}`)
}

export default function CreatePost() {
  return (
    <form action={createPost}>
      <input name="title" type="text" placeholder="タイトル" required />
      <textarea name="content" placeholder="内容" required />
      <button type="submit">投稿を作成</button>
    </form>
  )
}
```

### データ変更とキャッシュの再検証

```typescript
// lib/actions.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function updateProduct(productId: string, data: {
  name: string
  price: number
}) {
  const product = await db.product.update({
    where: { id: productId },
    data
  })

  // 特定のパスのキャッシュを再検証
  revalidatePath(`/products/${productId}`)

  // タグベースのキャッシュ再検証
  revalidateTag('products')

  return product
}
```

## クライアントコンポーネントでの使用

クライアントコンポーネントから直接`'use server'`を使用することはできませんが、専用ファイルからサーバー関数をインポートして使用できます:

```typescript
// lib/actions.ts
'use server'

export async function addToCart(productId: string) {
  const cart = await db.cart.create({
    data: { productId }
  })
  return cart
}
```

```typescript
// components/AddToCartButton.tsx
'use client'

import { addToCart } from '@/lib/actions'
import { useState } from 'react'

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await addToCart(productId)
      alert('カートに追加されました!')
    } catch (error) {
      alert('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? '追加中...' : 'カートに追加'}
    </button>
  )
}
```

## セキュリティに関する重要な考慮事項

### 1. 認証と認可

サーバー関数では、必ず適切な認証と認可を実装してください:

```typescript
// lib/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function deletePost(postId: string) {
  // セッションを確認
  const session = await auth()

  if (!session?.user) {
    throw new Error('認証が必要です')
  }

  // 投稿の所有者を確認
  const post = await db.post.findUnique({
    where: { id: postId }
  })

  if (post.authorId !== session.user.id) {
    throw new Error('この操作を実行する権限がありません')
  }

  // 削除を実行
  await db.post.delete({
    where: { id: postId }
  })
}
```

### 2. 入力値の検証

クライアントから受け取るデータは常に検証してください:

```typescript
// lib/actions.ts
'use server'

import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).max(120)
})

export async function createUser(data: unknown) {
  // 入力値を検証
  const validatedData = CreateUserSchema.parse(data)

  // 検証済みのデータを使用
  const user = await db.user.create({
    data: validatedData
  })

  return user
}
```

### 3. 機密情報の保護

サーバー関数内でのみ機密情報を扱い、クライアントに漏洩しないようにしてください:

```typescript
// lib/actions.ts
'use server'

import { stripe } from '@/lib/stripe'

export async function createPaymentIntent(amount: number) {
  // APIキーはサーバー側でのみ使用される
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'jpy',
    // APIキーはクライアントに送信されない
  })

  // クライアントに必要な情報のみを返す
  return {
    clientSecret: paymentIntent.client_secret
  }
}
```

## 実践例

### ユーザー登録フォーム

```typescript
// app/register/page.tsx
import { redirect } from 'next/navigation'

async function registerUser(formData: FormData) {
  'use server'

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // パスワードをハッシュ化（実際の実装ではbcryptなどを使用）
  const hashedPassword = await hashPassword(password)

  // ユーザーを作成
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  // 登録後にログインページへリダイレクト
  redirect('/login')
}

export default function RegisterPage() {
  return (
    <div>
      <h1>ユーザー登録</h1>
      <form action={registerUser}>
        <div>
          <label htmlFor="name">名前</label>
          <input id="name" name="name" type="text" required />
        </div>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" name="email" type="email" required />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button type="submit">登録</button>
      </form>
    </div>
  )
}
```

### いいね機能の実装

```typescript
// lib/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
  const session = await auth()

  if (!session?.user) {
    throw new Error('ログインが必要です')
  }

  const userId = session.user.id

  // 既存のいいねを確認
  const existingLike = await db.like.findUnique({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  })

  if (existingLike) {
    // いいねを削除
    await db.like.delete({
      where: { id: existingLike.id }
    })
  } else {
    // いいねを追加
    await db.like.create({
      data: {
        userId,
        postId
      }
    })
  }

  // ページのキャッシュを再検証
  revalidatePath(`/posts/${postId}`)
}
```

```typescript
// components/LikeButton.tsx
'use client'

import { toggleLike } from '@/lib/actions'
import { useOptimistic } from 'react'

export default function LikeButton({
  postId,
  initialLikes,
  initialIsLiked
}: {
  postId: string
  initialLikes: number
  initialIsLiked: boolean
}) {
  const [optimisticState, setOptimisticState] = useOptimistic(
    { likes: initialLikes, isLiked: initialIsLiked },
    (state) => ({
      likes: state.isLiked ? state.likes - 1 : state.likes + 1,
      isLiked: !state.isLiked
    })
  )

  const handleLike = async () => {
    setOptimisticState(null)
    await toggleLike(postId)
  }

  return (
    <button onClick={handleLike}>
      {optimisticState.isLiked ? '♥' : '♡'} {optimisticState.likes}
    </button>
  )
}
```

### データのエクスポート機能

```typescript
// lib/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function exportUserData() {
  const session = await auth()

  if (!session?.user) {
    throw new Error('認証が必要です')
  }

  // ユーザーのすべてのデータを取得
  const userData = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: true,
      comments: true,
      likes: true
    }
  })

  // JSON形式で返す
  return {
    user: userData,
    exportedAt: new Date().toISOString()
  }
}
```

## エラーハンドリング

サーバー関数では適切なエラーハンドリングを実装してください:

```typescript
// lib/actions.ts
'use server'

import { z } from 'zod'

export async function updateProfile(data: unknown) {
  try {
    // 認証チェック
    const session = await auth()
    if (!session?.user) {
      return { error: '認証が必要です' }
    }

    // バリデーション
    const schema = z.object({
      name: z.string().min(2),
      bio: z.string().max(500)
    })

    const validatedData = schema.parse(data)

    // データベース更新
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: validatedData
    })

    revalidatePath('/profile')

    return { success: true, user: updatedUser }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'バリデーションエラー', details: error.errors }
    }

    console.error('プロフィール更新エラー:', error)
    return { error: '更新に失敗しました' }
  }
}
```

## ベストプラクティス

### 1. 専用ファイルに整理

サーバー関数は専用のファイル（例: `lib/actions.ts`）に整理します:

```typescript
// lib/actions.ts
'use server'

export async function createPost(data: PostData) { /* ... */ }
export async function updatePost(id: string, data: PostData) { /* ... */ }
export async function deletePost(id: string) { /* ... */ }
```

### 2. 型安全性の確保

TypeScriptの型を活用して、型安全なサーバー関数を作成します:

```typescript
// lib/actions.ts
'use server'

import { z } from 'zod'

const PostSchema = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean()
})

type PostInput = z.infer<typeof PostSchema>

export async function createPost(data: PostInput) {
  const validated = PostSchema.parse(data)
  // ...
}
```

### 3. 再利用可能な認証ヘルパー

認証チェックは再利用可能なヘルパー関数として実装します:

```typescript
// lib/auth-helpers.ts
'use server'

import { auth } from '@/lib/auth'

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('認証が必要です')
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user.role !== 'ADMIN') {
    throw new Error('管理者権限が必要です')
  }
  return session
}
```

### 4. キャッシュの適切な管理

データ変更後は関連するキャッシュを適切に再検証します:

```typescript
// lib/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function updatePost(postId: string, data: PostData) {
  const post = await db.post.update({
    where: { id: postId },
    data
  })

  // 特定のパスを再検証
  revalidatePath(`/posts/${postId}`)

  // 一覧ページも再検証
  revalidatePath('/posts')

  // タグベースの再検証
  revalidateTag('posts')

  return post
}
```

## まとめ

`'use server'`ディレクティブは、Next.jsアプリケーションでサーバー側のロジックを安全に実装するための重要な機能です。以下の点を押さえておきましょう:

- **ファイルレベルまたは関数レベルで使用可能**
- **必ず認証と認可を実装する**
- **入力値は常に検証する**
- **機密情報はサーバー側でのみ扱う**
- **適切なエラーハンドリングを実装する**
- **型安全性を確保する**
- **キャッシュを適切に管理する**

Server Actionsと組み合わせることで、フォーム送信やデータ変更を安全かつ効率的に処理できます。

## 関連リンク

- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Data Fetching and Caching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Documentation: 'use server'](https://react.dev/reference/react/use-server)
