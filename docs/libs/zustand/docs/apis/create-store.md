---
title: createStore
description: バニラストアの作成方法
nav: 24
---

`createStore`は、APIユーティリティを公開するバニラストアを作成します。

```js
const someStore = createStore(stateCreatorFn)
```

- [型](#types)
  - [シグネチャ](#signature)
- [リファレンス](#reference)
- [使用法](#usage)
  - [前の状態に基づいた状態の更新](#updating-state-based-on-previous-state)
  - [状態内のプリミティブの更新](#updating-primitives-in-state)
  - [状態内のオブジェクトの更新](#updating-objects-in-state)
  - [状態内の配列の更新](#updating-arrays-in-state)
  - [状態更新の購読](#subscribing-to-state-updates)
- [トラブルシューティング](#troubleshooting)
  - [状態を更新したのに画面が更新されない](#ive-updated-the-state-but-the-screen-doesnt-update)

## 型 {#types}

### シグネチャ {#signature}

```ts
createStore<T>()(stateCreatorFn: StateCreator<T, [], []>): StoreApi<T>
```

## リファレンス {#reference}

### `createStore(stateCreatorFn)`

#### パラメータ

- `stateCreatorFn`: `set`関数、`get`関数、`store`を引数として受け取る関数。
  通常、公開したいメソッドを含むオブジェクトを返します。

#### 戻り値

`createStore`は、APIユーティリティ、`setState`、`getState`、
`getInitialState`、`subscribe`を公開するバニラストアを返します。

## 使用法 {#usage}

### 前の状態に基づいた状態の更新 {#updating-state-based-on-previous-state}

この例は、**アクション**内で**更新関数**をサポートする方法を示しています。

```tsx
import { createStore } from 'zustand/vanilla'

type AgeStoreState = { age: number }

type AgeStoreActions = {
  setAge: (
    nextAge:
      | AgeStoreState['age']
      | ((currentAge: AgeStoreState['age']) => AgeStoreState['age']),
  ) => void
}

type AgeStore = AgeStoreState & AgeStoreActions

const ageStore = createStore<AgeStore>()((set) => ({
  age: 42,
  setAge: (nextAge) =>
    set((state) => ({
      age: typeof nextAge === 'function' ? nextAge(state.age) : nextAge,
    })),
}))

function increment() {
  ageStore.getState().setAge((currentAge) => currentAge + 1)
}

const $yourAgeHeading = document.getElementById(
  'your-age',
) as HTMLHeadingElement
const $incrementBy3Button = document.getElementById(
  'increment-by-3',
) as HTMLButtonElement
const $incrementBy1Button = document.getElementById(
  'increment-by-1',
) as HTMLButtonElement

$incrementBy3Button.addEventListener('click', () => {
  increment()
  increment()
  increment()
})

$incrementBy1Button.addEventListener('click', () => {
  increment()
})

const render: Parameters<typeof ageStore.subscribe>[0] = (state) => {
  $yourAgeHeading.innerHTML = `Your age: ${state.age}`
}

render(ageStore.getInitialState(), ageStore.getInitialState())

ageStore.subscribe(render)
```

`html`コードは次のとおりです：

```html
<h1 id="your-age"></h1>
<button id="increment-by-3" type="button">+3</button>
<button id="increment-by-1" type="button">+1</button>
```

### 状態内のプリミティブの更新 {#updating-primitives-in-state}

状態にはあらゆる種類のJavaScript値を保持できます。数値、文字列、ブール値などの
組み込みプリミティブ値を更新する場合、更新が正しく適用され、
予期しない動作を避けるために、新しい値を直接割り当てる必要があります。

> [!NOTE]
> デフォルトで、`set`関数は浅いマージを実行します。状態を新しいもので完全に置き換える必要がある場合は、
> `replace`パラメータを`true`に設定してください。

```ts
import { createStore } from 'zustand/vanilla'

type XStore = number

const xStore = createStore<XStore>()(() => 0)

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  xStore.setState(event.clientX, true)
})

const render: Parameters<typeof xStore.subscribe>[0] = (x) => {
  $dot.style.transform = `translate(${x}px, 0)`
}

render(xStore.getInitialState(), xStore.getInitialState())

xStore.subscribe(render)
```

`html`コードは次のとおりです：

```html
<div
  id="dot-container"
  style="position: relative; width: 100vw; height: 100vh;"
>
  <div
    id="dot"
    style="position: absolute; background-color: red; border-radius: 50%; left: -10px; top: -10px; width: 20px; height: 20px;"
  ></div>
</div>
```

### 状態内のオブジェクトの更新 {#updating-objects-in-state}

オブジェクトはJavaScriptでは**ミュータブル**ですが、状態に保存する場合は**イミュータブル**として扱う必要があります。
代わりに、オブジェクトを更新する場合は、新しいオブジェクトを作成し（または既存のオブジェクトのコピーを作成し）、
その後、新しいオブジェクトを使用するように状態を設定する必要があります。

デフォルトで、`set`関数は浅いマージを実行します。特定のプロパティのみを変更する必要があるほとんどの更新では、
デフォルトの浅いマージがより効率的であるため推奨されます。状態を新しいもので完全に置き換えるには、
`replace`パラメータを`true`に設定して使用しますが、状態内の既存のネストされたデータが破棄されるため注意してください。

```ts
import { createStore } from 'zustand/vanilla'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}))

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.getState().setPosition({
    x: event.clientX,
    y: event.clientY,
  })
})

const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getInitialState(), positionStore.getInitialState())

positionStore.subscribe(render)
```

`html`コードは次のとおりです：

```html
<div
  id="dot-container"
  style="position: relative; width: 100vw; height: 100vh;"
>
  <div
    id="dot"
    style="position: absolute; background-color: red; border-radius: 50%; left: -10px; top: -10px; width: 20px; height: 20px;"
  ></div>
</div>
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

```ts
import { createStore } from 'zustand/vanilla'

type PositionStore = [number, number]

const positionStore = createStore<PositionStore>()(() => [0, 0])

const $dotContainer = document.getElementById('dot-container') as HTMLDivElement
const $dot = document.getElementById('dot') as HTMLDivElement

$dotContainer.addEventListener('pointermove', (event) => {
  positionStore.setState([event.clientX, event.clientY], true)
})

const render: Parameters<typeof positionStore.subscribe>[0] = ([x, y]) => {
  $dot.style.transform = `translate(${x}px, ${y}px)`
}

render(positionStore.getInitialState(), positionStore.getInitialState())

positionStore.subscribe(render)
```

`html`コードは次のとおりです：

```html
<div
  id="dot-container"
  style="position: relative; width: 100vw; height: 100vh;"
>
  <div
    id="dot"
    style="position: absolute; background-color: red; border-radius: 50%; left: -10px; top: -10px; width: 20px; height: 20px;"
  ></div>
</div>
```

### 状態更新の購読 {#subscribing-to-state-updates}

状態更新を購読することで、ストアの状態が更新されるたびに実行されるコールバックを登録します。
外部の状態管理に`subscribe`を使用できます。

```ts
import { createStore } from 'zustand/vanilla'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const positionStore = createStore<PositionStore>()((set) => ({
  position: { x: 0, y: 0 },
  setPosition: (position) => set({ position }),
}))

const $dot = document.getElementById('dot') as HTMLDivElement

$dot.addEventListener('mouseenter', (event) => {
  const parent = event.currentTarget.parentElement
  const parentWidth = parent.clientWidth
  const parentHeight = parent.clientHeight

  positionStore.getState().setPosition({
    x: Math.ceil(Math.random() * parentWidth),
    y: Math.ceil(Math.random() * parentHeight),
  })
})

const render: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  $dot.style.transform = `translate(${state.position.x}px, ${state.position.y}px)`
}

render(positionStore.getInitialState(), positionStore.getInitialState())

positionStore.subscribe(render)

const logger: Parameters<typeof positionStore.subscribe>[0] = (state) => {
  console.log('new position', { position: state.position })
}

positionStore.subscribe(logger)
```

`html`コードは次のとおりです：

```html
<div
  id="dot-container"
  style="position: relative; width: 100vw; height: 100vh;"
>
  <div
    id="dot"
    style="position: absolute; background-color: red; border-radius: 50%; left: -10px; top: -10px; width: 20px; height: 20px;"
  ></div>
</div>
```

## トラブルシューティング {#troubleshooting}

### 状態を更新したのに画面が更新されない {#ive-updated-the-state-but-the-screen-doesnt-update}

前の例では、`position`オブジェクトは常に現在のカーソル位置から新しく作成されます。
しかし、多くの場合、作成している新しいオブジェクトの一部として既存のデータを含めたいことがあります。
たとえば、フォームの1つのフィールドのみを更新し、他のすべてのフィールドの以前の値を保持したい場合があります。

これらの入力フィールドは、`oninput`ハンドラが状態をミューテートするため機能しません：

```ts
import { createStore } from 'zustand/vanilla'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const personStore = createStore<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (person) => set({ person }),
}))

const $firstNameInput = document.getElementById(
  'first-name',
) as HTMLInputElement
const $lastNameInput = document.getElementById('last-name') as HTMLInputElement
const $emailInput = document.getElementById('email') as HTMLInputElement
const $result = document.getElementById('result') as HTMLDivElement

function handleFirstNameChange(event: Event) {
  personStore.getState().person.firstName = (event.target as any).value
}

function handleLastNameChange(event: Event) {
  personStore.getState().person.lastName = (event.target as any).value
}

function handleEmailChange(event: Event) {
  personStore.getState().person.email = (event.target as any).value
}

$firstNameInput.addEventListener('input', handleFirstNameChange)
$lastNameInput.addEventListener('input', handleLastNameChange)
$emailInput.addEventListener('input', handleEmailChange)

const render: Parameters<typeof personStore.subscribe>[0] = (state) => {
  $firstNameInput.value = state.person.firstName
  $lastNameInput.value = state.person.lastName
  $emailInput.value = state.person.email

  $result.innerHTML = `${state.person.firstName} ${state.person.lastName} (${state.person.email})`
}

render(personStore.getInitialState(), personStore.getInitialState())

personStore.subscribe(render)
```

`html`コードは次のとおりです：

```html
<label style="display: block">
  First name:
  <input id="first-name" />
</label>
<label style="display: block">
  Last name:
  <input id="last-name" />
</label>
<label style="display: block">
  Email:
  <input id="email" />
</label>
<p id="result"></p>
```

たとえば、この行は過去のレンダリングから状態をミューテートします：

```ts
personStore.getState().firstName = (e.target as any).value
```

求めている動作を得るための信頼できる方法は、新しいオブジェクトを作成し、
`setPerson`に渡すことです。しかし、ここでは、フィールドの1つだけが変更されたため、
既存のデータもそこにコピーしたいと思います：

```ts
personStore.getState().setPerson({
  firstName: e.target.value, // 入力からの新しい名前
})
```

> [!NOTE]
> `set`関数はデフォルトで浅いマージを実行するため、
> すべてのプロパティを個別にコピーする必要はありません。

これでフォームが機能します！

各入力フィールドに対して個別の状態変数を宣言しなかったことに注意してください。大きなフォームの場合、
すべてのデータをオブジェクトにまとめて保持することは非常に便利です—正しく更新する限り！

```ts {32-34,38-40,44-46}
import { createStore } from 'zustand/vanilla'

type PersonStoreState = {
  person: { firstName: string; lastName: string; email: string }
}

type PersonStoreActions = {
  setPerson: (nextPerson: PersonStoreState['person']) => void
}

type PersonStore = PersonStoreState & PersonStoreActions

const personStore = createStore<PersonStore>()((set) => ({
  person: {
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  },
  setPerson: (person) => set({ person }),
}))

const $firstNameInput = document.getElementById(
  'first-name',
) as HTMLInputElement
const $lastNameInput = document.getElementById('last-name') as HTMLInputElement
const $emailInput = document.getElementById('email') as HTMLInputElement
const $result = document.getElementById('result') as HTMLDivElement

function handleFirstNameChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    firstName: (event.target as any).value,
  })
}

function handleLastNameChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    lastName: (event.target as any).value,
  })
}

function handleEmailChange(event: Event) {
  personStore.getState().setPerson({
    ...personStore.getState().person,
    email: (event.target as any).value,
  })
}

$firstNameInput.addEventListener('input', handleFirstNameChange)
$lastNameInput.addEventListener('input', handleLastNameChange)
$emailInput.addEventListener('input', handleEmailChange)

const render: Parameters<typeof personStore.subscribe>[0] = (state) => {
  $firstNameInput.value = state.person.firstName
  $lastNameInput.value = state.person.lastName
  $emailInput.value = state.person.email

  $result.innerHTML = `${state.person.firstName} ${state.person.lastName} (${state.person.email})`
}

render(personStore.getInitialState(), personStore.getInitialState())

personStore.subscribe(render)
```
