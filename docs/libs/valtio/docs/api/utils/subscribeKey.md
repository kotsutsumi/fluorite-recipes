# `subscribeKey`

プロキシ状態のプリミティブ値を購読するには、`subscribeKey`の使用を検討してください。

```js
import { subscribeKey } from 'valtio/utils'

const state = proxy({ count: 0, text: 'hello' })
subscribeKey(state, 'count', (v) =>
  console.log('state.count has changed to', v),
)
```

## Codesandboxデモ

https://codesandbox.io/s/dynamic-ui-with-valtio-9gme46?file=/src/ComplexCounter.tsx
