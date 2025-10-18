---
title: shallow
description: シンプルなデータを効果的に比較する方法
nav: 27
---

`shallow`は、シンプルなデータ構造に対して高速なチェックを実行できます。
ネストされたオブジェクトや配列を含まないデータ構造を扱う場合、
**トップレベル**のプロパティの変更を効果的に識別します。

> [!NOTE]
> shallowを使用すると高速な比較を実行できますが、その制限に注意してください。

```js
const equal = shallow(a, b)
```

- [型](#types)
  - [シグネチャ](#shallow-signature)
- [リファレンス](#reference)
- [使用法](#usage)
  - [プリミティブの比較](#comparing-primitives)
  - [オブジェクトの比較](#comparing-objects)
  - [Setの比較](#comparing-sets)
  - [Mapの比較](#comparing-maps)
- [トラブルシューティング](#troubleshooting)
  - [オブジェクトの比較が同一でも`false`を返す](#comparing-objects-returns-false-even-if-they-are-identical)
  - [異なるプロトタイプを持つオブジェクトの比較](#comparing-objects-with-different-prototypes)

## 型 {#types}

### シグネチャ {#shallow-signature}

```ts
shallow<T>(a: T, b: T): boolean
```

## リファレンス {#reference}

### `shallow(a, b)`

#### パラメータ

- `a`: 最初の値。
- `b`: 2番目の値。

#### 戻り値

`shallow`は、`a`と`b`が**トップレベル**のプロパティの浅い比較に基づいて等しい場合に`true`を返します。
それ以外の場合は`false`を返します。

## 使用法 {#usage}

### プリミティブの比較 {#comparing-primitives}

`string`、`number`、`boolean`、`BigInt`などのプリミティブ値を比較する場合、
`Object.is`と`shallow`関数の両方が値が同じであれば`true`を返します。
これは、プリミティブ値が参照ではなく実際の値で比較されるためです。

```ts
const stringLeft = 'John Doe'
const stringRight = 'John Doe'

Object.is(stringLeft, stringRight) // -> true
shallow(stringLeft, stringRight) // -> true

const numberLeft = 10
const numberRight = 10

Object.is(numberLeft, numberRight) // -> true
shallow(numberLeft, numberRight) // -> true

const booleanLeft = true
const booleanRight = true

Object.is(booleanLeft, booleanRight) // -> true
shallow(booleanLeft, booleanRight) // -> true

const bigIntLeft = 1n
const bigIntRight = 1n

Object.is(bigIntLeft, bigIntRight) // -> true
shallow(bigIntLeft, bigIntRight) // -> true
```

### オブジェクトの比較 {#comparing-objects}

オブジェクトを比較する場合、`Object.is`と`shallow`関数がどのように動作するかを理解することが重要です。
これらは比較を異なる方法で処理します。

`shallow`関数は`true`を返します。これは、shallowがオブジェクトの浅い比較を実行するためです。
トップレベルのプロパティとその値が同じかどうかをチェックします。この場合、
トップレベルのプロパティ（`firstName`、`lastName`、`age`）とその値が
`objectLeft`と`objectRight`の間で同一であるため、shallowはそれらを等しいとみなします。

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> true
```

### Setの比較 {#comparing-sets}

セットを比較する場合、`Object.is`と`shallow`関数がどのように動作するかを理解することが重要です。
これらは比較を異なる方法で処理します。

`shallow`関数は`true`を返します。これは、shallowがセットの浅い比較を実行するためです。
トップレベルのプロパティ（この場合はセット自体）が同じかどうかをチェックします。
`setLeft`と`setRight`は両方ともSetオブジェクトのインスタンスであり、同じ要素を含むため、
shallowはそれらを等しいとみなします。

```ts
const setLeft = new Set([1, 2, 3])
const setRight = new Set([1, 2, 3])

Object.is(setLeft, setRight) // -> false
shallow(setLeft, setRight) // -> true
```

### Mapの比較 {#comparing-maps}

マップを比較する場合、`Object.is`と`shallow`関数がどのように動作するかを理解することが重要です。
これらは比較を異なる方法で処理します。

`shallow`は`true`を返します。これは、shallowがマップの浅い比較を実行するためです。
トップレベルのプロパティ（この場合はマップ自体）が同じかどうかをチェックします。
`mapLeft`と`mapRight`は両方ともMapオブジェクトのインスタンスであり、同じキーと値のペアを含むため、
shallowはそれらを等しいとみなします。

```ts
const mapLeft = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])
const mapRight = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
])

Object.is(mapLeft, mapRight) // -> false
shallow(mapLeft, mapRight) // -> true
```

## トラブルシューティング {#troubleshooting}

### オブジェクトの比較が同一でも`false`を返す {#comparing-objects-returns-false-even-if-they-are-identical}

`shallow`関数は浅い比較を実行します。浅い比較は、2つのオブジェクトの
トップレベルのプロパティが等しいかどうかをチェックします。ネストされたオブジェクトや
深くネストされたプロパティはチェックしません。言い換えれば、プロパティの参照のみを比較します。

次の例では、shallow関数は`false`を返します。これは、トップレベルのプロパティとその参照のみを
比較するためです。両方のオブジェクトの`address`プロパティはネストされたオブジェクトであり、
その内容は同一ですが、参照は異なります。その結果、shallowはそれらを異なるとみなし、`false`を返します。

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: {
      lat: '-37.3159',
      lng: '81.1496',
    },
  },
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
    geo: {
      lat: '-37.3159',
      lng: '81.1496',
    },
  },
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> false
```

`address`プロパティを削除すると、浅い比較は期待どおりに機能します。
すべてのトップレベルのプロパティがプリミティブ値または同じ値への参照になるためです：

```ts
const objectLeft = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}
const objectRight = {
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
}

Object.is(objectLeft, objectRight) // -> false
shallow(objectLeft, objectRight) // -> true
```

この修正された例では、`objectLeft`と`objectRight`は同じトップレベルのプロパティと
プリミティブ値を持っています。`shallow`関数はトップレベルのプロパティのみを比較するため、
プリミティブ値（`firstName`、`lastName`、`age`）が両方のオブジェクトで同一であるため、
`true`を返します。

### 異なるプロトタイプを持つオブジェクトの比較 {#comparing-objects-with-different-prototypes}

`shallow`関数は、2つのオブジェクトが同じプロトタイプを持っているかどうかをチェックします。
プロトタイプが参照的に異なる場合、shallowは`false`を返します。この比較は次のように行われます：

```ts
Object.getPrototypeOf(a) === Object.getPrototypeOf(b)
```

> [!IMPORTANT]
> オブジェクト初期化子（`{}`）または`new Object()`で作成されたオブジェクトは、
> デフォルトで`Object.prototype`を継承します。ただし、`Object.create(proto)`で作成されたオブジェクトは、
> 渡した`proto`を継承します—これは`Object.prototype`ではない可能性があります。

```ts
const a = Object.create({}) // -> prototypeは `{}`
const b = {} // -> prototypeは `Object.prototype`

shallow(a, b) // -> false
```
