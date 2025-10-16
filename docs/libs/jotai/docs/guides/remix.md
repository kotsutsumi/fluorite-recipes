# Remix

このガイドでは、JotaiをRemixアプリケーションと統合する方法を説明します。

## Hydration

JotaiはRemixでのServer-Side Rendering（SSR）とhydrationをサポートしています。

### useHydrateAtomsを使用する

`useHydrateAtoms`フックを使用して、サーバーから取得した値でatomsをhydrateできます。このフックの詳細なドキュメントは、[SSRユーティリティセクション](../utils/ssr)を参照してください。

## 基本的な使用例

```javascript
import { useHydrateAtoms } from 'jotai/utils'
import { atom, useAtom } from 'jotai'
import { useLoaderData } from '@remix-run/react'

const countAtom = atom(0)

function HydrateAtoms({ initialValues, children }) {
  useHydrateAtoms(initialValues)
  return children
}

export async function loader() {
  return {
    initialCount: 42,
  }
}

export default function Index() {
  const { initialCount } = useLoaderData()

  return (
    <HydrateAtoms initialValues={[[countAtom, initialCount]]}>
      <Counter />
    </HydrateAtoms>
  )
}

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}
```

## Providerの使用

Remixでは、アプリケーションのルートレベルでProviderを使用することをお勧めします：

```javascript
// app/root.tsx
import { Provider } from 'jotai'

export default function App() {
  return (
    <html lang="ja">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Provider>
          <Outlet />
        </Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
```

## Remix Loaderとの統合

Remixのloaderから取得したデータでatomsをhydrateできます：

```javascript
import { useLoaderData } from '@remix-run/react'
import { useHydrateAtoms } from 'jotai/utils'
import { atom, useAtom } from 'jotai'

const userAtom = atom(null)

export async function loader() {
  const user = await getUserFromDatabase()
  return { user }
}

export default function Profile() {
  const { user } = useLoaderData()
  useHydrateAtoms([[userAtom, user]])

  const [currentUser] = useAtom(userAtom)

  return <div>Welcome, {currentUser.name}!</div>
}
```

## Remix Actionとの統合

Remixのactionと組み合わせてatomsを更新できます：

```javascript
import { Form, useActionData } from '@remix-run/react'
import { atom, useSetAtom } from 'jotai'
import { useEffect } from 'react'

const messageAtom = atom('')

export async function action({ request }) {
  const formData = await request.formData()
  const message = formData.get('message')

  // サーバー側の処理
  await saveMessage(message)

  return { success: true, message }
}

export default function MessageForm() {
  const actionData = useActionData()
  const setMessage = useSetAtom(messageAtom)

  useEffect(() => {
    if (actionData?.message) {
      setMessage(actionData.message)
    }
  }, [actionData, setMessage])

  return (
    <Form method="post">
      <input name="message" type="text" />
      <button type="submit">送信</button>
    </Form>
  )
}
```

## ベストプラクティス

1. **useHydrateAtomsを使用する**：loaderから取得したデータでatomsをhydrateします
2. **Providerをroot.tsxに配置する**：アプリケーション全体でstoreを共有します
3. **SSRを考慮する**：async atomsを使用する場合はSSRに対するガードを実装します
4. **Remixのデータフローを活用する**：loaderとactionを使用してサーバーとクライアントの状態を同期します

## トラブルシューティング

### Hydrationミスマッチ

サーバーとクライアントで同じ初期値を使用していることを確認してください。loaderから返されたデータを`useHydrateAtoms`で正しく使用します。

### 状態の永続化

Remixのセッションストレージと組み合わせてatomの状態を永続化できます：

```javascript
import { createCookieSessionStorage } from '@remix-run/node'

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    secrets: ['s3cr3t'],
  },
})

export async function loader({ request }) {
  const session = await getSession(request.headers.get('Cookie'))
  const count = session.get('count') || 0

  return { count }
}

export async function action({ request }) {
  const session = await getSession(request.headers.get('Cookie'))
  const formData = await request.formData()
  const count = Number(formData.get('count'))

  session.set('count', count)

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  })
}
```

## 詳細情報

`useHydrateAtoms`フックの詳細については、[SSRユーティリティドキュメント](../utils/ssr)を参照してください。

Remixの詳細については、[Remix公式ドキュメント](https://remix.run/docs)を参照してください。
