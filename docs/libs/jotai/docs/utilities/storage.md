# Storage

## atomWithStorage

**Ref**: https://github.com/pmndrs/jotai/issues/394

```ts
function atomWithStorage<Value>(
  key: string,
  initialValue: Value,
  storage?: Storage,
  options?: {
    getOnInit?: boolean
    unstable_getStorageValue?: (
      storage: Storage,
      key: string,
      initialValue: Value,
    ) => Value
  },
): WritableAtom<Value, [Value | typeof RESET], void>
```

`atomWithStorage`関数は、`localStorage`、`sessionStorage`、`AsyncStorage`、または独自のカスタム実装を使用して、atomの値を永続化するために使用できるprimitive atomを作成します。

サーバーサイドレンダリングや、Next.jsのようなフレームワークで使用する場合、`initialValue`を使用してatom値を最初に設定します。`storage`が定義されていると、ハイドレーション後にイベントリスナーと`getItem`を使用してatom値を更新するのに役立ちます。サーバー側でシリアライズされるatomの値を設定したい場合は、代わりに`unstable_getStorageValue`オプションを使用できます。

### パラメータ

**key** (必須): storageに格納される値にアクセスするための一意の文字列

**initialValue** (必須): atomの初期値

**storage** (オプション): 使用するstorageのオブジェクト。オブジェクトには以下のメソッドが必要です:

- `getItem` (必須): `storage`から`key`の値を取得するために使用します
- `setItem` (必須): `storage`の`key`に値を保存するために使用します
- `removeItem` (必須): `storage`から`key`とその値を削除するために使用します
- `subscribe` (オプション): `storage`の`key`の値が外部で変更されたときに通知を受けるために使用します（例：クロスタブ同期）

**options.getOnInit** (オプション、サーバーサイドレンダリングには推奨されません): 初期化時に`storage.getItem`を呼び出すかどうかを示すブール値

**options.unstable_getStorageValue** (オプション、サーバーサイドレンダリングに推奨): `storage.getItem`をラップするカスタム関数。サーバー側で同期的にシリアライズされるatomの値を定義できます。

### `localStorage`の使用例

```jsx
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const darkModeAtom = atomWithStorage('darkMode', false)

const Page = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)

  return (
    <>
      <h1>Welcome to {darkMode ? 'dark' : 'light'} mode!</h1>
      <button onClick={() => setDarkMode(!darkMode)}>toggle theme</button>
    </>
  )
}
```

### 複数のカスタムatomの使用例

```jsx
import { useAtom } from 'jotai'
import { atomWithStorage, RESET } from 'jotai/utils'

const firstNameAtom = atomWithStorage('firstName', 'John')
const lastNameAtom = atomWithStorage('lastName', 'Doe')
const ageAtom = atomWithStorage('age', 18)

const fullNameAtom = atom(
  (get) => `${get(firstNameAtom)} ${get(lastNameAtom)}`,
  (_get, set, newFullName: string | typeof RESET) => {
    if (newFullName === RESET) {
      set(firstNameAtom, RESET)
      set(lastNameAtom, RESET)
    } else {
      const [newFirstName, newLastName] = newFullName.split(' ')
      set(firstNameAtom, newFirstName)
      set(lastNameAtom, newLastName)
    }
  },
)

const derivedDataAtom = atom((get) => {
  return { fullName: get(fullNameAtom), age: get(ageAtom) }
})

const Profile = () => {
  const [data, setData] = useAtom(derivedDataAtom)
  const resetData = useResetAtom(fullNameAtom)

  return (
    <>
      <h1>
        Welcome, {data.fullName} ({data.age})
      </h1>
      <button onClick={() => setData({ fullName: 'Jane Doe', age: 21 })}>
        Set data
      </button>
      <button onClick={resetData}>Reset data</button>
    </>
  )
}
```

### React Nativeでの使用例

**React Nativeでの使用には`getOnInit: true`が必要です。**

```jsx
import { useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'

const storage = createJSONStorage(() => AsyncStorage)
const content = {} // コンテンツ
const darkModeAtom = atomWithStorage('darkMode', false, storage, {
  getOnInit: true,
})

const Page = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom)
  // ダークモードのレンダリングロジック
}
```

### `sessionStorage`の使用例

```jsx
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const someAtom = atomWithStorage(
  'some-key',
  { foo: 'bar' },
  createJSONStorage(() => sessionStorage),
)
```

### JSONのシリアライズとデシリアライズのカスタマイズ

```jsx
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { atomWithHash } from 'jotai-location'

const dateAtom = atomWithStorage(
  'date',
  new Date(),
  createJSONStorage(() => sessionStorage, {
    replacer: (key, value) => {
      if (value instanceof Date) {
        return value.toISOString()
      }
      return value
    },
    reviver: (key, value) => {
      if (key === '' && typeof value === 'string') {
        return new Date(value)
      }
      return value
    },
  }),
)

const dateAtom2 = atomWithHash('date', new Date(), {
  serialize: (date) => date.toISOString(),
  deserialize: (str) => new Date(str),
})
```

### カスタムstorageの使用例

```jsx
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const storage = {
  getItem: (key) => {
    console.log('getItem', key)
    return null
  },
  setItem: (key, newValue) => {
    console.log('setItem', key, newValue)
  },
  removeItem: (key) => {
    console.log('removeItem', key)
  },
}

const content = {}
const storedAtom = atomWithStorage('stored', content, storage)
```

## createJSONStorage

すべてのstorageタイプのデフォルトのJSONベースのstorageを作成するために使用するユーティリティ関数です。

```ts
function createJSONStorage<Value>(
  getStorage: () => Storage = () => localStorage,
  options?: {
    replacer?: (key: string, value: unknown) => unknown
    reviver?: (key: string, value: unknown) => unknown
  },
): {
  getItem: (key: string, initialValue: Value) => Value
  setItem: (key: string, value: Value) => void
  removeItem: (key: string) => void
}
```

### Zodを使用したストレージ値の検証

```jsx
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { z } from 'zod'

const myNumberSchema = z.number().int().nonnegative()

const storedNumberAtom = atomWithStorage('myNumber', 0, {
  ...createJSONStorage(() => localStorage),
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key)
    try {
      return myNumberSchema.parse(JSON.parse(storedValue ?? ''))
    } catch {
      return initialValue
    }
  },
})
```

### ストレージ値の削除

値が`null`の場合に削除するカスタムstorageの実装例:

```jsx
import { atomWithStorage, createJSONStorage, RESET } from 'jotai/utils'

const storage = createJSONStorage(() => localStorage)

const isNullable = (v) => v === null

const nullableStorage = {
  ...storage,
  setItem: (key, newValue) => {
    if (isNullable(newValue) || newValue === RESET) {
      storage.removeItem(key)
    } else {
      storage.setItem(key, newValue)
    }
  },
}

const nullableAtom = atomWithStorage('nullable', null, nullableStorage)
```

### サーバーサイドレンダリングでの使用

```jsx
import { atomWithStorage } from 'jotai/utils'

const isSSR = typeof window === 'undefined'

const storage = {
  getItem: (key) => {
    if (isSSR) {
      return localStorage.getItem(key)
    }
    return null
  },
  setItem: (key, value) => {
    if (!isSSR) {
      localStorage.setItem(key, value)
    }
  },
  removeItem: (key) => {
    if (!isSSR) {
      localStorage.removeItem(key)
    }
  },
}

const content = {}
const storedAtom = atomWithStorage('stored', content, storage)
```

## その他

### atomWithHash

`atomWithHash`はURL hashと同期します。詳細は[jotai-location](https://jotai.org/docs/extensions/location)を参照してください。
