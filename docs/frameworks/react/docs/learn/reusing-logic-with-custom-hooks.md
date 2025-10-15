# カスタムフックでロジックを再利用する

React には、`useState`、`useContext`、`useEffect` などの組み込みフックがいくつかあります。時には、データ取得、ユーザがオンラインかどうかの追跡、チャットルームへの接続など、より具体的な目的のためのフックが欲しいことがあります。これらを行うために、アプリケーションのニーズに応じて独自のフックを作成できます。

学ぶこと:

- カスタムフックとは何か、独自のカスタムフックを書く方法
- コンポーネント間でロジックを再利用する方法
- カスタムフックに名前を付けて構造化する方法
- カスタムフックを抽出するタイミングと理由

## カスタムフック: コンポーネント間でロジックを共有する

ネットワークに大きく依存するアプリを開発していると想像してください（ほとんどのアプリがそうであるように）。アプリを使用中にネットワーク接続が誤って切断された場合に、ユーザに警告したいとします。どうしますか？ コンポーネントには 2 つのものが必要なようです。

1. ネットワークがオンラインかどうかを追跡する state の一部。
2. グローバルな [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) イベントと [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) イベントにサブスクライブし、その state を更新するエフェクト。

これにより、コンポーネントがネットワークステータスと[同期](/learn/synchronizing-with-effects)します。次のようなものから始めるかもしれません。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

ネットワークのオンとオフを切り替えてみて、この `StatusBar` がアクションに応答してどのように更新されるかに注目してください。

次に、同じロジックを別のコンポーネントでも使用したいとします。ネットワークがオフの場合、"Save" の代わりに "Reconnecting..." を表示してボタンを無効にする Save ボタンを実装したいとします。

まず、`isOnline` state とエフェクトを `SaveButton` にコピー＆ペーストできます。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

ネットワークをオフにすると、ボタンの外観が変わることを確認してください。

これら 2 つのコンポーネントは正常に機能しますが、それらの間のロジックの重複は残念です。*視覚的な外観*は異なるように見えますが、それらの間でロジックを再利用したいと考えています。

### コンポーネントからカスタムフックを抽出する

[`useState`](/reference/react/useState) や [`useEffect`](/reference/react/useEffect) と同様に、組み込みの `useOnlineStatus` フックがあると想像してください。そうすれば、これら両方のコンポーネントを簡素化し、それらの間の重複を削除できます。

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

このような組み込みフックはありませんが、自分で書くことができます。`useOnlineStatus` という関数を宣言し、先ほど書いたコンポーネントからすべての重複コードを移動します。

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

関数の最後で、`isOnline` を返します。これにより、コンポーネントがその値を読み取ることができます。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

ネットワークのオンとオフを切り替えると、両方のコンポーネントが更新されることを確認してください。

これで、コンポーネントには繰り返しロジックが少なくなりました。**さらに重要なことは、コンポーネント内のコードが、*どのように*それを行うか（ブラウザイベントにサブスクライブすることによって）ではなく、*何をしたいか*（オンラインステータスを使用したい！）を記述しています**。

ロジックをカスタムフックに抽出すると、外部システムまたはブラウザ API を処理する方法の厄介な詳細を隠すことができます。コンポーネントのコードは、実装ではなく意図を表現します。

### フック名は常に `use` で始まる

React アプリケーションはコンポーネントから構築されます。コンポーネントは、組み込みかカスタムかを問わず、フックから構築されます。他の人が作成したカスタムフックを使用することがよくありますが、時には自分で書くこともあります！

次の命名規則に従う必要があります。

1. **React コンポーネント名は大文字で始まる必要があります**。例えば `StatusBar` や `SaveButton`。また、React コンポーネントは、JSX のような React が表示方法を知っているものを返す必要があります。
2. **フック名は `use` で始まり、その後に大文字が続く必要があります**。例えば、[`useState`](/reference/react/useState)（組み込み）や `useOnlineStatus`（ページの前半のようなカスタム）。フックは任意の値を返すことができます。

この規則により、コンポーネントを見ると、その state、エフェクト、その他の React 機能が「隠れている」可能性がある場所を常に知ることができます。例えば、コンポーネント内に `getColor()` 関数呼び出しが表示された場合、名前が `use` で始まっていないため、内部に React state が含まれていないことが確実にわかります。しかし、`useOnlineStatus()` のような関数呼び出しには、内部に他のフックへの呼び出しが含まれている可能性が高いでしょう！

注意

リンタが [React 用に設定されている](/learn/editor-setup#linting)場合、この命名規則を強制します。上記のサンドボックスまでスクロールして、`useOnlineStatus` を `getOnlineStatus` に名前変更してください。リンタが、その中で `useState` や `useEffect` を呼び出すことができなくなることに注目してください。フックとコンポーネントのみが他のフックを呼び出すことができます！

深く掘り下げる

#### レンダー中に呼び出されるすべての関数は use プレフィックスで始まるべきですか？

いいえ。フックを*呼び出さない*関数はフックである*必要はありません*。

関数がフックを呼び出さない場合は、`use` プレフィックスを避けてください。代わりに、`use` プレフィックスなしの通常の関数として書いてください。例えば、以下の `useSorted` はフックを呼び出さないため、代わりに `getSorted` と呼んでください。

```js
// 🔴 避けるべき：フックを使用しないフック
function useSorted(items) {
  return items.slice().sort();
}

// ✅ 良い：フックを使用しない通常の関数
function getSorted(items) {
  return items.slice().sort();
}
```

これにより、コードが条件を含む任意の場所でこの通常の関数を呼び出すことができます。

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ getSorted() はフックではないため、条件付きで呼び出すことは問題ありません
    displayedItems = getSorted(items);
  }
  // ...
}
```

内部で少なくとも 1 つのフックを使用している場合は、関数に `use` プレフィックスを付けてください（したがって、それをフックにします）。

```js
// ✅ 良い：他のフックを使用するフック
function useAuth() {
  return useContext(Auth);
}
```

技術的には、これは React によって強制されません。原理的には、他のフックを呼び出さないフックを作成することができます。これはしばしば混乱を招き、制限があるため、そのパターンを避ける方が良いでしょう。ただし、まれに役立つ場合があります。例えば、関数が現在フックを使用していないが、将来的にフック呼び出しを追加する予定がある場合です。その場合、`use` プレフィックスで名前を付けることは理にかなっています。

```js {3-4}
// ✅ 良い：後で他のフックを使用する可能性が高いフック
function useAuth() {
  // TODO: 認証が実装されたら、この行に置き換えます:
  // return useContext(Auth);
  return TEST_USER;
}
```

そうすれば、コンポーネントは条件付きでそれを呼び出すことができなくなります。これは、内部に実際にフック呼び出しを追加したときに重要になります。内部でフックを使用する予定がない（現在も将来も）場合は、フックにしないでください。

### カスタムフックを使用すると state 自体ではなく、state を使うロジックを共有できる

前の例では、ネットワークのオンとオフを切り替えると、両方のコンポーネントが一緒に更新されました。しかし、それらの間で単一の `isOnline` state 変数が共有されていると考えるのは間違っています。このコードを見てください。

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

これは、重複を抽出する前と同じように機能します。

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

これらは完全に独立した state 変数とエフェクトです！ 同じ外部値（ネットワークがオンかどうか）と同期したため、たまたま同じ値を持っていただけです。

これをよりよく説明するために、別の例が必要です。この `Form` コンポーネントを考えてみましょう。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

各フォームフィールドには、繰り返しロジックがあります。

1. state の一部（`firstName` と `lastName`）。
2. 変更ハンドラ（`handleFirstNameChange` と `handleLastNameChange`）。
3. その入力欄の `value` と `onChange` 属性を指定する JSX の一部。

繰り返しロジックを `useFormInput` カスタムフックに抽出できます。

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

`value` という*1 つの* state 変数のみを宣言していることに注目してください。

しかし、`Form` コンポーネントは `useFormInput` を*2 回*呼び出します。

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

これが、2 つの別々の state 変数を宣言するように機能する理由です！

**カスタムフックを使用すると、*state 自体*ではなく、*state を使うロジック*を共有できます。同じフックへの各呼び出しは、同じフックへの他のすべての呼び出しから完全に独立しています**。これが、上記の 2 つのサンドボックスが完全に同等である理由です。必要に応じて、スクロールして比較してください。カスタムフックを抽出する前後の動作は同じです。

複数のコンポーネント間で state 自体を共有する必要がある場合は、[state をリフトアップして渡してください](/learn/sharing-state-between-components)。

## フック間でリアクティブな値を渡す

カスタムフック内のコードは、コンポーネントが再レンダーされるたびに再実行されます。これが、コンポーネントと同様に、カスタムフックは[純粋である必要がある](/learn/keeping-components-pure)理由です。カスタムフックのコードをコンポーネントの本体の一部と考えてください！

カスタムフックはコンポーネントと一緒に再レンダーされるため、常に最新の props と state を受け取ります。これが何を意味するかを確認するには、このチャットルームの例を考えてみましょう。サーバ URL またはチャットルームを変更します。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装では本当にサーバに接続します
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`serverUrl` または `roomId` を変更すると、エフェクトが[変更に「反応」](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)し、再同期します。エフェクトの依存配列が変更されるたびに、チャットが再接続されることがコンソールメッセージからわかります。

次に、エフェクトのコードをカスタムフックに移動します。

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

これにより、`ChatRoom` コンポーネントは、内部の仕組みを気にせずにカスタムフックを呼び出すことができます。

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

これははるかにシンプルに見えます！（しかし、同じことをします。）

ロジックが*依然として* props と state の変更に応答することに注目してください。サーバ URL またはルームを編集してみてください。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装では本当にサーバに接続します
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

1 つのフックの戻り値をどのように取得しているかに注目してください。

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

別のフックへの入力として渡します。

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

`ChatRoom` コンポーネントが再レンダーされるたびに、最新の `roomId` と `serverUrl` をフックに渡します。これが、値が再レンダー後に異なるときはいつでもエフェクトがチャットに再接続する理由です。（オーディオまたはビデオ処理ソフトウェアを使用したことがある場合、このようなフックのチェーンは、視覚的または音声エフェクトのチェーンを思い出させるかもしれません。`useState` の出力が `useChatRoom` の入力に「供給」されているかのようです。）

### カスタムフックにイベントハンドラを渡す

<Wip>

このセクションでは、**React の安定版でまだリリースされていない実験的な API** について説明しています。

</Wip>

より多くのコンポーネントで `useChatRoom` を使い始めると、コンポーネントがその動作をカスタマイズできるようにしたくなるかもしれません。例えば、現在、メッセージが到着したときに何をするかのロジックはフック内にハードコードされています。

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

このロジックをコンポーネントに戻したいとします。

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

これを機能させるには、カスタムフックを変更して、`onReceiveMessage` を名前付きオプションの 1 つとして受け取るようにします。

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ すべての依存関係が宣言されています
}
```

これは機能しますが、カスタムフックがイベントハンドラを受け入れる場合、さらに 1 つの改善を行うことができます。

`onReceiveMessage` に依存関係を追加すると、コンポーネントが再レンダーされるたびにチャットが再接続されるため、理想的ではありません。[このイベントハンドラをエフェクトイベントにラップして、依存配列から削除します](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)。

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ すべての依存関係が宣言されています
}
```

これで、`ChatRoom` コンポーネントが再レンダーされるたびにチャットが再接続されなくなります。イベントハンドラをカスタムフックに渡す完全に動作するデモを次に示します。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

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
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // 実際の実装では本当にサーバに接続します
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`useChatRoom` を使用するために、その仕組みを知る必要がなくなったことに注目してください。他のコンポーネントに追加したり、他のオプションを渡したりしても、同じように機能します。それがカスタムフックの力です。

## カスタムフックを使用するタイミング

すべての小さな繰り返しコードビットに対してカスタムフックを抽出する必要はありません。一部の繰り返しは問題ありません。例えば、前述のように単一の `useState` 呼び出しをラップするために `useFormInput` フックを抽出することは、おそらく不要です。

しかし、エフェクトを書くときはいつでも、カスタムフックでラップする方が明確かどうかを検討してください。[エフェクトはそれほど頻繁に必要ないはずです](/learn/you-might-not-need-an-effect)。したがって、エフェクトを書いている場合は、React の「外に踏み出して」外部システムと同期したり、React に組み込み API がないことを行う必要があることを意味します。カスタムフックにラップすることで、意図と、そこにデータがどのように流れるかを正確に伝えることができます。

例えば、2 つのドロップダウンを表示する `ShippingForm` コンポーネントを考えてみましょう。1 つは都市のリストを表示し、もう 1 つは選択された都市の地域のリストを表示します。次のようなコードから始めるかもしれません。

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // このエフェクトは国の都市を取得します
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
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // このエフェクトは選択された都市の地域を取得します
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
  }, [city]);

  // ...
```

コードはかなり繰り返しですが、[これらのエフェクトを互いに分離しておくことは正しいです](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)。それらは 2 つの異なるものを同期するため、1 つのエフェクトにマージすべきではありません。代わりに、両方の共通ロジックを独自の `useData` フックに抽出することで、上記の `ShippingForm` コンポーネントを簡素化できます。

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
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
    }
  }, [url]);
  return data;
}
```

これで、`ShippingForm` コンポーネント内の両方のエフェクトを `useData` の呼び出しに置き換えることができます。

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

カスタムフックを抽出すると、データフローが明示的になります。`url` を入力すると、`data` が出力されます。`useData` 内にエフェクトを「隠す」ことで、`ShippingForm` コンポーネントに取り組んでいる人が[不要な依存配列を追加する](/learn/removing-effect-dependencies)ことを防ぐこともできます。時間が経つにつれて、アプリのエフェクトのほとんどはカスタムフック内にあるでしょう。

深く掘り下げる

#### カスタムフックを具体的なユースケースに集中させる

カスタムフックの名前を選択することから始めます。明確な名前を選ぶのに苦労する場合、エフェクトがコンポーネントのロジックの残りの部分に密結合しすぎている可能性があり、まだ抽出する準備ができていない可能性があります。

理想的には、カスタムフックの名前は、コードを頻繁に書かない人でも、カスタムフックが何をするか、何を受け取るか、何を返すかを推測できるほど明確である必要があります。

- ✅ `useData(url)`
- ✅ `useImpressionLog(eventName, extraData)`
- ✅ `useChatRoom(options)`

外部システムと同期するときは、カスタムフック名がより技術的で、そのシステムに固有の専門用語を使用する場合があります。そのシステムに精通している人にとって明確であれば、良いことです。

- ✅ `useMediaQuery(query)`
- ✅ `useSocket(url)`
- ✅ `useIntersectionObserver(ref, options)`

**カスタムフックを具体的なユースケースに集中させてください**。`useEffect` API 自体の代替および便利なラッパーとして機能するカスタム「ライフサイクル」フックを作成および使用しないでください。

- 🔴 `useMount(fn)`
- 🔴 `useEffectOnce(fn)`
- 🔴 `useUpdateEffect(fn)`

例えば、この `useMount` フックは、コードが「マウント時」にのみ実行されることを保証しようとします。

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 避けるべき：カスタム「ライフサイクル」フックの使用
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 避けるべき：カスタム「ライフサイクル」フックの作成
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**`useMount` のようなカスタム「ライフサイクル」フックは、React パラダイムにうまく適合しません**。例えば、このコード例にはミスがありますが（`roomId` または `serverUrl` の変更に「反応」しません）、リンタはそれについて警告しません。リンタは直接の `useEffect` 呼び出しのみをチェックします。フックについては知りません。

エフェクトを書いている場合は、React API を直接使用することから始めてください。

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ 良い：目的で分離された 2 つの生のエフェクト

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

次に、異なる高レベルのユースケースのためにカスタムフックを抽出できます（ただし、必須ではありません）。

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ 素晴らしい：目的に応じて名前が付けられたカスタムフック
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**良いカスタムフックは、何を行うかを制約することで、呼び出しコードをより宣言的にします**。例えば、`useChatRoom(options)` はチャットルームにのみ接続でき、`useImpressionLog(eventName, extraData)` は分析にインプレッションログを送信することしかできません。カスタムフック API がユースケースを制約せず、非常に抽象的である場合、長期的には解決するよりも多くの問題を引き起こす可能性があります。

### カスタムフックは、より良いパターンへの移行に役立つ

エフェクトは[「避難ハッチ」](/learn/escape-hatches)です。React の「外に踏み出す」必要があるときに使用し、ユースケースに対してより良い組み込みソリューションがない場合に使用します。時間が経つにつれて、React チームの目標は、より具体的な問題に対してより具体的なソリューションを提供することで、アプリ内のエフェクトの数を最小限に抑えることです。エフェクトをカスタムフックにラップすることで、これらのソリューションが利用可能になったときにコードをアップグレードすることが容易になります。

この例に戻りましょう。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

上記の例では、`useOnlineStatus` は [`useState`](/reference/react/useState) と [`useEffect`](/reference/react/useEffect) のペアで実装されています。しかし、これは最良の解決策ではありません。考慮していないエッジケースがいくつかあります。例えば、コンポーネントがマウントされたときに `isOnline` がすでに `true` であると仮定していますが、ネットワークがすでにオフになっている場合、これは誤りである可能性があります。ブラウザの [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API を使用してそれをチェックできますが、それを直接使用すると、サーバで初期 HTML を生成するために機能しません。要するに、このコードは改善できます。

幸いなことに、React 18 には、これらすべての問題を解決する [`useSyncExternalStore`](/reference/react/useSyncExternalStore) という専用 API が含まれています。以下は、この新しい API を利用するために書き直された `useOnlineStatus` フックです。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // クライアントで値を取得する方法
    () => true // サーバで値を取得する方法
  );
}

```

</Sandpack>

この移行を行うために**コンポーネントを変更する必要がなかった**ことに注目してください。

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

これは、エフェクトをカスタムフックにラップすることがしばしば有益である別の理由です。

1. エフェクトとの間のデータフローを非常に明示的にします。
2. コンポーネントがエフェクトの正確な実装ではなく、意図に焦点を当てることができます。
3. React が新機能を追加したときに、コンポーネントを変更せずにこれらのエフェクトを削除できます。

[デザインシステム](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)と同様に、アプリのコンポーネントから共通のイディオムをカスタムフックに抽出することが役立つ場合があります。これにより、コンポーネントのコードが意図に焦点を当て続け、生のエフェクトを頻繁に書くことを避けることができます。React コミュニティによって維持されている多くの優れたカスタムフックもあります。

深く掘り下げる

#### React はデータ取得のための組み込みソリューションを提供しますか？

まだ詳細を検討中ですが、将来的にはデータ取得を次のように書けることを期待しています。

```js {1,4,6}
import { use } from 'react'; // まだ利用できません！

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

アプリで上記のような `useData` のようなカスタムフックを使用する場合、最終的に推奨されるアプローチに移行するために、すべてのコンポーネントで生のエフェクトを手動で書くよりも必要な変更が少なくなります。ただし、古いアプローチも引き続き正常に機能するため、生のエフェクトを書くことに満足している場合は、それを続けることができます。

### 複数の方法がある

ブラウザの [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API を使用して、フェードインアニメーションを*最初から*実装したいとします。アニメーションループを設定するエフェクトから始めるかもしれません。アニメーションの各フレーム中に、[ref に保持している](/learn/manipulating-the-dom-with-refs) DOM ノードの不透明度を `1` に達するまで変更できます。コードは次のようになるかもしれません。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // まだ描画するフレームがあります
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

コンポーネントをより読みやすくするために、ロジックを `useFadeIn` カスタムフックに抽出するかもしれません。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // まだ描画するフレームがあります
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

`useFadeIn` コードをそのままにしておくこともできますが、さらにリファクタリングすることもできます。例えば、アニメーションループを設定するロジックを `useFadeIn` から `useAnimationLoop` カスタムフックに抽出できます。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

しかし、それを行う*必要はありませんでした*。通常の関数と同様に、最終的にはコードのさまざまな部分間の境界をどこに引くかを決定します。非常に異なるアプローチを取ることもできます。エフェクトにロジックを保持する代わりに、命令型ロジックのほとんどを JavaScript [クラス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)内に移動できます。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // まだ描画するフレームがあります
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

エフェクトを使用すると、React を外部システムに接続できます。エフェクト間の調整が必要であるほど（例えば、複数のアニメーションをチェーンする）、上記のサンドボックスのように、ロジックをエフェクトやフックから*完全に*抽出することがより理にかなっています。その後、抽出したコードが「外部システム」になります。これにより、React の外部に移動したシステムにメッセージを送信するだけでよいため、エフェクトをシンプルに保つことができます。

上記の例では、フェードインロジックを React の外部に移動する必要があると仮定しています。ただし、これが必要なわけではありません。アニメーションロジックをカスタムフックで異なる方法で抽出した場合でも、正常に機能します。

## まとめ

- カスタムフックを使用すると、コンポーネント間でロジックを共有できます。
- カスタムフック名は `use` で始まり、その後に大文字が続く必要があります。
- カスタムフックは state を使うロジックのみを共有し、state 自体は共有しません。
- リアクティブな値を 1 つのフックから別のフックに渡すことができ、それらは最新の状態を保ちます。
- すべてのフックは、コンポーネントが再レンダーされるたびに再実行されます。
- カスタムフックのコードは、コンポーネントのコードと同様に純粋である必要があります。
- カスタムフックが受け取るイベントハンドラをエフェクトイベントにラップします。
- `useMount` のようなカスタムフックを作成しないでください。目的を具体的に保ちます。
- コードの境界をどこに、どのように選択するかはあなた次第です。
