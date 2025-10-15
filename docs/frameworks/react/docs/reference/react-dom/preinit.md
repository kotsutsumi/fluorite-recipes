# preinit

`preinit` は、スタイルシートや外部スクリプトを事前にフェッチして評価するための関数です。リソースをダウンロードするだけでなく、実行まで行うため、即座に使用可能な状態にします。

## リファレンス

### `preinit(href, options)`

```javascript
import { preinit } from 'react-dom';

function AppRoot() {
  preinit('https://example.com/script.js', { as: 'script' });
  return <App />;
}
```

## パラメータ

### `href`

ダウンロードして実行したいリソースの URL を表す文字列。

### `options`

リソースの設定を含むオブジェクト。以下のプロパティを指定できます。

#### `as`（必須）

リソースの種別。`"script"` または `"style"` のいずれか。

#### `precedence`

スタイルシートの場合に必須。ドキュメント内の `<link>` の挿入位置を指定します。優先度が高いものは優先度が低いものをオーバーライドできます。

- `"reset"`: リセットスタイルシート
- `"low"`: 低優先度
- `"medium"`: 中優先度（デフォルト）
- `"high"`: 高優先度

#### `crossOrigin`

使用する CORS ポリシー。`"anonymous"` または `"use-credentials"` を指定できます。クロスオリジンリソースの場合に必要です。

#### `integrity`

リソースの暗号化ハッシュ。真正性を検証するために使用します。

#### `nonce`

厳格なコンテンツセキュリティポリシーを使用する場合の暗号化 nonce。

#### `fetchPriority`

リソースのフェッチ優先度のヒント。以下のいずれかを指定できます。

- `"auto"`: 自動（デフォルト）
- `"high"`: 高優先度
- `"low"`: 低優先度

## 返り値

`preinit` は何も返しません。

## 使用法

### コンポーネントのレンダー時にスクリプトを事前初期化

```javascript
import { preinit } from 'react-dom';

function AppRoot() {
  preinit('https://example.com/script.js', { as: 'script' });
  return (
    <html>
      <body>
        <App />
      </body>
    </html>
  );
}
```

### コンポーネントのレンダー時にスタイルシートを事前初期化

```javascript
import { preinit } from 'react-dom';

function AppRoot() {
  preinit('https://example.com/styles.css', {
    as: 'style',
    precedence: 'medium'
  });
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

ページやステートのトランジション時に、スクリプトやスタイルシートを事前に初期化できます。

```javascript
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit('https://example.com/wizardStyles.css', {
      as: 'style',
      precedence: 'high'
    });
    startWizard();
  };

  return (
    <button onClick={onClick}>ウィザードを開始</button>
  );
}
```

### 優先度を指定したスタイルシートの読み込み

```javascript
import { preinit } from 'react-dom';

function ThemedApp() {
  // リセットスタイルシート（最も低い優先度）
  preinit('https://example.com/reset.css', {
    as: 'style',
    precedence: 'reset'
  });

  // ベーススタイルシート
  preinit('https://example.com/base.css', {
    as: 'style',
    precedence: 'low'
  });

  // コンポーネントスタイルシート
  preinit('https://example.com/components.css', {
    as: 'style',
    precedence: 'medium'
  });

  // テーマのオーバーライド
  preinit('https://example.com/theme.css', {
    as: 'style',
    precedence: 'high'
  });

  return <App />;
}
```

### セキュリティ設定を含むリソースの初期化

```javascript
import { preinit } from 'react-dom';

function SecureApp() {
  preinit('https://cdn.example.com/library.js', {
    as: 'script',
    integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### Content Security Policy (CSP) 対応

```javascript
import { preinit } from 'react-dom';

function CSPApp({ nonce }) {
  preinit('https://example.com/script.js', {
    as: 'script',
    nonce: nonce
  });

  return <App />;
}
```

### フェッチ優先度の指定

```javascript
import { preinit } from 'react-dom';

function OptimizedApp() {
  // 重要なスクリプト - 高優先度
  preinit('https://example.com/critical.js', {
    as: 'script',
    fetchPriority: 'high'
  });

  // 重要でないスクリプト - 低優先度
  preinit('https://example.com/analytics.js', {
    as: 'script',
    fetchPriority: 'low'
  });

  return <App />;
}
```

### 条件付きリソースの初期化

```javascript
import { preinit } from 'react-dom';

function ConditionalLoader({ theme, loadAnalytics }) {
  // テーマに応じたスタイルシート
  if (theme === 'dark') {
    preinit('https://example.com/dark-theme.css', {
      as: 'style',
      precedence: 'high'
    });
  } else {
    preinit('https://example.com/light-theme.css', {
      as: 'style',
      precedence: 'high'
    });
  }

  // 分析スクリプト（オプション）
  if (loadAnalytics) {
    preinit('https://analytics.example.com/tracker.js', {
      as: 'script',
      fetchPriority: 'low'
    });
  }

  return <App />;
}
```

### サードパーティライブラリの初期化

```javascript
import { preinit } from 'react-dom';

function AppWithLibraries() {
  // UI フレームワーク
  preinit('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', {
    as: 'style',
    precedence: 'low',
    crossOrigin: 'anonymous'
  });

  // アイコンライブラリ
  preinit('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', {
    as: 'style',
    precedence: 'low',
    crossOrigin: 'anonymous'
  });

  // JavaScript ライブラリ
  preinit('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', {
    as: 'script',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

## 重要な注意事項

### 同じリソースへの複数回の呼び出し

同じ `href` で `preinit` を複数回呼び出しても、1 回呼び出した場合と同じ効果しかありません。

```javascript
// これらは同じ効果を持ちます
preinit('https://example.com/script.js', { as: 'script' });
preinit('https://example.com/script.js', { as: 'script' });
preinit('https://example.com/script.js', { as: 'script' });
```

### 呼び出し可能な場所

`preinit` は、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内など、さまざまな状況で呼び出すことができます。

```javascript
import { preinit } from 'react-dom';
import { useEffect } from 'react';

function Example() {
  // レンダー中
  preinit('https://example.com/styles.css', {
    as: 'style',
    precedence: 'medium'
  });

  // エフェクト内
  useEffect(() => {
    preinit('https://example.com/script.js', { as: 'script' });
  }, []);

  // イベントハンドラ内
  const handleClick = () => {
    preinit('https://example.com/feature.js', { as: 'script' });
  };

  return <button onClick={handleClick}>読み込む</button>;
}
```

### サーバサイドレンダリング時の動作

サーバサイドレンダリングやサーバコンポーネントのレンダー時に `preinit` を呼び出すと、HTML 出力にリソースのヒントが含まれます。

```javascript
// サーバコンポーネント
function ServerApp() {
  // これは HTML に <link rel="stylesheet"> タグを生成します
  preinit('https://example.com/styles.css', {
    as: 'style',
    precedence: 'medium'
  });

  return <App />;
}
```

### preload との違い

- `preload`: リソースをダウンロードするだけ（実行しない）
- `preinit`: リソースをダウンロードして実行する

```javascript
import { preload, preinit } from 'react-dom';

function Comparison() {
  // リソースをダウンロードするが実行しない
  preload('https://example.com/data.json', { as: 'fetch' });

  // リソースをダウンロードして実行する
  preinit('https://example.com/script.js', { as: 'script' });

  return <App />;
}
```

### スタイルシートの precedence は必須

スタイルシート（`as: 'style'`）の場合、`precedence` オプションは必須です。

```javascript
// 正しい
preinit('https://example.com/styles.css', {
  as: 'style',
  precedence: 'medium'
});

// エラー: precedence が指定されていない
preinit('https://example.com/styles.css', { as: 'style' });
```

## ベストプラクティス

### 1. 重要なリソースを早期に初期化

アプリケーションの起動に必要なリソースは、できるだけ早く初期化します。

```javascript
function App() {
  // アプリの起動時に重要なリソースを初期化
  preinit('https://example.com/critical.css', {
    as: 'style',
    precedence: 'high',
    fetchPriority: 'high'
  });

  preinit('https://example.com/core.js', {
    as: 'script',
    fetchPriority: 'high'
  });

  return <AppContent />;
}
```

### 2. 適切な優先度を設定

スタイルシートの優先度を適切に設定して、カスケードを制御します。

```javascript
function ThemedApp() {
  // 優先度の低いものから高いものへ
  preinit('https://example.com/normalize.css', {
    as: 'style',
    precedence: 'reset'
  });

  preinit('https://example.com/variables.css', {
    as: 'style',
    precedence: 'low'
  });

  preinit('https://example.com/components.css', {
    as: 'style',
    precedence: 'medium'
  });

  preinit('https://example.com/utilities.css', {
    as: 'style',
    precedence: 'high'
  });

  return <App />;
}
```

### 3. セキュリティベストプラクティス

外部リソースには常に `integrity` と `crossOrigin` を設定します。

```javascript
function SecureApp() {
  preinit('https://cdn.example.com/library.js', {
    as: 'script',
    integrity: 'sha384-...',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### 4. パフォーマンスの最適化

`fetchPriority` を使用して、ブラウザのリソース取得の優先順位を最適化します。

```javascript
function OptimizedApp() {
  // Above the fold の重要なスタイル
  preinit('https://example.com/hero.css', {
    as: 'style',
    precedence: 'high',
    fetchPriority: 'high'
  });

  // Below the fold のスタイル
  preinit('https://example.com/footer.css', {
    as: 'style',
    precedence: 'low',
    fetchPriority: 'low'
  });

  return <App />;
}
```

### 5. フレームワークの機能を確認

React ベースのフレームワーク（Next.js、Remix など）を使用している場合、多くのリソース初期化は自動的に処理されます。

```javascript
// Next.js では通常不要
import Script from 'next/script';

function NextApp() {
  return (
    <>
      {/* Next.js が自動的に最適化 */}
      <Script src="https://example.com/script.js" />
      <App />
    </>
  );
}
```

### 6. 条件付きロードの最適化

必要な場合にのみリソースを初期化します。

```javascript
function ConditionalApp({ features }) {
  // 機能が有効な場合のみ関連リソースを初期化
  if (features.charts) {
    preinit('https://cdn.example.com/charts.js', { as: 'script' });
    preinit('https://cdn.example.com/charts.css', {
      as: 'style',
      precedence: 'medium'
    });
  }

  if (features.editor) {
    preinit('https://cdn.example.com/editor.js', { as: 'script' });
    preinit('https://cdn.example.com/editor.css', {
      as: 'style',
      precedence: 'medium'
    });
  }

  return <App features={features} />;
}
```

## 実践的な例

### ダイナミックテーマシステム

```javascript
import { preinit } from 'react-dom';
import { useState, useEffect } from 'react';

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // テーマに応じたスタイルシートを初期化
    preinit(`https://example.com/themes/${savedTheme}.css`, {
      as: 'style',
      precedence: 'high'
    });
  }, []);

  const switchTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // 新しいテーマのスタイルシートを初期化
    preinit(`https://example.com/themes/${newTheme}.css`, {
      as: 'style',
      precedence: 'high'
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 機能フラグベースのリソースロード

```javascript
import { preinit } from 'react-dom';

function FeatureFlaggedApp({ flags }) {
  // ベースリソース（常に読み込む）
  preinit('https://example.com/base.css', {
    as: 'style',
    precedence: 'low'
  });

  // 機能フラグに基づいてリソースを初期化
  Object.entries(flags).forEach(([feature, enabled]) => {
    if (enabled) {
      preinit(`https://example.com/features/${feature}.js`, {
        as: 'script'
      });
      preinit(`https://example.com/features/${feature}.css`, {
        as: 'style',
        precedence: 'medium'
      });
    }
  });

  return <App />;
}
```

### A/B テストのためのリソース管理

```javascript
import { preinit } from 'react-dom';
import { useEffect, useState } from 'react';

function ABTestingApp() {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    // A/B テストのバリアントを決定
    const testVariant = Math.random() < 0.5 ? 'A' : 'B';
    setVariant(testVariant);

    // バリアントに応じたリソースを初期化
    preinit(`https://example.com/variants/${testVariant}.css`, {
      as: 'style',
      precedence: 'high'
    });

    preinit(`https://example.com/variants/${testVariant}.js`, {
      as: 'script'
    });

    // 分析スクリプト
    preinit('https://analytics.example.com/tracker.js', {
      as: 'script',
      fetchPriority: 'low'
    });
  }, []);

  if (!variant) return <Loading />;

  return <App variant={variant} />;
}
```

### プログレッシブロード戦略

```javascript
import { preinit } from 'react-dom';
import { useEffect } from 'react';

function ProgressiveApp() {
  // 即座に必要なリソース
  preinit('https://example.com/critical.css', {
    as: 'style',
    precedence: 'high',
    fetchPriority: 'high'
  });

  useEffect(() => {
    // 少し遅れて読み込むリソース
    const timer1 = setTimeout(() => {
      preinit('https://example.com/deferred.css', {
        as: 'style',
        precedence: 'medium',
        fetchPriority: 'low'
      });
    }, 1000);

    // さらに遅れて読み込むリソース
    const timer2 = setTimeout(() => {
      preinit('https://example.com/lazy.js', {
        as: 'script',
        fetchPriority: 'low'
      });
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return <App />;
}
```

## トラブルシューティング

### リソースが読み込まれない

- URL が正しいか確認
- CORS 設定が適切か確認
- ネットワークタブでリクエストの状態を確認

### スタイルの適用順序が正しくない

`precedence` の値を確認し、適切なカスケード順序を設定してください。

```javascript
// 正しい順序
preinit('reset.css', { as: 'style', precedence: 'reset' });
preinit('base.css', { as: 'style', precedence: 'low' });
preinit('components.css', { as: 'style', precedence: 'medium' });
preinit('overrides.css', { as: 'style', precedence: 'high' });
```

### CSP エラー

Content Security Policy エラーが発生する場合、`nonce` を設定してください。

```javascript
function CSPApp({ cspNonce }) {
  preinit('https://example.com/script.js', {
    as: 'script',
    nonce: cspNonce
  });

  return <App />;
}
```

### パフォーマンスの問題

多すぎるリソースを初期化している可能性があります。本当に必要なリソースのみを初期化してください。

## 関連リソース

- [preload](/docs/frameworks/react/docs/reference/react-dom/preload.md)
- [preinitModule](/docs/frameworks/react/docs/reference/react-dom/preinitModule.md)
- [preconnect](/docs/frameworks/react/docs/reference/react-dom/preconnect.md)
- [React DOM API](/docs/frameworks/react/docs/reference/react-dom.md)
