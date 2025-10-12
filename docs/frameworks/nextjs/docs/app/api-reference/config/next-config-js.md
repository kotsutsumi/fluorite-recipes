# Next.js Configuration (next.config.js) API Reference

このドキュメントは、Next.js の `next.config.js` で設定可能なすべての設定オプションの包括的なリファレンスです。LLMが解析・参照しやすいよう、各設定項目の要約とリンクを含めています。

## 目次

- [基本設定](#基本設定)
  - [アプリケーション構造](#アプリケーション構造)
  - [パス・URL設定](#パスurl設定)
  - [環境変数](#環境変数)
- [ビルド・出力設定](#ビルド出力設定)
  - [出力モード](#出力モード)
  - [静的生成](#静的生成)
  - [TypeScript](#typescript)
- [開発・デバッグ設定](#開発デバッグ設定)
  - [開発ツール](#開発ツール)
  - [ログ・デバッグ](#ログデバッグ)
- [ルーティング・ナビゲーション](#ルーティングナビゲーション)
  - [リダイレクト・リライト](#リダイレクトリライト)
  - [ページ拡張子](#ページ拡張子)
- [アセット・リソース管理](#アセットリソース管理)
  - [画像最適化](#画像最適化)
  - [静的アセット](#静的アセット)
- [パフォーマンス・最適化](#パフォーマンス最適化)
  - [キャッシュ設定](#キャッシュ設定)
  - [バンドル最適化](#バンドル最適化)
- [セキュリティ設定](#セキュリティ設定)
  - [CORS・ヘッダー](#corsヘッダー)
  - [コンテンツセキュリティ](#コンテンツセキュリティ)
- [実験的機能](#実験的機能)
  - [パフォーマンス機能](#パフォーマンス機能)
  - [新機能プレビュー](#新機能プレビュー)
- [ビルドツール設定](#ビルドツール設定)
  - [Webpack・Turbopack](#webpackturbopack)
  - [CSS・スタイル](#cssスタイル)

---

## 基本設定

### アプリケーション構造

#### [`appDir`](./next-config-js/02-appDir.md) 🗂️

**レガシーAPI（非推奨）** - App Router（`app`ディレクトリ）の有効化設定。Next.js 13.4以降では不要。

**キーポイント**: App Routerは現在安定版で、自動的にReact Strict Modeが有効化されます。

#### [`pageExtensions`](./next-config-js/31-pageExtensions.md) 📄

ページとして認識するファイル拡張子をカスタマイズする設定。

**デフォルト**: `['tsx', 'ts', 'jsx', 'js']`

### パス・URL設定

#### [`basePath`](./next-config-js/05-basePath.md) 🛤️

ドメインのサブパス下にアプリケーションをデプロイする際のパスプレフィックス設定。

**例**: `/docs` サブパス → `basePath: '/docs'`

**重要**: ビルド時設定、`next/link`と`next/router`で自動適用

#### [`assetPrefix`](./next-config-js/03-assetPrefix.md) 🌐

静的アセット（JS、CSS、画像）に対するCDNプレフィックスの設定。

#### [`trailingSlash`](./next-config-js/47-trailingSlash.md) /

URLの末尾にスラッシュを追加するかの設定。

### 環境変数

#### [`env`](./next-config-js/14-env.md) 🔑

**レガシーAPI（非推奨）** - JavaScriptバンドルに環境変数を追加。

**推奨**: Next.js 9.4以降の `.env` ファイルと `NEXT_PUBLIC_` プレフィックスを使用

---

## ビルド・出力設定

### 出力モード

#### [`output`](./next-config-js/30-output.md) 📦

本番ビルドの出力モードを設定。デプロイ最適化のためのファイルトレース機能。

**主要オプション**:

- `'standalone'`: 最小限のデプロイファイルと`server.js`を生成
- 自動ファイルトレースで必要なファイルのみを `.next/standalone` に出力

#### [`distDir`](./next-config-js/13-distDir.md) 📁

ビルド出力ディレクトリのカスタマイズ（デフォルト：`.next`）

#### [`generateBuildId`](./next-config-js/18-generateBuildId.md) 🆔

カスタムビルドIDの生成関数を設定。

### 静的生成

#### [`exportPathMap`](./next-config-js/17-exportPathMap.md) 🗺️

**レガシーAPI** - 静的エクスポート時のパスマッピング設定。

#### [`generateEtags`](./next-config-js/19-generateEtags.md) 🏷️

ETags生成の有効/無効設定（デフォルト：有効）

### TypeScript

#### [`typescript`](./next-config-js/52-typescript.md) 📘

TypeScript設定とビルド時の型チェック制御。

**重要オプション**: `ignoreBuildErrors` - 型エラーがあってもビルドを続行（⚠️危険）

---

## 開発・デバッグ設定

### 開発ツール

#### [`devIndicators`](./next-config-js/12-devIndicators.md) 🚥

開発時のビジュアル表示（プリレンダリング、エラーオーバーレイなど）の制御。

#### [`onDemandEntries`](./next-config-js/28-onDemandEntries.md) ⚡

開発時のページキャッシュとメモリ管理設定。

#### [`allowedDevOrigins`](./next-config-js/01-allowedDevOrigins.md) 🌍

開発環境で許可するOriginの設定。

### ログ・デバッグ

#### [`logging`](./next-config-js/26-logging.md) 📋

カスタムログ設定とレベル制御。

#### [`browserDebugInfoInTerminal`](./next-config-js/06-browserDebugInfoInTerminal.md) 🖥️

ブラウザデバッグ情報のターミナル表示設定。

#### [`productionBrowserSourceMaps`](./next-config-js/34-productionBrowserSourceMaps.md) 🗺️

本番環境でのソースマップ生成設定。

---

## ルーティング・ナビゲーション

### リダイレクト・リライト

#### [`redirects`](./next-config-js/38-redirects.md) ↩️

受信リクエストを異なる宛先にプログラム的にリダイレクトする設定。

**主要プロパティ**:

- `source`: 受信パスパターン
- `destination`: リダイレクト先
- `permanent`: 永続的(308)か一時的(307)か

#### [`rewrites`](./next-config-js/39-rewrites.md) 🔄

URLパスの書き換え設定（URLは変更されずに内部で別のパスにマッピング）

#### [`headers`](./next-config-js/20-headers.md) 📋

カスタムHTTPヘッダーの設定。

### ページ拡張子

#### [`pageExtensions`](./next-config-js/31-pageExtensions.md) 📄

ページとして認識するファイル拡張子の設定。

---

## アセット・リソース管理

### 画像最適化

#### [`images`](./next-config-js/23-images.md) 🖼️

Next.js画像最適化のカスタマイズ設定。

**主要機能**:

- カスタム画像ローダーの設定
- `loader`と`loaderFile`によるカスタマイザ

### 静的アセット

#### [`assetPrefix`](./next-config-js/03-assetPrefix.md) 🌐

静的アセットのCDNプレフィックス設定。

#### [`compress`](./next-config-js/09-compress.md) 🗜️

gzip圧縮の有効/無効設定。

---

## パフォーマンス・最適化

### キャッシュ設定

#### [`cacheLife`](./next-config-js/08-cacheLife.md) ⏱️

キャッシュライフサイクルの制御設定。

#### [`incrementalCacheHandlerPath`](./next-config-js/24-incrementalCacheHandlerPath.md) 🔄

カスタムインクリメンタルキャッシュハンドラーのパス設定。

#### [`expireTime`](./next-config-js/16-expireTime.md) ⏰

キャッシュ有効期限の設定。

#### [`staleTimes`](./next-config-js/44-staleTimes.md) ⏳

キャッシュのstale期間設定。

### バンドル最適化

#### [`optimizePackageImports`](./next-config-js/29-optimizePackageImports.md) 📦

パッケージインポートの最適化設定。

#### [`transpilePackages`](./next-config-js/48-transpilePackages.md) 🔄

トランスパイル対象パッケージの指定。

#### [`serverExternalPackages`](./next-config-js/43-serverExternalPackages.md) 📦

サーバーサイドで外部化するパッケージの設定。

---

## セキュリティ設定

### CORS・ヘッダー

#### [`crossOrigin`](./next-config-js/10-crossOrigin.md) 🌐

CORS設定とクロスオリジンポリシー。

#### [`poweredByHeader`](./next-config-js/32-poweredByHeader.md) 🏷️

`X-Powered-By`ヘッダーの表示制御。

### コンテンツセキュリティ

#### [`httpAgentOptions`](./next-config-js/22-httpAgentOptions.md) 🔒

HTTPエージェントオプションの設定。

---

## 実験的機能

### パフォーマンス機能

#### [`ppr`](./next-config-js/33-ppr.md) ⚡

**実験的** - Partial Prerendering（PPR）の有効化。

#### [`cacheComponents`](./next-config-js/07-cacheComponents.md) 💾

**実験的** - コンポーネントキャッシュの設定。

#### [`serverComponentsHmrCache`](./next-config-js/42-serverComponentsHmrCache.md) 🔥

**実験的** - サーバーコンポーネントのHMRキャッシュ設定。

#### [`staticGeneration`](./next-config-js/45-staticGeneration.md) 🏗️

**実験的** - 静的生成の詳細設定。

#### [`useCache`](./next-config-js/54-useCache.md) 💾

**実験的** - `use cache`ディレクティブの設定。

### 新機能プレビュー

#### [`reactCompiler`](./next-config-js/35-reactCompiler.md) ⚛️

**実験的** - React Compilerの有効化設定。

#### [`typedRoutes`](./next-config-js/51-typedRoutes.md) 🛣️

**実験的** - 型安全なルーティングの有効化。

#### [`authInterrupts`](./next-config-js/04-authInterrupts.md) 🔐

**実験的** - 認証割り込み機能の設定。

#### [`viewTransition`](./next-config-js/56-viewTransition.md) 🎬

**実験的** - View Transitionsの設定。

#### [`taint`](./next-config-js/46-taint.md) 🧪

**実験的** - データのtaint機能設定。

---

## ビルドツール設定

### Webpack・Turbopack

#### [`webpack`](./next-config-js/57-webpack.md) 📦

webpackの設定カスタマイズ。

**警告**: semverでカバーされていないため自己責任

**組み込みサポート**: CSS、CSS modules、Sass/SCSS

#### [`turbopack`](./next-config-js/49-turbopack.md) ⚡

Turbopackの設定とカスタマイズ。

**主要オプション**:

- `root`: アプリケーションルート
- `rules`: webpackローダー設定
- `resolveAlias`: モジュールエイリアス
- `resolveExtensions`: ファイル拡張子設定

#### [`turbopackPersistentCaching`](./next-config-js/50-turbopackPersistentCaching.md) 💾

**実験的** - Turbopackの永続キャッシュ設定。

### CSS・スタイル

#### [`cssChunking`](./next-config-js/11-cssChunking.md) 🧩

CSSチャンクの分割設定。

#### [`inlineCss`](./next-config-js/25-inlineCss.md) 📝

CSSのインライン化設定。

#### [`sassOptions`](./next-config-js/40-sassOptions.md) 🎨

Sass/SCSS設定のカスタマイズ。

#### [`useLightningcss`](./next-config-js/55-useLightningcss.md) ⚡

**実験的** - Lightning CSSの使用設定。

---

## その他の設定

### ESLint・開発ツール

#### [`eslint`](./next-config-js/15-eslint.md) 🔍

ESLint設定の制御。

#### [`mdxRs`](./next-config-js/27-mdxRs.md) 📝

**実験的** - Rust版MDXローダーの設定。

### パフォーマンス監視

#### [`webVitalsAttribution`](./next-config-js/58-webVitalsAttribution.md) 📊

Web Vitalsの詳細アトリビューション設定。

### React設定

#### [`reactStrictMode`](./next-config-js/37-reactStrictMode.md) ⚛️

React Strict Modeの有効/無効設定。

#### [`reactMaxHeadersLength`](./next-config-js/36-reactMaxHeadersLength.md) 📏

Reactのヘッダー最大長設定。

### サーバーアクション

#### [`serverActions`](./next-config-js/41-serverActions.md) 🎬

Server Actionsの設定。

### URL・インポート

#### [`urlImports`](./next-config-js/53-urlImports.md) 🌐

URL経由でのモジュールインポート設定。

### その他

#### [`htmlLimitedBots`](./next-config-js/21-htmlLimitedBots.md) 🤖

検索エンジンボット向けのHTML制限設定。

---

## 設定の適用順序と注意点

### 重要な考慮事項

1. **ビルド時設定**: `basePath`、`assetPrefix`などはビルド時に決定され、実行時変更不可
2. **実験的機能**: `unstable_`や**実験的**マークの機能は本番環境での使用を慎重に検討
3. **レガシーAPI**: 非推奨となった設定は下位互換性のために残されているが、新規プロジェクトでは推奨されない
4. **semver範囲外**: webpackカスタマイズなど一部設定はsemverでカバーされない

### 設定例

```javascript
// next.config.js
module.exports = {
  // 基本設定
  basePath: "/docs",
  assetPrefix: "https://cdn.example.com",

  // 出力設定
  output: "standalone",

  // TypeScript
  typescript: {
    ignoreBuildErrors: false, // 推奨: false
  },

  // 画像最適化
  images: {
    loader: "cloudinary",
    path: "https://example.com/myaccount/",
  },

  // リダイレクト
  async redirects() {
    return [
      {
        source: "/old-page",
        destination: "/new-page",
        permanent: true,
      },
    ];
  },

  // 実験的機能
  experimental: {
    ppr: true,
    typedRoutes: true,
  },
};
```

---

このドキュメントは、Next.js `next.config.js` の包括的なリファレンスです。各設定の詳細な使用方法やオプションについては、個別のリンク先ドキュメントを参照してください。
