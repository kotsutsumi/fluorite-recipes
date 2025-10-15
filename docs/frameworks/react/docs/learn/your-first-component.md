# 初めてのコンポーネント

**コンポーネント**は React における最重要コンセプトのひとつです。コンポーネントはユーザインターフェース（UI）を構築する基盤となるため、React の旅を始めるのに最適な場所です！

## 学ぶこと

- コンポーネントとは何か
- React アプリケーションにおけるコンポーネントの役割
- 初めての React コンポーネントの書き方

## コンポーネント：UI の構成部品

Web 上では、HTML によって、`<h1>` や `<li>` のような組み込みタグのセットを使って、構造化されたリッチなドキュメントを作成できます。

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

このマークアップは、この記事 `<article>`、見出し `<h1>`、および（省略された）目次を順序付きリスト `<ol>` として表しています。このようなマークアップは、CSS によるスタイル、JavaScript によるインタラクティビティと組み合わされて、Web 上に見られるすべてのサイドバー、アバター、モーダル、ドロップダウン—すべての UI の部品—の背後にあります。

React では、マークアップ、CSS、JavaScript を、アプリの**再利用可能な UI 要素**である、カスタムの「コンポーネント」に組み合わせることができます。上で見た目次のコードは、すべてのページにレンダーできる `<TableOfContents />` コンポーネントに変えることができます。内部的には、同じ HTML タグ、`<article>`、`<h1>` などを今でも使用しています。

HTML タグと同様に、コンポーネントを組み合わせたり、順序を付けたり、ネストしたりして、ページ全体をデザインできます。例えば、あなたが読んでいるこのドキュメントページも、React コンポーネントでできています。

```jsx
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

プロジェクトが成長するにつれて、既に書いたコンポーネントを再利用することで、多くのデザインを組み立てることができ、開発速度が上がることに気付くでしょう。上記の目次は、`<TableOfContents />` でどのような画面にも追加できます！[Chakra UI](https://chakra-ui.com/) や [Material UI](https://material-ui.com/) のような React オープンソースコミュニティで共有されている数千のコンポーネントを使って、プロジェクトを素早く立ち上げることもできます。

## コンポーネントを定義する

従来、Web ページを作成する際、Web 開発者はコンテンツをマークアップしてから、JavaScript を振りかけることでインタラクションを追加していました。これは、Web 上でインタラクションがあればよい、という時代にはうまく機能していました。現在では、多くのサイトやすべてのアプリでインタラクションが期待されています。React は、同じ技術を使用しながら、インタラクティビティを第一に考えています。**React コンポーネントは、マークアップを添えることができる JavaScript 関数です**。以下がその例です（以下の例は編集できます）。

```jsx
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

以下がコンポーネントを構築する方法です。

### ステップ 1：コンポーネントをエクスポートする

`export default` という接頭辞は、[標準的な JavaScript 構文](https://developer.mozilla.org/docs/web/javascript/reference/statements/export)です（React 固有のものではありません）。これにより、ファイル内のメイン関数をマークして、後で他のファイルからインポートできるようにします。（インポートの詳細については[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)を参照してください！）

### ステップ 2：関数を定義する

`function Profile() { }` により、`Profile` という名前の JavaScript 関数を定義します。

> 注意
>
> React コンポーネントは通常の JavaScript 関数ですが、**名前は大文字で始める必要があります**。そうしないと動作しません！

### ステップ 3：マークアップを追加する

このコンポーネントは、`src` と `alt` 属性を持つ `<img />` タグを返します。`<img />` は HTML のように書かれていますが、実際には裏で JavaScript です！この構文は [JSX](/learn/writing-markup-with-jsx) と呼ばれ、JavaScript 内にマークアップを埋め込むことができます。

return 文は、この例のように、すべて 1 行で書くこともできます。

```jsx
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

しかし、マークアップがすべて `return` キーワードと同じ行にない場合は、括弧で囲む必要があります。

```jsx
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

> 注意
>
> 括弧がないと、`return` の後の行のコードは[すべて無視されます](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)！

## コンポーネントを使う

`Profile` コンポーネントを定義したので、他のコンポーネント内にネストさせることができます。例えば、複数の `Profile` コンポーネントを使用する `Gallery` コンポーネントをエクスポートできます。

```jsx
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

### ブラウザに表示される内容

大文字と小文字の違いに注意してください。

- `<section>` は小文字なので、React はそれが HTML タグを指していると認識します。
- `<Profile />` は大文字の `P` で始まるので、React は `Profile` という名前の独自のコンポーネントを使いたいのだと認識します。

そして、`Profile` は、さらに HTML `<img />` を含んでいます。最終的に、ブラウザに表示されるのは以下の内容です。

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### コンポーネントのネストと整理

コンポーネントは通常の JavaScript 関数なので、同じファイルに複数のコンポーネントを含めることができます。これは、コンポーネントが比較的小さい場合や、互いに密接に関連している場合に便利です。このファイルが混雑してきた場合は、`Profile` を別のファイルに移動することができます。これについては、[インポートに関するページ](/learn/importing-and-exporting-components)ですぐに学びます。

`Profile` コンポーネントは `Gallery` 内でレンダーされている—しかも複数回！—ので、`Gallery` は**親コンポーネント**であり、各 `Profile` を「子」としてレンダーしていると言えます。これが React の魔法の一部です。コンポーネントを一度定義すれば、好きな場所で好きなだけ使うことができます。

> 注意
>
> コンポーネントは他のコンポーネントをレンダーできますが、**定義をネストさせてはいけません**。
>
> ```jsx
> export default function Gallery() {
>   // 🔴 決して他のコンポーネント内でコンポーネントを定義しないでください！
>   function Profile() {
>     // ...
>   }
>   // ...
> }
> ```
>
> 上記のスニペットは[非常に遅く、バグの原因となります](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state)。代わりに、すべてのコンポーネントをトップレベルで定義してください。
>
> ```jsx
> export default function Gallery() {
>   // ...
> }
>
> // ✅ トップレベルでコンポーネントを宣言する
> function Profile() {
>   // ...
> }
> ```
>
> 子コンポーネントが親からのデータを必要とする場合は、定義をネストするのではなく、[props で渡して](/learn/passing-props-to-a-component)ください。

> Deep Dive
>
> ### コンポーネントの中身はすべてコンポーネント
>
> React アプリケーションは「ルート」コンポーネントから始まります。通常、新しいプロジェクトを開始すると自動的に作成されます。例えば、[CodeSandbox](https://codesandbox.io/) や [Create React App](https://create-react-app.dev/) を使用する場合、ルートコンポーネントは `src/App.js` で定義されます。[Next.js](https://nextjs.org/) フレームワークを使用する場合、ルートコンポーネントは `pages/index.js` で定義されます。これらの例では、ルートコンポーネントをエクスポートしてきました。
>
> ほとんどの React アプリは、コンポーネントを最後まで使います。これは、ボタンのような再利用可能な部品だけでなく、サイドバー、リスト、そして最終的にはページ全体のような、より大きな部品にもコンポーネントを使用するということです！コンポーネントは、一部が 1 回しか使用されない場合でも、UI コードとマークアップを整理する便利な方法です。
>
> [Next.js](https://nextjs.org/) のようなフレームワークは、これをさらに進めています。空の HTML ファイルを使用して、React に JavaScript でページ管理を任せる代わりに、React コンポーネントから HTML も自動的に生成します。これにより、JavaScript コードが読み込まれる前に、アプリがコンテンツの一部を表示できます。
>
> とはいえ、多くの Web サイトは、React を[インタラクティビティを少し追加するためだけに](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)使用しています。これらのサイトには、ページ全体に対して 1 つではなく、多くのルートコンポーネントがあります。必要に応じて、React を好きなだけ使用できます。

## まとめ

React を初めて体験しました！いくつかの重要なポイントをおさらいしましょう。

- React では、アプリの**再利用可能な UI 要素**であるコンポーネントを作成できます。
- React アプリでは、UI のすべての部品がコンポーネントです。
- React コンポーネントは、以下の点を除いて、通常の JavaScript 関数です。
  1. コンポーネント名は常に大文字で始まる。
  2. JSX マークアップを返す。

## チャレンジ

### チャレンジ 1: コンポーネントをエクスポートする

次のサンドボックスは、ルートコンポーネントがエクスポートされていないため、動作しません。

```jsx
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

解決策を見る前に、自分で修正してみてください！

#### 解決策

関数定義の前に `export default` を追加します。

```jsx
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

なぜ `export` だけでは不十分なのか疑問に思うかもしれません。`export` と `export default` の違いについては、[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)で学べます。

### チャレンジ 2: return 文を修正する

この `return` 文には何か問題があります。修正できますか？

```jsx
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

> ヒント
>
> これを修正しようとすると、「Unterminated JSX contents」というエラーが表示されるかもしれません。

#### 解決策

以下のように、return 文を 1 行に移動することで、このコンポーネントを修正できます。

```jsx
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

または、return の直後に開き括弧を追加して、返される JSX マークアップを囲むこともできます。

```jsx
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/jA8hHMpm.jpg"
      alt="Katsuko Saruhashi"
    />
  );
}
```

### チャレンジ 3: 誤りを見つける

`Profile` コンポーネントの宣言と使用について、何か問題があります。誤りを見つけられますか？（React がコンポーネントを通常の HTML タグと区別する方法を思い出してみてください！）

```jsx
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

#### 解決策

React コンポーネント名は大文字で始める必要があります。

`function profile()` を `function Profile()` に変更し、すべての `<profile />` を `<Profile />` に変更してください。

```jsx
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

### チャレンジ 4: 自分のコンポーネント

最初からコンポーネントを書いてください。有効な名前を付けて、マークアップを返すことができます。アイデアが浮かばない場合は、`<h1>Good job!</h1>` を表示する `Congratulations` コンポーネントを書くことができます。エクスポートすることを忘れないでください！

#### 解決策

```jsx
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```
