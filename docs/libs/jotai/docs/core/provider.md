# Provider

## 概要

`Provider`コンポーネントは、コンポーネントのサブツリーに対して状態を提供します。主な特徴:

- 複数のProviderを使用およびネスト可能
- React Contextと同様に動作
- デフォルト状態を持つプロバイダーなしモードをサポート

## Providerを使用する理由

1. サブツリーごとに異なる状態を提供
2. アトムの初期値を受け入れる
3. 再マウントによりすべてのアトムをクリア

## シグネチャ

```typescript
const Provider: React.FC<{
  store?: Store
}>
```

## 使用例

```jsx
const SubTree = () => (
  <Provider>
    <Child />
  </Provider>
)

const Root = () => (
  <Provider>
    <App />
  </Provider>
)
```

## Store Prop

Providerはオプションの`store` propを受け入れることができます:

```jsx
const myStore = createStore()

const Root = () => (
  <Provider store={myStore}>
    <App />
  </Provider>
)
```

## useStore フック

`useStore`フックは、コンポーネントツリー内の現在のストアを返します:

```jsx
const Component = () => {
  const store = useStore()
  // ...
}
```

このドキュメントは、異なるコンポーネントサブツリー間で状態を管理する際のJotai Providerの柔軟性を強調しています。
