---
title: 'subscribe'
section: 'API'
subSection: 'Advanced'
description: '現在の状態/オブジェクトを購読する'
---

# `subscribe`

## どこからでも購読する

コンポーネントの外部から状態にアクセスし、変更を購読できます。

```jsx
import { proxy, subscribe } from 'valtio'

const state = proxy({ count: 0 })

// state proxy（およびその子 proxy）のすべての変更を購読する
const unsubscribe = subscribe(state, () =>
  console.log('state has changed to', state),
)
// 結果を呼び出して購読を解除する
unsubscribe()
```

状態の一部を購読することもできます。

```jsx
const state = proxy({ obj: { foo: 'bar' }, arr: ['hello'] })

subscribe(state.obj, () => console.log('state.obj has changed to', state.obj))
state.obj.foo = 'baz'
subscribe(state.arr, () => console.log('state.arr has changed to', state.arr))
state.arr.push('world')
```

## VanillaJS での Codesandbox デモ

https://codesandbox.io/s/valtio-photo-booth-demo-forked-xp8hs?file=/src/main.js
