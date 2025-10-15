# React の流儀

React は、あなたが設計を考える方法やアプリを構築する方法を変化させます。React でユーザインターフェースを構築する際には、まず UI を*コンポーネント*と呼ばれる部品に分割します。次に、各コンポーネントのさまざまな視覚的状態を記述します。最後に、複数のコンポーネントを接続し、それらの間をデータが流れるようにします。このチュートリアルでは、React を使って検索可能な商品データテーブルを作成する際の思考プロセスについて説明します。

## このページで学ぶこと

- React における思考法
- React コンポーネントの作成方法
- State の管理方法

## モックアップから始める

あなたが既に JSON API とデザイナからのモックアップを持っているとしましょう。

JSON API は以下のようなデータを返します：

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

モックアップは以下のようなものです：

[検索ボックスとチェックボックス、商品リストを含むフィルタ可能な商品テーブルのイメージ]

React で UI を実装するには、通常以下の 5 つのステップを踏みます。

## ステップ 1：UI をコンポーネントの階層に分割する

まず、モックアップ内のすべてのコンポーネントとサブコンポーネントの周りに四角を描き、それぞれに名前を付けます。デザイナと一緒に仕事をしている場合、彼らが既にデザインツールでこれらのコンポーネントに名前を付けているかもしれません。確認してみましょう！

バックグラウンドに応じて、設計をコンポーネントに分割する方法は異なります：

- **プログラミング** - 新しい関数やオブジェクトを作成するかどうかを決める時と同じ手法を使います。そのような手法の 1 つが[単一責任の原則](https://ja.wikipedia.org/wiki/%E5%8D%98%E4%B8%80%E8%B2%AC%E4%BB%BB%E3%81%AE%E5%8E%9F%E5%89%87)です。コンポーネントは理想的には 1 つのことだけを行うべきです。もしそれが大きくなりすぎたら、より小さなサブコンポーネントに分解するべきです。
- **CSS** - クラスセレクタを何に対して作るかを考えます。（ただし、コンポーネントは少し粒度が粗めです。）
- **デザイン** - デザインのレイヤをどう構成するかを考えます。

JSON が適切に構造化されている場合、UI のコンポーネント構造に自然にマッピングされることがよくあります。これは、UI とデータモデルが同じ情報アーキテクチャ、つまり同じ形状を持つことが多いためです。UI をコンポーネントに分割し、各コンポーネントがデータモデルの 1 つの部分に対応するようにします。

この画面には 5 つのコンポーネントがあります：

1. `FilterableProductTable`（グレー）全体のアプリを含みます
2. `SearchBar`（青）ユーザの入力を受け取ります
3. `ProductTable`（ラベンダー）ユーザの入力に基づいてリストを表示およびフィルタします
4. `ProductCategoryRow`（緑）各カテゴリの見出しを表示します
5. `ProductRow`（黄色）各商品の行を表示します

`ProductTable` を見ると、テーブルのヘッダ（"Name" と "Price" のラベルを含む）が独自のコンポーネントではないことがわかります。これは好みの問題であり、どちらの方法でも構いません。この例では、`ProductTable` のリストの一部として表示されるため、`ProductTable` の一部です。ただし、このヘッダが複雑になった場合（例えば、ソートを追加する場合）、独自の `ProductTableHeader` コンポーネントに移動させることができます。

モックアップ内のコンポーネントを特定したので、それらを階層に並べます。モックアップ内で別のコンポーネント内に表示されるコンポーネントは、階層では子として表示されるべきです：

- `FilterableProductTable`
  - `SearchBar`
  - `ProductTable`
    - `ProductCategoryRow`
    - `ProductRow`

## ステップ 2：React で静的なバージョンを作成する

コンポーネントの階層ができたので、アプリを実装する時間です。最も簡単なアプローチは、インタラクティブ機能を追加せずに、データモデルから UI をレンダーするバージョンを作成することです。静的バージョンを最初に作成し、後でインタラクティブ機能を追加する方が簡単なことがよくあります。静的バージョンの作成にはたくさんのタイピングが必要ですが考えることは少なく、インタラクティブ機能の追加には考えることが多くてタイピングは少なめです。

データモデルをレンダーするアプリの静的バージョンを作成するには、他のコンポーネントを再利用して [props](/learn/passing-props-to-a-component) を使ってデータを渡す[コンポーネント](/learn/your-first-component)を作成します。props は、親から子にデータを渡す方法です。（[state](/learn/state-a-components-memory) の概念に慣れている場合、この静的バージョンを作成する際に state は一切使わないでください。state はインタラクティブ性、つまり時間とともに変化するデータのためだけのものです。これはアプリの静的バージョンなので、必要ありません。）

「トップダウン」でアプリを作成する（階層の上位のコンポーネント、例えば `FilterableProductTable` から始める）か、「ボトムアップ」で作成する（下位のコンポーネント、例えば `ProductRow` から始める）ことができます。簡単な例では、トップダウンで進める方が簡単で、大規模プロジェクトではボトムアップで進めてテストを書きながら進める方が簡単です。

```jsx
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

（このコードが難しく感じる場合は、まず[クイックスタート](/learn/)を読んでください！）

コンポーネントを作成した後、データモデルをレンダーする再利用可能なコンポーネントのライブラリができました。これは静的アプリなので、コンポーネントは JSX を返すだけです。階層の一番上のコンポーネント (`FilterableProductTable`) は、props としてデータモデルを受け取ります。これは*単方向データフロー*と呼ばれます。データはトップレベルのコンポーネントから木構造の末端のコンポーネントに流れます。

> ### 補足
>
> この時点では、state の値を一切使用していません。それは次のステップで行います！

## ステップ 3：UI の状態を最小限かつ完全に表現する方法を見つける

UI をインタラクティブにするには、ユーザが基礎となるデータモデルを変更できるようにする必要があります。そのために *state* を使用します。

state は、アプリが記憶する必要のある変化するデータの最小セットと考えてください。state を構造化する際の最も重要な原則は、[DRY（Don't Repeat Yourself）](https://ja.wikipedia.org/wiki/Don%27t_repeat_yourself)を保つことです。アプリケーションが必要とする state の絶対的な最小表現を考え、それ以外のすべてはオンデマンドで計算します。例えば、ショッピングリストを作成している場合、アイテムを state の配列として保存できます。リスト内のアイテム数も表示したい場合は、アイテム数を別の state 値として保存するのではなく、配列の長さを読み取ります。

このサンプルアプリケーションのすべてのデータを考えてみましょう：

1. 商品の元のリスト
2. ユーザが入力した検索テキスト
3. チェックボックスの値
4. フィルタされた商品のリスト

これらのうち、どれが state でしょうか？ state ではないものを特定します：

- 時間とともに**変化しない**ものですか？ そうであれば、state ではありません。
- 親から **props 経由で渡される**ものですか？ そうであれば、state ではありません。
- コンポーネント内の既存の state や props に基づいて**計算できます**か？ そうであれば、*絶対に* state ではありません！

残ったものがおそらく state です。

もう一度 1 つずつ見ていきましょう：

1. 商品の元のリストは **props として渡されるので、state ではありません**。
2. 検索テキストは時間とともに変化し、何からも計算できないので、state のようです。
3. チェックボックスの値は時間とともに変化し、何からも計算できないので、state のようです。
4. フィルタされた商品のリストは、元の商品リストを取得し、検索テキストとチェックボックスの値に従ってフィルタすることで**計算できるので、state ではありません**。

つまり、検索テキストとチェックボックスの値だけが state です！よくできました！

> ### Deep Dive
>
> #### Props vs State
>
> React には 2 種類の「モデル」データがあります：props と state です。この 2 つは非常に異なります：
>
> - [**Props** は関数に渡す引数のようなものです](/learn/passing-props-to-a-component)。親コンポーネントが子コンポーネントにデータを渡し、その外観をカスタマイズできるようにします。例えば、`Form` は `Button` に `color` prop を渡すことができます。
> - [**State** はコンポーネントのメモリのようなものです](/learn/state-a-components-memory)。コンポーネントが情報を追跡し、インタラクションに応じて変更できるようにします。例えば、`Button` は `isHovered` state を追跡することがあります。
>
> Props と state は異なりますが、一緒に機能します。親コンポーネントは、何らかの情報を state に保持し（変更できるように）、それを子コンポーネントに props として*渡す*ことがよくあります。最初の読み方でこの違いがまだあいまいに感じても大丈夫です。少し練習すれば定着します！

## ステップ 4：state を保持すべき場所を特定する

アプリの最小限の state データを特定した後、その state を変更する責任を持つコンポーネント、つまり state を*所有*するコンポーネントを特定する必要があります。覚えておいてください：React は単方向データフローを使用し、データは親コンポーネントから子コンポーネントへとコンポーネント階層を下って渡されます。どのコンポーネントがどの state を所有すべきかは、すぐには明確でないかもしれません。この概念に初めて触れる場合は難しいかもしれませんが、以下のステップに従えば理解できます！

アプリケーション内の各 state について：

1. その state に基づいて何かをレンダーする*すべて*のコンポーネントを特定します。
2. それらに最も近い共通の親コンポーネント、つまり階層内でそれらすべての上にあるコンポーネントを見つけます。
3. state をどこに置くか決定します：
   1. 多くの場合、state を共通の親に直接置くことができます。
   2. state を共通の親の上位のコンポーネントに置くこともできます。
   3. state を所有するのに適したコンポーネントが見つからない場合は、state を保持するためだけの新しいコンポーネントを作成し、共通の親コンポーネントの上の階層のどこかに追加します。

前のステップでは、このアプリケーション内の 2 つの state、検索入力テキストとチェックボックスの値を見つけました。この例では、それらは常に一緒に表示されるので、同じ場所に配置するのが理にかなっています。

これらについて、上記の戦略を実行してみましょう：

1. **state を使用するコンポーネントを特定する：**
   - `ProductTable` は、その state（検索テキストとチェックボックスの値）に基づいて商品リストをフィルタする必要があります。
   - `SearchBar` は、その state（検索テキストとチェックボックスの値）を表示する必要があります。
2. **共通の親を見つける：** 両方のコンポーネントが共有する最初の親コンポーネントは `FilterableProductTable` です。
3. **state をどこに置くか決定する：** フィルタテキストとチェックされた state の値を `FilterableProductTable` に保持します。

つまり、state の値は `FilterableProductTable` に配置されます。

[`useState()` フック](/reference/react/useState)でコンポーネントに state を追加します。フックは React に「フックイン」できる特別な関数です。`FilterableProductTable` の先頭に 2 つの state 変数を追加し、初期 state を指定します：

```jsx
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
```

次に、`filterText` と `inStockOnly` を `ProductTable` と `SearchBar` に props として渡します：

```jsx
<div>
  <SearchBar
    filterText={filterText}
    inStockOnly={inStockOnly} />
  <ProductTable
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

アプリケーションがどのように動作するかが見え始めます。以下のサンドボックスコードで `filterText` の初期値を `useState('')` から `useState('fruit')` に編集してください。検索入力テキストとテーブルの両方が更新されるのがわかります：

```jsx
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
      <label>
        <input
          type="checkbox"
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

上記のサンドボックスでフォームを編集してもまだ機能しないことに注意してください。上記のサンドボックスには、その理由を説明するコンソールエラーがあります：

```
Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field.
```

上記のサンドボックスでは、`ProductTable` と `SearchBar` が `filterText` と `inStockOnly` props を読み取ってテーブル、入力、チェックボックスをレンダーします。例えば、`SearchBar` が入力値を埋める方法は次のとおりです：

```jsx
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."/>
```

ただし、タイピングなどのユーザアクションに応答するコードはまだ追加していません。これが最後のステップになります。

## ステップ 5：逆方向のデータフローを追加する

現在、アプリは階層を下って流れる props と state で正しくレンダーされています。しかし、ユーザ入力に応じて state を変更するには、反対方向のデータフローをサポートする必要があります：階層の深い場所にあるフォームコンポーネントが `FilterableProductTable` の state を更新する必要があります。

React はこのデータフローを明示的にしますが、双方向データバインディングよりも少し多くのタイピングが必要です。上記の例で入力またはチェックボックスをチェックしようとすると、React が入力を無視することがわかります。これは意図的です。`<input value={filterText} />` と書くことで、`input` の `value` prop を常に `FilterableProductTable` から渡される `filterText` state と等しくなるように設定しました。`filterText` state が設定されないため、入力は変更されません。

ユーザがフォーム入力を変更するたびに、state がそれらの変更を反映するようにしたいと考えています。state は `FilterableProductTable` が所有しているので、`setFilterText` と `setInStockOnly` を呼び出せるのはそのコンポーネントだけです。`SearchBar` が `FilterableProductTable` の state を更新できるようにするには、これらの関数を `SearchBar` に渡す必要があります：

```jsx
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar` 内で、`onChange` イベントハンドラを追加し、それらから親の state を設定します：

```jsx
<input
  type="text"
  value={filterText}
  placeholder="Search..."
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

これでアプリケーションが完全に機能するようになりました！

```jsx
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText} placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

イベントの処理と state の更新について、すべて [インタラクティビティの追加](/learn/adding-interactivity) セクションで学ぶことができます。

## ここからどこへ行くか

これは、React でコンポーネントとアプリケーションを構築する際の考え方についての非常に簡単な紹介でした。[React プロジェクトを始める](/learn/installation)こともできますし、このチュートリアルで使用したすべての構文について[もっと深く学ぶ](/learn/describing-the-ui)こともできます。

---

**ソース:** https://ja.react.dev/learn/thinking-in-react
