# Immer

## 概要

ImmerはJotaiの拡張機能で、Reactのためのプリミティブで柔軟な状態管理を提供し、より可変的な構文でイミュータブルな状態更新に焦点を当てています。

## インストール

```bash
npm install immer jotai-immer
```

## 主な機能

### atomWithImmer

ドラフト状態の直接的な変更を可能にするImmerベースの書き込み関数を持つアトムを作成します。

```javascript
import { useAtom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'

const countAtom = atomWithImmer({ value: 0 })

const Counter = () => {
  const [count] = useAtom(countAtom)
  return <div>count: {count.value}</div>
}

const Controls = () => {
  const [, setCount] = useAtom(countAtom)

  const inc = () =>
    setCount((draft) => {
      ++draft.value
    })

  return <button onClick={inc}>+1</button>
}
```

### withImmer

既存のアトムをImmerスタイルの更新を使用するように変換します。

```javascript
import { useAtom, atom } from 'jotai'
import { withImmer } from 'jotai-immer'

const primitiveAtom = atom({ value: 0 })
const countAtom = withImmer(primitiveAtom)
```

### useImmerAtom

アトムの書き込み関数をImmerのような関数に置き換えるフックです。

```javascript
import { atom } from 'jotai'
import { useImmerAtom } from 'jotai-immer'

const primitiveAtom = atom({ value: 0 })

const Counter = () => {
  const [count] = useImmerAtom(primitiveAtom)
  return <div>count: {count.value}</div>
}
```

## 注意事項

- `withImmer`、`atomWithImmer`、`useImmerAtom`を同時に組み合わせることは避けてください
- `useImmerAtom`のセッター部分のみが必要な場合は`useSetImmerAtom`が利用可能です
