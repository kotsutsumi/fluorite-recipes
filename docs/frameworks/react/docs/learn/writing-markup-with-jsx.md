# JSX でマークアップを記述する

**JSX** は、JavaScript ファイル内に HTML のようなマークアップを書くことができる JavaScript の構文拡張です。コンポーネントを書く方法は他にもありますが、ほとんどの React 開発者は JSX の簡潔さを好み、ほとんどのコードベースで使用されています。

## 学ぶこと

- React がマークアップとレンダリングロジックを混在させる理由
- JSX と HTML の違い
- JSX で情報を表示する方法

## JSX：JavaScript にマークアップを入れる

Web は HTML、CSS、JavaScript 上に構築されてきました。長年にわたって、Web 開発者はコンテンツを HTML に、デザインを CSS に、ロジックを JavaScript に—多くの場合、別々のファイルに—保持してきました！コンテンツは HTML 内にマークアップされ、一方でページのロジックは JavaScript に別々に存在していました。

**HTML:**

```html
<div>
  <p>これは段落です</p>
  <form>
    <input type="text" />
  </form>
</div>
```

**JavaScript:**

```js
isLoggedIn() { ... }
onClick() { ... }
onSubmit() { ... }
```

しかし、Web がよりインタラクティブになるにつれて、ロジックがコンテンツを決定することが増えてきました。JavaScript が HTML を担当するようになったのです！これが、**React では、レンダリングロジックとマークアップが同じ場所—コンポーネント—に一緒に存在する**理由です。

**Sidebar.js (React コンポーネント)**

```jsx
// レンダリングロジック
isLoggedIn()

// マークアップ
<aside>
  <p>...</p>
  <form>
    <input />
  </form>
</aside>
```

**Form.js (React コンポーネント)**

```jsx
// レンダリングロジック
onClick()
onSubmit()

// マークアップ
<form>
  <input onClick />
  <input onSubmit />
</form>
```

ボタンのレンダリングロジックとマークアップを一緒にしておくことで、編集のたびに互いに同期し続けることが保証されます。逆に、ボタンのマークアップやサイドバーのマークアップのように、互いに無関係な詳細は互いに分離されているため、それぞれを単独で変更する方が安全です。

各 React コンポーネントは、React がブラウザにレンダーする何らかのマークアップを含む JavaScript 関数です。React コンポーネントは JSX と呼ばれる拡張構文を使用してマークアップを表現します。JSX は HTML によく似ていますが、少し厳格で、動的な情報を表示することができます。

> 注意
>
> JSX と React は別物です。[一緒に使われることが多い](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)ですが、[独立して使用できます](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-different-in-the-new-transform)。JSX は構文拡張ですが、React はライブラリです。

## HTML を JSX に変換する

次のような（完全に有効な）HTML があるとします。

```html
<h1>Hedy Lamarr's Todos</h1>
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  class="photo"
>
<ul>
  <li>Invent new traffic lights
  <li>Rehearse a movie scene
  <li>Improve the spectrum technology
</ul>
```

そして、これをコンポーネントに入れたいとします。

```jsx
export default function TodoList() {
  return (
    // これは動作しません！
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

このまま貼り付けても動作しません。JSX は HTML よりも厳格で、いくつかの追加ルールがあるためです！上記のエラーメッセージを読めば、マークアップを修正する方法が導かれます。または、以下のガイドに従うこともできます。

> 注意
>
> ほとんどの場合、React の画面上のエラーメッセージが問題の場所を見つけるのに役立ちます。行き詰まったらそれらを読んでください！

## JSX のルール

### 1. 単一のルート要素を返す

コンポーネントから複数の要素を返すには、**単一の親タグでラップします**。

例えば、`<div>` を使用できます。

```jsx
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```

マークアップに余分な `<div>` を追加したくない場合は、代わりに `<>` と `</>` を書くことができます。

```jsx
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

この空のタグは [*Fragment*](/reference/react/Fragment) と呼ばれます。Fragment を使用すると、ブラウザの HTML ツリーに痕跡を残さずにグループ化できます。

> Deep Dive
>
> ### なぜ複数の JSX タグをラップする必要があるのか？
>
> JSX は HTML のように見えますが、内部的には単純な JavaScript オブジェクトに変換されます。2 つのオブジェクトを配列にラップせずに関数から返すことはできません。これが、別の タグまたは Fragment にラップせずに 2 つの JSX タグを返すことができない理由を説明しています。

### 2. すべてのタグを閉じる

JSX では、タグを明示的に閉じる必要があります。`<img>` のような自己閉じタグは `<img />` にしなければなりませんし、`<li>oranges` のようなラップタグは `<li>oranges</li>` と書く必要があります。

Hedy Lamarr の画像とリストアイテムを閉じたものは以下のようになります。

```jsx
<>
  <img
    src="https://i.imgur.com/yXOvdOSs.jpg"
    alt="Hedy Lamarr"
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. ほとんどすべてをキャメルケースに

JSX は JavaScript に変換され、JSX で書かれた属性は JavaScript オブジェクトのキーになります。コンポーネント内で、これらの属性を変数に読み込みたいことがよくあります。しかし、JavaScript には変数名に制限があります。例えば、名前にダッシュを含めたり、`class` のような予約語を使用したりすることはできません。

これが、React では、多くの HTML および SVG 属性がキャメルケースで書かれる理由です。例えば、`stroke-width` の代わりに `strokeWidth` を使用します。`class` は予約語なので、React では代わりに `className` を書きます。これは [対応する DOM プロパティ](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)にちなんで命名されています。

```jsx
<img
  src="https://i.imgur.com/yXOvdOSs.jpg"
  alt="Hedy Lamarr"
  className="photo"
/>
```

[これらすべての属性は React DOM 要素のリストで見つけることができます](/reference/react-dom/components/common)。間違えても心配しないでください。React は、可能な修正を含むメッセージを[ブラウザコンソール](https://developer.mozilla.org/docs/Tools/Browser_Console)に出力します。

> 注意
>
> 歴史的な理由から、[`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) と [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) 属性は HTML と同様にダッシュ付きで書かれます。

### プロのヒント：JSX コンバーターを使う

既存のマークアップのすべての属性を変換するのは面倒な場合があります！既存の HTML と SVG を JSX に変換するために[コンバーター](https://transform.tools/html-to-jsx)を使用することをお勧めします。コンバーターは実際には非常に便利ですが、それでも何が起こっているのかを理解することで、自分で快適に JSX を書けるようになる価値があります。

最終結果は次のようになります。

```jsx
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

## まとめ

これで、JSX が存在する理由と、コンポーネントでの使用方法がわかりました。

- React コンポーネントは、レンダリングロジックとマークアップを一緒にグループ化します。なぜなら、それらは関連しているからです。
- JSX は HTML に似ていますが、いくつか違いがあります。必要に応じて[コンバーター](https://transform.tools/html-to-jsx)を使用できます。
- エラーメッセージは、多くの場合、マークアップを修正する正しい方向を示してくれます。

## チャレンジ

### チャレンジ 1: HTML を JSX に変換する

この HTML がコンポーネントに貼り付けられましたが、有効な JSX ではありません。修正してください。

```jsx
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

手動で行うか、コンバーターを使用するかはあなた次第です！

#### 解決策

```jsx
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

この例では、修正が必要だったのは以下の点です。

1. すべてを単一のルート要素でラップする（この場合は `<div>`）
2. `class` を `className` に変更
3. `<br>` と `<img>` を自己閉じタグに変更（`<br />` と `<img />`）
4. 間違った入れ子を修正（`<b>` と `<i>` の順序）
