# 既存のプロジェクトに React を追加する

既存のプロジェクトに何らかのインタラクティビティを追加したい場合、それを React で書き直す必要はありません。既存のスタックに React を追加して、どこでもインタラクティブな React コンポーネントをレンダリングできます。

## このページで学ぶこと

- [既存のウェブサイトに React を追加する方法](#既存のウェブサイトのサブルートで-react-を使う)
- [既存のページの一部に React を追加する方法](#既存ページの一部で-react-を使う)
- [既存のネイティブモバイルアプリに React Native を追加する方法](#既存の-react-native-モバイルアプリで-react-を使う)

## 既存のウェブサイトのサブルートで React を使う

別の技術を使用して構築された既存のウェブアプリが `example.com` にあり、`example.com/some-app/` から始まる全ルートを React で完全に実装したいとしましょう。

以下のように設定することをお勧めします：

1. React ベースのフレームワークのいずれかを使用して、**アプリの React 部分を構築**します。
2. フレームワークの設定で **`/some-app` をベースパス**として指定します（設定方法：[Next.js](https://nextjs.org/docs/app/api-reference/next-config-js/basePath)、[Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)）。
3. **サーバまたはプロキシを設定**して、`/some-app/` 以下のすべてのリクエストが React アプリケーションによって処理されるようにします。

これにより、アプリの React 部分が、これらのフレームワークに組み込まれた[ベストプラクティスの恩恵を受ける](/learn/start-a-new-react-project#production-grade-react-frameworks)ことができます。

多くの React ベースのフレームワークはフルスタックであり、React アプリがサーバを活用できるようにします。ただし、サーバ上で JavaScript を実行できない場合や実行したくない場合でも、同じアプローチを使用できます。その場合は、HTML/CSS/JS のエクスポート（Next.js の場合は [`output: 'export'`](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)、Gatsby の場合はデフォルト）を `/some-app/` で提供してください。

## 既存ページの一部で React を使う

別の技術（Rails のようなサーバサイドのものや、Backbone のようなクライアントサイドのもの）で構築された既存のページがあり、そのページのどこかにインタラクティブな React コンポーネントをレンダリングしたいとします。これは React を統合する一般的な方法です。実際、これは長年にわたって Meta での React 使用のほとんどがこのようになっていました！

これは 2 つのステップで行うことができます：

1. [JSX 構文](/learn/writing-markup-with-jsx)を使用でき、[`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 構文でコードをモジュールに分割でき、[npm](https://www.npmjs.com/) パッケージレジストリ（例えば React）からパッケージを使用できる **JavaScript 環境をセットアップ**します。
2. ページ上で見たい場所に **React コンポーネントをレンダリング**します。

正確なアプローチは既存のページ設定に依存するため、いくつかの詳細を見ていきましょう。

### ステップ 1：モジュラー JavaScript 環境をセットアップする

モジュラー JavaScript 環境では、すべてのコードを 1 つのファイルに書くのではなく、React コンポーネントを個々のファイルに書くことができます。また、React 自体を含む、他の開発者が [npm](https://www.npmjs.com/) レジストリに公開しているすべての素晴らしいパッケージを使用できます。これをどのように行うかは、既存のセットアップに依存します：

- **アプリがすでに `import` 文を使用してファイルに分割されている場合は、**すでに持っているセットアップを使用してみてください。JS コードで `<div />` を書くとシンタックスエラーになるかどうかを確認してください。シンタックスエラーになる場合は、[Babel で JavaScript コードを変換](https://babeljs.io/setup)し、JSX を使用するために [Babel React preset](https://babeljs.io/docs/babel-preset-react) を有効にする必要があるかもしれません。

- **アプリに JavaScript モジュールをコンパイルするための既存のセットアップがない場合は、**[Vite](https://vitejs.dev/) でセットアップしてください。Vite コミュニティは、Rails、Django、Laravel などを含む[多くのバックエンドフレームワークとの統合](https://github.com/vitejs/awesome-vite#integrations-with-backends)を維持しています。バックエンドフレームワークがリストにない場合は、[このガイドに従って](https://vitejs.dev/guide/backend-integration.html) Vite ビルドをバックエンドに手動で統合してください。

セットアップが機能するかどうかを確認するには、プロジェクトフォルダでこのコマンドを実行してください：

```bash
npm install react react-dom
```

次に、メインの JavaScript ファイル（`index.js` や `main.js` と呼ばれるかもしれません）の先頭に次のコード行を追加してください：

```jsx title="index.js" {1,2,4-7}
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
> 既存のプロジェクトにモジュラー JavaScript 環境を初めて統合する場合は、最初は intimidating に感じるかもしれませんが、それだけの価値はあります！行き詰まった場合は、[コミュニティリソース](/community)や [Vite Chat](https://chat.vitejs.dev/) を試してみてください。

### ステップ 2：ページ上の任意の場所に React コンポーネントをレンダリングする

前のステップで、メインファイルの先頭にこのコードを置きました：

```jsx
import { createRoot } from 'react-dom/client';

// 既存の HTML コンテンツをクリア
document.body.innerHTML = '<div id="app"></div>';

// 代わりに React コンポーネントをレンダー
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

もちろん、実際には既存の HTML コンテンツをクリアしたくありません！

このコードを削除してください。

代わりに、HTML の特定の場所に React コンポーネントをレンダリングしたいと思います。HTML ページ（またはそれを生成するサーバテンプレート）を開き、任意のタグに一意の [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) 属性を追加してください。例えば：

```html
<!-- ... あなたの html のどこか ... -->
<nav id="navigation"></nav>
<!-- ... さらに html ... -->
```

これにより、[`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) でその HTML 要素を見つけ、[`createRoot`](/reference/react-dom/client/createRoot) に渡すことで、その中に独自の React コンポーネントをレンダリングできます：

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

`index.html` からの元の HTML コンテンツが保存され、独自の `NavigationBar` React コンポーネントが HTML の `<nav id="navigation">` 内に表示されるようになったことに注目してください。既存の HTML ページ内に React コンポーネントをレンダリングする方法について詳しくは、[`createRoot` の使用法ドキュメント](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)をお読みください。

既存のプロジェクトで React を採用する場合、小さなインタラクティブコンポーネント（ボタンなど）から始めて、徐々に「上に向かって進む」のが一般的であり、最終的にページ全体が React で構築されることもあります。その時点に達した場合は、React を最大限に活用するために、[React フレームワーク](/learn/start-a-new-react-project)に移行することをお勧めします。

## 既存の React Native モバイルアプリで React を使う

[React Native](https://reactnative.dev/) も、既存のネイティブアプリに段階的に統合できます。Android（Java または Kotlin）または iOS（Objective-C または Swift）用の既存のネイティブアプリがある場合は、[このガイド](https://reactnative.dev/docs/integration-with-existing-apps)に従って React Native 画面を追加してください。
