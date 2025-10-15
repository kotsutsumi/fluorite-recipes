# フックのルール

フックは再利用可能な UI ロジックを表す JavaScript の関数として定義されており、呼び出せる場所に関する制約があります。

## フックはトップレベルでのみ呼び出す

`use` で始まる関数名を持つ関数は React では*フック (hook)* と呼ばれます。

**ループ、条件分岐、ネストされた関数、`try`/`catch`/`finally` ブロックの内部でフックを呼び出してはいけません**。代わりに、フックは常に React 関数のトップレベルで、早期 return を行う前に呼び出します。フックは React が関数コンポーネントをレンダーしている間にのみ呼び出すことができます。

- ✅ [関数コンポーネント](/learn/your-first-component)本体のトップレベルで呼び出す
- ✅ [カスタムフック](/learn/reusing-logic-with-custom-hooks)本体のトップレベルで呼び出す

```jsx
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

以下のような場合にフック（`use` で始まる関数）を呼び出すことは**サポートされていません**：

- 🔴 条件やループの内部でフックを呼び出してはいけない
- 🔴 条件付き `return` 文の後でフックを呼び出してはいけない
- 🔴 イベントハンドラ内でフックを呼び出してはいけない
- 🔴 クラスコンポーネント内でフックを呼び出してはいけない
- 🔴 `useMemo`、`useReducer`、または `useEffect` に渡される関数内でフックを呼び出してはいけない
- 🔴 `try`/`catch`/`finally` ブロック内でフックを呼び出してはいけない

### 違反例：条件分岐内でのフック呼び出し

```jsx
function Counter() {
  if (condition) {
    const [count, setCount] = useState(0); // 🔴 Bad: inside a condition
  }
  // ...
}
```

### 正しい例：トップレベルでのフック呼び出し

```jsx
function Counter() {
  const [count, setCount] = useState(0); // ✅ Good: top-level in a function component

  if (condition) {
    // count を使用する
  }
  // ...
}
```

### 違反例：条件付き return の後でのフック呼び出し

```jsx
function Counter() {
  if (condition) {
    return null;
  }
  const [count, setCount] = useState(0); // 🔴 Bad: after a conditional return
  // ...
}
```

### 正しい例：すべてのフックを早期 return の前に呼び出す

```jsx
function Counter() {
  const [count, setCount] = useState(0); // ✅ Good: top-level in a function component

  if (condition) {
    return null;
  }
  // ...
}
```

### 違反例：イベントハンドラ内でのフック呼び出し

```jsx
function Counter() {
  const handleClick = () => {
    const [count, setCount] = useState(0); // 🔴 Bad: inside an event handler
  };
  // ...
}
```

### 正しい例：コンポーネントのトップレベルでフックを呼び出す

```jsx
function Counter() {
  const [count, setCount] = useState(0); // ✅ Good: top-level in a function component

  const handleClick = () => {
    setCount(count + 1); // フックが返した関数を使用するのは問題ない
  };
  // ...
}
```

### 違反例：他のフック内でのフック呼び出し

```jsx
function useCustomHook() {
  useEffect(() => {
    const [value, setValue] = useState(0); // 🔴 Bad: inside useEffect
  });
}
```

### 正しい例：フックのトップレベルでフックを呼び出す

```jsx
function useCustomHook() {
  const [value, setValue] = useState(0); // ✅ Good: top-level in a custom Hook

  useEffect(() => {
    // value を使用する
  });
}
```

### 違反例：ループ内でのフック呼び出し

```jsx
function TodoList({ todos }) {
  for (let i = 0; i < todos.length; i++) {
    const [isComplete, setIsComplete] = useState(false); // 🔴 Bad: inside a loop
  }
  // ...
}
```

### 正しい例：コンポーネントごとにフックを呼び出す

```jsx
function TodoItem({ todo }) {
  const [isComplete, setIsComplete] = useState(false); // ✅ Good: top-level in component
  // ...
}

function TodoList({ todos }) {
  return (
    <>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </>
  );
}
```

### 違反例：try/catch ブロック内でのフック呼び出し

```jsx
function Component() {
  try {
    const [value, setValue] = useState(0); // 🔴 Bad: inside try block
  } catch (error) {
    // ...
  }
}
```

### 正しい例：try/catch の外でフックを呼び出す

```jsx
function Component() {
  const [value, setValue] = useState(0); // ✅ Good: top-level in component

  try {
    // value を使用する
  } catch (error) {
    // ...
  }
}
```

## フックはフックまたはコンポーネントからのみ呼び出す

フックは以下の場所からのみ呼び出すべきです：

- ✅ React 関数コンポーネントの本体内
- ✅ [カスタムフック](/learn/reusing-logic-with-custom-hooks)の本体内

```jsx
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅ Good
  // ...
}

function setOnlineStatus() { // Not a component or custom Hook!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // 🔴 Bad
}
```

### クラスコンポーネントではフックを使用できない

```jsx
class FriendList extends React.Component {
  componentDidMount() {
    const [onlineStatus] = useOnlineStatus(); // 🔴 Bad: class component
  }
}
```

代わりに、関数コンポーネントを使用します：

```jsx
function FriendList() {
  const [onlineStatus] = useOnlineStatus(); // ✅ Good: function component
  // ...
}
```

## なぜこれらのルールが重要なのか

これらのルールに従うことで、React は：

### 1. 呼び出し順序を保証できる

React はフックが呼び出される順序に依存しています。フックを常に同じ順序で呼び出すことで、React は複数の `useState` や `useEffect` の呼び出しの間で state を正しく保持できます。

```jsx
function Form() {
  const [name, setName] = useState('Mary'); // 1. name state を初期化
  const [surname, setSurname] = useState('Poppins'); // 2. surname state を初期化
  const [width, setWidth] = useState(window.innerWidth); // 3. width state を初期化

  useEffect(() => {
    // 4. 副作用を追加
  });
  // ...
}
```

React が正しく動作するためには、これらのフックが毎回同じ順序で呼び出される必要があります。

### 2. 条件分岐があると順序が変わる

もしフックを条件分岐の中に入れると、順序が変わる可能性があります：

```jsx
function Form() {
  const [name, setName] = useState('Mary'); // 1. name state

  if (name !== '') {
    const [surname, setSurname] = useState('Poppins'); // 🔴 条件により順序が変わる
  }

  const [width, setWidth] = useState(window.innerWidth); // 2 または 3 番目？
}
```

最初のレンダー時は `name !== ''` が `true` なので、このフックは実行されます。しかし次のレンダー時にユーザがフォームをクリアして `name` が空文字列になると、この条件は `false` になり、このフックはスキップされます。これにより、レンダー中のフックの順序が変わり、React は 2 番目のフック呼び出しに何を返せばいいのか分からなくなります。

### 3. コンポーネントごとに state を分離できる

各コンポーネントインスタンスは、独自の state を持ちます：

```jsx
function StatusBar() {
  const [isOnline, setIsOnline] = useOnlineStatus();
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useOnlineStatus();
  // ...
}
```

`StatusBar` と `SaveButton` コンポーネントは、それぞれ独立した `isOnline` state を持ちます。これは、フックがコンポーネントのトップレベルで呼び出されるためです。

## ESLint プラグイン

React は、これらのルールを自動的にチェックする ESLint プラグインを提供しています：

- [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks)

このプラグインは、Create React App やその他の React スターターキットにデフォルトで含まれています。

### プラグインのインストール

プラグインをまだインストールしていない場合は、以下のコマンドでインストールできます：

```bash
npm install eslint-plugin-react-hooks --save-dev
```

### ESLint 設定

`.eslintrc` ファイルに以下を追加します：

```json
{
  "plugins": [
    "react-hooks"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### ルールの説明

- **`react-hooks/rules-of-hooks`** - フックのルール（トップレベルでの呼び出し、条件分岐内での呼び出し禁止など）をチェックします
- **`react-hooks/exhaustive-deps`** - エフェクトフック（`useEffect`、`useCallback`、`useMemo` など）の依存配列が正しく設定されているかをチェックします

## カスタムフックの作成

カスタムフックを作成する際も、同じルールが適用されます：

```jsx
function useOnlineStatus() {
  // ✅ Good: custom Hook の本体でフックを呼び出す
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```

カスタムフックの名前は必ず `use` で始める必要があります。これにより、ESLint プラグインがフックのルールを適用できます。

### カスタムフックの命名規則

- ✅ `useOnlineStatus` - `use` で始まる
- ✅ `useFormInput` - `use` で始まる
- ✅ `useWindowWidth` - `use` で始まる
- 🔴 `getOnlineStatus` - `use` で始まらない
- 🔴 `onlineStatus` - `use` で始まらない

## まとめ

フックのルールを守ることで：

- React がフックの呼び出し順序を保証できる
- 各コンポーネントが独立した state を持つことができる
- コードが予測可能で、デバッグしやすくなる
- ESLint プラグインが自動的にエラーを検出してくれる

**重要なポイント：**

1. フックは常にトップレベルで呼び出す
2. 条件分岐、ループ、ネストされた関数の中でフックを呼び出さない
3. 早期 return の前にすべてのフックを呼び出す
4. フックはコンポーネントまたはカスタムフックからのみ呼び出す
5. カスタムフックの名前は `use` で始める
6. ESLint プラグインを使用して、ルール違反を自動検出する

これらのルールに従うことで、React はあなたのコンポーネントを適切に管理し、バグのない安定したアプリケーションを構築できます。
