# Next.js App Router API Reference

このドキュメントは、Next.js App Router の包括的なAPI リファレンスです。LLMが解析・参照しやすいよう、各APIカテゴリの要約とリンクを含めています。

## 目次

- [ランタイム環境](#ランタイム環境)
- [CLI（コマンドラインインターフェース）](#cliコマンドラインインターフェース)
- [設定（Configuration）](#設定configuration)
- [ファイル規約（File Conventions）](#ファイル規約file-conventions)
- [React コンポーネント](#react-コンポーネント)
- [サーバー・クライアント関数](#サーバークライアント関数)
- [ディレクティブ](#ディレクティブ)
- [開発・ビルドツール](#開発ビルドツール)
- [使用パターンとベストプラクティス](#使用パターンとベストプラクティス)

---

## ランタイム環境

### 🌐 [`Edge Runtime`](./01-edge.md)

Next.js Edge Runtime は標準の Web API に基づいた軽量なランタイム環境です。

#### **主要な特徴**

- **軽量**: 従来の Node.js ランタイムよりも高速な起動
- **標準 Web API**: ブラウザ標準のAPIセットを使用
- **グローバル展開**: エッジロケーションでの実行に最適化

#### **サポートされる API カテゴリ**

**ネットワーク API**:

- `fetch` - HTTP リクエスト・レスポンス処理
- `Request`/`Response` - HTTP メッセージ表現
- `Headers` - HTTP ヘッダー操作
- `FormData` - フォームデータ処理
- `WebSocket` - リアルタイム通信

**エンコーディング API**:

- `TextEncoder`/`TextDecoder` - テキストエンコーディング
- `atob`/`btoa` - Base64 エンコード・デコード
- ストリーム処理 API

**暗号化 API**:

- `crypto.subtle` - 暗号化操作
- `crypto.getRandomValues()` - 安全な乱数生成

#### **使用場所**

- ミドルウェア（`middleware.ts`）
- Edge API Routes
- Edge Runtime指定のサーバーコンポーネント

### ⚡ [`Turbopack`](./02-turbopack.md)

**ベータ版** - JavaScript・TypeScript 用の増分バンドラー。Next.js に組み込まれ、開発速度を大幅に向上させます。

#### **主要な特徴**

- **高速バンドル**: 従来の webpack よりも大幅な高速化
- **増分コンパイル**: 変更部分のみを再コンパイル
- **Next.js 統合**: 設定不要で簡単に有効化

#### **使用方法**

```json
{
  "scripts": {
    "dev": "next dev --turbopack"
  }
}
```

#### **サポート状況**

- ✅ `next dev` - 開発サーバー
- ❌ `next build` - 本番ビルド（未対応）
- 🔄 `webpack()` 設定（対応作業中）
- 🔄 Babel 設定（対応作業中）

---

## CLI（コマンドラインインターフェース）

### 🛠️ [`CLI Tools`](./cli.md)

Next.js の包括的なコマンドラインツール群。プロジェクト作成から本番デプロイまでをサポート。

#### **プロジェクト作成**

**[`create-next-app`](./cli/01-create-next-app.md)** 🚀

- **公式推奨**: 新しい Next.js プロジェクトの作成
- **ゼロ依存関係**: 1秒で初期化完了
- **オフライン対応**: ローカルキャッシュを活用

```bash
# インタラクティブモード
npx create-next-app@latest

# 非インタラクティブモード
npx create-next-app@latest my-app --typescript --tailwind --app
```

#### **開発・ビルドコマンド**

**[`next CLI`](./cli/02-next.md)** ⚡

- `next dev` - 開発サーバー（ホットリロード付き）
- `next build` - 本番ビルド（最適化）
- `next start` - 本番サーバー起動
- `next info` - システム情報表示
- `next lint` - ESLint 実行
- `next telemetry` - テレメトリ管理
- `next typegen` - 型定義再生成

#### **重要なオプション**

```bash
# Turbopack での高速開発
next dev --turbopack

# HTTPS 開発環境
next dev --experimental-https

# 本番ビルドのプロファイリング
next build --profile

# Keep-alive timeout 設定
next start --keepAliveTimeout 70000
```

---

## 設定（Configuration）

### ⚙️ [`Configuration`](./config.md)

Next.js プロジェクトの設定全般を管理する包括的なシステム。

#### **主要な設定ファイル**

**[`TypeScript`](./config/01-typescript.md)** 📘

- **TypeScript ファースト**: 最適化された開発体験
- **自動セットアップ**: 必要な設定の自動生成
- **カスタムプラグイン**: VS Code 統合とリアルタイム型チェック

**[`next.config.js`](./config/next-config-js.md)** ⚙️

- **58個の設定オプション**: 包括的なカスタマイズ
- **9つの主要カテゴリ**: 基本設定からビルドツールまで

#### **設定カテゴリ**

1. **基本設定**: アプリ構造、パス設定、環境変数
2. **ビルド・出力**: 出力モード、静的生成、TypeScript
3. **開発・デバッグ**: 開発ツール、ログ、ソースマップ
4. **ルーティング**: リダイレクト、リライト、ヘッダー
5. **アセット管理**: 画像最適化、静的リソース
6. **パフォーマンス**: キャッシュ、バンドル最適化
7. **セキュリティ**: CORS、ヘッダー、セキュリティポリシー
8. **実験的機能**: PPR、React Compiler、型安全ルーティング
9. **ビルドツール**: Webpack、Turbopack、CSS設定

---

## ファイル規約（File Conventions）

### 📁 [`File Conventions`](./file-conventions.md)

Next.js App Router の特別な意味を持つファイル名規約の完全なリファレンス。

#### **主要なファイルタイプ**

**ページ・レイアウト**:

- `page.tsx` - ルートセグメントのページコンポーネント
- `layout.tsx` - 共有レイアウトコンポーネント
- `template.tsx` - 再レンダリング可能なレイアウト
- `not-found.tsx` - 404エラーページ
- `error.tsx` - エラーバウンダリ
- `global-error.tsx` - グローバルエラーハンドリング
- `loading.tsx` - ローディングUI

**ルート処理**:

- `route.ts` - API ルートハンドラー
- `middleware.ts` - リクエスト前処理

**メタデータ生成**:

- `favicon.ico` - ファビコン
- `icon.tsx` - アプリアイコン（動的生成）
- `apple-icon.tsx` - Apple固有のアイコン
- `opengraph-image.tsx` - OGP画像生成
- `sitemap.ts` - サイトマップ生成
- `robots.ts` - robots.txt生成
- `manifest.ts` - Web App Manifest

**特殊なファイル**:

- `instrumentation.ts` - パフォーマンス計測
- `mdx-components.tsx` - MDXカスタマイズ

#### **フォルダ規約**

- `(group)` - ルートグループ（URLに影響しない）
- `[slug]` - 動的セグメント
- `[...slug]` - Catch-all セグメント
- `[[...slug]]` - Optional catch-all
- `@slot` - パラレルルート
- `_folder` - プライベートフォルダ

---

## React コンポーネント

### ⚛️ [`React Components`](./components.md)

Next.js が提供する最適化された React コンポーネント群。

#### **基本コンポーネント**

**[`<Image>`](./components/image.md)** 🖼️

- **自動最適化**: WebP/AVIF変換、サイズ調整
- **パフォーマンス**: 遅延読み込み、プレースホルダー
- **レスポンシブ**: デバイス別サイズ対応

**[`<Link>`](./components/link.md)** 🔗

- **プリフェッチ**: 自動的な事前読み込み
- **クライアント側ナビゲーション**: 高速なページ遷移
- **アクセシビリティ**: 適切なARIA属性

#### **フォント最適化**

**[Font Optimization](./components/font.md)** 📝

- **Google Fonts**: 自動最適化とプリロード
- **カスタムフォント**: ローカルフォントの最適化
- **Layout Shift防止**: フォント読み込み中のレイアウト崩れ防止

#### **スクリプト管理**

**[`<Script>`](./components/script.md)** 📄

- **読み込み戦略**: `beforeInteractive`、`afterInteractive`、`lazyOnload`
- **サードパーティ**: Analytics、広告等の最適化
- **インライン実行**: 小さなスクリプトの効率的な実行

---

## サーバー・クライアント関数

### 🔧 [`Functions`](./functions.md)

Next.js App Router で利用可能な35個のサーバーサイド関数とクライアントサイドフック。

#### **サーバーサイド関数**

**非同期処理・キャッシュ**:

- `after()` - レスポンス後の非同期タスク実行
- `fetch()` - 拡張されたフェッチAPI（キャッシュ付き）
- `unstable_cache()` - データベースクエリ等のキャッシュ
- `revalidatePath()`/`revalidateTag()` - キャッシュ無効化

**リクエスト・レスポンス**:

- `cookies()` - クッキーの読み書き（非同期）
- `headers()` - リクエストヘッダー読み取り（非同期）
- `NextRequest`/`NextResponse` - 拡張されたリクエスト・レスポンス

**ナビゲーション・制御**:

- `redirect()` - 一時的リダイレクト（307）
- `permanentRedirect()` - 永続的リダイレクト（308）
- `notFound()` - 404ページ表示
- `forbidden()`/`unauthorized()` - エラーレスポンス

**メタデータ生成**:

- `generateMetadata()` - 動的メタデータ
- `generateStaticParams()` - 静的パラメータ
- `generateImageMetadata()` - 画像メタデータ

#### **クライアントサイドフック**

**ナビゲーション**:

- `useRouter()` - プログラム的ルート変更
- `usePathname()` - 現在のパス名取得

**パラメータ・状態**:

- `useParams()` - 動的ルートパラメータ
- `useSearchParams()` - URLクエリパラメータ
- `useSelectedLayoutSegment(s)()` - レイアウトセグメント

**パフォーマンス**:

- `useReportWebVitals()` - Web Vitals監視

---

## ディレクティブ

### 📋 [`Directives`](./directives.md)

Next.js App Router で使用される特別なディレクティブ群。

#### **実行環境指定**

- `'use client'` - クライアントコンポーネント指定
- `'use server'` - サーバーアクション指定

#### **実験的機能**

- `'use cache'` - 関数レベルキャッシュ（実験的）

#### **使用パターン**

```typescript
// クライアントコンポーネント
"use client";
import { useState } from "react";

// サーバーアクション
("use server");
import { db } from "./lib/db";

// キャッシュ関数（実験的）
("use cache");
async function getExpensiveData() {
  // 重い処理
}
```

---

## 開発・ビルドツール

### 🛠️ **Turbopack統合**

- **開発高速化**: `next dev --turbopack`
- **増分コンパイル**: 変更部分のみ処理
- **webpack互換**: 段階的移行可能

### 🔧 **TypeScript統合**

- **ゼロ設定**: 自動的なセットアップ
- **型安全ルーティング**: `typedRoutes`で静的型付け
- **リアルタイム型チェック**: VS Code統合

### ⚡ **パフォーマンス最適化**

- **Partial Prerendering (PPR)**: 静的・動的コンテンツの混在
- **React Compiler**: 自動最適化
- **Bundle Analyzer**: バンドルサイズ分析

---

## 使用パターンとベストプラクティス

### 🏗️ **アーキテクチャパターン**

#### **サーバー vs クライアント**

```typescript
// サーバーコンポーネント（デフォルト）
async function ServerComponent() {
  const data = await fetch('/api/data')
  return <div>{data}</div>
}

// クライアントコンポーネント
'use client'
function ClientComponent() {
  const [state, setState] = useState()
  return <button onClick={() => setState(prev => !prev)}>Toggle</button>
}
```

#### **データフェッチパターン**

```typescript
// サーバーコンポーネントでのフェッチ
async function BlogPost({ params }) {
  const post = await fetch(`/api/posts/${params.id}`, {
    cache: 'force-cache'  // 静的生成
  })
  return <article>{post.content}</article>
}

// キャッシュ制御
await fetch('/api/data', {
  next: { revalidate: 3600 }  // 1時間でキャッシュ更新
})
```

#### **エラーハンドリング**

```typescript
// error.tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// not-found.tsx
export default function NotFound() {
  return <div>Page not found</div>
}
```

### 📈 **パフォーマンス最適化**

#### **画像最適化**

```typescript
import Image from 'next/image'

// レスポンシブ画像
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### **フォント最適化**

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

#### **メタデータ最適化**

```typescript
export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}
```

### 🔒 **セキュリティベストプラクティス**

#### **サーバーアクション**

```typescript
"use server";
import { revalidatePath } from "next/cache";

export async function updatePost(id: string, formData: FormData) {
  // 認証チェック
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // データ更新
  await db.post.update({
    where: { id },
    data: { title: formData.get("title") },
  });

  // キャッシュ無効化
  revalidatePath(`/posts/${id}`);
}
```

#### **ミドルウェア**

```typescript
// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  // 認証チェック
  if (!request.cookies.get("auth-token")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // セキュリティヘッダー追加
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}
```

---

## トラブルシューティング

### 🐛 **よくある問題**

#### **Hydration エラー**

```typescript
// 解決方法: 動的コンテンツの適切な処理
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("./component"), {
  ssr: false,
});
```

#### **キャッシュ問題**

```typescript
// キャッシュ無効化
import { revalidatePath, revalidateTag } from "next/cache";

// パス単位
revalidatePath("/posts");

// タグ単位
revalidateTag("posts");
```

#### **型エラー**

```bash
# 型定義再生成
npx next typegen

# TypeScript設定確認
npx next info
```

---

このドキュメントは、Next.js App Router の包括的なAPIリファレンスです。各セクションの詳細については、個別のリンク先ドキュメントを参照してください。実装時は、サーバーコンポーネントの活用、適切なキャッシュ戦略、パフォーマンス最適化を心がけ、段階的に高度な機能を導入することを推奨します。
