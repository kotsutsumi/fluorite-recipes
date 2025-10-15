# state：コンポーネントのメモリ

コンポーネントによっては、ユーザ操作の結果として画面上の表示内容を変更する必要があります。フォーム上でタイプすると入力欄が更新される、画像カルーセルで「次」をクリックすると表示される画像が変わる、「購入」をクリックすると買い物かごに商品が入る、といったものです。コンポーネントは、現在の入力値、現在の画像、ショッピングカートの状態といったものを「覚えておく」必要があります。React では、このようなコンポーネント固有のメモリのことを *state* と呼びます。

## このページで学ぶこと

- [`useState`](/reference/react/useState) フックを使って state 変数を追加する方法
- `useState` フックが返す 2 つの値
- 複数の state 変数を追加する方法
- state がローカルと呼ばれる理由

## 通常の変数では不十分な場合

以下は、彫刻のイメージをレンダーするコンポーネントです。「Next」ボタンをクリックすると、`index` を `1`、次に `2`、というように変更することで、次の彫刻を表示するはずです。しかし、これは**動作しません**（試してみてください！）：

```jsx
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

`handleClick` イベントハンドラがローカル変数 `index` を更新しています。しかし、2 つのことがその変更を見えなくしています。

1. **ローカル変数はレンダー間で保持されません**。React がこのコンポーネントを 2 回目にレンダーするとき、ゼロから レンダーします。ローカル変数への変更は考慮されません。
2. **ローカル変数への変更は、レンダーをトリガしません**。React は、新しいデータで再度コンポーネントをレンダーする必要があることに気付きません。

新しいデータでコンポーネントを更新するには、2 つのことが必要です。

1. レンダー間でデータを**保持**する。
2. React に新しいデータでコンポーネントをレンダーする（再レンダー）よう**トリガ**する。

[`useState`](/reference/react/useState) フックはこれら 2 つを提供します。

1. レンダー間でデータを保持するための **state 変数**。
2. 変数を更新し、React にコンポーネントを再度レンダーするようトリガする **state セッタ関数**。

## state 変数の追加

state 変数を追加するには、ファイルの先頭で React から `useState` をインポートします。

```jsx
import { useState } from 'react';
```

次に、この行を：

```jsx
let index = 0;
```

以下に置き換えます：

```jsx
const [index, setIndex] = useState(0);
```

`index` は state 変数で、`setIndex` はセッタ関数です。

> ここでの `[` と `]` 構文は、[配列の分割代入](https://javascript.info/destructuring-assignment)と呼ばれ、配列から値を読み取ることができます。`useState` が返す配列には常に正確に 2 つの項目があります。

これが `handleClick` での連携方法です。

```jsx
function handleClick() {
  setIndex(index + 1);
}
```

これで、「Next」ボタンをクリックすると現在の彫刻が切り替わります。

```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

### あなたの最初のフックとの出会い

React では、`useState` や、その他の "`use`" で始まる関数は、フック (Hook) と呼ばれます。

*フック*は、React が[レンダー中](/learn/render-and-commit#step-2-react-renders-your-components)にのみ利用可能な特別な関数です（次のページで詳しく説明します）。これらにより、さまざまな React の機能に「接続 (hook into)」できます。

state はそれらの機能のひとつにすぎませんが、他のフックについては後で説明します。

> **落とし穴**
>
> **`use` で始まるフックは、コンポーネントのトップレベルまたは[独自のフック](/learn/reusing-logic-with-custom-hooks)でのみ呼び出すことができます。**条件、ループ、またはその他のネストされた関数内でフックを呼び出すことはできません。フックは関数ですが、コンポーネントのニーズに関する無条件の宣言と考えると役立ちます。コンポーネントの先頭で React の機能を「使用 (use)」するのは、ファイルの先頭でモジュールを「インポート」するのと似ています。

### `useState` の構造

[`useState`](/reference/react/useState) を呼び出すとき、React に何かを覚えておくように指示しています。

```jsx
const [index, setIndex] = useState(0);
```

この場合、React に `index` を覚えておいてほしいのです。

> **注意**
>
> 慣例として、このペアを `const [something, setSomething]` のように命名します。好きな名前を付けることができますが、慣例に従うとプロジェクト間で理解しやすくなります。

`useState` の唯一の引数は、state 変数の**初期値**です。この例では、`index` の初期値は `useState(0)` によって `0` に設定されています。

コンポーネントがレンダーされるたびに、`useState` は 2 つの値を含む配列を返します。

1. 保存した値を持つ **state 変数** (`index`)。
2. state 変数を更新し、React にコンポーネントを再度レンダーするようトリガできる **state セッタ関数** (`setIndex`)。

実際の動作は次のとおりです。

```jsx
const [index, setIndex] = useState(0);
```

1. **コンポーネントが初めてレンダーされます。** `index` の初期値として `0` を `useState` に渡したため、`[0, setIndex]` が返されます。React は `0` が最新の state 値であることを記憶します。
2. **state を更新します。** ユーザがボタンをクリックすると、`setIndex(index + 1)` を呼び出します。`index` は `0` なので、`setIndex(1)` です。これにより、React は `index` が `1` であることを記憶し、別のレンダーをトリガします。
3. **コンポーネントの 2 回目のレンダー。** React はまだ `useState(0)` を見ていますが、`index` を `1` に設定したことを*記憶している*ため、今回は `[1, setIndex]` を返します。
4. 以下同様に続きます！

## コンポーネントに複数の state 変数を与える

1 つのコンポーネント内に、任意の数の、任意の型の state 変数を持つことができます。このコンポーネントには、数値の `index` と、「Show details」がクリックされたときに切り替わるブーリアンの `showMore` の 2 つの state 変数があります。

```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

この例の `index` と `showMore` のように、それらが互いに関連していない場合は、複数の state 変数を持つことをお勧めします。しかし、2 つの state 変数を頻繁に一緒に変更する場合は、それらを 1 つにまとめる方が簡単かもしれません。たとえば、多くのフィールドを持つフォームがある場合、フィールドごとに state 変数を持つよりも、オブジェクトを保持する単一の state 変数を持つ方が便利です。詳細については、[state の構造の選択](/learn/choosing-the-state-structure)をお読みください。

#### React はどの state を返すべきか、どうやって知るのですか？

`useState` の呼び出しが*どの* state 変数を参照しているかについての情報を受け取らないことに気付いたかもしれません。`useState` に渡される「識別子」はありませんが、それでもどの state 変数を返すかを知っています。これはどのように機能するのでしょうか？フックは、同じコンポーネントのすべてのレンダーで安定した呼び出し順序に依存しているからです。

実際には、上記のルール（「トップレベルでのみフックを呼び出す」）に従えば、これはうまく機能します。フックは常に同じ順序で呼び出されるため、React はそれらを正しく関連付けることができます。

内部的には、React は各コンポーネントに対して state のペアの配列を保持しています。また、レンダー前に `0` に設定される現在のペアインデックスも保持します。`useState` を呼び出すたびに、React は次の state のペアを提供し、インデックスをインクリメントします。このメカニズムの詳細については、[React フック: 魔法ではなく、ただの配列](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)で読むことができます。

この例は**React を使用していません**が、`useState` が内部でどのように機能するかのアイデアを提供します。

```jsx
let componentHooks = [];
let currentHookIndex = 0;

// React 内での useState の簡略版
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // これは最初のレンダーではないため、
    // state のペアは既に存在します。
    // それを返してインデックスを準備します。
    currentHookIndex++;
    return pair;
  }

  // これは初めてレンダーするため、
  // state のペアを作成してそれを保存します。
  pair = [initialState, setState];

  function setState(nextState) {
    // ユーザが state の変更をリクエストしたとき、
    // 新しい値をペアに入れます。
    pair[0] = nextState;
    updateDOM();
  }

  // 将来の使用のためにペアを保存し、
  // 次のフック呼び出しのための準備をします。
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // 各 useState() の呼び出しは次のペアを取得します。
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // この例は React を使用していないため、
  // JSX の代わりに出力オブジェクトを返します。
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} by ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `${showMore ? 'Hide' : 'Show'} details`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // コンポーネントをレンダーする前に
  // 現在のフックインデックスをリセットします。
  currentHookIndex = 0;
  let output = Gallery();

  // DOM を更新して出力と一致させます。
  // これは React があなたのために行う部分です。
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}];

// UI が初期状態と一致するようにします。
updateDOM();
```

React を使用するためにこれを理解する必要はありませんが、役立つメンタルモデルかもしれません。

## state は分離されプライベートである

state はスクリーン上のコンポーネントインスタンスに対してローカルです。つまり、**同じコンポーネントを 2 か所でレンダーすると、各コピーは完全に分離された state を持ちます！** 一方を変更しても、もう一方には影響しません。

この例では、先ほどの `Gallery` コンポーネントがロジックを変更せずに 2 回レンダーされます。各ギャラリ内のボタンをクリックしてみてください。それらの state が独立していることに注意してください。

```jsx
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}
```

これが、モジュールの先頭で宣言する通常の変数と state が異なる点です。state は特定の関数呼び出しや、コード内の場所に結び付けられているわけではありませんが、スクリーン上の特定の場所に「ローカル」です。2 つの `<Gallery />` コンポーネントをレンダーしたため、それらの state は個別に保存されます。

また、`Page` コンポーネントが `Gallery` の state や、それが state を持っているかどうかについて何も「知らない」ことにも注意してください。props とは異なり、**state はそれを宣言するコンポーネントに完全にプライベートです。** 親コンポーネントはそれを変更できません。これにより、他のコンポーネントに影響を与えることなく、任意のコンポーネントに state を追加または削除できます。

両方のギャラリが state を同期させたい場合はどうなるでしょうか？React でこれを行う正しい方法は、子コンポーネントから state を*削除*し、それらの最も近い共有親に追加することです。次のページではコンポーネントの state の整理に焦点を当てますが、今のところは[コンポーネント間での state の共有](/learn/sharing-state-between-components)に戻ります。

## まとめ

- コンポーネントがレンダー間で何らかの情報を「記憶」する必要がある場合は、state 変数を使用します。
- state 変数は `useState` フックを呼び出すことで宣言されます。
- フックは、`use` で始まる特別な関数です。state のような React 機能に「接続 (hook into)」できます。
- フックはインポートを思い出させるかもしれません。無条件に呼び出す必要があります。`useState` を含むフックの呼び出しは、コンポーネントのトップレベルまたは別のフックでのみ有効です。
- `useState` フックは、現在の state と、それを更新するための関数のペアを返します。
- 複数の state 変数を持つことができます。内部的には、React はそれらを順序で照合します。
- state はコンポーネントにプライベートです。2 か所でレンダーした場合、各コピーは独自の state を取得します。

## 次のステップ

[レンダーとコミット](/learn/render-and-commit)を読んで、React が UI をどのように更新するかを学びましょう。
