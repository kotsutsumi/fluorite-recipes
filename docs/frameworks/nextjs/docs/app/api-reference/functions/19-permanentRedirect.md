# permanentRedirect

`permanentRedirect`関数を使用すると、ユーザーを別のURLにリダイレクトできます。`permanentRedirect`は、Server Components、Client Components、Route Handlers、およびServer Actionsで使用できます。

ストリーミングコンテキストで使用すると、クライアント側でリダイレクトを発行するためのメタタグを挿入します。Server Actionで使用すると、呼び出し元に303 HTTPリダイレクトレスポンスを返します。それ以外の場合は、呼び出し元に308（Permanent）HTTPリダイレクトレスポンスを返します。

リソースが存在しない場合は、代わりに[`notFound`関数](/docs/app/api-reference/functions/not-found)を使用できます。

> **Good to know**: 308（Permanent）の代わりに307（Temporary）リダイレクトを返したい場合は、代わりに[`redirect`関数](/docs/app/api-reference/functions/redirect)を使用できます。

## パラメータ

```tsx
permanentRedirect(path, type)
```

| パラメータ | 型 | 説明 |
|---------|-----|------|
| `path` | `string` | リダイレクト先のURL。相対パスまたは絶対パスを指定できます。 |
| `type` | `'replace'`（デフォルト）または`'push'`（Server Actionsではデフォルト） | 実行するリダイレクトのタイプ。 |

デフォルトでは、`permanentRedirect`はServer Actionsでは`push`（ブラウザ履歴スタックに新しいエントリを追加）を使用し、その他の場所では`replace`（ブラウザ履歴スタックの現在のURLを置き換え）を使用します。`type`パラメータを指定することでこの動作を上書きできます。

`type`パラメータは、Server Componentsで使用する場合は効果がありません。

## 戻り値

`permanentRedirect`は値を返しません。

## 例

### Server Component

`permanentRedirect()`関数を呼び出すと、`NEXT_REDIRECT`エラーがスローされ、それがスローされたルートセグメントのレンダリングが終了します。

```jsx filename="app/team/[id]/page.js"
import { permanentRedirect } from 'next/navigation'

async function fetchTeam(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const { id } = await params
  const team = await fetchTeam(id)
  if (!team) {
    permanentRedirect('/login')
  }

  // ...
}
```

> **Good to know**: `permanentRedirect`はTypeScriptの[`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)型を使用しているため、`return permanentRedirect()`を使用する必要はありません。

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `permanentRedirect`が導入されました |
