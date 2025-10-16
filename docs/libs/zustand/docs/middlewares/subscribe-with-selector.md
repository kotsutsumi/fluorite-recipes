# subscribeWithSelector

ストアの細かい更新をサブスクライブする方法

## 概要
`subscribeWithSelector` ミドルウェアを使用すると、現在の状態に基づいて特定のデータをサブスクライブできます。

## 型

### シグネチャ
```typescript
subscribeWithSelector<T>(
  stateCreatorFn: StateCreator<T, [], []>
): StateCreator<T, [['zustand/subscribeWithSelector', never]], []>
```

### ミューテーター
```typescript
['zustand/subscribeWithSelector', never]
```

## 使用例

```typescript
import { createStore } from 'zustand/vanilla'
import { subscribeWithSelector } from 'zustand/middleware'

type PositionStoreState = {
  position: { x: number; y: number }
}

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

const positionStore = createStore<PositionStore>()(
  subscribeWithSelector((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
)

// position全体の更新をサブスクライブ
positionStore.subscribe((state) => state.position, render)

// 特定のx位置の更新をサブスクライブ
positionStore.subscribe((state) => state.position.x, logger)
```

## 主な機能
- ストアの状態の特定の部分に対する細かいサブスクリプションが可能
- ネストされた状態のプロパティをサブスクライブ可能
- 柔軟な状態管理を提供

## トラブルシューティング
TBD（To Be Determined）
