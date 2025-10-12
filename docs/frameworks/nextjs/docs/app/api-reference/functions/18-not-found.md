# notFound

`notFound`関数を使用すると、ルートセグメント内で`not-found`ファイルをレンダリングし、`<meta name="robots" content="noindex" />`タグを注入できます。

## `notFound()`

`notFound()`関数を呼び出すと、`NEXT_HTTP_ERROR_FALLBACK;404`エラーがスローされ、それがスローされたルートセグメントのレンダリングが終了します。**not-found**ファイルを指定することで、セグメント内で404エラーを適切に処理できます。

```tsx filename="app/user/[id]/page.tsx" switcher
import { notFound } from 'next/navigation'

async function fetchUser(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound()
  }

  // ...
}
```

```jsx filename="app/user/[id]/page.js" switcher
import { notFound } from 'next/navigation'

async function fetchUser(id) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({ params }) {
  const { id } = await params
  const user = await fetchUser(id)

  if (!user) {
    notFound()
  }

  // ...
}
```

> **Good to know**: `notFound()`はTypeScriptの[`never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#never)型を使用しているため、`return notFound()`を使用する必要はありません。

## バージョン履歴

| バージョン | 変更内容 |
|---------|---------|
| `v13.0.0` | `notFound`が導入されました |
