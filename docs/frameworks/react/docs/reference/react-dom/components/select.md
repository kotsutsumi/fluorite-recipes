# `<select>`

ブラウザ組み込みの `<select>` コンポーネントを利用することで、オプション付きのセレクトボックスをレンダーできます。

```jsx
<select>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
  <option value="orange">オレンジ</option>
</select>
```

## リファレンス

### `<select>`

セレクトボックスを表示するには、ブラウザ組み込みの `<select>` コンポーネントをレンダーします。

```jsx
<select>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
  <option value="orange">オレンジ</option>
</select>
```

#### Props

`<select>` は、すべての一般的な要素の props をサポートしています。

**制御されたセレクトボックスのための Props:**

- **`value`**: 文字列（または `multiple={true}` の場合は文字列の配列）。どのオプションが選択されているかを制御します

`value` を渡すと、セレクトは制御されたコンポーネントになります。

**非制御セレクトボックスのための Props:**

- **`defaultValue`**: 文字列（または `multiple={true}` の場合は文字列の配列）。初期選択オプションを指定します

**両方のタイプのセレクトボックスでサポートされる Props:**

- **`autoComplete`**: 文字列。自動補完の動作を指定します
- **`autoFocus`**: ブール値。`true` の場合、React はマウント時に要素にフォーカスします
- **`children`**: `<select>` は `<option>`、`<optgroup>`、および `<datalist>` コンポーネントを子として受け入れます
- **`disabled`**: ブール値。`true` の場合、セレクトボックスは無効になり、淡色表示されます
- **`form`**: 文字列。このセレクトが属する `<form>` の `id` を指定します
- **`multiple`**: ブール値。`true` の場合、ブラウザは複数選択を許可します
- **`name`**: 文字列。フォーム送信時にこのセレクトの名前を指定します
- **`onChange`**: イベントハンドラ関数。制御されたセレクトでは必須です。ユーザが異なるオプションを選択するとすぐに発火します。ブラウザの `input` イベントのように動作します
- **`onChangeCapture`**: `onChange` のキャプチャフェーズで発火するバージョン
- **`onInput`**: イベントハンドラ関数。ユーザが値を変更するとすぐに発火します
- **`onInputCapture`**: `onInput` のキャプチャフェーズで発火するバージョン
- **`onInvalid`**: イベントハンドラ関数。フォーム送信時に入力の検証が失敗した場合に発火します
- **`onInvalidCapture`**: `onInvalid` のキャプチャフェーズで発火するバージョン
- **`required`**: ブール値。`true` の場合、フォーム送信時に値が必要です
- **`size`**: 数値。`multiple={true}` セレクトの場合、最初に表示される項目数を指定します

#### 注意点

**制御されたセレクトの場合:**

- `value` を渡す場合、`onChange` ハンドラも必要です
- `onChange` ハンドラは、渡された state 変数を同期的に更新する必要があります
- 制御されたセレクトの値は、渡された prop の値と常に一致します

**制御と非制御の切り替え:**

- セレクトのライフタイム中に制御と非制御を切り替えることはできません
- 制御されたセレクトと非制御セレクトを同時に使用しないでください
- セレクトは、初期値に `value` または `defaultValue` のいずれかを持つべきです

**`<option>` での `selected` 属性:**

- React では、`<option>` に `selected` 属性を渡すことはサポートされていません
- 非制御セレクトボックスの場合は、`<select defaultValue>` を使用します
- 制御されたセレクトボックスの場合は、`<select value>` を使用します

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

通常、すべての `<select>` を `<label>` タグ内に配置します。これにより、このラベルがそのセレクトボックスに関連付けられていることがブラウザに伝わります。

```jsx
<label>
  果物を選択:
  <select name="selectedFruit">
    <option value="apple">りんご</option>
    <option value="banana">バナナ</option>
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

注意: **React では、個々の `<option>` に `selected` 属性を渡すことはサポートされていません。**

### フォーム送信時にセレクトボックスの値を読み取る

セレクトボックスの周りに `<form>` を追加し、その中に `<button type="submit">` を配置します。フォームの `action` イベントハンドラが呼び出されます。

```jsx
export default function EditPost() {
  function handleSubmit(formData) {
    const fruit = formData.get('selectedFruit');
    console.log(fruit); // 例: "orange"
  }

  return (
    <form action={handleSubmit}>
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

### 複数選択を提供する

`multiple={true}` を `<select>` に渡すことで、ユーザが複数のオプションを選択できるようにします。その場合、`defaultValue` または `value` で初期選択値を指定する際は、配列である必要があります。

```jsx
export default function FruitPicker() {
  return (
    <label>
      果物を選択:
      <select
        name="selectedFruit"
        multiple={true}
        defaultValue={['orange', 'banana']}
      >
        <option value="apple">りんご</option>
        <option value="banana">バナナ</option>
        <option value="orange">オレンジ</option>
      </select>
    </label>
  );
}
```

制御された複数選択セレクトボックスの例:

```jsx
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruits, setSelectedFruits] = useState(['orange']);

  function handleChange(e) {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map(option => option.value);
    setSelectedFruits(values);
  }

  return (
    <>
      <label>
        果物を選択:
        <select
          multiple={true}
          value={selectedFruits}
          onChange={handleChange}
        >
          <option value="apple">りんご</option>
          <option value="banana">バナナ</option>
          <option value="orange">オレンジ</option>
        </select>
      </label>
      <p>選択した果物: {selectedFruits.join(', ')}</p>
    </>
  );
}
```

## トラブルシューティング

### オプションを選択してもセレクトボックスが更新されない

`value` を持つセレクトボックスを `onChange` なしでレンダーすると、コンソールにエラーが表示されます:

```jsx
// 🔴 バグ: onChange ハンドラのない制御されたセレクト
<select value={selectedFruit}>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
</select>
```

**制御されたセレクトボックスをレンダーするには、`onChange` ハンドラも指定する必要があります。**

```jsx
// ✅ 正しい: onChange を持つ制御されたセレクト
<select value={selectedFruit} onChange={e => setSelectedFruit(e.target.value)}>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
</select>
```

値を読み取り専用にしたい場合は、`disabled` prop を追加してエラーを抑制します:

```jsx
// ✅ 正しい: onChange のない無効化された制御されたセレクト
<select value={selectedFruit} disabled={true}>
  <option value="apple">りんご</option>
  <option value="banana">バナナ</option>
</select>
```

### セレクトボックスのキャレットが選択ごとに先頭にジャンプする

セレクトボックスを制御する場合、`onChange` 中に state 変数を DOM からのセレクト値に更新する必要があります。

`e.target.value` 以外のものに更新することはできません:

```jsx
// 🔴 バグ: セレクトを e.target.value 以外に更新
function handleChange(e) {
  setSelectedFruit(e.target.value.toUpperCase());
}
```

非同期的に更新することもできません:

```jsx
// 🔴 バグ: 非同期的なセレクトの更新
function handleChange(e) {
  setTimeout(() => {
    setSelectedFruit(e.target.value);
  }, 100);
}
```

コードを修正するには、同期的に `e.target.value` に更新します:

```jsx
// ✅ 正しい: 制御されたセレクトを e.target.value と同期的に更新
function handleChange(e) {
  setSelectedFruit(e.target.value);
}
```

これで問題が解決しない場合、`onChange` が呼び出されるたびにセレクトが DOM から削除されて再追加されている可能性があります。これは、毎回レンダー時にセレクトまたはその親 `<form>` をリセットしている場合や、常に異なる `key` 属性を渡している場合に発生します。

### "A component is changing an uncontrolled select to be controlled" というエラーが表示される

コンポーネントに `value` を提供する場合、そのライフタイム全体で文字列（または `multiple={true}` の場合は文字列の配列）のままである必要があります。

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

複数選択の場合:

```jsx
// 🔴 バグ: value が最初 undefined
<select multiple={true} value={fruits}>
  <option value="apple">りんご</option>
</select>

// ✅ 正しい: value が常に配列
<select multiple={true} value={fruits ?? []}>
  <option value="apple">りんご</option>
</select>
```
