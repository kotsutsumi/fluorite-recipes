# `<input>`

ブラウザ組み込みの `<input>` コンポーネントを利用することで、さまざまな種類のフォーム入力をレンダーすることができます。

```jsx
<input name="firstName" />
```

## リファレンス

### `<input>`

入力フィールドを表示するには、ブラウザ組み込みの `<input>` コンポーネントをレンダーします。

```jsx
<input name="firstName" defaultValue="Taylor" />
```

#### Props

`<input>` は、すべての一般的な要素の props をサポートしています。

**制御された入力のための Props:**

- **`checked`**: ブール値。チェックボックスまたはラジオボタンが選択されているかどうかを制御します
- **`value`**: 文字列。テキスト入力の場合、入力のテキストを制御します

これらのいずれかを渡すと、入力は制御されたコンポーネントになります。

**非制御入力のための Props:**

- **`defaultChecked`**: ブール値。`type="checkbox"` および `type="radio"` 入力の初期値を指定します
- **`defaultValue`**: 文字列。テキスト入力の初期値を指定します

**すべての入力タイプでサポートされる Props:**

- **`accept`**: 文字列。`type="file"` 入力で受け入れるファイルタイプを指定します
- **`alt`**: 文字列。`type="image"` 入力の代替画像テキストを指定します
- **`capture`**: 文字列。`type="file"` 入力でキャプチャするメディア（マイク、ビデオ、カメラ）を指定します
- **`autoComplete`**: 文字列。自動補完の動作を指定します
- **`autoFocus`**: ブール値。`true` の場合、React はマウント時に要素にフォーカスします
- **`disabled`**: ブール値。`true` の場合、入力は無効になり、淡色表示されます
- **`form`**: 文字列。この入力が属する `<form>` の `id` を指定します
- **`max`**: 数値。数値および日時入力の最大値を指定します
- **`min`**: 数値。数値および日時入力の最小値を指定します
- **`multiple`**: ブール値。`type="file"` および `type="email"` で複数の値を許可します
- **`name`**: 文字列。フォーム送信時にこの入力の名前を指定します
- **`pattern`**: 文字列。`value` が一致すべきパターンを指定します
- **`placeholder`**: 文字列。入力値が空のときに淡色で表示されます
- **`readOnly`**: ブール値。`true` の場合、入力はユーザによって編集できません
- **`required`**: ブール値。`true` の場合、フォーム送信時に値が必要です
- **`size`**: 数値。幅の設定に似ていますが、単位はコントロールに依存します
- **`step`**: 正の数値。増分ステップの間隔を指定します
- **`type`**: 文字列。入力タイプを指定します

**イベントハンドラ Props:**

- **`onChange`**: イベントハンドラ関数。制御された入力では必須です。ユーザによって入力値が変更されたときに即座に発火します
- **`onChangeCapture`**: `onChange` のキャプチャフェーズ版
- **`onInput`**: イベントハンドラ関数。値が変更されたときに即座に発火します
- **`onInputCapture`**: `onInput` のキャプチャフェーズ版
- **`onInvalid`**: イベントハンドラ関数。フォーム送信時に入力の検証が失敗した場合に発火します
- **`onInvalidCapture`**: `onInvalid` のキャプチャフェーズ版
- **`onSelect`**: イベントハンドラ関数。`<input>` 内の選択が変更された後に発火します
- **`onSelectCapture`**: `onSelect` のキャプチャフェーズ版

#### 注意点

**制御された入力の場合:**

- チェックボックスの場合、`checked` を渡すには `onChange` ハンドラが必要です
- テキスト入力の場合、`value` を渡すには `onChange` ハンドラが必要です
- `onChange` ハンドラは、渡された state 変数を同期的に更新する必要があります
- 制御された入力の値は、渡された prop の値と常に一致します

**制御と非制御の切り替え:**

- 入力のライフタイム中に制御と非制御を切り替えることはできません
- 制御された入力と非制御入力を同時に使用しないでください
- 入力は、初期値に `value`/`checked` または `defaultValue`/`defaultChecked` のいずれかを持つべきです

## 使用法

### さまざまなタイプの入力を表示する

入力を表示するには、`<input>` コンポーネントをレンダーします。デフォルトではテキスト入力になります。チェックボックスの場合は `type="checkbox"`、ラジオボタンの場合は `type="radio"` を渡します。

```jsx
export default function MyForm() {
  return (
    <>
      <label>
        名前:
        <input name="myInput" />
      </label>
      <label>
        同意する:
        <input type="checkbox" name="myCheckbox" />
      </label>
      <fieldset>
        <legend>オプションを選択:</legend>
        <label>
          <input type="radio" name="myRadio" value="option1" />
          オプション 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          オプション 2
        </label>
      </fieldset>
    </>
  );
}
```

### 入力にラベルを提供する

通常、すべての `<input>` を `<label>` タグ内に配置します。これにより、このラベルがその入力に関連付けられていることがブラウザに伝わります。

```jsx
<label>
  名前:
  <input name="firstName" />
</label>
```

または、`<input id>` と `<label htmlFor>` を同じ ID で指定することもできます。

```jsx
<>
  <label htmlFor="firstName">名前:</label>
  <input id="firstName" name="firstName" />
</>
```

### 入力に初期値を提供する

任意の入力に初期値を指定できます。テキスト入力の場合は `defaultValue` 文字列として渡します。チェックボックスとラジオボタンの場合は、`defaultChecked` ブール値で初期値を指定します。

```jsx
export default function MyForm() {
  return (
    <>
      <label>
        名前:
        <input name="firstName" defaultValue="Taylor" />
      </label>
      <label>
        購読する:
        <input type="checkbox" name="subscribe" defaultChecked={true} />
      </label>
    </>
  );
}
```

### フォーム送信時に入力値を読み取る

入力の周りに `<form>` を追加し、その中に `<button type="submit">` を配置します。フォームの `action` イベントハンドラが呼び出され、`FormData` オブジェクトを使用して入力値を読み取ることができます。

```jsx
export default function MyForm() {
  function handleSubmit(formData) {
    const firstName = formData.get('firstName');
    const subscribe = formData.get('subscribe');
    console.log(firstName, subscribe);
  }

  return (
    <form action={handleSubmit}>
      <label>
        名前:
        <input name="firstName" defaultValue="Taylor" />
      </label>
      <label>
        購読する:
        <input type="checkbox" name="subscribe" defaultChecked={true} />
      </label>
      <button type="submit">送信</button>
    </form>
  );
}
```

### state 変数で入力を制御する

`<input />` のような入力は非制御です。初期値を `<input defaultValue="Initial text" />` のように渡しても、JSX は初期値のみを指定し、現在の値は制御しません。

**制御された入力をレンダーするには、`value` prop（チェックボックスとラジオの場合は `checked`）を渡します。** React は、渡された値を常に持つように入力を強制します。通常、state 変数を宣言してこれを行います。

```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [isSubscribed, setIsSubscribed] = useState(true);

  return (
    <>
      <label>
        名前:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        購読する:
        <input
          type="checkbox"
          checked={isSubscribed}
          onChange={e => setIsSubscribed(e.target.checked)}
        />
      </label>
      <p>名前: {firstName}</p>
      <p>購読: {isSubscribed ? 'はい' : 'いいえ'}</p>
    </>
  );
}
```

制御された入力は、以下のような場合に意味があります:

- すべてのキーストロークに応答してUIを更新する
- 入力値を再フォーマットする
- ボタンの無効化のような UI state を入力値に基づいて決定する

## トラブルシューティング

### テキスト入力に入力してもテキストが更新されない

`value` を持つ入力を `onChange` なしでレンダーすると、コンソールにエラーが表示されます:

```jsx
// 🔴 バグ: onChange ハンドラのない制御されたテキスト入力
<input value={something} />
```

**制御された入力をレンダーするには、`onChange` ハンドラも指定する必要があります。**

```jsx
// ✅ 正しい: onChange を持つ制御された入力
<input value={something} onChange={e => setSomething(e.target.value)} />
```

値を読み取り専用にしたい場合は、`readOnly` prop を追加してエラーを抑制します:

```jsx
// ✅ 正しい: onChange のない読み取り専用の制御された入力
<input value={something} readOnly={true} />
```

### キーストロークごとにチェックボックスが更新されない

チェックボックスを `value` で制御しようとすると、エラーが発生します:

```jsx
// 🔴 バグ: checked の代わりに value を使用
<input type="checkbox" value={isChecked} onChange={e => setIsChecked(e.target.value)} />
```

チェックボックスの場合、`value` の代わりに **`checked`** を使用する必要があります:

```jsx
// ✅ 正しい: checked を持つチェックボックス
<input
  type="checkbox"
  checked={isChecked}
  onChange={e => setIsChecked(e.target.checked)}
/>
```

### 入力キャレットがキーストロークごとに先頭にジャンプする

入力を制御する場合、`onChange` 中に state 変数を DOM からの入力値に更新する必要があります。

`e.target.value` 以外のものに更新することはできません:

```jsx
// 🔴 バグ: 入力を e.target.value 以外に更新
function handleChange(e) {
  setFirstName(e.target.value.toUpperCase());
}
```

非同期的に更新することもできません:

```jsx
// 🔴 バグ: 非同期的な入力の更新
function handleChange(e) {
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

コードを修正するには、同期的に `e.target.value` に更新します:

```jsx
// ✅ 正しい: 制御された入力を e.target.value と同期的に更新
function handleChange(e) {
  setFirstName(e.target.value);
}
```

### "A component is changing an uncontrolled input to be controlled" というエラーが表示される

コンポーネントに `value` を提供する場合、そのライフタイム全体で文字列のままである必要があります。

最初に `value={undefined}` を渡してから後で `value="some string"` を渡すことはできません。React は、コンポーネントを非制御にするか制御するかを判断できないためです。

制御されたコンポーネントは、常に `undefined` や `null` ではなく文字列の `value` を受け取る必要があります。

```jsx
// 🔴 バグ: value が最初 undefined
<input value={something} />

// ✅ 正しい: value が常に文字列
<input value={something ?? ''} />
```
