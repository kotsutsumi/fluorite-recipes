# Next.js SaaS Starter Template

## 概要

認証、Stripe統合、ダッシュボード機能を備えたSaaSアプリケーション構築用のスターターテンプレートです。

**デモ**: https://next-saas-start.vercel.app/
**GitHub**: https://github.com/nextjs/saas-starter

## 主な機能

- マーケティングランディングページ
- Stripe Checkoutによる価格設定ページ
- CRUD操作を備えたダッシュボード
- 基本的なロールベースアクセス制御(RBAC)
- サブスクリプション管理
- JWTによるメール/パスワード認証
- グローバルおよびローカルミドルウェア保護
- アクティビティログシステム

## 技術スタック

- **フレームワーク**: Next.js
- **データベース**: Postgres
- **ORM**: Drizzle
- **決済処理**: Stripe
- **UIライブラリ**: shadcn/ui

## はじめに

### リポジトリのクローン

```bash
git clone https://github.com/nextjs/saas-starter.git
cd saas-starter
```

### 依存関係のインストール

```bash
pnpm install
```

### Stripeアカウントのセットアップ

1. [Stripe](https://stripe.com)でアカウントを作成
2. APIキーを取得
3. 製品と価格を作成
4. Webhookエンドポイントを設定

### 環境変数の設定

`.env.local`ファイルを作成:

```bash
# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/saas_db

# 認証
AUTH_SECRET=your_auth_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID_BASIC=price_...
STRIPE_PRICE_ID_PRO=price_...
```

### データベースマイグレーションの実行

```bash
pnpm db:push
```

### 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

## テスト認証情報

デモ用のテストアカウント:

- **メール**: test@test.com
- **パスワード**: admin123

## 認証システム

### JWT認証の実装

#### 認証ユーティリティ

```typescript
// lib/auth.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, process.env.AUTH_SECRET!, {
    expiresIn: '7d',
  })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.AUTH_SECRET!) as { userId: string }
  } catch {
    return null
  }
}
```

### サインアップ

```typescript
// app/api/auth/signup/route.ts
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hashPassword, generateToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  // ユーザーの存在確認
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (existingUser) {
    return NextResponse.json(
      { error: 'ユーザーは既に存在します' },
      { status: 400 }
    )
  }

  // パスワードのハッシュ化
  const hashedPassword = await hashPassword(password)

  // ユーザーの作成
  const [user] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      name,
    })
    .returning()

  // トークンの生成
  const token = generateToken(user.id)

  return NextResponse.json({ user, token })
}
```

### ログイン

```typescript
// app/api/auth/login/route.ts
import { db } from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // ユーザーの検索
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })

  if (!user) {
    return NextResponse.json(
      { error: '無効な認証情報' },
      { status: 401 }
    )
  }

  // パスワードの検証
  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    return NextResponse.json(
      { error: '無効な認証情報' },
      { status: 401 }
    )
  }

  // トークンの生成
  const token = generateToken(user.id)

  return NextResponse.json({ user, token })
}
```

## ミドルウェア認証

### グローバルミドルウェア

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // 保護されたルートの確認
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token) {
    const payload = verifyToken(token)
    if (!payload && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}
```

## ロールベースアクセス制御(RBAC)

### ユーザーロールの定義

```typescript
// lib/db/schema.ts
import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['user', 'admin'])

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  role: roleEnum('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
})
```

### ロールチェックミドルウェア

```typescript
// lib/auth/rbac.ts
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function requireRole(token: string, requiredRole: 'user' | 'admin') {
  const payload = verifyToken(token)
  if (!payload) {
    return false
  }

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, payload.userId),
  })

  if (!user) {
    return false
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return false
  }

  return true
}
```

## Stripe統合

### 価格設定ページ

```typescript
// app/pricing/page.tsx
import { CheckoutButton } from '@/components/CheckoutButton'

export default function PricingPage() {
  return (
    <div>
      <h1>価格プラン</h1>
      <div>
        <div>
          <h2>ベーシック</h2>
          <p>月額 $9</p>
          <CheckoutButton priceId={process.env.STRIPE_PRICE_ID_BASIC!} />
        </div>
        <div>
          <h2>プロ</h2>
          <p>月額 $29</p>
          <CheckoutButton priceId={process.env.STRIPE_PRICE_ID_PRO!} />
        </div>
      </div>
    </div>
  )
}
```

### Checkout処理

```typescript
// app/api/create-checkout-session/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const { priceId } = await request.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?canceled=true`,
  })

  return NextResponse.json({ sessionId: session.id })
}
```

### Webhook処理

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      // サブスクリプションの作成
      await db.insert(subscriptions).values({
        userId: session.metadata?.userId!,
        stripeSubscriptionId: session.subscription as string,
        status: 'active',
      })
      break

    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription
      // サブスクリプションのキャンセル
      await db
        .update(subscriptions)
        .set({ status: 'canceled' })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
      break
  }

  return new Response(null, { status: 200 })
}
```

## ダッシュボード

### ダッシュボードレイアウト

```typescript
// app/dashboard/layout.tsx
import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
```

## アクティビティログ

### ログの記録

```typescript
// lib/activity-log.ts
import { db } from '@/lib/db'
import { activityLogs } from '@/lib/db/schema'

export async function logActivity(
  userId: string,
  action: string,
  details?: Record<string, any>
) {
  await db.insert(activityLogs).values({
    userId,
    action,
    details,
  })
}
```

## デプロイ

### Vercelへのデプロイ

```bash
vercel deploy
```

### 環境変数の設定

本番環境で必要な環境変数をすべて設定してください。

### Stripeウェブフックの設定

本番環境のWebhook URL:
```
https://your-domain.com/api/webhooks/stripe
```

## 使用例

- SaaSアプリケーション
- サブスクリプションサービス
- 会員制プラットフォーム
- B2Bソフトウェア

## 注意事項

このテンプレートは学習目的で意図的に最小限に設計されています。SaaS製品を構築する開発者に推奨されます。

## リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

## ライセンス

MITライセンス
