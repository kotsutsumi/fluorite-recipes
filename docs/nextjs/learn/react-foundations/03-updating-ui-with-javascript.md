# JavaScriptでUIを更新する

この章では、JavaScriptとDOMメソッドを使用してプロジェクトに`h1`タグを追加し、プロジェクトの構築を開始します。

コードエディターを開いて、新しい`index.html`ファイルを作成してください。HTMLファイル内に以下のコードを追加します：

```html
<html>
  <body>
    <div></div>
  </body>
</html>
```

次に、後でターゲットにできるように`div`に一意の`id`を付けます。

```html
<html>
  <body>
    <div id="app"></div>
  </body>
</html>
```

HTMLファイル内でJavaScriptを書くには、`script`タグを追加します：

```html
<html>
  <body>
    <div id="app"></div>
    <script type="text/javascript"></script>
  </body>
</html>
```

次に、`script`タグ内で、DOMメソッドの[getElementById()](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)を使用して、`id`によって`<div>`要素を選択できます：

```html
<html>
  <body>
    <div id="app"></div>
    <script type="text/javascript">
      const app = document.getElementById("app");
    </script>
  </body>
</html>
```

DOMメソッドを続けて使用して、新しい`<h1>`要素を作成できます：

```html
<html>
  <body>
    <div id="app"></div>
    <script type="text/javascript">
      // 'app' idを持つdiv要素を選択
      const app = document.getElementById("app");

      // 新しいH1要素を作成
      const header = document.createElement("h1");

      // H1要素用の新しいテキストノードを作成
      const text = "Develop. Preview. Ship.";
      const headerContent = document.createTextNode(text);

      // テキストをH1要素に追加
      header.appendChild(headerContent);

      // H1要素をdiv内に配置
      app.appendChild(header);
    </script>
  </body>
</html>
```

すべてが機能していることを確認するため、お好みのブラウザでHTMLファイルを開いてください。「Develop. Preview. Ship.」と表示される`h1`タグが表示されるはずです。

## HTMLとDOM

[ブラウザー開発者ツール](https://developer.mozilla.org/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools)内でDOM要素を見ると、DOMに`<h1>`要素が含まれていることがわかります。ページのDOMはソースコードとは異なります。つまり、作成した元のHTMLファイルとは異なるということです。

![レンダリングされたDOM要素とソースコード（HTML）の違いを示す2つの並列図](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flearn-dom-and-source.png&w=3840&q=75)

これは、HTMLが初期ページコンテンツを表し、DOMが作成したJavaScriptコードによって変更された更新されたページコンテンツを表すためです。

プレーンなJavaScriptでDOMを更新することは非常に強力ですが、冗長です。テキストを含む`<h1>`要素を追加するために、以下のようなコードをすべて書きました：

```javascript
const app = document.getElementById("app");
const header = document.createElement("h1");
const text = "Develop. Preview. Ship.";
const headerContent = document.createTextNode(text);
header.appendChild(headerContent);
app.appendChild(header);
```

アプリやチームの規模が大きくなると、この方法でアプリケーションを構築することがますます困難になります。

このアプローチでは、開発者はコンピュータにどのように操作を行うべきかを指示する命令を書くことに多くの時間を費やします。しかし、表示したいものを説明して、コンピュータにDOMの更新方法を理解させることができれば素晴らしいと思いませんか？

## 命令型 vs 宣言型プログラミング

上記のコードは命令型プログラミングの良い例です。ユーザーインターフェースをどのように更新すべきかの手順を書いています。しかし、ユーザーインターフェースの構築に関して言えば、開発プロセスを高速化できるため、宣言型アプローチがしばしば好まれます。DOMメソッドを書く必要がなく、開発者が表示したいもの（この場合、テキストを含む`h1`タグ）を宣言できれば役立つでしょう。

言い換えると、命令型プログラミングはシェフにピザの作り方を段階的に指示することのようなものです。宣言型プログラミングは、ピザを作る手順を気にせずにピザを注文することのようなものです。🍕

[React](https://react.dev/)は、ユーザーインターフェースの構築に使用できる人気の宣言型ライブラリです。

## React：宣言的UIライブラリ

開発者として、ユーザーインターフェースに何を起こしてほしいかをReactに伝えることができ、Reactがあなたの代わりにDOMを更新する手順を理解してくれます。

次のセクションでは、Reactを始める方法を探ります。

## 第3章を完了しました

開発者がJavaScriptを使用してUIを更新する方法を学びました。

### 次へ

**第4章：Reactを始める**

既存のプロジェクトにReactを追加する方法を学びます。

### 追加リソース

- [HTML vs. the DOM](https://developer.chrome.com/docs/devtools/dom/#appendix)
- [宣言的UIと命令的UIの比較](https://react.dev/learn/reacting-to-input-with-state#how-declarative-ui-compares-to-imperative)
