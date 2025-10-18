---
title: 'derive'
section: 'API'
subSection: 'Utils'
description: '他のプロキシから派生した新しいプロキシを作成'
---

## `derive`

## インストール

```bash
npm install derive-valtio
```

#### 他のプロキシから派生した新しいプロキシを作成

`get` を使用していくつかのプロキシをサブスクライブして、新しい値を計算するために使用されるスナップショットを作成できます。

```js
import { derive } from 'derive-valtio'

// ベースプロキシを作成
const state = proxy({
  count: 1,
})

// 派生プロキシを作成
const derived = derive({
  doubled: (get) => get(state).count * 2,
})

// または、既存のプロキシに派生プロパティをアタッチ
derive(
  {
    tripled: (get) => get(state).count * 3,
  },
  {
    proxy: state,
  },
)
```

## `underive`

## 評価を停止

場合によっては、プロキシを派生した後にサブスクライブを解除したい場合があります。そのためには、`underive` ユーティリティを使用します。サブスクライブを解除したいプロパティを示すキーを渡すこともできます。`delete` オプションを指定すると、プロパティが削除され、新しい派生プロパティをアタッチできます。

```js
import { derive, underive } from 'derive-valtio'
const state = proxy({
  count: 1,
})

const derivedState = derive({
  doubled: (get) => get(state).count * 2,
})

underive(derivedState)
```

## 使用パターン

### 関連しないプロパティが変更されたときに再計算される

`derive` を使用すると、ベースプロキシの任意のプロパティが変更された場合に計算が発生します。例:

```javascript
const baseProxy = proxy({
  counter1: 0,
  counter2: 0,
  counter3: 0,
  counter4: 0,
})

const countersOneAndTwoSelectors = derive({
  sum: (get) => get(baseProxy).counter1 + get(baseProxy).counter2,
})
```

この例では、`baseProxy.counter3` または `baseProxy.counter4` が変更された場合でも、`sum` の計算が発生します。
