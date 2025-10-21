# Vercel サポート対象フレームワーク

## 概要

このページでは、Vercelでデプロイできるフレームワークとその機能サポート状況を詳細に説明しています。Vercelは、50以上のフレームワークをサポートし、開発者に柔軟な選択肢を提供しています。

## フレームワークインフラストラクチャサポート

Vercelは、以下の機能に対して各フレームワークのサポート状況を提供しています：

### サポート対象機能

- **静的アセット**: 静的ファイルの提供
- **エッジルーティングルール**: エッジでのルーティング制御
- **ルーティングミドルウェア**: リクエスト処理前のミドルウェア実行
- **サーバーサイドレンダリング (SSR)**: 動的なページレンダリング
- **ストリーミングSSR**: ストリーミングによるSSR
- **増分静的再生成 (ISR)**: ビルド後の静的ページ更新
- **画像最適化**: 画像の自動最適化
- **データキャッシュ**: データのキャッシング
- **OGイメージ生成**: Open Graphイメージの生成
- **マルチランタイムサポート**: 複数のランタイム環境

## 主なフレームワーク

### フロントエンドフレームワーク

#### Next.js
- Reactベースのフルスタックフレームワーク
- すべてのVercel機能をフルサポート
- [Next.js on Vercel](/docs/frameworks/nextjs)

#### SvelteKit
- Svelteベースのフルスタックフレームワーク
- SSR、SSG、CSRをサポート
- [SvelteKit on Vercel](/docs/frameworks/sveltekit)

#### Nuxt
- Vue.jsベースのフルスタックフレームワーク
- SSR、SSG、SPAモードをサポート
- [Nuxt on Vercel](/docs/frameworks/nuxt)

#### Astro
- コンテンツフォーカスのフレームワーク
- 部分的なハイドレーションをサポート
- [Astro on Vercel](/docs/frameworks/astro)

#### Remix
- Reactベースのフルスタックフレームワーク
- ネストされたルーティングをサポート
- [Remix on Vercel](/docs/frameworks/remix)

### UI フレームワーク

#### React
- コンポーネントベースのUIライブラリ
- 静的サイトとSPAをサポート

#### Vue.js
- プログレッシブJavaScriptフレームワーク
- 静的サイトとSPAをサポート

#### Angular
- TypeScriptベースのフレームワーク
- エンタープライズアプリケーションに最適

### バックエンドフレームワーク

#### Express
- Node.jsのミニマリストウェブフレームワーク
- [Express on Vercel](/docs/frameworks/backend/express)

#### FastAPI
- Pythonの高性能APIフレームワーク
- [FastAPI on Vercel](/docs/frameworks/backend/fastapi)

#### Flask
- Pythonのマイクロウェブフレームワーク
- [Flask on Vercel](/docs/frameworks/backend/flask)

#### Hono
- Web標準ベースのフレームワーク
- [Hono on Vercel](/docs/frameworks/backend/hono)

#### Nitro
- 次世代サーバーツールキット
- [Nitro on Vercel](/docs/frameworks/backend/nitro)

#### NestJS
- プログレッシブNode.jsフレームワーク
- [NestJS on Vercel](/docs/frameworks/backend/nestjs)

## 静的サイトジェネレーター

### Hugo
- Goベースの高速な静的サイトジェネレーター
- マークダウンコンテンツに最適

### Jekyll
- Rubyベースの静的サイトジェネレーター
- GitHubと統合

### Eleventy (11ty)
- シンプルな静的サイトジェネレーター
- 複数のテンプレート言語をサポート

### Hexo
- Node.jsベースのブログフレームワーク
- マークダウンサポート

## メタフレームワーク

### Analog
- Angularのメタフレームワーク
- ファイルベースのルーティング

### Qwik
- 再開可能なフレームワーク
- 即座のインタラクティビティ

### Solid Start
- SolidJSのメタフレームワーク
- 細粒度のリアクティビティ

## E2Eフレームワーク

### RedwoodJS
- フルスタックJavaScriptフレームワーク
- GraphQLファースト

### Blitz.js
- フルスタックReactフレームワーク
- ゼロAPIデータレイヤー

## フレームワークの選択

### プロジェクトタイプ別の推奨

#### 静的サイト
- Astro
- Hugo
- Jekyll
- Eleventy

#### ブログ
- Next.js
- Astro
- Hugo
- Hexo

#### Eコマース
- Next.js
- Nuxt
- SvelteKit

#### ダッシュボード
- Next.js
- Remix
- SvelteKit

#### API
- Express
- FastAPI
- Hono
- NestJS

## テンプレートの利用

Vercelは、各フレームワーク用の公式テンプレートを提供しています：

- [フロントエンドテンプレート](https://vercel.com/templates?type=frontend)
- [バックエンドテンプレート](https://vercel.com/templates?type=backend)
- [フルスタックテンプレート](https://vercel.com/templates?type=fullstack)

## 追加リソース

- [フレームワークドキュメント](/docs/frameworks)
- [デプロイメントガイド](/docs/deployments)
- [ビルド設定](/docs/build-configuration)
- [Vercel Functions](/docs/functions)

## カスタムフレームワーク

サポートされていないフレームワークを使用している場合でも、Vercelにデプロイできます：

1. ビルド出力を静的ファイルとして生成
2. `vercel.json`で設定をカスタマイズ
3. ビルドコマンドと出力ディレクトリを指定

詳細は[カスタムビルド設定](/docs/build-configuration)を参照してください。
