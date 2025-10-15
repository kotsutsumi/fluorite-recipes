# クライアント用 React DOM API

`react-dom/client` の API を使用すると、クライアント（ブラウザ）で React コンポーネントをレンダーできるようになります。これらの API は通常、アプリのトップレベルで React ツリーを初期化するために使用されます。フレームワークがこれらの API を代わりに呼び出すこともあります。ほとんどのコンポーネントはこれらの API をインポートまたは使用する必要はありません。

---

## 📋 API クイックリファレンス

| API | 用途 | サーバーレンダリング | 主な使用場面 | 詳細リンク |
|-----|------|-------------------|------------|-----------|
| `createRoot` | 新規 React ルート作成 | ❌ 不要 | CSR（クライアントサイドレンダリング） | [詳細](/reference/react-dom/client/createRoot) |
| `hydrateRoot` | サーバー HTML をハイドレート | ✅ 必要 | SSR（サーバーサイドレンダリング） | [詳細](/reference/react-dom/client/hydrateRoot) |

---

## クライアント API

### createRoot

**概要**: ブラウザの DOM ノード内に React コンポーネントを表示するための新しいルートを作成します。

**用途**: クライアントサイドレンダリング（CSR）専用アプリケーション

**主な特徴**:
- ✅ 完全なクライアントサイドレンダリング
- ✅ 既存の HTML をクリア
- ✅ React 18 の新機能（Concurrent Features）をサポート
- ❌ サーバーレンダリングされた HTML には使用不可

**基本的な使用例**:

```javascript
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

**HTML ファイル**:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <!-- この div に React がレンダリングされる -->
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

**返り値**: `render()` と `unmount()` メソッドを持つルートオブジェクト

```javascript
const root = createRoot(domNode, options);
root.render(<App />);           // コンポーネントをレンダー
root.unmount();                 // ルートをアンマウント
```

**いつ使用するか**:
- 完全にクライアントサイドで動作するアプリケーション
- サーバーレンダリングを使用しない場合
- SPA（シングルページアプリケーション）
- ブラウザのみで動作するツール

⚠️ **注意**: サーバーレンダリングされた HTML がある場合は、`hydrateRoot` を使用してください。`createRoot` を使用すると、既存の HTML がすべて削除されます。

[詳細ドキュメント →](/reference/react-dom/client/createRoot)

---

### hydrateRoot

**概要**: `react-dom/server` によって事前生成された HTML コンテンツが含まれるブラウザ DOM ノード内に React コンポーネントをアタッチします。

**用途**: サーバーサイドレンダリング（SSR）アプリケーション

**主な特徴**:
- ✅ サーバー HTML を保持
- ✅ 既存の HTML にイベントリスナーをアタッチ
- ✅ ハイドレーション不一致を検出
- ✅ SEO に最適
- ⚠️ サーバーとクライアントのレンダリング結果が一致する必要あり

**基本的な使用例**:

```javascript
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

**サーバーサイド（HTML 生成）**:

```javascript
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/client.js'],
  onShellReady() {
    pipe(response);
  }
});
```

**クライアントサイド（ハイドレーション）**:

```javascript
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

**ワークフロー**:

1. **サーバー**: React コンポーネントを HTML として生成
2. **クライアントに送信**: 生成された HTML をブラウザに送信
3. **ハイドレーション**: クライアントで React を起動し、既存の HTML にイベントリスナーを追加
4. **インタラクティブ**: アプリケーションが完全にインタラクティブになる

**いつ使用するか**:
- Next.js、Remix などの SSR フレームワーク
- サーバーで HTML を事前生成する場合
- SEO が重要なアプリケーション
- 初期ロードパフォーマンスを最適化したい場合

⚠️ **重要**: サーバーとクライアントのレンダリング結果が一致する必要があります。不一致があると、ハイドレーションエラーが発生します。

[詳細ドキュメント →](/reference/react-dom/client/hydrateRoot)

---

## createRoot vs hydrateRoot の比較

| 項目 | createRoot | hydrateRoot |
|------|-----------|-------------|
| **用途** | CSR（クライアントサイドレンダリング） | SSR（サーバーサイドレンダリング） |
| **既存 HTML** | クリアして新規作成 | 保持してハイドレート |
| **サーバーレンダリング** | 不要 | 必要 |
| **初期 HTML** | 空の DOM ノード | サーバー生成 HTML |
| **SEO** | ❌ 初期 HTML なし | ✅ 初期 HTML あり |
| **初期ロード速度** | 遅い（JS 実行後） | 速い（HTML 即表示） |
| **使用場面** | SPA、ツール、ダッシュボード | 公開サイト、ブログ、EC サイト |

### 選択ガイド

**`createRoot` を使用する場合**:

```javascript
// ✅ CSR のみのアプリケーション
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

適している場合:
- 管理画面やダッシュボード
- ログイン後のアプリケーション
- SEO が不要なツール
- 単純な SPA

**`hydrateRoot` を使用する場合**:

```javascript
// ✅ SSR アプリケーション
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

適している場合:
- 公開ウェブサイト
- ブログやニュースサイト
- EC サイト
- SEO が重要なアプリケーション

---

## ブラウザサポート

React は、すべての一般的なモダンブラウザをサポートしています：

### サポート対象

- ✅ Chrome（最新版）
- ✅ Firefox（最新版）
- ✅ Safari（最新版）
- ✅ Edge（最新版）
- ⚠️ Internet Explorer 11（React 18 ではサポート終了）

### 古いブラウザ

React 18 では、Internet Explorer のサポートが終了しました。IE 11 をサポートする必要がある場合は、React 17 を使用してください。

---

## 使用上の注意事項

### 1. トップレベルでのみ使用

これらの API は、アプリケーションのエントリーポイント（通常は `index.js` や `main.js`）でのみ使用します。

```javascript
// ✅ 正しい: エントリーポイントで使用
// index.js
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```javascript
// ❌ 間違い: コンポーネント内で使用
function MyComponent() {
  const root = createRoot(document.getElementById('root')); // これはしない
  root.render(<SomeComponent />);
}
```

### 2. フレームワークが自動的に呼び出す

Next.js、Remix、Gatsby などのフレームワークを使用している場合、これらの API は自動的に呼び出されます。手動で呼び出す必要はありません。

### 3. 一度だけ呼び出す

通常、アプリケーション全体で `createRoot` または `hydrateRoot` を一度だけ呼び出します。

```javascript
// ✅ 正しい: 一度だけ
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// ❌ 間違い: 複数回呼び出さない
const root1 = createRoot(document.getElementById('root'));
const root2 = createRoot(document.getElementById('root')); // これはしない
```

---

## 実践例

### クライアントサイドレンダリング（CSR）

```javascript
// index.html
<!DOCTYPE html>
<html>
  <head>
    <title>My SPA</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

```javascript
// index.js
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### サーバーサイドレンダリング（SSR）

**サーバーコード**:

```javascript
// server.js
import { renderToPipeableStream } from 'react-dom/server';
import App from './App';

app.get('/', (req, res) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/client.js'],
    onShellReady() {
      res.setHeader('content-type', 'text/html');
      pipe(res);
    }
  });
});
```

**クライアントコード**:

```javascript
// client.js
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(document.getElementById('root'), <App />);
```

---

## トラブルシューティング

### ハイドレーションエラー

**エラー**: "Hydration failed because the server rendered HTML didn't match the client"

**原因**: サーバーとクライアントのレンダリング結果が異なる

**解決策**:
1. サーバーとクライアントで同じ props を使用
2. `Math.random()` や `Date.now()` など非決定的な値を避ける
3. ブラウザ専用 API を `useEffect` 内で使用

```javascript
// ❌ 間違い
function App() {
  return <div>{new Date().toString()}</div>;
}

// ✅ 正しい
function App() {
  const [date, setDate] = useState(null);

  useEffect(() => {
    setDate(new Date().toString());
  }, []);

  return <div>{date || 'Loading...'}</div>;
}
```

### 既存 HTML が削除される

**問題**: `createRoot` を使用すると、サーバーレンダリングされた HTML が削除される

**解決策**: サーバーレンダリングされたアプリには `hydrateRoot` を使用

```javascript
// ❌ 間違い: SSR アプリで createRoot
createRoot(document.getElementById('root')).render(<App />);

// ✅ 正しい: SSR アプリで hydrateRoot
hydrateRoot(document.getElementById('root'), <App />);
```

---

## まとめ

`react-dom/client` の API は、React アプリケーションをブラウザで起動するために使用します：

- **`createRoot`**: CSR 専用アプリケーション用
- **`hydrateRoot`**: SSR アプリケーション用

ほとんどの場合、フレームワークがこれらの API を自動的に処理するため、直接使用する必要はありません。

## 関連リソース

- [createRoot 詳細](/reference/react-dom/client/createRoot) - クライアントサイドレンダリング
- [hydrateRoot 詳細](/reference/react-dom/client/hydrateRoot) - サーバーサイドレンダリング
- [renderToPipeableStream](/reference/react-dom/server/renderToPipeableStream) - サーバー HTML 生成（Node.js）
- [renderToReadableStream](/reference/react-dom/server/renderToReadableStream) - サーバー HTML 生成（Web Stream）
