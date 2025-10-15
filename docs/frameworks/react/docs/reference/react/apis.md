# React の組み込み API

React パッケージが提供する、コンポーネント定義に役立つモダンな API の概要です。

## Context と遅延読み込み

### `createContext`

コンテクストを定義し、コンポーネントに提供できます。

```javascript
const ThemeContext = createContext('light');
```

### `lazy`

コンポーネントのコード読み込みを初回レンダーまで遅延させることができます。

```javascript
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

## パフォーマンス最適化

### `memo`

同じ props を持つコンポーネントの再レンダーをスキップできます。

```javascript
const MemoizedComponent = memo(SomeComponent);
```

### `startTransition`

state 更新を低緊急度としてマークし、UI をブロックせずに更新できます。

```javascript
startTransition(() => {
  setTab(nextTab);
});
```

## テスト

### `act`

テスト環境でレンダーやユーザ操作をラップします。

```javascript
await act(async () => {
  root.render(<Counter />);
});
```

## リソース API

### `use`

プロミスやコンテクストなどのリソースから値を読み取ります。

```javascript
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

## リソースとは

**リソース (resource)** とは、state として保持せずにコンポーネントからアクセスできる情報のことです。例えば:

- **Promise**: 非同期データ
- **Context**: グローバルな状態

`use` API を使用することで、これらのリソースから値を読み取り、コンポーネントで使用できます。

## 使用例

```javascript
import { use, createContext } from 'react';

const ThemeContext = createContext('light');

function Button() {
  const theme = use(ThemeContext);
  return <button className={theme}>Click me</button>;
}

function App({ dataPromise }) {
  const data = use(dataPromise);
  return (
    <ThemeContext.Provider value="dark">
      <Button />
      <div>{data.content}</div>
    </ThemeContext.Provider>
  );
}
```

## ベストプラクティス

- 複雑な state 管理には `createContext` を使用
- 大きなコンポーネントには `lazy` で遅延読み込み
- 再レンダーの最適化には `memo` を適切に使用
- UI の応答性を保つために `startTransition` を活用
- テストには `act` を使用して適切にラップ
- リソースの読み取りには `use` を使用
