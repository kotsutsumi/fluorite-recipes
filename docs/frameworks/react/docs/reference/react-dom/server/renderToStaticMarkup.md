# renderToStaticMarkup

`renderToStaticMarkup` は、非インタラクティブな React ツリーを HTML 文字列にレンダーします。

```javascript
const html = renderToStaticMarkup(reactNode, options?)
```

> **注意**
>
> この API のサスペンスに対するサポートは限定的です。新しいプロジェクトでは、[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)（Node.js 環境）または [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)（Web Stream 環境）の使用を検討してください。

## リファレンス

### `renderToStaticMarkup(reactNode, options?)`

サーバ上において、`renderToStaticMarkup` を呼び出してアプリを HTML にレンダーします。

```javascript
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

非インタラクティブな HTML 出力を生成します。

#### パラメータ

- **`reactNode`**: HTML にレンダーしたい React ノード。例えば、`<Page />` のような JSX ノード。

- **オプション `options`**: サーバレンダー用のオプションが含まれたオブジェクト。
  - **オプション `identifierPrefix`**: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。

#### 返り値

HTML 文字列。

#### 注意点

- `renderToStaticMarkup` の出力に対して**ハイドレーションは行えません**。これにより、クライアント上でアプリケーションをインタラクティブにすることはできません。

- `renderToStaticMarkup` の**サスペンスに対するサポートは限定的**です。コンポーネントがサスペンドすると、`renderToStaticMarkup` はそのフォールバックを HTML として直ちに出力します。

- `renderToStaticMarkup` は**ブラウザで動作します**が、クライアントコードでの使用は推奨されません。ブラウザで HTML にコンポーネントをレンダーする必要がある場合は、[DOM ノードに HTML を取得する](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)ことで実現できます。

## 使用法

### 非インタラクティブな React ツリーを HTML として文字列にレンダーする

`renderToStaticMarkup` を呼び出して、サーバのレスポンスとして送信できる HTML 文字列にアプリをレンダーします：

```javascript
import { renderToStaticMarkup } from 'react-dom/server';

// ルートハンドラーの構文はバックエンドフレームワークによって異なる
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

これにより、React コンポーネントの非インタラクティブな初期 HTML 出力が生成されます。

> **注意**
>
> このメソッドは、**ハイドレートできない非インタラクティブな HTML** をレンダーします。これは、React を単純な静的ページジェネレーターとして使用したい場合、または電子メールのような完全に静的なコンテンツをレンダーする場合に役立ちます。
>
> インタラクティブなアプリは、サーバ上で [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) または [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) を使用し、クライアント上で [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を使用する必要があります。

---

### renderToStaticMarkup の使用例

#### 静的な電子メールテンプレート

電子メールの HTML を生成するために `renderToStaticMarkup` を使用できます：

```javascript
import { renderToStaticMarkup } from 'react-dom/server';

function EmailTemplate({ userName, resetLink }) {
  return (
    <html>
      <body>
        <h1>パスワードのリセット</h1>
        <p>こんにちは、{userName}さん</p>
        <p>以下のリンクをクリックしてパスワードをリセットしてください：</p>
        <a href={resetLink}>パスワードをリセット</a>
      </body>
    </html>
  );
}

function sendPasswordResetEmail(userEmail, userName, resetLink) {
  const emailHtml = renderToStaticMarkup(
    <EmailTemplate userName={userName} resetLink={resetLink} />
  );

  // メール送信サービスを使用して HTML を送信
  mailService.send({
    to: userEmail,
    subject: 'パスワードのリセット',
    html: emailHtml
  });
}
```

#### 静的サイトジェネレーター

静的な HTML ページを生成するために使用できます：

```javascript
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'fs';

function BlogPost({ title, content, author }) {
  return (
    <html>
      <head>
        <title>{title}</title>
        <meta name="author" content={author} />
      </head>
      <body>
        <article>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <footer>著者: {author}</footer>
        </article>
      </body>
    </html>
  );
}

function generateStaticBlogPost(post) {
  const html = renderToStaticMarkup(
    <BlogPost
      title={post.title}
      content={post.content}
      author={post.author}
    />
  );

  const fullHtml = '<!DOCTYPE html>' + html;
  fs.writeFileSync(`./build/${post.slug}.html`, fullHtml);
}
```

#### PDF レポート生成

PDF 生成ライブラリに HTML を提供するために使用できます：

```javascript
import { renderToStaticMarkup } from 'react-dom/server';
import puppeteer from 'puppeteer';

function InvoiceTemplate({ invoiceNumber, items, total }) {
  return (
    <html>
      <head>
        <style>{`
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
        `}</style>
      </head>
      <body>
        <h1>請求書 #{invoiceNumber}</h1>
        <table>
          <thead>
            <tr>
              <th>商品名</th>
              <th>数量</th>
              <th>価格</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>¥{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>合計: ¥{total}</h2>
      </body>
    </html>
  );
}

async function generateInvoicePDF(invoiceData) {
  const html = renderToStaticMarkup(<InvoiceTemplate {...invoiceData} />);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent('<!DOCTYPE html>' + html);
  await page.pdf({ path: 'invoice.pdf', format: 'A4' });
  await browser.close();
}
```

---

## renderToString との違い

`renderToStaticMarkup` と [`renderToString`](/reference/react-dom/server/renderToString) は似ていますが、重要な違いがあります：

### renderToStaticMarkup

```javascript
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<App />);
// React 固有の属性なしの純粋な HTML
```

**特徴:**
- React 固有の内部属性（`data-reactroot` など）を含まない
- ハイドレーションできない
- より小さい HTML サイズ
- 完全に静的なコンテンツ用

### renderToString

```javascript
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
// React 固有の属性を含む HTML
```

**特徴:**
- React 固有の内部属性を含む
- クライアント側でハイドレーション可能
- より大きい HTML サイズ
- インタラクティブなアプリケーション用

### 選択ガイド

**`renderToStaticMarkup` を使用する場合:**
- 電子メールテンプレート
- PDF 生成
- RSS フィード
- OG 画像
- 完全に静的なページ
- クライアント側の JavaScript が不要な場合

**`renderToString` を使用する場合:**
- インタラクティブなアプリケーション
- サーバサイドレンダリング (SSR) とハイドレーション
- SEO が必要でインタラクティブ性も必要な場合

**ストリーミング API を使用する場合（推奨）:**
- 新しいプロジェクト
- 大規模なアプリケーション
- プログレッシブローディングが必要
- Suspense を活用したい場合

---

## 制限事項

### サスペンスのサポート

`renderToStaticMarkup` は Suspense を限定的にしかサポートしません：

```javascript
import { renderToStaticMarkup } from 'react-dom/server';
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
const html = renderToStaticMarkup(<App />);
```

より良い Suspense サポートのためには、ストリーミング API を使用してください：
- Node.js: [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- Web Stream: [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)

### ハイドレーション不可

`renderToStaticMarkup` で生成された HTML は、クライアント側でハイドレートできません：

```javascript
// サーバ
const html = renderToStaticMarkup(<App />);

// クライアント - これは動作しません！
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document, <App />); // エラーまたは予期しない動作
```

ハイドレーションが必要な場合は、以下を使用してください：
- サーバ: [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) または [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream)
- クライアント: [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)

### ストリーミングなし

`renderToStaticMarkup` は同期的に動作し、完全な HTML 文字列を一度に返します：

```javascript
// 全体が一度に生成される
const html = renderToStaticMarkup(<LargeApp />);
```

大規模なアプリケーションやプログレッシブローディングが必要な場合は、ストリーミング API を使用してください。

---

## エラーハンドリング

`renderToStaticMarkup` はエラー時に例外をスローします：

```javascript
import { renderToStaticMarkup } from 'react-dom/server';

try {
  const html = renderToStaticMarkup(<App />);
  // HTML を使用
} catch (error) {
  console.error('レンダリングエラー:', error);
  // フォールバック HTML を提供
  const fallbackHtml = '<h1>問題が発生しました</h1>';
}
```

### カスタムエラーハンドリング

```javascript
function safeRenderToStaticMarkup(component, fallback = '<div>エラー</div>') {
  try {
    return renderToStaticMarkup(component);
  } catch (error) {
    console.error('レンダリング失敗:', error);
    logError(error);
    return fallback;
  }
}

const html = safeRenderToStaticMarkup(<App />, '<h1>一時的に利用できません</h1>');
```

---

## ベストプラクティス

1. **適切なユースケース**: `renderToStaticMarkup` は、完全に静的なコンテンツにのみ使用してください。インタラクティブなアプリには適していません。

2. **DOCTYPE の追加**: HTML ドキュメントを生成する場合は、DOCTYPE を追加してください：
   ```javascript
   const html = '<!DOCTYPE html>' + renderToStaticMarkup(<App />);
   ```

3. **エラーハンドリング**: 本番環境では、常に try-catch でラップして、エラーを適切に処理してください。

4. **パフォーマンス**: 大規模なコンテンツの場合は、ストリーミング API の使用を検討してください。

5. **セキュリティ**: ユーザー入力を含める場合は、XSS 攻撃を防ぐために適切にエスケープしてください。

6. **移行計画**: 新しいプロジェクトでは、最初からストリーミング API の使用を検討してください。

---

## 代替手段

### インタラクティブなアプリケーション

インタラクティブなアプリケーションには、ストリーミング API を使用してください：

#### Node.js 環境

```javascript
import { renderToPipeableStream } from 'react-dom/server';

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

#### Web Stream 環境

```javascript
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

### クライアント側のレンダリング

ブラウザで HTML を生成する必要がある場合：

```javascript
import { createRoot } from 'react-dom/client';

const container = document.createElement('div');
const root = createRoot(container);
root.render(<App />);

// HTML を取得
const html = container.innerHTML;
```

---

## まとめ

`renderToStaticMarkup` は以下の場合に適しています：

- 電子メールテンプレート
- PDF レポート
- RSS フィード
- 静的サイト生成
- OG 画像
- 完全に静的なコンテンツ

インタラクティブなアプリケーションや、Suspense を活用したい場合は、[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) または [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) を使用してください。

## 関連 API

- [`renderToString`](/reference/react-dom/server/renderToString) - ハイドレーション可能な HTML の生成
- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) - Node.js 環境でのストリーミング
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) - Web Stream 環境でのストリーミング
- [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) - クライアント側のハイドレーション
