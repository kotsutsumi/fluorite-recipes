# パフォーマンス

Jotaiでパフォーマンスを得るためにいくつかのことを行うことができます。まずは、Reactでいくつかの一般的なベストプラクティスから始めましょう。

## 安価なレンダリング

### 重い計算

ある時点で、Reactのレンダーサイクル内で非常に高価な計算を行う必要があるかもしれません。これらの計算をアクションや非同期操作に移動することで、コンポーネントのレンダリングを安価に保つことができます。

```ts
// 推奨されるアプローチ
const fetchFriendsAtom = atom(null, async (get, set) => {
  const res = await fetch('https://...')
  const computed = res.filter(heavyComputation)
  set(friendsAtom, computed)
})
```

### コンポーネントの粒度

大きなコンポーネントを小さな焦点を絞ったコンポーネントに分割します。各コンポーネントは、必要なatomのみを監視する必要があります。

```tsx
// 推奨されないアプローチ
const HugeComponent = () => {
  const [name] = useAtom(nameAtom)
  const [address] = useAtom(addressAtom)
  const [age] = useAtom(ageAtom)
  // ... さらに多くのatom

  return (
    <div>
      {/* 巨大なコンポーネント */}
    </div>
  )
}

// より良いアプローチ
const NameComponent = () => {
  const [name] = useAtom(nameAtom)
  return <div>{name}</div>
}

const AddressComponent = () => {
  const [address] = useAtom(addressAtom)
  return <div>{address}</div>
}

const AgeComponent = () => {
  const [age] = useAtom(ageAtom)
  return <div>{age}</div>
}

const OptimizedComponent = () => {
  return (
    <div>
      <NameComponent />
      <AddressComponent />
      <AgeComponent />
    </div>
  )
}
```

## オンデマンドでのレンダリング

Jotaiは、レンダリングを最適化するためのいくつかのツールを提供します。atomは、その特定の値が変更された場合にのみ再レンダリングをトリガーします。`selectAtom`、`focusAtom`、`splitAtom`を使用して、きめ細かい更新を行うことができます。

### 更新頻度の考慮事項

頻繁に変更されるオブジェクトの場合、複数のフォーカスされたatomを作成することは避けてください。代わりに、単一のatomを使用し、必要に応じてそのプロパティを更新します。

めったに変更されず、独立したプロパティを持つオブジェクトの場合、`focusAtom`または`selectAtom`を使用して、きめ細かい更新を行うことができます。

```ts
// 頻繁に変更されるオブジェクト
const userAtom = atom({ name: 'John', age: 30 })

// より良い - 単一のatomを使用
const Component = () => {
  const [user, setUser] = useAtom(userAtom)
  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
    </div>
  )
}

// めったに変更されないオブジェクト
const configAtom = atom({ theme: 'light', language: 'en' })

// より良い - focusAtomを使用
const themeAtom = focusAtom(configAtom, (optic) => optic.prop('theme'))

const ThemeComponent = () => {
  const [theme, setTheme] = useAtom(themeAtom)
  return <div>{theme}</div>
}
```

## パフォーマンスのベストプラクティス

- コンポーネント関数を冪等に保つ
- 不要な再レンダリングを最小限に抑える
- `useMemo`と`useCallback`を戦略的に使用する
- データをアトミックな部分に分割する

**注意**: このガイドは、状態管理におけるパフォーマンスへの道としてシンプルさを強調しています。
