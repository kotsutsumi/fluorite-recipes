# createRef

`createRef` は、主にクラスコンポーネントで使用される ref オブジェクトを作成します。

```javascript
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

## リファレンス

### `createRef()`

`createRef` を呼び出して、クラスコンポーネント内で ref を宣言します。

```javascript
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
}
```

#### パラメータ

`createRef` は引数を取りません。

#### 戻り値

`createRef` は、単一のプロパティを持つオブジェクトを返します：

- `current`: 初期状態では `null` に設定されています。後で別の値に設定できます。ref オブジェクトを JSX ノードの `ref` 属性として React に渡すと、React は `current` プロパティを設定します。

#### 注意事項

- `createRef` は常に**異なる**オブジェクトを返します。これは、`{ current: null }` を自分で記述するのと同等です。
- 関数コンポーネントでは、代わりに常に同じオブジェクトを返す `useRef` を使用します。
- `const ref = useRef()` は `const [ref, _] = useState(() => createRef(null))` と同等です。

## 使用方法

### クラスコンポーネントで ref を宣言する

クラスコンポーネント内で ref を宣言するには、`createRef` を呼び出し、その結果をクラスフィールドに割り当てます：

```javascript
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

JSX の `<input>` に `ref={this.inputRef}` を渡すと、React は `this.inputRef.current` に入力 DOM ノードを設定します。たとえば、入力にフォーカスするボタンを作成する方法は次のとおりです：

```javascript
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

### 完全な例：入力にフォーカスする

この例では、ボタンをクリックすると入力にフォーカスします：

```javascript
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

動作の流れ：

1. `inputRef` フィールドを `createRef()` で初期化します
2. `<input>` の `ref` 属性に渡します。これにより、React は `this.inputRef.current` に `<input>` の DOM ノードを設定します
3. `handleClick` メソッドで、`this.inputRef.current` から入力 DOM ノードを読み取り、`focus()` を呼び出します
4. `<button>` の `onClick` で `handleClick` メソッドを渡します

DOM 操作は ref の最も一般的な使用例ですが、`createRef` は React の外部にある他のものを保存するためにも使用できます。たとえば、タイマー ID などです。

### 関数コンポーネントへの移行

新しいコードでは、`createRef` の代わりに `useRef` を使用することを推奨します。

クラスコンポーネントから関数コンポーネントへの変換例：

**クラスコンポーネント：**

```javascript
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

**関数コンポーネント：**

```javascript
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

## 代替手段

### useRef を使用する（推奨）

関数コンポーネントでは、`useRef` を使用します：

```javascript
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

`useRef` の利点：

- 常に同じオブジェクトを返します
- 関数コンポーネントで使用できます
- より簡潔な構文

### createRef と useRef の違い

**createRef:**

```javascript
class MyInput extends Component {
  inputRef = createRef();

  render() {
    return <input ref={this.inputRef} />;
  }
}
```

- クラスコンポーネント用
- 毎回異なるオブジェクトを作成します
- `this.inputRef.current` でアクセス

**useRef:**

```javascript
function MyInput() {
  const inputRef = useRef(null);

  return <input ref={inputRef} />;
}
```

- 関数コンポーネント用
- 常に同じオブジェクトを返します
- `inputRef.current` でアクセス

## 一般的な使用例

### DOM ノードへのアクセス

```javascript
class ScrollButton extends Component {
  divRef = createRef();

  scrollToBottom = () => {
    this.divRef.current.scrollTop = this.divRef.current.scrollHeight;
  }

  render() {
    return (
      <>
        <div ref={this.divRef} style={{ height: 100, overflow: 'scroll' }}>
          {/* コンテンツ */}
        </div>
        <button onClick={this.scrollToBottom}>Scroll to bottom</button>
      </>
    );
  }
}
```

### タイマー ID の保存

```javascript
class Timer extends Component {
  intervalRef = createRef();

  componentDidMount() {
    this.intervalRef.current = setInterval(() => {
      // 何かをする
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalRef.current);
  }

  render() {
    return <div>Timer running...</div>;
  }
}
```

## トラブルシューティング

### `ref.current` が null

ref を渡した要素がまだレンダリングされていない場合、または条件付きでレンダリングされている場合、`ref.current` は `null` になる可能性があります：

```javascript
class MyComponent extends Component {
  inputRef = createRef();

  componentDidMount() {
    // まだ null の可能性がある
    console.log(this.inputRef.current);
  }

  render() {
    // 条件付きレンダリング
    return this.props.show ? <input ref={this.inputRef} /> : null;
  }
}
```

## まとめ

- `createRef` は主にクラスコンポーネントで使用されます
- 関数コンポーネントでは `useRef` を使用してください
- ref は DOM ノードや React の外部の値を保存するために使用されます
- `ref.current` を通じて値にアクセスします
- 新しいコードでは関数コンポーネントと `useRef` の使用を推奨します
