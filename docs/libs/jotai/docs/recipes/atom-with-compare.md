# atomWithCompare

> `atomWithCompare`は、カスタム比較関数`areEqual(prev, next)`がfalseの場合に更新をトリガーするatomを作成します。

これにより、アプリケーションにとって重要でない状態変更を無視することで、不要な再レンダリングを回避できます。

注意: Jotaiは、変更が発生したときに`Object.is`を内部的に使用して値を比較します。`areEqual(a, b)`がfalseを返しても、`Object.is(a, b)`がtrueを返す場合、Jotaiは更新をトリガーしません。

```ts
import { atomWithReducer } from 'jotai/utils'

export function atomWithCompare<Value>(
  initialValue: Value,
  areEqual: (prev: Value, next: Value) => boolean,
) {
  return atomWithReducer(initialValue, (prev: Value, next: Value) => {
    if (areEqual(prev, next)) {
      return prev
    }

    return next
  })
}
```

浅い等価性の更新を無視するatomを作成する使用例を次に示します:

```ts
import { atomWithCompare } from 'XXX'
import { shallowEquals } from 'YYY'
import { CSSProperties } from 'react'

const styleAtom = atomWithCompare<CSSProperties>(
  { backgroundColor: 'blue' },
  shallowEquals,
)
```

コンポーネント内では:

```jsx
const StylePreview = () => {
  const [styles, setStyles] = useAtom(styleAtom)

  return (
    <div>
      <div styles={styles}>スタイルプレビュー</div>

      {/* このボタンを2回クリックしても、1回しか再レンダリングされません */}
      <button onClick={() => setStyles({ ...styles, backgroundColor: 'red' })}>
        背景を赤に設定
      </button>

      {/* このボタンを2回クリックしても、1回しか再レンダリングされません */}
      <button onClick={() => setStyles({ ...styles, fontSize: 32 })}>
        フォントを拡大
      </button>
    </div>
  )
}
```
