# Server ComponentsとClient Components

Reactを使用してアプリケーションを構築する際に考慮すべき、アプリケーションのどの部分をサーバーまたはクライアントでレンダリングするかについて理解することが重要です。このページでは、Server ComponentsとClient Componentsの違い、いつ使用するか、および推奨されるパターンについて説明します。

## Server Components

デフォルトでは、Next.jsは**Server Components**を使用します。これにより、追加の設定なしでサーバー上でUIをレンダリングできます。Server Componentsには次のようなメリットがあります：

- **データフェッチ**: Server Componentsを使用すると、データフェッチをサーバーに移動できます。これにより、データソースに近い場所でデータをフェッチできます。これにより、レンダリングに必要なデータのフェッチにかかる時間が短縮され、クライアントが行う必要があるリクエストの数が削減されます。
- **セキュリティ**: Server Componentsを使用すると、トークン、APIキーなどの機密データとロジックを、それらをクライアントに公開するリスクなしにサーバーに保持できます。
- **キャッシング**: サーバーでレンダリングすることで、結果をキャッシュして、後続のリクエストやユーザー間で再利用できます。これにより、各リクエストで実行されるレンダリングとデータフェッチの量が削減され、パフォーマンスが向上し、コストが削減されます。
- **パフォーマンス**: Server Componentsは、ベースラインから始めてパフォーマンスを最適化するための追加のツールを提供します。たとえば、完全にClient Componentsで構成されたアプリから開始する場合、UIの非インタラクティブな部分をServer Componentsに移動することで、クライアント側のJavaScriptの量を削減できます。これは、インターネット速度が遅いデバイスや性能の低いデバイスを使用しているユーザーにとって有益です。ブラウザがダウンロード、解析、実行するクライアント側のJavaScriptが少なくなるためです。
- **初期ページロード速度とFirst Contentful Paint (FCP)**: サーバー上で、クライアントがページをレンダリングするために必要なJavaScriptをダウンロード、解析、実行するのを待つことなく、ユーザーがページをすぐに表示できるようにHTMLを生成できます。
- **検索エンジン最適化とソーシャルネットワーク共有性**: レンダリングされたHTMLは、検索エンジンボットがページをインデックスするために使用でき、ソーシャルネットワークボットがページのソーシャルカードプレビューを生成するために使用できます。
- **ストリーミング**: Server Componentsを使用すると、レンダリング作業をチャンクに分割し、準備ができ次第クライアントにストリーミングできます。これにより、ユーザーは、サーバーでページ全体がレンダリングされるのを待つことなく、ページの一部を早く見ることができます。

## Client Components

Client Componentsを使用すると、アプリケーションにクライアント側のインタラクティビティを追加できます。Next.jsでは、これらはサーバーで[プリレンダリング](/docs/app/building-your-application/rendering/client-components#how-are-client-components-rendered)され、クライアントで[ハイドレート](/docs/app/building-your-application/rendering/client-components#how-are-client-components-rendered)されます。Client Componentsは、Pages Routerのコンポーネントが常に動作してきた方法と考えることができます。

### \`"use client"\`ディレクティブ

\`"use client"\`[ディレクティブ](https://react.dev/reference/rsc/use-client)は、Server ComponentsとClient Componentsの境界を宣言するための規約です。

\`\`\`tsx title="app/counter.tsx"
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
\`\`\`

<Image
  alt="use clientディレクティブとネットワーク境界"
  srcLight="/docs/light/use-client-directive.png"
  srcDark="/docs/dark/use-client-directive.png"
  width="1600"
  height="1320"
/>

\`"use client"\`は、サーバーとクライアントコードの間に位置します。これは、ファイルの最上部、インポートの上に配置され、サーバー専用部分からクライアント部分への境界を越えるカットオフポイントを定義します。ファイルで\`"use client"\`が定義されると、そのファイルにインポートされるすべての子コンポーネントを含む他のすべてのモジュールは、クライアントバンドルの一部と見なされます。

Server Componentsがデフォルトであるため、\`"use client"\`ディレクティブで始まるモジュールで定義またはインポートされない限り、すべてのコンポーネントはServer Component モジュールグラフの一部です。

> **知っておくと良いこと**:
>
> - Server Componentモジュールグラフ内のコンポーネントは、サーバーでのみレンダリングされることが保証されます。
> - Client Componentモジュールグラフ内のコンポーネントは、主にクライアント上でレンダリングされますが、Next.jsでは、サーバーでプリレンダリングし、クライアントでハイドレートすることもできます。
> - \`"use client"\`ディレクティブは、インポートの前に、ファイルの最上部で定義する**必要があります**。
> - \`"use client"\`を**すべてのファイル**で定義する必要はありません。Client モジュールの境界は、「エントリポイント」で一度だけ定義する必要があり、その中にインポートされるすべてのモジュールがClient Componentと見なされます。

## Server ComponentsとClient Componentsを使用する場合

Server ComponentsとClient Componentsの使用例を簡単に要約します：

| 何をする必要があるか？ | Server Component | Client Component |
|---|---|---|
| データをフェッチする | ✓ |  |
| バックエンドリソースに直接アクセスする | ✓ |  |
| 機密情報をサーバーに保持する（アクセストークン、APIキーなど） | ✓ |  |
| サーバー上に大きな依存関係を保持する / クライアント側のJavaScriptを削減する | ✓ |  |
| インタラクティビティとイベントリスナーを追加する（\`onClick()\`、\`onChange()\`など） |  | ✓ |
| 状態とライフサイクル効果を使用する（\`useState()\`、\`useReducer()\`、\`useEffect()\`など） |  | ✓ |
| ブラウザ専用APIを使用する |  | ✓ |
| 状態、効果、またはブラウザ専用APIに依存するカスタムフックを使用する |  | ✓ |
| [React Class components](https://react.dev/reference/react/Component)を使用する |  | ✓ |

## パターン

### コンポーネントツリーの葉に向かってClient Componentsを移動する

アプリケーションのパフォーマンスを向上させるには、可能な限りClient Componentsをコンポーネントツリーの葉に移動することをお勧めします。

たとえば、静的要素（例：ロゴ、リンクなど）を持つLayoutと、状態を使用するインタラクティブな検索バーがある場合があります。

Layout全体をClient Componentにするのではなく、インタラクティブなロジックをClient Component（例：\`<SearchBar />\`）に移動し、LayoutをServer Componentとして保持します。これにより、LayoutのすべてのコンポーネントのコンポーネントのJavaScriptをクライアントに送信する必要がなくなります。

\`\`\`tsx title="app/layout.tsx"
// SearchBarはClient Component
import SearchBar from './searchbar'
// LogoはServer Component
import Logo from './logo'

// LayoutはデフォルトでServer Component
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <SearchBar />
      </nav>
      <main>{children}</main>
    </>
  )
}
\`\`\`

### Server ComponentsとClient Componentsの組み合わせ

Server ComponentsとClient Componentsを同じコンポーネントツリーで組み合わせることができます。

舞台裏では、Reactは次のようにレンダリングを処理します：

- サーバー上で、Reactは、結果をクライアントに送信する**前に**、**すべて**のServer Componentsをレンダリングします。
  - これには、Client Components内にネストされたServer Componentsが含まれます。
  - この段階で遭遇したClient Componentsはスキップされます。
- クライアント上で、ReactはClient Componentsをレンダリングし、Server Componentsのレンダリングされた結果を**スロットイン**し、サーバーとクライアントで実行された作業をマージします。
  - Server ComponentsがClient Component内にネストされている場合、レンダリングされたコンテンツはClient Component内に正しく配置されます。

> **知っておくと良いこと**: Next.jsでは、初期ページロード中、上記のステップのServer ComponentsとClient Componentsのレンダリング結果の両方が、サーバー上で[プリレンダリング](/docs/app/building-your-application/rendering/server-components#how-are-server-components-rendered)されてHTMLになり、初期ページロードを高速化します。

### Client ComponentsにServer Componentsをネストする

上記のレンダリングフローを考えると、Client Component内にServer Componentをインポートすることには制限があります。このアプローチには追加のサーバーラウンドトリップが必要だからです。

#### サポートされていないパターン: Client ComponentへのServer Componentのインポート

次のパターンはサポートされていません。Client ComponentにServer Componentをインポートすることはできません：

\`\`\`tsx title="app/client-component.tsx"
'use client'

// このパターンは機能しません！
// Client ComponentにServer Componentをインポートすることはできません。
import ServerComponent from './Server-Component'

export default function ClientComponent({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ServerComponent />
    </>
  )
}
\`\`\`

#### 推奨パターン: Server ComponentsをプロパティとしてClient Componentsに渡す

代わりに、Client Componentsを設計する際に、React propsを使用してServer Componentsの「スロット」をマークできます。

Server Componentは、サーバー上でレンダリングされ、Client Componentがクライアント上でレンダリングされるときに、「スロット」はServer Componentのレンダリングされた結果で埋められます。

一般的なパターンは、React \`children\`プロパティを使用して「スロット」を作成することです。\`<ClientComponent>\`をリファクタリングして、汎用的な\`children\`プロパティを受け入れ、\`<ClientComponent>\`のインポートとネストを親コンポーネントに移動できます。

\`\`\`tsx title="app/client-component.tsx"
'use client'

import { useState } from 'react'

export default function ClientComponent({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  )
}
\`\`\`

これで、\`<ClientComponent>\`は\`children\`が何であるかについての知識がありません。実際、その観点からは、\`children\`が最終的にServer Componentの結果で埋められることさえ知りません。

\`<ClientComponent>\`の唯一の責任は、\`children\`が最終的に配置される**場所**を決定することです。

親Server Componentでは、\`<ClientComponent>\`と\`<ServerComponent>\`の両方をインポートし、\`<ServerComponent>\`を\`<ClientComponent>\`の子として渡すことができます：

\`\`\`tsx title="app/page.tsx"
// このパターンは機能します：
// Server ComponentをClient Componentの子またはプロパティとして渡すことができます。
import ClientComponent from './client-component'
import ServerComponent from './server-component'

// Next.jsのページはデフォルトでServer Components
export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent />
    </ClientComponent>
  )
}
\`\`\`

このアプローチでは、\`<ClientComponent>\`と\`<ServerComponent>\`は分離されており、独立してレンダリングできます。この場合、子\`<ServerComponent>\`は、\`<ClientComponent>\`がクライアントでレンダリングされるずっと前に、サーバーでレンダリングできます。

> **知っておくと良いこと**:
>
> - 「コンテンツを持ち上げる」パターンは、親コンポーネントが再レンダリングされるときにネストされた子コンポーネントの再レンダリングを回避するために使用されてきました。
> - \`children\`プロパティに限定されません。任意のプロパティを使用してJSXを渡すことができます。

### Server ComponentsからClient Componentsへのプロパティの受け渡し（シリアライゼーション）

Server ComponentsからClient Componentsに渡されるプロパティは、[シリアライズ可能](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values)である必要があります。これは、関数、日付などの値をClient Componentsに直接渡すことができないことを意味します。

> **ネットワーク境界はどこですか？**
>
> App Routerでは、ネットワーク境界はServer ComponentsとClient Componentsの間にあります。これは、\`getStaticProps\`/\`getServerSideProps\`とPage Componentsの間に境界があるPagesとは異なります。Server Components内でフェッチされたデータは、Client Componentsに渡されない限り、ネットワーク境界を越えないため、シリアライズする必要はありません。Server Componentsでの[データフェッチ](/docs/app/building-your-application/data-fetching#fetching-data-on-the-server)について詳しく学びましょう。

### Server専用コードをClient Components（ポイゾニング）から除外する

JavaScriptモジュールはServer ComponentsとClient Componentsの両方で共有できるため、サーバー上でのみ実行されることを意図したコードがクライアントに忍び込む可能性があります。

たとえば、次のデータフェッチ関数を考えてみましょう：

\`\`\`ts title="lib/data.ts"
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
\`\`\`

一見すると、\`getData\`はサーバーとクライアントの両方で動作するように見えます。しかし、この関数には\`API_KEY\`が含まれており、サーバー上でのみ実行されることを意図して書かれています。

環境変数\`API_KEY\`には\`NEXT_PUBLIC\`がプレフィックスされていないため、これはサーバー上でのみアクセスできるプライベート変数です。環境変数がクライアントに漏れるのを防ぐため、Next.jsはプライベート環境変数を空の文字列に置き換えます。

その結果、\`getData()\`をクライアントでインポートして実行できますが、期待どおりに動作しません。変数を公開すると、関数はクライアントで動作しますが、機密情報をクライアントに公開したくない場合があります。

サーバーコードの意図しないクライアント使用を防ぐために、\`server-only\`パッケージを使用して、これらのモジュールのいずれかを誤ってClient Componentにインポートした場合に、他の開発者にビルド時エラーを与えることができます。

\`server-only\`を使用するには、まずパッケージをインストールします：

\`\`\`bash
npm install server-only
\`\`\`

次に、サーバー専用コードを含むモジュールにパッケージをインポートします：

\`\`\`ts title="lib/data.ts"
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
\`\`\`

これで、\`getData()\`をインポートするClient Componentは、このモジュールがサーバー上でのみ使用できることを説明するビルド時エラーを受け取ります。

対応するパッケージ\`client-only\`を使用して、クライアント専用コードを含むモジュール（たとえば、\`window\`オブジェクトにアクセスするコード）をマークできます。

### サードパーティパッケージとプロバイダーの使用

Server Componentsは新しいReact機能であるため、エコシステム内のサードパーティパッケージとプロバイダーは、\`useState\`、\`useEffect\`、\`createContext\`などのクライアント専用機能を使用するコンポーネントに\`"use client"\`ディレクティブを追加し始めたばかりです。

今日では、\`npm\`パッケージのクライアント専用機能を使用する多くのコンポーネントには、まだディレクティブがありません。これらのサードパーティコンポーネントは、\`"use client"\`ディレクティブを持つため、Client Components内では期待どおりに動作しますが、Server Components内では動作しません。

たとえば、仮想的な\`acme-carousel\`パッケージをインストールしたとします。このパッケージには\`<Carousel />\`コンポーネントがあります。このコンポーネントは\`useState\`を使用しますが、まだ\`"use client"\`ディレクティブがありません。

Client Component内で\`<Carousel />\`を使用すると、期待どおりに動作します：

\`\`\`tsx title="app/gallery.tsx"
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>

      {/* 動作します。CarouselはClient Component内で使用されています */}
      {isOpen && <Carousel />}
    </div>
  )
}
\`\`\`

ただし、Server Component内で直接使用しようとすると、エラーが表示されます：

\`\`\`tsx title="app/page.tsx"
import { Carousel } from 'acme-carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/* エラー: \`useState\` はServer Componentsで使用できません */}
      <Carousel />
    </div>
  )
}
\`\`\`

これは、Next.jsが\`<Carousel />\`がクライアント専用機能を使用していることを知らないためです。

これを修正するには、クライアント専用機能に依存するサードパーティコンポーネントを独自のClient Componentsでラップできます：

\`\`\`tsx title="app/carousel.tsx"
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
\`\`\`

これで、Server Component内で直接\`<Carousel />\`を使用できます：

\`\`\`tsx title="app/page.tsx"
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>

      {/* 動作します。CarouselはClient Componentです */}
      <Carousel />
    </div>
  )
}
\`\`\`

ほとんどのサードパーティコンポーネントをラップする必要はないと予想されます。それらはClient Components内で使用される可能性が高いためです。ただし、1つの例外はプロバイダーです。これらはReactの状態とコンテキストに依存しており、通常、アプリケーションのルートで必要とされるためです。[以下のサードパーティコンテキストプロバイダーについて詳しく学びましょう](#コンテキストプロバイダーの使用)。

#### ライブラリ作成者へ

同様に、他の開発者が使用するパッケージを作成しているライブラリ作成者は、\`"use client"\`ディレクティブを使用して、パッケージのクライアントエントリポイントをマークできます。これにより、パッケージのユーザーは、ラッピング境界を作成することなく、パッケージコンポーネントをServer Componentsに直接インポートできます。

[ツリーの深い場所で'use client'を使用する](#コンポーネントツリーの葉に向かってclient-componentsを移動する)ことで、パッケージを最適化でき、インポートされたモジュールをServer Componentモジュールグラフの一部にすることができます。

一部のバンドラーは\`"use client"\`ディレクティブを削除する場合があることに注意してください。\`"use client"\`ディレクティブを含めるようにesbuildを設定する方法の例は、[React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13)および[Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30)リポジトリで見つけることができます。

### コンテキストプロバイダーの使用

コンテキストプロバイダーは通常、アプリケーションのルート近くでレンダリングされ、現在のテーマなどのグローバルな関心事を共有します。[Reactコンテキスト](https://react.dev/learn/passing-data-deeply-with-context)はServer Componentsではサポートされていないため、アプリケーションのルートでコンテキストを作成しようとするとエラーが発生します：

\`\`\`tsx title="app/layout.tsx"
import { createContext } from 'react'

//  createContextはServer Componentsではサポートされていません
export const ThemeContext = createContext({})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  )
}
\`\`\`

これを修正するには、コンテキストを作成し、そのプロバイダーをClient Component内でレンダリングします：

\`\`\`tsx title="app/theme-provider.tsx"
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
\`\`\`

Server ComponentはプロバイダーがClient Componentとしてマークされているため、プロバイダーを直接レンダリングできるようになります：

\`\`\`tsx title="app/layout.tsx"
import ThemeProvider from './theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
\`\`\`

プロバイダーがルートでレンダリングされると、アプリ全体の他のすべてのClient Componentsは、このコンテキストを使用できるようになります。

> **知っておくと良いこと**: プロバイダーは、できるだけツリーの深い場所でレンダリングする必要があります。\`ThemeProvider\`が\`<html>\`ドキュメント全体ではなく、\`{children}\`のみをラップしていることに注目してください。これにより、Next.jsがServer Componentsの静的部分を最適化しやすくなります。

#### ライブラリ作成者へのアドバイス

同様に、他の開発者が使用するパッケージを作成しているライブラリ作成者は、\`"use client"\`ディレクティブを使用して、パッケージのクライアントエントリポイントをマークできます。これにより、パッケージのユーザーは、ラッピング境界を作成することなく、パッケージコンポーネントをServer Componentsに直接インポートできます。

[ツリーの深い場所で'use client'を使用する](#コンポーネントツリーの葉に向かってclient-componentsを移動する)ことで、パッケージを最適化でき、インポートされたモジュールをServer Componentモジュールグラフの一部にすることができます。

一部のバンドラーは\`"use client"\`ディレクティブを削除する場合があることに注意してください。\`"use client"\`ディレクティブを含めるようにesbuildを設定する方法の例は、[React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13)および[Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30)リポジトリで見つけることができます。

## Server ComponentsとClient Componentsのインターリーブ

Client ComponentsとServer Componentsをインターリーブする場合、UIをコンポーネントのツリーとして視覚化すると役立つ場合があります。[ルートレイアウト](/docs/app/building-your-application/routing/layouts-and-pages#root-layout-required)（Server Component）から始めて、\`"use client"\`ディレクティブを追加することで、クライアント上でコンポーネントの特定のサブツリーをレンダリングできます。

<Image
  alt="コンポーネントツリー"
  srcLight="/docs/light/composition-patterns.png"
  srcDark="/docs/dark/composition-patterns.png"
  width="1600"
  height="1383"
/>

これらのクライアントサブツリー内で、Server Componentsをネストしたり、Server Actionsを呼び出したりできますが、留意すべき点がいくつかあります：

- リクエスト-レスポンスライフサイクル中、コードはサーバーからクライアントに移動します。クライアント上にいるときにサーバー上のデータまたはリソースにアクセスする必要がある場合、サーバーへの**新しい**リクエストを行うことになります。行ったり来たりではありません。
- サーバーへの新しいリクエストが行われると、すべてのServer Componentsが最初にレンダリングされます。これには、Client Components内にネストされているものも含まれます。レンダリングされた結果（RSCペイロード）には、Client Componentsの場所への参照が含まれます。次に、クライアント上で、ReactはRSCペイロードを使用して、ServerとClient Componentsを単一のツリーに調整します。
- Client ComponentsはServer Componentsの後にレンダリングされるため、Server ComponentをClient Componentモジュールにインポートすることはできません（サーバーへの新しいリクエストが必要になるため）。代わりに、Server Componentを\`props\`としてClient Componentに渡すことができます。[サポートされていないパターン](#サポートされていないパターン-client-componentへのserver-componentのインポート)と[サポートされているパターン](#推奨パターン-server-componentsをプロパティとしてclient-componentsに渡す)のセクションを参照してください。

## 次のステップ

Server ComponentsとClient Componentsの基本を理解したので、次のセクションに進みます：

- **[Rendering](/docs/app/building-your-application/rendering)**: Server ComponentsとClient Componentsがどのようにレンダリングされるかを学びます。
- **[Data Fetching](/docs/app/building-your-application/data-fetching)**: Server Componentsでのデータフェッチのベストプラクティスを学びます。
- **[Server Actions](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)**: Server Componentsからデータを変更する方法を学びます。
