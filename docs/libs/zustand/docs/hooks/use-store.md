---
title: 'useStore'
section: 'Hooks'
description: 'React で vanilla ストアを使用する方法'
---

# `useStore` ⚛️

`useStore` は、React で vanilla ストアを使用できるようにする React フックです。

```js
const someState = useStore(store, selectorFn)
```

- [Types](#types)
  - [Signature](#signature)
- [Reference](#reference)
- [Usage](#usage)
  - [React で vanilla ストアを使用する](#react-で-vanilla-ストアを使用する)
  - [動的なグローバル vanilla ストアを React で使用する](#動的なグローバル-vanilla-ストアを-react-で使用する)
  - [スコープ付き（非グローバル）vanilla ストアを React で使用する](#スコープ付き非グローバル-vanilla-ストアを-react-で使用する)
  - [動的なスコープ付き（非グローバル）vanilla ストアを React で使用する](#動的なスコープ付き非グローバル-vanilla-ストアを-react-で使用する)
- [Troubleshooting](#troubleshooting)

## Types

### Signature

```ts
useStore<StoreApi<T>, U = T>(store: StoreApi<T>, selectorFn?: (state: T) => U) => UseBoundStore<StoreApi<T>>
```

## Reference

### `useStore(store, selectorFn)`

#### パラメータ

- `storeApi`: ストア API ユーティリティにアクセスできるインスタンス。
- `selectorFn`: 現在の状態に基づいてデータを返す関数。

#### 戻り値

`useStore` は、セレクター関数に応じて現在の状態に基づく任意のデータを返します。ストアとセレクター関数を引数として受け取る必要があります。

## Usage

### React で vanilla ストアを使用する

まず、画面上のドットの位置を保持するストアを設定しましょう。`x` と `y` 座標を管理し、これらの座標を更新するアクションを提供するストアを定義します。

```tsx
type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}))
```

次に、ドットを表す div をレンダリングする `MovingDot` コンポーネントを作成します。このコンポーネントは、ストアを使用してドットの位置を追跡および更新します。

```tsx
function MovingDot() {
  const position = useStore(positionStore, (state) => state.position)
  const setPosition = useStore(positionStore, (state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

最後に、アプリケーションで `MovingDot` コンポーネントをレンダリングします。

```tsx
export default function App() {
  return <MovingDot />
}
```

### 動的なグローバル vanilla ストアを React で使用する

まず、動的に作成できる vanilla ストアを定義しましょう。

```tsx
import { createStore } from 'zustand/vanilla'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const createPositionStore = () => {
  return createStore<PositionStore>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
}
```

次に、このストアを使用して動的に位置を追跡するコンポーネントを作成します。

```tsx
import { useStore } from 'zustand'

const positionStore = createPositionStore()

function MovingDot() {
  const position = useStore(positionStore, (state) => state.position)
  const setPosition = useStore(positionStore, (state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

最後に、アプリケーションで `MovingDot` コンポーネントをレンダリングします。

```tsx
export default function App() {
  return <MovingDot />
}
```

### スコープ付き（非グローバル）vanilla ストアを React で使用する

vanilla ストアをコンポーネントツリー内の特定のスコープに制限したい場合は、React Context を使用できます。

まず、ストアの Context を作成しましょう。

```tsx
import { createContext, useContext } from 'react'
import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const createPositionStore = () => {
  return createStore<PositionStore>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
}

const PositionStoreContext = createContext<ReturnType<
  typeof createPositionStore
> | null>(null)

const PositionStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createPositionStore()
  return (
    <PositionStoreContext.Provider value={store}>
      {children}
    </PositionStoreContext.Provider>
  )
}
```

次に、ストアを使用するコンポーネントを作成します。

```tsx
function MovingDot() {
  const store = useContext(PositionStoreContext)
  if (!store) throw new Error('Missing PositionStoreContext.Provider in tree')

  const position = useStore(store, (state) => state.position)
  const setPosition = useStore(store, (state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

最後に、Provider でコンポーネントをラップします。

```tsx
export default function App() {
  return (
    <PositionStoreProvider>
      <MovingDot />
    </PositionStoreProvider>
  )
}
```

### 動的なスコープ付き（非グローバル）vanilla ストアを React で使用する

異なるコンポーネントインスタンスが独自のストアを持つ必要がある場合は、`useRef` を使用してストアインスタンスを保持できます。

```tsx
import { createContext, useContext, useRef } from 'react'
import { createStore } from 'zustand/vanilla'
import { useStore } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const createPositionStore = () => {
  return createStore<PositionStore>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
}

const PositionStoreContext = createContext<ReturnType<
  typeof createPositionStore
> | null>(null)

const PositionStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<ReturnType<typeof createPositionStore>>()
  if (!storeRef.current) {
    storeRef.current = createPositionStore()
  }
  return (
    <PositionStoreContext.Provider value={storeRef.current}>
      {children}
    </PositionStoreContext.Provider>
  )
}

function MovingDot() {
  const store = useContext(PositionStoreContext)
  if (!store) throw new Error('Missing PositionStoreContext.Provider in tree')

  const position = useStore(store, (state) => state.position)
  const setPosition = useStore(store, (state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <>
      <PositionStoreProvider>
        <MovingDot />
      </PositionStoreProvider>
      <PositionStoreProvider>
        <MovingDot />
      </PositionStoreProvider>
    </>
  )
}
```

この例では、各 `PositionStoreProvider` が独自のストアインスタンスを持つため、2つの `MovingDot` コンポーネントは独立して動作します。

## Troubleshooting

問題が発生した場合は、以下を確認してください：

- ストアが正しく作成されているか
- セレクター関数が適切に定義されているか
- Context を使用する場合、Provider がコンポーネントツリーの適切な位置に配置されているか
