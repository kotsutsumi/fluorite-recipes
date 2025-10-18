# atomWithToggle

> `atomWithToggle`は、初期状態としてbooleanを持ち、それを切り替えるためのsetter関数を持つ新しいatomを作成します。

これにより、最初のatomの状態を更新するためだけに別のatomを設定するという定型文を回避できます。

```ts
import { WritableAtom, atom } from 'jotai'

export function atomWithToggle(
  initialValue?: boolean,
): WritableAtom<boolean, [boolean?], void> {
  const anAtom = atom(initialValue, (get, set, nextValue?: boolean) => {
    const update = nextValue ?? !get(anAtom)
    set(anAtom, update)
  })

  return anAtom as WritableAtom<boolean, [boolean?], void>
}
```

オプションの初期状態を最初の引数として提供できます。

setter関数は、特定の状態を強制するためのオプションの引数を持つことができます。例えば、setActive関数を作成したい場合などです。

使用方法は次のとおりです。

```js
import { atomWithToggle } from 'XXX'

// 初期値がtrueに設定されます
const isActiveAtom = atomWithToggle(true)
```

そして、コンポーネント内では:

```jsx
const Toggle = () => {
  const [isActive, toggle] = useAtom(isActiveAtom)

  return (
    <>
      <button onClick={() => toggle()}>
        isActive: {isActive ? 'yes' : 'no'}
      </button>
      <button onClick={() => toggle(true)}>force true</button>
      <button onClick={() => toggle(false)}>force false</button>
    </>
  )
}
```
