# リストのレンダー

データの集まりから、似たようなコンポーネントを複数表示させたいことがあります。このページでは、JavaScript の [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) と [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) を React で使用して、データの配列をフィルタリングしたり、コンポーネントの配列に変換したりする方法を学びます。

## このページで学ぶこと

- JavaScript の `map()` を使用して、配列からコンポーネントをレンダーする方法
- JavaScript の `filter()` を使用して、特定のコンポーネントのみをレンダーする方法
- React での key の使用方法と、その必要性

## 配列からデータをレンダーする

コンテンツのリストがあるとします。

```jsx
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

これらのリストアイテムの唯一の違いは、そのコンテンツ、つまりデータです。インターフェースを構築する際、コメントのリストからプロフィール画像のギャラリーまで、異なるデータを使用して同じコンポーネントの複数のインスタンスを表示する必要があることがよくあります。このような状況では、そのデータを JavaScript オブジェクトや配列に格納し、[`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) や [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) などのメソッドを使用して、コンポーネントのリストをレンダーできます。

以下は、配列からアイテムのリストを生成する方法の簡単な例です。

1. データを配列に**移動します**。

```jsx
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. `people` のメンバを新しい JSX ノードの配列 `listItems` に**マップします**。

```jsx
const listItems = people.map(person => <li>{person}</li>);
```

3. コンポーネントから `listItems` を `<ul>` で囲んで**返します**。

```jsx
return <ul>{listItems}</ul>;
```

結果は以下のようになります。

```jsx
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

上記のサンドボックスがコンソールエラーを表示していることに注意してください。

```
Warning: Each child in a list should have a unique "key" prop.
```

このエラーの修正方法については、このページの後半で学習します。それに移る前に、データにもう少し構造を追加しましょう。

## アイテムの配列をフィルタする

このデータはさらに構造化できます。

```jsx
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

例えば、職業が `'chemist'` の人だけを表示する方法が欲しいとします。JavaScript の `filter()` メソッドを使用して、その条件に一致する人だけを返すことができます。このメソッドはアイテムの配列を受け取り、それらを「テスト」（`true` または `false` を返す関数）に通し、テストに合格した（`true` を返した）アイテムのみの新しい配列を返します。

`profession` が `'chemist'` のアイテムだけが欲しいです。そのための「テスト」関数は `(person) => person.profession === 'chemist'` のようになります。これをまとめる方法は次のとおりです。

1. `people` に対して `filter()` を呼び出し、`person.profession === 'chemist'` でフィルタリングして、「chemist」の人だけの新しい配列 `chemists` を**作成します**。

```jsx
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. 次に、`chemists` を**マップします**。

```jsx
const listItems = chemists.map(person =>
  <li>
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
```

3. 最後に、コンポーネントから `listItems` を**返します**。

```jsx
return <ul>{listItems}</ul>;
```

> **注意**
>
> アロー関数は暗黙的に `=>` の直後の式を返すため、`return` 文は不要です。
>
> ```jsx
> const listItems = chemists.map(person =>
>   <li>...</li> // 暗黙的な return！
> );
> ```
>
> ただし、**`=>` の後に `{` 波括弧が続く場合は、明示的に `return` を書く必要があります！**
>
> ```jsx
> const listItems = chemists.map(person => { // 波括弧
>   return <li>...</li>;
> });
> ```
>
> `=> {` を含むアロー関数は「[ブロック本体](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)」を持つと言われます。これにより、複数行のコードを書くことができますが、`return` 文を自分で書く*必要があります*。忘れると、何も返されません！

## `key` によるリストアイテムの順序の保持

上記のサンドボックスのいずれかをブラウザの新しいタブで開くと、コンソールにエラーが表示されることに気づくでしょう。

```
Warning: Each child in a list should have a unique "key" prop.
```

各配列アイテムには、その配列内の他のアイテムと区別するための `key`（文字列または数値）を渡す必要があります。

```jsx
<li key={person.id}>...</li>
```

> **補足**
>
> `map()` 呼び出しの内部にある JSX 要素には常に key が必要です！

key は各コンポーネントに、それがどの配列アイテムに対応するかを React に伝え、後でマッチングできるようにします。これは、配列アイテムが移動（ソートなど）、挿入、削除される可能性がある場合に重要になります。適切に選択された `key` は、React が何が起こったかを正確に推測し、DOM ツリーに正しい更新を行うのに役立ちます。

key を動的に生成するのではなく、データに含めるべきです。

```jsx
export const people = [{
  id: 0, // JSX で key として使用
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // JSX で key として使用
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // JSX で key として使用
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // JSX で key として使用
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // JSX で key として使用
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

> **DEEP DIVE**
>
> ### 各リストアイテムに複数の DOM ノードを表示する
>
> 各アイテムが 1 つではなく複数の DOM ノードをレンダーする必要がある場合はどうすればよいでしょうか？
>
> 短い [`<>...</>` Fragment](/reference/react/Fragment) 構文では key を渡すことができないため、それらを単一の `<div>` にグループ化するか、少し長くより明示的な [`<Fragment>` 構文](/reference/react/Fragment#rendering-a-list-of-fragments)を使用する必要があります。
>
> ```jsx
> import { Fragment } from 'react';
>
> // ...
>
> const listItems = people.map(person =>
>   <Fragment key={person.id}>
>     <h1>{person.name}</h1>
>     <p>{person.bio}</p>
>   </Fragment>
> );
> ```
>
> Fragment は DOM から消えるため、これにより `<h1>`、`<p>`、`<h1>`、`<p>` などのフラットなリストが生成されます。

### `key` をどこから取得するか

データのソースによって、key のソースは異なります。

- **データベースからのデータ：** データがデータベースから来ている場合、本質的に一意であるデータベースのキー/ID を使用できます。
- **ローカルで生成されたデータ：** データがローカルで生成され、永続化される場合（例：メモアプリのメモ）、アイテムを作成するときに、インクリメントするカウンター、[`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)、または [`uuid`](https://www.npmjs.com/package/uuid) などのパッケージを使用します。

### key のルール

- **key は兄弟間で一意でなければなりません。** ただし、*異なる*配列の JSX ノードには同じ key を使用しても構いません。
- **key は変更してはなりません。** そうしないと、key の目的が無効になります！ レンダー中に key を生成しないでください。

### React が key を必要とする理由

デスクトップ上のファイルに名前がなかったとしたらどうなるか想像してみてください。ファイルを名前で参照するのではなく、順序で参照することになります。最初のファイル、2 番目のファイル、といった具合です。慣れることはできますが、ファイルを削除すると混乱するでしょう。2 番目のファイルが最初のファイルになり、3 番目のファイルが 2 番目のファイルになる、といった具合です。

フォルダ内のファイル名と配列内の JSX の key は同様の目的を果たします。これにより、兄弟間でアイテムを一意に識別できます。適切に選択された key は、配列内の位置よりも多くの情報を提供します。たとえ並び替えによって*位置*が変わっても、`key` により React はアイテムをその存続期間を通じて識別できます。

> **注意**
>
> アイテムのインデックスを key として使用したくなるかもしれません。実際、`key` を指定しない場合、React はインデックスを使用します。しかし、アイテムが挿入、削除されたり、配列の順序が変わったりすると、レンダーする順序は時間とともに変わります。インデックスを key として使用すると、微妙で混乱するバグにつながることがあります。
>
> 同様に、`key={Math.random()}` のようにその場で key を生成しないでください。これにより、レンダー間で key が一致しなくなり、すべてのコンポーネントと DOM が毎回再作成されます。これは遅いだけでなく、リストアイテム内のユーザー入力も失われます。代わりに、データに基づいた安定した ID を使用してください。
>
> コンポーネントは `key` を prop として受け取らないことに注意してください。React 自体がヒントとしてのみ使用します。コンポーネントに ID が必要な場合は、別の prop として渡す必要があります：`<Profile key={id} userId={id} />`。

## まとめ

このページで学んだこと：

- コンポーネントからデータを配列やオブジェクトなどのデータ構造に移動する方法。
- JavaScript の `map()` を使用して似たようなコンポーネントのセットを生成する方法。
- JavaScript の `filter()` を使用してフィルタリングされたアイテムの配列を作成する方法。
- コレクション内の各コンポーネントに `key` を設定する理由と方法。これにより、位置やデータが変更されても、React が各コンポーネントを追跡できるようになります。

---

**原文:** https://react.dev/learn/rendering-lists
