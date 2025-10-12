# Next.js App Router Guides

このドキュメントは、Next.js App Router の包括的なガイド集です。LLMが解析・参照しやすいよう、実践的な実装ガイドの要約とリンクを含めています。

## 目次

- [パフォーマンス最適化](#パフォーマンス最適化)
- [セキュリティ](#セキュリティ)
- [開発・デバッグ](#開発デバッグ)
- [スタイリング・UI](#スタイリングui)
- [データ管理](#データ管理)
- [認証・認可](#認証認可)
- [国際化・アクセシビリティ](#国際化アクセシビリティ)
- [デプロイメント・インフラ](#デプロイメントインフラ)
- [移行・アップグレード](#移行アップグレード)
- [テスト](#テスト)
- [高度な機能](#高度な機能)

---

## パフォーマンス最適化

### 📊 [`Analytics`](./01-analytics.md)

Next.js アプリケーションにおけるアナリティクスとパフォーマンス監視の実装ガイド。

#### **主要な機能**

- **Web Vitals 自動追跡**: TTFB、FCP、LCP、FID、CLS、INP
- **カスタム指標**: ビジネス固有のメトリクス追跡
- **リアルタイム監視**: ユーザーエクスペリエンスの継続的な監視

#### **実装方法**

```typescript
// useReportWebVitals フック
"use client";
import { useReportWebVitals } from "next/web-vitals";

export function Analytics() {
  useReportWebVitals((metric) => {
    // アナリティクスサービスに送信
    analytics.track(metric.name, metric.value);
  });
}
```

### 🗄️ [`Caching`](./04-caching.md)

Next.js の4つの主要なキャッシングメカニズムの包括的ガイド。

#### **キャッシングレイヤー**

1. **リクエストメモ化**: 同一リクエストの重複排除
2. **データキャッシュ**: `fetch` レスポンスの永続化
3. **フルルートキャッシュ**: 静的レンダリング結果のキャッシュ
4. **Router キャッシュ**: クライアント側ナビゲーションのキャッシュ

#### **再検証戦略**

```typescript
// 時間ベース再検証
await fetch("/api/data", {
  next: { revalidate: 3600 }, // 1時間
});

// オンデマンド再検証
import { revalidatePath, revalidateTag } from "next/cache";
revalidatePath("/posts");
revalidateTag("posts");
```

### 📋 [`CI Build Caching`](./05-ci-build-caching.md)

CI/CD環境でのビルドキャッシュ最適化による高速化技術。

### 🎯 [`Lazy Loading`](./18-lazy-loading.md)

画像、コンポーネント、外部ライブラリの遅延読み込み最適化。

### 🚀 [`Prefetching`](./26-prefetching.md)

ページとリソースの事前読み込み戦略とカスタマイズ。

### 📦 [`Package Bundling`](./25-package-bundling.md)

外部パッケージのバンドル最適化とツリーシェイキング。

### 💾 [`Memory Usage`](./21-memory-usage.md)

メモリ使用量の監視と最適化テクニック。

---

## セキュリティ

### 🔒 [`Content Security Policy`](./06-content-security-policy.md)

CSP の実装によるXSS攻撃対策とセキュリティ強化。

#### **CSP実装例**

```typescript
// next.config.js
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
`;

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};
```

### 🛡️ [`Data Security`](./09-data-security.md)

データ保護とプライバシー対策の包括的ガイド。

#### **セキュリティ対策**

- **データ暗号化**: 保存時・転送時の暗号化
- **アクセス制御**: ロールベースアクセス制御（RBAC）
- **入力検証**: サニタイゼーションとバリデーション
- **セッション管理**: 安全なセッション処理

---

## 開発・デバッグ

### 🐛 [`Debugging`](./10-debugging.md)

Next.js アプリケーションの効果的なデバッグ手法とツール。

#### **デバッグツール**

- **React Developer Tools**: コンポーネント検査
- **Next.js DevTools**: パフォーマンス分析
- **ブラウザ開発者ツール**: ネットワーク・メモリ分析
- **VS Code デバッグ**: サーバーサイドデバッグ

### 🏠 [`Local Development`](./19-local-development.md)

ローカル開発環境の最適化とワークフロー改善。

### 📋 [`Draft Mode`](./11-draft-mode.md)

コンテンツ管理システム連携のためのプレビュー機能実装。

### 🔍 [`Instrumentation`](./15-instrumentation.md)

パフォーマンス計測とモニタリングの実装。

### 📡 [`OpenTelemetry`](./24-open-telemetry.md)

分散トレーシングと可観測性の実装。

---

## スタイリング・UI

### 🎨 [`CSS-in-JS`](./07-css-in-js.md)

styled-components、Emotion等のCSS-in-JSライブラリ統合。

#### **主要ライブラリサポート**

- **styled-components**: サーバーサイドレンダリング対応
- **Emotion**: 高性能CSS-in-JS
- **Stitches**: デザインシステム対応

### 🌈 [`Tailwind CSS v3`](./35-tailwind-v3-css.md)

Tailwind CSS v3の最新機能と最適化技術。

### 🎭 [`Sass`](./30-sass.md)

Sass/SCSS の統合とカスタマイズ設定。

---

## データ管理

### 📝 [`Forms`](./13-forms.md)

フォーム処理、バリデーション、サーバーアクションの実装。

#### **Server Actions 活用**

```typescript
"use server";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  // バリデーション
  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  // データベース保存
  await db.post.create({
    data: { title, content },
  });

  // リダイレクト
  redirect("/posts");
}
```

### 🔄 [`Incremental Static Regeneration`](./14-incremental-static-regeneration.md)

ISR による動的コンテンツの静的生成とキャッシュ戦略。

### 🌍 [`Environment Variables`](./12-environment-variables.md)

環境変数の安全な管理と設定パターン。

### 📄 [`MDX`](./20-mdx.md)

MDX による Markdown + JSX の統合とカスタマイズ。

---

## 認証・認可

### 🔐 [`Authentication`](./02-authentication.md)

Next.js における認証システムの実装パターンと統合。

#### **認証プロバイダー**

- **NextAuth.js**: 包括的認証ソリューション
- **Auth0**: エンタープライズ認証
- **Firebase Auth**: Google統合認証
- **Supabase Auth**: オープンソース認証

#### **実装例**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
});

export { handler as GET, handler as POST };
```

---

## 国際化・アクセシビリティ

### 🌐 [`Internationalization`](./16-internationalization.md)

多言語対応とローカライゼーションの実装ガイド。

#### **i18n 設定**

```typescript
// next.config.js
module.exports = {
  i18n: {
    locales: ["en", "ja", "fr"],
    defaultLocale: "en",
    localeDetection: false,
  },
};

// 動的ルート対応
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ja" }, { lang: "fr" }];
}
```

---

## デプロイメント・インフラ

### ✅ [`Production Checklist`](./27-production-checklist.md)

本番環境デプロイ前の包括的チェックリストと最適化ガイド。

#### **デプロイ前チェックポイント**

- **パフォーマンス**: Core Web Vitals 最適化
- **セキュリティ**: HTTPS、CSP、環境変数保護
- **SEO**: メタデータ、サイトマップ、構造化データ
- **アクセシビリティ**: WCAG準拠
- **監視**: エラートラッキング、分析設定

### 🏠 [`Self Hosting`](./32-self-hosting.md)

自社サーバーでのNext.jsアプリケーションホスティング。

### 🎯 [`Custom Server`](./08-custom-server.md)

カスタムサーバー実装とミドルウェア統合。

### 📱 [`Progressive Web Apps`](./28-progressive-web-apps.md)

PWA機能の実装とオフライン対応。

### 📋 [`Static Exports`](./34-static-exports.md)

静的サイト生成とエクスポート設定。

### 🔗 [`Redirecting`](./29-redirecting.md)

リダイレクト戦略とSEO対策。

---

## 移行・アップグレード

### 🔄 [`Migration`](./migrating.md)

他のフレームワークからNext.jsへの移行ガイド集。

#### **移行ガイド**

**[`App Router Migration`](./migrating/01-app-router-migration.md)** 🚀

- Pages Router から App Router への段階的移行
- ファイル構造の変換パターン
- データフェッチの移行戦略

**[`From Create React App`](./migrating/02-from-create-react-app.md)** ⚛️

- CRA プロジェクトの Next.js 移行
- Webpack 設定の変換
- ルーティングの移行

**[`From Vite`](./migrating/03-from-vite.md)** ⚡

- Vite プロジェクトの移行手順
- ビルド設定の最適化
- 開発環境の調整

### 📈 [`Upgrading`](./upgrading.md)

Next.js バージョンアップグレードガイド。

#### **アップグレードガイド**

**[`Codemods`](./upgrading/01-codemods.md)** 🔧

- 自動コード変換ツール
- バージョン間の破壊的変更対応

**[`Version 14`](./upgrading/02-version-14.md)** 📦

- App Router 安定化
- Turbopack 統合
- Server Actions 改善

**[`Version 15`](./upgrading/03-version-15.md)** 🆕

- React 19 対応
- Partial Prerendering (PPR)
- Enhanced Server Components

---

## テスト

### 🧪 [`Testing`](./testing.md)

Next.js アプリケーションのテスト戦略とツール選択。

#### **テストフレームワーク**

**[`Jest`](./testing/02-jest.md)** 🃏

- **単体テスト**: コンポーネント・関数テスト
- **統合テスト**: API ルート・データベーステスト
- **Next.js 統合**: 自動設定とモック

**[`Vitest`](./testing/04-vitest.md)** ⚡

- **高速テスト**: Vite ベースの高速実行
- **ES Modules**: ネイティブ ESM サポート
- **Hot Module Replacement**: テスト時のHMR

**[`Playwright`](./testing/03-playwright.md)** 🎭

- **E2E テスト**: ブラウザ自動化テスト
- **クロスブラウザ**: Chrome、Firefox、Safari 対応
- **ビジュアルテスト**: スクリーンショット比較

**[`Cypress`](./testing/01-cypress.md)** 🌲

- **インタラクティブテスト**: リアルタイムデバッグ
- **Time Travel**: テスト実行の巻き戻し
- **ネットワークモック**: API レスポンスのモック

---

## 高度な機能

### 🏢 [`Backend for Frontend`](./03-backend-for-frontend.md)

BFF パターンの実装とAPI設計。

### 🏠 [`Multi-tenant`](./22-multi-tenant.md)

マルチテナントアーキテクチャの実装。

### 🌐 [`Multi-zones`](./23-multi-zones.md)

複数の Next.js アプリケーションの統合。

### 📱 [`Single Page Applications`](./33-single-page-applications.md)

SPA モードでの Next.js 活用。

### 📚 [`Third-party Libraries`](./36-third-party-libraries.md)

外部ライブラリの統合とパフォーマンス最適化。

### 📄 [`Scripts`](./31-scripts.md)

サードパーティスクリプトの最適な読み込み戦略。

### 🎬 [`Videos`](./37-videos.md)

動画コンテンツの最適化と配信。

### 📋 [`JSON-LD`](./17-json-ld.md)

構造化データと SEO 最適化。

---

## 実装パターンとベストプラクティス

### 🏗️ **アーキテクチャパターン**

#### **レイヤー構造**

```
app/
├── (auth)/          # ルートグループ
│   ├── login/
│   └── register/
├── dashboard/       # 認証済みエリア
│   ├── layout.tsx   # 認証レイアウト
│   └── page.tsx
├── api/            # API ルート
│   ├── auth/
│   └── posts/
└── globals.css     # グローバルスタイル
```

#### **コンポーネント設計**

```typescript
// サーバーコンポーネント（デフォルト）
async function PostList() {
  const posts = await getPosts()
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

// クライアントコンポーネント
'use client'
function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  return (
    <article>
      <h2>{post.title}</h2>
      <button onClick={() => setLiked(!liked)}>
        {liked ? '♥' : '♡'}
      </button>
    </article>
  )
}
```

### 📊 **パフォーマンス最適化**

#### **Core Web Vitals 改善**

```typescript
// 画像最適化
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// フォント最適化
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
```

#### **キャッシュ戦略**

```typescript
// 静的データ（長期キャッシュ）
const posts = await fetch("/api/posts", {
  next: { revalidate: 3600 }, // 1時間
});

// 動的データ（短期キャッシュ）
const user = await fetch("/api/user", {
  next: { revalidate: 60 }, // 1分
});

// リアルタイムデータ（キャッシュなし）
const notifications = await fetch("/api/notifications", {
  cache: "no-store",
});
```

### 🔒 **セキュリティ実装**

#### **認証・認可**

```typescript
// ミドルウェアでの認証チェック
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// サーバーアクションでの認可
("use server");
export async function updatePost(id: string, data: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const post = await db.post.findUnique({ where: { id } });

  if (post.authorId !== session.user.id) {
    throw new Error("Forbidden");
  }

  // 更新処理
}
```

### 🌐 **国際化実装**

#### **多言語対応**

```typescript
// app/[lang]/layout.tsx
import { getDictionary } from './dictionaries'

export default async function Layout({
  children,
  params: { lang },
}) {
  const dict = await getDictionary(lang)

  return (
    <html lang={lang}>
      <body>
        <nav>
          <Link href={`/${lang}/about`}>
            {dict.navigation.about}
          </Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

---

## トラブルシューティング

### 🐛 **よくある問題と解決方法**

#### **Hydration エラー**

```typescript
// 解決方法: クライアント専用レンダリング
import dynamic from "next/dynamic";

const ClientOnlyComponent = dynamic(() => import("./ClientOnlyComponent"), {
  ssr: false,
});
```

#### **メモリリーク**

```typescript
// useEffect でのクリーンアップ
useEffect(() => {
  const subscription = api.subscribe((data) => {
    setData(data);
  });

  return () => {
    subscription.unsubscribe(); // クリーンアップ
  };
}, []);
```

#### **バンドルサイズ最適化**

```typescript
// Tree shaking の活用
import { debounce } from 'lodash-es' // ❌
import debounce from 'lodash/debounce' // ✅

// 動的インポート
const Chart = dynamic(() => import('react-chartjs-2'), {
  loading: () => <p>Loading chart...</p>
})
```

---

このドキュメントは、Next.js App Router の実践的なガイド集です。各ガイドは、特定の機能や課題に対する詳細な実装方法を提供しています。開発プロジェクトの要件に応じて、関連するガイドを参照し、段階的に機能を実装することを推奨します。
