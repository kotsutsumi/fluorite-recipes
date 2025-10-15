# ref で値を参照する

コンポーネントに情報を「記憶」させたいが、その情報が[新しいレンダーをトリガ](/learn/render-and-commit)しないようにしたい場合、*ref* を使うことができます。

<YouWillLearn>

- コンポーネントに ref を追加する方法
- ref の値を更新する方法
- ref と state の違い
- ref を安全に使う方法

</YouWillLearn>

## コンポーネントに ref を追加する

React から `useRef` フックをインポートすることで、コンポーネントに ref を追加できます。

```js
import { useRef } from 'react';
```

コンポーネント内で、`useRef` フックを呼び出し、引数として参照したい初期値を渡します。例えば、以下は値 `0` への ref です。

```js
const ref = useRef(0);
```

`useRef` は以下のようなオブジェクトを返します。

```js
{
  current: 0 // useRef に渡した値
}
```

<Diagram>

![An arrow with 'current' written on it stuffed into a pocket with 'ref' written on it.](https://react.dev/images/docs/illustrations/i_ref.png)

</Diagram>

ref の現在の値には、`ref.current` プロパティを通じてアクセスできます。この値は意図的にミュータブル（変更可能）であり、読み書きの両方が可能です。これは、React が追跡しないコンポーネントの秘密のポケットのようなものです。（これが、React の一方向データフローからの「避難ハッチ」となる理由です。詳細は後述します！）

ここでは、ボタンをクリックするたびに `ref.current` をインクリメントしています。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

ref は数値を指していますが、[state](/learn/state-a-components-memory) のように、文字列、オブジェクト、あるいは関数など、何でも指すことができます。state とは異なり、ref は `current` プロパティを持つプレーンな JavaScript オブジェクトであり、読み取りと変更が可能です。

**コンポーネントはインクリメントごとに再レンダーされないことに注意してください。** state と同様に、ref は React によってレンダー間で保持されます。しかし、state をセットするとコンポーネントが再レンダーされます。ref を変更しても再レンダーされません！

## 例：ストップウォッチの作成

ref と state を 1 つのコンポーネントで組み合わせることができます。例えば、ユーザがボタンを押すことで開始または停止できるストップウォッチを作成しましょう。ユーザが "Start" を押してからどれだけの時間が経過したかを表示するには、Start ボタンが押された時刻と現在時刻を追跡する必要があります。**この情報はレンダーに使用されるため、state に保持します。**

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

ユーザが "Start" を押したら、[`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) を使用して 10 ミリ秒ごとに時刻を更新します。

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // カウントを開始します。
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // 10ms ごとに現在時刻を更新します。
      setNow(Date.now());
    }, 10);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
    </>
  );
}
```

</Sandpack>

"Stop" ボタンが押されたら、`now` state 変数の更新を停止するために、既存のインターバルをキャンセルする必要があります。これは [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) を呼び出すことで行うことができますが、ユーザが Start を押したときに以前に `setInterval` の呼び出しで返されたインターバル ID を渡す必要があります。インターバル ID をどこかに保持する必要があります。**インターバル ID はレンダーに使用されないため、ref に保持できます。**

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

情報がレンダーに使用される場合は、state に保持します。情報がイベントハンドラでのみ必要で、変更してもレンダーが不要な場合は、ref を使用する方が効率的です。

## ref と state の違い

ref は state よりも「厳格でない」ように思えるかもしれません。例えば、常に state セット関数を使用する必要がある代わりに、ref を変更することができます。しかし、ほとんどの場合、state を使用することになります。ref は、頻繁に必要としない「避難ハッチ」です。state と ref を比較すると以下のようになります。

| ref | state |
| --- | --- |
| `useRef(initialValue)` は `{ current: initialValue }` を返す | `useState(initialValue)` は state 変数の現在の値と state セッター関数を返す (`[value, setValue]`) |
| 変更しても再レンダーがトリガされない | 変更すると再レンダーがトリガされる |
| ミュータブル — レンダープロセスの外で `current` の値を変更および更新できる | 「イミュータブル」— state セッター関数を使用して state 変数を変更し、再レンダーをキューに入れる必要がある |
| レンダー中に `current` の値を読み取る（または書き込む）べきではない | いつでも state を読み取ることができる。ただし、各レンダーには変更されない独自の state の[スナップショット](/learn/state-as-a-snapshot)がある |

以下は、state で実装されたカウンタボタンです。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

`count` の値が表示されるため、state 値を使用することが理にかなっています。カウンタの値が `setCount()` でセットされると、React はコンポーネントを再レンダーし、新しいカウントを反映するように画面が更新されます。

これを ref で実装しようとしても、React はコンポーネントを再レンダーしないため、カウントが変わることはありません！ このボタンをクリックしても**テキストが更新されない**ことを確認してください。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // これはコンポーネントを再レンダーしません！
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

これが、レンダー中に `ref.current` を読み取ると、信頼性の低いコードになる理由です。それが必要な場合は、代わりに state を使用してください。

<DeepDive>

#### useRef の内部動作

`useState` と `useRef` の両方が React によって提供されていますが、原則として `useRef` は `useState` の*上に*実装できます。React の内部では、`useRef` が以下のように実装されていると想像できます。

```js
// React 内部
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

最初のレンダー中に、`useRef` は `{ current: initialValue }` を返します。このオブジェクトは React によって保存されるため、次のレンダー時には同じオブジェクトが返されます。この例では state セッターがどのように使用されていないかに注目してください。`useRef` は常に同じオブジェクトを返す必要があるため、不要です！

React は、実際には `useRef` の組み込みバージョンを提供しています。これは非常に一般的であるためです。しかし、セッターなしの通常の state 変数と考えることができます。オブジェクト指向プログラミングに精通している場合、ref はインスタンスフィールドを思い起こさせるかもしれませんが、`this.something` の代わりに `somethingRef.current` と書きます。

</DeepDive>

## ref を使用するタイミング

通常、コンポーネントが React の「外に出て」外部 API（コンポーネントの外観に影響を与えないブラウザ API など）と通信する必要がある場合に、ref を使用します。以下は、これらのまれな状況のいくつかです。

- [タイムアウト ID](https://developer.mozilla.org/docs/Web/API/setTimeout) の保存
- [次のページ](/learn/manipulating-the-dom-with-refs)で説明する [DOM 要素](https://developer.mozilla.org/docs/Web/API/Element)の保存と操作
- JSX を計算するために必要でない他のオブジェクトの保存

コンポーネントが値を保存する必要があるが、レンダーロジックに影響を与えない場合は、ref を選択してください。

## ref のベストプラクティス

以下の原則に従うことで、コンポーネントがより予測可能になります。

- **ref を避難ハッチとして扱う。** ref は、外部システムやブラウザ API を使用する場合に便利です。アプリケーションのロジックやデータフローの多くが ref に依存している場合は、アプローチを再考する必要があるかもしれません。
- **レンダー中に `ref.current` を読み書きしない。** レンダー中に必要な情報がある場合は、代わりに [state](/learn/state-a-components-memory) を使用してください。React は `ref.current` がいつ変更されるかを知らないため、レンダー中に読み取るだけでも、コンポーネントの動作を予測しにくくなります。（唯一の例外は、`if (!ref.current) ref.current = new Thing()` のようなコードで、最初のレンダー中に一度だけ ref を設定する場合です。）

React state の制限は、ref には適用されません。例えば、state は[各レンダーのスナップショット](/learn/state-as-a-snapshot)のように動作し、[同期的に更新されません](/learn/queueing-a-series-of-state-updates)。しかし、ref の現在の値を変更すると、すぐに変更されます。

```js
ref.current = 5;
console.log(ref.current); // 5
```

これは、**ref 自体が通常の JavaScript オブジェクトである**ため、そのように動作するからです。

また、ref を使用する場合、[ミューテーションを避ける](/learn/updating-objects-in-state)ことを心配する必要はありません。変更するオブジェクトがレンダーに使用されていない限り、React は ref やその内容で何をしても気にしません。

## ref と DOM

ref は任意の値を指すことができます。しかし、ref の最も一般的な使用例は、DOM 要素にアクセスすることです。例えば、プログラムで入力にフォーカスを当てたい場合に便利です。JSX の `ref` 属性に ref を渡すと、例えば `<div ref={myRef}>` のように、React は対応する DOM 要素を `myRef.current` に配置します。要素が DOM から削除されると、React は `myRef.current` を `null` に更新します。詳細については、[ref で DOM を操作する](/learn/manipulating-the-dom-with-refs)で読むことができます。

<Recap>

- ref は、レンダーに使用されない値を保持するための避難ハッチです。頻繁に必要とはなりません。
- ref は、`current` という単一のプロパティを持つプレーンな JavaScript オブジェクトであり、読み取りまたは設定できます。
- `useRef` フックを呼び出すことで、React に ref を渡すよう要求できます。
- state と同様に、ref はコンポーネントの再レンダー間で情報を保持できます。
- state とは異なり、ref の `current` 値を設定しても再レンダーはトリガされません。
- レンダー中に `ref.current` を読み書きしないでください。これにより、コンポーネントの動作を予測しにくくなります。

</Recap>

<Challenges>

#### 壊れたチャット入力を修正する

メッセージを入力して "Send" をクリックしてください。"Sent!" アラートが表示される前に 3 秒の遅延があることに気付くでしょう。この遅延中に、"Undo" ボタンが表示されます。それをクリックしてください。この "Undo" ボタンは、`handleSend` 中に保存されたタイムアウト ID に対して [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) を呼び出して、"Sent!" メッセージが表示されないようにします。しかし、"Undo" をクリックした後も、"Sent!" メッセージが表示されます。なぜ機能しないのかを見つけて、修正してください。

<Hint>

`let timeoutID` のような通常の変数は、すべての再レンダー間で「生き残る」ことはありません。なぜなら、各レンダーがコンポーネントを（およびその変数を）ゼロから実行するからです。タイムアウト ID をどこか他の場所に保持する必要がありますか？

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

コンポーネントが再レンダーされるたびに（state が設定されたときのように）、すべてのローカル変数がゼロから初期化されます。これが、`timeoutID` のようなローカル変数にタイムアウト ID を保存してから、別のイベントハンドラがそれを「見る」ことを期待できない理由です。代わりに、React がレンダー間で保持する ref に保存してください。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>

#### 再レンダーに失敗したコンポーネントを修正する

このボタンは "On" と "Off" を切り替えることになっています。しかし、常に "Off" と表示されます。このコードの何が問題ですか？修正してください。

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

この例では、ref の現在の値がレンダー出力の計算に使用されています：`{isOnRef.current ? 'On' : 'Off'}`。これは、この情報が ref にあるべきではなく、代わりに state にあるべきであることのサインです。それを修正するには、ref を削除し、代わりに state を使用してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### デバウンスを修正する

この例では、すべてのボタンクリックハンドラが[「デバウンス」](https://redd.one/blog/debounce-vs-throttle)されています。何を意味するかを確認するには、いずれかのボタンを押してください。メッセージが 1 秒後に表示されることに気付くでしょう。メッセージを待っている間にボタンを押すと、タイマーがリセットされます。したがって、同じボタンを何度もすばやくクリックし続けると、クリックを*停止*してから 1 秒後まで、メッセージが表示されません。デバウンスを使用すると、ユーザが「何かをするのをやめる」まで、何らかのアクションを遅延させることができます。

この例は動作しますが、意図したとおりではありません。ボタンは独立していません。問題を確認するには、いずれかのボタンをクリックしてから、すぐに別のボタンをクリックしてください。両方のボタンのメッセージが表示されることを期待しますが、最後のボタンのメッセージのみが表示されます。最初のボタンのメッセージが失われます。

なぜボタンが互いに干渉しているのですか？問題を見つけて修正してください。

<Hint>

最後のタイムアウト ID 変数は、すべての `DebouncedButton` コンポーネント間で共有されています。これが、1 つのボタンをクリックすると別のボタンのタイムアウトがリセットされる理由です。各ボタンに個別のタイムアウト ID を保存できますか？

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

`timeoutID` のような変数は、すべてのコンポーネント間で共有されます。これが、2 番目のボタンをクリックすると最初のボタンの保留中のタイムアウトがリセットされる理由です。これを修正するには、ref にタイムアウトを保持できます。各ボタンは独自の ref を取得するため、互いに衝突しません。2 つのボタンをすばやくクリックすると、両方のメッセージが表示されることに注目してください。

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### 最新の state を読み取る

この例では、"Send" を押した後、メッセージが表示される前にわずかな遅延があります。"hello" と入力し、Send を押してから、入力フィールドをすばやく再度編集してください。編集にもかかわらず、アラートには依然として "hello" と表示されます（ボタンがクリックされた[時点での](/learn/state-as-a-snapshot#state-over-time) state の値）。

通常、この動作はアプリで望むものです。しかし、非同期コードで*最新*の state を読み取る必要がある場合があることがあります。アラートにクリック時ではなく*現在*の入力テキストを表示する方法を考えられますか？

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

State は[スナップショットのように動作する](/learn/state-as-a-snapshot)ため、タイムアウトなどの非同期操作から最新の state を読み取ることはできません。ただし、最新の入力テキストを ref に保持できます。ref はミュータブルであるため、いつでも `current` プロパティを読み取ることができます。現在のテキストはレンダーにも使用されるため、この例では、state 変数（レンダー用）*および* ref（タイムアウトで読み取る）の両方が必要です。現在の ref 値を手動で更新する必要があります。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
