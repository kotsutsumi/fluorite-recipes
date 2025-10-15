# 静的サイト用 React DOM API

`react-dom/static` の API を用いて、React コンポーネントを静的な HTML にレンダーすることができます。これらの API はストリーミング API よりも機能が限られています。[フレームワーク](/learn/start-a-new-react-project#full-stack-frameworks)がこれらをあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

---

## Web ストリーム用の静的 API

以下のメソッドは、[Web Stream](https://developer.mozilla.org/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます。

- [`prerender`](/reference/react-dom/static/prerender) は React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/docs/Web/API/ReadableStream) を用いて静的な HTML にレンダーします。

---

## Node.js ストリーム用の静的 API

以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます。

- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) は React ツリーを [Node.js ストリーム](https://nodejs.org/api/stream.html)を用いて静的な HTML にレンダーします。

---

## 静的 API とサーバ API の違い

静的サイト生成 (SSG) のための `react-dom/static` API は、サーバサイドレンダリング (SSR) のための `react-dom/server` API とは異なります。

### 静的 API (`react-dom/static`)

- **用途**: 静的サイト生成 (SSG)
- **特徴**:
  - すべてのサスペンス境界が完了するまで待機
  - データのロードが完了するまでレンダリングを待つ
  - プログレッシブストリーミングなし
  - ビルド時に HTML を生成する用途に最適

### サーバ API (`react-dom/server`)

- **用途**: サーバサイドレンダリング (SSR)
- **特徴**:
  - プログレッシブストリーミングをサポート
  - サスペンス境界を段階的にレンダー
  - リクエスト時に HTML を生成
  - より良いユーザー体験のための段階的ロード

---

## 使用例

### Web Stream での静的生成

```javascript
import { prerender } from 'react-dom/static';

async function generateStaticPage() {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });

  // ストリームを文字列に変換
  const chunks = [];
  const reader = prelude.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const html = new TextDecoder().decode(
    new Uint8Array(chunks.flat())
  );

  return html;
}
```

### Node.js Stream での静的生成

```javascript
import { prerenderToNodeStream } from 'react-dom/static';
import { writeFile } from 'fs/promises';

async function generateStaticPage() {
  const { prelude } = await prerenderToNodeStream(<App />, {
    bootstrapScripts: ['/main.js']
  });

  const chunks = [];

  for await (const chunk of prelude) {
    chunks.push(chunk);
  }

  const html = Buffer.concat(chunks).toString('utf-8');
  await writeFile('output.html', html);
}
```

---

## いつ静的 API を使用するか

### 静的 API が適している場合

- **静的サイトジェネレータ**: Next.js の `getStaticProps`、Gatsby など
- **ビルド時の HTML 生成**: CI/CD パイプラインでの事前レンダリング
- **SEO 重視のページ**: クローラーに完全な HTML を提供
- **データが頻繁に変更されないページ**: ブログ記事、ドキュメントなど

### サーバ API が適している場合

- **動的コンテンツ**: ユーザー固有のデータを表示
- **リアルタイム更新**: 頻繁に変更されるデータ
- **ストリーミングが必要**: 段階的なページ表示
- **サーバサイドレンダリング**: リクエストごとに HTML を生成

---

## ベストプラクティス

### 1. フレームワークの機能を活用

ほとんどの場合、React ベースのフレームワークがこれらの API を自動的に処理します。

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

### 2. エラーハンドリング

静的生成時のエラーは適切に処理してください。

```javascript
import { prerender } from 'react-dom/static';

async function generateWithErrorHandling() {
  try {
    const { prelude } = await prerender(<App />, {
      onError(error) {
        console.error('Static generation error:', error);
        // エラーをログに記録
      }
    });
    return prelude;
  } catch (error) {
    console.error('Fatal error:', error);
    throw error;
  }
}
```

### 3. データのプリロード

静的生成前にすべてのデータをプリロードしてください。

```javascript
async function StaticPage({ data }) {
  // データは既にロード済み
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    </div>
  );
}

async function generatePage() {
  // データを事前にフェッチ
  const data = await fetchData();

  const { prelude } = await prerender(
    <StaticPage data={data} />,
    { bootstrapScripts: ['/main.js'] }
  );

  return prelude;
}
```

### 4. パフォーマンスの最適化

不要なリソースの読み込みを避けてください。

```javascript
const { prelude } = await prerender(<App />, {
  bootstrapScripts: ['/main.js'],
  bootstrapModules: ['/app.mjs'],
  // 必要最小限のスクリプトのみを含める
});
```

---

## トラブルシューティング

### サスペンスが解決しない

静的生成では、すべてのサスペンス境界が解決されるまで待機します。解決しないサスペンスがある場合、生成が完了しません。

```javascript
function ProblematicComponent() {
  // 悪い例: 決して解決しない Promise
  const data = use(new Promise(() => {}));
  return <div>{data}</div>;
}

function FixedComponent({ data }) {
  // 良い例: データは既にロード済み
  return <div>{data}</div>;
}
```

### メモリ使用量が多い

大量のページを生成する場合、メモリ使用量に注意してください。

```javascript
async function generateManyPages(pages) {
  for (const page of pages) {
    const { prelude } = await prerender(page.component);
    await saveToFile(prelude, page.path);
    // 各ページの生成後にガベージコレクションの機会を与える
  }
}
```

---

## 関連リソース

- [`prerender`](/reference/react-dom/static/prerender) - Web Stream を使用した静的レンダリング
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) - Node.js Stream を使用した静的レンダリング
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) - サーバサイドストリーミング
- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) - Node.js でのサーバサイドストリーミング
- [Suspense](/reference/react/Suspense) - ローディング状態の管理
