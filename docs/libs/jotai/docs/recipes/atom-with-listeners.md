# atomWithListeners

## 概要
`atomWithListeners`は、リスナーメカニズムを備えたatomを作成するためのユーティリティです。不要な再レンダリングを引き起こすことなく、atomの値の変化を追跡できます。

## 主要な機能
- atomとリスナーを追加するためのフックを作成します
- atomの値が変更されるたびにリスナーが呼び出されます
- リスナーを動的に追加および削除する方法を提供します

## 型定義
```typescript
type Callback<Value> = (
  get: Getter,
  set: Setter,
  newVal: Value,
  prevVal: Value,
) => void

function atomWithListeners<Value>(initialValue: Value)
```

## 使用例

```typescript
const [countAtom, useCountListener] = atomWithListeners(0)

function EvenCounter() {
  const [evenCount, setEvenCount] = useAtom(countAtom)

  useCountListener(
    useCallback(
      (get, set, newVal, prevVal) => {
        // 新しい値が偶数かどうかをチェックし、カウンターをインクリメント
        if (newVal % 2 === 0) {
          setEvenCount((c) => c + 1)
        }
      },
      [setEvenCount],
    ),
  )

  return <>Count was set to an even number {evenCount} times.</>
}
```

## 実装の詳細
- ベースatomを使用して主要な値を保存します
- コールバック関数を追跡するための別のリスナーatomを維持します
- `useEffect`を介してリスナーを追加および削除するメカニズムを提供します

このユーティリティは、直接的なコンポーネントの再レンダリングなしに副作用を作成したり、状態の変化を追跡したりする場合に特に便利です。
