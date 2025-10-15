# prerenderToNodeStream

`prerenderToNodeStream` は React ツリーを [Node.js ストリーム](https://nodejs.org/api/stream.html)を用いて静的な HTML 文字列にレンダーします。

```javascript
const {prelude} = await prerenderToNodeStream(reactNode, options?)
```

> **注意**
>
> この API は Node.js 専用です。Deno やモダンエッジランタイムのような [Web Stream](https://developer.mozilla.org/docs/Web/API/Streams_API) 環境では、代わりに [`prerender`](/reference/react-dom/static/prerender) を使用してください。

---

## リファレンス

### `prerenderToNodeStream(reactNode, options?)`

`prerenderToNodeStream` を呼び出して、React ツリーを静的な HTML として Node.js ストリームにレンダーします。

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
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

`prerenderToNodeStream` は Promise を返します。成功時は以下のプロパティを持つオブジェクトに解決されます：

- **`prelude`**: 完全な HTML の [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams)。これには、すべてのサスペンス境界が解決された後の最終的な HTML が含まれます。

---

## 使用法

### React ツリーを静的な HTML としてストリームにレンダーする

`prerenderToNodeStream` を呼び出して、React ツリーを HTML として Node.js ストリームにレンダーします：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

app.use('/', async (request, response) => {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
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

`prerenderToNodeStream` は、すべての[サスペンス境界](/reference/react/Suspense)が解決されるまで待機してから、完全な HTML を返します。

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

`prerenderToNodeStream` を使用すると、React は `<Posts />` コンポーネント（サスペンス境界内にある）のデータのロードが完了するまで待機します。最終的な HTML には、すべてのデータが含まれます：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

app.use('/', async (request, response) => {
  // React はすべてのサスペンス境界が解決されるまで待機
  const { prelude } = await prerenderToNodeStream(<ProfilePage />, {
    bootstrapScripts: ['/main.js']
  });
  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
});
```

生成された HTML には、ローディング状態ではなく、実際のデータが含まれます。

---

### ファイルへの書き込み

Node.js ストリームをファイルに書き込むことができます：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

async function generateStaticFile() {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  const outputStream = createWriteStream('output.html');
  await pipeline(prelude, outputStream);

  console.log('静的 HTML ファイルが生成されました');
}
```

---

### ストリームから文字列への変換

ストリーム全体を文字列として読み取ることもできます：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

async function generateHTMLString() {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  const chunks = [];
  for await (const chunk of prelude) {
    chunks.push(chunk);
  }

  const html = Buffer.concat(chunks).toString('utf-8');
  return html;
}
```

---

### Express との統合

Express サーバーでの使用例：

```javascript
import express from 'express';
import { prerenderToNodeStream } from 'react-dom/static';

const app = express();

app.get('/', async (req, res) => {
  try {
    const { prelude } = await prerenderToNodeStream(<App />, {
      bootstrapScripts: ['/static/main.js']
    });

    res.setHeader('Content-Type', 'text/html');
    res.status(200);
    prelude.pipe(res);
  } catch (error) {
    console.error('レンダリングエラー:', error);
    res.status(500).send('サーバーエラー');
  }
});

app.listen(3000, () => {
  console.log('サーバーが起動しました: http://localhost:3000');
});
```

---

### 複数ページの静的生成

ビルドプロセスで複数のページを生成：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';

const pages = [
  { path: 'index.html', component: <HomePage /> },
  { path: 'about.html', component: <AboutPage /> },
  { path: 'contact.html', component: <ContactPage /> },
];

async function buildStaticSite() {
  const outputDir = './dist';
  await mkdir(outputDir, { recursive: true });

  for (const page of pages) {
    const { prelude } = await prerenderToNodeStream(page.component, {
      bootstrapScripts: ['/static/main.js']
    });

    const outputPath = path.join(outputDir, page.path);
    const outputStream = createWriteStream(outputPath);

    await pipeline(prelude, outputStream);
    console.log(`生成完了: ${page.path}`);
  }

  console.log('すべてのページの生成が完了しました');
}

buildStaticSite().catch(console.error);
```

---

### ブートストラップスクリプトの追加

デフォルトでは、React アプリは静的な HTML のみを生成します。インタラクティブにするには、クライアント側のコードをロードする必要があります。

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

async function handler(request, response) {
  const { prelude } = await prerenderToNodeStream(<App />, {
    // クライアント側のコードを含むスクリプト
    bootstrapScripts: ['/main.js'],
    // または ES モジュールを使用
    bootstrapModules: ['/main.mjs']
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
}
```

---

### インライン bootstrap スクリプトの追加

外部ファイルへのリクエストを削減するために、インラインスクリプトを含めることができます：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

async function handler(request, response) {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScriptContent: `
      console.log('アプリが読み込まれました');
      // 初期化コード
    `
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
}
```

---

### ID プレフィックスの設定

同じページに複数の React ルートがある場合、ID の競合を避けるために `identifierPrefix` を使用します：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

async function handler(request, response) {
  const { prelude } = await prerenderToNodeStream(<App />, {
    identifierPrefix: 'my-app-',
    bootstrapScripts: ['/main.js']
  });

  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
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
import { prerenderToNodeStream } from 'react-dom/static';

async function renderSVG() {
  const { prelude } = await prerenderToNodeStream(
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
  const { prelude } = await prerenderToNodeStream(
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
import { prerenderToNodeStream } from 'react-dom/static';

async function handler(request, response) {
  const nonce = generateNonce(); // nonce を生成

  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
    nonce: nonce
  });

  response.setHeader('Content-Type', 'text/html');
  response.setHeader(
    'Content-Security-Policy',
    `script-src 'nonce-${nonce}'`
  );

  prelude.pipe(response);
}
```

---

### 静的生成の中止

タイムアウトや他の理由で静的生成を中止できます：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { AbortController } from 'abort-controller';

async function handler(request, response) {
  const controller = new AbortController();

  // 10秒後にタイムアウト
  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const { prelude } = await prerenderToNodeStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js']
    });

    clearTimeout(timeout);

    response.setHeader('Content-Type', 'text/html');
    prelude.pipe(response);
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      response.status(504).send('生成がタイムアウトしました');
    } else {
      response.status(500).send('サーバーエラー');
    }
  }
}
```

---

### エラーのログ記録

サーバエラーをログに記録するには、`onError` コールバックを使用します：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

async function handler(request, response) {
  let didError = false;

  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      didError = true;
      console.error('静的生成エラー:', error);
      logErrorToService(error); // エラー追跡サービスに送信
    }
  });

  response.status(didError ? 500 : 200);
  response.setHeader('Content-Type', 'text/html');
  prelude.pipe(response);
}
```

カスタム `onError` 実装を提供する場合は、上記のように必ずコンソールにもエラーをログ記録してください。

---

## トラブルシューティング

### サスペンスが解決されない

コンポーネントがサスペンドし、Promise が決して解決されない場合、`prerenderToNodeStream` から返される Promise も決して解決されません：

```javascript
// 警告: これは決して解決されない
const promise = new Promise(() => {});

function App() {
  // このコンポーネントは決して完了しない
  const data = use(promise);
  return <div>{data}</div>;
}

// これは永久にハングする
const { prelude } = await prerenderToNodeStream(<App />);
```

これを避けるために、タイムアウトを設定してレンダリングを中止できます：

```javascript
import { AbortController } from 'abort-controller';

const controller = new AbortController();

setTimeout(() => {
  controller.abort();
}, 10000);

try {
  const { prelude } = await prerenderToNodeStream(<App />, {
    signal: controller.signal
  });
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('レンダリングがタイムアウトしました');
  }
}
```

---

### ストリームエラーの処理

ストリームの読み取り中にエラーが発生する可能性があります：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';

async function handler(request, response) {
  try {
    const { prelude } = await prerenderToNodeStream(<App />, {
      bootstrapScripts: ['/main.js']
    });

    response.setHeader('Content-Type', 'text/html');

    prelude.on('error', (error) => {
      console.error('ストリームエラー:', error);
      if (!response.headersSent) {
        response.status(500).send('サーバーエラー');
      }
    });

    prelude.pipe(response);
  } catch (error) {
    console.error('レンダリングエラー:', error);
    response.status(500).send('サーバーエラー');
  }
}
```

---

### クライアントとサーバの不一致

静的生成された HTML とクライアント側のハイドレーションで不一致が発生する場合：

1. **ID プレフィックスを確認**: サーバとクライアントで同じ `identifierPrefix` を使用していることを確認

```javascript
// サーバ
const { prelude } = await prerenderToNodeStream(<App />, {
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

### メモリリークの防止

大量のページを生成する場合、メモリリークに注意してください：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { pipeline } from 'stream/promises';

async function generateManyPages(pages) {
  for (const page of pages) {
    const { prelude } = await prerenderToNodeStream(page.component, {
      bootstrapScripts: ['/main.js']
    });

    const outputStream = createWriteStream(page.outputPath);

    // pipeline を使用してストリームを適切にクリーンアップ
    await pipeline(prelude, outputStream);

    // 各ページの生成後にガベージコレクションの機会を与える
    if (global.gc) {
      global.gc();
    }
  }
}
```

---

## ベストプラクティス

### 1. ストリームパイプラインの使用

`pipeline` を使用してエラーハンドリングを改善：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { pipeline } from 'stream/promises';

async function handler(request, response) {
  try {
    const { prelude } = await prerenderToNodeStream(<App />, {
      bootstrapScripts: ['/main.js']
    });

    response.setHeader('Content-Type', 'text/html');

    // pipeline はエラーを適切に処理
    await pipeline(prelude, response);
  } catch (error) {
    console.error('パイプラインエラー:', error);
    if (!response.headersSent) {
      response.status(500).send('サーバーエラー');
    }
  }
}
```

### 2. データを事前にロード

サスペンスを使用する場合でも、可能な限りデータを事前にロードします：

```javascript
async function generatePage(slug) {
  // データを事前にフェッチ
  const data = await fetchArticle(slug);

  const { prelude } = await prerenderToNodeStream(
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
    const { prelude } = await prerenderToNodeStream(<App />, {
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
import { AbortController } from 'abort-controller';

async function generateWithTimeout() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const { prelude } = await prerenderToNodeStream(<App />, {
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

### 5. バッチ処理の最適化

複数のページを生成する場合、並列処理を検討：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { pipeline } from 'stream/promises';
import pLimit from 'p-limit';

async function generateManyPages(pages) {
  const limit = pLimit(5); // 同時に5ページまで

  await Promise.all(
    pages.map(page =>
      limit(async () => {
        const { prelude } = await prerenderToNodeStream(page.component, {
          bootstrapScripts: ['/main.js']
        });

        const outputStream = createWriteStream(page.outputPath);
        await pipeline(prelude, outputStream);
      })
    )
  );
}
```

### 6. キャッシュの活用

同じコンテンツを複数回生成しないようにキャッシュを活用：

```javascript
import { createHash } from 'crypto';
import { existsSync, createReadStream } from 'fs';

async function generateWithCache(component, options) {
  // コンポーネントのハッシュを生成
  const hash = createHash('md5')
    .update(JSON.stringify(component))
    .digest('hex');

  const cachePath = `./cache/${hash}.html`;

  // キャッシュが存在する場合は再利用
  if (existsSync(cachePath)) {
    return createReadStream(cachePath);
  }

  // キャッシュが存在しない場合は生成
  const { prelude } = await prerenderToNodeStream(component, options);

  // キャッシュに保存
  const cacheStream = createWriteStream(cachePath);
  prelude.pipe(cacheStream);

  return prelude;
}
```

---

## 実践的な例

### 静的サイトジェネレータ

完全な静的サイトジェネレータの実装例：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';

const routes = [
  { path: '/', component: HomePage, output: 'index.html' },
  { path: '/about', component: AboutPage, output: 'about/index.html' },
  { path: '/blog', component: BlogPage, output: 'blog/index.html' },
];

async function buildSite() {
  const outputDir = './build';

  for (const route of routes) {
    console.log(`生成中: ${route.path}`);

    const { prelude } = await prerenderToNodeStream(<route.component />, {
      bootstrapScripts: ['/static/main.js'],
      onError(error) {
        console.error(`エラー (${route.path}):`, error);
      }
    });

    const outputPath = path.join(outputDir, route.output);
    const outputPathDir = path.dirname(outputPath);

    mkdirSync(outputPathDir, { recursive: true });

    const outputStream = createWriteStream(outputPath);
    await pipeline(prelude, outputStream);

    console.log(`完了: ${route.path} -> ${route.output}`);
  }

  console.log('ビルド完了!');
}

buildSite().catch(console.error);
```

### 動的ルートの処理

動的ルートのページを生成：

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { pipeline } from 'stream/promises';
import { createWriteStream, mkdirSync } from 'fs';
import path from 'path';

async function generateBlogPosts() {
  // ブログ記事のリストを取得
  const posts = await fetchAllBlogPosts();

  for (const post of posts) {
    const { prelude } = await prerenderToNodeStream(
      <BlogPost post={post} />,
      {
        bootstrapScripts: ['/static/main.js']
      }
    );

    const outputPath = path.join('./build/blog', post.slug, 'index.html');
    mkdirSync(path.dirname(outputPath), { recursive: true });

    const outputStream = createWriteStream(outputPath);
    await pipeline(prelude, outputStream);

    console.log(`生成完了: /blog/${post.slug}`);
  }
}
```

---

## 関連リソース

- [`prerender`](/reference/react-dom/static/prerender) - Web Stream 環境用の静的レンダリング
- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) - Node.js でのストリーミング SSR
- [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) - クライアント側のハイドレーション
- [`<Suspense>`](/reference/react/Suspense) - ローディング状態の管理
- [`use`](/reference/react/use) - Promise からデータを読み取る
- [Node.js ストリーム](https://nodejs.org/api/stream.html) - Node.js ストリームの公式ドキュメント
