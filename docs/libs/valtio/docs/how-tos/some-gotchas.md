---
title: 'いくつかの落とし穴'
---

# いくつかの落とし穴

## プロパティアクセスなしの`useSnapshot(state)`は常に再レンダリングをトリガーします

参考: https://github.com/pmndrs/valtio/issues/209#issuecomment-896859395

このステート（またはストア）があると仮定します。

```js
const state = proxy({
  obj: {
    count: 0,
    text: 'hello',
  },
})
```

countにアクセスしてスナップショットを使用する場合、

```js
const snap = useSnapshot(state)
snap.obj.count
```

`count`が変更された場合にのみ再レンダリングされます。

プロパティアクセスがobjの場合、

```js
const snap = useSnapshot(state)
snap.obj
```

`obj`が変更された場合に再レンダリングされます。これには`count`の変更と`text`の変更が含まれます。

さて、ステートの一部をサブスクライブできます。

```js
const snapObj = useSnapshot(state.obj)
snapObj
```

これは技術的には前のものと同じです。`snapObj`のプロパティには触れていないので、`obj`が変更されると再レンダリングされます。

要約すると、スナップショットオブジェクト（ネストされているかどうかに関わらず）がプロパティでアクセスされない場合、オブジェクト全体がアクセスされたと見なされるため、オブジェクト内の変更は再レンダリングをトリガーします。

## オブジェクトpropsで`React.memo`を使用すると予期しない動作が発生する可能性があります（v1のみ）

⚠️ この動作はv2で修正されています。

`useSnapshot(state)`によって返される`snap`変数は、レンダリング最適化のために追跡されます。
`snap`または`snap`内のオブジェクトを`React.memo`を持つコンポーネントに渡すと、
`React.memo`はオブジェクトプロパティへのタッチをスキップできるため、期待通りに機能しない可能性があります。

補足: [react-tracked](https://react-tracked.js.org)には、回避策として特別な`memo`がエクスポートされています。

いくつかのオプションがあります:

<ol type="a">
  <li>`React.memo`を使用しない。</li>
  <li>
    `React.memo`を持つコンポーネントにオブジェクトを渡さない（代わりにプリミティブ値を渡す）。
  </li>
  <li>
    その要素のプロキシを渡し、そのプロキシで`useSnapshot`を使用する。
  </li>
</ol>

### (b)の例

```jsx
const ChildComponent = React.memo(
  ({
    title, // stringやその他のプリミティブ値は問題ありません。
    description, // stringやその他のプリミティブ値は問題ありません。
    // obj, // オブジェクトは避けるべきです。
  }) => (
    <div>
      {title} - {description}
    </div>
  ),
)

const ParentComponent = () => {
  const snap = useSnapshot(state)
  return (
    <div>
      <ChildComponent
        title={snap.obj.title}
        description={snap.obj.description}
      />
    </div>
  )
}
```

### (c)の例

```jsx
const state = proxy({
  objects: [
    { id: 1, label: 'foo' },
    { id: 2, label: 'bar' },
  ],
})

const ObjectList = React.memo(() => {
  const stateSnap = useSnapshot(state)

  return stateSnap.objects.map((object, index) => (
    <Object key={object.id} objectProxy={state.objects[index]} />
  ))
})

const Object = React.memo(({ objectProxy }) => {
  const objectSnap = useSnapshot(objectProxy)

  return objectSnap.bar
})
```

## 関数コンポーネントで`state`と`snap`をいつ使用するか

- snapはレンダー関数で使用する必要があり、その他のすべてのケースではstateを使用します。
- コールバック関数はレンダーボディ内にないため、stateを使用する必要があります。

```javascript
const Component = () => {
  // これはレンダーボディ内です
  const handleClick = () => {
    // これはレンダーボディ内ではありません
  }
  return <button onClick={handleClick}>button</button>
}
```

- useEffectのdepsは、snapからプリミティブ値を抽出して使用する必要があります。例: `const { num, string, bool } = snap.watchObj`。
- 他のステート値に基づいてステート値を変更する場合（コンポーネント内のpropsなどの値を含まない）、できればreact外で行う必要があります。

```javascript
subscribe(state.subscribeData, async () => {
  state.results = await load(state.someData)
})
```

## `array` `proxy`の問題

次のユースケースは、`arr`のサブスクリプションで予期しない結果を引き起こす可能性があります:

```javascript
const byId = {}
arr.forEach((item) => {
  byId[item.id] = item
})
arr.splice(0, arr.length)
arr.push(newValue())
someUpdateFunc(byId)
Object.keys(byId).forEach((key) => arr.push(byId[key]))
```

後続のステップで配列プロキシ参照を処理する際に[問題](https://github.com/pmndrs/valtio/issues/712)が発生する可能性があります:

<ol type="a">
  <li>配列プロキシをサブスクライブ</li>
  <li>プロキシをスナップショットとして使用</li>
  <li>更新用の一時変数を割り当て</li>
  <li>配列からプロキシを削除</li>
  <li>一時変数を更新</li>
  <li>一時変数を元の配列にプッシュ</li>
</ol>

**問題のケース例:**

```javascript
const a = proxy([
  {
    nested: {
      nested: {
        test: 'apple',
      },
    },
  },
])

const sa = snapshot(a) // b.

// a.
subscribe(a, () => {
  const updated = snapshot(a)
  console.log('this is updated proxy. test is Banana', a)
  console.log('however, for the snapshot of a, test is still apple', updated)
})

function handle() {
  const temp = a[0] // c.
  a.splice(0, 1) // d.
  temp.nested.nested.test = 'Banana' // e.
  a.push(temp) // f.
  console.log(Object.is(temp, a[0])) // これはtrueになります
}
```

**この問題を回避するには、dとeを入れ替えます:**

```javascript
// ...

function handle() {
  const temp = a[0]
  temp.nested.nested.test = 'Banana' // 配列から削除する前に最初に更新
  a.splice(0, 1)
  a.push(temp)
}
// ...
```

回避策が適用されず、[devtools()](https://valtio.pmnd.rs/docs/api/utils/devtools)を使用してreactを使用している場合、redux devtoolsは値の更新を通知しますが、devtoolsのサブスクリプション内ではスナップショットは同じままです。

その結果、devtoolsは状態の変更を表示しません。

さらに、この問題はdevtoolsの更新だけでなく、`re-render`のトリガーにも関係しています。

## `react`以外のライブラリ（solidjsなど）を使用する場合のインポートの問題

Valtioはreact内で動作する必要はありませんが、reactを念頭に置いて構築されました。このため、メインの`valtio`モジュールは、便宜上、バニラモジュールと一緒にreactモジュールをエクスポートします。つまり、メインの`valtio`モジュールまたは`valtio/utils`サブモジュールから非reactプロジェクトにインポートしようとすると、次のようなビルドエラーが発生する可能性があります:

```
 node_modules/.pnpm/valtio@2.1.4/node_modules/valtio/esm/react.mjs (2:18): "useRef" is not exported by "__vite-optional-peer-dep:react:valtio", imported by "node_modules/.pnpm/valtio@2.1.4/node_modules/valtio/esm/react.mjs".
```

これは、メインのvaltioモジュールがフレームワークに依存しない機能とReact固有の機能の両方をエクスポートしているために発生し、必要でない場合でもRollupのようなビルドツールがReactの依存関係を探すことになります。

しかし、これには簡単な修正があります。次のようにメインの`valtio`モジュールからインポートする代わりに:

```ts
import { proxy, snapshot, subscribe } from 'valtio'
```

フレームワークに依存しない`vanilla`サブモジュールから直接インポートできます:

```ts
import { proxy, snapshot, subsribe } from 'valtio/vanilla'
// これはutilsにも適用されます
import { proxyMap, deepClone } from 'valtio/vanilla/utils'
```
