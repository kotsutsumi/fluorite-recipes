# ステートによるインタラクティビティの追加

Reactがステートとイベントハンドラーを使ってインタラクティビティを追加する方法を探ってみましょう。

例として、`HomePage`コンポーネント内に「いいね」ボタンを作成してみましょう。まず、`return()`文の中にボタン要素を追加します：

```jsx
function HomePage() {
  const names = ["Ada Lovelace", "Grace Hopper", "Margaret Hamilton"];

  return (
    <div>
      <Header title="Develop. Preview. Ship." />
      <ul>
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <button>Like</button>
    </div>
  );
}
```

## イベントのリスニング

ボタンがクリックされたときに何かを実行するには、`onClick`イベントを使用できます：

```jsx
function HomePage() {
  // ...
  return (
    <div>
      {/* ... */}
      <button onClick={}>Like</button>
    </div>
  );
}
```

Reactでは、イベント名はキャメルケースで記述します。`onClick`イベントは、ユーザーのインタラクションに応答するために使用できる多くのイベントの一つです。例えば、入力フィールドには`onChange`、フォームには`onSubmit`を使用できます。

## イベントの処理

イベントがトリガーされたときに「処理」する関数を定義できます。return文の前に`handleClick()`という関数を作成しましょう：

```jsx
function HomePage() {
  // ...

  function handleClick() {
    console.log("increment like count")
  }

  return (
    <div>
      {/* ... */}
      <button onClick={}>Like</button>
    </div>
  )
}
```

次に、`onClick`イベントがトリガーされたときに`handleClick`関数を呼び出すことができます：

```jsx
function HomePage() {
  // ...
  function handleClick() {
    console.log("increment like count");
  }

  return (
    <div>
      {/* ... */}
      <button onClick={handleClick}>Like</button>
    </div>
  );
}
```

これをブラウザで実行してみてください。開発者ツールでログ出力が増加することに注目してください。

## ステートとフック

Reactには[フック](https://react.dev/learn)と呼ばれる関数のセットがあります。フックを使用すると、コンポーネントにステートなどの追加ロジックを追加できます。ステートは、通常ユーザーのインタラクションによってトリガーされる、UI内で時間の経過とともに変化する情報として考えることができます。

![ステートの2つの異なる例：1. 選択または非選択になるトグルボタン。2. 複数回クリックできるいいねボタン。](https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Flearn%2Fdark%2Flearn-state.png&w=3840&q=75)

ステートを使用して、ユーザーが「いいね」ボタンをクリックした回数を保存および増分できます。実際、ステートを管理するために使用されるReactフックは`useState()`と呼ばれます。

`useState()`をプロジェクトに追加しましょう。これは配列を返し、配列の分割代入を使用してコンポーネント内でそれらの配列値にアクセスして使用できます：

```jsx
function HomePage() {
  // ...
  const [] = React.useState();
  // ...
}
```

配列の最初の項目はステートの`値`で、何でも名前を付けることができます。説明的な名前を付けることが推奨されます：

```jsx
function HomePage() {
  // ...
  const [likes] = React.useState();
  // ...
}
```

配列の2番目の項目は値を`更新`する関数です。更新関数には何でも名前を付けることができますが、更新するステート変数の名前の前に`set`を付けるのが一般的です：

```jsx
function HomePage() {
  // ...
  const [likes, setLikes] = React.useState();
  // ...
}
```

また、`likes`ステートの初期値を`0`に追加する機会を取ることもできます：

```jsx
function HomePage() {
  // ...
  const [likes, setLikes] = React.useState(0);
}
```

次に、コンポーネント内でステート変数を使用して、初期ステートが機能していることを確認できます。

```jsx
function HomePage() {
  // ...
  const [likes, setLikes] = React.useState(0);
  // ...

  return (
    // ...
    <button onClick={handleClick}>Like({likes})</button>
  );
}
```

最後に、`HomePage`コンポーネント内でステート更新関数`setLikes`を呼び出すことができます。前に定義した`handleClick()`関数内に追加しましょう：

```jsx
function HomePage() {
  // ...
  const [likes, setLikes] = React.useState(0);

  function handleClick() {
    setLikes(likes + 1);
  }

  return (
    <div>
      {/* ... */}
      <button onClick={handleClick}>Likes ({likes})</button>
    </div>
  );
}
```

ボタンをクリックすると、`handleClick`関数が呼び出され、現在のいいね数+1の単一引数で`setLikes`ステート更新関数が呼び出されます。

> **注意：** 最初の関数パラメータとしてコンポーネントに渡されるpropsとは異なり、ステートはコンポーネント内で開始され、保存されます。ステート情報をpropsとして子コンポーネントに渡すことができますが、ステートを更新するロジックは、ステートが最初に作成されたコンポーネント内に保持する必要があります。

## ステートの管理

これはステートの入門に過ぎず、Reactアプリケーションでのステートとデータフローの管理について学ぶことはまだまだあります。詳細については、React文書の[インタラクティビティの追加](https://react.dev/learn/adding-interactivity)と[ステートの管理](https://react.dev/learn/managing-state)セクションを通読することをお勧めします。

> **追加リソース：**
>
> • [ステート：コンポーネントのメモリ](https://react.dev/learn/state-a-components-memory)
> • [最初のフックとの出会い](https://react.dev/learn/state-a-components-memory#meet-your-first-hook)
> • [イベントへの応答](https://react.dev/learn/responding-to-events)

## 第7章完了

ステートとイベントリスナーを使って、アプリケーションに基本的なインタラクティビティを追加しました。

**次の章**

8: ReactからNext.jsへ

コードを確認し、Reactの学習を継続する方法を見てみましょう。

[第8章を開始](https://nextjs.org/learn/react-foundations/from-react-to-nextjs)
