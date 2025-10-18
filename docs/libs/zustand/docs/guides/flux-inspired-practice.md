---
title: Fluxにインスパイアされたプラクティス
nav: 4
---

Zustandは独断的でないライブラリですが、いくつかのパターンを推奨しています。
これらは、もともと[Flux](https://github.com/facebookarchive/flux)で見られ、最近では[Redux](https://redux.js.org/understanding/thinking-in-redux/three-principles)で見られるプラクティスにインスパイアされているため、他のライブラリから来た人は馴染みがあるはずです。

しかし、Zustandはいくつかの基本的な点で異なるため、
用語の一部は他のライブラリと完全には一致しない場合があります。

## 推奨パターン

### 単一のストア

アプリケーションのグローバルstateは、単一のZustandストアに配置する必要があります。

大規模なアプリケーションがある場合、Zustandは[ストアをスライスに分割する](./slices-pattern.md)ことをサポートしています。

### `set` / `setState`を使用してストアを更新する

常に`set`（または`setState`）を使用してストアへの更新を実行します。
`set`（および`setState`）は、記述された更新が正しくマージされ、リスナーに適切に通知されることを保証します。

### ストアアクションを同じ場所に配置する

Zustandでは、他のFluxライブラリで見られるディスパッチされたアクションやリデューサーを使用せずにstateを更新できます。
これらのストアアクションは、以下に示すようにストアに直接追加できます。

オプションで、`setState`を使用して、[ストアの外部に配置する](./practice-with-no-store-actions.md)こともできます。

```js
const useBoundStore = create((set) => ({
  storeSliceA: ...,
  storeSliceB: ...,
  storeSliceC: ...,
  updateX: () => set(...),
  updateY: () => set(...),
}))
```

## Redux風のパターン

Redux風のリデューサーなしでは生きられない場合は、ストアのルートレベルで`dispatch`関数を定義できます:

```typescript
const types = { increase: 'INCREASE', decrease: 'DECREASE' }

const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case types.increase:
      return { grumpiness: state.grumpiness + by }
    case types.decrease:
      return { grumpiness: state.grumpiness - by }
  }
}

const useGrumpyStore = create((set) => ({
  grumpiness: 0,
  dispatch: (args) => set((state) => reducer(state, args)),
}))

const dispatch = useGrumpyStore((state) => state.dispatch)
dispatch({ type: types.increase, by: 2 })
```

redux-middlewareを使用することもできます。これは、メインリデューサーを接続し、初期stateを設定し、dispatch関数をstate自体とvanilla APIに追加します。

```typescript
import { redux } from 'zustand/middleware'

const useReduxStore = create(redux(reducer, initialState))
```

ストアを更新する別の方法は、state関数をラップする関数を使用することです。これらは、アクションの副作用も処理できます。例えば、HTTPコールなどです。非リアクティブな方法でZustandを使用するには、[readmeを参照してください](https://github.com/pmndrs/zustand#readingwriting-state-and-reacting-to-changes-outside-of-components)。
