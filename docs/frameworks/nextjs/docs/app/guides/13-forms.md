# フォームと Server Actions

React Server Actions を使用して、Server Components と Client Components の両方でフォーム送信を処理する方法を説明します。

## 動作の仕組み

React は HTML の `<form>` 要素を拡張し、`action` 属性を使用して Server Actions を呼び出すことができます。フォームで使用すると、関数は自動的に `FormData` オブジェクトを受け取ります。

### 基本的な例

```typescript
// app/page.tsx
export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // データの変更
    // キャッシュの再検証
  }

  return (
    <form action={createInvoice}>
      <input type="text" name="customerId" />
      <input type="number" name="amount" />
      <select name="status">
        <option value="pending">保留中</option>
        <option value="paid">支払済</option>
      </select>
      <button type="submit">送信</button>
    </form>
  )
}
```

## 主要な機能

### 追加の引数を渡す

JavaScript の `bind` メソッドを使用して、追加の引数を渡すことができます。

```typescript
// app/actions.ts
'use server'

export async function updateUser(userId: string, formData: FormData) {
  const name = formData.get('name')

  // userId と name を使用してユーザーを更新
}
```

```typescript
// app/page.tsx
import { updateUser } from './actions'

export default function Page() {
  const userId = '123'
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">更新</button>
    </form>
  )
}
```

### フォームのバリデーション

#### クライアントサイドのバリデーション

HTML 属性を使用した基本的なバリデーション：

```typescript
export default function Page() {
  return (
    <form action={createUser}>
      <input
        type="email"
        name="email"
        required
        pattern="[^@]+@[^@]+\.[^@]+"
      />
      <input
        type="password"
        name="password"
        required
        minLength={8}
      />
      <button type="submit">登録</button>
    </form>
  )
}
```

#### サーバーサイドのバリデーション

Zod を使用したサーバーサイドバリデーション：

```typescript
// app/actions.ts
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string().email({
    message: '有効なメールアドレスを入力してください',
  }),
  password: z.string().min(8, {
    message: 'パスワードは8文字以上である必要があります',
  }),
})

export async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // データベースにユーザーを作成
}
```

### バリデーションエラーの処理

`useActionState` フックを使用してバリデーションメッセージを表示します。

```typescript
// app/components/Signup.tsx
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
  errors: {},
}

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          name="email"
          type="email"
          aria-describedby="email-error"
        />
        {state.errors?.email && (
          <p id="email-error" className="error">
            {state.errors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          name="password"
          type="password"
          aria-describedby="password-error"
        />
        {state.errors?.password && (
          <p id="password-error" className="error">
            {state.errors.password[0]}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending}>
        {pending ? '送信中...' : '登録'}
      </button>

      {state.message && <p className="success">{state.message}</p>}
    </form>
  )
}
```

### 保留状態の表示

`useActionState` の `pending` 状態を使用して、送信中の表示を実装します。

```typescript
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

export function PostForm() {
  const [state, formAction, pending] = useActionState(createPost, null)

  return (
    <form action={formAction}>
      <input type="text" name="title" required />
      <textarea name="content" required />

      <button type="submit" disabled={pending}>
        {pending ? '投稿中...' : '投稿する'}
      </button>
    </form>
  )
}
```

### 楽観的更新

`useOptimistic` フックを使用して、レスポンスを待たずに UI を更新します。

```typescript
'use client'

import { useOptimistic } from 'react'
import { addTodo } from '@/app/actions'

export function TodoList({ todos }: { todos: string[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: string) => [...state, newTodo]
  )

  async function formAction(formData: FormData) {
    const todo = formData.get('todo') as string
    addOptimisticTodo(todo)
    await addTodo(todo)
  }

  return (
    <>
      <ul>
        {optimisticTodos.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ul>

      <form action={formAction}>
        <input type="text" name="todo" />
        <button type="submit">追加</button>
      </form>
    </>
  )
}
```

### ファイルアップロード

```typescript
// app/actions.ts
'use server'

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File

  if (!file) {
    throw new Error('ファイルが選択されていません')
  }

  // ファイルサイズの検証
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('ファイルサイズが大きすぎます')
  }

  // ファイルタイプの検証
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('許可されていないファイルタイプです')
  }

  // ファイルを保存
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // ファイルシステムやクラウドストレージに保存
  // ...

  return { success: true, filename: file.name }
}
```

```typescript
// app/components/FileUpload.tsx
'use client'

export function FileUpload() {
  return (
    <form action={uploadFile}>
      <input
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/gif"
        required
      />
      <button type="submit">アップロード</button>
    </form>
  )
}
```

## 高度なパターン

### プログレッシブエンハンスメント

JavaScript が無効な場合でもフォームが機能するようにします。

```typescript
// app/components/ProgressiveForm.tsx
'use client'

import { useActionState } from 'react'
import { createComment } from '@/app/actions'

export function CommentForm() {
  const [state, formAction, pending] = useActionState(createComment, null)

  return (
    <form action={formAction}>
      <textarea name="comment" required />

      {/* JavaScript が無効でも送信ボタンは機能する */}
      <button type="submit" disabled={pending}>
        {pending ? 'コメント中...' : 'コメントする'}
      </button>

      {/* クライアントサイドで追加の機能 */}
      <noscript>
        <p>JavaScript を有効にすると、リアルタイムバリデーションが利用できます。</p>
      </noscript>
    </form>
  )
}
```

### 複数のアクション

1つのフォームで複数のアクションを処理します。

```typescript
// app/actions.ts
'use server'

export async function saveDraft(formData: FormData) {
  // 下書きとして保存
}

export async function publish(formData: FormData) {
  // 公開する
}
```

```typescript
// app/components/PostEditor.tsx
'use client'

import { saveDraft, publish } from '@/app/actions'

export function PostEditor() {
  return (
    <form>
      <input type="text" name="title" />
      <textarea name="content" />

      <div>
        <button type="submit" formAction={saveDraft}>
          下書き保存
        </button>
        <button type="submit" formAction={publish}>
          公開
        </button>
      </div>
    </form>
  )
}
```

### データの再検証

Server Actions 後にキャッシュを更新します。

```typescript
// app/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  // データベースに投稿を作成
  await db.post.create({
    data: { title, content },
  })

  // 特定のパスを再検証
  revalidatePath('/posts')

  // または、タグで再検証
  revalidateTag('posts')
}
```

### リダイレクト

Server Action 完了後にリダイレクトします。

```typescript
// app/actions.ts
'use server'

import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const post = await db.post.create({
    data: { title, content },
  })

  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)
}
```

## ベストプラクティス

### 1. セキュリティ

常にサーバーサイドでバリデーションを実行します。

```typescript
'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'

export async function updateProfile(formData: FormData) {
  // 認証チェック
  const session = await auth()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // バリデーション
  const schema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
  })

  const validated = schema.parse({
    name: formData.get('name'),
    email: formData.get('email'),
  })

  // 更新
  await db.user.update({
    where: { id: session.userId },
    data: validated,
  })
}
```

### 2. エラーハンドリング

適切なエラーメッセージを提供します。

```typescript
'use server'

export async function createUser(formData: FormData) {
  try {
    const email = formData.get('email') as string

    // メールアドレスの重複チェック
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        error: 'このメールアドレスは既に使用されています',
      }
    }

    await db.user.create({
      data: { email },
    })

    return { success: true }
  } catch (error) {
    console.error('User creation failed:', error)
    return {
      error: 'ユーザーの作成に失敗しました',
    }
  }
}
```

### 3. アクセシビリティ

適切な ARIA 属性とラベルを使用します。

```typescript
export function AccessibleForm() {
  const [state, formAction, pending] = useActionState(createUser, null)

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">
          メールアドレス
          <span aria-label="必須" className="required">
            *
          </span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-invalid={!!state?.errors?.email}
          aria-describedby="email-error email-hint"
        />
        <span id="email-hint" className="hint">
          メールアドレスを入力してください
        </span>
        {state?.errors?.email && (
          <span id="email-error" className="error" role="alert">
            {state.errors.email[0]}
          </span>
        )}
      </div>

      <button type="submit" disabled={pending} aria-busy={pending}>
        {pending ? '送信中...' : '送信'}
      </button>
    </form>
  )
}
```

## まとめ

Server Actions を使用したフォームは、以下の利点を提供します：

1. **シンプルな API**: `action` 属性で簡単に実装
2. **プログレッシブエンハンスメント**: JavaScript なしでも動作
3. **型安全性**: TypeScript による型チェック
4. **セキュリティ**: サーバーサイドバリデーション
5. **UX の向上**: 楽観的更新と保留状態

フォームを適切に実装することで、ユーザーフレンドリーでセキュアな Next.js アプリケーションを構築できます。
