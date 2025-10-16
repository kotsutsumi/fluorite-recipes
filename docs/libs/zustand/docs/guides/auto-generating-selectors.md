---
title: セレクターの自動生成
nav: 5
---

ストアからプロパティやアクションを使用する際は、セレクターを使用することをお勧めします。次のようにストアから値にアクセスできます:

```typescript
const bears = useBearStore((state) => state.bears)
```

ただし、これらを書くのは面倒な場合があります。そのような場合は、セレクターを自動生成できます。

## 次の関数を作成: `createSelectors`

```typescript
import { StoreApi, UseBoundStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}
```

次のようなストアがある場合:

```typescript
interface BearState {
  bears: number
  increase: (by: number) => void
  increment: () => void
}

const useBearStoreBase = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  increment: () => set((state) => ({ bears: state.bears + 1 })),
}))
```

その関数をストアに適用します:

```typescript
const useBearStore = createSelectors(useBearStoreBase)
```

これでセレクターが自動生成され、直接アクセスできます:

```typescript
// プロパティを取得
const bears = useBearStore.use.bears()

// アクションを取得
const increment = useBearStore.use.increment()
```

## バニラストア

バニラストアを使用している場合は、次の`createSelectors`関数を使用します:

```typescript
import { StoreApi, useStore } from 'zustand'

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () =>
      useStore(_store, (s) => s[k as keyof typeof s])
  }

  return store
}
```

使用方法はReactストアと同じです。次のようなストアがある場合:

```typescript
import { createStore } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
  increment: () => void
}

const store = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  increment: () => set((state) => ({ bears: state.bears + 1 })),
}))
```

その関数をストアに適用します:

```typescript
const useBearStore = createSelectors(store)
```

これでセレクターが自動生成され、直接アクセスできます:

```typescript
// プロパティを取得
const bears = useBearStore.use.bears()

// アクションを取得
const increment = useBearStore.use.increment()
```

## ライブデモ

この動作例については、[Code Sandbox](https://codesandbox.io/s/zustand-auto-generate-selectors-forked-rl8v5e?file=/src/selectors.ts)を参照してください。

## サードパーティライブラリ

- [auto-zustand-selectors-hook](https://github.com/Albert-Gao/auto-zustand-selectors-hook)
- [react-hooks-global-state](https://github.com/dai-shi/react-hooks-global-state)
- [zustood](https://github.com/udecode/zustood)
- [@davstack/store](https://github.com/DawidWraga/davstack)
