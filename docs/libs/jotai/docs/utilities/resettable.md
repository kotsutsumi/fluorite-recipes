# Resettable

## atomWithReset

**Ref**: https://github.com/pmndrs/jotai/issues/41

```ts
function atomWithReset<Value>(
  initialValue: Value,
): WritableAtom<Value, [SetStateAction<Value> | typeof RESET], void>
```

初期値に戻すことができるリセット可能なprimitive atomを作成します。

`RESET`シンボルで更新することで、atomを初期値にリセットできます。

### 例

```jsx
import { useAtom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

const dollarsAtom = atomWithReset(0)
const centsAtom = atom(
  (get) => get(dollarsAtom) * 100,
  (get, set, newValue: number) => set(dollarsAtom, newValue / 100),
)

const ResetExample = () => {
  const [dollars, setDollars] = useAtom(dollarsAtom)

  return (
    <>
      <div>Balance ${dollars}</div>
      <button onClick={() => setDollars(RESET)}>Reset</button>
    </>
  )
}
```

### Codesandbox

<CodeSandbox id="dw86l" />

## RESET

**Ref**: https://github.com/pmndrs/jotai/issues/217

```ts
const RESET: unique symbol
```

`RESET`シンボルは、atomを初期値にリセットするために使用される特別な値です。

`atomWithReset`で作成されたatomだけでなく、他のwritable atomでも使用できます。

### 例

```jsx
import { atom, useAtom, useSetAtom } from 'jotai'
import { atomWithReset, RESET } from 'jotai/utils'

const todoListAtom = atomWithReset([
  { description: 'Add a todo', checked: false },
])

const TodoList = () => {
  const [todoList, setTodoList] = useAtom(todoListAtom)

  return (
    <>
      {todoList.map((todo) => (
        <div>{todo.description}</div>
      ))}

      <button onClick={() => setTodoList((l) => [...l, { description: 'New item', checked: false }])}>
        Add todo
      </button>
      <button onClick={() => setTodoList(RESET)}>Reset</button>
    </>
  )
}
```

### TypeScript

`RESET`シンボルを含む可能性のある`SetStateAction`型を受け入れるには、`SetStateActionWithReset`型を使用できます。

```ts
import type { SetStateActionWithReset } from 'jotai/utils'

const todoListAtom = atom(
  (get) => get(todoListAtomWithReset),
  (get, set, update: SetStateActionWithReset<Todo[]>) => {
    set(todoListAtomWithReset, update)
  },
)
```

## useResetAtom

```ts
function useResetAtom<Value>(
  anAtom: WritableAtom<Value, [typeof RESET], void>,
): () => void
```

atomをリセットする別の方法は、`useResetAtom`フックを使用することです。これは、atomの現在の値は必要ないが、リセット機能のみが必要な場合に特に便利です。

### 例

```jsx
import { useResetAtom } from 'jotai/utils'
import { todoListAtom } from './store'

const TodoResetButton = () => {
  const resetTodoList = useResetAtom(todoListAtom)
  return <button onClick={resetTodoList}>Reset</button>
}
```

### Codesandbox

<CodeSandbox id="3xsnn" />

## atomWithDefault

**Ref**: https://github.com/pmndrs/jotai/discussions/352

```ts
function atomWithDefault<Value>(
  getter: (get: Getter) => Value,
): WritableAtom<Value, [SetStateAction<Value> | typeof RESET], void>
```

デフォルト値でリセット可能なatomを作成します。デフォルト値は、getter関数で指定します。

### 例

```jsx
import { atomWithDefault, RESET } from 'jotai/utils'

const count1Atom = atom(1)
const count2Atom = atomWithDefault((get) => get(count1Atom) * 2)

// count2Atomの値は、count1Atomの値に基づいて計算されます
// count2Atom = count1Atom * 2

// 次のコードは、count2Atomの値を設定します
set(count2Atom, 10)
// 次のコードは、count2Atomの値をデフォルト値にリセットします
set(count2Atom, RESET)
```

注意: `atomWithDefault`は、derived atomの書き込み可能なバージョンのシンタックスシュガーです。

```tsx
atomWithDefault((get) => get(count1Atom) * 2)
```

上記は次と同等です:

```tsx
atom(
  (get) => get(count1Atom) * 2,
  (get, set, update: SetStateAction<number> | typeof RESET) => {
    const nextValue = update === RESET ? get(count1Atom) * 2 : update
    set(count2Atom, nextValue)
  },
)
```

### Codesandbox

<CodeSandbox id="f4hhq" />

## atomWithRefresh

```ts
function atomWithRefresh<Value>(
  read: (get: Getter) => Value,
): WritableAtom<Value, [typeof RESET], void>
```

値がread関数から派生するatomを作成し、`RESET`でその読み取り関数の再評価をトリガーできます。これは、refreshアクションをトリガーしたいときに、derived atomと組み合わせて使用できます。

この関数は、`atomWithDefault`と類似のシグネチャを持っていますが、主にasyncの読み取り関数で使用されることを想定しています。

### 例

```jsx
import { atomWithRefresh } from 'jotai/utils'

const postsAtom = atomWithRefresh((get) =>
  fetch('https://jsonplaceholder.typicode.com/posts').then((r) => r.json()),
)
```

上記のコードでは、一度JSONを読み込んだ後は、データを再取得しません。

refreshをトリガーするには、次のようにします:

```jsx
import { useSetAtom } from 'jotai'
import { atomWithRefresh, RESET } from 'jotai/utils'

const postsAtom = atomWithRefresh((get) =>
  fetch('https://jsonplaceholder.typicode.com/posts').then((r) => r.json()),
)

const PostsList = () => {
  const posts = useAtomValue(postsAtom)
  const refreshPosts = useSetAtom(postsAtom)

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      {/* 次の関数を呼び出すと、postsAtomが更新されます */}
      <button type="button" onClick={() => refreshPosts(RESET)}>
        Refresh posts
      </button>
    </div>
  )
}
```
