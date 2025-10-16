---
title: create ⚛️
description: ストアの作成方法
nav: 26
---

`create`は、APIユーティリティがアタッチされたReact Hookを作成します。

```js
const useSomeStore = create(stateCreatorFn)
```

- [型](#types)
  - [シグネチャ](#create-signature)
- [リファレンス](#reference)
- [使用法](#usage)
  - [前の状態に基づいた状態の更新](#updating-state-based-on-previous-state)
  - [状態内のプリミティブの更新](#updating-primitives-in-state)
  - [状態内のオブジェクトの更新](#updating-objects-in-state)
  - [状態内の配列の更新](#updating-arrays-in-state)
  - [ストアアクションなしでの状態の更新](#updating-state-with-no-store-actions)
  - [状態更新の購読](#subscribing-to-state-updates)
- [トラブルシューティング](#troubleshooting)
  - [状態を更新したのに画面が更新されない](#ive-updated-the-state-but-the-screen-doesnt-update)

## 型 {#types}

### シグネチャ {#create-signature}

```ts
create<T>()(stateCreatorFn: StateCreator<T, [], []>): UseBoundStore<StoreApi<T>>
```

## リファレンス {#reference}

### `create(stateCreatorFn)`

#### パラメータ

- `stateCreatorFn`: `set`関数、`get`関数、`store`を引数として受け取る関数。
  通常、公開したいメソッドを含むオブジェクトを返します。

#### 戻り値

`create`は、APIユーティリティ、`setState`、`getState`、`getInitialState`、
`subscribe`がアタッチされたReact Hookを返します。セレクター関数を使用して現在の状態に基づくデータを返すことができます。
セレクター関数を唯一の引数として受け取ります。

## 使用法 {#usage}

### 前の状態に基づいた状態の更新 {#updating-state-based-on-previous-state}

前の状態に基づいて状態を更新するには、**更新関数**を使用する必要があります。詳細については
[こちら](https://react.dev/learn/queueing-a-series-of-state-updates)をご覧ください。

この例は、**アクション**内で**更新関数**をサポートする方法を示しています。

```tsx
import { create } from 'zustand'

type AgeStoreState = { age: number }

type AgeStoreActions = {
  setAge: (
    nextAge:
      | AgeStoreState['age']
      | ((currentAge: AgeStoreState['age']) => AgeStoreState['age']),
  ) => void
}

type AgeStore = AgeStoreState & AgeStoreActions

const useAgeStore = create<AgeStore>()((set) => ({
  age: 42,
  setAge: (nextAge) => {
    set((state) => ({
      age: typeof nextAge === 'function' ? nextAge(state.age) : nextAge,
    }))
  },
}))

export default function App() {
  const age = useAgeStore((state) => state.age)
  const setAge = useAgeStore((state) => state.setAge)

  function increment() {
    setAge((currentAge) => currentAge + 1)
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button
        onClick={() => {
          increment()
          increment()
          increment()
        }}
      >
        +3
      </button>
      <button
        onClick={() => {
          increment()
        }}
      >
        +1
      </button>
    </>
  )
}
```

### 状態内のプリミティブの更新 {#updating-primitives-in-state}

状態にはあらゆる種類のJavaScript値を保持できます。数値、文字列、ブール値などの
組み込みプリミティブ値を更新する場合、更新が正しく適用され、
予期しない動作を避けるために、新しい値を直接割り当てる必要があります。

> [!NOTE]
> デフォルトで、`set`関数は浅いマージを実行します。状態を新しいもので完全に置き換える必要がある場合は、
> `replace`パラメータを`true`に設定してください。

```tsx
import { create } from 'zustand'

type XStore = number

const useXStore = create<XStore>()(() => 0)

export default function MovingDot() {
  const x = useXStore()
  const setX = (nextX: number) => {
    useXStore.setState(nextX, true)
  }
  const position = { y: 0, x }

  return (
    <div
      onPointerMove={(e) => {
        setX(e.clientX)
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

### 状態内のオブジェクトの更新 {#updating-objects-in-state}

オブジェクトはJavaScriptでは**ミュータブル**ですが、状態に保存する場合は**イミュータブル**として扱う必要があります。
代わりに、オブジェクトを更新する場合は、新しいオブジェクトを作成し（または既存のオブジェクトのコピーを作成し）、
その後、新しいオブジェクトを使用するように状態を設定する必要があります。

デフォルトで、`set`関数は浅いマージを実行します。特定のプロパティのみを変更する必要があるほとんどの更新では、
デフォルトの浅いマージがより効率的であるため推奨されます。状態を新しいもので完全に置き換えるには、
`replace`パラメータを`true`に設定して使用しますが、状態内の既存のネストされたデータが破棄されるため注意してください。

```tsx
import { create } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const usePositionStore = create<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (nextPosition) => set({ position: nextPosition }),
}))

export default function MovingDot() {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  return (
    <div
      onPointerMove={(e) => {
        setPosition({
          x: e.clientX,
          y: e.clientY,
        })
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

### 状態内の配列の更新 {#updating-arrays-in-state}

配列はJavaScriptではミュータブルですが、状態に保存する場合はイミュータブルとして扱う必要があります。
オブジェクトと同様に、状態に保存されている配列を更新する場合は、新しい配列を作成し（または既存の配列のコピーを作成し）、
その後、新しい配列を使用するように状態を設定する必要があります。

デフォルトで、`set`関数は浅いマージを実行します。配列の値を更新するには、
更新が正しく適用され、予期しない動作を避けるために、新しい値を割り当てる必要があります。
状態を新しいもので完全に置き換えるには、`replace`パラメータを`true`に設定してください。

> [!IMPORTANT]
> イミュータブルな操作を優先する必要があります：`[...array]`、`concat(...)`、`filter(...)`、
> `slice(...)`、`map(...)`、`toSpliced(...)`、`toSorted(...)`、`toReversed(...)`。
> ミュータブルな操作は避けてください：`array[arrayIndex] = ...`、`push(...)`、`unshift(...)`、`pop(...)`、
> `shift(...)`、`splice(...)`、`reverse(...)`、`sort(...)`。

```tsx
import { create } from 'zustand'

type PositionStore = [number, number]

const usePositionStore = create<PositionStore>()(() => [0, 0])

export default function MovingDot() {
  const [x, y] = usePositionStore()
  const setPosition: typeof usePositionStore.setState = (nextPosition) => {
    usePositionStore.setState(nextPosition, true)
  }
  const position = { x, y }

  return (
    <div
      onPointerMove={(e) => {
        setPosition([e.clientX, e.clientY])
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}
```

### ストアアクションなしでの状態の更新 {#updating-state-with-no-store-actions}

ストア外のモジュールレベルでアクションを定義することには、いくつかの利点があります：
アクションを呼び出すためにフックが不要であり、コード分割が容易になります。

> [!NOTE]
> 推奨される方法は、アクションと状態をストア内に配置することです（アクションを状態と一緒に配置します）。

```tsx
import { create } from 'zustand'

const usePositionStore = create<{
  x: number
  y: number
}>()(() => ({ x: 0, y: 0 }))

const setPosition: typeof usePositionStore.setState = (nextPosition) => {
  usePositionStore.setState(nextPosition)
}

export default function MovingDot() {
  const position = usePositionStore()

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
        onMouseEnter={(event) => {
          const parent = event.currentTarget.parentElement
          const parentWidth = parent.clientWidth
          const parentHeight = parent.clientHeight

          setPosition({
            x: Math.ceil(Math.random() * parentWidth),
            y: Math.ceil(Math.random() * parentHeight),
          })
        }}
      />
    </div>
  )
}
```

### 状態更新の購読 {#subscribing-to-state-updates}

状態更新を購読することで、ストアの状態が更新されるたびに実行されるコールバックを登録します。
外部の状態管理に`subscribe`を使用できます。

```tsx
import { useEffect } from 'react'
import { create } from 'zustand'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const usePositionStore = create<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (nextPosition) => set({ position: nextPosition }),
}))

export default function MovingDot() {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)

  useEffect(() => {
    const unsubscribePositionStore = usePositionStore.subscribe(
      ({ position }) => {
        console.log('new position', { position })
      },
    )

    return () => {
      unsubscribePositionStore()
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
        onMouseEnter={(event) => {
          const parent = event.currentTarget.parentElement
          const parentWidth = parent.clientWidth
          const parentHeight = parent.clientHeight

          setPosition({
            x: Math.ceil(Math.random() * parentWidth),
            y: Math.ceil(Math.random() * parentHeight),
          })
        }}
      />
    </div>
  )
}
```

## トラブルシューティング {#troubleshooting}

### 状態を更新したのに画面が更新されない {#ive-updated-the-state-but-the-screen-doesnt-update}

前の例では、`position`オブジェクトは常に現在のカーソル位置から新しく作成されます。
しかし、多くの場合、作成している新しいオブジェクトの一部として既存のデータを含めたいことがあります。
たとえば、フォームの1つのフィールドのみを更新し、他のすべてのフィールドの以前の値を保持したい場合があります。

これらの入力フィールドは、`onChange`ハンドラが状態をミューテートするため機能しません：

```tsx
import { create } from 'zustand'

type PersonStoreState = {
  firstName: string
  lastName: string
  email: string
}

type PersonStoreActions = {
  setPerson: (nextPerson: Partial<PersonStoreState>) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const usePersonStore = create<PersonStore>()((set) => ({
  firstName: 'Barbara',
  lastName: 'Hepworth',
  email: 'bhepworth@sculpture.com',
  setPerson: (nextPerson) => set(nextPerson),
}))

export default function Form() {
  const person = usePersonStore((state) => state)
  const setPerson = usePersonStore((state) => state.setPerson)

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    person.firstName = e.target.value
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    person.lastName = e.target.value
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    person.email = e.target.value
  }

  return (
    <>
      <label style={{ display: 'block' }}>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  )
}
```

たとえば、この行は過去のレンダリングから状態をミューテートします：

```tsx
person.firstName = e.target.value
```

求めている動作を得るための信頼できる方法は、新しいオブジェクトを作成し、
`setPerson`に渡すことです。しかし、ここでは、フィールドの1つだけが変更されたため、
既存のデータもそこにコピーしたいと思います：

```ts
setPerson({ ...person, firstName: e.target.value }) // 入力からの新しい名前
```

> [!NOTE]
> `set`関数はデフォルトで浅いマージを実行するため、
> すべてのプロパティを個別にコピーする必要はありません。

これでフォームが機能します！

各入力フィールドに対して個別の状態変数を宣言しなかったことに注意してください。大きなフォームの場合、
すべてのデータをオブジェクトにまとめて保持することは非常に便利です—正しく更新する限り！

```tsx {27,31,35}
import { create } from 'zustand'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const usePersonStore = create<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (nextPerson) => set(nextPerson),
}))

export default function Form() {
  const person = usePersonStore((state) => state.person)
  const setPerson = usePersonStore((state) => state.setPerson)

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, firstName: e.target.value })
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, lastName: e.target.value })
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setPerson({ ...person, email: e.target.value })
  }

  return (
    <>
      <label style={{ display: 'block' }}>
        First name:
        <input value={person.firstName} onChange={handleFirstNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Last name:
        <input value={person.lastName} onChange={handleLastNameChange} />
      </label>
      <label style={{ display: 'block' }}>
        Email:
        <input value={person.email} onChange={handleEmailChange} />
      </label>
      <p>
        {person.firstName} {person.lastName} ({person.email})
      </p>
    </>
  )
}
```
