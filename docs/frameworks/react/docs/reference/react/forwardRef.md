# forwardRef

`forwardRef` を使用すると、コンポーネントが ref を使用して親コンポーネントに DOM ノードを公開できます。

```javascript
const SomeComponent = forwardRef(render)
```

## 非推奨に関する通知

React 19 では `forwardRef` は非推奨になりました。開発者は、`ref` をプロパティとして直接渡すことが推奨されています。

## リファレンス

### `forwardRef(render)`

`forwardRef()` を呼び出して、コンポーネントが ref を受け取り、子コンポーネントに転送できるようにします：

```javascript
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

#### パラメータ

- `render`: コンポーネントのレンダリング関数。React は、このコンポーネントが親から受け取った props と `ref` でこの関数を呼び出します。返す JSX がコンポーネントの出力になります。

#### 戻り値

`forwardRef` は、JSX でレンダリングできる React コンポーネントを返します。プレーンな関数として定義された React コンポーネントとは異なり、`forwardRef` によって返されるコンポーネントは `ref` プロパティを受け取ることもできます。

#### 注意事項

Strict Mode では、React は**レンダリング関数を2回呼び出します**。これは、不純な関数を見つけるのに役立ちます。これは開発専用の動作で、本番環境には影響しません。

## 使用方法

### 親コンポーネントに DOM ノードを公開する

デフォルトでは、各コンポーネントの DOM ノードはプライベートです。しかし、親コンポーネントに DOM ノードを公開すると便利な場合があります。たとえば、フォーカスを許可する場合などです。これを許可するには、コンポーネント定義を `forwardRef()` でラップします：

```javascript
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

props の後の2番目の引数として `ref` を受け取ります。これを公開する DOM ノードに渡します。

このようにして、親の `Form` コンポーネントは、`MyInput` が公開する `<input>` DOM ノードにアクセスできます：

```javascript
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

### 完全な例：入力にフォーカスする

ボタンをクリックすると、入力にフォーカスします：

```javascript
import { useRef } from 'react';
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

### 複数のコンポーネントを通じて ref を転送する

DOM ノードに `ref` を転送する代わりに、`MyInput` のような独自のコンポーネントに転送することもできます：

```javascript
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

そのコンポーネント `MyInput` が ref を `<input>` に転送すると、`FormField` への ref によってその `<input>` が取得されます：

```javascript
import { useRef } from 'react';
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

const FormField = forwardRef(function FormField(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <>
      <MyInput ref={ref} {...otherProps} />
    </>
  );
});

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

### DOM ノードの代わりに命令型ハンドルを公開する

DOM ノード全体を公開する代わりに、より制限されたメソッドのセット（命令型ハンドル）を公開できます。これを行うには、別の ref を保持するために内部 ref を作成する必要があります：

```javascript
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

これで、親コンポーネントが `MyInput` への ref を取得すると、`focus()` と `scrollIntoView()` メソッドを呼び出すことができます。ただし、基盤となる `<input>` DOM ノードへの完全なアクセスはありません。

```javascript
export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // これは動作しません。DOM ノードが公開されていないためです：
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

### 完全な例：命令型ハンドルの公開

```javascript
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

## React 19 での変更

React 19 では、`forwardRef` は非推奨になりました。代わりに、`ref` をプロパティとして直接渡すことができます：

```javascript
// React 19 以前（forwardRef を使用）
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});

// React 19（直接 ref プロパティを使用）
function MyInput({ ref, ...props }) {
  return <input {...props} ref={ref} />;
}
```

## ベストプラクティス

### ref を控えめに使用する

ref は、プロパティとして表現できない命令型の動作にのみ使用してください。フォーカス、スクロール、DOM ノードの測定などです。

**コンポーネントを API として表現できる場合は、ref を使用しないでください。** たとえば、`Modal` コンポーネントから `{ open, close }` のような命令型ハンドルを公開する代わりに、`<Modal isOpen={isOpen} />` のように `isOpen` をプロパティとして取る方が良いです。エフェクトは、命令型の動作をプロパティとして公開するのに役立ちます。

### 公開するメソッドを制限する

命令型ハンドルを使用する場合、公開するメソッドを最小限に抑えます：

```javascript
useImperativeHandle(ref, () => {
  return {
    // 必要なメソッドのみ公開
    focus() {
      inputRef.current.focus();
    }
    // DOM ノード全体は公開しない
  };
}, []);
```

## トラブルシューティング

### コンポーネントが `forwardRef` でラップされていますが、ref が常に null です

これは通常、受け取った `ref` を実際に使用するのを忘れたことを意味します。

```javascript
// 誤り：ref を使用していない
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});

// 正しい：ref を input に渡す
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

何かの条件が常に `false` の場合、`MyInput` への `ref` も `null` になる可能性があります：

```javascript
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

`showInput` が `false` の場合、ref はどのノードにも転送されず、`MyInput` への ref は空のままになります。これは、次の例のように、条件が `Panel` のような別のコンポーネント内に隠されている場合、特に見落としやすくなります：

```javascript
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```

## まとめ

- `forwardRef` を使用すると、コンポーネントが親に DOM ノードを公開できます
- React 19 では、`ref` をプロパティとして直接渡すことが推奨されています
- `useImperativeHandle` を使用して、公開するメソッドをカスタマイズできます
- ref は、フォーカス、スクロール、測定などの命令型の動作にのみ使用してください
- 可能な限り、ref の代わりにプロパティを使用してください
- ref を使用する場合は、受け取った ref を実際に DOM ノードまたは `useImperativeHandle` に渡すことを忘れないでください
