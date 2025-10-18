---
title: TypeScriptガイド
nav: 7
---

## 基本的な使い方

TypeScriptを使用する場合、`create(...)` の代わりに `create<T>()(...)` と記述する必要があります（型パラメータと共に追加の括弧 `()` に注意してください）。ここで `T` は状態の型です。例:

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

<details>
  <summary>なぜ初期状態から型を推論できないのか？</summary>

  <br/>

**要約**: 状態のジェネリック `T` が不変だからです。

この最小限の `create` を考えてみましょう:

```ts
declare const create: <T>(f: (get: () => T) => T) => T

const x = create((get) => ({
  foo: 0,
  bar: () => get(),
}))
// `x` は次のように推論されるべきところを `unknown` と推論されます
// interface X {
//   foo: number,
//   bar: () => X
// }
```

ここで、`create` の `f` の型、つまり `(get: () => T) => T` を見ると、戻り値を通じて `T` を「与える」（共変にする）一方で、`get` を通じて `T` を「取る」（反変にする）ことがわかります。「では `T` はどこから来るのか？」とTypeScriptは疑問に思います。これは鶏と卵の問題のようなものです。最終的にTypeScriptは諦めて、`T` を `unknown` と推論します。

したがって、推論されるべきジェネリックが不変（つまり共変かつ反変）である限り、TypeScriptはそれを推論できません。別の簡単な例はこれです:

```ts
const createFoo = {} as <T>(f: (t: T) => T) => T
const x = createFoo((_) => 'hello')
```

ここでも、`x` は `string` ではなく `unknown` です。

  <details>
    <summary>推論についての詳細（TypeScriptに興味のある人向け）</summary>

ある意味で、この推論の失敗は問題ではありません。なぜなら、`<T>(f: (t: T) => T) => T` 型の値は書けないからです。つまり、`createFoo` の実際のランタイム実装を書くことはできません。試してみましょう:

```js
const createFoo = (f) => f(/* ? */)
```

`createFoo` は `f` の戻り値を返す必要があります。そしてそのためには、まず `f` を呼び出す必要があります。そして呼び出すには、`T` 型の値を渡す必要があります。そして `T` 型の値を渡すには、まずそれを生成する必要があります。しかし、`T` が何であるかさえわからないのに、どうやって `T` 型の値を生成できるでしょうか？`T` 型の値を生成する唯一の方法は `f` を呼び出すことですが、`f` 自体を呼び出すには `T` 型の値が必要です。つまり、実際に `createFoo` を書くことは不可能なのです。

つまり、`createFoo` の場合の推論失敗は問題ではありません。なぜなら `createFoo` を実装することが不可能だからです。では `create` の場合の推論失敗はどうでしょうか？それも実際には問題ではありません。なぜなら `create` も実装が不可能だからです。ちょっと待って、`create` の実装が不可能なら、Zustandはどうやって実装しているのでしょうか？答えは、実装していないのです。

Zustandは `create` の型を実装したと嘘をついています。ほとんどの部分だけを実装しました。不健全性を示すことで簡単に証明できます。次のコードを考えてみましょう:

```ts
import { create } from 'zustand'

const useBoundStore = create<{ foo: number }>()((_, get) => ({
  foo: get().foo,
}))
```

このコードはコンパイルされます。しかし実行すると、例外が発生します: "Uncaught TypeError: Cannot read properties of undefined (reading 'foo')"。これは、初期状態が作成される前に `get` が `undefined` を返すためです（したがって、初期状態を作成するときに `get` を呼び出すべきではありません）。型は `get` が決して `undefined` を返さないことを約束していますが、実際には最初は返します。つまりZustandは実装に失敗したのです。

もちろんZustandが失敗したのは、型が約束する方法で `create` を実装することが不可能だからです（`createFoo` を実装することが不可能なのと同じように）。言い換えれば、実装した実際の `create` を表現する型がないのです。`get` を `() => T | undefined` として型付けすることはできません。なぜなら不便を引き起こすし、それでも正しくないからです。`get` は確かに最終的には `() => T` ですが、同期的に呼び出されると `() => undefined` になります。必要なのは、`get` を `(() => T) & WhenSync<() => undefined>` として型付けできるTypeScriptの機能ですが、これは当然極めて非現実的です。

つまり、2つの問題があります: 推論の欠如と不健全性です。推論の欠如は、TypeScriptが不変のための推論を改善できれば解決できます。そして不健全性は、TypeScriptが `WhenSync` のようなものを導入すれば解決できます。推論の欠如を回避するために、状態の型を手動で注釈します。そして不健全性は回避できませんが、それほど大きな問題ではありません。同期的に `get` を呼び出すことは、とにかく意味がないからです。

</details>

</details>

<details>
  <summary>なぜカリー化 `()(...)` なのか？</summary>

  <br/>

**要約**: これは [microsoft/TypeScript#10571](https://github.com/microsoft/TypeScript/issues/10571) の回避策です。

このようなシナリオを想像してください:

```ts
declare const withError: <T, E>(
  p: Promise<T>,
) => Promise<[error: undefined, value: T] | [error: E, value: undefined]>
declare const doSomething: () => Promise<string>

const main = async () => {
  let [error, value] = await withError(doSomething())
}
```

ここで、`T` は `string` と推論され、`E` は `unknown` と推論されます。`E` を `Foo` として注釈したいかもしれません。なぜなら、`doSomething()` がスローするエラーの形状を確信しているからです。しかし、それはできません。すべてのジェネリックを渡すか、何も渡さないかのどちらかです。`E` を `Foo` として注釈するのと同時に、推論されるにもかかわらず `T` も `string` として注釈する必要があります。解決策は、ランタイムでは何もしない `withError` のカリー化バージョンを作ることです。その目的は、`E` を注釈できるようにすることだけです。

```ts
declare const withError: {
  <E>(): <T>(
    p: Promise<T>,
  ) => Promise<[error: undefined, value: T] | [error: E, value: undefined]>
  <T, E>(
    p: Promise<T>,
  ): Promise<[error: undefined, value: T] | [error: E, value: undefined]>
}
declare const doSomething: () => Promise<string>
interface Foo {
  bar: string
}

const main = async () => {
  let [error, value] = await withError<Foo>()(doSomething())
}
```

このようにして、`T` は推論され、`E` を注釈できます。Zustandは、状態（最初の型パラメータ）を注釈したいが、他のパラメータは推論させたい場合に同じユースケースがあります。

</details>

あるいは、`combine` を使用することもできます。これは状態を推論するので、型を書く必要がありません。

```ts
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useBearStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  })),
)
```

<details>
  <summary>少し注意が必要です</summary>

  <br/>

パラメータとして受け取る `set`、`get`、`store` の型で少し嘘をついて推論を実現しています。嘘は、状態が第1パラメータであるかのように型付けされていることですが、実際には状態は両方の第1パラメータと第2パラメータの戻り値の浅いマージ（`{ ...a, ...b }`）です。例えば、第2パラメータの `get` は型が `() => { bears: number }` ですが、これは嘘です。正しくは `() => { bears: number, increase: (by: number) => void }` であるべきです。そして `useBearStore` は依然として正しい型を持っています。例えば、`useBearStore.getState` は `() => { bears: number, increase: (by: number) => void }` として型付けされています。

これは実際には嘘ではありません。なぜなら `{ bears: number }` は依然として `{ bears: number, increase: (by: number) => void }` のサブタイプだからです。したがって、ほとんどの場合問題ありません。replaceを使用する際には注意が必要です。例えば、`set({ bears: 0 }, true)` はコンパイルされますが、`increase` 関数を削除するため不健全です。注意が必要なもう1つのインスタンスは、`Object.keys` を使用する場合です。`Object.keys(get())` は `["bears"]` ではなく `["bears", "increase"]` を返します。`get` の戻り値の型は、これらの間違いに陥らせる可能性があります。

`combine` は、状態の型を書く必要がないという利便性のために、少しの型安全性を犠牲にしています。したがって、`combine` は適切に使用してください。ほとんどの場合は問題なく、便利に使用できます。

</details>

`combine` を使用するときはカリー化バージョンを使用しないことに注意してください。なぜなら `combine` が状態を「作成」するからです。状態を作成するミドルウェアを使用する場合、状態が推論できるようになるため、カリー化バージョンを使用する必要はありません。状態を作成する別のミドルウェアは `redux` です。したがって、`combine`、`redux`、または状態を作成する他のカスタムミドルウェアを使用する場合、カリー化バージョンの使用は推奨しません。

状態宣言の外で状態の型も推論したい場合は、`ExtractState` 型ヘルパーを使用できます:

```ts
import { create, ExtractState } from 'zustand'
import { combine } from 'zustand/middleware'

type BearState = ExtractState<typeof useBearStore>

const useBearStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  })),
)
```

## ミドルウェアの使用

TypeScriptでミドルウェアを使用するのに特別なことをする必要はありません。

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      { name: 'bearStore' },
    ),
  ),
)
```

コンテキスト推論が機能するように、`create` 内で直接使用するようにしてください。次の `myMiddlewares` のように、少しでも凝ったことをすると、より高度な型が必要になります。

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const myMiddlewares = (f) => devtools(persist(f, { name: 'bearStore' }))

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  myMiddlewares((set) => ({
    bears: 0,
    increase: (by) => set((state) => ({ bears: state.bears + by })),
  })),
)
```

また、`devtools` ミドルウェアはできるだけ最後に使用することをお勧めします。例えば、`immer` をミドルウェアとして使用する場合、`immer(devtools(...))` ではなく `devtools(immer(...))` とすべきです。これは、`devtools` が `setState` を変更し、その上に型パラメータを追加するためです。他のミドルウェア（`immer` など）も `devtools` より前に `setState` を変更すると、この型パラメータが失われる可能性があります。したがって、`devtools` を最後に使用することで、他のミドルウェアがその前に `setState` を変更しないことを保証します。

## ミドルウェアの作成と高度な使用法

この仮説的なミドルウェアを書かなければならないと想像してください。

```ts
import { create } from 'zustand'

const foo = (f, bar) => (set, get, store) => {
  store.foo = bar
  return f(set, get, store)
}

const useBearStore = create(foo(() => ({ bears: 0 }), 'hello'))
console.log(useBearStore.foo.toUpperCase())
```

Zustandミドルウェアはストアを変更できます。しかし、どうやって型レベルで変更をエンコードできるでしょうか？つまり、このコードがコンパイルされるように `foo` を型付けするにはどうすればよいでしょうか？

通常の静的型付け言語では、これは不可能です。しかしTypeScriptのおかげで、Zustandには「高カインド変更子」と呼ばれるものがあり、これを可能にしています。ミドルウェアの型付けや `StateCreator` 型の使用など、複雑な型の問題を扱う場合、この実装の詳細を理解する必要があります。これについては、[#710を確認してください](https://github.com/pmndrs/zustand/issues/710)。

この特定の問題の答えを知りたい場合は、[こちらを参照してください](#middleware-that-changes-the-store-type)。

### 動的な `replace` フラグの処理

`replace` フラグの値がコンパイル時にわからず、動的に決定される場合、問題が発生する可能性があります。これを処理するには、`setState` 関数のパラメータで `replace` パラメータを注釈する回避策を使用できます:

```ts
const replaceFlag = Math.random() > 0.5
const args = [{ bears: 5 }, replaceFlag] as Parameters<
  typeof useBearStore.setState
>
store.setState(...args)
```

#### `as Parameters` 回避策の例

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

const replaceFlag = Math.random() > 0.5
const args = [{ bears: 5 }, replaceFlag] as Parameters<
  typeof useBearStore.setState
>
useBearStore.setState(...args) // 回避策を使用
```

このアプローチに従うことで、型の問題に遭遇することなく、動的な `replace` フラグを処理できることを保証できます。

## 一般的なレシピ

### ストアの型を変更しないミドルウェア

```ts
import { create, StateCreator, StoreMutatorIdentifier } from 'zustand'

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string,
) => StateCreator<T, Mps, Mcs>

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  name?: string,
) => StateCreator<T, [], []>

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (...a) => {
    set(...(a as Parameters<typeof set>))
    console.log(...(name ? [`${name}:`] : []), get())
  }
  const setState = store.setState
  store.setState = (...a) => {
    setState(...(a as Parameters<typeof setState>))
    console.log(...(name ? [`${name}:`] : []), store.getState())
  }

  return f(loggedSet, get, store)
}

export const logger = loggerImpl as unknown as Logger

// ---

const useBearStore = create<BearState>()(
  logger(
    (set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by })),
    }),
    'bear-store',
  ),
)
```

### ストアの型を変更するミドルウェア

```ts
import {
  create,
  StateCreator,
  StoreMutatorIdentifier,
  Mutate,
  StoreApi,
} from 'zustand'

type Foo = <
  T,
  A,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, [...Mps, ['foo', A]], Mcs>,
  bar: A,
) => StateCreator<T, Mps, [['foo', A], ...Mcs]>

declare module 'zustand' {
  interface StoreMutators<S, A> {
    foo: Write<Cast<S, object>, { foo: A }>
  }
}

type FooImpl = <T, A>(
  f: StateCreator<T, [], []>,
  bar: A,
) => StateCreator<T, [], []>

const fooImpl: FooImpl = (f, bar) => (set, get, _store) => {
  type T = ReturnType<typeof f>
  type A = typeof bar

  const store = _store as Mutate<StoreApi<T>, [['foo', A]]>
  store.foo = bar
  return f(set, get, _store)
}

export const foo = fooImpl as unknown as Foo

type Write<T extends object, U extends object> = Omit<T, keyof U> & U

type Cast<T, U> = T extends U ? T : U

// ---

const useBearStore = create(foo(() => ({ bears: 0 }), 'hello'))
console.log(useBearStore.foo.toUpperCase())
```

### カリー化回避策なしの `create`

`create` を使用する推奨の方法は、次のようにカリー化回避策を使用することです: `create<T>()(...)` 。これにより、ストアの型を推論できるようになります。しかし、何らかの理由で回避策を使用したくない場合は、次のように型パラメータを渡すことができます。ただし、場合によっては、これは注釈ではなくアサーションとして機能するため、推奨しません。

```ts
import { create } from "zustand"

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<
  BearState,
  [
    ['zustand/persist', BearState],
    ['zustand/devtools', never]
  ]
>(devtools(persist((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}), { name: 'bearStore' }))
```

### スライスパターン

```ts
import { create, StateCreator } from 'zustand'

interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface FishSlice {
  fishes: number
  addFish: () => void
}

interface SharedSlice {
  addBoth: () => void
  getBoth: () => number
}

const createBearSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const createSharedSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  addBoth: () => {
    // 以前のメソッドを再利用できます
    get().addBear()
    get().addFish()
    // または最初から実行します
    // set((state) => ({ bears: state.bears + 1, fishes: state.fishes + 1 })
  },
  getBoth: () => get().bears + get().fishes,
})

const useBoundStore = create<BearSlice & FishSlice & SharedSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createSharedSlice(...a),
}))
```

スライスパターンの詳細な説明は[こちら](./slices-pattern.md)にあります。

ミドルウェアがある場合は、`StateCreator<MyState, [], [], MySlice>` を `StateCreator<MyState, Mutators, [], MySlice>` に置き換えてください。例えば、`devtools` を使用している場合は `StateCreator<MyState, [["zustand/devtools", never]], [], MySlice>` になります。すべての変更子のリストについては、[「ミドルウェアとその変更子のリファレンス」](#middlewares-and-their-mutators-reference)セクションを参照してください。

### バニラストア用のバウンドされた `useStore` フック

```ts
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

function useBearStore(): BearState
function useBearStore<T>(selector: (state: BearState) => T): T
function useBearStore<T>(selector?: (state: BearState) => T) {
  return useStore(bearStore, selector!)
}
```

バウンドされた `useStore` フックを頻繁に作成する必要があり、物事をDRYにしたい場合は、抽象的な `createBoundedUseStore` 関数を作成することもできます...

```ts
import { useStore, StoreApi } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

const createBoundedUseStore = ((store) => (selector) =>
  useStore(store, selector)) as <S extends StoreApi<unknown>>(
  store: S,
) => {
  (): ExtractState<S>
  <T>(selector: (state: ExtractState<S>) => T): T
}

type ExtractState<S> = S extends { getState: () => infer X } ? X : never

const useBearStore = createBoundedUseStore(bearStore)
```

## ミドルウェアとその変更子のリファレンス

- `devtools` — `["zustand/devtools", never]`
- `persist` — `["zustand/persist", YourPersistedState]`<br/>
  `YourPersistedState` は永続化する状態の型、つまり `options.partialize` の戻り値の型です。`partialize` オプションを渡していない場合、`YourPersistedState` は `Partial<YourState>` になります。また、[場合によっては](https://github.com/pmndrs/zustand/issues/980#issuecomment-1162289836)実際の `PersistedState` を渡しても機能しません。そのような場合は、`unknown` を渡してみてください。
- `immer` — `["zustand/immer", never]`
- `subscribeWithSelector` — `["zustand/subscribeWithSelector", never]`
- `redux` — `["zustand/redux", YourAction]`
- `combine` — `combine` はストアを変更しないため、変更子はありません
