# CLAUDE.md

このファイルは、このリポジトリのコードで作業する際にClaude Code (claude.ai/code) にガイダンスを提供します。

## プロジェクト概要

Fluorite Recipesは、Webとモバイルアプリケーションのためのモノレポです。Next.js 15（Web）とExpo（モバイル）の2つのアプリがあり、TypeScript 5（strict mode）、最新のReact、モダンなツールチェーンを使用しています。

## 重要: 作業ディレクトリ

**開発コマンドは各アプリのディレクトリから実行する必要があります。リポジトリルートからは実行しないでください。**

```bash
# Next.js Webアプリ
cd apps/nextjs/base

# Expo モバイルアプリ
cd apps/expo/base
```

## 開発コマンド

### Next.js Webアプリ（`apps/nextjs/base`）

```bash
# 開発サーバー起動（Turbopack有効） - http://localhost:3000
pnpm dev
# または: npm run dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# リント
pnpm lint

# 自動フォーマット
pnpm format
```

### Expo モバイルアプリ（`apps/expo/base`）

```bash
# 開発サーバー起動
pnpm start

# iOS シミュレーター
pnpm ios

# Android エミュレーター
pnpm android

# Web ブラウザ
pnpm web

# リント
pnpm lint
```

## アーキテクチャ

### モノレポ構造

```
apps/
├── nextjs/base/    # Next.js 15 App Router Webアプリ
│   ├── src/app/    # ページとレイアウト
│   ├── public/     # 静的アセット
│   └── biome.json  # Biome設定
└── expo/base/      # Expo Router モバイルアプリ
    ├── app/        # 画面とナビゲーション
    ├── components/ # 共有UIコンポーネント
    ├── hooks/      # カスタムフック
    └── assets/     # 画像とアイコン
```

### Next.js App Router構造

- **`src/app/page.tsx`**: ホームページ（エントリーポイント）
- **`src/app/layout.tsx`**: Geistフォントとグローバルスタイルを含むルートレイアウト
- **`src/app/globals.css`**: TailwindのインポートとCSS変数、テーマトークン
- **`public/`**: 静的アセット（SVG、画像）

### Expo Router構造

- **`app/`**: 画面とタブナビゲーション
- **`components/`**: 再利用可能なUIコンポーネント
- **`hooks/`**: カスタムReactフック
- **`assets/`**: デバイス固有のアセット

### 主要なパターン

#### Next.js（Web）

1. **サーバーコンポーネント優先**: デフォルトでReactサーバーコンポーネントを使用。クライアント側のインタラクティビティが必要な場合のみ `"use client"` を追加。

2. **真実の情報源としてのCSS変数**: すべての色とフォントは `globals.css` でCSS変数を使用して定義：
   ```css
   :root {
     --background: #ffffff;
     --foreground: #171717;
   }
   ```

3. **Tailwind CSS v4 の @theme inline**: 新しい `@theme inline` ディレクティブを使用したテーマトークン定義：
   ```css
   @theme inline {
     --color-background: var(--background);
     --font-sans: var(--font-geist-sans);
   }
   ```

4. **フォント読み込みパターン**: `next/font/google` 経由でフォントを読み込み、CSS変数として公開：
   ```typescript
   const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
   });
   ```

#### Expo（モバイル）

1. **Expo Router**: ファイルベースルーティング（`app/` ディレクトリ構造）
2. **説明的な命名**: フックとコンポーネントには明確な名前を使用（`useRecipeFilters`、`RecipeCard`）
3. **クロスプラットフォーム**: iOS、Android、Webで動作するコードを記述

### パスエイリアス

**Next.js**: TypeScriptは `@/*` エイリアスを `apps/nextjs/base/src/*` にマッピング：

```typescript
import Component from "@/components/Component";
```

**Expo**: 設定に応じてエイリアスを使用

## コーディング規約

### TypeScript

- Strict mode有効（`strict: true`）
- ターゲット: ES2017
- 型付きReact関数コンポーネントを使用
- 公開APIには推論よりも明示的な型を優先

### スタイリングガイドライン

#### Next.js（Web）
- **ユーティリティ順序**: layout → spacing → typography
- **ダークモード**: `prefers-color-scheme` メディアクエリで処理
- **トークンソース**: `globals.css` のCSS変数が唯一の真実の情報源

#### Expo（モバイル）
- StyleSheetまたはTailwind CSS for React Native
- プラットフォーム固有のスタイリングは `Platform.select()` を使用

### リントとフォーマット

#### Next.js（Web）
- **ツール**: Biome 2.2.0（ESLint/Prettierではない）
- **インデント**: 2スペース
- **インポート整理**: `organizeImports` で自動化
- **設定**: Next.jsとReactドメインを有効にした `biome.json`
- **コミット前**: 常に `pnpm format` を実行

#### Expo（モバイル）
- **ツール**: `eslint-config-expo`
- コミット前にリンターを実行

### ファイル構成

#### Next.js
- 関連コンポーネントは `src/app` 内の機能フォルダに配置
- コンポーネントには `.tsx`、ユーティリティには `.ts` を使用
- 将来のテスト: `*.test.tsx` をコンポーネントの隣または `__tests__/` に配置

#### Expo
- 画面は `app/` に配置
- 共有コンポーネントは `components/` に配置
- フックは `hooks/` に配置
- テストはファイルの隣に配置

## テスト

**現状**: テストインフラストラクチャはまだ設定されていません。

**将来の戦略**（テスト追加時）：
- **フレームワーク**: Vitest + React Testing Library
- **スクリプト**: package.jsonに `npm run test` を追加
- **配置場所**: コンポーネントの隣に `*.test.tsx` を配置、または `__tests__/` に配置
- **カバレッジ目標**: 新規コードで80%以上
- **統合テスト**: ルーティングと非同期フローのテスト（Next.jsルート変更、Expoタブスタック）

## Gitワークフロー

### コミットメッセージ（Conventional Commits）

```
feat: 新機能を追加
fix: バグを修正
chore: 依存関係を更新
docs: ドキュメントを更新
```

### ブランチ戦略

- **メインブランチ**: `main`
- **開発ブランチ**: `develop`
- **PR**: `develop` ブランチに対して作成

### PR要件

- 変更内容の明確な説明
- 関連するissueをリンク
- UI変更の場合はスクリーンショットまたは録画を含める
- `pnpm lint` と `pnpm format` が通過することを確認
- フォローアップタスクや技術的負債を文書化

## 環境要件

- **Node.js**: 18.18+または20.x（Next.js 15に必要）
- **パッケージマネージャー**: pnpm推奨（ロックファイル: `pnpm-lock.yaml`）
- **Git Ignore**: `node_modules/`、`.next/`、`node_modules/`、ビルド成果物

## 設定ファイル

### Next.js（`apps/nextjs/base/`）
- **`biome.json`**: リントとフォーマットルール、Next.js/Reactドメイン
- **`next.config.ts`**: Next.js設定（現在は最小限）
- **`tsconfig.json`**: TypeScript strict mode、パスエイリアス
- **`postcss.config.mjs`**: Tailwind PostCSS設定
- **`pnpm-workspace.yaml`**: モノレポワークスペース定義

### Expo（`apps/expo/base/`）
- **`app.json`**: Expo設定
- **`tsconfig.json`**: TypeScript設定
- **`metro.config.js`**: Metro bundler設定

## 重要な注意事項

### Next.js（Web）
- **Turbopack**: devとbuildコマンドでデフォルトで有効（`--turbopack` フラグ）
- **React 19**: 新機能とパターンを備えた最新バージョンを使用
- **BiomeをESLint/Prettierの代わりに使用**: すべてのコード品質ツールをBiomeに統合
- **Unknown At-Rulesを無効化**: Tailwind CSS v4互換性のためBiome設定で無効化

### Expo（モバイル）
- **Expo Router**: ファイルベースルーティングシステム
- **クロスプラットフォーム**: iOS、Android、Web対応
- **eslint-config-expo**: Expo推奨のESLint設定を使用

## 追加コンテキスト

詳細なリポジトリガイドラインについては `AGENTS.md` を参照してください。
