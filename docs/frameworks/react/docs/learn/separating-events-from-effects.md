# エフェクトからイベントを分離する

<Wip>

このセクションでは、**React の安定版でまだリリースされていない実験的な API** について説明しています。

</Wip>

イベントハンドラは、同じインタラクションを再度実行したときにのみ再実行されます。イベントハンドラとは異なり、エフェクトは、前回のレンダー時とは異なる値（props や state 変数など）を読み取った場合に再同期します。時には、両方の動作の組み合わせが必要な場合もあります。つまり、一部の値に反応して再実行されるエフェクトだが、他の値には反応しないエフェクトです。このページでは、その方法を学びます。

学ぶこと:

- イベントハンドラとエフェクトの選択方法
- エフェクトがリアクティブで、イベントハンドラがリアクティブでない理由
- エフェクトのコードの一部を非リアクティブにしたいときの対処法
- エフェクトイベントとは何か、エフェクトから抽出する方法
- エフェクトイベントを使ってエフェクトから最新の props と state を読み取る方法

## イベントハンドラとエフェクトの選択

まず、イベントハンドラとエフェクトの違いを振り返ってみましょう。

チャットルームコンポーネントを実装していると想像してください。要件は次のようになります。

1. コンポーネントは、選択されたチャットルームに自動的に接続する必要があります。
2. "Send" ボタンをクリックすると、チャットにメッセージが送信される必要があります。

すでにそれらのコードを実装したとしましょうが、どこに配置すべきか迷っています。イベントハンドラとエフェクトのどちらを使うべきでしょうか？ この質問に答える必要があるたびに、[*なぜ*コードが実行される必要があるか](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)を考えてください。

### イベントハンドラは特定のインタラクションに応答して実行される

ユーザの視点から見ると、メッセージを送信することは、特定の "Send" ボタンがクリックされた*ため*に起こるはずです。ユーザは、他の時間や理由でメッセージが送信されると非常に怒るでしょう。これが、メッセージの送信がイベントハンドラであるべき理由です。イベントハンドラを使用すると、特定のインタラクションを処理できます。

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

イベントハンドラを使用すると、`sendMessage(message)` はユーザがボタンをクリックした*場合にのみ*実行されることが確実になります。

### エフェクトは同期が必要なときはいつでも実行される

また、コンポーネントをチャットルームに接続しておく必要があることを思い出してください。そのコードはどこに配置しますか？

このコードを実行する*理由*は、特定のインタラクションではありません。ユーザがチャットルーム画面に移動した理由や方法は関係ありません。ユーザがそれを見ていてやり取りできる状態になったので、コンポーネントは選択されたチャットサーバに接続されたままである必要があります。チャットルームコンポーネントがアプリの最初の画面であり、ユーザがインタラクションを一切行っていない場合でも、*依然として*接続する必要があります。これがエフェクトである理由です。

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

このコードを使用すると、ユーザが実行した特定のインタラクションに*関係なく*、現在選択されているチャットサーバへの接続が常にアクティブであることを確認できます。ユーザがアプリを開いただけでも、別のルームを選択しても、別の画面に移動して戻ってきても、エフェクトはコンポーネントが現在選択されているルームと*同期したまま*であることを保証し、[必要に応じて再接続します](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
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
input, select { margin-right: 20px; }
```

</Sandpack>

## リアクティブな値とリアクティブなロジック

直感的には、イベントハンドラは常に「手動で」トリガされると言えます。例えば、ボタンをクリックすることによってです。一方、エフェクトは「自動的に」実行されます。同期を維持するために必要な回数だけ実行され、再実行されます。

これについて考えるより正確な方法があります。

コンポーネント本体内で宣言された props、state、変数は、<CodeStep step={2}>リアクティブな値</CodeStep>と呼ばれます。この例では、`serverUrl` はリアクティブな値ではありませんが、`roomId` と `message` はリアクティブな値です。それらはレンダーのデータフローに参加します。

```js [[2, "roomId"], [2, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

このようなリアクティブな値は、再レンダーのために変更される可能性があります。例えば、ユーザが `message` を編集したり、ドロップダウンで別の `roomId` を選択したりする場合です。イベントハンドラとエフェクトは、変更に対して異なる応答をします。

- **イベントハンドラ内のロジックは*リアクティブではありません*。** ユーザが同じインタラクション（クリックなど）を再度実行しない限り、再実行されません。イベントハンドラは、変更に「反応」せずにリアクティブな値を読み取ることができます。
- **エフェクト内のロジックは*リアクティブです*。** エフェクトがリアクティブな値を読み取る場合、[依存配列として指定する必要があります](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。その後、再レンダーによってその値が変更されると、React は新しい値でエフェクトのロジックを再実行します。

この違いを説明するために、前の例を再度見てみましょう。

### イベントハンドラ内のロジックはリアクティブではない

このコード行を見てください。このロジックはリアクティブであるべきでしょうか、そうでないでしょうか？

```js [[2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

ユーザの視点から見ると、**`message` の変更は、メッセージを送信したいという意味*ではありません*。** それは、ユーザが入力中であることを意味するだけです。言い換えれば、メッセージを送信するロジックはリアクティブであるべきではありません。<CodeStep step={2}>リアクティブな値</CodeStep>が変更されたという理由だけで再実行されるべきではありません。そのため、イベントハンドラに属しています。

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

イベントハンドラはリアクティブではないため、`sendMessage(message)` はユーザが Send ボタンをクリックしたときにのみ実行されます。

### エフェクト内のロジックはリアクティブ

それでは、これらの行に戻りましょう。

```js [[2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

ユーザの視点から見ると、**`roomId` の変更は、別のルームに接続したいという意味です。** 言い換えれば、ルームに接続するロジックはリアクティブであるべきです。これらのコード行が<CodeStep step={2}>リアクティブな値</CodeStep>に「追従」し、その値が異なる場合に再実行されることを*望んでいます*。そのため、エフェクトに属しています。

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

エフェクトはリアクティブなので、`createConnection(serverUrl, roomId)` と `connection.connect()` は `roomId` の個別の値ごとに実行されます。エフェクトは、チャット接続を現在選択されているルームに同期させます。

## エフェクトから非リアクティブなロジックを抽出する

リアクティブなロジックと非リアクティブなロジックを混在させたい場合、事態はより複雑になります。

例えば、ユーザがチャットに接続したときに通知を表示したいとします。現在のテーマ（ダークまたはライト）を props から読み取り、正しい色で通知を表示します。

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

しかし、`theme` はリアクティブな値（再レンダーの結果として変更される可能性がある）であり、[エフェクトが読み取るすべてのリアクティブな値は依存配列として宣言する必要があります](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)。そのため、`theme` をエフェクトの依存配列として指定する必要があります。

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ すべての依存関係が宣言されています
  // ...
```

この例で試して、ユーザエクスペリエンスの問題を見つけられるか確認してください。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 実際の実装では本当にサーバに接続します
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

`roomId` が変更されると、チャットは期待どおりに再接続されます。しかし、`theme` も依存関係であるため、ダークテーマとライトテーマを切り替えるたびにチャットも再接続されます。これは良くありません！

言い換えれば、この行はエフェクト内にあるにもかかわらず、リアクティブに*したくない*のです。

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

この非リアクティブなロジックを、周囲のリアクティブなエフェクトから分離する方法が必要です。

### エフェクトイベントの宣言

<Wip>

このセクションでは、**React の安定版でまだリリースされていない実験的な API** について説明しています。

</Wip>

[`useEffectEvent`](/reference/react/experimental_useEffectEvent) という特別なフックを使用して、この非リアクティブなロジックをエフェクトから抽出します。

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

ここで、`onConnected` は*エフェクトイベント*と呼ばれます。これはエフェクトロジックの一部ですが、イベントハンドラのように動作します。その内部のロジックはリアクティブではなく、常に props と state の最新の値を「見る」ことができます。

これで、エフェクト内から `onConnected` エフェクトイベントを呼び出すことができます。

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ すべての依存関係が宣言されています
  // ...
```

これで問題が解決します。`onConnected` をエフェクトの依存配列から*削除*する必要があったことに注目してください。**エフェクトイベントはリアクティブではなく、依存配列から省略する必要があります**。

新しい動作が期待どおりに機能することを確認してください。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // 実際の実装では本当にサーバに接続します
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js src/notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

エフェクトイベントは、イベントハンドラと非常に似ていると考えることができます。主な違いは、イベントハンドラはユーザインタラクションに応答して実行されるのに対し、エフェクトイベントはエフェクトからトリガされることです。エフェクトイベントを使用すると、エフェクトのリアクティビティとリアクティブであるべきではないコードとの間の「チェーンを断ち切る」ことができます。

### エフェクトイベントで最新の props と state を読み取る

<Wip>

このセクションでは、**React の安定版でまだリリースされていない実験的な API** について説明しています。

</Wip>

エフェクトイベントを使用すると、依存関係リンタを抑制したくなる多くのパターンを修正できます。

例えば、ページ訪問をログに記録するエフェクトがあるとします。

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

後で、サイトに複数のルートを追加します。これで、`Page` コンポーネントは現在のパスを含む `url` props を受け取ります。`logVisit` 呼び出しの一部として `url` を渡したいのですが、依存関係リンタが文句を言います。

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

コードで何をしたいか考えてみてください。各 URL は異なるページを表すため、異なる URL ごとに個別の訪問をログに記録*したい*のです。言い換えれば、この `logVisit` 呼び出しは `url` に関してリアクティブである*べき*です。これが、この場合、依存関係リンタに従い、`url` を依存関係として追加することが理にかなっている理由です。

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

それでは、各ページ訪問とともにショッピングカート内のアイテム数を含めたいとしましょう。

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

エフェクト内で `numberOfItems` を使用したので、リンタはそれを依存関係として追加するよう求めます。しかし、`logVisit` 呼び出しが `numberOfItems` に関してリアクティブであることは*望んでいません*。ユーザがショッピングカートに何かを入れて、`numberOfItems` が変更されても、それはユーザがページを再度訪問したことを*意味しません*。言い換えれば、*ページを訪問すること*は、ある意味で「イベント」です。それは正確な時点で起こります。

コードを 2 つの部分に分割します。

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

ここで、`onVisit` はエフェクトイベントです。その中のコードはリアクティブではありません。このため、`numberOfItems`（または他のリアクティブな値！）を使用しても、周囲のコードが変更時に再実行されることを心配する必要はありません。

一方、エフェクト自体はリアクティブのままです。エフェクト内のコードは `url` props を使用しているため、エフェクトは異なる `url` で再レンダーされるたびに再実行されます。これにより、`onVisit` エフェクトイベントが呼び出されます。

その結果、`url` の変更ごとに `logVisit` を呼び出し、常に最新の `numberOfItems` を読み取ります。ただし、`numberOfItems` が単独で変更された場合、コードが再実行されることはありません。

注意

引数なしで `onVisit()` を呼び出して、内部で `url` を読み取ることができるかどうか疑問に思うかもしれません。

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

これは機能しますが、この `url` をエフェクトイベントに明示的に渡す方が良いでしょう。**エフェクトイベントに `url` を引数として渡すことで、異なる `url` を持つページを訪問することがユーザの視点から別の「イベント」を構成することを意味しています**。`visitedUrl` は、発生した「イベント」の*一部*です。

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

エフェクトイベントが `visitedUrl` を明示的に「要求」するため、誤ってエフェクトの依存配列から `url` を削除することはできません。`url` 依存関係を削除すると（個別のページ訪問が 1 つとしてカウントされる原因になります）、リンタが警告します。`onVisit` が `url` に関してリアクティブであることを望む場合、内部で `url` を読み取る*代わりに*、エフェクトから渡します。

これは、エフェクト内に非同期ロジックがある場合に特に重要になります。

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // 訪問のログ記録を遅延させる
  }, [url]);
```

ここで、`onVisit` 内の `url` は*最新の* `url`（すでに変更されている可能性がある）に対応しますが、`visitedUrl` は、このエフェクト（およびこの `onVisit` 呼び出し）を実行させた元の `url` に対応します。

深く掘り下げる

#### 依存関係リンタを抑制しても大丈夫ですか？

既存のコードベースでは、次のようにリントルールが抑制されている場合があります。

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 このようにリンタを抑制しないでください：
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

`useEffectEvent` が React の安定した部分になった後、**リンタを抑制しないこと**をお勧めします。

ルールを抑制することの最初の欠点は、エフェクトがコード内に導入した新しいリアクティブな依存関係に「反応」する必要があるときに、React が警告しなくなることです。前の例では、React がそれを思い出させたために、`url` を依存配列に追加しました。リンタを無効にすると、エフェクトへの将来の編集に関するそのようなリマインダを受け取らなくなります。これはバグにつながります。

リンタを抑制することによって引き起こされる混乱を招くバグの例を次に示します。この例では、`handleMove` 関数は現在の `canMove` state 変数の値を読み取って、ドットがカーソルに追従するかどうかを決定する必要があります。ただし、`handleMove` 内では `canMove` は常に `true` です。

なぜかわかりますか？

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

このコードの問題は、依存関係リンタを抑制していることです。抑制を削除すると、このエフェクトが `handleMove` 関数に依存していることがわかります。これは理にかなっています。`handleMove` はコンポーネント本体内で宣言されているため、リアクティブな値です。すべてのリアクティブな値は依存関係として指定する必要があります。そうしないと、時間の経過とともに古くなる可能性があります！

元のコードの作成者は、エフェクトがリアクティブな値に依存していない（`[]`）と React に「嘘をつきました」。これが、React が `canMove` が変更された後（および `handleMove` と一緒に）エフェクトを再同期しなかった理由です。React がエフェクトを再同期しなかったため、リスナとしてアタッチされた `handleMove` は最初のレンダー中に作成された `handleMove` 関数です。最初のレンダー中、`canMove` は `true` だったため、最初のレンダーからの `handleMove` は永遠にその値を見ることになります。

**リンタを抑制しない場合、古い値の問題は決して発生しません。**

`useEffectEvent` を使用すると、リンタに「嘘をつく」必要がなく、コードは期待どおりに機能します。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

これは、`useEffectEvent` が*常に*正しい解決策であることを意味するわけではありません。リアクティブにしたくないコード行にのみ適用する必要があります。上記のサンドボックスでは、エフェクトのコードが `canMove` に関してリアクティブであることを望んでいませんでした。そのため、エフェクトイベントを抽出することが理にかなっています。

リンタを抑制する代わりの正しい方法については、[エフェクトの依存値を削除する](/learn/removing-effect-dependencies)を読んでください。

## エフェクトイベントの制限事項

<Wip>

このセクションでは、**React の安定版でまだリリースされていない実験的な API** について説明しています。

</Wip>

エフェクトイベントは、使用方法が非常に制限されています。

- **エフェクト内からのみ呼び出してください。**
- **他のコンポーネントやフックに渡さないでください。**

例えば、次のようにエフェクトイベントを宣言して渡さないでください。

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 避けるべき：エフェクトイベントを渡す

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // "callback" を依存配列に指定する必要がある
}
```

代わりに、常にエフェクトイベントをそれらを使用するエフェクトの直下に宣言してください。

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ 良い：エフェクト内でのみローカルに呼び出される
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // "onTick" (エフェクトイベント) を依存配列に指定する必要はない
}
```

エフェクトイベントは、エフェクトコードの非リアクティブな「部品」です。それらを使用するエフェクトの隣にある必要があります。

## まとめ

- イベントハンドラは特定のインタラクションに応答して実行される。
- エフェクトは同期が必要なときはいつでも実行される。
- イベントハンドラ内のロジックはリアクティブではない。
- エフェクト内のロジックはリアクティブ。
- 非リアクティブなロジックをエフェクトからエフェクトイベントに移動できる。
- エフェクトイベントはエフェクト内からのみ呼び出す。
- エフェクトイベントを他のコンポーネントやフックに渡さない。
