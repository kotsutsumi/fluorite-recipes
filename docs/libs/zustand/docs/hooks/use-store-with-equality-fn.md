---
title: 'useStoreWithEqualityFn'
section: 'Hooks'
description: 'React で vanilla ストアを効果的に使用する方法'
---

# `useStoreWithEqualityFn` ⚛️

`useStoreWithEqualityFn` は、React で vanilla ストアを使用できるようにする React フックで、`useStore` と同様に機能します。ただし、カスタム等価性チェックを定義する方法を提供します。これにより、コンポーネントが再レンダリングされるタイミングをより細かく制御でき、パフォーマンスと応答性が向上します。

> **重要**
>
> `zustand/traditional` から `useStoreWithEqualityFn` を使用するには、`use-sync-external-store` ライブラリをインストールする必要があります。これは、`zustand/traditional` が `useSyncExternalStoreWithSelector` に依存しているためです。

```js
const someState = useStoreWithEqualityFn(store, selectorFn, equalityFn)
```

- [Types](#types)
  - [Signature](#signature)
- [Reference](#reference)
- [Usage](#usage)
  - [グローバル vanilla ストアを React で使用する](#グローバル-vanilla-ストアを-react-で使用する)
  - [動的なグローバル vanilla ストアを React で使用する](#動的なグローバル-vanilla-ストアを-react-で使用する)
  - [スコープ付き（非グローバル）vanilla ストアを React で使用する](#スコープ付き非グローバル-vanilla-ストアを-react-で使用する)
  - [動的なスコープ付き（非グローバル）vanilla ストアを React で使用する](#動的なスコープ付き非グローバル-vanilla-ストアを-react-で使用する)
- [Troubleshooting](#troubleshooting)

## Types

### Signature

```ts
useStoreWithEqualityFn<T, U = T>(store: StoreApi<T>, selectorFn: (state: T) => U, equalityFn?: (a: T, b: T) => boolean): U
```

## Reference

### `useStoreWithEqualityFn(store, selectorFn, equalityFn)`

#### パラメータ

- `storeApi`: ストア API ユーティリティにアクセスできるインスタンス。
- `selectorFn`: 現在の状態に基づいてデータを返す関数。
- `equalityFn`: 再レンダリングをスキップできる関数。

#### 戻り値

`useStoreWithEqualityFn` は、セレクター関数に応じて現在の状態に基づく任意のデータを返し、等価性関数を使用して再レンダリングをスキップできます。ストア、セレクター関数、等価性関数を引数として受け取る必要があります。

## Usage

### グローバル vanilla ストアを React で使用する

まず、画面上のドットの位置を保持するストアを設定しましょう。`x` と `y` 座標を管理し、これらの座標を更新するアクションを提供するストアを定義します。

```tsx
import { createStore, useStore } from 'zustand'

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
  const position = useStoreWithEqualityFn(
    positionStore,
    (state) => state.position,
    shallow,
  )
  const setPosition = useStoreWithEqualityFn(
    positionStore,
    (state) => state.setPosition,
    shallow,
  )

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

### 動的なグローバル vanilla ストアを React で使用する

まず、動的に作成できる vanilla ストアを定義しましょう。

```tsx
import { createStore } from 'zustand'

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
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

const positionStore = createPositionStore()

function MovingDot() {
  const position = useStoreWithEqualityFn(
    positionStore,
    (state) => state.position,
    shallow,
  )
  const setPosition = useStoreWithEqualityFn(
    positionStore,
    (state) => state.setPosition,
    shallow,
  )

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

### スコープ付き（非グローバル）vanilla ストアを React で使用する

vanilla ストアをコンポーネントツリー内の特定のスコープに制限したい場合は、React Context を使用できます。

```tsx
import { createContext, useContext } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

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

function MovingDot() {
  const store = useContext(PositionStoreContext)
  if (!store) throw new Error('Missing PositionStoreContext.Provider in tree')

  const position = useStoreWithEqualityFn(
    store,
    (state) => state.position,
    shallow,
  )
  const setPosition = useStoreWithEqualityFn(
    store,
    (state) => state.setPosition,
    shallow,
  )

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

function App() {
  return (
    <PositionStoreProvider>
      <MovingDot />
    </PositionStoreProvider>
  )
}
```

### 動的なスコープ付き（非グローバル）vanilla ストアを React で使用する

異なるコンポーネントインスタンスが独自のストアを持つ必要がある場合は、Context と組み合わせて使用できます。

```tsx
import { createContext, useContext, useRef } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

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

  const position = useStoreWithEqualityFn(
    store,
    (state) => state.position,
    shallow,
  )
  const setPosition = useStoreWithEqualityFn(
    store,
    (state) => state.setPosition,
    shallow,
  )

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

function App() {
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

## Troubleshooting

問題が発生した場合は、以下を確認してください：

- `use-sync-external-store` がインストールされているか
- 等価性関数が正しく実装されているか
- セレクター関数が適切にメモ化されているか
