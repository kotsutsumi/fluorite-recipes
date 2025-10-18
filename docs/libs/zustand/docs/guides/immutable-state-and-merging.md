---
title: 不変なstateとマージ
nav: 3
---

Reactの`useState`と同様に、stateを不変的に更新する必要があります。

典型的な例は次のとおりです:

```jsx
import { create } from 'zustand'

const useCountStore = create((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}))
```

`set`関数は、ストア内のstateを更新するためのものです。
stateは不変であるため、本来は次のようになるはずでした:

```js
set((state) => ({ ...state, count: state.count + 1 }))
```

しかし、これは一般的なパターンであるため、`set`は実際にstateをマージし、
`...state`の部分をスキップできます:

```js
set((state) => ({ count: state.count + 1 }))
```

## ネストされたオブジェクト

`set`関数は1つのレベルでのみstateをマージします。
ネストされたオブジェクトがある場合は、明示的にマージする必要があります。次のようにスプレッド演算子パターンを使用します:

```jsx
import { create } from 'zustand'

const useCountStore = create((set) => ({
  nested: { count: 0 },
  inc: () =>
    set((state) => ({
      nested: { ...state.nested, count: state.nested.count + 1 },
    })),
}))
```

複雑なユースケースについては、不変な更新に役立つライブラリの使用を検討してください。
[ネストされたstateオブジェクト値の更新](./updating-state.md#deeply-nested-object)を参照してください。

## replaceフラグ

マージ動作を無効にするには、次のように`set`に`replace`ブール値を指定できます:

```js
set((state) => newState, true)
```
