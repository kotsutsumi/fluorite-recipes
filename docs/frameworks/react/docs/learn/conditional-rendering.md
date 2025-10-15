# 条件付きレンダー

様々な条件に基づいて、コンポーネントに表示させる内容を変化させたいことがあります。React では、JavaScript の `if` 文や `&&`、`? :` 演算子などの構文を使うことで、JSX を条件付きでレンダーできます。

## このページで学ぶこと

- 条件に応じて異なる JSX を返す方法
- JSX の一部を条件によって表示したり除外したりする方法
- React のコードベースでよく使われる条件式のショートカット記法

## 条件を満たす場合に JSX を返す

荷造りをした荷物のリストを表示する `PackingList` コンポーネントがあるとしましょう。

```jsx
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
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

一部の `Item` コンポーネントの `isPacked` prop が `false` ではなく `true` に設定されていることに注目してください。梱包済みのアイテムには、`isPacked={true}` の場合にチェックマーク（✅）を追加したいと思います。

これは [if/else 文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)として以下のように書けます。

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

`isPacked` prop が `true` の場合、このコードは **異なる JSX ツリーを返します**。この変更により、一部のアイテムの最後にチェックマークが表示されます。

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✅</li>;
  }
  return <li className="item">{name}</li>;
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

どちらの場合に何が返されるかを編集してみて、結果がどのように変わるかを確認してください！

JavaScript の `if` および `return` 文で分岐ロジックを作成する方法に注目してください。React では、制御フロー（条件のようなもの）は JavaScript によって処理されます。

### `null` を使って条件付きで何も返さない

場合によっては、何もレンダーしたくないことがあります。例えば、梱包済みのアイテムを一切表示したくない場合です。コンポーネントは何かを返す必要があります。この場合、`null` を返すことができます。

```jsx
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

`isPacked` が true の場合、コンポーネントは何も返さず、`null` を返します。それ以外の場合は、レンダーする JSX を返します。

```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
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

実際には、コンポーネントから `null` を返すことは、それをレンダーしようとする開発者を驚かせてしまう可能性があるため、一般的ではありません。より一般的なのは、親コンポーネントの JSX にコンポーネントを条件付きで含めたり除外したりすることです。その方法を次に説明します！

## 条件付きで JSX を含める

前の例では、コンポーネントがどの JSX ツリーを返すか（もしあれば！）を制御しました。レンダー出力にいくらかの重複があることに既に気づいたかもしれません。

```jsx
<li className="item">{name} ✅</li>
```

は以下と非常に似ています。

```jsx
<li className="item">{name}</li>
```

どちらの条件分岐も `<li className="item">...</li>` を返します。

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

この重複は有害ではありませんが、コードの保守を難しくする可能性があります。`className` を変更したい場合はどうしますか？ コード内の 2 箇所で変更する必要があります！ このような場合、条件付きで少しの JSX を含めることで、コードをより [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) にすることができます。

### 条件（三項）演算子（`? :`）

JavaScript には、条件式を書くためのコンパクトな構文があります。それは[条件演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)または「三項演算子」です。

以下の代わりに：

```jsx
if (isPacked) {
  return <li className="item">{name} ✅</li>;
}
return <li className="item">{name}</li>;
```

以下のように書けます。

```jsx
return (
  <li className="item">
    {isPacked ? name + ' ✅' : name}
  </li>
);
```

これは *「もし `isPacked` が true なら、`name + ' ✅'` をレンダーし、そうでなければ（`:`）、`name` をレンダーする」*と読むことができます。

> **DEEP DIVE**
>
> ### これら 2 つの例は完全に同等ですか？
>
> オブジェクト指向プログラミングのバックグラウンドがある場合、上記の 2 つの例は微妙に異なると思うかもしれません。一方は `<li>` の 2 つの異なる「インスタンス」を作成する可能性があるためです。しかし、JSX 要素は「インスタンス」ではありません。内部状態を保持せず、実際の DOM ノードでもないからです。それらは青写真のような、軽量な記述です。したがって、これら 2 つの例は実際には*完全に*同等です。[state の保持とリセット](/learn/preserving-and-resetting-state)では、これがどのように機能するかについて詳しく説明します。

では、チェックマーク付きのテキストを別の HTML タグ、例えば `<del>` でラップして梱包済みのアイテムに取り消し線を引きたい場合を考えてみましょう。さらに改行とネストを追加して、各ケースでより多くの JSX をネストしやすくすることができます。

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✅'}
        </del>
      ) : (
        name
      )}
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

このスタイルは単純な条件には適していますが、適度に使用してください。コンポーネントに条件付きマークアップがネストされすぎていて混乱してきた場合は、整理するために子コンポーネントを抽出することを検討してください。React では、マークアップはコードの一部なので、変数や関数などのツールを使用して複雑な式を整理できます。

### 論理 AND 演算子（`&&`）

もう 1 つのよく使われるショートカットは、[JavaScript の論理 AND（`&&`）演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)です。React コンポーネント内では、条件が true の場合に JSX をレンダーし、**それ以外の場合は何もレンダーしない**場合によく使われます。`&&` を使うと、`isPacked` が `true` の場合にのみ、条件付きでチェックマークをレンダーできます。

```jsx
return (
  <li className="item">
    {name} {isPacked && '✅'}
  </li>
);
```

これは *「もし `isPacked` なら、チェックマークをレンダーし、そうでなければ何もレンダーしない」*と読むことができます。

以下が動作例です。

```jsx
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✅'}
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

[JavaScript の && 式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)は、左側（条件）が `true` の場合、右側（この場合はチェックマーク）の値を返します。しかし、条件が `false` の場合、式全体が `false` になります。React は、`false` を JSX ツリー内の「穴」と見なし、`null` や `undefined` と同様に、その場所には何もレンダーしません。

> **注意**
>
> **`&&` の左側に数値を置かないでください。**
>
> 条件をテストするために、JavaScript は左側を自動的にブール値に変換します。しかし、左側が `0` の場合、式全体がその値（`0`）を取得し、React は何もレンダーしないのではなく、喜んで `0` をレンダーしてしまいます。
>
> 例えば、よくある間違いは `messageCount && <p>New messages</p>` のようなコードを書くことです。`messageCount` が `0` のときは何もレンダーしないと思いがちですが、実際には `0` そのものがレンダーされてしまいます！
>
> これを修正するには、左側をブール値にします：`messageCount > 0 && <p>New messages</p>`。

### 条件付きで JSX を変数に代入する

ショートカットがプレーンなコードを書くのに邪魔になる場合は、`if` 文と変数を使用してみてください。[`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) で定義された変数は再代入できるため、まずは表示したいデフォルトの内容、つまり名前を指定します。

```jsx
let itemContent = name;
```

`if` 文を使用して、`isPacked` が `true` の場合に JSX 式を `itemContent` に再代入します。

```jsx
if (isPacked) {
  itemContent = name + " ✅";
}
```

[波括弧は「JavaScript への窓」を開きます](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world)。波括弧を使って変数を返された JSX ツリーに埋め込み、以前に計算した式を JSX 内にネストします。

```jsx
<li className="item">
  {itemContent}
</li>
```

このスタイルは最も冗長ですが、最も柔軟性もあります。以下が動作例です。

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✅";
  }
  return (
    <li className="item">
      {itemContent}
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

以前と同様に、これはテキストだけでなく、任意の JSX でも機能します。

```jsx
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✅"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
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

JavaScript に馴染みがない場合、このようにさまざまなスタイルがあることは最初は圧倒されるかもしれません。しかし、これらを学ぶことは、あらゆる JavaScript コードを読んで書くのに役立ちます。React コンポーネントだけでなく！ 最初は好みのものを選び、他のものがどのように機能するかを忘れてしまったら、このリファレンスを再度参照してください。

## まとめ

- React では、JavaScript を使用して分岐ロジックを制御します。
- `if` 文を使用して、条件に応じて JSX 式を返すことができます。
- 波括弧を使用して、いくつかの JSX を条件付きで変数に保存し、それを他の JSX 内に含めることができます。
- JSX では、`{cond ? <A /> : <B />}` は *「もし `cond` なら、`<A />` をレンダーし、そうでなければ `<B />` をレンダーする」*という意味です。
- JSX では、`{cond && <A />}` は *「もし `cond` なら、`<A />` をレンダーし、そうでなければ何もレンダーしない」*という意味です。
- これらのショートカットは一般的ですが、プレーンな `if` の方が好みであれば、使わなくても構いません。

---

**原文:** https://react.dev/learn/conditional-rendering
