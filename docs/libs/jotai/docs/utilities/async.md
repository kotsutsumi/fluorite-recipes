# Async

Jotaiは、プリミティブとしてpromiseとasync/await関数をサポートします。

## loadable

**Ref**: https://github.com/pmndrs/jotai/issues/14

```ts
function loadable<Value>(
  anAtom: Atom<Value>,
): Atom<Loadable<Value>>

type Loadable<Value> =
  | { state: 'loading' }
  | { state: 'hasData'; data: Value }
  | { state: 'hasError'; error: unknown }
```

このユーティリティ関数は、エラーのスローやpromiseのスローを回避するために、元のatomをラップするderived atomを作成します。返されるatomは`Loadable<Value>`型で、`state`プロパティと、stateが`'hasData'`の場合は`data`、`'hasError'`の場合は`error`を含むオブジェクトを返します。

### 例

```jsx
import { loadable } from 'jotai/utils'

const asyncAtom = atom(async () => 'hello')
const loadableAtom = loadable(asyncAtom)
// atomは最初はこれを返します: { state: 'loading' }
// atomは次にこれを返します: { state: 'hasData', data: 'hello' }
```

```jsx
import { atom, useAtom } from 'jotai'
import { loadable } from 'jotai/utils'

const asyncArrayAtom = atom(async () => [1, 2, 3])
const loadableArrayAtom = loadable(asyncArrayAtom)

const Component = () => {
  const [value] = useAtom(loadableArrayAtom)
  if (value.state === 'hasError') return <Text>{value.error}</Text>
  if (value.state === 'loading') {
    return <Text>Loading...</Text>
  }
  console.log(value.data) // [1, 2, 3]
  return (
    <FlatList
      data={value.data}
      renderItem={({ item }) => <Text>{item}</Text>}
      keyExtractor={(item) => item.toString()}
    />
  )
}
```

## atomWithObservable

**Ref**: https://github.com/pmndrs/jotai/pull/341

```ts
function atomWithObservable<TData>(
  getObservable: (get: Getter) => Observable<TData> | Subject<TData>,
  options?: {
    initialValue?: TData | (() => TData)
    unstable_timeout?: number
  },
): WritableAtom<TData, [TData], void>
```

このユーティリティ関数は、RxJS (またはその他の) Observableからatomを作成します。その値は、`next`で通知された最新の値です。これは、observableの最新のemitされた値をストリームから追跡するための最も基本的なユースケースに使用できます。

RxJS Subject atomに書き込むには、`atom.next(value)`を使用します（これは他のタイプのobservableには適用されません）。

これをさらに拡張して、他のステートフルなobservableのコンポーザブルと組み合わせることができます。例えば、これを`atomWithReducer`と`Subject.pipe`と組み合わせて、`atomWithObservable`の高度な状態機械の代替として使用できます。

### 例

```jsx
import { useAtom } from 'jotai'
import { atomWithObservable } from 'jotai/utils'
import { interval } from 'rxjs'
import { map } from 'rxjs/operators'

const counterSubject = interval(1000).pipe(map((i) => `count: ${i}`))
const counterAtom = atomWithObservable(() => counterSubject)

const Counter = () => {
  const [counter] = useAtom(counterAtom)
  return <div>{counter}</div>
}
```

BehaviorSubjectの場合、`initialValue`を指定する必要はありません:

```jsx
import { useAtom } from 'jotai'
import { atomWithObservable } from 'jotai/utils'
import { BehaviorSubject } from 'rxjs'

const counterSubject = new BehaviorSubject(0)

const counterAtom = atomWithObservable(() => counterSubject)
// または、もしあなたが実装の型を好むなら:
const counterAtom2 = atomWithObservable<number>(() => counterSubject)

const Counter = () => {
  const [counter] = useAtom(counterAtom)
  return <div>{counter}</div>
}
```

### observableへの書き込み

observableがSubjectであれば、そのSubjectにpushバックすることができます。単に`set`に渡された最初の値を使用して`subject.next(...)`を呼び出すことができます:

```jsx
import { useAtom } from 'jotai'
import { atomWithObservable } from 'jotai/utils'
import { Subject } from 'rxjs'

const counterSubject = new Subject() // 注意: 初期値はありません
const counterAtom = atomWithObservable(() => counterSubject, {
  initialValue: 10,
})

const Counter = () => {
  const [counter, setCounter] = useAtom(counterAtom)
  return (
    <>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>increment</button>
    </>
  )
}
```

Subjectを直接更新することもできます:

```jsx
import { useAtom } from 'jotai'
import { atomWithObservable } from 'jotai/utils'
import { BehaviorSubject } from 'rxjs'

const counterSubject = new BehaviorSubject(0)

const counterAtom = atomWithObservable(() => counterSubject)

const Counter = () => {
  const [counter] = useAtom(counterAtom)
  return (
    <>
      <div>{counter}</div>
      <button onClick={() => counterSubject.next(counter + 1)}>increment</button>
    </>
  )
}
```

複数のコンポーネントからSubjectを更新したい場合、初期化からSubjectの定義を分離することをお勧めします:

```jsx
import { useAtom } from 'jotai'
import { atomWithObservable } from 'jotai/utils'
import { BehaviorSubject } from 'rxjs'

const counterSubject = new BehaviorSubject(0)

const counterAtom = atomWithObservable(() => counterSubject)

const Counter = () => {
  const [counter] = useAtom(counterAtom)
  return (
    <>
      <div>{counter}</div>
      <button onClick={() => counterSubject.next(counter + 1)}>increment</button>
    </>
  )
}

const Monitor = () => {
  const [counter] = useAtom(counterAtom)
  return <div>current counter: {counter}</div>
}
```

### Suspenseの遅延

```ts
const isClient = typeof window !== 'undefined'

const locationAtom = atomWithObservable(() => navigator.geolocation, {
  unstable_timeout: isClient ? undefined : 100,
})
```

現在の状態が利用可能になるまで100ミリ秒待ちます。

初期値が定義されている場合、遅延は無視されます。

### Codesandbox

<CodeSandbox id="snji6" />

## unwrap

**Ref**: https://github.com/pmndrs/jotai/issues/1213

```ts
function unwrap<Value>(
  anAtom: WritableAtom<Promise<Value>, [SetStateAction<Value>], void>,
  options?: {
    fallback?: () => Value
  },
): WritableAtom<Value | undefined, [SetStateAction<Value>], void>
```

v1 APIで導入された`waitForAll`が、derived atomで動作しないことがあります。
`unwrap`ユーティリティはこの問題を解決するv2のAPIです。

v2は意図的にシンプルに保たれており、derived atomで動作します。
`useAtom`は、非同期atomが解決される前に一度再レンダリングされます。
読み取り関数では、`get`はasync atomの以前の値またはundefinedを返します。

次のケースを考えてみましょう:

```ts
const rawAtom = atom(() => fetch('https://wantedUrl.com').then((response) => response.json()))
```

このasync atomの値にアクセスするには、`Suspense`を使用する必要があります。
しかし、`unwrap`を使用すると、async atomを同期atomに変換できます。

```ts
const derivedAtom = unwrap(rawAtom, { fallback: 'loading' })
```

これは、一時的に`loading`を返し、次にasync atomの値を返します。fallbackオプションはオプションです。指定されていない場合、undefinedがデフォルトで使用されます。

`fallback`が提供されている場合、Suspendを回避できます。

```jsx
const Component = () => {
  const [value, setValue] = useAtom(derivedAtom)
  return (
    <div>
      {value}
      <button onClick={() => setValue('new value')}>Change</button>
    </div>
  )
}
```

### 例

```jsx
import { atom, useAtom } from 'jotai'
import { unwrap } from 'jotai/utils'

const countAtom = atom(0)

const asyncDoubledCountAtom = atom(async (get) => {
  await new Promise((r) => setTimeout(r, 500))
  return get(countAtom) * 2
})

const doubledCountAtom = unwrap(asyncDoubledCountAtom, (prev) => prev ?? 0)

const Component = () => {
  const [count, setCount] = useAtom(countAtom)
  const [doubledCount] = useAtom(doubledCountAtom)
  return (
    <>
      <div>count: {count}</div>
      <div>doubledCount: {doubledCount}</div>
      <button onClick={() => setCount((c) => c + 1)}>inc</button>
    </>
  )
}
```

### Codesandbox

<CodeSandbox id="z4y88h" />
