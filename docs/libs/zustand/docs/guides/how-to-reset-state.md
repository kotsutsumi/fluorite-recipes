---
title: 状態をリセットする方法
nav: 12
---

次のパターンを使用して、状態を初期値にリセットできます。

```ts
const useSomeStore = create<State & Actions>()((set, get, store) => ({
  // your code here
  reset: () => {
    set(store.getInitialState())
  },
}))
```

複数のストアを一度にリセットする

```ts
import type { StateCreator } from 'zustand'
import { create: actualCreate } from 'zustand'

const storeResetFns = new Set<() => void>()

const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => {
    resetFn()
  })
}

export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = actualCreate(stateCreator)
    storeResetFns.add(() => {
      store.setState(store.getInitialState(), true)
    })
    return store
  }
}) as typeof actualCreate
```

## CodeSandbox デモ

- Basic: https://stackblitz.com/edit/zustand-how-to-reset-state-basic
- Advanced: https://stackblitz.com/edit/zustand-how-to-reset-state-advanced
