# `<script>`

ブラウザ組み込みの `<script>` コンポーネントを利用することで、ドキュメントにスクリプトを追加できます。

```jsx
<script src="https://example.com/script.js" async />
```

## リファレンス

### `<script>`

ドキュメントに外部またはインラインのスクリプトを追加するには、ブラウザ組み込みの `<script>` コンポーネントをレンダーします。コンポーネントの任意の場所から `<script>` をレンダーでき、React は DOM 要素を適切な場所に配置します。

```jsx
<script src="https://example.com/script.js" async />
```

#### Props

`<script>` は、すべての一般的な要素の props をサポートしています。

**`children` または `src` のいずれかが必要です:**

- **`children`**: 文字列。インラインスクリプトのソースコードです。
- **`src`**: 文字列。外部スクリプトの URL です。

**サポートされる Props:**

- **`async`**: ブール値。ブラウザがドキュメントの残りの処理を続行する前にスクリプトの実行を待つことを遅らせます。これはパフォーマンスにとって望ましい動作です。
- **`crossOrigin`**: 文字列。使用する CORS ポリシーです。可能な値は `anonymous` と `use-credentials` です。
- **`fetchPriority`**: 文字列。複数のスクリプトを同時にフェッチする際に、ブラウザがスクリプトの優先順位を決定できるようにします。`"high"`、`"low"`、または `"auto"`(デフォルト)を指定できます。
- **`integrity`**: 文字列。スクリプトの暗号化ハッシュで、その信頼性を検証します。
- **`noModule`**: ブール値。ES モジュールをサポートするブラウザでスクリプトを無効にします。レガシーブラウザ用のフォールバックスクリプトを許可します。
- **`nonce`**: 文字列。厳格なコンテンツセキュリティポリシーを使用する際にリソースを許可するための暗号化 nonce です。
- **`referrer`**: 文字列。スクリプトをフェッチする際、および後でスクリプトがフェッチするリソースに対して送信する Referer ヘッダーを指定します。
- **`type`**: 文字列。スクリプトが従来のスクリプト、ES モジュール、またはインポートマップのいずれであるかを指定します。

**React の特別な動作を無効にする Props:**

以下の props を使用すると、React による特別な扱いが無効になります:

- **`onError`**: 関数。スクリプトのロードに失敗したときに呼び出されます。
- **`onLoad`**: 関数。スクリプトのロードが完了したときに呼び出されます。

**React で使用が推奨されない Props:**

- **`blocking`**: 文字列。`"render"` に設定すると、スクリプトがロードされるまでページをレンダーしないようブラウザに指示します。React は Suspense を使用してより細かい制御を提供します。

#### 特別なレンダリング動作

React は、`<script>` コンポーネントを移動し、同じスクリプトを重複排除し、スクリプトのロード中にサスペンドすることができます。

この動作を利用するには、`src` と `async={true}` props を指定する必要があります。React は、同じ `src` を持つスクリプトを重複排除します。スクリプトを安全に移動するには、`async` prop が true である必要があります。

**特別な動作の詳細:**

- `src` と `async={true}` を持つ外部スクリプトは、React によって `<head>` に移動されます
- 同じ `src` を持つスクリプトは重複排除されます
- スクリプトがレンダーされた後に props が変更されても、React は DOM を更新しません

#### 注意点

- `onLoad` または `onError` ハンドラを提供すると、特別な動作は行われません。これらのハンドラは、スクリプトのロードを手動で管理していることを示すためです。
- スクリプトがレンダーされた後に props を変更しても、React は効果がありません。

## 使用法

### 外部スクリプトをレンダーする

コンポーネントが特定のスクリプトに依存している場合、そのコンポーネント内で `<script>` をレンダーできます。

外部スクリプトには `src` と `async` props を指定します。`async={true}` を設定すると、ブラウザがドキュメントの残りの処理を続行する前にスクリプトの実行を待つことを遅らせます。これはパフォーマンスにとって望ましい動作です。

```jsx
function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}
```

### スクリプトのロードイベントを処理する

スクリプトがいつロードを完了したか、またはロードに失敗したかを検出できます。`onLoad` と `onError` イベントハンドラを提供します:

```jsx
import { useState } from 'react';

function AnalyticsTracker() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
      <script
        async
        src="https://analytics.example.com/tracker.js"
        onLoad={() => setLoaded(true)}
        onError={(e) => setError(e)}
      />
      {loaded && <p>Analytics スクリプトが読み込まれました</p>}
      {error && <p>スクリプトの読み込みに失敗しました</p>}
    </>
  );
}
```

### インラインスクリプトをレンダーする

インラインスクリプトを含めるには、スクリプトのソースコードを子要素として `<script>` コンポーネントをレンダーします。

インラインスクリプトは重複排除されず、ドキュメントの `<head>` に移動されません。また、外部リソースをロードしないため、スクリプトがロードされるのを待ってコンポーネントをサスペンドすることはありません。

```jsx
function Tracking() {
  return (
    <script>
      {`
        ga('send', 'pageview');
      `}
    </script>
  );
}
```

### Google Analytics の統合例

```jsx
export default function App() {
  return (
    <>
      {/* Google Analytics 外部スクリプト */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
      />

      {/* Google Analytics 初期化スクリプト */}
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        `}
      </script>

      <HomePage />
    </>
  );
}
```

### サードパーティライブラリの統合

```jsx
function MapComponent() {
  return (
    <>
      {/* Leaflet 地図ライブラリ */}
      <script
        async
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-..."
        crossOrigin=""
        onLoad={() => console.log('Leaflet loaded')}
      />

      <div id="map" style={{ height: '400px' }} />
    </>
  );
}
```

### スクリプトの重複排除

同じ `src` を持つ複数のスクリプトがレンダーされても、React はドキュメントに1つのみを含めます:

```jsx
function ComponentA() {
  return (
    <>
      <script async src="shared-library.js" />
      <div>コンポーネント A</div>
    </>
  );
}

function ComponentB() {
  return (
    <>
      <script async src="shared-library.js" />
      <div>コンポーネント B</div>
    </>
  );
}

// 両方のコンポーネントがレンダーされても、shared-library.js は一度だけロードされます
export default function App() {
  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  );
}
```

### ES モジュールスクリプト

ES モジュールとしてスクリプトをロードするには、`type="module"` を指定します:

```jsx
function ModernComponent() {
  return (
    <>
      <script type="module" src="/js/modern-script.js" />
      <div>モダン JavaScript を使用</div>
    </>
  );
}
```

### レガシーブラウザのフォールバック

モダンブラウザとレガシーブラウザの両方をサポート:

```jsx
export default function App() {
  return (
    <>
      {/* モダンブラウザ用 */}
      <script type="module" src="/js/modern.js" />

      {/* レガシーブラウザ用フォールバック */}
      <script noModule src="/js/legacy.js" />

      <HomePage />
    </>
  );
}
```

### セキュリティ: Integrity と Nonce

スクリプトの整合性を検証し、コンテンツセキュリティポリシーを適用:

```jsx
export default function SecureApp() {
  return (
    <>
      {/* Subresource Integrity (SRI) */}
      <script
        async
        src="https://cdn.example.com/library.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossOrigin="anonymous"
      />

      {/* Content Security Policy Nonce */}
      <script nonce="random-nonce-value">
        {`console.log('Secure inline script');`}
      </script>

      <HomePage />
    </>
  );
}
```

### フェッチ優先度の指定

重要なスクリプトに高い優先度を設定:

```jsx
export default function App() {
  return (
    <>
      {/* クリティカルなスクリプト - 高優先度 */}
      <script
        async
        src="/js/critical.js"
        fetchPriority="high"
      />

      {/* 非クリティカルなスクリプト - 低優先度 */}
      <script
        async
        src="/js/analytics.js"
        fetchPriority="low"
      />

      <HomePage />
    </>
  );
}
```

## 重要な注意事項

### パフォーマンスのベストプラクティス

- 可能な限り `async` 属性を使用してページのブロッキングを防ぐ
- 重要でないスクリプトには `fetchPriority="low"` を使用
- 重複を避けるために同じ `src` を使用
- 大きなスクリプトは遅延ロードを検討

### セキュリティのベストプラクティス

- CDN からのスクリプトには常に `integrity` 属性を使用
- クロスオリジンリソースには `crossOrigin` を指定
- CSP を使用する場合は `nonce` を提供
- 信頼できないソースからのインラインスクリプトを避ける

### デバッグとトラブルシューティング

スクリプトが読み込まれない場合:

1. ブラウザのコンソールでエラーを確認
2. ネットワークタブでリクエストステータスを確認
3. CORS エラーの場合、`crossOrigin` 属性を確認
4. CSP エラーの場合、`nonce` または `integrity` を確認
5. `onError` ハンドラを追加してエラーをキャッチ
