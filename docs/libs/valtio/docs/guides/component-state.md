---
title: 'Component State'
section: 'Advanced'
description: 'useRefでコンポーネント状態を分離する'
---

# Component State

再利用性のためにコンポーネント状態を分離するには、ValtioをReactのライフサイクル内に配置する必要があります。`proxy`をrefでラップし、propsまたはcontextで渡すことができます。

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

## Codesandbox 例

https://codesandbox.io/s/valtio-component-ye5tbg?file=/src/App.tsx

## 代替案

`useRef`の使用に満足できない場合は、以下を検討してください:

- [use-constant](https://www.npmjs.com/package/use-constant)
- [bunshi](https://www.bunshi.org/recipes/valtio/)
- useContextとオプションでuseSnapshotをラップするカスタムフックを作成することもできます。

### Bunshi の例

https://codesandbox.io/s/77r53c?file=/molecules.ts
