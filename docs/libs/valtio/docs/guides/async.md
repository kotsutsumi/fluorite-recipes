---
title: 'Async'
section: 'Advanced'
description: 'Promiseとサスペンスの使用'
---

# `async`

## Promises

Promiseはプロキシ化されたオブジェクトの値として使用できます。これらは`snapshot`の呼び出し時に解決されます。

```jsx
// vanillajs の例
const countDiv: HTMLElement | null = document.getElementById('count')
if (countDiv) countDiv.innerText = '0'

const store = proxy({
  count: new Promise((r) => setTimeout(() => r(1), 1000)),
})

subscribe(store, () => {
  const value = snapshot(store).count
  if (countDiv && typeof value === 'number') {
    countDiv.innerText = String(value)
    store.count = new Promise((r) => setTimeout(() => r(value + 1), 1000))
  }
})
```

## Reactコンポーネントをサスペンドする

ValtioはReact 19の`use`フックと互換性があります。これにより、すべての非同期のやり取りが不要になり、親がフォールバック状態とエラー処理を担当しながら、データに直接アクセスできます。

```jsx
import { use } from 'react' // React 19
// import { use } from 'react18-use' // React 18

const state = proxy({ post: fetch(url).then((res) => res.json()) })

function Post() {
  const snap = useSnapshot(state)
  return <div>{use(snap.post).title}</div>
}

function App() {
  return (
    <Suspense fallback="Loading...">
      <Post />
    </Suspense>
  )
}
```

これは依然として「de-opt」の影響を受け、`useTransition`が正しく機能しないことがあります。これを軽減するために、サードパーティライブラリ[use-valtio](https://github.com/valtiojs/use-valtio)があります。

## Codesandbox Pokemon fetch デモ

https://codesandbox.io/s/valtio-pokemon-fetch-x1lkbj?file=/src/App.tsx

## Codesandbox auth デモ

https://codesandbox.io/s/valtio-async-1pstl1?file=/src/App.tsx
