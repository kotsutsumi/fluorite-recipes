# 🧪 Fluorite Recipes

フルオライト・レシピは、Next.js 15とTailwind CSS v4を使用したモダンなフルスタックWebアプリケーションのレシピ集です。App Routerとサーバーコンポーネントを活用し、高性能でスケーラブルなWebアプリケーションの構築パターンを提供しています。

## 📖 概要

このプロジェクトは、最新のWeb開発技術を組み合わせた実践的なレシピ集として設計されています。各レシピは再利用可能なコンポーネントとパターンを提供し、開発者が効率的にモダンなWebアプリケーションを構築できるようサポートします。

### 主な特徴

- 🚀 **パフォーマンス最適化**: サーバーコンポーネントとStreaming SSRによる高速レンダリング
- 🎨 **モダンUI**: Tailwind CSS v4による柔軟なデザインシステム
- 📱 **レスポンシブ対応**: モバイルファーストなアプローチ
- 🔧 **開発者体験**: TypeScript strict mode、Biome、Turbopackによる快適な開発環境
- 🔄 **継続的改善**: 最新のReactエコシステムのベストプラクティスを採用

## 🚀 技術スタック

### コア技術

- **フレームワーク**: [Next.js 15](https://nextjs.org/) (App Router) - React ベースのフルスタックフレームワーク
- **言語**: [TypeScript 5](https://www.typescriptlang.org/) (strict mode) - 型安全性とコード品質の向上
- **UI ライブラリ**: [React 19.1.0](https://react.dev/) - 最新のReact機能を活用
- **スタイリング**: [Tailwind CSS v4](https://tailwindcss.com/) - ユーティリティファーストCSS
- **ビルドツール**: [Turbopack](https://turbo.build/pack) - 高速なバンドラー

### 開発ツール

- **リンター**: [Biome](https://biomejs.dev/) - 高速なリンターとフォーマッター
- **パッケージマネージャー**: [pnpm](https://pnpm.io/) - 効率的な依存関係管理
- **型チェック**: TypeScript strict mode - 厳密な型チェック
- **Git フック**: Conventional Commits対応

### アーキテクチャの特徴

- **サーバーコンポーネント**: デフォルトでサーバー側レンダリング
- **Streaming SSR**: プログレッシブなページレンダリング
- **Static Generation**: 可能な箇所で静的生成を活用
- **ファイルベースルーティング**: App Routerによる直感的なルーティング

## 📁 プロジェクト構造

```
fluorite-recipes/
├── 📄 AGENTS.md                 # エージェント向けガイドライン
├── 📄 CLAUDE.md                 # Claude AI向け設定
├── 📄 LICENSE.md               # ライセンス情報
├── 📄 README.md               # プロジェクト概要（このファイル）
└── 📁 apps/
    ├── 📁 expo/               # React Native Expo アプリ（開発中）
    │   └── 📁 base/
    │       ├── app.json       # Expo設定
    │       ├── package.json   # Expo専用依存関係
    │       └── 📁 app/        # Expo Router構造
    └── 📁 nextjs/            # Next.js Webアプリケーション
        └── 📁 base/          # メインアプリケーション
            ├── ⚙️ biome.json      # Biome設定（ESLint/Prettier代替）
            ├── ⚙️ next.config.ts  # Next.js設定
            ├── 📦 package.json    # 依存関係とスクリプト
            ├── 🔒 pnpm-lock.yaml  # 依存関係ロック
            ├── ⚙️ tsconfig.json   # TypeScript設定
            ├── ⚙️ postcss.config.mjs # PostCSS設定
            ├── 📁 public/         # 静的アセット（画像、アイコンなど）
            │   ├── file.svg
            │   ├── globe.svg
            │   ├── next.svg
            │   ├── vercel.svg
            │   └── window.svg
            └── 📁 src/
                └── 📁 app/        # App Router pages & layouts
                    ├── 🎨 globals.css  # グローバルスタイル（Tailwind CSS含む）
                    ├── 🧱 layout.tsx   # ルートレイアウト（共通UI）
                    └── 🏠 page.tsx     # ホームページ
```

### ディレクトリ構造の説明

- **`apps/`**: モノレポ構造でWebとモバイルアプリを管理
- **`nextjs/base/src/app/`**: Next.js App Routerのページとレイアウト
- **`public/`**: CDN経由で配信される静的ファイル
- **`globals.css`**: Tailwind CSS設定とカスタムCSS変数

## 🛠 開発環境のセットアップ

### 前提条件

- **Node.js**: 18.18+ または 20.x（LTS推奨）
- **パッケージマネージャー**: pnpm 8.x（推奨）または npm 9.x
- **Git**: 最新版
- **エディタ**: VS Code（推奨）+ Biome拡張機能

### クイックスタート

1. **リポジトリをクローン**:

```bash
git clone https://github.com/kotsutsumi/fluorite-recipes.git
cd fluorite-recipes
```

2. **Next.jsアプリのディレクトリに移動**:

```bash
cd apps/nextjs/base
```

3. **依存関係をインストール**:

```bash
# pnpm使用（推奨）
pnpm install

# または npm使用
npm ci
```

4. **開発サーバーを起動**:

```bash
pnpm dev
```

5. **ブラウザでアクセス**: `http://localhost:3000`

### 環境変数の設定（必要に応じて）

プロジェクトルートに `.env.local` ファイルを作成：

```bash
# データベース接続（将来の機能）
# DATABASE_URL="postgresql://..."

# 認証設定（将来の機能）
# NEXTAUTH_SECRET="your-secret-key"
# NEXTAUTH_URL="http://localhost:3000"
```

## 🏃‍♂️ 使用方法

### 開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
pnpm dev
# → http://localhost:3000 でアクセス可能

# 型チェック
pnpm type-check

# ウォッチモードでの型チェック
pnpm type-check:watch
```

### ビルドとデプロイ

```bash
# 本番用ビルド作成
pnpm build

# ビルド結果をローカルで確認
pnpm start
# → http://localhost:3000 で本番ビルドを確認

# 静的エクスポート（必要に応じて）
pnpm export
```

### コード品質管理

```bash
# リント実行（Biome使用）
pnpm lint

# リント＋自動修正
pnpm lint:fix

# フォーマット実行
pnpm format

# 全品質チェック実行
pnpm quality:check
```

### パフォーマンス分析

```bash
# バンドルサイズ分析
pnpm analyze

# パフォーマンス測定
pnpm perf
```

### 便利な開発ツール

- **Hot Reload**: ファイル変更時の自動リロード
- **Fast Refresh**: React状態を保持した高速更新
- **TypeScript エラー表示**: リアルタイムの型エラー検出
- **Tailwind IntelliSense**: VS Code拡張でのCSS補完

## 🎨 コーディング規約

### TypeScript ガイドライン

- **strict mode**: 厳密な型チェックを必須とする
- **型定義**: `any` の使用を避け、適切な型定義を行う
- **インターフェース**: 再利用可能な型は `interface` で定義
- **型エイリアス**: ユニオン型や複雑な型は `type` で定義

```typescript
// ✅ 良い例
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ 悪い例
const user: any = { id: 1, name: "John" };
```

### React コンポーネント規約

- **関数コンポーネント**: `function` キーワードを使用
- **サーバーコンポーネント**: デフォルトでサーバーコンポーネントとして実装
- **クライアントコンポーネント**: 必要な場合のみ `"use client"` を使用
- **Props 型定義**: インターフェースで明確に定義

```typescript
// ✅ サーバーコンポーネント（デフォルト）
interface PageProps {
  params: { id: string };
}

export default function ProductPage({ params }: PageProps) {
  return <div>Product {params.id}</div>;
}

// ✅ クライアントコンポーネント（必要時のみ）
"use client";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function Button({ onClick, children }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### CSS & Tailwind 規約

- **ユーティリティファースト**: Tailwindクラスを優先使用
- **カスタムCSS**: `globals.css` でCSS変数として定義
- **レスポンシブ**: モバイルファーストでブレークポイントを設定
- **クラス順序**: `prettier-plugin-tailwindcss` に従う

```css
/* globals.css でのCSS変数定義 */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --font-family-sans: "Inter", sans-serif;
}

/* Tailwindクラスの使用例 */
.card {
  @apply rounded-lg border border-gray-200 bg-white p-6 shadow-sm;
}
```

### ファイル・ディレクトリ構造

- **パスエイリアス**: `@/*` で `src/` 以下を参照
- **コンポーネント**: 機能別にディレクトリ分け
- **ページ**: App Routerの規約に従う
- **型定義**: `types/` ディレクトリに集約

```
src/
├── app/
│   ├── (dashboard)/          # ルートグループ
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/                  # API Routes
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                   # 基本UIコンポーネント
│   └── features/             # 機能別コンポーネント
├── lib/                      # ユーティリティ関数
├── types/                    # 型定義
└── styles/                   # CSS関連ファイル
```

### コード品質基準

- **2スペースインデント**: Biome設定に従う
- **セミコロン**: 必須
- **クォート**: シングルクォート優先
- **trailing comma**: 複数行の場合は必須
- **インポート順序**: Biomeによる自動ソート

```typescript
// ✅ インポート順序例
import React from "react";
import { NextPage } from "next";

import { Button } from "@/components/ui/button";
import { UserService } from "@/lib/services/user";
import type { User } from "@/types/user";
```

## 🧪 テスト戦略

### 現在の状況

現在、自動テストは設定されていませんが、今後の実装で以下の戦略を採用予定です。

### 予定されているテスト構成

```bash
# テスト環境のセットアップ（今後実装）
pnpm add -D vitest @testing-library/react @testing-library/jest-dom

# テスト実行コマンド（今後実装）
pnpm test              # 全テスト実行
pnpm test:watch        # ウォッチモード
pnpm test:coverage     # カバレッジ付き実行
pnpm test:ui          # Vitest UI
```

### テスト戦略

#### 1. **ユニットテスト**

- **フレームワーク**: [Vitest](https://vitest.dev/)
- **React テスト**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **カバレッジ目標**: 新規コードで80%以上
- **配置場所**: `*.test.tsx` または `__tests__/` フォルダ

#### 2. **インテグレーションテスト**

- **ルーティング**: Next.js App Routerのナビゲーション
- **API ルート**: `/api` エンドポイントのテスト
- **データフロー**: コンポーネント間のデータの流れ

#### 3. **E2Eテスト**（将来的に）

- **フレームワーク**: [Playwright](https://playwright.dev/)
- **シナリオ**: 主要なユーザージャーニー
- **ブラウザ**: Chrome, Firefox, Safari

### テストファイル例

```typescript
// components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  test('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### テスト導入時の設定ファイル

```typescript
// vitest.config.ts（今後追加予定）
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

## � デプロイメント

### Vercel（推奨）

このプロジェクトは Vercel での デプロイに最適化されています。

```bash
# Vercel CLI のインストール
npm i -g vercel

# デプロイ
vercel

# 本番デプロイ
vercel --prod
```

#### Vercel 設定例

```json
// vercel.json
{
  "buildCommand": "cd apps/nextjs/base && pnpm build",
  "outputDirectory": "apps/nextjs/base/.next",
  "devCommand": "cd apps/nextjs/base && pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["nrt1"]
}
```

### その他のプラットフォーム

#### Netlify

```bash
# Build設定
Build command: cd apps/nextjs/base && pnpm build && pnpm export
Publish directory: apps/nextjs/base/out
```

#### Docker

```dockerfile
# Dockerfile 例（今後追加予定）
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["pnpm", "start"]
```

### 環境変数の設定

本番環境では以下の環境変数を設定してください：

```bash
# 本番環境用
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# データベース（将来の機能）
DATABASE_URL=your_production_database_url

# 認証（将来の機能）
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-domain.com
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. 依存関係の問題

```bash
# node_modules と lockfile のクリア
rm -rf node_modules pnpm-lock.yaml
pnpm install

# pnpm キャッシュのクリア
pnpm store prune
```

#### 2. TypeScript エラー

```bash
# TypeScript キャッシュのクリア
rm -rf .next/types
pnpm type-check

# VS Code の TypeScript サーバー再起動
# コマンドパレット > "TypeScript: Restart TS Server"
```

#### 3. Tailwind CSS が適用されない

```bash
# PostCSS 設定の確認
cat postcss.config.mjs

# Tailwind キャッシュのクリア
rm -rf .next
pnpm dev
```

#### 4. ポート競合エラー

```bash
# プロセスの確認
lsof -i :3000

# プロセスの強制終了
kill -9 $(lsof -t -i:3000)

# 別ポートでの起動
pnpm dev -- -p 3001
```

#### 5. メモリ不足エラー

```bash
# Node.js のメモリ上限を増加
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm dev
```

### デバッグ方法

#### 1. Next.js のデバッグモード

```bash
# デバッグ情報を有効化
DEBUG=* pnpm dev

# 特定の機能のみ
DEBUG=next:* pnpm dev
```

#### 2. ブラウザでのデバッグ

- **React DevTools**: コンポーネント階層の確認
- **Chrome DevTools**: パフォーマンス分析
- **Network タブ**: リクエスト/レスポンスの確認

#### 3. VS Code でのデバッグ

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## ⚡ パフォーマンス最適化

### ビルド最適化

```bash
# バンドルサイズ分析
pnpm build --analyze

# 依存関係の分析
pnpm list --depth=0
pnpm audit
```

### 実行時最適化

#### 1. 画像最適化

```typescript
import Image from 'next/image';

// ✅ Next.js Image コンポーネントを使用
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority // Above-the-fold 画像には priority を設定
  placeholder="blur" // ぼかしプレースホルダー
/>
```

#### 2. フォント最適化

```typescript
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // フォント読み込み最適化
});
```

#### 3. コード分割

```typescript
// 動的インポートによるコード分割
const DynamicComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // クライアントサイドのみで読み込む場合
});
```

### Core Web Vitals 最適化

- **LCP (Largest Contentful Paint)**: 画像最適化、フォント最適化
- **FID (First Input Delay)**: JavaScript バンドルサイズの削減
- **CLS (Cumulative Layout Shift)**: レイアウトシフトの防止

```typescript
// レイアウトシフト防止の例
<div className="aspect-video"> {/* アスペクト比固定 */}
  <Image
    src="/video-thumbnail.jpg"
    alt="Video thumbnail"
    fill
    className="object-cover"
  />
</div>
```

## 📝 コミット・コラボレーション規約

### Conventional Commits

このプロジェクトでは [Conventional Commits](https://www.conventionalcommits.org/) を採用しています。

#### コミットメッセージフォーマット

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### コミットタイプ

- **feat**: 新機能の追加
- **fix**: バグ修正
- **docs**: ドキュメントの変更
- **style**: コードの意味に影響しない変更（空白、フォーマットなど）
- **refactor**: バグ修正や機能追加以外のコード変更
- **perf**: パフォーマンス改善
- **test**: テストの追加・修正
- **chore**: ビルドプロセスやツールの変更
- **ci**: CI設定ファイルやスクリプトの変更

#### コミット例

```bash
# 機能追加
git commit -m "feat: ユーザー認証機能を追加"
git commit -m "feat(auth): Google OAuth2 ログインを実装"

# バグ修正
git commit -m "fix: レスポンシブデザインの不具合を修正"
git commit -m "fix(ui): モバイルでのナビゲーションメニューの表示問題を解決"

# ドキュメント更新
git commit -m "docs: README.md にデプロイ手順を追加"

# リファクタリング
git commit -m "refactor: hooks の共通ロジックを抽出"

# パフォーマンス改善
git commit -m "perf: 画像遅延読み込みを実装してLCPを改善"
```

#### コミット前のチェックリスト

```bash
# 1. リントチェック
pnpm lint

# 2. フォーマットチェック
pnpm format

# 3. 型チェック
pnpm type-check

# 4. ビルドチェック
pnpm build
```

### ブランチ戦略

#### ブランチ命名規則

```bash
# 機能開発
feature/user-authentication
feature/recipe-search

# バグ修正
fix/responsive-navigation
fix/image-optimization

# ホットフィックス
hotfix/security-patch

# リリース準備
release/v1.2.0
```

#### Git Flow

```bash
# 1. 最新のdevelopを取得
git checkout develop
git pull origin develop

# 2. フィーチャーブランチを作成
git checkout -b feature/new-component

# 3. 作業・コミット
git add .
git commit -m "feat: 新しいコンポーネントを追加"

# 4. リモートにプッシュ
git push origin feature/new-component

# 5. プルリクエストを作成
```

## 🤝 コントリビューション

### プルリクエストガイドライン

#### PR作成前のチェックリスト

- [ ] 最新の `develop` ブランチからブランチを作成
- [ ] コミットメッセージが Conventional Commits に準拠
- [ ] `pnpm lint` および `pnpm format` が通る
- [ ] `pnpm type-check` および `pnpm build` が成功
- [ ] 関連する issue が存在する（または新規作成）

#### PRテンプレート

```markdown
## 📋 概要

<!-- 変更内容の簡潔な説明 -->

## 🔗 関連Issue

<!-- Fixes #123 または Closes #123 -->

## 🧪 テスト

<!-- テスト方法や確認項目 -->

- [ ] ローカルでの動作確認
- [ ] レスポンシブデザインの確認
- [ ] ブラウザ互換性の確認

## 📱 スクリーンショット

<!-- UI変更がある場合はスクリーンショットを添付 -->

## 🔄 Breaking Changes

<!-- 破壊的変更がある場合は詳細を記載 -->

## 📝 その他

<!-- 追加情報やレビューワーへの注意事項 -->
```

#### レビュープロセス

1. **自動チェック**: CI/CDパイプラインでのリント・ビルド確認
2. **コードレビュー**: 最低1名のレビューワーによる承認
3. **マージ**: `develop` ブランチへの squash merge

### Issue 管理

#### Issue テンプレート

**バグレポート**

```markdown
## 🐛 バグの説明

<!-- バグの詳細な説明 -->

## 🔄 再現手順

1.
2.
3.

## 💻 環境

- OS:
- ブラウザ:
- Node.js:
- pnpm:

## 📋 期待される動作

<!-- 期待していた動作 -->

## 📋 実際の動作

<!-- 実際に起こった動作 -->
```

**機能リクエスト**

```markdown
## 🚀 機能の説明

<!-- 提案する機能の詳細 -->

## 💡 動機・背景

<!-- この機能が必要な理由 -->

## 📋 受け入れ条件

<!-- 機能完成の条件 -->

## 🔄 代替案

<!-- 検討した他の解決方法 -->
```

### 開発環境の貢献

#### VS Code 設定

```json
// .vscode/settings.json（推奨設定）
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### 推奨VS Code拡張機能

```json
// .vscode/extensions.json
{
  "recommendations": [
    "biomejs.biome",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

## � 学習リソース・参考資料

### 公式ドキュメント

- **[Next.js 15 Documentation](https://nextjs.org/docs)** - App Router、サーバーコンポーネント
- **[React 19 Documentation](https://react.dev/)** - 最新のReact機能
- **[Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)** - ユーティリティクラス
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - 型システム
- **[Biome Documentation](https://biomejs.dev/)** - リンター・フォーマッター

### ベストプラクティス

- **[Next.js Performance](https://nextjs.org/learn/performance)** - パフォーマンス最適化
- **[React Performance](https://react.dev/learn/render-and-commit)** - レンダリング最適化
- **[Web.dev](https://web.dev/)** - Core Web Vitals、SEO
- **[TypeScript Best Practices](https://typescript-eslint.io/rules/)** - TypeScript規約

### コミュニティ・エコシステム

- **[Vercel Examples](https://github.com/vercel/next.js/tree/canary/examples)** - Next.js実装例
- **[Tailwind UI](https://tailwindui.com/)** - コンポーネントライブラリ
- **[Headless UI](https://headlessui.com/)** - アクセシブルなUIコンポーネント
- **[React Patterns](https://reactpatterns.com/)** - Reactデザインパターン

## 🔗 関連プロジェクト・依存関係

### 主要な依存関係

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "latest",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "latest",
    "postcss": "latest"
  }
}
```

### 今後の検討技術

- **🗄️ データベース**: Prisma + PostgreSQL / Supabase
- **🔐 認証**: NextAuth.js / Clerk
- **📡 状態管理**: Zustand / Jotai
- **🧪 テスト**: Vitest + React Testing Library + Playwright
- **📊 分析**: Vercel Analytics / Google Analytics 4
- **🔍 検索**: Algolia / MeiliSearch
- **💳 決済**: Stripe / PayPal
- **📧 メール**: Resend / SendGrid
- **🌐 国際化**: next-intl
- **🎨 アイコン**: Lucide React / Heroicons

## 📄 ライセンス

このプロジェクトは [LICENSE.md](LICENSE.md) で定義されたライセンスの下で公開されています。

## 🙋‍♂️ サポート・コミュニティ

### 質問・議論

- **GitHub Issues**: バグレポート・機能リクエスト
- **GitHub Discussions**: 質問・アイデア共有
- **Discord**: リアルタイム議論（コミュニティサーバー準備中）

### メンテナー

- **[@kotsutsumi](https://github.com/kotsutsumi)** - プロジェクトオーナー

### 貢献者

このプロジェクトは以下の素晴らしい貢献者によって支えられています：

<!-- 貢献者リストは自動生成される予定 -->
<a href="https://github.com/kotsutsumi/fluorite-recipes/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kotsutsumi/fluorite-recipes" />
</a>

---

## 🚀 今後のロードマップ

### v1.0.0 リリース予定機能

- [ ] 基本的なUIコンポーネントライブラリ
- [ ] レスポンシブデザインシステム
- [ ] ダークモードサポート
- [ ] SEO最適化
- [ ] パフォーマンス最適化
- [ ] アクセシビリティ対応

### v1.1.0 以降の機能

- [ ] ユーザー認証システム
- [ ] データベース統合
- [ ] API設計・実装
- [ ] 検索機能
- [ ] 多言語対応
- [ ] PWA対応
- [ ] E2Eテスト導入

### 技術的改善

- [ ] CI/CDパイプライン構築
- [ ] 自動化されたテストスイート
- [ ] パフォーマンス監視
- [ ] セキュリティスキャン
- [ ] 依存関係の自動更新

---

**🧪 Fluorite Recipes** で最新のWeb開発技術を体験し、高品質なWebアプリケーションを構築しましょう！

詳細な開発者向け情報は [AGENTS.md](AGENTS.md) をご参照ください。
