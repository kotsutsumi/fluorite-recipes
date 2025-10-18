# インストール - shadcn/ui

## フレームワークを選択

フレームワークを選択してインストールと構成を行うためのガイド。React のすべてのフレームワークで動作するように設計されています。

## サポートされているフレームワーク

### 1. Next.js
Next.jsは、本番環境対応のReactフレームワークです。サーバーサイドレンダリング、静的サイト生成、APIルートなどをサポートしています。

[Next.jsのインストール手順を見る](/docs/installation/next)

### 2. Vite
Viteは、高速な開発体験を提供する次世代フロントエンドツールです。

[Viteのインストール手順を見る](/docs/installation/vite)

### 3. Laravel
Laravelは、PHPのWebアプリケーションフレームワークです。Inertia.jsを使用してReactと統合できます。

[Laravelのインストール手順を見る](/docs/installation/laravel)

### 4. React Router
React Routerは、Reactアプリケーション向けの宣言的なルーティングライブラリです。

[React Routerのインストール手順を見る](/docs/installation/react-router)

### 5. Astro
Astroは、コンテンツにフォーカスしたWebサイトを構築するための最新のWebフレームワークです。

[Astroのインストール手順を見る](/docs/installation/astro)

### 6. TanStack Start
TanStack Startは、TanStackファミリーの新しいフルスタックReactフレームワークです。

[TanStack Startのインストール手順を見る](/docs/installation/tanstack-start)

### 7. TanStack Router
TanStack Routerは、型安全なルーティングライブラリです。

[TanStack Routerのインストール手順を見る](/docs/installation/tanstack-router)

### 8. 手動インストール
他のフレームワークやカスタムセットアップの場合は、手動でインストールできます。

[手動インストール手順を見る](/docs/installation/manual)

## インストールの基本手順

ほとんどのフレームワークで、インストールは以下の手順に従います：

### 1. プロジェクトの作成
選択したフレームワークで新しいプロジェクトを作成します。

### 2. 依存関係のインストール
必要なパッケージをインストールします：
- Tailwind CSS
- TypeScript（オプション）
- その他のフレームワーク固有の依存関係

### 3. shadcn/ui CLIの実行
```bash
npx shadcn@latest init
```

このコマンドは：
- `components.json` を作成
- 必要な依存関係をインストール
- `cn` ユーティリティを追加
- CSS変数を設定

### 4. コンポーネントの追加
```bash
npx shadcn@latest add button
```

## 設定オプション

### components.json
プロジェクトの設定を保持するファイル。以下を設定できます：

- **style**: コンポーネントのスタイル（default、new-york）
- **tailwind**: Tailwind CSSの設定
  - config: 設定ファイルのパス
  - css: CSSファイルのパス
  - baseColor: ベースカラー
  - cssVariables: CSS変数の使用
- **rsc**: React Server Componentsのサポート
- **tsx**: TypeScriptの使用
- **aliases**: インポートエイリアス

## 次のステップ

インストール後、以下を確認してください：

- [テーマ設定](/docs/theming) - カラーとスタイルのカスタマイズ
- [ダークモード](/docs/dark-mode) - ダークモードの追加
- [コンポーネント](/docs/components) - 利用可能なコンポーネントの確認
- [CLI](/docs/cli) - CLIコマンドの詳細

## トラブルシューティング

### よくある問題

**Q: コンポーネントが正しくスタイルされていない**
A: Tailwind CSSが正しく設定されているか確認してください。`globals.css`にTailwindのインポートが含まれているか確認してください。

**Q: インポートエラーが発生する**
A: `components.json`のaliases設定とTypeScript/JSConfigのpaths設定が一致しているか確認してください。

**Q: CSS変数が機能しない**
A: `components.json`で`cssVariables`が`true`に設定されており、`globals.css`に変数定義が含まれているか確認してください。

## デプロイメント

### Vercelでshadcn/uiアプリをデプロイ

OpenAI、Sonos、Adobeなどに信頼されています。Vercelは、アプリと機能を大規模にデプロイするためのツールとインフラストラクチャを提供します。

特徴:
- 自動デプロイ
- グローバルCDN
- カスタムドメイン
- 分析とモニタリング
- サーバーレス関数

[Vercelにデプロイ](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)

## クレジット

[shadcn](https://twitter.com/shadcn)が[Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)で作成。ソースコードは[GitHub](https://github.com/shadcn-ui/ui)で利用可能です。