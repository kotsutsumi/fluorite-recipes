# useImperativeHandle

`useImperativeHandle` は、ref として公開されるハンドルをカスタマイズするための React フックです。

## リファレンス

```javascript
useImperativeHandle(ref, createHandle, dependencies?)
```

### パラメータ

- **`ref`**: `forwardRef` レンダー関数から2番目の引数として受け取った ref
- **`createHandle`**: 引数を取らず、公開したい ref ハンドルを返す関数
- **`dependencies`** (オプション): `createHandle` 内で参照されるすべてのリアクティブな値のリスト

### 返り値

`useImperativeHandle` は `undefined` を返します。

## 使用法

### 親コンポーネントにカスタム ref ハンドルを公開

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

これで親コンポーネントは `MyInput` の ref を取得し、`focus` と `scrollIntoView` メソッドを呼び出せます。

### 独自の命令型メソッドを公開

```javascript
const Post = forwardRef((props, ref) => {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      },
    };
  }, []);

  return (
    <>
      <article>{props.children}</article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});
```

## 重要な注意事項

### ref の使用を最小限に

ref は、props として表現できない命令型の動作にのみ使用すべきです。

以下のような場合に限定:
- ノードへのスクロール
- ノードへのフォーカス
- アニメーションのトリガー
- テキストの選択

### props で表現可能なものは避ける

props で表現できる場合は ref を使うべきではありません。

例えば、`Modal` コンポーネントで `{ open, close }` のような命令型ハンドルを公開する代わりに、`<Modal isOpen={isOpen} />` のように `isOpen` を props として受け取る方が良いです。

## ベストプラクティス

- ref は命令型の動作にのみ使用
- 過度な ref の使用は避ける
- 可能な限り宣言的な props を優先
- カスタムハンドルは最小限のメソッドのみ公開
