# 本番環境チェックリスト

Next.jsアプリケーションを本番環境にデプロイする前の最適化と準備のためのベストプラクティスを提供します。

## 概要

このガイドは、アプリケーションのパフォーマンス、セキュリティ、ユーザーエクスペリエンスを最大化するための推奨事項をまとめています。

## 自動最適化

Next.jsは、追加の設定なしで次の最適化を自動的に適用します：

### 組み込みの最適化機能

- **サーバーコンポーネント**: デフォルトでサーバー側でレンダリングし、クライアント側のJavaScriptバンドルサイズに影響しない
- **コード分割**: ルートセグメントごとに自動的に実行
- **プリフェッチ**: ビューポート内のリンクを事前に読み込み
- **静的レンダリング**: ビルド時にコンポーネントをキャッシュ
- **キャッシング**: データリクエスト、レンダリング結果、静的アセットなどをキャッシュ

## 開発中の推奨事項

### ルーティングとレンダリング

#### レイアウトを使用してUIを共有

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <nav>{/* 共通ナビゲーション */}</nav>
        {children}
        <footer>{/* 共通フッター */}</footer>
      </body>
    </html>
  )
}
```

#### Linkコンポーネントでクライアント側ナビゲーション

```typescript
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  )
}
```

#### エラーハンドリング

```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>エラーが発生しました</h2>
      <button onClick={() => reset()}>再試行</button>
    </div>
  )
}
```

#### サーバーとクライアントコンポーネントの適切な配置

- **サーバーコンポーネント**: データ取得、機密情報の処理
- **クライアントコンポーネント**: インタラクティブな機能、ブラウザAPI

```typescript
// サーバーコンポーネント
async function ServerComponent() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}

// クライアントコンポーネント
'use client'
function ClientComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### データ取得とキャッシング

#### サーバーコンポーネントでデータ取得

```typescript
async function BlogPost({ params }: { params: { id: string } }) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`, {
    next: { revalidate: 3600 } // 1時間ごとに再検証
  })

  return <article>{post.title}</article>
}
```

#### ストリーミングとSuspense

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  )
}
```

#### データの並列取得

```typescript
async function Page() {
  // 並列にデータを取得
  const [user, posts] = await Promise.all([
    fetch('/api/user'),
    fetch('/api/posts')
  ])

  return (
    <div>
      <User data={user} />
      <Posts data={posts} />
    </div>
  )
}
```

### UIとアクセシビリティ

#### サーバーアクションでのフォーム処理

```typescript
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // データベースに保存
  revalidatePath('/posts')
}

// app/new-post/page.tsx
import { createPost } from '../actions'

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" type="text" />
      <button type="submit">投稿</button>
    </form>
  )
}
```

#### フォント最適化

```typescript
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

#### 画像最適化

```typescript
import Image from 'next/image'

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority
    />
  )
}
```

### セキュリティ

#### 環境変数の管理

```typescript
// .env.local（Gitにコミットしない）
DATABASE_URL=your_database_url
API_SECRET=your_api_secret

// アクセス方法
const dbUrl = process.env.DATABASE_URL
```

#### サーバーアクションでの検証

```typescript
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
})

export async function submitForm(formData: FormData) {
  const validatedData = schema.parse({
    email: formData.get('email'),
    age: Number(formData.get('age'))
  })

  // 検証済みデータを使用
}
```

#### Content Security Policy (CSP)

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
}
```

### メタデータとSEO

```typescript
// app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | My App',
    default: 'My App'
  },
  description: 'アプリケーションの説明',
  openGraph: {
    title: 'My App',
    description: 'アプリケーションの説明',
    images: ['/og-image.jpg']
  }
}
```

### 型安全性

```typescript
// TypeScript strict modeを有効化
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## 本番環境前のチェックリスト

### パフォーマンス
- [ ] Lighthouse監査を実行（スコア90以上を目指す）
- [ ] 画像が最適化されている
- [ ] フォントが最適化されている
- [ ] バンドルサイズを分析

### SEO
- [ ] メタデータが適切に設定されている
- [ ] robots.txtとsitemap.xmlが存在する
- [ ] Open Graph画像が設定されている
- [ ] 構造化データが実装されている

### アクセシビリティ
- [ ] キーボードナビゲーションが機能する
- [ ] 適切なARIAラベルが設定されている
- [ ] 色のコントラスト比が適切
- [ ] スクリーンリーダーでテスト済み

### セキュリティ
- [ ] 環境変数が適切に管理されている
- [ ] CSPヘッダーが設定されている
- [ ] HTTPSが有効化されている
- [ ] 依存関係の脆弱性をチェック

### 監視とロギング
- [ ] エラートラッキングを設定
- [ ] パフォーマンス監視を設定
- [ ] アナリティクスを実装

## 次のステップ

- [パフォーマンス最適化](/docs/app/building-your-application/optimizing)
- [セキュリティ](/docs/app/building-your-application/security)
- [デプロイ](/docs/app/building-your-application/deploying)
