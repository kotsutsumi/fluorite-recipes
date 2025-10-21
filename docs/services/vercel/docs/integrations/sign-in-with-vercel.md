# Vercelでサインイン

Vercelでサインインにより、サードパーティのアプリケーションは、Vercelアカウントを使用してユーザーを認証できます。この統合は[OAuth 2.0プロトコル](https://auth0.com/intro-to-iam/what-is-oauth-2)に基づいており、新しいアカウントを作成せずに安全にユーザーを認証する方法です。

Vercelでサインインは現在、[Vercelコミュニティ](https://community.vercel.com)でのみ利用可能です。

## Vercelコミュニティへのサインイン

[Vercel Community](https://community.vercel.com)にVercelアカウントでサインインするには、以下の手順に従ってください：

### 1. ログインフローの開始

ログインフローは、Vercelコミュニティに初めてログインしようとするときに開始されます。

### 2. アプリケーションの承認

サインイン後、アプリケーションにVercelアカウントへのアクセスを許可するよう求められます。アプリケーションと共有される情報は以下のみです：

* Vercelユーザー名
* メールアドレス
* 名前と姓

### 3. コミュニティへのアクセス

承認後、Vercelコミュニティにアクセスできます。

## Sign in with Vercel の仕組み

### OAuth 2.0 フロー

1. **認可リクエスト**: ユーザーがサードパーティアプリケーションの「Sign in with Vercel」ボタンをクリック
2. **ユーザー認証**: ユーザーがVercelにリダイレクトされ、ログイン
3. **同意**: ユーザーがアプリケーションへのアクセスを承認
4. **認可コード**: Vercelがアプリケーションに認可コードを返す
5. **トークン交換**: アプリケーションが認可コードをアクセストークンに交換
6. **ユーザー情報取得**: アプリケーションがアクセストークンを使用してユーザー情報を取得

### 実装例

#### 1. 認可URLの生成

```typescript
// lib/auth.ts
export function getAuthorizationUrl() {
  const params = new URLSearchParams({
    client_id: process.env.VERCEL_CLIENT_ID!,
    redirect_uri: `${process.env.APP_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'user:email',
  });

  return `https://vercel.com/oauth/authorize?${params.toString()}`;
}
```

#### 2. コールバックの処理

```typescript
// app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  // 認可コードをアクセストークンに交換
  const tokenResponse = await fetch('https://api.vercel.com/v2/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.VERCEL_CLIENT_ID!,
      client_secret: process.env.VERCEL_CLIENT_SECRET!,
      code,
      redirect_uri: `${process.env.APP_URL}/api/auth/callback`,
    }),
  });

  const { access_token } = await tokenResponse.json();

  // ユーザー情報を取得
  const userResponse = await fetch('https://api.vercel.com/v2/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const user = await userResponse.json();

  // セッションを作成してユーザーをリダイレクト
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

#### 3. ユーザー情報の取得

```typescript
// lib/vercel-api.ts
export async function getUser(accessToken: string) {
  const response = await fetch('https://api.vercel.com/v2/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
}
```

### サインインボタンの実装

```typescript
// components/SignInButton.tsx
'use client';

import { getAuthorizationUrl } from '@/lib/auth';

export function SignInButton() {
  const handleSignIn = () => {
    window.location.href = getAuthorizationUrl();
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      Sign in with Vercel
    </button>
  );
}
```

## セキュリティのベストプラクティス

### State パラメータの使用

CSRF 攻撃を防ぐために state パラメータを使用：

```typescript
// lib/auth.ts
import crypto from 'crypto';

export function generateState() {
  return crypto.randomBytes(32).toString('hex');
}

export function getAuthorizationUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.VERCEL_CLIENT_ID!,
    redirect_uri: `${process.env.APP_URL}/api/auth/callback`,
    response_type: 'code',
    scope: 'user:email',
    state,
  });

  return `https://vercel.com/oauth/authorize?${params.toString()}`;
}
```

コールバックで state を検証：

```typescript
// app/api/auth/callback/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const savedState = request.cookies.get('oauth_state')?.value;

  if (!state || state !== savedState) {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  }

  // 続きの処理...
}
```

### アクセストークンの安全な保存

```typescript
// lib/session.ts
import { cookies } from 'next/headers';

export function setSession(accessToken: string) {
  cookies().set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30日
  });
}

export function getSession() {
  return cookies().get('access_token')?.value;
}

export function clearSession() {
  cookies().delete('access_token');
}
```

## スコープ

利用可能な OAuth スコープ：

| スコープ | 説明 |
|---------|------|
| `user` | ユーザーの基本情報へのアクセス |
| `user:email` | ユーザーのメールアドレスへのアクセス |

## 環境変数

`.env.local` ファイル：

```bash
VERCEL_CLIENT_ID=your_client_id
VERCEL_CLIENT_SECRET=your_client_secret
APP_URL=http://localhost:3000
```

本番環境：

```bash
VERCEL_CLIENT_ID=your_client_id
VERCEL_CLIENT_SECRET=your_client_secret
APP_URL=https://your-app.vercel.app
```

## サインアウトの実装

```typescript
// app/api/auth/signout/route.ts
import { clearSession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  clearSession();
  return NextResponse.redirect(new URL('/', request.url));
}
```

```typescript
// components/SignOutButton.tsx
'use client';

export function SignOutButton() {
  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 text-gray-700 hover:text-gray-900"
    >
      サインアウト
    </button>
  );
}
```

## ミドルウェアで認証を保護

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
```

## エラーハンドリング

```typescript
// app/api/auth/callback/route.ts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const error = searchParams.get('error');

    if (error) {
      // ユーザーが承認を拒否した場合
      return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
    }

    // 通常の処理...
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
```

## トラブルシューティング

### リダイレクト URI のミスマッチ

1. Vercel OAuth アプリ設定でリダイレクト URI が正しいか確認
2. ローカル開発と本番環境で異なる URI が必要

### アクセストークンが無効

1. トークンの有効期限を確認
2. トークンが正しく保存されているか確認
3. 必要に応じてトークンをリフレッシュ

## 関連リソース

- [Vercel コミュニティ](https://community.vercel.com)
- [OAuth 2.0 仕様](https://oauth.net/2/)
- [Vercel API ドキュメント](https://vercel.com/docs/rest-api)
