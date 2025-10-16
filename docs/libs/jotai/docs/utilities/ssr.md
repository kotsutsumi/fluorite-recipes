# SSR

## useHydrateAtoms

**Ref**: https://github.com/pmndrs/jotai/issues/340

### クライアント側のコードで使用

`useHydrateAtoms`フックは、サーバーサイドレンダリングでatomの値を初期化するためのものです。これはクライアント側のコードでのみ使用し、サーバー側のコードでは使用しないでください。`useHydrateAtoms`を使用するコンポーネントは、Next.jsの`use client`ディレクティブを使用する必要があります。

初期値でatomをハイドレートし、プロバイダー内のすべてのコンポーネントがハイドレートされた値にアクセスできるようにします。

```jsx
// Valueは、サーバーからクライアントに渡される任意のJSON serializable型です
// [[PrimitiveAtom<Value>, Value]]の配列を受け取ります

import { atom, useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

const countAtom = atom(0)
const CounterPage = ({ countFromServer }) => {
  useHydrateAtoms([[countAtom, countFromServer]])
  const [count] = useAtom(countAtom)
  // count === countFromServerになります
  return <div>{count}</div>
}
```

```tsx
// TypeScript
// あなたのフレームワークのinferGetServerSidePropsTypeまたは同等のものに応じて
// SomeType === { countFromServer: number }を想定しています
useHydrateAtoms<SomeType>([[count, countFromServer]])
```

上記の例では、`useHydrateAtoms`フックを使用して`countAtom`の値をサーバーから初期化しています。初期値はatomから取得され、`useHydrateAtoms`の初期値の配列に渡されます。

このフックは、サーバーサイドレンダリングをサポートするNext.jsのようなフレームワークでのみ使用する必要があります。

### 単一のuseHydrateAtoms呼び出し

このフックは、1つのレンダリングサイクルあたり1回のみ呼び出す必要があります。複数の値をハイドレートする必要がある場合は、それらを単一の配列に結合してください:

```tsx
useHydrateAtoms([
  [countAtom, countFromServer],
  [nameAtom, nameFromServer],
])
```

代わりに、次のようにすることもできます:

```tsx
const atoms: (readonly [Atom<unknown>, unknown])[] = [
  [countAtom, countFromServer],
  [nameAtom, nameFromServer],
]
useHydrateAtoms(atoms)
```

ES5をターゲットとしている場合、TypeScriptはタプルを正しく推論しないため、タプルに`as const`をキャストする必要があります。

代わりにMapを使用することもできます:

```tsx
const atoms = new Map([
  [countAtom, countFromServer],
  [nameAtom, nameFromServer],
])
useHydrateAtoms(atoms)
```

### 複数のプロバイダーストアでuseHydrateAtomsを使用

複数のJotai Providerストアがある場合、`useHydrateAtoms`フックをストアごとに個別に使用する必要があります:

```jsx
const SomeComponent = ({ countFromServer }) => {
  useHydrateAtoms([[countAtom, countFromServer]], {
    store: myStore1,
  })
  useHydrateAtoms([[countAtom, countFromServer]], {
    store: myStore2,
  })
  // ...
}
```

### atomの再ハイドレート

デフォルトでは、同じストアに対してatomは一度だけハイドレートされます。同じatomを2回目にハイドレートしようとすると、無視されます。

```jsx
const countAtom = atom(0)

// 最初のレンダリング
useHydrateAtoms([[countAtom, 1]]) // countAtomは1にハイドレートされます

// 2回目のレンダリング
useHydrateAtoms([[countAtom, 2]]) // これは無視されます。countAtomは1のままです
```

同じatomを強制的に再ハイドレートする必要がある場合（通常は推奨されません）、`dangerouslyForceHydrate`オプションを使用できます:

```jsx
useHydrateAtoms([[countAtom, 2]], { dangerouslyForceHydrate: true }) // countAtomは2に再ハイドレートされます
```

このオプションは、どうしても再ハイドレートが必要な場合にのみ使用してください。再ハイドレートにより、atomが2回初期化され、予期しないレンダリングが発生する可能性があります。

注意: このオプションはatomがストア内に存在する場合にのみ機能します。atomが存在しない場合は何も起こりません。atomがすでにストアに存在する場合、ハイドレーションは無視され、値は保持されます。

### TypeScript

```tsx
function useHydrateAtoms(
  values: Iterable<readonly [Atom<unknown>, unknown]>,
  options?: { store?: Store; dangerouslyForceHydrate?: boolean },
): void
```
