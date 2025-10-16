# tRPC

## 概要

JotaiはtRPCとの統合のための拡張機能を提供し、Reactアプリケーションのためのプリミティブで柔軟な状態管理を実現します。

## インストール

```bash
npm install jotai-trpc @trpc/client @trpc/server
```

## 基本的な使い方

```typescript
import { createTRPCJotai } from 'jotai-trpc'

const trpc = createTRPCJotai<MyRouter>({
  links: [
    httpLink({
      url: myUrl,
    }),
  ],
})

const idAtom = atom('foo')
const queryAtom = trpc.bar.baz.atomWithQuery((get) => get(idAtom))
```

## 主な機能

### atomWithQuery

Vanilla Clientのqueryメソッドを使用してクエリプロシージャを持つアトムを作成します。

```typescript
const NAMES = [
  'bulbasaur', 'ivysaur', 'venusaur',
  'charmander', 'charmeleon', 'charizard',
  'squirtle', 'wartortle', 'blastoise',
]

const nameAtom = atom(NAMES[0])
const pokemonAtom = trpc.pokemon.byId.atomWithQuery((get) => get(nameAtom))

const Pokemon = () => {
  const [data, refresh] = useAtom(pokemonAtom)
  return (
    <div>
      <div>ID: {data.id}</div>
      <div>Height: {data.height}</div>
      <div>Weight: {data.weight}</div>
      <button onClick={refresh}>Refresh</button>
    </div>
  )
}
```

### 予定されている機能

#### atomWithMutation

ミューテーションプロシージャを持つアトムを作成します（例は後日追加予定）。

#### atomWithSubscription

サブスクリプションプロシージャを持つアトムを作成します（例は後日追加予定）。
