# Next.js File Conventions API リファレンス

Next.js App Router で使用されるファイル規約の包括的なAPIリファレンスです。これらのファイル規約により、ルーティング、UI、エラーハンドリング、データ取得、メタデータ設定を効率的に実装できます。

## ファイル規約一覧

### 1. [default.js](./file-conventions/01-default.md)

**対象**: 並行ルート（Parallel Routes）のフォールバック

並行ルート内でNext.jsがフルページロード後にスロットのアクティブな状態を復元できない場合のフォールバックをレンダリングします。

**使用場面**:

- ハードナビゲーション時の特定ルートセグメント不一致
- 明示的なスロットと暗黙的な`children`スロットの両方に適用

**基本的な使用例**:

```typescript
// app/@analytics/default.tsx
export default async function Default({
  params,
}: {
  params: Promise<{ artist: string }>
}) {
  const { artist } = await params
  return <div>デフォルトの分析画面</div>
}
```

---

### 2. [Dynamic Routes](./file-conventions/02-dynamic-routes.md)

**対象**: 動的ルートセグメント

動的にプログラムで生成されたセグメントを持つルートを作成します。

**規約**: フォルダ名を角括弧で囲む（例：`[slug]`, `[id]`, `[...slug]`）

**基本的な使用例**:

```typescript
// app/blog/[slug]/page.tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>My Post: {slug}</div>
}
```

**ルートパターン**:

- `[slug]`: 単一動的セグメント
- `[...slug]`: キャッチオール（全てキャッチ）
- `[[...slug]]`: オプショナルキャッチオール

---

### 3. [error.js](./file-conventions/03-error.md)

**対象**: エラーハンドリング

ネストされたルートで予期しないランタイムエラーを適切に処理します。

**主な機能**:

- React Error Boundaryによる自動ラップ
- ファイルシステム階層による粒度調整
- エラーの分離とアプリケーション継続動作
- エラー回復機能

**基本的な使用例**:

```typescript
// app/dashboard/error.tsx
'use client' // エラーバウンダリはクライアントコンポーネント

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>何かが間違っています！</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  )
}
```

---

### 4. [forbidden.js](./file-conventions/04-forbidden.md)

**対象**: 403 Forbidden エラーハンドリング

認可エラー（403 Forbidden）専用のエラーページを作成します。

**使用場面**:

- アクセス権限不足のリソース
- 認証済みだが認可されていないユーザー

---

### 5. [instrumentation.js](./file-conventions/05-instrumentation.md)

**対象**: アプリケーション監視・計測

アプリケーションの監視、ログ記録、計測を行うための設定ファイルです。

**主な用途**:

- パフォーマンス監視
- エラートラッキング
- カスタムログ記録

---

### 6. [instrumentation-client.js](./file-conventions/06-instrumentation-client.md)

**対象**: クライアントサイド計測

クライアントサイド専用の監視・計測機能を設定します。

---

### 7. [Intercepting Routes](./file-conventions/07-intercepting-routes.md)

**対象**: ルートインターセプト

現在のレイアウト内で別のルートからのルートを読み込むことができます。

**規約**: 特殊なフォルダ命名規則を使用

- `(.)` - 同階層セグメントを一致
- `(..)` - 一階層上のセグメントを一致
- `(..)(..)` - 二階層上のセグメントを一致
- `(...)` - ルートからのセグメントを一致

---

### 8. [layout.js](./file-conventions/08-layout.md)

**対象**: 共有UIレイアウト

複数のルート間で共有されるUIを定義します。

**主な機能**:

- ルートレイアウト（必須）: `<html>`と`<body>`タグを定義
- ネストされたレイアウト: 特定のルートセグメントに適用
- レイアウトの階層的ネスト

**基本的な使用例**:

```typescript
// app/layout.tsx (ルートレイアウト)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

// app/dashboard/layout.tsx (ネストされたレイアウト)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

---

### 9. [loading.js](./file-conventions/09-loading.md)

**対象**: ローディングUI

React Suspenseを使用した意味のあるローディングUIを作成します。

**主な機能**:

- 即座のローディング状態表示
- サーバーからの即座のローディング状態
- 自動的なコンテンツ入れ替わり
- 共有レイアウトのインタラクティブ維持

**基本的な使用例**:

```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return <LoadingSkeleton />
}
```

**自動的なSuspense境界**:

```typescript
// loading.jsは自動的に以下のような構造を作成
<Layout>
  <Header />
  <SideNav />
  <Suspense fallback={<Loading />}>
    <Page />
  </Suspense>
</Layout>
```

---

### 10. [mdx-components.js](./file-conventions/10-mdx-components.md)

**対象**: MDXコンポーネントのカスタマイズ

MDXファイルで使用されるコンポーネントをカスタマイズします。

**使用場面**:

- MDXによるコンテンツ管理
- ドキュメントサイト構築
- ブログシステム

---

### 11. [middleware.js](./file-conventions/11-middleware.md)

**対象**: リクエスト前処理

リクエストが完了する前にコードを実行し、レスポンスを変更します。

**主な機能**:

- 認証・認可チェック
- リダイレクト・書き換え処理
- ヘッダー操作
- ログ記録

**基本的な使用例**:

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 認証チェック
  const isAuthenticated = checkAuth(request);

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
```

**実行順序**:

1. `next.config.js`の`headers`
2. `next.config.js`の`redirects`
3. Middleware
4. `next.config.js`の`beforeFiles`（rewrites）
5. ファイルシステムルート
6. `next.config.js`の`afterFiles`（rewrites）
7. 動的ルート
8. `next.config.js`の`fallback`（rewrites）

---

### 12. [not-found.js](./file-conventions/12-not-found.md)

**対象**: 404 Not Found エラーハンドリング

ルートセグメント内で`notFound`関数がスローされたとき、または自然にマッチしないURLに対してフォールバックUIをレンダリングします。

**基本的な使用例**:

```typescript
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>見つかりません</h2>
      <p>要求されたリソースが見つかりませんでした。</p>
      <Link href="/">ホームに戻る</Link>
    </div>
  )
}
```

---

### 13. [page.js](./file-conventions/13-page.md)

**対象**: ルート固有のUI

ルート固有のUIを定義し、ルートを公開アクセス可能にします。

**主な機能**:

- ルートの公開設定
- 動的ルートパラメータへのアクセス
- 検索パラメータへのアクセス
- 静的・動的レンダリング対応

**基本的な使用例**:

```typescript
// app/blog/[slug]/page.tsx
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const search = await searchParams

  return (
    <div>
      <h1>ブログ記事: {slug}</h1>
      <p>検索: {search.q}</p>
    </div>
  )
}
```

**パラメータの例**:
| ルート | URL | `params` |
|--------|-----|----------|
| `app/shop/[slug]/page.js` | `/shop/1` | `Promise<{ slug: '1' }>` |
| `app/shop/[category]/[item]/page.js` | `/shop/1/2` | `Promise<{ category: '1', item: '2' }>` |
| `app/shop/[...slug]/page.js` | `/shop/1/2` | `Promise<{ slug: ['1', '2'] }>` |

---

### 14. [Parallel Routes](./file-conventions/14-parallel-routes.md)

**対象**: 並行ルート

同じレイアウト内で複数のページを同時にまたは条件付きでレンダリングします。

**規約**: フォルダ名に`@`プレフィックスを使用（例：`@team`, `@analytics`）

**使用場面**:

- ダッシュボードの複数セクション
- 条件付きレンダリング
- モーダルダイアログ

---

### 15. [public Folder](./file-conventions/15-public-folder.md)

**対象**: 静的アセット

静的アセット（画像、アイコン、その他ファイル）を配信します。

**規約**: プロジェクトルートの`public`フォルダ

**使用例**:

```
public/
├── images/
│   └── logo.png
├── icons/
│   └── favicon.ico
└── documents/
    └── manual.pdf
```

---

### 16. [route.js](./file-conventions/16-route.md)

**対象**: APIルートハンドラー

Web標準のRequestとResponse APIを使用してカスタムリクエストハンドラーを作成します。

**サポートHTTPメソッド**:

- `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

**基本的な使用例**:

```typescript
// app/api/users/route.ts
export async function GET() {
  const users = await fetchUsers();
  return Response.json(users);
}

export async function POST(request: Request) {
  const user = await request.json();
  const newUser = await createUser(user);
  return Response.json(newUser, { status: 201 });
}
```

**動的ルートでの使用**:

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await fetchUser(id);
  return Response.json(user);
}
```

---

### 17. [Route Groups](./file-conventions/17-route-groups.md)

**対象**: ルートグループ化

URLパスに影響を与えずにルートを論理的にグループ化します。

**規約**: フォルダ名を括弧で囲む（例：`(auth)`, `(dashboard)`）

**使用場面**:

- 関連ルートの整理
- 異なるレイアウトの適用
- セクション別の管理

---

### 18. [Route Segment Config](./file-conventions/18-route-segment-config.md)

**対象**: ルートセグメント設定

ページ、レイアウト、またはルートハンドラーの動作を設定します。

**主要な設定オプション**:

```typescript
// app/page.tsx
export const dynamic = 'force-dynamic'
export const runtime = 'edge'
export const revalidate = 3600

export default function Page() {
  return <div>設定されたページ</div>
}
```

---

### 19. [src Folder](./file-conventions/19-src-folder.md)

**対象**: ソースコード整理

アプリケーションコードを`src`フォルダ内に整理します。

**使用パターン**:

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
└── lib/
    └── utils.ts
```

---

### 20. [template.js](./file-conventions/20-template.md)

**対象**: テンプレートUI

レイアウトに似ていますが、ナビゲーション時に新しいインスタンスを作成します。

**使用場面**:

- ページ遷移アニメーション
- 状態のリセットが必要な場面
- 入力フォームの初期化

---

### 21. [unauthorized.js](./file-conventions/21-unauthorized.md)

**対象**: 401 Unauthorized エラーハンドリング

認証エラー（401 Unauthorized）専用のエラーページを作成します。

---

### 22. [metadata.md](./file-conventions/metadata.md)

**対象**: メタデータファイル規約の統合ガイド

アプリアイコン、マニフェスト、OG画像、robots.txt、サイトマップなどのメタデータファイル規約をまとめたガイドです。

## ファイル規約の分類と使用指針

### 1. **基本構造ファイル**

#### 必須ファイル

- **layout.js**: ルートレイアウト（必須）
- **page.js**: 各ルートのUI

#### 基本的なプロジェクト構造

```
app/
├── layout.tsx          # ルートレイアウト（必須）
├── page.tsx            # ホームページ
├── not-found.tsx       # 404エラーページ
└── loading.tsx         # ローディングUI
```

### 2. **エラーハンドリング**

```
app/
├── error.tsx           # 一般的なエラー
├── not-found.tsx       # 404 Not Found
├── forbidden.tsx       # 403 Forbidden
└── unauthorized.tsx    # 401 Unauthorized
```

### 3. **高度なルーティング**

```
app/
├── (auth)/             # ルートグループ
├── @sidebar/           # 並行ルート
├── (..)modal/          # インターセプティングルート
├── [slug]/             # 動的ルート
└── [...slug]/          # キャッチオールルート
```

### 4. **API ルート**

```
app/
└── api/
    ├── users/
    │   ├── route.ts        # /api/users
    │   └── [id]/
    │       └── route.ts    # /api/users/[id]
    └── auth/
        └── route.ts        # /api/auth
```

### 5. **設定・最適化**

```
├── middleware.ts           # リクエスト前処理
├── instrumentation.ts      # 監視・計測
└── app/
    ├── page.tsx           # Route Segment Config
    └── template.tsx       # テンプレート
```

## 使用場面別の推奨構成

### 1. **シンプルなWebサイト**

```
app/
├── layout.tsx          # ルートレイアウト
├── page.tsx            # ホームページ
├── about/
│   └── page.tsx        # Aboutページ
├── contact/
│   └── page.tsx        # お問い合わせページ
├── not-found.tsx       # 404ページ
└── loading.tsx         # ローディング
```

### 2. **ブログサイト**

```
app/
├── layout.tsx
├── page.tsx            # ブログ一覧
├── blog/
│   ├── loading.tsx     # ブログローディング
│   ├── [slug]/
│   │   ├── page.tsx    # 個別記事
│   │   └── error.tsx   # 記事エラー
│   └── category/
│       └── [category]/
│           └── page.tsx
├── api/
│   └── posts/
│       └── route.ts    # ブログAPI
└── not-found.tsx
```

### 3. **SaaSアプリケーション**

```
├── middleware.ts           # 認証チェック
└── app/
    ├── layout.tsx
    ├── page.tsx            # ランディング
    ├── (auth)/             # 認証グループ
    │   ├── login/
    │   │   └── page.tsx
    │   └── register/
    │       └── page.tsx
    ├── (dashboard)/        # ダッシュボードグループ
    │   ├── layout.tsx      # ダッシュボードレイアウト
    │   ├── @sidebar/       # サイドバー（並行ルート）
    │   ├── @analytics/     # 分析（並行ルート）
    │   ├── loading.tsx
    │   └── error.tsx
    ├── api/
    │   ├── auth/
    │   │   └── route.ts
    │   └── dashboard/
    │       └── route.ts
    ├── unauthorized.tsx    # 401エラー
    └── forbidden.tsx       # 403エラー
```

### 4. **Eコマースサイト**

```
├── middleware.ts           # カート・認証チェック
└── app/
    ├── layout.tsx
    ├── page.tsx            # ホーム
    ├── products/
    │   ├── loading.tsx
    │   ├── [id]/
    │   │   ├── page.tsx    # 商品詳細
    │   │   └── (..)modal/  # モーダル表示
    │   │       └── page.tsx
    │   └── category/
    │       └── [category]/
    │           └── page.tsx
    ├── cart/
    │   ├── page.tsx
    │   └── loading.tsx
    ├── api/
    │   ├── products/
    │   │   └── route.ts
    │   ├── cart/
    │   │   └── route.ts
    │   └── orders/
    │       └── route.ts
    └── checkout/
        ├── page.tsx
        └── error.tsx
```

## パフォーマンス最適化のベストプラクティス

### 1. **効果的なローディング状態**

```typescript
// 段階的なローディング
app/
├── loading.tsx             # グローバルローディング
├── dashboard/
│   ├── loading.tsx         # ダッシュボードローディング
│   └── analytics/
│       └── loading.tsx     # 分析ローディング
```

### 2. **適切なエラーバウンダリ**

```typescript
// 階層的なエラーハンドリング
app/
├── error.tsx              # グローバルエラー
├── dashboard/
│   ├── error.tsx          # ダッシュボードエラー
│   └── users/
│       └── error.tsx      # ユーザーエラー
```

### 3. **効果的なルートセグメント設定**

```typescript
// app/api/data/route.ts
export const dynamic = "force-dynamic"; // 常に動的
export const runtime = "edge"; // エッジランタイム

// app/blog/[slug]/page.tsx
export const revalidate = 3600; // 1時間ごとに再検証
export const dynamicParams = true; // 動的パラメータ有効
```

## セキュリティ最適化

### 1. **認証・認可の階層化**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 管理者エリア
  if (pathname.startsWith("/admin")) {
    return checkAdminAuth(request);
  }

  // ユーザーエリア
  if (pathname.startsWith("/dashboard")) {
    return checkUserAuth(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
```

### 2. **APIルートの保護**

```typescript
// app/api/users/route.ts
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // データ取得処理
}
```

## 追加リソース

### 公式ドキュメント

- [Next.js App Router](https://nextjs.org/docs/app)
- [File Conventions](https://nextjs.org/docs/app/api-reference/file-conventions)
- [Routing](https://nextjs.org/docs/app/building-your-application/routing)

### 実装例とベストプラクティス

- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

### 開発ツール

- [Next.js CLI](https://nextjs.org/docs/app/api-reference/next-cli)
- [Next.js TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

---

各ファイル規約には詳細な実装方法、設定オプション、およびベストプラクティスが含まれています。プロジェクトの要件と規模に応じて、適切なファイル規約の組み合わせを選択してください。
