# atomWithToggleAndStorage

> `atomWithToggleAndStorage`は`atomWithToggle`に似ていますが、[`atomWithStorage`](../utilities/storage.mdx)を使用して、変更されるたびに指定されたストレージに状態を永続化します。

ソースコードは次のとおりです:

```ts
import { WritableAtom, atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export function atomWithToggleAndStorage(
  key: string,
  initialValue?: boolean,
  storage?: any,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atomWithStorage(key, initialValue, storage)
  const derivedAtom = atom(
    (get) => get(anAtom),
    (get, set, nextValue?: boolean) => {
      const update = nextValue ?? !get(anAtom)
      void set(anAtom, update)
    },
  )

  return derivedAtom as WritableAtom<boolean, [boolean?], void>
}
```

そして、使用方法は次のとおりです:

```js
import { atomWithToggleAndStorage } from 'XXX'

// 初期値がfalseに設定され、「isActive」キーの下でlocalStorageに保存されます
const isActiveAtom = atomWithToggleAndStorage('isActive')
```

コンポーネントでの使用方法も`atomWithToggle`と同じです。
