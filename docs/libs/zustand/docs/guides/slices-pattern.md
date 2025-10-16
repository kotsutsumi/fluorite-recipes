---
title: スライスパターン
nav: 14
---

## ストアを小さなストアに分割する

より多くの機能を追加するにつれて、ストアはどんどん大きくなり、保守が困難になる可能性があります。

モジュール性を実現するために、メインストアを小さな個別のストアに分割できます。これはZustandで簡単に実現できます！

最初の個別ストア：

```js
export const createFishSlice = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})
```

別の個別ストア：

```js
export const createBearSlice = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})
```

これで、両方のストアを**1つの境界付きストア**に結合できます：

```js
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'

export const useBoundStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
}))
```

### Reactコンポーネントでの使用方法

```jsx
import { useBoundStore } from './stores/useBoundStore'

function App() {
  const bears = useBoundStore((state) => state.bears)
  const fishes = useBoundStore((state) => state.fishes)
  const addBear = useBoundStore((state) => state.addBear)
  return (
    <div>
      <h2>Number of bears: {bears}</h2>
      <h2>Number of fishes: {fishes}</h2>
      <button onClick={() => addBear()}>Add a bear</button>
    </div>
  )
}

export default App
```

### 複数のストアを更新する

1つの関数で複数のストアを同時に更新できます。

```js
export const createBearFishSlice = (set, get) => ({
  addBearAndFish: () => {
    get().addBear()
    get().addFish()
  },
})
```

すべてのストアを結合する方法は以前と同じです。

```js
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'
import { createBearFishSlice } from './createBearFishSlice'

export const useBoundStore = create((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createBearFishSlice(...a),
}))
```

## ミドルウェアを追加する

結合されたストアにミドルウェアを追加する方法は、他の通常のストアと同じです。

`useBoundStore`に`persist`ミドルウェアを追加する：

```js
import { create } from 'zustand'
import { createBearSlice } from './bearSlice'
import { createFishSlice } from './fishSlice'
import { persist } from 'zustand/middleware'

export const useBoundStore = create(
  persist(
    (...a) => ({
      ...createBearSlice(...a),
      ...createFishSlice(...a),
    }),
    { name: 'bound-store' },
  ),
)
```

ミドルウェアは結合されたストアにのみ適用する必要があることに注意してください。個別のスライス内でミドルウェアを適用すると、予期しない問題が発生する可能性があります。

## TypeScriptでの使用方法

ZustandでTypeScriptとスライスパターンを使用する方法の詳細なガイドは、[こちら](./typescript.md#slices-pattern)をご覧ください。
