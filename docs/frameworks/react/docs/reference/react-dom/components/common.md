# 共通コンポーネント (`<div>` など)

React の組み込みブラウザコンポーネントは、共通の props とイベントをサポートしています。

## リファレンス

### 共通の Props

すべての組み込みコンポーネントは以下の props をサポートします:

#### `children`

React ノード(要素、文字列、数値、ポータル、`null`、`undefined`、ブール値など)。コンポーネント内に表示するコンテンツを指定します。

```jsx
<div>
  <h1>Title</h1>
  <p>Some text</p>
</div>
```

#### `className`

CSS クラス名を指定する文字列。

```jsx
<div className="container main-content" />
```

#### `style`

CSS スタイルを持つオブジェクト。プロパティ名は camelCase で記述します。

```jsx
<div style={{
  width: user.imageSize,
  height: user.imageSize,
  backgroundColor: 'lightblue'
}} />
```

#### `ref`

DOM ノードへの参照を取得します。

```jsx
const inputRef = useRef(null);

function handleClick() {
  inputRef.current.focus();
}

<input ref={inputRef} />
```

#### `dangerouslySetInnerHTML`

生の HTML 文字列を含むオブジェクト。`__html` キーを持つオブジェクトを渡します。

```jsx
const markup = { __html: '<p>some raw html</p>' };
<div dangerouslySetInnerHTML={markup} />
```

**警告**: XSS 攻撃のリスクがあるため、信頼できるデータのみに使用してください。

## イベントハンドラ

### マウスイベント

- `onClick`: クリック時
- `onDoubleClick`: ダブルクリック時
- `onMouseDown`: マウスボタンを押したとき
- `onMouseUp`: マウスボタンを離したとき
- `onMouseEnter`: マウスが要素に入ったとき
- `onMouseLeave`: マウスが要素から離れたとき
- `onMouseMove`: マウスが移動したとき
- `onMouseOver`: マウスが要素上にあるとき
- `onMouseOut`: マウスが要素から離れたとき

### ポインタイベント

- `onPointerDown`: ポインタがアクティブになったとき
- `onPointerUp`: ポインタが非アクティブになったとき
- `onPointerMove`: ポインタが移動したとき
- `onPointerEnter`: ポインタが要素に入ったとき
- `onPointerLeave`: ポインタが要素から離れたとき
- `onPointerCancel`: ポインタがキャンセルされたとき

### フォーカスイベント

- `onFocus`: 要素がフォーカスを受け取ったとき
- `onBlur`: 要素がフォーカスを失ったとき

### キーボードイベント

- `onKeyDown`: キーが押されたとき
- `onKeyUp`: キーが離されたとき

### フォームイベント

- `onChange`: 入力値が変更されたとき
- `onInput`: 値が変更されたとき
- `onSubmit`: フォームが送信されたとき
- `onReset`: フォームがリセットされたとき

### タッチイベント

- `onTouchStart`: タッチが開始されたとき
- `onTouchMove`: タッチポイントが移動したとき
- `onTouchEnd`: タッチが終了したとき
- `onTouchCancel`: タッチがキャンセルされたとき

### スクロールイベント

- `onScroll`: 要素がスクロールされたとき

### アニメーションイベント

- `onAnimationStart`: CSS アニメーションが開始されたとき
- `onAnimationEnd`: CSS アニメーションが終了したとき
- `onAnimationIteration`: CSS アニメーションの反復が完了したとき

### トランジションイベント

- `onTransitionEnd`: CSS トランジションが完了したとき

## 使用例

### CSS スタイルの適用

```jsx
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize,
    borderRadius: '50%'
  }}
  src={user.imageUrl}
  alt={user.name}
/>
```

### DOM ノードの操作

```jsx
function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>フォーカス</button>
    </>
  );
}
```

### イベントハンドラの使用

```jsx
function Button() {
  function handleClick(e) {
    console.log('クリックされました', e.target);
  }

  return <button onClick={handleClick}>クリック</button>;
}
```

### 生の HTML の設定

```jsx
function ArticleContent({ htmlContent }) {
  // 注意: htmlContent が信頼できるソースからのみ使用
  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
```

## 重要な注意事項

### イベントハンドラ

- イベントハンドラは React 合成イベントオブジェクトを受け取ります
- ネイティブブラウザイベントにアクセスするには `e.nativeEvent` を使用

### ref の使用

- ref を使用して DOM ノードを直接操作できます
- レンダー中に ref.current の読み書きは避けてください
- イベントハンドラや Effect 内で使用してください

### dangerouslySetInnerHTML

- XSS 攻撃のリスクがあるため、注意して使用してください
- 信頼できるデータソースからのみ使用
- 可能な限り React コンポーネントを使用することを推奨

### style プロップ

- オブジェクトとして渡す必要があります
- CSS プロパティ名は camelCase で記述(`backgroundColor`, `fontSize`)
- 数値は自動的に `px` が追加されます(`width: 100` → `width: 100px`)
- CSS 変数には文字列を使用(`'--custom-color': 'blue'`)
