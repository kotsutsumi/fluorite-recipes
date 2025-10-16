# useReducerAtom

## 概要
`useReducerAtom`は、Reactでプリミティブatomにreducerを適用するためのカスタムフックです。atomの更新動作を一時的に変更できます。

## 型シグネチャ
```typescript
export function useReducerAtom<Value, Action>(
  anAtom: PrimitiveAtom<Value>,
  reducer: (v: Value, a: Action) => Value,
)
```

## 主要な機能
- atomの更新動作を変更します
- atomの更新のためのdispatchのようなメカニズムを提供します
- 複雑な状態ロジックに便利です

## 使用例
```javascript
const countReducer = (prev, action) => {
  if (action.type === 'inc') return prev + 1
  if (action.type === 'dec') return prev - 1
  throw new Error('unknown action type')
}

const countAtom = atom(0)

const Counter = () => {
  const [count, dispatch] = useReducerAtom(countAtom, countReducer)

  return (
    <div>
      {count}
      <button onClick={() => dispatch({ type: 'inc' })}>+1</button>
      <button onClick={() => dispatch({ type: 'dec' })}>-1</button>
    </div>
  )
}
```

## 追加の注意事項
- atomレベルのソリューションについては、[atomWithReducer](../utilities/reducer)を検討してください
- より複雑な状態更新ロジックを管理する方法を提供します
