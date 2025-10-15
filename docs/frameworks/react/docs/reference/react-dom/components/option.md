# `<option>`

ブラウザ組み込みの `<option>` コンポーネントを利用することで、`<select>` ボックス内に選択肢をレンダーすることができます。

```jsx
<select>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
  <option value="orange">オレンジ</option>
</select>
```

## リファレンス

### `<option>`

ブラウザ組み込みの `<option>` コンポーネントを使用すると、`<select>` ボックス内に選択肢をレンダーできます。

```jsx
<select>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
  <option value="orange">オレンジ</option>
</select>
```

#### Props

`<option>` は、すべての一般的な要素の props をサポートしています。

さらに、`<option>` は以下の props をサポートします:

**`disabled`**: ブール値。`true` の場合、オプションは選択できなくなり、淡色表示されます。

**`label`**: 文字列。オプションの意味を指定します。指定しない場合、オプション内のテキストが使用されます。

**`value`**: フォーム送信時にこのオプションが選択されている場合に送信される値。

#### 注意点

**React は `selected` 属性をサポートしていません。** 代わりに、非制御のセレクトボックスの場合は親の `<select defaultValue>` に、制御されたセレクトボックスの場合は `<select value>` にこのオプションの `value` を渡してください。

## 使用法

### オプション付きのセレクトボックスを表示する

`<option>` コンポーネントのリストを含む `<select>` をレンダーして、セレクトボックスを表示します。各 `<option>` に、フォームと共に送信されるデータを表す `value` を指定します。

```jsx
export default function FruitPicker() {
  return (
    <label>
      果物を選択:
      <select name="selectedFruit">
        <option value="apple">りんご</option>
        <option value="banana">バナナ</option>
        <option value="orange">オレンジ</option>
      </select>
    </label>
  );
}
```

### セレクトボックスにラベルを提供する

通常、すべての `<select>` を `<label>` タグ内に配置します。これにより、このラベルがそのセレクトボックスに関連付けられていることがブラウザに伝わります。ユーザがラベルをクリックすると、ブラウザは自動的にセレクトボックスにフォーカスします。

```jsx
<label>
  果物を選択:
  <select name="selectedFruit">
    <option value="apple">りんご</option>
    <option value="banana">バナナ</option>
    <option value="orange">オレンジ</option>
  </select>
</label>
```

または、`<select id>` と `<label htmlFor>` を同じ ID で指定することもできます。

```jsx
<>
  <label htmlFor="fruit-select">果物を選択:</label>
  <select id="fruit-select" name="selectedFruit">
    <option value="apple">りんご</option>
    <option value="banana">バナナ</option>
    <option value="orange">オレンジ</option>
  </select>
</>
```

### 初期選択オプションを提供する

デフォルトでは、ブラウザはリスト内の最初の `<option>` を選択します。異なるオプションをデフォルトで選択するには、そのオプションの `value` を `<select>` 要素の `defaultValue` として渡します。

```jsx
export default function FruitPicker() {
  return (
    <label>
      果物を選択:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">りんご</option>
        <option value="banana">バナナ</option>
        <option value="orange">オレンジ</option>
      </select>
    </label>
  );
}
```

注意: **React では、`<option>` に `selected` 属性を渡すことはサポートされていません。**

### フォーム送信時にセレクトボックスの値を読み取る

セレクトボックスの周りに `<form>` を追加し、その中に `<button type="submit">` を配置します。フォームの `action` イベントハンドラが呼び出されます。デフォルトでは、ブラウザはフォームデータを現在の URL に送信し、ページをリフレッシュします。`e.preventDefault()` を呼び出すことでその動作を上書きできます。`new FormData(e.target)` でフォームデータを読み取ります。

```jsx
export default function EditPost() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fruit = formData.get('selectedFruit');
    console.log(fruit); // 例: "orange"
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        果物を選択:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">りんご</option>
          <option value="banana">バナナ</option>
          <option value="orange">オレンジ</option>
        </select>
      </label>
      <button type="submit">送信</button>
    </form>
  );
}
```

### state 変数でセレクトボックスを制御する

`<select />` のようなセレクトボックスは非制御です。初期選択値を `<select defaultValue="orange" />` のように渡しても、JSX は初期値のみを指定し、現在の値は制御しません。

**制御されたセレクトボックスをレンダーするには、`value` prop を渡します。** React は、渡された値を常に持つようにセレクトボックスを強制します。通常、state 変数を宣言してこれを行います。

```jsx
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');

  return (
    <>
      <label>
        果物を選択:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">りんご</option>
          <option value="banana">バナナ</option>
          <option value="orange">オレンジ</option>
        </select>
      </label>
      <p>選択した果物: {selectedFruit}</p>
    </>
  );
}
```

制御されたセレクトボックスは、選択ごとに何らかの state を更新したい場合に便利です。

```jsx
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [message, setMessage] = useState('');

  function handleChange(e) {
    setSelectedFruit(e.target.value);
    setMessage(`${e.target.value}を選択しました!`);
  }

  return (
    <>
      <label>
        果物を選択:
        <select value={selectedFruit} onChange={handleChange}>
          <option value="apple">りんご</option>
          <option value="banana">バナナ</option>
          <option value="orange">オレンジ</option>
        </select>
      </label>
      <p>{message}</p>
    </>
  );
}
```

## トラブルシューティング

### オプションを選択してもセレクトボックスが更新されない

`value` を持つセレクトボックスを `onChange` なしでレンダーすると、コンソールにエラーが表示されます:

```jsx
// 🔴 バグ: onChange ハンドラのない制御されたセレクトボックス
<select value={selectedFruit}>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
</select>
```

制御されたセレクトボックスをレンダーするには、`onChange` ハンドラも指定する必要があります。

```jsx
// ✅ 正しい: onChange を持つ制御されたセレクトボックス
<select value={selectedFruit} onChange={e => setSelectedFruit(e.target.value)}>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
</select>
```

値を読み取り専用にしたい場合は、`disabled` prop を追加してエラーを抑制します:

```jsx
// ✅ 正しい: onChange のない無効化された制御されたセレクトボックス
<select value={selectedFruit} disabled={true}>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
</select>
```

### "A component is changing an uncontrolled select to be controlled" というエラーが表示される

コンポーネントに `value` を提供する場合、そのライフタイム全体で文字列のままである必要があります。

最初に `value={undefined}` を渡してから後で `value="orange"` を渡すことはできません。React は、コンポーネントを非制御にするか制御するかを判断できないためです。

制御されたコンポーネントは、常に `undefined` や `null` ではなく文字列の `value` を受け取る必要があります。

```jsx
// 🔴 バグ: value が最初 undefined
<select value={fruit}>
  <option value="apple">りんご</option>
</select>

// ✅ 正しい: value が常に文字列
<select value={fruit ?? 'apple'}>
  <option value="apple">りんご</option>
</select>
```
