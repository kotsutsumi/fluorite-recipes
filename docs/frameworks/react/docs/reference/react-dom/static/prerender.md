# prerender

`prerender` は、React ツリーを [Web Stream](https://developer.mozilla.org/docs/Web/API/Streams_API) を用いて静的な HTML 文字列にレンダーします。

```javascript
const {prelude} = await prerender(reactNode, options?)
```

> **注意**
>
> この API は [Web Stream](https://developer.mozilla.org/docs/Web/API/Streams_API) に依存しています。Node.js の場合は、代わりに [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) を使用してください。

---

## リファレンス

### `prerender(reactNode, options?)`

`prerender` を呼び出して、React ツリーを静的な HTML として Web Stream にレンダーします。

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

すべてのサスペンス境界が解決されるまで待機し、完全な HTML を生成します。

#### パラメータ

- **`reactNode`**: HTML へとレンダーしたい React ノード。例えば、`<App />` のような JSX 要素。これはドキュメント全体を表すことが想定されているため、`App` コンポーネントは `<html>` タグをレンダーする必要があります。

- **オプション `options`**: 静的生成用のオプションを含むオブジェクト。
  - **オプション `bootstrapScriptContent`**: 指定された場合、この文字列がインライン `<script>` タグに配置されます。
  - **オプション `bootstrapScripts`**: ページに出力する `<script>` タグの URL 文字列の配列。これを使用して、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出す `<script>` を含めます。クライアントで React を全く実行したくない場合は省略してください。
  - **オプション `bootstrapModules`**: `bootstrapScripts` と同様ですが、代わりに [`<script type="module">`](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) を出力します。
  - **オプション `identifierPrefix`**: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) に渡すプレフィックスと同じである必要があります。
  - **オプション `namespaceURI`**: ストリームのルート [namespace URI](https://developer.mozilla.org/docs/Web/API/Document/createElementNS#important_namespace_uris) を含む文字列。デフォルトは通常の HTML です。SVG の場合は `'http://www.w3.org/2000/svg'`、MathML の場合は `'http://www.w3.org/1998/Math/MathML'` を渡します。
  - **オプション `nonce`**: [`script-src` Content-Security-Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) のためにスクリプトを許可する [`nonce`](http://developer.mozilla.org/docs/Web/HTML/Element/script#nonce) 文字列。
  - **オプション `onError`**: サーバエラーが発生するたびに発火するコールバック。デフォルトでは、これは `console.error` のみを呼び出します。これをオーバーライドして[クラッシュレポートをログに記録する](#logging-errors)場合は、`console.error` を必ず呼び出すようにしてください。
  - **オプション `progressiveChunkSize`**: チャンク内のバイト数。[デフォルトのヒューリスティックについて詳しく読む。](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
  - **オプション `signal`**: 静的生成を中止できるようにする [abort signal](https://developer.mozilla.org/docs/Web/API/AbortSignal)。

#### 返り値

`prerender` は Promise を返します。成功時は以下のプロパティを持つオブジェクトに解決されます：

- **`prelude`**: 完全な HTML の [Readable Web Stream](https://developer.mozilla.org/docs/Web/API/ReadableStream)。これには、すべてのサスペンス境界が解決された後の最終的な HTML が含まれます。

---

## 使用法

### React ツリーを静的な HTML としてストリームにレンダーする

`prerender` を呼び出して、React ツリーを HTML として [Readable Web Stream](https://developer.mozilla.org/docs/Web/API/ReadableStream) にレンダーします：

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

ルートコンポーネントと共に、[bootstrap `<script>` タグ](#adding-bootstrap-scripts)のパスのリストを提供する必要があります。ルートコンポーネントは、**ルート `<html>` タグを含むドキュメント全体を返す**必要があります。

```javascript
export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
        <title>マイアプリ</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React は、[doctype](https://developer.mozilla.org/docs/Glossary/Doctype) と [bootstrap `<script>` タグ](#adding-bootstrap-scripts)を結果の HTML ストリームに注入します：

```html
<!DOCTYPE html>
<html lang="ja">
  <!-- ... あなたのコンポーネントからの HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

クライアント側では、bootstrap スクリプトが [`hydrateRoot` を呼び出してドキュメント全体をハイドレート](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)する必要があります：

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

これにより、サーバで生成された HTML にイベントリスナーがアタッチされ、インタラクティブになります。

---

### すべてのデータの読み込みを待機する

`prerender` は、すべての[サスペンス境界](/reference/react/Suspense)が解決されるまで待機してから、完全な HTML を返します。

次の例を考えてみましょう：

```javascript
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`prerender` を使用すると、React は `<Posts />` コンポーネント（サスペンス境界内にある）のデータのロードが完了するまで待機します。最終的な HTML には、すべてのデータが含まれます：

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  // React はすべてのサスペンス境界が解決されるまで待機
  const {prelude} = await prerender(<ProfilePage />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

生成された HTML には、ローディング状態ではなく、実際のデータが含まれます。

---

### ブートストラップスクリプトの追加

デフォルトでは、React アプリは静的な HTML のみを生成します。インタラクティブにするには、クライアント側のコードをロードする必要があります。

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    // クライアント側のコードを含むスクリプト
    bootstrapScripts: ['/main.js'],
    // または ES モジュールを使用
    bootstrapModules: ['/main.mjs']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

生成される HTML：

```html
<!DOCTYPE html>
<html>
  <!-- ... アプリの HTML ... -->
</html>
<script src="/main.js" async=""></script>
```

クライアント側のコード（`/main.js`）は、`hydrateRoot` を呼び出す必要があります：

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### インライン bootstrap スクリプトの追加

外部ファイルへのリクエストを削減するために、インラインスクリプトを含めることができます：

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScriptContent: `
      console.log('アプリが読み込まれました');
      // 初期化コード
    `
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

これにより、HTML に直接埋め込まれたスクリプトが生成されます：

```html
<script>
  console.log('アプリが読み込まれました');
  // 初期化コード
</script>
```

---

### ID プレフィックスの設定

同じページに複数の React ルートがある場合、ID の競合を避けるために `identifierPrefix` を使用します：

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    identifierPrefix: 'my-app-',
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

クライアント側でも同じプレフィックスを使用します：

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />, {
  identifierPrefix: 'my-app-'
});
```

---

### SVG または MathML のレンダリング

SVG または MathML をレンダーする場合、適切な namespace URI を指定します：

```javascript
import { prerender } from 'react-dom/static';

async function renderSVG() {
  const {prelude} = await prerender(
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="blue" />
    </svg>,
    {
      namespaceURI: 'http://www.w3.org/2000/svg'
    }
  );
  return prelude;
}

async function renderMathML() {
  const {prelude} = await prerender(
    <math>
      <mrow>
        <mi>x</mi>
        <mo>=</mo>
        <mn>2</mn>
      </mrow>
    </math>,
    {
      namespaceURI: 'http://www.w3.org/1998/Math/MathML'
    }
  );
  return prelude;
}
```

---

### Content Security Policy (CSP) の設定

厳格な Content Security Policy を使用する場合、`nonce` を指定します：

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  const nonce = generateNonce(); // nonce を生成

  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js'],
    nonce: nonce
  });

  return new Response(prelude, {
    headers: {
      'content-type': 'text/html',
      'Content-Security-Policy': `script-src 'nonce-${nonce}'`
    },
  });
}
```

---

### 静的生成の中止

タイムアウトや他の理由で静的生成を中止できます：

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  const controller = new AbortController();

  // 10秒後にタイムアウト
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const {prelude} = await prerender(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js']
    });

    clearTimeout(timeout);

    return new Response(prelude, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      return new Response('生成がタイムアウトしました', {
        status: 504
      });
    }
    throw error;
  }
}
```

---

### エラーのログ記録

サーバエラーをログに記録するには、`onError` コールバックを使用します：

```javascript
import { prerender } from 'react-dom/static';

async function handler(request) {
  let didError = false;

  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      didError = true;
      console.error('静的生成エラー:', error);
      logErrorToService(error); // エラー追跡サービスに送信
    }
  });

  return new Response(prelude, {
    status: didError ? 500 : 200,
    headers: { 'content-type': 'text/html' },
  });
}
```

カスタム `onError` 実装を提供する場合は、上記のように必ずコンソールにもエラーをログ記録してください。

---

## トラブルシューティング

### サスペンスが解決されない

コンポーネントがサスペンドし、Promise が決して解決されない場合、`prerender` から返される Promise も決して解決されません：

```javascript
// 警告: これは決して解決されない
const promise = new Promise(() => {});

function App() {
  // このコンポーネントは決して完了しない
  const data = use(promise);
  return <div>{data}</div>;
}

// これは永久にハングする
const {prelude} = await prerender(<App />);
```

これを避けるために、タイムアウトを設定してレンダリングを中止できます：

```javascript
const controller = new AbortController();

setTimeout(() => {
  controller.abort();
}, 10000);

try {
  const {prelude} = await prerender(<App />, {
    signal: controller.signal
  });
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('レンダリングがタイムアウトしました');
  }
}
```

---

### クライアントとサーバの不一致

静的生成された HTML とクライアント側のハイドレーションで不一致が発生する場合：

1. **ID プレフィックスを確認**: サーバとクライアントで同じ `identifierPrefix` を使用していることを確認

```javascript
// サーバ
const {prelude} = await prerender(<App />, {
  identifierPrefix: 'app-'
});

// クライアント
hydrateRoot(document, <App />, {
  identifierPrefix: 'app-'
});
```

2. **データの一貫性を確認**: サーバとクライアントで同じデータを使用していることを確認

3. **ランダム値を避ける**: `Math.random()` や `Date.now()` など、サーバとクライアントで異なる値を生成する関数の使用を避ける

---

### ストリームの読み取り

Web Stream からデータを読み取るには：

```javascript
import { prerender } from 'react-dom/static';

async function generateHTML() {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });

  // ストリームを配列バッファに変換
  const chunks = [];
  const reader = prelude.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  // バイト配列を結合して文字列に変換
  const allChunks = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  );

  let offset = 0;
  for (const chunk of chunks) {
    allChunks.set(chunk, offset);
    offset += chunk.length;
  }

  const html = new TextDecoder().decode(allChunks);
  return html;
}
```

---

## ベストプラクティス

### 1. フレームワークの機能を活用

ほとんどの React フレームワークは、静的生成を自動的に処理します：

```javascript
// Next.js の例
export async function generateStaticParams() {
  // Next.js が自動的に prerender を使用
  return [
    { slug: 'post-1' },
    { slug: 'post-2' },
  ];
}

export default function Page({ params }) {
  return <Article slug={params.slug} />;
}
```

### 2. データを事前にロード

サスペンスを使用する場合でも、可能な限りデータを事前にロードします：

```javascript
async function generatePage(slug) {
  // データを事前にフェッチ
  const data = await fetchArticle(slug);

  const {prelude} = await prerender(
    <Article data={data} />,
    { bootstrapScripts: ['/main.js'] }
  );

  return prelude;
}
```

### 3. エラーハンドリングを実装

本番環境では、常に適切なエラーハンドリングを実装します：

```javascript
async function generateWithErrorHandling() {
  try {
    const {prelude} = await prerender(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error('生成エラー:', error);
        reportError(error);
      }
    });
    return prelude;
  } catch (error) {
    console.error('致命的エラー:', error);
    throw error;
  }
}
```

### 4. タイムアウトを設定

無限にハングすることを防ぐため、常にタイムアウトを設定します：

```javascript
async function generateWithTimeout() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const {prelude} = await prerender(<App />, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    return prelude;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}
```

### 5. 必要最小限のスクリプトを含める

クライアント側のバンドルサイズを小さく保ちます：

```javascript
const {prelude} = await prerender(<App />, {
  // 必要なスクリプトのみを含める
  bootstrapScripts: ['/runtime.js', '/main.js'],
  // 重いライブラリは遅延ロード
});
```

---

## 関連リソース

- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) - Node.js 環境用の静的レンダリング
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) - ストリーミング SSR
- [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) - クライアント側のハイドレーション
- [`<Suspense>`](/reference/react/Suspense) - ローディング状態の管理
- [`use`](/reference/react/use) - Promise からデータを読み取る
