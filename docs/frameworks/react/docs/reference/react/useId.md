# useId

`useId` は、アクセシビリティ属性に渡すことができる一意の ID を生成するための React フックです。

## リファレンス

```javascript
const id = useId()
```

### パラメータ

`useId` は引数を取りません。

### 返り値

特定のコンポーネント内の特定の `useId` 呼び出しに関連付けられた一意の ID 文字列を返します。

## 使用法

### アクセシビリティ属性用の一意の ID 生成

```javascript
function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <input
        type="password"
        aria-describedby={passwordHintId}
      />
      <p id={passwordHintId}>
        パスワードは8文字以上で、大文字、数字、記号を含む必要があります
      </p>
    </>
  );
}
```

### 複数の関連要素に ID を生成

```javascript
function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>名:</label>
      <input id={id + '-firstName'} type="text" />

      <label htmlFor={id + '-lastName'}>姓:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

同じコンポーネントの複数のインスタンスが ID の競合を起こすのを防ぎます。

## 重要な注意事項

### 使用制限

- コンポーネントのトップレベルでのみ呼び出し可能
- リストのキー生成には使用できない
- async Server Components では使用不可

### サーバーサイドレンダリング

- サーバとクライアントで一貫した ID を生成
- ハイドレーション時の不一致を防ぐ

## 高度な使用法

### 共有プレフィックスの指定

同じページ上の複数の React アプリケーションで共有プレフィックスを指定できます。

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'), {
  identifierPrefix: 'my-app-'
});
root.render(<App />);
```

## なぜカウンタではダメなのか

なぜ `nextId++` のような単純なカウンタではなく `useId` を使うのか疑問に思うかもしれません。`useId` の主な利点は、React がサーバーレンダリングで正しく動作することを保証する点です。

## ベストプラクティス

- アクセシビリティのための ID 生成に使用
- 一意の ID が必要な HTML 属性に使用
- リストのキーには使用しない
