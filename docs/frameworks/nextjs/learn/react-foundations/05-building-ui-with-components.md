# コンポーネントでUIを構築する

## Reactの中核概念

Reactアプリケーションの構築を始めるために知っておく必要がある、Reactの3つの中核概念があります：

• コンポーネント
• Props
• State

次の章では、これらの概念について説明し、さらに学習を続けるためのリソースを提供します。これらの概念に慣れたら、Next.jsのインストール方法と、サーバーコンポーネントやクライアントコンポーネントなどの新しいReact機能の使用方法をご紹介します。

## コンポーネント

ユーザーインターフェースは、コンポーネントと呼ばれる小さな構成要素に分解できます。

コンポーネントを使用すると、自己完結型で再利用可能なコードスニペットを構築できます。コンポーネントをレゴブロックと考えると、これらの個別のブロックを組み合わせて、より大きな構造を形成できます。UIの一部を更新する必要がある場合は、特定のコンポーネントまたはブロックを更新できます。

![画像、テキスト、ボタンの3つの小さなコンポーネントで構成されたメディアコンポーネントの例](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flearn-components.png&w=3840&q=75)

このモジュール性により、アプリケーションの他の部分に触れることなく、コンポーネントの追加、更新、削除ができるため、コードの成長に伴ってより保守しやすくなります。

Reactコンポーネントの優れた点は、それらが単なるJavaScriptであることです。JavaScriptの観点から、Reactコンポーネントの記述方法を見てみましょう：

### コンポーネントの作成

Reactでは、コンポーネントは関数です。`script`タグ内で、`header`という新しい関数を作成します：

```html
<script type="text/jsx">
  const app = document.getElementById("app");

  function header() {}

  const root = ReactDOM.createRoot(app);
  root.render(<h1>Develop. Preview. Ship.</h1>);
</script>
```

コンポーネントは、UI要素を返す関数です。関数のreturn文内で、JSXを記述できます：

```html
<script type="text/jsx">
  const app = document.getElementById("app");

  function header() {
    return <h1>Develop. Preview. Ship.</h1>;
  }

  const root = ReactDOM.createRoot(app);
  root.render(<h1>Develop. Preview. Ship.</h1>);
</script>
```

このコンポーネントをDOMにレンダリングするには、`root.render()`メソッドの最初の引数として渡します：

```html
<script type="text/jsx">
  const app = document.getElementById("app");

  function header() {
    return <h1>Develop. Preview. Ship.</h1>;
  }

  const root = ReactDOM.createRoot(app);
  root.render(header);
</script>
```

しかし、ちょっと待ってください。上記のコードをブラウザで実行しようとすると、エラーが発生します。これを動作させるには、2つのことを行う必要があります：

まず、Reactコンポーネントは、通常のHTMLとJavaScriptと区別するために大文字で始める必要があります：

```html
function Header() { return
<h1>Develop. Preview. Ship.</h1>
; } const root = ReactDOM.createRoot(app); // Reactコンポーネントを大文字にする
root.render(Header);
```

次に、通常のHTMLタグと同じように、角括弧`<>`を使用してReactコンポーネントを使用します：

```html
function Header() { return
<h1>Develop. Preview. Ship.</h1>
; } const root = ReactDOM.createRoot(app); root.render(
<header />
);
```

ブラウザで再度コードを実行すると、変更が表示されます。

### コンポーネントのネスト

アプリケーションには通常、単一のコンポーネント以上のコンテンツが含まれています。通常のHTML要素のように、Reactコンポーネントを互いの中にネストできます。

例では、`HomePage`という新しいコンポーネントを作成します：

```html
function Header() { return
<h1>Develop. Preview. Ship.</h1>
; } function HomePage() { return
<div></div>
; } const root = ReactDOM.createRoot(app); root.render(
<header />
);
```

次に、新しい`<HomePage>`コンポーネント内に`<Header>`コンポーネントをネストします：

```html
function Header() { return
<h1>Develop. Preview. Ship.</h1>
; } function HomePage() { return (
<div>
  {/* Headerコンポーネントをネスト */}
  <header />
</div>
); } const root = ReactDOM.createRoot(app); root.render(
<header />
);
```

### コンポーネントツリー

このようにReactコンポーネントをネストし続けて、コンポーネントツリーを形成できます。

![コンポーネントが互いの中にネストできることを示すコンポーネントツリー](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flearn-component-tree.png&w=3840&q=75)

例えば、最上位の`HomePage`コンポーネントは、`Header`、`Article`、`Footer`コンポーネントを保持できます。そして、これらの各コンポーネントは、独自の子コンポーネントを持つことができます。例えば、`Header`コンポーネントには、`Logo`、`Title`、`Navigation`コンポーネントが含まれる可能性があります。

このモジュラー形式により、アプリ内のさまざまな場所でコンポーネントを再利用できます。

プロジェクトでは、`<HomePage>`が最上位のコンポーネントになったので、`root.render()`メソッドに渡すことができます：

```html
function Header() { return
<h1>Develop. Preview. Ship.</h1>
; } function HomePage() { return (
<div>
  <header />
</div>
); } const root = ReactDOM.createRoot(app); root.render(<HomePage />);
```

## 第5章を完了しました

最初のReactコンポーネントを作成しました。

### 次へ

**6: Propsでデータを表示する**

propsとは何か、そしてそれらを使用してデータを表示する方法を学びます。

[第6章を開始](https://nextjs.org/learn/react-foundations/displaying-data-with-props)

## 追加リソース

• [最初のコンポーネント](https://react.dev/learn/your-first-component)
• [コンポーネントのインポートとエクスポート](https://react.dev/learn/importing-and-exporting-components)
