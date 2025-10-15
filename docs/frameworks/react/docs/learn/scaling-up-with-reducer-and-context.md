# リデューサとコンテクストでスケールアップ

reducer を使えば、コンポーネントの state 更新ロジックを集約することができます。コンテクストを使えば、他のコンポーネントに深く情報を渡すことができます。そしてリデューサとコンテクストを組み合わせることで、複雑な画面の state 管理ができるようになります。

## このページで学ぶこと

- reducer とコンテクストを組み合わせる方法
- state とディスパッチ関数を props を介して渡すことを避ける方法
- コンテクストと state ロジックを別のファイルに保持する方法

## reducer とコンテクストの組み合わせ

この [reducer の入門](/learn/extracting-state-logic-into-a-reducer)の例では、state は reducer によって管理されています。reducer 関数にはすべての state 更新ロジックが含まれており、このファイルの最後に宣言されています。

```javascript
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Day off in Kyoto</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher's Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

reducer は、イベントハンドラを短く簡潔に保つのに役立ちます。しかし、アプリが成長するにつれて、別の困難に直面する可能性があります。**現在、`tasks` state と `dispatch` 関数は最上位の `TaskApp` コンポーネントでのみ利用可能です。** 他のコンポーネントにタスクのリストを読み取らせたり、それを変更させたりするには、現在の state と、それを変更するイベントハンドラを props として明示的に[渡す](/learn/passing-props-to-a-component)必要があります。

例えば、`TaskApp` はタスクのリストとイベントハンドラを `TaskList` に渡します。

```javascript
<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
```

そして、`TaskList` はイベントハンドラを `Task` に渡します。

```javascript
<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
```

このような小さな例ではうまく機能しますが、途中に数十または数百のコンポーネントがある場合、すべての state とすべての関数を渡すのは非常に面倒です!

これが、props を介して渡す代わりに、`tasks` state と `dispatch` 関数の両方を[コンテクストに入れる](/learn/passing-data-deeply-with-context)ことが望ましい理由です。**これにより、`TaskApp` 以下のツリー内の任意のコンポーネントが、「prop drilling」を繰り返すことなく、タスクを読み取り、action をディスパッチできます。**

reducer とコンテクストを組み合わせる方法は次のとおりです。

1. コンテクストを**作成する**。
2. state とディスパッチをコンテクストに**入れる**。
3. ツリーのどこからでもコンテクストを**使用する**。

### ステップ 1: コンテクストを作成する

`useReducer` フックは現在の `tasks` とそれを更新できる `dispatch` 関数を返します。

```javascript
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

ツリーを介して渡すために、2 つの別々のコンテクストを[作成](/learn/passing-data-deeply-with-context#step-1-create-the-context)します。

- `TasksContext` は現在のタスクリストを提供します。
- `TasksDispatchContext` はコンポーネントが action をディスパッチできる関数を提供します。

後でインポートできるように、別のファイルからエクスポートします。

```javascript
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

ここでは、両方のコンテクストにデフォルト値として `null` を渡しています。実際の値は `TaskApp` コンポーネントによって提供されます。

### ステップ 2: state とディスパッチをコンテクストに入れる

今、`TaskApp` コンポーネントで両方のコンテクストをインポートできます。`useReducer()` によって返された `tasks` と `dispatch` を取得し、それらを下のツリー全体に[提供](/learn/passing-data-deeply-with-context#step-3-provide-the-context)します。

```javascript
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        ...
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

今のところ、props とコンテクストの両方で情報を渡しています。

```javascript
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <h1>Day off in Kyoto</h1>
        <AddTask
          onAddTask={handleAddTask}
        />
        <TaskList
          tasks={tasks}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
        />
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Philosopher's Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

次のステップでは、props の受け渡しを削除します。

### ステップ 3: ツリーのどこからでもコンテクストを使用する

今、タスクのリストや、イベントハンドラをツリーの下に渡す必要はありません。

```javascript
<TasksContext.Provider value={tasks}>
  <TasksDispatchContext.Provider value={dispatch}>
    <h1>Day off in Kyoto</h1>
    <AddTask />
    <TaskList />
  </TasksDispatchContext.Provider>
</TasksContext.Provider>
```

代わりに、タスクリストを必要とする任意のコンポーネントが、`TaskContext` から読み取ることができます。

```javascript
export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
```

タスクリストを更新するために、任意のコンポーネントがコンテクストから `dispatch` 関数を読み取り、それを呼び出すことができます。

```javascript
export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  // ...
  return (
    // ...
    <button onClick={() => {
      setText('');
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>Add</button>
    // ...
```

**`TaskApp` コンポーネントは、イベントハンドラを下に渡しませんし、`TaskList` も `Task` コンポーネントにイベントハンドラを渡しません。** 各コンポーネントは、必要なコンテクストを読み取ります。

```javascript
// App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <h1>Day off in Kyoto</h1>
        <AddTask />
        <TaskList />
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher's Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```javascript
// TasksContext.js
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

```javascript
// AddTask.js
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```javascript
// TaskList.js
import { useState, useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskList() {
  const tasks = useContext(TasksContext);
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useContext(TasksDispatchContext);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}
```

**state はまだ最上位の `TaskApp` コンポーネントで `useReducer` によって管理されています。** しかし、その `tasks` と `dispatch` は、これらのコンテクストをインポートして使用することで、ツリーのすべてのコンポーネントで利用可能になりました。

## すべての繋ぎ込みを単一ファイルに移動する

これは必須ではありませんが、reducer とコンテクストの両方を単一のファイルに移動することで、コンポーネントをさらに整理できます。現在、`TasksContext.js` には 2 つのコンテクスト宣言のみが含まれています。

```javascript
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

このファイルはこれから混雑します! reducer を同じファイルに移動します。次に、新しい `TasksProvider` コンポーネントを同じファイルに宣言します。このコンポーネントはすべての部品を結び付けます。

1. reducer で state を管理します。
2. 両方のコンテクストを下のコンポーネントに提供します。
3. [子を prop として受け取る](/learn/passing-props-to-a-component#passing-jsx-as-children)ため、JSX を渡すことができます。

```javascript
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

**これにより、`TaskApp` コンポーネントからすべての複雑さと配線が削除されます。**

```javascript
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

また、`TasksContext.js` からコンテクストを*使用する*ための関数もエクスポートできます。

```javascript
export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```

コンポーネントがコンテクストを読み取る必要がある場合、これらの関数を介して読み取ることができます。

```javascript
const tasks = useTasks();
const dispatch = useTasksDispatch();
```

これは動作を変更するものではありませんが、後でこれらのコンテクストをさらに分割したり、これらの関数にロジックを追加したりできます。**今、すべてのコンテクストと reducer の配線は `TasksContext.js` にあります。これにより、コンポーネントがクリーンで整理され、データをどこから取得するかではなく、何を表示するかに焦点を当てることができます。**

```javascript
// App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```javascript
// TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Philosopher's Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```javascript
// AddTask.js
import { useState } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```javascript
// TaskList.js
import { useState } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={e => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
        Delete
      </button>
    </label>
  );
}
```

`TasksProvider` を、画面の一部を管理するコンポーネントとして、`useTasks` と `useTasksDispatch` を、それを読み取る方法として考えることができます。

> **Note**
>
> `useTasks` や `useTasksDispatch` のような関数は *[カスタムフック (Custom Hooks)](/learn/reusing-logic-with-custom-hooks)* と呼ばれます。関数名が `use` で始まる場合、それはカスタムフックと見なされます。これにより、他のフック(例: `useContext`)を内部で使用できます。

アプリが成長するにつれて、このような多くのコンテクスト-reducer ペアができる可能性があります。これは、アプリをスケールアップし、ツリーの深いところでデータにアクセスしたい場合に、あまり労力をかけずに [state を持ち上げる](/learn/sharing-state-between-components)ための強力な方法です。

## まとめ

- reducer をコンテクストと組み合わせて、任意のコンポーネントが上の state を読み取り、更新できるようにできます。
- state とディスパッチ関数を下のコンポーネントに提供するには:
  1. 2 つのコンテクスト(state 用と dispatch 関数用)を作成します。
  2. reducer を使用するコンポーネントから両方のコンテクストを提供します。
  3. それらを読み取る必要があるコンポーネントからどちらかのコンテクストを使用します。
- すべての繋ぎ込みを 1 つのファイルに移動することで、コンポーネントをさらに整理できます。
  - コンテクストを提供する `TasksProvider` のようなコンポーネントをエクスポートできます。
  - `useTasks` や `useTasksDispatch` のようなカスタムフックをエクスポートして、それを読み取ることもできます。
- アプリ内にこのようなコンテクスト-reducer ペアを多数持つことができます。
