# unauthorized.js

`unauthorized.js`ファイルは、認証中に`unauthorized()`関数が呼び出されたときにカスタムUIをレンダリングするために使用されます。

## 概要

`unauthorized`ファイルを使用すると、認証が失敗した場合にカスタムの401エラーページを表示できます。これは、[`unauthorized()`](/docs/frameworks/nextjs/docs/app/api-reference/functions/unauthorized.md)関数と組み合わせて使用されます。

**重要：** これは実験的な機能であり、本番環境での使用は推奨されません。

## 規約

```tsx
// app/unauthorized.tsx
export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
    </main>
  )
}
```

```jsx
// app/unauthorized.jsx
export default function Unauthorized() {
  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>Please log in to access this page.</p>
    </main>
  )
}
```

## Props

`unauthorized.js`コンポーネントはpropsを受け取りません。

## データの取得

デフォルトでは、`unauthorized`はServer Componentです。データを取得してレンダリングするために`async`としてマークできます。

```tsx
// app/unauthorized.tsx
import { getServerSession } from '@/lib/auth'

export default async function Unauthorized() {
  const session = await getServerSession()

  return (
    <main>
      <h1>401 - Unauthorized</h1>
      <p>You need to be logged in to access this page.</p>
      {!session && <LoginButton />}
    </main>
  )
}
```

## 基本的な使用例

### シンプルな401ページ

```tsx
// app/unauthorized.tsx
export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">401</h1>
      <p className="text-xl">Unauthorized</p>
      <p className="mt-4">Please log in to access this page.</p>
    </main>
  )
}
```

### ログインボタン付き401ページ

```tsx
// app/unauthorized.tsx
import Link from 'next/link'
import { LoginButton } from '@/components/LoginButton'

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">401 - Unauthorized</h1>
        <p className="text-xl mb-8">
          You need to be logged in to access this page.
        </p>
        <LoginButton />
        <Link href="/" className="mt-4 block text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    </main>
  )
}
```

## `unauthorized()`関数との使用

`unauthorized.js`ファイルは、`unauthorized()`関数と組み合わせて使用されます。

```tsx
// app/dashboard/page.tsx
import { verifySession } from '@/lib/auth'
import { unauthorized } from 'next/navigation'

export default async function DashboardPage() {
  const session = await verifySession()

  if (!session) {
    unauthorized()
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user.name}!</p>
    </div>
  )
}
```

## 実用例

### セッション情報を表示する401ページ

```tsx
// app/unauthorized.tsx
import { cookies } from 'next/headers'
import { LoginForm } from '@/components/LoginForm'

export default async function Unauthorized() {
  const cookieStore = await cookies()
  const returnUrl = cookieStore.get('returnUrl')?.value || '/'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Authentication Required</h1>
          <p className="mt-2 text-gray-600">
            Please sign in to continue to your dashboard.
          </p>
        </div>
        <LoginForm returnUrl={returnUrl} />
      </div>
    </main>
  )
}
```

### カスタムメッセージ付き401ページ

```tsx
// app/unauthorized.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Unauthorized() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">401</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Access Denied
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Sorry, you don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please contact your administrator
            or try logging in with a different account.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/login">
            <Button className="w-full">Sign In</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Return to Home
            </Link>
          </Link>
        </div>
      </div>
    </main>
  )
}
```

### 詳細なエラー情報を含む401ページ

```tsx
// app/unauthorized.tsx
import Link from 'next/link'
import { headers } from 'next/headers'

export default async function Unauthorized() {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-lg space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Authentication Required
          </h1>
          <p className="mt-2 text-gray-600">
            You must be logged in to access <code className="text-sm bg-gray-100 px-2 py-1 rounded">{pathname}</code>
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Why am I seeing this?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    This page requires authentication. Please sign in to
                    continue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/login?returnUrl=${encodeURIComponent(pathname)}`}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-center text-gray-700 hover:bg-gray-50"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
```

## セグメントレベルの`unauthorized.js`

ルートレベルの`unauthorized.js`に加えて、特定のルートセグメントに対してカスタム401ページを作成できます。

```
app/
├── unauthorized.tsx           # グローバル401ページ
├── dashboard/
│   ├── unauthorized.tsx      # ダッシュボード用401ページ
│   └── page.tsx
└── admin/
    ├── unauthorized.tsx       # 管理者用401ページ
    └── page.tsx
```

```tsx
// app/dashboard/unauthorized.tsx
export default function DashboardUnauthorized() {
  return (
    <main>
      <h1>Dashboard Access Required</h1>
      <p>You need dashboard permissions to access this area.</p>
    </main>
  )
}
```

## Client Componentとしての使用

`unauthorized.js`をClient Componentとして使用することもできます。

```tsx
// app/unauthorized.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function Unauthorized() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">401 - Unauthorized</h1>
      <p className="mt-4">You need to be logged in to access this page.</p>
      <Button onClick={() => router.push('/login')} className="mt-8">
        Go to Login
      </Button>
    </main>
  )
}
```

## HTTPステータスコード

`unauthorized.js`ファイルは、自動的に`401 Unauthorized`ステータスコードを返します。追加の設定は必要ありません。

## Good to Know

- `unauthorized.js`はpropsを受け取りません
- デフォルトではServer Componentです
- `401 Unauthorized`ステータスコードを自動的に返します
- 実験的な機能であり、本番環境での使用は推奨されません
- セグメントレベルで定義して、特定のルートに対するカスタム401ページを作成できます

## バージョン履歴

| バージョン | 変更内容 |
| --- | --- |
| `v15.1.0` | `unauthorized` と `unauthorized.js` が導入（実験的） |
