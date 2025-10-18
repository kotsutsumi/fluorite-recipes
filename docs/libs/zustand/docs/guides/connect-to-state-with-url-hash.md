---
title: URLで状態に接続する
nav: 11
---

## URL ハッシュで状態を接続する

ストアの状態をURLハッシュに接続したい場合は、独自のハッシュストレージを作成できます。

```ts
import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    const storedValue = searchParams.get(key) ?? ''
    return JSON.parse(storedValue)
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.set(key, JSON.stringify(newValue))
    location.hash = searchParams.toString()
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(location.hash.slice(1))
    searchParams.delete(key)
    location.hash = searchParams.toString()
  },
}

export const useBoundStore = create(
  persist(
    (set, get) => ({
      fishes: 0,
      addAFish: () => set({ fishes: get().fishes + 1 }),
    }),
    {
      name: 'food-storage', // unique name
      storage: createJSONStorage(() => hashStorage),
    },
  ),
)
```

### CodeSandbox デモ

https://codesandbox.io/s/zustand-state-with-url-hash-demo-f29b88?file=/src/store/index.ts

## URLパラメータで状態を永続化して接続する（例：URLクエリパラメータ）

状態を条件付きでURLに接続したい場合があります。
この例では、`localstorage`のような別の永続化実装と同期を保ちながら、URLクエリパラメータを使用する方法を示します。

URLパラメータを常に設定したい場合は、`getUrlSearch()`の条件チェックを削除できます。

以下の実装では、関連する状態が変更されると、リフレッシュせずにURLをその場で更新します。

```ts
import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

const getUrlSearch = () => {
  return window.location.search.slice(1)
}

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    // Check URL first
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch())
      const storedValue = searchParams.get(key)
      return JSON.parse(storedValue as string)
    } else {
      // Otherwise, we should load from localstorage or alternative storage
      return JSON.parse(localStorage.getItem(key) as string)
    }
  },
  setItem: (key, newValue): void => {
    // Check if query params exist at all, can remove check if always want to set URL
    if (getUrlSearch()) {
      const searchParams = new URLSearchParams(getUrlSearch())
      searchParams.set(key, JSON.stringify(newValue))
      window.history.replaceState(null, '', `?${searchParams.toString()}`)
    }

    localStorage.setItem(key, JSON.stringify(newValue))
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(getUrlSearch())
    searchParams.delete(key)
    window.location.search = searchParams.toString()
  },
}

type LocalAndUrlStore = {
  typesOfFish: string[]
  addTypeOfFish: (fishType: string) => void
  numberOfBears: number
  setNumberOfBears: (newNumber: number) => void
}

const storageOptions = {
  name: 'fishAndBearsStore',
  storage: createJSONStorage<LocalAndUrlStore>(() => persistentStorage),
}

const useLocalAndUrlStore = create(
  persist<LocalAndUrlStore>(
    (set) => ({
      typesOfFish: [],
      addTypeOfFish: (fishType) =>
        set((state) => ({ typesOfFish: [...state.typesOfFish, fishType] })),

      numberOfBears: 0,
      setNumberOfBears: (numberOfBears) => set(() => ({ numberOfBears })),
    }),
    storageOptions,
  ),
)

export default useLocalAndUrlStore
```

コンポーネントからURLを生成する場合は、buildShareableUrlを呼び出すことができます：

```ts
const buildURLSuffix = (params, version = 0) => {
  const searchParams = new URLSearchParams()

  const zustandStoreParams = {
    state: {
      typesOfFish: params.typesOfFish,
      numberOfBears: params.numberOfBears,
    },
    version: version, // version is here because that is included with how Zustand sets the state
  }

  // The URL param key should match the name of the store, as specified as in storageOptions above
  searchParams.set('fishAndBearsStore', JSON.stringify(zustandStoreParams))
  return searchParams.toString()
}

export const buildShareableUrl = (params, version) => {
  return `${window.location.origin}?${buildURLSuffix(params, version)}`
}
```

生成されるURLは次のようになります（可読性のため、エンコードなし）：

`https://localhost/search?fishAndBearsStore={"state":{"typesOfFish":["tilapia","salmon"],"numberOfBears":15},"version":0}}`
