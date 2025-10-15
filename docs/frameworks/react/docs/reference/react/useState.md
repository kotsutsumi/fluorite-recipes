# useState

`useState` は、コンポーネントに state 変数を追加するための React フックです。

## リファレンス

```javascript
const [state, setState] = useState(initialState)
```

### パラメータ

- **`initialState`**: state の初期値。任意の型の値を指定可能。初回レンダー後は無視される。関数を渡すこともでき、その場合は初期化関数として扱われる

### 返り値

1. **`state`**: 現在の state。初回レンダー時は渡した `initialState` と一致
2. **`setState`**: state を別の値に更新し、再レンダーをトリガーする関数

## 使用法

### コンポーネントに state を追加

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

### 前回の state に基づいて state を更新

```javascript
function handleClick() {
  setAge(a => a + 1); // setAge(age + 1) より安全
}
```

アップデータ関数を使用すると、前回の state に基づいて確実に更新できます。

### オブジェクトと配列の更新

```javascript
// オブジェクト
const [form, setForm] = useState({
  firstName: 'Taylor',
  lastName: 'Swift',
  email: 'taylor@swift.com',
});

function handleFirstNameChange(e) {
  setForm({
    ...form,
    firstName: e.target.value
  });
}

// 配列
const [todos, setTodos] = useState([]);

function handleAddTodo(newTodo) {
  setTodos([...todos, newTodo]);
}
```

常に新しいオブジェクトや配列を作成し、既存のものを変更しないでください。

### 初期化関数

初期 state の計算が高コストな場合、初期化関数を渡すことができます。

```javascript
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
}

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}
```

`createInitialTodos()` ではなく `createInitialTodos` を渡していることに注意してください。関数自体を渡すことで、初回レンダー後は呼び出されません。

### key で state をリセット

```javascript
function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}
```

コンポーネントに異なる `key` を渡すことで、React にコンポーネントを完全にリセットさせることができます。

### 前回のレンダーの情報を保存

```javascript
function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);

  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }

  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

## トラブルシューティング

### state を更新したのに古い値が表示される

```javascript
function handleClick() {
  console.log(count);  // 0
  setCount(count + 1);
  console.log(count);  // まだ 0!
}
```

State の更新はスナップショットのように動作します。state の更新は次のレンダーまで反映されません。

### オブジェクトの state が更新されない

```javascript
// ❌ 間違い: 既存のオブジェクトを変更
form.firstName = 'Taylor';

// ✅ 正しい: 新しいオブジェクトを作成
setForm({
  ...form,
  firstName: 'Taylor'
});
```

### エラー: "Too many re-renders"

無限再レンダーループの原因:

```javascript
// ❌ 間違い: レンダー中に state を設定
return <button onClick={handleClick()}>Click me</button>

// ✅ 正しい: 関数を渡す
return <button onClick={handleClick}>Click me</button>
```

### 初期化関数が2回実行される

Strict Mode では、React が意図的に関数を2回呼び出して、純粋性を確認します。これは開発モードでのみ発生し、本番環境には影響しません。

## ベストプラクティス

### アップデータ関数を使用

前回の state に基づいて更新する場合は、常にアップデータ関数を使用:

```javascript
setCount(c => c + 1); // 推奨
setCount(count + 1);  // 問題が発生する可能性
```

### 冗長な state を避ける

props や他の state から計算できる値は、state として保存しないでください。

### 不要な state の更新を避ける

更新前後で値が同じ場合、React は更新をスキップします(`Object.is` で比較)。

## useState vs useReducer

**useState を使用する場合:**
- シンプルな state
- 独立した値
- 更新ロジックが単純

**useReducer を使用する場合:**
- 複雑な state ロジック
- 複数の値が相互依存
- state 更新ロジックを集中管理したい
