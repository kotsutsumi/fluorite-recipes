# コンポーネントに props を渡す

React コンポーネントは互いにやりとりをする際に *props* というものを使います。親コンポーネントは子コンポーネントに props を渡すことで情報を伝えることができるのです。props は HTML の属性と似ていると思われるかもしれませんが、props ではオブジェクトや配列、関数などのあらゆる JavaScript の値を渡すことができます。

## このページで学ぶこと

- コンポーネントに props を渡す方法
- コンポーネントから props を読み出す方法
- props のデフォルト値を指定する方法
- コンポーネントに JSX を渡す方法
- props は時間とともに変化する

## お馴染みの props

props とは JSX タグに渡す情報のことです。例えば `className`、`src`、`alt`、`width` や `height` は、`<img>` に渡すことのできる props の例です。

```jsx
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

`<img>` に渡すことができる props の種類は事前に決められています（ReactDOM は [HTML 標準](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)に準拠しています）。しかし、あなた独自のコンポーネント、例えば `<Avatar>` などの場合は、任意の props を渡してそれをカスタマイズできます。やり方はこちらです！

## コンポーネントに props を渡す

このコードでは、`Profile` コンポーネントは何も子コンポーネントに props を渡していません。

```jsx
export default function Profile() {
  return (
    <Avatar />
  );
}
```

以下の 2 ステップで `Avatar` に props を渡すことができます。

### Step 1: 子コンポーネントに props を渡す

まず、`Avatar` にいくつかの props を渡します。例えば、`person`（オブジェクト）と `size`（数値）という 2 つの props を渡してみましょう。

```jsx
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

> **補足**
>
> `person=` の後の二重の波括弧 `{{` と `}}` に混乱したなら、これは [JSX の波括弧内のオブジェクトである](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)というだけのことだと思い出しましょう。

これで `Avatar` コンポーネント内でこれらの props を読み出すことができます。

### Step 2: 子コンポーネント内で props を読み出す

これらの props を読み出すには、`function Avatar` の直後の `(` と `)` の間に、カンマ区切りで `{ person, size }` という名前を列挙します。これにより、変数のように `Avatar` のコード内でそれらを使用できます。

```jsx
function Avatar({ person, size }) {
  // person と size はここで利用可能
}
```

ロジックを加えて、レンダー時に `person` と `size` の props を使う `Avatar` を作成したら完成です。

これで `Avatar` を、異なる props を使って様々な方法でレンダーできるようになります。値を変えてみてください！

```jsx
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma',
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

props によって、親コンポーネントと子コンポーネントを独立して考えることができるようになります。例えば、`Avatar` がそれらをどのように使用するかを考えることなく、`Profile` 内の `person` や `size` を変更できます。同様に、`Profile` を見ることなく、`Avatar` がこれらの props をどのように使用するかを変更できます。

props は調整可能な「つまみ」のようなものだと考えることができます。関数における引数と同じ役割を果たします。実際、props はコンポーネントに対する唯一の引数なのです！ React コンポーネント関数は単一の引数、つまり `props` オブジェクトを受け取ります。

```jsx
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

通常、`props` オブジェクト全体が必要になることはないため、個別の props に分割代入します。

> **注意**
>
> props を宣言するときの `(` と `)` の内側にある**波括弧 `{` と `}`** のペアを忘れないでください。
>
> ```jsx
> function Avatar({ person, size }) {
>   // ...
> }
> ```
>
> この構文は「[分割代入](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter)」と呼ばれ、関数の引数からプロパティを読み取るのと同等です。
>
> ```jsx
> function Avatar(props) {
>   let person = props.person;
>   let size = props.size;
>   // ...
> }
> ```

## prop のデフォルト値を指定する

値が指定されていない場合のフォールバック用のデフォルト値を prop に与えたい場合、分割代入で変数名の直後に `=` とデフォルト値を書くことで指定できます。

```jsx
function Avatar({ person, size = 100 }) {
  // ...
}
```

これで、`<Avatar person={...} />` が `size` prop なしでレンダーされた場合、`size` は `100` に設定されます。

デフォルト値は、`size` prop が欠けている場合、あるいは `size={undefined}` を渡した場合のみ使用されます。しかし、`size={null}` や `size={0}` を渡した場合、デフォルト値は使用**されません**。

## JSX スプレッド構文で props を転送する

時々、props を渡すコードは非常に反復的になります。

```jsx
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

反復的なコードが悪いわけではありません。読みやすくなることもあります。しかし、時には簡潔さを重視したいこともあるでしょう。`Profile` が `Avatar` に対して行っているように、一部のコンポーネントはすべての props をそのまま子に転送します。それらは自分で直接 props を使用しないため、以下のようなよりコンパクトな「スプレッド」構文を使うのが合理的です。

```jsx
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

これにより、`Profile` のすべての props が、それらの名前を列挙することなく `Avatar` に転送されます。

**スプレッド構文は控えめに使用してください。** 他のすべてのコンポーネントでそれを使用している場合、何かがおかしいです。多くの場合、これはコンポーネントを分割し、子を JSX として渡すべきであることを示しています。次でさらに詳しく説明します！

## 子を JSX として渡す

ブラウザの組み込みタグをネストするのは一般的です。

```jsx
<div>
  <img />
</div>
```

時には、自分自身のコンポーネントも同じようにネストしたいことがあるでしょう。

```jsx
<Card>
  <Avatar />
</Card>
```

JSX タグ内にコンテンツをネストすると、親コンポーネントはそのコンテンツを `children` という props で受け取ります。例えば、以下の `Card` コンポーネントは、`<Avatar />` に設定された `children` prop を受け取り、それをラッパーの div 内にレンダーします。

```jsx
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
```

`<Card>` 内の `<Avatar>` を何かテキストに置き換えて、`Card` コンポーネントが任意のネストされたコンテンツをラップできることを確認してみてください。`Card` は、内部に何がレンダーされているかを「知る」必要はありません。この柔軟なパターンは多くの場所で見られます。

`children` prop を持つコンポーネントは、親コンポーネントが任意の JSX で「埋める」ことのできる「穴」があると考えることができます。`children` prop は、パネルやグリッドなどの視覚的なラッパーによく使用されます。

## props は時間とともに変化する

以下の `Clock` コンポーネントは、親コンポーネントから `color` と `time` という 2 つの props を受け取ります（親コンポーネントのコードは省略されています。これは、まだ説明していない [state](/learn/state-a-components-memory) を使用しているためです）。

以下のセレクトボックスで色を変更してみてください。

```jsx
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

この例は、**コンポーネントは時間とともに異なる props を受け取る可能性がある**ことを示しています。props は常に静的ではありません！ ここでは、`time` prop は毎秒変化し、`color` prop はあなたが別の色を選択すると変化します。props は、最初だけでなく、あらゆる時点でのコンポーネントのデータを反映します。

しかし、props は[イミュータブル](https://en.wikipedia.org/wiki/Immutable_object)（不変）です。これはコンピュータサイエンスの用語で「変更できない」という意味です。コンポーネントがその props を変更する必要がある場合（例えば、ユーザの操作や新しいデータに応答して）、親コンポーネントに*異なる props*、つまり新しいオブジェクトを渡すように「依頼」する必要があります！ そうすると古い props は破棄され、最終的には JavaScript エンジンがそれらが使用していたメモリを回収します。

**props を「変更」しようとしないでください。** ユーザ入力に応答する必要がある場合（選択した色を変更するなど）は、[state をセットする](/learn/state-a-components-memory)必要があります。これについては、state: コンポーネントのメモリで学びます。

## まとめ

- props を渡すには、HTML 属性の場合と同じように JSX に追加します。
- props を読み出すには、`function Avatar({ person, size })` のように分割代入構文を使用します。
- `size = 100` のようにデフォルト値を指定できます。これは欠けている props や `undefined` の props に使用されます。
- `<Avatar {...props} />` という JSX スプレッド構文ですべての props を転送できますが、使いすぎないでください！
- `<Card><Avatar /></Card>` のようなネストされた JSX は、`Card` コンポーネントの `children` prop として表示されます。
- props は読み取り専用のスナップショットです。レンダーごとに新しいバージョンの props を受け取ります。
- props を変更することはできません。インタラクティビティが必要な場合は、state を設定する必要があります。

---

**原文:** https://react.dev/learn/passing-props-to-a-component
