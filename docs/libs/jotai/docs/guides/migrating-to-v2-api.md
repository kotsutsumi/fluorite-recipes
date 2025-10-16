# v2 API 移行ガイド

RFC: [https://github.com/pmndrs/jotai/discussions/1514](https://github.com/pmndrs/jotai/discussions/1514)

Jotai v1は2022年6月にリリースされ、さまざまなフィードバックがありました。Reactもpromiseの第一級サポートを提案しています。Jotai v2は新しいAPIを持つことになります。

残念ながら、新機能とともにいくつかの破壊的変更があります。

### 新機能

#### Vanillaライブラリ

Jotaiは、vanilla（非React）関数とReact関数を別々に提供します。これらは`jotai/vanilla`のような代替エントリーポイントから提供されます。

#### Store API

Jotaiはstoreインターフェースを公開しているため、atom値を直接操作できます。

```javascript
import { createStore } from 'jotai' // または 'jotai/vanilla' から

const store = createStore()

store.set(fooAtom, 'foo')

console.log(store.get(fooAtom)) // "foo" を出力

const unsub = store.sub(fooAtom, () => {
  console.log('store内のfooAtom値が変更されました')
})

// unsub()を呼び出して購読を解除します
```

独自のReact Contextを作成してstoreを渡すこともできます。

#### より柔軟なatom `write`関数

write関数は複数の引数を受け取り、値を返すことができます。

```javascript
atom(
  (get) => get(...),
  (get, set, arg1, arg2, ...) => {
    ...
    return someValue
  }
)
```

### 破壊的変更

#### Async atomsはもはや特別ではない

Async atomsは、promise値を持つ通常のatomです。Atomsのgetter関数はpromiseを解決しません。一方、`useAtom`フックは引き続きpromiseを解決します。

`splitAtom`のようないくつかのユーティリティは同期atomを期待しており、async atomsでは動作しません。

#### Writable atom typeが変更されました（TypeScriptのみ）

```typescript
// 旧
WritableAtom<Value, Arg, Result extends void | Promise<void>>

// 新
WritableAtom<Value, Args extends unknown[], Result>
```

#### いくつかの関数が削除されました

##### `Provider`の`initialValues` prop

`useHydrateAtoms`を使用してください。

##### `Provider`のscope props

独自のコンテキストを作成してstoreを渡してください。

##### `abortableAtom`ユーティリティ

これはデフォルトの動作になりました。

##### `waitForAll`ユーティリティ

`Promise.all`を使用してください。

### 移行パス

#### Async atoms

以前は、async atomsは自動的に解決されていましたが、今では手動で解決する必要があります。

```javascript
// 旧
const derivedAtom = atom((get) => get(asyncAtom).toUpperCase())

// 新
const derivedAtom = atom(async (get) => (await get(asyncAtom)).toUpperCase())
```

#### `Provider`の`initialValues` prop

`useHydrateAtoms`フックを使用してください。

```javascript
// 旧
<Provider initialValues={[[atom1, 1], [atom2, 'two']]}>
  ...
</Provider>

// 新
const HydrateAtoms = ({ children }) => {
  useHydrateAtoms([[atom1, 1], [atom2, 'two']])
  return children
}

<Provider>
  <HydrateAtoms>
    ...
  </HydrateAtoms>
</Provider>
```

#### `Provider`のscope props

カスタムコンテキストを作成し、`useStore`フックを使用してください。

```javascript
import { createContext, useContext } from 'react'
import { createStore, useAtom, Provider } from 'jotai'

const myStore = createStore()
const MyContext = createContext(myStore)

const MyProvider = ({ children }) => {
  const [store] = useState(createStore)
  return (
    <MyContext.Provider value={store}>
      <Provider store={store}>
        {children}
      </Provider>
    </MyContext.Provider>
  )
}

const useMyAtom = (atom) => {
  const store = useContext(MyContext)
  return useAtom(atom, { store })
}
```

#### `abortableAtom`ユーティリティ

これはデフォルトの動作になりました。単に削除してください。

```javascript
// 旧
import { abortableAtom } from 'jotai/utils'

const asyncAtom = abortableAtom(async (get, { signal }) => {
  // ...
})

// 新
import { atom } from 'jotai'

const asyncAtom = atom(async (get, { signal }) => {
  // ...
})
```

#### `waitForAll`ユーティリティ

`Promise.all`を使用してください。

```javascript
// 旧
import { waitForAll } from 'jotai/utils'

const allAtom = waitForAll([atom1, atom2, atom3])

// 新
import { atom } from 'jotai'

const allAtom = atom((get) => Promise.all([
  get(atom1),
  get(atom2),
  get(atom3),
]))
```

### インポート変更

Jotai v2では、新しいエントリーポイントが導入されました：

```javascript
// v1.11.0
import { atom } from 'jotai/vanilla'
import { useAtom } from 'jotai/react'

// v2.0.0
import { atom } from 'jotai'
import { useAtom } from 'jotai'
```

ほとんどのインポートはメインの`jotai`パッケージから動作するようになりました。

### ユーティリティの変更

#### `atomWithStorage`

初期化動作が変更されました。詳細はドキュメントを参照してください。

#### `useHydrateAtoms`

書き込み可能なatomのみを受け入れるようになりました。

### TypeScript型の変更

Writable atom typeが変更されました：

```typescript
// 旧
WritableAtom<Value, Arg, Result extends void | Promise<void>>

// 新
WritableAtom<Value, Args extends unknown[], Result>
```

これにより、より柔軟な型定義が可能になります。

### まとめ

Jotai v2は、より柔軟で強力なAPIを提供しますが、いくつかの破壊的変更があります。このガイドを使用して、スムーズに移行してください。詳細については、各機能のドキュメントを参照してください。
