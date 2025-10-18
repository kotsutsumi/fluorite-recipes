# `unstable_deepProxy`

このユーティリティは、オブジェクトを再帰的にプロキシ化し、以下の特別な処理を行います:
- `ref()`でマークされたオブジェクトを除き、すべてのオブジェクトをプロキシ化します
- `Map`を`proxyMap`に変換します
- `Set`を`proxySet`に変換します

```js
import {
  unstable_deepProxy as deepProxy,
  isProxyMap,
  isProxySet,
} from 'valtio/utils'

const obj = {
  mySet: new Set(),
  myMap: new Map(),
  sub: {
    foo: 'bar',
  },
}

const clonedProxy = deepProxy(obj)

console.log(isProxyMap(clonedProxy.myMap)) // true
console.log(isProxySet(clonedProxy.mySet)) // true
```
