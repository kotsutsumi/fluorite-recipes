# preinitModule

`preinitModule` は、ESM (ECMAScript Module) を事前にフェッチして評価するための関数です。モジュールをダウンロードするだけでなく、実行まで行うため、即座に使用可能な状態にします。

## リファレンス

### `preinitModule(href, options)`

```javascript
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule('https://example.com/module.js', { as: 'script' });
  return <App />;
}
```

## パラメータ

### `href`

ダウンロードして実行したい ESM モジュールの URL を表す文字列。

### `options`

モジュールの設定を含むオブジェクト。以下のプロパティを指定できます。

#### `as`（必須）

必須で、値は `'script'` 固定です。

#### `crossOrigin`

使用する CORS ポリシー。`'anonymous'` または `'use-credentials'` を指定できます。クロスオリジンモジュールの場合に必要です。

#### `integrity`

モジュールの暗号化ハッシュ。真正性を検証するために使用します。

#### `nonce`

厳格なコンテンツセキュリティポリシーを使用する場合の暗号化 nonce。

## 返り値

`preinitModule` は何も返しません。

## 使用法

### コンポーネントのレンダー時にモジュールを事前初期化

```javascript
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule('https://example.com/module.js', { as: 'script' });
  return (
    <html>
      <body>
        <App />
      </body>
    </html>
  );
}
```

### イベントハンドラ内での事前初期化

ページやステートのトランジション時に、ESM モジュールを事前に初期化できます。

```javascript
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule('https://example.com/wizardModule.js', { as: 'script' });
    startWizard();
  };

  return (
    <button onClick={onClick}>ウィザードを開始</button>
  );
}
```

### 複数のモジュールの初期化

アプリケーションで複数の ESM モジュールを使用する場合、それらを事前に初期化できます。

```javascript
import { preinitModule } from 'react-dom';

function AppRoot() {
  // コアモジュール
  preinitModule('https://example.com/core.js', { as: 'script' });

  // ユーティリティモジュール
  preinitModule('https://example.com/utils.js', { as: 'script' });

  // UI コンポーネントモジュール
  preinitModule('https://example.com/components.js', { as: 'script' });

  return <App />;
}
```

### セキュリティ設定を含むモジュールの初期化

```javascript
import { preinitModule } from 'react-dom';

function SecureApp() {
  preinitModule('https://cdn.example.com/secure-module.js', {
    as: 'script',
    integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### Content Security Policy (CSP) 対応

```javascript
import { preinitModule } from 'react-dom';

function CSPApp({ nonce }) {
  preinitModule('https://example.com/module.js', {
    as: 'script',
    nonce: nonce
  });

  return <App />;
}
```

### 条件付きモジュールの初期化

特定の条件下でのみモジュールをロードする場合、条件付きで `preinitModule` を呼び出すことができます。

```javascript
import { preinitModule } from 'react-dom';

function ConditionalLoader({ enableAdvancedFeatures }) {
  if (enableAdvancedFeatures) {
    // 高度な機能のモジュールを初期化
    preinitModule('https://example.com/advanced.js', { as: 'script' });
  } else {
    // 基本機能のモジュールを初期化
    preinitModule('https://example.com/basic.js', { as: 'script' });
  }

  return <App />;
}
```

### 動的インポートとの組み合わせ

```javascript
import { preinitModule } from 'react-dom';
import { useState } from 'react';

function DynamicModuleLoader() {
  const [moduleLoaded, setModuleLoaded] = useState(false);

  const loadModule = async () => {
    // モジュールを事前に初期化
    preinitModule('https://example.com/feature.js', { as: 'script' });

    // 動的インポート
    const module = await import('https://example.com/feature.js');
    setModuleLoaded(true);

    // モジュールの使用
    module.initialize();
  };

  return (
    <button onClick={loadModule}>
      機能を読み込む
    </button>
  );
}
```

### サードパーティ ESM ライブラリの初期化

```javascript
import { preinitModule } from 'react-dom';

function AppWithESMLibraries() {
  // Lit Elements
  preinitModule('https://cdn.jsdelivr.net/npm/lit@2.7.0/index.js', {
    as: 'script',
    crossOrigin: 'anonymous'
  });

  // Three.js
  preinitModule('https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js', {
    as: 'script',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### 段階的なモジュールロード

```javascript
import { preinitModule } from 'react-dom';
import { useEffect } from 'react';

function ProgressiveModuleLoader() {
  // 即座に必要なモジュール
  preinitModule('https://example.com/critical.js', { as: 'script' });

  useEffect(() => {
    // 少し遅れて読み込むモジュール
    const timer1 = setTimeout(() => {
      preinitModule('https://example.com/deferred.js', { as: 'script' });
    }, 1000);

    // さらに遅れて読み込むモジュール
    const timer2 = setTimeout(() => {
      preinitModule('https://example.com/lazy.js', { as: 'script' });
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

同じ `href` で `preinitModule` を複数回呼び出しても、1 回呼び出した場合と同じ効果しかありません。

```javascript
// これらは同じ効果を持ちます
preinitModule('https://example.com/module.js', { as: 'script' });
preinitModule('https://example.com/module.js', { as: 'script' });
preinitModule('https://example.com/module.js', { as: 'script' });
```

### 呼び出し可能な場所

`preinitModule` は、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内など、さまざまな状況で呼び出すことができます。

```javascript
import { preinitModule } from 'react-dom';
import { useEffect } from 'react';

function Example() {
  // レンダー中
  preinitModule('https://example.com/module1.js', { as: 'script' });

  // エフェクト内
  useEffect(() => {
    preinitModule('https://example.com/module2.js', { as: 'script' });
  }, []);

  // イベントハンドラ内
  const handleClick = () => {
    preinitModule('https://example.com/module3.js', { as: 'script' });
  };

  return <button onClick={handleClick}>読み込む</button>;
}
```

### サーバサイドレンダリング時の動作

サーバサイドレンダリングやサーバコンポーネントのレンダー時に `preinitModule` を呼び出すと、HTML 出力にモジュールのプリロードヒントが含まれます。

```javascript
// サーバコンポーネント
function ServerApp() {
  // これは HTML に <link rel="modulepreload"> タグを生成します
  preinitModule('https://example.com/module.js', { as: 'script' });

  return <App />;
}
```

### preloadModule との違い

- `preloadModule`: モジュールをダウンロードするだけ（実行しない）
- `preinitModule`: モジュールをダウンロードして実行する

```javascript
import { preloadModule, preinitModule } from 'react-dom';

function Comparison() {
  // モジュールをダウンロードするが実行しない
  preloadModule('https://example.com/data-module.js', { as: 'script' });

  // モジュールをダウンロードして実行する
  preinitModule('https://example.com/init-module.js', { as: 'script' });

  return <App />;
}
```

### 通常のスクリプトとの違い

`preinitModule` は ESM 専用です。通常のスクリプトには `preinit` を使用してください。

```javascript
import { preinit, preinitModule } from 'react-dom';

function ScriptTypes() {
  // 通常のスクリプト
  preinit('https://example.com/legacy.js', { as: 'script' });

  // ESM モジュール
  preinitModule('https://example.com/module.js', { as: 'script' });

  return <App />;
}
```

## ベストプラクティス

### 1. 重要なモジュールを早期に初期化

アプリケーションの起動に必要なモジュールは、できるだけ早く初期化します。

```javascript
function App() {
  // アプリの起動時に重要なモジュールを初期化
  preinitModule('https://example.com/core.js', { as: 'script' });
  preinitModule('https://example.com/config.js', { as: 'script' });

  return <AppContent />;
}
```

### 2. セキュリティベストプラクティス

外部モジュールには常に `integrity` と `crossOrigin` を設定します。

```javascript
function SecureApp() {
  preinitModule('https://cdn.example.com/library.js', {
    as: 'script',
    integrity: 'sha384-...',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### 3. モジュールの依存関係を考慮

モジュール間に依存関係がある場合、適切な順序で初期化します。

```javascript
function AppWithDependencies() {
  // 基本ライブラリ（他のモジュールが依存）
  preinitModule('https://example.com/base.js', { as: 'script' });

  // 依存するモジュール
  preinitModule('https://example.com/feature-a.js', { as: 'script' });
  preinitModule('https://example.com/feature-b.js', { as: 'script' });

  return <App />;
}
```

### 4. コード分割との統合

React の lazy と組み合わせて、効率的なコード分割を実現します。

```javascript
import { preinitModule } from 'react-dom';
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => {
  // コンポーネントをロードする前にモジュールを初期化
  preinitModule('https://example.com/component-deps.js', { as: 'script' });
  return import('./LazyComponent');
});

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 5. パフォーマンスモニタリング

モジュールのロード時間を測定し、最適化の機会を特定します。

```javascript
import { preinitModule } from 'react-dom';
import { useEffect } from 'react';

function MonitoredApp() {
  useEffect(() => {
    const startTime = performance.now();

    preinitModule('https://example.com/module.js', { as: 'script' });

    // パフォーマンスエントリを監視
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('module.js')) {
          const loadTime = performance.now() - startTime;
          console.log('モジュールロード時間:', loadTime);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  return <App />;
}
```

### 6. フレームワークの機能を確認

React ベースのフレームワークを使用している場合、多くの場合モジュール管理は自動的に処理されます。

```javascript
// Next.js では通常不要
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./Component'), {
  loading: () => <Loading />,
});

function NextApp() {
  return <DynamicComponent />;
}
```

## 実践的な例

### Web Workers とモジュール

```javascript
import { preinitModule } from 'react-dom';
import { useEffect, useState } from 'react';

function WorkerApp() {
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    // Worker モジュールを事前に初期化
    preinitModule('https://example.com/worker.js', { as: 'script' });

    // Worker を作成
    const newWorker = new Worker(
      'https://example.com/worker.js',
      { type: 'module' }
    );

    setWorker(newWorker);

    return () => {
      newWorker?.terminate();
    };
  }, []);

  const runTask = () => {
    worker?.postMessage({ task: 'process' });
  };

  return (
    <button onClick={runTask}>タスクを実行</button>
  );
}
```

### マイクロフロントエンド統合

```javascript
import { preinitModule } from 'react-dom';
import { useEffect, useState } from 'react';

function MicroFrontendHost() {
  const [modules, setModules] = useState({});

  useEffect(() => {
    // 各マイクロフロントエンドのモジュールを初期化
    const microFrontends = [
      'https://mfe1.example.com/app.js',
      'https://mfe2.example.com/app.js',
      'https://mfe3.example.com/app.js',
    ];

    microFrontends.forEach(url => {
      preinitModule(url, {
        as: 'script',
        crossOrigin: 'anonymous'
      });
    });

    // モジュールの動的インポート
    Promise.all(
      microFrontends.map(url => import(url))
    ).then(loadedModules => {
      setModules(loadedModules);
    });
  }, []);

  return (
    <div>
      {Object.values(modules).map((Module, index) => (
        <Module.App key={index} />
      ))}
    </div>
  );
}
```

### プラグインシステム

```javascript
import { preinitModule } from 'react-dom';
import { useState, useEffect } from 'react';

function PluginSystem({ enabledPlugins }) {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    // 有効なプラグインのモジュールを初期化
    enabledPlugins.forEach(pluginId => {
      preinitModule(`https://plugins.example.com/${pluginId}.js`, {
        as: 'script',
        crossOrigin: 'anonymous'
      });
    });

    // プラグインをロード
    Promise.all(
      enabledPlugins.map(id =>
        import(`https://plugins.example.com/${id}.js`)
      )
    ).then(loadedPlugins => {
      setPlugins(loadedPlugins.map(p => p.default));
    });
  }, [enabledPlugins]);

  return (
    <div>
      {plugins.map((Plugin, index) => (
        <Plugin key={index} />
      ))}
    </div>
  );
}
```

### テーマシステム with ESM

```javascript
import { preinitModule } from 'react-dom';
import { useState, useEffect } from 'react';

function ThemableApp() {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    // テーマモジュールを初期化
    preinitModule(`https://themes.example.com/${theme}.js`, {
      as: 'script'
    });

    // テーマを適用
    import(`https://themes.example.com/${theme}.js`)
      .then(themeModule => {
        themeModule.apply();
      });
  }, [theme]);

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="default">デフォルト</option>
        <option value="dark">ダーク</option>
        <option value="high-contrast">ハイコントラスト</option>
      </select>
      <App />
    </div>
  );
}
```

### 国際化 (i18n) モジュール

```javascript
import { preinitModule } from 'react-dom';
import { useState, useEffect } from 'react';

function I18nApp() {
  const [locale, setLocale] = useState('ja');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // 翻訳モジュールを初期化
    preinitModule(`https://i18n.example.com/${locale}.js`, {
      as: 'script'
    });

    // 翻訳をロード
    import(`https://i18n.example.com/${locale}.js`)
      .then(module => {
        setTranslations(module.default);
      });
  }, [locale]);

  return (
    <div>
      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="ja">日本語</option>
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
      <App translations={translations} />
    </div>
  );
}
```

## トラブルシューティング

### モジュールが読み込まれない

- URL が正しいか確認
- モジュールが実際に ESM フォーマットか確認
- CORS 設定が適切か確認
- ブラウザのコンソールでエラーを確認

### モジュールの実行順序の問題

ESM の依存関係は自動的に解決されますが、初期化順序が重要な場合は明示的に制御してください。

```javascript
async function initializeModules() {
  // 順序を保証
  await import('https://example.com/base.js');
  await import('https://example.com/dependent.js');
}
```

### CSP エラー

Content Security Policy エラーが発生する場合、`nonce` を設定してください。

```javascript
function CSPApp({ cspNonce }) {
  preinitModule('https://example.com/module.js', {
    as: 'script',
    nonce: cspNonce
  });

  return <App />;
}
```

### パフォーマンスの問題

多すぎるモジュールを初期化している可能性があります。本当に必要なモジュールのみを初期化してください。

### ブラウザの互換性

ESM は最新のブラウザでサポートされていますが、古いブラウザではフォールバックが必要な場合があります。

```javascript
function BrowserCompatibleApp() {
  useEffect(() => {
    if ('noModule' in HTMLScriptElement.prototype) {
      // ESM サポートあり
      preinitModule('https://example.com/modern.js', { as: 'script' });
    } else {
      // ESM サポートなし - フォールバック
      preinit('https://example.com/legacy.js', { as: 'script' });
    }
  }, []);

  return <App />;
}
```

## 関連リソース

- [preloadModule](/docs/frameworks/react/docs/reference/react-dom/preloadModule.md)
- [preinit](/docs/frameworks/react/docs/reference/react-dom/preinit.md)
- [preload](/docs/frameworks/react/docs/reference/react-dom/preload.md)
- [React DOM API](/docs/frameworks/react/docs/reference/react-dom.md)
