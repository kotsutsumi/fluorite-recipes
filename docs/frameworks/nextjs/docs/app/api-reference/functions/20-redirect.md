# redirect

`redirect`関数を使用すると、ユーザーを別のURLにリダイレクトできます。`redirect`は、Server Components、Client Components、Route Handlers、およびServer Actionsで使用できます。

ストリーミングコンテキストで使用すると、クライアント側でリダイレクトを発行するためのメタタグを挿入します。Server Actionで使用すると、呼び出し元に303 HTTPリダイレクトレスポンスを返します。それ以外の場合は、呼び出し元に307 HTTPリダイレクトレスポンスを返します。

リソースが存在しない場合は、代わりに[`notFound`関数](/docs/app/api-reference/functions/not-found)を使用できます。

> **Good to know**:
> - Server Actionsおよび Route Handlersでは、`redirect`は`try/catch`ブロックの後に呼び出す必要があります。
> - 307（Temporary）リダイレクトの代わりに308（Permanent）HTTPリダイレクトを返したい場合は、代わりに[`permanentRedirect`関数](/docs/app/api-reference/functions/permanentRedirect)を使用できます。

## パラメータ

```tsx
redirect(path, type)
```

| パラメータ | 型 | 説明 |
|---------|-----|------|
| `path` | `string` | リダイレクト先のURL。相対パスまたは絶対パスを指定できます。 |
| `type` | `'replace'`（デフォルト）または`'push'`（Server Actionsではデフォルト） | 実行するリダイレクトのタイプ。 |

デフォルトでは、`redirect`はServer Actionsでは`push`（ブラウザ履歴スタックに新しいエントリを追加）を使用し、その他の場所では`replace`（ブラウザ履歴スタックの現在のURLを置き換え）を使用します。`type`パラメータを指定することでこの動作を上書きできます。

`type`パラメータは、Server Componentsで使用する場合は効果がありません。

## 戻り値

`redirect`は値を返しません。

## 例

### Server Component

`redirect()`関数を呼び出すと、`NEXT_REDIRECT`エラーがスローされ、それがスローされたルートセグメントのレンダリングが終了します。

```jsx filename="app/team/[id]/page.js"
import { redirect } from 'next/navigation'

async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const { id } = await params
  const team = await fetchTeam(id)
  if (!team) {
    redirect('/login')
  }

  // ...
}
```

> **Good to know**: `redirect`はTypeScriptの[`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)型を使用しているため、`return redirect()`を使用する必要はありません。

### Client Component

`redirect`は、Server ActionまたはClient Componentを通じて使用できます。イベントハンドラでユーザーをリダイレクトする必要がある場合は、[`useRouter`](/docs/app/api-reference/functions/use-router)フックを使用できます。

```tsx filename="app/client-redirect.tsx" switcher
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>Submit</button>
    </form>
  )
}
```

```jsx filename="app/client-redirect.jsx" switcher
'use client'

import { navigate } from './actions'

export function ClientRedirect() {
  return (
    <form action={navigate}>
      <input type="text" name="id" />
      <button>Submit</button>
    </form>
  )
}
```

```ts filename="app/actions.ts" switcher
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data: FormData) {
  redirect(`/posts/${data.get('id')}`)
}
```

```js filename="app/actions.js" switcher
'use server'

import { redirect } from 'next/navigation'

export async function navigate(data) {
  redirect(`/posts/${data.get('id')}`)
}
```

## よくある質問

### なぜ`redirect`は307と308を使用するのですか？

`redirect()`を使用する場合、一時的なリダイレクトには`307`ステータスコードが、永続的なリダイレクトには`308`ステータスコードが使用されることに気づくかもしれません。従来、一時的なリダイレクトには`302`が、永続的なリダイレクトには`301`が使用されていましたが、`302`を使用すると、リダイレクト時にリクエストメソッドが元の`POST`リクエストから`GET`リクエストに変更されます。

`/users`から`/people`へのリダイレクトの例を取ると、新しいユーザーを作成するために`/users`に`POST`リクエストを行うと、`302`一時的なリダイレクトに従うと、リクエストメソッドが`POST`から`GET`リクエストに変更されます。これは意味がありません。新しいユーザーを作成するには、`/people`に`POST`リクエストを行う必要があり、`GET`リクエストではありません。

`307`ステータスコードの導入により、リクエストメソッドは`POST`として保持されます。

- `302` - 一時的なリダイレクト、リクエストメソッドを`POST`から`GET`に変更
- `307` - 一時的なリダイレクト、リクエストメソッドを`POST`として保持

`redirect()`メソッドは、デフォルトで`302`一時的なリダイレクトの代わりに`307`を使用するため、リクエストは常に`POST`リクエストとして保持されます。

HTTPリダイレクトについて[詳しく学ぶ](https://developer.mozilla.org/docs/Web/HTTP/Redirections)。

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `redirect`が導入されました |
