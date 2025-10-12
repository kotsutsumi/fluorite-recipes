# Next.js Getting Started ガイド

このディレクトリには、Next.jsアプリケーションの開発を始めるための包括的なガイドが含まれています。以下は各セクションの要約とリンクです。

## 📚 学習コンテンツ一覧

### 基本セットアップ

- **[00. インストール](./getting-started/00-installation.md)** - Next.jsプロジェクトの作成と初期セットアップ
- **[01. プロジェクト構造](./getting-started/01-project-structure.md)** - Next.jsプロジェクトのディレクトリ構造とファイル規約

### 核となる概念

- **[02. レイアウトとページ](./getting-started/02-layouts-and-pages.md)** - ページとレイアウトの作成・管理方法
- **[03. リンクとナビゲーション](./getting-started/03-linking-and-navigating.md)** - ルート間のナビゲーション実装
- **[04. Server ComponentsとClient Components](./getting-started/04-server-and-client-components.md)** - コンポーネントのレンダリング戦略

### 高度な機能

- **[05. Partial Prerendering](./getting-started/05-partial-prerendering.md)** - 静的・動的コンテンツの最適化（実験的機能）
- **[06. データフェッチ](./getting-started/06-fetching-data.md)** - サーバー・クライアント両方でのデータ取得
- **[07. データの更新](./getting-started/07-updating-data.md)** - Server Actionsを使用したデータ変更
- **[08. キャッシングと再検証](./getting-started/08-caching-and-revalidating.md)** - パフォーマンス最適化のためのキャッシュ戦略

### エラーハンドリングとUI

- **[09. エラー処理](./getting-started/09-error-handling.md)** - 期待されるエラーと予期しない例外の処理
- **[10. CSS](./getting-started/10-css.md)** - Tailwind CSS、CSS Modules、Global CSSによるスタイリング
- **[11. 画像](./getting-started/11-images.md)** - 最適化された画像コンポーネントの使用
- **[12. フォント](./getting-started/12-fonts.md)** - Google Fontsと自動フォント最適化

### メタデータとAPI

- **[13. メタデータとOG画像](./getting-started/13-metadata-and-og-images.md)** - SEO最適化とソーシャル共有のメタデータ
- **[14. Route HandlersとMiddleware](./getting-started/14-route-handlers-and-middleware.md)** - APIエンドポイントとリクエストインターセプト

### デプロイとメンテナンス

- **[15. デプロイ](./getting-started/15-deploying.md)** - 様々なプラットフォームへのデプロイ方法
- **[16. アップグレード](./getting-started/16-upgrading.md)** - Next.jsの新バージョンへの移行

## 🎯 学習パス推奨順序

### 初心者向け

1. インストール → プロジェクト構造 → レイアウトとページ
2. リンクとナビゲーション → Server/Client Components
3. データフェッチ → CSS → 画像・フォント

### 中級者向け

1. データの更新 → キャッシングと再検証
2. エラー処理 → メタデータとOG画像
3. Route HandlersとMiddleware

### 上級者向け

1. Partial Prerendering（実験的機能）
2. デプロイ戦略 → アップグレード手順

## 📖 各セクションの主要トピック

### 技術仕様

- **システム要件**: Node.js 18.18+、主要OS対応
- **推奨技術スタック**: TypeScript、Tailwind CSS、App Router
- **レンダリング戦略**: Server Components（デフォルト）、Client Components（必要時）

### 開発ワークフロー

- **セットアップ**: `create-next-app`による自動生成または手動設定
- **開発**: `next dev`による開発サーバー、Turbopack対応
- **ビルド**: `next build`による最適化、静的エクスポート対応
- **デプロイ**: Vercel、Node.js、Docker、静的ホスティング対応

### パフォーマンス最適化

- **画像最適化**: 自動WebP/AVIF変換、レスポンシブ対応
- **フォント最適化**: Google Fonts自動セルフホスティング
- **キャッシング**: 複数レベルのキャッシュ戦略
- **プリレンダリング**: 静的生成とサーバーサイドレンダリングの最適な組み合わせ

## 🔗 関連リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)
- [Vercel デプロイプラットフォーム](https://vercel.com)

---

> **注意**: 一部の機能（Partial Prerenderingなど）は実験的なものです。本番環境での使用前に最新のドキュメントを確認してください。
