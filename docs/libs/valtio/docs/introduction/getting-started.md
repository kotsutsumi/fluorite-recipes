---
title: 'Getting Started'
section: 'Introduction'
description: 'Valtioの基本を学ぶ - シンプルなTodoアプリを作りながら、プロキシステート管理の使い方を理解する'
---

# Getting Started

Valtioは、最小限で柔軟、そして少し魔法のようなプロキシステート管理ライブラリです。ReactとバニラJavaScriptで動作し、きめ細かいサブスクリプションとリアクティビティを提供します。React 18とSuspenseに対応しています。

このガイドでは、シンプルなTodoアプリを作りながらValtioの基本を学びます。

## インストール

まず、Valtioをプロジェクトにインストールします:

```bash
npm install valtio
```

## 基本概念

### 1. プロキシステートの作成

Valtioでは `proxy()` 関数を使って状態を作成します。これにより、通常のJavaScriptオブジェクトがリアクティブなプロキシになります。

```typescript
import { proxy } from 'valtio'

type Status = 'pending' | 'completed'
type Filter = Status | 'all'

type Todo = {
  description: string
  status: Status
  id: number
}

export const store = proxy<{ filter: Filter; todos: Todo[] }>({
  filter: 'all',
  todos: [],
})
```

### 2. スナップショットを使ったデータアクセス

Reactコンポーネントで状態にアクセスするには、`useSnapshot()` フックを使用します。これにより、状態の不変なスナップショットが取得でき、アクセスしたプロパティが更新された時のみコンポーネントが再レンダリングされます。

```tsx
import { useSnapshot } from 'valtio'

function Todos() {
  const snap = useSnapshot(store)

  return (
    <div>
      <p>Filter: {snap.filter}</p>
      <ul>
        {snap.todos.map(todo => (
          <li key={todo.id}>{todo.description}</li>
        ))}
      </ul>
    </div>
  )
}
```

**重要**: このコンポーネントは `todos` または `filter` プロパティが更新された時のみ再レンダリングされます。他のプロパティの変更では影響を受けません。

## Todoアプリの実装

### ステップ1: アクションの定義

状態を変更するための関数（アクション）を定義します。Valtioでは、通常のJavaScriptオブジェクトを変更するように直接プロキシを変更できます:

```typescript
// Todoを追加
export const addTodo = (description: string) => {
  store.todos.push({
    description,
    status: 'pending',
    id: Date.now(),
  })
}

// Todoを削除
export const removeTodo = (id: number) => {
  const index = store.todos.findIndex((todo) => todo.id === id)
  if (index !== -1) {
    store.todos.splice(index, 1)
  }
}

// Todoのステータスを切り替え
export const toggleTodo = (id: number) => {
  const todo = store.todos.find((todo) => todo.id === id)
  if (todo) {
    todo.status = todo.status === 'pending' ? 'completed' : 'pending'
  }
}

// フィルターを設定
export const setFilter = (filter: Filter) => {
  store.filter = filter
}
```

### ステップ2: UIコンポーネントの作成

```tsx
import { useSnapshot } from 'valtio'
import { store, addTodo, removeTodo, toggleTodo, setFilter } from './store'

function TodoApp() {
  const snap = useSnapshot(store)
  const [input, setInput] = React.useState('')

  // フィルタリングされたTodoリスト
  const filteredTodos = snap.todos.filter(todo => {
    if (snap.filter === 'all') return true
    return todo.status === snap.filter
  })

  const handleAddTodo = () => {
    if (input.trim()) {
      addTodo(input)
      setInput('')
    }
  }

  return (
    <div>
      <h1>Valtio Todo App</h1>

      {/* Todo入力フォーム */}
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="What needs to be done?"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>

      {/* フィルター */}
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      {/* Todoリスト */}
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.status === 'completed'}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.status === 'completed' ? 'line-through' : 'none'
              }}
            >
              {todo.description}
            </span>
            <button onClick={() => removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## 高度な使用法

### コンポーネント外での状態変更

Valtioの強力な機能の1つは、Reactコンポーネントの外でも状態を変更できることです。これにより、再帰的な関数やタイマーなど、複雑な状態管理シナリオが可能になります:

```typescript
// カウントダウン機能付きTodo
export const addTodoWithCountdown = (description: string, seconds: number) => {
  const id = Date.now()

  store.todos.push({
    description: `${description} (${seconds}s)`,
    status: 'pending',
    id,
  })

  // 再帰的なカウントダウン
  const countdown = (remaining: number) => {
    if (remaining === 0) {
      toggleTodo(id)
      return
    }

    setTimeout(() => {
      const todo = store.todos.find((t) => t.id === id)
      if (todo) {
        todo.description = `${description} (${remaining - 1}s)`
        countdown(remaining - 1)
      }
    }, 1000)
  }

  countdown(seconds)
}
```

### モジュールレベルでの状態サブスクライブ

Reactコンポーネントの外で状態の変更を監視することもできます:

```typescript
import { subscribe } from 'valtio'

// ローカルストレージに永続化
subscribe(store, () => {
  localStorage.setItem('todos', JSON.stringify(store.todos))
})

// 状態の変更をログ出力
subscribe(store, () => {
  console.log('State updated:', store)
})
```

## Valtioの利点

### 1. パフォーマンスを気にせず変更可能

通常のJavaScriptオブジェクトのように状態を直接変更できます。Valtioが自動的に最適化します:

```typescript
// これでOK！
store.todos.push(newTodo)
store.todos[0].status = 'completed'
store.filter = 'pending'
```

### 2. useSnapshotが自動最適化

`useSnapshot` は変更を不変なスナップショットに変換し、レンダリングを最適化します:

```tsx
function TodoCount() {
  const snap = useSnapshot(store)
  // store.todos.length が変更された時のみ再レンダリング
  return <p>Total: {snap.todos.length}</p>
}
```

### 3. TypeScript完全サポート

完全な型推論と型安全性:

```typescript
const snap = useSnapshot(store)
snap.todos // Todo[]型
snap.filter // Filter型
```

## デモ

実際に動作するデモをCodeSandboxで試せます:

- [基本的なTodoリスト](https://codesandbox.io/s/valtio-to-do-list-forked-6w9h3z)
- [カウントダウン機能付きTodoリスト](https://codesandbox.io/s/valtio-countdown-to-do-list-xkgmri)

## まとめ

Valtioを使うことで、以下のことが簡単になります:

1. **状態の作成**: `proxy()` で通常のオブジェクトをリアクティブに
2. **状態の使用**: `useSnapshot()` でコンポーネントに接続
3. **状態の変更**: 通常のJavaScriptのように直接変更
4. **パフォーマンス**: 自動的に最適化された再レンダリング

## 次のステップ

- [Basic API](../../api/basic/proxy.md) - `proxy` と `useSnapshot` の詳細
- [Advanced API](../../api/advanced/subscribe.md) - `subscribe` や他の高度な機能
- [Guides](../../guides/async.md) - 非同期状態や高度なパターン

Valtioでシンプルで強力な状態管理を始めましょう！
