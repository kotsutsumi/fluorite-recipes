# クライアント用 React DOM API

`react-dom/client` の API を使用すると、クライアント（ブラウザ）で React コンポーネントをレンダーできるようになります。これらの API は通常、アプリのトップレベルで React ツリーを初期化するために使用されます。フレームワークがこれらの API を代わりに呼び出すこともあります。ほとんどのコンポーネントはこれらの API をインポートまたは使用する必要はありません。

## クライアント API

### `createRoot`

ブラウザの DOM ノード内に React コンポーネントを表示するためのルートを作成します。

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### `hydrateRoot`

`react-dom/server` によって事前生成された HTML コンテンツが含まれるブラウザ DOM ノード内に React コンポーネントを表示します。

```javascript
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

## ブラウザサポート

React は、Internet Explorer 9 以上を含むすべての一般的なブラウザをサポートしています。IE 9 や IE 10 などの古いブラウザでは、いくつかのポリフィルが必要になります。

## 注意事項

- これらの API は主に初期セットアップに使用されます
- 個々のコンポーネントでは通常必要ありません
- フレームワークが自動的に呼び出すことがあります
- 低レベルのクライアント側レンダリングメソッドを提供します

## 関連項目

- [createRoot](/docs/reference/react-dom/client/createRoot.md) - React アプリケーションのルートを作成
- [hydrateRoot](/docs/reference/react-dom/client/hydrateRoot.md) - サーバーレンダリングされたアプリケーションのハイドレーション
