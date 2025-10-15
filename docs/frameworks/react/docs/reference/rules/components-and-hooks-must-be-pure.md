# コンポーネントとフックを純粋に保つ

純関数 (pure function) とは計算を行うだけで、それ以上のことはしない関数です。これによりコードの理解やデバッグが容易になり、React が自動的にコンポーネントとフックを最適化できるようになります。

## 純粋性が重要である理由

React を React たらしめる重要な概念のひとつが*純粋性 (purity)* です。純粋なコンポーネントやフックとは、以下のような特徴を持つものです：

- **冪等 (idempotent) であること** – 同じ入力（コンポーネントの props、state、context、フックの引数）で実行するたびに[常に同じ結果が得られる](#components-and-hooks-must-be-idempotent)こと
- **レンダー時に副作用がない** – 副作用を持つコードは[レンダーとは別に](#side-effects-must-run-outside-of-render)実行する必要があります。例えば、[イベントハンドラ](/learn/responding-to-events)（ユーザがやり取りして UI を更新する場所）や[エフェクト](/reference/react/useEffect)（レンダー後に実行される場所）として実行します
- **ローカルな値以外を変更しない** – コンポーネントやフックは、[レンダー中にローカルではない値を変更すべきではありません](#mutation)

レンダーが純粋に保たれていると、React はどの更新をユーザに最初に表示すべきかを理解できます。これは、レンダーの純粋性のおかげです。コンポーネントが[レンダー](#side-effects-must-run-outside-of-render)中に副作用を持たないのであれば、React はあまり緊急でないコンポーネントの更新を遅らせることができます。

つまり、レンダーロジックが何度実行されても、ユーザからは同じ結果が見えるのであれば、一部のコンポーネントのレンダーを一時停止しても問題ありません。

## コンポーネントとフックを冪等にする

コンポーネントは、その入力である props、state、およびコンテクストに対して常に同じ出力を返さなければなりません。これは*冪等性*として知られています。[冪等性](https://en.wikipedia.org/wiki/Idempotence)は関数型プログラミングで一般的に使われる用語で、同じ入力で[そのコードを何度実行しても常に同じ結果が得られる](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning)という考え方です。

つまり、コンポーネントをレンダーするたびに*すべての*入力の組み合わせに対して同じ JSX が返される必要があります。

### 冪等でないコンポーネントの例

以下のコンポーネントは冪等ではありません。毎回異なる値を返すため、同じ入力に対して異なる結果を返します：

```jsx
function Clock() {
  const time = new Date(); // 🔴 Bad: always returns a different result!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` は毎回異なる日時を返すため、このコンポーネントは冪等ではありません。これをレンダーするたびに、異なる時刻が表示されます。

### 冪等なコンポーネントに修正する

冪等性を保つために、時刻の更新を[副作用](#side-effects-must-run-outside-of-render)に移動させます：

```jsx
function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Good: non-idempotent code no longer runs in render
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{time.toLocaleString()}</span>
}
```

非冪等的な `new Date()` の呼び出しをエフェクトにラップすることで、その計算がレンダーの外に移動されます。

外部の state と同期する必要がない場合は、[イベントハンドラ](/learn/responding-to-events)を使って、ユーザ操作に応じてのみ state を更新することも検討してください。

## 副作用はレンダーの外で実行する

[副作用](/learn/keeping-components-pure#side-effects-unintended-consequences)はレンダーロジック内では実行すべきではありません。React はコンポーネントを複数回レンダーして最高のユーザ体験を提供するためです。

> **副作用とは**
>
> 副作用とは、関数のスコープ外で何かを変更する操作のことです。例えば、画面の更新、アニメーションの開始、データの変更などです。
>
> 副作用は通常、[イベントハンドラ](/learn/responding-to-events)や[エフェクト](/reference/react/useEffect)内に属します。決してレンダー中には実行しないでください。

レンダーは純粋に保つ必要がありますが、アプリが何か面白いことをするため、例えば画面に何かを表示するためには、どこかで副作用が必要です！ このルールのポイントは、副作用がコンポーネントのレンダー*中*に発生すべきではないということです。React はコンポーネントを複数回レンダーすることがあるためです。ほとんどの場合、副作用を処理するには[イベントハンドラ](https://react.dev/learn/responding-to-events)を使用します。イベントハンドラを使用することは、このコードがレンダー中に実行される必要がなく、したがってレンダーを純粋に保つ必要があることを React に明示的に伝えることになります。すべてのオプションを使い切った場合に限り、最後の手段として `useEffect` を使用して副作用を処理できます。

### ミューテーション（変更）を避ける

コンポーネントはレンダー中に、既存の変数やオブジェクトを変更すべきではありません。

#### ローカルなミューテーション

コンポーネントが*ローカルに*作成した変数を変更することは問題ありません：

```jsx
function FriendList({ friends }) {
  const items = []; // ✅ Good: locally created
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Good: local mutation is okay
  }
  return <section>{items}</section>;
}
```

レンダー中に `items` 配列を作成し、その中にアイテムを追加しています。このコードはこの配列が*ローカルに*作成されたものであり、コンポーネント外の他のコードからはアクセスできないため、問題ありません。`FriendList` の外部から見ると、このミューテーションは発生していません。これが*ローカルミューテーション*であり、完全に問題ありません。

#### 既存の値のミューテーション（禁止）

しかし、既に存在するデータを変更することは避けるべきです：

```jsx
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    friend.isOnline = true; // 🔴 Bad: mutates a value that wasn't created during render
  }
  // ...
}
```

レンダー中に既存のデータを変更すると、予測不可能なバグにつながる可能性があります。

#### ミューテーションの代わりに新しいオブジェクトを作成する

props として渡されたデータを変更する代わりに、新しいバージョンのデータを作成します：

```jsx
function FriendList({ friends }) {
  const items = friends.map(friend =>
    <Friend key={friend.id} friend={{
      ...friend,
      isOnline: true
    }} />
  );
  return <section>{items}</section>;
}
```

ここでは `friends` を変更せず、それぞれの友達に対して新しいオブジェクトを作成しています。

### props と state のミューテーション

props と state はレンダー中に決して変更すべきではない特別な値です：

```jsx
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Bad: never mutate props directly
  return <Link url={item.url}>{item.title}</Link>;
}
```

```jsx
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Good: make a copy instead
  return <Link url={url}>{item.title}</Link>;
}
```

唯一の例外は、新しく作成している state を変更する場合です：

```jsx
function MyComponent() {
  const [items, setItems] = useState([]);

  const handleAddItem = (item) => {
    items.push(item); // 🔴 Bad: mutates state directly
    setItems(items);
  };
  // ...
}
```

```jsx
function MyComponent() {
  const [items, setItems] = useState([]);

  const handleAddItem = (item) => {
    setItems([...items, item]); // ✅ Good: creates new array
  };
  // ...
}
```

ただし、`useState` を呼び出して*新たに*作成した state は、`set` 関数で設定する前であれば変更できます：

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);

  function handleAddTodo(text) {
    const newTodo = { id: nextId++, text }; // ✅ Good: This object was just created
    setTodos([...todos, newTodo]);
  }
  // ...
}
```

### 共有された値の変更を避ける

一般的に、レンダー中に他のコンポーネントと共有される可能性のある値を変更してはいけません：

```jsx
let nextId = 0;

function Todo({ text }) {
  const id = nextId++; // 🔴 Bad: mutating a shared value during render
  return <li>{id}: {text}</li>;
}
```

```jsx
let nextId = 0;

function Todo({ text, id }) { // ✅ Good: receiving id as a prop
  return <li>{id}: {text}</li>;
}

function TodoList() {
  const [todos, setTodos] = useState([]);

  function handleAddTodo(text) {
    setTodos([...todos, { id: nextId++, text }]); // ✅ Good: mutated in event handler
  }
  // ...
}
```

## まとめ

- コンポーネントとフックは冪等である必要があります
- 副作用はレンダー中ではなく、イベントハンドラやエフェクトで実行します
- ローカルな値以外を変更しないでください
- props と state は変更不可能なものとして扱ってください
- 新しく作成した値のみを変更してください

これらのルールに従うことで、コードが予測可能で、理解しやすく、デバッグしやすくなります。また、React がコンポーネントを自動的に最適化できるようになります。
