---
title: stateの更新
nav: 2
---

## フラットな更新

Zustandでstateを更新するのは簡単です! 提供された`set`関数を新しいstateで呼び出すだけで、ストア内の既存のstateと浅くマージされます。**注意** ネストされたstateについては次のセクションを参照してください。

```tsx
import { create } from 'zustand'

type State = {
  firstName: string
  lastName: string
}

type Action = {
  updateFirstName: (firstName: State['firstName']) => void
  updateLastName: (lastName: State['lastName']) => void
}

// stateと（オプションで）アクションの両方を含むストアを作成します
const usePersonStore = create<State & Action>((set) => ({
  firstName: '',
  lastName: '',
  updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
  updateLastName: (lastName) => set(() => ({ lastName: lastName })),
}))

// アプリでの使用
function App() {
  // 必要なstateとアクションを「選択」します。この場合、firstName値と
  // updateFirstNameアクション
  const firstName = usePersonStore((state) => state.firstName)
  const updateFirstName = usePersonStore((state) => state.updateFirstName)

  return (
    <main>
      <label>
        First name
        <input
          // "firstName" stateを更新
          onChange={(e) => updateFirstName(e.currentTarget.value)}
          value={firstName}
        />
      </label>

      <p>
        Hello, <strong>{firstName}!</strong>
      </p>
    </main>
  )
}
```

## 深くネストされたオブジェクト

次のような深いstateオブジェクトがある場合:

```ts
type State = {
  deep: {
    nested: {
      obj: { count: number }
    }
  }
}
```

ネストされたstateを更新するには、プロセスが不変的に完了することを保証するためにある程度の努力が必要です。

### 通常のアプローチ

ReactやReduxと同様に、通常のアプローチはstateオブジェクトの各レベルをコピーすることです。これは、スプレッド演算子`...`を使用して行われ、新しいstate値と手動でマージします。次のように:

```ts
  normalInc: () =>
    set((state) => ({
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
      }
    })),
```

これは非常に長いです! あなたの人生を楽にするいくつかの代替案を探りましょう。

### Immerを使用

多くの人が[Immer](https://github.com/immerjs/immer)を使用してネストされた値を更新しています。Immerは、React、Redux、そしてもちろんZustandで、ネストされたstateを更新する必要があるときにいつでも使用できます!

Immerを使用して、深くネストされたオブジェクトのstate更新を短縮できます。例を見てみましょう:

```ts
  immerInc: () =>
    set(produce((state: State) => { ++state.deep.nested.obj.count })),
```

なんという削減でしょう! [こちらにリストされている注意点](../integrations/immer-middleware.md)に注意してください。

### optics-tsを使用

[optics-ts](https://github.com/akheron/optics-ts/)を使用する別のオプションがあります:

```ts
  opticsInc: () =>
    set(O.modify(O.optic<State>().path("deep.nested.obj.count"))((c) => c + 1)),
```

Immerとは異なり、optics-tsはプロキシや変更構文を使用しません。

### Ramdaを使用

[Ramda](https://ramdajs.com/)を使用することもできます:

```ts
  ramdaInc: () =>
    set(R.modifyPath(["deep", "nested", "obj", "count"], (c) => c + 1)),
```

ramdaとoptics-tsの両方が型でも動作します。

### CodeSandboxデモ

https://codesandbox.io/s/zustand-normal-immer-optics-ramda-updating-ynn3o?file=/src/App.tsx
