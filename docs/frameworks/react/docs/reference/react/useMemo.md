# useMemo

`useMemo` は、レンダー間で計算結果をキャッシュするための React フックです。

## リファレンス

```javascript
const cachedValue = useMemo(calculateValue, dependencies)
```

### パラメータ

- **`calculateValue`**: キャッシュしたい値を計算する関数。純粋で、引数を取らず、任意の型の値を返す
- **`dependencies`**: `calculateValue` 内で参照されるすべてのリアクティブな値のリスト

### 返り値

初回レンダー時は、引数なしで `calculateValue` を呼び出した結果を返します。その後のレンダーでは、依存配列が変更されていなければ前回のキャッシュされた値を返し、変更されていれば `calculateValue` を再度呼び出して最新の結果を返します。

## 使用法

### 高コストな再計算をスキップ

```javascript
function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

### コンポーネントの再レンダーをスキップ

```javascript
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

`List` が `memo` でラップされている場合、`visibleTodos` が変更されない限り再レンダーをスキップできます。

### 他のフックの依存値をメモ化

```javascript
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]);

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]);
  // ...
}
```

### 関数のメモ化

関数をメモ化する場合は、`useMemo` の代わりに `useCallback` を使用することを推奨します。

```javascript
// useMemo を使用
const handleSubmit = useMemo(() => {
  return (orderDetails) => {
    post('/product/' + product.id + '/buy', { orderDetails });
  };
}, [product.id]);

// useCallback を使用(推奨)
const handleSubmit = useCallback((orderDetails) => {
  post('/product/' + product.id + '/buy', { orderDetails });
}, [product.id]);
```

## パフォーマンス最適化の原則

### 本当に必要な場合のみ使用

ほとんどのアプリケーションでは、広範なメモ化は必要ありません。

### 計算が本当に高コストか確認

```javascript
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

計測結果が 1ms 以上の場合にメモ化を検討してください。

## 重要な考慮事項

- コンポーネントのトップレベルでのみ使用
- Strict Mode では計算関数が2回呼び出される可能性
- キャッシュは永久に保持されることが保証されていない

## トラブルシューティング

### 毎回再計算される

- 依存配列を指定しているか確認
- 依存値が毎回変更されていないか確認
- 依存値のアイデンティティが保たれているか確認

## ベストプラクティス

- 真に高コストな計算にのみ使用
- クリーンでシンプルなコンポーネント設計を優先
- プロファイリングで実際のパフォーマンスボトルネックを特定
- 基本的な設計問題の解決策としては使用しない
