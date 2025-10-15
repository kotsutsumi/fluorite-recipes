# イベントへの応答

React では、JSX に*イベントハンドラ*を追加できます。イベントハンドラとはあなた自身で書く関数であり、クリック、ホバー、フォーム入力へのフォーカスといったユーザインタラクションに応答してトリガされます。

## このページで学ぶこと

- イベントハンドラを記述するさまざまな方法
- 親コンポーネントからイベント処理ロジックを渡す方法
- イベントの伝播のしかたとそれを停止する方法

## イベントハンドラの追加

イベントハンドラを追加するには、まず関数を定義し、それを適切な JSX タグに [props として渡します](/learn/passing-props-to-a-component)。

例えば、まだ何もしないボタンがあるとします。

```jsx
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

ユーザがクリックしたときにメッセージを表示するには、次の 3 つのステップに従います。

1. `Button` コンポーネントの*内部*に、`handleClick` という関数を宣言します。
2. その関数内にロジックを実装します（`alert` を使ってメッセージを表示）。
3. `<button>` JSX に `onClick={handleClick}` を追加します。

```jsx
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

`handleClick` 関数を定義して、それを `<button>` に [props として渡しました](/learn/passing-props-to-a-component)。`handleClick` は**イベントハンドラ**です。イベントハンドラ関数は：

- 通常、コンポーネントの*内部*で定義されます。
- `handle` で始まり、その後にイベント名が続く名前を持ちます。

慣習として、イベントハンドラには `handle` の後にイベント名を付けるのが一般的です。`onClick={handleClick}`、`onMouseEnter={handleMouseEnter}` などをよく見かけるでしょう。

あるいは、JSX 内でインラインでイベントハンドラを定義することもできます。

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

または、より簡潔にアロー関数を使って：

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

これらのスタイルはすべて等価です。インラインのイベントハンドラは、短い関数に便利です。

### 落とし穴

イベントハンドラに渡す関数は、呼び出すのではなく、渡す必要があります。例えば：

| 関数を渡す（正しい）                | 関数を呼び出す（間違い）              |
| ----------------------------------- | ------------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

違いは微妙です。最初の例では、`handleClick` 関数が `onClick` イベントハンドラとして渡されます。これは、React にそれを覚えておいて、ユーザがボタンをクリックしたときのみ関数を呼び出すように指示します。

2 番目の例では、`handleClick()` の最後の `()` が、クリックなしで、[レンダー](/learn/render-and-commit)中に関数を*即座に*実行してしまいます。これは、[JSX の `{` と `}`](/learn/javascript-in-jsx-with-curly-braces) 内の JavaScript が即座に実行されるためです。

インラインでコードを書く場合も、同じ落とし穴が別の形で現れます。

| 関数を渡す（正しい）                        | 関数を呼び出す（間違い）          |
| ------------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

次のようなインラインコードを渡すと、クリック時に実行されません。コンポーネントがレンダーされるたびに実行されます。

```jsx
// このアラートはコンポーネントがレンダーされたときに発火し、クリック時ではありません！
<button onClick={alert('You clicked me!')}>
```

イベントハンドラをインラインで定義したい場合は、次のようにアロー関数でラップします。

```jsx
<button onClick={() => alert('You clicked me!')}>
```

これは、レンダーのたびにコードを実行するのではなく、後で呼び出される関数を作成します。

どちらの場合も、渡したいのは関数です。

- `<button onClick={handleClick}>` は `handleClick` 関数を渡します。
- `<button onClick={() => alert('...')}>` は `() => alert('...')` 関数を渡します。

> [アロー関数について詳しくはこちら](https://javascript.info/arrow-functions-basics)。

## イベントハンドラでの props の読み取り

イベントハンドラはコンポーネント内部で宣言されるため、コンポーネントの props にアクセスできます。以下は、クリックされたときに `message` という props をアラートで表示するボタンです。

```jsx
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

これにより、これら 2 つのボタンが異なるメッセージを表示できるようになります。渡されるメッセージを変更してみてください。

## イベントハンドラを props として渡す

多くの場合、親コンポーネントが子のイベントハンドラを指定したいことがあります。ボタンを考えてみましょう。`Button` コンポーネントを使用する場所によって、異なる関数を実行したい場合があります。たとえば、映画を再生する場合と、画像をアップロードする場合です。

これを行うには、コンポーネントが親から受け取る props を、次のようにイベントハンドラとして渡します。

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

ここで、`Toolbar` コンポーネントは `PlayButton` と `UploadButton` をレンダーします。

- `PlayButton` は `handlePlayClick` を `Button` 内の `onClick` prop として渡します。
- `UploadButton` は `() => alert('Uploading!')` を `Button` 内の `onClick` prop として渡します。

最後に、`Button` コンポーネントは `onClick` という props を受け取ります。その props を組み込みのブラウザ `<button>` に `onClick={onClick}` として直接渡します。これにより、クリック時に渡された関数を呼び出すよう React に指示します。

[デザインシステム](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)を使用する場合、ボタンのようなコンポーネントにはスタイルは含まれるが動作は指定されないのが一般的です。代わりに、`PlayButton` や `UploadButton` のようなコンポーネントがイベントハンドラを渡すようにします。

## イベントハンドラ props の命名

`<button>` や `<div>` のような組み込みコンポーネントは、`onClick` のような[ブラウザイベント名](/reference/react-dom/components/common#common-props)のみをサポートします。しかし、独自のコンポーネントを構築する場合、イベントハンドラ props には好きな名前を付けることができます。

慣習として、イベントハンドラ props は `on` で始まり、その後に大文字が続くべきです。

例えば、`Button` コンポーネントの `onClick` prop は `onSmash` と呼ぶこともできました。

```jsx
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

この例では、`<button onClick={onSmash}>` は、ブラウザの `<button>`（小文字）には依然として `onClick` という props が必要ですが、カスタムの `Button` コンポーネントが受け取る props 名はあなた次第です。

コンポーネントが複数のインタラクションをサポートする場合、アプリ固有の概念に対してイベントハンドラ props に名前を付けることができます。例えば、この `Toolbar` コンポーネントは `onPlayMovie` と `onUploadImage` というイベントハンドラを受け取ります。

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

`App` コンポーネントは、`Toolbar` が `onPlayMovie` や `onUploadImage` で*何をするか*を知る必要がないことに注意してください。それは `Toolbar` の実装の詳細です。ここでは、`Toolbar` はそれらを `Button` の `onClick` ハンドラとして渡していますが、後でキーボードショートカットでもそれらをトリガできるようになるかもしれません。`onPlayMovie` のようなアプリ固有のインタラクションにちなんで props に名前を付けることで、後でそれらの使用方法を柔軟に変更できます。

> **注意**
>
> イベントハンドラには適切な HTML タグを使用するようにしてください。例えば、クリックを処理するには、`<div onClick={handleClick}>` の代わりに [`<button onClick={handleClick}>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) を使用します。実際のブラウザ `<button>` を使用すると、キーボードナビゲーションなどの組み込みブラウザ動作が有効になります。ボタンのデフォルトのブラウザスタイルが気に入らず、リンクや別の UI 要素のように見せたい場合は、CSS でそれを実現できます。[アクセシブルなマークアップの作成について詳しくはこちら](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)。

## イベント伝播

イベントハンドラは、コンポーネントが持つ可能性のある子からのイベントもキャッチします。イベントがツリーを「バブル (bubble)」または「伝播 (propagate)」すると言います。イベントが発生した場所から始まり、ツリーを上っていきます。

この `<div>` には 2 つのボタンが含まれています。`<div>`*と*各ボタンの両方に、独自の `onClick` ハンドラがあります。ボタンをクリックすると、どのハンドラが発火すると思いますか？

```jsx
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

いずれかのボタンをクリックすると、その `onClick` が最初に実行され、次に親の `<div>` の `onClick` が実行されます。したがって、2 つのメッセージが表示されます。ツールバー自体をクリックすると、親の `<div>` の `onClick` のみが実行されます。

> **落とし穴**
>
> すべてのイベントは React で伝播します。ただし `onScroll` は例外で、これはアタッチされた JSX タグでのみ機能します。

### 伝播の停止

イベントハンドラは、**イベントオブジェクト**を唯一の引数として受け取ります。慣習として、「event」を意味する `e` と呼ばれることが一般的です。このオブジェクトを使用して、イベントに関する情報を読み取ることができます。

そのイベントオブジェクトを使用して、伝播を停止することもできます。親コンポーネントに到達するのを防ぎたい場合は、この `Button` コンポーネントのように `e.stopPropagation()` を呼び出す必要があります。

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

ボタンをクリックすると：

1. React が `<button>` に渡された `onClick` ハンドラを呼び出します。
2. `Button` で定義されたそのハンドラは、次のことを行います。
   - `e.stopPropagation()` を呼び出し、イベントがさらにバブルするのを防ぎます。
   - `Toolbar` コンポーネントから渡された `onClick` 関数を呼び出します。
3. `Toolbar` コンポーネントで定義されたその関数が、ボタン自身のアラートを表示します。
4. 伝播が停止されたため、親の `<div>` の `onClick` ハンドラは*実行されません*。

`e.stopPropagation()` の結果、ボタンをクリックすると、2 つのアラート（`<button>` と親ツールバーの `<div>` から）の代わりに、1 つのアラート（`<button>` から）のみが表示されるようになりました。ボタンをクリックすることは、周囲のツールバーをクリックすることと同じではないため、このUI では伝播を停止することが理にかなっています。

#### キャプチャフェーズのイベント

まれに、*伝播を停止した場合でも*、子要素のすべてのイベントをキャッチする必要がある場合があります。たとえば、伝播ロジックに関係なく、すべてのクリックを分析にログ記録したい場合があります。これを行うには、イベント名の最後に `Capture` を追加します。

```jsx
<div onClickCapture={() => { /* これが最初に実行される */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

各イベントは 3 つのフェーズで伝播します。

1. 下に向かって移動し、すべての `onClickCapture` ハンドラを呼び出します。
2. クリックされた要素の `onClick` ハンドラを実行します。
3. 上に向かって移動し、すべての `onClick` ハンドラを呼び出します。

キャプチャイベントは、ルーターや分析などのコードに役立ちますが、アプリコード内で使用することはおそらくないでしょう。

### 伝播の代替としてハンドラを渡す

このクリックハンドラが、1 行のコードを実行し、*その後*親から渡された `onClick` prop を呼び出す方法に注目してください。

```jsx {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

親の `onClick` イベントハンドラを呼び出す前に、このハンドラにさらにコードを追加することもできます。このパターンは、伝播の*代替*を提供します。子コンポーネントがイベントを処理できると同時に、親コンポーネントが追加の動作を指定することもできます。伝播とは異なり、これは自動的には行われません。しかし、このパターンの利点は、何らかのイベントの結果として実行されるコードチェーン全体を明確に追跡できることです。

伝播に依存していて、どのハンドラが実行され、なぜ実行されるのかを追跡するのが難しい場合は、代わりにこのアプローチを試してみてください。

### デフォルト動作の防止

一部のブラウザイベントには、それらに関連付けられたデフォルトの動作があります。例えば、`<form>` の送信イベントは、その内部のボタンがクリックされたときに発生し、デフォルトでページ全体をリロードします。

```jsx
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

イベントオブジェクトで `e.preventDefault()` を呼び出して、これが発生しないようにすることができます。

```jsx
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

`e.stopPropagation()` と `e.preventDefault()` を混同しないでください。両方とも便利ですが、無関係です。

- [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) は、上のタグにアタッチされたイベントハンドラの発火を停止します。
- [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) は、それを持ついくつかのイベントに対して、デフォルトのブラウザ動作を防ぎます。

## イベントハンドラには副作用を含めることができますか？

もちろんです！イベントハンドラは副作用に最適な場所です。

レンダリング関数とは異なり、イベントハンドラは[純粋](/learn/keeping-components-pure)である必要はないため、何かを*変更*するのに最適な場所です。たとえば、入力値を変更したり、ボタン押下に応じてリストを変更したりするのに適しています。ただし、情報を変更するには、まずそれを保存する方法が必要です。React では、これは [state、コンポーネントのメモリ](/learn/state-a-components-memory)を使用して行います。次のページで、これについてすべて学びます。

## まとめ

- `<button>` のような要素に関数を props として渡すことで、イベントを処理できます。
- イベントハンドラは渡す必要があり、**呼び出してはいけません！** `onClick={handleClick}` であり、`onClick={handleClick()}` ではありません。
- イベントハンドラ関数は、別々に、またはインラインで定義できます。
- イベントハンドラはコンポーネント内部で定義されるため、props にアクセスできます。
- 親でイベントハンドラを宣言し、それを子に props として渡すことができます。
- アプリ固有の名前で独自のイベントハンドラ props を定義できます。
- イベントは上方向に伝播します。最初の引数で `e.stopPropagation()` を呼び出して、それを防ぎます。
- イベントには不要なデフォルトのブラウザ動作がある場合があります。`e.preventDefault()` を呼び出して、それを防ぎます。
- 子ハンドラからイベントハンドラ prop を明示的に呼び出すことは、伝播の良い代替手段です。

## 次のステップ

[state：コンポーネントのメモリ](/learn/state-a-components-memory)を読んで、値を記憶して変更する方法を学びましょう。
