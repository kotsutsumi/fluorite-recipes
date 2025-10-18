---
title: v4への移行
nav: 22
---

破壊的変更は型のみです。
TypeScriptまたはJSDocの型アノテーションでZustandを使用している場合、
このガイドが適用されます。
それ以外の場合、移行は必要ありません。

また、移行をより理解しやすくするために、
まず新しい[TypeScriptガイド](../guides/typescript.md)を読むことをお勧めします。

この移行ガイドに加えて、
Zustandリポジトリのv3からv4への
テストファイルの[差分](https://github.com/pmndrs/zustand/compare/v3.7.2...v4.0.0?short_path=37e5b4c#diff-c21e24854115b390eccde717da83f91feb2d5927a76c1485e5f0fdd0135c2afa)
も確認できます。

## `create`

**適用されるインポート**

```ts
import create from 'zustand'
import create from 'zustand/vanilla'
```

**変更**

```diff
- create:
-   < State
-   , StoreSetState = StoreApi<State>["set"]
-   , StoreGetState = StoreApi<State>["get"]
-   , Store = StoreApi<State>
-   >
-     (f: ...) => ...
+ create:
+   { <State>(): (f: ...) => ...
+   , <State, Mutators>(f: ...) => ...
+   }
```

**移行**

`create`に型パラメータを渡していない場合、
移行は必要ありません。

`combine`や`redux`のような「リーフ」ミドルウェアを使用している場合、
`create`からすべての型パラメータを削除してください。

それ以外の場合、`create<T, ...>(...)`を`create<T>()(...)`に置き換えてください。

## `StateCreator`

**適用されるインポート**

```ts
import type { StateCreator } from 'zustand'
import type { StateCreator } from 'zustand/vanilla'
```

**変更**

```diff
- type StateCreator
-   < State
-   , StoreSetState = StoreApi<State>["set"]
-   , StoreGetState = StoreApi<State>["get"]
-   , Store = StoreApi<State>
-   > =
-     ...
+ type StateCreator
+   < State
+   , InMutators extends [StoreMutatorIdentifier, unknown][] = []
+   , OutMutators extends [StoreMutatorIdentifier, unknown][] = []
+   , Return = State
+   > =
+     ...
```

**移行**

`StateCreator`を使用している場合、
おそらくミドルウェアを作成しているか、
「スライス」パターンを使用しています。
それについては、
TypeScriptガイドの[ミドルウェアの作成と高度な使用法](../guides/typescript.md#authoring-middlewares-and-advanced-usage)
および[一般的なレシピ](../guides/typescript.md#common-recipes)
セクションを確認してください。

## `PartialState`

**適用されるインポート**

```ts
import type { PartialState } from 'zustand'
import type { PartialState } from 'zustand/vanilla'
```

**変更**

```diff
- type PartialState
-   < T extends State
-   , K1 extends keyof T = keyof T
-   , K2 extends keyof T = K1
-   , K3 extends keyof T = K2
-   , K4 extends keyof T = K3
-   > =
-   | (Pick<T, K1> | Pick<T, K2> | Pick<T, K3> | Pick<T, K4> | T)
-   | ((state: T) => Pick<T, K1> | Pick<T, K2> | Pick<T, K3> | Pick<T, K4> | T)
+ type PartialState<T> =
+   | Partial<T>
+   | ((state: T) => Partial<T>)
```

**移行**

`PartialState<T, ...>`を`PartialState<T>`に置き換え、
できれば`tsconfig.json`で[`exactOptionalPropertyTypes`](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)
を有効にしてください：

```json
{
  "compilerOptions": {
    "exactOptionalPropertyTypes": true
  }
}
```

`{ foo: undefined }`が`Partial<{ foo: string }>`に
割り当てられるのを禁止するトリックは使用しなくなりました。
代わりに、ユーザーが`exactOptionalPropertyTypes`を有効にすることに依存しています。

## `useStore`

**適用されるインポート**

```ts
import { useStore } from 'zustand'
import { useStore } from 'zustand/react'
```

**変更**

```diff
- useStore:
-   { <State>(store: StoreApi<State>): State
-   , <State, StateSlice>
-       ( store: StoreApi<State>
-       , selector: StateSelector<State, StateSlice>,
-       , equals?: EqualityChecker<StateSlice>
-       ): StateSlice
-   }
+ useStore:
+   <Store, StateSlice = ExtractState<Store>>
+     ( store: Store
+     , selector?: StateSelector<State, StateSlice>,
+     , equals?: EqualityChecker<StateSlice>
+     )
+       => StateSlice
```

**移行**

`useStore`に型パラメータを渡していない場合、
移行は必要ありません。

渡している場合、
すべての型パラメータを削除するか、
最初のパラメータとして**state**型の代わりに**store**型を渡すことをお勧めします。

## `UseBoundStore`

**適用されるインポート**

```ts
import type { UseBoundStore } from 'zustand'
import type { UseBoundStore } from 'zustand/react'
```

**変更**

```diff
- type UseBoundStore<
-   State,
-   Store = StoreApi<State>
- > =
-   & { (): T
-     , <StateSlice>
-         ( selector: StateSelector<State, StateSlice>
-         , equals?: EqualityChecker<StateSlice>
-         ): U
-     }
-   & Store
+ type UseBoundStore<Store> =
+   & (<StateSlice = ExtractState<S>>
+       ( selector?: (state: ExtractState<S>) => StateSlice
+       , equals?: (a: StateSlice, b: StateSlice) => boolean
+       ) => StateSlice
+     )
+   & S
```

**移行**

`UseBoundStore<T>`を`UseBoundStore<StoreApi<T>>`に、
`UseBoundStore<T, S>`を`UseBoundStore<S>`に置き換えてください。

## `UseContextStore`

**適用されるインポート**

```ts
import type { UseContextStore } from 'zustand/context'
```

**変更**

```diff
- type UseContextStore
```

**移行**

代わりに`typeof MyContext.useStore`を使用してください。

## `createContext`

**適用されるインポート**

```ts
import createContext from 'zustand/context'
```

**変更**

```diff
  createContext:
-   <State, Store = StoreApi<State>>() => ...
+   <Store>() => ...
```

**移行**

`createContext<T>()`を`createContext<StoreApi<T>>()`に、
`createContext<T, S>()`を`createContext<S>()`に置き換えてください。

## `combine`, `devtools`, `subscribeWithSelector`

**適用されるインポート**

```ts
import { combine } from 'zustand/middleware'
import { devtools } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'
```

**変更**

```diff
- combine:
-   <T, U>(...) => ...
+ combine:
+   <T, U, Mps, Mcs>(...) => ...

- devtools:
-   <T>(...) => ...
+ devtools:
+   <T, Mps, Mcs>(...) => ...

- subscribeWithSelector:
-   <T>(...) => ...
+ subscribeWithSelector:
+   <T, Mps, Mcs>(...) => ...
```

**移行**

`combine`、`devtools`、または`subscribeWithSelector`に
型パラメータを渡していない場合、
移行は必要ありません。

渡している場合、
すべての型パラメータを削除してください。
これらは自動的に推論されます。

## `persist`

**適用されるインポート**

```ts
import { persist } from 'zustand/middleware'
```

**変更**

```diff
- persist:
-   <T, U = Partial<T>>(...) => ...
+ persist:
+   <T, Mps, Mcs, U = T>(...) => ...
```

**移行**

型パラメータを渡している場合、
自動的に推論されるため、削除してください。

次に、`partialize`オプションを渡している場合、
移行のためのさらなる手順は必要ありません。

`partialize`オプションを渡して**いない**場合、
コンパイルエラーが表示される可能性があります。
表示されない場合、
さらなる移行は必要ありません。

部分化された状態の型は`Partial<T>`ではなく`T`になりました。
これは、デフォルトの`partialize`のランタイム動作と一致しています。
デフォルトの`partialize`は恒等関数(`s => s`)です。

コンパイルエラーが表示される場合、
エラーを自分で見つけて修正する必要があります。
これらは不健全なコードを示している可能性があるためです。
あるいは、回避策として
`s => s as Partial<typeof s>`を`partialize`に渡すことができます。
部分化された状態が本当に`Partial<T>`である場合、
バグは発生しないはずです。

ランタイム動作は変更されていません。
型のみが正しくなりました。

## `redux`

**適用されるインポート**

```ts
import { redux } from 'zustand/middleware'
```

**変更**

```diff
- redux:
-   <T, A>(...) => ...
+ redux:
+   <T, A, Mps, Mcs>(...) => ...
```

**移行**

`redux`に型パラメータを渡していない場合、
移行は必要ありません。

渡している場合、
すべての型パラメータを削除し、
2番目の(action)パラメータのみにアノテーションを付けてください。
つまり、`redux<T, A>((state, action) => ..., ...)`を
`redux((state, action: A) => ..., ...)`に置き換えてください。
