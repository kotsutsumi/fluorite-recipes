# optimizePackageImports

`optimizePackageImports` は、パッケージのインポートを最適化してパフォーマンスを向上させるために設計された、`next.config.js` の実験的設定オプションです。

## 概要

- **目的**: 「一部のパッケージは数百または数千のモジュールをエクスポートでき、パフォーマンスの問題を引き起こす可能性があります」
- **用途**: 実際に使用しているモジュールのみをロードするために、パッケージ名を設定に追加します

## 設定例

```javascript
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

## デフォルトで最適化されているライブラリ

この設定には、デフォルトで最適化されているいくつかのライブラリが含まれています:

### UI ライブラリ
- Lucide React
- Ant Design
- React Bootstrap

### ユーティリティライブラリ
- date-fns
- lodash-es
- ramda

### アイコンライブラリ
- Heroicons
- Material UI icons

### チャートライブラリ
- Recharts
- Visx

その他、合計 25 以上のライブラリがサポートされています。

## メリット

この機能により、開発者は大規模なライブラリからより効率的にインポートでき、不要なモジュールの読み込みを減らし、アプリケーションのパフォーマンスを向上させることができます。
