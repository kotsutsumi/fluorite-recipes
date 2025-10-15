# JSX に波括弧で JavaScript を含める

JSX により、JavaScript ファイル内に HTML のようなマークアップを書くことができ、レンダリングロジックとコンテンツを同じ場所にまとめられるようになります。時には、そのマークアップの中に JavaScript のロジックを少し追加したり、動的なプロパティを参照したくなることがあります。このような状況では、JSX 内で波括弧を使用して、JavaScript への窓を開くことができます。

## 学ぶこと

- 引用符で文字列を渡す方法
- 波括弧を使って JSX 内で JavaScript 変数を参照する方法
- 波括弧を使って JSX 内で JavaScript 関数を呼び出す方法
- 波括弧を使って JSX 内で JavaScript オブジェクトを使用する方法

## 引用符で文字列を渡す

文字列属性を JSX に渡したい場合は、シングルクォートまたはダブルクォートで囲みます。

```jsx
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

ここでは、`"https://i.imgur.com/7vQD0fPs.jpg"` と `"Gregorio Y. Zara"` が文字列として渡されています。

しかし、`src` や `alt` のテキストを動的に指定したい場合はどうでしょうか？**`"` と `"` を `{` と `}` に置き換えて、JavaScript の値を使用できます**。

```jsx
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

`className="avatar"` と `src={avatar}` の違いに注意してください。前者は `"avatar"` という CSS クラス名を指定する文字列であり、後者は `avatar` という JavaScript 変数の値を読み取ります。これは、波括弧を使用すると、マークアップ内で JavaScript を直接操作できるからです！

## 波括弧を使う：JavaScript の世界への窓

JSX は、JavaScript を書く特別な方法です。つまり、その中で JavaScript を使用することが可能です。波括弧 `{ }` を使用します。以下の例では、まず科学者の名前 `name` を宣言し、その後、`<h1>` 内で波括弧を使って埋め込んでいます。

```jsx
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

`name` の値を `'Gregorio Y. Zara'` から `'Hedy Lamarr'` に変更してみてください。Todo リストのタイトルがどのように変わるか見てみましょう。

`formatDate()` のような関数呼び出しを含め、どんな JavaScript 式でも波括弧の間で機能します。

```jsx
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

### 波括弧を使える場所

JSX 内では、波括弧を 2 つの方法でのみ使用できます。

1. **JSX タグ内のテキストとして直接：** `<h1>{name}'s To Do List</h1>` は機能しますが、`<{tag}>Gregorio Y. Zara's To Do List</{tag}>` は機能しません。
2. **`=` 記号の直後の属性として：** `src={avatar}` は `avatar` 変数を読み取りますが、`src="{avatar}"` は文字列 `"{avatar}"` を渡します。

## 「ダブル波括弧」を使う：JSX での CSS とその他のオブジェクト

文字列、数値、その他の JavaScript 式に加えて、JSX でオブジェクトを渡すこともできます。オブジェクトも波括弧で示されます。例えば、`{ name: "Hedy Lamarr", inventions: 5 }` のように。したがって、JSX で JavaScript オブジェクトを渡すには、オブジェクトを別の波括弧のペアでラップする必要があります：`person={{ name: "Hedy Lamarr", inventions: 5 }}`。

JSX のインライン CSS スタイルでこれを見ることがあります。React では、インライン スタイルを使用する必要はありません（CSS クラスはほとんどの場合うまく機能します）。しかし、インライン スタイルが必要な場合は、`style` 属性にオブジェクトを渡します。

```jsx
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

`backgroundColor` と `color` の値を変更してみてください。

次のように書くと、波括弧内の JavaScript オブジェクトを実際に見ることができます。

```jsx
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

JSX で `{{` と `}}` を見たときは、それが JSX 波括弧内のオブジェクトに過ぎないことを知ってください！

> 注意
>
> インライン `style` プロパティはキャメルケースで書かれます。例えば、HTML の `<ul style="background-color: black">` は、コンポーネントでは `<ul style={{ backgroundColor: 'black' }}>` と書きます。

## JavaScript オブジェクトと波括弧でもっと楽しむ

複数の式を 1 つのオブジェクトに移動して、JSX 内で波括弧で参照できます。

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

この例では、`person` JavaScript オブジェクトには、`name` 文字列と `theme` オブジェクトが含まれています。

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

コンポーネントは、次のように `person` からこれらの値を使用できます。

```jsx
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX は、JavaScript を使用してデータとロジックを整理できるため、テンプレート言語として非常に最小限です。

## まとめ

これで、JSX についてほぼすべてを知っています。

- 引用符内の JSX 属性は文字列として渡されます。
- 波括弧を使用すると、JavaScript のロジックと変数をマークアップに取り込むことができます。
- 波括弧は、JSX タグのコンテンツ内、または属性の `=` の後で機能します。
- `{{` と `}}` は特別な構文ではありません。JSX 波括弧内に詰め込まれた JavaScript オブジェクトです。

## チャレンジ

### チャレンジ 1: 間違いを修正する

このコードは `Objects are not valid as a React child` というエラーでクラッシュします。

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
      <h1>{person}'s Todos</h1>
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

問題を見つけられますか？

> ヒント
>
> 波括弧の中に何があるかを見てください。正しいものを入れていますか？

#### 解決策

これは、マークアップ内で_オブジェクト自体_を文字列としてレンダリングしようとしているために発生します：`<h1>{person}'s Todos</h1>` は、`person` オブジェクト全体をレンダリングしようとしています！テキストコンテンツとして生のオブジェクトを含めると、React はそれをどのように表示したいかわからないため、エラーが発生します。

修正するには、`<h1>{person}'s Todos</h1>` を `<h1>{person.name}'s Todos</h1>` に置き換えます。

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

### チャレンジ 2: 情報をオブジェクトに抽出する

画像 URL を `person` オブジェクトに抽出します。

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

#### 解決策

画像 URL を `person.imageUrl` という名前のプロパティに移動し、波括弧を使って `<img>` タグからそれを読み取ります。

```jsx
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
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
        src={person.imageUrl}
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

### チャレンジ 3: JSX 波括弧内に式を書く

以下のオブジェクトでは、完全な画像 URL は、基本 URL `'https://i.imgur.com/'`、`imageId`（`'7vQD0fP'`）、`imageSize`（`'s'`）、およびファイル拡張子 `.jpg` の 4 つの部分に分割されています。

画像 URL をこれらの属性から結合したいとします：基本 URL（常に `'https://i.imgur.com/'`）、`imageId`（`'7vQD0fP'`）、`imageSize`（`'s'`）、およびファイル拡張子（常に `'.jpg'`）。しかし、`<img>` タグが `src` を指定する方法に何か問題があります。

修正できますか？

```jsx
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
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

修正が機能したことを確認するには、`imageSize` の値を `'b'` に変更してみてください。編集後に画像のサイズが変わるはずです。

#### 解決策

これを `src={baseUrl + person.imageId + person.imageSize + '.jpg'}` と書くことができます。

1. `{` は JavaScript 式を開きます
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` は正しい URL 文字列を生成します
3. `}` は JavaScript 式を閉じます

```jsx
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
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
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
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

この式を `getImageUrl` のような別の関数に移動することもできます。

```jsx
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

function getImageUrl(person) {
  return (
    baseUrl +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
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

変数と関数を使用すると、マークアップをシンプルに保つことができます！
