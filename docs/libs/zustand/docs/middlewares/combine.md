# combine ミドルウェア

## 概要
`combine` ミドルウェアは、初期状態とstate creator関数をマージすることで、まとまりのある状態を作成するのに役立ちます。型を自動的に推論するため、明示的な型定義が不要になります。

## シグネチャ
```typescript
combine<T, U>(
  initialState: T,
  additionalStateCreatorFn: StateCreator<T, [], [], U>
): StateCreator<Omit<T, keyof U> & U, [], []>
```

## パラメータ
- `initialState`: 任意の型の初期状態値（関数を除く）
- `additionalStateCreatorFn`: `set`、`get`、`store` 引数を受け取る関数で、通常は公開するメソッドを含むオブジェクトを返します

## 使用例
```typescript
import { createStore } from 'zustand/vanilla'
import { combine } from 'zustand/middleware'

const positionStore = createStore(
  combine({ position: { x: 0, y: 0 } }, (set) => ({
    setPosition: (position) => set({ position }),
  }))
)
```

## 主なメリット
- 型を自動的に推論
- 状態管理をより簡単に
- ミドルウェア使用時にカリー化された `create` と `createStore` が不要に

## ヒント
「これにより、ミドルウェアの使用でカリー化された `create` と `createStore` を不要にすることで、状態管理がより簡単で効率的になります。」
