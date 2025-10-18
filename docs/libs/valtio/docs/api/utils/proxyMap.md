---
title: 'proxyMap'
section: 'API'
subSection: 'Utils'
description: ''
---

# `proxyMap`

## 理由

ネイティブの `Map` は、観察できない内部スロットにデータを格納します。これは、`valtio` がネイティブ `Map` 内のデータへの変更を追跡できないことを意味します。`proxyMap` は、valtioがデータへの変更を追跡できるようにしながら、`Map` の動作を模倣するプロキシを作成できるユーティリティです。

## `proxyMap` を使用するタイミング

`proxyMap` は、`Map` の柔軟性が必要でありながら、データへの変更を追跡したい場合に便利です。扱うデータの構造が分からず、このデータがプリミティブでない値をキーとして持つ可能性がある場合（例:オブジェクト、配列など）に便利です。この場合、`proxyMap` を使用して、valtioがデータへの変更を追跡できるようにしながら、`Map` の動作を模倣するプロキシを作成できます。データを単純なオブジェクトとして表現できる場合は、代わりに単純なオブジェクトで `proxy` を使用する必要があります。その方がパフォーマンスが高く、使いやすいです。

## ValtioでJavaScript Mapを使用

このユーティリティは、ネイティブのMap動作を模倣するプロキシを作成します。APIはMap APIと同じです。

```js
import { proxyMap } from 'valtio/utils'

const state = proxyMap()
state.size // ---> 0

state.set(1, 'hello')
state.size // ---> 1

state.delete(1)
state.size // ---> 0
```

## ネスト

`proxy` の中でも使用できます。

```js
import { proxyMap } from 'valtio/utils'

const state = proxy({
  count: 1,
  map: proxyMap(),
})
```

オブジェクトをキーとして使用する場合、`ref` でラップしてプロキシ化されないようにすることができます。これは、キーの等価性を保持したい場合に便利です。

```js
import { proxyMap } from 'valtio/utils'

// refを使用
```
