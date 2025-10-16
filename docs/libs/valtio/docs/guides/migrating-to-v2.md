---
title: 'v1からv2への移行方法'
---

# v1からv2への移行方法

## v2での変更点

React 19は、Promiseを処理するための`use`フックを公式に導入しました。
Valtio v1では内部的にPromiseを処理していましたが、これは推奨されなくなりました。
Valtio v2では、Promiseは内部的に処理されず、開発者は`use`フックを使用してPromiseを明示的に管理する必要があります。

注意: まだReact 18を使用している場合は、[`use`フックのshim](https://github.com/dai-shi/react18-use)を使用できます。

Valtio v2は、設計上の選択において2つの微妙な変更も導入しています:

まず、`proxy(obj)`の動作が変更されました。v1では純粋関数で、`obj`を深くコピーしていました。v2では非純粋関数で、`obj`を深く変更します。一般的に、`obj`を再利用することは推奨されません。`obj`を再利用しない限り、何も壊れません。

次に、`useSnapshot()`の動作が変更されました。微妙な変更ですが、`useMemo`と今後のReactコンパイラとの互換性を確保するために最適化が少なくなっています。この変更により、一部のエッジケースで追加の再レンダリングが発生する可能性がありますが、目立たない可能性があります。

その他の注目すべき変更として、最新の状態を保つための以下があります:

- すべての非推奨機能の削除
- Reactバージョン18以上が必要
- TypeScriptバージョン4.5以上が必要
- ビルドターゲットがES2018に更新

## 破壊的変更の移行

### Promiseの解決

```js
// v1
import { proxy, useSnapshot } from 'valtio'

const state = proxy({ data: fetch(...).then((res) => res.json()) })

const Component = () => {
  const snap = useSnapshot(state)
  return <>{JSON.stringify(snap.data)}</>
}
```

```js
// v2
import { use } from 'react'
import { proxy, useSnapshot } from 'valtio'

const state = proxy({ data: fetch(...).then((res) => res.json()) })

const Component = () => {
  const snap = useSnapshot(state)
  return <>{JSON.stringify(use(snap.data))}</>
  // `data`がオブジェクトでない場合、JSXに直接埋め込むことができます。
  // return <>{snap.data}</>
}
```

### 非純粋な`proxy(obj)`

プロキシに渡すオブジェクトを再利用しない場合、何も壊れません。

```js
import { proxy } from 'valtio'

// これはv1とv2の両方で動作します
const state = proxy({ count: 1, obj: { text: 'hi' } })

// これはv1とv2の両方で動作します
state.obj = { text: 'hello' }
```

これが`proxy`を使用する推奨方法です。

何らかの理由でオブジェクトを再利用する場合、v1と同じ動作を維持するには、v2で明示的に`deepClone`を使用する必要があります。

```js
// v1
import { proxy } from 'valtio'

const initialObj = { count: 1, obj: { text: 'hi' } }
const state = proxy(initialObj)
// そして後で`initialObj`で何かを行う

const newObj = { text: 'hello' }
state.obj = newObj
// そして後で`newObj`で何かを行う
```

```js
// v2
import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'

const initialObj = { count: 1, obj: { text: 'hi' } }
const state = proxy(deepClone(initialObj))
// そして後で`initialObj`で何かを行う

const newObj = { text: 'hello' }
state.obj = deepClone(newObj)
// そして後で`newObj`で何かを行う
```

### `useLayoutEffect`サーバー警告

React 18でSSRを使用している場合、過度の警告を防ぐためにこの条件を追加してください。

```js
import { snapshot, useSnapshot as useSnapshotOrig } from 'valtio'

const isSSR = typeof window === 'undefined'
export const useSnapshot = isSSR ? (p) => snapshot(p) : useSnapshotOrig

// 通常通り`useSnapshot`でレンダリング
```

## リンク

- https://github.com/pmndrs/valtio/discussions/703
- https://github.com/pmndrs/valtio/pull/810
