# データフェッチ

Next.jsは、データをフェッチ、キャッシュ、再検証する方法をいくつか提供しています。このページでは、推奨されるパターンとベストプラクティスについて説明します。

データフェッチには主に2つの方法があります：

1. **サーバー上で**: Server Components、Route Handlers、およびServer Actionsを使用します。
2. **クライアント上で**: Client Componentsでサードパーティライブラリを使用します。

## サーバー上でのデータフェッチ

可能な限り、Server Componentsでデータをフェッチすることをお勧めします。これにより、次のことが可能になります：

- バックエンドデータリソース（データベースなど）に直接アクセスできます。
- アクセストークンやAPIキーなどの機密情報がクライアントに公開されるのを防ぐことで、アプリケーションをより安全に保ちます。
- 同じ環境でデータをフェッチしてレンダリングします。これにより、クライアントとサーバー間のやり取りと、クライアント上の[メインスレッド](https://vercel.com/blog/how-react-18-improves-application-performance)での作業の両方が削減されます。
- 単一のラウンドトリップで複数のデータフェッチを実行できます。
- クライアント-サーバー[ウォーターフォール](#並列およびシーケンシャルデータフェッチ)を減らします。
- 地域によっては、データソースの近くでデータフェッチが行われ、レイテンシが削減され、パフォーマンスが向上します。

Server Components、Route Handlers、およびServer Actionsで\`fetch\` Web APIまたはORMとデータベースクエリを使用してデータをフェッチできます。

### Server Componentsでのデータフェッチ

デフォルトでは、Next.jsは自動的にServer Componentsでデータをフェッチし、結果を[キャッシュ](/docs/app/building-your-application/caching)します。

#### \`fetch\` APIの使用

次の例は、Server Componentで\`fetch\` APIを使用してデータをフェッチする方法を示しています：

\`\`\`tsx title="app/page.tsx"
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

この例では、\`fetch\`リクエストはデフォルトで[自動的にキャッシュ](/docs/app/building-your-application/caching#request-memoization)され、結果が保存されます。

> **知っておくと良いこと**: Next.jsは、Server Componentsでの[\`fetch\`の拡張](/docs/app/api-reference/functions/fetch)を提供します。

#### ORMまたはデータベースの使用

このコンポーネントは、ORMを使用してデータベースからデータをフェッチします。結果は[デフォルトでキャッシュされません](/docs/app/api-reference/functions/fetch#optout)：

\`\`\`tsx title="app/page.tsx"
import { db, posts } from '@/lib/db'

export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

このクエリの結果をキャッシュするには、[キャッシング動作](/docs/app/building-your-application/caching#data-cache)を変更できます。

### Route Handlersでのデータフェッチ

Route Handlersは、Server Componentsでカバーされないユースケース用のAPIエンドポイントを作成するのに役立ちます。Route Handlersで\`fetch\` APIまたはORMを使用できます。

詳細については、[Route Handlers](/docs/app/building-your-application/routing/route-handlers)ドキュメントを参照してください。

### Server Actionsでのデータフェッチ

Server Actionsは、サーバー上で非同期コードを実行するために使用できます。これにより、APIエンドポイントを作成する必要がなくなります。Server Actionsで\`fetch\` APIまたはORMを使用できます。

詳細については、[Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)ドキュメントを参照してください。

## クライアント上でのデータフェッチ

最初にサーバーでデータをフェッチできないか検討することをお勧めします。

ただし、クライアント側のデータフェッチが妥当な場合もあります。これらのシナリオでは、クライアント側のデータフェッチライブラリ（[SWR](https://swr.vercel.app/)または[TanStack Query](https://tanstack.com/query/latest)など）を使用してClient Componentsで手動で\`fetch\`を呼び出すか、React \`use\`フックを利用できます。

### Client Componentsでのデータフェッチ

Client Componentsでデータをフェッチするには、Reactの\`use\`フックを使用できます。

\`use\`フックは、**Promiseを受け入れる**React関数です。\`use\`で\`fetch\`をラップすることは、現在Client Componentsでは**推奨されていません**。複数の再レンダリングをトリガーする可能性があります。\`fetch\`の詳細については、[Reactドキュメント](https://react.dev/reference/react/use#streaming-data-from-server-to-client)を参照してください。

以下の例では、Server Componentで\`fetch\`リクエストが開始され、結果がClient Componentに渡されます。その後、クライアントで\`use\`を使用してPromiseを解決できます：

\`\`\`tsx title="app/page.tsx"
import Posts from '@/app/ui/posts'

export default function Page() {
  // この fetch リクエストは Server Component で開始されます
  const posts = fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )

  return <Posts posts={posts} />
}
\`\`\`

\`\`\`tsx title="app/ui/posts.tsx"
'use client'
import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<Post[]>
}) {
  // use フックを使用してプロミスを解決します
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

\`use\`は**Suspenseでラップする必要があります**。詳細については、[Reactドキュメント](https://react.dev/reference/react/use)を参照してください。

### SWRを使用したClient Componentsでのデータフェッチ

[SWR](https://swr.vercel.app/)は、データフェッチ用のReactフックのコレクションです。クライアントでデータをフェッチする場合、**強く推奨されます**。これは、キャッシング、再検証、フォーカストラッキング、インターバルでの再フェッチなどを処理します。

前の例と同じデータを使用して、SWRを使用してClient Componentでデータをフェッチできます。SWRは自動的にデータをキャッシュし、ネットワーク接続が失われた場合でもデータを提供できる再検証機能を提供します。

SWRの使用方法の詳細については、[SWRドキュメント](https://swr.vercel.app/docs/getting-started)を参照してください。

\`\`\`tsx title="app/page.tsx"
'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Page() {
  const { data, error } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  )

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
\`\`\`

## データストリーミング

ストリーミングとSuspenseは、UIの増分レンダリングと増分ストリーミングをクライアントに提供するReact機能です。

Server ComponentsとネストされたLayoutsを使用すると、特にデータを必要としないページの部分を即座にレンダリングし、データをフェッチしているページの部分には[ローディング状態](/docs/app/building-your-application/routing/loading-ui-and-streaming)を表示できます。これにより、ユーザーはページ全体のロードが完了するのを待つ必要なく、ページとのインタラクションを開始できます。

<Image
  alt="サーバーレンダリングとストリーミング"
  srcLight="/docs/light/server-rendering-with-streaming.png"
  srcDark="/docs/dark/server-rendering-with-streaming.png"
  width="1600"
  height="785"
/>

ストリーミングと[Suspense](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)について詳しく学びましょう。

## 並列およびシーケンシャルデータフェッチ

Reactコンポーネント内でデータをフェッチする場合、並列とシーケンシャルの2つのデータフェッチパターンに注意する必要があります。

<Image
  alt="シーケンシャルおよび並列データフェッチ"
  srcLight="/docs/light/sequential-parallel-data-fetching.png"
  srcDark="/docs/dark/sequential-parallel-data-fetching.png"
  width="1600"
  height="525"
/>

### シーケンシャルデータフェッチ

シーケンシャルデータフェッチでは、ルート内のリクエストは互いに依存しており、ウォーターフォールを作成します。あるフェッチが別のフェッチの結果に依存している場合、または次のフェッチの前にある条件を満たしたい場合があるため、このパターンが必要になる場合があります。ただし、この動作は意図しないものであり、読み込み時間が長くなる可能性があります。

たとえば、\`Playlists\`コンポーネントは、\`artistID\`プロパティに依存しているため、\`Artist\`コンポーネントがデータのフェッチを完了した後にのみデータのフェッチを開始します：

\`\`\`tsx title="app/artist/[username]/page.tsx"
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // Artistの情報をフェッチ
  const artist = await getArtist(username)

  // Artistのプレイリストをフェッチ
  const playlists = await getArtistPlaylists(artist.id)

  return (
    <>
      <Artist artist={artist} />
      <Playlists playlists={playlists} />
    </>
  )
}
\`\`\`

このような場合、[\`loading.js\`](/docs/app/building-your-application/routing/loading-ui-and-streaming)（ルートセグメント用）または[React \`<Suspense>\`](/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense)（ネストされたコンポーネント用）を使用して、Reactがストリーミング中に即座に読み込み状態を表示できるようにすることができます。

これにより、データフェッチによってルート全体がブロックされるのを防ぎ、ユーザーはブロックされていないページの部分とインタラクションできます。

### 並列データフェッチ

並列でデータをフェッチするには、データを使用するコンポーネントの外部でリクエストを開始し、コンポーネント内から呼び出すことで、積極的にリクエストを開始できます。これにより、両方のリクエストを並列で開始して時間を節約できますが、両方のPromiseが解決されるまでユーザーはレンダリングされた結果を見ることができません。

次の例では、\`getArtist\`と\`getAlbums\`関数が\`Page\`コンポーネントの外部で定義され、コンポーネント内で呼び出され、両方のPromiseが解決されるのを待ちます：

\`\`\`tsx title="app/artist/[username]/page.tsx"
import { getArtist, getAlbums } from './api'

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // 両方のリクエストを並列で開始
  const artistData = getArtist(username)
  const albumsData = getAlbums(username)

  // Promiseが解決されるのを待つ
  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <Artist artist={artist} />
      <Albums albums={albums} />
    </>
  )
}
\`\`\`

ユーザーエクスペリエンスを向上させるには、[Suspense境界](/docs/app/building-your-application/routing/loading-ui-and-streaming)を追加して、レンダリング作業を分割し、できるだけ早く結果の一部を表示できます。

## データフェッチパターンとベストプラクティス

Reactとデータをフェッチする際に推奨されるパターンとベストプラクティスがいくつかあります。このセクションでは、最も一般的なパターンのいくつかと、それらの使用方法について説明します。

### データは必要な場所でフェッチする

ツリー内の複数のコンポーネントで同じデータ（例：現在のユーザー）を使用する必要がある場合、グローバルにデータをフェッチしたり、コンポーネント間でプロパティを転送したりする必要はありません。代わりに、同じデータを複数回リクエストすることによるパフォーマンスへの影響を心配することなく、データを必要とするコンポーネントで\`fetch\`または React \`cache\`を使用できます。

これが可能なのは、\`fetch\`リクエストが自動的に[メモ化](/docs/app/building-your-application/caching#request-memoization)されるためです。

> **知っておくと良いこと**: これはLayoutにも適用されます。親レイアウトと子の間でデータを渡すことはできません。

### コンポーネントをサーバーに保持する

クライアント上でデータをフェッチする必要がある場合を除き、データフェッチとデータを必要とするコンポーネントをサーバーに保持することをお勧めします。

これにより、クライアント側のJavaScriptバンドルサイズを小さく保ち、クライアントとサーバー間のやり取りを減らすことができます。

### 並列でデータをロードする

クライアント-サーバーウォーターフォールを最小限に抑えるには、並列でデータをロードすることをお勧めします。

### Suspense境界を戦略的に使用する

Suspense境界を戦略的に配置することで、よりダイナミックなアプリケーションを作成できます。たとえば、特定のコンポーネントのデータのみをロードする必要があるようにコンポーネントをラップする代わりに、ページ全体をSuspense境界でラップできます。

ただし、複数のコンポーネントが同じデータに依存している場合は、これらのコンポーネントを単一のSuspense境界でラップしてデータを一度にフェッチし、同じフォールバックを共有する方が良い場合があります。

### データフェッチとレンダリングを一緒に配置する

コンポーネントツリーのできるだけ低い位置でデータフェッチを行う方が良い場合があります。これにより、データを必要とするコンポーネントのみがそのフェッチの結果を待つ必要があるため、ページの他の部分のレンダリングがブロックされるのを防ぐことができます。

### 適切な場所でデータを変更する

データを変更するには、[Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)を使用します。これにより、Server ComponentsからデータベースまたはAPIへの変更を、別のAPIエンドポイントを作成することなく行うことができます。

## 例とユースケース

次のセクションでは、Next.jsでのデータフェッチの一般的な例とユースケースを示します。

### ビルド時のデータフェッチ

デフォルトでは、\`fetch\`を使用したすべてのデータフェッチは[ビルド時に自動的にキャッシュ](/docs/app/building-your-application/caching#data-cache)されます。これは、データがビルド時にフェッチされ、結果がキャッシュに保存されることを意味します。キャッシュされたデータは、後続のすべてのリクエストで使用されます。

\`\`\`tsx title="app/page.tsx"
// これはビルド時にキャッシュされます
const data = await fetch('https://api.vercel.app/blog')
const posts = await data.json()
\`\`\`

### リクエスト時のデータフェッチ

\`fetch\`に\`cache: 'no-store'\`オプションを渡すことで、リクエスト時にデータをフェッチできます：

\`\`\`tsx title="app/page.tsx"
// これはリクエストごとにフェッチされます
const data = await fetch('https://api.vercel.app/blog', {
  cache: 'no-store',
})
const posts = await data.json()
\`\`\`

### Incremental Static Regeneration

[Incremental Static Regeneration (ISR)](/docs/app/building-your-application/data-fetching/incremental-static-regeneration)を使用すると、特定の間隔でキャッシュを再検証できます：

\`\`\`tsx title="app/page.tsx"
// 最大60秒ごとに再検証
const data = await fetch('https://api.vercel.app/blog', {
  next: { revalidate: 60 },
})
const posts = await data.json()
\`\`\`

### データの再検証

[\`revalidatePath\`](/docs/app/api-reference/functions/revalidatePath)または[\`revalidateTag\`](/docs/app/api-reference/functions/revalidateTag)を使用してオンデマンドでデータを再検証できます：

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  // データベースを更新
  // ...

  // /posts ルートを再検証
  revalidatePath('/posts')
}
\`\`\`

詳細については、[再検証](/docs/app/building-your-application/caching#revalidating)ドキュメントを参照してください。

## 次のステップ

これで、Next.jsでのデータフェッチの基本を理解できました。次のステップでは、データの変更、キャッシング、再検証について詳しく学びます：

- **[Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)**: Server Componentsからデータを変更する方法を学びます。
- **[Caching](/docs/app/building-your-application/caching)**: Next.jsのキャッシングメカニズムについて学びます。
- **[Incremental Static Regeneration](/docs/app/building-your-application/data-fetching/incremental-static-regeneration)**: ページを段階的に更新する方法を学びます。
