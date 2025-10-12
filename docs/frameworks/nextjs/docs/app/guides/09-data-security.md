# データセキュリティ

Next.js アプリケーションでデータを安全に扱うための包括的なガイドです。データアクセスパターン、認証、セキュリティのベストプラクティスについて説明します。

## データフェッチングアプローチ

Next.js アプリケーションでデータを取得する3つの主要な戦略：

### 1. HTTP API（既存の大規模アプリケーション向け）

既存のバックエンドAPIを持つアプリケーションに適しています。

```typescript
// app/page.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <main>{/* データを表示 */}</main>
}
```

### 2. データアクセスレイヤー（新規プロジェクト推奨）

セキュリティと保守性を向上させる推奨アプローチです。

```typescript
// lib/dal.ts
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'

export const verifySession = async () => {
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    throw new Error('Unauthorized')
  }

  return { isAuth: true, userId: session.userId }
}

export const getCurrentUser = async () => {
  const session = await verifySession()

  // データベースからユーザー情報を取得
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  })

  // センシティブな情報を除外した DTO を返す
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}
```

### 3. コンポーネントレベルのデータアクセス（プロトタイプ向け）

小規模なプロトタイプやデモに適していますが、本番環境では推奨されません。

```typescript
// app/page.tsx
import { db } from '@/lib/database'

export default async function Page() {
  const user = await db.query.users.findFirst()
  return <main>{user.name}</main>
}
```

## データアクセスレイヤー（DAL）のベストプラクティス

### 1. サーバーのみで実行

`server-only` パッケージを使用して、DAL がサーバー上でのみ実行されることを保証します：

```typescript
// lib/dal.ts
import 'server-only'

export async function getUser() {
  // サーバー上でのみ実行される
}
```

### 2. 認証チェックの実装

すべてのデータアクセスで認証を確認します：

```typescript
// lib/dal.ts
import { verifySession } from '@/lib/session'

export const getUser = async () => {
  const session = await verifySession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  // ユーザーデータを取得
}
```

### 3. 最小限のデータを返す（DTO パターン）

センシティブな情報を除外したデータ転送オブジェクト（DTO）を返します：

```typescript
export const getCurrentUser = async () => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  })

  // ❌ 悪い例 - すべてのデータを返す
  // return user

  // ✅ 良い例 - 必要なデータのみを返す
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    // password は含めない
  }
}
```

### 4. データアクセスの一元化

データアクセスロジックを一箇所に集約します：

```typescript
// lib/dal.ts
export const getUserPosts = cache(async (userId: string) => {
  const session = await verifySession()

  if (session.userId !== userId) {
    throw new Error('Unauthorized')
  }

  return db.query.posts.findMany({
    where: eq(posts.userId, userId),
  })
})
```

## Server Actions のセキュリティ

Server Actions は、フォーム送信やデータ変更を安全に処理する仕組みを提供します。

### 1. 基本的な Server Action

```typescript
// app/actions.ts
'use server'

import { verifySession } from '@/lib/dal'

export async function updateProfile(formData: FormData) {
  // 認証チェック
  const session = await verifySession()

  // 入力の検証
  const name = formData.get('name')
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid input')
  }

  // データベース更新
  await db.update(users)
    .set({ name })
    .where(eq(users.id, session.userId))

  revalidatePath('/profile')
}
```

### 2. 認証の再検証

各アクションで必ず認証を再検証します：

```typescript
'use server'

export async function deletePost(postId: string) {
  // ❌ 悪い例 - 認証チェックなし
  // await db.delete(posts).where(eq(posts.id, postId))

  // ✅ 良い例 - 認証と権限チェック
  const session = await verifySession()
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, postId),
  })

  if (post.userId !== session.userId) {
    throw new Error('Unauthorized')
  }

  await db.delete(posts).where(eq(posts.id, postId))
}
```

### 3. Server Actions のセキュリティ機能

Next.js は Server Actions に以下のセキュリティ機能を提供します：

- **暗号化された非決定的アクション ID**: アクション ID は予測不可能
- **デッドコードの削除**: 未使用のアクションは削除される
- **POST リクエストのみ**: データ変更は POST リクエストに制限
- **クロージャー変数の自動暗号化**: 閉じ込められた変数は暗号化される

## React Taint API の使用

センシティブなデータがクライアントに露出するのを防ぎます。

### experimental_taintObjectReference

オブジェクト全体を汚染してクライアントに渡せないようにします：

```typescript
import { experimental_taintObjectReference } from 'react'

export async function getUser(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  })

  // ユーザーオブジェクト全体を汚染
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client',
    user
  )

  return user
}
```

### experimental_taintUniqueValue

特定の値（パスワード、トークンなど）を汚染します：

```typescript
import { experimental_taintUniqueValue } from 'react'

export async function getUser(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  })

  // パスワードを汚染
  experimental_taintUniqueValue(
    'Do not pass the password to the client',
    user,
    user.password
  )

  return user
}
```

## セキュリティのベストプラクティス

### 1. クライアント入力の検証

すべてのクライアント入力を検証します：

```typescript
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function createUser(formData: FormData) {
  const parsed = schema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    throw new Error('Invalid input')
  }

  // データベースに保存
}
```

### 2. 環境変数の管理

センシティブな情報は環境変数に保存します：

```typescript
// ✅ 良い例
const apiKey = process.env.API_KEY

// ❌ 悪い例 - ハードコード
const apiKey = 'sk_live_...'
```

`.env.local` の例：

```bash
# データベース
DATABASE_URL="postgresql://..."

# 認証
AUTH_SECRET="your-secret-key"

# API キー
API_KEY="your-api-key"
```

### 3. HTTPS の使用

本番環境では必ず HTTPS を使用します：

```typescript
// middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  // HTTP を HTTPS にリダイレクト
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.url}`,
      301
    )
  }
}
```

### 4. CORS の設定

適切な CORS ポリシーを設定します：

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://example.com' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
}
```

### 5. レート制限

API へのリクエストをレート制限します：

```typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(request: NextRequest): boolean {
  const ip = request.ip || 'anonymous'
  const now = Date.now()
  const limit = 10 // 1分間に10リクエスト
  const window = 60 * 1000 // 1分

  const current = rateLimit.get(ip)

  if (!current || now > current.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + window })
    return true
  }

  if (current.count >= limit) {
    return false
  }

  current.count++
  return true
}
```

## まとめ

データセキュリティは多層的なアプローチが必要です：

1. **データアクセスレイヤー**を使用してデータアクセスを一元化
2. **認証と認可**を各リクエストで検証
3. **最小限のデータ**のみをクライアントに送信
4. **入力の検証**を常に実行
5. **環境変数**でセンシティブな情報を管理
6. **HTTPS** と **CORS** を適切に設定
7. **レート制限**でAPIを保護

これらのベストプラクティスに従うことで、セキュアで保守性の高い Next.js アプリケーションを構築できます。
