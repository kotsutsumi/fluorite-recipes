# memo

`memo` を使うことで、props が変更されていない場合にコンポーネントの再レンダーをスキップできます。

## リファレンス

```javascript
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

### パラメータ

- **`Component`**: メモ化したいコンポーネント
- **`arePropsEqual`** (オプション): 古い props と新しい props を引数として受け取り、等しい場合に `true` を返す関数。通常は指定不要

### 返り値

新しい React コンポーネントを返します。元のコンポーネントと同じように動作しますが、親が再レンダーされても props が変更されていなければ再レンダーされません。

## 使用法

### props が変更されていない場合の再レンダーをスキップ

```javascript
import { memo } from 'react';

const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

### state の更新

メモ化されたコンポーネント内で state を更新すると、その state が変更された場合でも再レンダーされます。

```javascript
const Counter = memo(function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
});
```

### context の使用

コンポーネントが context を使用している場合、context の値が変更されると再レンダーされます。

```javascript
const ThemedButton = memo(function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click me</button>;
});
```

### props の変更を最小化

`memo` の効果を最大化するには、props の変更を最小限に抑える必要があります。

```javascript
// ❌ 毎レンダーで新しいオブジェクトを作成
function Page() {
  return <Profile user={{ name: 'Alice', age: 30 }} />;
}

// ✅ 安定した参照を使用
function Page() {
  const user = useMemo(() => ({ name: 'Alice', age: 30 }), []);
  return <Profile user={user} />;
}
```

### 関数の props をメモ化

```javascript
function TodoList({ todos, onTodoClick }) {
  // ...
}

const MemoizedTodoList = memo(TodoList);

function App() {
  const [todos, setTodos] = useState([]);

  // ✅ useCallback で関数をメモ化
  const handleTodoClick = useCallback((id) => {
    // ...
  }, []);

  return <MemoizedTodoList todos={todos} onTodoClick={handleTodoClick} />;
}
```

### カスタム比較関数

```javascript
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, (oldProps, newProps) => {
  // カスタム比較ロジック
  return oldProps.dataPoints.length === newProps.dataPoints.length;
});
```

## React Compiler との統合

React Compiler は自動的にコンポーネントの再レンダーを最適化できます。将来的には、手動での `memo` 使用を置き換える可能性があります。

## 重要な考慮事項

### メモ化は最適化のヒント

`memo` はパフォーマンス最適化であり、保証ではありません。React は状況によっては、メモ化されたコンポーネントを再レンダーすることがあります。

### すべてにメモ化を適用しない

```javascript
// ❌ 無差別にメモ化
const Button = memo(function Button() {
  return <button>Click</button>;
});

// ✅ 必要な場所のみメモ化
// - レンダリングが高コスト
// - 同じ props で頻繁に再レンダーされる
const ExpensiveChart = memo(function ExpensiveChart({ data }) {
  // 複雑なレンダリングロジック
});
```

## トラブルシューティング

### メモ化しても再レンダーされる

よくある原因:

1. **新しいオブジェクトや配列を props として渡している**

```javascript
// ❌ 毎レンダーで新しいオブジェクト
<MemoizedComponent data={{ x: 1, y: 2 }} />

// ✅ useMemo でメモ化
const data = useMemo(() => ({ x: 1, y: 2 }), []);
<MemoizedComponent data={data} />
```

2. **新しい関数を props として渡している**

```javascript
// ❌ 毎レンダーで新しい関数
<MemoizedComponent onClick={() => console.log('clicked')} />

// ✅ useCallback でメモ化
const handleClick = useCallback(() => console.log('clicked'), []);
<MemoizedComponent onClick={handleClick} />
```

3. **Context が変更されている**

```javascript
// Context の値が変更されると、memo を使用していても再レンダーされる
const ThemedComponent = memo(function ThemedComponent() {
  const theme = useContext(ThemeContext); // theme が変更されると再レンダー
  return <div className={theme}>Content</div>;
});
```

## ベストプラクティス

### いつ使用すべきか

- コンポーネントが同じ props で頻繁に再レンダーされる
- レンダリングロジックが高コスト
- リストアイテムなど、多数のインスタンスがある

### いつ使用すべきでないか

- レンダリングが高速なシンプルなコンポーネント
- props が頻繁に変更される
- メモ化のオーバーヘッドがレンダリングコストを上回る

### 測定する

```javascript
// React DevTools Profiler で測定
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={onRender}>
  <MyComponent />
</Profiler>
```

実際のパフォーマンスを測定してから `memo` を適用してください。

### React Compiler を検討

可能であれば、React Compiler の使用を検討してください。自動的により包括的なメモ化を提供します。
