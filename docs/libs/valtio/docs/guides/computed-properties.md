---
title: 'Computed Properties'
section: 'Advanced'
description: 'オブジェクトのgetterとsetterを使用する'
---

# Computed Properties

Valtioでは、オブジェクトとクラスのgetterとsetterを使用して算出プロパティを作成できます。

<br />

> ℹ️ 注意
>
> JavaScriptのgetterは言語のより高度な機能であるため、Valtioでは注意して使用することを推奨します。とはいえ、より上級のJavaScriptプログラマーであれば、期待通りに動作するはずです。以下の「`this`の使用に関する注意」セクションを参照してください。

<br />

<br />

## シンプルなオブジェクトgetter

```js
const state = proxy({
  count: 1,
  get doubled() {
    return this.count * 2
  },
})
console.log(state.doubled) // 2

// スナップショットでのgetter呼び出しは期待通りに動作します
const snap = snapshot(state)
console.log(snap.doubled) // 2

// stateプロキシでcountが変更されたとき
state.count = 10
// スナップショットの算出プロパティは変更されません
console.log(snap.doubled) // 2
```

`state`プロキシで`state.doubled`を呼び出すと、キャッシュされず、呼び出しごとに再計算されます(この結果をキャッシュする必要がある場合は、以下の`proxy-memoize`のセクションを参照してください)。

ただし、スナップショットを作成すると、`snap.doubled`の呼び出しは事実上キャッシュされます。これは、オブジェクトgetterの値がスナップショットプロセス中にコピーされるためです。

<br />

> ℹ️ 注意
>
> 現在の実装では、算出プロパティは**兄弟**プロパティのみを参照する必要があります。そうでない場合、奇妙なバグに遭遇します。例えば:

<br />

```js
const user = proxy({
  name: 'John',
  // OK - `this`を介して兄弟プロパティを参照できます
  get greetingEn() {
    return 'Hello ' + this.name
  },
})
```

```js
const state = proxy({
  // ネストされていても可能
  user: {
    name: 'John',
    // OK - `this`を介して兄弟プロパティを参照できます
    get greetingEn() {
      return 'Hello ' + this.name
    },
  },
})
```

```js
const state = proxy({
  user: {
    name: 'John',
  },
  greetings: {
    // 誤り - `this`は`state.greetings`を指します。
    get greetingEn() {
      return 'Hello ' + this.user.name
    },
  },
})
```

```js
const user = proxy({
  name: 'John',
})
const greetings = proxy({
  // 誤り - `this`は`greetings`を指します。
  get greetingEn() {
    return 'Hello ' + this.name
  },
})
```

回避策は、関連するオブジェクトをプロパティとしてアタッチすることです。

```js
const user = proxy({
  name: 'John',
})
const greetings = proxy({
  user, // `user`プロキシオブジェクトをアタッチ
  // OK - `this`を介してuserプロパティを参照できます
  get greetingEn() {
    return 'Hello ' + this.user.name
  },
})
```

別の方法として、個別のプロキシを作成し、`subscribe`で同期することもできます。

```js
const user = proxy({
  name: 'John',
})
const greetings = proxy({
  greetingEn: 'Hello ' + user.name,
})
subscribe(user, () => {
  greetings.greetingEn = 'Hello ' + user.name
})
```

または`watch`を使用します。

```js
const user = proxy({
  name: 'John',
})
const greetings = proxy({})
watch((get) => {
  greetings.greetingEn = 'Hello ' + get(user).name
})
```

## オブジェクトのgetterとsetter

setterもサポートされています:

```js
const state = proxy({
  count: 1,
  get doubled() {
    return state.count * 2
  },
  set doubled(newValue) {
    state.count = newValue / 2
  },
})

// stateでのsetter呼び出しは期待通りに動作します
state.doubled = 4
console.log(state.count) // 2

// スナップショットでのgetter呼び出しは期待通りに動作します
const snap = snapshot(state)
console.log(snap.doubled) // 4

// そしてスナップショットでのsetter呼び出しは期待通りに失敗します
// コンパイルエラー: Cannot assign to 'doubled' because it is a read-only property.
// ランタイムエラー: TypeError: Cannot assign to read only property 'doubled' of object '#<Object>'
snap.doubled = 2
```

getterと同様に、`set doubled`内のsetter呼び出し(つまり`this.count = newValue / 2`)は、それ自体が`state`プロキシに対して呼び出されるため、新しい`count`値が正しく更新されます(そして、サブスクライバー/スナップショットに新しい変更が通知されます)。

スナップショットを作成すると、すべてのプロパティが読み取り専用になるため、`snap.doubled = 2`はコンパイルエラーになり、`snapshot`オブジェクトがフリーズされているため、ランタイムでも失敗します。

## クラスのgetterとsetter

クラスのgetterとsetterは、オブジェクトのgetterとsetterと実質的に同じように動作します:

```js
class Counter {
  count = 1
  get doubled() {
    return this.count * 2
  }
  set doubled(newValue) {
    this.count = newValue / 2
  }
}

const state = proxy(new Counter())
const snap = snapshot(state)

// stateの変更は期待通りに動作します
state.doubled = 4
console.log(state.count) // 2
// そしてスナップショット値は変更されません
console.log(snap.doubled) // 2
```

オブジェクトgetterと同様に、`state`プロキシのクラスgetterはキャッシュされません。

ただし、オブジェクトgetterとは異なり、`snapshot`オブジェクトのクラスgetterはキャッシュされず、`snap.doubled`へのアクセスごとに再評価されます。`snapshot`のドキュメントで述べられているように、getterの評価はキャッシュするのと同じくらい安価であることが期待されるため、これは問題ないはずです。

また、スナップショットでのオブジェクトsetter(呼び出されるとすぐにランタイムで失敗する)とは異なり、スナップショットでのクラスsetterは技術的には評価を開始しますが、内部で行う変更(つまり`this.count = newValue / 2`)は、`this`がスナップショットインスタンスになり、スナップショットが`Object.freeze`によってフリーズされているため、ランタイムで失敗します。

## `proxy-memoize`を使用した状態使用追跡

`state`プロキシ自体に対してもgetter結果をキャッシュする必要がある場合は、Valtioの姉妹プロジェクト[proxy-memoize](https://github.com/dai-shi/proxy-memoize)を使用できます。

`proxy-memoize`は、Valtioの`snapshot`関数と同様の使用ベースの追跡アプローチを使用するため、getterロジックでアクセスされたフィールドが実際に変更された場合にのみgetterを再計算します。

```js
import { memoize } from 'proxy-memoize'

const memoizedDoubled = memoize((snap) => snap.count * 2)

const state = proxy({
  count: 1,
  text: 'hello',
  get doubled() {
    return memoizedDoubled(snapshot(state))
  },
})
```

この実装では、`text`プロパティが変更されたとき(`count`は変更されていない)、メモ化された関数は再実行されません。

## `this`の使用に関する注意

getterとsetterの内部で`this`を使用できますが、JSの`this`がどのように機能するかを理解しておく必要があります。基本的に、`this`は呼び出しを行ったオブジェクトになります。

したがって、`state.doubled`を呼び出すと、`this`は`state`プロキシになります。

そして、`snap.doubled`を呼び出すと、`this`はスナップショットオブジェクトになります(オブジェクトのgetterとsetterを除く。現在の値はスナップショットプロセス中にコピーされるため、オブジェクトのgetterとsetterはスナップショットで呼び出されることはありません)。

このニュアンスにもかかわらず、`this`を期待通りに使用でき、物事は「うまく動作する」はずです。
