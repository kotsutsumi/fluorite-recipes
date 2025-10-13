# Expo Webpackからの移行

Expo WebpackからExpo Routerへの移行方法を学びます。

## 概要

Expo Routerは、Web、iOS、Android全体で動作するユニバーサルアプリを構築するための新しいアプローチです。

**重要**: `@expo/webpack-config` は非推奨であり、新機能の更新は受けられません。

## 主な違い

### 1. バンドラーの変更

**Expo Webpack**:
- Webpack bundlerを使用
- Web専用の設定

**Expo Router**:
- Metro bundlerを使用（React Nativeと同じ）
- クロスプラットフォーム対応
- 静的レンダリング、SEO、ユニバーサルナビゲーションをサポート

### 2. プロジェクト構造

**Expo Webpack**:
```
project/
├── web/
│   └── index.html
├── assets/
└── App.tsx
```

**Expo Router**:
```
project/
├── app/
│   ├── _layout.tsx
│   └── index.tsx
├── public/
│   └── favicon.ico
└── package.json
```

### 3. 静的ファイルの配置

**Expo Webpack**: `assets/` ディレクトリ

**Expo Router**: `public/` ディレクトリ

**変更点**：
```bash
# 静的ファイルを移動
mkdir public
mv assets/favicon.ico public/
```

### 4. ビルドコマンド

**Expo Webpack**:
```bash
expo build:web
```

**Expo Router**:
```bash
npx expo export --platform web
```

### 5. 出力ディレクトリ

**Expo Webpack**: `web-build/`

**Expo Router**: `dist/`

## HTMLとレンダリング

### レンダリングパターン

Expo Routerは2つのレンダリングパターンをサポートします。

#### 1. 静的レンダリング（推奨）

各ルートのHTMLを生成します。

**設定**：
```json
{
  "expo": {
    "web": {
      "output": "static"
    }
  }
}
```

**利点**：
- SEO対応
- 高速な初期ロード
- 静的ホスティング対応

#### 2. シングルページアプリケーション

単一のHTMLファイルを生成します。

**設定**：
```json
{
  "expo": {
    "web": {
      "output": "single"
    }
  }
}
```

**利点**：
- シンプルなデプロイ
- クライアント側ルーティング

## 設定の更新

### Webpack設定からMetro設定へ

**Expo Webpack**:
```javascript
// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // カスタム設定
  return config;
};
```

**Expo Router**:
```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// カスタム設定
config.resolver.sourceExts.push('cjs');

module.exports = config;
```

### Babel設定

Babel設定は基本的に同じですが、Expo Routerプラグインを追加します。

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Expo Router required
      'expo-router/babel',
    ],
  };
};
```

### ベースパス設定

**Expo Webpack**:
```javascript
// webpack.config.js
config.output.publicPath = '/my-app/';
```

**Expo Router**:
```json
{
  "expo": {
    "web": {
      "basePath": "/my-app"
    }
  }
}
```

## 移行手順

### ステップ1: 依存関係の更新

```bash
# Expo Routerのインストール
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# Webpack設定の削除
npm uninstall @expo/webpack-config
```

### ステップ2: package.jsonの更新

```json
{
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:web": "npx expo export --platform web"
  }
}
```

### ステップ3: プロジェクト構造の変更

```bash
# appディレクトリの作成
mkdir app

# エントリーポイントの作成
touch app/_layout.tsx
touch app/index.tsx

# publicディレクトリの作成
mkdir public
```

### ステップ4: ルーティングロジックの移行

**Expo Webpack**:
```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Expo Router**:
```
app/
├── _layout.tsx
├── index.tsx
└── about.tsx
```

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}

// app/index.tsx
export default function Home() {
  return <Text>Home</Text>;
}

// app/about.tsx
export default function About() {
  return <Text>About</Text>;
}
```

### ステップ5: 静的リソースの処理

**Expo Webpack**:
```typescript
import logo from './assets/logo.png';

<Image source={logo} />
```

**Expo Router**:
```typescript
// Web: publicディレクトリから
<Image source={{ uri: '/logo.png' }} />

// Native: require()を使用
<Image source={require('../assets/logo.png')} />
```

**クロスプラットフォーム対応**：
```typescript
import { Platform } from 'react-native';

const logoSource = Platform.select({
  web: { uri: '/logo.png' },
  default: require('../assets/logo.png'),
});

<Image source={logoSource} />
```

### ステップ6: ビルドとエクスポートスクリプトの更新

**package.json**:
```json
{
  "scripts": {
    "build:web": "npx expo export --platform web",
    "serve": "npx serve dist"
  }
}
```

### ステップ7: WebとNativeの互換性検証

```bash
# Webでテスト
npx expo start --web

# iOSでテスト
npx expo start --ios

# Androidでテスト
npx expo start --android
```

## 追加機能

### 1. 自動ディープリンク

Expo Routerは自動的にディープリンクを設定します。

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

### 2. 型安全なルート

TypeScriptプロジェクトで自動的に型を生成します。

```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### 3. 遅延バンドリング

必要な時にのみコードをロードします。

```typescript
// app.config.ts
export default {
  expo: {
    web: {
      asyncRoutes: {
        web: true,
      },
    },
  },
};
```

### 4. モジュラーHTMLテンプレート

カスタムHTMLテンプレートを使用できます。

```typescript
// app/_layout.tsx
import { Head } from 'expo-router';

export default function Layout() {
  return (
    <>
      <Head>
        <title>My App</title>
        <meta name="description" content="My awesome app" />
      </Head>
      <Slot />
    </>
  );
}
```

## 設定の比較

### Webpack設定 vs Metro設定

| 設定項目 | Expo Webpack | Expo Router |
|---------|-------------|-------------|
| 設定ファイル | `webpack.config.js` | `metro.config.js` |
| エントリーポイント | `App.tsx` | `expo-router/entry` |
| 出力ディレクトリ | `web-build/` | `dist/` |
| 静的ファイル | `assets/` | `public/` |
| ベースパス | `publicPath` | `basePath` in app.json |
| ビルドコマンド | `expo build:web` | `npx expo export --platform web` |

### app.json設定

**Expo Webpack**:
```json
{
  "expo": {
    "web": {
      "favicon": "./assets/favicon.ico"
    }
  }
}
```

**Expo Router**:
```json
{
  "expo": {
    "web": {
      "favicon": "./public/favicon.ico",
      "output": "static",
      "bundler": "metro"
    }
  }
}
```

## ベストプラクティス

### 1. 段階的な移行

一度にすべてを移行するのではなく、段階的に移行します。

1. 依存関係の更新
2. プロジェクト構造の変更
3. ルーティングロジックの移行
4. 静的リソースの移動
5. ビルドとテスト

### 2. クロスプラットフォーム対応

Web、iOS、Androidすべてで動作することを確認します。

```typescript
import { Platform } from 'react-native';

const config = Platform.select({
  web: {
    // Web専用設定
  },
  ios: {
    // iOS専用設定
  },
  android: {
    // Android専用設定
  },
});
```

### 3. 静的レンダリングの活用

SEOが重要な場合は、静的レンダリングを使用します。

```json
{
  "expo": {
    "web": {
      "output": "static"
    }
  }
}
```

### 4. 型安全性の活用

TypeScriptと型付きルートを活用します。

```typescript
// 型チェックされる
router.push('/about');

// エラー
router.push('/abut'); // タイプミス
```

## よくある問題と解決策

### 問題1: 静的ファイルが見つからない

**原因**: ファイルが `public/` ディレクトリにない。

**解決策**：
```bash
# assetsからpublicへ移動
mv assets/favicon.ico public/
```

### 問題2: ビルドが失敗する

**原因**: Webpack設定が残っている。

**解決策**：
```bash
# Webpack設定を削除
rm webpack.config.js
rm -rf web-build
```

### 問題3: ルーティングが機能しない

**原因**: `main` エントリーポイントが正しくない。

**解決策**：
```json
{
  "main": "expo-router/entry"
}
```

### 問題4: Metro設定が適用されない

**原因**: キャッシュが残っている。

**解決策**：
```bash
npx expo start --clear
```

## まとめ

Expo WebpackからExpo Routerへの移行は、以下のステップで実行できます：

1. **依存関係の更新**: Expo Routerのインストール、Webpack設定の削除
2. **プロジェクト構造の変更**: `app` ディレクトリの作成、`public` ディレクトリへの移動
3. **ルーティングロジックの移行**: ファイルベースルーティングへの変換
4. **静的リソースの処理**: `public/` ディレクトリへの移動、クロスプラットフォーム対応
5. **ビルドスクリプトの更新**: `npx expo export --platform web` の使用
6. **互換性検証**: Web、iOS、Androidでのテスト

**主な利点**：
- クロスプラットフォーム対応（Web、iOS、Android）
- Metro bundlerによる一貫した開発体験
- 自動ディープリンク
- 型安全なルート
- 静的レンダリングとSEO対応
- モジュラーHTMLテンプレート

**推奨アプローチ**：
- 段階的な移行
- クロスプラットフォーム対応の確認
- 静的レンダリングの活用
- 型安全性の活用

これらのガイドラインに従って、Expo WebpackからExpo Routerへのスムーズな移行を実現できます。
