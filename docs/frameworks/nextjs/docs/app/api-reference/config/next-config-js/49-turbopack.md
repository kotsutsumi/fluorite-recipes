# turbopack

Turbopackは、Next.jsアプリケーションでモジュールの変換と解決をカスタマイズできます。

## 設定オプション

### 主要なオプション

- `root`: アプリケーションのルートディレクトリを設定
- `rules`: webpackローダーを設定
- `resolveAlias`: モジュールインポートエイリアスをマッピング
- `resolveExtensions`: 解決するファイル拡張子を定義

## サポートされているローダー

以下のローダーがテストされ、互換性があります：

- `babel-loader`
- `@svgr/webpack`
- `svg-inline-loader`
- `yaml-loader`
- `string-replace-loader`
- `raw-loader`
- `sass-loader`
- `graphql-tag/loader`

## 設定例

### ルートディレクトリの設定

```javascript filename="next.config.js"
const path = require('path')

module.exports = {
  turbopack: {
    root: path.join(__dirname, '..'),
  },
}
```

### ローダーの設定

```javascript filename="next.config.js"
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}
```

この例では、すべての`.svg`ファイルが`@svgr/webpack`ローダーで処理され、JavaScriptとして扱われます。

### ローダーオプションの渡し方

```javascript filename="next.config.js"
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
}
```

### エイリアスの解決

```javascript filename="next.config.js"
module.exports = {
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
      mocha: { browser: 'mocha/browser-entry.js' },
    },
  },
}
```

この例では：

- `underscore`のインポートが`lodash`にマッピングされます
- `mocha`のブラウザ環境でのインポートが特定のエントリポイントにマッピングされます

### 拡張子の解決

```javascript filename="next.config.js"
module.exports = {
  turbopack: {
    resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
}
```

## 重要な注意事項

- Turbopackには、CSSとモダンJavaScriptの組み込みサポートがあります
- 現在、JavaScriptコードを返すローダーのみがサポートされています
- ローダーオプションは、プレーンなJavaScriptプリミティブである必要があります

> **Good to know**: ローダー設定は、複雑な変換ロジックを処理する際に特に役立ちます。ただし、Next.jsの組み込みサポートを最初に確認することをお勧めします。

## バージョン履歴

| バージョン | 変更内容 |
|-----------|---------|
| `v15.3.0` | `experimental.turbo`から`turbopack`に変更されました |
| `v13.0.0` | `experimental.turbo`が導入されました |

## 関連項目

- [Turbopackドキュメント](https://turbo.build/pack/docs)
- [webpackからの移行](/docs/app/building-your-application/configuring/turbopack)
