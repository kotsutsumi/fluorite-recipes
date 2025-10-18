---
title: 'Valtioの仕組み'
---

# Valtioの仕組み

参考: https://github.com/pmndrs/valtio/issues/171

これはvaltioの高レベルな抽象化について説明するものです。

## 記事

- [How Valtio Proxy State Works (Vanilla Part)](https://blog.axlight.com/posts/how-valtio-proxy-state-works-vanilla-part/)
- [How Valtio Proxy State Works (React Part)](https://blog.axlight.com/posts/how-valtio-proxy-state-works-react-part/)

## 例

### 例で学ぶ`proxy()`

```js
import { proxy, subscribe } from 'valtio'

const s1 = proxy({})
subscribe(s1, () => {
  console.log('s1 is changed!')
})
s1.a = 1 // s1 is changed!
++s1.a // s1 is changed!
delete s1.a // s1 is changed!
s1.b = 2 // s1 is changed!
s1.b = 2 // (not changed)
s1.obj = {} // s1 is changed!
s1.obj.c = 3 // s1 is changed!
const s2 = s1.obj
subscribe(s2, () => {
  console.log('s2 is changed!')
})
s1.obj.d = 4 // s1 is changed! and s2 is changed!
s2.d = 5 // s1 is changed! and s2 is changed!
const s3 = proxy({})
subscribe(s3, () => {
  console.log('s3 is changed!')
})
s1.o = s3
s3.p = 'hello' // s1 is changed! and s3 is changed!
s2.q = s3
s3.p = 'hi' // s1 is changed! s2 is changed! and s3 is changed!
s1.x = s1
s1.a += 1 // s1 is changed!
```

### 例で学ぶ`snapshot()`

```js
import { proxy, snapshot } from 'valtio'

const p = proxy({})
const s1 = snapshot(p) // は {} ですが、プロキシでラップされていません
const s2 = snapshot(p)
s1 === s2 // pが変更されていないため、trueです
p.a = 1 // プロキシを変更
const s3 = snapshot(p) // は { a: 1 }
p.a = 1 // 変更は無視され、プロキシは更新されません
const s4 = snapshot(p)
s3 === s4 // まだtrueです
p.a = 2 // 変更します
const s5 = snapshot(p) // は { a: 2 }
p.a = 1 // 元に戻します
const s6 = snapshot(p) // 新しいスナップショットを作成します
s3 !== s6 // はtrue（異なるスナップショット、deep equalであっても）
p.obj = { b: 2 } // 新しいオブジェクトをアタッチ、プロキシでラップされます
const s7 = snapshot(p) // は { a: 1, obj: { b: 2 } }
p.a = 2 // pを変更
const s8 = snapshot(p) // は { a: 2, obj: { b: 2 } }
s7 !== s8 // aが異なるため、trueです
s7.obj === s8.obj // objは変更されていないため、trueです
```

### 例で学ぶ`useSnapshot()`

```jsx
import { proxy, useSnapshot } from 'valtio'

const s1 = proxy({
  counter: 0,
  text: 'Good morning from valtio',
  foo: {
    boo: 'baz'
  }
})

const MyComponent = () => {
  // 分割代入を使用
  const { text, counter } = useSnapshot(state)

  // 多層の分割代入も機能します
  const { text, counter, { foo }} = useSnapshot(state)

  // スナップショットオブジェクトへの割り当て
  const snap = useSnapshot(state)


  return (() => {
    <div id="main">
      <h1>{ `${foo} - ${text}` }</h1>
      {/* - または - */}
      <h1>{ `${snap.foo.bar} = `${snap.text}}</h1>
      <div>
        <input
          type="input"

          {/* 読み取りにはスナップショットを使用します */}
          value={text}

          {/* 上の行は以下と同等です */}
          value={snap.text}

          {/* 変更にはプロキシ(s1)を使用します */}
          onChange={e => {
            s1.text = e.target.value
          }}
        />
      </div>
      <div>
        { counter }
        <button onClick={() => s1.counter++}> + </button>
        <button onClick={() => s1.counter--}> - </button>
      </di>
    </div>
  })

}
```

## 未整理のメモ

### 2種類のプロキシ

valtioには、書き込み用と読み取り用の2種類のプロキシがあります。フックと並行Reactのために、これらを意図的に分離しています。

`proxy()`は変更を検出するためのプロキシオブジェクトを作成します「書き込み用プロキシ」
`snapshot()`はプロキシオブジェクトから不変のオブジェクトを作成します
`useSnapshot()`は、プロパティアクセスを検出するために、スナップショットオブジェクトを別のプロキシ（`proxy-compare`を使用）で再度ラップします「読み取り用プロキシ」

### スナップショット作成は最適化されています

```js
const state = proxy({ a: { aa: 1 }, b: { bb: 2 } })
const snap1 = snapshot(state)
console.log(snap1) // ---> { a: { aa: 1 }, b: { bb: 2 } }
++state.a.aa
const snap2 = snapshot(state)
console.log(snap2) // ---> { a: { aa: 2 }, b: { bb: 2 } }
snap1.b === snap2.b // これは`true`です。プロパティが変更されていないため、新しいスナップショットは作成されません。
```

### valtio実装の詳細についてのメモ

valtioのプロキシには1つの目標しかありません:不変のスナップショットオブジェクトを作成すること

いくつかの設計原則:

1. スナップショットはオンデマンドで作成されます
2. 変更はバージョン番号でのみ追跡されます
3. サブスクリプションは更新(バージョン)の通知に使用されます
4. バージョン番号は実装の詳細として隠されています
5. プロキシは基本的にバージョンとサブスクリプションにのみ使用されます
6. スナップショット作成はバージョン番号で最適化されます

実装についてのメモ:

1. プロキシはネストできます（初期化時に作成）
2. プロキシは循環構造を持つことができます（それを検出するためのglobalVersion）

promise処理についてのメモ:

1. プロキシはpromiseを持つことができますが、何もしません
2. スナップショットを作成する際、解決された値を保存します
3. 解決されていない場合、特殊なオブジェクトがpromise/errorをthrowします
