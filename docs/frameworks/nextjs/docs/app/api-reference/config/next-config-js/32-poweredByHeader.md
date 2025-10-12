# poweredByHeader

`poweredByHeader` は、Next.js アプリケーションの `x-powered-by` ヘッダーを制御する `next.config.js` の設定オプションです。

## デフォルト動作

デフォルトでは、Next.js はレスポンスにこのヘッダーを追加します。

## ヘッダーの無効化

ヘッダーを無効にするには、`next.config.js` ファイルで `poweredByHeader` を `false` に設定します:

```javascript
module.exports = {
  poweredByHeader: false,
}
```

## 用途

この設定により、開発者は HTTP レスポンスからデフォルトの「X-Powered-By: Next.js」ヘッダーを削除できます。これは、技術スタックに関する潜在的な情報開示を減らすために役立ちます。

このドキュメントは、Next.js 設定リファレンスの一部であり、特に App Router ドキュメントの下にあり、サーバーレスポンスヘッダーをカスタマイズする簡単な方法を提供します。
