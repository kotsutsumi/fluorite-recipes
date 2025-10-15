# インストール

React は当初より、段階的に導入できるように設計されています。あなたの必要に応じて、React を使う量はどれだけ少なくても、どれだけ多くても構いません。React を少し味見してみたい場合でも、HTML ページにちょっとしたインタラクティブ性を追加したい場合でも、あるいは複雑な React アプリを立ち上げたいという場合でも、このセクションがあなたのスタートをお手伝いします。

## このセクションの内容

- [React を試してみる方法](#react-を試してみる)
- [新しい React アプリの作成](#新しい-react-アプリを開始する)
- [既存プロジェクトへの React の追加](#既存のプロジェクトに-react-を追加する)
- [次のステップ](#次のステップ)

## React を試してみる

React を試すために何かをインストールする必要はありません。このサンドボックスを編集してみてください！

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

直接編集しても構いませんし、右上の "Fork" ボタンを押して新しいタブで開くこともできます。

React ドキュメントのほとんどのページには、このようなサンドボックスが含まれています。React のドキュメント外にも、React をサポートするオンラインサンドボックスがたくさんあります。例えば、[CodeSandbox](https://codesandbox.io/s/new)、[StackBlitz](https://stackblitz.com/fork/react) や [CodePen](https://codepen.io/pen?template=QWYVwWN) が挙げられます。

### ローカルで React を試す

あなたのコンピュータのローカル環境で React を試すには、[この HTML ページをダウンロードしてください](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html)。それをエディタとブラウザで開いてください！

## 新しい React アプリを開始する

フル機能の React アプリを構築したい場合は、新しいアプリをコミュニティでよく使われる React 駆動フレームワークで開始することをお勧めします。フレームワークは、ルーティング、データフェッチ、HTML 生成など、ほとんどのアプリやサイトが最終的に必要とする機能を提供します。

> **注意**
>
> **あなたは React アプリを構築するためにフレームワークを使う必要があります。** ローカル開発に必要な機能、例えばコードの分割、ルーティング、データフェッチ、HTML 生成などは、フレームワークが提供します。

### プロダクションレベルの React フレームワーク

これらのフレームワークは、本番環境でアプリをデプロイおよび拡張するために必要なすべての機能をサポートしており、私たちの[フルスタックアーキテクチャビジョン](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision)をサポートすることに取り組んでいます。私たちがお勧めするすべてのフレームワークはオープンソースであり、サポートのための活発なコミュニティがあり、あなた自身のサーバまたはホスティングプロバイダにデプロイできます。

#### Next.js

**[Next.js](https://nextjs.org/) は、フルスタックな React フレームワークです。** 汎用性が高く、静的なブログから複雑な動的アプリケーションまで、あらゆるサイズの React アプリを作成できます。新しい Next.js プロジェクトを作成するには、ターミナルで以下を実行してください：

```bash
npx create-next-app@latest
```

Next.js を初めて使う場合は、[Next.js のチュートリアル](https://nextjs.org/learn)をご覧ください。

Next.js は [Vercel](https://vercel.com/) によってメンテナンスされています。[Next.js アプリをデプロイ](https://nextjs.org/docs/app/building-your-application/deploying)するには、任意の Node.js サーバ、サーバレスホスティング、またはあなた自身のサーバを使用できます。Next.js は、サーバを必要としない[静的エクスポート](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)もサポートしています。

#### Remix

**[Remix](https://remix.run/) は、ネストされたルーティングを備えたフルスタック React フレームワークです。** アプリをネストされた部分に分割し、並行してデータをロードして、ユーザのアクションに応じて更新できます。新しい Remix プロジェクトを作成するには、以下を実行してください：

```bash
npx create-remix
```

Remix を初めて使う場合は、[Remix のブログチュートリアル](https://remix.run/docs/en/main/tutorials/blog)（短編）と[アプリチュートリアル](https://remix.run/docs/en/main/tutorials/jokes)（長編）をご覧ください。

Remix は [Shopify](https://www.shopify.com/) によってメンテナンスされています。Remix プロジェクトを作成する際に、[デプロイターゲットを選択](https://remix.run/docs/en/main/guides/deployment)する必要があります。Remix アプリは、[アダプタ](https://remix.run/docs/en/main/guides/deployment)を使用または作成して、任意の Node.js サーバまたはサーバレスホスティングにデプロイできます。

#### Gatsby

**[Gatsby](https://www.gatsbyjs.com/) は、CMS を使った高速なウェブサイトのための React フレームワークです。** 豊富なプラグインエコシステムと GraphQL データレイヤにより、コンテンツ、API、サービスを 1 つのウェブサイトに統合できます。新しい Gatsby プロジェクトを作成するには、以下を実行してください：

```bash
npx create-gatsby
```

Gatsby を初めて使う場合は、[Gatsby のチュートリアル](https://www.gatsbyjs.com/docs/tutorial/)をご覧ください。

Gatsby は [Netlify](https://www.netlify.com/) によってメンテナンスされています。[完全に静的な Gatsby サイトをデプロイ](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting)するには、任意の静的ホスティングを使用できます。サーバ専用機能の使用を選択した場合は、ホスティングプロバイダが Gatsby をサポートしていることを確認してください。

#### Expo（ネイティブアプリ用）

**[Expo](https://expo.dev/) は、真にネイティブな UI を持つユニバーサル Android、iOS、ウェブアプリを作成できる React フレームワークです。** [React Native](https://reactnative.dev/) 用の SDK を提供し、ネイティブ部分を使いやすくします。新しい Expo プロジェクトを作成するには、以下を実行してください：

```bash
npx create-expo-app
```

Expo を初めて使う場合は、[Expo のチュートリアル](https://docs.expo.dev/tutorial/introduction/)をご覧ください。

Expo は [Expo (the company)](https://expo.dev/about) によってメンテナンスされています。Expo でアプリを構築するのは無料で、制限なしに Google と Apple のアプリストアに提出できます。Expo は追加でオプトインの有料クラウドサービスも提供しています。

### 最先端の React フレームワーク

React をどのように改善し続けるかを探求する中で、React をフレームワーク（特にルーティング、バンドリング、サーバ技術）とより密接に統合することが、React ユーザがより良いアプリを構築するのを助ける最大の機会であることに気づきました。Next.js チームは、[React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) のような最先端のフレームワークに依存しない React 機能の研究、開発、統合、テストで協力することに同意してくれました。

これらの機能は日々本番環境への準備ができてきており、他のバンドラやフレームワークの開発者とも統合について話し合っています。私たちの希望は、1〜2 年のうちに、このページにリストされているすべてのフレームワークがこれらの機能を完全にサポートすることです。（これらの機能を試すために私たちと提携したいフレームワークの作者の方がいらっしゃいましたら、ぜひお知らせください！）

### カスタムセットアップを使わずに React を使う

React をフレームワークなしで使うこともできます。これは、[既存のページやアプリの一部に React を使用する](/learn/add-react-to-an-existing-project)場合に適しています。**ただし、新しいアプリやサイトを完全に React で構築する場合は、フレームワークを使用することをお勧めします。**

その理由は以下の通りです：

最初はルーティングやデータフェッチが必要ないとしても、後でそれらのためのライブラリを追加したくなる可能性があります。新しい機能を追加するたびに JavaScript バンドルが大きくなり、各ルートのコードを個別に分割する方法を考えなければならないかもしれません。データフェッチのニーズが複雑になるにつれて、サーバとクライアントのネットワークウォーターフォールに遭遇し、アプリが非常に遅く感じられることがあります。ネットワーク条件が悪いユーザや低スペックデバイスのユーザが増えるにつれて、コンポーネントから HTML を生成して早期にコンテンツを表示する必要が出てくるかもしれません。サーバ上やビルド時に実行されるようにセットアップを変更するのは非常に難しい場合があります。

**これらの問題は React に固有のものではありません。** Svelte には SvelteKit があり、Vue には Nuxt があるなどの理由はここにあります。これらの問題を自分で解決するには、バンドラをルーティングライブラリやデータフェッチライブラリと統合する必要があります。初期のセットアップを機能させるのは難しくありませんが、時間の経過とともに高速にロードできるアプリを作るには、多くの微妙な点があります。最小限のアプリコードを送信し、クライアント・サーバ間の 1 回のラウンドトリップでこれを行い、ページに必要なデータと並行して行いたいと思うでしょう。JavaScript コードが実行される前でもページがインタラクティブに見えるようにしたいと思うでしょう。プログレッシブエンハンスメントをサポートしたいと思うかもしれません。マーケティングページ用に完全に静的な HTML ファイルのフォルダを生成し、JavaScript が無効になっていても動作するようにしたいと思うかもしれません。これらの機能を自分で構築するには、本当に多くの作業が必要です。

**このページの React フレームワークは、このような問題をデフォルトで解決し、あなたの側で追加の作業を必要としません。** これらにより、非常に軽量にスタートでき、ニーズに合わせてアプリをスケールできます。各 React フレームワークにはコミュニティがあるため、質問への回答を見つけたり、ツールをアップグレードしたりするのが簡単です。フレームワークはまた、コードに構造を与え、異なるプロジェクト間でコンテキストとスキルを保持するのに役立ちます。逆に、カスタムセットアップでは、サポートされていない依存関係のバージョンで立ち往生しやすく、基本的には自分自身でフレームワークを作成することになります。ただし、コミュニティやアップグレードパスはありません（そして過去に私たちが作ったものと同様に、より雑な設計になる傾向があります）。

アプリに異常な制約があり、これらのフレームワークではうまく対応できない場合や、これらの問題を自分で解決したい場合は、React でカスタムセットアップを行うこともできます。npm から `react` と `react-dom` を取得し、[Vite](https://vitejs.dev/) や [Parcel](https://parceljs.org/) のようなバンドラでカスタムビルドプロセスをセットアップし、ルーティング、静的生成やサーバサイドレンダリングなどのために必要に応じて他のツールを追加してください。

## 既存のプロジェクトに React を追加する

既存のアプリに何らかのインタラクティビティを追加するために、完全に React で書き直す必要はありません。React を既存のスタックに追加し、インタラクティブな React コンポーネントをどこにでもレンダーできます。

### 既存のウェブサイトのサブルートで React を使う

別の技術で構築された既存のウェブアプリがあり（Rails のようなサーバのものや Backbone のようなクライアントのもの）、そのアプリの特定のルートで React フレームワークを使った新しいページや機能を開始したいとしましょう。

これを設定する方法は以下の通りです：

1. React ベースのフレームワークのいずれかを使用して、**アプリの React 部分を構築**します。
2. フレームワークの設定で **`/some-app` をベースパス**として指定します（以下にその方法を示します：[Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/basePath)、[Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)）。
3. **サーバまたはプロキシを設定**して、`/some-app/` 以下のすべてのリクエストが React アプリによって処理されるようにします。

これにより、アプリの React 部分は、それらのフレームワークに組み込まれた[ベストプラクティスから恩恵を受ける](/learn/start-a-new-react-project#can-i-use-react-without-a-framework)ことができます。

多くの React ベースのフレームワークはフルスタックであり、React 部分がサーバを活用できるようにしています。ただし、サーバで JavaScript を実行できない場合や実行したくない場合でも、同じアプローチを使用できます。その場合は、HTML/CSS/JS のエクスポート（Next.js の場合は[`output: 'export'`](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)、Gatsby の場合はデフォルト）を `/some-app/` で提供してください。

### 既存ページの一部で React を使う

別の技術（Rails のようなサーバのものや Backbone のようなクライアントのもの）で構築された既存のページがあり、そのページのどこかでインタラクティブな React コンポーネントをレンダリングしたいとします。これは React を統合する一般的な方法です。実際、これは長年にわたって Meta での React の使用方法でした！

これは 2 つのステップで行うことができます：

1. **JavaScript 環境をセットアップ**して、[JSX 構文](/learn/writing-markup-with-jsx)を使用でき、[`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 構文でコードをモジュールに分割でき、npm パッケージレジストリから（例えば React から）パッケージを使用できるようにします。
2. **React コンポーネントを**ページ上で見たい場所に**レンダリング**します。

正確なアプローチは既存のページ設定に依存するため、いくつかの詳細を見ていきましょう。

#### ステップ 1：モジュラー JavaScript 環境をセットアップする

モジュラー JavaScript 環境では、すべてのコードを 1 つのファイルに記述するのではなく、React コンポーネントを個々のファイルに記述できます。また、React 自体を含む、他の開発者が [npm](https://www.npmjs.com/) レジストリで公開しているすべての素晴らしいパッケージを使用できます。どのようにこれを行うかは、既存のセットアップに依存します：

- **アプリがすでに `import` 文を使用してファイルに分割されている場合は、**すでにあるセットアップを使用してみてください。JS コードで `<div />` を記述するとシンタックスエラーが発生するかどうかを確認してください。シンタックスエラーが発生する場合は、[Babel で JavaScript コードを変換](https://babeljs.io/setup)し、JSX を使用するために [Babel React preset](https://babeljs.io/docs/babel-preset-react) を有効にする必要があるかもしれません。

- **アプリに JavaScript モジュールをコンパイルするための既存のセットアップがない場合は、**[Vite](https://vitejs.dev/) を使ってセットアップしてください。Vite コミュニティは、Rails、Django、Laravel などを含む[多くのバックエンドフレームワークとの統合](https://github.com/vitejs/awesome-vite#integrations-with-backends)を維持しています。バックエンドフレームワークがリストにない場合は、[このガイドに従って](https://vitejs.dev/guide/backend-integration.html)Vite ビルドをバックエンドと手動で統合してください。

セットアップが機能しているかどうかを確認するには、プロジェクトフォルダで次のコマンドを実行してください：

```bash
npm install react react-dom
```

次に、メインの JavaScript ファイルの上部に次のコード行を追加してください（これは `index.js` や `main.js` と呼ばれるかもしれません）：

```jsx
import { createRoot } from 'react-dom/client';

// 既存の HTML コンテンツをクリア
document.body.innerHTML = '<div id="app"></div>';

// 代わりに React コンポーネントをレンダー
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

ページの全コンテンツが "Hello, world!" に置き換えられた場合、すべてが機能しました！読み進めてください。

> **注意**
>
> 既存のプロジェクトにモジュラー JavaScript 環境を初めて統合する場合は、最初は威圧的に感じるかもしれませんが、その価値はあります！行き詰まった場合は、[コミュニティリソース](/community)または [Vite Chat](https://chat.vitejs.dev/) を試してください。

#### ステップ 2：ページ上の任意の場所に React コンポーネントをレンダリングする

前のステップでは、メインファイルの上部にこのコードを配置しました：

```jsx
import { createRoot } from 'react-dom/client';

// 既存の HTML コンテンツをクリア
document.body.innerHTML = '<div id="app"></div>';

// 代わりに React コンポーネントをレンダー
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

もちろん、実際には既存の HTML コンテンツをクリアしたくはありません！

このコードを削除してください。

代わりに、HTML 内の特定の場所に React コンポーネントをレンダリングしたいと思います。HTML ページ（またはそれを生成するサーバテンプレート）を開き、任意のタグに一意の [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) 属性を追加してください。例：

```html
<!-- ... あなたの html のどこか ... -->
<nav id="navigation"></nav>
<!-- ... さらに html ... -->
```

これにより、[`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) でその HTML 要素を見つけて、[`createRoot`](/reference/react-dom/client/createRoot) に渡すことができ、その中に独自の React コンポーネントをレンダリングできます：

```jsx title="index.js"
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: 実際にナビゲーションバーを実装する
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

`index.html` の元の HTML コンテンツが保持され、独自の React コンポーネント `NavigationBar` が HTML の `<nav id="navigation">` 内に表示されるようになったことに注目してください。既存の HTML ページ内に React コンポーネントをレンダリングする方法について詳しくは、[`createRoot` の使用法ドキュメント](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)をお読みください。

既存のプロジェクトで React を採用する際、小さなインタラクティブコンポーネント（ボタンなど）から始めて、徐々に「上に向かって進む」のが一般的です。最終的にページ全体が React で構築されることもあります。その時点に達した場合は、React から最大限に活用するために、[React フレームワーク](/learn/start-a-new-react-project)に移行することをお勧めします。

## 既存の React Native モバイルアプリで React を使う

[React Native](https://reactnative.dev/) も、既存のネイティブアプリに段階的に統合できます。Android（Java または Kotlin）または iOS（Objective-C または Swift）用の既存のネイティブアプリがある場合は、[このガイドに従って](https://reactnative.dev/docs/integration-with-existing-apps)React Native 画面を追加してください。

## 次のステップ

[クイックスタート](/learn)に進んで、日々遭遇する最も重要な React の概念のツアーに参加してください。
