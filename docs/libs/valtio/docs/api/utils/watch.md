# `watch`

## getterを介した購読

このユーティリティは、複数のプロキシオブジェクトの購読をサポートします(単一のプロキシのみをリッスンする`subscribe`とは異なります)。プロキシオブジェクトは、コールバックに渡される`get`関数を介して購読されます。

プロキシオブジェクト(またはその子プロキシ)への変更があると、コールバックが再実行されます。

また、`watch`が呼び出されたときに、プロキシがまだ変更されていなくても、初期購読を確立するためにコールバックが一度すぐに実行されることに注意してください。

```js
import { proxy } from 'valtio'
import { watch } from 'valtio/utils'

const userState = proxy({ user: { name: 'Juuso' } })
const sessionState = proxy({ expired: false })

watch((get) => {
  // `get`は`sessionState`をこのコールバックの監視対象プロキシに追加します
  get(sessionState)
  const expired = sessionState.expired
  // またはインラインで呼び出すこともできます
  const name = get(userState).user.name
  console.log(`${name}'s session is ${expired ? 'expired' : 'valid'}`)
})
// 'Juuso's session is valid'
sessionState.expired = true
// 'Juuso's session is expired'
```

## クリーンアップ

以下の両方のタイミングで実行されるクリーンアップ関数を返すことができます:

- コールバックの再呼び出しの前(つまり、監視対象のプロキシが変更されたため)
- `watch`自体が停止したとき(`watch`によって返されたクリーンアップ関数を呼び出すことで)

```js
watch((get) => {
  const expired = get(sessionState).expired
  const name = get(userState).user.name
  console.log(`${name}'s session is ${expired ? 'expired' : 'valid'}`)
  return () => {
    if (expired) {
      console.log('Cleaning up')
    }
  }
})
// コールバックの最初の即時呼び出しからの出力
```
