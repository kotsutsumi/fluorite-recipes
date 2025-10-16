---
title: 'ステートの分割と組み合わせ方法'
---

# ステートの分割と組み合わせ方法

## ステートを分割できます

ネストされたオブジェクトを持つステートを作成します。

```js
const state = proxy({
  obj1: { a: 1 },
  obj2: { b: 2 },
})
```

その後、ステートを分割できます。これらは両方ともプロキシです。

```js
const obj1State = state.obj1
const ojb2State = state.obj2
```

## ステートを組み合わせることができます

ステートを作成してから、それらを組み合わせることができます。

```js
const obj1State = proxy({ a: 1 })
const obj2State = proxy({ a: 2 })

const state = proxy({
  obj1: obj1State,
  obj2: obj2State,
})
```

これは前の例と同等に機能します。

## 循環ステートを作成できます

使用例は少ないかもしれませんが、循環構造を作成できます。

```js
const state = proxy({
  obj: { foo: 3 },
})

state.obj.bar = state.obj // 🤯
```
