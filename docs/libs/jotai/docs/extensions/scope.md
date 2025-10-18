---
title: Scope
description: アトムのスコープ管理とアイソレーション
nav: 4.03
---

# Scope

## Jotaiの使用を拡張するライブラリ

### `jotai-scope`

親ストアのアトムへのアクセスを維持しながら、Reactツリーの異なる部分でアトムを「状態を共有せずに」再利用できるライブラリです。

#### インストール

```bash
npm install jotai-scope
```

#### 例

```jsx
import { atom, useAtom } from 'jotai'
import { ScopeProvider } from 'jotai-scope'

const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  // Counterの実装
}

function App() {
  return (
    <div>
      <Counter />
      <ScopeProvider atoms={[countAtom]}>
        <Counter />
      </ScopeProvider>
    </div>
  )
}
```

### `createIsolation`

Jotaiを使用するライブラリを開発する際に、コンテキストの競合を避けるためのユーティリティです。

```jsx
import { createIsolation } from 'jotai-scope'

const { Provider, useStore, useAtom } = createIsolation()

function Library() {
  return (
    <Provider>
      <LibraryComponent />
    </Provider>
  )
}
```

### `bunshi` (旧 `jotai-molecules`)

コンポーネントツリー内のpropsや状態に依存できるアトムを作成するのに役立つライブラリです。

#### インストール

```bash
npm install bunshi
```

#### 例

```jsx
import { atom, useAtom } from 'jotai'
import { molecule, useMolecule, createScope, ScopeProvider } from 'bunshi/react'

const InitialCountScope = createScope({ initialCount: 0 })

const countMolecule = molecule((getMol, getScope) => {
  const { initialCount } = getScope(InitialCountScope)
  return atom(initialCount)
})

function Counter() {
  const countAtom = useMolecule(countMolecule)
  const [count, setCount] = useAtom(countAtom)
  // Counterの実装
}
```
