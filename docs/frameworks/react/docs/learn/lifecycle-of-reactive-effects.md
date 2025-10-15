# リアクティブなエフェクトのライフサイクル

エフェクトはコンポーネントとは異なるライフサイクルを持っています。コンポーネントはマウント、更新、アンマウントします。エフェクトができることは 2 つだけです：何かの同期を開始することと、後でその同期を停止することです。このサイクルは、時間とともに変化する props や state に依存するエフェクトの場合、複数回発生する可能性があります。React は、エフェクトの依存配列を正しく指定したかどうかをチェックするリンタルールを提供しています。これにより、エフェクトが最新の props や state に同期するようになります。

学ぶこと:

- エフェクトのライフサイクルとコンポーネントのライフサイクルの違い
- 各エフェクトを個別に考える方法
- エフェクトを再同期する必要があるタイミングとその理由
- エフェクトの依存配列がどのように決定されるか
- 値がリアクティブであることの意味
- 空の依存配列が何を意味するか
- React がリンタを使って依存配列が正しいことを検証する方法
- リンタに同意できない場合の対処法

## エフェクトのライフサイクル

すべての React コンポーネントは同じライフサイクルを経ます。

- コンポーネントは、画面に追加されるときに*マウント*します。
- コンポーネントは、新しい props や state を受け取るときに*更新*します。通常はインタラクションへの応答として行われます。
- コンポーネントは、画面から削除されるときに*アンマウント*します。

**これはコンポーネントについて考える良い方法ですが、エフェクトについて考える際には適していません**。代わりに、各エフェクトをコンポーネントのライフサイクルから独立して考えるようにしてください。エフェクトは、現在の props や state に[外部システムを同期させる](/learn/synchronizing-with-effects)方法を記述します。コードが変更されると、同期をより頻繁に、またはより少なく行う必要が出てきます。

この点を説明するために、コンポーネントをチャットサーバに接続するエフェクトを考えてみましょう。

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

エフェクトの本体は、**同期を開始する方法**を指定しています。

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

エフェクトから返されるクリーンアップ関数は、**同期を停止する方法**を指定しています。

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

直感的には、コンポーネントがマウントするときに React が**同期を開始**し、コンポーネントがアンマウントするときに**同期を停止**すると考えるかもしれません。しかし、これで終わりではありません！ 時には、コンポーネントがマウントされている間に**同期を複数回開始および停止する**必要があることもあります。

*なぜ*これが必要なのか、*いつ*これが起こるのか、そして*どのように*この動作を制御できるのかを見ていきましょう。

注意

一部のエフェクトはクリーンアップ関数を一切返しません。[多くの場合](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)、クリーンアップ関数を返したいと思うでしょうが、返さない場合、React は空のクリーンアップ関数を返したかのように振る舞います。

### なぜ同期を複数回行う必要があるのか

この `ChatRoom` コンポーネントが、ユーザがドロップダウンで選択した `roomId` という props を受け取ることを想像してください。最初にユーザが `roomId` として `"general"` を選択したとしましょう。あなたのアプリは `"general"` チャットルームを表示します。

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

UI が表示された後、React はエフェクトを実行して**同期を開始**します。`"general"` ルームに接続します。

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" ルームに接続
    connection.connect();
    return () => {
      connection.disconnect(); // "general" ルームから切断
    };
  }, [roomId]);
  // ...
```

ここまでは順調です。

その後、ユーザがドロップダウンで別のルーム（例えば `"travel"`）を選択します。まず、React は UI を更新します。

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

次に何が起こるべきか考えてみてください。ユーザは UI で `"travel"` が選択されたチャットルームであることを確認します。しかし、最後に実行されたエフェクトは、まだ `"general"` ルームに接続しています。**`roomId` props が変更されたため、エフェクトが以前に行っていたこと（`"general"` ルームへの接続）は、UI と一致しなくなっています**。

この時点で、React に 2 つのことを行ってほしいのです。

1. 古い `roomId` との同期を停止する（`"general"` ルームから切断する）
2. 新しい `roomId` との同期を開始する（`"travel"` ルームに接続する）

**幸いなことに、あなたはすでにこれらの両方を行う方法を React に教えています！** エフェクトの本体は同期を開始する方法を指定し、クリーンアップ関数は同期を停止する方法を指定しています。React が今する必要があるのは、正しい順序で、正しい props と state でそれらを呼び出すことだけです。正確にどのように行われるか見てみましょう。

### React がエフェクトを再同期する方法

`ChatRoom` コンポーネントが `roomId` props の新しい値を受け取ったことを思い出してください。以前は `"general"` でしたが、今は `"travel"` です。React は、あなたを別のルームに再接続するためにエフェクトを再同期する必要があります。

**同期を停止**するために、React は `"general"` ルームに接続した後にエフェクトが返したクリーンアップ関数を呼び出します。`roomId` が `"general"` だったので、クリーンアップ関数は `"general"` ルームから切断します。

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "general" ルームに接続
    connection.connect();
    return () => {
      connection.disconnect(); // "general" ルームから切断
    };
    // ...
```

次に、React はこのレンダー中に提供されたエフェクトを実行します。今回は、`roomId` が `"travel"` なので、`"travel"` チャットルームへの**同期を開始**します（最終的にそのクリーンアップ関数も呼び出されるまで）。

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "travel" ルームに接続
    connection.connect();
    // ...
```

これにより、ユーザが UI で選択したルームに接続されるようになりました。災難は回避されました！

コンポーネントが異なる `roomId` で再レンダーされるたびに、エフェクトは再同期します。例えば、ユーザが `roomId` を `"travel"` から `"music"` に変更したとしましょう。React は再びエフェクトの**同期を停止**し（`"travel"` ルームから切断し）、クリーンアップ関数を呼び出します。次に、新しい `roomId` props でエフェクトの本体を実行して、**同期を再開**します（`"music"` ルームに接続します）。

最終的に、ユーザが別の画面に移動すると、`ChatRoom` がアンマウントされます。もはや接続を維持する必要はありません。React は最後にエフェクトの**同期を停止**し、`"music"` チャットルームから切断します。

### エフェクトの視点から考える

`ChatRoom` コンポーネントの視点から起こったことをすべて振り返ってみましょう。

1. `ChatRoom` が `roomId` を `"general"` に設定してマウントされた
2. `ChatRoom` が `roomId` を `"travel"` に設定して更新された
3. `ChatRoom` が `roomId` を `"music"` に設定して更新された
4. `ChatRoom` がアンマウントされた

コンポーネントのライフサイクルのこれらの各ポイントで、エフェクトは異なることを行いました。

1. エフェクトは `"general"` ルームに接続した
2. エフェクトは `"general"` ルームから切断し、`"travel"` ルームに接続した
3. エフェクトは `"travel"` ルームから切断し、`"music"` ルームに接続した
4. エフェクトは `"music"` ルームから切断した

それでは、エフェクト自体の視点から何が起こったかを考えてみましょう。

```js
  useEffect(() => {
    // エフェクトは roomId で指定されたルームに接続...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...切断するまで
      connection.disconnect();
    };
  }, [roomId]);
```

このコードの構造は、何が起こったかを、重複しない時間のシーケンスとして見ることを促すかもしれません。

1. エフェクトは `"general"` ルームに接続した（切断するまで）
2. エフェクトは `"travel"` ルームに接続した（切断するまで）
3. エフェクトは `"music"` ルームに接続した（切断するまで）

しかし以前は、コンポーネントの視点から考えていました。コンポーネントの視点から見ると、エフェクトを「レンダー後」や「アンマウント前」などの特定の時点で発火する「コールバック」や「ライフサイクルイベント」として考える誘惑に駆られます。この考え方は非常に複雑になるため、避ける方が良いでしょう。

**代わりに、常に一度に 1 つの開始/停止サイクルに焦点を当ててください。コンポーネントがマウント、更新、アンマウントのいずれを行っているかは関係ありません。必要なのは、同期を開始する方法と停止する方法を記述することだけです。これをうまく行えば、エフェクトは必要な回数だけ開始および停止できるように弾力的になります**。

これは、JSX を作成するレンダーロジックを書くときに、コンポーネントがマウント中か更新中かを考えないことを思い出させるかもしれません。画面に表示されるべきものを記述すれば、React が[残りの処理を行います](/learn/reacting-to-input-with-state)。

### React がエフェクトが再同期できることを検証する方法

ここに、試すことができる実例があります。"Open chat" を押して `ChatRoom` コンポーネントをマウントしてください。

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

コンポーネントが最初にマウントされるときに、3 つのログが表示されることに注目してください。

1. `✅ Connecting to "general" room at https://localhost:1234...` *(開発環境のみ)*
2. `❌ Disconnected from "general" room at https://localhost:1234.` *(開発環境のみ)*
3. `✅ Connecting to "general" room at https://localhost:1234...`

最初の 2 つのログは開発環境のみのものです。開発環境では、React は常に各コンポーネントを一度再マウントします。

**React は、開発環境でエフェクトをすぐに強制的に再同期させることで、エフェクトが再同期できることを検証します**。これは、ドアロックが機能するかどうかを確認するためにドアを開閉することを思い出させるかもしれません。React は開発環境でエフェクトを 1 回余分に開始および停止して、[クリーンアップをうまく実装している](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)ことを確認します。

実際にエフェクトが再同期する主な理由は、エフェクトが使用するデータが変更された場合です。上記のサンドボックスで、選択されたチャットルームを変更してみてください。`roomId` が変更されると、エフェクトが再同期することに注目してください。

ただし、再同期が必要な、より珍しいケースもあります。例えば、チャット が開いている間に上記のサンドボックスで `serverUrl` を編集してみてください。コードの編集に応答して、エフェクトがどのように再同期するかに注目してください。将来的に、React は再同期に依存する機能をさらに追加するかもしれません。

### React がエフェクトを再同期する必要があることをどのように認識するか

`roomId` が変更された後に、React がエフェクトを再同期する必要があることをどのように認識したか疑問に思うかもしれません。それは、*あなた自身*が、そのコードが `roomId` に依存していることを React に伝えたからです。それを[依存配列](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)に含めることで：

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId props は時間とともに変化する可能性がある
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // このエフェクトは roomId を読み取る
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // したがって、このエフェクトが roomId に「依存している」ことを React に伝える
  // ...
```

これがどのように機能するか説明します。

1. `roomId` が props であることがわかっていたため、時間とともに変化する可能性があることがわかっていました。
2. エフェクトが `roomId` を読み取ることがわかっていました（したがって、そのロジックは後で変化する可能性のある値に依存しています）。
3. このため、それをエフェクトの依存配列として指定しました（`roomId` が変更されたときに再同期するように）。

コンポーネントが再レンダーされるたびに、React は渡された依存配列を調べます。配列内のいずれかの値が、前回のレンダー時に同じ場所で渡された値と異なる場合、React はエフェクトを再同期します。

例えば、最初のレンダー時に `["general"]` を渡し、後で次のレンダー時に `["travel"]` を渡した場合、React は `"general"` と `"travel"` を比較します。これらは異なる値（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) で比較）なので、React はエフェクトを再同期します。一方、コンポーネントが再レンダーされても `roomId` が変更されていない場合、エフェクトは同じルームに接続されたままになります。

### 各エフェクトは個別の同期プロセスを表す

エフェクトに無関係なロジックを追加することは避けてください。そのロジックがすでに書いたエフェクトと同時に実行される必要があるというだけの理由で。例えば、ユーザがルームを訪れたときに分析イベントを送信したいとしましょう。すでに `roomId` に依存するエフェクトがあるので、そこに分析呼び出しを追加したくなるかもしれません。

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

しかし、後でこのエフェクトに再接続を必要とする別の依存関係を追加したとしたらどうなるでしょうか。このエフェクトが再同期すると、同じルームに対して `logVisit(roomId)` も呼び出されますが、これは意図していなかったことです。訪問をログに記録することは、接続とは**別のプロセス**です。それらを 2 つの別々のエフェクトとして記述してください。

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

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

**コード内の各エフェクトは、個別で独立した同期プロセスを表す必要があります**。

上記の例では、1 つのエフェクトを削除しても、他のエフェクトのロジックは壊れません。これは、それらが異なるものを同期しているという良い兆候であり、それらを分割することが理にかなっています。一方、一貫したロジックの一部を別々のエフェクトに分割すると、コードは「クリーンに見える」かもしれませんが、[保守が難しく](/learn/you-might-not-need-an-effect#chains-of-computations)なります。このため、プロセスが同じか別々かを考慮する必要があり、コードがクリーンに見えるかどうかではありません。

## エフェクトはリアクティブな値に「反応」する

エフェクトは 2 つの変数（`serverUrl` と `roomId`）を読み取りますが、依存関係として指定したのは `roomId` だけです。

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

なぜ `serverUrl` は依存関係である必要がないのでしょうか？

これは、`serverUrl` が再レンダーのために変更されることがないためです。コンポーネントが何回再レンダーされても、理由に関係なく、常に同じです。`serverUrl` は決して変更されないため、依存関係として指定しても意味がありません。結局のところ、依存関係は時間の経過とともに変化する場合にのみ何かを行います！

一方、`roomId` は再レンダー時に異なる可能性があります。**コンポーネント内で宣言された props、state、およびその他の値は、レンダー中に計算され、React のデータフローに参加するため、*リアクティブ*です**。

`serverUrl` が state 変数だった場合、リアクティブになります。リアクティブな値は依存配列に含める必要があります。

```js {2,5,10}
function ChatRoom({ roomId }) { // props は時間とともに変化する
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // state は時間とともに変化する可能性がある

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // エフェクトは props と state を読み取る
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // したがって、このエフェクトが props と state に「依存している」ことを React に伝える
  // ...
}
```

`serverUrl` を依存関係として含めることで、それが変更された後にエフェクトが再同期することを保証します。

このサンドボックスで、選択されたチャットルームを変更するか、サーバ URL を編集してみてください。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

`roomId` や `serverUrl` のようなリアクティブな値を変更するたびに、エフェクトはチャットサーバに再接続します。

### 空の依存配列を持つエフェクトの意味

`serverUrl` と `roomId` の両方をコンポーネントの外に移動するとどうなるでしょうか？

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
}
```

これで、エフェクトのコードはリアクティブな値を*一切使用していない*ため、依存配列は空（`[]`）になります。

コンポーネントの視点から考えると、空の `[]` 依存配列は、このエフェクトがコンポーネントのマウント時にのみチャットルームに接続し、コンポーネントのアンマウント時にのみ切断することを意味します。（React は開発環境でロジックをストレステストするために、[それでも 1 回余分に再同期する](#how-react-verifies-that-your-effect-can-re-synchronize)ことを覚えておいてください）。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

しかし、[エフェクトの視点から考える](#thinking-from-the-effects-perspective)と、マウントやアンマウントについて考える必要は全くありません。重要なのは、エフェクトが同期を開始および停止するために何を行うかを指定したことです。今日、リアクティブな依存関係はありません。しかし、将来的にユーザが時間の経過とともに `roomId` や `serverUrl` を変更できるようにしたい場合（そしてそれらがリアクティブになる場合）、エフェクトのコードは変更する必要がありません。依存配列に追加するだけです。

### コンポーネント本体で宣言されたすべての変数はリアクティブ

props と state だけがリアクティブな値ではありません。それらから計算する値もリアクティブです。props や state が変更されると、コンポーネントが再レンダーされ、それらから計算された値も変更されます。このため、エフェクトで使用されるコンポーネント本体のすべての変数は、エフェクトの依存配列に含まれる必要があります。

ユーザがドロップダウンでチャットサーバを選択できるが、設定でデフォルトサーバも構成できるとしましょう。設定 state を[コンテキスト](/learn/scaling-up-with-reducer-and-context)に既に入れているため、そのコンテキストから `settings` を読み取るとします。これで、props から選択されたサーバと、デフォルトサーバに基づいて `serverUrl` を計算します。

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId はリアクティブ
  const settings = useContext(SettingsContext); // settings はリアクティブ
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl はリアクティブ
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // エフェクトは roomId と serverUrl を読み取る
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // したがって、いずれかが変更されたときに再同期する必要がある！
  // ...
}
```

この例では、`serverUrl` は props でも state 変数でもありません。これは、レンダー中に計算する通常の変数です。しかし、レンダー中に計算されるため、再レンダーによって変更される可能性があります。これが、リアクティブである理由です。

**コンポーネント内のすべての値（コンポーネント本体の props、state、変数を含む）はリアクティブです。リアクティブな値は再レンダー時に変更される可能性があるため、リアクティブな値をエフェクトの依存配列に含める必要があります**。

言い換えれば、エフェクトはコンポーネント本体のすべての値に「反応」します。

深く掘り下げる

#### グローバル値やミュータブルな値は依存関係になり得るか？

ミュータブルな値（グローバル変数を含む）はリアクティブではありません。

**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) のようなミュータブルな値は依存関係にはなりません**。それはミュータブルであり、React のレンダーデータフローの外でいつでも変更できます。それを変更してもコンポーネントの再レンダーはトリガされません。したがって、依存配列に指定したとしても、React はそれが変更されたときにエフェクトを再同期することを*知りません*。これは React のルールにも違反しています。レンダー中にミュータブルなデータを読み取ること（依存配列を計算するとき）は、[レンダーの純粋性](/learn/keeping-components-pure)を壊すためです。代わりに、[`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) を使用して、外部のミュータブルな値を読み取り、購読する必要があります。

**[`ref.current`](/reference/react/useRef#reference) のようなミュータブルな値やそれから読み取るものも依存関係にはなりません**。`useRef` 自体が返す ref オブジェクトは依存関係になり得ますが、その `current` プロパティは意図的にミュータブルです。これにより、[再レンダーをトリガせずに何かを追跡](/learn/referencing-values-with-refs)できます。しかし、それを変更しても再レンダーはトリガされないため、それはリアクティブな値ではなく、React はそれが変更されたときにエフェクトを再実行することを知りません。

このページで後ほど学ぶように、リンタはこれらの問題を自動的にチェックします。

### React はすべてのリアクティブな値を依存関係として指定したことを検証する

リンタが [React 用に設定されている](/learn/editor-setup#linting)場合、エフェクトのコードで使用されるすべてのリアクティブな値が依存関係として宣言されているかどうかをチェックします。例えば、これはリントエラーです。`roomId` と `serverUrl` の両方がリアクティブだからです。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId はリアクティブ
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl はリアクティブ

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- ここに何か問題があります！

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

これは React のエラーのように見えるかもしれませんが、実際には React がコードのバグを指摘しています。`roomId` と `serverUrl` の両方は時間の経過とともに変化する可能性がありますが、それらが変更されたときにエフェクトを再同期することを忘れています。ユーザが UI で異なる値を選択した後でも、最初の `roomId` と `serverUrl` に接続されたままになります。

バグを修正するには、リンタの提案に従って、`roomId` と `serverUrl` をエフェクトの依存関係として指定してください。

```js {9}
function ChatRoom({ roomId }) { // roomId はリアクティブ
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl はリアクティブ
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ すべての依存関係が宣言されています
  // ...
}
```

上記のサンドボックスでこの修正を試してください。リンタエラーが消え、必要に応じてチャットが再接続されることを確認してください。

注意

場合によっては、React はコンポーネント内で宣言されているにもかかわらず、値が決して変更されないことを*知っています*。例えば、`useState` から返される [`set` 関数](/reference/react/useState#setstate)や、`useRef` から返される ref オブジェクトは*安定*しています。つまり、再レンダー時に変更されないことが保証されています。安定した値はリアクティブではないため、依存配列から省略できます。それらを含めることは許可されています。変更されないため、問題ありません。

### 再同期したくないときの対処法

前の例では、`roomId` と `serverUrl` を依存配列としてリストすることで、リントエラーを修正しました。

**しかし、代わりに、これらの値がリアクティブな値ではない、つまり再レンダーの結果として変更*できない*ことをリンタに「証明」することもできます**。例えば、`serverUrl` と `roomId` がレンダーに依存せず、常に同じ値を持つ場合、コンポーネントの外に移動できます。これで、依存関係である必要がなくなります。

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl はリアクティブではない
const roomId = 'general'; // roomId はリアクティブではない

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
}
```

また、*エフェクト内*に移動することもできます。それらはレンダー中に計算されないため、リアクティブではありません。

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl はリアクティブではない
    const roomId = 'general'; // roomId はリアクティブではない
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ すべての依存関係が宣言されています
  // ...
}
```

**エフェクトはリアクティブなコードブロックです**。エフェクトは、その中で読み取っている値が変更されたときに再同期します。イベントハンドラはインタラクションごとに 1 回だけ実行されるのとは異なり、エフェクトは同期が必要なときはいつでも実行されます。

**依存配列を「選択」することはできません**。依存配列には、エフェクトで読み取るすべての[リアクティブな値](#all-variables-declared-in-the-component-body-are-reactive)を含める必要があります。リンタがこれを強制します。これにより、無限ループやエフェクトが頻繁に再同期するなどの問題が発生することがあります。リンタを抑制してこれらの問題を修正しないでください！ 代わりに試すべきことは次のとおりです。

- **エフェクトが独立した同期プロセスを表していることを確認してください**。エフェクトが何も同期していない場合、[不要かもしれません](/learn/you-might-not-need-an-effect)。複数の独立したものを同期している場合は、[分割してください](#each-effect-represents-a-separate-synchronization-process)。

- **エフェクトを「反応」させずに、props や state の最新の値を読み取りたい場合**は、エフェクトをリアクティブな部分（エフェクトに保持する）と非リアクティブな部分（*エフェクトイベント*と呼ばれるものに抽出できる）に分割できます。[イベントとエフェクトの分離について読んでください](/learn/separating-events-from-effects)。

- **オブジェクトや関数を依存関係として使用しないでください**。レンダー中にオブジェクトや関数を作成し、エフェクトから読み取る場合、それらはレンダーごとに異なります。これにより、エフェクトが毎回再同期されることになります。[エフェクトから不要な依存関係を削除する方法について詳しく読んでください](/learn/removing-effect-dependencies)。

落とし穴

リンタはあなたの友達ですが、その力は限られています。リンタは依存配列が*間違っている*ときだけ知っています。各ケースを解決する*最良の*方法を知っているわけではありません。リンタが依存関係を提案しているが、それを追加すると無限ループになる場合、リンタを無視すべきという意味ではありません。エフェクト内のコードを変更して、その値がリアクティブでなく、依存関係である*必要がない*ようにする必要があります。

既存のコードベースがある場合、次のようにリンタを抑制しているエフェクトがあるかもしれません。

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 このようにリンタを抑制しないでください：
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

[次の](/learn/separating-events-from-effects)[ページ](/learn/removing-effect-dependencies)では、ルールを破らずにこのコードを修正する方法を学びます。修正する価値は常にあります！

## まとめ

- コンポーネントはマウント、更新、アンマウントできます。
- 各エフェクトには、周囲のコンポーネントとは別のライフサイクルがあります。
- 各エフェクトは、*開始*および*停止*できる個別の同期プロセスを記述します。
- エフェクトを記述および読み取るときは、コンポーネントの視点（マウント、更新、アンマウントの方法）ではなく、各個別のエフェクトの視点（同期を開始および停止する方法）から考えてください。
- コンポーネント本体内で宣言された値は「リアクティブ」です。
- リアクティブな値は時間とともに変化する可能性があるため、エフェクトを再同期する必要があります。
- リンタは、エフェクト内で使用されるすべてのリアクティブな値が依存配列として指定されていることを検証します。
- リンタによってフラグが立てられたすべてのエラーは正当なものです。ルールを破らずにコードを修正する方法は常にあります。
