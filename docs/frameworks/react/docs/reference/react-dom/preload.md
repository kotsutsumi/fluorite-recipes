# preload

`preload` は、後で使用する予定のリソース（スタイルシート、フォント、画像、外部スクリプトなど）を事前にフェッチするための関数です。リソースをダウンロードしますが、実行はしません。

## リファレンス

### `preload(href, options)`

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  preload('https://example.com/font.woff2', { as: 'font' });
  return <App />;
}
```

## パラメータ

### `href`

ダウンロードするリソースの URL を表す文字列。

### `options`

リソース読み込みの詳細を指定するオブジェクト。以下のプロパティを指定できます。

#### `as`（必須）

リソースの種類。以下のいずれかを指定します。

- `'audio'`: オーディオファイル
- `'document'`: HTML ドキュメント
- `'embed'`: `<embed>` 内に埋め込まれるリソース
- `'fetch'`: fetch や XHR でアクセスされるリソース
- `'font'`: フォントファイル
- `'image'`: 画像ファイル
- `'object'`: `<object>` 内に埋め込まれるリソース
- `'script'`: JavaScript ファイル
- `'style'`: CSS スタイルシート
- `'track'`: WebVTT ファイル
- `'video'`: ビデオファイル
- `'worker'`: JavaScript Web Worker または Shared Worker

#### `crossOrigin`

使用する CORS ポリシー。`'anonymous'` または `'use-credentials'` を指定できます。`as` が `'fetch'` に設定されている場合は必須です。

#### `referrerPolicy`

フェッチ時に送信する Referrer ヘッダー。以下のいずれかを指定できます。

- `'no-referrer'`
- `'no-referrer-when-downgrade'`
- `'origin'`
- `'origin-when-cross-origin'`
- `'same-origin'`
- `'strict-origin'`
- `'strict-origin-when-cross-origin'`
- `'unsafe-url'`

#### `integrity`

リソースの暗号化ハッシュ。真正性を検証するために使用します。

#### `type`

リソースの MIME タイプ。

#### `nonce`

厳格なコンテンツセキュリティポリシーを使用する場合の暗号化 nonce。

#### `fetchPriority`

リソース取得の相対的な優先度のヒント。以下のいずれかを指定できます。

- `'auto'`: 自動（デフォルト）
- `'high'`: 高優先度
- `'low'`: 低優先度

#### 画像専用オプション

画像をプリロードする場合、以下の追加オプションを使用できます。

##### `imageSrcSet`

レスポンシブ画像の `srcset` 文字列。

##### `imageSizes`

レスポンシブ画像の `sizes` 文字列。

## 返り値

`preload` は何も返しません。

## 使用法

### 外部スクリプトのプリロード

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  preload('https://example.com/script.js', { as: 'script' });
  return <App />;
}
```

### スタイルシートのプリロード

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  preload('https://example.com/styles.css', { as: 'style' });
  return <App />;
}
```

### フォントのプリロード

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  preload('https://example.com/font.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous'
  });
  return <App />;
}
```

### 画像のプリロード

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  preload('https://example.com/hero-image.jpg', {
    as: 'image',
    type: 'image/jpeg'
  });
  return <App />;
}
```

### レスポンシブ画像のプリロード

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  preload('https://example.com/hero-image.jpg', {
    as: 'image',
    imageSrcSet: 'hero-320w.jpg 320w, hero-640w.jpg 640w, hero-1280w.jpg 1280w',
    imageSizes: '(max-width: 640px) 100vw, 50vw'
  });
  return <App />;
}
```

### fetch リソースのプリロード

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  preload('https://api.example.com/data.json', {
    as: 'fetch',
    crossOrigin: 'anonymous'
  });
  return <App />;
}
```

### イベントハンドラ内でのプリロード

```javascript
import { preload } from 'react-dom';

function MediaGallery() {
  const handleMouseEnter = (imageUrl) => {
    // ユーザーが画像を見る可能性が高い
    preload(imageUrl, { as: 'image' });
  };

  return (
    <div>
      {images.map(img => (
        <div
          key={img.id}
          onMouseEnter={() => handleMouseEnter(img.url)}
        >
          <img src={img.thumbnail} alt={img.alt} />
        </div>
      ))}
    </div>
  );
}
```

### ビデオのプリロード

```javascript
import { preload } from 'react-dom';

function VideoPlayer() {
  preload('https://example.com/video.mp4', {
    as: 'video',
    type: 'video/mp4'
  });

  return (
    <video src="https://example.com/video.mp4" controls />
  );
}
```

### Web Worker のプリロード

```javascript
import { preload } from 'react-dom';

function WorkerApp() {
  preload('https://example.com/worker.js', {
    as: 'worker',
    type: 'application/javascript'
  });

  useEffect(() => {
    const worker = new Worker('https://example.com/worker.js');
    return () => worker.terminate();
  }, []);

  return <App />;
}
```

### 優先度を指定したプリロード

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  // 重要なリソース - 高優先度
  preload('https://example.com/critical.css', {
    as: 'style',
    fetchPriority: 'high'
  });

  // 重要でないリソース - 低優先度
  preload('https://example.com/analytics.js', {
    as: 'script',
    fetchPriority: 'low'
  });

  return <App />;
}
```

### セキュリティ設定を含むプリロード

```javascript
import { preload } from 'react-dom';

function SecureApp() {
  preload('https://cdn.example.com/library.js', {
    as: 'script',
    integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### 条件付きプリロード

```javascript
import { preload } from 'react-dom';

function ConditionalLoader({ userType }) {
  // ユーザータイプに応じてリソースをプリロード
  if (userType === 'premium') {
    preload('https://example.com/premium-features.js', { as: 'script' });
  } else {
    preload('https://example.com/basic-features.js', { as: 'script' });
  }

  return <App />;
}
```

### 複数のリソースの同時プリロード

```javascript
import { preload } from 'react-dom';

function AppRoot() {
  // 複数のリソースを同時にプリロード
  const resources = [
    { href: 'https://example.com/font1.woff2', as: 'font' },
    { href: 'https://example.com/font2.woff2', as: 'font' },
    { href: 'https://example.com/styles.css', as: 'style' },
    { href: 'https://example.com/hero.jpg', as: 'image' },
  ];

  resources.forEach(({ href, as }) => {
    preload(href, {
      as,
      ...(as === 'font' && { type: 'font/woff2', crossOrigin: 'anonymous' })
    });
  });

  return <App />;
}
```

## 重要な注意事項

### 同じリソースへの複数回の呼び出し

同じ `href` と `as` で `preload` を複数回呼び出しても、1 回呼び出した場合と同じ効果しかありません。

```javascript
// これらは同じ効果を持ちます
preload('https://example.com/image.jpg', { as: 'image' });
preload('https://example.com/image.jpg', { as: 'image' });
preload('https://example.com/image.jpg', { as: 'image' });
```

### 呼び出し可能な場所

`preload` は、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内など、さまざまな状況で呼び出すことができます。

```javascript
import { preload } from 'react-dom';
import { useEffect } from 'react';

function Example() {
  // レンダー中
  preload('https://example.com/image.jpg', { as: 'image' });

  // エフェクト内
  useEffect(() => {
    preload('https://example.com/data.json', {
      as: 'fetch',
      crossOrigin: 'anonymous'
    });
  }, []);

  // イベントハンドラ内
  const handleClick = () => {
    preload('https://example.com/video.mp4', { as: 'video' });
  };

  return <button onClick={handleClick}>読み込む</button>;
}
```

### サーバサイドレンダリング時の動作

サーバサイドレンダリングやサーバコンポーネントのレンダー時に `preload` を呼び出すと、HTML 出力にプリロードヒントが含まれます。

```javascript
// サーバコンポーネント
function ServerApp() {
  // これは HTML に <link rel="preload"> タグを生成します
  preload('https://example.com/font.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### preinit との違い

- `preload`: リソースをダウンロードするだけ（実行しない）
- `preinit`: リソースをダウンロードして実行する

```javascript
import { preload, preinit } from 'react-dom';

function Comparison() {
  // リソースをダウンロードするが実行しない
  preload('https://example.com/data.json', {
    as: 'fetch',
    crossOrigin: 'anonymous'
  });

  // リソースをダウンロードして実行する
  preinit('https://example.com/script.js', { as: 'script' });

  return <App />;
}
```

### フォントのプリロードには crossOrigin が必須

フォントをプリロードする場合、`crossOrigin` を指定する必要があります（同じオリジンでも）。

```javascript
// 正しい
preload('https://example.com/font.woff2', {
  as: 'font',
  crossOrigin: 'anonymous'
});

// 正しくない - crossOrigin が欠けている
preload('https://example.com/font.woff2', { as: 'font' });
```

## ベストプラクティス

### 1. 重要なリソースを早期にプリロード

ページの初期表示に必要なリソースは、できるだけ早くプリロードします。

```javascript
function App() {
  // Above the fold の重要なリソース
  preload('https://example.com/hero-image.jpg', {
    as: 'image',
    fetchPriority: 'high'
  });

  preload('https://example.com/critical-font.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
    fetchPriority: 'high'
  });

  return <AppContent />;
}
```

### 2. 適切な `as` 値を使用

リソースの種類に応じて、正しい `as` 値を指定します。間違った値を使用すると、プリロードが機能しません。

```javascript
function ResourceLoader() {
  // 正しい
  preload('https://example.com/styles.css', { as: 'style' });
  preload('https://example.com/font.woff2', { as: 'font' });
  preload('https://example.com/image.jpg', { as: 'image' });

  return <App />;
}
```

### 3. フェッチ優先度を活用

`fetchPriority` を使用して、リソースの読み込み順序を最適化します。

```javascript
function OptimizedApp() {
  // 最重要リソース
  preload('https://example.com/critical.css', {
    as: 'style',
    fetchPriority: 'high'
  });

  // 通常の優先度
  preload('https://example.com/normal.js', {
    as: 'script',
    fetchPriority: 'auto'
  });

  // 低優先度
  preload('https://example.com/analytics.js', {
    as: 'script',
    fetchPriority: 'low'
  });

  return <App />;
}
```

### 4. セキュリティを確保

外部リソースには `integrity` と `crossOrigin` を設定します。

```javascript
function SecureApp() {
  preload('https://cdn.example.com/library.js', {
    as: 'script',
    integrity: 'sha384-...',
    crossOrigin: 'anonymous'
  });

  return <App />;
}
```

### 5. レスポンシブ画像を適切にプリロード

レスポンシブ画像をプリロードする場合、`imageSrcSet` と `imageSizes` を使用します。

```javascript
function ResponsiveImageApp() {
  preload('https://example.com/hero.jpg', {
    as: 'image',
    imageSrcSet: `
      https://example.com/hero-320w.jpg 320w,
      https://example.com/hero-640w.jpg 640w,
      https://example.com/hero-1280w.jpg 1280w
    `,
    imageSizes: '(max-width: 640px) 100vw, 50vw'
  });

  return <App />;
}
```

### 6. 過度なプリロードを避ける

多すぎるリソースをプリロードすると、帯域幅を無駄に消費し、重要なリソースのロードが遅れる可能性があります。

```javascript
// 避けるべきパターン
function OverloadedApp() {
  // 多すぎるリソースのプリロード
  for (let i = 0; i < 100; i++) {
    preload(`https://example.com/image${i}.jpg`, { as: 'image' });
  }
}

// 推奨パターン
function OptimizedApp() {
  // 本当に必要なリソースのみをプリロード
  preload('https://example.com/hero-image.jpg', { as: 'image' });
  preload('https://example.com/critical-font.woff2', { as: 'font' });
}
```

### 7. ユーザーインタラクションを予測

ユーザーの次のアクションを予測してリソースをプリロードします。

```javascript
function ProductList({ products }) {
  const handleProductHover = (product) => {
    // ユーザーが製品詳細を見る可能性が高い
    preload(product.detailImage, { as: 'image' });
    preload(`/api/products/${product.id}`, {
      as: 'fetch',
      crossOrigin: 'anonymous'
    });
  };

  return (
    <div>
      {products.map(product => (
        <div
          key={product.id}
          onMouseEnter={() => handleProductHover(product)}
        >
          {product.name}
        </div>
      ))}
    </div>
  );
}
```

## 実践的な例

### カルーセルのプリロード

```javascript
import { preload } from 'react-dom';
import { useState, useEffect } from 'react';

function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 現在の画像をプリロード
    preload(images[currentIndex], { as: 'image' });

    // 次の画像をプリロード
    const nextIndex = (currentIndex + 1) % images.length;
    preload(images[nextIndex], { as: 'image' });

    // 前の画像もプリロード
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    preload(images[prevIndex], { as: 'image' });
  }, [currentIndex, images]);

  return (
    <div>
      <img src={images[currentIndex]} alt="" />
      <button onClick={() => setCurrentIndex(i => (i - 1 + images.length) % images.length)}>
        前へ
      </button>
      <button onClick={() => setCurrentIndex(i => (i + 1) % images.length)}>
        次へ
      </button>
    </div>
  );
}
```

### ページ遷移のプリロード

```javascript
import { preload } from 'react-dom';
import { useRouter } from 'next/router';

function Navigation() {
  const router = useRouter();

  const handleLinkHover = (path) => {
    // ページのリソースをプリロード
    preload(`/_next/data/${path}.json`, {
      as: 'fetch',
      crossOrigin: 'anonymous'
    });
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <nav>
      <button
        onMouseEnter={() => handleLinkHover('/about')}
        onClick={() => handleNavigate('/about')}
      >
        About
      </button>
      <button
        onMouseEnter={() => handleLinkHover('/contact')}
        onClick={() => handleNavigate('/contact')}
      >
        Contact
      </button>
    </nav>
  );
}
```

### メディアギャラリーの最適化

```javascript
import { preload } from 'react-dom';
import { useState } from 'react';

function MediaGallery({ items }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleThumbnailClick = (item) => {
    // フル解像度の画像をプリロード
    preload(item.fullSizeUrl, {
      as: 'image',
      fetchPriority: 'high'
    });

    setSelectedItem(item);
  };

  const handleThumbnailHover = (item) => {
    // ホバー時に画像をプリロード（投機的）
    preload(item.fullSizeUrl, { as: 'image' });
  };

  return (
    <div>
      <div className="thumbnails">
        {items.map(item => (
          <img
            key={item.id}
            src={item.thumbnailUrl}
            alt={item.alt}
            onClick={() => handleThumbnailClick(item)}
            onMouseEnter={() => handleThumbnailHover(item)}
          />
        ))}
      </div>
      {selectedItem && (
        <div className="full-size">
          <img src={selectedItem.fullSizeUrl} alt={selectedItem.alt} />
        </div>
      )}
    </div>
  );
}
```

### ビデオプレーヤーの最適化

```javascript
import { preload } from 'react-dom';
import { useState, useEffect } from 'react';

function VideoPlayer({ videos, currentVideoId }) {
  const currentVideo = videos.find(v => v.id === currentVideoId);
  const currentIndex = videos.findIndex(v => v.id === currentVideoId);

  useEffect(() => {
    // 現在のビデオをプリロード
    if (currentVideo) {
      preload(currentVideo.url, {
        as: 'video',
        type: currentVideo.mimeType
      });
    }

    // 次のビデオをプリロード
    const nextVideo = videos[currentIndex + 1];
    if (nextVideo) {
      preload(nextVideo.url, {
        as: 'video',
        type: nextVideo.mimeType,
        fetchPriority: 'low'
      });
    }
  }, [currentVideoId, videos, currentIndex, currentVideo]);

  return (
    <video src={currentVideo?.url} controls />
  );
}
```

### 動的コンテンツのプリロード

```javascript
import { preload } from 'react-dom';
import { useEffect } from 'react';

function DynamicContent({ contentType }) {
  useEffect(() => {
    // コンテンツタイプに応じてリソースをプリロード
    const resources = {
      article: [
        { href: '/fonts/article-font.woff2', as: 'font' },
        { href: '/styles/article.css', as: 'style' },
      ],
      gallery: [
        { href: '/scripts/lightbox.js', as: 'script' },
        { href: '/styles/gallery.css', as: 'style' },
      ],
      video: [
        { href: '/scripts/video-player.js', as: 'script' },
        { href: '/styles/video-player.css', as: 'style' },
      ],
    };

    const contentResources = resources[contentType] || [];
    contentResources.forEach(({ href, as }) => {
      preload(href, {
        as,
        ...(as === 'font' && { type: 'font/woff2', crossOrigin: 'anonymous' })
      });
    });
  }, [contentType]);

  return <Content type={contentType} />;
}
```

## トラブルシューティング

### プリロードされたリソースが使用されない

プリロードされたリソースが実際に使用されない場合、ブラウザの警告が表示されます。以下を確認してください。

- プリロードの URL と実際に使用される URL が完全に一致しているか
- `as` の値が正しいか
- リソースが実際に使用されているか

```javascript
// URL は完全に一致する必要があります
preload('https://example.com/image.jpg', { as: 'image' });
// <img src="https://example.com/image.jpg" /> // 一致
// <img src="https://example.com/image.jpg?v=2" /> // 不一致
```

### CORS エラー

クロスオリジンリソースをプリロードする場合、適切な `crossOrigin` 設定が必要です。

```javascript
// フォントは常に crossOrigin が必要
preload('https://cdn.example.com/font.woff2', {
  as: 'font',
  crossOrigin: 'anonymous'
});

// fetch リソースも crossOrigin が必要
preload('https://api.example.com/data.json', {
  as: 'fetch',
  crossOrigin: 'anonymous'
});
```

### プリロードが遅すぎる

プリロードは、リソースが必要になる十分に前に行う必要があります。

```javascript
// 悪い例: 使用直前にプリロード
function BadExample() {
  const loadImage = () => {
    preload('image.jpg', { as: 'image' });
    setImageSrc('image.jpg'); // すぐに使用
  };
}

// 良い例: 早期にプリロード
function GoodExample() {
  useEffect(() => {
    preload('image.jpg', { as: 'image' });
  }, []);

  const loadImage = () => {
    setImageSrc('image.jpg'); // 既にプリロード済み
  };
}
```

### 帯域幅の無駄遣い

使用されないリソースをプリロードすると、帯域幅を無駄に消費します。

```javascript
// 条件付きでプリロード
function ConditionalPreload({ showFeature }) {
  if (showFeature) {
    preload('feature-resource.js', { as: 'script' });
  }

  return showFeature ? <Feature /> : null;
}
```

## 関連リソース

- [preinit](/docs/frameworks/react/docs/reference/react-dom/preinit.md)
- [preloadModule](/docs/frameworks/react/docs/reference/react-dom/preloadModule.md)
- [preconnect](/docs/frameworks/react/docs/reference/react-dom/preconnect.md)
- [prefetchDNS](/docs/frameworks/react/docs/reference/react-dom/prefetchDNS.md)
- [React DOM API](/docs/frameworks/react/docs/reference/react-dom.md)
