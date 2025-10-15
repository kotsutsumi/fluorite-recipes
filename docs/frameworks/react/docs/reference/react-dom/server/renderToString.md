# renderToString

`renderToString` は React ツリーを HTML 文字列にレンダーします。

```javascript
const html = renderToString(reactNode, options?)
```

> **注意**
>
> この API のサスペンスに対するサポートは限定的です。新しいプロジェクトでは、[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)（Node.js 環境）または [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)（Web Stream 環境）の使用を検討してください。

## リファレンス

### `renderToString(reactNode, options?)`

サーバ上において、`renderToString` を呼び出してアプリを HTML にレンダーします。

```javascript
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

クライアント側では、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出して、サーバで生成された HTML をインタラクティブにします。

#### パラメータ

- **`reactNode`**: HTML にレンダーしたい React ノード。例えば、`<App />` のような JSX ノード。

- **オプション `options`**: サーバレンダー用のオプションが含まれたオブジェクト。
  - **オプション `identifierPrefix`**: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) に渡すプレフィックスと同じである必要があります。

#### 返り値

HTML 文字列。

#### 注意点

- `renderToString` の**サスペンスに対するサポートは限定的**です。コンポーネントがサスペンドすると、`renderToString` はそのフォールバックを HTML として直ちに出力します。

- `renderToString` は**ブラウザで動作します**が、クライアントコードでの使用は[推奨されません](#removing-rendertostring-from-the-client-code)。

- このメソッドは、**すべての Suspense 境界がロードされるまで待ちます**。ストリーミングの利点はありません。

## 使用法

### React ツリーを HTML として文字列にレンダーする

`renderToString` を呼び出して、サーバのレスポンスとして送信できる HTML 文字列にアプリをレンダーします：

```javascript
import { renderToString } from 'react-dom/server';

// ルートハンドラーの構文はバックエンドフレームワークによって異なる
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

これにより、React コンポーネントの非インタラクティブな初期 HTML 出力が生成されます。クライアント側では、サーバで生成された HTML をハイドレートしてインタラクティブにするために、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出す必要があります。

---

### renderToString の基本例

#### サーバ側コード

```javascript
import { renderToString } from 'react-dom/server';
import express from 'express';

const app = express();

function App() {
  return (
    <html>
      <head>
        <title>My SSR App</title>
      </head>
      <body>
        <div id="root">
          <h1>Hello from Server!</h1>
          <p>このコンテンツはサーバでレンダリングされました。</p>
        </div>
        <script src="/client.js"></script>
      </body>
    </html>
  );
}

app.get('/', (req, res) => {
  const html = renderToString(<App />);
  res.send('<!DOCTYPE html>' + html);
});

app.listen(3000);
```

#### クライアント側コード

```javascript
import { hydrateRoot } from 'react-dom/client';

function App() {
  return (
    <html>
      <head>
        <title>My SSR App</title>
      </head>
      <body>
        <div id="root">
          <h1>Hello from Server!</h1>
          <p>このコンテンツはサーバでレンダリングされました。</p>
        </div>
      </body>
    </html>
  );
}

hydrateRoot(document, <App />);
```

---

### useId で ID の競合を避ける

複数のルートがある場合、`identifierPrefix` を使用して ID の競合を避けます：

#### サーバ側

```javascript
import { renderToString } from 'react-dom/server';

function App() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>名前:</label>
      <input id={id} type="text" />
    </div>
  );
}

// 異なるセクションに異なるプレフィックスを使用
const headerHtml = renderToString(<App />, { identifierPrefix: 'header-' });
const sidebarHtml = renderToString(<App />, { identifierPrefix: 'sidebar-' });
```

#### クライアント側

```javascript
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(
  document.getElementById('header'),
  <App />,
  { identifierPrefix: 'header-' }
);

hydrateRoot(
  document.getElementById('sidebar'),
  <App />,
  { identifierPrefix: 'sidebar-' }
);
```

---

## 制限事項と代替手段

### サスペンスの制限

`renderToString` は Suspense を限定的にしかサポートしません：

```javascript
import { renderToString } from 'react-dom/server';
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <AsyncComponent />
    </Suspense>
  );
}

// AsyncComponent がサスペンドする場合、
// フォールバックが即座に HTML として出力される
const html = renderToString(<App />);
```

より良い Suspense サポートとストリーミングのためには、以下を使用してください：

#### Node.js 環境で renderToPipeableStream を使用

```javascript
import { renderToPipeableStream } from 'react-dom/server';

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/client.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    },
    onError(error) {
      console.error(error);
    }
  });
});
```

**利点:**
- プログレッシブなストリーミング
- Suspense の完全サポート
- より良いパフォーマンス
- 段階的なコンテンツ配信

#### Web Stream 環境で renderToReadableStream を使用

```javascript
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/client.js']
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

**利点:**
- Deno、Cloudflare Workers などのモダン環境対応
- ストリーミングのサポート
- Suspense の完全サポート

---

### クライアントコードから renderToString を削除する

#### 非推奨パターン（クライアント側で renderToString を使用）

```javascript
// クライアントコード - 推奨されません！
import { renderToString } from 'react-dom/server';

function MyComponent() {
  const [html, setHtml] = useState('');

  useEffect(() => {
    // これは避けるべき
    const rendered = renderToString(<SomeComponent />);
    setHtml(rendered);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

**問題点:**
- パフォーマンスの低下
- バンドルサイズの増加
- イベントリスナーが機能しない
- React の最適化が無効になる

#### 推奨パターン 1: 直接レンダリング

```javascript
// 推奨: React コンポーネントを直接使用
function MyComponent() {
  return (
    <div>
      <SomeComponent />
    </div>
  );
}
```

#### 推奨パターン 2: Portal を使用

別の DOM ノードにレンダリングする必要がある場合：

```javascript
import { createPortal } from 'react-dom';

function MyComponent() {
  const [container] = useState(() => document.createElement('div'));

  return createPortal(
    <SomeComponent />,
    container
  );
}
```

#### 推奨パターン 3: innerHTML が必要な場合

外部ライブラリとの統合などで HTML 文字列が本当に必要な場合：

```javascript
import { createRoot } from 'react-dom/client';

function getComponentHTML(Component) {
  const container = document.createElement('div');
  const root = createRoot(container);

  // 同期的にレンダリング
  root.render(<Component />);

  // コンポーネントのレンダリング後に HTML を取得
  return new Promise(resolve => {
    requestIdleCallback(() => {
      const html = container.innerHTML;
      root.unmount();
      resolve(html);
    });
  });
}

// 使用例
async function MyComponent() {
  const html = await getComponentHTML(SomeComponent);
  // html を使用
}
```

---

## renderToString vs renderToStaticMarkup

### renderToString

```javascript
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
// React 固有の属性を含む HTML
// ハイドレーション可能
```

**特徴:**
- React 固有の内部属性を含む（`data-reactroot` など）
- クライアント側でハイドレーション可能
- インタラクティブなアプリケーション用

**出力例:**

```html
<div data-reactroot="">
  <h1>Hello</h1>
</div>
```

### renderToStaticMarkup

```javascript
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<App />);
// 純粋な HTML（React 属性なし）
// ハイドレーション不可
```

**特徴:**
- React 固有の属性を含まない
- ハイドレーションできない
- より小さい HTML サイズ
- 完全に静的なコンテンツ用

**出力例:**

```html
<div>
  <h1>Hello</h1>
</div>
```

### 選択ガイド

**`renderToString` を使用する場合:**
- インタラクティブなアプリケーション
- サーバサイドレンダリング (SSR)
- クライアント側でハイドレーションが必要
- イベントハンドラーや state が必要

**`renderToStaticMarkup` を使用する場合:**
- 電子メールテンプレート
- PDF 生成
- RSS フィード
- 完全に静的なページ
- クライアント側の JavaScript が不要

**ストリーミング API を使用する場合（推奨）:**
- 新しいプロジェクト全般
- 大規模なアプリケーション
- Suspense を活用したい
- プログレッシブローディングが必要

---

## 実践例

### 基本的な SSR セットアップ

```javascript
// server.js
import express from 'express';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import path from 'path';

const app = express();
const template = fs.readFileSync(
  path.resolve('./index.html'),
  'utf-8'
);

app.get('*', (req, res) => {
  const appHtml = renderToString(<App />);

  const html = template.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`
  );

  res.send(html);
});

app.listen(3000);
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <title>SSR App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/client.js"></script>
  </body>
</html>
```

```javascript
// client.js
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

---

### データフェッチを含む SSR

```javascript
// server.js
import { renderToString } from 'react-dom/server';

async function serverRender(req, res) {
  // サーバ側でデータをフェッチ
  const data = await fetchData();

  // データをコンポーネントに渡す
  const appHtml = renderToString(<App data={data} />);

  // データをシリアライズしてクライアントに送信
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR App</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(data).replace(/</g, '\\u003c')};
        </script>
        <script src="/client.js"></script>
      </body>
    </html>
  `;

  res.send(html);
}
```

```javascript
// client.js
import { hydrateRoot } from 'react-dom/client';

// サーバから渡されたデータを取得
const initialData = window.__INITIAL_DATA__;

hydrateRoot(
  document.getElementById('root'),
  <App data={initialData} />
);
```

---

### エラーハンドリング

```javascript
import { renderToString } from 'react-dom/server';

app.get('*', (req, res) => {
  try {
    const html = renderToString(<App />);
    res.send(html);
  } catch (error) {
    console.error('レンダリングエラー:', error);

    // フォールバック HTML を送信
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body>
          <h1>問題が発生しました</h1>
          <p>後でもう一度お試しください。</p>
        </body>
      </html>
    `);
  }
});
```

---

## パフォーマンス考慮事項

### renderToString の制限

1. **ブロッキング**: 完全にレンダリングが完了するまでブロック
2. **ストリーミングなし**: 段階的な配信ができない
3. **メモリ使用量**: 大きなアプリでメモリを多く使用

### 最適化戦略

#### 1. ストリーミング API への移行

```javascript
// 代わりに renderToPipeableStream を使用
import { renderToPipeableStream } from 'react-dom/server';

app.use('/', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/client.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res);
    }
  });
});
```

#### 2. キャッシング

```javascript
import { renderToString } from 'react-dom/server';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 });

app.get('/page/:id', (req, res) => {
  const cacheKey = `page-${req.params.id}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.send(cached);
  }

  const html = renderToString(<Page id={req.params.id} />);
  cache.set(cacheKey, html);
  res.send(html);
});
```

#### 3. コンポーネント分割

```javascript
function App() {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        {/* 重要なコンテンツを先にレンダリング */}
        <Header />
        <MainContent />

        {/* 重くないコンポーネントは後で */}
        <Footer />
      </body>
    </html>
  );
}
```

---

## トラブルシューティング

### ハイドレーションの不一致

**問題:**

```
Warning: Text content did not match. Server: "..." Client: "..."
```

**原因と解決策:**

#### 1. 時刻依存のレンダリング

```javascript
// 問題のあるコード
function App() {
  return <div>{new Date().toString()}</div>;
}

// 解決策: useEffect で更新
function App() {
  const [date, setDate] = useState(null);

  useEffect(() => {
    setDate(new Date().toString());
  }, []);

  return <div>{date || 'Loading...'}</div>;
}
```

#### 2. ランダム値

```javascript
// 問題のあるコード
function App() {
  return <div>{Math.random()}</div>;
}

// 解決策: サーバから値を渡す
function App({ randomValue }) {
  return <div>{randomValue}</div>;
}
```

#### 3. ブラウザ専用 API

```javascript
// 問題のあるコード
function App() {
  const width = window.innerWidth; // サーバでエラー
  return <div>{width}</div>;
}

// 解決策: useEffect で取得
function App() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return <div>{width}</div>;
}
```

---

## ベストプラクティス

1. **新しいプロジェクトではストリーミング API を使用**: `renderToPipeableStream` または `renderToReadableStream` を優先してください。

2. **適切なエラーハンドリング**: 本番環境では、常にエラーをキャッチして適切に処理してください。

3. **データのシリアライゼーション**: サーバからクライアントにデータを渡す際は、XSS 攻撃を防ぐために適切にエスケープしてください。

4. **キャッシング戦略**: 適切なキャッシング戦略を実装して、パフォーマンスを向上させてください。

5. **ハイドレーションの一致**: サーバとクライアントで同じコンテンツがレンダリングされるようにしてください。

6. **パフォーマンス測定**: 大規模なアプリケーションでは、レンダリング時間を測定して最適化してください。

---

## まとめ

`renderToString` は以下の場合に適しています：

- レガシーコードのメンテナンス
- シンプルな SSR セットアップ
- ストリーミングが不要な場合

しかし、新しいプロジェクトでは以下を推奨します：

- **Node.js**: [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- **Web Stream**: [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)
- **静的コンテンツ**: [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup)

ストリーミング API は、より良いパフォーマンス、Suspense の完全サポート、プログレッシブローディングを提供します。

## 関連 API

- [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) - 静的な HTML の生成
- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) - Node.js 環境でのストリーミング
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) - Web Stream 環境でのストリーミング
- [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) - クライアント側のハイドレーション
- [`<Suspense>`](/reference/react/Suspense) - ローディング状態の管理
