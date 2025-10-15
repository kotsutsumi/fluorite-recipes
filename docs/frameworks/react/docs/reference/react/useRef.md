# useRef

`useRef` は、レンダー時には不要な値を参照するための React フックです。

## リファレンス

```javascript
const ref = useRef(initialValue)
```

### パラメータ

- **`initialValue`**: ref オブジェクトの `current` プロパティの初期値。任意の型を指定可能。初回レンダー後は無視される

### 返り値

単一のプロパティを持つオブジェクトを返します:
- **`current`**: 初期は渡した `initialValue` に設定される。後で別の値に変更可能。ref オブジェクトを JSX ノードの `ref` 属性として React に渡すと、React が `current` プロパティを設定する

## 使用法

### 値の参照

```javascript
function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

### DOM の操作

```javascript
function Form() {
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

### ref の内容の再生成を避ける

```javascript
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
}
```

通常、レンダー中に `ref.current` の読み書きは許可されていませんが、この場合は結果が常に同じで、初期化中にのみ条件が実行されるため、十分予測可能です。

## 重要な注意事項

### レンダー中に ref を読み書きしない

```javascript
function MyComponent() {
  // ❌ レンダー中に ref を読み書きしない
  myRef.current = 123;
  return <h1>{myOtherRef.current}</h1>;

  // ✅ イベントハンドラや Effect で読み書きする
  useEffect(() => {
    myRef.current = 123;
  });
  return <h1 onClick={() => {
    alert(myOtherRef.current);
  }}>Click me</h1>;
}
```

### ref の変更は再レンダーをトリガーしない

ref の値を変更しても、コンポーネントは再レンダーされません。再レンダーをトリガーする必要がある場合は、`useState` を使用してください。

## カスタムコンポーネントで ref を公開

```javascript
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

## トラブルシューティング

### カスタムコンポーネントの ref が取得できない

デフォルトでは、独自のコンポーネントは内部の DOM ノードへの ref を公開しません。

```javascript
// ❌ これは動作しない
<MyInput ref={inputRef} />

// ✅ forwardRef を使用
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

### ref.current が null になる

ref を渡された DOM ノードがまだ存在しない場合、`ref.current` は `null` になります。条件付きレンダリングの場合は特に注意が必要です。

## useState vs useRef

| 特徴 | useState | useRef |
|------|----------|--------|
| 再レンダー | トリガーする | トリガーしない |
| ミュータブル | イミュータブル | ミュータブル |
| レンダー中の読み書き | 不可(次のレンダーまで待つ) | 可能(ただし推奨しない) |

## 主な使用例

- DOM ノードへのアクセス
- タイムアウト ID の保存
- レンダーに必要のない値の保存
- 前回のレンダーの値を追跡
- インスタンス変数の代替
