---
title: 'proxySet'
section: 'API'
subSection: 'Utils'
description: ''
---

# `proxySet`

## 理由

ネイティブの `Set` は、観察できない内部スロットにデータを格納します。これは、`valtio` がネイティブ `Set` 内のデータへの変更を追跡できないことを意味します。`proxySet` は、valtioがデータへの変更を追跡できるようにしながら、`Set` の動作を模倣するプロキシを作成できるユーティリティです。

## `proxySet` を使用するタイミング

`proxySet` は、`Set` の機能が必要でありながら、データへの変更を追跡したい場合に便利です。`proxySet` は、一意の値を格納したい場合や、データに対して和集合、積集合、差集合などの数学的な `Set` 演算を実行したい場合に便利です。`proxySet` は、`Set` に導入されたすべての新しいメソッドをサポートしています:

- `intersection`
- `union`
- `difference`
- `symmetricDifference`
- `isSubsetOf`
- `isSupersetOf`
- `isDisjointFrom`

`proxySet` がサポートするメソッドの完全なリストは、[MDNドキュメント](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)で確認できます。

データを単純な配列やオブジェクトとして表現でき、`proxySet` が提供する追加機能が必要ない場合は、代わりに単純な配列やオブジェクトで `proxy` を使用する必要があります。その方がパフォーマンスが高く、使いやすいです。

## ValtioでJavaScript `Set` を使用

このユーティリティは、ネイティブの `Set` 動作を模倣するプロキシを作成します。APIはネイティブの `Set` APIと同じです。

```js
import { proxySet } from 'valtio/utils'

const state = proxySet([1, 2, 3])

state.add(4)
state.delete(1)
state.forEach((v) => console.log(v)) // --->  2,3,4
```

## ネスト

`proxy` の中でも使用できます。
