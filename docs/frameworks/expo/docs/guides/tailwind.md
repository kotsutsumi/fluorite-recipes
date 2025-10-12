# ExpoでTailwind CSSを使用

## 主要なポイント

- **Tailwind CSSは主にWebプラットフォームでサポート**されています
- **ユニバーサルサポート**（すべてのプラットフォーム）には、NativeWindを使用してください
- 複数のプロジェクトファイルで設定が必要です

## 前提条件

### Metro Webバンドラーの確認

`app.json`でMetro Webバンドラーが有効になっていることを確認します：

```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

### 変更が必要なファイル

以下のファイルを変更する準備をしてください：

- `app.json`
- `package.json`
- `global.css`
- `app/_layout.tsx`または`index.js`

## Tailwind CSS v3の設定手順

### 1. 依存関係のインストール

```bash
npx expo install tailwindcss@3 postcss autoprefixer --dev
npx tailwindcss init -p
```

これにより、以下のファイルが生成されます：

- `tailwind.config.js`
- `postcss.config.js`

### 2. tailwind.config.jsの設定

`tailwind.config.js`を以下のように設定します：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. global.cssの作成

プロジェクトルートに`global.css`を作成します：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. global.cssのインポート

`app/_layout.tsx`または`index.js`で`global.css`をインポートします：

```typescript
import '../global.css';

export default function RootLayout() {
  return (
    // レイアウトコンテンツ
  );
}
```

### 5. プロジェクトの起動

```bash
npx expo start
```

## 使用方法

### DOMelementでの使用

Tailwindクラスを直接DOMelementで使用できます：

```typescript
export default function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello, Tailwind!
      </h1>
    </div>
  );
}
```

### React Native Webでの使用

React Native Webでは、`{ $$css: true }`構文を使用します：

```typescript
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ $$css: true, _: 'flex items-center justify-center h-screen bg-gray-100' }}>
      <Text style={{ $$css: true, _: 'text-4xl font-bold text-blue-600' }}>
        Hello, Tailwind!
      </Text>
    </View>
  );
}
```

### Webのみでの使用

Android/iOSではネイティブにサポートされていません。Web専用の機能として使用してください。

## モバイルでの代替案

### 1. NativeWindを使用

ユニバーサルサポートには、NativeWindを使用してください：

```bash
npm install nativewind
npm install --save-dev tailwindcss
```

### 2. WebViewでレンダリング

DOM componentsを使用してTailwindをWebViewでレンダリングします：

```typescript
'use dom';

export default function TailwindComponent() {
  return (
    <div className="p-4 bg-blue-500 text-white">
      <h1 className="text-2xl">This uses Tailwind</h1>
    </div>
  );
}
```

## トラブルシューティング

### CSSが動作しない

`metro.config.js`でCSSが有効になっていることを確認してください：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### カスタムキャッシュ設定

必要に応じて、`FileStore`を拡張してカスタムキャッシュ設定を行います：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.cacheStores = [
  new (require('metro-cache').FileStore)({
    root: require('path').join(__dirname, '.metro-cache'),
  }),
];

module.exports = config;
```

### ホットリロードが動作しない

開発サーバーを再起動してください：

```bash
# サーバーを停止（Ctrl+C）
npx expo start --clear
```

## Tailwind CSSのカスタマイズ

### カスタムカラーの追加

`tailwind.config.js`でカスタムカラーを定義します：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
      },
    },
  },
}
```

### カスタムユーティリティの追加

カスタムユーティリティクラスを`global.css`に追加します：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .custom-utility {
    @apply p-4 bg-blue-500 text-white rounded-lg;
  }
}
```

### レスポンシブデザイン

Tailwindのレスポンシブユーティリティを使用します：

```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
  レスポンシブコンテンツ
</div>
```

## ベストプラクティス

### 1. Webのみで使用

Tailwind CSSはWeb専用として使用し、モバイルにはNativeWindを使用してください。

### 2. クラス名の整理

長いクラス名は、コンポーネントまたはカスタムクラスに抽出してください。

### 3. パフォーマンスの最適化

未使用のスタイルをパージしてバンドルサイズを削減してください（Tailwind v3では自動）。

## まとめ

Tailwind CSSはExpoのWebプラットフォームで使用できます。モバイルプラットフォームでのユニバーサルサポートには、NativeWindを使用することを検討してください。
