# preloadModule

`preloadModule` は、使用予定の ESM (ECMAScript Module) を事前にフェッチするための関数です。モジュールをダウンロードしますが、実行はしません。

## リファレンス

### `preloadModule(href, options)`

```javascript
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule('https://example.com/module.js', { as: 'script' });
  return <App />;
}
```

## パラメータ

### `href`

ダウンロードする ESM モジュールの URL を表す文字列。

### `options`

モジュールの設定を含むオブジェクト。以下のプロパティを指定できます。

#### `as`（必須）

必須で、値は `'script'` 固定です。

#### `crossOrigin`

使用する CORS ポリシー。`'anonymous'` または `'use-credentials'` を指定できます。クロスオリジンモジュールの場合に使用します。

#### `integrity`

モジュールの暗号化ハッシュ。真正性を検証するために使用します。

#### `nonce`

厳格なコンテンツセキュリティポリシーを使用する場合の暗号化 nonce。

## 返り値

`preloadModule` は何も返しません。

## 使用法

### コンポーネントのレンダー時にモジュールをプリロード

```javascript
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule('https://example.com/module.js', { as: 'script' });
  return (
    <html>
      <body>
        <App />
      </body>
    </html>
  );
}
```

### イベントハンドラ内でのプリロード

ページやステートのトランジション時に、ESM モジュールを事前にプリロードできます。

```javascript
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule('https://example.com/wizardModule.js', { as: 'script' });
    startWizard();
  };

  return (
    <button onClick={onClick}>ウィザードを開始</button>
  );
}
```

### 複数のモジュールのプリロード

アプリケーションで複数の ESM モジュールを使用する場合、それらを事前にプリロードできます。

```javascript
import { preloadModule } from 'react-dom';

function AppRoot() {
  // コアモジュール
  preloadModule('https://example.com/core.js', { as: 'script' });

  // ユーティリティモジュール
  preloadModule('https://example.com/utils.js', { as: 'script' });

  // UI コンポーネントモジュール
  preloadModule('https://example.com/components.js', { as: 'script' });

  return <App />;
}
```

### セキュリティ設定を含むプリロード

```javascript
import { preloadModule } from 'react-dom';

function SecureApp() {
  preloadModule('https://cdn.example.com/secure-module.js', {
    as: 'script',
    integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### Content Security Policy (CSP) 対応

```javascript
import { preloadModule } from 'react-dom';

function CSPApp({ nonce }) {
  preloadModule('https://example.com/module.js', {
    as: 'script',
    nonce: nonce
  });

  return <App />;
}
```

### 条件付きモジュールのプリロード

特定の条件下でのみモジュールをロードする場合、条件付きで `preloadModule` を呼び出すことができます。

```javascript
import { preloadModule } from 'react-dom';

function ConditionalLoader({ enableAdvancedFeatures }) {
  if (enableAdvancedFeatures) {
    // 高度な機能のモジュールをプリロード
    preloadModule('https://example.com/advanced.js', { as: 'script' });
  } else {
    // 基本機能のモジュールをプリロード
    preloadModule('https://example.com/basic.js', { as: 'script' });
  }

  return <App />;
}
```

### ユーザーインタラクションの予測

```javascript
import { preloadModule } from 'react-dom';

function FeatureCard({ feature }) {
  const handleMouseEnter = () => {
    // ユーザーが機能を使用する可能性が高い
    preloadModule(`https://example.com/features/${feature.id}.js`, {
      as: 'script'
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <h3>{feature.name}</h3>
      <button onClick={() => loadFeature(feature.id)}>
        使用する
      </button>
    </div>
  );
}
```

### ルートベースのプリロード

```javascript
import { preloadModule } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function RoutePreloader() {
  const router = useRouter();

  useEffect(() => {
    // ルートに応じてモジュールをプリロード
    const routeModules = {
      '/dashboard': 'https://example.com/dashboard.js',
      '/analytics': 'https://example.com/analytics.js',
      '/settings': 'https://example.com/settings.js',
    };

    const moduleUrl = routeModules[router.pathname];
    if (moduleUrl) {
      preloadModule(moduleUrl, { as: 'script' });
    }
  }, [router.pathname]);

  return null;
}
```

### 動的インポートの準備

```javascript
import { preloadModule } from 'react-dom';
import { useState } from 'react';

function DynamicModuleLoader() {
  const [module, setModule] = useState(null);

  const prepareModule = (moduleUrl) => {
    // モジュールをプリロード
    preloadModule(moduleUrl, { as: 'script' });
  };

  const loadModule = async (moduleUrl) => {
    // 動的インポート（既にプリロード済み）
    const loadedModule = await import(moduleUrl);
    setModule(loadedModule);
  };

  return (
    <div>
      <button
        onMouseEnter={() => prepareModule('https://example.com/feature.js')}
        onClick={() => loadModule('https://example.com/feature.js')}
      >
        機能を読み込む
      </button>
      {module && <module.Component />}
    </div>
  );
}
```

### サードパーティ ESM ライブラリのプリロード

```javascript
import { preloadModule } from 'react-dom';

function AppWithESMLibraries() {
  // Lit Elements
  preloadModule('https://cdn.jsdelivr.net/npm/lit@2.7.0/index.js', {
    as: 'script',
    crossOrigin: 'anonymous'
  });

  // Three.js
  preloadModule('https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js', {
    as: 'script',
    crossOrigin: 'anonymous'
  });

  // D3.js
  preloadModule('https://cdn.jsdelivr.net/npm/d3@7.8.5/+esm', {
    as: 'script',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### 段階的なモジュールプリロード

```javascript
import { preloadModule } from 'react-dom';
import { useEffect } from 'react';

function ProgressiveModuleLoader() {
  useEffect(() => {
    // 即座に必要なモジュール
    preloadModule('https://example.com/critical.js', { as: 'script' });

    // 少し遅れてプリロードするモジュール
    const timer1 = setTimeout(() => {
      preloadModule('https://example.com/deferred.js', { as: 'script' });
    }, 1000);

    // さらに遅れてプリロードするモジュール
    const timer2 = setTimeout(() => {
      preloadModule('https://example.com/lazy.js', { as: 'script' });
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return <App />;
}
```

## 重要な注意事項

### 同じモジュールへの複数回の呼び出し

同じ `href` で `preloadModule` を複数回呼び出しても、1 回呼び出した場合と同じ効果しかありません。

```javascript
// これらは同じ効果を持ちます
preloadModule('https://example.com/module.js', { as: 'script' });
preloadModule('https://example.com/module.js', { as: 'script' });
preloadModule('https://example.com/module.js', { as: 'script' });
```

### 呼び出し可能な場所

`preloadModule` は、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内など、さまざまな状況で呼び出すことができます。

```javascript
import { preloadModule } from 'react-dom';
import { useEffect } from 'react';

function Example() {
  // レンダー中
  preloadModule('https://example.com/module1.js', { as: 'script' });

  // エフェクト内
  useEffect(() => {
    preloadModule('https://example.com/module2.js', { as: 'script' });
  }, []);

  // イベントハンドラ内
  const handleClick = () => {
    preloadModule('https://example.com/module3.js', { as: 'script' });
  };

  return <button onClick={handleClick}>読み込む</button>;
}
```

### サーバサイドレンダリング時の動作

サーバサイドレンダリングやサーバコンポーネントのレンダー時に `preloadModule` を呼び出すと、HTML 出力にモジュールのプリロードヒントが含まれます。

```javascript
// サーバコンポーネント
function ServerApp() {
  // これは HTML に <link rel="modulepreload"> タグを生成します
  preloadModule('https://example.com/module.js', { as: 'script' });

  return <App />;
}
```

### preinitModule との違い

- `preloadModule`: モジュールをダウンロードするだけ（実行しない）
- `preinitModule`: モジュールをダウンロードして実行する

```javascript
import { preloadModule, preinitModule } from 'react-dom';

function Comparison() {
  // モジュールをダウンロードするが実行しない
  // 後で動的インポートで使用する予定
  preloadModule('https://example.com/on-demand.js', { as: 'script' });

  // モジュールをダウンロードして即座に実行する
  preinitModule('https://example.com/init.js', { as: 'script' });

  return <App />;
}
```

### 通常のスクリプトとの違い

`preloadModule` は ESM 専用です。通常のスクリプトには `preload` を使用してください。

```javascript
import { preload, preloadModule } from 'react-dom';

function ScriptTypes() {
  // 通常のスクリプト
  preload('https://example.com/legacy.js', { as: 'script' });

  // ESM モジュール
  preloadModule('https://example.com/module.js', { as: 'script' });

  return <App />;
}
```

## ベストプラクティス

### 1. 動的インポートと組み合わせる

`preloadModule` は、後で動的にインポートする予定のモジュールに最適です。

```javascript
import { preloadModule } from 'react-dom';
import { lazy, Suspense } from 'react';

// モジュールをプリロード
preloadModule('https://example.com/HeavyComponent.js', { as: 'script' });

// 遅延ロードコンポーネント
const HeavyComponent = lazy(() =>
  import('https://example.com/HeavyComponent.js')
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. セキュリティベストプラクティス

外部モジュールには常に `integrity` と `crossOrigin` を設定します。

```javascript
function SecureApp() {
  preloadModule('https://cdn.example.com/library.js', {
    as: 'script',
    integrity: 'sha384-...',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### 3. モジュールグラフを考慮

モジュールの依存関係を考慮して、適切な順序でプリロードします。

```javascript
function AppWithDependencies() {
  // 基本ライブラリ（他のモジュールが依存）
  preloadModule('https://example.com/base.js', { as: 'script' });

  // 依存するモジュール
  preloadModule('https://example.com/feature-a.js', { as: 'script' });
  preloadModule('https://example.com/feature-b.js', { as: 'script' });

  return <App />;
}
```

### 4. ユーザーインタラクションを予測

ユーザーが次に必要とする可能性が高いモジュールをプリロードします。

```javascript
function ProductCard({ product }) {
  const handleMouseEnter = () => {
    // ユーザーが詳細ビューを開く可能性が高い
    preloadModule('https://example.com/product-details.js', {
      as: 'script'
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <h3>{product.name}</h3>
      <Link to={`/products/${product.id}`}>詳細を見る</Link>
    </div>
  );
}
```

### 5. ルートベースの最適化

SPA のルート遷移を予測してモジュールをプリロードします。

```javascript
import { preloadModule } from 'react-dom';
import { Link } from 'react-router-dom';

function Navigation() {
  const routes = {
    '/dashboard': 'https://example.com/dashboard.js',
    '/profile': 'https://example.com/profile.js',
    '/settings': 'https://example.com/settings.js',
  };

  const handleLinkHover = (path) => {
    const moduleUrl = routes[path];
    if (moduleUrl) {
      preloadModule(moduleUrl, { as: 'script' });
    }
  };

  return (
    <nav>
      <Link
        to="/dashboard"
        onMouseEnter={() => handleLinkHover('/dashboard')}
      >
        ダッシュボード
      </Link>
      <Link
        to="/profile"
        onMouseEnter={() => handleLinkHover('/profile')}
      >
        プロフィール
      </Link>
    </nav>
  );
}
```

### 6. パフォーマンスモニタリング

モジュールのロード時間を測定し、最適化の機会を特定します。

```javascript
import { preloadModule } from 'react-dom';
import { useEffect } from 'react';

function MonitoredApp() {
  useEffect(() => {
    const startTime = performance.now();

    preloadModule('https://example.com/module.js', { as: 'script' });

    // パフォーマンスエントリを監視
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('module.js')) {
          const loadTime = performance.now() - startTime;
          console.log('モジュールプリロード時間:', loadTime);

          // 分析に送信
          sendAnalytics('module-preload', {
            url: entry.name,
            duration: loadTime
          });
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

### コード分割の最適化

```javascript
import { preloadModule } from 'react-dom';
import { lazy, Suspense, useState } from 'react';

function OptimizedCodeSplitting() {
  const [activeTab, setActiveTab] = useState('home');

  // タブ切り替え時にモジュールをプリロード
  const handleTabHover = (tab) => {
    const modules = {
      dashboard: 'https://example.com/Dashboard.js',
      analytics: 'https://example.com/Analytics.js',
      settings: 'https://example.com/Settings.js',
    };

    if (modules[tab]) {
      preloadModule(modules[tab], { as: 'script' });
    }
  };

  const Dashboard = lazy(() => import('https://example.com/Dashboard.js'));
  const Analytics = lazy(() => import('https://example.com/Analytics.js'));
  const Settings = lazy(() => import('https://example.com/Settings.js'));

  return (
    <div>
      <nav>
        <button
          onMouseEnter={() => handleTabHover('dashboard')}
          onClick={() => setActiveTab('dashboard')}
        >
          ダッシュボード
        </button>
        <button
          onMouseEnter={() => handleTabHover('analytics')}
          onClick={() => setActiveTab('analytics')}
        >
          分析
        </button>
        <button
          onMouseEnter={() => handleTabHover('settings')}
          onClick={() => setActiveTab('settings')}
        >
          設定
        </button>
      </nav>

      <Suspense fallback={<Loading />}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <Settings />}
      </Suspense>
    </div>
  );
}
```

### Web Workers のプリロード

```javascript
import { preloadModule } from 'react-dom';
import { useEffect, useState } from 'react';

function WorkerApp() {
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    // Worker モジュールをプリロード
    preloadModule('https://example.com/worker.js', { as: 'script' });

    // Worker を作成（モジュールは既にキャッシュされている）
    const newWorker = new Worker(
      'https://example.com/worker.js',
      { type: 'module' }
    );

    setWorker(newWorker);

    return () => {
      newWorker?.terminate();
    };
  }, []);

  const runTask = (data) => {
    worker?.postMessage(data);
  };

  return (
    <div>
      <button onClick={() => runTask({ task: 'process' })}>
        タスクを実行
      </button>
    </div>
  );
}
```

### マイクロフロントエンドの統合

```javascript
import { preloadModule } from 'react-dom';
import { useEffect, useState } from 'react';

function MicroFrontendHost({ activeApp }) {
  const [modules, setModules] = useState({});

  // 利用可能なマイクロフロントエンド
  const microFrontends = {
    app1: 'https://mfe1.example.com/app.js',
    app2: 'https://mfe2.example.com/app.js',
    app3: 'https://mfe3.example.com/app.js',
  };

  useEffect(() => {
    // すべてのマイクロフロントエンドをプリロード
    Object.values(microFrontends).forEach(url => {
      preloadModule(url, {
        as: 'script',
        crossOrigin: 'anonymous'
      });
    });
  }, []);

  useEffect(() => {
    // アクティブなアプリをロード
    const appUrl = microFrontends[activeApp];
    if (appUrl && !modules[activeApp]) {
      import(appUrl).then(module => {
        setModules(prev => ({
          ...prev,
          [activeApp]: module.default
        }));
      });
    }
  }, [activeApp]);

  const ActiveModule = modules[activeApp];

  return (
    <div>
      {ActiveModule ? <ActiveModule /> : <Loading />}
    </div>
  );
}
```

### プラグインシステムの実装

```javascript
import { preloadModule } from 'react-dom';
import { useState, useEffect } from 'react';

function PluginSystem() {
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [loadedPlugins, setLoadedPlugins] = useState({});

  useEffect(() => {
    // プラグインリストを取得
    fetch('https://api.example.com/plugins')
      .then(res => res.json())
      .then(plugins => {
        setAvailablePlugins(plugins);

        // すべてのプラグインをプリロード
        plugins.forEach(plugin => {
          preloadModule(plugin.url, {
            as: 'script',
            crossOrigin: 'anonymous'
          });
        });
      });
  }, []);

  const loadPlugin = async (pluginId) => {
    const plugin = availablePlugins.find(p => p.id === pluginId);
    if (!plugin || loadedPlugins[pluginId]) return;

    const module = await import(plugin.url);
    setLoadedPlugins(prev => ({
      ...prev,
      [pluginId]: module.default
    }));
  };

  return (
    <div>
      <h2>利用可能なプラグイン</h2>
      {availablePlugins.map(plugin => (
        <div key={plugin.id}>
          <h3>{plugin.name}</h3>
          <button onClick={() => loadPlugin(plugin.id)}>
            有効化
          </button>
        </div>
      ))}

      <h2>アクティブなプラグイン</h2>
      {Object.entries(loadedPlugins).map(([id, Plugin]) => (
        <Plugin key={id} />
      ))}
    </div>
  );
}
```

### A/B テスト用のモジュール管理

```javascript
import { preloadModule } from 'react-dom';
import { useState, useEffect } from 'react';

function ABTestApp() {
  const [variant, setVariant] = useState(null);
  const [VariantComponent, setVariantComponent] = useState(null);

  useEffect(() => {
    // A/B テストのバリアントを決定
    const testVariant = Math.random() < 0.5 ? 'A' : 'B';
    setVariant(testVariant);

    // バリアントのモジュールをプリロード
    const moduleUrl = `https://example.com/variants/${testVariant}.js`;
    preloadModule(moduleUrl, { as: 'script' });

    // モジュールをロード
    import(moduleUrl).then(module => {
      setVariantComponent(() => module.default);
    });

    // 分析に記録
    sendAnalytics('ab-test', { variant: testVariant });
  }, []);

  if (!VariantComponent) return <Loading />;

  return <VariantComponent />;
}
```

## トラブルシューティング

### モジュールがプリロードされない

- URL が正しいか確認
- モジュールが実際に ESM フォーマットか確認
- CORS 設定が適切か確認
- ブラウザのネットワークタブで確認

### CORS エラー

クロスオリジンモジュールには `crossOrigin` を設定してください。

```javascript
preloadModule('https://cdn.example.com/module.js', {
  as: 'script',
  crossOrigin: 'anonymous'
});
```

### プリロードが使用されない

プリロードされたモジュールが実際に使用されない場合、URL が完全に一致しているか確認してください。

```javascript
// URL は完全に一致する必要があります
preloadModule('https://example.com/module.js', { as: 'script' });
await import('https://example.com/module.js'); // 一致
await import('https://example.com/module.js?v=2'); // 不一致
```

### パフォーマンスが向上しない

- プリロードのタイミングが適切か確認
- 実際にモジュールが使用されているか確認
- ネットワークの遅延が大きい環境でテスト

### ブラウザの互換性

ESM は最新のブラウザでサポートされていますが、古いブラウザではフォールバックが必要です。

```javascript
function BrowserCompatibleApp() {
  useEffect(() => {
    if ('noModule' in HTMLScriptElement.prototype) {
      // ESM サポートあり
      preloadModule('https://example.com/modern.js', { as: 'script' });
    } else {
      // ESM サポートなし - 通常のスクリプトを使用
      preload('https://example.com/legacy.js', { as: 'script' });
    }
  }, []);

  return <App />;
}
```

## 関連リソース

- [preinitModule](/docs/frameworks/react/docs/reference/react-dom/preinitModule.md)
- [preload](/docs/frameworks/react/docs/reference/react-dom/preload.md)
- [preinit](/docs/frameworks/react/docs/reference/react-dom/preinit.md)
- [React DOM API](/docs/frameworks/react/docs/reference/react-dom.md)
