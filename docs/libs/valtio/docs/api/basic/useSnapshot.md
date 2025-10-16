---
title: 'useSnapshot'
section: 'API'
subSection: 'Basic'
description: '変更をキャッチするローカルスナップショットを作成します。'
---

# `useSnapshot`

変更をキャッチするローカル `snapshot` を作成します。

通常、Valtioのスナップショット（<a href="/docs/api/advanced/snapshot">`snapshot()`</a> で作成）は、プロキシまたはその子プロキシへの _すべての_ 変更で再作成されます。

しかし、`useSnapshot` はValtioスナップショットをアクセス追跡プロキシでラップします。これにより、コンポーネントのレンダリングが最適化されます。つまり、コンポーネント（またはその子コンポーネント）が特別にアクセスしたキーが変更された場合にのみ再レンダリングされ、プロキシへのすべての変更で再レンダリングされるわけではありません。

## 使用方法

### レンダリング時はスナップショットから読み取り、コールバックではプロキシを使用

スナップショットは読み取り専用であり、データの一貫したビューからJSXをレンダリングします。

ミューテーション、および変更を行うコールバック内の読み取りも、プロキシ経由で行う必要があります。これにより、コールバックが最新の値を読み書きできるようになります。

```jsx
function Counter() {
  const snap = useSnapshot(state)
  return (
    <div>
      {snap.count}
      <button
        onClick={() => {
          // コールバック内でもstateプロキシから読み取ります
          if (state.count < 10) {
            ++state.count
          }
        }}
      >
        +1
      </button>
    </div>
  )
}
```

### 親/子コンポーネント

親コンポーネントが `useSnapshot` を使用している場合、子コンポーネントにスナップショットを渡すことができ、スナップショットが変更されると親と子が再レンダリングされます。

例:

```jsx
const state = proxy({
  books: [
    { id: 1, title: 'b1' },
    { id: 2, title: 'b2' },
  ],
})

function AuthorView() {
  const snap = useSnapshot(state)
  return (
    <div>
      {snap.books.map((book) => (
        <Book key={book.id} book={book} />
      ))}
    </div>
  )
}

function BookView({ book }) {
  // book はスナップショットです
  return <div>{book.title}</div>
}
```

book 2のタイトルが変更されると、新しい `snap` が作成され、`AuthorView` と `BookView` コンポーネントが再レンダリングされます。

`BookView` が `React.memo` でラップされている場合、1番目の `BookView` は再レンダリングされません。これは、1番目の `Book` スナップショットが同じインスタンスであるためです。2番目の `Book` のみが変更されたためです（ルートの `Author` スナップショットも更新されます。これは `books` のリストが変更されたためです）。

### ミューテーションを行う子コンポーネント

上記のアプローチは `BookView` が読み取り専用の場合に機能します。子コンポーネントがミューテーションを行う必要がある場合は、プロキシを渡す必要があります:

```jsx
function AuthorView() {
  const snap = useSnapshot(state)
  return (
    <div>
      {snap.books.map((book, i) => (
        <Book key={book.id} book={state.books[i]} />
      ))}
    </div>
  )
}

function BookView({ book }) {
  // book はプロキシなので、再スナップショット化してミューテートできます
  const snap = useSnapshot(book)
  return <div onClick={() => book.updateTitle()}>{snap.title}</div>
}
```

または、子コンポーネントで `useSnapshot` を呼び出したくない場合は、スナップショットとプロキシの両方を一緒に渡すこともできます:

```jsx
function AuthorView() {
  const snap = useSnapshot(state)
  return (
    <div>
      {snap.books.map((book, i) => (
        <Book key={book.id} bookProxy={state.books[i]} bookSnapshot={book} />
      ))}
    </div>
  )
}
```

これら2つのアプローチの間にパフォーマンスの違いはないはずです。

### 必要なものだけを読み取る

プロキシ内のすべてのオブジェクトもプロキシになります（<a href="/docs/advanced/ref">`ref()`</a> を使用しない場合）。したがって、それらを使用してローカルスナップショットを作成することもできます。

```jsx
function ProfileName() {
  const snap = useSnapshot(state.profile)
  return <div>{snap.name}</div>
}
```

## 注意点

子プロキシを他のもので置き換えると、`snapshot` が壊れるので注意してください。これにより、プロキシの参照が割り当てたものに置き換えられ、プロキシのトラップが削除されます。以下に例を示します。

```js
console.log(state)
{
  profile: {
    name: 'valtio'
  }
}
childState = state.profile
console.log(childState)
{
  name: 'valtio'
}
state.profile.name = 'react'
console.log(childState)
{
  name: 'react'
}
state.profile = { name: 'new name' }
console.log(childState)
{
  name: 'react'
}
console.log(state)
{
  profile: {
    name: 'new name'
  }
}
```

`useSnapshot()` は子プロキシの元の参照に依存しているため、新しいものに置き換えると、古いプロキシにサブスクライブしているコンポーネントは、まだ古いプロキシにサブスクライブしているため、新しい更新を受け取りません。

この場合、以下のアプローチのいずれかを使用することをお勧めします。どちらの例でも、レンダリングが最適化されているため、再レンダリングを心配する必要はありません。

```jsx
const snap = useSnapshot(state)

return <div>{snap.profile.name}</div>
```

```jsx
const { profile } = useSnapshot(state)

return <div>{profile.name}</div>
```

## 開発モードのデバッグ値

開発モードでは、`useSnapshot` はReactの `useDebugValue` を使用して、レンダリング中にアクセスされたフィールドのリストを出力します。つまり、追跡プロキシが変更されたときに再レンダリングをトリガーする特定のフィールドです。

<br />

<blockquote className="important">
!! &nbsp; デバッグ値の使用には2つの注意点があります

1. `useSnapshot` が返された _後_ にアクセスを記録するためにプロキシを使用する方法のため、`useDebugValue` にリストされるフィールドは技術的には _前の_ レンダリングのものです。
2. オブジェクトのgetterとクラスのgetterの呼び出しは `useDebugValue` の出力に含まれませんが、心配しないでください。実際には内部で正しく追跡されており、変更されたときに正しく再レンダリングをトリガーします。

</blockquote>

<br />

<br />

## Codesandbox デモ

https://codesandbox.io/s/ping-pong-with-valtio-wb25s?file=/src/App.js
