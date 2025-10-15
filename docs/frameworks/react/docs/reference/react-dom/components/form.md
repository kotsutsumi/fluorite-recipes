# `<form>`

ブラウザ組み込みの `<form>` コンポーネントを利用することで、情報を送信するためのインタラクティブなコントロールを作成できます。

```jsx
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

## リファレンス

### `<form>`

情報を送信するためのインタラクティブなコントロールを作成するには、ブラウザ組み込みの `<form>` コンポーネントを使用します。

```jsx
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

#### Props

`<form>` は、すべての一般的な要素の props をサポートしています。

**`action`**: URL または関数を指定できます。
- **URL が渡された場合**: フォームは標準的な HTML フォームとして動作します
- **関数が渡された場合**: フォーム送信を処理する関数として動作します。関数は `formData` を引数として受け取ります

```jsx
// クライアント側の関数
function search(formData) {
  const query = formData.get("query");
  // 検索処理を実行
}

// サーバ関数
async function addToCart(formData) {
  'use server'
  const productId = formData.get("productId");
  await updateCart(productId);
}
```

#### 注意点

- 関数が `action` または `formAction` に渡された場合、HTTP メソッドは常に POST になります
- `action` が関数の場合、`method` prop は無視されます

## 使用法

### クライアント側でのフォーム送信処理

クライアント側でフォームの送信を処理するには、`action` prop に関数を渡します。関数は `formData` オブジェクトを受け取り、フォームデータにアクセスできます。

```jsx
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }

  return (
    <form action={search}>
      <input name="query" placeholder="検索キーワードを入力" />
      <button type="submit">Search</button>
    </form>
  );
}
```

### サーバ関数を使用したフォーム送信

サーバ側でフォームを処理するには、`'use server'` ディレクティブを使用したサーバ関数を `action` に渡します。

```jsx
export default function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const id = formData.get("productId");
    await updateCart(id);
  }

  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">カートに追加</button>
    </form>
  );
}
```

### 送信中の状態表示

フォームの送信中に UI を更新するには、`useFormStatus` フックを使用します。

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "送信中..." : "送信"}
    </button>
  );
}

export default function Form() {
  async function submit(formData) {
    'use server'
    await saveData(formData);
  }

  return (
    <form action={submit}>
      <input name="username" />
      <SubmitButton />
    </form>
  );
}
```

### 楽観的更新

サーバからの応答を待たずに UI を即座に更新するには、`useOptimistic` フックを使用します。

```jsx
import { useOptimistic } from 'react';

export default function TodoList({ todos }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { text: newTodo, pending: true }]
  );

  async function addTodo(formData) {
    const text = formData.get("todo");
    addOptimisticTodo(text);
    await saveTodo(text);
  }

  return (
    <form action={addTodo}>
      <input name="todo" />
      <button type="submit">追加</button>
      <ul>
        {optimisticTodos.map((todo, index) => (
          <li key={index} style={{ opacity: todo.pending ? 0.5 : 1 }}>
            {todo.text}
          </li>
        ))}
      </ul>
    </form>
  );
}
```

### フォームエラーの処理

`action` 関数からエラーを返すことで、フォームのバリデーションエラーを処理できます。

```jsx
export default function Signup() {
  async function signup(formData) {
    'use server'
    const email = formData.get("email");

    if (!email.includes("@")) {
      return { error: "有効なメールアドレスを入力してください" };
    }

    await createUser(email);
  }

  return (
    <form action={signup}>
      <input name="email" type="email" required />
      <button type="submit">登録</button>
    </form>
  );
}
```

## トラブルシューティング

### フォームが送信されない

- `<button>` に `type="submit"` が指定されているか確認してください
- `action` prop が正しく設定されているか確認してください
- フォーム内に少なくとも1つの入力フィールドがあるか確認してください

### サーバ関数が呼び出されない

- 関数に `'use server'` ディレクティブが含まれているか確認してください
- サーバコンポーネントから呼び出されているか確認してください
- フレームワークがサーバアクションをサポートしているか確認してください
