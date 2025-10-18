---
title: 'proxy'
section: 'API'
subSection: 'Basic'
description: 'プロキシオブジェクトを作成します。'
---

# `proxy`

`proxy` は元のオブジェクトとすべてのネストされたオブジェクトへの変更を追跡し、オブジェクトが変更されたときにリスナーに通知します。

```js
import { proxy } from 'valtio'

const state = proxy({ count: 0, text: 'hello' })
```

## どこからでも変更可能

通常のJavaScriptオブジェクトと同じ方法で変更できます。

```js
setInterval(() => {
  ++state.count
}, 1000)
```

## 最適化: noop とバッチング

プロパティの値を同じ値に設定する更新は無視されます。サブスクライバーにはバージョン変更が通知されません。

```js
const state = proxy({ count: 0 })

state.count = 0 // 効果なし
```

同じイベントループティック内の複数の変更はバッチ処理されます。サブスクライバーには1つのバージョン変更が通知されます。

```js
const state = proxy({ count: 0, text: 'hello' })
// サブスクライバーは両方の変更後に1回だけ通知されます
state.count = 1
state.text = 'world'
```

## ネストされたプロキシ

プロキシは他の `proxy` オブジェクト内にネストでき、全体として更新できます。

```jsx
import { proxy, useSnapshot } from 'valtio'

const personState = proxy({ name: 'Timo', role: 'admin' })
const authState = proxy({ status: 'loggedIn', user: personState })

authState.user.name = 'Nina'
```

## プロキシ内のPromise

詳細については [`async`](../../guides/async) を参照してください。

```jsx
import { proxy } from 'valtio'

const bombState = proxy({
  explosion: new Promise((resolve) => setTimeout(() => resolve('Boom!'), 3000)),
})
```

## 注意点

プロキシを完全に新しいオブジェクトに再代入すると、プロキシ化されたオブジェクトを新しいオブジェクト参照に置き換えることになるため、機能しなくなります。

```jsx
let state = proxy({ user: { name: 'Timo' } })

subscribe(state, () => {
  console.log(state.user.name)
})
// サブスクライバーに通知されません
state = { user: { name: 'Nina' } }

// 代わりに以下のようにします
let state = proxy({ user: { name: 'Timo' } })

subscribe(state, () => {
  console.log(state.user.name) // "Nina" とログ出力されます
})
// サブスクライバーに通知されます
state.user.name = 'Nina'
```

すべてをプロキシ化できるわけではありません。一般的に、シリアライズ可能であれば安全です。クラスもプロキシ化できます。ただし、特殊なオブジェクトは避けてください。

```jsx
// これらは機能しません - これらのオブジェクトへの変更は更新を引き起こしません
// プロキシ化されていない状態を保存する方法については ref のドキュメントを参照してください
const state = proxy({
  chart: d3.select('#chart'),
  component: React.createElement('div'),
  map: new Map(), // proxyMap を参照
  storage: localStorage,
})

// これは機能します
class User {
  first = null
  last = null
  constructor(first, last) {
    this.first = first
    this.last = last
  }
  greet() {
    return `Hi ${this.first}!`
  }
  get fullName() {
    return `${this.first} ${this.last}`
  }
}
const state = proxy(new User('Timo', 'Kivinen'))
```
