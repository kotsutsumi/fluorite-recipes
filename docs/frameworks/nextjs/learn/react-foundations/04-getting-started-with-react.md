# Reactを始める

新しく作成したプロジェクトでReactを使用するには、[unpkg.com](https://unpkg.com/)という外部ウェブサイトから2つのReactスクリプトを読み込みます：

- **react**はReactのコアライブラリです。
- **react-dom**はDOMで使用できるDOM固有のメソッドを提供し、ReactをDOMと一緒に使用することを可能にします。

```html
<!-- index.html -->
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script type="text/javascript">
      const app = document.getElementById("app");
      const header = document.createElement("h1");
      const text = "Develop. Preview. Ship.";
      const headerContent = document.createTextNode(text);
      header.appendChild(headerContent);
      app.appendChild(header);
    </script>
  </body>
</html>
```

プレーンなJavaScriptでDOMを直接操作する代わりに、以前に追加したDOMメソッドを削除し、[ReactDOM.createRoot()](https://react.dev/reference/react-dom/client/createRoot)メソッドを追加して特定のDOM要素をターゲットとし、Reactコンポーネントを表示するためのルートを作成します。次に、[root.render()](https://react.dev/reference/react-dom/client/hydrateRoot#root-render)メソッドを追加してReactコードをDOMにレンダリングします。

これにより、Reactに`#app`要素内で`<h1>`タイトルをレンダリングするよう指示されます。

```html
<!-- index.html -->
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script>
      const app = document.getElementById("app");
      const root = ReactDOM.createRoot(app);
      root.render(<h1>Develop. Preview. Ship.</h1>);
    </script>
  </body>
</html>
```

このコードをブラウザで実行しようとすると、構文エラーが発生します：

```
Uncaught SyntaxError: expected expression, got '<'
```

これは`<h1>...</h1>`が有効なJavaScriptではないためです。このコードの部分はJSXです。

## JSXとは？

JSXはJavaScriptの構文拡張で、見慣れたHTMLのような構文でUIを記述することができます。JSXの良い点は、[3つのJSXルール](https://react.dev/learn/writing-markup-with-jsx#the-rules-of-jsx)に従う以外は、HTMLとJavaScript以外の新しいシンボルや構文を学ぶ必要がないことです。

しかし、ブラウザはJSXをそのまま理解することができないため、JSXコードを通常のJavaScriptに変換するために、[Babel](https://babeljs.io/)などのJavaScriptコンパイラが必要です。

## プロジェクトにBabelを追加する

プロジェクトにBabelを追加するには、`index.html`ファイルに以下のスクリプトをコピーして貼り付けてください：

```html
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
```

さらに、スクリプトタイプを`type=text/jsx`に変更して、どのコードを変換するかをBabelに知らせる必要があります。

```html
<!-- index.html -->
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Babel Script -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/jsx">
      const domNode = document.getElementById("app");
      const root = ReactDOM.createRoot(domNode);
      root.render(<h1>Develop. Preview. Ship.</h1>);
    </script>
  </body>
</html>
```

正しく動作していることを確認するために、HTMLファイルをブラウザで開いてください。

今書いた宣言的なReactコード：

```html
<script type="text/jsx">
  const domNode = document.getElementById("app");
  const root = ReactDOM.createRoot(domNode);
  root.render(<h1>Develop. Preview. Ship.</h1>);
</script>
```

と、前のセクションで書いた命令的なJavaScriptコード：

```html
<script type="text/javascript">
  const app = document.getElementById("app");
  const header = document.createElement("h1");
  const text = "Develop. Preview. Ship.";
  const headerContent = document.createTextNode(text);
  header.appendChild(headerContent);
  app.appendChild(header);
</script>
```

を比較すると、Reactを使用することで多くの反復的なコードを削減できることがわかります。

そして、これがまさにReactが行うことです。Reactは、あなたの代わりにタスクを実行する再利用可能なコードスニペットを含むライブラリです。この場合、UIの更新です。

> **追加リソース：**
>
> Reactを使い始めるために、ReactがUIをどのように更新するかを正確に知る必要はありませんが、詳しく学びたい場合は、以下の追加リソースがあります：
>
> - [UIツリー](https://react.dev/learn/understanding-your-ui-as-a-tree)
> - [JSXでマークアップを書く](https://react.dev/learn/writing-markup-with-jsx)
> - [react-dom/server](https://react.dev/reference/react-dom/server) Reactドキュメントのセクション

## ReactのためのJavaScriptの必須知識

JavaScriptとReactを同時に学ぶことができますが、JavaScriptに慣れ親しんでいると、Reactを学ぶプロセスが簡単になります。

次のセクションでは、JavaScript の観点からReactのいくつかのコア概念を紹介します。以下は、言及されるJavaScriptトピックの要約です：

- [関数](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions)と[アロー関数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [オブジェクト](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [配列と配列メソッド](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [分割代入](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [テンプレートリテラル](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals)
- [三項演算子](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
- [ESモジュールとImport / Export構文](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)

このコースではJavaScriptについて深く掘り下げませんが、JavaScriptの最新バージョンを常に最新の状態に保つことは良い慣行です。しかし、まだJavaScriptに習熟していないと感じても、Reactでビルドを始めることを妨げないでください！

## 第4章を完了しました

素晴らしい、あなたは今Reactを使用しています。しかし、学ぶべきことはまだたくさんあります。

**次に進む：**

### 5：コンポーネントを使ったUIの構築

Reactアプリケーションの構築を始めるために知っておくべき必須のJavaScriptを理解しましょう。

[第5章を開始する](https://nextjs.org/learn/react-foundations/building-ui-with-components)
