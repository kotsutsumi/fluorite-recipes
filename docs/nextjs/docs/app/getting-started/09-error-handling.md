# エラー処理

エラーは、**期待されるエラー**または**キャッチされない例外**の2つのカテゴリに分類できます：

- **期待されるエラー**: 通常の操作中に予期されるエラー（サーバー側のフォーム検証や失敗したリクエストなど）をモデル化します。これらのエラーは明示的に処理し、クライアントに返す必要があります。
- **キャッチされない例外**: バグや、通常のアプリケーションフローの一部として処理すべきではない問題を表す予期しないエラーです。これらはエラー境界を使用して処理する必要があります。

このページでは、Next.jsでこれらのエラーを処理する方法について説明します。

## 期待されるエラーの処理

期待されるエラーは、正常なアプリケーション操作中に発生することが予想されるものです（サーバー側のフォーム検証の失敗など）。これらのエラーは明示的に処理し、クライアントに返す必要があります。

### Server Actionsからの期待されるエラーの処理

[\`useActionState\`](https://react.dev/reference/react/useActionState)フック（以前は\`useFormState\`として知られていました）を使用して、Server Actionsからのエラーを管理し、ユーザーにフィードバックを表示します。このアプローチは、エラーをクライアント側のJavaScriptを無効にした状態で機能させるために\`try/catch\`ブロックを避け、プログレッシブエンハンスメントを維持します。

\`\`\`tsx title="app/actions.ts"
'use server'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string

  try {
    const res = await fetch('https://api.vercel.app/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })

    const json = await res.json()

    if (!res.ok) {
      return { message: json.message || 'Failed to create post' }
    }

    return { message: 'Post created successfully' }
  } catch (error) {
    return { message: 'An unexpected error occurred' }
  }
}
\`\`\`

次に、Client Componentから\`useActionState\`フックを使用してServer Actionを呼び出し、エラーメッセージを表示します：

\`\`\`tsx title="app/ui/form.tsx"
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

export function Form() {
  const [state, formAction] = useActionState(createPost, { message: '' })

  return (
    <form action={formAction}>
      <input type="text" name="title" />
      <textarea name="content" />
      <button type="submit">Create Post</button>
      {state.message && <p>{state.message}</p>}
    </form>
  )
}
\`\`\`

> **知っておくと良いこと**: これらの例は、Reactの\`useActionState\`フックを使用しており、Next.js App Routerと統合されています。React 19以前を使用している場合は、代わりに\`useFormState\`を使用してください。詳細については、[Reactドキュメント](https://react.dev/reference/react/useActionState)を参照してください。

また、返されたオブジェクトを使用して、Client Componentから[楽観的更新](/docs/app/building-your-application/data-fetching/server-actions-and-mutations#optimistic-updates)を表示することもできます。

### Server Componentsからの期待されるエラーの処理

Server Component内でデータをフェッチする際に、レスポンスを使用してエラーメッセージを条件付きでレンダリングしたり、[\`redirect\`](/docs/app/building-your-application/routing/redirecting#redirect-function)したりできます。

\`\`\`tsx title="app/page.tsx"
export default async function Page() {
  const res = await fetch(\`https://...\`)
  const data = await res.json()

  if (!res.ok) {
    return <div>エラーが発生しました。</div>
  }

  return <div>{/* ... */}</div>
}
\`\`\`

### \`notFound\`関数

[\`notFound\`](/docs/app/api-reference/functions/not-found)関数を使用すると、リソースが存在しない場合に404エラーとNot Found UIをレンダリングできます。

\`\`\`tsx title="app/blog/[slug]/page.tsx"
import { notFound } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <div>{post.title}</div>
}
\`\`\`

\`\`\`tsx title="app/blog/[slug]/not-found.tsx"
export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>The post you are looking for does not exist.</p>
    </div>
  )
}
\`\`\`

\`notFound\`関数の詳細については、[\`notFound\` API reference](/docs/app/api-reference/functions/not-found)を参照してください。

## キャッチされない例外の処理

キャッチされない例外は、通常のアプリケーションフローの一部として処理すべきではないバグや問題を示す予期しないエラーです。これらは、エラーをスローし、エラー境界でキャッチすることで処理する必要があります。

- **一般的**: ルートレイアウトの下のキャッチされないエラーは、ルート\`error.js\`で処理されます。
- **粒度の細かい**: ネストされた\`error.js\`ファイルを使用して、キャッチされないエラーをより粒度の細かい方法で処理します（例：\`app/dashboard/error.js\`）。
- **一般的でない**: ルートレイアウトでのキャッチされないエラーは、\`global-error.js\`で処理されます。

### ネストされたルートでのエラー境界の使用

Next.jsは、エラーを処理するために[エラー境界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)を使用します。エラー境界は、子コンポーネントのキャッチされない例外をキャッチし、クラッシュしたコンポーネントツリーの代わりにフォールバックUIを表示します。

ルートセグメント内に\`error.tsx\`ファイルを追加し、Reactコンポーネントをエクスポートすることで、エラー境界を作成します：

\`\`\`tsx title="app/dashboard/error.tsx"
'use client' // エラー境界はClient Componentsである必要があります

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをエラーレポートサービスにログ記録
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // セグメントを再レンダリングしようとすることで回復を試みる
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
\`\`\`

\`error.tsx\`が機能する場合、ネストされたルートのレイアウトとテンプレートは状態を**維持**し、インタラクティブなままになります。エラーコンポーネントは、エラーから回復するための機能を表示できます。

### \`error.js\`の動作

<Image
  alt="error.jsの動作"
  srcLight="/docs/light/error-special-file.png"
  srcDark="/docs/dark/error-special-file.png"
  width="1600"
  height="606"
/>

- \`error.js\`は、ネストされた子セグメントまたは\`page.js\`コンポーネントをラップする[Reactエラー境界](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)を自動的に作成します。
- \`error.js\`ファイルからエクスポートされたReactコンポーネントが**フォールバック**コンポーネントとして使用されます。
- エラー境界内でエラーがスローされた場合、エラーが**含まれ**、フォールバックコンポーネントが**レンダリング**されます。
- フォールバックエラーコンポーネントがアクティブな場合、エラー境界の**上**のレイアウトは状態を**維持**し、インタラクティブなままになり、エラーコンポーネントはエラーから回復するための機能を表示できます。

### エラーからの回復

エラーの原因は一時的なものである場合があります。これらのケースでは、単に再試行するだけで問題が解決する場合があります。

エラーコンポーネントは、\`reset()\`関数を使用して、ユーザーにエラーからの回復を試みるよう促すことができます。実行されると、関数はエラー境界のコンテンツを再レンダリングしようとします。成功すると、フォールバックエラーコンポーネントは再レンダリングの結果に置き換えられます。

\`\`\`tsx title="app/dashboard/error.tsx"
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
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
\`\`\`

### ネストされた\`error.js\`

エラーは、最も近い親エラー境界に[バブルアップ](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)します。これにより、ルートセグメント階層の異なるレベルに\`error.js\`ファイルを配置することで、粒度の細かいエラー処理が可能になります。

<Image
  alt="ネストされたエラー境界"
  srcLight="/docs/light/nested-error-component-hierarchy.png"
  srcDark="/docs/dark/nested-error-component-hierarchy.png"
  width="1600"
  height="687"
/>

### \`layout.js\`でのエラーの処理

\`error.js\`境界は、**同じセグメント**の\`layout.js\`または\`template.js\`コンポーネントでスローされたエラーをキャッチ**しません**。この[意図的な階層](#error-jsの動作)により、エラーが発生したときに兄弟ルート間で共有される重要なUI（ナビゲーションなど）が表示され、機能し続けることができます。

特定のレイアウトまたはテンプレート内のエラーを処理するには、レイアウトの親セグメントに\`error.js\`ファイルを配置します。

ルートレイアウトまたはテンプレート内のエラーを処理するには、\`error.js\`のバリエーションである\`global-error.js\`を使用します。

### ルートレイアウトでのエラーの処理

ルート\`app/error.js\`境界は、ルート\`app/layout.js\`または\`app/template.js\`コンポーネントでスローされたエラーをキャッチ**しません**。

これらのルートコンポーネントのエラーを具体的に処理するには、ルート\`app\`ディレクトリに配置される\`app/global-error.js\`という\`error.js\`のバリエーションを使用します。

ルート\`error.js\`とは異なり、\`global-error.js\`エラー境界は**アプリケーション全体**をラップし、そのフォールバックコンポーネントはアクティブ時にルートレイアウトを置き換えます。このため、\`global-error.js\`は独自の\`<html>\`および\`<body>\`タグを定義する**必要があります**。

\`global-error.js\`は最も粒度の粗いエラーUIであり、アプリケーション全体の「キャッチオール」エラー処理と見なすことができます。ルートコンポーネントは通常あまり動的ではなく、他の\`error.js\`境界がほとんどのエラーをキャッチするため、頻繁にトリガーされる可能性は低いです。

\`global-error.js\`が定義されている場合でも、グローバルに共有されるUIとブランディングを含むルートレイアウト**内**でレンダリングされるフォールバックコンポーネントを持つルート\`error.js\`を定義することをお勧めします。

\`\`\`tsx title="app/global-error.tsx"
'use client' // グローバルエラーコンポーネントはClient Componentsである必要があります

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    // global-error は html と body タグを定義する必要があります
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
\`\`\`

> **知っておくと良いこと**:
>
> - \`global-error.js\`は本番環境でのみ有効です。開発環境では、代わりにエラーオーバーレイが表示されます。

### Server Errorsの処理

Server Component内でエラーがスローされた場合、Next.jsは\`Error\`オブジェクト（本番環境では機密エラー情報を削除）を最も近い\`error.js\`ファイルに\`error\`プロパティとして転送します。

#### 機密エラー情報の保護

本番環境では、クライアントに転送される\`Error\`オブジェクトには、一般的な\`message\`と\`digest\`プロパティのみが含まれます。

これは、エラーに含まれる潜在的に機密情報がクライアントに漏れるのを防ぐためのセキュリティ上の予防措置です。

\`message\`プロパティには、エラーに関する一般的なメッセージが含まれ、\`digest\`プロパティには、サーバー側ログの対応するエラーと一致させるために使用できる、エラーの自動生成されたハッシュが含まれます。

開発環境では、クライアントに転送される\`Error\`オブジェクトはシリアライズされ、元のエラーの\`message\`が含まれ、デバッグが容易になります。

## 次のステップ

Next.jsでのエラー処理の基本を理解したので、次のステップを進めます：

- **[Loading UI and Streaming](/docs/app/building-your-application/routing/loading-ui-and-streaming)**: ローディング状態とストリーミングについて学びます。
- **[Metadata](/docs/app/building-your-application/optimizing/metadata)**: SEOのためのメタデータを設定する方法を学びます。
