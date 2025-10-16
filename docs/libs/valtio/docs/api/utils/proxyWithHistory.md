# `proxyWithHistory`

## スナップショットの履歴を保持する

これは、スナップショット履歴を持つプロキシを作成するためのユーティリティ関数です。

```js
import { proxyWithHistory } from 'valtio-history'

const state = proxyWithHistory({ count: 0 })
console.log(state.value) // ---> { count: 0 }
state.value.count += 1
console.log(state.value) // ---> { count: 1 }
state.undo()
console.log(state.value) // ---> { count: 0 }
state.redo()
console.log(state.value) // ---> { count: 1 }
```

## Codesandboxデモ

https://codesandbox.io/s/valtio-history-example-v0-m353xc?file=/src/App.tsx
