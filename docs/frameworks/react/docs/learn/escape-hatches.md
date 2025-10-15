# 避難ハッチ

コンポーネントによっては、React 外のシステムに対して制御や同期を必要とする場合があります。例えば、ブラウザ API を使用して入力フィールドにフォーカスを当てる、React を使用せずに実装されたビデオプレーヤの再生や一時停止を行う、あるいはリモートサーバに接続してメッセージをリッスンする、といったものです。この章では、React の「外側に踏み出して」外部システムに接続するための避難ハッチ (escape hatch) を学びます。アプリケーションのロジックやデータフローのほとんどは、これらの機能に依存すべきではありません。

## このチャプターで学ぶこと

- [再レンダーせずに情報を「記憶」する方法](/learn/referencing-values-with-refs)
- [React が管理している DOM 要素にアクセスする方法](/learn/manipulating-the-dom-with-refs)
- [コンポーネントを外部システムと同期させる方法](/learn/synchronizing-with-effects)
- [不要なエフェクトをコンポーネントから削除する方法](/learn/you-might-not-need-an-effect)
- [エフェクトのライフサイクルとコンポーネントのライフサイクルの違い](/learn/lifecycle-of-reactive-effects)
- [値がエフェクトを再トリガするのを防ぐ方法](/learn/separating-events-from-effects)
- [エフェクトの再実行頻度を下げる方法](/learn/removing-effect-dependencies)
- [コンポーネント間でロジックを共有する方法](/learn/reusing-logic-with-custom-hooks)

## ref で値を参照する

コンポーネントに情報を「記憶」させたいが、その情報が[新しいレンダーをトリガ](/learn/render-and-commit)しないようにしたい場合、*ref* を使うことができます。

```js
const ref = useRef(0);
```

state と同様に、ref は React によってレンダー間で保持されます。しかし、state をセットするとコンポーネントが再レンダーされます。ref を変更しても再レンダーされません！ `ref.current` プロパティを通じて、その ref の現在の値にアクセスできます。

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

ref は、React が追跡しないコンポーネントの秘密のポケットのようなものです。例えば、ref を使って[タイムアウト ID](https://developer.mozilla.org/docs/Web/API/setTimeout#return_value)、[DOM 要素](https://developer.mozilla.org/docs/Web/API/Element)、およびコンポーネントのレンダー出力に影響を与えない他のオブジェクトを格納できます。

<LearnMore path="/learn/referencing-values-with-refs">

**[ref で値を参照する](/learn/referencing-values-with-refs)**を読んで、ref を使用して情報を記憶する方法を学びましょう。

</LearnMore>

## ref で DOM を操作する

React は自動的に[レンダー出力に合致するよう DOM を更新する](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)ため、通常、コンポーネントが DOM を操作する必要はありません。しかし、時には React が管理している DOM 要素へのアクセスが必要になることがあります。例えば、ノードにフォーカスを当てたり、スクロールさせたり、そのサイズや位置を測定したりする場合です。React にはこれらを行うための組み込みの方法はないため、DOM ノードへの *ref* が必要になります。例えば、ボタンをクリックすると、ref を使用して入力フィールドにフォーカスが当たります。

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

**[ref で DOM を操作する](/learn/manipulating-the-dom-with-refs)**を読んで、React が管理している DOM 要素にアクセスする方法を学びましょう。

</LearnMore>

## エフェクトで同期を行う

一部のコンポーネントは外部システムと同期する必要があります。例えば、React の state に基づいて非 React コンポーネントを制御したり、サーバ接続をセットアップしたり、コンポーネントが画面に表示されたときに分析ログを送信したりする場合があります。イベントハンドラが特定のイベントを処理できるようにするのとは異なり、*エフェクト (effect)* を使用すると、レンダー後に何らかのコードを実行できます。これを使用して、コンポーネントを React の外部のシステムと同期させます。

Play/Pause を数回押して、ビデオプレーヤが `isPlaying` という props の値とどのように同期しているかを確認してください。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

多くのエフェクトは自分自身を「クリーンアップ」します。例えば、チャットサーバへの接続をセットアップするエフェクトは、そのサーバから切断する方法を React に伝える*クリーンアップ関数*を返すべきです。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // 実際の実装では本当にサーバに接続します
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

開発中、React はエフェクトをすぐに実行してクリーンアップし、もう一度実行します。これが `"✅ Connecting..."` が 2 回出力される理由です。これにより、クリーンアップ関数の実装を忘れないようにできます。

<LearnMore path="/learn/synchronizing-with-effects">

**[エフェクトで同期を行う](/learn/synchronizing-with-effects)**を読んで、コンポーネントを外部システムと同期させる方法を学びましょう。

</LearnMore>

## エフェクトは不要かもしれない

エフェクトは React のパラダイムからの避難ハッチです。React の「外に踏み出して」、コンポーネントを外部システムと同期させることができます。外部システムが関与していない場合（例えば、props や state の変更に応じてコンポーネントの state を更新したい場合）、エフェクトは必要ありません。不要なエフェクトを削除することで、コードが読みやすくなり、実行が速くなり、エラーが発生しにくくなります。

エフェクトが不要な一般的なケースは 2 つあります。
- **レンダーのためにデータを変換するのにエフェクトは不要です。**
- **ユーザイベントを処理するのにエフェクトは不要です。**

例えば、他の state に基づいて state を調整するのにエフェクトは必要ありません。

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

代わりに、レンダー中に可能な限り計算してください。

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ 良い：レンダー中に計算
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

しかし、外部システムと同期するにはエフェクトが*必要*です。

<LearnMore path="/learn/you-might-not-need-an-effect">

**[エフェクトは不要かもしれない](/learn/you-might-not-need-an-effect)**を読んで、不要なエフェクトを削除する方法を学びましょう。

</LearnMore>

## リアクティブなエフェクトのライフサイクル

エフェクトはコンポーネントとは異なるライフサイクルを持っています。コンポーネントはマウント、更新、アンマウントすることができます。エフェクトは 2 つのことしかできません：何かの同期を開始することと、後でその同期を停止することです。このサイクルは、時間とともに変化する props や state に依存するエフェクトの場合、複数回発生する可能性があります。

このエフェクトは `roomId` という props の値に依存しています。props は*リアクティブな値*であり、再レンダー時に変更される可能性があります。`roomId` が変更されると、エフェクトが*再同期*（そして、サーバに再接続）することに注目してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React は、エフェクトの依存配列を正しく指定したかどうかをチェックするためのリンタルールを提供します。上記の例で依存配列に `roomId` を指定するのを忘れると、リンタが自動的にそのバグを見つけます。

<LearnMore path="/learn/lifecycle-of-reactive-effects">

**[リアクティブなエフェクトのライフサイクル](/learn/lifecycle-of-reactive-effects)**を読んで、エフェクトのライフサイクルがコンポーネントのライフサイクルとどのように異なるかを学びましょう。

</LearnMore>

## エフェクトからイベントを分離する

<Wip>

このセクションでは、**React の安定版でまだリリースされていない実験的な API** について説明しています。

</Wip>

イベントハンドラは、同じインタラクションを再度実行したときにのみ再実行されます。イベントハンドラとは異なり、エフェクトは、前回のレンダー時とは異なる値（props や state 変数など）を読み取った場合に再同期します。時には、両方の動作の組み合わせが必要な場合もあります。つまり、一部の値に反応して再実行されるエフェクトだが、他の値には反応しないエフェクトです。

エフェクト内のすべてのコードは*リアクティブ*です。読み取るリアクティブな値が再レンダーによって変更された場合、再実行されます。例えば、このエフェクトは、`roomId` または `theme` のいずれかが変更された場合にチャットに再接続します。

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

```js src/notifications.js
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

これは理想的ではありません。`roomId` が変更された場合にのみ、チャットに再接続したいのです。`theme` を切り替えてもチャットに再接続すべきではありません！ `theme` を読み取るコードをエフェクトから*エフェクトイベント*に移動します。

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

エフェクトイベント内のコードはリアクティブではないため、`theme` を変更してもエフェクトが再接続されることはありません。

<LearnMore path="/learn/separating-events-from-effects">

**[エフェクトからイベントを分離する](/learn/separating-events-from-effects)**を読んで、一部の値がエフェクトを再トリガするのを防ぐ方法を学びましょう。

</LearnMore>

## エフェクトの依存値を削除する

エフェクトを記述すると、リンタは、エフェクトが読み取るすべてのリアクティブな値（props や state など）をエフェクトの依存配列に含めたかどうかを確認します。これにより、エフェクトがコンポーネントの最新の props や state と同期していることが保証されます。不要な依存値があると、エフェクトが頻繁に実行されすぎたり、無限ループを作成したりする可能性があります。削除する方法は、ケースによって異なります。

例えば、このエフェクトは、入力フィールドを編集するたびに再作成される `options` オブジェクトに依存しています。

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

チャット内でメッセージを入力するたびにチャットが再接続されるのは望ましくありません。この問題を解決するには、`options` オブジェクトの作成をエフェクト内に移動して、エフェクトが `roomId` 文字列にのみ依存するようにします。

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

依存配列を編集して `options` 依存値を削除することから始めたのではないことに注目してください。それは間違いです。代わりに、周囲のコードを変更して、依存値が*不要*になるようにしました。依存配列は、エフェクトのコードで使用されるすべてのリアクティブな値のリストと考えてください。そのリストに何を入れるかを意図的に選択するのではありません。リストはコードを記述します。依存配列を変更するには、コードを変更してください。

<LearnMore path="/learn/removing-effect-dependencies">

**[エフェクトの依存値を削除する](/learn/removing-effect-dependencies)**を読んで、エフェクトの再実行頻度を下げる方法を学びましょう。

</LearnMore>

## カスタムフックでロジックを再利用する

React には、`useState`、`useContext`、`useEffect` などの組み込みフックがあります。時には、データ取得、ユーザがオンラインかどうかの追跡、チャットルームへの接続など、より具体的な目的のためのフックが欲しいことがあります。これらを行うために、アプリケーションのニーズに応じて独自のフックを作成できます。

この例では、`usePointerPosition` カスタムフックがカーソル位置を追跡し、`useDelayedValue` カスタムフックが渡された値より一定のミリ秒数「遅れている」値を返します。サンドボックスのプレビュー領域の上にカーソルを移動すると、カーソルに続く移動する点の軌跡が表示されます。

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```js src/useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

カスタムフックを作成し、それらを組み合わせ、データを渡し、コンポーネント間で再利用できます。アプリが成長するにつれて、すでに作成したカスタムフックを再利用できるため、手動で記述するエフェクトが少なくなります。React コミュニティによって管理されている優れたカスタムフックも多数あります。

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

**[カスタムフックでロジックを再利用する](/learn/reusing-logic-with-custom-hooks)**を読んで、コンポーネント間でロジックを共有する方法を学びましょう。

</LearnMore>

## 次のステップ

[ref で値を参照する](/learn/referencing-values-with-refs)に進んで、この章をページごとに読み始めましょう！
