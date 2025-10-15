# renderToPipeableStream

`renderToPipeableStream` は React ツリーをパイプ可能な [Node.js ストリーム](https://nodejs.org/api/stream.html) にレンダーします。

```javascript
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

> **注意**
>
> この API は Node.js 専用です。Deno やモダンなエッジランタイムなどの [Web Stream](https://developer.mozilla.org/docs/Web/API/Streams_API) を用いる環境では、代わりに [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) を使用してください。

## リファレンス

### `renderToPipeableStream(reactNode, options?)`

`renderToPipeableStream` を呼び出して、React ツリーを HTML として Node.js ストリームにレンダーします。

```javascript
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

クライアント側では、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出して、サーバで生成された HTML をインタラクティブにします。

#### パラメータ

- **`reactNode`**: HTML にレンダーしたい React ノード。例えば、`<App />` のような JSX 要素。これはドキュメント全体を表すことが想定されているため、`App` コンポーネントは `<html>` タグをレンダーする必要があります。

- **オプション `options`**: ストリーミングのためのオプションを含むオブジェクト。
  - **オプション `bootstrapScriptContent`**: 指定された場合、この文字列がインライン `<script>` タグに配置されます。
  - **オプション `bootstrapScripts`**: ページに出力する `<script>` タグの URL 文字列の配列。これを使用して、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出す `<script>` を含めます。クライアントで React を全く実行したくない場合は省略してください。
  - **オプション `bootstrapModules`**: `bootstrapScripts` と同様ですが、代わりに [`<script type="module">`](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) を出力します。
  - **オプション `identifierPrefix`**: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) に渡すプレフィックスと同じである必要があります。
  - **オプション `namespaceURI`**: ストリームのルート [namespace URI](https://developer.mozilla.org/docs/Web/API/Document/createElementNS#important_namespace_uris) を含む文字列。デフォルトは通常の HTML です。SVG の場合は `'http://www.w3.org/2000/svg'`、MathML の場合は `'http://www.w3.org/1998/Math/MathML'` を渡します。
  - **オプション `nonce`**: [`script-src` Content-Security-Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) のためにスクリプトを許可する [`nonce`](http://developer.mozilla.org/docs/Web/HTML/Element/script#nonce) 文字列。
  - **オプション `onAllReady`**: [シェル](#specifying-what-goes-into-the-shell)と追加の[コンテンツ](#streaming-more-content-as-it-loads)の両方を含む、すべてのレンダリングが完了したときに発火するコールバック。[クローラーや静的生成](#waiting-for-all-content-to-load-for-crawlers-and-static-generation)のために、`onShellReady` の代わりにこれを使用できます。ここでストリーミングを開始した場合、プログレッシブローディングは得られません。ストリームには最終的な HTML が含まれます。
  - **オプション `onError`**: [回復可能](#recovering-from-errors-outside-the-shell)であるか[そうでないか](#recovering-from-errors-inside-the-shell)にかかわらず、サーバエラーが発生するたびに発火するコールバック。デフォルトでは、これは `console.error` のみを呼び出します。これをオーバーライドして[エラーレポートをログに記録する](#logging-crashes-on-the-server)場合は、`console.error` を必ず呼び出すようにしてください。また、シェルが出力される前にこれを使用して[ステータスコードを調整する](#setting-the-status-code)こともできます。
  - **オプション `onShellReady`**: [初期シェル](#specifying-what-goes-into-the-shell)がレンダーされた直後に発火するコールバック。ここで[ステータスコードを設定](#setting-the-status-code)し、`pipe` を呼び出してストリーミングを開始できます。React は、シェルの後に[追加のコンテンツをストリーム](#streaming-more-content-as-it-loads)し、`<Suspense>` 境界のローディングフォールバックを実際のコンテンツに置き換えます。
  - **オプション `onShellError`**: 初期シェルのレンダリング中にエラーが発生した場合に発火するコールバック。引数としてエラーを受け取ります。ストリームからまだバイトが出力されておらず、`onShellReady` も `onAllReady` も呼び出されないため、[フォールバック HTML シェルを出力](#recovering-from-errors-inside-the-shell)できます。
  - **オプション `progressiveChunkSize`**: チャンク内のバイト数。[デフォルトのヒューリスティックについて詳しく読む。](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)

#### 返り値

`renderToPipeableStream` は、2 つのメソッドを持つオブジェクトを返します：

- **`pipe`**: HTML を提供された [Writable Node.js ストリーム](https://nodejs.org/api/stream.html#writable-streams)に出力します。ストリーミングを有効にしたい場合は `onShellReady` で `pipe` を呼び出し、クローラーや静的生成の場合は `onAllReady` で呼び出します。
- **`abort`**: [サーバレンダリングを中止](#aborting-server-rendering)し、残りをクライアントでレンダーできるようにします。

## 使用法

### React ツリーを HTML として Node.js ストリームにレンダーする

`renderToPipeableStream` を呼び出して、React ツリーを HTML として [Node.js ストリーム](https://nodejs.org/api/stream.html#writable-streams)にレンダーします：

```javascript
import { renderToPipeableStream } from 'react-dom/server';

// ルートハンドラーの構文はバックエンドフレームワークによって異なる
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

ルートコンポーネントと共に、`<script>` タグを配置する [bootstrap スクリプト](#adding-bootstrap-scripts)のリストを提供する必要があります。ルートコンポーネントは、**ルート `<html>` タグを含むドキュメント全体を返す**必要があります。

```javascript
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css" />
        <title>My app</title>
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
<html>
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

### シェルに何が入るかを指定する

アプリの `<Suspense>` 境界の外側にある部分は、**シェル**と呼ばれます：

```javascript
function ProfilePage() {
  return (
    <ProfileLayout>
      <Suspense fallback={<ProfileGlimmerFallback />}>
        <ProfileDetails />
      </Suspense>
      <Suspense fallback={<PostsGlimmerFallback />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

これは、以下の 2 つの可能な読み込み状態のいずれかになります：

```javascript
<ProfileLayout>
  <ProfileGlimmerFallback />
  <PostsGlimmerFallback />
</ProfileLayout>
```

または：

```javascript
<ProfileLayout>
  <ProfileDetails />
  <Posts />
</ProfileLayout>
```

シェルがレンダーされると、React は HTML をストリームに書き込みます。シェルがレンダーされたら、即座にストリーミングを開始するべきです：

```javascript
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

`onShellReady` が呼び出される時点で、ネストされた `<Suspense>` 境界内のコンポーネントは、まだデータをロードしている可能性があります。

---

### ロードされるにつれてより多くのコンテンツをストリーミングする

ストリーミングにより、ユーザーはサーバ上ですべてのデータがロードされる前にコンテンツを見始めることができます。

たとえば、カバー、友達やフォトのサイドバー、投稿のリストを表示するプロフィールページを考えてみます：

```javascript
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

`<Posts />` のデータのロードに時間がかかるとします。理想的には、投稿を待たずにプロフィールページの残りのコンテンツをユーザーに表示したいです。これを行うには、[`Posts` を `<Suspense>` 境界でラップします](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)：

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

これにより、React は `Posts` がデータをロードする前に HTML のストリーミングを開始するように指示されます。React は、最初にローディングフォールバック (`PostsGlimmer`) の HTML を送信し、その後 `Posts` がデータのロードを完了すると、残りの HTML とそのローディングフォールバックをそのコンテンツに置き換えるインライン `<script>` タグを送信します。

ユーザーの視点からは、ページは最初に `PostsGlimmer` で表示され、後でそれが `Posts` に置き換えられます。

さらに[ネストされた `<Suspense>` 境界を追加](#revealing-nested-content-as-it-loads)して、より細かいローディングシーケンスを作成できます：

```javascript
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Suspense fallback={<FriendsGlimmer />}>
          <Friends />
        </Suspense>
        <Suspense fallback={<PhotosGlimmer />}>
          <Photos />
        </Suspense>
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

この例では、React はページのストリーミングをさらに早く開始できます。最初に `<ProfileLayout>` と `<ProfileCover>` のみがレンダリングを完了する必要があります。それらは `<Suspense>` 境界でラップされていないためです。ただし、`Friends`、`Photos`、または `Posts` がデータをロードする必要がある場合、React は代わりに対応するフォールバックの HTML を送信します。その後、さらにデータが利用可能になるにつれて、より多くのコンテンツが表示され続けます。

ストリーミングは、React 自体がブラウザにロードされるのを待つ必要も、アプリがインタラクティブになるのを待つ必要もありません。サーバからの HTML コンテンツは、いずれかの `<script>` タグがロードされる前に段階的に表示されます。

---

### ネストされたコンテンツがロードされるにつれて表示する

コンポーネントがサスペンドすると、React は最も近い `<Suspense>` フォールバックをレンダーします。これにより、複数の `<Suspense>` コンポーネントをネストして、ローディングシーケンスを作成できます。

各 `<Suspense>` 境界のフォールバックは、次のレベルのコンテンツが利用可能になると埋められます。例えば：

```javascript
<Suspense fallback={<BigSpinner />}>
  <Biography />
  <Suspense fallback={<AlbumsGlimmer />}>
    <Panel>
      <Albums />
    </Panel>
  </Suspense>
</Suspense>
```

この変更により、ローディングは次の順序で進みます：

1. `Biography` がまだロードされていない場合、`BigSpinner` がコンテンツ領域全体の代わりに表示されます。
2. `Biography` のロードが完了すると、`BigSpinner` が実際のコンテンツに置き換えられます。
3. `Albums` がまだロードされていない場合、`AlbumsGlimmer` が `Albums` とその親 `Panel` の代わりに表示されます。
4. 最後に、`Albums` のロードが完了すると、`AlbumsGlimmer` が置き換えられます。

---

### クローラーと静的生成のためにすべてのコンテンツのロードを待つ

ストリーミングは、コンテンツが利用可能になるとすぐにユーザーが見ることができるため、より良いユーザー体験を提供します。

ただし、クローラーがあなたのページにアクセスする場合、または静的生成の一部としてページを生成している場合は、コンテンツを段階的に表示するのではなく、最初にすべてのコンテンツをロードしてから最終的な HTML 出力を生成したい場合があります。

`onAllReady` コールバック内でストリーミングすることで、すべてのコンテンツがロードされるまで待つことができます：

```javascript
let didError = false;
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onAllReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    didError = true;
    console.error(error);
  }
});
```

通常の訪問者はストリーミングコンテンツのストリームを受け取りますが、クローラーは最終的な HTML 出力を受け取ります。

---

### サーバレンダリングを中止する

タイムアウト後にサーバレンダリングを強制的に「諦める」ことができます：

```javascript
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React は、残りのローディングフォールバックを HTML としてフラッシュし、残りをクライアントでレンダーしようとします。

---

### ステータスコードを設定する

ストリーミングにはトレードオフがあります。ユーザーがコンテンツをできるだけ早く見られるように、できるだけ早くページのストリーミングを開始したいです。ただし、ストリーミングを開始すると、レスポンスステータスコードを設定できなくなります。

[アプリをシェル](#specifying-what-goes-into-the-shell)（すべての `<Suspense>` 境界の上）と残りのコンテンツに分割することで、この問題の一部をすでに解決しています。シェルがエラーになった場合、`onShellError` コールバックが呼び出され、エラーステータスコードを設定できます。それ以外の場合、アプリはクライアントで回復する可能性があるため、「OK」を送信できます：

```javascript
let didError = false;
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>問題が発生しました</h1>');
  },
  onError(error) {
    didError = true;
    console.error(error);
  }
});
```

シェルの外側（つまり、`<Suspense>` 境界内）のコンポーネントがエラーをスローした場合、React はレンダリングを停止しません。つまり、`onError` コールバックは呼び出されますが、`onShellError` の代わりに `onShellReady` が呼び出されます。これは、React がそのエラーをクライアントで回復しようとするためです。

ただし、必要に応じて、エラーが発生したという事実を使用してステータスコードを設定できます：

```javascript
let didError = false;
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    didError = true;
    console.error(error);
  }
});
```

これは、シェルの外側で発生したエラーのみをキャッチするため、包括的ではありません。

---

### さまざまなエラーをさまざまな方法で処理する

[独自の `Error` サブクラスを作成](https://javascript.info/custom-errors)し、[`instanceof`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/instanceof) 演算子を使用して、どのエラーがスローされたかを確認できます。例えば、カスタム `NotFoundError` を定義し、コンポーネントからスローできます。その後、`onError`、`onShellReady`、および `onShellError` コールバックは、エラーのタイプに応じて異なる処理を実行できます：

```javascript
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   caughtError = error;
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>問題が発生しました</h1>');
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
  }
});
```

シェルを出力してストリーミングを開始すると、ステータスコードを変更できないことに注意してください。

---

### シェル内のエラーから回復する

この例では、シェル（`ProfileLayout`、`ProfileCover`、および `PostsGlimmer`）に `<Suspense>` 境界が含まれていません：

```javascript
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

これらのコンポーネントのレンダリング中にエラーが発生した場合、React にはクライアントに送信する意味のある HTML がありません。最後の手段として `onShellError` をオーバーライドして、サーバレンダリングに依存しないフォールバック HTML を送信します：

```javascript
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send(
      '<h1>問題が発生しました</h1>'
    );
  },
  onError(error) {
    console.error(error);
  }
});
```

シェルの生成中にエラーが発生した場合、`onError` と `onShellError` の両方が発火します。エラーレポートには `onError` を使用し、フォールバック HTML ドキュメントの送信には `onShellError` を使用します。フォールバック HTML はエラーページである必要はありません。代わりに、クライアントのみでアプリをレンダーする代替シェルを含めることができます。

---

### シェルの外側のエラーから回復する

この例では、`<Posts />` コンポーネントは `<Suspense>` でラップされているため、シェルの一部ではありません：

```javascript
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts` コンポーネントまたはその内部のどこかでエラーが発生した場合、React は[それから回復しようとします](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)：

1. 最も近い `<Suspense>` 境界 (`PostsGlimmer`) のローディングフォールバックを HTML に出力します。
2. サーバ上で `Posts` コンテンツのレンダリングを「諦め」ます。
3. JavaScript コードがクライアントにロードされると、React はクライアント上で `Posts` のレンダリングを再試行します。

クライアント上で `Posts` のレンダリングを再試行しても失敗した場合、React はクライアント上でエラーをスローします。レンダリング中にスローされたすべてのエラーと同様に、[最も近い親エラー境界](/reference/react/Component#static-getderivedstatefromerror)がユーザーへのエラーの表示方法を決定します。実際には、これはエラーが回復可能であることが確実になるまで、ユーザーにはローディングインジケーターが表示されることを意味します。

クライアント上で `Posts` のレンダリングを再試行して成功した場合、サーバからのローディングフォールバックはクライアントレンダリング出力に置き換えられます。ユーザーは、サーバエラーがあったことを知りません。ただし、サーバの `onError` コールバックとクライアントの [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) コールバックが発火するため、エラーについて通知を受けることができます。

---

### サーバ上のクラッシュをログに記録する

デフォルトでは、サーバ上のすべてのエラーがコンソールにログ記録されます。この動作をオーバーライドして、クラッシュレポートをログに記録できます：

```javascript
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

カスタム `onError` 実装を提供する場合は、上記のように必ずコンソールにもエラーをログ記録してください。

---

### クライアント上の回復可能なエラーをログに記録する

クライアント上でエラーが発生した場合、デフォルトでは、すべてのエラーが [`console.error`](https://developer.mozilla.org/docs/Web/API/console/error) にログ記録されます。この動作をオーバーライドして、回復可能なエラーをログに記録できます：

```javascript
hydrateRoot(
  document,
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(error);
      logRecoverableError(error, errorInfo.componentStack);
    }
  }
);
```

カスタム `onRecoverableError` 実装を提供する場合は、上記のように必ずコンソールにもエラーをログ記録してください。

---

## トラブルシューティング

### コンポーネントがサスペンドしたが、シェルは決して完了しなかった

コンポーネントがシェル内でサスペンドし、Promise が解決されない場合、`onShellReady` は決して呼び出されません：

```javascript
// 警告: これは決して解決されない
const promise = new Promise(() => {});

function App() {
  // このコンポーネントは決して完了しない
  use(promise);
  return <div>Hello</div>;
}
```

これが発生した場合、ページは永久にローディングしているように見えます。これを避けるために、タイムアウトを設定してレンダリングを中止できます：

```javascript
const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
  }
});

setTimeout(() => {
  abort();
}, 10000);
```

---

## ベストプラクティス

1. **適切なエラーハンドリング**: 本番環境では、すべてのエラーを適切にログ記録し、ユーザーにフレンドリーなエラーメッセージを表示します。

2. **パフォーマンスの最適化**: シェルを小さく保ち、できるだけ早くストリーミングを開始します。

3. **Suspense の戦略的な使用**: データのロードに時間がかかるコンポーネントを `<Suspense>` でラップします。

4. **タイムアウトの設定**: 無限にハングすることを防ぐために、適切なタイムアウトを設定します。

5. **ステータスコードの管理**: クローラーや SEO のために、適切な HTTP ステータスコードを返します。
