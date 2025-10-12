# Single-Page Applications（シングルページアプリケーション）

Next.jsは、従来の「厳密なSPA」を構築することもできますが、段階的にサーバー機能を追加できる柔軟性も提供します。このガイドでは、Next.jsでSPAを構築する方法について説明します。

## 厳密なSPAの定義

「厳密なSPA」には以下の特徴があります：

1. **クライアントサイドレンダリング（CSR）**: すべてのレンダリングがブラウザで行われる
2. **単一のHTMLファイルで提供**: アプリケーションは単一のHTMLファイルから起動する
3. **JavaScriptによるルーティング**: ルートとページ遷移はJavaScriptで処理される
4. **フルページリロードなし**: ページ間の移動時にフルページリロードが発生しない

## Next.jsでSPAを構築する利点

Next.jsでSPAを構築すると、以下の利点があります：

- **自動コード分割**: JavaScriptバンドルが自動的に分割される
- **初期バンドルサイズの削減**: ページごとに必要なコードのみを読み込む
- **高速なページ読み込み**: 最適化されたバンドルによる高速化
- **自動ルートプリフェッチング**: リンクが表示されると自動的にプリフェッチされる
- **段階的な拡張**: 後からサーバー機能を段階的に追加できる

## SPAアーキテクチャパターン

### 1. クライアントサイドデータフェッチング

#### Reactの`use`フックを使用

Reactの`use`フックを使用して、クライアント側でデータをフェッチできます。親コンポーネントまたはレイアウトでデータフェッチを開始することをお勧めします。

```tsx filename="app/page.tsx" switcher
'use client'

import { use } from 'react'

async function fetchData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default function Page() {
  const data = use(fetchData())

  return <div>{/* データを使用 */}</div>
}
```

```jsx filename="app/page.js" switcher
'use client'

import { use } from 'react'

async function fetchData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default function Page() {
  const data = use(fetchData())

  return <div>{/* データを使用 */}</div>
}
```

> **知っておくと良いこと**: サーバーでデータフェッチを早期に開始できますが、クライアント側のデータウォーターフォールを排除できます。

#### SWRまたはReact Queryを使用

クライアント側のデータフェッチライブラリを使用することもできます：

```tsx filename="app/page.tsx" switcher
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Page() {
  const { data, error, isLoading } = useSWR(
    'https://api.example.com/data',
    fetcher
  )

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return <div>{/* データを使用 */}</div>
}
```

```jsx filename="app/page.js" switcher
'use client'

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Page() {
  const { data, error, isLoading } = useSWR(
    'https://api.example.com/data',
    fetcher
  )

  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return <div>{/* データを使用 */}</div>
}
```

### 2. ブラウザ専用コンポーネントのレンダリング

`next/dynamic`を使用して、ブラウザ専用のコンポーネントをレンダリングできます：

```tsx filename="app/page.tsx" switcher
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(
  () => import('../components/ClientOnlyComponent'),
  { ssr: false }
)

export default function Page() {
  return (
    <div>
      <ClientOnlyComponent />
    </div>
  )
}
```

```jsx filename="app/page.js" switcher
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(
  () => import('../components/ClientOnlyComponent'),
  { ssr: false }
)

export default function Page() {
  return (
    <div>
      <ClientOnlyComponent />
    </div>
  )
}
```

### 3. シャローローティング

`window.history` APIを使用して、ページをリロードせずにURLを更新できます：

```tsx filename="app/page.tsx" switcher
'use client'

import { usePathname, useSearchParams } from 'next/navigation'

export default function Page() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleUpdateURL = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('key', 'value')
    window.history.pushState(null, '', `${pathname}?${newSearchParams}`)
  }

  return <button onClick={handleUpdateURL}>Update URL</button>
}
```

```jsx filename="app/page.js" switcher
'use client'

import { usePathname, useSearchParams } from 'next/navigation'

export default function Page() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleUpdateURL = () => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('key', 'value')
    window.history.pushState(null, '', `${pathname}?${newSearchParams}`)
  }

  return <button onClick={handleUpdateURL}>Update URL</button>
}
```

### 4. クライアントコンポーネントでのServer Actions

Server Actionsをクライアントコンポーネントから直接呼び出すことができます：

```tsx filename="app/actions.ts" switcher
'use server'

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string

  // データベースに保存
  // await db.users.create({ name, email })

  return { success: true }
}
```

```jsx filename="app/actions.js" switcher
'use server'

export async function createUser(formData) {
  const name = formData.get('name')
  const email = formData.get('email')

  // データベースに保存
  // await db.users.create({ name, email })

  return { success: true }
}
```

クライアントコンポーネントで使用：

```tsx filename="app/page.tsx" switcher
'use client'

import { createUser } from './actions'
import { useActionState } from 'react'

export default function Page() {
  const [state, formAction, pending] = useActionState(createUser, null)

  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create User'}
      </button>
      {state?.success && <p>User created!</p>}
    </form>
  )
}
```

```jsx filename="app/page.js" switcher
'use client'

import { createUser } from './actions'
import { useActionState } from 'react'

export default function Page() {
  const [state, formAction, pending] = useActionState(createUser, null)

  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit" disabled={pending}>
        {pending ? 'Creating...' : 'Create User'}
      </button>
      {state?.success && <p>User created!</p>}
    </form>
  )
}
```

このパターンにより、APIルートを作成する必要がなく、サーバーアクションを直接呼び出すことができます。

## 静的エクスポート設定

SPAとして静的エクスポートするには、`next.config.js`で設定します：

```javascript filename="next.config.js"
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
}

module.exports = nextConfig
```

この設定により、Next.jsは静的なHTMLファイルを生成し、任意の静的ホスティングサービスにデプロイできます。

詳細については、[静的エクスポートのドキュメント](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)を参照してください。

## 既存のSPAからの移行

既存のSPAアプリケーション（Create React AppやViteなど）からNext.jsに移行する場合、以下のガイドを参照してください：

- [Create React Appからの移行](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
- [Viteからの移行](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)

## ハイブリッドアプローチ

Next.jsの真の強みは、SPAとサーバーサイドレンダリングを組み合わせることができる点です。以下のように段階的に機能を追加できます：

### クライアントとサーバーのデータフェッチを組み合わせる

```tsx filename="app/page.tsx" switcher
import { Suspense } from 'react'
import ServerComponent from './ServerComponent'
import ClientComponent from './ClientComponent'

export default function Page() {
  return (
    <div>
      {/* サーバー側でデータをフェッチ */}
      <Suspense fallback={<div>Loading server data...</div>}>
        <ServerComponent />
      </Suspense>

      {/* クライアント側でデータをフェッチ */}
      <ClientComponent />
    </div>
  )
}
```

### ページごとにレンダリング戦略を選択

Next.jsでは、ページごとに異なるレンダリング戦略を選択できます：

- **静的生成（SSG）**: ビルド時にHTML生成
- **サーバーサイドレンダリング（SSR）**: リクエストごとにHTML生成
- **クライアントサイドレンダリング（CSR）**: ブラウザでレンダリング
- **インクリメンタル静的再生成（ISR）**: 静的ページを段階的に更新

```tsx filename="app/page.tsx"
// 静的生成（デフォルト）
export default function StaticPage() {
  return <div>This page is statically generated</div>
}

// 動的レンダリング
export const dynamic = 'force-dynamic'

export default function DynamicPage() {
  return <div>This page is dynamically rendered</div>
}

// ISR（再検証付き）
export const revalidate = 60 // 60秒ごとに再検証

export default function ISRPage() {
  return <div>This page uses ISR</div>
}
```

## ベストプラクティス

### 1. next/linkを使用する

`next/link`を使用すると、自動的にプリフェッチングが有効になり、高速なページ遷移が実現します：

```tsx filename="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  )
}
```

### 2. コード分割を活用する

Next.jsの自動コード分割を活用して、初期バンドルサイズを削減します：

```tsx filename="app/page.tsx"
import dynamic from 'next/dynamic'

// 動的インポートでコード分割
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})

export default function Page() {
  return <HeavyComponent />
}
```

### 3. 画像最適化を使用する

`next/image`を使用して、自動的に画像を最適化します：

```tsx filename="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/photo.jpg"
      alt="Photo"
      width={500}
      height={300}
      priority
    />
  )
}
```

### 4. メタデータを適切に設定する

SEOのために、各ページにメタデータを設定します：

```tsx filename="app/page.tsx"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My SPA Page',
  description: 'This is a single-page application built with Next.js',
}

export default function Page() {
  return <div>Content</div>
}
```

## まとめ

Next.jsは、従来のSPAを構築しながらも、必要に応じてサーバー機能を段階的に追加できる柔軟性を提供します。自動コード分割、ルートプリフェッチング、画像最適化などの最適化機能を活用することで、高パフォーマンスなSPAを構築できます。
