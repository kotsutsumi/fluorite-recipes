# Metroバンドラーのカスタマイズ

## 概要

MetroはExpo CLIが開発時およびエクスポート時に使用するバンドラーです。React Native向けに最適化されており、FacebookやInstagramなどの大規模アプリケーションで使用されています。

## カスタマイズの基本

### metro.config.jsの作成

プロジェクトルートに`metro.config.js`ファイルを作成します：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### テンプレートの生成

Expo CLIを使用してテンプレートを生成できます：

```bash
npx expo customize metro.config.js
```

## アセット管理

### カスタムアセット拡張子の追加

Metroは、ソースファイルとアセットファイルの拡張子を明示的に定義する必要があります。

#### 例：SVGファイルのサポート

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('svg');

module.exports = config;
```

#### 例：カスタムフォントの追加

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // アセット拡張子を追加
  'ttf',
  'otf',
  'woff',
  'woff2'
);

module.exports = config;
```

### ソース拡張子の管理

特定の拡張子をソースファイルとして扱う場合：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// .svgをソースファイルとして扱い、アセットから削除
config.resolver.sourceExts.push('svg');
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);

module.exports = config;
```

## モジュール解決のエイリアス設定

### 基本的なエイリアス

プロジェクト内でパスエイリアスを作成できます：

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@components/')) {
    const componentPath = path.resolve(
      __dirname,
      'src/components',
      moduleName.replace('@components/', '')
    );
    return context.resolveRequest(context, componentPath, platform);
  }

  // デフォルトの解決を使用
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

使用例：

```typescript
// 以前
import Button from '../../../components/Button';

// エイリアス使用後
import Button from '@components/Button';
```

### プラットフォーム固有のエイリアス

プラットフォームごとに異なるモジュールを解決できます：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'my-module') {
    if (platform === 'web') {
      return context.resolveRequest(context, './web/my-module', platform);
    }
    return context.resolveRequest(context, './native/my-module', platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

## Webサポート

### Metro Web Bundlerの有効化

`app.json`でMetro Web Bundlerを有効にします：

```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

### 静的ファイルのホスティング

`public/`ディレクトリからの静的ファイルホスティングをサポートしています：

```
public/
├── robots.txt
├── sitemap.xml
└── images/
    └── logo.png
```

これらのファイルは、`/robots.txt`、`/sitemap.xml`、`/images/logo.png`としてアクセス可能になります。

## 追加機能

### バンドル分割

コード分割を設定して、バンドルサイズを削減できます：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
```

### Tree Shaking

未使用のコードを削除するTree Shakingを有効にします：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = config;
```

### Minification

圧縮設定をカスタマイズできます：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierPath = 'metro-minify-terser';
config.transformer.minifierConfig = {
  ecma: 8,
  keep_classnames: true,
  keep_fnames: true,
  module: true,
  mangle: {
    module: true,
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = config;
```

### TypeScriptサポート

TypeScriptの設定をカスタマイズできます：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('ts', 'tsx');

module.exports = config;
```

### CSS統合

CSSのインポートをサポートします（Web）：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// CSSサポートはデフォルトで有効
// カスタマイズは不要

module.exports = config;
```

## キャッシュ管理

### キャッシュのクリア

開発中にキャッシュをクリアする必要がある場合：

```bash
npx expo start --clear
```

### カスタムキャッシュディレクトリ

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.cacheStores = [
  new (require('metro-cache').FileStore)({
    root: path.join(__dirname, '.metro-cache'),
  }),
];

module.exports = config;
```

## デバッグ

### 詳細ログの有効化

```bash
EXPO_DEBUG=true npx expo start
```

### Metro設定のテスト

設定が正しいか確認します：

```bash
npx expo config --type metro
```

## ベストプラクティス

### 1. デフォルト設定から開始

常に`getDefaultConfig`から開始し、必要な変更のみを追加してください。

### 2. 変更を文書化

設定の変更理由をコメントで文書化してください。

### 3. パフォーマンスをテスト

カスタマイズ後、ビルド時間とバンドルサイズをテストしてください。

### 4. チーム全体で共有

`metro.config.js`をバージョン管理に含めて、チーム全体で同じ設定を共有してください。

## まとめ

Metroバンドラーは、Expoプロジェクトのビルドとバンドルプロセスをカスタマイズするための強力な機能を提供します。アセット管理、モジュール解決、Webサポート、最適化など、さまざまなニーズに対応できます。
