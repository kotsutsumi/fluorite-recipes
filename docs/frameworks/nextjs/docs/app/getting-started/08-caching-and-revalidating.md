# キャッシングと再検証

キャッシングは、データをメモリ（CDNなど）に保存して、各リクエストでデータソース（データベースやCMSなど）から再フェッチする必要がないようにするプロセスです。

再検証は、キャッシュをパージし、最新のデータを再フェッチするプロセスです。これは、データが変更され、最新の情報を表示したい場合に役立ちます。

このページでは、Next.jsでのキャッシングと再検証の仕組みについて学びます。

## 概要

以下は、さまざまなNext.js APIとそれらがキャッシングと再検証にどのように影響するかの高レベルの概要です：

| API | 目的 | キャッシング動作 |
|-----|------|------------------|
| \`fetch\` | データフェッチ | デフォルトでキャッシュされます |
| \`unstable_cache\` | 計算結果をキャッシュ | デフォルトでキャッシュされます |
| \`unstable_noStore\` | キャッシュからオプトアウト | キャッシュされません |
| \`revalidatePath\` | パス別の再検証 | 必要に応じて |
| \`revalidateTag\` | タグ別の再検証 | 必要に応じて |

## \`fetch\`

デフォルトでは、Next.jsは\`fetch\` Web APIを拡張し、各リクエストがサーバー上で独自の永続的なキャッシングセマンティクスを設定できるようにします。

Server Componentsでは、\`fetch\`を使用して、デフォルトで\`'force-cache'\`にキャッシュされるデータをフェッチできます。これは、データがビルド時にフェッチされ、結果がキャッシュされ、リクエスト全体で再利用されることを意味します。

\`\`\`tsx title="app/page.tsx"
// このリクエストは手動で無効化されるまでキャッシュされます
const data = await fetch('https://api.vercel.app/blog')
\`\`\`

### キャッシュの再検証

時間ベースの再検証を使用してデータをキャッシュするには、\`fetch\`の\`next.revalidate\`オプションを使用して、リソースのキャッシュ有効期間（秒単位）を設定できます。

\`\`\`tsx title="app/page.tsx"
// 最大1時間ごとに再検証
const data = await fetch('https://api.vercel.app/blog', {
  next: { revalidate: 3600 },
})
\`\`\`

または、[セグメント設定オプション](/docs/app/api-reference/file-conventions/route-segment-config)を使用して、単一のレイアウトまたはページ内のすべての\`fetch\`リクエストを設定できます。

\`\`\`tsx title="app/page.tsx"
// レイアウトまたはページ内のすべてのfetchリクエストは最大1時間ごとに再検証されます
export const revalidate = 3600
\`\`\`

ルート内に複数のフェッチリクエストがあり、それぞれに異なる再検証頻度がある場合、すべてのリクエストに対して最も短い時間が使用されます。動的レンダリングされたルートの場合、各\`fetch\`リクエストは独立して再検証されます。

詳細については、[\`fetch\` API reference](/docs/app/api-reference/functions/fetch)を参照してください。

### キャッシュのオプトアウト

\`fetch\`リクエストのキャッシュをオプトアウトするには、\`cache: 'no-store'\`オプションを設定できます：

\`\`\`tsx title="app/page.tsx"
// このリクエストはリクエストごとにフェッチされます
const data = await fetch('https://api.vercel.app/blog', {
  cache: 'no-store',
})
\`\`\`

## \`unstable_cache\`

\`unstable_cache\`は、データベースクエリなどの高価な操作の結果をキャッシュし、複数のリクエスト間で再利用するために使用できる実験的なAPIです。

\`\`\`tsx title="app/utils.ts"
import { unstable_cache } from 'next/cache'

export const getCachedUser = unstable_cache(
  async (id: string) => {
    const user = await db.user.findUnique({ id })
    return user
  },
  ['user-cache'],
  { revalidate: 3600, tags: ['users'] }
)
\`\`\`

\`\`\`tsx title="app/page.tsx"
import { getCachedUser } from '@/app/utils'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getCachedUser(params.id)
  return <div>{user.name}</div>
}
\`\`\`

> **警告**: このAPIは不安定であり、将来変更される可能性があります。安定した場合、移行パスと使用ガイダンスを提供します。

詳細については、[\`unstable_cache\` API reference](/docs/app/api-reference/functions/unstable_cache)を参照してください。

## \`unstable_noStore\`

\`unstable_noStore\`は、静的レンダリングから宣言的にオプトアウトし、特定のコンポーネントをキャッシュしてはならないことを示すために使用できます。

\`\`\`tsx title="app/page.tsx"
import { unstable_noStore as noStore } from 'next/cache'

export default async function Page() {
  noStore()
  const data = await fetch('https://api.vercel.app/blog')
  // ...
}
\`\`\`

> **知っておくと良いこと**:
>
> - \`unstable_noStore\`は、\`fetch\`で\`cache: 'no-store'\`を使用するのと同等です
> - \`unstable_noStore\`は、\`export const dynamic = 'force-dynamic'\`よりも推奨されます。これは、より粒度が細かく、コンポーネントごとに使用できるためです

詳細については、[\`unstable_noStore\` API reference](/docs/app/api-reference/functions/unstable_noStore)を参照してください。

## \`revalidateTag\`

\`revalidateTag\`を使用すると、特定のキャッシュタグのデータを必要に応じてパージできます。これは、データを更新し、古いキャッシュデータを再フェッチしたい場合に便利です。

\`fetch\`リクエストまたは\`unstable_cache\`にタグを追加できます：

\`\`\`tsx title="app/page.tsx"
// fetch を使用してタグを追加
const data = await fetch('https://api.vercel.app/blog', {
  next: { tags: ['posts'] },
})
\`\`\`

\`\`\`tsx title="app/utils.ts"
// unstable_cache を使用してタグを追加
import { unstable_cache } from 'next/cache'

const getCachedPosts = unstable_cache(
  async () => {
    return await db.posts.findMany()
  },
  ['posts'],
  { tags: ['posts'] }
)
\`\`\`

その後、[Server Action](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)または[Route Handler](/docs/app/building-your-application/routing/route-handlers)で\`revalidateTag\`を使用できます：

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export async function updatePost() {
  // データを更新
  revalidateTag('posts')
}
\`\`\`

詳細については、[\`revalidateTag\` API reference](/docs/app/api-reference/functions/revalidateTag)を参照してください。

## \`revalidatePath\`

\`revalidatePath\`を使用すると、特定のパスのデータを必要に応じてパージできます。これは、手動でデータを再検証したい場合に便利です。

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export async function updatePost() {
  // データを更新
  revalidatePath('/posts')
}
\`\`\`

詳細については、[\`revalidatePath\` API reference](/docs/app/api-reference/functions/revalidatePath)を参照してください。

### \`revalidatePath\` vs. \`router.refresh\`

\`router.refresh\`を呼び出すと、ルーターキャッシュがクリアされ、データキャッシュや完全なルートキャッシュを無効にすることなく、サーバー上のルートセグメントが再レンダリングされます。

違いは、\`revalidatePath\`がデータキャッシュと完全なルートキャッシュをパージするのに対し、\`router.refresh()\`はクライアント側のAPIであるため、データキャッシュと完全なルートキャッシュを変更しないことです。

## 動的関数

\`cookies\`および\`headers\`などの動的関数、およびPages内の\`searchParams\`プロパティは、ランタイムの受信リクエスト情報に依存します。これらを使用すると、ルートは静的レンダリングからオプトアウトされます。つまり、ルートは動的にレンダリングされます。

### \`cookies\`

Server ActionsまたはRoute Handlersで\`cookies\`を使用すると、ルートは動的レンダリングにオプトインされます。

\`\`\`tsx title="app/page.tsx"
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')
  return <div>Theme: {theme?.value}</div>
}
\`\`\`

詳細については、[\`cookies\` API reference](/docs/app/api-reference/functions/cookies)を参照してください。

### \`headers\`

Server ComponentsまたはServer Actionsで\`headers\`を使用すると、ルートは動的レンダリングにオプトインされます。

\`\`\`tsx title="app/page.tsx"
import { headers } from 'next/headers'

export default async function Page() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')
  return <div>User Agent: {userAgent}</div>
}
\`\`\`

詳細については、[\`headers\` API reference](/docs/app/api-reference/functions/headers)を参照してください。

### \`searchParams\`

Pagesで[\`searchParams\`](/docs/app/api-reference/file-conventions/page#searchparams-optional) propを使用すると、ページは動的レンダリングにオプトインされます。

\`\`\`tsx title="app/page.tsx"
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>
}) {
  const params = await searchParams
  const query = params.query
  return <div>Search Query: {query}</div>
}
\`\`\`

詳細については、[\`searchParams\` API reference](/docs/app/api-reference/file-conventions/page#searchparams-optional)を参照してください。

## 高度なパターン

### 時間ベースの再検証と必要に応じた再検証の組み合わせ

時間ベースの再検証と必要に応じた再検証を組み合わせて、両方の長所を活用できます：

- 時間ベースの再検証を使用して、データが頻繁に変更されない場合でも、定期的に再フェッチします
- 必要に応じた再検証を使用して、データが変更されたときに即座にキャッシュをパージします

\`\`\`tsx title="app/page.tsx"
export default async function Page() {
  // 1時間ごとに再検証
  const data = await fetch('https://api.vercel.app/blog', {
    next: { revalidate: 3600, tags: ['posts'] },
  })

  return <div>{/* データを表示 */}</div>
}
\`\`\`

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

// データが変更されたときに手動で再検証
export async function updatePost() {
  // データを更新
  revalidateTag('posts')
}
\`\`\`

### 複数のタグを使用したキャッシュ管理

より複雑なキャッシュ戦略の場合、複数のタグを使用できます：

\`\`\`tsx title="app/page.tsx"
const data = await fetch('https://api.vercel.app/blog', {
  next: { tags: ['posts', 'featured'] },
})
\`\`\`

その後、これらのタグのいずれかを再検証できます：

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export async function updatePost() {
  revalidateTag('posts')
}

export async function updateFeaturedPost() {
  revalidateTag('featured')
}
\`\`\`

## トラブルシューティング

### ローカル開発でキャッシュされたデータがデバッグされない

ローカル開発では、キャッシュは開発サーバーの再起動間で保持されません。これにより、開発中にキャッシュをクリアする場合に役立ちます。

### キャッシュされたデータの検証

Next.js DevToolsを使用して、キャッシュされたデータを検査およびデバッグできます。

### 再検証が期待どおりに機能していることを確認する

再検証が機能していることを確認するには、アプリケーションをビルド（\`next build\`）してから本番サーバー（\`next start\`）で実行することをお勧めします。これにより、本番環境でのキャッシング動作をテストできます。

## 例

### 必要に応じた再検証

必要に応じた再検証の例：

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  // データベースに投稿を作成
  // ...
  
  // 'posts' タグでキャッシュを再検証
  revalidateTag('posts')
}
\`\`\`

### パス全体の再検証

パス全体の再検証の例：

\`\`\`tsx title="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export async function updatePost() {
  // データベースの投稿を更新
  // ...
  
  // /posts パスを再検証
  revalidatePath('/posts')
}
\`\`\`

### セグメント設定オプションを使用したキャッシング

セグメント設定オプションを使用してキャッシング動作を設定する例：

\`\`\`tsx title="app/page.tsx"
// このページ内のすべてのfetchリクエストは最大1時間ごとに再検証されます
export const revalidate = 3600

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  return <div>{/* データを表示 */}</div>
}
\`\`\`

## まとめ

Next.jsは、キャッシングと再検証のための複数のAPIを提供します：

- **\`fetch\`**: データフェッチのキャッシングと再検証
- **\`unstable_cache\`**: 計算結果のキャッシング
- **\`revalidateTag\`**: タグベースの再検証
- **\`revalidatePath\`**: パスベースの再検証
- **動的関数**: 動的レンダリングのオプトイン

これらのAPIを組み合わせて、アプリケーションのパフォーマンスを最適化し、最新のデータを提供できます。

詳細については、Next.jsの[キャッシング](/docs/app/building-your-application/caching)ドキュメントを参照してください。
