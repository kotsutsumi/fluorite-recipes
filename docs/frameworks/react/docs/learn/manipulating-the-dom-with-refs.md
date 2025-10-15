# ref で DOM を操作する

React は自動的に[レンダー出力に合致するよう DOM を更新する](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)ため、通常、コンポーネントが DOM を操作する必要はありません。しかし、時には React が管理している DOM 要素へのアクセスが必要になることがあります。例えば、ノードにフォーカスを当てたり、スクロールさせたり、そのサイズや位置を測定したりする場合です。React にはこれらを行うための組み込みの方法はないため、DOM ノードへの *ref* が必要になります。

<YouWillLearn>

- `ref` 属性を使用して React が管理する DOM ノードにアクセスする方法
- `ref` JSX 属性が `useRef` フックとどのように関連しているか
- 別のコンポーネントの DOM ノードにアクセスする方法
- React が管理する DOM を安全に変更できる場合

</YouWillLearn>

## ノードへの ref の取得

React が管理する DOM ノードにアクセスするには、まず `useRef` フックをインポートします。

```js
import { useRef } from 'react';
```

次に、コンポーネント内で ref を宣言します。

```js
const myRef = useRef(null);
```

最後に、DOM ノードを取得したい JSX タグに `ref` 属性として ref を渡します。

```js
<div ref={myRef}>
```

`useRef` フックは、`current` という単一のプロパティを持つオブジェクトを返します。最初は、`myRef.current` は `null` になります。React がこの `<div>` の DOM ノードを作成すると、React はこのノードへの参照を `myRef.current` に配置します。その後、[イベントハンドラ](/learn/responding-to-events)からこの DOM ノードにアクセスし、定義されている組み込みの[ブラウザ API](https://developer.mozilla.org/docs/Web/API/Element) を使用できます。

```js
// 任意のブラウザ API を使用できます。例えば：
myRef.current.scrollIntoView();
```

### 例：テキスト入力フィールドにフォーカスを当てる

この例では、ボタンをクリックすると入力フィールドにフォーカスが当たります。

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

これを実装するには：

1. `useRef` フックで `inputRef` を宣言します。
2. それを `<input ref={inputRef}>` として渡します。これにより、React に**この `<input>` の DOM ノードを `inputRef.current` に配置する**よう指示します。
3. `handleClick` 関数で、`inputRef.current` から入力 DOM ノードを読み取り、`inputRef.current.focus()` で [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) を呼び出します。
4. `<button>` の `onClick` に `handleClick` イベントハンドラを渡します。

DOM 操作が ref の最も一般的な使用例ですが、`useRef` フックは、タイマー ID など、React の外部の他のものを保存するためにも使用できます。state と同様に、ref はレンダー間で保持されます。ref は、設定しても再レンダーをトリガしない state 変数のようなものです。ref については、[ref で値を参照する](/learn/referencing-values-with-refs)で読むことができます。

### 例：要素にスクロールする

コンポーネントには複数の ref を持つことができます。この例では、3 つの画像のカルーセルがあります。各ボタンは、対応する DOM ノードでブラウザの [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) メソッドを呼び出して画像を中央に配置します。

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### ref コールバックを使用して ref のリストを管理する

上記の例では、定義済みの数の ref があります。しかし、リスト内の各アイテムに ref が必要で、いくつあるかわからない場合があります。以下のようなコードは**機能しません**。

```js
<ul>
  {items.map((item) => {
    // 機能しません！
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

これは、**フックはコンポーネントのトップレベルでのみ呼び出す必要がある**ためです。ループ、条件、または `map()` の呼び出し内で `useRef` を呼び出すことはできません。

この問題を回避する 1 つの方法は、親要素への単一の ref を取得してから、[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) のような DOM 操作メソッドを使用して、個々の子ノードを「見つける」ことです。しかし、これは脆弱で、DOM 構造が変更されると壊れる可能性があります。

別の解決策は、**`ref` 属性に関数を渡す**ことです。これは [`ref` コールバック](/reference/react-dom/components/common#ref-callback)と呼ばれます。React は、ref を設定する時が来たら DOM ノードで ref コールバックを呼び出し、ref をクリアする時が来たら `null` で呼び出します。これにより、独自の配列または [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) を維持し、そのインデックスまたは何らかの ID で任意の ref にアクセスできます。

この例は、このアプローチを使用して長いリスト内の任意のノードにスクロールする方法を示しています。

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // 初回使用時に Map を初期化します。
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Tom</button>
        <button onClick={() => scrollToCat(catList[5])}>Maru</button>
        <button onClick={() => scrollToCat(catList[9])}>Jellylorum</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat, node);
                } else {
                  map.delete(cat);
                }
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  width: 150px;
  height: 150px;
}
```

</Sandpack>

この例では、`itemsRef` は単一の DOM ノードを保持していません。代わりに、アイテム ID から DOM ノードへの [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) を保持しています。（[ref は任意の値を保持できます！](/learn/referencing-values-with-refs)）すべてのリストアイテムの [`ref` コールバック](/reference/react-dom/components/common#ref-callback)は、Map を更新するように注意します。

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Map に追加
      map.set(cat, node);
    } else {
      // Map から削除
      map.delete(cat);
    }
  }}
>
```

これにより、後で Map から個々の DOM ノードを読み取ることができます。

</DeepDive>

## 別のコンポーネントの DOM ノードにアクセスする

`<input />` のような組み込みコンポーネントに ref を配置すると、React はその ref の `current` プロパティを対応する DOM ノード（ブラウザの実際の `<input />` など）に設定します。

しかし、`<MyInput />` のような**独自の**コンポーネントに ref を配置しようとすると、デフォルトでは `null` が返されます。以下はそれを示す例です。ボタンをクリックしても入力フィールドにフォーカスが当たら**ない**ことに注目してください。

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

問題に気付くのを助けるため、React はコンソールにエラーも出力します。

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

</ConsoleBlock>

これは、デフォルトでは React が他のコンポーネントの DOM ノードにアクセスすることを許可しないためです。自分の子でさえもです！これは意図的なものです。ref は控えめに使用すべき避難ハッチです。_他の_コンポーネントの DOM ノードを手動で操作することは、コードをさらに脆弱にします。

代わりに、DOM ノードを公開_したい_コンポーネントはそのようにオプトインする必要があります。コンポーネントは、ref を子の 1 つに「転送」することを指定できます。以下は、`MyInput` が `forwardRef` API を使用する方法です。

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

動作の仕組みは次のとおりです。

1. `<MyInput ref={inputRef} />` は、React に対応する DOM ノードを `inputRef.current` に配置するよう指示します。ただし、`MyInput` コンポーネントがオプトインするかどうかはそれ次第です。デフォルトではオプトインしません。
2. `MyInput` コンポーネントは `forwardRef` を使用して宣言されています。**これにより、上記の `inputRef` を、`props` の後に宣言されている 2 番目の `ref` 引数として受け取ることをオプトインします。**
3. `MyInput` 自体が受け取った `ref` を内部の `<input>` に渡します。

これで、ボタンをクリックして入力フィールドにフォーカスが当たります。

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

デザインシステムでは、ボタン、入力などの低レベルコンポーネントが ref を DOM ノードに転送することが一般的なパターンです。一方、フォーム、リスト、ページセクションなどの高レベルコンポーネントは、通常、DOM 構造への偶発的な依存を避けるために、DOM ノードを公開しません。

<DeepDive>

#### 命令型ハンドルで API のサブセットを公開する

上記の例では、`MyInput` は元の DOM 入力要素を公開します。これにより、親コンポーネントがそれに対して `focus()` を呼び出すことができます。しかし、これにより親コンポーネントは他のこともできるようになります。例えば、CSS スタイルを変更することもできます。まれなケースでは、公開される機能を制限したい場合があります。それは `useImperativeHandle` で行うことができます。

<Sandpack>

```js
import {
  forwardRef,
  useRef,
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // focus のみを公開し、他は公開しません
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

ここで、`MyInput` 内の `realInputRef` は実際の入力 DOM ノードを保持します。しかし、`useImperativeHandle` は、親コンポーネントへの ref の値として独自の特別なオブジェクトを提供するよう React に指示します。したがって、`Form` コンポーネント内の `inputRef.current` には `focus` メソッドのみがあります。この場合、ref「ハンドル」は DOM ノードではなく、`useImperativeHandle` 呼び出し内で作成するカスタムオブジェクトです。

</DeepDive>

## React が ref をアタッチするタイミング

React では、すべての更新は[2 つのフェーズ](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)に分割されます。

- **レンダー**中に、React は画面に何を表示すべきかを判断するためにコンポーネントを呼び出します。
- **コミット**中に、React は DOM に変更を適用します。

一般的に、レンダー中に ref にアクセスすることは[望ましくありません](/learn/referencing-values-with-refs#best-practices-for-refs)。これは、DOM ノードを保持する ref にも当てはまります。最初のレンダー中は、DOM ノードはまだ作成されていないため、`ref.current` は `null` になります。また、更新のレンダー中は、DOM ノードはまだ更新されていません。したがって、それらを読み取るには早すぎます。

React は、コミット中に `ref.current` を設定します。DOM を更新する前に、React は影響を受ける `ref.current` 値を `null` に設定します。DOM を更新した後、React はすぐにそれらを対応する DOM ノードに設定します。

**通常、ref にはイベントハンドラからアクセスします。** ref で何かをしたいが、それを行う特定のイベントがない場合、エフェクトが必要になる場合があります。エフェクトについては、次のページで説明します。

<DeepDive>

#### flushSync で state 更新を同期的にフラッシュする

新しい todo を追加し、リストの最後の子まで画面をスクロールする次のようなコードを考えてみてください。なぜか、常に最後に追加した todo の_直前_の todo までスクロールすることに注目してください。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

問題は以下の 2 行にあります。

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

React では、[state の更新はキューに入れられます](/learn/queueing-a-series-of-state-updates)。通常、これは望むものです。しかし、ここでは `setTodos` が DOM をすぐに更新しないため、問題が発生します。したがって、リストを最後の要素にスクロールする時点では、todo はまだ追加されていません。これが、スクロールが常に 1 つ「遅れる」理由です。

この問題を解決するには、React に DOM を同期的に更新（「フラッシュ」）するよう強制できます。これを行うには、`react-dom` から `flushSync` をインポートし、**state 更新を `flushSync` 呼び出しでラップ**します。

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

これにより、React は `flushSync` でラップされたコードが実行された直後に DOM を同期的に更新するよう指示されます。その結果、スクロールしようとする時点で、最後の todo はすでに DOM に存在します。

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## ref で DOM を操作するベストプラクティス

ref は避難ハッチです。「React の外に出る」必要がある場合にのみ使用すべきです。これの一般的な例には、フォーカスの管理、スクロール位置、または React が公開していないブラウザ API の呼び出しが含まれます。

フォーカスやスクロールなどの非破壊的なアクションに限定している場合、問題は発生しないはずです。しかし、DOM を手動で**変更**しようとすると、React が行っている変更と競合するリスクがあります。

この問題を説明するため、この例にはウェルカムメッセージと 2 つのボタンが含まれています。最初のボタンは、[条件付きレンダー](/learn/conditional-rendering)と [state](/learn/state-a-components-memory) を使用してその存在を切り替えます。これは、React で通常行う方法です。2 番目のボタンは、[`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) を使用して、React の制御外で DOM から強制的に削除します。

"Toggle with setState" を数回押してみてください。メッセージが消えたり再び表示されたりするはずです。次に、"Remove from the DOM" を押してください。これにより、強制的に削除されます。最後に、"Toggle with setState" を押してください。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

DOM 要素を手動で削除した後、`setState` を使用して再び表示しようとすると、クラッシュします。これは、DOM を変更したため、React がそれを正しく管理する方法を知らなくなったためです。

**React が管理する DOM ノードを変更しないでください。** React が管理する要素の子を変更、追加、または削除すると、上記のような一貫性のない視覚的結果やクラッシュにつながる可能性があります。

しかし、これはまったくできないという意味ではありません。注意が必要です。**React が更新する理由がない DOM の部分を安全に変更できます。** 例えば、一部の `<div>` が JSX で常に空の場合、React はその子リストに触れる理由がありません。したがって、そこに要素を手動で追加または削除することは安全です。

<Recap>

- ref は一般的な概念ですが、ほとんどの場合、DOM 要素を保持するために使用します。
- `<div ref={myRef}>` を渡すことで、DOM ノードを `myRef.current` に配置するよう React に指示します。
- 通常、フォーカス、スクロール、または DOM 要素の測定などの非破壊的なアクションに ref を使用します。
- コンポーネントはデフォルトでは DOM ノードを公開しません。`forwardRef` を使用し、2 番目の `ref` 引数を特定のノードに渡すことで、DOM ノードを公開することをオプトインできます。
- React が管理する DOM ノードを変更しないでください。
- React が管理する DOM ノードを変更する場合は、React が更新する理由がない部分を変更してください。

</Recap>

<Challenges>

#### ビデオの再生と一時停止

この例では、ボタンが state 変数を切り替えて、再生状態と一時停止状態を切り替えます。しかし、実際にビデオを再生または一時停止するには、state を切り替えるだけでは不十分です。また、`<video>` の DOM 要素で [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) と [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) を呼び出す必要があります。ref を追加して、ボタンを機能させてください。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

追加のチャレンジとして、ユーザがビデオを右クリックしてブラウザの組み込みメディアコントロールを使用して再生した場合でも、"Play" ボタンをビデオが再生されているかどうかと同期させてください。そのためには、ビデオの `onPlay` と `onPause` をリッスンすることをお勧めします。

<Solution>

ref を宣言し、`<video>` 要素に配置します。次に、次の state に応じて、イベントハンドラで `ref.current.play()` と `ref.current.pause()` を呼び出します。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

組み込みのブラウザコントロールを処理するには、`<video>` 要素に `onPlay` および `onPause` ハンドラを追加し、それらから `setIsPlaying` を呼び出すことができます。このように、ユーザがブラウザコントロールを使用してビデオを再生した場合、state はそれに応じて調整されます。

</Solution>

#### 検索フィールドにフォーカスを当てる

"Search" ボタンをクリックすると、フィールドにフォーカスが当たるようにしてください。

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

ref を入力に追加し、DOM ノードで `focus()` を呼び出してフォーカスを当てます。

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### 画像カルーセルをスクロールする

この画像カルーセルには、アクティブな画像を切り替える "Next" ボタンがあります。クリックすると、ギャラリーがアクティブな画像まで水平にスクロールするようにしてください。アクティブな画像の DOM ノードで [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) を呼び出すことをお勧めします。

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

この演習では、すべての画像に ref を持つ必要はありません。現在アクティブな画像、またはリスト自体に ref を持つだけで十分です。`scrollIntoView` を呼び出す*前*に DOM が更新されるようにするには、`flushSync` を使用してください。

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

`selectedRef` を宣言してから、現在の画像にのみ条件付きで渡すことができます。

```js
<li ref={index === i ? selectedRef : null}>
```

`index === i` の場合、つまり画像が選択されている場合、`<li>` は `selectedRef` を受け取ります。React は `selectedRef.current` が常に正しい DOM ノードを指すようにします。

`flushSync` 呼び出しは、スクロールする前に React に DOM を更新するよう強制するために必要です。そうしないと、`selectedRef.current` は常に以前に選択されたアイテムを指します。

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### 個別のコンポーネントで検索フィールドにフォーカスを当てる

"Search" ボタンをクリックすると、フィールドにフォーカスが当たるようにしてください。各コンポーネントは別々のファイルで定義されており、ファイル外に移動すべきではないことに注意してください。それらをどのように接続しますか？

<Hint>

`SearchInput` のような独自のコンポーネントから DOM ノードを公開するには、`forwardRef` が必要です。

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

`SearchButton` に `onClick` props を追加し、`SearchButton` がそれをブラウザの `<button>` に渡すようにする必要があります。また、ref を `<SearchInput>` に渡し、それを実際の `<input>` に転送してそれを埋めるようにします。最後に、クリックハンドラで、その ref に格納されている DOM ノードで `focus` を呼び出します。

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
