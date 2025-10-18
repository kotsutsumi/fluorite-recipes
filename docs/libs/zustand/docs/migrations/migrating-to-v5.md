---
title: v4からv5への移行方法
nav: 23
---

# v4からv5への移行方法

v5に移行する前に、v4の最新バージョンに更新することを強くお勧めします。アプリを壊すことなく、すべての非推奨警告が表示されます。

## v5の変更点

- デフォルトエクスポートの廃止
- 非推奨機能の廃止
- React 18を最小必須バージョンに設定
- use-sync-external-storeをpeer dependencyに設定（`zustand/traditional`の`createWithEqualityFn`と`useStoreWithEqualityFn`に必要）
- TypeScript 4.5を最小必須バージョンに設定
- UMD/SystemJSサポートの廃止
- package.jsonのエントリーポイントの整理
- ES5サポートの廃止
- setStateのreplaceフラグが設定されている場合の型の厳格化
- persistミドルウェアの動作変更
- その他の小さな改善（技術的には破壊的変更）

## 移行ガイド

### `shallow`などのカスタム等価関数の使用

v5の`create`関数は、等価関数のカスタマイズをサポートしていません。

`shallow`などのカスタム等価関数を使用している場合、
最も簡単な移行方法は`createWithEqualityFn`を使用することです。

```js
// v4
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

const useCountStore = create((set) => ({
  count: 0,
  text: 'hello',
  // ...
}))

const Component = () => {
  const { count, text } = useCountStore(
    (state) => ({
      count: state.count,
      text: state.text,
    }),
    shallow,
  )
  // ...
}
```

v5では`createWithEqualityFn`を使用して実現できます：

```bash
npm install use-sync-external-store
```

```js
// v5
import { createWithEqualityFn as create } from 'zustand/traditional'

// 残りはv4と同じです
```

あるいは、`shallow`のユースケースでは、`useShallow`フックを使用できます：

```js
// v5
import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

const useCountStore = create((set) => ({
  count: 0,
  text: 'hello',
  // ...
}))

const Component = () => {
  const { count, text } = useCountStore(
    useShallow((state) => ({
      count: state.count,
      text: state.text,
    })),
  )
  // ...
}
```

### 安定したセレクター出力の要求

v5では、Reactのデフォルト動作に合わせて動作が変更されました。
セレクターが新しい参照を返す場合、無限ループを引き起こす可能性があります。

たとえば、これは無限ループを引き起こす可能性があります。

```js
// v4
const [searchValue, setSearchValue] = useStore((state) => [
  state.searchValue,
  state.setSearchValue,
])
```

エラーメッセージは次のようになります：

```plaintext
Uncaught Error: Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

これを修正するには、`useShallow`フックを使用します。これは安定した参照を返します。

```js
// v5
import { useShallow } from 'zustand/shallow'

const [searchValue, setSearchValue] = useStore(
  useShallow((state) => [state.searchValue, state.setSearchValue]),
)
```

無限ループを引き起こす可能性がある別の例を示します。

```js
// v4
const action = useMainStore((state) => {
  return state.action ?? () => {}
})
```

これを修正するには、セレクター関数が安定した参照を返すようにしてください。

```js
// v5

const FALLBACK_ACTION = () => {}

const action = useMainStore((state) => {
  return state.action ?? FALLBACK_ACTION
})
```

あるいは、v4の動作が必要な場合は、`createWithEqualityFn`を使用します。

```js
// v5
import { createWithEqualityFn as create } from 'zustand/traditional'
```

### setStateのreplaceフラグが設定されている場合の型の厳格化（TypeScriptのみ）

```diff
- setState:
-   (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean | undefined) => void;
+ setState:
+   (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: false) => void;
+   (state: T | ((state: T) => T), replace: true) => void;
```

`replace`フラグを使用していない場合、移行は必要ありません。

`replace`フラグを使用していて`true`に設定されている場合、完全な状態オブジェクトを提供する必要があります。
この変更により、`store.setState({}, true)`（無効な状態になる）が有効とみなされなくなります。

**例：**

```ts
// 部分的な状態の更新（有効）
store.setState({ key: 'value' })

// 完全な状態の置換（有効）
store.setState({ key: 'value' }, true)

// 不完全な状態の置換（無効）
store.setState({}, true) // エラー
```

#### 動的な`replace`フラグの処理

`replace`フラグの値が動的で実行時に決定される場合、問題が発生する可能性があります。これを処理するには、`replace`パラメータを`setState`関数のパラメータでアノテーションすることで回避できます：

```ts
const replaceFlag = Math.random() > 0.5
const args = [{ bears: 5 }, replaceFlag] as Parameters<
  typeof useBearStore.setState
>
store.setState(...args)
```

#### persistミドルウェアはストア作成時にアイテムを保存しなくなりました

以前、`persist`ミドルウェアはストア作成時に初期状態を保存していました。この動作はv5（およびv4.5.5）で削除されました。

たとえば、次のコードでは、初期状態がストレージに保存されます。

```js
// v4
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCountStore = create(
  persist(
    () => ({
      count: Math.floor(Math.random() * 1000),
    }),
    {
      name: 'count',
    },
  ),
)
```

v5では、これは該当しなくなり、ストア作成後に明示的に状態を設定する必要があります。

```js
// v5
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCountStore = create(
  persist(
    () => ({
      count: 0,
    }),
    {
      name: 'count',
    },
  ),
)
useCountStore.setState({
  count: Math.floor(Math.random() * 1000),
})
```

## リンク

- https://github.com/pmndrs/zustand/pull/2138
- https://github.com/pmndrs/zustand/pull/2580
