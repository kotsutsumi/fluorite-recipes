# prefetchDNS

`prefetchDNS` は、リソースをロードする予定のサーバの IP アドレスを事前に検索するための関数です。DNS ルックアップを早期に実行することで、ページの読み込み時間を短縮できます。

## リファレンス

### `prefetchDNS(href)`

```javascript
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS('https://example.com');
  return <App />;
}
```

## パラメータ

### `href`

接続したいサーバの URL を表す文字列。

## 返り値

`prefetchDNS` は何も返しません。

## 使用法

### コンポーネントのレンダー時に DNS をプリフェッチ

子コンポーネントが外部リソースをロードすることがわかっている場合、コンポーネントのレンダー時に `prefetchDNS` を呼び出します。

```javascript
import { prefetchDNS } from 'react-dom';

function MyComponent() {
  prefetchDNS('https://example.com');
  return (
    <div>
      {/* このコンポーネントは example.com からリソースをロードする可能性があります */}
    </div>
  );
}
```

### イベントハンドラ内での DNS プリフェッチ

ページやステートのトランジション前に外部リソースが必要になる可能性がある場合、イベントハンドラ内で `prefetchDNS` を呼び出すことができます。

```javascript
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('https://example.com');
    startWizard();
  };

  return (
    <button onClick={onClick}>ウィザードを開始</button>
  );
}
```

### 複数のドメインの DNS プリフェッチ

複数の外部リソースを使用する可能性がある場合、複数のドメインの DNS をプリフェッチできます。

```javascript
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  // 複数のドメインの DNS をプリフェッチ
  prefetchDNS('https://api.example.com');
  prefetchDNS('https://cdn.example.com');
  prefetchDNS('https://analytics.example.com');
  prefetchDNS('https://ads.example.com');

  return <App />;
}
```

### 投機的な DNS プリフェッチ

ユーザーが特定のアクションを実行する可能性がある場合、投機的に DNS をプリフェッチできます。

```javascript
import { prefetchDNS } from 'react-dom';

function SearchComponent() {
  const handleInputFocus = () => {
    // ユーザーが検索を実行する可能性がある
    prefetchDNS('https://search-api.example.com');
  };

  return (
    <input
      type="search"
      onFocus={handleInputFocus}
      placeholder="検索..."
    />
  );
}
```

### サードパーティサービスの DNS プリフェッチ

サードパーティのサービス（分析、広告、ソーシャルメディアウィジェットなど）のドメインを事前に解決できます。

```javascript
import { prefetchDNS } from 'react-dom';

function ThirdPartyIntegration() {
  // ソーシャルメディアウィジェット
  prefetchDNS('https://platform.twitter.com');
  prefetchDNS('https://connect.facebook.net');

  // 広告サービス
  prefetchDNS('https://googleads.g.doubleclick.net');

  // 分析
  prefetchDNS('https://www.google-analytics.com');

  return <div>{/* コンテンツ */}</div>;
}
```

### 条件付き DNS プリフェッチ

特定の条件下でのみリソースをロードする場合、条件付きで `prefetchDNS` を呼び出すことができます。

```javascript
import { prefetchDNS } from 'react-dom';

function UserDashboard({ user }) {
  // プレミアムユーザーのみが追加機能を使用
  if (user.isPremium) {
    prefetchDNS('https://premium-api.example.com');
  }

  return <Dashboard user={user} />;
}
```

### ページ遷移前の DNS プリフェッチ

```javascript
import { prefetchDNS } from 'react-dom';
import { useRouter } from 'next/router';

function Navigation() {
  const router = useRouter();

  const handleNavigate = (path, apiDomain) => {
    // ページ遷移前に API ドメインの DNS を解決
    prefetchDNS(apiDomain);
    router.push(path);
  };

  return (
    <nav>
      <button onClick={() => handleNavigate('/users', 'https://users-api.example.com')}>
        ユーザー
      </button>
      <button onClick={() => handleNavigate('/products', 'https://products-api.example.com')}>
        製品
      </button>
    </nav>
  );
}
```

## 重要な注意事項

### 同じサーバへの複数回の呼び出し

同じサーバに対して `prefetchDNS` を複数回呼び出しても、1 回呼び出した場合と同じ効果しかありません。

```javascript
// これらは同じ効果を持ちます
prefetchDNS('https://example.com');
prefetchDNS('https://example.com');
prefetchDNS('https://example.com');
```

### 呼び出し可能な場所

`prefetchDNS` は、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内など、さまざまな状況で呼び出すことができます。

```javascript
import { prefetchDNS } from 'react-dom';
import { useEffect } from 'react';

function Example() {
  // レンダー中
  prefetchDNS('https://example.com');

  // エフェクト内
  useEffect(() => {
    prefetchDNS('https://api.example.com');
  }, []);

  // イベントハンドラ内
  const handleClick = () => {
    prefetchDNS('https://cdn.example.com');
  };

  return <button onClick={handleClick}>読み込む</button>;
}
```

### サーバサイドレンダリング時の動作

サーバサイドレンダリングやサーバコンポーネントのレンダー時に `prefetchDNS` を呼び出した場合、以下の条件でのみ有効です。

- コンポーネントのレンダー中に呼び出した場合
- 非同期プロセスから派生したコンポーネントのレンダー中に呼び出した場合

それ以外の場所で呼び出しても無視されます。

```javascript
// サーバコンポーネント
async function ServerComponent() {
  // これは有効
  prefetchDNS('https://api.example.com');

  const data = await fetchData();

  return <div>{data}</div>;
}
```

### 同一オリジンへの DNS プリフェッチ

現在のページと同じサーバの DNS をプリフェッチしても利点はありません。既に解決されているためです。

```javascript
// 現在のページが https://mysite.com の場合
prefetchDNS('https://mysite.com'); // 効果なし

// サブドメインや別のドメインの場合は効果あり
prefetchDNS('https://api.mysite.com'); // 効果あり
prefetchDNS('https://cdn.example.com'); // 効果あり
```

### preconnect との違い

`prefetchDNS` は DNS ルックアップのみを実行し、`preconnect` は DNS ルックアップに加えて TCP ハンドシェイクと TLS ネゴシエーションも実行します。

```javascript
import { prefetchDNS, preconnect } from 'react-dom';

function App() {
  // 投機的な接続: オーバーヘッドが少ない
  prefetchDNS('https://might-use.example.com');

  // 確実に使用する接続: より完全な接続を確立
  preconnect('https://will-use.example.com');

  return <MyApp />;
}
```

## ベストプラクティス

### 1. 投機的な最適化に使用

リソースを使用する可能性が高いが確実ではない場合に `prefetchDNS` を使用します。

```javascript
function SearchPage() {
  // ユーザーが検索するかもしれない
  prefetchDNS('https://search-api.example.com');

  // ユーザーが結果をクリックするかもしれない
  prefetchDNS('https://details-api.example.com');

  return <SearchForm />;
}
```

### 2. 複数のサードパーティドメインに使用

多数のサードパーティサービスを使用する場合、`prefetchDNS` でオーバーヘッドを最小限に抑えます。

```javascript
function App() {
  // 分析サービス
  prefetchDNS('https://www.google-analytics.com');
  prefetchDNS('https://www.googletagmanager.com');

  // ソーシャルメディア
  prefetchDNS('https://platform.twitter.com');
  prefetchDNS('https://connect.facebook.net');

  // 広告
  prefetchDNS('https://pagead2.googlesyndication.com');

  return <MyApp />;
}
```

### 3. ユーザーインタラクションの予測

ユーザーの次のアクションを予測して DNS を解決します。

```javascript
function ProductList({ products }) {
  const handleProductHover = (productId) => {
    // ユーザーが製品詳細を見る可能性が高い
    prefetchDNS('https://product-images.example.com');
    prefetchDNS('https://reviews-api.example.com');
  };

  return (
    <div>
      {products.map(product => (
        <div
          key={product.id}
          onMouseEnter={() => handleProductHover(product.id)}
        >
          {product.name}
        </div>
      ))}
    </div>
  );
}
```

### 4. 早期に呼び出す

可能な限り早い段階で `prefetchDNS` を呼び出します。

```javascript
// アプリケーションのエントリーポイント
function App() {
  // アプリ起動時に重要なドメインの DNS を解決
  prefetchDNS('https://api.example.com');
  prefetchDNS('https://cdn.example.com');

  return (
    <Router>
      <Routes />
    </Router>
  );
}
```

### 5. 条件付きで使用

必要な場合にのみ DNS プリフェッチを実行します。

```javascript
function FeatureComponent({ isEnabled }) {
  // 機能が有効な場合のみ DNS を解決
  if (isEnabled) {
    prefetchDNS('https://feature-api.example.com');
  }

  return isEnabled ? <Feature /> : <Placeholder />;
}
```

### 6. パフォーマンスモニタリング

DNS プリフェッチの効果を測定します。

```javascript
import { prefetchDNS } from 'react-dom';
import { useEffect } from 'react';

function MonitoredApp() {
  useEffect(() => {
    // DNS プリフェッチのタイミングを記録
    const startTime = performance.now();

    prefetchDNS('https://api.example.com');

    // パフォーマンスエントリを監視
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('api.example.com')) {
          console.log('DNS 解決時間:', entry.duration);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  return <App />;
}
```

## 実践的な例

### SPA のルートベースのプリフェッチ

```javascript
import { prefetchDNS } from 'react-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function RouteOptimizer() {
  const location = useLocation();

  useEffect(() => {
    // ルートに基づいて必要なドメインの DNS を解決
    const routeDomains = {
      '/dashboard': ['https://dashboard-api.example.com'],
      '/analytics': ['https://analytics-api.example.com', 'https://charts.example.com'],
      '/settings': ['https://settings-api.example.com'],
    };

    const domains = routeDomains[location.pathname] || [];
    domains.forEach(domain => prefetchDNS(domain));
  }, [location.pathname]);

  return null;
}
```

### 段階的なリソースプリフェッチ

```javascript
import { prefetchDNS, preconnect, preload } from 'react-dom';

function ProgressiveLoader() {
  // ステップ 1: DNS 解決
  prefetchDNS('https://cdn.example.com');

  useEffect(() => {
    // ステップ 2: 接続確立（1秒後）
    const timer1 = setTimeout(() => {
      preconnect('https://cdn.example.com');
    }, 1000);

    // ステップ 3: リソースプリロード（2秒後）
    const timer2 = setTimeout(() => {
      preload('https://cdn.example.com/critical.css', { as: 'style' });
    }, 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return <App />;
}
```

### ユーザーの行動に基づくプリフェッチ

```javascript
import { prefetchDNS } from 'react-dom';
import { useState, useEffect } from 'react';

function SmartPreloader() {
  const [userActivity, setUserActivity] = useState(0);

  useEffect(() => {
    let activityCount = 0;

    const handleActivity = () => {
      activityCount++;
      setUserActivity(activityCount);

      // ユーザーがアクティブな場合、追加のドメインを解決
      if (activityCount > 5) {
        prefetchDNS('https://additional-content.example.com');
      }
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, []);

  return <App />;
}
```

### 地域ベースの最適化

```javascript
import { prefetchDNS } from 'react-dom';
import { useEffect, useState } from 'react';

function RegionalOptimizer() {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    // ユーザーの地域を検出
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        // 地域に基づいて適切な CDN の DNS を解決
        const cdnMap = {
          'US': 'https://us-cdn.example.com',
          'EU': 'https://eu-cdn.example.com',
          'ASIA': 'https://asia-cdn.example.com',
        };

        const detectedRegion = detectRegion(data.ip);
        setRegion(detectedRegion);
        prefetchDNS(cdnMap[detectedRegion]);
      });
  }, []);

  return <App region={region} />;
}
```

## トラブルシューティング

### DNS プリフェッチが機能しない

ブラウザの開発者ツールのネットワークタブで DNS ルックアップを確認します。一部のブラウザでは、プライバシー設定により DNS プリフェッチが無効になっている場合があります。

### パフォーマンスが向上しない

- ネットワークの遅延が小さい場合、効果が限定的
- ローカル開発環境では効果が見えにくい
- 本番環境で測定することを推奨

### 過度な DNS プリフェッチ

あまりに多くのドメインをプリフェッチすると、ブラウザのリソースを無駄に消費します。重要なドメインに絞ることを推奨します。

```javascript
// 避けるべき: 過度なプリフェッチ
function OverdoneExample() {
  const domains = Array.from({ length: 50 }, (_, i) =>
    `https://subdomain${i}.example.com`
  );

  domains.forEach(domain => prefetchDNS(domain)); // 推奨されない
}

// 推奨: 重要なドメインに絞る
function GoodExample() {
  prefetchDNS('https://api.example.com');
  prefetchDNS('https://cdn.example.com');
  prefetchDNS('https://analytics.example.com');
}
```

## 関連リソース

- [preconnect](/docs/frameworks/react/docs/reference/react-dom/preconnect.md)
- [preload](/docs/frameworks/react/docs/reference/react-dom/preload.md)
- [React DOM API](/docs/frameworks/react/docs/reference/react-dom.md)
