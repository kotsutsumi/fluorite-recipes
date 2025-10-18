# Next.js

このガイドでは、JotaiをNext.jsアプリケーションと統合する方法を説明します。

## Hydration

JotaiはNext.jsでのServer-Side Rendering（SSR）とhydrationをサポートしています。

### useHydrateAtomsを使用する

`useHydrateAtoms`フックを使用して、サーバーから取得した値でatomsをhydrateできます：

```javascript
import { useHydrateAtoms } from 'jotai/utils'
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

function HydrateAtoms({ initialCount, children }) {
  useHydrateAtoms([[countAtom, initialCount]])
  return children
}

export default function Page({ initialCount }) {
  return (
    <HydrateAtoms initialCount={initialCount}>
      <Counter />
    </HydrateAtoms>
  )
}

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      Count: {count}
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      initialCount: 42,
    },
  }
}
```

## Providerの使用

SSRを使用する場合、各リクエストに対して新しいstoreインスタンスを作成することをお勧めします：

```javascript
import { Provider } from 'jotai'

function App({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  )
}

export default App
```

これにより、storeのライフタイムが単一のリクエストに制限され、リクエスト間での状態のリークを防ぎます。

## Routerとの同期

`atomWithHash`を使用してURLと状態を同期できます：

```javascript
import { atomWithHash } from 'jotai-location'
import Router from 'next/router'

const pageAtom = atomWithHash('page', 1, {
  replaceState: true,
  subscribe: (callback) => {
    Router.events.on('routeChangeComplete', callback)
    Router.events.on('hashChangeComplete', callback)
    window.addEventListener('hashchange', callback)
    return () => {
      Router.events.off('routeChangeComplete', callback)
      Router.events.off('hashChangeComplete', callback)
      window.removeEventListener('hashchange', callback)
    }
  },
})
```

### Next.js 13のApp Routerでの使用

Next.js 13のApp Routerでは、イベントハンドリングが変更されています。詳細は公式ドキュメントを参照してください。

## SSRの考慮事項

### Promiseの扱い

SSR中にpromiseを直接返すことはできません。atomの定義でSSRに対するガードを実装してください：

```javascript
const dataAtom = atom(async () => {
  if (typeof window === 'undefined') {
    // SSR中
    return null
  }
  // クライアント側のみ
  const response = await fetch('/api/data')
  return response.json()
})
```

または、`useHydrateAtoms`を使用してサーバー側の値をhydrateすることもできます。

## SWCプラグイン

JotaiはNext.jsのSWCプラグインを提供しており、開発体験を向上させます：

### インストール

```bash
npm install jotai-swc
```

### 設定

`next.config.js`に以下を追加します：

```javascript
module.exports = {
  experimental: {
    swcPlugins: [['jotai/swc', {}]],
  },
}
```

### 利点

- デバッグラベルの自動追加
- React Fast Refreshのサポート改善

## 例

### Page Router

```javascript
import { Provider } from 'jotai'
import { atom, useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}

function HydrateAtoms({ initialValues, children }) {
  useHydrateAtoms(initialValues)
  return children
}

export default function Page({ countFromServer }) {
  return (
    <Provider>
      <HydrateAtoms initialValues={[[countAtom, countFromServer]]}>
        <Counter />
      </HydrateAtoms>
    </Provider>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      countFromServer: 42,
    },
  }
}
```

### App Router（Next.js 13+）

```javascript
// app/providers.tsx
'use client'

import { Provider } from 'jotai'

export function Providers({ children }) {
  return <Provider>{children}</Provider>
}

// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

// app/page.tsx
'use client'

import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

export default function Page() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  )
}
```

## クイックスタート

Next.jsとJotaiのサンプルプロジェクトを使用してすぐに始められます：

```bash
npx create-next-app --example with-jotai my-app
```

## ベストプラクティス

1. **Providerを使用する**：SSRではProviderを使用してstoreのライフタイムを管理します
2. **useHydrateAtomsを使用する**：サーバー側の値をhydrateします
3. **SSRガードを実装する**：async atomsではSSRに対するガードを追加します
4. **SWCプラグインを使用する**：開発体験を向上させます

## トラブルシューティング

### Hydrationミスマッチ

サーバーとクライアントで同じ初期値を使用していることを確認してください。

### 状態のリーク

各リクエストに対して新しいProviderインスタンスを作成していることを確認してください。

### Async atomsのエラー

SSR中にpromiseを返さないようにガードを実装してください。

## まとめ

JotaiはNext.jsと良好に統合され、SSR、hydration、ルーティングの同期をサポートします。適切な設定により、型安全で効率的な状態管理を実現できます。
