# state ロジックをリデューサに抽出する

多くのイベントハンドラに散在している複数の state 更新があるコンポーネントは、圧倒されてしまいます。こういった場合に、コンポーネントの外にある *reducer (リデューサ)* と呼ばれる単一の関数に、すべての state 更新ロジックを集約することができます。

## このページで学ぶこと

- reducer 関数とは何か
- `useState` から `useReducer` へリファクタリングする方法
- reducer をいつ使うべきか
- reducer を適切に書く方法

## reducer で state ロジックを集約する

コンポーネントが複雑になればなるほど、コンポーネントの state が更新されるさまざまな方法を一目で把握するのが難しくなります。例えば、以下の `TaskApp` コンポーネントは state として `tasks` の配列を保持し、タスクを追加、削除、編集するために 3 つの異なるイベントハンドラを使用しています。

```javascript
import { useState } from 'react';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

これらのイベントハンドラはそれぞれ、state を更新するために `setTasks` を呼び出しています。このコンポーネントが成長するにつれて、state ロジックの量も散在して増えていきます。複雑さを減らし、すべてのロジックをアクセスしやすい 1 つの場所に保持するために、その state ロジックをコンポーネントの外にある **reducer** と呼ばれる単一の関数に移動できます。

reducer は state を処理する別の方法です。`useState` から `useReducer` へは、以下の 3 つのステップで移行できます。

1. state の設定から action のディスパッチへ**移行する**。
2. reducer 関数を**作成する**。
3. コンポーネントから reducer を**使用する**。

### ステップ 1: state の設定から action のディスパッチへ移行する

現在、イベントハンドラは state を設定することで *何をするか* を指定しています。

```javascript
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

すべての state 設定ロジックを削除します。残るのは以下の 3 つのイベントハンドラです。

- ユーザがタスクを追加したときに `handleAddTask(text)` が呼び出される。
- ユーザがタスクを切り替えたときに `handleChangeTask(task)` が呼び出される。
- ユーザがタスクを削除したときに `handleDeleteTask(taskId)` が呼び出される。

reducer で state を管理することは、state を直接設定することとは若干異なります。React に「何をするか」を state で指定する代わりに、イベントハンドラから「action」をディスパッチすることで「ユーザが何をしたか」を指定します。(state の更新ロジックは他の場所にあります!) つまり、イベントハンドラを通じて「`tasks` を設定する」のではなく、「タスクを追加/変更/削除」という action をディスパッチします。これにより、ユーザの意図がより明確に表現されます。

```javascript
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

`dispatch` に渡すオブジェクトは「action」と呼ばれます。

```javascript
function handleDeleteTask(taskId) {
  dispatch(
    // "action" オブジェクト:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

これは通常の JavaScript オブジェクトです。何を入れるかはあなた次第ですが、一般的には *何が起こったか* に関する最小限の情報を含めるべきです。(`dispatch` 関数自体は後のステップで追加します。)

> **Note**
>
> action オブジェクトはどんな形でも構いません。
>
> 慣例として、何が起こったかを説明する文字列 `type` を与え、追加の情報は他のフィールドで渡すのが一般的です。`type` はコンポーネント固有のものなので、この例では `'added'` または `'added_task'` のいずれでも構いません。何が起こったかを説明する名前を選びましょう!
>
> ```javascript
> dispatch({
>   // コンポーネント固有
>   type: 'what_happened',
>   // 他のフィールドはここに
> });
> ```

### ステップ 2: reducer 関数を作成する

reducer 関数は、state ロジックを配置する場所です。これは 2 つの引数、現在の state と action オブジェクトを受け取り、次の state を返します。

```javascript
function yourReducer(state, action) {
  // React が設定する次の state を返す
}
```

React は reducer から返されたものを state に設定します。

この例で、イベントハンドラから state 設定ロジックを reducer 関数に移動するには:

1. 現在の state (`tasks`) を最初の引数として宣言します。
2. `action` オブジェクトを 2 番目の引数として宣言します。
3. reducer から *次* の state を返します(React が state に設定するもの)。

以下は、すべての state 設定ロジックを reducer 関数に移行したものです。

```javascript
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

reducer 関数は state (`tasks`) を引数として受け取るため、**コンポーネントの外で宣言できます**。これによりインデントレベルが減り、コードが読みやすくなります。

> **Note**
>
> 上記のコードは if/else 文を使用していますが、reducer 内では [switch 文](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch)を使用するのが慣例です。結果は同じですが、switch 文の方が一目で読みやすい場合があります。
>
> このドキュメントの残りの部分では、以下のように使用します。
>
> ```javascript
> function tasksReducer(tasks, action) {
>   switch (action.type) {
>     case 'added': {
>       return [
>         ...tasks,
>         {
>           id: action.id,
>           text: action.text,
>           done: false,
>         },
>       ];
>     }
>     case 'changed': {
>       return tasks.map((t) => {
>         if (t.id === action.task.id) {
>           return action.task;
>         } else {
>           return t;
>         }
>       });
>     }
>     case 'deleted': {
>       return tasks.filter((t) => t.id !== action.id);
>     }
>     default: {
>       throw Error('Unknown action: ' + action.type);
>     }
>   }
> }
> ```
>
> 各 `case` ブロックを `{` と `}` の波括弧で囲むことをお勧めします。これにより、異なる `case` 内で宣言された変数が互いに衝突しません。また、`case` は通常 `return` で終わるべきです。`return` を忘れると、コードは次の `case` に「フォールスルー」してしまい、ミスにつながる可能性があります!
>
> まだ switch 文に慣れていない場合は、if/else を使っても全く問題ありません。

> **DEEP DIVE: なぜ reducer と呼ばれるのか?**
>
> reducer はコンポーネント内のコード量を「削減」できますが、実際には配列に対して実行できる [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 操作にちなんで名付けられています。
>
> `reduce()` 操作では、配列を受け取って多くの値から 1 つの値を「累積」できます。
>
> ```javascript
> const arr = [1, 2, 3, 4, 5];
> const sum = arr.reduce((result, number) => result + number); // 1 + 2 + 3 + 4 + 5
> ```
>
> `reduce` に渡す関数は「reducer」として知られています。これは *これまでの結果* と *現在のアイテム* を受け取り、*次の結果* を返します。React の reducer も同じアイデアの例です。*これまでの state* と *action* を受け取り、*次の state* を返します。このように、action を時間の経過とともに state に累積します。
>
> `reduce()` メソッドに `initialState` と `actions` の配列を渡して、reducer 関数を使用して最終的な state を計算することもできます。

### ステップ 3: コンポーネントから reducer を使用する

最後に、`tasksReducer` をコンポーネントに接続する必要があります。React から `useReducer` フックをインポートします。

```javascript
import { useReducer } from 'react';
```

次に、`useState` を置き換えます。

```javascript
const [tasks, setTasks] = useState(initialTasks);
```

次のように `useReducer` を使用します。

```javascript
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` フックは `useState` に似ています。初期 state を渡す必要があり、state の値と state を設定する方法(この場合は dispatch 関数)を返します。しかし、少し異なります。

`useReducer` フックは 2 つの引数を取ります。

1. reducer 関数
2. 初期 state

そして以下を返します。

1. state の値
2. dispatch 関数(ユーザの action を reducer に「ディスパッチ」するため)

これで完全に接続されました! ここでは、reducer がコンポーネントファイルの最後に宣言されています。

```javascript
import { useReducer } from 'react';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

必要に応じて、reducer を別のファイルに移動することもできます。

このように関心事を分離することで、コンポーネントのロジックが読みやすくなります。イベントハンドラは action をディスパッチすることで *何が起こった* かを指定するだけで、reducer 関数がそれに応じて *state がどのように更新されるか* を決定します。

## `useState` と `useReducer` の比較

reducer には欠点がないわけではありません! 以下は、それらを比較するいくつかの方法です。

- **コードサイズ:** 一般的に、`useState` では初期段階で書くコードが少なくて済みます。`useReducer` では、reducer 関数 *と* ディスパッチ action の両方を書く必要があります。ただし、多くのイベントハンドラが同様の方法で state を変更する場合、`useReducer` はコードを削減するのに役立ちます。
- **可読性:** 状態の更新が単純な場合、`useState` は非常に読みやすいです。より複雑になると、コンポーネントのコードが肥大化し、スキャンが難しくなります。この場合、`useReducer` を使用すると、更新ロジックの *how* とイベントハンドラの *what happened* をきれいに分離できます。
- **デバッグ:** `useState` でバグがある場合、*どこで* state が誤って設定されたか、*なぜ* そうなったかを特定するのが難しい場合があります。`useReducer` を使用すると、reducer にコンソールログを追加して、すべての state 更新と *なぜ* それが発生したか(どの `action` が原因か)を確認できます。各 `action` が正しければ、間違いは reducer ロジック自体にあることがわかります。ただし、`useState` よりも多くのコードをステップスルーする必要があります。
- **テスト:** reducer は、コンポーネントに依存しない純粋な関数です。これは、独立してエクスポートしてテストできることを意味します。一般的には、より現実的な環境でコンポーネントをテストするのが最適ですが、複雑な state 更新ロジックの場合、reducer が特定の初期 state と action に対して特定の state を返すことをアサートすると便利です。
- **個人的な好み:** reducer が好きな人もいれば、そうでない人もいます。それは問題ありません。これは好みの問題です。`useState` と `useReducer` の間でいつでも変換できますし、それらは等価です!

一部のコンポーネントで不適切な state 更新によるバグが頻繁に発生し、そのコードにより多くの構造を導入したい場合は、reducer の使用をお勧めします。すべてに reducer を使用する必要はありません。自由にミックスアンドマッチしてください! 同じコンポーネント内で `useState` と `useReducer` を使用することもできます。

## reducer を適切に書く

reducer を書く際には、以下の 2 つのヒントを覚えておいてください。

- **reducer は純粋でなければなりません。** [state 更新関数](/learn/queueing-a-series-of-state-updates)と同様に、reducer はレンダリング中に実行されます! (action は次のレンダリングまでキューに入れられます。) これは、reducer は[純粋](/learn/keeping-components-pure)でなければならないことを意味します。同じ入力には常に同じ出力が得られます。リクエストを送信したり、タイムアウトをスケジュールしたり、副作用(コンポーネントの外部に影響を与える操作)を実行したりしてはいけません。[オブジェクト](/learn/updating-objects-in-state)と[配列](/learn/updating-arrays-in-state)を変更せずに更新する必要があります。
- **各 action は、複数のデータ変更がある場合でも、単一のユーザインタラクションを表します。** たとえば、ユーザが reducer によって管理される 5 つのフィールドを持つフォームで「リセット」を押した場合、5 つの個別の `set_field` action ではなく、1 つの `reset_form` action をディスパッチする方が理にかなっています。すべての action を reducer に記録すると、どのインタラクションや応答がどの順序で発生したかを再構築するのに十分明確なログが得られるはずです。これはデバッグに役立ちます!

## Immer で簡潔な reducer を書く

通常の state で[オブジェクト](/learn/updating-objects-in-state#write-concise-update-logic-with-immer)や[配列](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)を更新するのと同様に、Immer ライブラリを使用して reducer をより簡潔にすることができます。ここでは、[`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) を使用すると、`push` や `arr[i] =` 代入で state を変更できます。

```javascript
import { useImmerReducer } from 'use-immer';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

reducer は純粋である必要があるため、state を変更してはいけません。しかし、Immer はあなたが変更しても安全な特別な `draft` オブジェクトを提供します。内部的には、Immer は `draft` に加えた変更を含む state のコピーを作成します。これが、`useImmerReducer` によって管理される reducer が最初の引数を変更しても、state を返す必要がない理由です。

## まとめ

- `useState` から `useReducer` に変換するには:
  1. イベントハンドラから action をディスパッチする。
  2. 与えられた state と action に対して次の state を返す reducer 関数を書く。
  3. `useState` を `useReducer` に置き換える。
- reducer は少しコードを書く必要がありますが、デバッグとテストに役立ちます。
- reducer は純粋でなければなりません。
- 各 action は単一のユーザインタラクションを表します。
- ミューテーション形式で reducer を書きたい場合は Immer を使用します。
