# persist

ストアを永続化する方法

## 概要

`persist` ミドルウェアを使用すると、ページのリロードやアプリケーションの再起動をまたいでストアの状態を永続化できます。

```js
const nextStateCreatorFn = persist(stateCreatorFn, persistOptions)
```

## 目次

- [型](#types)
  - [シグネチャ](#signature)
  - [ミューテーター](#mutator)
- [リファレンス](#reference)
- [使用方法](#usage)
  - [状態を永続化する](#persisting-a-state)
  - [状態を部分的に永続化する](#persisting-a-state-partially)
  - [カスタムストレージで状態を永続化する](#persisting-a-state-with-custom-storage)
  - [バージョニングとマイグレーションを通じて状態を永続化する](#persisting-a-state-through-versioning-and-migrations)
  - [ネストされたオブジェクトを含む状態を永続化する](#persisting-a-state-with-nested-objects)
  - [状態を永続化して手動でハイドレートする](#persisting-a-state-and-hydrate-it-manually)
- [トラブルシューティング](#troubleshooting)

## 型

### シグネチャ

```ts
persist<T, U>(stateCreatorFn: StateCreator<T, [], []>, persistOptions?: PersistOptions<T, U>): StateCreator<T, [['zustand/persist', U]], []>
```

### ミューテーター

```ts
['zustand/persist', U]
```

## リファレンス

### `persist(stateCreatorFn)`

#### パラメータ

- `stateCreatorFn`: `set` 関数、`get` 関数、`store` を引数として受け取る関数。通常、公開したいメソッドを含むオブジェクトを返します。
- `persistOptions`: ストレージオプションを定義するオブジェクト。
  - `name`: ストレージ内のストアアイテムの一意の名前。
  - **オプション** `storage`: デフォルトは `createJSONStorage(() => localStorage)` です。
  - **オプション** `partialize`: 永続化する前に状態フィールドをフィルタリングする関数。
  - **オプション** `onRehydrateStorage`: 状態のリハイドレーション前後にカスタムロジックを実行できる関数、または関数を返す関数。
  - **オプション** `version`: 永続化された状態のバージョン番号。保存された状態のバージョンが一致しない場合、使用されません。
  - **オプション** `migrate`: バージョンの不一致が発生した場合に、永続化された状態をマイグレートする関数。
  - **オプション** `merge`: リハイドレーション時に永続化された状態と現在の状態をマージする際のカスタムロジックを実行する関数。デフォルトはシャローマージです。
  - **オプション** `skipHydration`: デフォルトは `false` です。`true` の場合、ミドルウェアは初期化時に自動的に状態をリハイドレートしません。この場合は `rehydrate` 関数を手動で使用します。これはサーバーサイドレンダリング（SSR）アプリケーションに便利です。

#### 戻り値

`persist` は state creator 関数を返します。

## 使用方法

### 状態を永続化する

このチュートリアルでは、vanillaストアと `persist` ミドルウェアを使用してシンプルな位置トラッカーを作成します。この例では、コンテナ内でマウスが移動するときの `position` を追跡し、その `position` をローカルストレージに保存するため、ページがリロードされても永続化されます。

まず、位置（`x` と `y` 座標を持つオブジェクト）を保持し、それを更新するアクションを持つvanillaストアを設定します。また、`persist` ミドルウェアを使用して位置を `localStorage` に保存します。

```ts
import { createStore } from 'zustand/vanilla'
import { persist } from 'zustand/middleware'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    { name: 'position-storage' },
  ),
)
```

次に、div内のマウスの動きを追跡し、新しい位置でストアを更新します。

```ts
const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})
```

最後に、ストアの変更をサブスクライブし、新しい位置でドットをレンダリングします。

```ts
function render() {
  const { position } = positionStore.getState()

  $dot.style.transform = `translate(${position.x}px, ${position.y}px)`
}

render()

positionStore.subscribe(render)
```

### 状態を部分的に永続化する

`partialize` オプションを使用すると、永続化する状態の一部を選択できます。

```ts
const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      partialize: (state) => ({ position: state.position }),
    },
  ),
)
```

### カスタムストレージで状態を永続化する

デフォルトでは、`persist` ミドルウェアは `localStorage` を使用しますが、カスタムストレージエンジンを提供できます。

```ts
import { createStore } from 'zustand/vanilla'
import { persist, createJSONStorage } from 'zustand/middleware'

const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
```

### バージョニングとマイグレーションを通じて状態を永続化する

`version` と `migrate` オプションを使用して、永続化された状態のバージョンを管理し、バージョンが変更されたときに状態をマイグレートできます。

```ts
const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // バージョン0からバージョン1への状態をマイグレート
        }

        return persistedState
      },
    },
  ),
)
```

### ネストされたオブジェクトを含む状態を永続化する

ネストされたオブジェクトを含む状態を永続化する場合、`merge` オプションを使用してカスタムマージロジックを提供できます。

```ts
const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      merge: (persistedState, currentState) => {
        return {
          ...currentState,
          ...persistedState,
        }
      },
    },
  ),
)
```

### 状態を永続化して手動でハイドレートする

`skipHydration` オプションを `true` に設定すると、自動ハイドレーションをスキップし、手動で状態をハイドレートできます。

```ts
const positionStore = createStore<PositionStore>()(
  persist(
    (set) => ({
      position: { x: 0, y: 0 },
      setPosition: (position) => set({ position }),
    }),
    {
      name: 'position-storage',
      skipHydration: true,
    },
  ),
)

// 後で手動でハイドレート
positionStore.persist.rehydrate()
```

## トラブルシューティング

一般的な問題と解決策については、公式ドキュメントを参照してください。
