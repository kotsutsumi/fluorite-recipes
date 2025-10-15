# useReducer

`useReducer` は、コンポーネントに reducer を追加して state を管理するための React フックです。

## リファレンス

```javascript
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

### パラメータ

- **`reducer`**: state がどのように更新されるかを決定する純粋関数。`(state, action)` を引数として受け取り、次の state を返す
- **`initialArg`**: 初期 state を計算するための値
- **`init`** (オプション): 初期 state を計算して返す関数。指定しない場合、初期 state は `initialArg` に設定される

### 返り値

1. **`state`**: 現在の state。初回レンダー時は `init(initialArg)` または `initialArg`(init がない場合)
2. **`dispatch`**: アクションをディスパッチして state を更新する関数

## 使用法

### コンポーネントに reducer を追加

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age':
      return {
        name: state.name,
        age: state.age + 1
      };
    case 'changed_name':
      return {
        name: action.nextName,
        age: state.age
      };
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

### reducer 関数の記述

```javascript
function reducer(state, action) {
  // state を直接変更せずに、新しい state オブジェクトを返す
  switch (action.type) {
    case 'incremented_age':
      return { ...state, age: state.age + 1 };
    case 'changed_name':
      return { ...state, name: action.nextName };
    default:
      throw Error('Unknown action: ' + action.type);
  }
}
```

### 初期化の遅延

初期 state の計算が高コストな場合、初期化関数を渡すことができます。

```javascript
function createInitialState(username) {
  // 高コストな計算
  return {
    username: username,
    messages: []
  };
}

function Messenger({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  // ...
}
```

## ベストプラクティス

### 常に新しい state オブジェクトを返す

```javascript
// ✅ 正しい
function reducer(state, action) {
  return { ...state, age: state.age + 1 };
}

// ❌ 間違い
function reducer(state, action) {
  state.age = state.age + 1;
  return state;
}
```

### switch 文の使用

アクションタイプに応じて処理を分岐するため、`switch` 文を使用するのが一般的です。

### アクションを説明的に

```javascript
// ✅ 説明的なアクション
dispatch({ type: 'added_todo', text: 'Go to the store' })

// ❌ 曖昧なアクション
dispatch({ type: 'update', value: newValue })
```

## トラブルシューティング

### state 更新は即座に反映されない

```javascript
function handleClick() {
  console.log(state.age);  // 42
  dispatch({ type: 'incremented_age' });
  console.log(state.age);  // まだ 42!
}
```

State の更新はスナップショットであり、現在の state を即座に変更しません。次のレンダーで新しい値が使用されます。

### 無限再レンダーループを避ける

イベントハンドラではなくレンダー中に `dispatch` を呼び出すと、無限ループになる可能性があります。

### reducer の state が undefined になる

すべての `case` で値を返すか、`default` ケースを追加してください。

## useState vs useReducer

**useState を使用する場合:**
- シンプルな state
- 単一の値や基本的なオブジェクト

**useReducer を使用する場合:**
- 複雑な state ロジック
- 複数の値が相互に依存する state
- state 更新ロジックを分離したい場合

## 主な利点

- state 更新ロジックの集中管理
- テストが容易
- イベントハンドラがより簡潔になる
- 複雑な state 遷移を明確に表現
