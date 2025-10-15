# 組み込みの React コンポーネント

React は、JSX で使用できるいくつかの組み込みコンポーネントを公開しています。

## 組み込みコンポーネント

### `<Fragment>`

複数の JSX ノードをまとめるために使用します。

```jsx
<>
  <OneChild />
  <AnotherChild />
</>
```

`<>...</>` の省略記法で使用するのが一般的です。

### `<Profiler>`

React ツリーのレンダーパフォーマンスをプログラム上で測定します。

```jsx
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

### `<Suspense>`

子コンポーネントがロード中にフォールバックを表示します。

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

### `<StrictMode>`

開発環境でバグを早期に見つけるための追加チェックを有効化します。

```jsx
<StrictMode>
  <App />
</StrictMode>
```

## 自分自身のコンポーネント

JavaScript 関数として独自のコンポーネントを定義できます:

```jsx
function MyComponent() {
  return <div>Hello World</div>;
}
```

カスタムコンポーネントを作成することで、アプリケーション固有のロジックと UI を構築できます。
