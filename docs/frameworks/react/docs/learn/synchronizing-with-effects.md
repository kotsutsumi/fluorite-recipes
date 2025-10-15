# エフェクトで同期を行う

一部のコンポーネントは外部システムと同期する必要があります。例えば、React の state に基づいて非 React コンポーネントを制御したり、サーバ接続をセットアップしたり、コンポーネントが画面に表示されたときに分析ログを送信したりする場合があります。*エフェクト (Effect)* を使用すると、レンダー後に何らかのコードを実行できるため、コンポーネントを React の外部のシステムと同期させることができます。

<YouWillLearn>

- エフェクトとは何か
- エフェクトがイベントとどのように異なるか
- コンポーネントでエフェクトを宣言する方法
- エフェクトを不必要に再実行しない方法
- 開発中にエフェクトが 2 回実行される理由とその修正方法

</YouWillLearn>

## エフェクトとは何か、イベントとどのように異なるか

エフェクトに入る前に、React コンポーネント内の 2 種類のロジックについて知っておく必要があります。

- **レンダーコード**（[UI の記述](/learn/describing-the-ui)で紹介）は、コンポーネントのトップレベルにあります。ここで、props と state を受け取り、変換し、画面に表示したい JSX を返します。[レンダーコードは純粋でなければなりません](/learn/keeping-components-pure)。数式のように、結果を_計算_するだけで、他のことはしないでください。

- **イベントハンドラ**（[インタラクティビティの追加](/learn/adding-interactivity)で紹介）は、コンポーネント内のネストされた関数で、計算するだけでなく何かを_実行_します。イベントハンドラは、入力フィールドを更新したり、HTTP POST リクエストを送信して製品を購入したり、ユーザを別の画面に移動させたりする可能性があります。イベントハンドラには、特定のユーザアクション（例えば、ボタンのクリックやタイピング）によって引き起こされる[「副作用」](https://en.wikipedia.org/wiki/Side_effect_(computer_science))（プログラムの状態を変更する）が含まれます。

時にはこれだけでは不十分です。画面に表示されるたびにチャットサーバに接続する必要がある `ChatRoom` コンポーネントを考えてみてください。サーバへの接続は純粋な計算ではない（副作用である）ため、レンダー中には実行できません。しかし、`ChatRoom` が表示される原因となる特定のイベント（クリックなど）は 1 つもありません。

***エフェクト*を使用すると、特定のイベントではなく、レンダー自体によって引き起こされる副作用を指定できます。** チャットでメッセージを送信することは*イベント*です。なぜなら、ユーザが特定のボタンをクリックすることによって直接引き起こされるからです。しかし、サーバ接続をセットアップすることは*エフェクト*です。なぜなら、コンポーネントを表示させたインタラクションに関係なく実行されるべきだからです。エフェクトは、画面の更新後、[コミット](/learn/render-and-commit)の最後に実行されます。これは、React コンポーネントを外部システム（ネットワークやサードパーティライブラリなど）と同期させるのに適したタイミングです。

<Note>

ここから先のこのテキストで、大文字の「エフェクト (Effect)」は、上記の React 固有の定義、つまりレンダーによって引き起こされる副作用を指します。より広いプログラミング概念を指す場合は、「副作用」と言います。

</Note>

## エフェクトが必要ないかもしれない

**コンポーネントにエフェクトを追加することを急がないでください。** エフェクトは通常、React コードから「外に出て」外部システムと同期するために使用されることを覚えておいてください。これには、ブラウザ API、サードパーティウィジェット、ネットワークなどが含まれます。エフェクトが他の state に基づいて state を調整しているだけの場合、[エフェクトが必要ないかもしれません](/learn/you-might-not-need-an-effect)。

## エフェクトを書く方法

エフェクトを書くには、次の 3 つのステップに従ってください。

1. **エフェクトを宣言します。** デフォルトでは、エフェクトはすべての[コミット](/learn/render-and-commit)後に実行されます。
2. **エフェクトの依存配列を指定します。** ほとんどのエフェクトは、すべてのレンダー後ではなく、*必要なときにのみ*再実行すべきです。例えば、フェードインアニメーションは、コンポーネントが表示されたときにのみトリガされるべきです。チャットルームへの接続と切断は、コンポーネントが表示されたり非表示になったりしたとき、または*チャットルームが変更されたとき*にのみ実行されるべきです。*依存配列*を指定することで、これを制御する方法を学びます。
3. **必要に応じてクリーンアップを追加します。** 一部のエフェクトは、実行していたことを停止、元に戻す、またはクリーンアップする方法を指定する必要があります。例えば、「接続」には「切断」が必要で、「購読」には「購読解除」が必要で、「フェッチ」には「キャンセル」または「無視」が必要です。*クリーンアップ関数*を返すことでこれを行う方法を学びます。

これらの各ステップを詳しく見ていきましょう。

### ステップ 1: エフェクトを宣言する

コンポーネントでエフェクトを宣言するには、React から [`useEffect` フック](/reference/react/useEffect)をインポートします。

```js
import { useEffect } from 'react';
```

次に、コンポーネントのトップレベルで呼び出し、エフェクト内にコードを配置します。

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // ここのコードはすべてのレンダー後に実行されます
  });
  return <div />;
}
```

コンポーネントがレンダーされるたびに、React は画面を更新し、*その後* `useEffect` 内のコードを実行します。言い換えれば、**`useEffect` は、そのレンダーが画面に反映されるまで、コードの実行を「遅延」させます。**

エフェクトを使用して外部システムと同期する方法を見てみましょう。`<VideoPlayer>` という React コンポーネントを考えてみてください。`isPlaying` という props を渡して、再生中か一時停止中かを制御できると良いでしょう。

```js
<VideoPlayer isPlaying={isPlaying} />;
```

カスタム `VideoPlayer` コンポーネントは、組み込みのブラウザ [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) タグをレンダーします。

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: isPlaying で何かをする
  return <video src={src} />;
}
```

しかし、ブラウザの `<video>` タグには `isPlaying` という props はありません。それを制御する唯一の方法は、DOM 要素で手動で [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) と [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) メソッドを呼び出すことです。**ビデオが現在再生されるべきかどうかを示す `isPlaying` props の値と、`play()` や `pause()` などの呼び出しを同期させる必要があります。**

まず、`<video>` DOM ノードへの [ref を取得](/learn/manipulating-the-dom-with-refs)する必要があります。

レンダー中に `play()` や `pause()` を呼び出したくなるかもしれませんが、それは正しくありません。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // レンダー中にこれを呼び出すことは許可されていません。
  } else {
    ref.current.pause(); // これもクラッシュします。
  }

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

このコードが正しくない理由は、レンダー中に DOM ノードで何かをしようとしているためです。React では、[レンダーは JSX の純粋な計算](/learn/keeping-components-pure)であるべきで、DOM の変更などの副作用を含むべきではありません。

さらに、`VideoPlayer` が初めて呼び出されたとき、その DOM はまだ存在しません！ React は、JSX を返すまで、どの DOM を作成すべきかをまだ知らないため、`play()` や `pause()` を呼び出すための DOM ノードはまだありません。

ここでの解決策は、**副作用を `useEffect` でラップして、レンダー計算から外に出す**ことです。

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOM の更新をエフェクトにラップすることで、React に最初に画面を更新させてから、エフェクトを実行させます。

`VideoPlayer` コンポーネントがレンダーされると（初回または再レンダー時）、いくつかのことが起こります。まず、React は画面を更新し、`<video>` タグが正しい props で DOM に存在することを保証します。次に、React はエフェクトを実行します。最後に、エフェクトは `isPlaying` の値に応じて `play()` または `pause()` を呼び出します。

Play/Pause を複数回押して、ビデオプレーヤが `isPlaying` の値とどのように同期しているかを確認してください。

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
  });

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

この例では、React の state に同期させた「外部システム」はブラウザのメディア API でした。同様のアプローチを使用して、レガシーな非 React コード（jQuery プラグインなど）を宣言的な React コンポーネントにラップできます。

ビデオプレーヤを制御することは、実際にははるかに複雑であることに注意してください。`play()` の呼び出しが失敗する可能性があり、ユーザは組み込みのブラウザコントロールを使用して再生または一時停止する可能性があります。この例は非常に単純化されており、不完全です。

<Pitfall>

デフォルトでは、エフェクトは*すべての*レンダー後に実行されます。これが、次のようなコードが**無限ループを生成する**理由です。

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

エフェクトはレンダーの*結果*として実行されます。state を設定すると、レンダーが*トリガ*されます。エフェクト内ですぐに state を設定することは、電源コンセントを自分自身に接続するようなものです。エフェクトが実行され、state を設定し、再レンダーを引き起こし、エフェクトが実行され、再度 state を設定し、別の再レンダーを引き起こし、無限に続きます。

エフェクトは通常、コンポーネントを*外部*システムと同期させるべきです。外部システムがなく、他の state に基づいて state を調整したいだけの場合は、[エフェクトが必要ないかもしれません](/learn/you-might-not-need-an-effect)。

</Pitfall>

### ステップ 2: エフェクトの依存配列を指定する

デフォルトでは、エフェクトは*すべての*レンダー後に実行されます。しかし、これは**望むものではない**ことがよくあります。

- 時には遅いです。外部システムとの同期は常に瞬時ではないため、必要でない限りスキップしたい場合があります。例えば、すべてのキーストロークでチャットサーバに再接続したくありません。
- 時には間違っています。例えば、すべてのキーストロークでコンポーネントのフェードインアニメーションをトリガしたくありません。アニメーションは、コンポーネントが初めて表示されたときに一度だけ再生されるべきです。

問題を示すために、前の例にいくつかの `console.log` 呼び出しと親コンポーネントの state を更新するテキスト入力を追加しました。タイピングがエフェクトを再実行させることに注目してください。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

**`useEffect` 呼び出しの 2 番目の引数として*依存配列*を指定することで、React に不必要にエフェクトを再実行しないように指示できます。** 上記の例の 14 行目に空の `[]` 配列を追加することから始めてください。

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

`React Hook useEffect has a missing dependency: 'isPlaying'` というエラーが表示されるはずです。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // これによりエラーが発生します

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

問題は、エフェクト内のコードが、何をすべきかを決定するために `isPlaying` props に*依存している*ことですが、この依存関係が明示的に宣言されていないことです。この問題を解決するには、依存配列に `isPlaying` を追加してください。

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // ここで使用されています...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...したがって、ここで宣言する必要があります！
```

これで、すべての依存関係が宣言されたため、エラーはありません。依存配列として `[isPlaying]` を指定することで、React に、前回のレンダー時と `isPlaying` が同じ場合はエフェクトの再実行をスキップするように指示します。この変更により、入力フィールドに入力してもエフェクトは再実行されませんが、Play/Pause を押すと再実行されます。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
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
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

依存配列には複数の依存関係を含めることができます。React は、指定したすべての依存関係が前回のレンダー時とまったく同じ値である場合にのみ、エフェクトの再実行をスキップします。React は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比較を使用して依存関係の値を比較します。詳細については、[`useEffect` のリファレンス](/reference/react/useEffect#reference)を参照してください。

**依存配列を「選択」することはできないことに注意してください。** 指定した依存配列がエフェクト内のコードに基づいて React が期待するものと一致しない場合、リントエラーが発生します。これにより、コード内の多くのバグをキャッチできます。コードが再実行されないようにしたい場合は、[*エフェクトのコード自体を編集*して、その依存関係を「必要としない」ようにします](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)。

<Pitfall>

依存配列がない場合と*空*の `[]` 依存配列がある場合の動作は異なります。

```js {3,7,11}
useEffect(() => {
  // これはすべてのレンダー後に実行されます
});

useEffect(() => {
  // これはマウント時（コンポーネントが表示されたとき）にのみ実行されます
}, []);

useEffect(() => {
  // これはマウント時*および* a または b が前回のレンダー以降に変更された場合に実行されます
}, [a, b]);
```

次のステップで「マウント」とは何かを詳しく見ていきます。

</Pitfall>

<DeepDive>

#### ref が依存配列から省略されるのはなぜか

このエフェクトは `ref` と `isPlaying` の*両方*を使用しますが、依存関係として宣言されているのは `isPlaying` のみです。

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

これは、`ref` オブジェクトが*安定した ID* を持っているためです。React は、同じ `useRef` 呼び出しから[常に同じオブジェクトを取得する](/reference/react/useRef#returns)ことを保証します。それは決して変更されないため、単独ではエフェクトが再実行されることはありません。したがって、含めても含めなくても問題ありません。含めても問題ありません。

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

[`useState`](/reference/react/useState#setstate) から返される [`set` 関数](/reference/react/useState#setstate)も安定した ID を持っているため、依存配列から省略されることがよくあります。リンタが依存関係を省略してもエラーなしで動作する場合、それは安全です。

常に安定している依存関係を省略することは、リンタがオブジェクトが安定していることを「見る」ことができる場合にのみ機能します。例えば、`ref` が親コンポーネントから渡された場合、依存配列で指定する必要があります。ただし、これは良いことです。なぜなら、親コンポーネントが常に同じ ref を渡すのか、条件付きで複数の ref のいずれかを渡すのかがわからないからです。したがって、エフェクトは*どの* ref が渡されるかに依存します。

</DeepDive>

### ステップ 3: 必要に応じてクリーンアップを追加する

別の例を考えてみましょう。画面に表示されたときにチャットサーバに接続する必要がある `ChatRoom` コンポーネントを書いています。`connect()` と `disconnect()` メソッドを持つオブジェクトを返す `createConnection()` API が与えられています。コンポーネントがユーザに表示されている間、接続を維持するにはどうすればよいでしょうか？

エフェクトのロジックを書くことから始めてください。

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

すべての再レンダー後にチャットに接続するのは遅いため、依存配列を追加します。

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**エフェクト内のコードは props や state を使用していないため、依存配列は `[]`（空）です。これにより、React に、コンポーネントが「マウント」されたとき、つまり画面に初めて表示されたときにのみこのコードを実行するように指示します。**

このコードを実行してみましょう。

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
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

このエフェクトはマウント時にのみ実行されるため、コンソールに `"✅ Connecting..."` が一度出力されることを期待するかもしれません。**しかし、コンソールを確認すると、`"✅ Connecting..."` が 2 回出力されます。なぜこれが起こるのでしょうか？**

`ChatRoom` コンポーネントが多くの異なる画面を持つより大きなアプリの一部であると想像してください。ユーザは `ChatRoom` ページで旅を始めます。コンポーネントがマウントされ、`connection.connect()` を呼び出します。次に、ユーザが別の画面（例えば Settings ページ）に移動すると想像してください。`ChatRoom` コンポーネントがアンマウントされます。最後に、ユーザが Back をクリックすると、`ChatRoom` が再びマウントされます。これにより、2 番目の接続がセットアップされますが、最初の接続は破棄されませんでした！ユーザがアプリを移動するにつれて、接続は蓄積され続けます。

このようなバグは、広範な手動テストなしでは見逃しやすいです。それらをすばやく発見できるように、開発中に React は、すべてのコンポーネントを初回マウント直後に一度再マウントします。

`"✅ Connecting..."` ログを 2 回見ることで、実際の問題に気付くのに役立ちます。コンポーネントがアンマウントされたときにコードが接続を閉じません。

この問題を解決するには、エフェクトから*クリーンアップ関数*を返してください。

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React は、エフェクトが再度実行される前にクリーンアップ関数を毎回呼び出し、コンポーネントがアンマウントされる（削除される）ときに最後にもう一度呼び出します。クリーンアップ関数が実装されたときに何が起こるかを見てみましょう。

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

開発中に 3 つのコンソールログが表示されるようになりました。

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**これは開発中の正しい動作です。** コンポーネントを再マウントすることで、React は、ナビゲートしてから戻ってきてもコードが壊れないことを確認します。切断してから再度接続することは、まさに起こるべきことです！クリーンアップを適切に実装すると、エフェクトを一度実行することと、実行、クリーンアップ、再度実行することの間に、ユーザに見える違いはないはずです。開発中に React がコード内のバグを探しているため、追加の接続/切断呼び出しのペアがあります。これは正常です。それを消そうとしないでください！

**本番環境では、`"✅ Connecting..."` が一度だけ出力されます。** コンポーネントの再マウントは、クリーンアップが必要なエフェクトを見つけるのに役立つように、開発中にのみ発生します。[Strict Mode](/reference/react/StrictMode) をオフにすることで、開発動作をオプトアウトできますが、オンにしておくことをお勧めします。これにより、上記のような多くのバグを見つけることができます。

## 開発中にエフェクトが 2 回実行されるのをどのように処理するか

React は、開発中にコンポーネントを意図的に再マウントして、前の例のようなバグを見つけます。**正しい質問は「エフェクトを一度実行する方法」ではなく、「再マウント後にエフェクトが機能するようにクリーンアップする方法」です。**

通常、答えはクリーンアップ関数を実装することです。クリーンアップ関数は、エフェクトが実行していたことを停止または元に戻すべきです。経験則は、ユーザがエフェクトが一度実行されること（本番環境のように）と、*セットアップ → クリーンアップ → セットアップ*シーケンス（開発中に見られるもの）を区別できないようにすることです。

書くエフェクトのほとんどは、以下の一般的なパターンのいずれかに当てはまります。

### React 以外のウィジェットを制御する

時には、React で書かれていないサードパーティの UI ウィジェットを追加する必要があります。例えば、ページにマップコンポーネントを追加しているとします。それには `setZoomLevel()` メソッドがあり、ズームレベルを React コードの `zoomLevel` state 変数と同期させたいとします。エフェクトは次のようになります。

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

この場合、クリーンアップは必要ありません。開発中に、React はエフェクトを 2 回呼び出しますが、同じ値で `setZoomLevel` を 2 回呼び出しても何も起こらないため、問題ありません。わずかに遅い可能性がありますが、本番環境では不必要に再マウントされないため、問題ありません。

一部の API は、連続して 2 回呼び出すことを許可しない場合があります。例えば、組み込みの [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) 要素の [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) メソッドは、2 回呼び出すとスローされます。クリーンアップ関数を実装して、ダイアログを閉じるようにしてください。

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

開発中、エフェクトは `showModal()` を呼び出し、すぐに `close()` を呼び出し、再度 `showModal()` を呼び出します。これは、本番環境で見られるように、`showModal()` を一度呼び出すのと同じユーザー可視動作を持っています。

### イベントを購読する

エフェクトが何かを購読する場合、クリーンアップ関数は購読を解除する必要があります。

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

開発中、エフェクトは `addEventListener()` を呼び出し、すぐに `removeEventListener()` を呼び出し、同じハンドラで再度 `addEventListener()` を呼び出します。したがって、一度にアクティブな購読は 1 つだけです。これは、本番環境のように `addEventListener()` を一度呼び出すのと同じユーザー可視動作を持っています。

### アニメーションをトリガする

エフェクトが何かをアニメーション化する場合、クリーンアップ関数はアニメーションを初期値にリセットする必要があります。

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // アニメーションをトリガ
  return () => {
    node.style.opacity = 0; // 初期値にリセット
  };
}, []);
```

開発中、不透明度は `1` に設定され、次に `0` に設定され、再度 `1` に設定されます。これは、本番環境のように直接 `1` に設定するのと同じユーザー可視動作を持っているはずです。トゥイーンをサポートするサードパーティのアニメーションライブラリを使用している場合、クリーンアップ関数はタイムラインを初期状態にリセットする必要があります。

### データをフェッチする

エフェクトが何かをフェッチする場合、クリーンアップ関数は[フェッチを中止する](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)か、その結果を無視する必要があります。

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

すでに発生したネットワークリクエストを「元に戻す」ことはできませんが、クリーンアップ関数は、もはや関連しないフェッチがアプリケーションに影響を与え続けないようにする必要があります。`userId` が `'Alice'` から `'Bob'` に変更された場合、クリーンアップは、`'Alice'` の応答が `'Bob'` の後に到着しても無視されるようにします。

**開発中、Network タブに 2 つのフェッチが表示されます。** それは問題ありません。上記のアプローチでは、最初のエフェクトはすぐにクリーンアップされるため、その `ignore` 変数のコピーが `true` に設定されます。したがって、追加のリクエストがあっても、`if (!ignore)` チェックのおかげで state に影響しません。

**本番環境では、リクエストは 1 つだけです。** 開発中の 2 番目のリクエストが気になる場合、最良のアプローチは、リクエストを重複排除し、コンポーネント間で応答をキャッシュするソリューションを使用することです。

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

これにより、開発エクスペリエンスが向上するだけでなく、アプリケーションが高速に感じられるようになります。例えば、ユーザが Back ボタンを押すと、キャッシュされているため、一部のデータを再度ロードする必要がありません。このようなキャッシュを自分で構築するか、エフェクトでの手動フェッチに代わる多くの選択肢の 1 つを使用できます。

<DeepDive>

#### エフェクトでのデータフェッチの良い代替手段とは

エフェクト内で `fetch` 呼び出しを書くことは、[データをフェッチするための一般的な方法](https://www.robinwieruch.de/react-hooks-fetch-data/)です。特にクライアント側のアプリでは。しかし、これは非常に手動的なアプローチであり、重大な欠点があります。

- **エフェクトはサーバ上で実行されません。** これは、最初のサーバレンダリングされた HTML にはデータのないローディング状態のみが含まれることを意味します。クライアントコンピュータは、すべての JavaScript をダウンロードしてアプリをレンダーして、今度はデータをロードする必要があることを発見する必要があります。これは効率的ではありません。
- **エフェクト内で直接フェッチすると、「ネットワークウォーターフォール」を作成しやすくなります。** 親コンポーネントをレンダーし、データをフェッチし、子コンポーネントをレンダーし、子コンポーネントがデータのフェッチを開始します。ネットワークが非常に速くない場合、これはすべてのデータを並列でフェッチするよりもはるかに遅くなります。
- **エフェクト内で直接フェッチすることは、通常、データをプリロードまたはキャッシュしないことを意味します。** 例えば、コンポーネントがアンマウントしてから再度マウントされると、データを再度フェッチする必要があります。
- **人間工学的ではありません。** [競合状態](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)のようなバグに悩まされないように `fetch` 呼び出しを書くには、かなりのボイラープレートコードが含まれます。

この欠点のリストは React に固有のものではありません。マウント時にデータをフェッチすることは、どのライブラリでも当てはまります。ルーティングと同様に、データフェッチをうまく行うことは簡単ではないため、次のアプローチをお勧めします。

- **[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)を使用している場合は、その組み込みのデータフェッチメカニズムを使用してください。** 最新の React フレームワークには、効率的で上記の落とし穴に悩まされない統合されたデータフェッチメカニズムがあります。
- **それ以外の場合は、クライアント側のキャッシュの使用または構築を検討してください。** 人気のあるオープンソースソリューションには、[React Query](https://tanstack.com/query/latest)、[useSWR](https://swr.vercel.app/)、[React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) が含まれます。独自のソリューションを構築することもできます。その場合、内部でエフェクトを使用しますが、リクエストの重複排除、応答のキャッシュ、ネットワークウォーターフォールの回避（データのプリロードまたはデータ要件のルートへのホイスティング）のロジックも追加します。

これらのアプローチのいずれも適していない場合は、エフェクト内で直接データをフェッチし続けることができます。

</DeepDive>

### 分析を送信する

ページ訪問時に分析イベントを送信する次のコードを考えてみてください。

```js
useEffect(() => {
  logVisit(url); // POST リクエストを送信
}, [url]);
```

開発中、`logVisit` は URL ごとに 2 回呼び出されるため、それを修正しようとするかもしれません。**このコードをそのままにしておくことをお勧めします。** 以前の例と同様に、一度実行することと 2 回実行することの間に*ユーザーに見える*動作の違いはありません。実用的な観点から、`logVisit` は開発中に何もすべきではありません。なぜなら、開発マシンからのログが本番メトリクスを歪めることを望まないからです。コンポーネントは、ファイルを保存するたびに再マウントされるため、開発中に余分な訪問がログに記録されます。

**本番環境では、重複した訪問ログはありません。**

送信している分析イベントをデバッグするには、アプリをステージング環境（本番モードで実行される）にデプロイするか、[Strict Mode](/reference/react/StrictMode) とその開発専用の再マウントチェックを一時的にオプトアウトできます。また、エフェクトの代わりにルート変更イベントハンドラから分析を送信することもできます。より正確な分析のために、[intersection observers](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) を使用して、どのコンポーネントがビューポートにあるか、どれくらい表示されているかを追跡できます。

### エフェクトではない：アプリケーションの初期化

一部のロジックは、アプリケーションの起動時に一度だけ実行されるべきです。コンポーネントの外に配置できます。

```js {2-3}
if (typeof window !== 'undefined') { // ブラウザで実行されているかどうかをチェックします。
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

これにより、このようなロジックがブラウザがページをロードした後に一度だけ実行されることが保証されます。

### エフェクトではない：製品の購入

時には、クリーンアップ関数を書いても、エフェクトを 2 回実行することのユーザーに見える影響を防ぐ方法がない場合があります。例えば、エフェクトが製品を購入するような POST リクエストを送信する場合があります。

```js {2-3}
useEffect(() => {
  // 🔴 間違い：このエフェクトは開発中に 2 回実行され、コードに問題があることを示します。
  fetch('/api/buy', { method: 'POST' });
}, []);
```

製品を 2 回購入したくありません。しかし、これがこのロジックをエフェクトに配置すべきでない理由でもあります。ユーザが別のページに移動してから Back を押したらどうなるでしょうか？エフェクトが再度実行されます。ユーザがページを*訪問*したときに製品を購入したくありません。ユーザが購入ボタンを*クリック*したときに購入したいのです。

購入はレンダーによって引き起こされるのではなく、特定のインタラクションによって引き起こされます。ユーザがボタンを押したときにのみ実行されるべきです。**エフェクトを削除して、`/api/buy` リクエストを Buy ボタンのイベントハンドラに移動してください。**

```js {2-3}
  function handleClick() {
    // ✅ 購入は、特定のインタラクションによって引き起こされるイベントです。
    fetch('/api/buy', { method: 'POST' });
  }
```

**これは、再マウントがアプリケーションのロジックを壊す場合、通常、既存のバグを明らかにすることを示しています。** ユーザの観点からは、ページを訪問することと、ページを訪問し、リンクをクリックしてから Back を押すことに違いはないはずです。React は、開発中にコンポーネントを一度再マウントすることで、コンポーネントがこの原則に従っていることを確認します。

## すべてをまとめる

このプレイグラウンドは、エフェクトが実際にどのように機能するかを「感じる」のに役立ちます。

この例は、[`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) を使用して、エフェクトが実行されてから 3 秒後に入力テキストを含むコンソールログを表示するようにスケジュールします。クリーンアップ関数は、保留中のタイムアウトをキャンセルします。"Mount the component" を押すことから始めてください。

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

最初に、`Schedule "a" log`、`Cancel "a" log`、および再度 `Schedule "a" log` の 3 つのログが表示されます。3 秒後には、`a` と表示するログも表示されます。前に学んだように、追加のスケジュール/キャンセルのペアは、React が開発中にコンポーネントを一度再マウントして、クリーンアップを適切に実装したことを確認するためです。

次に、入力フィールドを `abc` に編集してください。十分に速く行うと、`Schedule "ab" log` の直後に `Cancel "ab" log` と `Schedule "abc" log` が表示されます。**React は常に前回のレンダーのエフェクトを次のレンダーのエフェクトの前にクリーンアップします。** これが、高速に入力しても、一度に最大 1 つのタイムアウトがスケジュールされる理由です。入力フィールドを数回編集して、コンソールを見て、エフェクトがどのようにクリーンアップされるかを感じてください。

入力フィールドに何かを入力してから、すぐに "Unmount the component" を押してください。アンマウントが最後のレンダーのエフェクトをクリーンアップする方法に注目してください。ここでは、起動する前に最後のタイムアウトをクリアします。

最後に、上記のコンポーネントを編集して、クリーンアップ関数をコメントアウトし、タイムアウトがキャンセルされないようにしてください。`abcde` を高速に入力してみてください。3 秒後に何が起こることを期待しますか？タイムアウト内の `console.log(text)` は*最新*の `text` を出力し、5 つの `abcde` ログを生成しますか？直感を確認してみてください！

3 秒後には、`abcde` ではなく、`a`、`ab`、`abc`、`abcd`、`abcde` のログのシーケンスが表示されるはずです。**各エフェクトは、対応するレンダーから `text` 値を「キャプチャ」します。** `text` state が変更されても関係ありません。`text = 'ab'` のレンダーからのエフェクトは常に `'ab'` を見ます。言い換えれば、各レンダーのエフェクトは互いに分離されています。これがどのように機能するかに興味がある場合は、[クロージャ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)について読むことができます。

<DeepDive>

#### 各レンダーには独自のエフェクトがあります

`useEffect` は、レンダー出力に動作の「アタッチ」を考えることができます。このエフェクトを考えてみてください。

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

ユーザがアプリを移動するときに正確に何が起こるかを見てみましょう。

#### 初回レンダー

ユーザが `<ChatRoom roomId="general" />` を訪問します。`roomId` を `'general'` に[メンタルに置き換えてみましょう](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)。

```js
  // 初回レンダーの JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**エフェクトもレンダー出力の一部です。** 初回レンダーのエフェクトは次のようになります。

```js
  // 初回レンダーのエフェクト (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 初回レンダーの依存配列 (roomId = "general")
  ['general']
```

React はこのエフェクトを実行し、`'general'` チャットルームに接続します。

#### 同じ依存配列での再レンダー

`<ChatRoom roomId="general" />` が再レンダーされたとします。JSX 出力は同じです。

```js
  // 2 番目のレンダーの JSX (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React は、レンダー出力が変更されていないことを確認するため、DOM を更新しません。

2 番目のレンダーのエフェクトは次のようになります。

```js
  // 2 番目のレンダーのエフェクト (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // 2 番目のレンダーの依存配列 (roomId = "general")
  ['general']
```

React は、2 番目のレンダーの `['general']` を初回レンダーの `['general']` と比較します。**すべての依存関係が同じであるため、React は 2 番目のレンダーのエフェクトを*無視*します。** それは決して呼び出されません。

#### 異なる依存配列での再レンダー

次に、ユーザが `<ChatRoom roomId="travel" />` を訪問します。今回は、コンポーネントは異なる JSX を返します。

```js
  // 3 番目のレンダーの JSX (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React は、`"Welcome to general"` を `"Welcome to travel"` に変更するために DOM を更新します。

3 番目のレンダーのエフェクトは次のようになります。

```js
  // 3 番目のレンダーのエフェクト (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // 3 番目のレンダーの依存配列 (roomId = "travel")
  ['travel']
```

React は、3 番目のレンダーの `['travel']` を 2 番目のレンダーの `['general']` と比較します。1 つの依存関係が異なります：`Object.is('travel', 'general')` は `false` です。エフェクトはスキップできません。

**React が 3 番目のレンダーのエフェクトを適用する前に、実行された*最後の*エフェクトをクリーンアップする必要があります。** 2 番目のレンダーのエフェクトはスキップされたため、React は初回レンダーのエフェクトをクリーンアップする必要があります。初回レンダーまでスクロールすると、そのクリーンアップが `createConnection('general')` で作成された接続で `disconnect()` を呼び出すことがわかります。これにより、アプリは `'general'` チャットルームから切断されます。

その後、React は 3 番目のレンダーのエフェクトを実行します。`'travel'` チャットルームに接続します。

#### アンマウント

最後に、ユーザがナビゲートして、`ChatRoom` コンポーネントがアンマウントされたとします。React は、最後のエフェクトのクリーンアップ関数を実行します。最後のエフェクトは 3 番目のレンダーからのものでした。3 番目のレンダーのクリーンアップは、`createConnection('travel')` 接続を破棄します。したがって、アプリは `'travel'` ルームから切断されます。

#### 開発専用の動作

[Strict Mode](/reference/react/StrictMode) がオンの場合、React はマウント後にすべてのコンポーネントを一度再マウントします（state とDOMは保持されます）。これにより、[クリーンアップが必要なエフェクトを見つけ](#step-3-add-cleanup-if-needed)、競合状態のようなバグを早期に明らかにするのに役立ちます。さらに、開発中にファイルを保存するたびに、React はエフェクトを再マウントします。これらの動作は両方とも開発専用です。

</DeepDive>

<Recap>

- イベントとは異なり、エフェクトは特定のインタラクションではなく、レンダー自体によって引き起こされます。
- エフェクトを使用すると、コンポーネントを外部システム（サードパーティ API、ネットワークなど）と同期させることができます。
- デフォルトでは、エフェクトはすべてのレンダー後（初回のものを含む）に実行されます。
- すべての依存関係が前回のレンダー時と同じ値である場合、React はエフェクトをスキップします。
- 依存関係を「選択」することはできません。それらはエフェクト内のコードによって決定されます。
- 空の依存配列（`[]`）は、コンポーネントの「マウント」、つまり画面に追加されることに対応します。
- Strict Mode では、React はコンポーネントを 2 回マウントします（開発中のみ！）してエフェクトのストレステストを行います。
- エフェクトが再マウントによって壊れる場合、クリーンアップ関数を実装する必要があります。
- React は、次回エフェクトが実行される前、およびアンマウント時にクリーンアップ関数を呼び出します。

</Recap>

<Challenges>

#### マウント時にフィールドにフォーカスを当てる

この例では、フォームは `<MyInput />` コンポーネントをレンダーします。

入力の [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) メソッドを使用して、`MyInput` が画面に表示されたときに自動的にフォーカスが当たるようにします。すでにコメントアウトされた実装がありますが、完全には機能していません。なぜ機能しないのかを理解し、修正してください。（`autoFocus` 属性に精通している場合は、それが存在しないふりをしてください。同じ機能をゼロから再実装しています。）

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: これは完全には機能していません。修正してください。
  // ref.current.focus()

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

ソリューションが機能することを確認するには、"Show form" を押して、入力がフォーカスを受けていることを確認してください（ハイライトされ、カーソルが内部に配置されます）。"Hide form" を押してから再度 "Show form" を押します。入力が再びハイライトされていることを確認してください。

`MyInput` は、すべてのレンダー後ではなく、*マウント時*にのみフォーカスされるべきです。動作が正しいことを確認するには、"Show form" を押してから、"Make it uppercase" チェックボックスを繰り返し押してください。チェックボックスをクリックしても、上の入力にフォーカスが当たら*ない*はずです。

<Solution>

レンダー中に `ref.current.focus()` を呼び出すことは*副作用*であるため、間違っています。副作用は、イベントハンドラ内に配置するか、`useEffect` で宣言する必要があります。この場合、副作用は、特定のインタラクションではなく、コンポーネントの表示によって*引き起こされる*ため、エフェクトに配置することが理にかなっています。

間違いを修正するには、`ref.current.focus()` 呼び出しをエフェクト宣言にラップします。次に、このエフェクトがすべてのレンダー後ではなくマウント時にのみ実行されるようにするため、空の `[]` 依存配列を追加します。

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 条件付きでフィールドにフォーカスを当てる

このフォームは 2 つの `<MyInput />` コンポーネントをレンダーします。

"Show form" を押すと、2 番目のフィールドが自動的にフォーカスされることに注目してください。これは、両方の `<MyInput />` コンポーネントが内部のフィールドにフォーカスを当てようとするためです。2 つの入力フィールドに連続して `focus()` を呼び出すと、最後のフィールドが常に「勝ちます」。

最初のフィールドにフォーカスを当てたいとします。最初の `MyInput` コンポーネントは、`true` に設定されたブール値の `shouldFocus` props を受け取るようになりました。`MyInput` が受け取る `shouldFocus` props が `true` の場合にのみ `focus()` が呼び出されるようにロジックを変更します。

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: shouldFocus が true の場合にのみ focus() を呼び出します
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

ソリューションを確認するには、"Show form" と "Hide form" を繰り返し押してください。フォームが表示されたら、*最初の*入力のみがフォーカスされるはずです。これは、親コンポーネントが最初の入力を `shouldFocus={true}` でレンダーし、2 番目の入力を `shouldFocus={false}` でレンダーするためです。また、両方の入力が依然として機能し、両方に入力できることを確認してください。

<Hint>

条件付きでエフェクトを宣言することはできませんが、エフェクトには条件付きロジックを含めることができます。

</Hint>

<Solution>

条件付きロジックをエフェクト内に配置します。エフェクト内で `shouldFocus` を使用しているため、依存配列で指定する必要があります。（これは、一部の入力の `shouldFocus` が `false` から `true` に変更された場合、マウント後にフォーカスされることを意味します。）

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 2 回起動するインターバルを修正する

この `Counter` コンポーネントは、毎秒インクリメントされるカウンタを表示します。マウント時に、[`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) を呼び出します。これにより、`onTick` が毎秒実行されます。`onTick` 関数はカウンタをインクリメントします。

しかし、毎秒 1 回インクリメントする代わりに、2 回インクリメントします。なぜでしょうか？バグの原因を見つけて修正してください。

<Hint>

`setInterval` はインターバル ID を返します。これを [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) に渡してインターバルを停止できます。

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

[Strict Mode](/reference/react/StrictMode)がオンの場合（このサイトのサンドボックスのように）、React は開発中に各コンポーネントを一度再マウントします。これにより、インターバルが 2 回セットアップされ、毎秒カウンタが 2 回インクリメントされます。

しかし、React の動作がバグの*原因*ではありません。バグはすでにコードに存在しています。React の動作はバグをより目立たせます。実際の原因は、このエフェクトがプロセスを開始しますが、それをクリーンアップする方法を提供しないことです。

このコードを修正するには、`setInterval` によって返されるインターバル ID を保存し、[`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) でクリーンアップ関数を実装します。

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

開発中、React は依然としてコンポーネントを一度再マウントして、クリーンアップを適切に実装したことを確認します。したがって、`setInterval` 呼び出しの後に `clearInterval` 呼び出し、再度 `setInterval` 呼び出しがあります。本番環境では、`setInterval` 呼び出しは 1 つだけです。両方の場合のユーザーに見える動作は同じです。カウンタは毎秒 1 回インクリメントされます。

</Solution>

#### エフェクト内のフェッチを修正する

このコンポーネントは、選択された人物の伝記を表示します。マウント時および `person` が変更されるたびに、非同期関数 `fetchBio(person)` を呼び出して伝記をロードします。その非同期関数は、最終的に文字列に解決される [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) を返します。フェッチが完了すると、`setBio` を呼び出して、その文字列を選択ボックスの下に表示します。

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + ''s bio.');
    }, delay);
  })
}

```

</Sandpack>

このコードにはバグがあります。"Alice" を選択することから始めてください。次に "Bob" を選択し、その直後にすぐに "Taylor" を選択してください。これを十分に速く行うと、バグに気付くでしょう。Taylor が選択されているにもかかわらず、下の段落には "This is Bob's bio." と表示されます。

なぜこれが起こるのでしょうか？このエフェクト内のバグを修正してください。

<Hint>

エフェクトが何かを非同期的にフェッチする場合、通常、クリーンアップが必要です。

</Hint>

<Solution>

バグをトリガするには、物事が次の順序で発生する必要があります。

- `'Bob'` を選択すると、`fetchBio('Bob')` がトリガされます
- `'Taylor'` を選択すると、`fetchBio('Taylor')` がトリガされます
- **`'Taylor'` のフェッチが `'Bob'` のフェッチの*前に*完了します**
- `'Taylor'` レンダーのエフェクトが `setBio('This is Taylor's bio')` を呼び出します
- `'Bob'` のフェッチが完了します
- `'Bob'` レンダーのエフェクトが `setBio('This is Bob's bio')` を呼び出します

これが、Taylor が選択されているにもかかわらず Bob の伝記が表示される理由です。このようなバグは[競合状態](https://en.wikipedia.org/wiki/Race_condition)と呼ばれます。2 つの非同期操作が互いに「競争」し、予期しない順序で到着する可能性があるためです。

この競合状態を修正するには、クリーンアップ関数を追加します。

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + ''s bio.');
    }, delay);
  })
}

```

</Sandpack>

各レンダーのエフェクトには、独自の `ignore` 変数があります。最初は、`ignore` 変数は `false` に設定されています。しかし、エフェクトがクリーンアップされる（別の人を選択するときなど）と、その `ignore` 変数は `true` になります。したがって、リクエストが完了する順序は関係ありません。最後の人物のエフェクトのみが `ignore` を `false` に設定しているため、`setBio(result)` を呼び出します。過去のエフェクトはクリーンアップされたため、`if (!ignore)` チェックにより `setBio` 呼び出しがスキップされます。

- `'Bob'` を選択すると、`fetchBio('Bob')` がトリガされます
- `'Taylor'` を選択すると、`fetchBio('Taylor')` がトリガされ、**前の（Bob の）エフェクトをクリーンアップします**
- `'Taylor'` のフェッチが `'Bob'` のフェッチの*前に*完了します
- `'Taylor'` レンダーのエフェクトが `setBio('This is Taylor's bio')` を呼び出します
- `'Bob'` のフェッチが完了します
- `'Bob'` レンダーのエフェクトは、`ignore` フラグが `true` に設定されているため、**何もしません**

古い API 呼び出しの結果を無視することに加えて、[`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) を使用して、不要になったリクエストをキャンセルすることもできます。しかし、これだけでは競合状態を防ぐのに十分ではありません。フェッチの後にさらに非同期ステップがチェーンされる可能性があるため、`ignore` のような明示的なフラグを使用することが、この種の問題を修正する最も信頼性の高い方法です。

</Solution>

</Challenges>
