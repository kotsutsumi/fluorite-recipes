# Turbopack

[Turbopack](https://turbo.build/pack)（ベータ版）は、JavaScriptとTypeScript用に最適化された増分バンドラーで、Next.jsに組み込まれています。

## 使用法

TurbopackはNext.jsの`pages`と`app`ディレクトリの両方で、より高速なローカル開発のために使用できます。Turbopackを有効にするには、Next.jsの開発サーバーを実行する際に`--turbopack`フラグを使用します。

```json filename="package.json" highlight={3}
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## サポートされている機能

Next.jsでのTurbopackの現在サポートされている機能について詳しく知るには、[ドキュメント](https://turbo.build/pack/docs/features)を参照してください。

## サポートされていない機能

Turbopackは現在、`next dev`のみをサポートしており、`next build`はサポートしていません。現在、以下の機能をサポートする作業を進めています:

- `next.config.js`の[`webpack()`](/docs/app/api-reference/config/next-config-js/webpack)設定
- [Babel](/docs/pages/building-your-application/configuring/babel) (`.babelrc`)

進捗状況を追跡するには、[Turbopackのドキュメント](https://turbo.build/pack/docs/features)をご覧ください。
