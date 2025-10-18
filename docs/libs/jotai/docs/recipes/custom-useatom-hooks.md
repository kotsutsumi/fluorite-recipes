# カスタムuseAtomフック

このページでは、さまざまなユーティリティ関数を作成する方法を紹介します。ユーティリティ関数はコーディング時間を節約し、ベースatomを他の用途に保持できます。

### utils

#### useSelectAtom

```js
import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'

export function useSelectAtom(anAtom, selector) {
  const selectorAtom = selectAtom(
    anAtom,
    selector,
    // または、`equalityFn`をカスタマイズして、いつ再レンダリングするかを決定できます
    // 詳細については、selectAtomのシグネチャを確認してください。
  )
  return useAtomValue(selectorAtom)
}

// 使用方法
function useN(n) {
  const selector = useCallback((v) => v[n], [n])
  return useSelectAtom(arrayAtom, selector)
}
```

この場合、`keyFn`は安定している必要があることに注意してください。レンダリングの外で定義するか、`useCallback`でラップしてください。

#### useFreezeAtom

```js
import { useAtom } from 'jotai'
import { freezeAtom } from 'jotai/utils'

export function useFreezeAtom(anAtom) {
  return useAtom(freezeAtom(anAtom))
}
```

#### useSplitAtom

```js
import { useAtom } from 'jotai'
import { splitAtom } from 'jotai/utils'

export function useSplitAtom(anAtom) {
  return useAtom(splitAtom(anAtom))
}
```

### extensions

#### useFocusAtom

```js
import { useAtom } from 'jotai'
import { focusAtom } from 'jotai-optics'

/* ここでatomが作成される場合は、代わりに`useMemo(() => atom(initValue), [initValue])`を使用してください。 */
export function useFocusAtom(anAtom, keyFn) {
    return useAtom(focusAtom(anAtom, keyFn))
}

// 使用方法
useFocusAtom(anAtom) {
    useMemo(() => atom(initValue), [initValue]),
    useCallback((optic) => optic.prop('key'), [])
}
```

この場合、`keyFn`は安定している必要があることに注意してください。レンダリングの外で定義するか、`useCallback`でラップしてください。
