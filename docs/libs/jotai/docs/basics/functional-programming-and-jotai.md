# 関数型プログラミングとJotai

## 予期しない類似点

このドキュメントは、JotaiのatomとJavaScriptのPromiseの間に類似性を描き、同様のコード構造を示しています。

```javascript
const nameAtom = atom('Visitor')
const countAtom = atom(1)

const greetingAtom = atom((get) => {
  const name = get(nameAtom)
  const count = get(countAtom)
  return (
    <div>
      Hello, {name}! You have visited this page {count} times.
    </div>
  )
})
```

Promise ベースの同等のコードと比較すると：

```javascript
const namePromise = Promise.resolve('Visitor')
const countPromise = Promise.resolve(1)

const greetingPromise = (async function () {
  const name = await namePromise
  const count = await countPromise
  return (
    <div>
      Hello, {name}! You have visited this page {count} times.
    </div>
  )
})()
```

## モナドについて

このドキュメントは、atomとpromiseの両方が関数型プログラミングの概念である「モナド」であることを説明しています。モナドの理論的なインターフェースを提供しています。

```typescript
type SomeMonad<T> = Array<T>

declare function of<T>(plainValue: T): SomeMonad<T>
declare function map<T, V>(
  anInstance: SomeMonad<T>,
  transformContents: (contents: T) => V,
): SomeMonad<V>
declare function join<T>(nestedInstances: SomeMonad<SomeMonad<T>>): SomeMonad<T>
```

## シーケンス処理

このドキュメントは、モナドが複雑な非同期操作をどのように簡素化できるかを示し、手動のコールバック管理から`Promise.all()`の使用への進化を示しています。

```javascript
function sequenceAtomArray<T>(atoms: Array<Atom<T>>): Atom<Array<T>> {
  return atom((get) => atoms.map(get))
}
```

## まとめ

このドキュメントは、さらに学習するためのリソースを推奨することで締めくくっています。
