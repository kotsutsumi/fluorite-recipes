# CLAUDE.md

このファイルは、このリポジトリのコードで作業する際にClaude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

Fluorite Recipesは、Next.js 15アプリケーションを含むモノレポです。メインの本番アプリケーションは `apps/base` にあり、React 19、TypeScript 5（strict mode）、Tailwind CSS v4、およびBiomeをlinting/formattingに使用したApp Routerアーキテクチャを採用しています。

## 作業ディレクトリ

**重要**: すべての開発コマンドは、リポジトリルートではなく `apps/base/` ディレクトリから実行する必要があります。

```bash
cd apps/base
```

## 開発コマンド

### 基本コマンド

```bash
# 開発サーバーを起動（Turbopack有効）
npm run dev
# または
pnpm dev

# 本番ビルド
npm run build

# 本番サーバーを起動
npm run start

# リンターを実行
npm run lint

# コードを自動フォーマット
npm run format
```

### ポート情報

開発サーバーは `http://localhost:3000` で起動します

## アーキテクチャ

### Next.js 15 App Router構造

- **エントリーポイント**: `apps/base/src/app/page.tsx` - ホームページ
- **ルートレイアウト**: `apps/base/src/app/layout.tsx` - Geistフォントとグローバルスタイルを含む共有レイアウト
- **グローバルスタイル**: `apps/base/src/app/globals.css` - TailwindのインポートとCSS変数の定義
- **静的アセット**: `apps/base/public/` - SVGおよび静的ファイル

### 主要なアーキテクチャパターン

- **デフォルトはサーバーコンポーネント**: クライアント側のインタラクティビティが必要な場合を除き、Reactサーバーコンポーネントを使用
- **真実の情報源としてのCSS変数**: すべての色とフォントはCSS変数を使用して `globals.css` で定義
- **Tailwind CSS v4**: トークン定義に `@theme inline` ディレクティブを使用
- **フォント読み込み**: Geist SansとGeist Monoを `next/font/google` 経由で読み込み、CSS変数として公開

### パスエイリアス

TypeScriptは `@/*` エイリアスを `apps/base/src/*` にマッピングするよう設定されています：

```typescript
import Component from "@/components/Component";
```

## コーディング規約

### TypeScript

- Strict mode有効
- ターゲット: ES2017
- すべてのコンポーネントは型付きReact関数コンポーネントにする
- 公開APIには推論よりも明示的な型を優先

### スタイリング

- PostCSSを使用したTailwind CSS v4
- ユーティリティを論理的順序で配置: layout → spacing → typography
- `globals.css` のCSS変数がテーマトークンを定義
- ダークモードは `prefers-color-scheme` メディアクエリで処理
- カスタムテーマトークンは `@theme inline` ブロックで定義

### コードフォーマット

- **ツール**: Biome 2.2.0（ESLint/Prettierではない）
- **インデント**: 2スペース
- **インポート整理**: Biomeの `organizeImports` で自動化
- **ルール**: Next.jsとReactの推奨ルールを有効化
- コミット前に `npm run format` を実行

### ファイル構成

- 関連コンポーネントは `src/app` 内の機能フォルダに配置
- コンポーネントにはTypeScriptの `.tsx` 拡張子を使用、ユーティリティには `.ts` を使用
- テストファイルは `*.test.tsx` としてコンポーネントの隣に配置（テスト追加時）

## テスト

**現状**: テストインフラストラクチャはまだ設定されていません。

**将来のテスト戦略**（AGENTS.mdより）：

- フレームワーク: Vitest + React Testing Library
- `npm run test` スクリプトを追加
- テストは `*.test.tsx` としてコンポーネントの隣または `__tests__` フォルダに配置
- 目標: 新規コードで80%以上のカバレッジ
- ルーティングや非同期フローの統合テストを含める

## Gitワークフロー

### コミットメッセージ

Conventional Commits形式を使用：

```
feat: 新機能を追加
fix: バグを修正
chore: 依存関係を更新
docs: ドキュメントを更新
```

### ブランチ戦略

- メインブランチ: `main`
- 開発ブランチ: `develop`
- PRは `develop` ブランチに対して作成

### プルリクエスト要件

- 変更内容を明確に説明
- 関連するissueをリンク
- UI変更の場合はスクリーンショットを含める
- `npm run lint` と `npm run format` が通過することを確認
- フォローアップタスクや技術的負債を文書化

## 環境要件

- **Node.js**: Next.js 15には18.18+または20.xが必要
- **パッケージマネージャー**: pnpm推奨、npmも動作（変更するロックファイルに合わせる）
- `node_modules` と `.next` はバージョン管理の対象外

## 設定ファイル

- `biome.json` - リントとフォーマットのルール
- `next.config.ts` - Next.js設定（現在は最小限）
- `tsconfig.json` - strict modeのTypeScriptコンパイラオプション
- `postcss.config.mjs` - Tailwind PostCSS設定
- `pnpm-workspace.yaml` - モノレポワークスペース設定

## 重要な注意事項

- **Turbopack**: devとbuildコマンドでデフォルトで有効
- **React 19**: 新機能を備えた最新のReactバージョンを使用
- **BiomeをPrettier/ESLintの代わりに使用**: プロジェクトではすべてのlinting/formattingにBiomeを使用
- **Unknown At-Rulesを無効化**: Tailwind CSS v4互換性のためBiomeで無効化
