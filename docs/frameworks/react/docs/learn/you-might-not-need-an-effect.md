# エフェクトは不要かもしれない

エフェクトは React のパラダイムからの避難ハッチです。React の「外に踏み出して」、コンポーネントを外部システム（非 React ウィジェット、ネットワーク、ブラウザ DOM など）と同期させることができます。外部システムが関与していない場合（例えば、props や state の変更に応じてコンポーネントの state を更新したい場合）、エフェクトは必要ありません。不要なエフェクトを削除することで、コードが読みやすくなり、実行が速くなり、エラーが発生しにくくなります。

<YouWillLearn>

- コンポーネントから不要なエフェクトを削除する理由と方法
- エフェクトなしで高価な計算をキャッシュする方法
- エフェクトなしでコンポーネントの state をリセットおよび調整する方法
- イベントハンドラ間でロジックを共有する方法
- どのロジックをイベントハンドラに移動すべきか
- 変更を親コンポーネントに通知する方法

</YouWillLearn>

## 不要なエフェクトを削除する方法

エフェクトが不要な一般的なケースは 2 つあります。

- **レンダーのためにデータを変換するのにエフェクトは不要です。** 例えば、リストを表示する前にフィルタリングしたいとします。リストが変更されたときに state 変数を更新するエフェクトを書きたくなるかもしれません。しかし、これは非効率的です。state を更新すると、React はまずコンポーネント関数を呼び出して画面に何を表示すべきかを計算します。次に、React はこれらの変更を DOM に[「コミット」](/learn/render-and-commit)して画面を更新します。その後、React はエフェクトを実行します。エフェクトが*すぐに* state を更新する場合、プロセス全体がゼロから再開されます！不要なレンダーパスを避けるには、コンポーネントのトップレベルですべてのデータを変換してください。そのコードは、props や state が変更されるたびに自動的に再実行されます。
- **ユーザイベントを処理するのにエフェクトは不要です。** 例えば、ユーザが製品を購入したときに `/api/buy` という POST リクエストを送信し、通知を表示したいとします。購入ボタンのクリックイベントハンドラでは、何が起こったかを正確に知っています。エフェクトが実行される時点では、ユーザが*何を*した（例えば、どのボタンがクリックされた）かはわかりません。これが、通常、対応するイベントハンドラでユーザイベントを処理する理由です。

外部システムと[同期する](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)ために、エフェクトが*必要*です。例えば、React state と jQuery ウィジェットを同期させるエフェクトを書くことができます。エフェクトでデータをフェッチすることもできます。例えば、検索結果を現在の検索クエリと同期させることができます。最新の[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)は、コンポーネント内でエフェクトを直接書くよりも効率的な組み込みのデータフェッチメカニズムを提供することを覚えておいてください。

正しい直感を得るために、いくつかの一般的な具体的な例を見てみましょう！

### props や state に基づいて state を更新する

`firstName` と `lastName` という 2 つの state 変数を持つコンポーネントがあるとします。それらを連結して `fullName` を計算したいとします。さらに、`firstName` または `lastName` が変更されるたびに `fullName` を更新したいとします。最初の直感は、`fullName` という state 変数を追加し、エフェクトで更新することかもしれません。

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 避けるべき：冗長な state とエフェクト
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

これは必要以上に複雑です。また、非効率的です。`fullName` の古い値で全体のレンダーパスを実行してから、すぐに更新された値で再レンダーします。state 変数とエフェクトを削除してください。

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 良い：レンダー中に計算
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**既存の props や state から計算できるものがある場合、[state に配置しないでください](/learn/choosing-the-state-structure#avoid-redundant-state)。代わりに、レンダー中に計算してください。** これにより、コードが高速になり（追加の「カスケード」更新を避けられる）、シンプルになり（一部のコードを削除できる）、エラーが発生しにくくなります（異なる state 変数が互いに同期しないことによるバグを避けられる）。このアプローチが新しいと感じる場合は、[React の流儀](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state)に、何を state に配置すべきかについて説明されています。

### 高価な計算をキャッシュする

このコンポーネントは、props として受け取る `todos` を `filter` props に基づいてフィルタリングすることで、`visibleTodos` を計算します。結果を state に保存し、エフェクトから更新したくなるかもしれません。

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 避けるべき：冗長な state とエフェクト
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

前の例と同様に、これは不要で非効率的です。まず、state とエフェクトを削除します。

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ getFilteredTodos() が遅くない場合、これで問題ありません。
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

通常、このコードは問題ありません！しかし、`getFilteredTodos()` が遅いか、`todos` が多い場合があります。その場合、`newTodo` のような無関係な state 変数が変更されたときに、`getFilteredTodos()` を再計算したくありません。

高価な計算を [`useMemo`](/reference/react/useMemo) フックでラップすることで、キャッシュ（または[「メモ化」](https://en.wikipedia.org/wiki/Memoization)）できます。

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ todos または filter が変更されない限り再実行されません
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

または、1 行で書くと：

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ todos または filter が変更されない限り getFilteredTodos() を再実行しません
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**これにより、React に、`todos` または `filter` が変更されない限り、内部の関数を再実行したくないことを伝えます。** React は、最初のレンダー中に `getFilteredTodos()` の戻り値を記憶します。次のレンダー時に、`todos` または `filter` が異なるかどうかをチェックします。前回と同じ場合、`useMemo` は最後に保存した結果を返します。しかし、異なる場合、React は内部の関数を再度呼び出します（そして、その結果を保存します）。

[`useMemo`](/reference/react/useMemo) でラップする関数はレンダー中に実行されるため、これは[純粋な計算](/learn/keeping-components-pure)に対してのみ機能します。

<DeepDive>

#### 計算が高価かどうかを判断する方法

一般的に、数千のオブジェクトを作成またはループしていない限り、おそらく高価ではありません。より自信を持ちたい場合は、コンソールログを追加して、コードに費やされた時間を測定できます。

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

測定したいインタラクションを実行します（例えば、入力フィールドに入力する）。次に、コンソールに `filter array: 0.15ms` のようなログが表示されます。ログに記録された全体の時間がかなりの量（例えば、`1ms` 以上）に達する場合、その計算をメモ化することは理にかなっているかもしれません。実験として、計算を `useMemo` でラップして、そのインタラクションでログに記録された全体の時間が減少したかどうかを確認できます。

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // todos と filter が変更されていない場合はスキップされます
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` は*最初の*レンダーを速くしません。更新時に不要な作業をスキップするのに役立つだけです。

また、あなたのマシンはおそらくユーザのマシンよりも速いため、人為的な速度低下でパフォーマンスをテストすることをお勧めします。例えば、Chrome は[CPU スロットリング](https://developer.chrome.com/blog/new-in-devtools-61/#throttling)オプションを提供しています。

また、開発中のパフォーマンスを測定しても、最も正確な結果は得られないことに注意してください。（例えば、[Strict Mode](/reference/react/StrictMode) がオンの場合、各コンポーネントが一度ではなく 2 回レンダーされることがわかります。）最も正確なタイミングを得るには、本番用にアプリをビルドし、ユーザが持っているようなデバイスでテストしてください。

</DeepDive>

### props が変更されたときにすべての state をリセットする

この `ProfilePage` コンポーネントは、`userId` という props を受け取ります。ページにはコメント入力フィールドがあり、その値を保持するために `comment` という state 変数を使用します。ある日、問題に気付きます。あるプロファイルから別のプロファイルに移動しても、`comment` state がリセットされません。その結果、誤って間違ったユーザのプロファイルにコメントを投稿しやすくなります。この問題を修正するには、`userId` が変更されるたびに `comment` state 変数をクリアしたいとします。

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 避けるべき：エフェクトで props の変更時に state をリセット
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

これは非効率的です。なぜなら、`ProfilePage` とその子は最初に古い値でレンダーし、次に再度レンダーするからです。また、これは複雑です。なぜなら、`ProfilePage` 内に state を持つ*すべて*のコンポーネントでこれを行う必要があるからです。例えば、コメント UI がネストされている場合、ネストされたコメント state もクリアしたいでしょう。

代わりに、明示的なキーを渡すことで、各ユーザのプロファイルが概念的に_異なる_プロファイルであることを React に伝えることができます。コンポーネントを 2 つに分割し、外側のコンポーネントから内側のコンポーネントに `key` 属性を渡します。

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ key が変更されると、この state および以下のすべての子の state が自動的にリセットされます
  const [comment, setComment] = useState('');
  // ...
}
```

通常、React は同じコンポーネントが同じ場所にレンダーされるときに state を保持します。**`userId` を `Profile` コンポーネントの `key` として渡すことで、異なる `userId` を持つ 2 つの `Profile` コンポーネントを、state を共有すべきでない 2 つの異なるコンポーネントとして扱うよう React に要求しています。** キー（`userId` に設定）が変更されるたびに、React は DOM を再作成し、`Profile` コンポーネントとそのすべての子の [state をリセット](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)します。これで、プロファイル間を移動するときに `comment` フィールドが自動的にクリアされます。

この例では、外側の `ProfilePage` コンポーネントのみがプロジェクトの残りの部分にエクスポートされ、表示されることに注意してください。`ProfilePage` をレンダーするコンポーネントは、キーを渡す必要はありません。`userId` を通常の props として渡します。`ProfilePage` がそれを内側の `Profile` コンポーネントの `key` として渡すことは実装の詳細です。

### props が変更されたときに一部の state を調整する

時には、props の変更時に state の一部をリセットまたは調整したいが、すべてをリセットしたくない場合があります。

この `List` コンポーネントは、`items` リストを props として受け取り、選択されたアイテムを `selection` state 変数に保持します。`items` props が異なる配列を受け取るたびに、`selection` を `null` にリセットしたいとします。

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 避けるべき：エフェクトで props の変更時に state を調整
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

これも理想的ではありません。`items` が変更されるたびに、`List` とその子コンポーネントは最初に古い `selection` 値でレンダーします。次に、React は DOM を更新し、エフェクトを実行します。最後に、`setSelection(null)` の呼び出しにより、`List` とその子コンポーネントの別の再レンダーが発生し、このプロセス全体が再開されます。

エフェクトを削除することから始めましょう。代わりに、レンダー中に直接 state を調整します。

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // より良い：レンダー中に state を調整
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

[前回のレンダーからの情報を保存する](/reference/react/useState#storing-information-from-previous-renders)ことは理解しにくいかもしれませんが、エフェクトで同じ state を更新するよりも優れています。上記の例では、`setSelection` はレンダー中に直接呼び出されます。React は、`return` ステートメントで終了した*直後*に `List` を再レンダーします。React はまだ `List` の子をレンダーしたり DOM を更新したりしていないため、これにより `List` の子は古い `selection` 値のレンダーをスキップできます。

レンダー中にコンポーネントを更新すると、React は返された JSX を破棄し、すぐにレンダーを再試行します。非常に遅いカスケード再試行を避けるために、React はレンダー中に*同じ*コンポーネントの state のみを更新できます。レンダー中に別のコンポーネントの state を更新すると、エラーが表示されます。`items !== prevItems` のような条件は、ループを避けるために必要です。このように state を調整することはできますが、他の副作用（DOM の変更やタイムアウトの設定など）は、コンポーネントを[予測可能](/learn/keeping-components-pure)に保つために、イベントハンドラまたはエフェクトに残すべきです。

**このパターンはエフェクトよりも効率的ですが、ほとんどのコンポーネントにも必要ありません。** どのように行っても、props や他の state に基づいて state を調整することは、データフローを理解およびデバッグしにくくします。常に[キーですべての state をリセット](#resetting-all-state-when-a-prop-changes)できるか、[レンダー中にすべてを計算](#updating-state-based-on-props-or-state)できるかを確認してください。例えば、選択された*アイテム*を保存（およびリセット）する代わりに、選択された*アイテム ID* を保存できます。

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ 最良：レンダー中にすべてを計算
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

これで、state を「調整」する必要がまったくなくなりました。選択された ID を持つアイテムがリストにある場合、それは選択されたままです。ない場合、レンダー中に計算される `selection` は、一致するアイテムが見つからないため `null` になります。この動作は異なりますが、`items` のほとんどの変更が選択を保持するため、おそらく優れています。

### イベントハンドラ間でロジックを共有する

2 つのボタン（購入と購入/チェックアウト）があり、どちらも製品を購入できる製品ページがあるとします。ユーザが製品をカートに入れるたびに通知を表示したいとします。両方のボタンのクリックハンドラで `showNotification()` を呼び出すのは繰り返しに感じられるため、このロジックをエフェクトに配置したくなるかもしれません。

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 避けるべき：エフェクト内のイベント固有のロジック
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

このエフェクトは不要です。また、ほとんどの場合、バグを引き起こします。例えば、アプリがページの再読み込み間でショッピングカートを「記憶」するとします。製品を一度カートに追加してページを更新すると、通知が再度表示されます。その製品のページを更新するたびに表示され続けます。これは、ページの読み込み時に `product.isInCart` がすでに `true` であるため、上記のエフェクトが `showNotification()` を呼び出すためです。

**コードがエフェクトまたはイベントハンドラにあるべきかわからない場合は、このコードが実行される*理由*を自問してください。エフェクトは、コンポーネントがユーザに*表示された*ために実行されるコードにのみ使用してください。** この例では、通知はユーザが*ボタンを押した*ために表示されるべきであり、ページが表示されたためではありません！エフェクトを削除し、共有ロジックを両方のイベントハンドラから呼び出される関数に配置してください。

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ 良い：イベント固有のロジックはイベントハンドラから呼び出されます
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

これにより、不要なエフェクトが削除され、バグが修正されます。

### POST リクエストを送信する

この `Form` コンポーネントは 2 種類の POST リクエストを送信します。マウント時に分析イベントを送信します。フォームに入力して Submit ボタンをクリックすると、`/api/register` エンドポイントに POST リクエストを送信します。

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 良い：このロジックはコンポーネントが表示されたために実行されるべきです
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 避けるべき：エフェクト内のイベント固有のロジック
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

前の例と同じ基準を適用してみましょう。

分析 POST リクエストはエフェクトのままにすべきです。これは、分析イベントを送信する*理由*がフォームが表示されたことだからです。（開発中は 2 回起動しますが、[これに対処する方法はこちらを参照してください](/learn/synchronizing-with-effects#sending-analytics)。）

しかし、`/api/register` の POST リクエストは、フォームが*表示される*ことによって引き起こされるのではありません。特定の瞬間、つまりユーザがボタンを押したときにのみリクエストを送信したいのです。*その特定のインタラクション*でのみ実行されるべきです。2 番目のエフェクトを削除し、その POST リクエストをイベントハンドラに移動してください。

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ 良い：このロジックはコンポーネントが表示されたために実行されます
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ 良い：イベント固有のロジックはイベントハンドラにあります
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

ロジックをイベントハンドラに配置するかエフェクトに配置するかを選択する際、ユーザの観点から*どのような種類のロジック*であるかという主な質問に答える必要があります。このロジックが特定のインタラクションによって引き起こされる場合は、イベントハンドラに保持してください。ユーザが画面でコンポーネントを*見る*ことによって引き起こされる場合は、エフェクトに保持してください。

### 計算のチェーン

時には、他の state に基づいて各 state を調整するエフェクトをチェーンしたくなるかもしれません。

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 避けるべき：互いをトリガするためだけに state を調整するエフェクトのチェーン
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

このコードには 2 つの問題があります。

1 つ目の問題は、非常に非効率的であることです。コンポーネント（およびその子）は、チェーン内の各 `set` 呼び出しの間に再レンダーする必要があります。上記の例では、最悪の場合（`setCard` → レンダー → `setGoldCardCount` → レンダー → `setRound` → レンダー → `setIsGameOver` → レンダー）、ツリーの下に 3 つの不要な再レンダーがあります。

遅くなくても、コードが進化するにつれて、書いた「チェーン」が新しい要件に適合しない場合に遭遇します。ゲームの動きの履歴をステップスルーする方法を追加しているとします。各 state 変数を過去の値に更新することで行います。しかし、`card` state を過去の値に設定すると、エフェクトチェーンが再度トリガされ、表示しているデータが変更されます。このようなコードは、硬直的で脆弱です。

この場合、レンダー中に可能なことを計算し、イベントハンドラで state を調整する方が優れています。

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ レンダー中に可能なことを計算
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ イベントハンドラで次の state をすべて計算
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

これははるかに効率的です。また、ゲーム履歴を表示する方法を実装する場合、各 state 変数を過去の動きに設定しても、他のすべての値を調整するエフェクトチェーンがトリガされることはありません。複数のイベントハンドラ間でロジックを再利用する必要がある場合は、[関数を抽出](#sharing-logic-between-event-handlers)して、それらのハンドラから呼び出すことができます。

イベントハンドラ内では、[state はスナップショットのように動作する](/learn/state-as-a-snapshot)ことを覚えておいてください。例えば、`setRound(round + 1)` を呼び出した後でも、`round` 変数はユーザがボタンをクリックした時点の値を反映します。計算に次の値を使用する必要がある場合は、`const nextRound = round + 1` のように手動で定義してください。

場合によっては、イベントハンドラで次の state を直接計算*できない*ことがあります。例えば、次のドロップダウンのオプションが前のドロップダウンの選択された値に依存する複数のドロップダウンを持つフォームを想像してください。その場合、ネットワークと同期しているため、エフェクトのチェーンが適切です。

### アプリケーションの初期化

一部のロジックは、アプリの読み込み時に一度だけ実行されるべきです。

コンポーネントの最上位のエフェクトに配置したくなるかもしれません。

```js {2-6}
function App() {
  // 🔴 避けるべき：一度だけ実行されるべきロジックを持つエフェクト
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

しかし、すぐに[開発中に 2 回実行される](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)ことに気付くでしょう。これにより問題が発生する可能性があります。例えば、関数が 2 回呼び出されるように設計されていないため、認証トークンが無効化されるかもしれません。一般的に、コンポーネントは再マウントに対して回復力があるべきです。これには、最上位の `App` コンポーネントが含まれます。

本番環境では実際に再マウントされないかもしれませんが、すべてのコンポーネントで同じ制約に従うことで、コードの移動と再利用が容易になります。ロジックが*コンポーネントのマウントごと*ではなく、*アプリの読み込みごと*に一度実行されるべき場合は、最上位変数を追加してすでに実行されたかどうかを追跡してください。

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ アプリの読み込みごとに一度だけ実行されます
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

モジュールの初期化中やアプリのレンダー前に実行することもできます。

```js {1,5}
if (typeof window !== 'undefined') { // ブラウザで実行されているかどうかをチェックします。
   // ✅ アプリの読み込みごとに一度だけ実行されます
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

コンポーネントがインポートされたときに最上位のコードは、レンダーされなくても一度実行されます。任意のコンポーネントをインポートする際の速度低下や予期しない動作を避けるために、このパターンを過度に使用しないでください。アプリ全体の初期化ロジックは、`App.js` のようなルートコンポーネントモジュールまたはアプリケーションのエントリポイントに保持してください。

### state の変更を親コンポーネントに通知する

`true` または `false` の内部 state を持つ `Toggle` コンポーネントを書いているとします。クリックまたはドラッグによってトグルするいくつかの異なる方法があります。`Toggle` の内部 state が変更されるたびに親コンポーネントに通知したいため、`onChange` イベントを公開し、エフェクトから呼び出します。

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 避けるべき：onChange ハンドラが遅すぎて実行されます
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

前と同様に、これは理想的ではありません。`Toggle` は最初に state を更新し、React は画面を更新します。次に、React はエフェクトを実行し、親コンポーネントから渡された `onChange` 関数を呼び出します。これで、親コンポーネントは独自の state を更新し、別のレンダーパスを開始します。すべてを 1 つのパスで実行する方が優れています。

エフェクトを削除し、代わりに同じイベントハンドラ内で*両方の*コンポーネントの state を更新してください。

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ 良い：発生させたイベント中にすべての更新を実行します
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

このアプローチにより、`Toggle` コンポーネントとその親コンポーネントの両方が、イベント中に state を更新します。React は、異なるコンポーネントからの[更新をバッチ処理](/learn/queueing-a-series-of-state-updates)するため、レンダーパスは 1 つだけになります。

state を完全に削除し、代わりに親コンポーネントから `isOn` を受け取ることもできます。

```js {1,2}
// ✅ 良い：コンポーネントは親によって完全に制御されます
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

[「state を持ち上げる」](/learn/sharing-state-between-components)ことで、親コンポーネントは独自の state を切り替えることで `Toggle` を完全に制御できます。これは、親コンポーネントがより多くのロジックを含む必要があることを意味しますが、全体として心配する state が少なくなります。2 つの異なる state 変数を同期させようとするときは、代わりに state を持ち上げることを試みてください！

### 親にデータを渡す

この `Child` コンポーネントはデータをフェッチし、エフェクトで `Parent` コンポーネントに渡します。

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 避けるべき：エフェクトで親にデータを渡す
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

React では、データは親コンポーネントから子コンポーネントに流れます。画面に何か間違ったものを見たときは、コンポーネントチェーンを上に辿って、どのコンポーネントが間違った props を渡しているか、または間違った state を持っているかを追跡することで、情報の出所を追跡できます。子コンポーネントがエフェクトで親コンポーネントの state を更新すると、データフローを追跡することが非常に困難になります。子と親の両方が同じデータを必要とする場合は、親コンポーネントがそのデータをフェッチし、代わりに子に*下に渡す*ようにしてください。

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ 良い：子にデータを下に渡します
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

これはよりシンプルで、データフローを予測可能に保ちます。データは親から子に下に流れます。

### 外部ストアを購読する

時には、コンポーネントが React state の外部にある一部のデータを購読する必要があります。このデータは、サードパーティライブラリまたは組み込みのブラウザ API からのものである可能性があります。このデータは React の知らないうちに変更される可能性があるため、コンポーネントを手動で購読する必要があります。これは、エフェクトで行われることがよくあります。例えば：

```js {2-17}
function useOnlineStatus() {
  // 理想的ではありません：エフェクトでストアを手動で購読
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

ここで、コンポーネントは外部データストア（この場合は、ブラウザの `navigator.onLine` API）を購読します。この API はサーバに存在しない（初期 HTML には使用できない）ため、最初は state が `true` に設定されます。ブラウザでそのデータストアの値が変更されるたびに、コンポーネントは state を更新します。

これにはエフェクトを使用するのが一般的ですが、React には外部ストアを購読するための専用の組み込みフックがあります。エフェクトを削除し、[`useSyncExternalStore`](/reference/react/useSyncExternalStore) 呼び出しに置き換えてください。

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ 良い：組み込みフックで外部ストアを購読
  return useSyncExternalStore(
    subscribe, // 同じ関数を渡す限り、React は再購読しません
    () => navigator.onLine, // クライアントで値を取得する方法
    () => true // サーバで値を取得する方法
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

このアプローチは、ミュータブルなデータを React state にエフェクトで手動で同期させるよりもエラーが発生しにくいです。通常、上記の `useOnlineStatus()` のようなカスタムフックを書くので、個々のコンポーネントでこのコードを繰り返す必要はありません。[React コンポーネントから外部ストアを購読する方法について詳しく読む。](/reference/react/useSyncExternalStore)

### データをフェッチする

多くのアプリは、データフェッチを開始するためにエフェクトを使用します。データフェッチエフェクトを書くことは非常に一般的です。

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 避けるべき：クリーンアップロジックなしでフェッチ
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

このフェッチをイベントハンドラに移動する必要は*ありません*。

これは、イベントハンドラにロジックを配置する必要があった以前の例と矛盾しているように見えるかもしれません！しかし、フェッチする*主な理由*が*タイピングイベント*ではないことを考慮してください。検索入力は URL から事前に入力されることが多く、ユーザは入力に触れずに Back および Forward をナビゲートする可能性があります。

`page` と `query` がどこから来るかは関係ありません。このコンポーネントが表示されている間、現在の `page` と `query` のネットワークからのデータと `results` を[同期](/learn/synchronizing-with-effects)させたいのです。これがエフェクトである理由です。

しかし、上記のコードにはバグがあります。`"hello"` をすばやく入力すると想像してください。次に、`query` は `"h"` から `"he"`、`"hel"`、`"hell"`、`"hello"` に変わります。これにより、個別のフェッチが開始されますが、応答が到着する順序については保証がありません。例えば、`"hell"` の応答が `"hello"` の応答の*後*に到着する可能性があります。最後に `setResults()` を呼び出すため、間違った検索結果が表示されます。これは[「競合状態」](https://en.wikipedia.org/wiki/Race_condition)と呼ばれます。2 つの異なるリクエストが互いに「競争」し、予期しない順序で到着しました。

**競合状態を修正するには、古い応答を無視するために[クリーンアップ関数を追加](/learn/synchronizing-with-effects#fetching-data)する必要があります。**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

これにより、エフェクトがデータをフェッチするときに、最後にリクエストされたもの以外のすべての応答が無視されます。

競合状態の処理は、データフェッチの実装における唯一の困難ではありません。応答のキャッシュ（ユーザが Back をクリックして前の画面を即座に表示できるようにする）、サーバでデータをフェッチする方法（初期サーバレンダリングされた HTML がスピナーの代わりにフェッチされたコンテンツを含むようにする）、およびネットワークウォーターフォールを回避する方法（子がすべての親を待たずにデータをフェッチできるようにする）についても考慮する必要があります。

**これらの問題は、React だけでなく、任意の UI ライブラリに適用されます。それらを解決することは簡単ではないため、最新の[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)は、エフェクトでデータをフェッチするよりも効率的な組み込みのデータフェッチメカニズムを提供します。**

フレームワークを使用していない（そして、独自のものを構築したくない）が、エフェクトからのデータフェッチをより人間工学的にしたい場合は、この例のように、フェッチロジックをカスタムフックに抽出することを検討してください。

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

また、エラー処理やコンテンツの読み込み中かどうかを追跡するロジックも追加したいでしょう。このようなフックを自分で構築するか、React エコシステムで既に利用可能な多くのソリューションのいずれかを使用できます。**これだけでは、フレームワークの組み込みのデータフェッチメカニズムを使用するほど効率的ではありませんが、データフェッチロジックをカスタムフックに移動すると、後で効率的なデータフェッチ戦略を採用することが容易になります。**

一般的に、エフェクトを書く必要がある場合は、`useData` のように、より宣言的で目的に特化した API を持つカスタムフックに機能を抽出できるときに注目してください。コンポーネント内の生の `useEffect` 呼び出しが少ないほど、アプリケーションを維持することが容易になります。

<Recap>

- レンダー中に何かを計算できる場合、エフェクトは必要ありません。
- 高価な計算をキャッシュするには、`useEffect` の代わりに `useMemo` を追加してください。
- コンポーネントツリー全体の state をリセットするには、異なる `key` を渡してください。
- props の変更に応じて特定の state をリセットするには、レンダー中に設定してください。
- コンポーネントが*表示された*ために実行されるコードはエフェクトにあるべきで、残りはイベントにあるべきです。
- 複数のコンポーネントの state を更新する必要がある場合は、単一のイベント中に行う方が優れています。
- 異なるコンポーネントで state 変数を同期させようとするときは、state を持ち上げることを検討してください。
- エフェクトでデータをフェッチできますが、競合状態を避けるためにクリーンアップを実装する必要があります。

</Recap>

<Challenges>

#### エフェクトなしでデータを変換する

以下の `TodoList` は todo のリストを表示します。"Show only active todos" チェックボックスがオンの場合、完了した todo はリストに表示されません。どの todo が表示されているかに関係なく、フッターには完了していない todo の数が表示されます。

すべての不要な state とエフェクトを削除することで、このコンポーネントを簡素化してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

レンダー中に何かを計算できる場合、state やそれを更新するエフェクトは必要ありません。

</Hint>

<Solution>

この例では、本質的な state は `todos` リストと、ユーザが "Show only active todos" チェックボックスをオンにしたかどうかを表す `showActive` state 変数の 2 つだけです。他のすべての state 変数は[冗長](/learn/choosing-the-state-structure#avoid-redundant-state)であり、代わりにレンダー中に計算できます。これには、周囲の JSX に直接移動できる `footer` が含まれます。

結果は次のようになります。

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### エフェクトなしで計算をキャッシュする

この例では、todo のフィルタリングが `getVisibleTodos()` という別の関数に抽出されました。この関数には内部に `console.log()` 呼び出しがあり、呼び出されたときに気付くのに役立ちます。"Show only active todos" を切り替えて、`getVisibleTodos()` が再実行されることに注意してください。これは、表示する todo が切り替えによって変更されるため、期待されます。

あなたのタスクは、`TodoList` コンポーネント内の `visibleTodos` リストを再計算するエフェクトを削除することです。しかし、入力フィールドに入力したときに `getVisibleTodos()` が再実行*されない*（したがって、ログが出力されない）ようにする必要があります。

<Hint>

1 つの解決策は、`useMemo` 呼び出しを追加して、表示される todo をキャッシュすることです。別の、あまり明白でない解決策もあります。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

state 変数とエフェクトを削除し、代わりに `getVisibleTodos()` 呼び出しの結果をキャッシュするために `useMemo` 呼び出しを追加してください。

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

この変更により、`getVisibleTodos()` は、`todos` または `showActive` が変更された場合にのみ呼び出されます。入力フィールドに入力すると、`text` state 変数のみが変更されるため、`getVisibleTodos()` の呼び出しはトリガされません。

また、`useMemo` を必要としない別の解決策もあります。`text` state 変数は todo リストに影響を与えることができないため、`NewTodo` フォームを別のコンポーネントに抽出し、`text` state 変数をその中に移動できます。

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

このアプローチも要件を満たします。入力フィールドに入力すると、`text` state 変数のみが更新されます。`text` state 変数は子の `NewTodo` コンポーネントにあるため、親の `TodoList` コンポーネントは再レンダーされません。これが、入力時に `getVisibleTodos()` が呼び出されない理由です。（別の理由で `TodoList` が再レンダーされる場合でも呼び出されます。）

</Solution>

#### エフェクトなしで state をリセットする

この `EditContact` コンポーネントは、`{ id, name, email }` の形式の連絡先オブジェクトを `savedContact` props として受け取ります。名前とメールの入力フィールドを編集してみてください。Save を押すと、フォームの上の連絡先のボタンが編集された名前に更新されます。Reset を押すと、フォーム内の保留中の変更が破棄されます。この UI を操作して感覚をつかんでください。

上部のボタンで連絡先を選択すると、フォームはその連絡先の詳細を反映するようにリセットされます。これは、`EditContact.js` 内のエフェクトで行われます。このエフェクトを削除してください。`savedContact.id` が変更されたときにフォームをリセットする別の方法を見つけてください。

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

`savedContact.id` が異なる場合、`EditContact` フォームが概念的に_異なる連絡先のフォーム_であり、state を保持すべきでないことを React に伝える方法があれば良いでしょう。そのような方法を覚えていますか？

</Hint>

<Solution>

`EditContact` コンポーネントを 2 つに分割します。すべてのフォーム state を内側の `EditForm` コンポーネントに移動します。外側の `EditContact` コンポーネントをエクスポートし、`savedContact.id` を内側の `EditForm` コンポーネントの `key` として渡すようにします。その結果、内側の `EditForm` コンポーネントは、異なる連絡先を選択するたびにすべてのフォーム state をリセットし、DOM を再作成します。

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### エフェクトなしでフォームを送信する

この `Form` コンポーネントを使用すると、友達にメッセージを送信できます。フォームを送信すると、`showForm` state 変数が `false` に設定されます。これにより、`sendMessage(message)` を呼び出すエフェクトがトリガされ、メッセージが送信されます（コンソールで確認できます）。メッセージが送信された後、"Open chat" ボタンを持つ "Thank you" ダイアログが表示され、フォームに戻ることができます。

アプリのユーザがあまりにも多くのメッセージを送信しています。チャットをもう少し難しくするために、フォームの代わりに "Thank you" ダイアログを*最初に*表示することにしました。`showForm` state 変数を `true` ではなく `false` に初期化するように変更してください。その変更を行うとすぐに、コンソールには空のメッセージが送信されたことが表示されます。このロジックの何かが間違っています！

この問題の根本原因は何ですか？そして、どのように修正できますか？

<Hint>

メッセージは、ユーザが "Thank you" ダイアログを_見た_ために送信されるべきですか？それとも、その逆ですか？

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` state 変数は、フォームまたは "Thank you" ダイアログを表示するかどうかを決定します。しかし、"Thank you" ダイアログが_表示された_ためにメッセージを送信しているわけではありません。ユーザが_フォームを送信した_ためにメッセージを送信したいのです。誤解を招くエフェクトを削除し、`sendMessage` 呼び出しを `handleSubmit` イベントハンドラ内に移動してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

このバージョンでは、*フォームを送信する*（これはイベントです）ことのみがメッセージを送信することに注意してください。`showForm` が最初に `true` または `false` に設定されているかどうかに関係なく、等しく機能します。（`false` に設定すると、追加のコンソールメッセージは表示されません。）

</Solution>

</Challenges>
