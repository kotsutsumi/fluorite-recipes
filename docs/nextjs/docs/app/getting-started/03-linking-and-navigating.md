# リンクとナビゲーション

Next.jsでルート間を移動する方法は4つあります：

- [\`<Link>\`コンポーネント](#linkコンポーネント)を使用する
- [\`useRouter\`フック](#userouterフック)を使用する（[Client Components](/docs/app/building-your-application/rendering/client-components)）
- [\`redirect\`関数](#redirect関数)を使用する（[Server Components](/docs/app/building-your-application/rendering/server-components)）
- [ネイティブHistory API](#ネイティブhistory-api)を使用する

このページでは、これらの各オプションの使用方法を説明し、ナビゲーションの仕組みについて詳しく説明します。

## \`<Link>\`コンポーネント

\`<Link>\`は、HTMLの\`<a>\`タグを拡張してルート間の[プリフェッチ](#2-プリフェッチ)とクライアント側ナビゲーションを提供する組み込みコンポーネントです。これは、Next.jsでルート間を移動するための主要な推奨方法です。

\`next/link\`からインポートし、コンポーネントに\`href\`プロパティを渡すことで使用できます：

\`\`\`tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
\`\`\`

\`<Link>\`に渡すことができる他のオプションのプロパティがあります。詳細については、[API reference](/docs/app/api-reference/components/link)を参照してください。

### 例

#### 動的セグメントへのリンク

[動的セグメント](/docs/app/building-your-application/routing/dynamic-routes)にリンクする場合、[テンプレートリテラルと補間](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)を使用してリンクのリストを生成できます。たとえば、ブログ投稿のリストを生成する場合：

\`\`\`tsx title="app/blog/page.tsx"
import Link from 'next/link'

export default function Page({ posts }: { posts: Post[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={\`/blog/\${post.slug}\`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
\`\`\`

#### アクティブなリンクの確認

[\`usePathname()\`](/docs/app/api-reference/functions/use-pathname)を使用して、リンクがアクティブかどうかを判断できます。たとえば、アクティブなリンクにクラスを追加するには、現在の\`pathname\`がリンクの\`href\`と一致するかどうかを確認できます：

\`\`\`tsx title="app/ui/nav-links.tsx"
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav>
      <Link className={pathname === '/' ? 'active' : ''} href="/">
        Home
      </Link>
      <Link
        className={pathname === '/about' ? 'active' : ''}
        href="/about"
      >
        About
      </Link>
    </nav>
  )
}
\`\`\`

#### \`id\`へのスクロール

Next.jsの\`<Link>\`コンポーネントのデフォルトの動作は、[変更されたルートセグメントの先頭にスクロール](#フォーカスとスクロール管理)することです。\`href\`で\`id\`が定義されている場合、通常のHTMLの\`<a>\`タグと同様に、特定の\`id\`にスクロールします。

ルートセグメントの先頭へのスクロールを防ぐには、\`scroll={false}\`を設定し、ハッシュ化された\`id\`を\`href\`に追加します：

\`\`\`tsx
<Link href="/dashboard#settings" scroll={false}>
  Settings
</Link>
\`\`\`

#### プリフェッチの無効化

プリフェッチはデフォルトで有効になっています。リンクがビューポートに表示されると（最初またはスクロールによって）、Next.jsはリンクされたルート（\`href\`で示される）をバックグラウンドでプリフェッチします。

\`prefetch={false}\`を渡すことでプリフェッチを無効にできます：

\`\`\`tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <Link href="/dashboard" prefetch={false}>
      Dashboard
    </Link>
  )
}
\`\`\`

## \`useRouter()\`フック

\`useRouter\`フックを使用すると、[Client Components](/docs/app/building-your-application/rendering/client-components)からプログラム的にルートを変更できます。

\`\`\`tsx title="app/page.tsx"
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
\`\`\`

\`useRouter\`メソッドの完全なリストについては、[API reference](/docs/app/api-reference/functions/use-router)を参照してください。

> **推奨事項**: \`useRouter\`を使用する特定の要件がない限り、\`<Link>\`コンポーネントを使用してルート間を移動してください。

## \`redirect\`関数

[Server Components](/docs/app/building-your-application/rendering/server-components)の場合、代わりに\`redirect\`関数を使用します。

\`\`\`tsx title="app/team/[id]/page.tsx"
import { redirect } from 'next/navigation'

async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  if (!id) {
    redirect('/login')
  }

  const team = await fetchTeam(id)
  if (!team) {
    redirect('/join')
  }

  // ...
}
\`\`\`

> **知っておくと良いこと**:
>
> - \`redirect\`はデフォルトで307（一時的リダイレクト）ステータスコードを返します。Server Actionで使用する場合、POST要求の成功結果としてよく使用される303（See Other）を返します。
> - \`redirect\`は内部でエラーをスローするため、\`try/catch\`ブロックの外で呼び出す必要があります。
> - \`redirect\`はレンダリングプロセス中にClient Componentsで呼び出すことができますが、イベントハンドラでは呼び出せません。代わりに[\`useRouter\`フック](#userouterフック)を使用できます。
> - \`redirect\`は絶対URLも受け入れ、外部リンクにリダイレクトするために使用できます。
> - レンダリングプロセスの前にリダイレクトしたい場合は、[\`next.config.js\`](/docs/app/building-your-application/routing/redirecting#redirects-in-nextconfigjs)または[Middleware](/docs/app/building-your-application/routing/redirecting#nextresponseredirect-in-middleware)を使用してください。

詳細については、[\`redirect\` API reference](/docs/app/api-reference/functions/redirect)を参照してください。

## ネイティブHistory API

Next.jsでは、ネイティブの[\`window.history.pushState\`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)および[\`window.history.replaceState\`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)メソッドを使用して、ページを再読み込みせずにブラウザの履歴スタックを更新できます。

\`pushState\`と\`replaceState\`の呼び出しはNext.jsルーターに統合され、[\`usePathname\`](/docs/app/api-reference/functions/use-pathname)と[\`useSearchParams\`](/docs/app/api-reference/functions/use-search-params)と同期できます。

### \`window.history.pushState\`

ブラウザの履歴スタックに新しいエントリを追加するために使用します。ユーザーは前の状態に戻ることができます。たとえば、製品のリストをソートする場合：

\`\`\`tsx title="app/ui/sort-products.tsx"
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', \`?\${params.toString()}\`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
\`\`\`

### \`window.history.replaceState\`

ブラウザの履歴スタックの現在のエントリを置き換えるために使用します。ユーザーは前の状態に戻ることができません。たとえば、アプリケーションのロケールを切り替える場合：

\`\`\`tsx title="app/ui/locale-switcher.tsx"
'use client'

import { usePathname } from 'next/navigation'

export default function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale: string) {
    // 例: '/en/about' または '/fr/contact'
    const newPath = \`/\${locale}\${pathname}\`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
\`\`\`

## ナビゲーションの仕組み

- ルート遷移は\`<Link>\`を使用するか、\`router.push()\`を呼び出すことで開始されます。
- ルーターはブラウザのアドレスバーのURLを更新します。
- ルーターは[クライアント側キャッシュ](#クライアント側キャッシュ)から変更されていないセグメント（例：共有レイアウト）を再利用することで、不要な作業を回避します。これは[部分レンダリング](/docs/app/building-your-application/routing/linking-and-navigating#4-部分レンダリング)とも呼ばれます。
- [ソフトナビゲーションの条件](#ソフトナビゲーションの条件)が満たされている場合、ルーターはサーバーではなくキャッシュから新しいセグメントをフェッチします。そうでない場合、ルーターは[ハードナビゲーション](#ハードナビゲーション)を実行し、サーバーからServer Componentのペイロードをフェッチします。
- 作成された場合、ペイロードがフェッチされている間、サーバーから[ローディングUI](/docs/app/building-your-application/routing/loading-ui-and-streaming)が表示されます。
- ルーターはキャッシュされたペイロードまたは新しいペイロードを使用して、クライアント上の新しいセグメントをレンダリングします。

### 1. プリフェッチ

プリフェッチは、ユーザーが訪問する前にバックグラウンドでルートをプリロードする方法です。Next.jsでルートがプリフェッチされる方法は2つあります：

- **\`<Link>\`コンポーネント**: ルートは、ユーザーのビューポートに表示されると自動的にプリフェッチされます。プリフェッチはページが最初に読み込まれるとき、またはスクロールによって表示されるときに発生します。
- **\`router.prefetch()\`**: \`useRouter\`フックを使用して、プログラム的にルートをプリフェッチできます。

\`<Link>\`のプリフェッチ動作は、静的ルートと動的ルートで異なります：

- [**静的ルート**](/docs/app/building-your-application/rendering/server-components#static-rendering-default): \`prefetch\`はデフォルトで\`true\`です。ルート全体がプリフェッチされ、キャッシュされます。
- [**動的ルート**](/docs/app/building-your-application/rendering/server-components#dynamic-rendering): \`prefetch\`はデフォルトで自動です。最初の\`loading.js\`ファイルまでの共有レイアウトのみがプリフェッチされ、\`30秒\`間キャッシュされます。これにより、動的ルート全体をフェッチするコストが削減され、ユーザーに対するより良いビジュアルフィードバックのために[即時ローディング状態](/docs/app/building-your-application/routing/loading-ui-and-streaming#instant-loading-states)を表示できます。

\`prefetch\`プロパティを\`false\`に設定することでプリフェッチを無効にできます。

詳細については、[\`<Link>\` API reference](/docs/app/api-reference/components/link)を参照してください。

> **知っておくと良いこと**:
>
> - プリフェッチは開発環境では有効になっていませんが、本番環境でのみ有効です。

### 2. キャッシング

Next.jsには、[Router Cache](/docs/app/building-your-application/caching#client-side-router-cache)と呼ばれる**インメモリのクライアント側キャッシュ**があります。ユーザーがアプリ内を移動すると、[プリフェッチされた](#1-プリフェッチ)ルートセグメントと訪問済みルートのReact Server Componentペイロードがキャッシュに保存されます。

これは、ナビゲーション時に、サーバーへの新しいリクエストを行う代わりに、可能な限りキャッシュが再利用されることを意味します。これにより、リクエストとデータ転送の数が削減され、パフォーマンスが向上します。

[Router Cache](/docs/app/building-your-application/caching#client-side-router-cache)の仕組みとその設定方法について詳しく学びましょう。

### 3. 部分レンダリング

部分レンダリングとは、ナビゲーション時に変更されたルートセグメントのみがクライアント上で再レンダリングされ、共有セグメントが保持されることを意味します。

たとえば、2つの兄弟ルート\`/dashboard/settings\`と\`/dashboard/analytics\`間を移動する場合、\`settings\`と\`analytics\`ページがレンダリングされ、共有の\`dashboard\`レイアウトが保持されます。

<Image
  alt="部分レンダリングの仕組み"
  srcLight="/docs/light/partial-rendering.png"
  srcDark="/docs/dark/partial-rendering.png"
  width="1600"
  height="945"
/>

部分レンダリングがない場合、各ナビゲーションによってクライアント上でページ全体が再レンダリングされます。変更されたセグメントのみをレンダリングすることで、転送されるデータの量と実行時間が削減され、パフォーマンスが向上します。

### 4. ソフトナビゲーション

ブラウザは、ページ間を移動するときに「ハードナビゲーション」を実行します。Next.js App Routerは、ページ間の「ソフトナビゲーション」を可能にし、変更されたルートセグメントのみが再レンダリングされることを保証します（部分レンダリング）。これにより、ナビゲーション中にクライアントReact状態が保持されます。

#### ソフトナビゲーションの条件

ナビゲーション時に、Next.jsは移動先のルートが[プリフェッチ](#1-プリフェッチ)されており、[動的セグメント](/docs/app/building-your-application/routing/dynamic-routes)を含まないか、現在のルートと同じ動的パラメータを持つ場合、ソフトナビゲーションを使用します。

たとえば、動的な\`[team]\`セグメントを含む次のルート\`/dashboard/[team]/*\`を考えてみましょう。\`/dashboard/[team]/*\`の下にキャッシュされたセグメントは、\`[team]\`パラメータが変更された場合にのみ無効になります。

- \`/dashboard/team-red/*\`から\`/dashboard/team-red/*\`への移動はソフトナビゲーションになります。
- \`/dashboard/team-red/*\`から\`/dashboard/team-blue/*\`への移動はハードナビゲーションになります。

### 5. 戻る／進むナビゲーション

戻る／進むナビゲーション（[popstate イベント](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event)）には、ソフトナビゲーション動作があります。これは、クライアント側の状態が保持され、新しいリクエストは行われないことを意味します。

### 6. フォーカスとスクロール管理

デフォルトでは、Next.jsはナビゲーション時に変更されたセグメントにフォーカスを設定し、必要に応じてスクロールして表示します。

## ナビゲーションのパフォーマンス最適化

Next.jsは、ナビゲーションパフォーマンスを最適化するためのいくつかの戦略を提供します：

### ローディングUIの追加

[\`loading.js\`](/docs/app/building-your-application/routing/loading-ui-and-streaming)ファイルを使用して、ルートセグメントのローディング状態を作成できます：

\`\`\`tsx title="app/dashboard/loading.tsx"
export default function Loading() {
  return <div>Loading...</div>
}
\`\`\`

### プリフェッチの最適化

デフォルトのプリフェッチ動作は、ほとんどのユースケースに適していますが、必要に応じて調整できます：

- \`prefetch={false}\`を設定してプリフェッチを無効にする
- \`router.prefetch()\`を使用してプログラム的にプリフェッチを制御する

### ダイナミックインポートの使用

大きなコンポーネントやライブラリについては、[\`next/dynamic\`](/docs/app/building-your-application/optimizing/lazy-loading)を使用した動的インポートを検討してください：

\`\`\`tsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/heavy-component'))
\`\`\`

これらの戦略を組み合わせることで、Next.jsアプリケーションのナビゲーションパフォーマンスを大幅に向上させることができます。
