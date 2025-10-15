# lazy

`lazy` を使うことで、あるコンポーネントが初めてレンダーされるまで、そのコードの読み込みを遅延させることができます。

## リファレンス

```javascript
const SomeComponent = lazy(load)
```

### パラメータ

- **`load`**: Promise を返す関数。React は初回レンダー時まで `load` を呼び出しません。React が `load` を初めて呼び出した後、解決されるまで待ち、解決された値の `.default` を React コンポーネントとしてレンダー

### 返り値

ツリーでレンダー可能な React コンポーネントを返します。遅延コンポーネントのコードがまだ読み込まれていない間、レンダーしようとするとサスペンドします。

## 使用法

### Suspense を使ったコンポーネントの遅延読み込み

```javascript
import { lazy, Suspense } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownPreview />
    </Suspense>
  );
}
```

### 動的インポート

通常の静的インポートの代わりに動的インポートを使用します。

```javascript
// ❌ 静的インポート - すぐに読み込まれる
import MarkdownPreview from './MarkdownPreview.js';

// ✅ 動的インポート - 必要になるまで読み込まれない
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

### コード分割の利点

```javascript
import { useState, lazy, Suspense } from 'react';

const AdminPanel = lazy(() => import('./AdminPanel.js'));
const UserDashboard = lazy(() => import('./UserDashboard.js'));

function App({ isAdmin }) {
  return (
    <Suspense fallback={<Loading />}>
      {isAdmin ? <AdminPanel /> : <UserDashboard />}
    </Suspense>
  );
}
```

`isAdmin` が `true` の場合のみ、`AdminPanel` のコードが読み込まれます。

### 複数の遅延コンポーネント

```javascript
const ProfileTab = lazy(() => import('./ProfileTab.js'));
const PostsTab = lazy(() => import('./PostsTab.js'));
const PhotosTab = lazy(() => import('./PhotosTab.js'));

function Tabs({ currentTab }) {
  return (
    <Suspense fallback={<TabsGlimmer />}>
      {currentTab === 'profile' && <ProfileTab />}
      {currentTab === 'posts' && <PostsTab />}
      {currentTab === 'photos' && <PhotosTab />}
    </Suspense>
  );
}
```

## 重要な注意事項

### モジュールのトップレベルで宣言

`lazy` コンポーネントは常にモジュールのトップレベルで宣言してください。

```javascript
// ✅ 正しい: モジュールのトップレベル
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  return (
    <Suspense fallback={<Loading />}>
      <MarkdownPreview />
    </Suspense>
  );
}

// ❌ 間違い: コンポーネント内部
function Editor() {
  // これは毎レンダーで新しいコンポーネントを作成し、state がリセットされる
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  return <MarkdownPreview />;
}
```

### デフォルトエクスポートのみ

`lazy` は現在、デフォルトエクスポートされたコンポーネントのみをサポートしています。

```javascript
// MarkdownPreview.js
export default function MarkdownPreview() {
  return <div>Preview</div>;
}

// App.js
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

名前付きエクスポートを使用する場合は、中間モジュールを作成できます。

```javascript
// Components.js
export function MarkdownPreview() {
  return <div>Preview</div>;
}

// MarkdownPreview.js (中間モジュール)
export { MarkdownPreview as default } from './Components.js';

// App.js
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

### Suspense が必要

遅延コンポーネントは `<Suspense>` でラップする必要があります。

```javascript
// ✅ 正しい
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>

// ❌ 間違い: Suspense なし
<LazyComponent />
```

## トラブルシューティング

### コンポーネントの state がリセットされる

`lazy` をコンポーネント内で宣言していないか確認してください。常にモジュールのトップレベルで宣言する必要があります。

### バンドラの設定

バンドラやフレームワークが動的インポートをサポートしていることを確認してください。

## ベストプラクティス

### 意味のあるフォールバック

```javascript
<Suspense fallback={<MarkdownPreviewSkeleton />}>
  <MarkdownPreview />
</Suspense>
```

### エラーバウンダリとの組み合わせ

```javascript
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>
```

### 適切な粒度

大きすぎるコンポーネントを遅延読み込みし、小さなコンポーネントは静的にインポートします。

```javascript
// ✅ 大きなコンポーネントを遅延読み込み
const Chart = lazy(() => import('./Chart.js')); // 大きなライブラリ

// ✅ 小さなコンポーネントは静的インポート
import { Button } from './Button.js'; // 小さなコンポーネント
```

### ルートベースのコード分割

```javascript
const Home = lazy(() => import('./routes/Home.js'));
const About = lazy(() => import('./routes/About.js'));
const Contact = lazy(() => import('./routes/Contact.js'));

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```
