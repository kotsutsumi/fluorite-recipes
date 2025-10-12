# レイアウトとページ

Next.jsは**ファイルシステムベースのルーティング**を使用しており、\`app\`ディレクトリ内のフォルダとファイルを使用してルートが作成されます。

このページでは、Next.jsアプリケーションでページとレイアウトを作成および管理する方法を学びます。

## ページ

ページは、特定のルートにレンダリングされるUIです。ページを作成するには、\`app\`ディレクトリに\`page.js\`ファイルを追加します。

たとえば、最初のページを作成するには、\`app\`ディレクトリ内に\`page.tsx\`ファイルを追加し、Reactコンポーネントをエクスポートします：

\`\`\`tsx title="app/page.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
\`\`\`

## レイアウト

レイアウトは、複数のページ間で共有されるUIです。ナビゲーション時に、レイアウトは状態を保持し、インタラクティブなままで、再レンダリングされません。

レイアウトを作成するには、\`layout.js\`ファイルからReactコンポーネントをデフォルトエクスポートします。コンポーネントは、レンダリング中に子レイアウト（存在する場合）またはページで埋められる\`children\`プロパティを受け入れる必要があります。

例えば、以下のレイアウトは\`/dashboard\`と\`/dashboard/settings\`ページで共有されます：

\`\`\`tsx title="app/dashboard/layout.tsx"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {/* ここに共有UIを含める（例：ヘッダーやサイドバー） */}
      <nav></nav>
      {children}
    </section>
  )
}
\`\`\`

### ルートレイアウト（必須）

ルートレイアウトは\`app\`ディレクトリのトップレベルで定義され、すべてのルートに適用されます。このレイアウトは**必須**であり、\`html\`タグと\`body\`タグを含める必要があります。これにより、サーバーから返される初期HTMLを変更できます。

\`\`\`tsx title="app/layout.tsx"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {/* レイアウトUIを含む */}
        <main>{children}</main>
      </body>
    </html>
  )
}
\`\`\`

### ネストされたレイアウト

フォルダ内で定義されたレイアウト（例：\`app/dashboard/layout.js\`）は、特定のルートセグメント（例：\`acme.com/dashboard\`）に適用され、それらのセグメントがアクティブなときにレンダリングされます。

デフォルトでは、ファイル階層内のレイアウトは**ネスト**されており、これは\`children\`プロパティを介して子レイアウトをラップすることを意味します。

\`\`\`tsx title="app/dashboard/layout.tsx"
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
\`\`\`

上記の2つのレイアウトを組み合わせると、ルートレイアウト（\`app/layout.js\`）がダッシュボードレイアウト（\`app/dashboard/layout.js\`）をラップし、ダッシュボードレイアウトが\`app/dashboard/*\`内のルートセグメントをラップします。

> **知っておくと良いこと**:
>
> - レイアウトには\`.js\`、\`.jsx\`、または\`.tsx\`ファイル拡張子を使用できます。
> - ルートレイアウトのみが\`<html>\`および\`<body>\`タグを含めることができます。
> - \`layout.js\`と\`page.js\`ファイルが同じフォルダに定義されている場合、レイアウトがページをラップします。
> - レイアウトはデフォルトで[Server Components](/docs/app/building-your-application/rendering/server-components)ですが、[Client Component](/docs/app/building-your-application/rendering/client-components)として設定することもできます。
> - レイアウトはデータをフェッチできます。詳細については[Data Fetching](/docs/app/building-your-application/data-fetching)セクションを参照してください。
> - 親レイアウトとその子の間でデータを渡すことはできません。ただし、ルート内で同じデータを複数回フェッチでき、Reactは自動的にリクエストを[重複排除](/docs/app/building-your-application/caching#request-memoization)してパフォーマンスに影響を与えません。
> - レイアウトは、その下のルートセグメントにアクセスできません。すべてのルートセグメントにアクセスするには、Client Componentで[\`useSelectedLayoutSegment\`](/docs/app/api-reference/functions/use-selected-layout-segment)または[\`useSelectedLayoutSegments\`](/docs/app/api-reference/functions/use-selected-layout-segments)を使用できます。
> - [Route Groups](/docs/app/building-your-application/routing/route-groups)を使用して、特定のルートセグメントを共有レイアウトに含めたり除外したりできます。
> - [Route Groups](/docs/app/building-your-application/routing/route-groups)を使用して、複数のルートレイアウトを作成できます。[例](/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts)を参照してください。
> - **Pages Routerからの移行:** ルートレイアウトは[\`_app.js\`](/docs/pages/building-your-application/routing/custom-app)および[\`_document.js\`](/docs/pages/building-your-application/routing/custom-document)ファイルを置き換えます。[移行ガイド](/docs/app/building-your-application/upgrading/app-router-migration#migrating-_documentjs-and-_appjs)を参照してください。

## テンプレート

テンプレートは、各子レイアウトまたはページをラップするという点でレイアウトに似ています。ルート全体で持続し、状態を保持するレイアウトとは異なり、テンプレートはナビゲーション時に子ごとに新しいインスタンスを作成します。

これは、ユーザーがテンプレートを共有するルート間を移動するときに、コンポーネントの新しいインスタンスがマウントされ、DOM要素が再作成され、状態が保持**されず**、エフェクトが再同期されることを意味します。

これらの特定の動作が必要な場合があり、テンプレートはレイアウトよりも適切なオプションです。例えば：

- \`useEffect\`（例：ページビューのログ記録）や\`useState\`（例：ページごとのフィードバックフォーム）に依存する機能。
- デフォルトのフレームワーク動作を変更する場合。たとえば、レイアウト内のSuspense Boundaryは、レイアウトが最初に読み込まれたときにのみフォールバックを表示し、ページを切り替えるときには表示しません。テンプレートの場合、フォールバックは各ナビゲーションで表示されます。

テンプレートは、\`template.js\`ファイルから\`children\`プロパティを受け入れるReactコンポーネントをエクスポートすることで定義できます。

\`\`\`tsx title="app/template.tsx"
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
\`\`\`

ネストの観点から、\`template.js\`はレイアウトとその子の間にレンダリングされます。簡略化された出力は次のとおりです：

\`\`\`jsx title="Output"
<Layout>
  {/* テンプレートには一意のキーが与えられることに注意してください */}
  <Template key={routeParam}>{children}</Template>
</Layout>
\`\`\`

## メタデータ

\`app\`ディレクトリでは、\`title\`や\`meta\`などの\`<head>\` HTML要素を、[Metadata API](/docs/app/building-your-application/optimizing/metadata)を使用して変更できます。

メタデータは、[\`layout.js\`](/docs/app/api-reference/file-conventions/layout)または[\`page.js\`](/docs/app/api-reference/file-conventions/page)ファイルで[\`metadata\`オブジェクト](/docs/app/api-reference/functions/generate-metadata#metadata-object)または[\`generateMetadata\`関数](/docs/app/api-reference/functions/generate-metadata#generatemetadata-function)をエクスポートすることで定義できます。

\`\`\`tsx title="app/page.tsx"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
  description: 'The React Framework for the Web',
}

export default function Page() {
  return <h1>My Homepage</h1>
}
\`\`\`

> **知っておくと良いこと**: ルートレイアウトに\`<title>\`や\`<meta>\`などの\`<head>\`タグを手動で追加**しないでください**。代わりに、ストリーミングや\`<head>\`要素の重複排除などの高度な要件を自動的に処理する[Metadata API](/docs/app/api-reference/functions/generate-metadata)を使用する必要があります。

利用可能なメタデータオプションの詳細については、[API reference](/docs/app/api-reference/functions/generate-metadata)を参照してください。

## ページ間のリンク

[\`<Link>\`コンポーネント](/docs/app/api-reference/components/link)を使用して、ルート間を移動できます。\`<Link>\`はHTMLの\`<a>\`要素を拡張したNext.jsの組み込みコンポーネントで、[プリフェッチ](/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)とクライアント側のナビゲーションを提供します。

\`<Link>\`を使用するには、\`next/link\`からインポートし、コンポーネントに\`href\`プロパティを渡します：

\`\`\`tsx title="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
\`\`\`

ルート間を移動するために使用できる他のオプションのプロパティがあります。詳細については、[API reference](/docs/app/api-reference/components/link)を参照してください。

## 例

### 動的ルートの作成

動的セグメントを使用して、動的データから複数のページを作成できます。たとえば、ブログ投稿用：

\`\`\`tsx title="app/blog/[slug]/page.tsx"
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  return <div>My Post: {slug}</div>
}
\`\`\`

| ルート                       | 例URL           | \`params\`                     |
| --------------------------- | --------------- | ------------------------------ |
| \`app/blog/[slug]/page.js\` | \`/blog/a\`     | \`Promise<{ slug: 'a' }>\`    |
| \`app/blog/[slug]/page.js\` | \`/blog/b\`     | \`Promise<{ slug: 'b' }>\`    |
| \`app/blog/[slug]/page.js\` | \`/blog/c\`     | \`Promise<{ slug: 'c' }>\`    |

セグメントのページを生成する方法については、[generateStaticParams()](/docs/app/api-reference/functions/generate-static-params)ページを参照してください。

> **知っておくと良いこと**: 動的セグメントは、Pages Routerの[Dynamic Routes](/docs/pages/building-your-application/routing/dynamic-routes)に相当します。

### パターン：動的セグメントを使用してページのリストを作成する

\`\`\`tsx title="app/blog/page.tsx"
import Link from 'next/link'

export default async function Page() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={\`/blog/\${post.slug}\`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
\`\`\`

## 次のステップ

Next.jsでのレイアウトとページの基本を理解したので、次のステップを進めます：

- **[Linking and Navigating](/docs/app/building-your-application/routing/linking-and-navigating)**: Next.jsでナビゲーションがどのように機能するか、およびLinkコンポーネントとuseRouterフックの使用方法を学びます。
- **[Loading UI and Streaming](/docs/app/building-your-application/routing/loading-ui-and-streaming)**: Suspense上に構築されたLoading UIを使用すると、特定のルートセグメントのローディング状態を作成し、準備が整ったらコンテンツを自動的にストリーミングできます。
- **[Error Handling](/docs/app/building-your-application/routing/error-handling)**: React Error Boundariesをルートセグメントとそのネストされた子を自動的にラップすることで、エラーを処理します。
- **[Parallel Routes](/docs/app/building-your-application/routing/parallel-routes)**: 独立してナビゲートできる同じビューで複数のページを同時にレンダリングします。
- **[Intercepting Routes](/docs/app/building-your-application/routing/intercepting-routes)**: インターセプティングルートを使用して、ルートをロードし、別のルートのコンテキストで表示します。
