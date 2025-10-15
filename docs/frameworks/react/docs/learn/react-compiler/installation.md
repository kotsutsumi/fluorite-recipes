# インストール

React Compiler をプロジェクトにインストールして設定する方法を学びます。

## このページで学ぶこと

- React Compiler のインストール方法
- 異なるビルドツールの基本設定
- セットアップが動作していることの確認方法

## 前提条件

React Compiler は React 19 で最適に動作するように設計されていますが、React 17 と 18 もサポートしています。詳細については、[React バージョン互換性](/reference/react-compiler/target)を参照してください。

> **注意**
>
> React Compiler は現在 RC 段階です。最新のリリース候補バージョンを取得するには `@rc` タグを使用してインストールしてください。

## インストール

React Compiler を `devDependency` としてインストールします:

**npm を使用:**

```bash
npm install -D babel-plugin-react-compiler@rc
```

**Yarn を使用:**

```bash
yarn add -D babel-plugin-react-compiler@rc
```

**pnpm を使用:**

```bash
pnpm install -D babel-plugin-react-compiler@rc
```

## 基本セットアップ

React Compiler は、デフォルトで追加の設定なしで動作するように設計されています。ただし、特別な状況（たとえば、React 19 以下のバージョンをターゲットにする場合）で設定が必要な場合は、[コンパイラオプションリファレンス](/reference/react-compiler/configuration)を参照してください。

> **重要**
>
> React Compiler は、Babel プラグインパイプラインで**最初**に実行する必要があります。コンパイラは、適切な分析のために元のソース情報を必要とします。

### Babel

`babel.config.js` を作成または更新します:

```javascript
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // must run first!
    // ... other plugins
  ],
  // ... other config
};
```

### Vite

Vite を使用する場合、`vite-plugin-react` にプラグインを追加できます:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Next.js

Next.js には React Compiler の実験的なサポートが組み込まれています。`next.config.js` で有効にします:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

コンパイラオプションを設定する必要がある場合:

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: {
      // コンパイラオプションをここに記述
      compilationMode: 'annotation',
    },
  },
};

module.exports = nextConfig;
```

### React Router

React Router の Vite プラグインを使用している場合:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';

export default defineConfig({
  plugins: [
    reactRouter({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Remix

Remix で React Compiler を使用するには、`vite.config.js` でプラグインを設定します:

```javascript
// vite.config.js
import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    remix({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Webpack

React Compiler を Webpack で使用するには、`babel-loader` を設定します:

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['babel-plugin-react-compiler'],
          },
        },
      },
    ],
  },
};
```

### Expo

Expo で React Compiler を使用するには、アプリの Babel 設定ファイル（`babel.config.js`）に追加します:

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['babel-plugin-react-compiler'],
  };
};
```

### Metro (React Native)

React Native で Metro バンドラーを使用する場合、`metro.config.js` で React Compiler を有効にします:

```javascript
// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve(
  'metro-react-native-babel-transformer'
);

config.transformer.minifierConfig = {
  compress: {
    // Terser オプション
  },
};

module.exports = config;
```

次に、`babel.config.js` にプラグインを追加します:

```javascript
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['babel-plugin-react-compiler'],
};
```

### Rspack

Rspack で React Compiler を使用するには:

```javascript
// rspack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                experimental: {
                  plugins: [
                    [
                      'babel-plugin-react-compiler',
                      {
                        // コンパイラオプション
                      },
                    ],
                  ],
                },
              },
            },
          },
        ],
      },
    ],
  },
};
```

### Rsbuild

Rsbuild で React Compiler を使用するには:

```javascript
// rsbuild.config.js
export default {
  tools: {
    babel: (config) => {
      config.plugins.unshift('babel-plugin-react-compiler');
    },
  },
};
```

## ESLint 統合

React Compiler には、コンパイラが最適化できないコードを特定するための ESLint ルールが含まれています。このルールを使用することを強く推奨します。

### インストール

ESLint プラグインをインストールします:

```bash
npm install -D eslint-plugin-react-compiler@rc
```

### 設定

`.eslintrc.js` に以下を追加します:

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
};
```

または、推奨設定を使用します:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:react-compiler/recommended'],
};
```

ESLint ルールは、以下を検出します:

- **React のルール違反**: コンパイラが最適化できないコード
- **依存関係の問題**: 不足している依存関係や不適切な依存関係
- **パフォーマンスの問題**: 非効率的なパターン

## セットアップの確認

セットアップが正しく動作していることを確認するには、簡単なコンポーネントを作成してビルドします:

```javascript
// src/App.jsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}

export default App;
```

ビルドを実行します:

```bash
npm run build
```

ビルドが成功し、エラーがなければ、React Compiler が正しく設定されています。

### デバッグモードでの確認

React Compiler が実際にコードを最適化しているかを確認するには、React DevTools を使用します:

1. React DevTools の Profiler タブを開く
2. "Highlight updates when components render" を有効にする
3. コンポーネントを操作する
4. 再レンダリングが最適化されていることを確認する

## トラブルシューティング

### ビルドエラー

ビルドエラーが発生した場合:

1. React Compiler が Babel プラグインパイプラインで最初に実行されていることを確認
2. 最新の `@rc` バージョンを使用していることを確認
3. [デバッグガイド](./debugging.md)を参照

### ESLint エラー

ESLint エラーが発生した場合:

1. エラーメッセージを読んで、どの React のルールが違反されているかを確認
2. コードを修正するか、コンポーネントをコンパイルから除外
3. 詳細については、[段階的な導入ガイド](./incremental-adoption.md)を参照

### パフォーマンスの問題

パフォーマンスの問題が発生した場合:

1. React DevTools の Profiler で再レンダリングを確認
2. コンパイラが最適化できないコードがあるかを確認
3. [デバッグガイド](./debugging.md)を参照

## 次のステップ

- [段階的な導入](./incremental-adoption.md) - 既存のプロジェクトに段階的に導入する
- [デバッグ](./debugging.md) - 問題が発生した場合のトラブルシューティング
- [設定オプション](/reference/react-compiler/configuration) - 詳細な設定オプション
- [ディレクティブ](/reference/react-compiler/directives) - 関数レベルのコンパイル制御

## その他のリソース

- [React Compiler Working Group](https://github.com/reactwg/react-compiler) - 追加情報と議論
- [Babel ドキュメント](https://babeljs.io/docs/) - Babel の設定方法
- [ESLint ドキュメント](https://eslint.org/docs/) - ESLint の設定方法
