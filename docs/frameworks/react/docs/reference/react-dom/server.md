# サーバ用 React DOM API

`react-dom/server` の API を用いて、サーバ上で React コンポーネントを HTML にレンダーすることができます。これらの API は、アプリケーションの最上位で初期 HTML を生成するために、サーバ上でのみ使用されます。[フレームワーク](/learn/start-a-new-react-project#full-stack-frameworks)はこれらをあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

---

## 📋 API クイックリファレンス

### ストリーミング API（推奨）

| API | 環境 | 用途 | Suspense | 詳細リンク |
|-----|------|------|----------|-----------|
| `renderToPipeableStream` | Node.js | SSR | ✅ 完全サポート | [詳細](/reference/react-dom/server/renderToPipeableStream) |
| `renderToReadableStream` | Web Stream | Edge Runtime / Deno | ✅ 完全サポート | [詳細](/reference/react-dom/server/renderToReadableStream) |

### レガシー API（非推奨）

| API | 用途 | Suspense | 詳細リンク |
|-----|------|----------|-----------|
| `renderToString` | ハイドレーション可能 HTML | ⚠️ 限定的 | [詳細](/reference/react-dom/server/renderToString) |
| `renderToStaticMarkup` | 静的 HTML（非インタラクティブ） | ⚠️ 限定的 | [詳細](/reference/react-dom/server/renderToStaticMarkup) |

---

## Node.js ストリーム用のサーバ API

### renderToPipeableStream

**環境**: Node.js ストリーム対応環境

**概要**: React ツリーをパイプ可能な Node.js ストリームにレンダーします。プログレッシブストリーミングとサスペンスを完全サポート。

**主な特徴**:
- ✅ プログレッシブストリーミング
- ✅ Suspense の完全サポート
- ✅ エラーハンドリング（`onShellReady`, `onShellError`, `onError`）
- ✅ 段階的コンテンツ配信
- ✅ SEO 対応

**基本的な使用例**:

```javascript
import { renderToPipeableStream } from 'react-dom/server';

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
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

**いつ使用するか**:
- Node.js サーバー（Express、Fastify など）
- サーバサイドレンダリング（SSR）
- 大規模アプリケーション
- プログレッシブローディングが必要な場合

[詳細ドキュメント →](/reference/react-dom/server/renderToPipeableStream)

---

## Web Stream 用のサーバ API

### renderToReadableStream

**環境**: Web Stream 対応環境（Deno、Cloudflare Workers、Vercel Edge など）

**概要**: React ツリーを読み取り可能な Web Stream にレンダーします。モダンなエッジランタイムに最適。

**主な特徴**:
- ✅ Web Stream API 準拠
- ✅ Suspense の完全サポート
- ✅ エッジランタイム対応
- ✅ プログレッシブストリーミング
- ✅ 非同期データローディング

**基本的な使用例**:

```javascript
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
    }
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

**いつ使用するか**:
- Deno 環境
- Cloudflare Workers
- Vercel Edge Functions
- Web Stream をサポートするモダンエッジランタイム

[詳細ドキュメント →](/reference/react-dom/server/renderToReadableStream)

---

## 非ストリーム環境向けのレガシーサーバ API

### renderToString（レガシー）

**概要**: React ツリーを HTML 文字列にレンダーします。ハイドレーション可能ですが、ストリーミングはサポートしません。

**主な特徴**:
- ⚠️ Suspense の限定的サポート
- ⚠️ ストリーミングなし
- ✅ ハイドレーション可能
- ⚠️ ブロッキング動作

**基本的な使用例**:

```javascript
import { renderToString } from 'react-dom/server';

app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

**いつ使用するか**:
- レガシーコードのメンテナンス
- シンプルな SSR セットアップ
- ストリーミングが不要な小規模アプリ

⚠️ **注意**: 新しいプロジェクトでは `renderToPipeableStream` または `renderToReadableStream` の使用を推奨します。

[詳細ドキュメント →](/reference/react-dom/server/renderToString)

---

### renderToStaticMarkup（レガシー）

**概要**: React ツリーを静的な HTML 文字列にレンダーします。ハイドレーション不可、React 固有の属性を含みません。

**主な特徴**:
- ❌ ハイドレーション不可
- ❌ インタラクティブ性なし
- ✅ 小さい HTML サイズ
- ✅ 完全に静的なコンテンツに最適

**基本的な使用例**:

```javascript
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<EmailTemplate />);
sendEmail({ html });
```

**いつ使用するか**:
- 電子メールテンプレート
- PDF レポート生成
- RSS フィード
- OG 画像生成
- 完全に静的なコンテンツ

[詳細ドキュメント →](/reference/react-dom/server/renderToStaticMarkup)

---

## サーバ用 API の使用方法

### アプリケーション全体をサーバでレンダーする

サーバサイドレンダリング (SSR) を使用すると、サーバ上で React コンポーネントを HTML にレンダーし、初期ページロードを高速化できます。

**基本的な手順:**

1. サーバ上で React アプリケーションを HTML にレンダー
2. クライアントに HTML を送信
3. クライアント側で React がハイドレーションを実行
4. インタラクティブなアプリケーションとして動作

### ストリーミング vs 非ストリーミング

#### ストリーミング API の利点

- **段階的な配信**: コンテンツの準備ができた部分から順次送信
- **パフォーマンス向上**: 初期表示が高速化
- **Suspense のサポート**: データのローディング状態を適切に処理

推奨されるストリーミング API:
- **Node.js 環境**: `renderToPipeableStream`
- **Web Stream 環境**: `renderToReadableStream`

#### 非ストリーミング API（レガシー）

- **`renderToString`**: 全体を一度に文字列として生成
- **`renderToStaticMarkup`**: インタラクティブ性が不要な静的コンテンツ用

これらのレガシー API は、新しいプロジェクトでは推奨されません。ストリーミング API への移行を検討してください。

## サスペンスとサーバレンダリング

`<Suspense>` を使用することで、サーバレンダリング中のデータフェッチやコード分割を効率的に処理できます。

### ストリーミング API でのサスペンス

```jsx
import { Suspense } from 'react';

function App() {
  return (
    <div>
      <Header />
      <Suspense fallback={<Spinner />}>
        <MainContent />
      </Suspense>
    </div>
  );
}
```

ストリーミング API (`renderToPipeableStream` または `renderToReadableStream`) を使用すると：

1. `<Header />` が即座にレンダーされクライアントに送信される
2. `<MainContent />` のローディング中は `<Spinner />` が表示される
3. データ準備完了後、`<MainContent />` が送信される

### レガシー API でのサスペンス

`renderToString` や `renderToStaticMarkup` では：
- サスペンスのサポートが限定的
- フォールバック UI が即座に HTML として出力される
- ストリーミングの利点が得られない

## エラーハンドリング

サーバレンダリング中のエラーは、各 API のオプションでハンドリングできます：

```javascript
renderToPipeableStream(<App />, {
  onError(error) {
    console.error('サーバレンダリングエラー:', error);
    // エラーログの記録、監視サービスへの送信など
  }
});
```

## ベストプラクティス

1. **ストリーミング API を使用する**: 新しいプロジェクトでは常にストリーミング対応の API を選択
2. **Suspense を活用する**: データフェッチやコード分割でユーザー体験を向上
3. **適切なエラーハンドリング**: 本番環境でのエラーを適切にログ記録
4. **フレームワークの活用**: Next.js などのフレームワークは、これらの API を自動的に最適化
5. **ハイドレーション戦略**: クライアント側のハイドレーションを適切に計画

## 関連リソース

- [サーバコンポーネント](/reference/rsc/server-components)
- [Suspense](/reference/react/Suspense)
- [ハイドレーション](/reference/react-dom/client/hydrateRoot)
