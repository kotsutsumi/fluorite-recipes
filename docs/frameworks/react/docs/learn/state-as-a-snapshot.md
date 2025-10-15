# state はスナップショットである

state 変数は、読んだり書いたりできる普通の JavaScript の変数のように見えるかもしれません。しかし、state はむしろスナップショットのように振る舞います。state をセットしても、既にある state 変数は変更されず、代わりに再レンダーがトリガされます。

## このページで学ぶこと

- state のセットが再レンダーをどのようにトリガするのか
- state がいつどのように更新されるか
- state がセットされた直後に更新されない理由
- イベントハンドラが state の「スナップショット」にどのようにアクセスするのか

## state のセットでレンダーがトリガされる

ユーザインターフェースとはクリックなどのユーザイベントに直接反応して更新されるものだ、と考えているかもしれません。React の動作は、このような考え方とは少し異なります。前のページで、[state をセットすることで再レンダーを React に要求](/learn/render-and-commit#step-1-trigger-a-render)しているのだ、ということを見てきました。これは、インターフェースがイベントに応答するためには、*state を更新*する必要があることを意味します。

この例では、「send」を押すと、`setIsSent(true)` が React に UI を再レンダーするよう指示します。

```jsx
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

ボタンをクリックすると、次のことが起こります。

1. `onSubmit` イベントハンドラが実行されます。
2. `setIsSent(true)` が `isSent` を `true` にセットし、新しいレンダーをキューに入れます。
3. React は新しい `isSent` 値に従ってコンポーネントを再レンダーします。

state とレンダーの関係を詳しく見てみましょう。

## レンダーはその時点でのスナップショットを撮る

[「レンダー」](/learn/render-and-commit#step-2-react-renders-your-components)とは、React がコンポーネント、すなわち関数を呼び出すことを意味します。その関数から返される JSX は、時間におけるその UI のスナップショットのようなものです。props、イベントハンドラ、ローカル変数はすべて、**レンダー時の state を使用して**計算されたものです。

写真やムービーのフレームとは異なり、返される UI「スナップショット」はインタラクティブです。イベントハンドラのようなロジックが含まれており、入力に応答して何が起こるかを指定します。React は、このスナップショットに一致するように画面を更新し、イベントハンドラを接続します。その結果、ボタンを押すと、JSX からのクリックハンドラがトリガされます。

React がコンポーネントを再レンダーするとき：

1. React が再び関数を呼び出します。
2. 関数が新しい JSX スナップショットを返します。
3. React はその後、返されたスナップショットに一致するように画面を更新します。

![React がコンポーネントを再実行する様子を示す図](https://react.dev/images/docs/illustrations/i_render1.png)

コンポーネントのメモリとして、state は、関数が返った後に消える通常の変数とは異なります。state は実際には、React 自体に「存在」します。まるで棚に置かれているかのように、関数の外に存在します。React がコンポーネントを呼び出すと、特定のレンダーに対する state のスナップショットを提供します。コンポーネントは、**そのレンダーの state 値を使用して**計算された、新しい props セットとイベントハンドラを含む UI のスナップショットを JSX で返します！

![React が state を「更新」する様子を示す図](https://react.dev/images/docs/illustrations/i_render2.png)

これがどのように機能するかを示す小さな実験があります。この例では、「+3」ボタンをクリックすると、`setNumber(number + 1)` を 3 回呼び出すため、カウンタが 3 回増加すると予想するかもしれません。

「+3」ボタンをクリックしたときに何が起こるか見てみましょう。

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

`number` は 1 回のクリックごとに 1 回しか増加しないことに注意してください！

**state をセットすると、*次の*レンダーに対してのみ変更されます。** 最初のレンダー中、`number` は `0` でした。これが、*そのレンダーの* `onClick` ハンドラで、`setNumber(number + 1)` が呼び出された後でも `number` の値がまだ `0` である理由です。

```jsx
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

このボタンのクリックハンドラが React に指示する内容は次のとおりです。

1. `setNumber(number + 1)`: `number` は `0` なので `setNumber(0 + 1)` です。
   - React は次のレンダーで `number` を `1` に変更する準備をします。
2. `setNumber(number + 1)`: `number` は `0` なので `setNumber(0 + 1)` です。
   - React は次のレンダーで `number` を `1` に変更する準備をします。
3. `setNumber(number + 1)`: `number` は `0` なので `setNumber(0 + 1)` です。
   - React は次のレンダーで `number` を `1` に変更する準備をします。

`setNumber(number + 1)` を 3 回呼び出しましたが、*このレンダーの*イベントハンドラでは `number` は常に `0` なので、state を `1` に 3 回セットしています。これが、イベントハンドラが終了した後、React がコンポーネントを `number` が `3` ではなく `1` で再レンダーする理由です。

コード内で state 変数をその値で置き換えることで、これを視覚化することもできます。*このレンダー*では `number` state 変数は `0` なので、イベントハンドラは次のようになります。

```jsx
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

次のレンダーでは、`number` は `1` なので、*そのレンダーの*クリックハンドラは次のようになります。

```jsx
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

これが、ボタンを再度クリックすると、カウンタが `2` に設定され、次のクリックで `3` になる、という理由です。

## 時間経過と state

さて、楽しいものです。このボタンをクリックすると何がアラート表示されるか推測してみてください。

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

以前の置き換え方法を使用すると、アラートに「0」が表示されることがわかります。

```jsx
setNumber(0 + 5);
alert(0);
```

しかし、アラートにタイマーを設定して、コンポーネントが再レンダーされた*後*にのみ発火するようにしたらどうでしょうか？「0」と表示されるでしょうか、それとも「5」と表示されるでしょうか？推測してみてください！

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

驚きましたか？置き換え方法を使用すると、アラートに渡された state の「スナップショット」を見ることができます。

```jsx
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

アラートが実行されるまでに、React に保存されている state は変更されている可能性がありますが、ユーザがやり取りした時点での state のスナップショットを使用してスケジュールされました！

**イベントハンドラのコードが非同期であっても、state 変数の値はレンダー内で決して変わりません。** *そのレンダーの* `onClick` では、`setNumber(number + 5)` が呼び出された後でも、`number` の値は `0` のままです。その値は、React がコンポーネントを呼び出して UI の「スナップショット」を撮ったときに「固定」されました。

これにより、イベントハンドラがタイミングエラーを起こしにくくなる例を次に示します。以下は、5 秒の遅延でメッセージを送信するフォームです。次のシナリオを想像してください。

1. 「送信」ボタンを押して、Alice に「Hello」を送信します。
2. 5 秒の遅延が終了する前に、「To」フィールドの値を「Bob」に変更します。

`alert` に何が表示されると思いますか？「You said Hello to Alice」と表示されるでしょうか？それとも「You said Hello to Bob」と表示されるでしょうか？あなたが知っていることに基づいて推測してから、試してみてください。

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

**React は、1 つのレンダーのイベントハンドラ内で state 値を「固定」して保持します。** コードの実行中に state が変更されたかどうかを心配する必要はありません。

しかし、再レンダー前に最新の state を読み取りたい場合はどうでしょうか？次のページで説明する [state 更新用関数](/learn/queueing-a-series-of-state-updates)を使用したいと思うでしょう！

## まとめ

- state をセットすると、新しいレンダーがリクエストされます。
- React は、コンポーネントの外部に、棚に並んでいるかのように state を保存します。
- `useState` を呼び出すと、React は*そのレンダーの* state のスナップショットを提供します。
- 変数とイベントハンドラは、再レンダーを「生き延びません」。すべてのレンダーには独自のイベントハンドラがあります。
- すべてのレンダー（およびその内部の関数）は、常に React が*そのレンダー*に与えた state のスナップショットを「見ます」。
- イベントハンドラ内で state を置き換えることで、レンダーされた JSX について考えるのと同様に、state について考えることができます。
- 過去に作成されたイベントハンドラは、それらが作成されたレンダーからの state 値を持ちます。

## 次のステップ

[一連の state 更新をキューに入れる](/learn/queueing-a-series-of-state-updates)を読んで、state 更新のキューの仕組みを学びましょう。
