# zustand/contextからのcreateContext

## 概要

v3.5以降、ストアフックの誤用を避けるために特別な`createContext`関数が提供されています。

> **注意**: この関数はv4で非推奨となり、v5で削除される予定です。

## 基本的な使い方

```jsx
import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

const createStore = () => create(...)

const App = () => (
  <Provider createStore={createStore}>
    ...
  </Provider>
)

const Component = () => {
  const state = useStore()
  const slice = useStore(selector)
  ...
}
```

## 実際のコンポーネントでの使用

以下は、コンテキスト付きのベアストアを作成する例です：

```jsx
import create from 'zustand'
import createContext from 'zustand/context'

const { Provider, useStore } = createContext()

const createStore = () =>
  create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
  }))

const Button = () => {
  const bears = useStore((state) => state.bears)
  const increasePopulation = useStore((state) => state.increasePopulation)

  return (
    <div>
      <div>{bears} bears</div>
      <button onClick={increasePopulation}>Add bear</button>
    </div>
  )
}

export default function App() {
  return (
    <Provider createStore={createStore}>
      <Button />
    </Provider>
  )
}
```

## Propsからの初期化

Propsを使用してストアを初期化する例：

```jsx
const { Provider, useStore } = createContext()

export default function App({ initialBears }) {
  return (
    <Provider
      createStore={() =>
        create((set) => ({
          bears: initialBears,
          increase: () => set((state) => ({ bears: state.bears + 1 })),
        }))
      }
    >
      <Button />
    </Provider>
  )
}
```

## v4への移行

Reactのネイティブコンテキストを使用した移行パス：

```jsx
import { createContext, useContext, useRef } from 'react'
import { createStore, useStore } from 'zustand'

const StoreContext = createContext(null)

const StoreProvider = ({ children }) => {
  const storeRef = useRef()
  if (!storeRef.current) {
    storeRef.current = createStore((set) => ({
      // ... ストアの状態とアクション
      bears: 0,
      increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      removeAllBears: () => set({ bears: 0 }),
    }))
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

const useStoreFromContext = (selector) => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('Store context is not available')
  }
  return useStore(store, selector)
}

// 使用例
const Component = () => {
  const bears = useStoreFromContext((state) => state.bears)
  const increasePopulation = useStoreFromContext((state) => state.increasePopulation)

  return (
    <div>
      <div>{bears} bears</div>
      <button onClick={increasePopulation}>Add bear</button>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Component />
    </StoreProvider>
  )
}
```

## 移行のポイント

v4への移行時には以下の点に注意してください：

1. **Reactのコンテキストを使用**: `zustand/context`の代わりにReactのネイティブコンテキストAPIを使用
2. **useRefを使用**: ストアのインスタンスを保持するために`useRef`を使用
3. **カスタムフックを作成**: コンテキストからストアを取得するカスタムフックを作成
4. **エラーハンドリング**: コンテキストが利用できない場合のエラーハンドリングを追加

この移行パターンにより、Zustand v4以降でもコンテキストベースのストア管理を継続できます。
