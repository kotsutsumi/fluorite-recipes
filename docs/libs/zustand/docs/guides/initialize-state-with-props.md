---
title: propsで状態を初期化する
nav: 13
---

コンポーネントからのpropsでストアを初期化する必要がある場合など、[依存性注入](https://en.wikipedia.org/wiki/Dependency_injection)が必要な場合は、React.contextでバニラストアを使用することが推奨されます。

## `createStore`でストアクリエーターを作成する

```ts
import { createStore } from 'zustand'

interface BearProps {
  bears: number
}

interface BearState extends BearProps {
  addBear: () => void
}

type BearStore = ReturnType<typeof createBearStore>

const createBearStore = (initProps?: Partial<BearProps>) => {
  const DEFAULT_PROPS: BearProps = {
    bears: 0,
  }
  return createStore<BearState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    addBear: () => set((state) => ({ bears: ++state.bears })),
  }))
}
```

## `React.createContext`でコンテキストを作成する

```ts
import { createContext } from 'react'

export const BearContext = createContext<BearStore | null>(null)
```

## 基本的なコンポーネントの使用方法

```tsx
// Provider implementation
import { useRef } from 'react'

function App() {
  const store = useRef(createBearStore()).current
  return (
    <BearContext.Provider value={store}>
      <BasicConsumer />
    </BearContext.Provider>
  )
}
```

```tsx
// Consumer component
import { useContext } from 'react'
import { useStore } from 'zustand'

function BasicConsumer() {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  const bears = useStore(store, (s) => s.bears)
  const addBear = useStore(store, (s) => s.addBear)
  return (
    <>
      <div>{bears} Bears.</div>
      <button onClick={addBear}>Add bear</button>
    </>
  )
}
```

## よくあるパターン

### コンテキストプロバイダーをラップする

```tsx
// Provider wrapper
import { useRef } from 'react'

type BearProviderProps = React.PropsWithChildren<BearProps>

function BearProvider({ children, ...props }: BearProviderProps) {
  const storeRef = useRef<BearStore>()
  if (!storeRef.current) {
    storeRef.current = createBearStore(props)
  }
  return (
    <BearContext.Provider value={storeRef.current}>
      {children}
    </BearContext.Provider>
  )
}
```

### コンテキストロジックをカスタムフックに抽出する

```tsx
// Mimic the hook returned by `create`
import { useContext } from 'react'
import { useStore } from 'zustand'

function useBearContext<T>(selector: (state: BearState) => T): T {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStore(store, selector)
}
```

```tsx
// Consumer usage of the custom hook
function CommonConsumer() {
  const bears = useBearContext((s) => s.bears)
  const addBear = useBearContext((s) => s.addBear)
  return (
    <>
      <div>{bears} Bears.</div>
      <button onClick={addBear}>Add bear</button>
    </>
  )
}
```

### オプションでカスタム等価関数を使用できるようにする

```tsx
// Allow custom equality function by using useStoreWithEqualityFn instead of useStore
import { useContext } from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'

function useBearContext<T>(
  selector: (state: BearState) => T,
  equalityFn?: (left: T, right: T) => boolean,
): T {
  const store = useContext(BearContext)
  if (!store) throw new Error('Missing BearContext.Provider in the tree')
  return useStoreWithEqualityFn(store, selector, equalityFn)
}
```

### 完全な例

```tsx
// Provider wrapper & custom hook consumer
function App2() {
  return (
    <BearProvider bears={2}>
      <HookConsumer />
    </BearProvider>
  )
}
```
