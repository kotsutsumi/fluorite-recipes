# 比較

類似ライブラリに対するZustandの位置づけ

Zustandは、React向けの多くの状態管理ライブラリの1つです。このページでは、Redux、Valtio、Jotai、Recoilを含む、これらのライブラリとZustandを比較して説明します。

各ライブラリには独自の長所と短所があり、それぞれの主要な違いと類似点を比較します。

## Redux

### 状態モデル（vs Redux）

概念的に、ZustandとReduxは非常に似ており、どちらもイミュータブルな状態モデルに基づいています。ただし、Reduxではアプリをコンテキストプロバイダーでラップする必要がありますが、Zustandでは必要ありません。

**Zustand**

```typescript
import { create } from 'zustand'

type State = {
  count: number
}

type Actions = {
  increment: (qty: number) => void
  decrement: (qty: number) => void
}

const useCountStore = create<State & Actions>((set) => ({
  count: 0,
  increment: (qty: number) => set((state) => ({ count: state.count + qty })),
  decrement: (qty: number) => set((state) => ({ count: state.count - qty })),
}))
```

**Redux**

```typescript
import { createStore } from 'redux'
import { useSelector, useDispatch } from 'react-redux'

type State = {
  count: number
}

type Action = {
  type: 'increment' | 'decrement'
  qty: number
}

const countReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.qty }
    case 'decrement':
      return { count: state.count - action.qty }
    default:
      return state
  }
}

const countStore = createStore(countReducer)
```

**Redux Toolkit**

```typescript
import { createSlice, configureStore } from '@reduxjs/toolkit'

const countSlice = createSlice({
  name: 'count',
  initialState: { value: 0 },
  reducers: {
    incremented: (state, action) => {
      state.value += action.payload
    },
    decremented: (state, action) => {
      state.value -= action.payload
    },
  },
})

const countStore = configureStore({ reducer: countSlice.reducer })
```

### レンダリング最適化（vs Redux）

アプリ内のレンダリング最適化に関しては、ZustandとReduxの間にアプローチの大きな違いはありません。両方のライブラリで、セレクターを使用して手動でレンダリング最適化を適用することが推奨されています。

**Zustand**

```typescript
const Component = () => {
  const count = useCountStore((state) => state.count)
  const increment = useCountStore((state) => state.increment)
  const decrement = useCountStore((state) => state.decrement)
  // ...
}
```

**Redux**

```typescript
import { useSelector, useDispatch } from 'react-redux'

const Component = () => {
  const count = useSelector((state) => state.count.value)
  const dispatch = useDispatch()
  // ...
}
```

## Valtio

### 状態モデル（vs Valtio）

ZustandとValtioは、状態管理に対して根本的に異なるアプローチを取っています。Zustandはイミュータブルな状態モデルに基づいていますが、Valtioはミュータブルな状態モデルに基づいています。

**Zustand**

```typescript
import { create } from 'zustand'

type State = {
  obj: { count: number }
}

const store = create<State>(() => ({ obj: { count: 0 } }))

store.setState((prev) => ({ obj: { count: prev.obj.count + 1 } }))
```

**Valtio**

```typescript
import { proxy } from 'valtio'

const state = proxy({ obj: { count: 0 } })

state.obj.count += 1
```

### レンダリング最適化（vs Valtio）

ZustandとValtioのもう1つの違いは、Valtioがプロパティアクセスを通じてレンダリング最適化を行うことです。一方、Zustandでは、セレクターを使用して手動でレンダリング最適化を適用することが推奨されています。

**Zustand**

```typescript
const Component = () => {
  const obj = useStore((state) => state.obj)
  // ...
}
```

**Valtio**

```typescript
import { useSnapshot } from 'valtio'

const Component = () => {
  const { obj } = useSnapshot(state)
  // ...
}
```

## Jotai

### 状態モデル（vs Jotai）

ZustandとJotaiの違いは、Zustandが単一のストアであるのに対し、Jotaiは組み合わせることができるプリミティブなアトムで構成されていることです。

**Zustand**

```typescript
import { create } from 'zustand'

type State = {
  count: number
}

type Actions = {
  updateCount: (
    countCallback: (count: State['count']) => State['count'],
  ) => void
}

const useCountStore = create<State & Actions>((set) => ({
  count: 0,
  updateCount: (countCallback) =>
    set((state) => ({ count: countCallback(state.count) })),
}))
```

**Jotai**

```typescript
import { atom } from 'jotai'

const countAtom = atom<number>(0)
```

### レンダリング最適化（vs Jotai）

Jotaiはアトムの依存関係を通じてレンダリング最適化を実現します。一方、Zustandでは、セレクターを使用して手動でレンダリング最適化を適用することが推奨されています。

**Zustand**

```typescript
const Component = () => {
  const count = useCountStore((state) => state.count)
  const updateCount = useCountStore((state) => state.updateCount)
  // ...
}
```

**Jotai**

```typescript
import { useAtom } from 'jotai'

const Component = () => {
  const [count, updateCount] = useAtom(countAtom)
  // ...
}
```

## Recoil

### 状態モデル（vs Recoil）

Zustandと比較したRecoilの違いは、Jotaiとの比較に似ています。Recoilはアトムのオブジェクト参照IDではなく、アトムの文字列キーに依存しています。また、Recoilでは、アプリをコンテキストプロバイダーでラップする必要があります。

**Zustand**

```typescript
import { create } from 'zustand'

type State = {
  count: number
}

type Actions = {
  setCount: (countCallback: (count: State['count']) => State['count']) => void
}

const useCountStore = create<State & Actions>((set) => ({
  count: 0,
  setCount: (countCallback) =>
    set((state) => ({ count: countCallback(state.count) })),
}))
```

**Recoil**

```typescript
import { atom } from 'recoil'

const count = atom({
  key: 'count',
  default: 0,
})
```

### レンダリング最適化（vs Recoil）

Jotaiと同様に、Recoilはアトムの依存関係を通じてレンダリング最適化を実現します。一方、Zustandでは、セレクターを使用して手動でレンダリング最適化を適用することが推奨されています。

**Zustand**

```typescript
const Component = () => {
  const count = useCountStore((state) => state.count)
  const setCount = useCountStore((state) => state.setCount)
  // ...
}
```

**Recoil**

```typescript
import { useRecoilState } from 'recoil'

const Component = () => {
  const [count, setCount] = useRecoilState(countState)
  // ...
}
```
