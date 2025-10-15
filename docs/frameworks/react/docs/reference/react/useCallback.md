# useCallback

`useCallback` は、再レンダー間で関数定義をキャッシュできるようにする React フックです。

## リファレンス

```javascript
const cachedFn = useCallback(fn, dependencies)
```

### パラメータ

- **`fn`**: キャッシュしたい関数の値。任意の引数を取り、任意の値を返せる
- **`dependencies`**: `fn` 内で参照されるすべてのリアクティブな値のリスト

### 返り値

初回レンダー時は渡した `fn` 関数をそのまま返します。その後のレンダーでは、依存配列が変更されていなければ前回レンダー時の `fn` 関数を返し、変更されていれば今回レンダー時の `fn` 関数を返します。

## 使用法

### コンポーネントの再レンダーをスキップ

```javascript
const handleSubmit = useCallback((orderDetails) => {
  post('/product/' + productId + '/buy', {
    referrer,
    orderDetails,
  });
}, [productId, referrer]);
```

### メモ化されたコールバックから state を更新

```javascript
const handleAddTodo = useCallback((text) => {
  const newTodo = { id: nextId++, text };
  setTodos(todos => [...todos, newTodo]);
}, []); // 依存配列が不要
```

### Effect の無限実行を防ぐ

```javascript
const handleMove = useCallback(() => {
  const canMove = checkMove(person, x, y);
  if (canMove) {
    setPosition({ x, y });
  }
}, [person, x, y]);

useEffect(() => {
  return subscribe(handleMove);
}, [handleMove]);
```

### カスタムフックの最適化

独自のカスタムフックを作成する場合、返す関数は `useCallback` でラップすることを推奨します。

## 重要な考慮事項

- パフォーマンス最適化のためだけに使用
- すべてのシナリオで必要なわけではない
- React Compiler が将来的に自動メモ化を処理する可能性がある

## トラブルシューティング

- 常に依存配列を提供する
- 必要に応じて依存関係の変更を手動でデバッグ

## ベストプラクティス

`useCallback` は慎重に使用し、クリーンで効率的な React コンポーネントの作成に集中しましょう。
