# Actionの整理方法

Valtioはactionの整理方法について意見を持ちません。
様々なパターンが可能であることを示すいくつかのレシピを紹介します。

## モジュール内で定義されたAction関数

> ℹ️ 注意
>
> この方法は、コード分割に優れているため推奨されます。

```js
import { proxy } from 'valtio'

export const state = proxy({
  count: 0,
  name: 'foo',
})

export const inc = () => {
  ++state.count
}

export const setName = (name) => {
  state.name = name
}
```

## モジュール内で定義されたActionオブジェクト

```js
import { proxy } from 'valtio'

export const state = proxy({
  count: 0,
  name: 'foo',
})

export const actions = {
  inc: () => {
    ++state.count
  },
  setName: (name) => {
    state.name = name
  },
}
```

## state内で定義されたActionメソッド

```js
export const state = proxy({
  count: 0,
  name: 'foo',
  inc: () => {
    ++state.count
  },
  setName: (name) => {
    state.name = name
  },
})
```

## `this`を使用したActionメソッド

```js
export const state = proxy({
  count: 0,
  name: 'foo',
  inc() {
    ++this.count
  },
  setName(name) {
    this.name = name
  },
})
```

## classの使用

```js
class State {
  count = 0
  name = 'foo'
  inc() {
    ++this.count
  }
  setName(name) {
    this.name = name
  }
}

export const state = proxy(new State())
```
