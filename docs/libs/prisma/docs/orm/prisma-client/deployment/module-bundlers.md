# モジュールバンドラー

モジュールバンドラーは、JavaScriptモジュールを単一のファイルに結合します。Prisma Clientを使用する場合、バンドル中にクエリエンジンバイナリにアクセスできることを確認する必要があります。

## 主要なポイント

- 異なるバンドラーは、静的アセットを処理するために特定のプラグインを必要とします
- 推奨されるプラグイン:
  - **Webpack**: `copy-webpack-plugin`
  - **Next.js**: `nextjs-monorepo-workaround-plugin`
  - **Parcel**: `parcel-plugin-static-files-copy`

## Rustエンジンなしでのprisma ORM (v6.16.0+)

v6.16.0以降、Prismaは本番環境でRustエンジンなしで使用できます:

```prisma
generator client {
  provider   = "prisma-client-js"
  engineType = "client"
}
```

このアプローチにより:
- ドライバーアダプターの使用が必要
- パフォーマンスの向上が期待できる
- バンドルサイズが削減される

## バンドラー固有の設定

### Webpack

`copy-webpack-plugin`をインストール:

```bash
npm install --save-dev copy-webpack-plugin
```

`webpack.config.js`を設定:

```javascript
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './node_modules/.prisma/client',
          to: '.prisma/client',
        },
      ],
    }),
  ],
}
```

### Next.js（モノレポ）

`@prisma/nextjs-monorepo-workaround-plugin`をインストール:

```bash
npm install --save-dev @prisma/nextjs-monorepo-workaround-plugin
```

`next.config.js`を設定:

```javascript
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  },
}
```

### Parcel

`parcel-plugin-static-files-copy`をインストール:

```bash
npm install --save-dev parcel-plugin-static-files-copy
```

`package.json`を設定:

```json
{
  "staticFiles": {
    "staticPath": "node_modules/.prisma/client",
    "staticOutDir": ".prisma/client"
  }
}
```

## ベストプラクティス

1. **バンドラープラグインの使用**: Prismaエンジンファイルが正しくコピーされることを確認
2. **engineType設定の検討**: サイズとパフォーマンスの最適化のために`engineType = "client"`を検討
3. **ビルドプロセスのテスト**: 本番環境にデプロイする前にバンドルをテスト
4. **環境変数の管理**: `DATABASE_URL`などの機密情報は環境変数で管理

## トラブルシューティング

### エンジンファイルが見つからない

バンドラーが`.prisma/client`ディレクトリを正しくコピーしていることを確認します。

### バンドルサイズが大きい

`engineType = "client"`設定を使用して、Rustバイナリを削除することを検討します。

## さらに学ぶ

- [Webpackドキュメント](https://webpack.js.org/)
- [Next.jsドキュメント](https://nextjs.org/docs)
- [Parcelドキュメント](https://parceljs.org/)
