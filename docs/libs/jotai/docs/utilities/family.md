# Family

## atomFamily

**Ref**: https://github.com/pmndrs/jotai/issues/23

```ts
function atomFamily<Param, Value>(
  initializeAtom: (param: Param) => WritableAtom<Value, [Update], void> | Atom<Value>,
  areEqual?: (a: Param, b: Param) => boolean,
): (param: Param) => WritableAtom<Value, [Update], void> | Atom<Value>
```

これは、パラメータに基づいてatomをキャッシュするために使用されるユーティリティ関数です。この実装はプリミティブなatomと互換性があり、より柔軟なタイプのatomとも互換性があります。`areEqual`は、オプションでカスタムのパラメータ比較を指定するために使用できます（`Object.is`がデフォルト）。

注意: 返される値は、同じパラメータに対して同じatom参照であることが保証されます。

パラメータが不要な場合は、すでにatom factoryパターンを使用できます。

### 例

#### 基本的な使用法

```tsx
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const todoFamily = atomFamily((name: string) => atom(name))

const Component = () => {
  const [todoA, setTodoA] = useAtom(todoFamily('a'))
  const [todoB, setTodoB] = useAtom(todoFamily('b'))
  // ...
}
```

#### オブジェクトパラメータを使用

```tsx
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const todoFamily = atomFamily(({ id, name }: { id: number; name: string }) =>
  atom({ name }),
)

const Component = () => {
  const [todo, setTodo] = useAtom(todoFamily({ id: 1, name: 'foo' }))
  // ...
}
```

#### 非プリミティブなatomを使用

```tsx
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const todoFamily = atomFamily((name: string) =>
  atom(
    (get) => get(todosAtom)[name],
    (get, set, arg: string) => {
      const prev = get(todosAtom)
      return { ...prev, [name]: { ...prev[name], ...arg } }
    },
  ),
)

const Component = () => {
  const [todo, setTodo] = useAtom(todoFamily('foo'))
  // ...
}
```

#### カスタム比較を使用

```tsx
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const todoFamily = atomFamily(
  ({ id, name }: { id: number; name: string }) => atom({ name }),
  (a, b) => a.id === b.id,
)

const Component = () => {
  const [todo, setTodo] = useAtom(todoFamily({ id: 1, name: 'foo' }))
  // `id`が同じなので、todoFamilyは同じatomを返します
  const [todo, setTodo] = useAtom(todoFamily({ id: 1, name: 'bar' }))
  // ...
}
```

### メモリリーク

内部的には、`atomFamily`はパラメータとatomの設定を保持するMapを維持します。このMapは、それ以上使用されないパラメータとatomを削除しない限り、無限に成長します。これは、メモリリークの原因となる可能性があります。

メモリリークを回避するために、使用されなくなったパラメータを削除するために`shouldRemove`関数を提供できます。`shouldRemove`は、`createdAt`と削除される`param`を受け取ります。

例えば、10秒より古いパラメータを削除するには:

```ts
const myFamily = atomFamily(
  (param) => atom(/* ... */),
  null,
  (createdAt) => Date.now() - createdAt > 10_000,
)
```

#### 手動削除

特定のパラメータを手動で削除するには、`myFamily.remove(param)`を呼び出すことができます。

```ts
const myFamily = atomFamily((param) => atom(/* ... */))

myFamily.remove(param)
```

#### 削除関数のセットアップ

`shouldRemove`関数は、`setShouldRemove`メソッドを使用して実行時に登録することもできます:

```ts
const myFamily = atomFamily((param) => atom(/* ... */))

myFamily.setShouldRemove((createdAt, param) => {
  // ここでカスタムロジックを使用
  return shouldRemoveThisParam
})
```

`shouldRemove`関数は、atomがマウントされるとき、またはアンマウントされるときに呼び出されます。

### Codesandbox

<CodeSandbox id="zgsyv" />

### TypeScript

パラメータ型と値型とupdater型を指定できます。

```ts
type Param = { id: string }
type Value = number
type Update = { type: 'inc' } | { type: 'dec' }

const myFamily = atomFamily((param: Param) =>
  atom<Value, [Update], void>(0, (get, set, update) => {
    // ...
  }),
)

const myAtom = myFamily({ id: 'foo' })
// myAtomはWritableAtom<number, [{ type: 'inc' } | { type: 'dec' }], void>です
```

型推論を使用することも、より明示的にすることもできます。

```ts
const myFamily = atomFamily((param: Param) => {
  const myAtom: WritableAtom<Value, [Update], void> = atom(0, (get, set, update) => {
    // ...
  })
  return myAtom
})

const myAtom = myFamily({ id: 'foo' })
// myAtomはWritableAtom<number, [{ type: 'inc' } | { type: 'dec' }], void>です
```

### 実装の詳細

`atomFamily`は、単にキャッシングされたatom設定を持つファクトリです。つまり、これはシンタックスシュガーです:

```ts
const todoFamily = atomFamily((name: string) => atom(name))
```

上記は実質的に次と同じです:

```ts
const todoCache = new Map()
const todoFamily = (name: string) => {
  let todo = todoCache.get(name)
  if (!todo) {
    todo = atom(name)
    todoCache.set(name, todo)
  }
  return todo
}
```

唯一の違いは、前者の場合は初期値を変更できないことです。`atomFamily`は同じパラメータに対して同じatom参照を返します。これにより、動的に作成されたatomを使用しやすくなります。
