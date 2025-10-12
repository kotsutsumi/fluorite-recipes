# リダイレクト

Next.jsでリダイレクトを実装する方法について説明します。

## リダイレクトの方法

Next.jsには、ウェブアプリケーション内でリダイレクトを実装するための主要な方法があります。

### 1. redirect()関数

サーバーコンポーネント、ルートハンドラ、サーバーアクションで使用できます。

#### 基本的な使い方

```typescript
import { redirect } from 'next/navigation'

async function fetchTeam(id: string) {
  const res = await fetch(`https://api.example.com/team/${id}`)
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }: { params: { id: string } }) {
  const team = await fetchTeam(params.id)

  if (!team) {
    redirect('/login')
  }

  // チーム情報を表示
  return <div>{team.name}</div>
}
```

#### サーバーアクションでの使用

```typescript
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  // データベースに投稿を保存
  const post = await savePost({ title, content })

  revalidatePath('/posts')
  redirect(`/posts/${post.id}`)
}
```

**特徴:**
- デフォルトで307（一時的リダイレクト）ステータスコードを返す
- サーバーアクションでは303ステータスコードを返す
- TypeScriptの`never`型を返すため、`return`文の後にコードを書く必要がない

### 2. permanentRedirect()関数

永久的なリダイレクトを実装します。

```typescript
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(
  username: string,
  formData: FormData
) {
  const newUsername = formData.get('username')

  // データベースを更新
  await updateUser(username, newUsername)

  revalidateTag('username')
  permanentRedirect(`/profile/${newUsername}`)
}
```

**特徴:**
- デフォルトで308（永久リダイレクト）ステータスコードを返す
- サーバーアクションでは303ステータスコードを返す
- SEOに適している（検索エンジンがURLの変更を永続的なものとして扱う）

### 3. useRouter()フック

クライアントコンポーネントのイベントハンドラ内でリダイレクトを実行します。

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push('/dashboard')}
    >
      ダッシュボード
    </button>
  )
}
```

#### 戻るボタンの実装

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <button onClick={() => router.back()}>
      戻る
    </button>
  )
}
```

**useRouterの主要メソッド:**
- `push(href: string)`: 指定されたルートに遷移
- `replace(href: string)`: 履歴に追加せずに遷移
- `refresh()`: 現在のルートを更新
- `back()`: 前のページに戻る
- `forward()`: 次のページに進む
- `prefetch(href: string)`: 指定されたルートをプリフェッチ

### 4. next.config.jsでのリダイレクト

ビルド時に設定される永続的なリダイレクトです。

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      // 基本的なリダイレクト
      {
        source: '/old-blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
      // ワイルドカードパスマッチング
      {
        source: '/blog/:slug*',
        destination: '/news/:slug*',
        permanent: true,
      },
      // 正規表現パスマッチング
      {
        source: '/post/:slug(\\d{1,})',
        destination: '/news/:slug',
        permanent: false,
      },
      // ヘッダー、クッキー、クエリマッチング
      {
        source: '/specific-page',
        has: [
          {
            type: 'header',
            key: 'x-redirect-me',
          },
        ],
        destination: '/another-page',
        permanent: false,
      },
      // 外部URLへのリダイレクト
      {
        source: '/docs/:path*',
        destination: 'https://docs.example.com/:path*',
        permanent: true,
      },
    ]
  },
}
```

**リダイレクト設定のオプション:**
- `source`: リクエストパスのパターン
- `destination`: リダイレクト先のパス
- `permanent`: 永久リダイレクト（308）か一時的リダイレクト（307）か
- `basePath`: `false`または`undefined`でbasePat

を無視
- `locale`: ロケール処理の有無
- `has`: ヘッダー、クッキー、クエリの条件
- `missing`: ヘッダー、クッキー、クエリが存在しない条件

### 5. Middlewareでのリダイレクト

ルートにアクセスする前にリダイレクトを実行します。

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 認証チェック
  const isAuthenticated = request.cookies.get('auth-token')

  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // A/Bテスト
  const bucket = request.cookies.get('bucket')
  if (!bucket) {
    const response = NextResponse.next()
    response.cookies.set('bucket', Math.random() > 0.5 ? 'a' : 'b')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}
```

**Middlewareの使用例:**
- 認証とリダイレクト
- A/Bテスト
- 地域ベースのリダイレクト
- ロケール処理

## リダイレクトのパターン

### 認証後のリダイレクト

```typescript
// app/actions.ts
'use server'

import { redirect } from 'next/navigation'

export async function authenticate(
  prevState: any,
  formData: FormData
) {
  const email = formData.get('email')
  const password = formData.get('password')

  const user = await verifyCredentials(email, password)

  if (!user) {
    return { error: '認証に失敗しました' }
  }

  // セッションを設定
  await createSession(user.id)

  redirect('/dashboard')
}
```

### 条件付きリダイレクト

```typescript
// app/page.tsx
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth'

export default async function Home() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role === 'admin') {
    redirect('/admin')
  }

  return <div>ようこそ、{user.name}さん</div>
}
```

### 言語ベースのリダイレクト

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language')
  const preferredLocale = acceptLanguage?.split(',')[0].split('-')[0]

  if (preferredLocale === 'ja' && !request.nextUrl.pathname.startsWith('/ja')) {
    return NextResponse.redirect(
      new URL(`/ja${request.nextUrl.pathname}`, request.url)
    )
  }

  return NextResponse.next()
}
```

## ベストプラクティス

### 1. 適切なステータスコードを使用

- **307 (Temporary Redirect)**: 一時的なリダイレクト
- **308 (Permanent Redirect)**: 永久的なリダイレクト
- **303 (See Other)**: フォーム送信後のリダイレクト

### 2. SEOを考慮

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true, // 308ステータスコード
      },
    ]
  },
}
```

### 3. リダイレクトループを避ける

```typescript
// 悪い例
export default function Page() {
  redirect('/page') // 同じページにリダイレクト
}

// 良い例
export default function Page() {
  const shouldRedirect = checkCondition()
  if (shouldRedirect) {
    redirect('/other-page')
  }
  return <div>コンテンツ</div>
}
```

### 4. パフォーマンスを考慮

- Middlewareでのリダイレクトは、すべてのリクエストで実行される
- next.config.jsでのリダイレクトは、ビルド時に処理される
- サーバーコンポーネントでのリダイレクトは、サーバーサイドで実行される

## 次のステップ

- [ルーティング](/docs/app/building-your-application/routing)
- [Middleware](/docs/app/building-your-application/routing/middleware)
- [useRouter](/docs/app/api-reference/functions/use-router)
