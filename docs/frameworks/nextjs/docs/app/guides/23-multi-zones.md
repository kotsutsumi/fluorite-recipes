# Multi-Zones（マルチゾーン）

Next.js で大規模なアプリケーションを複数の小さな Next.js アプリケーションに分割し、同じドメイン下で提供するマイクロフロントエンドのアーキテクチャパターンです。

## 概要

Multi-Zones は、大規模な Web アプリケーションを複数の独立した Next.js アプリケーションに分割することで、開発とデプロイメントの柔軟性を高めるアーキテクチャパターンです。

### 主なメリット

1. **独立したデプロイメント**: 各ゾーンを個別にデプロイ可能
2. **ビルド時間の短縮**: ゾーンごとにビルドするため、全体のビルド時間が短縮
3. **チーム間の独立性**: 異なるチームが異なるゾーンを担当可能
4. **段階的な移行**: 既存アプリケーションを段階的に Next.js に移行

## ユースケース

### アプリケーションの分割例

```
ドメイン: example.com

ゾーン構成:
├── / (メインサイト) - Zone A
├── /blog/* (ブログ) - Zone B
├── /dashboard/* (ダッシュボード) - Zone C
└── /docs/* (ドキュメント) - Zone D
```

### 適用シナリオ

1. **機能別分割**: ブログ、ダッシュボード、マーケティングサイトなど
2. **チーム別分割**: 複数チームが異なる機能を担当
3. **段階的移行**: レガシーアプリケーションの段階的な置き換え
4. **マイクロサービスアーキテクチャ**: フロントエンドをマイクロサービスとして分割

## 基本的な設定

### ステップ 1: ゾーンの定義

各 Next.js アプリケーションで、ゾーン固有の設定を行います。

```typescript
// next.config.ts (Zone B - Blog)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // アセットのプレフィックスを設定して競合を防ぐ
  assetPrefix: '/blog-static',

  // ベースパスを設定（オプション）
  basePath: '/blog',
}

export default nextConfig
```

```typescript
// next.config.ts (Zone C - Dashboard)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  assetPrefix: '/dashboard-static',
  basePath: '/dashboard',
}

export default nextConfig
```

### ステップ 2: リクエストのルーティング

メインアプリケーション（Zone A）で、他のゾーンへのリクエストをルーティングします。

```typescript
// next.config.ts (Zone A - Main Site)
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // ブログゾーンへのルーティング
      {
        source: '/blog',
        destination: `${process.env.BLOG_DOMAIN}/blog`,
      },
      {
        source: '/blog/:path*',
        destination: `${process.env.BLOG_DOMAIN}/blog/:path*`,
      },

      // ダッシュボードゾーンへのルーティング
      {
        source: '/dashboard',
        destination: `${process.env.DASHBOARD_DOMAIN}/dashboard`,
      },
      {
        source: '/dashboard/:path*',
        destination: `${process.env.DASHBOARD_DOMAIN}/dashboard/:path*`,
      },
    ]
  },
}

export default nextConfig
```

### ステップ 3: 環境変数の設定

```bash
# .env.local (Zone A - Main Site)
BLOG_DOMAIN=http://localhost:3001
DASHBOARD_DOMAIN=http://localhost:3002

# 本番環境
# BLOG_DOMAIN=https://blog.example.com
# DASHBOARD_DOMAIN=https://dashboard.example.com
```

## ゾーン間のナビゲーション

### ソフトナビゲーション（同一ゾーン内）

同じゾーン内では、Next.js の `Link` コンポーネントを使用してソフトナビゲーションが可能です。

```typescript
// Zone B (Blog) 内のナビゲーション
import Link from 'next/link'

export default function BlogNavigation() {
  return (
    <nav>
      <Link href="/blog/post-1">記事 1</Link>
      <Link href="/blog/post-2">記事 2</Link>
    </nav>
  )
}
```

### ハードナビゲーション（ゾーン間）

異なるゾーン間のナビゲーションには、通常の `<a>` タグを使用します。

```typescript
// Zone A から Zone B へのナビゲーション
export default function MainNavigation() {
  return (
    <nav>
      {/* 同じゾーン内 */}
      <Link href="/about">About</Link>

      {/* 異なるゾーンへ */}
      <a href="/blog">Blog</a>
      <a href="/dashboard">Dashboard</a>
    </nav>
  )
}
```

### クロスゾーンリンクコンポーネント

```typescript
// components/CrossZoneLink.tsx
import Link from 'next/link'

interface CrossZoneLinkProps {
  href: string
  children: React.ReactNode
  zone?: 'main' | 'blog' | 'dashboard'
}

export function CrossZoneLink({ href, children, zone }: CrossZoneLinkProps) {
  const currentZone = process.env.NEXT_PUBLIC_ZONE || 'main'

  // 同じゾーン内ならソフトナビゲーション
  if (zone === currentZone || !zone) {
    return <Link href={href}>{children}</Link>
  }

  // 異なるゾーンならハードナビゲーション
  return <a href={href}>{children}</a>
}
```

## Server Actions の設定

Server Actions を使用する場合、許可されたオリジンを設定する必要があります。

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'example.com',
        '*.example.com',
        'localhost:3000',
        'localhost:3001',
        'localhost:3002',
      ],
    },
  },
}

export default nextConfig
```

## モノレポ構成

### プロジェクト構造

Multi-Zones をモノレポで管理することで、コード共有と管理が容易になります。

```
monorepo/
├── apps/
│   ├── main/           # Zone A (メインサイト)
│   │   ├── src/
│   │   ├── public/
│   │   └── next.config.ts
│   ├── blog/           # Zone B (ブログ)
│   │   ├── src/
│   │   ├── public/
│   │   └── next.config.ts
│   └── dashboard/      # Zone C (ダッシュボード)
│       ├── src/
│       ├── public/
│       └── next.config.ts
├── packages/
│   ├── ui/            # 共有 UI コンポーネント
│   ├── utils/         # 共有ユーティリティ
│   └── types/         # 共有型定義
├── package.json
└── pnpm-workspace.yaml
```

### ワークスペース設定

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

```json
{
  "name": "multi-zone-monorepo",
  "private": true,
  "scripts": {
    "dev:main": "pnpm --filter main dev",
    "dev:blog": "pnpm --filter blog dev",
    "dev:dashboard": "pnpm --filter dashboard dev",
    "dev:all": "concurrently \"pnpm dev:main\" \"pnpm dev:blog\" \"pnpm dev:dashboard\"",
    "build": "pnpm -r build"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

### 共有パッケージの作成

```typescript
// packages/ui/src/Button.tsx
export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded" {...props}>
      {children}
    </button>
  )
}
```

```typescript
// apps/blog/src/app/page.tsx
import { Button } from '@repo/ui'

export default function BlogHome() {
  return (
    <div>
      <h1>Blog Home</h1>
      <Button>Read More</Button>
    </div>
  )
}
```

## デプロイメント戦略

### Vercel でのデプロイ

#### 個別プロジェクトとしてデプロイ

```bash
# Zone A (Main)
vercel --prod

# Zone B (Blog)
cd apps/blog
vercel --prod

# Zone C (Dashboard)
cd apps/dashboard
vercel --prod
```

#### 環境変数の設定

各プロジェクトで環境変数を設定します。

```
Main Site:
BLOG_DOMAIN=https://blog.example.com
DASHBOARD_DOMAIN=https://dashboard.example.com

Blog:
MAIN_DOMAIN=https://example.com

Dashboard:
MAIN_DOMAIN=https://example.com
```

### カスタムドメインの設定

```
Main Site: example.com
Blog: blog.example.com
Dashboard: dashboard.example.com
```

メインサイトで Rewrites を使用してサブドメインをプロキシします。

### Docker でのデプロイ

```dockerfile
# Dockerfile (Blog Zone)
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN corepack enable pnpm && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  main:
    build:
      context: ./apps/main
    ports:
      - "3000:3000"
    environment:
      - BLOG_DOMAIN=http://blog:3001
      - DASHBOARD_DOMAIN=http://dashboard:3002

  blog:
    build:
      context: ./apps/blog
    ports:
      - "3001:3000"

  dashboard:
    build:
      context: ./apps/dashboard
    ports:
      - "3002:3000"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - main
      - blog
      - dashboard
```

## パフォーマンス最適化

### キャッシング戦略

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/blog/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ]
  },
}
```

### CDN の活用

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  assetPrefix: process.env.CDN_URL || '',
  images: {
    loader: 'custom',
    loaderFile: './image-loader.ts',
  },
}
```

```typescript
// image-loader.ts
export default function cloudflareLoader({ src, width, quality }: {
  src: string
  width: number
  quality?: number
}) {
  const params = [`width=${width}`]
  if (quality) {
    params.push(`quality=${quality}`)
  }
  const paramsString = params.join(',')
  return `/cdn-cgi/image/${paramsString}/${src}`
}
```

## セキュリティ考慮事項

### CORS 設定

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}
```

### 認証の共有

```typescript
// packages/auth/src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function createAuthMiddleware(allowedDomains: string[]) {
  return async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // トークンの検証
    const isValid = await verifyToken(token)

    if (!isValid) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  }
}

async function verifyToken(token: string): Promise<boolean> {
  // JWT トークンの検証ロジック
  return true
}
```

```typescript
// apps/dashboard/src/middleware.ts
import { createAuthMiddleware } from '@repo/auth'

export const middleware = createAuthMiddleware([
  'example.com',
  'dashboard.example.com',
])

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

## 段階的な移行

### 既存アプリケーションの段階的移行

```typescript
// next.config.ts (既存アプリケーション)
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // 新しい Next.js ゾーンへのルーティング
      {
        source: '/new-feature/:path*',
        destination: `${process.env.NEW_ZONE_DOMAIN}/new-feature/:path*`,
      },
      // 既存のレガシーアプリケーションへのフォールバック
      {
        source: '/:path*',
        destination: `${process.env.LEGACY_APP_DOMAIN}/:path*`,
      },
    ]
  },
}
```

### 機能フラグの活用

```typescript
// packages/feature-flags/src/index.ts
export const featureFlags = {
  useNewBlog: process.env.NEXT_PUBLIC_USE_NEW_BLOG === 'true',
  useNewDashboard: process.env.NEXT_PUBLIC_USE_NEW_DASHBOARD === 'true',
}
```

```typescript
// apps/main/src/app/layout.tsx
import { featureFlags } from '@repo/feature-flags'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          {featureFlags.useNewBlog ? (
            <a href="/blog">New Blog</a>
          ) : (
            <a href="/legacy-blog">Legacy Blog</a>
          )}
        </nav>
        {children}
      </body>
    </html>
  )
}
```

## トラブルシューティング

### 問題 1: アセットの読み込みエラー

**症状**: 静的アセットが 404 エラーになる

**原因**: `assetPrefix` の設定が正しくない

**解決策**:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production'
    ? '/blog-static'
    : '',
}
```

### 問題 2: ゾーン間のナビゲーションが遅い

**症状**: ゾーン間の遷移に時間がかかる

**原因**: ハードナビゲーションによる完全なページリロード

**解決策**:
- 可能な限り同じゾーン内で機能を完結させる
- プリフェッチを使用して次のゾーンを事前に読み込む

```typescript
<a href="/blog" rel="prefetch">Blog</a>
```

### 問題 3: Server Actions のエラー

**症状**: Server Actions が他のゾーンで機能しない

**原因**: `allowedOrigins` の設定が不足

**解決策**:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        'example.com',
        'blog.example.com',
        'dashboard.example.com',
        '*.example.com', // ワイルドカードも使用可能
      ],
    },
  },
}
```

## ベストプラクティス

1. **モノレポの活用**: コード共有と管理を容易にする
2. **明確なゾーン境界**: 各ゾーンの責任範囲を明確にする
3. **独立したデプロイメント**: 各ゾーンを独立してデプロイ可能にする
4. **共通の認証**: 認証ロジックを共有パッケージとして実装
5. **統一されたデザインシステム**: UI コンポーネントを共有パッケージとして管理
6. **環境変数の管理**: ゾーン間の URL を環境変数で管理
7. **モニタリング**: 各ゾーンのパフォーマンスと可用性を監視
8. **ドキュメント**: ゾーン間の依存関係と責任を文書化

## まとめ

Multi-Zones は、大規模な Next.js アプリケーションを管理するための強力なパターンです。主なポイント：

1. **独立性**: 各ゾーンを独立して開発・デプロイ可能
2. **柔軟性**: 異なるチームやテクノロジースタックを使用可能
3. **段階的移行**: 既存アプリケーションを段階的に Next.js に移行
4. **パフォーマンス**: ビルド時間の短縮と効率的なデプロイメント
5. **コード共有**: モノレポを使用して共通コードを共有

このパターンを活用することで、大規模なエンタープライズアプリケーションを効果的に管理できます。
