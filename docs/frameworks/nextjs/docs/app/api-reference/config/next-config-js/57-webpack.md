# webpack

Next.jsでは、`next.config.js`でwebpack設定をカスタマイズできます。

> **警告**: webpackの設定変更はsemverでカバーされていないため、自己責任で行ってください。

## カスタマイズする前に

Next.jsには、すでに以下の組み込みサポートがあります：

- CSSのインポート
- CSSモジュール
- Sass/SCSSのインポートとモジュール

### 推奨されるプラグイン

カスタムwebpack設定が必要な場合は、以下のプラグインを検討してください：

- `@next/mdx`
- `@next/bundle-analyzer`

## 設定例

```javascript filename="next.config.js"
module.exports = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // 重要: 変更した設定を返す必要があります
    return config
  },
}
```

## パラメータ

### `config`

現在のwebpack設定オブジェクトです。このオブジェクトを変更して、カスタム動作を追加できます。

### `buildId`

`string` - ビルド間の一意の識別子です。

### `dev`

`boolean` - コンパイルが開発中に行われるかどうかを示します。

### `isServer`

`boolean` - サーバーサイドのコンパイルの場合は`true`、クライアントサイドのコンパイルの場合は`false`です。

### `nextRuntime`

`string | undefined` - ターゲットランタイム（`"edge"`または`"nodejs"`）です。サーバーサイドのコンパイルの場合のみです。

### `defaultLoaders`

以下のプロパティを持つオブジェクトです：

- `babel`: デフォルトの`babel-loader`設定

### `webpack`

webpackのインスタンスです。プラグインの追加に役立ちます。

## 使用例

### カスタムローダーの追加

```javascript filename="next.config.js"
module.exports = {
  webpack: (config, { isServer }) => {
    // GraphQLファイルのためのカスタムローダーを追加
    config.module.rules.push({
      test: /\.graphql$/,
      use: 'graphql-tag/loader',
    })

    return config
  },
}
```

### エイリアスの追加

```javascript filename="next.config.js"
const path = require('path')

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'components')
    config.resolve.alias['@lib'] = path.join(__dirname, 'lib')

    return config
  },
}
```

使用例：

```typescript
import Button from '@components/Button'
import { getData } from '@lib/api'
```

### プラグインの追加

```javascript filename="next.config.js"
const webpack = require('webpack')

module.exports = {
  webpack: (config, { webpack }) => {
    // 環境変数を追加
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CUSTOM_KEY': JSON.stringify(process.env.CUSTOM_KEY),
      })
    )

    return config
  },
}
```

### 条件付き設定

開発環境と本番環境で異なる設定を使用：

```javascript filename="next.config.js"
module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 開発環境のクライアントサイドのみの設定
      config.devtool = 'eval-source-map'
    }

    if (!dev && !isServer) {
      // 本番環境のクライアントサイドのみの設定
      config.optimization.minimize = true
    }

    return config
  },
}
```

### SVGをReactコンポーネントとしてインポート

```javascript filename="next.config.js"
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}
```

使用例：

```typescript
import Logo from './logo.svg'

export default function Header() {
  return (
    <header>
      <Logo />
    </header>
  )
}
```

### バンドル分析

```javascript filename="next.config.js"
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }

    return config
  },
}
```

### ランタイム固有の設定

```javascript filename="next.config.js"
module.exports = {
  webpack: (config, { nextRuntime, isServer }) => {
    if (isServer) {
      if (nextRuntime === 'edge') {
        // Edge Runtimeの設定
        console.log('Building for Edge Runtime')
      } else if (nextRuntime === 'nodejs') {
        // Node.js Runtimeの設定
        console.log('Building for Node.js Runtime')
      }
    }

    return config
  },
}
```

## ランタイムの考慮事項

- `nextRuntime`が`"edge"`または`"nodejs"`の場合、`isServer`は`true`です
- `"edge"`ランタイムは、現在MiddlewareとServer Componentsに使用されています

## デバッグ

webpack設定をデバッグするには：

```javascript filename="next.config.js"
module.exports = {
  webpack: (config, options) => {
    console.log('Webpack config:', JSON.stringify(config, null, 2))
    console.log('Options:', options)

    return config
  },
}
```

## 注意事項

- webpack設定の変更は慎重に行ってください
- Next.jsの将来のバージョンでは、内部webpack設定が変更される可能性があります
- 可能な限り、Next.jsの組み込み機能とプラグインを使用してください

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v11.0.0` | `webpack 5`がデフォルトになりました |
| `v5.0.0` | `webpack`設定関数が追加されました |

## 関連項目

- [webpack ドキュメント](https://webpack.js.org/configuration/)
- [カスタムwebpack設定](/docs/app/api-reference/next-config-js/webpack)
