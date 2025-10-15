# サーバ用 React DOM API

`react-dom/server` の API を用いて、サーバ上で React コンポーネントを HTML にレンダーすることができます。これらの API は、アプリケーションの最上位で初期 HTML を生成するために、サーバ上でのみ使用されます。[フレームワーク](/learn/start-a-new-react-project#full-stack-frameworks)はこれらをあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

## Node.js ストリーム用のサーバ API

以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます：

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) は、React ツリーをパイプ可能な Node.js ストリームにレンダーします。

## Web Stream 用のサーバ API

以下のメソッドは、[Web Stream](https://developer.mozilla.org/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます：

- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) は、React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/docs/Web/API/ReadableStream) にレンダーします。

## 非ストリーム環境向けのレガシーサーバ API

以下のメソッドは、ストリームをサポートしない環境で使用できます：

- [`renderToString`](/reference/react-dom/server/renderToString) は、React ツリーを文字列にレンダーします。（レガシー）
- [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) は、非インタラクティブな React ツリーを文字列にレンダーします。（レガシー）

ストリーミングの機能は制限されているため、これらは機能的に限定的です。

## サーバ用 API の使用方法

### アプリケーション全体をサーバでレンダーする

サーバサイドレンダリング (SSR) を使用すると、サーバ上で React コンポーネントを HTML にレンダーし、初期ページロードを高速化できます。

**基本的な手順:**

1. サーバ上で React アプリケーションを HTML にレンダー
2. クライアントに HTML を送信
3. クライアント側で React がハイドレーションを実行
4. インタラクティブなアプリケーションとして動作

### ストリーミング vs 非ストリーミング

#### ストリーミング API の利点

- **段階的な配信**: コンテンツの準備ができた部分から順次送信
- **パフォーマンス向上**: 初期表示が高速化
- **Suspense のサポート**: データのローディング状態を適切に処理

推奨されるストリーミング API:
- **Node.js 環境**: `renderToPipeableStream`
- **Web Stream 環境**: `renderToReadableStream`

#### 非ストリーミング API（レガシー）

- **`renderToString`**: 全体を一度に文字列として生成
- **`renderToStaticMarkup`**: インタラクティブ性が不要な静的コンテンツ用

これらのレガシー API は、新しいプロジェクトでは推奨されません。ストリーミング API への移行を検討してください。

## サスペンスとサーバレンダリング

`<Suspense>` を使用することで、サーバレンダリング中のデータフェッチやコード分割を効率的に処理できます。

### ストリーミング API でのサスペンス

```jsx
import { Suspense } from 'react';

function App() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Spinner />}>
        <MainContent />
      </Suspense>
    </div>
  );
}
```

ストリーミング API (`renderToPipeableStream` または `renderToReadableStream`) を使用すると：

1. `<Header />` が即座にレンダーされクライアントに送信される
2. `<MainContent />` のローディング中は `<Spinner />` が表示される
3. データ準備完了後、`<MainContent />` が送信される

### レガシー API でのサスペンス

`renderToString` や `renderToStaticMarkup` では：
- サスペンスのサポートが限定的
- フォールバック UI が即座に HTML として出力される
- ストリーミングの利点が得られない

## エラーハンドリング

サーバレンダリング中のエラーは、各 API のオプションでハンドリングできます：

```javascript
renderToPipeableStream(<App />, {
  onError(error) {
    console.error('サーバレンダリングエラー:', error);
    // エラーログの記録、監視サービスへの送信など
  }
});
```

## ベストプラクティス

1. **ストリーミング API を使用する**: 新しいプロジェクトでは常にストリーミング対応の API を選択
2. **Suspense を活用する**: データフェッチやコード分割でユーザー体験を向上
3. **適切なエラーハンドリング**: 本番環境でのエラーを適切にログ記録
4. **フレームワークの活用**: Next.js などのフレームワークは、これらの API を自動的に最適化
5. **ハイドレーション戦略**: クライアント側のハイドレーションを適切に計画

## 関連リソース

- [サーバコンポーネント](/reference/rsc/server-components)
- [Suspense](/reference/react/Suspense)
- [ハイドレーション](/reference/react-dom/client/hydrateRoot)
