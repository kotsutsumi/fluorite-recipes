# createRoot

`createRoot` は、ブラウザの DOM ノード内に React コンポーネントを表示するためのルートを作成します。

```javascript
const root = createRoot(domNode, options?)
```

## リファレンス

### `createRoot(domNode, options?)`

`createRoot` を呼び出して、ブラウザの DOM 要素内にコンテンツを表示するための React ルートを作成します。

```javascript
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React は `domNode` のルートを作成し、その内部の DOM の管理を引き継ぎます。ルートを作成した後、`root.render` を呼び出して React コンポーネントを表示する必要があります。

```javascript
root.render(<App />);
```

完全に React で構築されたアプリには、通常、ルートコンポーネントに対する `createRoot` の呼び出しが 1 つだけ存在します。ページの一部に React を使用する場合は、必要な数だけ独立したルートを持つことができます。

#### パラメータ

- `domNode`: DOM 要素。React はこの DOM 要素のルートを作成し、`render` などのルート上の関数を呼び出してレンダーされた React コンテンツを表示できるようにします。

- **オプション** `options`: この React ルートのオプションを含むオブジェクト。
  - **オプション** `onCaughtError`: エラーバウンダリで React がエラーをキャッチしたときに呼び出されるコールバック。エラーバウンダリによってキャッチされた `error` と、`componentStack` を含む `errorInfo` オブジェクトを渡して呼び出されます。
  - **オプション** `onUncaughtError`: エラーがスローされてエラーバウンダリによってキャッチされなかったときに呼び出されるコールバック。スローされた `error` と、`componentStack` を含む `errorInfo` オブジェクトを渡して呼び出されます。
  - **オプション** `onRecoverableError`: React が自動的にエラーから回復したときに呼び出されるコールバック。React がスローする `error` と、`componentStack` を含む `errorInfo` オブジェクトを渡して呼び出されます。一部の回復可能なエラーには、元のエラー原因が `error.cause` として含まれる場合があります。
  - **オプション** `identifierPrefix`: React が `useId` によって生成される ID に使用する文字列プレフィックス。同じページ上で複数のルートを使用する場合の競合を回避するのに役立ちます。

#### 戻り値

`createRoot` は、`render` と `unmount` の 2 つのメソッドを持つオブジェクトを返します。

#### 注意事項

- アプリが完全に React で構築されている場合、通常は `createRoot` の呼び出しは 1 つだけです。
- ページの一部に React を使用する場合は、必要な数だけ独立したルートを持つことができます。
- ルートを作成したら、`root.render` を呼び出してコンテンツを表示する必要があります。

### `root.render(reactNode)`

`root.render` を呼び出して、React ルート のブラウザ DOM ノードに React コンポーネントを表示します。

```javascript
root.render(<App />);
```

React は `root` に `<App />` を表示し、その内部の DOM の管理を引き継ぎます。

#### パラメータ

- `reactNode`: 表示したい React ノード。通常は `<App />` のような JSX ですが、`createElement()` で作成した React 要素、文字列、数値、`null`、または `undefined` を渡すこともできます。

#### 戻り値

`root.render` は `undefined` を返します。

#### 注意事項

- 最初に `root.render` を呼び出すと、React は React ルート内の既存の HTML コンテンツをすべてクリアしてから、React コンポーネントをレンダーします。
- ルートの DOM ノードにサーバーまたはビルド中に React によって生成された HTML が含まれている場合は、代わりに既存の HTML にイベントハンドラーをアタッチする `hydrateRoot()` を使用してください。
- 同じルートで `render` を複数回呼び出すと、React は最新の JSX を反映するために必要に応じて DOM を更新します。React は、以前にレンダーされたツリーと「一致」させることで、DOM のどの部分を再利用でき、どの部分を再作成する必要があるかを決定します。同じルートで再度 `render` を呼び出すことは、ルートコンポーネントで `set` 関数を呼び出すことに似ています。React は不要な DOM 更新を回避します。

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

### 完全に React で構築されたアプリのレンダー

アプリが完全に React で構築されている場合は、アプリ全体に対して単一のルートを作成します。

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

通常、このコードはスタートアップ時に一度だけ実行する必要があります。これにより:

1. HTML で定義されたブラウザ DOM ノードを検索します。
2. アプリの React コンポーネントを内部に表示します。

**HTML ファイル:**

```html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- これが DOM ノードです -->
    <div id="root"></div>
  </body>
</html>
```

**React コード:**

```javascript
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**完全に React で構築されたアプリの場合、これだけで十分です。** アプリ全体をレンダーするために、より多くのルートを作成する必要はありません。

この時点から、React はアプリ全体の DOM を管理します。さらにコンポーネントを追加するには、`App` コンポーネント内にネストします。UI を更新する必要がある場合、各コンポーネントは状態を使用してそれを行うことができます。DOM ノードの外側に追加のコンテンツを表示する必要がある場合は、ポータルを使用してレンダーします。

### 部分的に React で構築されたページのレンダー

ページが完全に React で構築されていない場合、React で管理される UI の各トップレベル部分に対してルートを作成するために、`createRoot` を複数回呼び出すことができます。各ルートで異なるコンテンツを表示するには、`root.render` を呼び出します。

ここでは、`index.html` ファイルで定義された 2 つの異なる DOM ノードに、2 つの異なる React コンポーネントがレンダーされます:

**HTML ファイル:**

```html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>このパラグラフは React によってレンダーされていません（検証するには index.html を開いてください）。</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

**React コード:**

```javascript
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode);
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode);
commentRoot.render(<Comments />);
```

`document.createElement()` で新しい DOM ノードを作成し、手動でドキュメントに追加することもできます。

```javascript
const domNode = document.createElement('div');
const root = createRoot(domNode);
root.render(<Comment />);
document.body.appendChild(domNode); // ドキュメント内のどこにでも追加できます
```

React ツリーを DOM ノードから削除し、それが使用しているすべてのリソースをクリーンアップするには、`root.unmount` を呼び出します。

```javascript
root.unmount();
```

これは主に、React コンポーネントが別のフレームワークで記述されたアプリ内にある場合に役立ちます。

### ルートコンポーネントの更新

同じルートで `render` を複数回呼び出すことができます。コンポーネントツリーの構造が以前にレンダーされたものと一致する限り、React は状態を保持します。この例では、毎秒繰り返される `render` 呼び出しによる更新が破壊的でないことに注目してください。input に入力できます:

**React コード:**

```javascript
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

**App コンポーネント:**

```javascript
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

`render` を複数回呼び出すことは珍しいです。通常、代わりにコンポーネント内で状態を更新します。

### 「Target container is not a DOM element」エラー

このエラーは、`createRoot` に渡したものが DOM ノードではないことを意味します。

何が起こっているのかわからない場合は、ログに記録してみてください:

```javascript
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

たとえば、`domNode` が `null` の場合、`getElementById` が `null` を返したことを意味します。これは、呼び出し時にドキュメント内に指定された ID のノードが存在しない場合に発生します。いくつかの理由が考えられます:

1. 探している ID が HTML ファイルで使用した ID と異なる可能性があります。タイプミスを確認してください！
2. バンドルの `<script>` タグは、HTML で後に表示される DOM ノードを「見る」ことができません。

このエラーが発生するもう 1 つの一般的な方法は、`createRoot(domNode)` ではなく `createRoot(<App />)` と書くことです。

### 「Functions are not valid as a React child」エラー

このエラーは、`root.render` に渡したものが React コンポーネントではないことを意味します。

これは、`root.render` を `Component` ではなく `Component()` の結果で呼び出した場合に発生する可能性があります:

```javascript
// 🚫 間違い: App は関数であり、コンポーネントではありません。
root.render(App());

// ✅ 正しい: App をコンポーネントとして渡します。
root.render(<App />);
```

または、`root.render` に関数の呼び出し結果ではなく、関数自体を渡した場合:

```javascript
// 🚫 間違い: createRoot は関数を期待していません。
root.render(createRoot);

// ✅ 正しい: createRoot を呼び出してルートを作成します。
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### サーバーレンダーされた HTML が最初から再作成される

アプリがサーバーレンダーされ、React によって生成された初期 HTML が含まれている場合、ルートを作成して `root.render` を呼び出すと、その HTML がすべて削除され、すべての DOM ノードが最初から再作成されることに気付くかもしれません。これにより、速度が遅くなり、フォーカスとスクロール位置がリセットされ、その他のユーザー入力が失われる可能性があります。

サーバーレンダーされたアプリは、`createRoot` ではなく `hydrateRoot` を使用する必要があります:

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

API が異なることに注意してください。特に、通常、追加の `root.render` 呼び出しはありません。

## トラブルシューティング

### ルートを作成しましたが、何も表示されません

実際にルートにコンテンツを `render` することを忘れていないことを確認してください:

```javascript
const root = createRoot(document.getElementById('root'));
// ✅ これを忘れないでください！
root.render(<App />);
```

これを行うまで、何も表示されません。

### 「You passed a second argument to root.render」エラー

よくある間違いは、`createRoot` のオプションを `root.render(...)` に渡すことです:

```javascript
// 🚫 間違い: root.render は 1 つの引数のみを受け取ります。
root.render(<App />, {onUncaughtError});

// ✅ 正しい: オプションを createRoot に渡します。
const root = createRoot(container, {onUncaughtError});
root.render(<App />);
```

### 「Target container is not a DOM element」エラー

このエラーは、`createRoot` に渡したものが DOM ノードではないことを意味します。

### 「Functions are not valid as a React child」エラー

このエラーは、`root.render` に渡したものが React コンポーネントではないことを意味します。

これは、コンポーネントを `Component()` のように呼び出して、結果を渡した場合に発生する可能性があります:

```javascript
// 🚫 間違い: App は関数であり、コンポーネントではありません。
root.render(App());

// ✅ 正しい: App をコンポーネントとして渡します。
root.render(<App />);
```

### サーバーレンダーされた HTML が最初から再作成される

サーバーレンダーされたアプリでは、`createRoot` の代わりに `hydrateRoot` を使用してください:

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```
