# react-dom

`react-dom` パッケージは、ウェブアプリケーション（ブラウザの DOM 環境で実行されるアプリケーション）専用のメソッドを提供します。React Native では使用されません。

## リファレンス

### コンポーネント API

- **`createPortal(children, domNode, key?)`**: DOM ツリーの別の場所に子コンポーネントをレンダーします
- **`flushSync(callback)`**: state の更新を強制的にフラッシュし、DOM を同期的に更新します

### リソースプリロード API

これらの API を使用すると、スタイルシート、フォント、外部スクリプトなどのリソースを事前にロードすることでアプリを高速化できます。

#### DNS とサーバー接続

- **`prefetchDNS(href)`**: DNS ドメインの IP アドレスを事前にフェッチします
- **`preconnect(href)`**: サーバへの事前接続を行います

#### リソースのプリロード

- **`preload(href, options)`**: スタイルシート、フォント、画像、外部スクリプトをフェッチします
- **`preloadModule(href, options)`**: ESM モジュールをフェッチします

#### リソースの初期化

- **`preinit(href, options)`**: スクリプトまたはスタイルシートをフェッチして実行します
- **`preinitModule(href, options)`**: ESM モジュールをフェッチして実行します

## エントリポイント

`react-dom` パッケージは、追加の 2 つのエントリポイントを提供します。

### `react-dom/client`

クライアント（ブラウザ）で React コンポーネントをレンダーするための API を含みます。

- **`createRoot(domNode, options?)`**: ブラウザ DOM ノード内に React コンポーネントを表示するためのルートを作成します
- **`hydrateRoot(domNode, reactNode, options?)`**: サーバで生成された HTML を React コンポーネントでハイドレートします

### `react-dom/server`

サーバ上で React コンポーネントを HTML にレンダーするための API を含みます。

#### Node.js Streams 用

- **`renderToPipeableStream(reactNode, options?)`**: React ツリーを Pipeable Node.js Stream にレンダーします
- **`renderToStaticNodeStream(reactNode, options?)`**: 非インタラクティブな React ツリーを Node.js Readable Stream にレンダーします

#### Web Streams 用

- **`renderToReadableStream(reactNode, options?)`**: React ツリーを Readable Web Stream にレンダーします

#### 非ストリーミング環境用

- **`renderToString(reactNode, options?)`**: React ツリーを HTML 文字列にレンダーします
- **`renderToStaticMarkup(reactNode, options?)`**: 非インタラクティブな React ツリーを HTML 文字列にレンダーします

## 使用法

### 基本的なインポート

```javascript
import { createPortal, flushSync } from 'react-dom';
```

### リソースプリロードのインポート

```javascript
import {
  prefetchDNS,
  preconnect,
  preload,
  preloadModule,
  preinit,
  preinitModule
} from 'react-dom';
```

### クライアント API のインポート

```javascript
import { createRoot, hydrateRoot } from 'react-dom/client';
```

### サーバ API のインポート

```javascript
import {
  renderToPipeableStream,
  renderToReadableStream,
  renderToString,
  renderToStaticMarkup
} from 'react-dom/server';
```

## 削除された API

以下の API は React 19 で削除されました。

### 削除されたクライアント API

- **`findDOMNode`**: 代替手段を使用してください
- **`hydrate`**: `hydrateRoot` を使用してください
- **`render`**: `createRoot` を使用してください
- **`unmountComponentAtNode`**: `root.unmount()` を使用してください

### 削除されたサーバ API

- **`renderToNodeStream`**: `renderToPipeableStream` を使用してください
- **`renderToStaticNodeStream`**: `renderToStaticNodeStream` を使用してください

## 重要な注意事項

### フレームワークとの統合

React ベースのフレームワーク（Next.js、Remix など）を使用している場合、多くのリソース関連 API は自動的に処理されるため、直接呼び出す必要はありません。フレームワークのドキュメントで詳細を確認してください。

### パフォーマンスの最適化

リソースプリロード API を使用すると、ページの読み込み時間を大幅に短縮できます。

```javascript
function AppRoot() {
  // DNS を事前にフェッチ
  prefetchDNS('https://example.com');

  // サーバに事前接続
  preconnect('https://example.com');

  // フォントを事前にロード
  preload('https://example.com/font.woff2', { as: 'font' });

  // スタイルシートを事前に初期化
  preinit('https://example.com/styles.css', { as: 'style' });

  return <App />;
}
```

### ポータルの使用

```javascript
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">
      {children}
    </div>,
    document.body
  );
}
```

### 同期的な DOM 更新

```javascript
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(count + 1);
  });
  // この時点で DOM は更新されています
}
```

## ベストプラクティス

1. **リソースプリロード API の使用**: ページパフォーマンスを向上させるために、重要なリソースを事前にロードします
2. **ポータルの適切な使用**: モーダル、トースト、ツールチップなどのオーバーレイコンポーネントにはポータルを使用します
3. **`flushSync` の慎重な使用**: パフォーマンスに影響を与えるため、必要な場合にのみ使用します
4. **最新の API の使用**: 削除された API ではなく、新しい API を使用します
5. **フレームワークの機能を活用**: フレームワークが提供する最適化機能を最大限に活用します

## 関連リソース

- [createPortal](/docs/frameworks/react/docs/reference/react-dom/createPortal.md)
- [flushSync](/docs/frameworks/react/docs/reference/react-dom/flushSync.md)
- [preload](/docs/frameworks/react/docs/reference/react-dom/preload.md)
- [preinit](/docs/frameworks/react/docs/reference/react-dom/preinit.md)
