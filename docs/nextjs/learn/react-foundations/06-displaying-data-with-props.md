# Propsを使ったデータの表示

これまでのところ、`<Header />`コンポーネントを再利用すると、両方とも同じ内容が表示されていました。

```html
function Header() { return
<h1>Develop. Preview. Ship.</h1>
; } function HomePage() { return (
<div>
  <header />
  <header />
</div>
); }
```

しかし、異なるテキストを渡したい場合や、外部のソースからデータを取得するために事前に情報が分からない場合はどうでしょうか？

通常のHTML要素には、それらの要素の動作を変更する情報を渡すために使用できる属性があります。例えば、`<img>`要素の`src`属性を変更すると表示される画像が変わります。`<a>`タグの`href`属性を変更するとリンクの宛先が変わります。

同じように、Reactコンポーネントに情報を**プロパティ**として渡すことができます。これらは`props`と呼ばれます。例えば、ボタンコンポーネントの可能なバリエーションを考えてみましょう：

![プライマリ、セカンダリ、無効化の3つのバリエーションを示すボタンコンポーネントの図](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flearn-props.png&w=3840&q=75)

JavaScript関数と同様に、コンポーネントの動作や画面にレンダリングされる際に視覚的に表示される内容を変更するカスタム引数（またはprops）を受け入れるコンポーネントを設計できます。そして、これらのpropsを親コンポーネントから子コンポーネントに渡すことができます。

> **注意**: Reactでは、データはコンポーネントツリーを下向きに流れます。これは一方向データフローと呼ばれます。次の章で説明するstateは、propsとして親から子コンポーネントに渡すことができます。

## propsの使用

`HomePage`コンポーネントでは、HTML属性を渡すのと同じように、`Header`コンポーネントにカスタム`title` propを渡すことができます：

```html
function HomePage() { return (
<div>
  <header title="React" />
</div>
); }
```

そして子コンポーネントである`Header`は、最初の関数パラメータとしてそれらのpropsを受け取ることができます：

```html
function Header(props) { return
<h1>Develop. Preview. Ship.</h1>
; }
```

`console.log()`でpropsを確認すると、titleプロパティを持つオブジェクトであることがわかります。

```html
function Header(props) { console.log(props); // { title: "React" } return
<h1>Develop. Preview. Ship.</h1>
; }
```

propsはオブジェクトなので、[オブジェクト分割代入](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)を使用して、関数パラメータ内でpropsの値を明示的に名前付けできます：

```html
function Header({ title }) { console.log(title); // "React" return
<h1>Develop. Preview. Ship.</h1>
; }
```

そして、`<h1>`タグの内容をtitle変数に置き換えることができます。

```html
function Header({ title }) { console.log(title); return
<h1>title</h1>
; }
```

ブラウザでファイルを開くと、実際の単語「title」が表示されているのがわかります。これは、ReactがプレーンテキストストリングをDOMにレンダリングしようとしていると認識しているためです。

これがJavaScript変数であることをReactに伝える方法が必要です。

## JSXでの変数の使用

`title` propを使用するには、波括弧`{}`を追加します。これらは、JSXマークアップ内で直接通常のJavaScriptを書くことができる特別なJSX構文です。

```html
function Header({ title }) { console.log(title); return
<h1>{title}</h1>
; }
```

波括弧は、「JSXランド」にいながら「JavaScriptランド」に入る方法と考えることができます。波括弧内には任意のJavaScript式（単一の値に評価されるもの）を追加できます。例えば：

1. ドット記法を使ったオブジェクトプロパティ：

```js
function Header(props) {
  return <h1>{props.title}</h1>;
}
```

2. テンプレートリテラル：

```js
function Header({ title }) {
  return <h1>{`Cool ${title}`}</h1>;
}
```

3. 関数の戻り値：

```js
function createTitle(title) {
  if (title) {
    return title;
  } else {
    return "Default title";
  }
}

function Header({ title }) {
  return <h1>{createTitle(title)}</h1>;
}
```

4. または三項演算子：

```js
function Header({ title }) {
  return <h1>{title ? title : "Default Title"}</h1>;
}
```

title propに任意の文字列を渡すことができるようになりました。または、三項演算子を使用した場合、コンポーネントでデフォルトケースを考慮しているため、title propを全く渡さないことも可能です：

```js
function Header({ title }) {
  return <h1>{title ? title : "Default title"}</h1>;
}

function HomePage() {
  return (
    <div>
      <Header />
    </div>
  );
}
```

コンポーネントは、アプリケーションの異なる部分で再利用できる汎用的なtitle propを受け入れるようになりました。必要なのは、title文字列を変更することだけです：

```html
function HomePage() { return (
<div>
  <header title="React" />
  <header title="A new title" />
</div>
); }
```

## リストの反復処理

リストとして表示する必要があるデータを持つことは一般的です。配列メソッドを使用してデータを操作し、スタイルは同一だが異なる情報を保持するUI要素を生成できます。

`HomePage`コンポーネントに以下の名前の配列を追加します：

```html
function HomePage() { const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret
Hamilton']; return (
<div>
  <header title="Develop. Preview. Ship." />
  <ul>
    {names.map((name) => (
    <li>{name}</li>
    ))}
  </ul>
</div>
); }
```

そして、`array.map()`メソッドを使用して配列を反復処理し、アロー関数を使用して名前をリスト項目にマップできます：

```html
function HomePage() { const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret
Hamilton']; return (
<div>
  <header title="Develop. Preview. Ship." />
  <ul>
    {names.map((name) => (
    <li>{name}</li>
    ))}
  </ul>
</div>
); }
```

波括弧を使用して「JavaScript」と「JSX」ランドを行き来していることに注意してください。

このコードを実行すると、Reactは欠落している`key` propについて警告を出します。これは、ReactがDOMでどの要素を更新するかを知るために、配列内の項目を一意に識別する何かが必要だからです。

現在は一意なので名前を使用できますが、アイテムIDのような一意性が保証されているものを使用することが推奨されます。

```html
function HomePage() { const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret
Hamilton']; return (
<div>
  <header title="Develop. Preview. Ship." />
  <ul>
    {names.map((name) => (
    <li key="{name}">{name}</li>
    ))}
  </ul>
</div>
); }
```

## 追加リソース

- [コンポーネントにpropsを渡す](https://react.dev/learn/passing-props-to-a-component)
- [リストのレンダリング](https://react.dev/learn/rendering-lists)
- [条件付きレンダリング](https://react.dev/learn/conditional-rendering)

## 第6章を完了しました

propsを使用してデータを表示する方法を学びました。

### 次のステップ

**第7章: ステートを使ったインタラクティビティの追加**

Reactのステートとイベントリスナーを使用してインタラクティビティを追加する方法を学びます。

[第7章を開始](https://nextjs.org/learn/react-foundations/updating-state)
