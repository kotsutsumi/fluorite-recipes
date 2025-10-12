# productionBrowserSourceMaps

`productionBrowserSourceMaps` は、本番ビルドでブラウザソースマップの生成を制御する設定オプションです。

## 主要なポイント

- ソースマップはデフォルトで本番ビルドでは無効
- `next.config.js` で `productionBrowserSourceMaps: true` を設定することで、ブラウザソースマップの生成を有効化できます

## 設定例

```javascript
module.exports = {
  productionBrowserSourceMaps: true,
}
```

## 考慮事項

ソースマップを有効にすると、以下の影響があります:

- `next build` 時間が増加する可能性があります
- ビルド中のメモリ使用量が増加する可能性があります
- ソースマップは JavaScript ファイルと同じディレクトリに出力されます
- Next.js はリクエストされたときに自動的にこれらのファイルを提供します

## 主な目的

本番ビルドをデバッグするために、コンパイル/ミニファイされたコードと元のソースコードの間のマッピングを提供することで、開発者を支援することです。
