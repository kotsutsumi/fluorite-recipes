# 認証の追加

前の章では、フォーム検証とアクセシビリティの改善を追加して請求書ルートの構築を完了しました。この章では、ダッシュボードに認証を追加します。

この章では...

ここで扱うトピック

[Image: Image]

認証とは何か。

[Image: Image]

NextAuth.jsを使用してアプリに認証を追加する方法。

[Image: Image]

Middlewareを使用してユーザーをリダイレクトし、ルートを保護する方法。

[Image: Image]

Reactの`useActionState`を使用して保留状態とフォームエラーを処理する方法。

## 認証とは何か？

認証は、今日の多くのWebアプリケーションの重要な部分です。システムがユーザーが本人であることを確認する方法です。

安全なWebサイトでは、ユーザーの身元を確認するために複数の方法を使用することがよくあります。例えば、ユーザー名とパスワードを入力した後、サイトはデバイスに確認コードを送信したり、Google Authenticatorのような外部アプリを使用したりする場合があります。この2要素認証（2FA）はセキュリティの向上に役立ちます。誰かがあなたのパスワードを知ったとしても、一意のトークンなしにはアカウントにアクセスできません。

### 認証と認可

Web開発では、認証と認可は異なる役割を果たします：

• **認証**は、ユーザーが本人であることを確認することです。ユーザー名とパスワードのような所有物でアイデンティティを証明します。

• **認可**は次のステップです。ユーザーのアイデンティティが確認されると、認可はアプリケーションのどの部分の使用が許可されるかを決定します。

つまり、認証はあなたが誰であるかをチェックし、認可はアプリケーションで何ができるか、何にアクセスできるかを決定します。

## ログインルートの作成

まず、アプリケーションに`/login`という新しいルートを作成し、以下のコードを貼り付けます：

```tsx
// /app/login/page.tsx
import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
```

このページが`<LoginForm />`をインポートしていることに気づくでしょう。これは章の後半で更新します。このコンポーネントは、入力リクエスト（URL検索パラメータ）からの情報にアクセスするため、React `<Suspense>`でラップされています。

## NextAuth.js

アプリケーションに認証を追加するために[NextAuth.js](https://nextjs.authjs.dev/)を使用します。NextAuth.jsは、セッション管理、サインイン・サインアウト、認証の他の側面に関わる複雑さの多くを抽象化します。これらの機能を手動で実装することも可能ですが、プロセスは時間がかかり、エラーが発生しやすくなります。NextAuth.jsはプロセスを簡素化し、Next.jsアプリケーションでの認証に統一されたソリューションを提供します。

## NextAuth.jsのセットアップ

ターミナルで以下のコマンドを実行してNextAuth.jsをインストールします：

```bash
pnpm i next-auth@beta
```

ここでは、Next.js 14+と互換性のあるNextAuth.jsの`beta`バージョンをインストールしています。

次に、アプリケーション用の秘密鍵を生成します。この鍵はCookieを暗号化し、ユーザーセッションのセキュリティを確保するために使用されます。ターミナルで以下のコマンドを実行してこれを行うことができます：

```bash
# macOS
openssl rand -base64 32

# WindowsではWebサイト https://generate-secret.vercel.app/32 を使用できます
```

次に、`.env`ファイルで、生成された鍵を`AUTH_SECRET`変数に追加します：

```env
AUTH_SECRET=your-secret-key
```

本番環境で認証を動作させるには、Vercelプロジェクトでも環境変数を更新する必要があります。Vercelで環境変数を追加する方法については、この[ガイド](https://vercel.com/docs/environment-variables)を確認してください。

### pagesオプションの追加

プロジェクトのルートに`authConfig`オブジェクトをエクスポートする`auth.config.ts`ファイルを作成します。このオブジェクトにはNextAuth.jsの設定オプションが含まれます。今のところ、`pages`オプションのみが含まれます：

```tsx
// /auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
```

`pages`オプションを使用して、カスタムサインイン、サインアウト、エラーページのルートを指定できます。これは必須ではありませんが、`pages`オプションに`signIn: '/login'`を追加することで、ユーザーはNextAuth.jsのデフォルトページではなく、カスタムログインページにリダイレクトされます。

## Next.js Middlewareでルートを保護する

次に、ルートを保護するロジックを追加します。これにより、ログインしていないユーザーがダッシュボードページにアクセスできなくなります。

```tsx
// /auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // 認証されていないユーザーをログインページにリダイレクト
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
  providers: [], // 今のところ空の配列でプロバイダーを追加
} satisfies NextAuthConfig;
```

`authorized`コールバックは、[Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)を使用してページへのアクセスリクエストが認可されているかどうかを確認するために使用されます。リクエストが完了する前に呼び出され、`auth`と`request`プロパティを持つオブジェクトを受け取ります。`auth`プロパティにはユーザーのセッションが含まれ、`request`プロパティには入力リクエストが含まれます。

`providers`オプションは、異なるログインオプションをリストする配列です。今のところ、NextAuth設定を満たすための空の配列です。「Credentialsプロバイダーの追加」セクションでこれについて詳しく学びます。

次に、`authConfig`オブジェクトをMiddlewareファイルにインポートする必要があります。プロジェクトのルートに`middleware.ts`というファイルを作成し、以下のコードを貼り付けます：

```tsx
// /middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
  runtime: "nodejs",
};
```

ここでは、`authConfig`オブジェクトでNextAuth.jsを初期化し、`auth`プロパティをエクスポートしています。また、Middlewareの`matcher`オプションを使用して、特定のパスで実行するよう指定しています。

このタスクにMiddlewareを使用する利点は、Middlewareが認証を確認するまで保護されたルートがレンダリングを開始しないことで、アプリケーションのセキュリティとパフォーマンスの両方を向上させることです。

### パスワードハッシュ化

データベースに保存する前にパスワードをハッシュ化することは良い慣行です。ハッシュ化は、パスワードを固定長のランダムに見える文字列に変換し、ユーザーのデータが公開されてもセキュリティの層を提供します。

データベースをシードするときに、`bcrypt`というパッケージを使用してユーザーのパスワードをデータベースに保存する前にハッシュ化しました。この章で後ほど、ユーザーが入力したパスワードがデータベース内のものと一致するかを比較するために再度使用します。ただし、`bcrypt`パッケージ用に別のファイルを作成する必要があります。これは、`bcrypt`がNext.js Middlewareでは利用できないNode.js APIに依存しているためです。

`authConfig`オブジェクトを展開する`auth.ts`という新しいファイルを作成します：

```tsx
// /auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
```

### Credentialsプロバイダーの追加

次に、NextAuth.jsの`providers`オプションを追加する必要があります。`providers`は、GoogleやGitHubなどの異なるログインオプションをリストする配列です。このコースでは、[Credentialsプロバイダー](https://authjs.dev/getting-started/providers/credentials-tutorial)のみの使用に焦点を当てます。

Credentialsプロバイダーを使用すると、ユーザーはユーザー名とパスワードでログインできます。

```tsx
// /auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({})],
});
```

> **覚えておきたいこと：**
> [OAuth](https://authjs.dev/getting-started/providers/oauth-tutorial)や[email](https://authjs.dev/getting-started/providers/email-tutorial)などの他の代替プロバイダーがあります。オプションの完全なリストについては、[NextAuth.jsドキュメント](https://authjs.dev/getting-started/providers)を参照してください。

### サインイン機能の追加

`authorize`関数を使用して認証ロジックを処理できます。Server Actionsと同様に、データベースでユーザーが存在するかを確認する前に、`zod`を使用してメールとパスワードを検証できます：

```tsx
// /auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
      },
    }),
  ],
});
```

認証情報を検証した後、データベースからユーザーをクエリする新しい`getUser`関数を作成します。

```tsx
// /auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
        }

        return null;
      },
    }),
  ],
});
```

次に、`bcrypt.compare`を呼び出してパスワードが一致するかを確認します：

```tsx
// /auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcrypt";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// ...

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // ...

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
```

最後に、パスワードが一致する場合はユーザーを返し、そうでなければ`null`を返してユーザーのログインを防ぎます。

### ログインフォームの更新

今度は、認証ロジックをログインフォームと接続する必要があります。`actions.ts`ファイルで、`authenticate`という新しいアクションを作成します。このアクションは`auth.ts`から`signIn`関数をインポートする必要があります：

```tsx
// /app/lib/actions.ts
"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
```

`'CredentialsSignin'`エラーがある場合、適切なエラーメッセージを表示したいと思います。NextAuth.jsエラーについては[ドキュメント](https://errors.authjs.dev/)で学ぶことができます。

最後に、`login-form.tsx`コンポーネントで、Reactの`useActionState`を使用してサーバーアクションを呼び出し、フォームエラーを処理し、フォームの保留状態を表示できます：

```tsx
// app/ui/login-form.tsx
"use client";

import { lusitana } from "@/app/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "@/app/ui/button";
import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
```

## ログアウト機能の追加

`<SideNav />`にログアウト機能を追加するには、`<form>`要素で`auth.ts`から`signOut`関数を呼び出します：

```tsx
// /ui/dashboard/sidenav.tsx
import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AcmeLogo from "@/app/ui/acme-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      // ...
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
```

## 試してみる

これで試してみてください。以下の認証情報を使用してアプリケーションにログインおよびログアウトできるはずです：

• Email: `user@nextmail.com`
• Password: `123456`

## 第15章を完了しました

アプリケーションに認証を追加し、ダッシュボードルートを保護しました。

**次へ**

16: メタデータの追加

共有の準備として、メタデータを追加する方法を学んでアプリケーションを完成させましょう。

[第16章を開始](https://nextjs.org/learn/dashboard-app/adding-metadata)
