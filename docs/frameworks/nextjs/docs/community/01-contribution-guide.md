# ドキュメントへの貢献

このガイドは、[Next.jsのドキュメント](https://nextjs.org/docs)への貢献方法をカバーしています。

## なぜ貢献するのか？

オープンソースの作業は決して終わりがなく、ドキュメント作業も同様です。ドキュメントへの貢献は、初心者がオープンソースに関与する方法であり、経験豊富な開発者がより複雑なトピックを明確にし、コミュニティと知識を共有する方法です。

Next.jsのドキュメントに貢献することで、すべての人にとってより堅牢な学習リソースを構築するのに役立ちます。バグを見つけた場合、新しい機能についての混乱、または重要な使用例のための推奨事項がない場合は、ドキュメントへの貢献を検討してください。

## 貢献方法

ドキュメントのコンテンツは、[Next.jsリポジトリ](https://github.com/vercel/next.js/tree/canary/docs)にあります。貢献するには:

- [GitHub](https://github.com/vercel/next.js)でファイルを直接編集
- リポジトリをクローンし、ローカルで編集し、プルリクエストを提出

## ファイル構造

ドキュメントは、ファイルシステムルーティングを使用します。[`/docs`](https://github.com/vercel/next.js/tree/canary/docs)内の各フォルダとファイルはルートセグメントを表します。これらのセグメントは、URL パス、ナビゲーション、およびパンくずリストを生成するために使用されます。

ファイル構造は、サイトに表示されるナビゲーションを反映しており、デフォルトでは、ナビゲーション項目はアルファベット順にソートされます。ただし、フォルダまたはファイル名にプレフィックス`数字`を付けることで、ページの順序を変更できます。

例えば、[functions API reference](/docs/app/api-reference/functions)では、ページはアルファベット順にソートされます。なぜなら、すべてを学ぶことよりもこのセクションで特定のAPIを見つけることが重要だからです:

```txt
03-functions
├── cookies
├── draft-mode
├── fetch
├── generate-image-metadata
├── generate-metadata
├── generate-sitemaps
└── ...
```

ただし、[routing section](/docs/app/building-your-application/routing)では、ファイルに`2桁の数字`がプレフィックスされ、推奨される学習順序でソートされます:

```txt
02-routing
├── 01-defining-routes.mdx
├── 02-layouts-and-templates.mdx
├── 03-linking-and-navigating.mdx
├── 04-route-groups.mdx
└── ...
```

ページをすばやく見つけるには、`CMD+P`（または`CTRL+P`）を使用してVS Codeの検索バーを開きます。次に、検索しているページのスラッグを入力します。例: `defining-routes`。

> **なぜ2桁の数字を使用するのか？**
>
> あなたは1桁の数字、例えば`1-defining-routes.mdx`でもページを順序付けることができることに気づいたかもしれません。単一桁の数字を使用することをお勧めしません。なぜなら、10個を超えるページがあるセクションでは、それらをソートすることが難しくなります。

### セクション

ドキュメントは主に2つのセクションに分かれています: **App Router**と**Pages Router**。

- [**App Router**](https://github.com/vercel/next.js/tree/canary/docs/01-app): `/app`サブフォルダに属するファイルはすべて**App Router**セクションに属します。このセクションでは、Next.jsのほとんどの機能のドキュメントが作成されています。
- [**Pages Router**](https://github.com/vercel/next.js/tree/canary/docs/02-pages): `/pages`サブフォルダに属するファイルはすべて**Pages Router**セクションに属します。このセクションのドキュメントは、Pages Routerに固有の機能のためのものです。

> **知っておくと良いこと:** 将来、ドキュメントは段階的にバージョン管理されます。

## メタデータ

各ページには、説明的なタイトルと説明を含む3つのダッシュで区切られた、ファイルの上部にメタデータブロックがあります。

```yaml filename="required-file.mdx"
---
title: ページタイトル
description: ページの説明
---
```

より良い検索エンジン最適化（SEO）のために、タイトルは60文字以下、説明は160文字以下に保ってください。

タイトルと説明を書く際に考慮すべき追加の（オプションの）フィールドと推奨事項があります:

```yaml filename="required-file.mdx"
---
title: ページタイトル（60文字以下で、SEOのためのキーワードを含む）
description: ページの説明（160文字以下、SEOのためのキーワードを含む）
related:
  description: 関連ページの説明（オプション、表示される場合は20文字未満が理想）
  links:
    - app/building-your-application/routing/defining-routes
    - app/building-your-application/data-fetching/caching
---
```

`related`フィールドは、ページの下部に関連ページへのリンクを表示するために使用されます。リンクはドキュメントのルートに相対的であり、`.mdx`拡張子を含みません。リンクは順番にレンダリングされます。

## 文章スタイル

このセクションには、ドキュメントを書くためのいくつかのガイドラインが含まれています。MDX固有の構文、コードブロックスタイル、および私たちのVS Code設定などのトピックに入る前に、明確で一貫した声とスタイルを作成するための一般的なライティング原則から始めます。

### ページタイプ

ページは、ドキュメントと参照ページの2つのタイプがあります。

- **ドキュメントページ**は、概念や機能を説明する教育的なページです。通常、ページは機能を使用するタイミングと理由、およびステップバイステップの説明が含まれています。このタイプのページの目標は、ユーザーがその機能を理解するのを助けることです。そのため、コード例よりも説明やガイダンスに焦点を当てる必要があります。たとえば、[Layouts and Templates](/docs/app/building-your-application/routing/layouts-and-templates)ページはドキュメントページです。
- **参照ページ**はAPIを説明し、関数やメソッド、パラメータ、戻り値の使用方法についてガイダンスを提供するページです。このタイプのページは、ユーザーが特定のAPIを使用する際に迅速に必要な情報を見つけるのに役立つことを目的としています。そのため、より簡潔で、コード例により焦点を当てる必要があります。たとえば、[`<Link>` API Reference](/docs/app/api-reference/components/link)ページは参照ページです。

ページのタイプがわからない場合、次のヒューリスティックが役立つかもしれません:

- ユーザーは、ドキュメントページを_読み_、参照ページを_スキャン_します。
- ドキュメントページは教育的であり、参照ページは実用的です。
- ドキュメントページは、ページ間でより構造化されていない場合があり、参照ページはフォーマットが一貫している必要があります。
- 機能は、ドキュメントページと参照ページの両方を持つことができます。

> **例:** The `<Link>` component has a [doc page](/docs/app/building-your-application/routing/linking-and-navigating#link-component) and an [API reference page](/docs/app/api-reference/components/link).

### 声とトーン

以下は、ドキュメントを書くための推奨事項です:

- **簡潔であること**: 文を明確で簡潔にしてください。冗長な単語を削除し、冗長性を削除してください。文は15-20語を超えない必要があります（可能な限り）。例えば:
  - _不要な単語を削除_: 「Nextjsを使用するためには、Node.jsがインストールされていることを確認する必要があります」→ 「Node.jsをインストールしてください」
  - _冗長性を削除_: 「その後、次に」→ 「次に」。
  - _受動態を削除_: 「ページはサーバーによってレンダリングされます」→ 「サーバーはページをレンダリングします」。
- **具体的であること**: 主題を説明する際に、できるだけ具体的であること。例えば:
  - _「たとえば」を使用する代わりに、実際の例を提供する_: 「たとえば、メタデータオブジェクトは、ページにタイトルと説明を追加するために使用できます」→ 「次のようにメタデータオブジェクトを使用して、ページにタイトルと説明を追加できます: `export const metadata = { title: '...', description: '...' }`」。
  - _あいまいな単語を避ける_: 「最近」、「いくつか」、「いくつかの」、「多くの」、「速い」、「遅い」、「大きい」、「小さい」、「簡単」、「難しい」、「シンプル」、「複雑」、「速い」、「遅い」、など。
- **アクティブボイスを使用する**: アクティブボイスは、読者が誰が何をしているかを理解するのに役立ちます。例えば、「メタデータオブジェクトはサーバーによって使用されます」ではなく、「サーバーはメタデータオブジェクトを使用します」と言います。
- **読者に直接話しかける**: Next.jsドキュメントは会話型であり、読者に直接話しかけ、**あなた**と**あなたの**を使用します。例えば、「開発者は...」ではなく、「あなたは...」と言います。
- **命令的であること**: ユーザーにアクションを実行するよう指示する際は命令的であること。例えば、「あなたは...することができます」ではなく、「次のコマンドを実行してください」と言います。ただし、「これをする必要があります」または「これをしなければなりません」と言うのを避けてください。これはあまりにも命令的です。
- **否定的な言葉を避ける**: 「しない」、「しない」、「しない」、「できない」などの否定的な言葉を避けてください。例えば、「あなたは`Link`コンポーネントを使用すべきではありません」ではなく、「`Link`コンポーネントを使用することをお勧めします」と言います。
- **性別中立的な言葉を使用する**: 「彼」、「彼女」、「彼の」、「彼女の」などの性別的な言葉を使用しないでください。代わりに、「彼ら」、「彼らの」、「彼ら」を使用してください。

## コードブロック

コードブロックには、構文ハイライト、ライン番号、ラインハイライト、ファイル名など、さまざまな機能があります。コードブロックを使用する際に覚えておくべきいくつかのベストプラクティスを以下に示します。

### ベストプラクティス

- **最小の作業例を提供する**: コードブロックは、最小限の作業例を提供する必要があります。これは、ユーザーが実行できるコードであり、理解するために追加のコンテキストを必要としないことを意味します。不必要なボイラープレートコードを省略し、関連する部分に焦点を当てます。例えば、インポートが理解のために明確に関連している場合のみ、インポート文を含めます。
- **言語を指定する**: 言語を常に指定してください。これにより、構文ハイライトが有効になります。

````mdx filename="example.mdx"
```tsx filename="app/page.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```
````

- **TypeScriptの使用**: TypeScriptはデフォルトで使用してください。純粋なReact/Next.js機能の場合は`.tsx`、npmパッケージのインストール、ファイル構造の表示などの場合は`.ts`を使用してください。

````mdx filename="example.mdx"
```bash filename="Terminal"
npx create-next-app
```

```txt filename="Example text file"
この例のテキストファイルは、
構文ハイライトなしでレンダリングされます。
```
````

- **ファイル名の追加**: コードブロックには、ファイル名を追加してください。これにより、ユーザーがコードをどこに配置するかを理解するのに役立ちます。例えば:

````mdx filename="example.mdx"
```tsx filename="app/page.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```
````

- **ラインハイライト**: 特定のコードラインの注意を引くためにラインハイライトを使用してください。ラインを強調表示するには、`highlight`属性を使用し、強調表示するライン番号を渡します。例えば:
  - 単一ライン: `highlight={1}`
  - 複数ライン: `highlight={1,3}`
  - ライン範囲: `highlight={1-5}`

````mdx filename="example.mdx"
```tsx filename="app/page.tsx" highlight={1}
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```
````

### コードサンプル

高度なユースケースでは、コードブロック全体を`<AppOnly>`、`<PagesOnly>`、または`<CrossRuntimeWarning>`タグで囲むことができます。これは、App RouterまたはPages Routerに固有のコードサンプルに役立ちます。例えば:

````mdx filename="example.mdx"
<AppOnly>

```tsx filename="app/page.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

</AppOnly>
````

**App RouterまたはPages Router**間で同じ概念を文書化している場合は、`<Tabs>`コンポーネントを使用できます。これにより、ユーザーがApp RouterとPages Routerコードの例の間を簡単に切り替えることができます。

````mdx filename="example.mdx"
<Tabs>
<TabItem value="app" label="App Router">

```tsx filename="app/page.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

</TabItem>
<TabItem value="pages" label="Pages Router">

```tsx filename="pages/index.tsx"
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

</TabItem>
</Tabs>
````

> **知っておくと良いこと:** 各ページのコンテキストスイッチャーはNext.jsのドキュメント全体で保持され、コンテキストスイッチャーの状態はlocalStorageに保存されます。したがって、ユーザーが異なるページに移動すると、彼らの好みのコンテキストは保持されます。

## アイコン

ドキュメント全体でさまざまなアイコンを使用できます。使用するには、ファイルの上部にReact Iconsライブラリからアイコンをインポートしてください:

```mdx filename="example.mdx"
import { ArrowUpCircleIcon } from '@heroicons/react/outline'

<ArrowUpCircleIcon className="h-6 w-6" />
```

## 注意事項

理解するための重要な情報のために`blockquote`構文を使用してください。`>`の後にタイプ（**知っておくと良いこと**、**例**、または**警告**）のいずれかを追加してください。

> **知っておくと良いこと**: これは、読者が知るべき有用な情報です。

> **例**: これは、前述の情報を示す例です。

> **警告**: 読者がアクションを実行する前に知るべき重要な情報（壊れる可能性がある変更など）。

```mdx filename="example.mdx"
> **知っておくと良いこと**: これは、読者が知るべき有用な情報です。

> **例**: これは、前述の情報を示す例です。

> **警告**: 読者がアクションを実行する前に知るべき重要な情報（壊れる可能性がある変更など）。
```

## VS Code

### MDXの作成をより簡単にするための設定

VS Codeでのマークダウン体験を向上させるために、次の設定を追加することをお勧めします:

- [MDX VS Code extension](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx): MDXファイルの構文ハイライト、オートコンプリート、エラーチェックを提供するIntelliSense。
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): 保存時にMDXファイルをフォーマット。
- user-snippets: 一般的なMDXパターンの時間を節約するためのカスタムスニペット。以下は、コードブロック、注意事項、およびApp/Pagesコンポーネントのためのスニペットの例です:

```json filename="mdx.json"
{
  "CodeBlock": {
    "prefix": "```",
    "scope": "mdx",
    "body": ["\\`\\`\\`${1:lang} filename=\"${2:filename}\"", "${3:code}", "\\`\\`\\`"]
  },
  "GoodToKnow": {
    "prefix": "> Good",
    "scope": "mdx",
    "body": ["> **Good to know**: ${1:text}"]
  },
  "PagesOnly": {
    "prefix": "<Pages",
    "scope": "mdx",
    "body": ["<PagesOnly>", "", "${1:content}", "", "</PagesOnly>"]
  },
  "AppOnly": {
    "prefix": "<App",
    "scope": "mdx",
    "body": ["<AppOnly>", "", "${1:content}", "", "</AppOnly>"]
  }
}
```

スニペットを追加するには、VS Codeでコマンドパレット（`CMD+Shift+P`）を開き、「**Configure User Snippets**」を検索し、「**mdx.json**」を選択します。

## GitHub

### プルリクエストのライフサイクル

ドキュメントのすべての更新は、GitHubを通じてプルリクエストとして送信されます:

1. **Open**: プルリクエストを開く際に、質問やコメントを追加するためのテンプレートに記入してください。PRテンプレートは、プルリクエストが承認される前にチェックする必要があるいくつかの質問を含みます。
2. **Triage**: Next.jsチームのメンバーがプルリクエストをトリアージします。小さな更新では、変更は数分以内にライブに移動する場合があります。大きな更新では、レビューとフィードバックに時間がかかる場合があります。
3. **Approval and Merge**: PRが承認されると、Next.jsチームのメンバーがプルリクエストをマージします。自動プロセスは、マージされたプルリクエストを数分以内に[nextjs.org](https://nextjs.org)にデプロイします。

### ガイドライン

プルリクエストを作成する前に、以下のガイドラインが貢献に適用されていることを確認してください:

- 貢献する際には、[ドキュメント文章スタイル](#文章スタイル)に従ってください。
- ライティングメカニクスとベストプラクティスのために[Google Developer Documentation Style Guide](https://developers.google.com/style)を使用してください。
- [Grammarly](https://grammarly.com/)などのツールを使用して、文法や書き間違いをチェックします。簡単な文章を目指してください。長い文や複雑な文を短く、シンプルにしてください。
- 画像やメディアを作成するために[Vercel Design resources](https://vercel.com/design)を使用してください。
- [MDXのプレビュー](https://mdxjs.com/playground/)またはVS Code拡張機能を使用して、MDXが正しくレンダリングされるか確認してください。
- 変更を本番に押す前に、ローカルでドキュメントをテストします。`pnpm dev`をNext.jsリポジトリのルートで実行し、`localhost:3000/docs`に移動します。

このガイドに慣れたら、[初めての貢献を行う](https://github.com/vercel/next.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)準備ができています。

> Next.jsのドキュメントの貢献を作成した後は、[Discord](https://discord.com/invite/bUG2bvbtHy)でコミュニティと共有することを検討してください。

## リソース

- [Vercel Design System](https://vercel.com/geist/introduction)
- [MDX](https://mdxjs.com/)
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
