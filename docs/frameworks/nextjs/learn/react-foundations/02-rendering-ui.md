# ユーザーインターフェース（UI）のレンダリング

Reactがどのように動作するかを理解するために、まずブラウザがどのようにコードを解釈してユーザーインターフェース（UI）を作成（またはレンダリング）するかについて基本的な理解が必要です。

ユーザーがウェブページにアクセスすると、サーバーはブラウザに以下のようなHTMLファイルを返します：

![左側にHTMLコード、右側にDOMツリーを示す2つの並列図](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flearn-html-and-dom.png&w=3840&q=75)

その後、ブラウザはHTMLを読み取り、Document Object Model（DOM）を構築します。

## DOMとは何か？

DOMは、HTML要素のオブジェクト表現です。コードとユーザーインターフェース間の橋渡しとして機能し、親子関係を持つツリー状の構造を持っています。

![左側にDOMツリー、右側にレンダリングされたUIを示す2つの並列図](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flearn-dom-and-ui.png&w=3840&q=75)

DOMメソッドとJavaScriptを使用して、ユーザーイベントをリッスンし、ユーザーインターフェースの特定の要素を選択、追加、更新、削除することで[DOMを操作](https://developer.mozilla.org/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents)できます。DOM操作により、特定の要素をターゲットにするだけでなく、そのスタイルやコンテンツを変更することも可能になります。

次のセクションでは、JavaScriptとDOMメソッドの使用方法を学習します。

## 追加リソース

• [DOMの紹介](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)
• [Google ChromeでDOMを確認する方法](https://developer.chrome.com/docs/devtools/dom/)
• [FirefoxでDOMを確認する方法](https://firefox-source-docs.mozilla.org/devtools-user/debugger/how_to/highlight_and_inspect_dom_nodes/index.html)

## 第2章完了

ブラウザでUIがどのようにレンダリングされるかの基本を理解できました。

### 次へ

**第3章：JavaScriptでUIを更新する**

開発者がJavaScriptを使用してDOMを操作し、UIを更新する方法を学習します。

[第3章を開始](https://nextjs.org/learn/react-foundations/updating-ui-with-javascript)
