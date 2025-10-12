# Next.js ダッシュボードアプリ学習コース

このディレクトリには、Next.jsを使用して本格的なフルスタック財務ダッシュボードを構築する包括的な学習コースが含まれています。実際のプロジェクト開発を通じてNext.jsの主要機能を学習できます。

## 🎯 プロジェクト概要

### 構築するアプリケーション

- **財務ダッシュボード**：パブリックホームページ、ログイン機能、認証保護されたダッシュボード
- **CRUD機能**：請求書の追加・編集・削除機能
- **データベース統合**：PostgreSQL を使用したデータ管理
- **レスポンシブデザイン**：デスクトップ・モバイル対応

### 技術スタック

- **フレームワーク**：Next.js 14（App Router）
- **言語**：TypeScript
- **スタイリング**：Tailwind CSS
- **データベース**：PostgreSQL（Vercel）
- **認証**：NextAuth.js
- **デプロイ**：Vercel

## 📚 学習コンテンツ一覧

### 基礎セットアップ（第0章-第3章）

- **[00. イントロダクション](./dashboard-app/00-Introduction.md)** - コース概要と学習目標
- **[01. はじめに](./dashboard-app/01-getting-started.md)** - プロジェクト作成とフォルダ構造の理解
- **[02. CSSスタイリング](./dashboard-app/02-css-styling.md)** - Tailwind CSS、CSS Modules、グローバルスタイル
- **[03. フォントと画像の最適化](./dashboard-app/03-optimizing-fonts-images.md)** - `next/font`と`next/image`による最適化

### ルーティングと構造（第4章-第5章）

- **[04. レイアウトとページの作成](./dashboard-app/04-creating-layouts-and-pages.md)** - ファイルシステムルーティングとネストレイアウト
- **[05. ページ間のナビゲーション](./dashboard-app/05-navigating-between-pages.md)** - `<Link>`コンポーネントとクライアントサイドナビゲーション

### データベースとデータ処理（第6章-第8章）

- **[06. データベースのセットアップ](./dashboard-app/06-setting-up-your-database.md)** - PostgreSQL設定とVercelデプロイ
- **[07. データの取得](./dashboard-app/07-fetching-data.md)** - Server Components、API vs データベースクエリ
- **[08. 静的および動的レンダリング](./dashboard-app/08-static-and-dynamic-rendering.md)** - レンダリング戦略の選択

### パフォーマンス最適化（第9章-第10章）

- **[09. ストリーミング](./dashboard-app/09-streaming.md)** - `loading.tsx`とSuspenseによるUX改善
- **[10. 部分的プリレンダリング](./dashboard-app/10-partial-prerendering.md)** - PPR（実験的機能）による最適化

### 機能実装（第11章-第12章）

- **[11. 検索とページネーション](./dashboard-app/11-adding-search-and-pagination.md)** - URL検索パラメータとNext.js API活用
- **[12. データの変更](./dashboard-app/12-mutating-data.md)** - Server Actionsによる CRUD 操作

### エラーハンドリングとアクセシビリティ（第13章-第14章）

- **[13. エラーハンドリング](./dashboard-app/13-error-handling.md)** - `error.tsx`、404エラー、例外処理
- **[14. アクセシビリティの改善](./dashboard-app/14-improving-accessibility.md)** - ESLintプラグイン、フォーム検証、a11y

### セキュリティとSEO（第15章-第16章）

- **[15. 認証の追加](./dashboard-app/15-adding-authentication.md)** - NextAuth.js、Middleware、ルート保護
- **[16. メタデータの追加](./dashboard-app/16-adding-metadata.md)** - SEO最適化、Open Graph、ファビコン

### まとめ（第17章）

- **[17. 次のステップ](./dashboard-app/17-next-steps.md)** - さらなる学習リソースと展開方法

## 🚀 学習パス推奨順序

### 🟢 初級：基礎固め（第0-5章）

1. **環境構築**：イントロダクション → はじめに
2. **スタイリング基礎**：CSS → フォント・画像最適化
3. **ルーティング理解**：レイアウト・ページ → ナビゲーション

### 🟡 中級：実践開発（第6-12章）

1. **データ層構築**：データベースセットアップ → データ取得
2. **パフォーマンス**：レンダリング戦略 → ストリーミング
3. **機能実装**：検索・ページネーション → データ変更

### 🔴 上級：本番対応（第13-17章）

1. **信頼性**：エラーハンドリング → アクセシビリティ
2. **セキュリティ**：認証 → メタデータ
3. **展開準備**：次のステップ

## 🛠️ 主要技術習得項目

### Next.js 核心機能

- **App Router**：ファイルシステムベースルーティング
- **Server Components**：サーバーサイドレンダリング最適化
- **Server Actions**：サーバーサイドフォーム処理
- **Streaming & Suspense**：段階的コンテンツ読み込み
- **静的・動的レンダリング**：パフォーマンス最適化戦略

### 開発実務スキル

- **TypeScript**：型安全なコード記述
- **データベース設計**：PostgreSQL スキーマ設計
- **認証・認可**：NextAuth.js によるセキュリティ実装
- **アクセシビリティ**：WCAG準拠のUI設計
- **SEO最適化**：メタデータとソーシャル共有設定

### DevOps・デプロイ

- **Vercel**：CI/CD パイプライン
- **環境変数管理**：本番・開発環境分離
- **パフォーマンス監視**：Core Web Vitals 最適化

## 📋 前提知識・システム要件

### 必要な知識

- **React基礎**：コンポーネント、props、state、フック
- **JavaScript/TypeScript**：ES6+、async/await
- **HTML/CSS**：セマンティックマークアップ、レスポンシブデザイン

### システム要件

- **Node.js**：18.18.0 以降
- **パッケージマネージャー**：pnpm（推奨）、npm、yarn
- **アカウント**：GitHub、Vercel
- **OS**：macOS、Windows（WSL）、Linux

## 🔄 実践的学習フロー

### 段階的スキル習得

1. **構築しながら学習**：理論より実践重視
2. **既存コードベース活用**：実際の開発環境を模擬
3. **段階的複雑化**：シンプルな機能から高度な最適化まで

### 各章の学習目標

- **明確な成果物**：各章で具体的な機能を完成
- **実践的コード例**：コピー&ペースト可能なサンプル
- **ベストプラクティス**：業界標準の開発手法

## 🌟 特別な学習ポイント

### 最新技術対応

- **Next.js 14**：最新のApp Router機能
- **React 18+**：Server Components、Suspense
- **実験的機能**：Partial Prerendering（PPR）

### 実務直結スキル

- **フルスタック開発**：フロントエンド〜バックエンド〜データベース
- **プロダクション品質**：エラーハンドリング、セキュリティ、パフォーマンス
- **チーム開発対応**：TypeScript、ESLint、アクセシビリティ

## 🔗 関連リンク・リソース

### 公式ドキュメント

- [Next.js Learn Course](https://nextjs.org/learn/dashboard-app)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Vercel Documentation](https://vercel.com/docs)

### 開発ツール

- [Next.js Templates](https://vercel.com/templates/next.js)
- [Tailwind CSS](https://tailwindcss.com)
- [NextAuth.js](https://next-auth.js.org)
- [PostgreSQL](https://www.postgresql.org)

### コミュニティ・サポート

- [Next.js GitHub](https://github.com/vercel/next.js)
- [Vercel Discord](https://discord.gg/vercel)
- [Next.js Reddit](https://reddit.com/r/nextjs)

---

> **注意**: 一部機能（Partial Prerendering等）は実験的なものです。本番環境での使用前に最新ドキュメントをご確認ください。

> **推奨**: このコースは段階的に進めることを強く推奨します。各章の理解を確認してから次に進んでください。
