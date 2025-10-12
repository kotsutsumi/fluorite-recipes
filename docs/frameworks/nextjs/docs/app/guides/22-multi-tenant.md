# マルチテナントアプリケーション

Next.js で複数のテナント（顧客）にサービスを提供するマルチテナントアプリケーションを構築する方法について説明します。

## 概要

マルチテナントアプリケーションは、単一のアプリケーションインスタンスで複数の顧客（テナント）にサービスを提供するアーキテクチャです。各テナントは独自のデータ、設定、ブランディングを持ちますが、同じコードベースとインフラストラクチャを共有します。

## 推奨アーキテクチャ

Next.js でマルチテナントアプリケーションを構築する場合、Vercel が提供する **Platforms Starter Kit** テンプレートを参照することをお勧めします。

### Platforms Starter Kit

このテンプレートは、以下のような機能を提供します：

- **カスタムドメイン**: 各テナントに独自のドメインを設定
- **動的コンテンツ**: テナントごとにカスタマイズされたコンテンツ
- **データ分離**: テナント間のデータを安全に分離
- **スケーラビリティ**: 大規模なマルチテナントシステムをサポート

🔗 **テンプレートURL**: https://vercel.com/templates/next.js/platforms-starter-kit

## 主要な設計パターン

### 1. テナント識別

#### サブドメインベース

```
tenant1.example.com
tenant2.example.com
tenant3.example.com
```

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]

  // サブドメインに基づいてテナントを識別
  const tenantId = subdomain

  // ヘッダーにテナントIDを設定
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-id', tenantId)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
```

#### パスベース

```
example.com/tenant1
example.com/tenant2
example.com/tenant3
```

```typescript
// app/[tenant]/page.tsx
export default async function TenantPage({
  params,
}: {
  params: { tenant: string }
}) {
  const tenantData = await getTenantData(params.tenant)

  return (
    <div>
      <h1>{tenantData.name}</h1>
      <p>{tenantData.description}</p>
    </div>
  )
}
```

#### カスタムドメイン

```
tenant1.com
tenant2.com
custom-domain.com
```

### 2. データ分離

#### データベーススキーマの設計

すべてのテーブルに `tenant_id` を含める：

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックスを作成してパフォーマンスを向上
CREATE INDEX idx_posts_tenant_id ON posts(tenant_id);
```

#### Row Level Security（RLS）

PostgreSQL の RLS を使用してデータアクセスを制御：

```sql
-- RLS を有効化
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ポリシーを作成
CREATE POLICY tenant_isolation_policy ON posts
  USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```

### 3. テナントデータの取得

```typescript
// lib/tenant.ts
import { headers } from 'next/headers'

export async function getCurrentTenant() {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  if (!tenantId) {
    throw new Error('Tenant ID not found')
  }

  const tenant = await db.tenant.findUnique({
    where: { id: tenantId },
  })

  return tenant
}
```

```typescript
// app/dashboard/page.tsx
import { getCurrentTenant } from '@/lib/tenant'

export default async function DashboardPage() {
  const tenant = await getCurrentTenant()

  return (
    <div>
      <h1>{tenant.name} ダッシュボード</h1>
      {/* テナント固有のコンテンツ */}
    </div>
  )
}
```

### 4. テナントごとのブランディング

```typescript
// lib/branding.ts
export async function getTenantBranding(tenantId: string) {
  const branding = await db.branding.findUnique({
    where: { tenantId },
  })

  return {
    primaryColor: branding.primaryColor || '#3B82F6',
    logo: branding.logo || '/default-logo.png',
    favicon: branding.favicon || '/favicon.ico',
  }
}
```

```typescript
// app/layout.tsx
import { getCurrentTenant } from '@/lib/tenant'
import { getTenantBranding } from '@/lib/branding'

export async function generateMetadata() {
  const tenant = await getCurrentTenant()
  const branding = await getTenantBranding(tenant.id)

  return {
    title: tenant.name,
    icons: {
      icon: branding.favicon,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getCurrentTenant()
  const branding = await getTenantBranding(tenant.id)

  return (
    <html>
      <head>
        <style>{`
          :root {
            --primary-color: ${branding.primaryColor};
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 5. テナントごとの設定

```typescript
// lib/config.ts
export interface TenantConfig {
  features: {
    analytics: boolean
    customDomain: boolean
    apiAccess: boolean
  }
  limits: {
    users: number
    storage: number // MB
    apiCalls: number // per month
  }
}

export async function getTenantConfig(tenantId: string): Promise<TenantConfig> {
  const config = await db.tenantConfig.findUnique({
    where: { tenantId },
  })

  return config
}
```

## 実装例

### 完全なマルチテナント実装

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // カスタムドメインまたはサブドメインを処理
  let tenantId: string

  if (hostname.includes('.example.com')) {
    // サブドメイン
    tenantId = hostname.split('.')[0]
  } else {
    // カスタムドメイン - データベースで検索
    // この例では簡略化のため、ホスト名をそのまま使用
    tenantId = hostname
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-tenant-id', tenantId)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// テナント固有のクエリヘルパー
export async function withTenant<T>(
  tenantId: string,
  callback: () => Promise<T>
): Promise<T> {
  // RLS を使用する場合
  await prisma.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, false)`
  return callback()
}
```

```typescript
// app/posts/page.tsx
import { getCurrentTenant } from '@/lib/tenant'
import { prisma, withTenant } from '@/lib/db'

export default async function PostsPage() {
  const tenant = await getCurrentTenant()

  const posts = await withTenant(tenant.id, async () => {
    return prisma.post.findMany({
      where: {
        tenantId: tenant.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  })

  return (
    <div>
      <h1>{tenant.name} の投稿</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## セキュリティのベストプラクティス

1. **常にテナントIDを検証**: すべてのデータアクセスでテナントIDを確認
2. **Row Level Security を使用**: データベースレベルでデータを分離
3. **認証を強化**: 各テナントに適切な認証を実装
4. **監査ログ**: テナント間のアクセスを記録
5. **レート制限**: テナントごとにAPIリクエストを制限

## パフォーマンスの最適化

1. **キャッシング**: テナントデータを適切にキャッシュ
2. **データベースインデックス**: `tenant_id` にインデックスを作成
3. **接続プーリング**: データベース接続を効率的に管理
4. **CDN**: 静的アセットをCDNで配信

## まとめ

マルチテナントアプリケーションを構築する際の主要なポイント：

1. **テナント識別**: サブドメイン、パス、またはカスタムドメイン
2. **データ分離**: Row Level Security とテナントID
3. **ブランディング**: テナントごとのカスタマイズ
4. **セキュリティ**: 厳格なアクセス制御
5. **スケーラビリティ**: 効率的なアーキテクチャ

詳細な実装例については、[Platforms Starter Kit](https://vercel.com/templates/next.js/platforms-starter-kit) を参照してください。
