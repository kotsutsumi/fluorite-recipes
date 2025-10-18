# stateをリセットする方法

場合によっては、proxyインスタンス内のstateを初期値にリセットしたいことがあります。例えば、フォームの値や、リセットしたい一時的なUI stateを保存している場合などです。これは実は非常に簡単に実行できます！

```js
import { proxy } from 'valtio'
import { deepClone } from 'valtio/utils'

const initialObj = {
  text: 'hello',
  arr: [1, 2, 3],
  obj: { a: 'b' },
}

const state = proxy(deepClone(initialObj))

const reset = () => {
  const resetObj = deepClone(initialObj)
  Object.keys(resetObj).forEach((key) => {
    state[key] = resetObj[key]
  })
}
```

`reset`関数と`state` proxyの**両方**で初期オブジェクトをコピーするために、`valtio/utils`の`deepClone()`ユーティリティ関数を使用していることに注意してください。proxy関数でdeepCloneを使用することは、v2での新しい要件です。Valtioはデフォルトで初期stateをクローンしなくなりました。proxy関数に渡したオブジェクトを再利用すると、予期しない結果が得られる可能性があります。

あるいは、オブジェクトを別のオブジェクトに保存することもでき、これによりリセットロジックが簡単になります：

```js
const state = proxy({ obj: initialObj })

const reset = () => {
  state.obj = deepClone(initialObj)
}
```

> ℹ️ 注意
>
> `structuredClone()`の使用について
>
> 2022年に、`structuredClone`という新しいグローバル関数が追加され、ほとんどの最新ブラウザで広く利用可能になりました。上記の`deepClone`と同じ方法で`structuredClone`を使用できますが、`deepClone`はstate内の`ref`を認識するため、`deepClone`が推奨されます。

> 注意: deepCloneはproxyMapとproxySetをプレーンオブジェクトに変換します。ツリー内にこれらを含むオブジェクトがある場合は、`unstable_structuredClone`の使用を検討してください。
