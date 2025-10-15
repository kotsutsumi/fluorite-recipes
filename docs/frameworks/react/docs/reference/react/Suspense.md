# `<Suspense>`

サスペンスを使うことで、子要素が読み込みを完了するまでフォールバックを表示させることができます。

## リファレンス

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

### Props

- **`children`**: レンダーする実際の UI。children の読み込み中にサスペンドされた場合、Suspense バウンダリはフォールバックのレンダリングに切り替わる
- **`fallback`**: 実際の UI の代わりに表示する代替 UI。読み込み中に表示される

## 使用法

### コンテンツ読み込み中のフォールバック表示

```jsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Albums />
    </Suspense>
  );
}

function Loading() {
  return <p>読み込み中...</p>;
}
```

### コンテンツを一度にまとめて表示

デフォルトでは、Suspense 内のツリー全体が1つの単位として扱われます。

```jsx
<Suspense fallback={<Loading />}>
  <Biography />
  <Panel>
    <Albums />
  </Panel>
</Suspense>
```

すべてのコンポーネントがデータの読み込みを完了するまで、フォールバックが表示されます。

### ネストされたコンテンツのロード順表示

複数の Suspense コンポーネントをネストして、段階的な読み込みを実現できます。

```jsx
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

1. `Biography` が読み込まれると、`BigSpinner` が `Biography` に置き換わる
2. `Albums` が読み込まれると、`AlbumsGlimmer` が `Albums` に置き換わる

### 新しいコンテンツ読み込み中に古いコンテンツを表示

`useDeferredValue` を使用して、古い結果を表示しながら新しいデータを読み込めます。

```jsx
import { Suspense, useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  return (
    <Suspense fallback={<h2>読み込み中...</h2>}>
      <SearchResults query={deferredQuery} />
    </Suspense>
  );
}
```

### 不要なフォールバックの表示を防ぐ

```jsx
import { startTransition } from 'react';

function handleClick() {
  startTransition(() => {
    setTab('comments');
  });
}
```

`startTransition` を使用すると、既存のコンテンツを隠さずにバックグラウンドで新しいコンテンツをレンダーします。

### エラーバウンダリとの組み合わせ

```jsx
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Loading />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

## サポートされるデータソース

Suspense は以下のデータソースでのみ機能します:

- Suspense 対応フレームワーク(Relay、Next.js など)でのデータフェッチ
- `lazy` による遅延読み込みコンポーネント
- `use` による Promise の読み取り

## 重要な注意事項

### Effect やイベントハンドラでのデータフェッチは検出されない

```jsx
// ❌ Suspense はこれを検出できない
useEffect(() => {
  fetch('/api/data')
    .then(data => setData(data));
}, []);
```

Suspense は、Suspense 対応のデータソースからのデータフェッチのみを検出します。

### サーバーサイドレンダリング

サーバーでは、Suspense バウンダリは最も近い Suspense バウンダリのフォールバックから HTML を生成します。

## トラブルシューティング

### トランジション中のフォールバック表示を防ぐ

```jsx
function handleTabChange(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

トランジションを使用することで、既存の UI を保持しながら新しいコンテンツを準備できます。

## ベストプラクティス

- 意味のある読み込み状態を提供
- ネストされた Suspense で段階的な読み込みを実現
- `startTransition` で不要なフォールバックを防ぐ
- エラーバウンダリと組み合わせてエラーハンドリング
- Suspense 対応のデータフェッチングソリューションを使用
