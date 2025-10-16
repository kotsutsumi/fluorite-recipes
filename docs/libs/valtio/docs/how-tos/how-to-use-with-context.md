---
title: 'Contextと併用する方法'
---

# Contextと併用する方法

valtioのステートをReactのライフサイクル内でのみ存在させるには、refでステートを作成し、propsやcontextで渡すことができます。

## contextを使った基本パターン

```jsx
import { createContext, useContext } from 'react'
import { proxy, useSnapshot } from 'valtio'

const MyContext = createContext()

const MyProvider = ({ children }) => {
  const state = useRef(proxy({ count: 0 })).current
  return <MyContext.Provider value={state}>{children}</MyContext.Provider>
}

const MyCounter = () => {
  const state = useContext(MyContext)
  const snap = useSnapshot(state)
  return (
    <>
      {snap.count} <button onClick={() => ++state.count}>+1</button>
    </>
  )
}
```

## 代替手段

`useRef`の使用に満足できない場合は、以下を検討してください:

- [use-constant](https://www.npmjs.com/package/use-constant)
- [bunshi](https://www.bunshi.org/recipes/valtio/)
- `useContext`とオプションで`useSnapshot`を使うカスタムフックを作成できます

### Bunshiの例

https://codesandbox.io/s/77r53c?file=/molecules.ts
