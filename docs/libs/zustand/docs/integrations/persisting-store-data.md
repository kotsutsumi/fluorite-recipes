# ストアデータの永続化

Persistミドルウェアを使用すると、Zustandの状態をストレージ（例：`localStorage`、`AsyncStorage`、`IndexedDB`など）に保存し、データを永続化できます。

このミドルウェアは、`localStorage`のような同期ストレージと`AsyncStorage`のような非同期ストレージの両方をサポートしていますが、非同期ストレージを使用する場合はコストが伴います。詳細については、[ハイドレーションと非同期ストレージ](#hydration-and-asynchronous-storages)を参照してください。

## シンプルな例

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBearStore = create()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // ストレージ内のアイテムの名前（一意である必要があります）
      storage: createJSONStorage(() => sessionStorage), // （オプション）デフォルトでは 'localStorage' が使用されます
    },
  ),
)
```

## TypeScriptのシンプルな例

```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type BearStore = {
  bears: number
  addABear: () => void
}

export const useBearStore = create<BearStore>()(
  persist(
    (set, get) => ({
      bears: 0,
      addABear: () => set({ bears: get().bears + 1 }),
    }),
    {
      name: 'food-storage', // ストレージ内のアイテムの名前（一意である必要があります）
      storage: createJSONStorage(() => sessionStorage), // （オプション）デフォルトでは 'localStorage' が使用されます
    },
  ),
)
```

## オプション

### `name`

これは唯一の必須オプションです。指定された名前は、ストレージ内のZustand状態を保存するために使用されるキーになるため、一意である必要があります。

### `storage`

> 型: `() => StateStorage`

`StateStorage`は以下の方法でインポートできます：

```ts
import { StateStorage } from 'zustand/middleware'
```

> デフォルト: `createJSONStorage(() => localStorage)`

独自のストレージを使用できます。使用したいストレージを返す関数を渡すだけです。`StateStorage`インターフェースに準拠した`storage`オブジェクトを作成するには、[`createJSONStorage`](#createjsonstorage)ヘルパー関数を使用することをお勧めします。

例：

```ts
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      // ...
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
```

### `partialize`

> 型: `(state: Object) => Object`

> デフォルト: `(state) => state`

ストレージに保存される状態のフィールドの一部を選択できます。

次のように複数のフィールドを除外できます：

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      foo: 0,
      bar: 1,
    }),
    {
      // ...
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['foo'].includes(key)),
        ),
    },
  ),
)
```

または、次のように特定のフィールドのみを含めることもできます：

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      foo: 0,
      bar: 1,
    }),
    {
      // ...
      partialize: (state) => ({ foo: state.foo }),
    },
  ),
)
```

### `onRehydrateStorage`

> 型: `(state: Object) => ((state?: Object, error?: Error) => void) | void`

このオプションを使用すると、ハイドレーションプロセスにフックできます。ハイドレーション開始時に呼び出される関数を渡すことができ、この関数はハイドレーション完了時またはエラー発生時に呼び出される別の関数を返すことができます。

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      // ...
      onRehydrateStorage: (state) => {
        console.log('hydration starts')

        // オプション
        return (state, error) => {
          if (error) {
            console.log('an error happened during hydration', error)
          } else {
            console.log('hydration finished')
          }
        }
      },
    },
  ),
)
```

### `version`

> 型: `number`

> デフォルト: `0`

永続化されたストアのバージョン番号を指定できます。バージョン番号が保存されている値と一致しない場合、永続化されたストアは使用されません。これは、ストアの構造を変更する際に役立ちます。

### `migrate`

> 型: `(persistedState: Object, version: number) => Object | Promise<Object>`

古いバージョンから新しいバージョンへの移行を処理するために使用できます。`migrate`関数は、永続化された状態とバージョン番号を受け取り、新しいバージョンと互換性のある状態を返します。

```ts
export const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      // ...
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // version 0の場合、構造を変換
          persistedState.newField = 'defaultValue'
        }

        return persistedState
      },
    },
  ),
)
```

### `merge`

> 型: `(persistedState: Object, currentState: Object) => Object`

> デフォルト: `(persistedState, currentState) => ({ ...currentState, ...persistedState })`

永続化された値をストアの現在の状態とマージする方法をカスタマイズできます。デフォルトでは、永続化された値で現在の状態を浅くマージします。

深いマージが必要な場合は、ユーティリティライブラリを使用できます：

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import merge from 'lodash.merge'

export const useBoundStore = create(
  persist(
    (set, get) => ({
      // ...
    }),
    {
      // ...
      merge: (persistedState, currentState) =>
        merge(currentState, persistedState),
    },
  ),
)
```

## createJSONStorage

`createJSONStorage`は、`JSON.stringify`と`JSON.parse`を使用してストレージオブジェクトを作成するヘルパー関数です。

```ts
import { createJSONStorage } from 'zustand/middleware'
```

使用方法：

```ts
storage: createJSONStorage(() => localStorage)
```

カスタムシリアライゼーションを提供することもできます：

```ts
storage: createJSONStorage(() => localStorage, {
  reviver: (key, value) => {
    if (value && typeof value === 'object' && 'type' in value) {
      if (value.type === 'date') {
        return new Date(value.value)
      }
    }
    return value
  },
  replacer: (key, value) => {
    if (value instanceof Date) {
      return { type: 'date', value: value.toISOString() }
    }
    return value
  },
})
```

## ハイドレーションと非同期ストレージ

非同期ストレージを使用する場合、コンポーネントがマウントされたときにストアがまだハイドレートされていない可能性があります。この場合、コンポーネントは初期状態でレンダリングされ、ハイドレーションが完了した後に再レンダリングされます。

この動作を回避したい場合は、`persist`ミドルウェアの`hasHydrated`関数を使用してストアがハイドレートされているかどうかを確認できます：

```tsx
const hasHydrated = useBoundStore.persist.hasHydrated()

if (!hasHydrated) {
  return <div>Loading...</div>
}

// ハイドレート完了後のレンダリング
```

または、サブスクリプションアプローチを使用することもできます：

```tsx
import { useEffect, useState } from 'react'

const [hydrated, setHydrated] = useState(false)

useEffect(() => {
  const unsubHydrate = useBoundStore.persist.onHydrate(() => {
    setHydrated(false)
  })

  const unsubFinishHydration = useBoundStore.persist.onFinishHydration(() => {
    setHydrated(true)
  })

  setHydrated(useBoundStore.persist.hasHydrated())

  return () => {
    unsubHydrate()
    unsubFinishHydration()
  }
}, [])

if (!hydrated) {
  return <div>Loading...</div>
}

// ハイドレート完了後のレンダリング
```

## API

永続化ミドルウェアは、ストアに追加のAPIメソッドを追加します：

- `persist.hasHydrated()`: ストアがハイドレートされているかどうかを確認
- `persist.rehydrate()`: 強制的に再ハイドレート
- `persist.clearStorage()`: ストレージをクリア
- `persist.onHydrate(fn)`: ハイドレーション開始時のコールバック
- `persist.onFinishHydration(fn)`: ハイドレーション完了時のコールバック

これらのメソッドを使用して、永続化の動作をより細かく制御できます。
