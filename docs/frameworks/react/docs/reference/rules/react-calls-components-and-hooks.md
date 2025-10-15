# コンポーネントやフックを呼び出すのは React

ユーザ体験を最適化するために必要に応じてコンポーネントやフックを呼び出すというのは React 自身の責務です。React は宣言型 (declarative) です。あなたは*何 (what)* をレンダーしたいのかだけを React に伝え、それを*どうやって (how)* ユーザにうまく表示するのかについては React が考えます。

## コンポーネント関数を直接呼び出さない

コンポーネントは JSX 内でのみ使用すべきです。通常の関数として呼び出してはいけません。呼び出すのは React です。

React は、[レンダー中](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code)に、ユーザに何を表示すべきかを決定するため、コンポーネント関数を呼び出す必要があります。

```jsx
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Good: Only use components in JSX
}
```

```jsx
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Bad: Never call them directly
}
```

コンポーネントが JSX 内で使用されている場合、React はいつそれをレンダーするかを決定できます。

### React にレンダーの指揮権を与える利点

React にレンダーの指揮権を与えることで、以下のような利点があります：

#### 1. コンポーネントが単なる関数以上のものになる

React は、コンポーネントに関連する情報を*ツリー内で保持*することができます。例えば、[state](/reference/react/useState) などのローカル state を保持できます。

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

コンポーネントを通常の関数として呼び出すと、state を自分で管理する必要が出てきます：

```jsx
function App() {
  const [count, setCount] = useState(0); // 🔴 Bad: managing state manually
  return (
    <button onClick={() => setCount(count + 1)}>
      {Counter({ count })} {/* 🔴 Bad: calling component directly */}
    </button>
  );
}
```

#### 2. コンポーネントの型情報を差分検出処理時に利用できる

React にコンポーネントの呼び出しを任せることで、React はツリーの概念的な構造についてより多くの情報を得ることができます：

```jsx
function Parent() {
  return (
    <>
      <Child />
      <Child />
      <Child />
    </>
  );
}
```

React は `Child` がツリー内の 3 つの異なる場所にレンダーされていることを知っているため、それぞれに対して独立した state を保持できます。

一方、コンポーネントを直接呼び出すと、React はこの構造を理解できません：

```jsx
function Parent() {
  return (
    <>
      {Child()}
      {Child()}
      {Child()}
    </>
  );
}
```

#### 3. React がユーザ体験を向上させられる

コンポーネントの呼び出しを React に任せることで、React はレンダーのタイミングを最適化できます。

例えば、React はコンポーネントのレンダー間でブラウザに描画を行うことができるため、大きなコンポーネントツリーをレンダーする際にブラウザがフリーズすることを防げます。手動でコンポーネントを呼び出すと、このような最適化はできません。

```jsx
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item.id} item={item} /> // ✅ Good: React can optimize
      ))}
    </ul>
  );
}
```

```jsx
function List({ items }) {
  return (
    <ul>
      {items.map(item =>
        ListItem({ item }) // 🔴 Bad: No optimization possible
      )}
    </ul>
  );
}
```

#### 4. より良いデバッグ体験

コンポーネントがライブラリの第一級市民である場合、開発中の自己診断のための[リッチな開発者ツール](https://react.dev/learn/react-developer-tools)を構築できます。

```jsx
// React DevTools で表示される内容
<App>
  <Layout>
    <Article />
  </Layout>
</App>
```

コンポーネントを直接呼び出すと、React DevTools はこのような構造を認識できません。

#### 5. より効率的な差分検出処理

React は、ツリー内のどのコンポーネントを再レンダーする必要があるかを正確に知ることができます。

```jsx
function TodoList({ todos, filter }) {
  return (
    <>
      <FilterButtons filter={filter} />
      {todos.map(todo => <Todo key={todo.id} todo={todo} />)}
    </>
  );
}
```

`filter` が変更されても、`todos` が変更されていなければ、React は `FilterButtons` のみを再レンダーし、`Todo` コンポーネントはスキップできます。

## フックを通常の値として取り回さない

フックはコンポーネントまたはフックの内部でのみ呼び出すべきです。通常の値のように取り回してはいけません。

[フック](/reference/react/hooks)により、コンポーネントを React の機能で拡張することができます。フックは常に関数として呼び出す必要があり、通常の値として取り回してはいけません。これにより*宣言型*なプログラミングが可能になり、つまりコンポーネント内で*何をするか*を記述すれば、React が*いつ*それを実行するかを決定します。

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ✅ Good: Hook called directly in component
  return <div>Welcome to {roomId}!</div>;
}
```

```jsx
function ChatRoom({ roomId }) {
  const connect = () => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  };
  useEffect(connect, [roomId]); // 🔴 Bad: passing effect logic as a value
  return <div>Welcome to {roomId}!</div>;
}
```

### フックを動的に変更しない

フックは可能な限り「静的」であるべきです。つまり、動的に構成すべきではありません。

例えば、高階フック（他のフックを引数として受け取るフック）を書かないでください：

```jsx
function ChatRoom({ roomId, notificationHandler }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('notification', notificationHandler); // 🔴 Bad: dynamic hook composition
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, notificationHandler]);
  return <div>Welcome to {roomId}!</div>;
}
```

代わりに、フックの呼び出しは常に同じ方法で行い、ロジックを引数として渡します：

```jsx
function ChatRoom({ roomId }) {
  const onNotification = useCallback((notification) => {
    showNotification(notification); // ✅ Good: logic as callback
  }, []);

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.on('notification', onNotification);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, onNotification]);

  return <div>Welcome to {roomId}!</div>;
}
```

### フックを条件付きで呼び出さない

フックは条件付きで呼び出してはいけません：

```jsx
function Counter({ shouldTrack }) {
  if (shouldTrack) {
    useEffect(() => {
      trackCount(); // 🔴 Bad: conditional hook call
    });
  }
  const [count, setCount] = useState(0);
  // ...
}
```

代わりに、条件はフックの*内部*に配置します：

```jsx
function Counter({ shouldTrack }) {
  useEffect(() => {
    if (shouldTrack) {
      trackCount(); // ✅ Good: condition inside hook
    }
  });
  const [count, setCount] = useState(0);
  // ...
}
```

詳細については、[フックのルール](/reference/rules/rules-of-hooks)を参照してください。

### フックを呼び出した後に早期 return しない

フックは、コンポーネントが値を返す前にすべて呼び出す必要があります：

```jsx
function UserProfile({ userId }) {
  if (!userId) {
    return null; // 🔴 Bad: early return before all hooks
  }
  const [user, setUser] = useState(null);
  // ...
}
```

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null); // ✅ Good: all hooks before return

  if (!userId) {
    return null;
  }
  // ...
}
```

### フックをループや条件内で呼び出さない

フックはループ、条件分岐、ネストされた関数の内部で呼び出してはいけません：

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => {
        const [isComplete, setIsComplete] = useState(false); // 🔴 Bad: hook in loop
        return <li key={todo.id}>{todo.text}</li>;
      })}
    </ul>
  );
}
```

代わりに、別のコンポーネントを作成します：

```jsx
function TodoItem({ todo }) {
  const [isComplete, setIsComplete] = useState(false); // ✅ Good: hook in component
  return <li>{todo.text}</li>;
}

function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

## まとめ

- コンポーネント関数を直接呼び出さず、JSX 内で使用する
- React にレンダーの指揮権を与えることで、最適化と優れた開発者体験が得られる
- フックは通常の値として取り回さず、直接呼び出す
- フックは静的に呼び出し、条件分岐やループの外で使用する
- すべてのフックを早期 return の前に呼び出す

これらのルールに従うことで、React はあなたのコンポーネントとフックを適切に管理し、最高のユーザ体験を提供できるようになります。
