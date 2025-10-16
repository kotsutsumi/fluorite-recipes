---
title: 'snapshot'
section: 'API'
subSection: 'Advanced'
description: '現在の状態のスナップショットを作成する'
---

# `snapshot`

`snapshot` は proxy を受け取り、プロキシからアンラップされたイミュータブル（不変）なオブジェクトを返します。

イミュータビリティは、オブジェクトを_効率的に_ディープコピーして凍結することで実現されます（詳細は [Copy on Write](#copy-on-write) セクションを参照してください）。

簡単に言うと、`snapshot` を連続して呼び出す際、proxy 内の値が変更されていない場合、前回のスナップショットのオブジェクト参照が返されます。これにより、レンダー関数内で浅い比較が可能になり、不要な再レンダーを防ぐことができます。

スナップショットは Promise をスローするため、React Suspense と連携して動作します。

```js
import { proxy, snapshot } from 'valtio'

const store = proxy({ name: 'Mika' })
const snap1 = snapshot(store) // 現在の store の値の効率的なコピー、プロキシ化されていない
const snap2 = snapshot(store)
console.log(snap1 === snap2) // true、再レンダーする必要なし

store.name = 'Hanna'
const snap3 = snapshot(store)
console.log(snap1 === snap3) // false、再レンダーすべき
```

## Copy on Write

スナップショットは状態全体のディープコピーですが、更新時には遅延 copy-on-write メカニズムを使用するため、実際には迅速に維持されます。

例えば、次のようなネストされたオブジェクトがある場合:

```js
const author = proxy({
  firstName: 'f',
  lastName: 'l',
  books: [{ title: 't1' }, { title: 't2' }],
})

const s1 = snapshot(author)
```

最初の `snapshot` 呼び出しは、4つの新しいインスタンスを作成します:

- author 用に1つ
- books 配列用に1つ
- book オブジェクト用に2つ

2番目の book をミューテートして、新しい `snapshot` を取得すると:

```js
author.books[1].title = 't2b'
const s2 = snapshot(author)
```

`s2` は新しいコピーを持つことになります。
