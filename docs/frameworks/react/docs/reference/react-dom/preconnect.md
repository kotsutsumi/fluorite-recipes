# preconnect

`preconnect` は、リソースをロードする予定のサーバに事前に接続するための関数です。これにより、ページの読み込み時間を短縮できます。

## リファレンス

### `preconnect(href)`

```javascript
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect('https://example.com');
  return <App />;
}
```

## パラメータ

### `href`

接続したいサーバの URL を表す文字列。

## 返り値

`preconnect` は何も返しません。

## 使用法

### コンポーネントのレンダー時に事前接続

子コンポーネントが外部リソースをロードすることがわかっている場合、コンポーネントのレンダー時に `preconnect` を呼び出します。

```javascript
import { preconnect } from 'react-dom';

function MyComponent() {
  preconnect('https://example.com');
  return (
    <div>
      {/* このコンポーネントは example.com からリソースをロードします */}
    </div>
  );
}
```

### イベントハンドラ内での事前接続

ページやステートのトランジション前に外部リソースが必要になる場合、イベントハンドラ内で `preconnect` を呼び出すことができます。これにより、新しいページやステートをレンダーするよりも早くプロセスを開始できます。

```javascript
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('https://example.com');
    startWizard();
  };

  return (
    <button onClick={onClick}>ウィザードを開始</button>
  );
}
```

### 複数のサーバへの事前接続

複数の外部リソースを使用する場合、複数のサーバに事前接続できます。

```javascript
import { preconnect } from 'react-dom';

function AppRoot() {
  // API サーバ
  preconnect('https://api.example.com');

  // CDN
  preconnect('https://cdn.example.com');

  // 分析サーバ
  preconnect('https://analytics.example.com');

  return <App />;
}
```

### 条件付き事前接続

特定の条件下でのみリソースをロードする場合、条件付きで `preconnect` を呼び出すことができます。

```javascript
import { preconnect } from 'react-dom';

function VideoPlayer({ enableHD }) {
  if (enableHD) {
    // HD 動画サーバに事前接続
    preconnect('https://hd-video.example.com');
  } else {
    // 標準動画サーバに事前接続
    preconnect('https://video.example.com');
  }

  return <div>{/* 動画プレーヤー */}</div>;
}
```

### API リクエストの最適化

API 呼び出しが予想される場合、事前にサーバに接続できます。

```javascript
import { preconnect } from 'react-dom';

function UserProfile({ userId }) {
  // ユーザープロファイルをフェッチする前に API サーバに接続
  preconnect('https://api.example.com');

  return (
    <div>
      <ProfileData userId={userId} />
    </div>
  );
}
```

### サードパーティサービスとの統合

サードパーティのサービス（分析、広告、埋め込みコンテンツなど）を使用する場合、事前接続が役立ちます。

```javascript
import { preconnect } from 'react-dom';

function AnalyticsProvider({ children }) {
  // Google Analytics に事前接続
  preconnect('https://www.google-analytics.com');

  // カスタム分析サーバに事前接続
  preconnect('https://analytics.mycompany.com');

  return <>{children}</>;
}
```

## 重要な注意事項

### 同じサーバへの複数回の呼び出し

同じサーバに対して `preconnect` を複数回呼び出しても、1 回呼び出した場合と同じ効果しかありません。

```javascript
// これらは同じ効果を持ちます
preconnect('https://example.com');
preconnect('https://example.com');
preconnect('https://example.com');
```

### 呼び出し可能な場所

`preconnect` は、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内など、さまざまな状況で呼び出すことができます。

```javascript
import { preconnect } from 'react-dom';
import { useEffect } from 'react';

function Example() {
  // レンダー中
  preconnect('https://example.com');

  // エフェクト内
  useEffect(() => {
    preconnect('https://api.example.com');
  }, []);

  // イベントハンドラ内
  const handleClick = () => {
    preconnect('https://cdn.example.com');
  };

  return <button onClick={handleClick}>読み込む</button>;
}
```

### サーバサイドレンダリング時の動作

サーバサイドレンダリングやサーバコンポーネントのレンダー時に `preconnect` を呼び出した場合、以下の条件でのみ有効です。

- コンポーネントのレンダー中に呼び出した場合
- 非同期プロセスから派生したコンポーネントのレンダー中に呼び出した場合（例: `async/await` を使用している場合）

それ以外の場所で呼び出しても無視されます。

```javascript
// サーバコンポーネント
async function ServerComponent() {
  // これは有効
  preconnect('https://api.example.com');

  const data = await fetchData();

  return <div>{data}</div>;
}
```

### 具体的なリソースが分かっている場合

ロードする具体的なリソースが分かっている場合は、より具体的な関数を使用することを検討してください。

- スタイルシート、フォント、画像: `preload` を使用
- スクリプトやスタイルシートの実行: `preinit` を使用
- ESM モジュール: `preloadModule` または `preinitModule` を使用

```javascript
import { preload, preinit } from 'react-dom';

function MyComponent() {
  // 具体的なリソースが分かっている場合
  preload('https://example.com/font.woff2', { as: 'font' });
  preinit('https://example.com/styles.css', { as: 'style' });

  return <div>コンテンツ</div>;
}
```

### 同一オリジンへの事前接続

現在のページと同じサーバに事前接続しても利点はありません。既に接続されているためです。

```javascript
// 現在のページが https://mysite.com の場合
preconnect('https://mysite.com'); // 効果なし

// 別のサーバの場合は効果あり
preconnect('https://api.mysite.com'); // 効果あり
```

## ベストプラクティス

### 1. 重要なサードパーティリソースに使用

ページの読み込みに重要なサードパーティリソースに対して `preconnect` を使用します。

```javascript
function App() {
  // 重要な外部リソース
  preconnect('https://fonts.googleapis.com');
  preconnect('https://cdn.jsdelivr.net');

  return <MyApp />;
}
```

### 2. prefetchDNS との使い分け

確実にリソースをロードすることが分かっている場合は `preconnect` を、投機的な場合は `prefetchDNS` を使用します。

```javascript
import { preconnect, prefetchDNS } from 'react-dom';

function SearchPage() {
  // 検索結果は必ず API から取得する
  preconnect('https://api.example.com');

  // ユーザーが広告をクリックするかもしれない
  prefetchDNS('https://ads.example.com');

  return <SearchResults />;
}
```

### 3. 早期に呼び出す

リソースが必要になる前にできるだけ早く `preconnect` を呼び出します。

```javascript
// アプリケーションルートで早期に呼び出す
function App() {
  preconnect('https://api.example.com');

  return (
    <Router>
      {/* ルート定義 */}
    </Router>
  );
}
```

### 4. 過度な使用を避ける

あまりに多くのサーバに事前接続すると、ブラウザのリソースを消費し、逆効果になる可能性があります。

```javascript
// 避けるべきパターン
function BadExample() {
  preconnect('https://server1.example.com');
  preconnect('https://server2.example.com');
  preconnect('https://server3.example.com');
  preconnect('https://server4.example.com');
  preconnect('https://server5.example.com');
  // ... さらに多数
}

// 推奨パターン: 重要なものだけに絞る
function GoodExample() {
  preconnect('https://api.example.com'); // 最も重要
  preconnect('https://cdn.example.com'); // 次に重要
}
```

### 5. パフォーマンス測定

`preconnect` の効果を測定し、実際にパフォーマンスが向上しているか確認します。

```javascript
// パフォーマンスモニタリングと組み合わせる
function MonitoredApp() {
  useEffect(() => {
    const startTime = performance.now();

    preconnect('https://api.example.com');

    // リソースのロード時間を測定
    const measureLoad = () => {
      const endTime = performance.now();
      console.log('ロード時間:', endTime - startTime);
    };

    window.addEventListener('load', measureLoad);
    return () => window.removeEventListener('load', measureLoad);
  }, []);

  return <App />;
}
```

## 実践的な例

### SPA のルートプリフェッチ

```javascript
import { preconnect } from 'react-dom';
import { useRouter } from 'next/router';

function Navigation() {
  const router = useRouter();

  const handleNavigate = (path) => {
    // ナビゲーション前に API サーバに接続
    preconnect('https://api.example.com');
    router.push(path);
  };

  return (
    <nav>
      <button onClick={() => handleNavigate('/dashboard')}>
        ダッシュボード
      </button>
      <button onClick={() => handleNavigate('/profile')}>
        プロフィール
      </button>
    </nav>
  );
}
```

### 条件付きリソースロード

```javascript
import { preconnect } from 'react-dom';

function MediaGallery({ mediaType }) {
  // メディアタイプに応じて適切な CDN に接続
  useEffect(() => {
    if (mediaType === 'video') {
      preconnect('https://video-cdn.example.com');
    } else if (mediaType === 'image') {
      preconnect('https://image-cdn.example.com');
    }
  }, [mediaType]);

  return <Gallery type={mediaType} />;
}
```

### ユーザーインタラクションの予測

```javascript
import { preconnect } from 'react-dom';

function ProductCard({ product }) {
  const handleMouseEnter = () => {
    // ユーザーが製品詳細を見る可能性が高い
    preconnect('https://api.example.com');
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <h3>{product.name}</h3>
      <Link to={`/products/${product.id}`}>詳細を見る</Link>
    </div>
  );
}
```

## トラブルシューティング

### 接続が確立されない

ブラウザの開発者ツールのネットワークタブで、実際に接続が確立されているか確認します。

### パフォーマンスが向上しない

- 適切なリソースに事前接続しているか確認
- ネットワークの遅延が大きい場合に最も効果的
- ローカル開発環境では効果が見えにくい

### CORS エラー

事前接続先のサーバが CORS を適切に設定しているか確認してください。

## 関連リソース

- [prefetchDNS](/docs/frameworks/react/docs/reference/react-dom/prefetchDNS.md)
- [preload](/docs/frameworks/react/docs/reference/react-dom/preload.md)
- [preinit](/docs/frameworks/react/docs/reference/react-dom/preinit.md)
- [React DOM API](/docs/frameworks/react/docs/reference/react-dom.md)
