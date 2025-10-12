# Partial Prerendering（部分的プリレンダリング）

Partial Prerendering（PPR）は、同じルート内で静的コンテンツと動的コンテンツを組み合わせることを可能にする実験的なレンダリング戦略です。

このページでは、Partial Prerenderingの仕組み、使用方法、および適用可能な場面について学びます。

> **注意**: Partial Prerenderingは実験的な機能であり、現在は本番環境での使用には適していません。

## 背景

Partial Prerenderingは、長年にわたるReactとNext.jsの研究開発に基づいています。

- [React Concurrent Features](https://react.dev/blog/2021/12/17/react-conf-2021-recap#react-18-and-concurrent-features): Suspenseを使用したプログレッシブレンダリング。
- [Next.jsのIncremental Static Regeneration](/docs/pages/building-your-application/data-fetching/incremental-static-regeneration): ページの一部を更新するための再検証メカニズム。
- [Next.js App Router](/docs/app): レイアウト、Server Components、およびSuspenseを使用したUIの構築。

Partial Prerenderingは、これらの機能を組み合わせ、開発者の追加作業を最小限に抑えながら、初期ページロードのパフォーマンスを向上させます。

## Partial Prerenderingとは？

Partial Prerenderingは、静的レンダリングと動的レンダリングを同じルート内で組み合わせることを可能にする実験的なレンダリング戦略です。

例えば：

\`\`\`tsx title="app/page.tsx"
import { Suspense } from 'react'
import { StaticComponent, DynamicComponent, Fallback } from '@/app/ui'

export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
    </>
  )
}
\`\`\`

このルートがリクエストされると：

1. サーバーは、\`<StaticComponent>\`とSuspenseのフォールバック\`<Fallback />\`を含む**静的シェル**を送信します。
2. ルートの動的部分（\`<DynamicComponent>\`）は、初期レスポンスに含まれません。
3. 動的部分は、同じHTTPリクエスト内でストリーミングされます。

<Image
  alt="Partial Prerenderingの視覚化"
  srcLight="/docs/light/thinking-in-ppr.png"
  srcDark="/docs/dark/thinking-in-ppr.png"
  width="1600"
  height="632"
/>

これにより、ユーザーはパーソナライズされた動的コンテンツを待つことなく、静的コンテンツをすぐに見ることができます。

ページ全体を動的にレンダリングする（現在のSSRの動作）か、ページ全体を静的にレンダリングするかを選択する必要がなくなります。Partial Prerenderingでは、Suspense境界を使用して、ルートのどの部分を静的にし、どの部分を動的にするかを定義します。

[Partial Prerenderingの仕組み](/docs/app/api-reference/config/next-config-js/partial-prerendering)について詳しく学びましょう。

## Partial Prerenderingの仕組み

Partial Prerenderingは、React Concurrent Featuresを活用し、リクエスト時にルートの一部をレンダリングする作業を延期します。

ユーザーがルートにアクセスする前に、**静的シェル**をプリレンダリングします。シェルは高速に配信されますが、動的**ホール**が残されます。

動的ホールは、同じHTTPリクエスト内で非同期にロードされ、ストリーミングされます。同じリクエスト内で複数のホールがある場合、これらは並行して読み込まれ、全体のロード時間が短縮されます。

> **知っておくと良いこと**: リクエスト-レスポンスのライフサイクルでは、ホールが読み込まれている間、静的シェルが表示されます。これにより、応答時間の長いAPIやデータベースからのデータがルート全体のロードをブロックするのを防ぎます。

### 静的レンダリング

静的レンダリングでは、コンポーネントはビルド時または[再検証](/docs/app/building-your-application/data-fetching/incremental-static-regeneration)後に事前にレンダリングされます。結果はキャッシュされ、[Content Delivery Network (CDN)](https://developer.mozilla.org/docs/Glossary/CDN)にプッシュできます。この最適化により、レンダリング作業の結果をユーザー間およびサーバーリクエスト間で共有できます。

静的レンダリングは、ユーザーに対してパーソナライズされておらず、ブログ投稿や製品ページなど、ビルド時に知ることができるデータがある場合に役立ちます。

### 動的レンダリング

動的レンダリングでは、コンポーネントはリクエスト時にサーバーでレンダリングされます。この最適化により、リクエスト時にのみ知ることができるデータがある場合や、[cookies](/docs/app/api-reference/functions/cookies)や[URLのsearchParams](/docs/app/api-reference/file-conventions/page#searchparams-optional)などのリクエスト時の情報に基づいてコンテンツを変更する必要がある場合に役立ちます。

[動的関数](/docs/app/building-your-application/rendering/server-components#dynamic-rendering)または[キャッシュされていないデータリクエスト](/docs/app/building-your-application/caching#opting-out)を持つ動的ルートは、リクエスト時にルート全体を動的にレンダリングします。

Next.jsでは、動的関数とキャッシュされていないデータをルート内で使用できる粒度を提供します。このテーブルは、[動的関数](/docs/app/building-your-application/rendering/server-components#dynamic-functions)と[キャッシング](/docs/app/building-your-application/caching)がルートが静的か動的かにどのように影響するかを要約しています：

| 動的関数 | データ | ルート |
| -------- | ----- | ----- |
| なし | キャッシュ済み | 静的にレンダリング |
| あり | キャッシュ済み | 動的にレンダリング |
| なし | キャッシュなし | 動的にレンダリング |
| あり | キャッシュなし | 動的にレンダリング |

上記の表で、ルートを完全に静的にするには、すべてのデータがキャッシュされている必要があります。ただし、キャッシュされたデータフェッチとキャッシュされていないデータフェッチの両方を使用する動的にレンダリングされたルートを持つことができます。

Next.jsは、使用する機能とAPIに基づいて、各ルートに最適なレンダリング戦略を自動的に選択します。開発者として、特定のデータを[キャッシュまたは再検証](/docs/app/building-your-application/data-fetching/incremental-static-regeneration)するタイミング、およびUIの一部を[ストリーミング](/docs/app/building-your-application/routing/loading-ui-and-streaming)するタイミングを選択します。

### 動的関数

動的関数は、リクエスト時にのみ知ることができる情報（ユーザーのCookie、現在のリクエストヘッダー、URLのsearchParamsなど）に依存します。Next.jsでは、これらの動的APIは次のとおりです：

- **[\`cookies()\`](/docs/app/api-reference/functions/cookies)**: Server ComponentまたはServer Actionで実行されるときにリクエストのCookieにアクセスします。\`cookies()\`を使用すると、ルートは動的レンダリングにオプトインされます。
- **[\`headers()\`](/docs/app/api-reference/functions/headers)**: Server ComponentまたはServer Actionで実行されるときにリクエストヘッダーにアクセスします。\`headers()\`を使用すると、ルートは動的レンダリングにオプトインされます。
- **[\`connection()\`](/docs/app/api-reference/functions/connection)**: リクエストに関する情報（クライアントのIPアドレスなど）にアクセスします。\`connection()\`を使用すると、ルートは動的レンダリングにオプトインされます。
- **[\`draftMode()\`](/docs/app/api-reference/functions/draft-mode)**: ルートをドラフトモードでレンダリングします。\`draftMode()\`を使用すると、ルートは動的レンダリングにオプトインされます。
- **[\`searchParams\`](/docs/app/api-reference/file-conventions/page#searchparams-optional)**: Pageコンポーネントに渡されるpropで、現在のURLのsearchパラメータにアクセスします。\`searchParams\`を使用すると、ページは動的レンダリングにオプトインされます。
- **[\`unstable_noStore()\`](/docs/app/api-reference/functions/unstable_noStore)**: データのキャッシュをオプトアウトすることを宣言的に指定します。\`unstable_noStore()\`を使用すると、コンポーネントは動的レンダリングにオプトインされます。
- **[\`fetch()\`のキャッシュオプション](/docs/app/api-reference/functions/fetch)**: \`fetch()\`に\`cache: 'no-store'\`または\`next: { revalidate: 0 }\`を渡すと、コンポーネントは動的レンダリングにオプトインされます。

これらの関数のいずれかを使用すると、リクエスト時にルート全体が動的レンダリングにオプトインされます。

### Suspenseとストリーミング

Partial Prerenderingでは、**Suspense**を使用して、コンポーネントツリーの動的部分をマークします。

\`\`\`tsx title="app/page.tsx"
import { Suspense } from 'react'
import { StaticComponent, DynamicComponent, Fallback } from '@/app/ui'

export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
    </>
  )
}
\`\`\`

**Suspense**は次のように機能します：

1. 静的コンテンツとフォールバックUIは初期HTMLの一部としてプリレンダリングされます。
2. 動的コンテンツのレンダリングはルートがリクエストされるまで延期されます。

Suspenseでコンポーネントをラップしても、そのコンポーネントが動的になるわけではありません。代わりに、Suspenseは静的コンテンツと動的コンテンツの境界として機能します。

たとえば、動的関数\`cookies()\`を使用している場合、Suspenseは、ルート全体を動的にレンダリングするのではなく、コンポーネントを動的としてマークします：

\`\`\`tsx title="app/user.tsx"
import { cookies } from 'next/headers'

export async function User() {
  const session = (await cookies()).get('session')?.value
  return <div>User: {session}</div>
}
\`\`\`

**ストリーミング**を使用すると、ルート全体がロードされるのを待つのではなく、ルートの一部を徐々にクライアントにレンダリングして送信できます。

<Image
  alt="ストリーミングの視覚化"
  srcLight="/docs/light/server-rendering-with-streaming.png"
  srcDark="/docs/dark/server-rendering-with-streaming.png"
  width="1600"
  height="785"
/>

ストリーミングにより、低速なデータリクエストがページ全体をブロックするのを防ぐことができます。ユーザーは、すべてのデータがロードされるのを待つことなく、ページの一部を操作できます。

ストリーミングはデフォルトでNext.jsに組み込まれており、初期ページのロード時間とレンダリングに低速なデータフェッチに依存するUIの両方を改善するのに役立ちます。

[Loading UIとStreaming](/docs/app/building-your-application/routing/loading-ui-and-streaming)について詳しく学びましょう。

## Partial Prerenderingの有効化

Partial Prerenderingは、\`next.config.js\`ファイルで有効にできます：

\`\`\`ts title="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}

export default nextConfig
\`\`\`

\`incremental\`値を使用すると、特定のルートとレイアウトでPartial Prerenderingを段階的に採用できます。

\`\`\`tsx title="app/page.tsx"
export const experimental_ppr = true

export default function Page() {
  return (
    // ...
  )
}
\`\`\`

> **知っておくと良いこと**:
> - \`experimental_ppr = true\`がない場合、ルートはデフォルトで\`false\`となり、PPRを使用してプリレンダリングされません。各ルートのPPRを明示的にオプトインする必要があります。
> - \`experimental_ppr\`は、子セグメントを含むルートのすべてのセグメントに適用されます。すべてのファイルに追加する必要はありません。
> - 子セグメントのPPRを無効にするには、子セグメントで\`experimental_ppr\`を\`false\`に設定できます。

ルートをオプトインした後、静的シェルを定義し、ルートの動的部分を\`<Suspense>\`でラップします：

\`\`\`tsx title="app/page.tsx"
import { Suspense } from 'react'
import { StaticComponent, DynamicComponent, Fallback } from '@/app/ui'

export const experimental_ppr = true

export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={<Fallback />}>
        <DynamicComponent />
      </Suspense>
    </>
  )
}
\`\`\`

## 例

### 動的コンポーネント

次の例を考えてみましょう。ここで、\`<User>\`コンポーネントは動的関数\`cookies()\`を使用しています。Partial Prerenderingが有効になっている場合、\`<User>\`コンポーネントは、ルート全体を動的にするのではなく、動的としてマークされます：

\`\`\`tsx title="app/user.tsx"
import { cookies } from 'next/headers'

export async function User() {
  const session = (await cookies()).get('session')?.value
  return <div>User: {session}</div>
}
\`\`\`

\`<Page>\`コンポーネントでは、静的コンテンツをプリレンダリングできるようにするために、\`<User>\`を\`<Suspense>\`でラップします：

\`\`\`tsx title="app/page.tsx"
import { Suspense } from 'react'
import { User, AvatarSkeleton } from './user'

export const experimental_ppr = true

export default function Page() {
  return (
    <section>
      <h1>This will be prerendered</h1>
      <Suspense fallback={<AvatarSkeleton />}>
        <User />
      </Suspense>
    </section>
  )
}
\`\`\`

\`<Suspense>\`は境界として機能し、ルート全体を動的にするのではなく、動的な\`<User>\`コンポーネントを分離します。

### キャッシュされていないデータ

前の例は動的関数\`cookies()\`を使用していましたが、[キャッシュされていない](/docs/app/api-reference/functions/fetch)\`fetch()\`リクエストを使用してコンポーネントを動的にすることもできます：

\`\`\`tsx title="app/user.tsx"
export async function User() {
  const res = await fetch('https://api.example.com/user', {
    cache: 'no-store',
  })
  const data = await res.json()
  return <div>User: {data.name}</div>
}
\`\`\`

### データベースクエリ

同様に、データベースクエリでも動的コンポーネントを作成できます：

\`\`\`tsx title="app/user.tsx"
import { db } from '@/lib/db'

export async function User() {
  const user = await db.user.findUnique({ where: { id: 1 } })
  return <div>User: {user.name}</div>
}
\`\`\`

### 検索パラメータ

searchParamsを使用するコンポーネントも動的になります：

\`\`\`tsx title="app/page.tsx"
import { Suspense } from 'react'
import { SearchResults, SearchSkeleton } from './search'

export const experimental_ppr = true

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>
}) {
  const params = await searchParams
  return (
    <section>
      <h1>Search Page</h1>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults query={params.query} />
      </Suspense>
    </section>
  )
}
\`\`\`

### \`noStore()\`の使用

\`unstable_noStore()\`を使用して、特定のコンポーネントをキャッシュからオプトアウトすることもできます：

\`\`\`tsx title="app/user.tsx"
import { unstable_noStore as noStore } from 'next/cache'

export async function User() {
  noStore()
  const res = await fetch('https://api.example.com/user')
  const data = await res.json()
  return <div>User: {data.name}</div>
}
\`\`\`

> **知っておくと良いこと**: \`unstable_noStore\`は\`cache: 'no-store'\`を\`fetch\`に使用するのと同等で、データフェッチライブラリで\`fetch\`の代わりに\`cache\`オプションがサポートされていない場合に優先されます。

## Next.js 14と15

Partial Prerenderingは、Next.js 15の実験的な機能です。

Next.js 14では、Partial Prerenderingは最初に実験的機能として導入されましたが、異なる実装を使用していました。Next.js 14から15にアップグレードする場合は、PPRを使用しているルートを確認し、更新してください。

[アップグレードガイド](/docs/app/building-your-application/upgrading/version-15)で、Next.js 14から15への移行について詳しく学びましょう。
