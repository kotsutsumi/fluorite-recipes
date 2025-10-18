---
title: 'チュートリアル: 三目並べ'
description: ゲームを作る
nav: 0
---

# チュートリアル: 三目並べ

## ゲームを作る

このチュートリアルでは、小さな三目並べゲームを作ります。このチュートリアルは、既存のReactの知識があることを前提としています。チュートリアルで学ぶテクニックは、あらゆるReactアプリを構築するための基礎となるもので、それを完全に理解することで、ReactとZustandについての深い理解が得られます。

> [!NOTE]
> このチュートリアルは、実践を通して学ぶことを好み、素早く具体的なものを作りたい人のために作られました。Reactの三目並べチュートリアルからインスピレーションを得ています。

チュートリアルはいくつかのセクションに分かれています:

- チュートリアルのセットアップでは、チュートリアルを進めるための出発点を提供します。
- 概要では、Reactの基礎であるコンポーネント、props、stateについて学びます。
- ゲームの完成では、React開発で最も一般的なテクニックを学びます。
- タイムトラベルの追加では、Reactのユニークな強みについてより深い洞察が得られます。

### 何を作るのか?

このチュートリアルでは、ReactとZustandを使ったインタラクティブな三目並べゲームを作ります。

完成するとどのようになるか、ここで見ることができます:

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine(
    {
      history: [Array(9).fill(null)],
      currentMove: 0,
    },
    (set, get) => {
      return {
        setHistory: (nextHistory) => {
          set((state) => ({
            history:
              typeof nextHistory === 'function'
                ? nextHistory(state.history)
                : nextHistory,
          }))
        },
        setCurrentMove: (nextCurrentMove) => {
          set((state) => ({
            currentMove:
              typeof nextCurrentMove === 'function'
                ? nextCurrentMove(state.currentMove)
                : nextCurrentMove,
          }))
        },
      }
    },
  ),
)

function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    onPlay(nextSquares)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((_, i) => (
          <Square
            key={`square-${i}`}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  )
}

export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>
          {history.map((_, historyIndex) => {
            const description =
              historyIndex > 0
                ? `Go to move #${historyIndex}`
                : 'Go to game start'

            return (
              <li key={historyIndex}>
                <button onClick={() => jumpTo(historyIndex)}>
                  {description}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return 'Draw'
  if (winner) return `Winner ${winner}`
  return `Next player: ${player}`
}
```

### ボードを構築する

まず、`Square`コンポーネントを作成しましょう。これは`Board`コンポーネントの構成要素となります。このコンポーネントは、ゲームの各マスを表します。

`Square`コンポーネントは、`value`と`onSquareClick`をpropsとして受け取る必要があります。マス形に見えるようにスタイリングされた`<button>`要素を返す必要があります。ボタンはvalue propを表示します。これは、ゲームの状態に応じて`'X'`、`'O'`、または`null`のいずれかになります。ボタンがクリックされると、propとして渡された`onSquareClick`関数がトリガーされ、ゲームがユーザー入力に応答できるようになります。

`Square`コンポーネントのコードは次のとおりです:

```jsx
function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}
```

次に、Boardコンポーネントを作成しましょう。これは、グリッド状に配置された9つのマスで構成されます。このコンポーネントは、ゲームのメインプレイエリアとなります。

`Board`コンポーネントは、グリッドとしてスタイリングされた`<div>`要素を返す必要があります。グリッドレイアウトは、CSS Gridを使用して実現されます。3つの列と3つの行があり、それぞれが利用可能なスペースの等しい部分を占めます。グリッドの全体的なサイズは、widthとheightプロパティによって決定され、正方形で適切なサイズであることが保証されます。

グリッド内に、9つのSquareコンポーネントを配置します。それぞれに位置を表すvalue propがあります。これらのSquareコンポーネントは、最終的にゲームのシンボル（`'X'`または`'O'`）を保持し、ユーザーのインタラクションを処理します。

`Board`コンポーネントのコードは次のとおりです:

```jsx
export default function Board() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      <Square value="1" />
      <Square value="2" />
      <Square value="3" />
      <Square value="4" />
      <Square value="5" />
      <Square value="6" />
      <Square value="7" />
      <Square value="8" />
      <Square value="9" />
    </div>
  )
}
```

このBoardコンポーネントは、9つのマスを3x3のグリッドに配置することで、ゲームボードの基本構造を設定します。マスをきれいに配置し、将来的に機能を追加したり、プレイヤーのインタラクションを処理したりするための基盤を提供します。

### stateを持ち上げる

各`Square`コンポーネントは、ゲームのstateの一部を維持することができます。三目並べゲームで勝者をチェックするには、`Board`コンポーネントが何らかの方法で9つの`Square`コンポーネントそれぞれのstateを知る必要があります。

どのようにアプローチしますか? 最初は、`Board`コンポーネントが各`Square`コンポーネントにそのSquareのコンポーネントstateを尋ねる必要があると推測するかもしれません。このアプローチはReactで技術的には可能ですが、コードが理解しにくくなり、バグが発生しやすくなり、リファクタリングが困難になるため、推奨されません。代わりに、最良のアプローチは、各`Square`コンポーネントではなく、親の`Board`コンポーネントにゲームのstateを保存することです。`Board`コンポーネントは、各`Square`コンポーネントに表示する内容をpropを渡すことで指示できます。これは、各`Square`コンポーネントに数値を渡したときと同じです。

> [!IMPORTANT]
> 複数の子からデータを収集する場合、または2つ以上の子コンポーネントを互いに通信させる場合は、代わりに親コンポーネントで共有stateを宣言します。親コンポーネントは、propsを介してそのstateを子に渡すことができます。これにより、子コンポーネントは互いに、そして親と同期した状態を保ちます。

この機会に試してみましょう。`Board`コンポーネントを編集して、9つのマスに対応する9つのnullの配列をデフォルトとするsquaresという名前のstate変数を宣言します:

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine({ squares: Array(9).fill(null) }, (set) => {
    return {
      setSquares: (nextSquares) => {
        set((state) => ({
          squares:
            typeof nextSquares === 'function'
              ? nextSquares(state.squares)
              : nextSquares,
        }))
      },
    }
  }),
)

export default function Board() {
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      {squares.map((square, squareIndex) => (
        <Square key={squareIndex} value={square} />
      ))}
    </div>
  )
}
```

`Array(9).fill(null)`は、9つの要素を持つ配列を作成し、それぞれを`null`に設定します。`useGameStore`は、その配列に最初に設定される`squares` stateを宣言します。配列内の各エントリは、マスの値に対応します。後でボードを埋めると、squares配列は次のようになります:

```js
const squares = ['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

各Squareは、空のマスの場合は`'X'`、`'O'`、または`null`のいずれかになる`value` propを受け取るようになります。

次に、`Square`コンポーネントがクリックされたときに何が起こるかを変更する必要があります。`Board`コンポーネントは、どのマスが埋められているかを維持するようになりました。`Square`コンポーネントが`Board`のコンポーネントstateを更新する方法を作成する必要があります。stateはそれを定義するコンポーネントに対してプライベートであるため、`Square`コンポーネントから`Board`のコンポーネントstateを直接更新することはできません。

代わりに、Boardコンポーネントから`Square`コンポーネントに関数を渡し、マスがクリックされたときに`Square`コンポーネントにその関数を呼び出させます。マスがクリックされたときに`Square`コンポーネントが呼び出す関数から始めます。その関数を`onSquareClick`と呼びます:

次に、`onSquareClick` propを、`Board`コンポーネント内で`handleClick`という名前の関数に接続します。`onSquareClick`を`handleClick`に接続するには、最初のSquareコンポーネントの`onSquareClick` propにインライン関数を渡します:

```jsx
<Square key={squareIndex} value={square} onSquareClick={() => handleClick(i)} />
```

最後に、ボードのstateを保持するsquares配列を更新するために、`Board`コンポーネント内に`handleClick`関数を定義します。

`handleClick`関数は、更新するマスのインデックスを受け取り、`squares`配列のコピー（`nextSquares`）を作成する必要があります。次に、`handleClick`は、マスがまだ埋められていない場合、指定されたインデックス（`i`）のマスに`X`を追加して`nextSquares`配列を更新します。

```jsx {5-10,27}
export default function Board() {
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)

  function handleClick(i) {
    if (squares[i]) return
    const nextSquares = squares.slice()
    nextSquares[i] = 'X'
    setSquares(nextSquares)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      {squares.map((square, squareIndex) => (
        <Square
          key={squareIndex}
          value={square}
          onSquareClick={() => handleClick(squareIndex)}
        />
      ))}
    </div>
  )
}
```

> [!IMPORTANT]
> `handleClick`関数で、既存の配列を変更するのではなく、squares配列のコピーを作成するために`.slice()`を呼び出していることに注意してください。

### ターンを取る

この三目並べゲームの大きな欠陥を修正する時が来ました:`'O'`をボードで使用できません。

デフォルトで最初の手を`'X'`に設定します。`useGameStore`フックに別のstate部分を追加して、これを追跡しましょう:

```jsx {2,12-18}
const useGameStore = create(
  combine({ squares: Array(9).fill(null), xIsNext: true }, (set) => {
    return {
      setSquares: (nextSquares) => {
        set((state) => ({
          squares:
            typeof nextSquares === 'function'
              ? nextSquares(state.squares)
              : nextSquares,
        }))
      },
      setXIsNext: (nextXIsNext) => {
        set((state) => ({
          xIsNext:
            typeof nextXIsNext === 'function'
              ? nextXIsNext(state.xIsNext)
              : nextXIsNext,
        }))
      },
    }
  }),
)
```

プレイヤーが手を打つたびに、`xIsNext`（ブール値）が反転して次のプレイヤーを決定し、ゲームのstateが保存されます。Boardの`handleClick`関数を更新して、`xIsNext`の値を反転させます:

```jsx {2-3,6,11}
export default function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)
  const player = xIsNext ? 'X' : 'O'

  function handleClick(i) {
    if (squares[i]) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        width: 'calc(3 * 2.5rem)',
        height: 'calc(3 * 2.5rem)',
        border: '1px solid #999',
      }}
    >
      {squares.map((square, squareIndex) => (
        <Square
          key={squareIndex}
          value={square}
          onSquareClick={() => handleClick(squareIndex)}
        />
      ))}
    </div>
  )
}
```

### 勝者または引き分けを宣言する

プレイヤーがターンを取れるようになったので、ゲームに勝ったとき、または引き分けで、これ以上ターンがないときを表示したいと思います。これを行うには、3つのヘルパー関数を追加します。最初のヘルパー関数は`calculateWinner`と呼ばれ、9つのマスの配列を受け取り、勝者をチェックして、適切に`'X'`、`'O'`、または`null`を返します。2番目のヘルパー関数は`calculateTurns`と呼ばれ、同じ配列を受け取り、`null`項目のみをフィルタリングして残りのターンをチェックし、それらのカウントを返します。最後のヘルパーは`calculateStatus`と呼ばれ、残りのターン、勝者、現在のプレイヤー（`'X'`または`'O'`）を受け取ります:

```js
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return 'Draw'
  if (winner) return `Winner ${winner}`
  return `Next player: ${player}`
}
```

Boardコンポーネントの`handleClick`関数で`calculateWinner(squares)`の結果を使用して、プレイヤーが勝ったかどうかをチェックします。ユーザーがすでに`'X'`または`'O'`を持っているマスをクリックしたかどうかをチェックするのと同時に、このチェックを実行できます。どちらの場合も早期に戻りたいと思います:

```js {2}
function handleClick(i) {
  if (squares[i] || winner) return
  const nextSquares = squares.slice()
  nextSquares[i] = player'
  setSquares(nextSquares)
  setXIsNext(!xIsNext)
}
```

ゲームがいつ終了したかをプレイヤーに知らせるために、`'Winner: X'`や`'Winner: O'`などのテキストを表示できます。これを行うには、`Board`コンポーネントに`status`セクションを追加します。ゲームが終了した場合はstatusに勝者または引き分けが表示され、ゲームが進行中の場合は次のプレイヤーのターンが表示されます:

```jsx {6-7,9,21}
export default function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}
```

おめでとうございます! 動作する三目並べゲームが完成しました。そして、ReactとZustandの基礎も学びました。つまり、あなたが真の勝者です。コードは次のようになります:

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine({ squares: Array(9).fill(null), xIsNext: true }, (set) => {
    return {
      setSquares: (nextSquares) => {
        set((state) => ({
          squares:
            typeof nextSquares === 'function'
              ? nextSquares(state.squares)
              : nextSquares,
        }))
      },
      setXIsNext: (nextXIsNext) => {
        set((state) => ({
          xIsNext:
            typeof nextXIsNext === 'function'
              ? nextXIsNext(state.xIsNext)
              : nextXIsNext,
        }))
      },
    }
  }),
)

function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

export default function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return 'Draw'
  if (winner) return `Winner ${winner}`
  return `Next player: ${player}`
}
```

### タイムトラベルの追加

最後の演習として、ゲームで「時間を遡る」ことを可能にし、以前の手を再訪できるようにしましょう。

squares配列を直接変更していた場合、このタイムトラベル機能を実装することは非常に困難だったでしょう。しかし、各手の後に`slice()`を使用してsquares配列の新しいコピーを作成し、それを不変として扱ったので、squares配列の過去のすべてのバージョンを保存して、それらの間を移動できます。

これらの過去のsquares配列を、`history`という新しいstate変数に保存します。この`history`配列は、最初の手から最新の手まで、すべてのボードstateを保存し、次のようになります:

```js
const history = [
  // 最初の手
  [null, null, null, null, null, null, null, null, null],
  // 2番目の手
  ['X', null, null, null, null, null, null, null, null],
  // 3番目の手
  ['X', 'O', null, null, null, null, null, null, null],
  // など...
]
```

このアプローチにより、異なるゲームstate間を簡単に移動でき、タイムトラベル機能を実装できます。

### stateを再び持ち上げる

次に、過去の手のリストを表示する`Game`という新しいトップレベルのコンポーネントを作成します。これは、ゲーム全体の履歴を含む`history` stateを保存する場所です。

`history` stateを`Game`コンポーネントに配置することで、`Board`コンポーネントから`squares` stateを削除できます。`Board`コンポーネントから`Game`コンポーネントにstateを持ち上げます。これにより、`Game`コンポーネントは`Board`のコンポーネントデータを完全に制御し、`history`から以前のターンをレンダリングするように`Board`コンポーネントに指示できます。

まず、`export default`を含む`Game`コンポーネントを追加し、`Board`コンポーネントから削除します。コードは次のようになります:

```jsx {1,44-61}
function Board() {
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const squares = useGameStore((state) => state.squares)
  const setSquares = useGameStore((state) => state.setSquares)
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}

export default function Game() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{/* TODO */}</ol>
      </div>
    </div>
  )
}
```

`useGameStore`フックに手の履歴を追跡するstateを追加します:

```js {2,4-11}
const useGameStore = create(
  combine({ history: [Array(9).fill(null)], xIsNext: true }, (set) => {
    return {
      setHistory: (nextHistory) => {
        set((state) => ({
          history:
            typeof nextHistory === 'function'
              ? nextHistory(state.history)
              : nextHistory,
        }))
      },
      setXIsNext: (nextXIsNext) => {
        set((state) => ({
          xIsNext:
            typeof nextXIsNext === 'function'
              ? nextXIsNext(state.xIsNext)
              : nextXIsNext,
        }))
      },
    }
  }),
)
```

`[Array(9).fill(null)]`は、単一の項目を持つ配列を作成します。その項目自体が9つのnull値の配列です。

現在の手のマスをレンダリングするには、`history` stateから最新のsquares配列を読み取る必要があります。これには追加のstateは必要ありません。レンダリング中にそれを計算するのに十分な情報がすでにあるからです:

```jsx {2-6}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const currentSquares = history[history.length - 1]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  )
}
```

次に、`Game`コンポーネント内に、`Board`コンポーネントによって呼び出されてゲームを更新する`handlePlay`関数を作成します。`xIsNext`、`currentSquares`、`handlePlay`をpropsとして`Board`コンポーネントに渡します:

```jsx {8-10,21}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const currentSquares = history[history.length - 1]

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  )
}
```

`Board`コンポーネントを、受け取るpropsによって完全に制御されるようにしましょう。これを行うには、`Board`コンポーネントを変更して、3つのpropsを受け入れるようにします: `xIsNext`、`squares`、およびプレイヤーが手を打ったときに更新されたsquares配列で`Board`コンポーネントが呼び出せる新しい`onPlay`関数です。

```jsx {1}
function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    onPlay(nextSquares)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}
```

`Board`コンポーネントは、`Game`コンポーネントから渡されたpropsによって完全に制御されるようになりました。ゲームを再び動作させるには、`Game`コンポーネントで`handlePlay`関数を実装する必要があります。

`handlePlay`は呼び出されたときに何をすべきでしょうか? 以前、`Board`コンポーネントは更新された配列で`setSquares`を呼び出していましたが、今は更新されたsquares配列を`onPlay`に渡します。

`handlePlay`関数は、`Game`コンポーネントのstateを更新して再レンダリングをトリガーする必要があります。`setSquares`を使用する代わりに、更新されたsquares配列を新しい`history`エントリとして追加することで、`history` state変数を更新します。また、`Board`コンポーネントが以前行っていたように、`xIsNext`を切り替える必要があります。

```js {2-3}
function handlePlay(nextSquares) {
  setHistory(history.concat([nextSquares]))
  setXIsNext(!xIsNext)
}
```

この時点で、stateは`Game`コンポーネント内に存在するように移動しており、UIはリファクタリング前と同じように完全に動作するはずです。この時点でのコードは次のようになります:

```jsx
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

const useGameStore = create(
  combine({ history: [Array(9).fill(null)], xIsNext: true }, (set) => {
    return {
      setHistory: (nextHistory) => {
        set((state) => ({
          history:
            typeof nextHistory === 'function'
              ? nextHistory(state.history)
              : nextHistory,
        }))
      },
      setXIsNext: (nextXIsNext) => {
        set((state) => ({
          xIsNext:
            typeof nextXIsNext === 'function'
              ? nextXIsNext(state.xIsNext)
              : nextXIsNext,
        }))
      },
    }
  }),
)

function Square({ value, onSquareClick }) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#fff',
        border: '1px solid #999',
        outline: 0,
        borderRadius: 0,
        fontSize: '1rem',
        fontWeight: 'bold',
      }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares)
  const turns = calculateTurns(squares)
  const player = xIsNext ? 'X' : 'O'
  const status = calculateStatus(winner, turns, player)

  function handleClick(i) {
    if (squares[i] || winner) return
    const nextSquares = squares.slice()
    nextSquares[i] = player
    onPlay(nextSquares)
  }

  return (
    <>
      <div style={{ marginBottom: '0.5rem' }}>{status}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          width: 'calc(3 * 2.5rem)',
          height: 'calc(3 * 2.5rem)',
          border: '1px solid #999',
        }}
      >
        {squares.map((square, squareIndex) => (
          <Square
            key={squareIndex}
            value={square}
            onSquareClick={() => handleClick(squareIndex)}
          />
        ))}
      </div>
    </>
  )
}

export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const currentSquares = history[history.length - 1]

  function handlePlay(nextSquares) {
    setHistory(history.concat([nextSquares]))
    setXIsNext(!xIsNext)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null
}

function calculateTurns(squares) {
  return squares.filter((square) => !square).length
}

function calculateStatus(winner, turns, player) {
  if (!winner && !turns) return 'Draw'
  if (winner) return `Winner ${winner}`
  return `Next player: ${player}`
}
```

### 過去の手を表示する

三目並べゲームの履歴を記録しているので、プレイヤーに過去の手のリストを表示できるようになりました。

ストアにはすでに`history`の手の配列があるので、今度はそれをReact要素の配列に変換する必要があります。JavaScriptでは、ある配列を別の配列に変換するために、配列の`.map()`メソッドを使用できます:

`map`を使用して、`history`の手を画面上のボタンを表すReact要素に変換し、過去の手に**ジャンプ**するボタンのリストを表示します。`Game`コンポーネントで`history`を`map`しましょう:

```jsx {29-44}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const currentSquares = history[history.length - 1]

  function handlePlay(nextSquares) {
    setHistory(history.concat([nextSquares]))
    setXIsNext(!xIsNext)
  }

  function jumpTo(nextMove) {
    // TODO
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>
          {history.map((_, historyIndex) => {
            const description =
              historyIndex > 0
                ? `Go to move #${historyIndex}`
                : 'Go to game start'

            return (
              <li key={historyIndex}>
                <button onClick={() => jumpTo(historyIndex)}>
                  {description}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
```

`jumpTo`関数を実装する前に、ユーザーが現在表示しているステップを`Game`コンポーネントが追跡する必要があります。これを行うには、`0`から開始する`currentMove`という新しいstate変数を定義します:

```js {3,14-21}
const useGameStore = create(
  combine(
    { history: [Array(9).fill(null)], currentMove: 0, xIsNext: true },
    (set) => {
      return {
        setHistory: (nextHistory) => {
          set((state) => ({
            history:
              typeof nextHistory === 'function'
                ? nextHistory(state.history)
                : nextHistory,
          }))
        },
        setCurrentMove: (nextCurrentMove) => {
          set((state) => ({
            currentMove:
              typeof nextCurrentMove === 'function'
                ? nextCurrentMove(state.currentMove)
                : nextCurrentMove,
          }))
        },
        setXIsNext: (nextXIsNext) => {
          set((state) => ({
            xIsNext:
              typeof nextXIsNext === 'function'
                ? nextXIsNext(state.xIsNext)
                : nextXIsNext,
          }))
        },
      }
    },
  ),
)
```

次に、`Game`コンポーネント内の`jumpTo`関数を更新して、その`currentMove`を更新します。また、`currentMove`を変更する番号が偶数の場合、`xIsNext`を`true`に設定します。

```js {2-3}
function jumpTo(nextMove) {
  setCurrentMove(nextMove)
  setXIsNext(currentMove % 2 === 0)
}
```

次に、マスをクリックしたときに呼び出される`Game`コンポーネントの`handlePlay`関数に2つの変更を加えます。

- 「時間を遡り」、その時点から新しい手を打つ場合、その時点までの履歴のみを保持したいと思います。配列の`.concat()`メソッドを使用して、履歴のすべての項目の後に`nextSquares`を追加する代わりに、`history.slice(0, currentMove + 1)`のすべての項目の後に追加して、古い履歴のその部分だけを保持します。
- 手が打たれるたびに、`currentMove`を更新して最新の履歴エントリを指すようにする必要があります。

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares])
  setHistory(nextHistory)
  setCurrentMove(nextHistory.length - 1)
  setXIsNext(!xIsNext)
}
```

最後に、常に最後の手をレンダリングするのではなく、現在選択されている手をレンダリングするように`Game`コンポーネントを変更します:

```jsx {2-8}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const xIsNext = useGameStore((state) => state.xIsNext)
  const setXIsNext = useGameStore((state) => state.setXIsNext)
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares])
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
    setXIsNext(!xIsNext)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
    setXIsNext(nextMove % 2 === 0)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>
          {history.map((_, historyIndex) => {
            const description =
              historyIndex > 0
                ? `Go to move #${historyIndex}`
                : 'Go to game start'

            return (
              <li key={historyIndex}>
                <button onClick={() => jumpTo(historyIndex)}>
                  {description}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
```

### 最終的なクリーンアップ

コードをよく見ると、`currentMove`が偶数の場合に`xIsNext`が`true`になり、`currentMove`が奇数の場合に`false`になることがわかります。つまり、`currentMove`の値がわかれば、`xIsNext`が何であるべきかを常に判断できます。

これらを別々にstateに保存する理由はありません。冗長なstateは避けた方が良いです。なぜなら、バグを減らし、コードを理解しやすくできるからです。代わりに、`currentMove`に基づいて`xIsNext`を計算できます:

```jsx {2-5,13,17}
export default function Game() {
  const history = useGameStore((state) => state.history)
  const setHistory = useGameStore((state) => state.setHistory)
  const currentMove = useGameStore((state) => state.currentMove)
  const setCurrentMove = useGameStore((state) => state.setCurrentMove)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares])
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontFamily: 'monospace',
      }}
    >
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div style={{ marginLeft: '1rem' }}>
        <ol>
          {history.map((_, historyIndex) => {
            const description =
              historyIndex > 0
                ? `Go to move #${historyIndex}`
                : 'Go to game start'

            return (
              <li key={historyIndex}>
                <button onClick={() => jumpTo(historyIndex)}>
                  {description}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
```

もう`xIsNext` stateの宣言や`setXIsNext`への呼び出しは必要ありません。これで、コンポーネントのコーディング中にミスをしても、`xIsNext`が`currentMove`と同期しなくなる可能性はありません。

### まとめ

おめでとうございます! 三目並べゲームを作成しました:

- 三目並べをプレイでき、
- プレイヤーがゲームに勝ったとき、または引き分けのときを示し、
- ゲームの進行に応じてゲームの履歴を保存し、
- プレイヤーがゲームの履歴を確認し、ゲームボードの以前のバージョンを見ることができます。

素晴らしい仕事です! これで、ReactとZustandがどのように機能するかについて、まともな理解ができたと思います。
