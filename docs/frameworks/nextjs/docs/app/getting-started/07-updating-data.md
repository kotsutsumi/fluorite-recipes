# データの更新

Server Actionsを使用すると、フォームとボタンのクリックでサーバー上のデータを更新できます。このページでは、Server Actionsの仕組みと使用方法について学びます。

## Server Actionsとは？

Server Actionsは、サーバー上で実行される**非同期関数**です。Server ActionsはServer ComponentsとClient Componentsで呼び出すことができ、Next.jsアプリケーションでデータの変更を行うことができます。

> **用語**:
>
> Server Actionsは、更新、作成、削除などのデータ**変更**に使用されます。データ**フェッチ**の場合は、[データフェッチ](/docs/app/building-your-application/data-fetching/fetching)ドキュメントを参照してください。

## 規約

Server Actionsは、Reactの[\`"use server"\`](https://react.dev/reference/rsc/use-server)ディレクティブを使用して定義できます。このディレクティブは、\`async\`関数の先頭に配置してその関数をServer Actionとしてマークするか、別のファイルの先頭に配置してそのファイルのすべてのエクスポートをServer Actionとしてマークできます。

### Server Componentsでの使用

Server Componentsでは、インライン関数レベルまたはモジュールレベルで\`"use server"\`ディレクティブを使用できます。Server Actionをインライン化するには、関数本体の先頭に\`"use server"\`を追加します：

\`\`\`tsx title="app/page.tsx"
export default function Page() {
  // Server Action
  async function createPost(formData: FormData) {
    'use server'
    // データを変更
  }

  return <form action={createPost}>...</form>
}
\`\`\`

### Client Componentsでの使用

Client ComponentsでServer Actionsを呼び出すには、新しいファイルを作成し、その先頭に\`"use server"\`ディレクティブを追加します。ファイル内のすべての関数はServer Actionsとしてマークされ、Server ComponentsとClient Componentsの両方で再利用できます：

\`\`\`tsx title="app/actions.ts"
'use server'

export async function createPost(formData: FormData) {
  // データを変更
}
\`\`\`

\`\`\`tsx title="app/ui/button.tsx"
'use client'

import { createPost } from '@/app/actions'

export function Button() {
  return <button onClick={() => createPost()}>Create Post</button>
}
\`\`\`

### Actionsをプロパティとして渡す

Server Actionを子コンポーネントにプロパティとして渡すこともできます：

\`\`\`tsx title="app/page.tsx"
import { Button } from './ui/button'

export default function Page() {
  async function createPost(formData: FormData) {
    'use server'
    // データを変更
  }

  return <Button action={createPost} />
}
\`\`\`

\`\`\`tsx title="app/ui/button.tsx"
'use client'

export function Button({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action}>
      <button type="submit">Create Post</button>
    </form>
  )
}
\`\`\`

## Server Actionsの呼び出し

Server Actionsは次の方法で呼び出すことができます：

- \`action\`を使用: Reactの\`action\`プロパティを使用すると、\`<form>\`要素でServer Actionを呼び出すことができます。
- \`formAction\`を使用: Reactの\`formAction\`プロパティを使用すると、\`<form>\`内の\`<button>\`、\`<input type="submit">\`、\`<input type="image">\`要素を処理できます。
- \`startTransition\`を使用したカスタム呼び出し: \`action\`や\`formAction\`を使用せずにServer Actionsを呼び出します。この方法は、[プログレッシブエンハンスメント](/docs/app/building-your-application/data-fetching/server-actions-and-mutations#progressive-enhancement)を無効にします。

### \`action\`

Reactの\`action\`プロパティを使用して、\`<form>\`要素でServer Actionを呼び出すことができます。actionプロパティで渡されたServer Actionsは非同期副作用として機能し、ユーザーインタラクションに応答します。

\`\`\`tsx title="app/page.tsx"
export default function Page() {
  async function createPost(formData: FormData) {
    'use server'

    const title = formData.get('title')
    const content = formData.get('content')

    // データを変更
  }

  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <textarea name="content" />
      <button type="submit">Create Post</button>
    </form>
  )
}
\`\`\`

> **知っておくと良いこと**: \`action\`は、HTMLプリミティブの[\`action\`](https://developer.mozilla.org/docs/Web/HTML/Element/form#action)に似ています。Reactはそれを拡張して、Server Actionsをサポートします。

### \`formAction\`

\`formAction\`プロパティを使用して、\`<button>\`、\`<input type="submit">\`、および\`<input type="image">\`などのフォーム要素を処理できます。\`formAction\`プロパティは、フォームの\`action\`を上書きします。

\`\`\`tsx title="app/page.tsx"
export default function Page() {
  async function createPost(formData: FormData) {
    'use server'
    // データを変更
  }

  async function deletePost(formData: FormData) {
    'use server'
    // データを削除
  }

  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <button type="submit">Create</button>
      <button formAction={deletePost}>Delete</button>
    </form>
  )
}
\`\`\`

### \`startTransition\`を使用したカスタム呼び出し

\`action\`や\`formAction\`を使用せずにServer Actionsを呼び出すこともできます。これは、\`startTransition\`を使用して実現できます。これは、フォーム、ボタン、または入力の外部でServer Actionsを使用したい場合に便利です。

> **知っておくと良いこと**: \`startTransition\`を使用すると、[プログレッシブエンハンスメント](/docs/app/building-your-application/data-fetching/server-actions-and-mutations#progressive-enhancement)が無効になります。

\`\`\`tsx title="app/ui/publish-button.tsx"
'use client'

import { publishPost } from '@/app/actions'
import { useTransition } from 'react'

export function PublishButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => publishPost(id))}
      disabled={isPending}
    >
      Publish
    </button>
  )
}
\`\`\`

## 動作の強化

### 保留状態の表示

フォームが送信されている間、保留状態を表示するには、Reactの[\`useActionState\`](https://react.dev/reference/react/useActionState)フックを使用できます。

> **知っておくと良いこと**: \`useActionState\`はReact 19に同梱されています。React 19以前のバージョンを使用している場合は、[\`useFormState\`](https://react.dev/reference/react-dom/hooks/useFormState)として利用できます。詳細については、[Reactドキュメント](https://react.dev/reference/react/useActionState)を参照してください。

\`\`\`tsx title="app/ui/form.tsx"
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

export function Form() {
  const [state, formAction, isPending] = useActionState(createPost, null)

  return (
    <form action={formAction}>
      <input type="text" name="title" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
\`\`\`

> **知っておくと良いこと**: また、Reactの[\`useFormStatus\`](https://react.dev/reference/react-dom/hooks/useFormStatus)フックを使用して、フォームが保留中かどうかを判断できます。詳細については、[Reactドキュメント](https://react.dev/reference/react-dom/hooks/useFormStatus)を参照してください。

### 楽観的な更新

Reactの[\`useOptimistic\`](https://react.dev/reference/react/useOptimistic)フックを使用して、Server Actionが完了するのを待つのではなく、レスポンスを待つ間にUIを楽観的に更新できます：

\`\`\`tsx title="app/page.tsx"
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: Message) => [...state, newMessage]
  )

  const formAction = async (formData: FormData) => {
    const message = formData.get('message') as string
    addOptimisticMessage({ message, sending: true })
    await send(message)
  }

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>
          {m.message}
          {m.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
\`\`\`

### エラー処理

Server Actionsはエラーをスローすることもできます。エラーを処理するには、[\`error.tsx\`](/docs/app/building-your-application/routing/error-handling)または[\`<Suspense>\`](https://react.dev/reference/react/Suspense)境界を使用します。

UIでエラーを処理するには、\`try/catch\`でServer Actionをラップすることをお勧めします：

\`\`\`tsx title="app/actions.ts"
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')

  // エラー処理
  if (!title) {
    throw new Error('Title is required')
  }

  // データを変更
}
\`\`\`

> **知っておくと良いこと**:
>
> - エラーをスローする以外に、\`useActionState\`で処理するオブジェクトを返すこともできます。[Server-side form validation](/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-form-validation)を参照してください。

### データの再検証

[\`revalidatePath\`](/docs/app/api-reference/functions/revalidatePath) APIを使用して、Server Actions内で[Next.jsキャッシュ](/docs/app/building-your-application/caching)を再検証できます：

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  // データを変更

  revalidatePath('/posts')
}
\`\`\`

または、[\`revalidateTag\`](/docs/app/api-reference/functions/revalidateTag)を使用して特定のデータフェッチを\`cache\`タグで無効にします：

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  // データを変更

  revalidateTag('posts')
}
\`\`\`

### リダイレクト

Server Actionの完了後にユーザーを別のルートにリダイレクトしたい場合は、[\`redirect\`](/docs/app/api-reference/functions/redirect) APIを使用できます。\`redirect\`は\`try/catch\`ブロックの外で呼び出す必要があります：

\`\`\`tsx title="app/actions.ts"
'use server'

import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // データを変更

  redirect('/posts')
}
\`\`\`

### Cookies

Server Actions内で[\`cookies\`](/docs/app/api-reference/functions/cookies) APIを使用して、Cookieを取得、設定、削除できます：

\`\`\`tsx title="app/actions.ts"
'use server'

import { cookies } from 'next/headers'

export async function createPost(formData: FormData) {
  const cookieStore = await cookies()

  // Cookieを取得
  const theme = cookieStore.get('theme')

  // Cookieを設定
  cookieStore.set('theme', 'dark')

  // Cookieを削除
  cookieStore.delete('theme')
}
\`\`\`

Server ActionsからCookieを削除するための[追加の例](/docs/app/api-reference/functions/cookies#deleting-cookies)を参照してください。

## セキュリティ

### 認証と認可

Server Actionsは、公開されているAPIエンドポイントと同様に扱い、ユーザーがそのアクションを実行する権限があることを確認する必要があります。例えば：

\`\`\`tsx title="app/actions.ts"
'use server'

import { auth } from './lib'

export async function createPost(formData: FormData) {
  const session = await auth()

  if (!session) {
    throw new Error('Unauthorized')
  }

  // データを変更
}
\`\`\`

### クロージャと暗号化

コンポーネント内でServer Actionを定義すると、アクションが外部関数のスコープにアクセスできる[クロージャ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)が作成されます。例えば、\`publishPost\`アクションは\`publishVersion\`変数にアクセスできます：

\`\`\`tsx title="app/page.tsx"
export default async function Page() {
  const publishVersion = await getLatestVersion()

  async function publishPost(formData: FormData) {
    'use server'

    if (publishVersion !== await getLatestVersion()) {
      throw new Error('The version has changed since publishing started')
    }
    // データを変更
  }

  return <button action={publishPost}>Publish</button>
}
\`\`\`

クロージャは、レンダリング時（\`publishVersion\`など）のデータの**スナップショット**をキャプチャして、後でアクションが呼び出されたときに使用できるようにする必要がある場合に役立ちます。

ただし、これが発生するには、キャプチャされた変数がクライアントに送信され、アクションが呼び出されたときにサーバーに戻される必要があります。機密データがクライアントに公開されるのを防ぐため、Next.jsは自動的に閉じられた変数を暗号化します。Next.jsアプリケーションがビルドされるたびに、各アクションに対して新しい秘密鍵が生成されます。これは、アクションが特定のビルドに対してのみ呼び出せることを意味します。

> **知っておくと良いこと**: 機密値がクライアント側に公開されるのを防ぐために、暗号化のみに依存することはお勧めしません。代わりに、[React taint APIs](/docs/app/building-your-application/data-fetching/fetching#preventing-sensitive-data-from-being-exposed-to-the-client)を使用して、特定のデータがクライアントに送信されるのを積極的に防ぐ必要があります。

### 暗号化キーの上書き（高度）

Next.jsアプリケーションを複数のサーバー間でセルフホスティングする場合、各サーバーインスタンスは異なる暗号化キーを持つ可能性があり、潜在的な不整合につながる可能性があります。

これを軽減するには、\`process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY\`環境変数を使用して暗号化キーを上書きできます。この変数を指定すると、暗号化キーがビルド間で永続的になり、すべてのサーバーインスタンスが同じキーを使用するようになります。

これは、複数のデプロイメント間で一貫した暗号化動作がアプリケーションにとって重要な高度なユースケースです。キーのローテーションや署名などの標準的なセキュリティプラクティスを検討する必要があります。

> **知っておくと良いこと**: VercelにデプロイされたNext.jsアプリケーションは、これを自動的に処理します。

### 許可される発信元（高度）

Server Actionsは\`<form>\`要素で呼び出すことができるため、[CSRF攻撃](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)に対して脆弱になる可能性があります。

舞台裏では、Server ActionsはPOSTメソッドを使用し、このHTTPメソッドのみがそれらを呼び出すことができます。これにより、最新のブラウザ、特に[SameSite Cookie](https://web.dev/articles/samesite-cookies-explained)がデフォルトである場合、ほとんどのCSRF脆弱性が防止されます。

追加の保護として、Next.jsのServer Actionsは、[\`Origin\`ヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin)を[\`Host\`ヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)（または\`X-Forwarded-Host\`）と比較します。これらが一致しない場合、リクエストは中止されます。つまり、Server Actionsは、それをホストするページと同じホストでのみ呼び出すことができます。

リバースプロキシまたはマルチレイヤーバックエンドアーキテクチャを使用する大規模なアプリケーション（サーバーAPIが本番ドメインと異なる場合）の場合、設定[\`serverActions.allowedOrigins\`](/docs/app/api-reference/config/next-config-js/serverActions)オプションを使用して、安全な発信元のリストを指定することをお勧めします。このオプションは文字列の配列を受け入れます。

\`\`\`js title="next.config.js"
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
\`\`\`

[Security and Server Actions](https://nextjs.org/blog/security-nextjs-server-components-actions)について詳しく学びましょう。

## 追加リソース

データの変更の詳細については、次のReactドキュメントを参照してください：

- [\`"use server"\`](https://react.dev/reference/rsc/use-server)
- [\`<form>\`](https://react.dev/reference/react-dom/components/form)
- [\`useFormStatus\`](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [\`useActionState\`](https://react.dev/reference/react/useActionState)
- [\`useOptimistic\`](https://react.dev/reference/react/useOptimistic)
