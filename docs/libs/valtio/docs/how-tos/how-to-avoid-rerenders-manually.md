# 手動で再レンダリングを回避する方法

## `useSnapshot`は自動的に再レンダリングを最適化します

これが基本的な使い方です。

```jsx
const Component = () => {
  const { count } = useSnapshot(state) // これはリアクティブです
  return <>{count}</>
}
```

## stateの読み取りは有効ですが、一般的なユースケースでは推奨されません

```jsx
const Component = () => {
  const { count } = state // これはリアクティブではありません
  return <>{count}</>
}
```

これは再レンダリングをトリガーしませんが、他のグローバル変数と同様にReactのルールに従いません。

## 条件付きでsubscribeしてローカルstateを設定する

```jsx
const Component = () => {
  const [count, setCount] = useState(state.count)
  useEffect(
    () =>
      subscribe(state, () => {
        if (state.count % 2 === 0) {
          // 条件付きでローカルstateを更新
          setCount(state.count)
        }
      }),
    [],
  )
  return <>{count}</>
}
```

これはほとんどの場合機能するはずです。

理論的には、サブスクリプション前にstateが変更される可能性があります。修正は以下のようになります。

```jsx
const Component = () => {
  const [count, setCount] = useState(state.count)
  useEffect(() => {
    const callback = () => {
      if (state.count % 2 === 0) {
        // 条件付きでローカルstateを更新
        setCount(state.count)
      }
    }
    const unsubscribe = subscribe(state, callback)
    callback()
    return unsubscribe
  }), [])
  return <>{count}</>
}
```

一部のユースケースでは、[useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)を使用する方が簡単かもしれません。
