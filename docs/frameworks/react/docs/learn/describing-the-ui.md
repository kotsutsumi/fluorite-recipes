# UI の記述

React は、ユーザインターフェース（UI）を表示するための JavaScript ライブラリです。UI は小さな要素（ボタン、テキスト、画像）から構成され、React では、これらを**コンポーネント**にネストして再利用できます。Web サイトの大小に関わらず、サイドバーからページ全体まで、画面上のすべてがコンポーネントに分解されます。この章では、React コンポーネントを作成、カスタマイズ、条件付きで表示する方法を学びます。

## この章で学ぶこと

- [初めてのコンポーネントの書き方](/learn/your-first-component)
- [コンポーネントファイルを複数に分ける理由とその方法](/learn/importing-and-exporting-components)
- [JSX を使って JavaScript にマークアップを追加する方法](/learn/writing-markup-with-jsx)
- [JSX 内で波括弧を使って JavaScript の機能にアクセスする方法](/learn/javascript-in-jsx-with-curly-braces)
- [コンポーネントを props を使ってカスタマイズする方法](/learn/passing-props-to-a-component)
- [コンポーネントを条件付きでレンダーする方法](/learn/conditional-rendering)
- [複数のコンポーネントを同時にレンダーする方法](/learn/rendering-lists)
- [コンポーネントを純粋に保つことで混乱を避ける方法](/learn/keeping-components-pure)
- [UI をツリーとして理解することが有用である理由](/learn/understanding-your-ui-as-a-tree)

## 初めてのコンポーネント

React アプリケーションは、**コンポーネント**と呼ばれる独立した UI の部品から構築されます。React コンポーネントは、マークアップを添えることができる JavaScript 関数です。コンポーネントは、ボタンのような小さなものから、ページ全体のような大きなものまで様々です。以下は、3 つの `Profile` コンポーネントをレンダーする `Gallery` コンポーネントの例です。

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

[**初めてのコンポーネントを読む**](/learn/your-first-component)

## コンポーネントのインポートとエクスポート

1 つのファイルに複数のコンポーネントを宣言することもできますが、ファイルが大きくなると扱いにくくなります。この問題を解決するには、コンポーネントを独自のファイルに**エクスポート**し、別のファイルからそのコンポーネントを**インポート**します。

```jsx
import Profile from './Profile.js';

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

[**コンポーネントのインポートとエクスポートを読む**](/learn/importing-and-exporting-components)

## JSX でマークアップを記述する

各 React コンポーネントは、React がブラウザにレンダーする何らかのマークアップを含んだ JavaScript 関数です。React コンポーネントは JSX と呼ばれる拡張構文を使用してマークアップを表現します。JSX は HTML によく似ていますが、少し厳格で、動的な情報を表示することができます。

既存の HTML マークアップを React コンポーネントに貼り付けても、常に動作するとは限りません。

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

このような既存の HTML がある場合は、[コンバーター](https://transform.tools/html-to-jsx)を使って修正できます。

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

[**JSX でマークアップを記述するを読む**](/learn/writing-markup-with-jsx)

## JSX に波括弧で JavaScript を含める

JSX により、JavaScript ファイル内に HTML のようなマークアップを書くことができ、レンダリングロジックとコンテンツを同じ場所にまとめられるようになります。時には、そのマークアップの中に JavaScript のロジックを少し追加したり、動的なプロパティを参照したくなることがあります。このような状況では、JSX 内で波括弧を使用して、JavaScript への窓を開くことができます。

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

[**JSX に波括弧で JavaScript を含めるを読む**](/learn/javascript-in-jsx-with-curly-braces)

## コンポーネントに props を渡す

React コンポーネントは **props** を使用して互いに通信します。すべての親コンポーネントは、子コンポーネントに props を与えることで、いくつかの情報を渡すことができます。props は HTML 属性を思い起こさせるかもしれませんが、オブジェクト、配列、関数など、あらゆる JavaScript の値を props として渡すことができます。

```jsx
import { getImageUrl } from './utils.js';

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

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}
```

[**コンポーネントに props を渡すを読む**](/learn/passing-props-to-a-component)

## 条件付きレンダー

コンポーネントは、条件に応じて異なるものを表示する必要があることがよくあります。React では、`if` 文、`&&`、`? :` 演算子などの JavaScript 構文を使用して、JSX を条件付きでレンダーすることができます。

この例では、JavaScript の `&&` 演算子を使用して、チェックマークを条件付きでレンダーしています。

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

[**条件付きレンダーを読む**](/learn/conditional-rendering)

## リストのレンダー

データの集まりから複数の類似したコンポーネントを表示したいことがよくあります。React では、JavaScript の `filter()` と `map()` を使用して、データの配列をフィルタリングし、コンポーネントの配列に変換することができます。

配列の各項目に対して、`key` を指定する必要があります。通常は、データベースからの ID を `key` として使用します。key により、リストが変更されても、React は各項目の位置を追跡することができます。

```jsx
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

[**リストのレンダーを読む**](/learn/rendering-lists)

## コンポーネントを純粋に保つ

一部の JavaScript 関数は**純粋**です。純粋関数とは以下のような関数です。

- **自分の仕事に専念する**。関数が呼ばれる前に存在していたオブジェクトや変数を変更しない。
- **同じ入力、同じ出力**。純粋関数は、同じ入力を与えると、常に同じ結果を返す。

コンポーネントを厳密に純粋関数としてのみ記述することで、コードベースが成長するにつれて、わかりにくいバグや予測不可能な動作を回避することができます。以下は不純なコンポーネントの例です。

```jsx
let guest = 0;

function Cup() {
  // 悪い例：既存の変数を変更している！
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

既存の変数を変更する代わりに、prop を渡すことで、このコンポーネントを純粋にすることができます。

```jsx
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

[**コンポーネントを純粋に保つを読む**](/learn/keeping-components-pure)

## UI をツリーとして理解する

React は、コンポーネントと props の関係をモデル化するためにツリー構造を使用します。React レンダーツリーは、コンポーネント間の親子関係を表現したものです。

```
App
├── Section
│   ├── Heading
│   └── List
│       ├── Item
│       ├── Item
│       └── Item
```

ツリーの最上部、ルートコンポーネント近くにあるコンポーネントは、トップレベルのコンポーネントと見なされます。子コンポーネントを持たないコンポーネントは、リーフコンポーネントです。コンポーネントのこの分類は、データフローとレンダリングパフォーマンスを理解する上で役立ちます。

JavaScript モジュール間の関係をモデル化することも、アプリを理解する上で有用な方法です。これをモジュール依存関係ツリーと呼びます。

```
App.js
├── Section.js
├── Heading.js
└── List.js
    ├── Item.js
    └── data.js
```

依存関係ツリーは、アプリを実行するために必要な JavaScript コードをバンドルするためにビルドツールによって使用されます。バンドルサイズが大きいと、ユーザ体験が低下し、UI のペイントが遅くなります。アプリのモジュール依存関係ツリーを理解することは、このような問題をデバッグするのに役立ちます。

[**UI をツリーとして理解するを読む**](/learn/understanding-your-ui-as-a-tree)

## 次のステップ

[初めてのコンポーネント](/learn/your-first-component)に進んで、この章をページごとに読み始めましょう！

または、これらのトピックに既に精通している場合は、[インタラクティビティの追加](/learn/adding-interactivity)について読んでみましょう。
