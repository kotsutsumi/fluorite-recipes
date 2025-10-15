# インタラクティビティの追加

画面上の要素には、ユーザの入力に反応して更新されていくものがあります。例えば、画像ギャラリをクリックするとアクティブな画像が切り替わります。React では、時間の経過とともに変化するデータのことを *state* と呼びます。任意のコンポーネントに state を追加することができ、必要に応じて更新することができます。この章では、インタラクションを処理し、state を更新し、時間の経過とともに異なる出力を表示するコンポーネントの作成方法について学びます。

## この章で学ぶこと

- [ユーザが発生させるイベントの扱い方](/learn/responding-to-events)
- [state でコンポーネントに情報を「記憶」させる方法](/learn/state-a-components-memory)
- [React が 2 段階で UI を更新する仕組み](/learn/render-and-commit)
- [変更後すぐに state が更新されない理由](/learn/state-as-a-snapshot)
- [複数の state の更新をキューに入れる方法](/learn/queueing-a-series-of-state-updates)
- [state 内のオブジェクトを更新する方法](/learn/updating-objects-in-state)
- [state 内の配列を更新する方法](/learn/updating-arrays-in-state)

## イベントへの応答

React では、JSX に*イベントハンドラ*を追加することができます。イベントハンドラはあなた自身で書く関数であり、クリック、ホバー、フォーム入力へのフォーカスといったユーザインタラクションに応答してトリガされます。

`<button>` のような組み込みコンポーネントは、`onClick` のような組み込みブラウザイベントのみをサポートします。しかし、独自のコンポーネントを作成し、それらのイベントハンドラ props にアプリ固有の任意の名前を付けることもできます。

```jsx
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

[イベントへの応答について詳しく読む](/learn/responding-to-events)

## state：コンポーネントのメモリ

コンポーネントによっては、ユーザ操作の結果として画面上の表示内容を変更する必要があります。フォーム上でタイプすると入力欄が更新される、画像カルーセルで「次」をクリックすると表示される画像が変わる、「購入」をクリックすると買い物かごに商品が入る、といったものです。コンポーネントは、現在の入力値、現在の画像、ショッピングカートの状態といったものを「覚えておく」必要があります。React では、このようなコンポーネント固有のメモリのことを *state* と呼びます。

[`useState`](/reference/react/useState) フックを使用して、コンポーネントに state を追加することができます。*フック (Hook)* とは、コンポーネントに React の機能（state はその機能のひとつ）を使わせるための特別な関数です。`useState` フックを使うことで、state 変数を宣言することができます。初期値を受け取り、現在の state 値とそれを更新するための state セッタ関数のペアを返します。

```jsx
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

以下は、画像ギャラリがクリックで state を使用・更新する方法の例です。

```jsx
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
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

[state：コンポーネントのメモリについて詳しく読む](/learn/state-a-components-memory)

## レンダーとコミット

コンポーネントが画面上に表示される前に、React によってレンダーされる必要があります。このプロセスが踏む段階を理解すると、コードがどのように実行されるのか考える際や、コードの振る舞いを説明する際に役立ちます。

コンポーネントが料理人として厨房に立ち、食材を調理して美味しい料理を作っている様子をイメージしてみてください。このシナリオにおいて React はウェイターです。お客様の注文を伝えて、できた料理をお客様に渡します。この UI の「注文」と「提供」のプロセスは、次の 3 つのステップからなります。

1. レンダーの**トリガ**（お客様の注文を厨房に伝える）
2. コンポーネントの**レンダー**（厨房で注文の品を料理する）
3. DOM への**コミット**（テーブルに注文の品を提供する）

![レストランのアナロジーを示す図](https://react.dev/images/docs/illustrations/i_render-and-commit1.png)

[レンダーとコミットについて詳しく読む](/learn/render-and-commit)

## state はスナップショットである

通常の JavaScript 変数とは異なり、React の state はスナップショットのように振る舞います。state をセットしても、既にある state 変数は変更されず、代わりに再レンダーがトリガされます。これは最初は驚くかもしれません。

```jsx
console.log(count);  // 0
setCount(count + 1); // 1 で再レンダーをリクエスト
console.log(count);  // まだ 0 のまま！
```

この振る舞いにより、微妙なバグを回避できます。以下は、簡単なチャットアプリです。最初に「送信」を押してから、受信者を Bob に変更してみましょう。5 秒後に `alert` に表示される名前はどちらになると思いますか？

```jsx
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

[state はスナップショットであることについて詳しく読む](/learn/state-as-a-snapshot)

## 一連の state 更新をキューに入れる

このコンポーネントにはバグがあります。"+3" をクリックしても、スコアは 1 つしか増えません。

```jsx
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

[state はスナップショットである](/learn/state-as-a-snapshot)で、これがなぜこうなるのかを説明しています。state をセットすると新しい再レンダーがリクエストされますが、既に実行中のコード内ではそれは変更されません。つまり、`setScore(score + 1)` を呼び出した直後も、`score` は `0` のままです。

```jsx
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

これを修正するには、state をセットする際に、*更新用関数*を渡します。`setScore(score + 1)` を `setScore(s => s + 1)` に置き換えることで、"+3" ボタンがどのように修正されるかに注目してください。これにより、複数の state 更新をキューに入れることができます。

```jsx
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

[一連の state 更新をキューに入れることについて詳しく読む](/learn/queueing-a-series-of-state-updates)

## state 内のオブジェクトの更新

state には、オブジェクトを含む、あらゆる種類の JavaScript の値を保持することができます。しかし、React の state に保持しているオブジェクトや配列を直接書き換えてはいけません。代わりに、オブジェクトや配列を更新したい場合は、新しいものを作成（または既存のもののコピーを作成）し、その新しいコピーを使うように state を更新する必要があります。

通常、変更したいオブジェクトや配列をコピーするには、`...` スプレッド構文を使用します。例えば、ネストされたオブジェクトの更新は次のようになります。

```jsx
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

コードでオブジェクトをコピーするのが面倒な場合は、[Immer](https://github.com/immerjs/use-immer) のようなライブラリを使用して、繰り返しの少ないコードを書くことができます。

```jsx
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

[state 内のオブジェクトの更新について詳しく読む](/learn/updating-objects-in-state)

## state 内の配列の更新

配列は、state に保存できる別の種類の変更可能な JavaScript オブジェクトであり、読み取り専用として扱う必要があります。オブジェクトと同様に、state に保存されている配列を更新する場合は、新しい配列を作成（または既存の配列をコピー）し、新しい配列を使うように state をセットする必要があります。

```jsx
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(initialList);

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

コードで配列をコピーするのが面倒な場合は、[Immer](https://github.com/immerjs/use-immer) のようなライブラリを使用して、繰り返しの少ないコードを書くことができます。

```jsx
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

[state 内の配列の更新について詳しく読む](/learn/updating-arrays-in-state)

## 次のステップ

[イベントへの応答](/learn/responding-to-events)のページに移動して、この章を 1 ページずつ読み始めましょう。

または、これらのトピックに既に慣れている場合は、[state の管理](/learn/managing-state)について読んでみてはいかがでしょうか。
