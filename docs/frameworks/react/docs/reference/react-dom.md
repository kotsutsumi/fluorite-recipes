# react-dom

`react-dom` パッケージは、ウェブアプリケーション(ブラウザの DOM 環境で実行されるアプリケーション)専用のメソッドを提供します。React Native では使用されません。

---

## 📋 クイックナビゲーション

| セクション | 概要 | 詳細リンク |
|----------|------|-----------|
| **クライアント API** | ブラウザでの React レンダリング | [client.md](./react-dom/client.md) |
| **サーバ API** | サーバサイドレンダリング (SSR) | [server.md](./react-dom/server.md) |
| **静的 API** | 静的サイト生成 (SSG) | [static.md](./react-dom/static.md) |
| **フック** | ブラウザ DOM 専用フック | [hooks.md](./react-dom/hooks.md) |
| **コンポーネント** | HTML/SVG 組み込みコンポーネント | [components.md](./react-dom/components.md) |

---

## react-dom パッケージの構成

### 1. クライアント API (`react-dom/client`)

ブラウザで React アプリケーションをレンダリングするための API です。

#### 主要 API

| API | 用途 | 使用場面 |
|-----|------|----------|
| `createRoot` | CSR 専用ルートの作成 | クライアントサイドレンダリング |
| `hydrateRoot` | SSR HTML のハイドレーション | サーバサイドレンダリング |

**使用例:**

```javascript
import { createRoot } from 'react-dom/client';

// CSR (クライアントサイドレンダリング)
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

[詳細ドキュメント → client.md](./react-dom/client.md)

---

### 2. サーバ API (`react-dom/server`)

サーバ上で React コンポーネントを HTML にレンダーするための API です。

#### ストリーミング API (推奨)

| API | 環境 | Suspense サポート |
|-----|------|------------------|
| `renderToPipeableStream` | Node.js | ✅ 完全サポート |
| `renderToReadableStream` | Web Stream (Deno, Edge) | ✅ 完全サポート |

#### レガシー API

| API | Suspense サポート | 推奨度 |
|-----|------------------|--------|
| `renderToString` | ⚠️ 限定的 | レガシー |
| `renderToStaticMarkup` | ⚠️ 限定的 | 静的コンテンツのみ |

**使用例:**

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

[詳細ドキュメント → server.md](./react-dom/server.md)

---

### 3. 静的 API (`react-dom/static`)

静的サイト生成 (SSG) のための API です。すべてのサスペンス境界が解決されるまで待機します。

#### 静的生成 API

| API | 環境 | 用途 |
|-----|------|------|
| `prerender` | Web Stream | ビルド時の HTML 生成 |
| `prerenderToNodeStream` | Node.js Stream | ビルド時の HTML 生成 |

**SSR との違い:**
- ✅ すべてのサスペンス境界が完了するまで待機
- ✅ データのロードが完了するまでレンダリングを待つ
- ❌ プログレッシブストリーミングなし

[詳細ドキュメント → static.md](./react-dom/static.md)

---

### 4. ブラウザ DOM フック (`react-dom/hooks`)

ブラウザ DOM 環境専用のフックです。

#### 利用可能なフック

| フック | 用途 | 主な機能 |
|--------|------|----------|
| `useFormStatus` | フォーム送信状態の追跡 | pending、data、method、action の取得 |

**使用例:**

```javascript
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

[詳細ドキュメント → hooks.md](./react-dom/hooks.md)

---

### 5. 組み込みコンポーネント (`react-dom/components`)

すべての HTML と SVG 要素のサポート、フォームコンポーネント、リソース管理コンポーネントを提供します。

#### コンポーネントカテゴリ

| カテゴリ | 主なコンポーネント | 詳細 |
|---------|-------------------|------|
| **フォーム** | `<input>`, `<select>`, `<textarea>`, `<form>` | 制御/非制御コンポーネント |
| **リソース** | `<link>`, `<meta>`, `<script>`, `<style>`, `<title>` | 自動的に `<head>` に配置 |
| **HTML** | すべての HTML 要素 | 標準 HTML 要素 |
| **SVG** | すべての SVG 要素 | ベクターグラフィックス |

**重要な特徴:**
- `<title>`, `<meta>`, `<link>` などは自動的にドキュメントの `<head>` に配置されます
- すべての要素で `ref`, `className`, `style`, `dangerouslySetInnerHTML` などが使用可能

[詳細ドキュメント → components.md](./react-dom/components.md)

---

## トップレベル API

### DOM ユーティリティ

#### `createPortal`

DOM ツリーの別の場所に子コンポーネントをレンダーします。

```javascript
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.body
  );
}
```

[詳細ドキュメント →](./react-dom/createPortal.md)

#### `flushSync`

state の更新を強制的にフラッシュし、DOM を同期的に更新します。

```javascript
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount(count + 1);
  });
  // この時点で DOM は更新されています
}
```

⚠️ **注意**: パフォーマンスに影響するため、必要な場合にのみ使用してください。

[詳細ドキュメント →](./react-dom/flushSync.md)

---

### リソースプリロード API

これらの API を使用すると、スタイルシート、フォント、外部スクリプトなどのリソースを事前にロードすることでアプリを高速化できます。

#### DNS とサーバー接続

| API | 用途 | 詳細リンク |
|-----|------|-----------|
| `prefetchDNS` | DNS ドメインの IP アドレスを事前にフェッチ | [詳細](./react-dom/prefetchDNS.md) |
| `preconnect` | サーバへの事前接続 | [詳細](./react-dom/preconnect.md) |

#### リソースのプリロード

| API | 用途 | 詳細リンク |
|-----|------|-----------|
| `preload` | スタイルシート、フォント、画像、外部スクリプトをフェッチ | [詳細](./react-dom/preload.md) |
| `preloadModule` | ESM モジュールをフェッチ | [詳細](./react-dom/preloadModule.md) |

#### リソースの初期化

| API | 用途 | 詳細リンク |
|-----|------|-----------|
| `preinit` | スクリプトまたはスタイルシートをフェッチして実行 | [詳細](./react-dom/preinit.md) |
| `preinitModule` | ESM モジュールをフェッチして実行 | [詳細](./react-dom/preinitModule.md) |

**使用例:**

```javascript
import {
  prefetchDNS,
  preconnect,
  preload,
  preinit
} from 'react-dom';

function AppRoot() {
  // DNS を事前にフェッチ
  prefetchDNS('https://cdn.example.com');

  // サーバに事前接続
  preconnect('https://cdn.example.com');

  // フォントを事前にロード
  preload('https://cdn.example.com/font.woff2', { as: 'font' });

  // スタイルシートを事前に初期化
  preinit('https://cdn.example.com/styles.css', { as: 'style' });

  return <App />;
}
```

---

## React 19 で削除された API

以下の API は React 19 で削除されました。代替手段を使用してください。

### 削除されたクライアント API

| 削除された API | 代替手段 |
|--------------|---------|
| `findDOMNode` | ref を使用 |
| `hydrate` | `hydrateRoot` |
| `render` | `createRoot` |
| `unmountComponentAtNode` | `root.unmount()` |

### 削除されたサーバ API

| 削除された API | 代替手段 |
|--------------|---------|
| `renderToNodeStream` | `renderToPipeableStream` |
| `renderToStaticNodeStream` | `renderToPipeableStream` |

---

## 使用パターン

### クライアントサイドレンダリング (CSR)

```javascript
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### サーバサイドレンダリング (SSR)

**サーバ側:**

```javascript
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/client.js'],
  onShellReady() {
    pipe(response);
  }
});
```

**クライアント側:**

```javascript
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

### 静的サイト生成 (SSG)

```javascript
import { prerender } from 'react-dom/static';

async function generateStaticPage() {
  const { prelude } = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });

  // ストリームを HTML として保存
  return prelude;
}
```

---

## ベストプラクティス

### 1. フレームワークの活用

Next.js、Remix などのフレームワークを使用している場合、多くの API は自動的に処理されます。

### 2. リソースプリロードの戦略的使用

重要なリソースを事前にロードして、初期ページロード時間を短縮します:

```javascript
// 重要なフォントを事前にロード
preload('/fonts/main.woff2', { as: 'font', type: 'font/woff2' });

// 重要な CSS を事前に初期化
preinit('/styles/critical.css', { as: 'style' });
```

### 3. ポータルの適切な使用

モーダル、トースト、ツールチップなどのオーバーレイコンポーネントにはポータルを使用します。

### 4. `flushSync` の慎重な使用

`flushSync` はパフォーマンスに影響を与えるため、以下の場合にのみ使用します:
- スクロール位置の制御が必要な場合
- サードパーティライブラリとの統合で同期的な DOM 更新が必要な場合

### 5. 最新の API の使用

削除された API ではなく、常に最新の推奨 API を使用してください。

---

## パフォーマンス最適化

### ストリーミングの利用

サーバサイドレンダリングでは、ストリーミング API を使用してパフォーマンスを向上させます:

```javascript
import { renderToPipeableStream } from 'react-dom/server';
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

// Header は即座に送信され、MainContent は準備完了後に送信される
```

### リソースヒントの最適化

```javascript
// 優先度の高いリソースから順に設定
preconnect('https://api.example.com'); // 最優先
prefetchDNS('https://cdn.example.com'); // 次に優先
preload('/fonts/main.woff2', { as: 'font' }); // 重要なアセット
```

---

## トラブルシューティング

### ハイドレーションエラー

**問題**: サーバとクライアントのレンダリング結果が異なる

**解決策**:
- サーバとクライアントで同じ props を使用
- `Math.random()` や `Date.now()` など非決定的な値を避ける
- ブラウザ専用 API は `useEffect` 内で使用

### 既存 HTML が削除される

**問題**: `createRoot` を使用すると SSR の HTML が削除される

**解決策**: サーバレンダリングされたアプリには `hydrateRoot` を使用

---

## 関連リソース

### 主要ドキュメント

- [クライアント API](./react-dom/client.md) - ブラウザでのレンダリング
- [サーバ API](./react-dom/server.md) - サーバサイドレンダリング
- [静的 API](./react-dom/static.md) - 静的サイト生成
- [フック](./react-dom/hooks.md) - DOM 専用フック
- [コンポーネント](./react-dom/components.md) - HTML/SVG 要素

### 個別 API ドキュメント

- [createPortal](./react-dom/createPortal.md)
- [flushSync](./react-dom/flushSync.md)
- [preload](./react-dom/preload.md)
- [preinit](./react-dom/preinit.md)
- [preconnect](./react-dom/preconnect.md)
- [prefetchDNS](./react-dom/prefetchDNS.md)
- [preinitModule](./react-dom/preinitModule.md)
- [preloadModule](./react-dom/preloadModule.md)
