# Supabase Starter

## 概要

Supabaseを使用したクッキーベース認証で構成されたNext.js App Routerテンプレートです。TypeScriptとTailwind CSSを使用しています。

**デモ**: https://demo-nextjs-with-supabase.vercel.app/
**GitHub**: https://github.com/vercel/next.js/tree/canary/examples/with-supabase

## 主な機能

- Next.jsスタック全体で動作(App Router、Pages Router、Middleware、Client/Server components)
- Supabaseによるクッキーベース認証
- Supabase UIライブラリによるパスワードベース認証
- Tailwind CSSによるスタイリング
- shadcn/uiのコンポーネント
- オプションのSupabase Vercel統合デプロイ

## 技術スタック

- **フレームワーク**: Next.js
- **認証**: Supabase
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui

## はじめに

### オプション1: Vercel統合デプロイ

1. Vercelにデプロイ
2. ガイドに従ってSupabaseアカウント/プロジェクトを作成
3. 環境変数が自動的に設定されます

### オプション2: ローカル開発

#### プロジェクトのクローン

```bash
npx create-next-app --example with-supabase my-app
cd my-app
```

#### Supabaseプロジェクトの作成

1. [Supabase](https://app.supabase.com/)でプロジェクトを作成
2. プロジェクトのURLとanon keyを取得

#### 環境変数の設定

`.env.local`ファイルを作成:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 依存関係のインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

#### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## 認証の実装

### Supabaseクライアントの設定

#### サーバーサイドクライアント

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Server Componentからset cookieが呼ばれた場合
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Server Componentからremove cookieが呼ばれた場合
          }
        },
      },
    }
  )
}
```

#### クライアントサイドクライアント

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### サインアップの実装

```typescript
// app/auth/signup/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
```

### サインアップフォーム

```typescript
// app/auth/signup/page.tsx
import { signup } from './actions'

export default function SignUpPage() {
  return (
    <form>
      <label htmlFor="email">メールアドレス:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">パスワード:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={signup}>サインアップ</button>
    </form>
  )
}
```

### ログインの実装

```typescript
// app/auth/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
```

### ログアウトの実装

```typescript
// app/auth/signout/route.ts
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}
```

## ミドルウェアでの認証チェック

```typescript
// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 保護されたルートへのアクセスをチェック
  if (!user && request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## ユーザー情報の取得

### Server Component

```typescript
// app/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div>
      <h1>こんにちは、{user?.email}</h1>
    </div>
  )
}
```

### Client Component

```typescript
// components/UserInfo.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function UserInfo() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  return <div>こんにちは、{user?.email}</div>
}
```

## ソーシャルログインの追加

### GitHubログイン

```typescript
// app/auth/github/route.ts
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    redirect('/error')
  }

  redirect(data.url)
}
```

### コールバック処理

```typescript
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL('/', request.url))
}
```

## データベース統合

### テーブルからのデータ取得

```typescript
const supabase = createClient()

const { data, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false })
```

### Row Level Security (RLS)

Supabaseダッシュボードでテーブルのポリシーを設定:

```sql
-- ユーザーは自分のデータのみ表示
CREATE POLICY "Users can view own data"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

-- ユーザーは自分のデータのみ挿入
CREATE POLICY "Users can insert own data"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

環境変数を設定:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 使用例

- 認証が必要なアプリケーション
- ユーザーダッシュボード
- SaaSプロダクト
- 会員制サイト

## リソース

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Documentation](https://nextjs.org/docs)

## ライセンス

MITライセンス
