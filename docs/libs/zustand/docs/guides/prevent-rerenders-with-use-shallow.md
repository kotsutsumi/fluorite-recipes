---
title: useShallowで再レンダリングを防ぐ
nav: 15
---

ストアから計算された状態をサブスクライブする必要がある場合、推奨される方法はセレクターを使用することです。

計算されたセレクターは、[Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is?retiredLocale=it)に従って出力が変更された場合に再レンダリングを引き起こします。

この場合、計算された値が常に前の値と浅く等しい場合に再レンダリングを避けるために、`useShallow`を使用したい場合があります。

## 例

各くまに食事が関連付けられているストアがあり、その名前をレンダリングしたいとします。

```js
import { create } from 'zustand'

const useMeals = create(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  littleBear: 'A little, small, wee pot',
}))

export const BearNames = () => {
  const names = useMeals((state) => Object.keys(state))

  return <div>{names.join(', ')}</div>
}
```

今、パパくまはピザが欲しくなりました：

```js
useMeals.setState({
  papaBear: 'a large pizza',
})
```

この変更により、`names`の実際の出力が浅い等価性に従って変更されていないにもかかわらず、`BearNames`が再レンダリングされます。

`useShallow`を使用してこれを修正できます！

```js
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useMeals = create(() => ({
  papaBear: 'large porridge-pot',
  mamaBear: 'middle-size porridge pot',
  littleBear: 'A little, small, wee pot',
}))

export const BearNames = () => {
  const names = useMeals(useShallow((state) => Object.keys(state)))

  return <div>{names.join(', ')}</div>
}
```

これで、みんなが他の食事を注文しても、`BearNames`コンポーネントの不要な再レンダリングが発生しなくなります。
