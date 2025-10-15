# `<StrictMode>`

Strict Mode は、開発環境でコンポーネントの一般的なバグを早期に見つけるのに役立ちます。

## リファレンス

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### Props

`StrictMode` は props を受け取りません。

## 主な機能

Strict Mode は開発環境専用の動作と警告を有効にします:

### 1. 二重レンダリングによる純粋性チェック

コンポーネントを2回レンダーして、不純な動作を検出します。

```jsx
function StoryTray({ stories }) {
  // ❌ 配列を直接変更(不純)
  stories.push({ id: 'create', label: 'Create Story' });

  return (
    <ul>
      {stories.map(story => <li key={story.id}>{story.label}</li>)}
    </ul>
  );
}
```

Strict Mode では、この問題が二重レンダリングによって明らかになります。

正しい実装:

```jsx
function StoryTray({ stories }) {
  // ✅ 新しい配列を作成
  const items = [...stories, { id: 'create', label: 'Create Story' }];

  return (
    <ul>
      {items.map(story => <li key={story.id}>{story.label}</li>)}
    </ul>
  );
}
```

### 2. Effect のクリーンアップチェック

Effect のセットアップとクリーンアップを2回実行して、クリーンアップロジックの問題を検出します。

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();

  // ✅ クリーンアップ関数を返す
  return () => {
    connection.disconnect();
  };
}, [serverUrl, roomId]);
```

### 3. Ref コールバックのクリーンアップチェック

Ref コールバックを2回実行して、メモリリークの可能性を特定します。

```jsx
<div ref={(node) => {
  if (node) {
    // マウント時の処理

    // ✅ クリーンアップ関数を返す
    return () => {
      // クリーンアップ処理
    };
  }
}} />
```

### 4. 非推奨 API の使用チェック

古い React API の使用について警告を表示します。

## 使用法

### アプリ全体で Strict Mode を有効化

```jsx
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

### アプリの一部で Strict Mode を有効化

```jsx
function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <Main />
        <Sidebar />
      </StrictMode>
      <Footer />
    </>
  );
}
```

この場合、`Header` と `Footer` では Strict Mode のチェックは実行されません。

## 重要な注意事項

### 開発環境のみ

Strict Mode のチェックは開発環境でのみ実行され、本番ビルドには影響しません。

### 二重レンダリングの理由

Strict Mode では以下が2回実行されます:
- コンポーネント関数本体
- `useState` の初期化関数
- `useMemo` や `useReducer` などの関数

これにより、純粋でない関数を検出できます。

### Effect の二重実行

開発環境では、Effect のセットアップとクリーンアップが2回実行されます:
1. セットアップ → クリーンアップ → セットアップ

これにより、クリーンアップロジックがセットアップロジックを正しく「ミラーリング」していることを確認できます。

## ベストプラクティス

- すべての新しいアプリケーションで Strict Mode を有効化
- Strict Mode の警告を無視せず、修正する
- コンポーネントを純粋に保つ
- Effect に適切なクリーンアップを実装
- Ref コールバックにクリーンアップ関数を返す
