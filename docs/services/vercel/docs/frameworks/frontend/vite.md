# Vite on Vercel

## はじめに

Viteは、モダンなウェブプロジェクトのために、より高速でスリムな開発体験を提供することを目指すオピニオネートされたビルドツールです。主な特徴は以下の通りです：

- NPMの依存関係の事前バンドル
- ホットモジュール置換
- 本番環境向けに最適化された静的アセットの出力

Viteは、[SvelteKit](/docs/frameworks/sveltekit)などの人気のフレームワークをサポートし、[Vue](/guides/deploying-vuejs-to-vercel)、[Svelte](/docs/frameworks/sveltekit)、[React](/docs/frameworks/create-react-app)、[Preact](/guides/deploying-preact-with-vercel)などで広く使用されています。

## Vercelでの始め方

ViteプロジェクトをVercelにデプロイする方法：

1. 既存のViteプロジェクトがある場合：
   - [Vercel CLI](/docs/cli)をインストール
   - プロジェクトのルートディレクトリで`vercel`コマンドを実行

2. テンプレートをデプロイ：
   - [Viteテンプレートをデプロイ](/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmain%2Fexamples%2Fvite&template=vite)

## Viteコミュニティプラグインの使用

### `vite-plugin-vercel`

このプラグインは、以下のVercel機能を有効にします：

- サーバーサイドレンダリング（SSR）
- 静的サイト生成（SSG）
- ISR（Incremental Static Regeneration）
