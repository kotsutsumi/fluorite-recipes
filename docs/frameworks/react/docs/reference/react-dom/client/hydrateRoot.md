# hydrateRoot

`hydrateRoot` は、`react-dom/server` によって事前生成された HTML コンテンツが含まれるブラウザ DOM ノード内に React コンポーネントを表示します。

```javascript
const root = hydrateRoot(domNode, reactNode, options?)
```

## リファレンス

### `hydrateRoot(domNode, reactNode, options?)`

`hydrateRoot` を呼び出して、サーバー環境で React によって事前にレンダーされた既存の HTML に React を「アタッチ」します。

```javascript
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, <App />);
```

React は `domNode` 内に存在する HTML にアタッチし、その内部の DOM の管理を引き継ぎます。完全に React で構築されたアプリには、通常、ルートコンポーネントを持つ `hydrateRoot` の呼び出しが 1 つだけ存在します。

#### パラメータ

- `domNode`: サーバー上でルート要素としてレンダーされた DOM 要素。

- `reactNode`: 既存の HTML をレンダーするために使用される「React ノード」。通常、これは `renderToPipeableStream(<App />)` のような `ReactDOM Server` メソッドでレンダーされた `<App />` のような JSX です。

- **オプション** `options`: この React ルートのオプションを含むオブジェクト。
  - **オプション** `onCaughtError`: エラーバウンダリで React がエラーをキャッチしたときに呼び出されるコールバック。エラーバウンダリによってキャッチされた `error` と、`componentStack` を含む `errorInfo` オブジェクトを渡して呼び出されます。
  - **オプション** `onUncaughtError`: エラーがスローされてエラーバウンダリによってキャッチされなかったときに呼び出されるコールバック。スローされた `error` と、`componentStack` を含む `errorInfo` オブジェクトを渡して呼び出されます。
  - **オプション** `onRecoverableError`: React が自動的にエラーから回復したときに呼び出されるコールバック。React がスローする `error` と、`componentStack` を含む `errorInfo` オブジェクトを渡して呼び出されます。一部の回復可能なエラーには、元のエラー原因が `error.cause` として含まれる場合があります。
  - **オプション** `identifierPrefix`: React が `useId` によって生成される ID に使用する文字列プレフィックス。同じページ上で複数のルートを使用する場合の競合を回避するのに役立ちます。サーバー上で使用されたプレフィックスと同じである必要があります。

#### 戻り値

`hydrateRoot` は、`render` と `unmount` の 2 つのメソッドを持つオブジェクトを返します。

#### 注意事項

- `hydrateRoot()` は、レンダーされたコンテンツがサーバーレンダーされたコンテンツと同一であることを期待します。不一致をバグとして扱い、修正する必要があります。
- 開発モードでは、React はハイドレーション中の不一致について警告します。不一致が発生した場合、属性の違いが修正される保証はありません。これはパフォーマンス上の理由から重要です。なぜなら、ほとんどのアプリでは不一致はまれであり、すべてのマークアップを検証することは法外に高価になるためです。
- アプリには通常、`hydrateRoot` の呼び出しが 1 つだけ存在します。フレームワークを使用している場合、フレームワークがこの呼び出しを行う可能性があります。
- アプリがクライアントレンダーのみで、事前にレンダーされた HTML がない場合、`hydrateRoot()` の使用はサポートされていません。代わりに `createRoot()` を使用してください。

### `root.render(reactNode)`

ハイドレートされた React ルートのブラウザ DOM ノード内のコンポーネントを更新するために `root.render` を呼び出します。

```javascript
root.render(<App />);
```

React はハイドレートされた `root` 内の `<App />` を更新します。

#### パラメータ

- `reactNode`: 更新したい「React ノード」。通常、これは `<App />` のような JSX ですが、`createElement()` で作成した React 要素、文字列、数値、`null`、または `undefined` を渡すこともできます。

#### 戻り値

`root.render` は `undefined` を返します。

#### 注意事項

- ルートのハイドレーションが完了する前に `root.render` を呼び出すと、React は既存のサーバーレンダーされた HTML コンテンツをクリアし、ルート全体をクライアントレンダリングに切り替えます。

### `root.unmount()`

`root.unmount` を呼び出して、React ルート内のレンダーされたツリーを破棄します。

```javascript
root.unmount();
```

完全に React で構築されたアプリには、通常、`root.unmount` の呼び出しはありません。

これは主に、React ルートの DOM ノード（またはその祖先のいずれか）が他のコードによって DOM から削除される可能性がある場合に役立ちます。たとえば、非アクティブなタブを DOM から削除する jQuery タブパネルを想像してください。タブが削除されると、その内部のすべて（React ルートを含む）も DOM から削除されます。その場合、削除されたルートのコンテンツの管理を「停止」するよう React に通知するために `root.unmount` を呼び出す必要があります。そうしないと、削除されたルート内のコンポーネントは、サブスクリプションなどのグローバルリソースをクリーンアップして解放する必要があることを認識しません。

`root.unmount` を呼び出すと、ルート内のすべてのコンポーネントがアンマウントされ、React がルート DOM ノードから「切り離され」、ツリー内のイベントハンドラーや状態が削除されます。

#### パラメータ

`root.unmount` はパラメータを受け取りません。

#### 戻り値

`root.unmount` は `undefined` を返します。

#### 注意事項

- `root.unmount` を呼び出すと、ツリー内のすべてのコンポーネントがアンマウントされ、React がルート DOM ノードから「切り離され」ます。
- `root.unmount` を呼び出した後、同じルートで再度 `root.render` を呼び出すことはできません。アンマウントされたルートで `root.render` を呼び出そうとすると、「Cannot update an unmounted root」エラーがスローされます。ただし、そのノードの前のルートがアンマウントされた後、同じ DOM ノードに新しいルートを作成することはできます。

## 使用法

### サーバーレンダーされた HTML のハイドレーション

アプリの HTML が `react-dom/server` によって生成された場合、クライアント上でそれをハイドレートする必要があります。

```javascript
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

これにより、ブラウザ DOM ノード内のサーバー HTML が、アプリの React コンポーネントでハイドレートされます。通常、これはスタートアップ時に一度行います。フレームワークを使用している場合、フレームワークが自動的にこれを行う可能性があります。

アプリをハイドレートするために、React は、コンポーネントのロジックをサーバーで生成された初期 HTML に「アタッチ」します。ハイドレーションは、サーバーからの初期 HTML スナップショットを、ブラウザで実行される完全にインタラクティブなアプリに変換します。

**HTML ファイル（サーバーから返される）:**

```html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- サーバーから返されるレンダー済み HTML -->
    <div id="root"><h1>Hello, world!</h1></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

**React クライアントコード:**

```javascript
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

**App コンポーネント:**

```javascript
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

通常、`hydrateRoot` を呼び出すのはスタートアップ時に一度だけです。フレームワークを使用している場合は、自動的に実行される可能性があります。

アプリをハイドレートするために、React は、サーバーで実行されたコンポーネントのロジックを、サーバーから返された初期 HTML に「アタッチ」します。ハイドレーションは、サーバーからの初期 HTML スナップショットを、ブラウザで実行される完全にインタラクティブなアプリに変換します。

### ドキュメント全体のハイドレーション

完全に React で構築されたアプリは、`<html>` タグを含むドキュメント全体を JSX としてレンダーできます:

```javascript
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

ドキュメント全体をハイドレートするには、`hydrateRoot` の最初の引数として `document` グローバルを渡します:

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

### 避けられないハイドレーション不一致エラーの抑制

単一の要素の属性またはテキストコンテンツがサーバーとクライアント間で避けられない形で異なる場合（たとえば、タイムスタンプ）、ハイドレーション不一致警告をサイレンスできます。

要素のハイドレーション警告をサイレンスするには、`suppressHydrationWarning={true}` を追加します:

```javascript
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

これは 1 レベルの深さでのみ機能し、避難ハッチとして使用することを意図しています。過度に使用しないでください。テキストコンテンツでない限り、React はそれを修正しようとしないため、将来の更新まで一貫性がない可能性があります。

### クライアントとサーバーで異なるコンテンツの処理

サーバーとクライアントで意図的に異なるものをレンダーする必要がある場合は、2 パスレンダリングを行うことができます。クライアントで異なるものをレンダーするコンポーネントは、`isClient` のような状態変数を読み取ることができます。これは Effect で `true` に設定できます:

```javascript
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

この方法では、初期レンダーパスはサーバーと同じコンテンツをレンダーし、不一致を回避しますが、追加のパスはハイドレーションの直後に同期的に行われます。

**注意:** このアプローチでは、コンポーネントを 2 回レンダーする必要があるため、ハイドレーションが遅くなります。低速接続でのユーザーエクスペリエンスに注意してください。JavaScript コードは、初期 HTML よりもかなり遅れて読み込まれる可能性があるため、ハイドレーション直後に異なる UI をレンダーすることは、ユーザーにとって不快に感じる可能性があります。

### ハイドレートされたルートコンポーネントの更新

ルートのハイドレーションが完了した後、`root.render` を呼び出してルート React コンポーネントを更新できます。**`createRoot` とは異なり、初期コンテンツが既に HTML としてレンダーされているため、通常これを行う必要はありません。**

ハイドレーション後のある時点で `root.render` を呼び出し、コンポーネントツリーの構造が以前にレンダーされたものと一致する場合、React は状態を保持します。この例では、毎秒繰り返される `render` 呼び出しによる更新が破壊的でないことに注目してください。input に入力できます:

```javascript
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

ハイドレートされたルートで `root.render` を呼び出すことは珍しいです。通常、代わりにコンポーネント内のいずれかで状態を更新します。

### キャッチされなかったエラーのダイアログ表示

デフォルトでは、React はすべてのキャッチされなかったエラーをコンソールにログ出力します。独自のエラーレポートを実装するには、オプションのルートオプション `onUncaughtError` を指定できます:

```javascript
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Uncaught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
```

`onUncaughtError` オプションは、2 つの引数を持つ関数です:

1. スローされた `error`。
2. エラーの `componentStack` を含む `errorInfo` オブジェクト。

`onUncaughtError` ルートオプションを使用して、エラーダイアログを表示できます:

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';
import {reportUncaughtError} from './reportError';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onUncaughtError: (error, errorInfo) => {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
);
root.render(<App />);
```

### エラーバウンダリでキャッチされたエラーの表示

デフォルトでは、React はエラーバウンダリによってキャッチされたすべてのエラーを `console.error` にログ出力します。この動作をオーバーライドするには、オプションのルートオプション `onCaughtError` を指定して、エラーバウンダリによってキャッチされたエラーを処理できます:

```javascript
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
```

`onCaughtError` オプションは、2 つの引数を持つ関数です:

1. バウンダリによってキャッチされた `error`。
2. エラーの `componentStack` を含む `errorInfo` オブジェクト。

`onCaughtError` ルートオプションを使用して、エラーダイアログを表示したり、既知のエラーをログからフィルタリングしたりできます:

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';
import {reportCaughtError} from './reportError';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      if (shouldIgnoreError(error)) {
        return;
      }
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
);
```

### 回復可能なエラーの Dialog 表示

React が、レンダリングエラーから自動的に回復するために再レンダリングする場合があります。成功すると、React は開発者に通知するために回復可能なエラーをコンソールにログ出力します。この動作をオーバーライドするには、オプションのルートオプション `onRecoverableError` を指定できます:

```javascript
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Recoverable error',
        error,
        error.cause,
        errorInfo.componentStack
      );
    }
  }
);
```

`onRecoverableError` オプションは、2 つの引数を持つ関数です:

1. React がスローする `error`。一部のエラーには、元の原因が `error.cause` として含まれる場合があります。
2. エラーの `componentStack` を含む `errorInfo` オブジェクト。

`onRecoverableError` ルートオプションを使用して、エラーダイアログを表示できます:

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';
import {reportRecoverableError} from './reportError';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      reportRecoverableError({
        error,
        cause: error.cause,
        componentStack: errorInfo.componentStack
      });
    }
  }
);
```

## トラブルシューティング

### 「Hydration failed because the server rendered HTML didn't match the client」エラー

このエラーは、ルートの DOM コンテンツ（HTML）がサーバーでレンダーされた HTML と一致しない場合に発生します。これは、React がハイドレーション中に既存の HTML をテンプレートとして使用しようとするが、期待と異なる場合に起こります。

ハイドレーション不一致は通常、次のいずれかが原因です:

1. **ルートノードの周囲の追加の空白（改行など）**: ルート周辺の HTML に余分な空白がないことを確認してください。

```html
<!-- 🚫 間違い: ルート div の周りに改行がある -->
<div id="root">
  <App />
</div>

<!-- ✅ 正しい: ルート div 内に余分な空白なし -->
<div id="root"><App /></div>
```

2. **レンダリングロジックで `typeof window !== 'undefined'` のようなチェックを使用する**: これはサーバーとクライアントで異なる出力を生成するため、避けてください。

3. **レンダリングロジックで `window.matchMedia` のようなブラウザ専用 API を使用する**: サーバーでは利用できないため、ハイドレーション不一致が発生します。

4. **サーバーとクライアントで異なるデータをレンダーする**: サーバーとクライアントが同じプロップとデータを読み取ることを確認してください。

5. **レンダリング中に非決定的な値（`Math.random()` や `Date.now()`）を使用する**: これらはサーバーとクライアントで異なる値を生成します。

6. **ブラウザ拡張機能が HTML を変更する**: 一部のブラウザ拡張機能は DOM を変更し、ハイドレーション不一致を引き起こす可能性があります。

不一致を修正する最善の方法は、警告を読んで、サーバーとクライアントのコードを一致させることです。一部の不一致（タイムスタンプなど）が避けられない場合は、`suppressHydrationWarning={true}` を使用して警告をサイレンスできます。

### ハイドレーション時に「Warning: Text content did not match」警告

これは、サーバーがレンダーしたテキストコンテンツとクライアントがレンダーするテキストコンテンツが異なる場合に発生します。

一般的な原因:

1. **タイムスタンプや日付**: `new Date().toLocaleDateString()` はサーバーとクライアントで異なる値を返します。

2. **ロケール固有のフォーマット**: 数値や日付のフォーマットがサーバーとクライアントで異なる場合があります。

3. **ブラウザ専用の値**: `window.innerWidth` などのブラウザ専用 API にアクセスしています。

修正方法:

1. **Effect を使用する**: クライアント専用のコンテンツを Effect 内に移動します:

```javascript
function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <div>{isClient ? 'Client' : 'Server'}</div>;
}
```

2. **suppressHydrationWarning を使用する**: 避けられない不一致の場合:

```javascript
<time suppressHydrationWarning={true}>
  {new Date().toLocaleDateString()}
</time>
```

### ハイドレーション時にアプリ全体がクライアントコンテンツに置き換えられる

これは、サーバーとクライアントのレンダリングが大きく異なる場合に発生します。React がハイドレーションに失敗すると、クライアント側で完全に再レンダリングします。

一般的な原因:

1. **`hydrateRoot` の前に `createRoot` を使用している**: サーバーレンダーされたアプリには必ず `hydrateRoot` を使用してください。

2. **間違った DOM ノードをハイドレートしている**: 正しい DOM ノードを渡していることを確認してください。

3. **サーバーとクライアントで完全に異なるツリーをレンダーしている**: コンポーネントのロジックとデータが一致することを確認してください。

この問題を解決するには、ブラウザの開発者ツールでコンソール警告を確認し、不一致の正確な場所を特定してください。

### 「An error occurred during hydration」エラー

ハイドレーション中に JavaScript エラーが発生した場合、このエラーが表示されます。一般的な原因:

1. **レンダリング中にスローされる例外**: コンポーネントのレンダリングロジックにエラーがあります。

2. **null/undefined への不正なアクセス**: データが期待どおりに利用可能であることを確認してください。

3. **ブラウザ API への早期アクセス**: `useEffect` の外でブラウザ API を使用しています。

デバッグ方法:

1. コンソールで完全なエラースタックトレースを確認する
2. エラーバウンダリを追加してエラーをキャッチする
3. サーバーとクライアントのレンダリングロジックを比較する

### React 19 でのハイドレーションの改善

React 19 では、ハイドレーションエラーのレポートが改善され、不一致に関するより詳細な情報が提供されます。また、パフォーマンスも向上しています。

## まとめ

`hydrateRoot` は、サーバーレンダリングされた React アプリケーションに不可欠です。正しく使用すれば、初期 HTML を保持しながら、完全にインタラクティブな React アプリケーションを提供できます。主な考慮事項は、サーバーとクライアントのレンダリング結果を一致させることです。
