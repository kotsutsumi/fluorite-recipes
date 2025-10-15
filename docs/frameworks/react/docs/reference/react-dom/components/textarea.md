# `<textarea>`

ブラウザ組み込みの `<textarea>` コンポーネントを利用することで、複数行のテキスト入力をレンダーできます。

```jsx
<textarea name="postContent" />
```

## リファレンス

### `<textarea>`

テキストエリアを表示するには、ブラウザ組み込みの `<textarea>` コンポーネントをレンダーします。

```jsx
<textarea name="postContent" rows={4} cols={40} />
```

#### Props

`<textarea>` は、すべての一般的な要素の props をサポートしています。

**制御されたテキストエリアのための Props:**

- **`value`**: 文字列。テキストエリア内のテキストを制御します

`value` を渡すと、テキストエリアは制御されたコンポーネントになります。

**非制御テキストエリアのための Props:**

- **`defaultValue`**: 文字列。テキストエリアの初期値を指定します

**両方のタイプのテキストエリアでサポートされる Props:**

- **`autoComplete`**: `'on'` または `'off'`。自動補完の動作を指定します
- **`autoFocus`**: ブール値。`true` の場合、React はマウント時に要素にフォーカスします
- **`children`**: `<textarea>` は子要素を受け入れません。初期値を設定するには、`defaultValue` を使用します
- **`cols`**: 数値。デフォルトの幅を平均文字幅で指定します。デフォルトは `20` です
- **`disabled`**: ブール値。`true` の場合、入力は無効になり、淡色表示されます
- **`form`**: 文字列。このテキストエリアが属する `<form>` の `id` を指定します
- **`maxLength`**: 数値。テキストの最大長を指定します
- **`minLength`**: 数値。テキストの最小長を指定します
- **`name`**: 文字列。フォーム送信時にこのテキストエリアの名前を指定します
- **`placeholder`**: 文字列。テキストエリアの値が空のときに淡色で表示されます
- **`readOnly`**: ブール値。`true` の場合、テキストエリアはユーザによって編集できません
- **`required`**: ブール値。`true` の場合、フォーム送信時に値が必要です
- **`rows`**: 数値。デフォルトの高さを平均文字の高さで指定します。デフォルトは `2` です
- **`wrap`**: `'hard'`、`'soft'`、または `'off'`。フォーム送信時にテキストをラップする方法を指定します

**イベントハンドラ Props:**

- **`onChange`**: イベントハンドラ関数。制御されたテキストエリアでは必須です。ユーザによって入力値が変更されたときに即座に発火します
- **`onChangeCapture`**: `onChange` のキャプチャフェーズで発火するバージョン
- **`onInput`**: イベントハンドラ関数。値が変更されたときに即座に発火します
- **`onInputCapture`**: `onInput` のキャプチャフェーズで発火するバージョン
- **`onInvalid`**: イベントハンドラ関数。フォーム送信時に入力の検証が失敗した場合に発火します
- **`onInvalidCapture`**: `onInvalid` のキャプチャフェーズで発火するバージョン
- **`onSelect`**: イベントハンドラ関数。`<textarea>` 内の選択が変更された後に発火します
- **`onSelectCapture`**: `onSelect` のキャプチャフェーズで発火するバージョン

#### 注意点

**子要素としてテキストを渡すことはできません:**

```jsx
// 🔴 バグ: 子要素としてテキストを渡す
<textarea>初期テキスト</textarea>
```

代わりに、`defaultValue` を使用してください:

```jsx
// ✅ 正しい: defaultValue で初期値を指定
<textarea defaultValue="初期テキスト" />
```

**制御されたテキストエリアの場合:**

- `value` を渡す場合、`onChange` ハンドラも必要です
- `onChange` ハンドラは、渡された state 変数を同期的に更新する必要があります
- 制御されたテキストエリアの値は、渡された prop の値と常に一致します

**制御と非制御の切り替え:**

- テキストエリアのライフタイム中に制御と非制御を切り替えることはできません
- 制御されたテキストエリアと非制御テキストエリアを同時に使用しないでください

## 使用法

### テキストエリアを表示する

テキストエリアを表示するには、`<textarea>` コンポーネントをレンダーします。`rows` と `cols` 属性でデフォルトのサイズを指定できますが、デフォルトではユーザがサイズ変更できます。サイズ変更を無効にするには、CSS で `resize: none` を指定できます。

```jsx
export default function NewPost() {
  return (
    <label>
      投稿を書く:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

### テキストエリアにラベルを提供する

通常、すべての `<textarea>` を `<label>` タグ内に配置します。これにより、このラベルがそのテキストエリアに関連付けられていることがブラウザに伝わります。

```jsx
<label>
  投稿を書く:
  <textarea name="postContent" rows={4} cols={40} />
</label>
```

または、`<textarea id>` と `<label htmlFor>` を同じ ID で指定することもできます。

```jsx
<>
  <label htmlFor="post-content">投稿を書く:</label>
  <textarea id="post-content" name="postContent" rows={4} cols={40} />
</>
```

### 初期値を提供する

テキストエリアに初期値を指定するには、`defaultValue` を文字列として渡します。

```jsx
export default function EditPost() {
  return (
    <label>
      投稿を編集:
      <textarea
        name="postContent"
        defaultValue="昨日、私は公園に行きました。"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

注意: **HTML とは異なり、`<textarea>初期テキスト</textarea>` のように初期テキストを渡すことはサポートされていません。**

### フォーム送信時にテキストエリアの値を読み取る

テキストエリアの周りに `<form>` を追加し、その中に `<button type="submit">` を配置します。フォームの `action` イベントハンドラが呼び出されます。

```jsx
export default function EditPost() {
  function handleSubmit(formData) {
    const postContent = formData.get('postContent');
    console.log(postContent);
  }

  return (
    <form action={handleSubmit}>
      <label>
        投稿を編集:
        <textarea
          name="postContent"
          defaultValue="昨日、私は公園に行きました。"
          rows={4}
          cols={40}
        />
      </label>
      <button type="submit">送信</button>
    </form>
  );
}
```

### state 変数でテキストエリアを制御する

`<textarea />` のようなテキストエリアは非制御です。初期値を `<textarea defaultValue="初期テキスト" />` のように渡しても、JSX は初期値のみを指定し、現在の値は制御しません。

**制御されたテキストエリアをレンダーするには、`value` prop を渡します。** React は、渡された値を常に持つようにテキストエリアを強制します。通常、state 変数を宣言してこれを行います。

```jsx
import { useState } from 'react';

export default function EditPost() {
  const [postContent, setPostContent] = useState('昨日、私は公園に行きました。');

  return (
    <>
      <label>
        投稿を編集:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
          rows={4}
          cols={40}
        />
      </label>
      <p>プレビュー: {postContent}</p>
    </>
  );
}
```

制御されたテキストエリアは、すべてのキーストロークに応答して UI を更新したい場合に便利です。

### 制御されたテキストエリアの実用的な例

Markdown エディタの例:

```jsx
import { useState } from 'react';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('# こんにちは\n\n**太字**のテキスト');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <h3>エディタ</h3>
        <textarea
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          rows={10}
          cols={40}
          style={{ width: '100%', fontFamily: 'monospace' }}
        />
      </div>
      <div>
        <h3>プレビュー</h3>
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {markdown}
        </div>
      </div>
    </div>
  );
}
```

文字数カウンタの例:

```jsx
import { useState } from 'react';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const maxLength = 280;

  return (
    <>
      <label>
        投稿を書く:
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          cols={40}
          maxLength={maxLength}
        />
      </label>
      <p>
        {text.length} / {maxLength} 文字
        {text.length >= maxLength && ' (上限に達しました)'}
      </p>
    </>
  );
}
```

## トラブルシューティング

### テキストエリアに入力してもテキストが更新されない

`value` を持つテキストエリアを `onChange` なしでレンダーすると、コンソールにエラーが表示されます:

```jsx
// 🔴 バグ: onChange ハンドラのない制御されたテキストエリア
<textarea value={content} />
```

**制御されたテキストエリアをレンダーするには、`onChange` ハンドラも指定する必要があります。**

```jsx
// ✅ 正しい: onChange を持つ制御されたテキストエリア
<textarea value={content} onChange={e => setContent(e.target.value)} />
```

値を読み取り専用にしたい場合は、`readOnly` prop を追加してエラーを抑制します:

```jsx
// ✅ 正しい: onChange のない読み取り専用の制御されたテキストエリア
<textarea value={content} readOnly={true} />
```

### テキストエリアのキャレットがキーストロークごとに先頭にジャンプする

テキストエリアを制御する場合、`onChange` 中に state 変数を DOM からのテキストエリア値に更新する必要があります。

`e.target.value` 以外のものに更新することはできません:

```jsx
// 🔴 バグ: テキストエリアを e.target.value 以外に更新
function handleChange(e) {
  setContent(e.target.value.toUpperCase());
}
```

非同期的に更新することもできません:

```jsx
// 🔴 バグ: 非同期的なテキストエリアの更新
function handleChange(e) {
  setTimeout(() => {
    setContent(e.target.value);
  }, 100);
}
```

コードを修正するには、同期的に `e.target.value` に更新します:

```jsx
// ✅ 正しい: 制御されたテキストエリアを e.target.value と同期的に更新
function handleChange(e) {
  setContent(e.target.value);
}
```

### "A component is changing an uncontrolled textarea to be controlled" というエラーが表示される

コンポーネントに `value` を提供する場合、そのライフタイム全体で文字列のままである必要があります。

最初に `value={undefined}` を渡してから後で `value="some text"` を渡すことはできません。React は、コンポーネントを非制御にするか制御するかを判断できないためです。

制御されたコンポーネントは、常に `undefined` や `null` ではなく文字列の `value` を受け取る必要があります。

```jsx
// 🔴 バグ: value が最初 undefined
<textarea value={content} />

// ✅ 正しい: value が常に文字列
<textarea value={content ?? ''} />
```
