# エフェクトの依存値を削除する

エフェクトを記述すると、リンタは、エフェクトが読み取るすべてのリアクティブな値（props や state など）をエフェクトの依存配列に含めたかどうかを確認します。これにより、エフェクトがコンポーネントの最新の props や state と同期していることが保証されます。不要な依存値があると、エフェクトが頻繁に実行されすぎたり、無限ループを作成したりする可能性があります。このガイドに従って、エフェクトから不要な依存値を確認して削除してください。

学ぶこと:

- 無限エフェクト依存ループの修正方法
- 依存値を削除したいときの対処法
- エフェクトに「反応」せずにエフェクトから値を読み取る方法
- オブジェクトと関数の依存関係を避ける理由と方法
- 依存関係リンタを抑制することが危険な理由と、代わりに何をすべきか

## 依存配列はコードと一致する必要がある

エフェクトを記述するとき、エフェクトに[開始と停止](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)をさせたいことを指定します。

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
    // ...
```

次に、エフェクトの依存配列を空（`[]`）のままにすると、リンタがエラーを表示します。

<ConsoleBlock level="error">

React Hook useEffect has a missing dependency: 'roomId'. Either include it or remove the dependency array.

</ConsoleBlock>

**問題は、エフェクト内のコードが、何をすべきかを決定するために `roomId` props に*依存している*ことです**。

```js {1,3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // このエフェクトは roomId を読み取る
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

依存配列に `roomId` を追加します。

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

これで[リンタエラー](#my-effect-does-something-different-after-re-running)が消えるはずです。チャットは `roomId` が変更されたときに再接続します。

注意

場合によっては、React はコンポーネント内で宣言されているにもかかわらず、値が決して変更されないことを*知っています*。例えば、`useState` から返される [`set` 関数](/reference/react/useState#setstate)や、`useRef` から返される ref オブジェクトは*安定*しています。つまり、再レンダー時に変更されないことが保証されています。安定した値はリアクティブではないため、リストから省略できます。それらを含めることは許可されています。変更されないため、問題ありません。

## 依存値を削除するには、それが依存値でないことを証明する

エフェクトの依存値を「選択」できないことに注意してください。

エフェクトのコードで使用されるすべての<CodeStep step={2}>リアクティブな値</CodeStep>は、依存配列で宣言する必要があります。依存配列は、周囲のコードによって決定されます。

```js [[2, "roomId"], [2, "serverUrl"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

[リアクティブな値](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive)には、props と、コンポーネント内で直接宣言されたすべての変数および関数が含まれます。`roomId` と `serverUrl` はリアクティブな値であるため、依存配列から削除できません。それらを省略しようとして、[React 用に正しく構成されたリンタ](/learn/editor-setup#linting)がある場合、リンタはこれを修正すべきミスとしてフラグを立てます。

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**依存値を削除するには、それが依存値である*必要がない*ことをリンタに「証明」してください**。例えば、`serverUrl` をコンポーネントの外に移動して、リアクティブではなく、再レンダー時に変更されないことを証明できます。

```js {1,8}
const serverUrl = 'https://localhost:1234'; // serverUrl はリアクティブな値ではない

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

これで、`serverUrl` がリアクティブな値ではなくなった（再レンダー時に変更できない）ため、依存値である必要がありません。**エフェクトのコードがリアクティブな値を使用していない場合、その依存配列は空（`[]`）であるべきです**。

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // serverUrl はリアクティブな値ではない
const roomId = 'music'; // roomId はリアクティブな値ではない

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
}
```

[空の依存配列を持つエフェクト](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)は、コンポーネントの props や state が変更されても再実行されません。

### 依存値を変更するには、コードを変更する

ワークフローにパターンがあることに気付いたかもしれません。

1. まず、エフェクトのコードまたはリアクティブな値の宣言方法を**変更します**。
2. 次に、リンタに従い、**変更したコードに合わせて**依存配列を調整します。
3. 依存配列が気に入らない場合は、**最初のステップに戻ります**（そしてコードを再度変更します）。

最後の部分が重要です。**依存値を変更したい場合は、まず周囲のコードを変更してください**。依存配列は、[エフェクトのコードで使用されるすべてのリアクティブな値のリスト](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)と考えることができます。そのリストに何を入れるかを*選択*するのではありません。リストは*コードを記述します*。依存配列を変更するには、コードを変更してください。

これは方程式を解くことに似ているかもしれません。目標（例えば、依存値を削除すること）から始めて、その目標に一致するコードを「見つける」必要があります。誰もが方程式を解くことが楽しいと思うわけではありませんし、エフェクトを書くことについても同じことが言えるかもしれません！ 幸いなことに、以下に試すことができる一般的なレシピのリストがあります。

落とし穴

既存のコードベースがある場合、次のようにリンタを抑制しているエフェクトがあるかもしれません。

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 このようにリンタを抑制しないでください：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**依存配列がコードと一致しない場合、バグが発生するリスクが非常に高くなります**。リンタを抑制すると、エフェクトが依存している値について React に「嘘をつく」ことになります。

代わりに、以下の手法を使用してください。

深く掘り下げる

#### 依存関係リンタを抑制することがなぜそれほど危険なのか？

リンタを抑制すると、見つけて修正するのが非常に直感的でない非常に混乱を招くバグが発生します。これは一例です。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

エフェクトを「マウント時にのみ」実行したいとしましょう。[空の（`[]`）依存配列](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)がそれを行うと読んだので、リンタを無視して、依存配列として強制的に `[]` を指定することにしました。

このカウンタは、2 つのボタンで構成可能な量だけ毎秒インクリメントされるはずでした。しかし、このエフェクトが何にも依存していないと React に「嘘をついた」ため、React は最初のレンダーからの `onTick` 関数を永遠に使用し続けます。[そのレンダー中、](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)`count` は `0` で `increment` は `1` でした。これが、そのレンダーからの `onTick` が常に毎秒 `setCount(0 + 1)` を呼び出し、常に `1` が表示される理由です。このようなバグは、複数のコンポーネントに広がると修正が困難になります。

リンタを無視するよりも常に良い解決策があります！ このコードを修正するには、`onTick` を依存配列に追加する必要があります。（インターバルが一度だけ設定されるようにするには、[`onTick` をエフェクトイベントにします](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)。）

**依存関係のリントエラーをコンパイルエラーとして扱うことをお勧めします。抑制しなければ、このようなバグは決して発生しません**。このページの残りの部分では、このケースや他のケースの代替案を文書化しています。

## 不要な依存値の削除

エフェクトの依存配列をコードに反映するように調整するたびに、依存配列を見てください。これらの依存関係のいずれかが変更されたときにエフェクトが再実行されることは理にかなっていますか？ 時々、答えは「いいえ」です。

- 異なる条件下でエフェクトの*異なる部分*を再実行したい場合があります。
- 一部の依存値の変更に「反応」するのではなく、その*最新の値*を読み取りたいだけの場合があります。
- 依存値が、オブジェクトまたは関数であるために、*意図せず*頻繁に変更される可能性があります。

正しい解決策を見つけるには、エフェクトに関するいくつかの質問に答える必要があります。それらを見ていきましょう。

### このコードはイベントハンドラに移動すべきですか？

最初に考えるべきことは、このコードがエフェクトであるべきかどうかです。

フォームを想像してください。送信時に、`submitted` という state 変数を `true` に設定します。POST リクエストを送信して通知を表示する必要があります。このロジックを、`submitted` が `true` に「反応」するエフェクト内に配置しました。

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 避けるべき：イベント固有のロジックがエフェクト内にある
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

後で、現在のテーマに従って通知メッセージをスタイリングしたいので、現在のテーマを読み取ります。`theme` はコンポーネント本体で宣言されているため、リアクティブな値であり、依存値として追加します。

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 避けるべき：イベント固有のロジックがエフェクト内にある
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ すべての依存関係が宣言されています

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

これにより、バグが発生します。まずフォームを送信してから、ダークテーマとライトテーマを切り替えるとします。`theme` が変更され、エフェクトが再実行され、同じ通知が再度表示されます！

**ここでの問題は、これがそもそもエフェクトであるべきではないということです**。この POST リクエストを送信して、通知を表示したいのは、*フォームの送信*に応答したいためです。これは特定のインタラクションです。特定のインタラクションに応答してコードを実行するには、そのロジックを対応するイベントハンドラに直接配置します。

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ 良い：イベント固有のロジックはイベントハンドラから呼び出される
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }

  // ...
}
```

これで、コードがイベントハンドラ内にあるため、リアクティブではありません。したがって、ユーザがフォームを送信したときにのみ実行されます。[イベントハンドラとエフェクトの選択](/learn/separating-events-from-effects#reactive-values-and-reactive-logic)と[不要なエフェクトの削除方法](/learn/you-might-not-need-an-effect)について詳しく読んでください。

### エフェクトは関連のない複数のことを行っていますか？

次に自問すべきことは、エフェクトが関連のない複数のことを行っているかどうかです。

ユーザが都市と地域を選択する必要がある配送フォームを作成しているとします。選択された `country` に応じてサーバから `cities` のリストを取得して、ドロップダウンに表示します。

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ すべての依存関係が宣言されています

  // ...
```

これは[エフェクトで外部システムと同期する](/learn/you-might-not-need-an-effect#fetching-data)良い例です。`cities` state を `country` props と同期させています。イベントハンドラでこれを行うことはできません。`ShippingForm` が表示されるとすぐに、また `country` が変更されたとき（どのインタラクションがそれを引き起こしても）にフェッチする必要があるためです。

次に、現在選択されている `city` の `areas` を取得する 2 番目のセレクトボックスを追加するとしましょう。同じエフェクト内に `areas` のリストのための 2 番目の `fetch` 呼び出しを追加することから始めるかもしれません。

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 避けるべき：単一のエフェクトが 2 つの独立したプロセスを同期させている
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ すべての依存関係が宣言されています

  // ...
```

しかし、エフェクトが `city` state 変数を使用するようになったため、依存配列に `city` を追加する必要がありました。これにより、問題が発生しました。ユーザが別の都市を選択すると、エフェクトが再実行され、`fetchCities(country)` を呼び出します。その結果、不必要に多くの都市リストを何度もフェッチすることになります。

**このコードの問題は、2 つの異なる無関係なものを同期していることです**。

1. `country` props に基づいて `cities` state をネットワークと同期させたい。
2. `city` state に基づいて `areas` state をネットワークと同期させたい。

ロジックを 2 つのエフェクトに分割し、それぞれが同期する必要がある props に反応するようにします。

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ すべての依存関係が宣言されています

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ すべての依存関係が宣言されています

  // ...
```

これで、最初のエフェクトは `country` が変更された場合にのみ再実行され、2 番目のエフェクトは `city` が変更されたときに再実行されます。目的によって分離しました。2 つの異なるものが 2 つの別々のエフェクトによって同期されています。2 つの別々のエフェクトには 2 つの別々の依存配列があるため、意図せずに互いをトリガすることはありません。

最終的なコードは元のコードよりも長くなりますが、これらのエフェクトを分割することは依然として正しいです。[各エフェクトは独立した同期プロセスを表す必要があります](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process)。この例では、1 つのエフェクトを削除しても、他のエフェクトのロジックは壊れません。これは、それらが*異なるもの*を同期しており、それらを分割することが良いことを意味します。コードの重複が気になる場合は、[カスタムフックに繰り返しロジックを抽出する](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)ことでこのコードを改善できます。

### 次の state を計算するために何らかの state を読み取っていますか？

このエフェクトは、新しいメッセージが到着するたびに、新しく作成された配列で `messages` state 変数を更新します。

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

既存のすべてのメッセージから始まる[新しい配列を作成](/learn/updating-arrays-in-state)し、最後に新しいメッセージを追加するために `messages` 変数を使用します。しかし、`messages` はエフェクトによって読み取られるリアクティブな値であるため、依存値である必要があります。

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ すべての依存関係が宣言されています
  // ...
```

そして、`messages` を依存値にすることで問題が発生します。

メッセージを受信するたびに、`setMessages()` はコンポーネントに、受信したメッセージを含む新しい `messages` 配列で再レンダーさせます。しかし、このエフェクトは `messages` に依存するようになったため、これはエフェクトも再同期*させます*。したがって、新しいメッセージが届くたびに、チャットが再接続されます。ユーザはそれを好まないでしょう！

問題を解決するには、エフェクト内で `messages` を読み取らないでください。代わりに、[アップデータ関数](/reference/react/useState#updating-state-based-on-the-previous-state)を `setMessages` に渡します。

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
```

**エフェクトが `messages` 変数を全く読み取らなくなったことに注目してください**。`msgs => [...msgs, receivedMessage]` のようなアップデータ関数を渡すだけで済みます。React は[アップデータ関数をキューに入れ](/learn/queueing-a-series-of-state-updates)、次のレンダー中に `msgs` 引数を提供します。これが、エフェクト自体が `messages` に依存する必要がなくなった理由です。この修正の結果、チャットメッセージを受信してもチャットが再接続されなくなります。

### 値の変更に「反応」せずに値を読み取りたいですか？

<Wip>

このセクションでは、**React の安定版でまだリリースされていない実験的な API** について説明しています。

</Wip>

ユーザが新しいメッセージを受信したときに、`isMuted` が `true` でない限り、音を鳴らしたいとします。

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

エフェクトのコードで `isMuted` を使用するようになったため、依存配列に追加する必要があります。

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ すべての依存関係が宣言されています
  // ...
```

問題は、`isMuted` が変更されるたびに（例えば、ユーザが "Muted" トグルを押したとき）、エフェクトが再同期し、チャットに再接続することです。これは望ましいユーザエクスペリエンスではありません！（この例では、リンタを無効にしても機能しません。そうすると、`isMuted` が古い値で「スタック」します。）

この問題を解決するには、リアクティブであるべきではないロジックをエフェクトから抽出する必要があります。このエフェクトが `isMuted` の変更に「反応」することを望んでいません。[この非リアクティブなロジックの一部をエフェクトイベントに移動します](/learn/separating-events-from-effects#declaring-an-effect-event)。

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
```

エフェクトイベントを使用すると、エフェクトをリアクティブな部分（`roomId` とその変更のようなリアクティブな値に「反応」すべき）と非リアクティブな部分（`onMessage` が `isMuted` を読み取るように、最新の値を読み取るだけ）に分割できます。**エフェクトイベント内で `isMuted` を読み取るようになったため、エフェクトの依存値である必要はありません**。その結果、"Muted" 設定をオンまたはオフに切り替えたときにチャットが再接続されなくなり、元の問題が解決されます！

#### props からイベントハンドラをラップする

コンポーネントがイベントハンドラを props として受け取る場合、同様の問題が発生する可能性があります。

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ すべての依存関係が宣言されています
  // ...
```

親コンポーネントが再レンダーされるたびに*異なる* `onReceiveMessage` 関数を渡すとします。

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

`onReceiveMessage` は依存値であるため、親が再レンダーされるたびにエフェクトが再同期されます。これにより、チャットが再接続されます。これを解決するには、呼び出しをエフェクトイベントでラップします。

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
```

エフェクトイベントはリアクティブではないため、依存値として指定する必要はありません。その結果、親コンポーネントが再レンダーされるたびに異なる関数を渡しても、チャットは再接続されなくなります。

#### リアクティブなコードと非リアクティブなコードの分離

この例では、`roomId` が変更されるたびに訪問をログに記録したいとします。現在の `notificationCount` を各ログに含めたいのですが、`notificationCount` の変更によってログイベントをトリガ*したくありません*。

解決策は、再び非リアクティブなコードをエフェクトイベントに分割することです。

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

ロジックを `roomId` に関してリアクティブにしたいので、エフェクト内で `roomId` を読み取ります。ただし、`notificationCount` の変更によって追加の訪問がログに記録されることは望んでいないため、エフェクトイベント内で `notificationCount` を読み取ります。[エフェクトイベントを使用してエフェクトから最新の props と state を読み取る方法について詳しく読んでください](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)。

### 一部のリアクティブな値が意図せず変更されますか？

時には、エフェクトが特定の値に「反応」することを*望んでいる*が、その値が望むよりも頻繁に変更され、ユーザの視点から実際の変更を反映していない場合があります。例えば、コンポーネントの本体で `options` オブジェクトを作成し、そのオブジェクトをエフェクト内から読み取るとします。

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

このオブジェクトはコンポーネント本体で宣言されているため、[リアクティブな値](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive)です。エフェクト内でこのようなリアクティブな値を読み取ると、依存値として宣言します。これにより、エフェクトがその変更に「反応」することが保証されます。

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ すべての依存関係が宣言されています
  // ...
```

依存値として宣言することが重要です！ これにより、例えば `roomId` が変更された場合、エフェクトが新しい `options` でチャットに再接続することが保証されます。しかし、上記のコードには問題もあります。それを確認するには、以下のサンドボックスの入力欄に入力してみて、コンソールで何が起こるかを確認してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装では本当にサーバに接続します
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

上記のサンドボックスで、入力欄は `message` state 変数のみを更新します。ユーザの視点から見ると、これはチャット接続に影響を与えるべきではありません。しかし、`message` を更新するたびに、コンポーネントが再レンダーされます。コンポーネントが再レンダーされると、その中のコードが最初から再実行されます。

`ChatRoom` コンポーネントが再レンダーされるたびに、新しい `options` オブジェクトが最初から作成されます。React は、`options` オブジェクトが前回のレンダー中に作成された `options` オブジェクトとは*異なるオブジェクト*であることを認識します。これが、エフェクトが（`options` に依存している）再同期され、入力中にチャットが再接続される理由です。

**この問題はオブジェクトと関数にのみ影響します。JavaScript では、新しく作成されたオブジェクトと関数はすべて、他のすべてのオブジェクトと異なると見なされます。それらの中の内容が同じであっても関係ありません！**

```js {7-8}
// 最初のレンダー中
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// 次のレンダー中
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// これらは 2 つの異なるオブジェクトです！
console.log(Object.is(options1, options2)); // false
```

**オブジェクトと関数の依存関係により、エフェクトが必要以上に頻繁に再同期される可能性があります**。

これが、可能な限り、オブジェクトと関数をエフェクトの依存値として避けるべき理由です。代わりに、それらをコンポーネントの外、エフェクトの内、またはプリミティブ値を抽出してみてください。

#### 静的なオブジェクトと関数をコンポーネントの外に移動する

オブジェクトが props や state に依存しない場合、そのオブジェクトをコンポーネントの外に移動できます。

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
```

このようにして、それがリアクティブでないことをリンタに*証明*します。再レンダーの結果として変更されることはないため、依存値である必要はありません。これで、`ChatRoom` を再レンダーしてもエフェクトが再同期されなくなります。

これは関数に対しても機能します。

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
```

`createOptions` がコンポーネントの外で宣言されているため、リアクティブな値ではありません。これが、エフェクトの依存配列で指定する必要がなく、エフェクトが再同期されない理由です。

#### 動的なオブジェクトと関数をエフェクト内に移動する

オブジェクトが、`roomId` props のように再レンダーの結果として変更される可能性のあるリアクティブな値に依存している場合、コンポーネントの*外*に引き出すことはできません。しかし、その作成をエフェクトのコード*内*に移動することはできます。

```js {7-10,11,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
```

これで、`options` がエフェクト内で宣言されたので、エフェクトの依存値ではなくなりました。代わりに、エフェクトで使用される唯一のリアクティブな値は `roomId` です。`roomId` はオブジェクトや関数ではないため、*意図せず*異なることはありません。JavaScript では、数値と文字列はその内容によって比較されます。

```js {7-8}
// 最初のレンダー中
const roomId1 = 'music';

// 次のレンダー中
const roomId2 = 'music';

// これらの 2 つの文字列は同じです！
console.log(Object.is(roomId1, roomId2)); // true
```

この修正により、入力欄を編集してもチャットは再接続されなくなります。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装では本当にサーバに接続します
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

しかし、期待どおり、`roomId` ドロップダウンを変更すると再接続*されます*。

これは関数に対しても機能します。

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
```

エフェクト内でロジックをグループ化するために独自の関数を記述できます。エフェクト*内*で宣言する限り、リアクティブな値ではないため、エフェクトの依存値である必要はありません。

#### オブジェクトからプリミティブ値を読み取る

props からオブジェクトを受け取ることがあります。

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ すべての依存関係が宣言されています
  // ...
```

ここでのリスクは、親コンポーネントがレンダー中にオブジェクトを作成することです。

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

これにより、親コンポーネントが再レンダーされるたびにエフェクトが再接続されます。これを修正するには、エフェクトの*外*でオブジェクトから情報を読み取り、オブジェクトと関数の依存関係を避けます。

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ すべての依存関係が宣言されています
  // ...
```

ロジックが少し反復的になります（エフェクトの外でオブジェクトから値を読み取り、次にエフェクト内で同じ値を持つオブジェクトを作成します）。しかし、エフェクトが実際に依存している情報が非常に明確になります。親コンポーネントによって意図せずオブジェクトが再作成された場合、チャットは再接続されません。しかし、`options.roomId` または `options.serverUrl` が実際に異なる場合、チャットは再接続されます。

#### 関数からプリミティブ値を計算する

同じアプローチは関数に対しても機能します。例えば、親コンポーネントが関数を渡すとします。

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

依存値にすることを避けるために（そして、再レンダー時に再接続されることを防ぐために）、エフェクトの外で呼び出します。これにより、オブジェクトではない `roomId` と `serverUrl` の値が得られ、エフェクト内から読み取ることができます。

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ すべての依存関係が宣言されています
  // ...
```

これは[純粋な](/learn/keeping-components-pure)関数に対してのみ機能します。レンダー中に呼び出しても安全だからです。関数がイベントハンドラであるが、その変更によってエフェクトが再同期されることを望まない場合は、[代わりにエフェクトイベントにラップしてください](#do-you-want-to-read-a-value-without-reacting-to-its-changes)。

## まとめ

- 依存配列は常にコードと一致する必要があります。
- 依存配列が気に入らない場合は、編集する必要があるのはコードです。
- リンタを抑制すると、非常に混乱を招くバグが発生し、常に避けるべきです。
- 依存値を削除するには、それが必要ないことをリンタに「証明」する必要があります。
- 特定のインタラクションに応答してコードを実行する必要がある場合は、そのコードをイベントハンドラに移動します。
- エフェクトの異なる部分が異なる理由で再実行される必要がある場合は、複数のエフェクトに分割します。
- 以前の state に基づいて state を更新したい場合は、アップデータ関数を渡します。
- 「反応」せずに最新の値を読み取りたい場合は、エフェクトからエフェクトイベントを抽出します。
- JavaScript では、オブジェクトと関数は異なる時間に作成された場合、異なると見なされます。
- オブジェクトと関数の依存関係を避けるようにしてください。それらをコンポーネントの外またはエフェクトの内に移動します。
