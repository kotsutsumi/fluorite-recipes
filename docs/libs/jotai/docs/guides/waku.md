# Waku

このガイドでは、JotaiをWakuアプリケーションと統合する方法を説明します。

## Hydration

JotaiはWakuでのServer-Side Rendering（SSR）とhydrationをサポートしています。

### useHydrateAtomsを使用する

`useHydrateAtoms`フックを使用して、サーバーから取得した値でatomsをhydrateできます。このフックの詳細なドキュメントは、[SSRユーティリティセクション](../utils/ssr)を参照してください。

## 基本的な使用例

```javascript
import { useHydrateAtoms } from 'jotai/utils'
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

function HydrateAtoms({ initialCount, children }) {
  useHydrateAtoms([[countAtom, initialCount]])
  return children
}

export default function App({ initialCount }) {
  return (
    <HydrateAtoms initialCount={initialCount}>
      <Counter />
    </HydrateAtoms>
  )
}

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      Count: {count}
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  )
}
```

## Providerの使用

Wakuでは、Providerを使用してstoreのスコープを管理できます：

```javascript
import { Provider } from 'jotai'

export default function App({ children }) {
  return (
    <Provider>
      {children}
    </Provider>
  )
}
```

## ベストプラクティス

1. **useHydrateAtomsを使用する**：サーバー側の値をクライアントに正しくhydrateします
2. **Providerを適切に配置する**：アプリケーションのルートレベルでProviderを使用します
3. **SSRを考慮する**：async atomsを使用する場合はSSRに対するガードを実装します

## 詳細情報

`useHydrateAtoms`フックの詳細については、[SSRユーティリティドキュメント](../utils/ssr)を参照してください。
