# Immerミドルウェア

Immerミドルウェアを使用すると、開発者はZustandでイミュータブルな状態をより便利に使用でき、イミュータブルなデータ構造の処理を簡素化できます。

## インストール

Immerを直接の依存関係としてインストールします：

```bash
npm install immer
```

## 使い方

### シンプルな状態の更新

```typescript
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type State = {
  count: number
}

type Actions = {
  increment: (qty: number) => void
  decrement: (qty: number) => void
}

export const useCountStore = create<State & Actions>()(
  immer((set) => ({
    count: 0,
    increment: (qty: number) =>
      set((state) => {
        state.count += qty
      }),
    decrement: (qty: number) =>
      set((state) => {
        state.count -= qty
      }),
  }))
)
```

### 複雑な状態の更新

```typescript
interface Todo {
  id: string
  title: string
  done: boolean
}

type State = {
  todos: Record<string, Todo>
}

type Actions = {
  toggleTodo: (todoId: string) => void
}

export const useTodoStore = create<State & Actions>()(
  immer((set) => ({
    todos: {
      '82471c5f-4207-4b1d-abcb-b98547e01a3e': {
        id: '82471c5f-4207-4b1d-abcb-b98547e01a3e',
        title: 'Learn Zustand',
        done: false,
      },
      '354ee16c-bfdd-44d3-afa9-e93679bda367': {
        id: '354ee16c-bfdd-44d3-afa9-e93679bda367',
        title: 'Learn Jotai',
        done: false,
      },
      '771c85c5-46ea-4a11-8fed-36cc2c7be344': {
        id: '771c85c5-46ea-4a11-8fed-36cc2c7be344',
        title: 'Learn Valtio',
        done: false,
      },
      '363a4bac-083f-47f7-a0a2-aeeee153a99c': {
        id: '363a4bac-083f-47f7-a0a2-aeeee153a99c',
        title: 'Learn Signals',
        done: false,
      },
    },
    toggleTodo: (todoId: string) =>
      set((state) => {
        state.todos[todoId].done = !state.todos[todoId].done
      }),
  }))
)
```

## 注意事項

### サブスクリプションが呼び出されない場合

Immerを使用する場合は、[Immerのルール](https://immerjs.github.io/immer/pitfalls)に従うことを確認してください。例えば、クラスオブジェクトの場合、`[immerable] = true`を追加する必要があります。正しく行わないと、Immerがプロキシを使用せずにオブジェクトをミューテートする可能性があり、Zustandが状態の変更を検出してサブスクリプションを呼び出すことができなくなる場合があります。

### 利点

Immerを使用すると、以下のような利点があります：

- **より読みやすいコード**: ミューテーションのような構文でイミュータブルな更新を記述できます
- **ネストされた更新が簡単**: 深くネストされた状態を簡単に更新できます
- **エラーの削減**: スプレッド構文を使用する際の一般的なミスを回避できます

### TypeScriptサポート

Immerミドルウェアは完全なTypeScriptサポートを提供し、型の安全性を維持しながら状態の更新を行うことができます。
